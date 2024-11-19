import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../app/context/AuthContext'; // Ajuste aqui
import NavBar from '../../components/NavBar';
import Footer from '../../components/Footer'; // Importando o Footer
import dynamic from 'next/dynamic';

const RelatoriosPrestador = () => {
    const { user } = useAuth();
    const router = useRouter();
    const [dadosBrutos, setDadosBrutos] = useState({
        servicos: [
            { id: 1, categoria: 'Serviço de Bar', titulo: 'Garçom' },
            { id: 2, categoria: 'Manobrista', titulo: 'Manobrista' },
            { id: 3, categoria: 'Buffet', titulo: 'Buffet' },
            { id: 4, categoria: 'Decoração de Eventos', titulo: 'Decoração' },
            { id: 5, categoria: 'Música ao Vivo', titulo: 'Músico' },
            { id: 6, categoria: 'Fotografia e Filmagem', titulo: 'Fotógrafo' },
            { id: 7, categoria: 'Locação de Mobiliário', titulo: 'Mobiliário' },
            { id: 8, categoria: 'Serviços de Limpeza', titulo: 'Limpeza' },
        ],
        locacoes: [
            { servicoId: 1, data: '2024-01-15' },
            { servicoId: 2, data: '2024-01-25' },
            { servicoId: 1, data: '2024-02-05' },
            { servicoId: 3, data: '2024-02-20' },
            { servicoId: 4, data: '2024-02-28' },
            { servicoId: 5, data: '2024-03-10' },
            { servicoId: 6, data: '2024-03-15' },
            { servicoId: 7, data: '2024-03-30' },
            { servicoId: 8, data: '2024-04-05' },
            { servicoId: 9, data: '2024-04-15' },
            { servicoId: 10, data: '2024-05-10' },
            { servicoId: 1, data: '2024-05-25' },
            { servicoId: 2, data: '2024-06-12' },
            { servicoId: 3, data: '2024-07-07' },
            { servicoId: 4, data: '2024-08-08' },
            { servicoId: 5, data: '2024-09-09' },
        ],
    });

    const [dadosGraficos, setDadosGraficos] = useState({
        rendimentosServicos: [],
        servicoMaisUsado: {},
        servicosLocados: [],
    });

    const [abaAtiva, setAbaAtiva] = useState('prestador');

    const processarDados = () => {
        // Rendimento dos Serviços
        const rendimentosServicos = dadosBrutos.servicos.map(servico => {
            const locacoesDoServico = dadosBrutos.locacoes.filter(locacao => locacao.servicoId === servico.id);
            const rendimentos = locacoesDoServico.length * 500; // Ajuste este valor conforme necessário
            return { titulo: servico.titulo, rendimento: rendimentos };
        });

        // Serviço Mais Usado
        const contagemLocacoes = dadosBrutos.locacoes.reduce((acc, locacao) => {
            acc[locacao.servicoId] = (acc[locacao.servicoId] || 0) + 1;
            return acc;
        }, {});

        const servicoMaisUsadoId = Object.keys(contagemLocacoes).reduce((a, b) => contagemLocacoes[a] > contagemLocacoes[b] ? a : b);
        const servicoMaisUsado = dadosBrutos.servicos.find(servico => servico.id === parseInt(servicoMaisUsadoId));
        const quantidadeLocada = contagemLocacoes[servicoMaisUsadoId];
        const rendimentoServicoMaisUsado = quantidadeLocada * 500; // Ajuste este valor conforme necessário

        // Quantidade de Serviços Locados
        const servicosLocados = dadosBrutos.servicos.map(servico => {
            const quantidadeLocada = dadosBrutos.locacoes.filter(locacao => locacao.servicoId === servico.id).length;
            return { titulo: servico.titulo, locacoes: quantidadeLocada };
        });

        setDadosGraficos({
            rendimentosServicos,
            servicoMaisUsado: { ...servicoMaisUsado, quantidadeLocada, rendimento: rendimentoServicoMaisUsado },
            servicosLocados,
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
                            onClick={() => setAbaAtiva('prestador')}
                            className={`block w-full mb-2 px-4 py-2 rounded-lg ${abaAtiva === 'prestador' ? 'bg-orange-500 text-white' : 'bg-gray-200'}`}
                        >
                            Prestador de Serviços
                        </button>
                    </div>
                    <div className="w-3/4">
                        <h1 className="text-2xl font-semibold mb-4 text-orange-500">Relatórios Prestador de Serviços</h1>

                        {abaAtiva === 'prestador' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-4">
                                    <h2 className="text-lg font-semibold mb-2">Rendimentos dos Serviços</h2>
                                    <Chart
                                        options={{
                                            chart: { type: 'bar' },
                                            xaxis: { categories: dadosGraficos.rendimentosServicos.map(item => item.titulo) },
                                        }}
                                        series={[{ name: 'Rendimentos', data: dadosGraficos.rendimentosServicos.map(item => item.rendimento) }]}
                                        type="bar"
                                        width="100%"
                                    />
                                </div>
                                <div className="bg-white dark:bg-gray-700 rounded-lg shadow-lg p-6 space-y-6">
                                    <h2 className="text-xl font-semibold text-black-500 mb-4">Serviço Mais Usado</h2>
                                    <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-md">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Categoria:</h3>
                                        <p className="text-lg text-gray-800 dark:text-gray-300">{dadosGraficos.servicoMaisUsado?.titulo || 'Nenhum serviço utilizado ainda.'}</p>
                                        <div className="mt-4 flex justify-between">
                                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                                <h4 className="font-semibold">Quantidade de Locações:</h4>
                                                <p>{dadosGraficos.servicoMaisUsado?.quantidadeLocada || 0}</p>
                                            </div>
                                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                                <h4 className="font-semibold">Rendimento Gerado:</h4>
                                                <p className="text-green-500">R${dadosGraficos.servicoMaisUsado?.rendimento || 0},00</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-4">
                                    <h2 className="text-lg font-semibold mb-2">Quantidade de Serviços Locados</h2>
                                    <Chart
                                        options={{
                                            chart: { type: 'pie' },
                                            labels: dadosGraficos.servicosLocados.map(item => item.titulo),
                                        }}
                                        series={dadosGraficos.servicosLocados.map(item => item.locacoes)}
                                        type="pie"
                                        width="100%"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default RelatoriosPrestador;
