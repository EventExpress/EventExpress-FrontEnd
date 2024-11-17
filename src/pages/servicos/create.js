import NavBar from '../../components/NavBar';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router'; // Importe o useRouter

const CriarServico = () => {
    const router = useRouter(); // Instancie o router
    const [categorias, setCategorias] = useState([]);
    const [categoriaSelecionada, setCategoriaSelecionada] = useState('');
    const [descricao, setDescricao] = useState('');
    const [valor, setValor] = useState('');
    const [agenda, setAgenda] = useState([]); 
    const [cidade, setCidade] = useState('');
    const [bairro, setBairro] = useState('');
    const [scategoriaId, setScategoriaId] = useState([]);
    const [selectedDate, setSelectedDate] = useState(''); // Adicionado para controlar a data selecionada

    const fetchCategorias = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('Token não encontrado!');
                return;
            }
            const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/categoria/servico`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            const categoriasData = Array.isArray(response.data.Scategorias) ? response.data.Scategorias : [];
            setCategorias(categoriasData);
        } catch (error) {
            console.error('Erro ao buscar categorias:', error);
        }
    };

    useEffect(() => {
        fetchCategorias();
    }, []);

    const handleCheckboxChange = (categoriaId) => {
        setScategoriaId(prevData => {
            const categoriaIdExists = prevData.includes(categoriaId);
            const updatedCategoriaId = categoriaIdExists
                ? prevData.filter(id => id !== categoriaId)
                : [...prevData, categoriaId];
            return updatedCategoriaId;
        });
    };

    // Função para adicionar uma nova data à agenda
    const addDateToAgenda = (date) => {
        if (!agenda.includes(date)) { // Evitar adicionar a mesma data duas vezes
            setAgenda(prevAgenda => [...prevAgenda, date]);
        }
    };
    
    // Função para remover a data da agenda
    const removeDateFromAgenda = (date) => {
        setAgenda(prevAgenda => prevAgenda.filter(item => item !== date));
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // Isso impede o comportamento padrão do formulário
    
        router.push('/paginicial');
        console.log("Formulário enviado!"); // Verifique se esse log aparece
    
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('Token não encontrado!');
            return;
        }
    
        try {
            const response = await axios.post('http://localhost:8000/api/servicos', 
                {
                    cidade,
                    bairro,
                    descricao,
                    valor,
                    agenda,
                    scategoriaId,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
    
            if (response.status === 200) {
                console.log('Serviço criado com sucesso:', response.data);
                router.push('/paginicial');
            }
        } catch (error) {
            console.error('Erro ao criar serviço:', error.response?.data || error.message);
        }
    };
    
    
    return (
        <div>
            <NavBar />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200 rounded-lg">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Criar Serviço</h2>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <label htmlFor="cidade" className="block text-sm font-medium text-orange-500">Cidade:</label>
                                    <input
                                        type="text"
                                        name="cidade"
                                        id="cidade"
                                        value={cidade}
                                        onChange={(e) => setCidade(e.target.value)}
                                        required
                                        className="form-input mt-1 block w-full rounded-lg"
                                    />
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="bairro" className="block text-sm font-medium text-orange-500">Bairro:</label>
                                    <input
                                        type="text"
                                        name="bairro"
                                        id="bairro"
                                        value={bairro}
                                        onChange={(e) => setBairro(e.target.value)}
                                        required
                                        className="form-input mt-1 block w-full rounded-lg"
                                    />
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="descricao" className="block text-sm font-medium text-orange-500">Descrição:</label>
                                    <input
                                        type="text"
                                        name="descricao"
                                        id="descricao"
                                        value={descricao}
                                        onChange={(e) => setDescricao(e.target.value)}
                                        required
                                        className="form-input mt-1 block w-full rounded-lg"
                                    />
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="valor" className="block text-sm font-medium text-orange-500">Valor:</label>
                                    <input
                                        type="number"
                                        name="valor"
                                        id="valor"
                                        value={valor}
                                        onChange={(e) => setValor(e.target.value)}
                                        required
                                        className="form-input mt-1 block w-full rounded-lg"
                                    />
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="agenda" className="block text-sm font-medium text-orange-500">Datas Indisponíveis:</label>
                                    <div className="flex space-x-4">
                                        <input
                                            type="date"
                                            value={selectedDate} // Usando o estado selectedDate
                                            onChange={(e) => {
                                                setSelectedDate(e.target.value); // Atualiza o selectedDate
                                                addDateToAgenda(e.target.value); // Adiciona a data imediatamente após seleção
                                            }}
                                            required
                                            className="form-input mt-1 block w-full rounded-lg"
                                        />
                                    </div>
                                    <div>
                                        <h3 className="text-orange-500 mt-4">Datas Indisponíveis:</h3>
                                        {agenda.map((date, index) => (
                                            <div key={index} className="flex items-center justify-between">
                                                <span>{date}</span> {/* Exibindo a data única */}
                                                <button
                                                    type="button"
                                                    onClick={() => removeDateFromAgenda(date)}
                                                    className="text-red-500"
                                                >
                                                    Remover
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>   

                                <div className="mb-4">
                                    <label className="text-orange-500">Categorias:</label>
                                    <div>
                                        {categorias.map((categoria) => (
                                            <div key={categoria.id} className="flex items-center space-x-2 mb-3">
                                                <input
                                                    type="checkbox"
                                                    checked={scategoriaId.includes(categoria.id)}
                                                    onChange={() => handleCheckboxChange(categoria.id)}
                                                    className="rounded border-gray-300 text-orange-500 focus:ring-2 focus:ring-orange-500"
                                                />
                                                <label className="text-black">{categoria.titulo}</label>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="mt-4 bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-md"
                                >
                                    Criar Serviço
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CriarServico;
