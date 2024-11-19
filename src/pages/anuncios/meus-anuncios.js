//anúncios/visualizar.js

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import NavBar from '../../components/NavBar';
import axios from 'axios';

export default function VisualizarAnunciosAgendados() {
    const router = useRouter();
    const [token, setToken] = useState('');
    const [userId, setUserId] = useState('');
    const [agendados, setAgendados] = useState([]);
    const [anuncios, setAnuncios] = useState([]);
    const [locadores, setLocadores] = useState([]);
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

    // Verificar se o usuário tem o tipo 'Locador'
    useEffect(() => {
        if (!token || !userId) return;

        const fetchUserType = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/user/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                // Verifica se o usuário tem tipo "Locador"
                if (!response.data.user.typeUsers.some(type => type.tipousu === 'Locador')) {
                    setErrorMessage('Você não tem permissão para acessar os anúncios agendados.');
                    router.push('/login'); // Redireciona se não for locador
                }
            } catch (error) {
                setErrorMessage('Erro ao verificar tipo de usuário.');
                console.error(error);
            }
        };

        fetchUserType();
    }, [token, userId, router]);

    // Buscar anúncios agendados
    useEffect(() => {
        if (!token) return;

        const fetchAgendados = async () => {
            setLoading(true);
            try {
                const response = await axios.get('http://localhost:8000/api/agendados/meus/anuncios', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (response.data.status && Array.isArray(response.data.anuncios_agendados)) {
                    setAgendados(response.data.anuncios_agendados);
                    fetchAnuncios(response.data.anuncios_agendados);
                } else {
                    setErrorMessage('Nenhum anúncio reservado encontrado.');
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

    // Buscar detalhes dos anúncios
    const fetchAnuncios = async (agendados) => {
        try {
            const anuncioIds = agendados.map(agendado => agendado.anuncio_id);
            const response = await axios.get('http://localhost:8000/api/anuncios', {
                params: { ids: anuncioIds },
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.status && Array.isArray(response.data.anuncios)) {
                setAnuncios(response.data.anuncios);
                fetchLocadores(response.data.anuncios);
            }
        } catch (error) {
            setErrorMessage('Erro ao buscar anúncios.');
            console.error('Error fetching anuncios:', error);
        }
    };

    // Buscar locadores dos anúncios
    const fetchLocadores = async (anuncios) => {
        try {
            const locadorIds = [...new Set(anuncios.map(anuncio => anuncio.user_id))];
            const responses = await Promise.all(
                locadorIds.map(userId => 
                    axios.get(`http://localhost:8000/api/user/${userId}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    })
                )
            );
    
            const locadoresData = responses.map(response => response.data.user).filter(user => user !== null);
            setLocadores(locadoresData);
        } catch (error) {
            setErrorMessage('Erro ao buscar locadores.');
            console.error('Error fetching locadores:', error);
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
            setErrorMessage('Erro ao buscar anuncios reservados.');
            console.error('Error fetching anuncios reservados:', error);
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            <NavBar />
            <div className="flex-grow py-12 bg-gray-100 dark:bg-gray-900">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <h1 className="text-2xl font-semibold mb-4 text-orange-500"> Meus Anúncios Reservados</h1>

                        {loading ? (
                            <div className="flex justify-center items-center">
                                <p>Carregando agendados...</p>
                            </div>
                        ) : errorMessage ? (
                            <p className="text-red-500">{errorMessage}</p>
                        ) : agendados.length > 0 ? (
                            <div>

                                {agendados.map((agendado) => {
                                    const anuncio = anuncios.find(a => a.id === agendado.anuncio_id);
                                  
                                    const locatario = agendado.user;

                                    return (
                                        <div key={agendado.id} className="border rounded-lg p-4 shadow-md mb-6 bg-gray-100 dark:bg-gray-800">
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                                                <div className="col-span-2">
                                                    <p><span className="font-semibold">Título do anúncio:</span> {anuncio?.titulo}</p>
                                                    <p><span className="font-semibold">Descrição do anúncio:</span> {anuncio?.descricao}</p>
                                                    <p><span className="font-semibold">Valor do anúncio:</span> {anuncio?.valor}</p>
                                                    <p><span className="font-semibold">Capacidade do anúncio:</span> {anuncio?.capacidade}</p>
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
                                                    <p><span className="font-semibold">Locatário:</span> {locatario?.nome} {locatario?.sobrenome}</p>
                                                    <p><span className="font-semibold">E-mail do locatário</span> {locatario?.email}</p>
                                                    <p><span className="font-semibold">Data de início:</span> {agendado.data_inicio}</p>
                                                    <p><span className="font-semibold">Data de fim:</span> {agendado.data_fim}</p>
                                                    
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <p className="text-gray-500">Nenhum anúncio reservado encontrado.</p>
                        )}

                        {successMessage && <p className="text-green-500">{successMessage}</p>}
                    </div>
                </div>
            </div>
        </div>
    );
}