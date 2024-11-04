import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../app/context/AuthContext'; // Ajuste aqui
import NavBar from '../components/NavBar';
import Footer from '../components/Footer'; // Importando o Footer
import dynamic from 'next/dynamic';

const Relatorios = () => {
    const { user } = useAuth(); 
    const router = useRouter();
    const [dadosBrutos, setDadosBrutos] = useState({
        anuncios: [
            { categoria: 'Casamento', titulo: 'Salão de Casamentos' },
            { categoria: 'Aniversário', titulo: 'Espaço para Aniversários' },
            { categoria: 'Reuniões', titulo: 'Auditório para Reuniões' },
            { categoria: 'Festa Infantil', titulo: 'Parque de Diversões' },
            { categoria: 'Formatura', titulo: 'Espaço para Formaturas' },
        ],
        locacoes: [
            { data: '2024-01-15' },
            { data: '2024-01-25' },
            { data: '2024-02-05' },
            { data: '2024-02-20' },
            { data: '2024-02-28' },
            { data: '2024-03-10' },
            { data: '2024-03-15' },
            { data: '2024-03-30' },
            { data: '2024-04-05' },
            { data: '2024-04-15' },
            { data: '2024-05-10' },
            { data: '2024-05-25' },
            { data: '2024-06-12' },
            { data: '2024-07-07' },
            { data: '2024-08-08' },
            { data: '2024-09-09' },
        ],
        servicos: [
            { nome: 'Motorista' },
            { nome: 'Decoração' },
            { nome: 'Segurança' },
            { nome: 'Fotografia' },
            { nome: 'Sonorização' },
            { nome: 'Iluminação' },
            { nome: 'Transporte' },
        ],
    });

    const [dadosGraficos, setDadosGraficos] = useState({
        categoriasAnuncios: [],
        locacoesPorMes: [],
        servicosMaisContratados: [],
        lucrosAnuncios: [], 
    });

    const [abaAtiva, setAbaAtiva] = useState('locatario'); 

    const processarDados = () => {
        const categoriasContagem = dadosBrutos.anuncios.reduce((acc, anuncio) => {
            acc[anuncio.categoria] = (acc[anuncio.categoria] || 0) + Math.floor(Math.random() * 10) + 1; 
            return acc;
        }, {});
        const categoriasAnuncios = Object.keys(categoriasContagem).map(categoria => ({
            categoria,
            quantidade: categoriasContagem[categoria],
        }));

        const locacoesPorMesContagem = dadosBrutos.locacoes.reduce((acc, locacao) => {
            const mes = new Date(locacao.data).toLocaleString('default', { month: 'long', year: 'numeric' });
            acc[mes] = (acc[mes] || 0) + Math.floor(Math.random() * 8) + 1; 
            return acc;
        }, {});
        const locacoesPorMes = Object.keys(locacoesPorMesContagem).map(mes => ({
            mes,
            quantidade: locacoesPorMesContagem[mes],
        }));

        const servicosContagem = dadosBrutos.servicos.reduce((acc, servico) => {
            acc[servico.nome] = (acc[servico.nome] || 0) + Math.floor(Math.random() * 8) + 1; 
            return acc;
        }, {});
        const servicosMaisContratados = Object.keys(servicosContagem).map(servico => ({
            servico,
            quantidade: servicosContagem[servico],
        }));

        const lucrosAnuncios = [2000, 3000, 2500, 4000, 3500, 5000];

        setDadosGraficos({
            categoriasAnuncios,
            locacoesPorMes,
            servicosMaisContratados,
            lucrosAnuncios, 
        });
    };

    const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

    useEffect(() => {
        processarDados(); 
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col">
            <NavBar user={user} />
            <div className="flex-grow py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 flex">
                    <div className="w-1/4 mr-4"> 
                        <h2 className="text-lg font-semibold mb-4">Navegação</h2>
                        <button
                            onClick={() => setAbaAtiva('locatario')}
                            className={`block w-full mb-2 px-4 py-2 rounded-lg ${abaAtiva === 'locatario' ? 'bg-orange-500 text-white' : 'bg-gray-200'}`}
                        >
                            Locatário
                        </button>
                        {user?.tipo === 'admin' && ( // Verifica se o usuário é admin
                            <button
                                onClick={() => setAbaAtiva('admin')}
                                className={`block w-full px-4 py-2 rounded-lg ${abaAtiva === 'admin' ? 'bg-orange-500 text-white' : 'bg-gray-200'}`}
                            >
                                Admin
                            </button>
                        )}
                    </div>
                    <div className="w-3/4">
                        <h1 className="text-2xl font-semibold mb-4 text-orange-500">Relatórios</h1>

                        {abaAtiva === 'locatario' ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-4">
                                    <h2 className="text-lg font-semibold mb-2">Categorias de Anúncios Mais Locados</h2>
                                    <Chart
                                        options={{
                                            chart: { type: 'pie' },
                                            labels: dadosGraficos.categoriasAnuncios.map(item => item.categoria),
                                        }}
                                        series={dadosGraficos.categoriasAnuncios.map(item => item.quantidade)}
                                        type="pie"
                                        width="100%"
                                    />
                                </div>
                                <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-4">
                                    <h2 className="text-lg font-semibold mb-2">Locações por Mês</h2>
                                    <Chart
                                        options={{
                                            chart: { type: 'bar' },
                                            xaxis: { categories: dadosGraficos.locacoesPorMes.map(item => item.mes) },
                                        }}
                                        series={[{ name: 'Locações', data: dadosGraficos.locacoesPorMes.map(item => item.quantidade) }]}
                                        type="bar"
                                        width="100%"
                                    />
                                </div>
                                <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-4">
                                    <h2 className="text-lg font-semibold mb-2">Serviços Mais Contratados</h2>
                                    <Chart
                                        options={{
                                            chart: { type: 'bar' },
                                            xaxis: { categories: dadosGraficos.servicosMaisContratados.map(item => item.servico) },
                                        }}
                                        series={[{ name: 'Contratações', data: dadosGraficos.servicosMaisContratados.map(item => item.quantidade) }]}
                                        type="bar"
                                        width="100%"
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-4">
                                    <h2 className="text-lg font-semibold mb-2">Lucros de Anúncios</h2>
                                    <Chart
                                        options={{
                                            chart: { type: 'line' },
                                            xaxis: { categories: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho'] },
                                        }}
                                        series={[{ name: 'Lucros', data: dadosGraficos.lucrosAnuncios }]}
                                        type="line"
                                        width="100%"
                                    />
                                </div>
                                <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-4">
                                    <h2 className="text-lg font-semibold mb-2">Lucros por Tipo de Serviço</h2>
                                    <Chart
                                        options={{
                                            chart: { type: 'bar' },
                                            xaxis: { categories: ['Serviço A', 'Serviço B', 'Serviço C'] },
                                        }}
                                        series={[{ name: 'Lucros', data: [5000, 7000, 3000] }]}
                                        type="bar"
                                        width="100%"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Footer /> {/* Adicionando o Footer */}
        </div>
    );
};

export default Relatorios;
