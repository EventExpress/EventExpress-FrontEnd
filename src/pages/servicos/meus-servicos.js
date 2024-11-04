// src/pages/servicos/meus-servicos.js
import React, { useState, useEffect } from 'react';
import NavBar from '../../components/NavBar'; // Importa a NavBar
import Footer from '../../components/Footer'; // Importa o Footer
import { useRouter } from 'next/router';

const MeusServicos = () => {
    const [servicos, setServicos] = useState([]);
    const [errors, setErrors] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchUserServicos = async () => {
            setLoading(true);
            setErrors([]);

            const token = localStorage.getItem('token');
            if (!token) {
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

                if (!userResponse.ok) {
                    const errorData = await userResponse.json();
                    setErrors(['Erro ao buscar dados do usuário: ' + (errorData.message || 'Desconhecido')]);
                    setLoading(false);
                    return;
                }

                const userData = await userResponse.json();

                if (userData.tipousu !== 'Prestador') {
                    setErrors(['Acesso negado. Apenas prestadores podem acessar esta página.']);
                    setLoading(false);
                    return;
                }

                // Busca os serviços criados pelo prestador
                const response = await fetch('http://localhost:8000/api/servicos/meus-servicos', {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    setErrors(errorData.errors || ['Erro ao buscar serviços.']);
                } else {
                    const data = await response.json();
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

        fetchUserServicos();
    }, [router]);

    return (
        <div className="flex flex-col min-h-screen"> {/* Garante que o footer fique na parte inferior */}
            <NavBar /> {/* Adiciona a NavBar */}
            <div className="py-12 flex-grow"> {/* Permite que o conteúdo ocupe o espaço restante */}
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
                                                    <p className="text-gray-500">Preço: R$ {servico.preco}</p>
                                                    <p className="text-gray-500">
                                                        Data de Disponibilidade: {servico.dataDisponibilidade.dia}
                                                    </p>
                                                    <p className="text-gray-500">
                                                        Horário: {servico.dataDisponibilidade.horarioInicio} - {servico.dataDisponibilidade.horarioFim}
                                                    </p>
                                                    <div className="mt-4">
                                                        <a
                                                            href={`/servicos/edit/${servico.id}`}
                                                            className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg"
                                                        >
                                                            Editar
                                                        </a>
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
            <Footer /> {/* Adiciona o Footer */}
        </div>
    );
};

export default MeusServicos;
