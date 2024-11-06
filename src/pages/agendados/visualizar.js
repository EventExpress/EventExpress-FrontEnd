import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import NavBar from '../../components/NavBar';
import axios from 'axios';

export default function Visualizaragendados() {
    const router = useRouter();
    const [token, setToken] = useState('');
    const [usuarioId, setUsuarioId] = useState('');
    const [agendados, setAgendados] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        // Verifica o token no localStorage
        if (typeof window !== 'undefined') {
            const storedToken = localStorage.getItem('token');
            const storedUserId = localStorage.getItem('userId');
            if (storedToken) {
                setToken(storedToken);
                setUsuarioId(storedUserId);
            } else {
                router.push('/login');
            }
        }
    }, [router]);

    useEffect(() => {
        // Verifica se o token foi carregado antes de buscar os agendados
        if (!token) return;

        const fetchAgendados = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/agendados/meus', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setAgendados(response.data.agendado);
            } catch (error) {
                setErrorMessage('Erro ao buscar agendados.');
                console.error('Error fetching agendados:', error);
            }
        };

        fetchAgendados();
    }, [token]);

    const handleSearch = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.get(`/agendados/show?search=${searchTerm}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setAgendados(response.data.agendado);
        } catch (error) {
            setErrorMessage('Erro ao buscar agendados.');
            console.error('Error fetching agendados:', error);
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
                            <h1 className="text-2xl font-semibold mb-4 text-orange-500">Busca de agendados</h1>

                            <form onSubmit={handleSearch} className="mb-4 flex">
                                <input
                                    type="text"
                                    name="search"
                                    placeholder="Procurar agendado"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="border rounded-l-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                />
                                <button type="submit" className="ml-3 bg-orange-500 hover:bg-orange-600 text-white px-4 rounded-md">
                                    Buscar
                                </button>
                            </form>

                            {agendados.length > 0 ? (
                                agendados.map((agendado) => (
                                    <div className="bg-gray-100 rounded-md p-4 mb-4" key={agendado.id}>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div className="col-span-2">
                                                <h2 className="text-lg font-semibold">{agendado.anuncio.titulo}</h2>
                                                <p>{agendado.anuncio.descricao}</p>
                                            </div>
                                            <div className="mb-4 p-4 border rounded-md bg-white">
                                                <p><span className="font-semibold">Anunciante:</span> {agendado.anuncio.usuario.nome}</p>
                                                <p><span className="font-semibold">Data de Início:</span> {agendado.data_inicio}</p>
                                                <p><span className="font-semibold">Data do Fim:</span> {agendado.data_fim}</p>
                                                <p><span className="font-semibold">Valor:</span> {agendado.anuncio.valor}</p>
                                                <p><span className="font-semibold">Adicionais:</span>
                                                    {agendado.adicional.map((adicional, index) => (
                                                        <span key={adicional.id}>
                                                            {adicional.titulo}{index < agendado.adicional.length - 1 ? ', ' : ''}
                                                        </span>
                                                    ))}
                                                </p>
                                                <p><span className="font-semibold">Cliente:</span> {agendado.usuario.nome}</p>
                                            </div>
                                            <div className="col-span-3 md:col-span-1 mt-4 md:mt-0">
                                                <p><span className="font-semibold">Endereço:</span><br />
                                                    {agendado.anuncio.endereco.cidade}, CEP: {agendado.anuncio.endereco.cep}, Número: {agendado.anuncio.endereco.numero}, {agendado.anuncio.endereco.bairro}
                                                </p>
                                                <p><span className="font-semibold">Capacidade:</span> {agendado.anuncio.capacidade}</p>
                                                <div>
                                                    <a href={`/agendados/${agendado.id}/edit`} className="inline-block bg-blue-500 text-white px-3 py-1 rounded-md text-sm">Editar</a>
                                                    <form method="POST" action={`/agendados/${agendado.id}`} className="inline-block">
                                                        <input type="hidden" name="_method" value="DELETE" />
                                                        <button type="submit" className="inline-block bg-red-500 text-white px-3 py-1 rounded-md text-sm" onClick={() => confirm('Tem certeza que deseja cancelar o agendado?')}>Cancelar</button>
                                                    </form>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="mt-4">Nenhuma agendado encontrada.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
