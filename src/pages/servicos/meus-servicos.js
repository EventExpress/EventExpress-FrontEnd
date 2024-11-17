// src/pages/servicos/meus-servicos.js
import React, { useState, useEffect } from 'react';
import NavBar from '../../components/NavBar';
import Footer from '../../components/Footer';
import { useRouter } from 'next/router';
import axios from 'axios';

const MeusServicos = () => {
    const [servicos, setServicos] = useState([]);
    const [errors, setErrors] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchServicos = async () => {
            setLoading(true);
            setErrors([]);

            const token = localStorage.getItem('token');
            if (!token) {
                router.push('/login');
                return;
            }

            try {
                const response = await axios.get('http://localhost:8000/api/servicos/meus', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (response.status !== 200) {
                    setErrors(response.data.errors || ['Erro ao buscar serviços.']);
                } else {
                    const data = response.data.servicos;
                    setServicos(data);
                    if (data.length === 0) {
                        setErrors(['Nenhum serviço encontrado.']);
                    }
                }
            } catch (error) {
                console.error('Erro ao buscar serviços:', error);
                setErrors(['Erro ao buscar serviços.']);
            } finally {
                setLoading(false);
            }
        };

        fetchServicos();
    }, [router]);

    const handleDelete = async (id) => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
            return;
        }

        try {
            const response = await axios.delete(`http://localhost:8000/api/servicos/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 200) {
                setServicos(servicos.filter((servico) => servico.id !== id));
                alert('Serviço excluído com sucesso!');
            } else {
                setErrors(['Erro ao excluir serviço.']);
            }
        } catch (error) {
            console.error('Erro ao excluir serviço:', error);
            setErrors(['Erro ao excluir serviço.']);
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            <NavBar />
            <div className="py-12 flex-grow"> 
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

                                    <h1 className="text-2xl font-semibold mb-4 text-orange-500">Meus Serviços</h1>

                                    {servicos.length > 0 ? (
                                        <div className="space-y-4">
                                            {servicos.map((servico) => (
                                                <div key={servico.id} className="border rounded-lg p-4 bg-white dark:bg-gray-200 shadow-md">
                                                    <h3 className="text-lg font-bold text-orange-500">{servico.nome}</h3>
                                                    <p className="text-gray-700 dark:text-gray-300">{servico.descricao}</p>
                                                    <p className="text-gray-500">Preço: R$ {servico.valor}</p>
                                                    <p className="text-gray-500">Cidade: {servico.cidade}</p>
                                                    <p className="text-gray-500">Bairro: {servico.bairro}</p>

                                                    {servico.agenda && Array.isArray(JSON.parse(servico.agenda)) ? (
                                                        <div>
                                                            <p className="text-gray-500">Datas indisponíveis:</p>
                                                            <ul className="text-gray-500">
                                                                {JSON.parse(servico.agenda).map((data, index) => (
                                                                    <li key={index}>{data}</li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    ) : (
                                                        <p className="text-gray-500">Nenhuma data disponível.</p>
                                                    )}

                                                    <div className="mt-4 flex justify-between">
                                                        <button
                                                            onClick={() => router.push(`/servicos/edit?id=${servico.id}`)}
                                                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
                                                        >
                                                            Editar
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(servico.id)}
                                                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
                                                        >
                                                            Excluir
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-gray-500">Nenhum serviço encontrado.</p>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default MeusServicos;
