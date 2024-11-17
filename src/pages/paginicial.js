import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import { useRouter } from 'next/router';
import { FunnelIcon } from '@heroicons/react/24/outline';
import { StarIcon } from '@heroicons/react/24/solid'; // Adicionando o ícone de estrela

const Paginicial = () => {
  const [anuncios, setAnuncios] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const anunciosPerPage = 8;
  const router = useRouter();
  const [filterOpen, setFilterOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      router.push('/login');
      return;
    }

    const fetchCategorias = async () => {
      try {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
        
        if (!backendUrl) {
          throw new Error('A URL do backend não está configurada.');
        }
        
        const categoriasResponse = await axios.get(`${backendUrl}/api/categoria`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (categoriasResponse.data && Array.isArray(categoriasResponse.data.categorias)) {
          setCategorias(categoriasResponse.data.categorias);
        }
      } catch (error) {
        const errorMessage = error.response
          ? error.response.data.message || 'Erro desconhecido ao buscar categorias.'
          : 'Erro ao buscar categorias.';
        setError(errorMessage);
        console.error('Erro ao buscar categorias:', error);
      }
    };

    fetchCategorias();
  }, [router]);

  useEffect(() => {
    const token = localStorage.getItem('token');
  
    const fetchAnuncios = async () => {
      try {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  
        if (!backendUrl) {
          throw new Error('A URL do backend não está configurada.');
        }
  
        const url = selectedCategory
          ? `${backendUrl}/api/anuncios/categoria/titulo/${selectedCategory}`
          : `${backendUrl}/api/anuncios`;
  
        const anunciosResponse = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
  
        if (anunciosResponse.data && Array.isArray(anunciosResponse.data.anuncios)) {
          const anunciosData = anunciosResponse.data.anuncios;
  
          // Buscar as médias de avaliações para cada anúncio
          const mediasAvaliacoesPromises = anunciosData.map((anuncio) =>
            axios.get(`${backendUrl}/api/anuncios/${anuncio.id}/avaliacoes`, {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            })
          );
  
          const mediasAvaliacoesResponse = await Promise.all(mediasAvaliacoesPromises);
  
          // Associar as médias de avaliações aos anúncios
          const anunciosComMedias = anunciosData.map((anuncio, index) => ({
            ...anuncio,
            media_avaliacoes: mediasAvaliacoesResponse[index].data.media_avaliacoes,
          }));
  
          setAnuncios(anunciosComMedias);
        } else {
          setAnuncios([]);
          console.log('Nenhum anúncio encontrado ou estrutura inesperada.');
        }
      } catch (error) {
        const errorMessage = error.response
          ? error.response.data.message || 'Erro desconhecido ao buscar dados.'
          : 'Erro ao buscar anúncios.';
        setError(errorMessage);
        console.error('Erro ao buscar dados:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchAnuncios();
  }, [selectedCategory, router]);
  

  const indexOfLastAnuncio = currentPage * anunciosPerPage;
  const indexOfFirstAnuncio = indexOfLastAnuncio - anunciosPerPage;
  const currentAnuncios = anuncios.slice(indexOfFirstAnuncio, indexOfLastAnuncio);

  const handleReservar = (anuncioId) => {
    router.push(`/agendados/create?anuncioId=${anuncioId}`);
  };

  const renderStars = (media) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <StarIcon
          key={i}
          className={`h-5 w-5 ${i <= media ? 'text-yellow-500' : 'text-gray-300'}`}
        />
      );
    }
    return stars;
  };
  

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <div className="flex-grow py-12 bg-gray-100 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-semibold mb-4 text-orange-500">Anúncios</h1>
              <div className="relative">
                <button onClick={() => setFilterOpen(!filterOpen)} className="flex items-center bg-gray-200 p-2 rounded-md">
                  <FunnelIcon className="h-5 w-5 text-gray-600" /><span className="ml-2 text-gray-700">Filtrar por Categoria</span>
                </button>
                {filterOpen && (
                  <div className="absolute z-10 bg-white border border-gray-300 rounded-lg shadow-md mt-2 w-48">
                    {categorias.map((categoria) => (
                      <div key={categoria.id} onClick={() => {
                          setSelectedCategory(categoria.titulo);
                          setFilterOpen(false);
                        }}
                        className="px-4 py-2 text-gray-700 cursor-pointer hover:bg-gray-100">
                        {categoria.titulo}
                      </div>
                    ))}
                    <div onClick={() => {
                        setSelectedCategory('');
                        setFilterOpen(false);
                      }}
                      className="px-4 py-2 text-gray-700 cursor-pointer hover:bg-gray-100">Todos
                    </div>
                  </div>
                )}
                {selectedCategory && (
                  <div className="mt-2 text-sm text-gray-600">
                    Categoria Selecionada: <strong>{selectedCategory}</strong>
                  </div>
                )}
              </div>
            </div>
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
                    
                        {/* Média de Avaliações com Estrelas */}
                        <div className="flex items-center">
                          {renderStars(anuncio.media_avaliacoes)}
                        </div>

                      {anuncio.imagens && anuncio.imagens.length > 0 ? (
                        <img src={anuncio.imagens[0].image_path} alt={anuncio.titulo} className="w-full h-32 object-cover mt-2"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/150';
                          }}/>
                      ) : (
                        <p className="text-gray-500">Imagem não disponível</p>
                      )}
                      <p className="text-gray-600 mt-2">Capacidade: {anuncio.capacidade || 'Capacidade não disponível'}</p>
                    </div>
                  ))}
                </div>
                <div className="flex justify-center mt-6">
                  <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1} className="px-4 py-2 text-white bg-blue-500 rounded-md">
                    Anterior
                  </button>
                  <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage * anunciosPerPage >= anuncios.length} className="ml-4 px-4 py-2 text-white bg-blue-500 rounded-md">
                    Próxima
                  </button>
                </div>
              </div>
            ) : (
              <p>Não há anúncios para exibir.</p>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Paginicial;
