import { useState, useEffect } from 'react';
import NavBar from '../../components/NavBar';
import { useRouter } from 'next/router';

export default function EditReserva() {
    const router = useRouter();
    const { id } = router.query; // Obtém o ID da reserva da URL
    const [dataInicio, setDataInicio] = useState('');
    const [dataFim, setDataFim] = useState('');
    const [adicionais, setAdicionais] = useState([]);
    const [adicionalIds, setAdicionalIds] = useState([]);

    // Carrega os dados da reserva quando o componente é montado
    useEffect(() => {
        const fetchReserva = async () => {
            if (!id) return; // Aguarda o ID ser carregado

            try {
                const response = await fetch(`/api/agendado/${id}`); // Substitua pelo seu endpoint
                const data = await response.json();
                setDataInicio(data.data_inicio);
                setDataFim(data.data_fim);
                setAdicionalIds(data.adicionalId || []); // Carrega os adicionais já selecionados
            } catch (error) {
                console.error('Error fetching reserva:', error);
            }
        };

        fetchReserva();
    }, [id]);

    // Carrega os serviços adicionais
    useEffect(() => {
        const fetchAdicionais = async () => {
            try {
                const response = await fetch('/api/adicionais'); // Substitua pelo seu endpoint
                const data = await response.json();
                setAdicionais(data);
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
        };

        try {
            const response = await fetch(`/agendado/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(reservaData),
            });

            if (response.ok) {
                // Redirecionar ou mostrar sucesso
                console.log('Reserva atualizada com sucesso!');
                router.push('/agendado'); // Redireciona para a lista de reservas
            } else {
                console.error('Erro ao atualizar reserva');
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
                            <h2 className="font-semibold text-xl text-gray-800 leading-tight text-gray-900">
                                Editar Reserva
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
                                                checked={adicionalIds.includes(adicional.id)}
                                                onChange={() => handleAdicionalChange(adicional.id)}
                                                className="form-checkbox h-4 w-4 text-orange-600"
                                            />
                                            <label htmlFor={`adicional-${adicional.id}`} className="ml-2 block text-sm text-gray-900">
                                                {adicional.titulo} - R$ {adicional.valor}
                                            </label>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-6">
                                    <button type="submit" className="bg-gray-700 hover:bg-gray-800 text-white font-bold py-2 px-4 rounded-lg">
                                        Salvar Alterações
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
