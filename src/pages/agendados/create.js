import { useState, useEffect } from 'react';
import axios from 'axios';
import Calendar from 'react-calendar';
import { format, isAfter, startOfDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import 'react-calendar/dist/Calendar.css';
import NavBar from '../../components/NavBar';
import '../../app/globals.css';

export default function CreateReserva({ anuncioId }) { // Passando anuncioId como prop
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

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        if (userId) setUsuarioId(userId);
    }, []);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) return;

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
            if (!anuncioId) return;
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
    }, [anuncioId]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(null);
        if (!dataInicio || !dataFim || !servicosIds.length) {
            setError('Por favor, selecione as datas e os serviços.');
            return;
        }
    
        // Verifica se todos os serviços selecionados têm datas válidas
        const hasIncompleteServiceDates = servicosIds.some(id => {
            const servico = servicosData[id];
            return !(servico && servico.dataInicio && servico.dataFim);
        });
    
        if (hasIncompleteServiceDates) {
            setErrorMessage('Por favor, preencha as datas de todos os serviços selecionados.');
            return;
        }
    
        const reservaData = {
            data_inicio: format(dataInicio, 'yyyy-MM-dd'),
            data_fim: format(dataFim, 'yyyy-MM-dd'),
            hora_inicio: horaInicio,
            hora_fim: horaFim,
            servicosId: servicosIds.map(id => ({
                id,
                data_inicio: format(servicosData[id].dataInicio, 'yyyy-MM-dd'),
                data_fim: format(servicosData[id].dataFim, 'yyyy-MM-dd'),
            })),
            anuncio_id: anuncioId,
            usuario_id: usuarioId,
        };
    
        console.log('Dados da reserva:', reservaData); // Depuração
    
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('http://localhost:8000/api/agendados/create', reservaData, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`, // Corrigido aqui
                },
            });
        
            if (response.status === 200) {
                console.log('Reserva criada com sucesso!');
                setErrorMessage('');
                // Redirecionar ou mostrar mensagem de sucesso
            } else {
                setErrorMessage('Erro ao criar reserva. Tente novamente.');
            }
        } catch (error) {
            console.error('Erro ao criar reserva:', error);
            setErrorMessage('Erro ao criar reserva. Tente novamente.');
        }
    };
    
    

    const handleServicosChange = (id) => {
        setServicosIds(prev => {
            const isChecked = prev.includes(id);
            if (isChecked) {
                const { [id]: _, ...rest } = servicosData;
                setServicosData(rest);
            } else {
                setServicosData(prev => ({ ...prev, [id]: { dataInicio: null, dataFim: null } }));
            }
            return isChecked ? prev.filter(servicoId => servicoId !== id) : [...prev, id];
        });
    };

    const handleDataInicioChange = (id, date) => {
        setServicosData(prev => ({
            ...prev,
            [id]: { ...prev[id], dataInicio: date },
        }));
    };

    const handleDataFimChange = (id, date) => {
        setServicosData(prev => ({
            ...prev,
            [id]: { ...prev[id], dataFim: date },
        }));
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

    const handleHoraInicioChange = (e) => {
        const selectedHoraInicio = e.target.value;
        setHoraInicio(selectedHoraInicio);
        if (dataInicio && dataFim && format(dataInicio, 'yyyy-MM-dd') === format(dataFim, 'yyyy-MM-dd') && selectedHoraInicio > horaFim) {
            setHoraFim(selectedHoraInicio);
        }
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
                            <h2 className="font-semibold text-xl text-gray-900 leading-tight">Reservar Anúncio</h2>
                            {errorMessage && <p className="text-red-500">{errorMessage}</p>}

                            <form onSubmit={handleSubmit}>
                                <div className="flex space-x-4 mb-4">
                                    <div className="flex-1 bg-gray-200 p-4 rounded-lg">
                                        <label className="block text-sm font-medium text-orange-500 mb-2">Data de Início do Anúncio:</label>
                                        <Calendar
                                            onChange={handleDataInicioGeneralChange}
                                            value={dataInicio}
                                            tileDisabled={({ date }) => isDataIndisponivel(date)}
                                            locale={ptBR}
                                            className="custom-calendar"
                                        />
                                        <label className="block text-sm font-medium text-orange-500 mt-4">Hora de Início do Anúncio:</label>
                                        <select
                                            value={horaInicio}
                                            onChange={handleHoraInicioChange}
                                            className="border rounded-md p-2 w-full"
                                        >
                                            {timeOptionsInicio.map((time) => (
                                                <option key={time} value={time}>{time}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="flex-1 bg-gray-200 p-4 rounded-lg">
                                        <label className="block text-sm font-medium text-orange-500 mb-2">Data de Fim do Anúncio:</label>
                                        <Calendar
                                            onChange={handleDataFimGeneralChange}
                                            value={dataFim}
                                            tileDisabled={({ date }) => isDataIndisponivel(date)}
                                            locale={ptBR}
                                            className="custom-calendar"
                                        />
                                        <label className="block text-sm font-medium text-orange-500 mt-4">Hora de Fim do Anúncio:</label>
                                        <select
                                            value={horaFim}
                                            onChange={(e) => setHoraFim(e.target.value)}
                                            className="border rounded-md p-2 w-full"
                                        >
                                            {timeOptionsFim.map((time) => (
                                                <option key={time} value={time}>{time}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-orange-500">
                                        Escolher Serviços:
                                    </label>
                                    {servicos.length > 0 ? (
                                        servicos.map((servico) => (
                                            <div className="flex items-start mt-2" key={servico.id}>
                                                <div className="flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        id={`servicos-${servico.id}`}
                                                        value={servico.id}
                                                        onChange={() => handleServicosChange(servico.id)}
                                                        className="form-checkbox h-4 w-4 text-orange-600"
                                                    />
                                                    <label
                                                        htmlFor={`servicos-${servico.id}`}
                                                        className="ml-2 block text-sm text-gray-900"
                                                    >
                                                        {servico.titulo} - R$ {servico.valor}
                                                    </label>
                                                </div>

                                                {}
                                                {servicosIds.includes(servico.id) && (
                                                    <div className="ml-4 flex items-center">
                                                        <div className="flex flex-col mr-4">
                                                            <label className="block text-sm font-medium text-orange-500">
                                                                Data de Início:
                                                            </label>
                                                            <Calendar
                                                                onChange={(date) => handleDataInicioChange(servico.id, date)}
                                                                value={servicosData[servico.id]?.dataInicio}
                                                                tileDisabled={({ date }) => isDataIndisponivel(date)}
                                                                locale={ptBR}
                                                                className="custom-calendar"
                                                            />
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <label className="block text-sm font-medium text-orange-500">
                                                                Data de Fim:
                                                            </label>
                                                            <Calendar
                                                                onChange={(date) => handleDataFimChange(servico.id, date)}
                                                                value={servicosData[servico.id]?.dataFim}
                                                                tileDisabled={({ date }) => isDataIndisponivel(date)}
                                                                locale={ptBR}
                                                                className="custom-calendar"
                                                            />
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-gray-500">Nenhum serviço disponível.</p>
                                    )}
                                </div>
                                <input type="hidden" name="anuncio_id" value={anuncioId} />
                                <input type="hidden" name="usuario_id" value={usuarioId} />

                                <button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded">
                                    Reservar
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
