import React, { useEffect, useState } from 'react';
import NavBar from '../../components/NavBar'; // Ajuste o caminho conforme necessário
import { useSession } from 'next-auth/react';
import axios from 'axios';

const AnunciosPage = () => {
    const { data: session } = useSession(); // Obtém a sessão do usuário
    const [anuncios, setAnuncios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAnuncios = async () => {
            setLoading(true);
            setError(null); // Reseta o erro

            try {
                console.log('Backend URL:', process.env.NEXT_PUBLIC_BACKEND_URL);

                // Faz a requisição para buscar os anúncios
                const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/anuncios`, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                console.log('Resposta da API:', response.data);

                if (response.data.status === 'success' && response.data.data) {
                    setAnuncios(response.data.data); // Use 'data' ou ajuste conforme necessário
                } else {
                    console.log('Nenhum anúncio encontrado.');
                    setAnuncios([]); // Define um array vazio se não houver anúncios
                }
            } catch (error) {
                console.error('Erro ao buscar anúncios:', error);
                setError(error.response?.data?.message || 'Erro ao buscar anúncios');
            } finally {
                setLoading(false); // Finaliza o estado de carregamento
            }
        };

        fetchAnuncios();
    }, []); // Dependências vazias para chamar apenas uma vez na montagem

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
                                {anuncios.map((anuncio) => (
                                    <div key={anuncio.id} className="bg-white dark:bg-gray-800 p-4 rounded shadow">
                                        <h2 className="text-xl font-bold">{anuncio.titulo}</h2>
                                        <p className="text-gray-700 dark:text-gray-300">Cidade: {anuncio.cidade}</p>
                                        <p className="text-gray-700 dark:text-gray-300">CEP: {anuncio.cep}</p>
                                        <p className="text-gray-700 dark:text-gray-300">Número: {anuncio.numero}</p>
                                        <p className="text-gray-700 dark:text-gray-300">Bairro: {anuncio.bairro}</p>
                                        <p className="text-gray-700 dark:text-gray-300">Capacidade: {anuncio.capacidade}</p>
                                        <p className="text-gray-700 dark:text-gray-300">Descrição: {anuncio.descricao}</p>
                                        <p className="text-gray-700 dark:text-gray-300">Valor: R$ {anuncio.valor.toFixed(2)}</p>
                                        <p className="text-gray-700 dark:text-gray-300">Data da Agenda: {anuncio.agenda}</p>
                                        <p className="text-gray-700 dark:text-gray-300">Categorias: {anuncio.categoriaId.join(', ')}</p>
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

export default AnunciosPage;
