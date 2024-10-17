// src/pages/servicos/search.js
import React, { useEffect, useState } from 'react';
import NavBar from '../../components/NavBar'; 

const SearchServicos = () => {
    const [servicos, setServicos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchServicos = async () => {
            setLoading(true);
            try {
                const response = await fetch('http://localhost:8000/api/servicos', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                
                if (!response.ok) {
                    throw new Error('Erro ao buscar serviços');
                }

                const data = await response.json();
                setServicos(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchServicos();
    }, []);

    return (
        <div>
            <NavBar />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200 rounded-lg">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Meus Serviços</h2>

                            {loading && <p>Carregando serviços...</p>}
                            {error && <p className="text-red-500">{error}</p>}

                            {servicos.length > 0 ? (
                                <ul className="space-y-4">
                                    {servicos.map((servico) => (
                                        <li key={servico.id} className="border rounded-lg p-4">
                                            <h3 className="text-lg font-bold text-orange-500">{servico.nome}</h3>
                                            <p className="text-gray-700">{servico.descricao}</p>
                                            <p className="text-gray-500">Preço: R$ {servico.preco}</p>
                                            <p className="text-gray-500">Data de Disponibilidade: {servico.dataDisponibilidade.dia}</p>
                                            <p className="text-gray-500">Horário: {servico.dataDisponibilidade.horarioInicio} - {servico.dataDisponibilidade.horarioFim}</p>
                                            <div className="mt-4">
                                                <a
                                                    href={`/servicos/edit/${servico.id}`}
                                                    className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg"
                                                >
                                                    Editar
                                                </a>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-500">Nenhum serviço encontrado.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SearchServicos;
