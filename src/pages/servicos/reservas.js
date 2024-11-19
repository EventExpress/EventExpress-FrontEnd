import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import NavBar from '../../components/NavBar';
import axios from 'axios';

export default function VisualizarServicosAgendados() {
    const router = useRouter();
    const [token, setToken] = useState('');
    const [userId, setUserId] = useState('');
    const [agendados, setAgendados] = useState([]);
    const [servicos, setServicos] = useState([]);
    const [locatarios, setLocatarios] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [successMessage, setSuccessMessage] = useState('');
    const { id } = router.query;

    // Verificar se o token está presente
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedToken = localStorage.getItem('token');
            const storedUserId = localStorage.getItem('userId');
            if (storedToken) {
                setToken(storedToken);
                setUserId(storedUserId);
            } else {
                router.push('/login'); // Redireciona para o login se o token não estiver presente
            }
        }
    }, [router]);

    // Verificar se o usuário tem o tipo 'Prestador'
    useEffect(() => {
        if (!token || !userId) return;

        const fetchUserType = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/user/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                // Verifica se o usuário tem tipo "Prestador"
                if (!response.data.user.typeUsers.some(type => type.tipousu === 'Prestador')) {
                    setErrorMessage('Você não tem permissão para acessar os serviços agendados.');
                    router.push('/login'); // Redireciona se não for prestador
                }
            } catch (error) {
                setErrorMessage('Erro ao verificar tipo de usuário.');
                console.error(error);
            }
        };

        fetchUserType();
    }, [token, userId, router]);

    // Buscar serviços agendados
    useEffect(() => {
        if (!token) return;

        const fetchAgendados = async () => {
            setLoading(true);
            try {
                const response = await axios.get('http://localhost:8000/api/agendados/meus/servicos', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (response.data.status && Array.isArray(response.data.servicos_agendados)) {
                    setAgendados(response.data.servicos_agendados);
                    fetchServicos(response.data.servicos_agendados);
                } else {
                    setErrorMessage('Nenhum serviço agendado encontrado.');
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

    // Buscar detalhes dos serviços
    const fetchServicos = async (agendados) => {
        try {
            const servicoIds = agendados.map(agendado => agendado.servico_id);
            const response = await axios.get('http://localhost:8000/api/servicos', {
                params: { ids: servicoIds },
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.status && Array.isArray(response.data.servicos)) {
                setServicos(response.data.servicos);
                fetchLocatarios(response.data.servicos);
            }
        } catch (error) {
            setErrorMessage('Erro ao buscar serviços.');
            console.error('Error fetching servicos:', error);
        }
    };

    // Buscar clientes dos serviços
    const fetchLocatarios = async (servicos) => {
        try {
            const locatarioIds = [...new Set(servicos.map(servico => servico.user_id))];
            const responses = await Promise.all(
                locatarioIds.map(userId => 
                    axios.get(`http://localhost:8000/api/user/${userId}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    })
                )
            );
    
            const locatariosData = responses.map(response => response.data.user).filter(user => user !== null);
            setLocatarios(locatariosData);
        } catch (error) {
            setErrorMessage('Erro ao buscar clientes.');
            console.error('Error fetching clientes:', error);
        }
    };

    // Função de busca
    const handleSearch = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.get(`/agendados/show?search=${searchTerm}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.status && Array.isArray(response.data.agendados)) {
                setAgendados(response.data.agendados);
            } else {
                setErrorMessage('Nenhum agendado encontrado.');
            }
        } catch (error) {
            setErrorMessage('Erro ao buscar serviços reservados.');
            console.error('Error fetching serviços reservados:', error);
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            <NavBar />
            <div className="flex-grow py-12 bg-gray-100 dark:bg-gray-900">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <h1 className="text-2xl font-semibold mb-4 text-orange-500">Meus Serviços Agendados</h1>

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
                                    const servico = agendado.servicos.find(s => s.id === agendado.servico_id);

                                    const locatario = agendado.user;

                                    return (
                                        <div key={agendado.id} className="border rounded-lg p-4 shadow-md mb-6 bg-gray-100 dark:bg-gray-800">
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                                                <div className="col-span-2">
                                                {agendado.servicos.map((servico) => (
                                                    <div key={servico.id}>
                                                        <p><span className="font-semibold">Categorias do serviço:</span></p>
                                                            {servico.scategorias.map((scategoria) => (
                                                                <div key={scategoria.id} className="ml-4">- {scategoria.titulo}</div>
                                                            ))}
                                                        <p><span className="font-semibold">Descrição do serviço:</span> {servico?.descricao}</p>
                                                        <p><span className="font-semibold">Valor do serviço:</span> {servico?.valor}</p>
                                                        <br></br>
                                                    </div>
                                                ))}
                                              
                                                </div>
                                                <div>
                                                    <p><span className="font-semibold">locatario:</span> {locatario?.nome} {locatario?.sobrenome}</p>
                                                    <p><span className="font-semibold">E-mail do locatario:</span> {locatario?.email}</p>
                                                    <p><span className="font-semibold">Data de início:</span> {agendado.data_inicio}</p>
                                                    <p><span className="font-semibold">Data de fim:</span> {agendado.data_fim}</p>
                                                    
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <p className="text-gray-500">Nenhum serviço agendado encontrado.</p>
                        )}

                        {successMessage && <p className="text-green-500">{successMessage}</p>}
                    </div>
                </div>
            </div>
        </div>
    );
}
