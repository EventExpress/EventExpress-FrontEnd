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
    const [searchTerm, setSearchTerm] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [successMessage, setSuccessMessage] = useState(''); // Mensagem de sucesso
    const [errorCancel, setErrorCancel] = useState(''); // Mensagem de erro no cancelamento
    const { id } = router.query;

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
        if (!token) return;

        const fetchAgendados = async () => {
            setLoading(true);
            try {
                const response = await axios.get('http://localhost:8000/api/agendados/meus', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                console.log('Dados recebidos:', response.data);

                if (response.data.status && Array.isArray(response.data.agendados)) {
                    const agendadosFuturos = response.data.agendados.filter(agendado => {
                        const dataInicio = new Date(agendado.data_inicio);
                        const dataAtual = new Date();
                        return dataInicio >= dataAtual;
                    });
                    setAgendados(agendadosFuturos);
                    fetchAnuncios(agendadosFuturos);
                } else {
                    setErrorMessage('Nenhum agendado encontrado.');
                }
            } catch (error) {
                setErrorMessage('Erro ao buscar agendados.');
                console.error('Error fetching agendados:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchAgendados();
    }, [token]);

    const fetchAnuncios = async (agendados) => {
        try {
            const anuncioIds = agendados.map(agendado => agendado.anuncio_id);
            const response = await axios.get('http://localhost:8000/api/anuncios', {
                params: { ids: anuncioIds },
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log('Anúncios recebidos:', response.data);
            if (response.data.status && Array.isArray(response.data.anuncios)) {
                setAnuncios(response.data.anuncios);
                fetchLocadores(response.data.anuncios);
            }
        } catch (error) {
            setErrorMessage('Erro ao buscar anúncios.');
            console.error('Error fetching anuncios:', error);
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

    const handleCancel = async (agendado_id) => {
        try {
            const response = await axios.delete(`http://localhost:8000/api/agendados/${agendado_id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.data.status) {
                setAgendados(prevAgendados => prevAgendados.filter(agendado => agendado.id !== agendado_id));
                setSuccessMessage('Agendamento cancelado com sucesso!'); // Mensagem de sucesso
                setErrorCancel(''); // Limpa a mensagem de erro
            } else {
                setErrorCancel('Erro ao cancelar agendado.');
            }
        } catch (error) {
            setSuccessMessage(''); // Limpa a mensagem de sucesso
            setErrorCancel('Falha ao tentar cancelar reserva, só pode ser cancelado até 3 dias antes da data agendada.');
            console.error('Falha no cancelamento:', error);
        }
    };

    const handleSearch = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.get(`/agendados/show?search=${searchTerm}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            console.log('Dados de busca:', response.data);

            if (response.data.status && Array.isArray(response.data.agendados)) {
                setAgendados(response.data.agendados);
            } else {
                setErrorMessage('Nenhum agendado encontrado.');
            }
        } catch (error) {
            setErrorMessage('Erro ao buscar agendados.');
            console.error('Error fetching agendados:', error);
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            <NavBar />
            <div className="flex-grow py-12 bg-gray-100 dark:bg-gray-900">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <h1 className="text-2xl font-semibold mb-4 text-orange-500">Agendados</h1>

                        {loading ? (
                            <div className="flex justify-center items-center">
                                <p>Carregando agendados...</p>
                            </div>
                        ) : errorMessage ? (
                            <p className="text-red-500">{errorMessage}</p>
                        ) : agendados.length > 0 ? (
                            <div>
                                <form onSubmit={handleSearch} className="mb-4 flex">
                                    <input
                                        type="text"
                                        name="search"
                                        placeholder="Procurar agendado"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="border rounded-l-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    />
                                    <button type="submit" className="ml-3 bg-orange-500 hover:bg-orange-600 text-white px-4 rounded-md">
                                        Buscar
                                    </button>
                                </form>

                                {agendados.map((agendado) => {
                                    const anuncio = anuncios.find(a => a.id === agendado.anuncio_id);
                                    const locador = locadores.find(l => l.id === anuncio?.user_id);

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
                                                            className="mt-4 w-64 h-64 object-cover rounded-md"
                                                        />
                                                    ) : (
                                                        <p>Imagem não disponível</p>
                                                    )}

                                                    {locador ? (
                                                        <div className="mt-4">
                                                            <p className="text-gray-600 mt-2">
                                                                Locador: {locador.nome || 'Locador não disponível'}
                                                            </p>
                                                        </div>
                                                    ) : (
                                                        <p>Locador não encontrado</p>
                                                    )}
                                                </div>
                                                <div className="mb-4 p-4 border rounded-md bg-white">
                                                    <p><span className="font-semibold">Data de Início:</span> {agendado.data_inicio}</p>
                                                    <p><span className="font-semibold">Data do Fim:</span> {agendado.data_fim}</p>
                                                    
                                                    {servico.length > 0 ? (
                                                        <div>
                                                            <p><span className="font-semibold">Serviços:</span></p>
                                                            <ul>
                                                                {servico.map((s, idx) => (
                                                                    <li key={idx}>{s.nome}</li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    ) : (
                                                        <p>Sem serviços adicionais.</p>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="mt-4 flex justify-between">
                                            <button
    onClick={() => {
        console.log("Redirecionando para:", `/agendados/edit/${agendado.id}`);
        router.push(`/agendados/edit?agendadoId=${agendado.id}`);
    }}
    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
>
    Editar Reserva
</button>
                                                <button
                                                    onClick={() => handleCancel(agendado.id)}
                                                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
                                                >
                                                    Cancelar Agendamento
                                                </button>
                                                
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <p className="text-gray-600">Nenhum agendamento futuro encontrado.</p>
                        )}
                    </div>
                </div>
            </div>

            {successMessage && (
                <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-md shadow-md">
                    {successMessage}
                </div>
            )}

            {errorCancel && (
                <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-md shadow-md">
                    {errorCancel}
                </div>
            )}
        </div>
    );
}
