import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import NavBar from '../../components/NavBar'; // Ajuste conforme a localização do seu componente

export default function MeusAnuncios() {
    const router = useRouter();
    const [anuncios, setAnuncios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [confirmDelete, setConfirmDelete] = useState(null); // Estado para controle de confirmação

    useEffect(() => {
        // Acessando o token diretamente do localStorage manualmente
        const token = localStorage.getItem('token');

        if (!token) {
            // Se não houver token, redireciona para login
            router.push('/login');
            return;
        }

        // Função para buscar anúncios do usuário autenticado
        const fetchAnuncios = async () => {
            setLoading(true);
            try {
                // Realizando a requisição com o token manualmente no cabeçalho
                const response = await axios.get('http://localhost:8000/api/anuncios/meus', {
                    headers: {
                        Authorization: `Bearer ${token}`, // Usando o token no cabeçalho
                    },
                });

                if (response && response.data && Array.isArray(response.data.anuncios)) {
                    setAnuncios(response.data.anuncios);
                    setErrorMessage('');
                } else {
                    setErrorMessage('Nenhum anúncio encontrado.');
                }
            } catch (error) {
                console.error('Erro na requisição:', error);
                if (error.response) {
                    setErrorMessage(`Erro na requisição: ${error.response.data.message || error.response.statusText}`);
                } else {
                    setErrorMessage('Erro ao conectar com o servidor.');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchAnuncios();
    }, [router]);

    // Função para excluir anúncio
    const handleDelete = async (anuncioId) => {
        setConfirmDelete(anuncioId); // Definir o ID do anúncio que está sendo excluído
    };

    const confirmDeletion = async (anuncioId) => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
            return;
        }

        try {
            const response = await axios.delete(`http://localhost:8000/api/anuncios/${anuncioId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data.status) {
                setSuccessMessage('Anúncio excluído com sucesso!');
                setAnuncios(anuncios.filter(anuncio => anuncio.id !== anuncioId));
                setConfirmDelete(null); // Resetar a confirmação após a exclusão
            } else {
                setErrorMessage('Erro ao excluir o anúncio.');
            }
        } catch (error) {
            setErrorMessage('Erro ao excluir o anúncio.');
            console.error('Erro ao excluir anúncio:', error);
        }
    };

    const cancelDeletion = () => {
        setConfirmDelete(null); // Cancelar a exclusão
    };

    // Função para editar anúncio
    const handleEdit = (anuncioId) => {
        router.push(`/anuncios/edit/${anuncioId}`);
    };

    return (
        <div className="flex flex-col min-h-screen">
            <NavBar />
            <div className="flex-grow py-12 bg-gray-100 dark:bg-gray-900">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <h1 className="text-2xl font-semibold mb-4 text-orange-500">Meus Anúncios</h1>

                        {loading ? (
                            <div className="flex justify-center items-center">
                                <p>Carregando anúncios...</p>
                            </div>
                        ) : errorMessage ? (
                            <p className="text-red-500">{errorMessage}</p>
                        ) : anuncios.length > 0 ? (
                            <div>
                                {anuncios.map((anuncio) => (
                                    <div key={anuncio.id} className="border rounded-lg p-4 shadow-md mb-6 bg-gray-100 dark:bg-gray-800">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                                            <div className="col-span-2">
                                                <p><span className="font-semibold">Título do anúncio:</span> {anuncio.titulo}</p>
                                                <p><span className="font-semibold">Descrição do anúncio:</span> {anuncio.descricao}</p>
                                                <p><span className="font-semibold">Valor do anúncio:</span> {anuncio.valor}</p>
                                                <p><span className="font-semibold">Capacidade do anúncio:</span> {anuncio.capacidade}</p>
                                                {anuncio?.imagens && anuncio.imagens.length > 0 ? (
                                                        <img
                                                            src={anuncio.imagens[0].image_path}
                                                            alt={anuncio.titulo}
                                                            className="mt-4 w-64 h-64 object-cover rounded-md"
                                                        />
                                                    ) : (
                                                        <p>Imagem não disponível</p>
                                                    )}
                                            </div>
                                            <div>
                                                <div className="mt-4">
                                                    <button
                                                        onClick={() => handleEdit(anuncio.id)}
                                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                                    >
                                                        Editar Anúncio
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(anuncio.id)}
                                                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 ml-4"
                                                    >
                                                        Excluir Anúncio
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p>Não há anúncios para exibir.</p>
                        )}

                        {successMessage && <p className="text-green-500 mt-4">{successMessage}</p>}

                        {/* Confirmação de Exclusão */}
                        {confirmDelete && (
                            <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
                                <div className="bg-white p-6 rounded-lg shadow-md">
                                    <h3 className="text-xl font-semibold mb-4">Tem certeza que deseja excluir este anúncio?</h3>
                                    <div className="flex justify-between">
                                        <button
                                            onClick={() => confirmDeletion(confirmDelete)}
                                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                                        >
                                            Sim, Excluir
                                        </button>
                                        <button
                                            onClick={cancelDeletion}
                                            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                                        >
                                            Cancelar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
