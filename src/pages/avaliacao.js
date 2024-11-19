import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';

const AvaliacaoPage = () => {
    const router = useRouter();
    const { agendadoId, tipoUsuario } = router.query;

    const [avaliacaoAnuncio, setAvaliacaoAnuncio] = useState({ nota: '', comentario: '' });
    const [avaliacaoServicos, setAvaliacaoServicos] = useState([]);
    const [servicos, setServicos] = useState([]);
    const [sucesso, setSucesso] = useState(null);
    const [erro, setErro] = useState(null);
    const [modalErroVisivel, setModalErroVisivel] = useState(false);
    const [avaliacaoRealizada, setAvaliacaoRealizada] = useState(false);

    useEffect(() => {
        if (agendadoId) {
            carregarServicos();
        }
    }, [agendadoId]);

    const carregarServicos = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setErro('Token não encontrado.');
            return;
        }

        try {
            const response = await axios.get(
                `http://localhost:8000/api/agendados/${agendadoId}/servicos`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            if (response.status === 200) {
                setServicos(response.data.servicos);
                setAvaliacaoServicos(
                    response.data.servicos.map((servico) => ({
                        servico_id: servico.id,
                        nota: 0,
                        comentario: '',
                    }))
                );
            }
        } catch (error) {
            setErro('Erro ao carregar serviços. Tente novamente.');
        }
    };

    const handleEnviarAvaliacao = async () => {
        if (!tipoUsuario) {
            alert('Tipo de usuário não especificado');
            return;
        }

        const token = localStorage.getItem('token');
        if (!token) {
            setErro('Token não encontrado.');
            return;
        }

        try {
            const payload = {
                avaliacao_anuncio: avaliacaoAnuncio,
                avaliacao_servico: avaliacaoServicos.map((avaliacao) => ({
                    servico_id: avaliacao.servico_id,
                    nota: avaliacao.nota,
                    comentario: avaliacao.comentario,
                })),
            };

            const response = await axios.post(`http://localhost:8000/api/agendados/${agendadoId}/avaliar/locatario`,
                payload,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            if (response.status === 200) {
                setSucesso('Avaliação enviada com sucesso!');
                setAvaliacaoRealizada(true);
            }
        } catch (error) {
            setErro('Reserva já avaliada.');
            setModalErroVisivel(true);
        }
    };

    const renderizarEstrelas = (nota, setNota) => {
        const estrelas = [];
        for (let i = 1; i <= 5; i++) {
            estrelas.push(
                <span
                    key={i}
                    onClick={() => setNota(i)}
                    className={`cursor-pointer ${i <= nota ? 'text-yellow-500' : 'text-gray-400'} text-3xl`}
                >
                    ★
                </span>
            );
        }
        return estrelas;
    };
    

    const redirecionarParaHistorico = () => {
        router.push('/agendados/historico');
    };

    const voltarAoHistoricoSemAvaliacao = () => {
        router.push('/agendados/historico');
    };

    const fecharModalErro = () => {
        setModalErroVisivel(false);
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col justify-between">
            <NavBar />
            <div className="flex-1 flex justify-center items-center">
                <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
                    <h1 className="text-orange-500 text-3xl font-semibold mb-4 text-center">Avaliação da Reserva</h1>
                    {sucesso ? (
                        <div className="text-center">
                            <p className="text-green-500">{sucesso}</p>
                            <button 
                                onClick={redirecionarParaHistorico}
                                className="bg-blue-500 text-white px-6 py-2 rounded mt-4 w-full"
                            >
                                Voltar para o Histórico
                            </button>
                        </div>
                    ) : (
                        <>
                            <h2 className="text-xl font-semibold mb-4">Avaliação do Anúncio</h2>
                            <div className="mb-4">
                                <label className="block mb-2">Nota:</label>
                                <div className="flex justify-center mb-2">
                                    {renderizarEstrelas(avaliacaoAnuncio.nota, (nota) => setAvaliacaoAnuncio({ ...avaliacaoAnuncio, nota }))}
                                </div>
                            </div>
                            <label className="block mb-2">Comentário:</label>
                            <textarea
                                value={avaliacaoAnuncio.comentario}
                                onChange={(e) => setAvaliacaoAnuncio({ ...avaliacaoAnuncio, comentario: e.target.value })}
                                className="border p-2 w-full mb-4"
                                rows="4"
                            />
                            {servicos.length > 0 && (
                                <>
                                    <h2 className="text-xl font-semibold mt-4 mb-4">Avaliação dos Serviços</h2>
                                    {servicos.map((servico, index) => (
                                        <div key={servico.id} className="border p-4 mb-4 rounded-md">
                                            <p><strong>Serviço:</strong> {servico.nome}</p>
                                            <div className="mb-4">
                                                <label className="block mb-2">Nota:</label>
                                                <div className="flex justify-center mb-2">
                                                    {renderizarEstrelas(avaliacaoServicos[index]?.nota, (nota) => {
                                                        const novasAvaliacoes = [...avaliacaoServicos];
                                                        novasAvaliacoes[index] = { ...novasAvaliacoes[index], nota };
                                                        setAvaliacaoServicos(novasAvaliacoes);
                                                    })}
                                                </div>
                                            </div>
                                            <label className="block mb-2">Comentário:</label>
                                            <textarea
                                                value={avaliacaoServicos[index]?.comentario || ''}
                                                onChange={(e) => {
                                                    const novasAvaliacoes = [...avaliacaoServicos];
                                                    novasAvaliacoes[index] = {
                                                        ...novasAvaliacoes[index],
                                                        comentario: e.target.value,
                                                    };
                                                    setAvaliacaoServicos(novasAvaliacoes);
                                                }}
                                                className="border p-2 w-full mb-4"
                                                rows="4"
                                            />
                                        </div>
                                    ))}
                                </>
                            )}
                            <button onClick={handleEnviarAvaliacao} className="bg-blue-500 text-white px-6 py-2 rounded mt-4 w-full">
                                Enviar Avaliação
                            </button>
                            <button 
                                onClick={voltarAoHistoricoSemAvaliacao}
                                className="bg-gray-500 text-white px-6 py-2 rounded mt-4 w-full"
                            >
                                Voltar
                            </button>
                            {erro && <p className="text-red-500 mt-2 text-center">{erro}</p>}
                        </>
                    )}
                </div>
            </div>
            <Footer />
            {modalErroVisivel && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg w-80 text-center">
                        <h2 className="text-xl font-semibold mb-4">Erro</h2>
                        <p className="mb-4">{erro}</p>
                        <button 
                            onClick={fecharModalErro} 
                            className="bg-blue-500 text-white px-6 py-2 rounded mt-4"
                        >
                            Fechar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AvaliacaoPage;
