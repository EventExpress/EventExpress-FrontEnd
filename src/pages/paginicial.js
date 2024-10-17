import React, { useEffect, useState } from 'react';
import NavBar from '../components/NavBar';
import { useSession } from 'next-auth/react';

const Paginicial = () => {
    const { data: session, status } = useSession();
    const [anuncios, setAnuncios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAnuncios = async () => {
            setLoading(true);
            setError(null);

            try {
                const token = session?.user?.token;
                console.log("Session:", session);
                console.log("Token:", token);

                if (!token) {
                    throw new Error('Token de acesso não encontrado.');
                }

                const response = await fetch('http://localhost:8000/api/anuncios', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                console.log("Response Status:", response.status);
                const data = await response.json();
                console.log("Response Data:", data);

                if (!response.ok) {
                    throw new Error('Erro ao buscar anúncios: ' + response.statusText);
                }

                setAnuncios(data);
            } catch (error) {
                setError(`Erro ao buscar anúncios: ${error.message}`);
                console.error('Erro ao buscar anúncios:', error);
            } finally {
                setLoading(false);
            }
        };

        if (session) {
            fetchAnuncios();
        } else {
            setLoading(false);
        }
    }, [session]); // Atualiza automaticamente quando a sessão muda

    // Força a atualização do componente quando o estado de autenticação muda para "authenticated"
    useEffect(() => {
        if (status === 'authenticated') {
            setLoading(true);
            // Simula uma atualização forçada do componente
            setTimeout(() => setLoading(false), 100);
        }
    }, [status]);

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
            <NavBar user={session?.user} /> {/* Passa o usuário para a NavBar */}
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <h1 className="text-2xl font-semibold mb-4 text-orange-500">Anúncios</h1>

                        {loading && <p className="text-gray-700 dark:text-gray-300">Carregando anúncios...</p>}
                        {error && <p className="text-red-500">{error}</p>}

                        {anuncios.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {anuncios.map(anuncio => (
                                    <div key={anuncio.id} className="bg-white dark:bg-gray-200 rounded-lg shadow-md p-4 transition-transform transform hover:scale-105">
                                        <h2 className="text-gray-900 dark:text-gray-100 font-semibold text-lg">{anuncio.titulo}</h2>
                                        <p className="text-gray-600 dark:text-gray-400">{anuncio.endereco.cidade}, CEP: {anuncio.endereco.cep}, Número: {anuncio.endereco.numero}, {anuncio.endereco.bairro}</p>
                                        <p className="text-gray-700 dark:text-gray-300">Capacidade: {anuncio.capacidade}</p>
                                        <p className="text-gray-700 dark:text-gray-300">{anuncio.descricao}</p>
                                        <p className="text-gray-700 dark:text-gray-300">Locador: {anuncio.usuario.nome}</p>
                                        <p className="text-gray-700 dark:text-gray-300">Valor: R$ {anuncio.valor.toFixed(2)}</p>
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
