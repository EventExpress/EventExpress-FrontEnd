import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import { useRouter } from 'next/router';

const HomePage = () => {
  const [anuncios, setAnuncios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const anunciosPerPage = 10;
  const router = useRouter();

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

        if (response.data && Array.isArray(response.data.anuncios)) {
          setAnuncios(response.data.anuncios);
        } else {
          setAnuncios([]);
          console.log('Nenhum anúncio encontrado ou estrutura inesperada.');
        }

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

  const indexOfLastAnuncio = currentPage * anunciosPerPage;
  const indexOfFirstAnuncio = indexOfLastAnuncio - anunciosPerPage;
  const currentAnuncios = anuncios.slice(indexOfFirstAnuncio, indexOfLastAnuncio);

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <div className="flex-grow py-12 bg-gray-100 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6">
            <h1 className="text-2xl font-semibold mb-4 text-orange-500">Anúncios</h1>

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
                    <div key={anuncio.id} className="border rounded-lg p-4 shadow-md">
                      <h2 className="text-xl font-bold">{anuncio.titulo || 'Título não disponível'}</h2>
                      <p className="text-gray-700">{anuncio.descricao || 'Descrição não disponível'}</p>
                      <p className="text-lg font-semibold text-orange-500">
                        {anuncio.valor ? `R$${anuncio.valor} ` : 'Valor não disponível'}
                      </p>
                      {anuncio.imagens && anuncio.imagens.length > 0 ? (
                        <img
                          src={anuncio.imagens[0].image_path}
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
                      <p className="text-gray-600 mt-2">Capacidade: {anuncio.capacidade || 'Capacidade não disponível'}</p>
                      <p className="text-gray-600 mt-2">
                        Locador: {anuncio.usuario && anuncio.usuario.nome ? anuncio.usuario.nome : 'Locador não disponível'}
                      </p>
                      <a
                        href={`/login`}
                        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 inline-block"
                      >
                        Reservar
                      </a>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-4">
                  <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
                  >
                    Anterior
                  </button>
                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={indexOfLastAnuncio >= anuncios.length}
                    className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
                  >
                    Próximo
                  </button>
                </div>
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
