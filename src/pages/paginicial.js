// pages/paginicial.js
import { useEffect, useState } from 'react';
import AnuncioCard from '@/components/AnuncioCard'; // Ajuste o caminho conforme necessário
import { useRouter } from 'next/router';

const Paginicial = () => {
    const [anuncios, setAnuncios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter(); // Instância do router

    useEffect(() => {
        const fetchAnuncios = async () => {
            const token = localStorage.getItem('auth_token'); // Obter token do localStorage
            if (!token) {
                router.push('/login'); // Redirecionar para o login se não houver token
                return;
            }

            try {
                // Aqui está a chamada GET à API com o token no cabeçalho
                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/anuncios`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`, // Adicionando o cabeçalho de autorização
                    },
                });
                if (!response.ok) {
                    throw new Error(`Erro: ${response.status} ${response.statusText}`);
                }
                const data = await response.json();
                setAnuncios(data.anuncios); // Assume que os anúncios estão em data.anuncios
            } catch (error) {
                setError(`Erro ao buscar anúncios: ${error.message}`);
            } finally {
                setLoading(false); // Finaliza o loading
            }
        };

        fetchAnuncios(); // Chama a função para buscar os anúncios
    }, []); // Executa apenas uma vez ao montar o componente

    if (loading) return <p>Loading...</p>; // Mensagem de loading
    if (error) return <p>{error}</p>; // Mensagem de erro

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Anúncios</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {anuncios.map((anuncio) => (
                    <AnuncioCard key={anuncio.id} anuncio={anuncio} />
                ))}
            </div>
        </div>
    );
};

export default Paginicial;
