// src/pages/relatorios.js
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import NavBar from '../components/NavBar';
import dynamic from 'next/dynamic';

const Relatorios = () => {
    const { user } = useAuth(); // Usando o hook useAuth para acessar o contexto
    const router = useRouter();
    const [dadosGraficos, setDadosGraficos] = useState({
        categoriasAnuncios: [],
        locacoesPorMes: [],
        servicosMaisContratados: [],
    });

    //useEffect(() => {
    //    if (!user || user.tipo !== 'admin') {
    //        router.push('/'); // Redireciona para a página inicial se não for admin
    //    } else {
    //        // Buscar os dados para os gráficos quando o usuário for admin
    //        fetchDadosGraficos();
    //    }
    //}, [user, router]);

    const fetchDadosGraficos = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/relatorios');
            const data = await response.json();
            setDadosGraficos({
                categoriasAnuncios: data.categoriasAnuncios,
                locacoesPorMes: data.locacoesPorMes,
                servicosMaisContratados: data.servicosMaisContratados,
            });
        } catch (error) {
            console.error('Erro ao buscar dados dos relatórios:', error);
        }
    };

    const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
            <NavBar user={user} />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <h1 className="text-2xl font-semibold mb-4 text-orange-500">Relatórios</h1>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Gráfico de categorias de anúncios mais locados */}
                            <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-4">
                                <h2 className="text-lg font-semibold mb-2">Categorias de Anúncios Mais Locados</h2>
                                <Chart
                                    options={{
                                        chart: {
                                            type: 'pie',
                                        },
                                        labels: dadosGraficos.categoriasAnuncios.map(item => item.categoria),
                                    }}
                                    series={dadosGraficos.categoriasAnuncios.map(item => item.quantidade)}
                                    type="pie"
                                    width="100%"
                                />
                            </div>

                            {/* Gráfico de locações por mês */}
                            <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-4">
                                <h2 className="text-lg font-semibold mb-2">Locações por Mês</h2>
                                <Chart
                                    options={{
                                        chart: {
                                            type: 'bar',
                                        },
                                        xaxis: {
                                            categories: dadosGraficos.locacoesPorMes.map(item => item.mes),
                                        },
                                    }}
                                    series={[
                                        {
                                            name: 'Locações',
                                            data: dadosGraficos.locacoesPorMes.map(item => item.quantidade),
                                        },
                                    ]}
                                    type="bar"
                                    width="100%"
                                />
                            </div>

                            {/* Gráfico de serviços mais contratados */}
                            <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-4">
                                <h2 className="text-lg font-semibold mb-2">Serviços Mais Contratados</h2>
                                <Chart
                                    options={{
                                        chart: {
                                            type: 'bar',
                                        },
                                        xaxis: {
                                            categories: dadosGraficos.servicosMaisContratados.map(item => item.servico),
                                        },
                                    }}
                                    series={[
                                        {
                                            name: 'Contratações',
                                            data: dadosGraficos.servicosMaisContratados.map(item => item.quantidade),
                                        },
                                    ]}
                                    type="bar"
                                    width="100%"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Relatorios;
