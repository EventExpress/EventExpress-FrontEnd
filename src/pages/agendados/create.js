import { useState, useEffect } from 'react';
import ApplicationLogo from '../../components/ApplicationLogo';
import NavBar from '../../components/NavBar';

export default function CreateReserva() {
    const [dataInicio, setDataInicio] = useState('');
    const [dataFim, setDataFim] = useState('');
    const [adicionais, setAdicionais] = useState([]);
    const [anuncioId, setAnuncioId] = useState('');
    const [usuarioId, setUsuarioId] = useState('');
    const [adicionalIds, setAdicionalIds] = useState([]);
    const [datasIndisponiveis, setDatasIndisponiveis] = useState([]);

    useEffect(() => {
        // Busca os adicionais
        const fetchAdicionais = async () => {
            try {
                const response = await fetch('/api/adicionais');
                if (!response.ok) throw new Error('Erro na resposta da rede');
                const data = await response.json();
                setAdicionais(data);
            } catch (error) {
                console.error('Erro ao buscar adicionais:', error);
            }
        };

        // Busca as datas indisponíveis para o anúncio atual
        const fetchDatasIndisponiveis = async () => {
            try {
                const response = await fetch(`/api/verifica-agenda/${anuncioId}`);
                if (!response.ok) throw new Error('Erro na resposta da rede');
                const data = await response.json();
                setDatasIndisponiveis(data.datasIndisponiveis || []);
            } catch (error) {
                console.error('Erro ao buscar datas indisponíveis:', error);
            }
        };

        fetchAdicionais();
        if (anuncioId) fetchDatasIndisponiveis();
    }, [anuncioId]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        const reservaData = {
            data_inicio: dataInicio,
            data_fim: dataFim,
            adicionalId: adicionalIds,
            anuncio_id: anuncioId,
            usuario_id: usuarioId,
        };

        try {
            const response = await fetch('http://localhost:8000/api/agendados', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(reservaData),
            });

            if (response.ok) {
                console.log('Reserva criada com sucesso!');
            } else {
                console.error('Erro ao criar reserva');
            }
        } catch (error) {
            console.error('Erro:', error);
        }
    };

    const handleAdicionalChange = (id) => {
        setAdicionalIds((prev) => {
            if (prev.includes(id)) {
                return prev.filter((adId) => adId !== id);
            }
            return [...prev, id];
        });
    };

    const isDataIndisponivel = (date) => {
        if (!date || isNaN(new Date(date).getTime())) {
            return false;
        }
        
        const formattedDate = new Date(date).toISOString().split('T')[0];
        return datasIndisponiveis.includes(formattedDate);
    };

    return (
        <div>
            <NavBar />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200 rounded-lg">
                            <h2 className="font-semibold text-xl text-gray-900 leading-tight">
                                Reservar Anúncio
                            </h2>

                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <label htmlFor="data_inicio" className="block text-sm font-medium text-orange-500">
                                        Data de Início:
                                    </label>
                                    <input
                                        type="datetime-local"
                                        id="data_inicio"
                                        name="data_inicio"
                                        value={dataInicio}
                                        onChange={(e) => setDataInicio(e.target.value)}
                                        className="form-input mt-1 block w-full rounded-lg"
                                        required
                                        min={new Date().toISOString().slice(0, 16)} // Data mínima é a data atual
                                        disabled={isDataIndisponivel(dataInicio)}
                                    />
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="data_fim" className="block text-sm font-medium text-orange-500">
                                        Data de Fim:
                                    </label>
                                    <input
                                        type="datetime-local"
                                        id="data_fim"
                                        name="data_fim"
                                        value={dataFim}
                                        onChange={(e) => setDataFim(e.target.value)}
                                        className="form-input mt-1 block w-full rounded-lg"
                                        required
                                        min={dataInicio} // A data de fim deve ser após a data de início
                                        disabled={isDataIndisponivel(dataFim)}
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-orange-500">
                                        Escolher Serviços Adicionais:
                                    </label>
                                    {adicionais.map((adicional) => (
                                        <div className="flex items-center mt-2" key={adicional.id}>
                                            <input
                                                type="checkbox"
                                                id={`adicional-${adicional.id}`}
                                                value={adicional.id}
                                                onChange={() => handleAdicionalChange(adicional.id)}
                                                className="form-checkbox h-4 w-4 text-orange-600"
                                            />
                                            <label htmlFor={`adicional-${adicional.id}`} className="ml-2 block text-sm text-gray-900">
                                                {adicional.titulo} - R$ {adicional.valor}
                                            </label>
                                        </div>
                                    ))}
                                </div>

                                <input type="hidden" name="anuncio_id" value={anuncioId} />
                                <input type="hidden" name="usuario_id" value={usuarioId} />

                                <div className="mt-6">
                                    <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg">
                                        Reservar
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
