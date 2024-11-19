import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import NavBar from '../../components/NavBar';
import PaymentModal from '../../components/PaymentModal'; 
import 'react-calendar/dist/Calendar.css';
import Calendar from 'react-calendar';
import { ptBR } from 'date-fns/locale';
import { format } from 'date-fns';
import { isAfter } from 'date-fns';
import { startOfDay } from 'date-fns';

export default function EditarAgendado() {
    const router = useRouter();
    const { agendadoId } = router.query;
    const [token, setToken] = useState('');
    const [agendado, setAgendado] = useState(null);
    const [servicos, setServicos] = useState([]);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const closeModal = () => setIsModalOpen(false);
    const [formapagamento, setFormaPagamento] = useState('select');
    const [dataInicio, setDataInicio] = useState(null);
    const [horaInicio, setHoraInicio] = useState('00:00');
    const [dataFim, setDataFim] = useState(null);
    const [horaFim, setHoraFim] = useState('00:30');
    const [servicosIds, setServicosIds] = useState([]);
    const [servicoAberto, setServicoAberto] = useState(null);
    const [anuncio, setAnuncio] = useState(null);
    const openModal = () => setIsModalOpen(true);
    const [datasIndisponiveis, setDatasIndisponiveis] = useState([]);
    const [servicosData, setServicosData] = useState({});

    const handleSelectPayment = (paymentMethod) => {
        setFormaPagamento(paymentMethod);
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

    const isDataIndisponivel = (date) => {
        const formattedDate = format(date, 'yyyy-MM-dd');
        return (
            datasIndisponiveis.includes(formattedDate) ||
            !isAfter(date, startOfDay(new Date()))
        );
    };

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedToken = localStorage.getItem('token');
            if (storedToken) {
                setToken(storedToken);
            } else {
                router.push('/login');
            }
        }
    }, [router]);

    useEffect(() => {
        if (!token || !agendadoId) return;

        const fetchAgendado = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`http://localhost:8000/api/agendados/${agendadoId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                if (response.data.status && response.data.results.length > 0) {
                    const agendadoData = response.data.results[0];
                    setAgendado(agendadoData);
                    fetchServicos();
                } else {
                    setErrorMessage('Agendamento não encontrado.');
                }
            } catch (error) {
                setErrorMessage('Erro ao buscar agendado.');
            } finally {
                setLoading(false);
            }
        };
        fetchAgendado();
    }, [token, agendadoId]);

    const fetchServicos = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/servicos', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setServicos(response.data.servicos);
        } catch (error) {
            setErrorMessage('Erro ao buscar serviços.');
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

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        const formData = new FormData(event.target);  
        let updatedData = Object.fromEntries(formData.entries());
        
        updatedData.dataInicio = format(dataInicio, 'yyyy-MM-dd');
        updatedData.horaInicio = horaInicio;
        updatedData.dataFim = format(dataFim, 'yyyy-MM-dd');
        updatedData.horaFim = horaFim;
    
        try {
            await axios.put(`http://localhost:8000/api/agendados/${agendadoId}`, updatedData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setSuccessMessage('Agendamento atualizado com sucesso!');
            
            // Redireciona para a página de visualização de agendados após sucesso
            router.push('/agendados/visualizar');
        } catch (error) {
            setErrorMessage('Erro ao atualizar agendamento.');
        }
    };

    

    return (
        <div className="flex flex-col min-h-screen">
            <NavBar />
            <div className="flex-grow py-12 bg-gray-100 dark:bg-gray-900">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <h1 className="text-2xl font-semibold mb-4 text-orange-500">Editar Agendamento</h1>

                        {successMessage && (
                            <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-md shadow-md">
                                {successMessage}
                            </div>
                        )}

                        {errorMessage && (
                            <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-md shadow-md">
                                {errorMessage}
                            </div>
                        )}

                        {agendado && servicos.length > 0 && (
                            <form onSubmit={handleSubmit}>
                          <div className="flex space-x-4 mb-4">
                            {/* Data de Início */}
                            <div className="flex-1 bg-gray-200 p-4 rounded-lg shadow-lg border-2 border-orange-500 bg-orange-50">
                              <label className="block text-sm font-medium text-black-500 mb-2">Data de Início:</label>
                              <div className="flex items-center space-x-4">
                                <div className="relative flex-1">
                                  <Calendar 
                                    onChange={handleDataInicioGeneralChange} 
                                    value={dataInicio}
                                    tileDisabled={({ date }) => isDataIndisponivel(date)}
                                    locale={ptBR} 
                                    className="custom-calendar"
                                  />
                                </div>
                                <div className="w-1/3">
                                  <label className="block text-sm font-medium text-black-500 mb-2">Hora de Início:</label>
                                  <select 
                                    value={horaInicio} 
                                    onChange={handleHoraInicioChange}
                                    className="w-full p-3 border rounded-lg bg-white shadow-sm text-lg focus:ring-2 focus:ring-orange-500 border-1 border-orange-500"
                                  >
                                    {timeOptionsInicio.map((option) => (
                                      <option key={option} value={option}>{option}</option>
                                    ))}
                                  </select>
                                </div>
                              </div>
                            </div>
                                
                            {/* Data de Fim */}
                            <div className="flex-1 bg-gray-200 p-4 rounded-lg shadow-lg border-2 border-orange-500 bg-orange-50">
                              <label className="block text-sm font-medium text-black-500 mb-2">Data de Fim:</label>
                              <div className="flex items-center space-x-4">
                                <div className="relative flex-1">
                                  <Calendar 
                                    onChange={handleDataFimGeneralChange} 
                                    value={dataFim}
                                    tileDisabled={({ date }) => isDataIndisponivel(date)}
                                    locale={ptBR} 
                                    className="custom-calendar"
                                  />
                                </div>
                                <div className="w-1/3">
                                  <label className="block text-sm font-medium text-black-500 mb-2">Hora de Fim:</label>
                                  <select 
                                    value={horaFim} 
                                    onChange={(e) => setHoraFim(e.target.value)} 
                                    className="w-full p-3 border rounded-lg bg-white shadow-sm text-lg focus:ring-2 focus:ring-orange-500 border-1 border-orange-500"
                                  >
                                    {timeOptionsFim.map((option) => (
                                      <option key={option} value={option}>{option}</option>
                                    ))}
                                  </select>
                                </div>
                              </div>
                            </div>
                          </div>
                                
                          {/* Escolher Serviços */}
                          <div className="flex-1 bg-gray-200 p-4 rounded-lg shadow-lg border-2 border-orange-500 bg-orange-50">
                            <label className="block text-lg font-medium text-black-500">Escolher Serviços:</label>
                            {servicos.length > 0 ? (
                              <div className="flex flex-wrap gap-4 mt-4">
                                {servicos.map((servico) => (
                                  <div className="flex-shrink-0 w-full sm:w-80 md:w-96 bg-white shadow-md rounded-lg p-4 mb-4 mx-auto" key={servico.id}>
                                    <div className="flex flex-col w-full">
                                      <div className="flex justify-between items-center mb-2">
                                        <div className="flex items-center">
                                          <button 
                                            type="button" 
                                            onClick={() => handleServicosChange(servico.id)}
                                            className={`p-2 rounded-lg text-sm font-medium w-full ${
                                              servicosIds.includes(servico.id) ? "bg-orange-500 text-white" : "bg-gray-200 text-gray-700"
                                            }`}
                                          >
                                            <span className="font-bold">{servico.titulo}</span>
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
                                              <Calendar 
                                                onChange={(date) => handleDataInicioChange(servico.id, date)} 
                                                value={servicosData[servico.id]?.dataInicio} 
                                                tileDisabled={({ date }) => isDataIndisponivel(date)} 
                                                locale={ptBR} 
                                                className="custom-calendar border p-2 rounded-md"
                                              />
                                            </div>
                                            <div className="flex flex-col w-full relative z-10">
                                              <label className="block text-sm font-medium text-orange-500">Data de Fim:</label>
                                              <Calendar 
                                                onChange={(date) => handleDataFimChange(servico.id, date)} 
                                                value={servicosData[servico.id]?.dataFim} 
                                                tileDisabled={({ date }) => isDataIndisponivel(date)} 
                                                locale={ptBR} 
                                                className="custom-calendar border p-2 rounded-md"
                                              />
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
                        
                          {/* Valor Total */}
                          <div className="flex justify-between items-center mt-4"> 
                            <span className="font-bold text-lg">Valor Total:</span>
                            <span className="font-semibold text-xl text-orange-500">R$ {valorTotal.toFixed(2)}</span>
                          </div>
                        
                          {/* Forma de Pagamento */}
                          <div className="flex items-center mb-4">
                                    <button type="button" className="p-2 bg-blue-500 text-white rounded-md"onClick={openModal}>Selecionar Forma de Pagamento</button>
                                    {formapagamento !== 'select' && ( <p className="ml-4 text-green-500">{formapagamento}</p>)}
                                </div>
                        
                          {/* Botão Confirmar Reserva */}
                          <button 
                            type="submit" 
                            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                          >
                            Confirmar Edição de Reserva
                          </button>
                        </form>

                        )}
                    </div>
                </div>
            </div>
            <PaymentModal isOpen={isModalOpen} onClose={closeModal} onSelectPayment={handleSelectPayment}/>
        </div>
    );
}
