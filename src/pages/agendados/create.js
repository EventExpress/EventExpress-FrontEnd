import { useState, useEffect } from 'react';
import ApplicationLogo from '../../components/ApplicationLogo';
import NavBar from '../../components/NavBar';

export default function CreateReserva() {
    const [dataInicio, setDataInicio] = useState('');
    const [dataFim, setDataFim] = useState('');
    const [adicionais, setAdicionais] = useState([]); // Para armazenar os serviços adicionais
    const [anuncioId, setAnuncioId] = useState(''); // Adicione o ID do anúncio aqui
    const [usuarioId, setUsuarioId] = useState(''); // Adicione o ID do usuário aqui
    const [adicionalIds, setAdicionalIds] = useState([]);

    // Para buscar os serviços adicionais do backend
    useEffect(() => {
        const fetchAdicionais = async () => {
            try {
                const response = await fetch('/api/adicionais'); // Substitua pelo endpoint correto
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setAdicionais(data); // Assumindo que o formato de resposta é um array de objetos
            } catch (error) {
                console.error('Error fetching adicionais:', error);
            }
        };

        fetchAdicionais();
    }, []);

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
            const response = await fetch('/agendado', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(reservaData),
            });

            if (response.ok) {
                // Lógica para redirecionar ou mostrar sucesso
                console.log('Reserva criada com sucesso!');
            } else {
                // Lógica para mostrar erro
                console.error('Erro ao criar reserva');
            }
        } catch (error) {
            console.error('Error:', error);
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
