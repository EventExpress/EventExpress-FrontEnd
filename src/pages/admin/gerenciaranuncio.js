import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NavBar from '../../components/NavBar';
import Footer from '../../components/Footer';
import { useRouter } from 'next/router';
import { TrashIcon } from '@heroicons/react/24/outline';

const Paginicial = () => {
  const [anuncios, setAnuncios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      router.push('/login');
      return;
    }

    const fetchAnuncios = async () => {
      try {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

        if (!backendUrl) {
          throw new Error('A URL do backend não está configurada.');
        }

        const anunciosResponse = await axios.get(`${backendUrl}/api/anuncios`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        setAnuncios(anunciosResponse.data.anuncios || []);
      } catch (error) {
        setError('Erro ao buscar anúncios.');
      } finally {
        setLoading(false);
      }
    };

    fetchAnuncios();
  }, [router]);

  const handleDelete = async (anuncioId) => {
    const confirmDelete = confirm('Deseja realmente excluir este anúncio?');
    const token = localStorage.getItem('token');
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

    try {
      await axios.delete(`${backendUrl}/api/anuncios/${anuncioId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      setAnuncios(anuncios.filter((anuncio) => anuncio.id !== anuncioId));
      alert('Anúncio excluído com sucesso!');
    } catch (error) {
      alert('Erro ao excluir o anúncio.');
    }
  };

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
            ) : anuncios.length > 0 ? (
              <div className="flex flex-wrap gap-6">
                {anuncios.map((anuncio) => (
                  <div
                    key={anuncio.id}
                    className="flex flex-col bg-white dark:bg-gray-700 p-4 shadow-md rounded-lg border-2 border-orange-500"
                    style={{ width: 'calc(33.333% - 1rem)' }}
                  >
                    <img
                      src={anuncio.imagens?.[0]?.image_path || 'https://via.placeholder.com/150'}
                      alt={anuncio.titulo}
                      className="w-full h-32 object-cover rounded mb-4"
                    />
                    <h2 className="text-lg font-semibold">{anuncio.titulo}</h2>
                    <p className="text-gray-600 mb-2">{anuncio.descricao}</p>
                    <p><strong>ID:</strong> {anuncio.id}</p>
                    <p><strong>Status:</strong> {anuncio.status}</p>
                    <p><strong>Capacidade:</strong> {anuncio.capacidade}</p>
                    <p><strong>Valor:</strong> R${anuncio.valor}</p>
                    <p><strong>Endereço:</strong> {anuncio.endereco_id || 'Não informado'}</p>
                    <p>
                      <strong>Agenda:</strong>{' '}
                      {Array.isArray(JSON.parse(anuncio.agenda))
                        ? JSON.parse(anuncio.agenda).join(', ')
                        : 'Não informado'}
                    </p>
                    <p><strong>Usuário:</strong> {anuncio.user_id}</p>
                    <p>
                      <strong>Data de criação:</strong>{' '}
                      {new Date(anuncio.created_at).toLocaleString()}
                    </p>
                    <p>
                      <strong>Última atualização:</strong>{' '}
                      {new Date(anuncio.updated_at).toLocaleString()}
                    </p>
                    <button
                      onClick={() => handleDelete(anuncio.id)}
                      className="mt-4 bg-red-500 text-white py-2 px-4 rounded w-full"
                    >
                      <TrashIcon className="h-5 w-5 inline mr-1" /> Excluir
                    </button>
                  </div>
                ))}
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