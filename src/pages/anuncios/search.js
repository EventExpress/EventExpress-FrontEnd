// src/pages/anuncio/search.js
import React, { useState } from 'react';
import NavBar from '../../components/NavBar'; // Importa a NavBar

const SearchAnuncio = () => {
    const [query, setQuery] = useState('');  // Controla a busca do usuário
    const [results, setResults] = useState([]);  // Armazena os resultados da busca
    const [errors, setErrors] = useState([]);  // Armazena erros ao buscar
    const [loading, setLoading] = useState(false);  // Controla o estado de carregamento

    // Função de busca de anúncios
    const handleSearch = async (e) => {
        e.preventDefault();
        setErrors([]);
        setLoading(true);

        try {
            const response = await fetch(`http://localhost:8000/api/anuncios/search?query=${query}`);
            const data = await response.json();

            if (response.ok) {
                setResults(data);
                if (data.length === 0) {
                    setErrors(['Nenhum anúncio encontrado.']);
                }
            } else {
                setErrors(data.errors || ['Erro ao buscar anúncios.']);
            }
        } catch (error) {
            console.error('Erro ao buscar anúncios:', error);
            setErrors(['Erro ao buscar anúncios.']);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <NavBar /> {/* Adiciona a NavBar */}
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            {errors.length > 0 && (
                                <div className="alert alert-danger mb-4">
                                    <ul>
                                        {errors.map((error, index) => (
                                            <li key={index}>{error}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            <h1 className="text-2xl font-semibold mb-4 text-orange-500">Busca de Anúncios</h1>

                            {/* Formulário de busca */}
                            <form onSubmit={handleSearch} className="mb-6">
                                <input
                                    type="text"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Digite o título ou descrição do anúncio"
                                    className="border border-gray-300 rounded-lg p-2 w-full"
                                    required
                                />
                                <button
                                    type="submit"
                                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200 mt-2"
                                    disabled={loading}
                                >
                                    {loading ? 'Buscando...' : 'Buscar'}
                                </button>
                            </form>

                            {/* Exibindo os resultados */}
                            {results.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {results.map((anuncio) => (
                                        <div key={anuncio.id} className="bg-white dark:bg-gray-200 rounded-lg shadow-md p-4">
                                            <p className="text-gray-900 dark:text-gray-100 font-semibold">{anuncio.titulo}</p>
                                            <p className="text-gray-600 dark:text-gray-400">
                                                {anuncio.endereco.cidade}, CEP: {anuncio.endereco.cep}, Número: {anuncio.endereco.numero}, {anuncio.endereco.bairro}
                                            </p>
                                            <p className="text-gray-700 dark:text-gray-300">Capacidade: {anuncio.capacidade}</p>
                                            <p className="text-gray-700 dark:text-gray-300">{anuncio.descricao}</p>
                                            <p className="text-gray-700 dark:text-gray-300">Locador: {anuncio.usuario.nome}</p>
                                            <p className="text-gray-700 dark:text-gray-300">Valor: {anuncio.valor}</p>

                                            <div className="mt-4">
                                                {anuncio.categoria.map((categoria) => (
                                                    <span key={categoria.id} className="bg-gray-200 text-gray-700 dark:text-gray-300 px-2 py-1 text-xs rounded">{categoria.titulo}</span>
                                                ))}
                                            </div>

                                            <div className="mt-4">
                                                <a href={`/agendado/create?anuncioId=${anuncio.id}`} className="inline-block bg-blue-500 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-600">Reservar</a>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                !loading && <p className="text-gray-600 dark:text-gray-400">Nenhum anúncio encontrado. Tente uma nova busca.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SearchAnuncio;
