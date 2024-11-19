import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Calendar from 'react-calendar';
import { ptBR } from 'date-fns/locale';
import 'react-calendar/dist/Calendar.css';
import NavBar from '../../components/NavBar';
import '../../app/globals.css';
import Footer from '../../components/Footer';
import PaymentModal from '../../components/PaymentModal';
import { format } from 'date-fns';
import { isAfter } from 'date-fns';
import { startOfDay } from 'date-fns';
import { StarIcon } from '@heroicons/react/24/solid';

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
    const [diasSelecionados, setDiasSelecionados] = useState([]);
    const [servicoAberto, setServicoAberto] = useState(null);
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);
    const [isReservaSuccessModalOpen, setIsReservaSuccessModalOpen] = useState(false);
    const openReservaSuccessModal = () => setIsReservaSuccessModalOpen(true);
    const closeReservaSuccessModal = () => setIsReservaSuccessModalOpen(false);
    const [categorias, setCategorias] = useState({});

    useEffect(() => {
  const fetchCategoria = async (categoriaId) => {
    try {
      const response = await axios.get(`http://localhost:8000/api/categoria/${categoriaId}`);
      if (response.data) {
        setCategorias(prevCategorias => ({
          ...prevCategorias,
          [categoriaId]: response.data.nome,  // Armazenando o nome da categoria com o id como chave
        }));
      }
    } catch (error) {
      console.error('Erro ao buscar categoria:', error);
    }
  };

  // Buscar a categoria para todos os serviços
  servicos.forEach(servico => {
    if (servico.categoria_id) {
      fetchCategoria(servico.categoria_id);
    }
  });
}, [servicos]);

    const onClose = () => {
        setIsModalOpen(false);
    };

    const calcularDias = (inicio, fim) => {
        const dias = [];
        let currentDate = new Date(inicio);
        const endDate = new Date(fim);

        if (format(currentDate, 'yyyy-MM-dd') === format(endDate, 'yyyy-MM-dd')) {
            dias.push(currentDate);
        } else {
            while (currentDate <= endDate) {
                dias.push(new Date(currentDate));
                currentDate.setDate(currentDate.getDate() + 1);
            }
        }
        return dias;
    };

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
                        // Busca as avaliações do anúncio
                        const avaliacaoResponse = await axios.get(`http://localhost:8000/api/anuncios/${anuncio.id}/avaliacoes`, {
                            headers: { Authorization: `Bearer ${token}` },
                        });
    
                        const mediaAvaliacoes = avaliacaoResponse.data.media_avaliacoes || 0; // Pegando a média das avaliações, por exemplo
    
                        setAnuncio({
                            ...anuncio,
                            media_avaliacoes: mediaAvaliacoes, // Adicionando a média de avaliações ao anúncio
                        }); 
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
        const fetchServicos = async () => {
          try {
            const response = await axios.get(`http://localhost:8000/api/servicos/cidade/${anuncioId}`, {
              headers: { Authorization: `Bearer ${token}` }
            });
            if (Array.isArray(response.data)) {
              setServicos(response.data);
            } else {
              setServicos([]);
            }
          } catch (error) {
            console.error('Erro ao buscar serviços:', error);
            setErrorMessage('Erro ao buscar serviços. Tente novamente mais tarde.');
          }
        };
    
        if (anuncioId && token) {
          fetchServicos();
        }
      }, [anuncioId, token]);
      

    const calcularValorTotal = () => {
        if (!anuncio || !dataInicio || !dataFim) return 0;      
        const diasReserva = calcularDias(dataInicio, dataFim).length;
        let valorTotal = anuncio.valor * diasReserva;    
        servicos.forEach((servico) => {
            if (servicosIds.includes(servico.id)) {
                const diasServico = calcularDias(servicosData[servico.id]?.dataInicio, servicosData[servico.id]?.dataFim).length;
                valorTotal += parseFloat(servico.valor) * diasServico; 
            }
        });
        
        return valorTotal;
    };

    const valorTotal = calcularValorTotal();   

    useEffect(() => {
        if (dataInicio && dataFim) {
            const dias = calcularDias(dataInicio, dataFim);
            setDiasSelecionados(dias);
        }
    }, [dataInicio, dataFim]);

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

        try {
            const response = await axios.post(`http://localhost:8000/api/agendados/${anuncioId}`, reservaData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            openReservaSuccessModal();
            setTimeout(() => {
                router.push('/agendados/visualizar');
            }, 3000);
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
        setServicoAberto((prevServico) => (prevServico === id ? null : id));
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
        const times = []; let [startHour, startMinutes] = start.split(':').map(Number);
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

    const ReservaSuccessModal = ({ isOpen, onClose }) => {
        if (!isOpen) return null;
    }
    const CreateAgendamento = ({ onClose }) => {
    }

    const renderStars = (media) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
          stars.push(
            <StarIcon
              key={i}
              className={`h-5 w-5 ${i <= media ? 'text-yellow-500' : 'text-gray-300'}`}
            />
          );
        }
        return stars;
      };

      return (
        <div>
          <NavBar />
                <div className="py-12">
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                        <div className="bg-white shadow-sm sm:rounded-lg">
                            <div className="p-6 bg-white border-b border-gray-200 rounded-lg">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-2xl font-semibold mb-2">
                                    {anuncio ? anuncio.titulo : 'Título não disponível'}</h3>
                                    {locador ? (
                                <h3 className="mb-2">local disponibilizado por {locador.user?.nome || 'Locador não disponível'}
                                    <div className="flex items-center space-x-2">
                                        {renderStars(anuncio.media_avaliacoes)}
                                        <label title="Notas do anúncio" className="text-sm text-gray-500 cursor-pointer">Avaliações</label>
                                    </div>
                                    </h3>
                                ) : (
                                <p className="text-right text-sm text-gray-600">Locador não encontrado</p>
                                )}
                                </div>
                            {errorMessage && <p className="text-red-500">{errorMessage}</p>}
                            {loading ? (
                                <p>Carregando informações do anúncio...</p>
                            ) : anuncio ? (
                                <div className="mt-4 flex items-start border-2 border-orange-500 bg-orange-50 p-6 rounded-lg shadow-md mb-6">
                                    {anuncio.imagens && anuncio.imagens.length > 0 && (
                                    <img src={anuncio.imagens[0].image_path} alt={anuncio.titulo} className="w-2/5 h-auto rounded-lg mb-4"/>
                                )}
                                    <div className="ml-6 flex-1">
                                        <p className="mb-40">{anuncio.descricao}</p>
                                        <p><strong>Capacidade:</strong> {anuncio.capacidade} Pessoas</p>
                                        <p><strong>R$:</strong> {anuncio.valor}</p>
                                        {anuncio.endereco && (
                                            <div className="mt-2 text-gray-600">
                                                <p>{anuncio.endereco.cidade ? `Cidade: ${anuncio.endereco.cidade}` : 'Cidade não disponível'}</p>
                                                <p>{anuncio.endereco.bairro ? `Bairro: ${anuncio.endereco.bairro}` : 'Bairro não disponível'}</p>
                                                <p>{anuncio.endereco.cep ? `CEP: ${anuncio.endereco.cep}` : 'CEP não disponível'}</p>
                                                <p>{anuncio.endereco.numero ? `Número: ${anuncio.endereco.numero}` : 'Número não disponível'}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                ) : (
                                    <p>Não foi possível carregar os detalhes do anúncio.</p>
                                )}
                                    <form onSubmit={handleSubmit}>
                                        <div className="flex space-x-4 mb-4">
                                            <div className="flex-1 bg-gray-200 p-4 rounded-lg shadow-lg border-2 border-orange-500 bg-orange-50">
                                                <label className="block text-sm font-medium text-black-500 mb-2">Data de Início do Anúncio:</label>
                                                    <div className="flex items-center space-x-4">
                                                        <div className="relative flex-1">
                                                            <Calendar onChange={handleDataInicioGeneralChange}value={dataInicio}
                                                            tileDisabled={({ date }) => isDataIndisponivel(date)}
                                                            locale={ptBR} className="custom-calendar"/>
                                                        </div>
                                                    <div className="w-1/3">
                                                        <label className="block text-sm font-medium text-black-500 mb-2">Hora de Início:</label>
                                                            <div className="relative">
                                                                <select value={horaInicio} onChange={handleHoraInicioChange}
                                                                className="w-full p-3 border rounded-lg bg-white shadow-sm text-lg focus:ring-2 focus:ring-orange-500 border-1 border-orange-500">
                                                                {timeOptionsInicio.map((option) => ( <option key={option} value={option}>{option} </option>
                                                            ))}
                                                                </select>
                                                            </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex-1 bg-gray-200 p-4 rounded-lg shadow-lg border-2 border-orange-500 bg-orange-50">
                                                <label className="block text-sm font-medium text-black-500 mb-2">Data de Fim do Anúncio:</label>
                                                    <div className="flex items-center space-x-4">
                                                        <div className="relative flex-1">
                                                            <Calendar onChange={handleDataFimGeneralChange} value={dataFim}
                                                            tileDisabled={({ date }) => isDataIndisponivel(date)}
                                                            locale={ptBR} className="custom-calendar"/>
                                                        </div>
                                                        <div className="w-1/3 ">
                                                            <label className="block text-sm font-medium text-black-500 mb-2">Hora de Fim:</label>
                                                            <div className="relative">
                                                                <select value={horaFim} onChange={(e) =>
                                                                setHoraFim(e.target.value)} className="w-full p-3 border rounded-lg bg-white shadow-sm text-lg focus:ring-2 focus:ring-orange-500 border-1 border-orange-500">
                                                                {timeOptionsFim.map((option) => (
                                                                <option key={option} value={option}> {option} </option>
                                                            ))}
                                                                </select>
                                                            </div>
                                                        </div>
                                                    </div>
                                            </div>
                                        </div>
                                        <div className="flex-1 bg-gray-200 p-4 rounded-lg shadow-lg border-2 border-orange-500 bg-orange-50">
                                            <label className="block text-lg font-medium text-black-500">Escolher Serviços:</label>
                                            {servicos.length > 0 ? (
                                            <div className="flex flex-wrap gap-4 mt-4">
                                                {servicos.map((servico) => (
                                                    <div className="flex-shrink-0 w-full sm:w-80 md:w-96 bg-white shadow-md rounded-lg p-4 mb-4 mx-auto" key={servico.id}>
                                                    <div className="flex flex-col w-full">
                                                        <div className="flex justify-between items-center mb-2">
                                                            <div className="flex items-center">
                                                                <button type="button" onClick={() => handleServicosChange(servico.id)}
                                                                    className={`p-2 rounded-lg text-sm font-medium w-full ${
                                                                        servicosIds.includes(servico.id) ? "bg-orange-500 text-white" : "bg-gray-200 text-gray-700"}`}>
                                                                        <div className="flex flex-wrap justify-start space-x-4">
                                                                            {servico.scategorias.map((scategoria) => (
                                                                                <div
                                                                                    key={scategoria.id}
                                                                                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded-full cursor-pointer hover:bg-orange-500 hover:text-white transition-all duration-300"
                                                                                >
                                                                                    {scategoria.titulo}
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                </button>
                                                            </div>
                                                        </div>
                                                        {servico.descricao && (
                                                            <div>
                                                                <p className="text-sm text-gray-700 font-semibold mb-1">Descrição:</p>
                                                                <p className="text-sm text-gray-700 mb-2">{servico.descricao}</p>
                                                            </div>
                                                        )}
                                                        <div className="mt-2 font-bold text-gray-700">
                                                            R$ {servico.valor}
                                                        </div>
                                                        {servicoAberto === servico.id && (
                                                            <div className="mt-2 space-y-4">
                                                                <div className="flex space-x-4">
                                                                    <div className="flex flex-col w-full relative z-10">
                                                                        <label className="block text-sm font-medium text-orange-500">Data de Início:</label>
                                                                        <Calendar onChange={(date) => handleDataInicioChange(servico.id, date)} 
                                                                            value={servicosData[servico.id]?.dataInicio} 
                                                                            tileDisabled={({ date }) => isDataIndisponivel(date)} locale={ptBR} 
                                                                            className="custom-calendar border p-2 rounded-md"/>
                                                                    </div>
                                                                    <div className="flex flex-col w-full relative z-10">
                                                                        <label className="block text-sm font-medium text-orange-500">Data de Fim:</label>
                                                                        <Calendar onChange={(date) => handleDataFimChange(servico.id, date)} 
                                                                            value={servicosData[servico.id]?.dataFim} 
                                                                            tileDisabled={({ date }) => isDataIndisponivel(date)} locale={ptBR} 
                                                                            className="custom-calendar border p-2 rounded-md"/>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                            </div>
                                    ) : (
                                        <p className="text-gray-500">Nenhum serviço disponível.</p>
                                    )}
                                        </div>
                                <div className="flex justify-between items-center mt-4"> <span className="font-bold text-lg">Valor Total:</span>
                                    <span className="font-semibold text-xl text-orange-500">R$ {valorTotal.toFixed(2)}</span>
                                </div>
                                <div className="flex items-center mb-4">
                                    <button type="button" className="p-2 bg-blue-500 text-white rounded-md"onClick={openModal}>Selecionar Forma de Pagamento</button>
                                    {formapagamento !== 'select' && ( <p className="ml-4 text-green-500">{formapagamento}</p>)}
                                </div>
                                <button type="submit" className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Confirmar Reserva</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            <PaymentModal isOpen={isModalOpen} onClose={closeModal} onSelectPayment={handleSelectPayment}/>
            <ReservaSuccessModal isOpen={isReservaSuccessModalOpen} onClose={closeReservaSuccessModal} />
            {isReservaSuccessModalOpen && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full transform transition-transform duration-300 ease-in-out scale-95 hover:scale-100">
                      <div className="text-center">
                        <h3 className="text-2xl font-semibold mb-4 text-green-700">Reserva realizada com sucesso!</h3>
                        <p className="text-sm text-gray-600 mb-6">Sua reserva foi confirmada. Você será redirecionado para suas reservas.</p>
                        <button onClick={closeReservaSuccessModal}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full text-lg font-medium transition duration-200 ease-in-out">Fechar</button>
                      </div>
                    </div>
                  </div>
                )}
            <Footer />
        </div>
    );
}