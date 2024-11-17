import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';

const AnunciosIndex = () => {
    const router = useRouter();
    const { search } = router.query; // Obter o parâmetro de busca da URL
    const [anuncios, setAnuncios] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (search) {
            // Fazer a requisição para a API quando o parâmetro 'search' estiver presente
            const fetchAnuncios = async () => {
                try {
                    const response = await axios.get('http://localhost:8000/api/anuncios/show', {
                        params: { search },
                    });
                    setAnuncios(response.data.results);
                } catch (error) {
                    console.error('Erro ao buscar anúncios:', error);
                } finally {
                    setLoading(false);
                }
            };
            fetchAnuncios();
        }
    }, [search]);

    if (loading) {
        return <div>Carregando anúncios...</div>;
    }

    if (!anuncios.length) {
        return <div>Nenhum anúncio encontrado.</div>;
    }

    return (
        <div>
            <h1>Resultados da Busca</h1>
            <ul>
                {anuncios.map((anuncio) => (
                    <li key={anuncio.id}>
                        <h2>{anuncio.titulo}</h2>
                        <p>{anuncio.descricao}</p>
                        <p>Capacidade: {anuncio.capacidade}</p>
                        <p>Valor: R$ {anuncio.valor}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AnunciosIndex;
