import React, { useEffect, useState } from 'react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import axios from 'axios';

const HomePage = () => {
    const [anuncios, setAnuncios] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAnuncios = async () => {
            setLoading(true);
            setError(null);

            try {
                const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
                if (!backendUrl) {
                    throw new Error('A URL do backend não está configurada.');
                }

                const response = await axios.get(`${backendUrl}/api/anuncios/noauth`, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                setAnuncios(response.data);
            } catch (error) {
                const errorMessage = error.response?.data?.message || 'Erro ao buscar anúncios';
                setError(errorMessage);
                console.error('Erro ao buscar anúncios:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAnuncios();
    }, []);

    return (
        <div className="flex flex-col min-h-screen">
            <NavBar />
            <div className="flex-grow py-12 bg-gray-100 dark:bg-gray-900">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <h1 className="text-2xl font-semibold mb-4 text-orange-500">Anúncios</h1>

                        {loading ? (
                            <p>Carregando...</p>
                        ) : error ? (
                            <p className="text-red-500">{error}</p>
                        ) : anuncios.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {anuncios.map(anuncio => (
                                    <div
                                        key={anuncio.id}
                                        className="bg-white dark:bg-gray-200 rounded-lg shadow-md p-4 transition-transform transform hover:scale-105"
                                    >
                                        <h2 className="text-gray-900 dark:text-gray-100 font-semibold text-lg">{anuncio.titulo}</h2>
                                        {anuncio.endereco && (
                                            <p className="text-gray-600 dark:text-gray-400">
                                                {anuncio.endereco.cidade}, CEP: {anuncio.endereco.cep}, Número: {anuncio.endereco.numero}, {anuncio.endereco.bairro}
                                            </p>
                                        )}
                                        <p className="text-gray-700 dark:text-gray-300">Capacidade: {anuncio.capacidade}</p>
                                        <p className="text-gray-700 dark:text-gray-300">{anuncio.descricao}</p>
                                        <p className="text-gray-700 dark:text-gray-300">Locador: {anuncio.usuario.nome}</p>
                                        <p className="text-gray-700 dark:text-gray-300">Valor: R$ {anuncio.valor.toFixed(2)}</p>
                                        <div className="mt-4">
                                            <a
                                                href={`/reservar/${anuncio.id}`}
                                                className="inline-block bg-blue-500 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-600 transition duration-200"
                                            >
                                                Reservar
                                            </a>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-700 dark:text-gray-300">Não possui nenhum anúncio.</p>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default HomePage;
