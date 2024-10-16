// src/pages/anuncios/meus-anuncios.js
import React, { useState, useEffect } from 'react';
import NavBar from '../../components/NavBar'; // Caminho corrigido
import { useRouter } from 'next/router';

const MeusAnuncios = () => {
    const [anuncios, setAnuncios] = useState([]);
    const [errors, setErrors] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchUserAnuncios = async () => {
            setLoading(true);
            setErrors([]);

            const token = localStorage.getItem('token');
            if (!token) {
                // Se o token não estiver presente, redireciona para login
                router.push('/login');
                return;
            }

            try {
                const userResponse = await fetch('http://localhost:8000/api/user', {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (userResponse.ok) {
                    const userData = await userResponse.json();

                    if (userData.tipousu !== 'Locador') {
                        // Se o usuário não for do tipo "Locador", exibe erro e não continua
                        setErrors(['Acesso negado. Apenas locadores podem acessar esta página.']);
                        setLoading(false);
                        return;
                    }

                    // Busca os anúncios criados pelo locador
                    const response = await fetch('http://localhost:8000/api/anuncio/meus-anuncios', {
                        method: 'GET',
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    });

                    const data = await response.json();

                    if (response.ok) {
                        setAnuncios(data);
                        if (data.length === 0) {
                            setErrors(['Nenhum anúncio encontrado.']);
                        }
                    } else {
                        setErrors(data.errors || ['Erro ao buscar anúncios.']);
                    }
                } else {
                    setErrors(['Erro ao buscar informações do usuário.']);
                    router.push('/login'); // Redireciona para login em caso de erro de autenticação
                }
            } catch (error) {
                console.error('Erro ao buscar anúncios:', error);
                setErrors(['Erro ao buscar anúncios.']);
            }
            setLoading(false);
        };

        fetchUserAnuncios();
    }, [router]);

    return (
        <div>
            <NavBar /> {/* Adiciona a NavBar */}
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            {loading ? (
                                <p>Carregando...</p>
                            ) : (
                                <>
                                    {errors.length > 0 && (
                                        <div className="alert alert-danger mb-4">
                                            <ul>
                                                {errors.map((error, index) => (
                                                    <li key={index}>{error}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    <h1 className="text-2xl font-semibold mb-4 text-orange-500">Meus Anúncios</h1>

                                    {anuncios.length > 0 && (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                            {anuncios.map((anuncio) => (
                                                <div key={anuncio.id} className="bg-white dark:bg-gray-200 rounded-lg shadow-md p-4">
                                                    <p className="text-gray-900 dark:text-gray-100 font-semibold">{anuncio.titulo}</p>
                                                    <p className="text-gray-600 dark:text-gray-400">{anuncio.endereco.cidade}, CEP: {anuncio.endereco.cep}, Número: {anuncio.endereco.numero}, {anuncio.endereco.bairro}</p>
                                                    <p className="text-gray-700 dark:text-gray-300">Capacidade: {anuncio.capacidade}</p>
                                                    <p className="text-gray-700 dark:text-gray-300">{anuncio.descricao}</p>
                                                    <p className="text-gray-700 dark:text-gray-300">Valor: {anuncio.valor}</p>

                                                    <div className="mt-4">
                                                        {anuncio.categoria.map((categoria) => (
                                                            <span key={categoria.id} className="bg-gray-200 text-gray-700 dark:text-gray-300 px-2 py-1 text-xs rounded">{categoria.titulo}</span>
                                                        ))}
                                                    </div>

                                                    <div className="mt-4">
                                                        <a href={`/anuncio/edit/${anuncio.id}`} className="inline-block bg-blue-500 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-600">Editar</a>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MeusAnuncios;
