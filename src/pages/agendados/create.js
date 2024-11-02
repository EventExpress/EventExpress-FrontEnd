import { useState, useEffect } from 'react';
import axios from 'axios';
import ApplicationLogo from '../../components/ApplicationLogo';
import NavBar from '../../components/NavBar';

export default function CreateReserva() {
    const [dataInicio, setDataInicio] = useState('');
    const [dataFim, setDataFim] = useState('');
    const [servicos, setServicos] = useState([]);
    const [anuncioId, setAnuncioId] = useState(''); // Este ID deve ser setado quando o anúncio for selecionado
    const [usuarioId, setUsuarioId] = useState('');
    const [servicosIds, setServicosIds] = useState([]);
    const [datasIndisponiveis, setDatasIndisponiveis] = useState([]);
    
    useEffect(() => {
        const userId = localStorage.getItem('userId'); // Acesse localStorage apenas no cliente
        if (userId) {
            setUsuarioId(userId);
        }
    }, []);

    useEffect(() => {
        const token = localStorage.getItem('token'); // Obtenha o token do localStorage

        const fetchServicos = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/servicos', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setServicos(Array.isArray(response.data.servicos) ? response.data.servicos : []);
            } catch (error) {
                console.error('Erro ao buscar serviços:', error);
            }
        };

        const fetchDatasIndisponiveis = async () => {
            try {
                if (anuncioId) {
                    const response = await axios.get(`http://localhost:8000/api/verifica-agenda/${anuncioId}`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    setDatasIndisponiveis(response.data.datasIndisponiveis || []);
                }
            } catch (error) {
                console.error('Erro ao buscar datas indisponíveis:', error);
            }
        };

        fetchServicos();
        fetchDatasIndisponiveis();
    }, [anuncioId]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        const reservaData = {
            data_inicio: dataInicio,
            data_fim: dataFim,
            servicosId: servicosIds,
            anuncio_id: anuncioId,
            usuario_id: usuarioId,
        };

        try {
            const token = localStorage.getItem('token'); // Obtenha o token do localStorage
            const response = await axios.post('http://localhost:8000/api/agendados', reservaData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.status === 200) {
                console.log('Reserva criada com sucesso!');
            } else {
                console.error('Erro ao criar reserva');
            }
        } catch (error) {
            console.error('Erro:', error);
        }
    };

    const handleServicosChange = (id) => {
        setServicosIds((prev) => {
            if (prev.includes(id)) {
                return prev.filter((servicoId) => servicoId !== id);
            }
            return [...prev, id];
        });
    };

    const isDataIndisponivel = (date) => {
        if (!date || isNaN(new Date(date).getTime())) {
            return false;
        }
        
        const formattedDate = new Date(date).toISOString().split('T')[0];
        return datasIndisponiveis.includes(formattedDate);
    };

    return (
        <div>
            <NavBar />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200 rounded-lg">
                            <h2 className="font-semibold text-xl text-gray-900 leading-tight">
                                Reservar Anúncio
                            </h2>

                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <label htmlFor="data_inicio" className="block text-sm font-medium text-orange-500">
                                        Data de Início:
                                    </label>
                                    <input
                                        type="datetime-local"
                                        id="data_inicio"
                                        name="data_inicio"
                                        value={dataInicio}
                                        onChange={(e) => setDataInicio(e.target.value)}
                                        className="form-input mt-1 block w-full rounded-lg"
                                        required
                                        min={new Date().toISOString().slice(0, 16)}
                                        disabled={isDataIndisponivel(dataInicio)}
                                    />
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="data_fim" className="block text-sm font-medium text-orange-500">
                                        Data de Fim:
                                    </label>
                                    <input
                                        type="datetime-local"
                                        id="data_fim"
                                        name="data_fim"
                                        value={dataFim}
                                        onChange={(e) => setDataFim(e.target.value)}
                                        className="form-input mt-1 block w-full rounded-lg"
                                        required
                                        min={dataInicio}
                                        disabled={isDataIndisponivel(dataFim)}
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-orange-500">
                                        Escolher Serviços:
                                    </label>
                                    {Array.isArray(servicos) && servicos.length > 0 ? (
                                        servicos.map((servico) => (
                                            <div className="flex items-center mt-2" key={servico.id}>
                                                <input
                                                    type="checkbox"
                                                    id={`servicos-${servico.id}`}
                                                    value={servico.id}
                                                    onChange={() => handleServicosChange(servico.id)}
                                                    className="form-checkbox h-4 w-4 text-orange-600"
                                                />
                                                <label htmlFor={`servicos-${servico.id}`} className="ml-2 block text-sm text-gray-900">
                                                    {servico.titulo} - R$ {servico.valor}
                                                </label>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-gray-500">Nenhum serviço disponível.</p>
                                    )}
                                </div>

                                <input type="hidden" name="anuncio_id" value={anuncioId} />
                                <input type="hidden" name="usuario_id" value={usuarioId} />

                                <div className="mt-6">
                                    <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg">
                                        Reservar
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
