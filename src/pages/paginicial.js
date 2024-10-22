import React, { useEffect, useState } from 'react';
import NavBar from '../components/NavBar';
import { useSession } from 'next-auth/react';
import axios from 'axios';

const Paginicial = () => {
    const { data: session, status } = useSession(); // Obtém a sessão do usuário
    const [anuncios, setAnuncios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAnuncios = async () => {
            setLoading(true);
            setError(null); // Reseta o erro

            try {
                // Exibe a URL do backend para verificar se está correta
                console.log('Backend URL:', process.env.NEXT_PUBLIC_BACKEND_URL);
                
                if (status === 'authenticated' && session?.user?.auth_token) {
                    const userToken = session.user.auth_token;
                    console.log('Token de autenticação:', userToken); // Log do token

                    // Faz a requisição para buscar os anúncios
                    const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/anuncios`, {
                        headers: {
                            'Authorization': `Bearer ${userToken}`,
                            'Content-Type': 'application/json',
                        },
                    });

                    // Log da resposta da API
                    console.log('Resposta da API:', response.data);

                    // Ajuste aqui conforme a estrutura real da resposta
                    if (response.data.status === 'success' && response.data.data) {
                        setAnuncios(response.data.data); // Use 'data' ou ajuste conforme necessário
                    } else {
                        console.log('Nenhum anúncio encontrado.'); // Loga quando não há anúncios
                        setAnuncios([]); // Define um array vazio se não houver anúncios
                    }
                } else if (status === 'unauthenticated') {
                    setError('Usuário não autenticado.');
                }
            } catch (error) {
                console.error('Erro ao buscar anúncios:', error);
                setError(error.response?.data?.message || 'Erro ao buscar anúncios');
            } finally {
                setLoading(false); // Finaliza o estado de carregamento
            }
        };

        if (status === 'authenticated') {
            fetchAnuncios();
        } else {
            setLoading(false);
        }
    }, [session, status]);

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
            <NavBar user={session?.user} />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <h1 className="text-2xl font-semibold mb-4 text-orange-500">Anúncios</h1>

                        {loading && <p className="text-gray-700 dark:text-gray-300">Carregando anúncios...</p>}
                        {error && <p className="text-red-500">{error}</p>}

                        {!loading && anuncios.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {anuncios.map(anuncio => (
                                    <div key={anuncio.id} className="bg-white dark:bg-gray-200 rounded-lg shadow-md p-4 transition-transform transform hover:scale-105">
                                        {/* Renderiza a imagem do anúncio, se disponível */}
                                        {anuncio.imagens && anuncio.imagens.length > 0 && (
                                            <img src={anuncio.imagens[0]} alt={anuncio.titulo} className="rounded-lg h-32 w-full object-cover mb-2" />
                                        )}
                                        <h2 className="text-gray-900 dark:text-gray-100 font-semibold text-lg">{anuncio.titulo}</h2>
                                        <p className="text-gray-600 dark:text-gray-400">
                                            {anuncio.endereco?.cidade}, CEP: {anuncio.endereco?.cep}, Número: {anuncio.endereco?.numero}, {anuncio.endereco?.bairro}
                                        </p>
                                        <p className="text-gray-700 dark:text-gray-300">Capacidade: {anuncio.capacidade}</p>
                                        <p className="text-gray-700 dark:text-gray-300">{anuncio.descricao}</p>
                                        <p className="text-gray-700 dark:text-gray-300">Locador: {anuncio.usuario?.nome}</p>
                                        <p className="text-gray-700 dark:text-gray-300">Valor: R$ {anuncio.valor?.toFixed(2)}</p>
                                        {anuncio.agenda && (
                                            <p className="text-gray-700 dark:text-gray-300">Data de Agenda: {new Date(anuncio.agenda).toLocaleDateString()}</p>
                                        )}
                                        <div className="mt-4">
                                            <a href={`/reservar/${anuncio.id}`} className="inline-block bg-blue-500 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-600 transition duration-200">Reservar</a>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            !loading && <p className="text-gray-700 dark:text-gray-300">Não possui nenhum anúncio.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Paginicial;
