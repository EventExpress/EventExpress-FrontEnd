import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import NavBar from '../../components/NavBar';
import Footer from '../../components/Footer';

const AnunciosIndex = () => {
  const router = useRouter();
  const { search } = router.query;
  const [anuncios, setAnuncios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const anunciosPerPage = 8;
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (search) {
      const fetchAnuncios = async () => {
        try {
          const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

          if (!backendUrl) {
            throw new Error('A URL do backend não está configurada.');
          }

          const token = localStorage.getItem('token');

          if (!token) {
            setError('Token de autenticação não encontrado.');
            setLoading(false);
            return;
          }

          const response = await axios.get(`${backendUrl}/api/anuncios/show`, {
            params: { search },
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          console.log('Resposta da API (Anúncios):', response.data);

          if (response.data && Array.isArray(response.data.results)) {
            const anunciosData = response.data.results;

            const anunciosComLocadores = await Promise.all(anunciosData.map(async (anuncio) => {
              try {
                const locadorResponse = await axios.get(`${backendUrl}/api/user/${anuncio.user_id}`, {
                  headers: {
                    'Authorization': `Bearer ${token}`,
                  },
                });
                return { ...anuncio, user: locadorResponse.data.user };
              } catch (locadorError) {
                console.error('Erro ao buscar locador:', locadorError);
                return { ...anuncio, user: null };
              }
            }));

            setAnuncios(anunciosComLocadores);
          } else {
            setAnuncios([]);
          }
        } catch (error) {
          setError('Erro ao buscar anúncios.');
          console.error('Erro ao buscar anúncios:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchAnuncios();
    } else {
      setLoading(false);
    }
  }, [search]);

  const indexOfLastAnuncio = currentPage * anunciosPerPage;
  const indexOfFirstAnuncio = indexOfLastAnuncio - anunciosPerPage;
  const currentAnuncios = anuncios.slice(indexOfFirstAnuncio, indexOfLastAnuncio);

  const handleReservar = (anuncioId) => {
    router.push(`/agendados/create?anuncioId=${anuncioId}`);
  };


  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <div className="flex-grow py-12 bg-gray-100 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6">
            <h1 className="text-2xl font-semibold mb-4 text-orange-500">Resultados da Busca</h1>
            {loading ? (
              <div className="flex justify-center items-center">
                <p>Carregando anúncios...</p>
              </div>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : currentAnuncios.length > 0 ? (
              <div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {currentAnuncios.map(anuncio => (
                    <div key={anuncio.id} className="border rounded-lg p-4 shadow-md cursor-pointer" onClick={() => handleReservar(anuncio.id)}>
                      <h2 className="text-xl font-bold">{anuncio.titulo || 'Título não disponível'}</h2>
                      <p className="text-gray-700">{anuncio.descricao ? `${anuncio.descricao.slice(0, 50)}${anuncio.descricao.length > 50 ? '...' : ''}` : 'Descrição não disponível'}</p>
                      <p className="text-lg font-semibold text-orange-500"> {anuncio.valor ? `R$${anuncio.valor} ` : 'Valor não disponível'} </p>   
                      {anuncio.imagens && anuncio.imagens.length > 0 ? (
                        <img 
                          src={`${backendUrl}${anuncio.imagens[0].image_path}`} 
                          alt={anuncio.titulo} 
                          className="w-full h-32 object-cover mt-2"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/150';
                          }}
                        />
                      ) : (
                        <p className="text-gray-500">Imagem não disponível</p>
                      )}

                      {anuncio.user ? (
                        <div className="mt-2 text-gray-600">
                          <p><strong>Locador:</strong> {anuncio.user.nome} {anuncio.user.sobrenome}</p>
                        </div>
                      ) : (
                        <p className="text-gray-500">Locador não disponível</p>
                      )}

                      <button 
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          handleReservar(anuncio.id);
                        }}
                        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                        Reservar
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-4">
                  <button 
                    onClick={() => setCurrentPage(currentPage - 1)} 
                    disabled={currentPage === 1}
                    className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50">
                    Anterior
                  </button>
                  <button 
                    onClick={() => setCurrentPage(currentPage + 1)} 
                    disabled={currentAnuncios.length < anunciosPerPage}
                    className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50">
                    Próximo
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">Nenhum anúncio encontrado.</p>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AnunciosIndex;
