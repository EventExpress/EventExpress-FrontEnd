import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

const AvaliacaoPage = () => {
    const router = useRouter();
    const { agendadoId, tipoUsuario } = router.query;

    const [avaliacaoAnuncio, setAvaliacaoAnuncio] = useState({ nota: '', comentario: '' });
    const [avaliacaoServicos, setAvaliacaoServicos] = useState([]);
    const [servicos, setServicos] = useState([]);
    const [sucesso, setSucesso] = useState(null);
    const [erro, setErro] = useState(null);

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
                `http://localhost:8000/api/agendados/${agendadoId}/servicos`, // Se o backend estiver na porta 8000
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            if (response.status === 200) {
                setServicos(response.data.servicos);
                // Inicializar avaliações dos serviços
                setAvaliacaoServicos(
                    response.data.servicos.map((servico) => ({
                        servico_id: servico.id, // Pegando o ID do serviço
                        nota: '',
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
            // Ajusta o payload para garantir que o servico_id está correto
            const payload = {
                avaliacao_anuncio: avaliacaoAnuncio,
                avaliacao_servico: avaliacaoServicos.map((avaliacao) => ({
                    servico_id: avaliacao.servico_id, // Usando o ID do serviço
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
            }
        } catch (error) {
            setErro('Erro ao enviar avaliação. Tente novamente.');
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-semibold mb-4">Avaliação do Agendamento</h1>
            {sucesso ? (
                <p className="text-green-500">{sucesso}</p>
            ) : (
                <>
                    <h2 className="text-xl font-semibold">Avaliação do Anúncio</h2>
                    <label>
                        Nota:
                        <input
                            type="number"
                            value={avaliacaoAnuncio.nota}
                            onChange={(e) => setAvaliacaoAnuncio({ ...avaliacaoAnuncio, nota: e.target.value })}
                            className="border p-2 w-full"
                        />
                    </label>
                    <label>
                        Comentário:
                        <textarea
                            value={avaliacaoAnuncio.comentario}
                            onChange={(e) => setAvaliacaoAnuncio({ ...avaliacaoAnuncio, comentario: e.target.value })}
                            className="border p-2 w-full"
                        />
                    </label>
                    {servicos.length > 0 && (
                        <>
                            <h2 className="text-xl font-semibold mt-4">Avaliação dos Serviços</h2>
                            {servicos.map((servico, index) => (
                                <div key={servico.id} className="border p-4 mb-2">
                                    <p><strong>Serviço:</strong> {servico.nome}</p>
                                    <label>
                                        Nota:
                                        <input
                                            type="number"
                                            value={avaliacaoServicos[index]?.nota || ''}
                                            onChange={(e) => {
                                                const novasAvaliacoes = [...avaliacaoServicos];
                                                novasAvaliacoes[index] = {
                                                    ...novasAvaliacoes[index],
                                                    nota: e.target.value,
                                                };
                                                setAvaliacaoServicos(novasAvaliacoes);
                                            }}
                                            className="border p-2 w-full"
                                        />
                                    </label>
                                    <label>
                                        Comentário:
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
                                            className="border p-2 w-full"
                                        />
                                    </label>
                                </div>
                            ))}
                        </>
                    )}
                    <button onClick={handleEnviarAvaliacao} className="bg-blue-500 text-white px-4 py-2 mt-4">
                        Enviar Avaliação
                    </button>
                    {erro && <p className="text-red-500 mt-2">{erro}</p>}
                </>
            )}
        </div>
    );
};

export default AvaliacaoPage;
