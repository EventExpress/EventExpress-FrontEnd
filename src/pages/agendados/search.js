import { useState } from 'react';
import ApplicationLogo from '../../components/ApplicationLogo';
import NavBar from '../../components/NavBar';

export default function SearchReservas() {
    const [searchTerm, setSearchTerm] = useState('');
    const [reservas, setReservas] = useState([]);

    const handleSearch = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch(`/agendado/show?search=${searchTerm}`);
            const data = await response.json();
            setReservas(data.agendado); // Ajuste o nome conforme a resposta da sua API
        } catch (error) {
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
                            <h1 className="text-2xl font-semibold mb-4 text-orange-500">Busca de Reservas</h1>

                            <form onSubmit={handleSearch} className="mb-4">
                                <div className="flex">
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
                                </div>
                            </form>

                            {reservas.length > 0 ? (
                                reservas.map((reserva) => (
                                    <div className="mb-4 p-4 border rounded-md bg-white" key={reserva.id}>
                                        <p><strong>Anúncio:</strong> {reserva.anuncio.titulo}</p>
                                        <p><strong>Endereço:</strong> {reserva.anuncio.endereco.cidade}, CEP: {reserva.anuncio.endereco.cep}, Número: {reserva.anuncio.endereco.numero}, {reserva.anuncio.endereco.bairro}</p>
                                        <p><strong>Capacidade:</strong> {reserva.anuncio.capacidade}</p>
                                        <p><strong>Descrição:</strong> {reserva.anuncio.descricao}</p>
                                        <p><strong>Locador:</strong> {reserva.anuncio.usuario.nome}</p>
                                        <p><strong>Data de Início:</strong> {reserva.data_inicio}</p>
                                        <p><strong>Data do Fim:</strong> {reserva.data_fim}</p>
                                        <p><strong>Valor:</strong> {reserva.anuncio.valor}</p>
                                        <div className="mt-2">
                                            <a href={`/agendado/${reserva.id}/edit`} className="inline-block bg-blue-500 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-600">Editar</a>
                                            <form method="POST" action={`/agendado/${reserva.id}`} className="inline-block">
                                                <input type="hidden" name="_method" value="DELETE" />
                                                <button type="submit" className="inline-block bg-red-500 text-white px-3 py-1 rounded-md text-sm hover:bg-red-600" onClick={() => confirm('Tem certeza que deseja cancelar a reserva?')}>Cancelar</button>
                                            </form>
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
