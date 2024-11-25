import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import NavBar from '../../components/NavBar';
import axios from 'axios';

export default function Visualizaragendados() {
    const router = useRouter();
    const [token, setToken] = useState('');
    const [userId, setUsuarioId] = useState('');
    const [agendados, setAgendados] = useState([]);
    const [anuncios, setAnuncios] = useState([]);
    const [locadores, setLocadores] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorCancel, setErrorCancel] = useState('');
    const { id } = router.query;

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedToken = localStorage.getItem('token');
            const storedUserId = localStorage.getItem('userId');
            if (storedToken) {
                setToken(storedToken);
                setUsuarioId(storedUserId);
            } else {
                router.push('/login'); // Redireciona caso não tenha token
            }
        }
    }, [router]);

    useEffect(() => {
        if (!token) return;

        const fetchAgendados = async () => {
            setLoading(true);
            try {
                if (!token) {
                    throw new Error('Token não encontrado.');
                }
                const response = await axios.get('http://localhost:8000/api/agendados/meus/historico', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.data.status && Array.isArray(response.data.historico_agendados)) {
                    const agendadosPassados = response.data.historico_agendados.filter(agendado => {
                        const dataFim = new Date(agendado.data_fim);
                        const dataInicio = new Date(agendado.data_inicio);
                        const dataAtual = new Date();
                        return dataFim < dataAtual && dataInicio <= dataAtual;
                    });
                    setAgendados(agendadosPassados);
                    fetchAnuncios(agendadosPassados);
                } else {
                    setErrorMessage('Nenhum agendado encontrado.');
                }
            } catch (error) {
                if (error.response && error.response.status === 404) {
                    setErrorMessage('Endpoint não encontrado. Verifique a URL da API.');
                } else if (error.response && error.response.status === 403) {
                    setErrorMessage('Você não tem permissão para acessar esses dados.');
                } else {
                    setErrorMessage('Erro ao buscar agendados.');
                }
                console.error('Erro ao buscar agendados:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchAgendados();
    }, [token]);

    const fetchAnuncios = async (agendados) => {
        try {
            if (!token) {
                throw new Error('Token não encontrado.');
            }
            const anuncioIds = agendados.map(agendado => agendado.anuncio?.id); // Verifique se o anuncio existe
            const response = await axios.get('http://localhost:8000/api/anuncios', {
                params: { ids: anuncioIds },
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data.status && Array.isArray(response.data.anuncios)) {
                setAnuncios(response.data.anuncios);
                fetchLocadores(response.data.anuncios);
            }
        } catch (error) {
            if (error.response && error.response.status === 403) {
                setErrorMessage('Você não tem permissão para acessar esses anúncios.');
            } else {
                setErrorMessage('Erro ao buscar anúncios.');
            }
            console.error('Erro ao buscar anúncios:', error);
        }
    };

    const fetchLocadores = async (anuncios) => {
        try {
            const locadorIds = [...new Set(anuncios.map(anuncio => anuncio.user_id))];
            const responses = await Promise.all(
                locadorIds.map(userId => 
                    axios.get(`http://localhost:8000/api/user/${userId}`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    })
                )
            );

            const locadoresData = responses.map(response => {
                if (response.data && response.data.user) {
                    return response.data.user;
                } else {
                    console.error(`Locador não encontrado para o ID ${response.data.id}`);
                    return null;
                }
            }).filter(locador => locador !== null);   
            setLocadores(locadoresData);
        } catch (error) {
            console.error('Erro ao buscar locadores:', error);
        }
    };

    const handleAvaliar = (agendado_id) => {
        router.push(`/avaliacao?agendadoId=${agendado_id}&tipoUsuario=Locatario`);
    };

    return (
        <div className="flex flex-col min-h-screen">
            <NavBar />
            <div className="flex-grow py-12 bg-gray-100 dark:bg-gray-900">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <h1 className="text-2xl font-semibold mb-4 text-orange-500">Histórico de Agendamentos</h1>

                        {loading ? (
                            <div className="flex justify-center items-center">
                                <p>Carregando agendados...</p>
                            </div>
                        ) : errorMessage ? (
                            <p className="text-red-500">{errorMessage}</p>
                        ) : agendados.length > 0 ? (
                            <div>
                                {agendados.map((agendado) => {
                                    const anuncio = anuncios.find(a => a.id === agendado.anuncio?.id); // Verifique se o anuncio existe
                                    const locador = locadores.find(l => l.id === anuncio?.user_id); // Verifique se o locador existe

                                    const servico = agendado.servicos || [];

                                    return (
                                        <div key={agendado.id} className="border rounded-lg p-4 shadow-md mb-6 bg-gray-100 dark:bg-gray-800">
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                <div className="col-span-2">
                                                    <h2 className="text-xl font-semibold">{anuncio?.titulo || 'Sem título'}</h2>
                                                    <p>{anuncio?.descricao || 'Sem descrição disponível'}</p>

                                                    {anuncio?.imagens && anuncio.imagens.length > 0 ? (
                                                        <img
                                                            src={anuncio.imagens[0].image_path}
                                                            alt={anuncio.titulo}
                                                            className="mt-4 rounded-lg shadow-lg w-full object-cover h-64"
                                                        />
                                                    ) : (
                                                        <p className="text-gray-500">Sem imagem disponível</p>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-600 dark:text-gray-300">{new Date(agendado.data_inicio).toLocaleString()}</p>
                                                    <p className="text-sm text-gray-600 dark:text-gray-300">{new Date(agendado.data_fim).toLocaleString()}</p>

                                                    {locador && (
                                                        <div className="mt-4">
                                                            <p className="font-semibold">Locador:</p>
                                                            <p>{locador.nome}</p>
                                                            <p>{locador.email}</p>
                                                            {servico.length > 0 && (
                                                                <div className="mt-4">
                                                                    <h3 className="font-semibold text-lg">Serviços adicionais:</h3>
                                                                    <ul>
                                                                        {servico.map((serv, idx) => (
                                                                            <li key={idx}>{serv.nome}</li>
                                                                        ))}
                                                                    </ul>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex justify-end mt-4">
                                                <button
                                                    onClick={() => handleAvaliar(agendado.id)}
                                                    className="bg-blue-500 text-white py-2 px-4 rounded-md"
                                                >
                                                    Avaliar
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <p className="text-gray-500">Você ainda não tem agendamentos realizados.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
