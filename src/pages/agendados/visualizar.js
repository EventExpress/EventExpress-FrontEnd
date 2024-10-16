import { useState, useEffect } from 'react';
import ApplicationLogo from '../../components/ApplicationLogo';
import NavBar from '../../components/NavBar';

export default function VisualizarReservas() {
    const [reservas, setReservas] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const fetchReservas = async () => {
            try {
                const response = await fetch('/agendado/show');
                const data = await response.json();
                setReservas(data.agendado); // Ajuste o nome conforme a resposta da sua API
            } catch (error) {
                setErrorMessage('Erro ao buscar reservas.');
                console.error('Error fetching reservas:', error);
            }
        };

        fetchReservas();
    }, []);

    const handleSearch = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch(`/agendado/show?search=${searchTerm}`);
            const data = await response.json();
            setReservas(data.agendado);
        } catch (error) {
            setErrorMessage('Erro ao buscar reservas.');
            console.error('Error fetching reservas:', error);
        }
    };

    return (
        <div>
            <NavBar />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200 rounded-lg">
                            {errorMessage && (
                                <div className="alert alert-danger">
                                    {errorMessage}
                                </div>
                            )}
                            <h1 className="text-2xl font-semibold mb-4 text-orange-500">Busca de Reservas</h1>

                            <form onSubmit={handleSearch} className="mb-4 flex">
                                <input
                                    type="text"
                                    name="search"
                                    placeholder="Procurar reserva"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="border rounded-l-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                />
                                <button type="submit" className="ml-3 bg-orange-500 hover:bg-orange-600 text-white px-4 rounded-md">
                                    Buscar
                                </button>
                            </form>

                            {reservas.length > 0 ? (
                                reservas.map((reserva) => (
                                    <div className="bg-gray-100 rounded-md p-4 mb-4" key={reserva.id}>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div className="col-span-2">
                                                <h2 className="text-lg font-semibold">{reserva.anuncio.titulo}</h2>
                                                <p>{reserva.anuncio.descricao}</p>
                                            </div>
                                            <div className="mb-4 p-4 border rounded-md bg-white">
                                                <p><span className="font-semibold">Anunciante:</span> {reserva.anuncio.usuario.nome}</p>
                                                <p><span className="font-semibold">Data de Início:</span> {reserva.data_inicio}</p>
                                                <p><span className="font-semibold">Data do Fim:</span> {reserva.data_fim}</p>
                                                <p><span className="font-semibold">Valor:</span> {reserva.anuncio.valor}</p>
                                                <p><span className="font-semibold">Adicionais:</span>
                                                    {reserva.adicional.map((adicional, index) => (
                                                        <span key={adicional.id}>
                                                            {adicional.titulo}{index < reserva.adicional.length - 1 ? ', ' : ''}
                                                        </span>
                                                    ))}
                                                </p>
                                                <p><span className="font-semibold">Cliente:</span> {reserva.usuario.nome}</p>
                                            </div>
                                            <div className="col-span-3 md:col-span-1 mt-4 md:mt-0">
                                                <p><span className="font-semibold">Endereço:</span><br />
                                                    {reserva.anuncio.endereco.cidade}, CEP: {reserva.anuncio.endereco.cep}, Número: {reserva.anuncio.endereco.numero}, {reserva.anuncio.endereco.bairro}
                                                </p>
                                                <p><span className="font-semibold">Capacidade:</span> {reserva.anuncio.capacidade}</p>
                                                <div>
                                                    <a href={`/agendado/${reserva.id}/edit`} className="inline-block bg-blue-500 text-white px-3 py-1 rounded-md text-sm">Editar</a>
                                                    <form method="POST" action={`/agendado/${reserva.id}`} className="inline-block">
                                                        <input type="hidden" name="_method" value="DELETE" />
                                                        <button type="submit" className="inline-block bg-red-500 text-white px-3 py-1 rounded-md text-sm" onClick={() => confirm('Tem certeza que deseja cancelar a reserva?')}>Cancelar</button>
                                                    </form>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="mt-4">Nenhuma reserva encontrada.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
