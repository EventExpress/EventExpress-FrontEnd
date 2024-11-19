import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../app/context/AuthContext'; // Ajuste aqui
import NavBar from '../../components/NavBar';
import Footer from '../../components/Footer'; // Importando o Footer
import dynamic from 'next/dynamic';

const RelatoriosLocador = () => {
    const { user } = useAuth(); 
    const router = useRouter();
    const [dadosBrutos, setDadosBrutos] = useState({
        anuncios: [
            { id: 1, categoria: 'Casamento', titulo: 'Casamentos' },
            { id: 2, categoria: 'Aniversário', titulo: 'Aniversários' },
            { id: 3, categoria: 'Reuniões', titulo: 'Conferência' },
            { id: 4, categoria: 'Festa Infantil', titulo: 'Workshop' },
            { id: 5, categoria: 'Formatura', titulo: 'Formaturas' },
        ],
        locacoes: [
            { anuncioId: 1, data: '2024-01-15' },
            { anuncioId: 2, data: '2024-01-25' },
            { anuncioId: 1, data: '2024-02-05' },
            { anuncioId: 3, data: '2024-02-20' },
            { anuncioId: 4, data: '2024-02-28' },
            { anuncioId: 1, data: '2024-03-10' },
            { anuncioId: 5, data: '2024-03-15' },
            { anuncioId: 2, data: '2024-03-30' },
            { anuncioId: 3, data: '2024-04-05' },
            { anuncioId: 4, data: '2024-04-15' },
            { anuncioId: 1, data: '2024-05-10' },
            { anuncioId: 2, data: '2024-05-25' },
            { anuncioId: 5, data: '2024-06-12' },
            { anuncioId: 3, data: '2024-07-07' },
            { anuncioId: 1, data: '2024-08-08' },
            { anuncioId: 4, data: '2024-09-09' },
        ],
    });

    const [dadosGraficos, setDadosGraficos] = useState({
        rendimentosAnuncios: [], 
        anuncioMaisLocado: {}, 
        anunciosLocados: [], 
    });

    const [abaAtiva, setAbaAtiva] = useState('locador'); 

    const processarDados = () => {
        // Rendimento dos Anúncios
        const rendimentosAnuncios = dadosBrutos.anuncios.map(anuncio => {
            const locacoesDoAnuncio = dadosBrutos.locacoes.filter(locacao => locacao.anuncioId === anuncio.id);
            // Usando o número de locações multiplicado por um valor fixo de rendimento (por exemplo, 500)
            const rendimentos = locacoesDoAnuncio.length * 500; // Ajuste este valor conforme necessário
            return { titulo: anuncio.titulo, rendimento: rendimentos };
        });
    
        // Anúncio Mais Locado
        const contagemLocacoes = dadosBrutos.locacoes.reduce((acc, locacao) => {
            acc[locacao.anuncioId] = (acc[locacao.anuncioId] || 0) + 1;
            return acc;
        }, {});
        
        // Encontrando o ID do anúncio mais locado
        const anuncioMaisLocadoId = Object.keys(contagemLocacoes).reduce((a, b) => contagemLocacoes[a] > contagemLocacoes[b] ? a : b);
        
        // Buscando os dados do anúncio mais locado
        const anuncioMaisLocado = dadosBrutos.anuncios.find(anuncio => anuncio.id === parseInt(anuncioMaisLocadoId));
        const quantidadeLocada = contagemLocacoes[anuncioMaisLocadoId];
        
        // O rendimento é baseado na quantidade de locações multiplicada por um valor fixo (500)
        const rendimentoAnuncioMaisLocado = quantidadeLocada * 500; // Ajuste este valor conforme necessário
    
        // Quantidade de Anúncios Locados
        const anunciosLocados = dadosBrutos.anuncios.map(anuncio => {
            const quantidadeLocada = dadosBrutos.locacoes.filter(locacao => locacao.anuncioId === anuncio.id).length;
            return { titulo: anuncio.titulo, locacoes: quantidadeLocada };
        });
    
        // Atualizando o estado com os dados calculados
        setDadosGraficos({
            rendimentosAnuncios,
            anuncioMaisLocado: { ...anuncioMaisLocado, quantidadeLocada, rendimento: rendimentoAnuncioMaisLocado },
            anunciosLocados,
        });
    };
    

    const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

    useEffect(() => {
        processarDados(); 
    }, []);
    useEffect(() => {
        console.log('Executando processarDados');
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
                            onClick={() => setAbaAtiva('locador')}
                            className={`block w-full mb-2 px-4 py-2 rounded-lg ${abaAtiva === 'locador' ? 'bg-orange-500 text-white' : 'bg-gray-200'}`}
                        >
                            Locador
                        </button>
                    </div>
                    <div className="w-3/4">
                        <h1 className="text-2xl font-semibold mb-4 text-orange-500">Relatórios Locador</h1>

                        {abaAtiva === 'locador' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-4">
                                    <h2 className="text-lg font-semibold mb-2">Rendimentos dos Anúncios</h2>
                                    <Chart
                                        options={{
                                            chart: { type: 'bar' },
                                            xaxis: { categories: dadosGraficos.rendimentosAnuncios.map(item => item.titulo) },
                                        }}
                                        series={[{ name: 'Rendimentos', data: dadosGraficos.rendimentosAnuncios.map(item => item.rendimento) }]}
                                        type="bar"
                                        width="100%"
                                    />
                                </div>
                                <div className="bg-white dark:bg-gray-700 rounded-lg shadow-lg p-6 space-y-6">
                                    <h2 className="text-xl font-semibold text-black-500 mb-4">Anúncio Mais Locado</h2>
                                    <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-md">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Categoria:</h3>
                                        <p className="text-lg text-gray-800 dark:text-gray-300">{dadosGraficos.anuncioMaisLocado?.titulo || 'Nenhum anúncio locado ainda.'}</p>
                                        <div className="mt-4 flex justify-between">
                                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                                <h4 className="font-semibold">Quantidade de Locações:</h4>
                                                <p>{dadosGraficos.anuncioMaisLocado?.quantidadeLocada || 0}</p>
                                            </div>
                                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                                <h4 className="font-semibold">Rendimento Gerado:</h4>
                                                <p className="text-green-500">R${dadosGraficos.anuncioMaisLocado?.rendimento || 0},00</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-4">
                                    <h2 className="text-lg font-semibold mb-2">Quantidade de Anúncios Locados</h2>
                                    <Chart
                                        options={{
                                            chart: { type: 'pie' },
                                            labels: dadosGraficos.anunciosLocados.map(item => item.titulo),
                                        }}
                                        series={dadosGraficos.anunciosLocados.map(item => item.locacoes)}
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

export default RelatoriosLocador;
