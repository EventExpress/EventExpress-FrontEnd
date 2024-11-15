import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Calendar from 'react-calendar';
import { format, isAfter, startOfDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import 'react-calendar/dist/Calendar.css';
import NavBar from '../../components/NavBar';
import '../../app/globals.css';
import Footer from '../../components/Footer';
import PaymentModal from '../../components/PaymentModal';

export default function CreateReserva() {
    const [dataInicio, setDataInicio] = useState(null);
    const [dataFim, setDataFim] = useState(null);
    const [horaInicio, setHoraInicio] = useState('00:00');
    const [horaFim, setHoraFim] = useState('00:30');
    const [servicos, setServicos] = useState([]);
    const [usuarioId, setUsuarioId] = useState('');
    const [servicosIds, setServicosIds] = useState([]);
    const [datasIndisponiveis, setDatasIndisponiveis] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [servicosData, setServicosData] = useState({});
    const [token, setToken] = useState(null);
    const [anuncio, setAnuncio] = useState(null);
    const [locador, setLocador] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const [formapagamento, setFormaPagamento] = useState('select');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { anuncioId } = router.query;

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const handleSelectPayment = (paymentMethod) => {
        setFormaPagamento(paymentMethod);
    };

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedToken = localStorage.getItem('token');
            const storedUserId = localStorage.getItem('userId');
            if (storedToken) {
                setToken(storedToken);
                setUsuarioId(storedUserId);
            } else {
                router.push('/login');
            }
        }
    }, [router]);

    useEffect(() => {
        if (anuncioId && token) {
            const fetchAnuncio = async () => {
                try {
                    const response = await axios.get('http://localhost:8000/api/anuncios', {
                        headers: { Authorization: `Bearer ${token}` },
                    });
            
                    const anuncios = response.data.anuncios || [];            
                    const anuncio = anuncios.find((anuncio) => anuncio.id === parseInt(anuncioId));
            
                    if (anuncio) {
                        setAnuncio(anuncio); 
                    } else {
                        setErrorMessage('Anúncio não encontrado.');
                    }
                    setLoading(false);
                } catch (error) {
                    console.error('Erro ao buscar o anúncio:', error);
                    setErrorMessage('Erro ao buscar informações do anúncio.');
                    setLoading(false);
                }
            };
            
            fetchAnuncio();
        }
    }, [anuncioId, token]);
    
    useEffect(() => {
        if (anuncio && anuncio.user_id && token) {
            const fetchLocador = async () => {
                try {
                    const response = await axios.get(`http://localhost:8000/api/user/${anuncio.user_id}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    setLocador(response.data);
                } catch (error) {
                    console.error('Erro ao buscar dados do locador:', error);
                }
            };
            fetchLocador();
        }
    }, [anuncio, token]);

    useEffect(() => {
        if (!token || !anuncioId) return;

        const fetchServicos = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/servicos', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setServicos(Array.isArray(response.data.servicos) ? response.data.servicos : []);
            } catch (error) {
                console.error('Erro ao buscar serviços:', error);
                setErrorMessage('Erro ao buscar serviços. Tente novamente mais tarde.');
            }
        };

        const fetchDatasIndisponiveis = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/verifica-agenda/${anuncioId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setDatasIndisponiveis(response.data.datasIndisponiveis || []);
            } catch (error) {
                console.error('Erro ao buscar datas indisponíveis:', error);
                setErrorMessage('Erro ao buscar datas indisponíveis. Tente novamente mais tarde.');
            }
        };

        fetchServicos();
        fetchDatasIndisponiveis();
    }, [anuncioId, token]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!anuncioId) {
            setErrorMessage('Anúncio não encontrado. Tente novamente.');
            return;
        }

        if (!dataInicio || !dataFim || !horaInicio || !horaFim) {
            setErrorMessage('Por favor, preencha todos os campos de data e hora.');
            return;
        }

        if (!formapagamento || formapagamento === 'select') {
            alert('Por favor, selecione uma forma de pagamento.');
            return;
        }

        const reservaData = {
            anuncio_id: anuncioId,
            usuario_id: usuarioId,
            data_inicio: format(dataInicio, 'yyyy-MM-dd') + ' ' + horaInicio,
            data_fim: format(dataFim, 'yyyy-MM-dd') + ' ' + horaFim,
            servicos_ids: servicosIds,
            formapagamento: formapagamento,
            servicos_data: Object.keys(servicosData).map((key) => ({
                id: key,
                data_inicio: servicosData[key].dataInicio ? format(servicosData[key].dataInicio, 'yyyy-MM-dd') + ' ' + servicosData[key].horaInicio : null,
                data_fim: servicosData[key].dataFim ? format(servicosData[key].dataFim, 'yyyy-MM-dd') + ' ' + servicosData[key].horaFim : null,
            })),
        };
        console.log("Dados da reserva:", reservaData);
        console.log("Serviços selecionados:", servicosIds);

        try {
            const response = await axios.post(`http://localhost:8000/api/agendados/${anuncioId}`, reservaData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            console.log("Reserva criada com sucesso:", response.data);
            router.push('/paginicial');
        } catch (error) {
            if (error.response) {
                console.error("Erro ao criar reserva:", error.response.data);
                setErrorMessage(error.response.data.message || 'Erro ao criar reserva. Tente novamente mais tarde.');
            } else {
                console.error("Erro de rede:", error);
                setErrorMessage('Erro ao criar reserva. Tente novamente mais tarde.');
            }
        }
    };

    const handleServicosChange = (id) => {
        setServicosIds((prev) => {
            const isChecked = prev.includes(id);
            if (isChecked) {
                const { [id]: _, ...rest } = servicosData;
                setServicosData(rest);
            } else {
                setServicosData((prev) => ({ ...prev, [id]: { dataInicio: null, dataFim: null, horaInicio: '00:00', horaFim: '00:30' } }));
            }
            return isChecked ? prev.filter((servicoId) => servicoId !== id) : [...prev, id];
        });
    };

    const handleDataInicioChange = (id, date) => {
        setServicosData((prev) => ({
            ...prev,
            [id]: { ...prev[id], dataInicio: date },
        }));
    };

    const handleDataFimChange = (id, date) => {
        setServicosData((prev) => ({
            ...prev,
            [id]: { ...prev[id], dataFim: date },
        }));
    };

    const handleHoraInicioChange = (e) => {
        const selectedHoraInicio = e.target.value;
        setHoraInicio(selectedHoraInicio);

        if (dataInicio && dataFim && format(dataInicio, 'yyyy-MM-dd') === format(dataFim, 'yyyy-MM-dd') && selectedHoraInicio > horaFim) {
            setHoraFim(selectedHoraInicio);
        }
    };

    const handleHoraFimChange = (e) => {
        const selectedHoraFim = e.target.value;
        setHoraFim(selectedHoraFim);
    };

    const handleDataInicioGeneralChange = (date) => {
        setDataInicio(date);
        if (dataFim && format(date, 'yyyy-MM-dd') > format(dataFim, 'yyyy-MM-dd')) {
            setDataFim(date);
        }
    };

    const handleDataFimGeneralChange = (date) => {
        setDataFim(date);
        if (format(dataInicio, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd') && horaInicio > horaFim) {
            setHoraFim(horaInicio);
        }
    };

    const isDataIndisponivel = (date) => {
        const formattedDate = format(date, 'yyyy-MM-dd');
        return (
            datasIndisponiveis.includes(formattedDate) ||
            !isAfter(date, startOfDay(new Date()))
        );
    };

    const generateTimeOptions = (start = '00:00') => {
        const times = [];
        let [startHour, startMinutes] = start.split(':').map(Number);

        for (let hour = startHour; hour <= 23; hour++) {
            for (let minutes = 0; minutes < 60; minutes += 30) {
                const time = `${String(hour).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
                if (hour > startHour || (hour === startHour && minutes >= startMinutes)) {
                    times.push(time);
                }
            }
        }
        return times;
    };

    const timeOptionsInicio = generateTimeOptions('00:00');
    const timeOptionsFim = (dataInicio && dataFim && format(dataInicio, 'yyyy-MM-dd') === format(dataFim, 'yyyy-MM-dd'))
        ? generateTimeOptions(horaInicio)
        : generateTimeOptions();

        return (
            <div>
                <NavBar />
                <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white shadow-sm sm:rounded-lg">
                      <div className="p-6 bg-white border-b border-gray-200 rounded-lg">
                        <div className="flex justify-between items-center">
                          <h3 className="text-2xl font-semibold mb-2"> {anuncio ? anuncio.titulo : 'Título não disponível'}</h3>
                          {locador ? (
                            <h3 className="mb-2">local disponibilizado por {locador.user?.nome || 'Locador não disponível'}</h3>
                          ) : (
                            <p className="text-right text-sm text-gray-600">Locador não encontrado</p>
                          )}
                        </div>                  
                        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
                        {loading ? (
                          <p>Carregando informações do anúncio...</p>
                        ) : anuncio ? (
                          <div className="mt-4 flex items-start border-2 border-orange-500 bg-orange-100 p-6 rounded-lg shadow-md mb-6">
                            {anuncio.imagens && anuncio.imagens.length > 0 && (
                              <img
                                src={anuncio.imagens[0].image_path}
                                alt={anuncio.titulo}
                                className="w-2/5 h-auto rounded-lg mb-4"
                              />
                            )}
                            <div className="ml-6 flex-1">
                              <p className="mb-52">{anuncio.descricao}</p>
                              <p><strong>Capacidade:</strong> {anuncio.capacidade} Pessoas</p>
                              <p><strong>R$:</strong>{anuncio.valor}</p>
                            </div>
                          </div>
                        ) : (
                          <p>Não foi possível carregar os detalhes do anúncio.</p>
                        )}
                                <form onSubmit={handleSubmit}>
                                <div className="flex space-x-4 mb-4">
                                  <div className="flex-1 bg-gray-200 p-4 rounded-lg shadow-lg border-2 border-orange-500 bg-orange-100">
                                    <label className="block text-sm font-medium text-black-500 mb-2">Data de Início do Anúncio:</label>
                                    <div className="flex items-center space-x-4">
                                      <div className="relative flex-1">
                                        <Calendar onChange={handleDataInicioGeneralChange}
                                          value={dataInicio}
                                          tileDisabled={({ date }) => isDataIndisponivel(date)}
                                          locale={ptBR} className="custom-calendar"
                                        />
                                      </div>
                                      <div className="w-1/3">
                                        <label className="block text-sm font-medium text-black-500 mb-2">Hora de Início:</label>
                                        <div className="relative">
                                          <select value={horaInicio} onChange={handleHoraInicioChange}
                                            className="w-full p-3 border rounded-lg bg-white shadow-sm text-lg focus:ring-2 focus:ring-orange-500 border-1 border-orange-500">
                                            {timeOptionsInicio.map((option) => ( <option key={option} value={option}>
                                                {option}
                                              </option>
                                            ))}
                                          </select>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex-1 bg-gray-200 p-4 rounded-lg shadow-lg border-2 border-orange-500 bg-orange-100">
                                    <label className="block text-sm font-medium text-black-500 mb-2">Data de Fim do Anúncio:</label>
                                    <div className="flex items-center space-x-4">
                                      <div className="relative flex-1">
                                        <Calendar onChange={handleDataFimGeneralChange}
                                          value={dataFim}
                                          tileDisabled={({ date }) => isDataIndisponivel(date)}
                                          locale={ptBR} className="custom-calendar"/>
                                      </div>
                                      <div className="w-1/3 ">
                                        <label className="block text-sm font-medium text-black-500 mb-2">Hora de Fim:</label>
                                        <div className="relative">
                                          <select value={horaFim} onChange={(e) =>
                                            setHoraFim(e.target.value)} className="w-full p-3 border rounded-lg bg-white shadow-sm text-lg focus:ring-2 focus:ring-orange-500 border-1 border-orange-500">
                                            {timeOptionsFim.map((option) => (
                                              <option key={option} value={option}>
                                                {option}
                                              </option>
                                            ))}
                                          </select>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-orange-500">Escolher Serviços:</label>
                                    {servicos.length > 0 ? ( servicos.map((servico) => (
                                            <div className="flex items-start mt-2" key={servico.id}>
                                                <div className="flex items-center">
                                                    <input type="checkbox" id={`servicos-${servico.id}`}
                                                        value={servico.id}
                                                        onChange={() => handleServicosChange(servico.id)}
                                                        className="form-checkbox h-4 w-4 text-orange-600"/>
                                                    <label htmlFor={`servicos-${servico.id}`} className="ml-2 block text-sm text-gray-900">{servico.titulo} - R$ {servico.valor}</label>
                                                </div>
                                                {servicosIds.includes(servico.id) && (
                                                    <div className="ml-4 flex items-center">
                                                        <div className="flex flex-col mr-4">
                                                            <label className="block text-sm font-medium text-orange-500">Data de Início:</label>
                                                            <Calendar onChange={(date) => handleDataInicioChange(servico.id, date)}
                                                                value={servicosData[servico.id]?.dataInicio}
                                                                tileDisabled={({ date }) => isDataIndisponivel(date)}
                                                                locale={ptBR} className="custom-calendar"/>
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <label className="block text-sm font-medium text-orange-500">Data de Fim:</label>
                                                            <Calendar onChange={(date) => handleDataFimChange(servico.id, date)} 
                                                                value={servicosData[servico.id]?.dataFim}
                                                                tileDisabled={({ date }) => isDataIndisponivel(date)}
                                                                locale={ptBR} className="custom-calendar"/>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-gray-500">Nenhum serviço disponível.</p>
                                    )}
                                </div>
                                <div className="flex items-center mb-4">
                                    <button type="button" className="p-2 bg-blue-500 text-white rounded-md"onClick={openModal}>Selecionar Forma de Pagamento</button>
                                    {formapagamento !== 'select' && (
                                        <p className="ml-4 text-green-500">{formapagamento}</p>
                                    )}
                                </div>
                                <button type="submit" className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Confirmar Reserva</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <PaymentModal isOpen={isModalOpen} onClose={closeModal} onSelectPayment={handleSelectPayment}/>
            <Footer />
        </div>
    );
}
