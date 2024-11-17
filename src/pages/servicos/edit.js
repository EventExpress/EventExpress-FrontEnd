import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import NavBar from '../../components/NavBar';
import Footer from '../../components/Footer';
import axios from 'axios';

const EditarServico = () => {
    const router = useRouter();
    const { id } = router.query; // Obtém o id do serviço da URL
    const [servico, setServico] = useState(null);
    const [categorias, setCategorias] = useState([]);
    const [categoriaSelecionada, setCategoriaSelecionada] = useState([]); // Array para armazenar categorias selecionadas
    const [descricao, setDescricao] = useState('');
    const [valor, setValor] = useState('');
    const [agenda, setAgenda] = useState([]); // Array para armazenar datas
    const [cidade, setCidade] = useState('');
    const [bairro, setBairro] = useState('');
    const [errors, setErrors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [checkboxOpen, setCheckboxOpen] = useState(false);

    // Função para alternar a visibilidade da lista de categorias
    const toggleCheckboxes = () => {
        setCheckboxOpen(!checkboxOpen);
    };

    useEffect(() => {
        if (id) {
            fetchServico();
            fetchCategorias();
        }
    }, [id]);

    // Função para buscar os dados do serviço pelo id
    const fetchServico = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
            return;
        }

        try {
            const response = await axios.get(`http://localhost:8000/api/servicos/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 200) {
                const data = response.data.servico;
                setServico(data);
                setDescricao(data.descricao);
                setValor(data.valor);
                setCidade(data.cidade);
                setBairro(data.bairro);
                setAgenda(JSON.parse(data.agenda) || []); // Certifique-se de que a agenda seja um array
                setCategoriaSelecionada(data.scategoriaId || []); // Categoria selecionada do serviço
            }
        } catch (error) {
            console.error('Erro ao buscar serviço:', error);
        } finally {
            setLoading(false);
        }
    };

    // Função para buscar as categorias
    const fetchCategorias = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
            return;
        }

        try {
            const response = await axios.get('http://localhost:8000/api/categoria/servico', {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 200) {
                setCategorias(response.data.Scategorias); // Armazena as categorias
            }
        } catch (error) {
            console.error('Erro ao buscar categorias:', error);
        }
    };

    const handleCheckboxChange = (categoriaId) => {
        setCategoriaSelecionada((prevData) => {
            const categoriaIdExists = prevData.includes(categoriaId);
            const updatedCategoriaId = categoriaIdExists
                ? prevData.filter((id) => id !== categoriaId) // Remove a categoria se já estiver selecionada
                : [...prevData, categoriaId]; // Adiciona a categoria se não estiver selecionada
            return updatedCategoriaId;
        });
    };

    // Função para editar o serviço
    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
            return;
        }

        try {
            const response = await axios.put(`http://localhost:8000/api/servicos/${id}`, 
                {
                    cidade,
                    bairro,
                    descricao,
                    valor,
                    agenda: JSON.stringify(agenda), // Envia a agenda como string JSON
                    scategoriaId: categoriaSelecionada, // Envia categorias selecionadas
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (response.status === 200) {
                alert('Serviço atualizado com sucesso!');
                router.push('/servicos/meus-servicos');
            }
        } catch (error) {
            console.error('Erro ao editar serviço:', error);
            setErrors(['Erro ao editar serviço.']);
        }
    };

    // Verificar se o id está disponível antes de renderizar o componente
    if (!id || loading) return <p>Carregando...</p>;

    const handleRadioChange = (id) => {
        setCategoriaSelecionada(id);
    };

    return (
        <div className="bg-cover bg-center bg-fixed" style={{ backgroundImage: "url('/images/servico.jpg')" }}>
            <NavBar />
            <div className="py-12 flex-grow">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="bg-gray-700 p-6 rounded-lg shadow-md mb-6 overflow-hidden shadow-sm sm:rounded-lg">
                            <h1 className="font-semibold text-2xl text-white leading-tight">Editar Serviço</h1>

                            {errors.length > 0 && (
                                <div className="alert alert-danger mb-4">
                                    <ul>
                                        {errors.map((error, index) => (
                                            <li key={index}>{error}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

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
                                            onChange={(e) => setAgenda([...agenda, e.target.value])}
                                            className="form-input mt-1 block w-full rounded-lg"
                                        />
                                    </div>
                                    <div>
                                        <h3 className="text-orange-500 mt-4">Datas Indisponíveis:</h3>
                                        {agenda.map((date, index) => (
                                            <div key={index} className="flex items-center justify-between">
                                                <span>{date}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => setAgenda(agenda.filter((item) => item !== date))}
                                                    className="text-red-500 hover:text-red-700"
                                                >
                                                    Remover
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <label className="text-orange-500">Categorias:</label>
                                    <button 
                                        type="button" 
                                        onClick={toggleCheckboxes} 
                                        className="text-black bg-orange-500 hover:bg-orange-600 focus:ring-4 focus:ring-orange-300 rounded-md px-4 py-2 mt-2 transition duration-200 ease-in-out">
                                        Selecionar Categorias
                                    </button>

                                    {checkboxOpen && (
                                        <div className="mt-4 bg-gray-800 border border-gray-500 rounded-md p-4 shadow-lg">
                                            {categorias.length > 0 ? (
                                                categorias.map((categoria) => (
                                                    <div key={categoria.id} className="flex items-center space-x-2 mb-3">
                                                        <input
                                                            type="radio"
                                                            id={`categoria-${categoria.id}`} // id único para cada radio
                                                            name="categoria"
                                                            checked={categoriaSelecionada === categoria.id}
                                                            onChange={() => handleRadioChange(categoria.id)}
                                                            className="rounded border-gray-300 text-orange-500 focus:ring-2 focus:ring-orange-500"
                                                        />
                                                        <label
                                                            htmlFor={`categoria-${categoria.id}`} // Associando o texto ao radio
                                                            className="text-white cursor-pointer"
                                                        >
                                                            {categoria.titulo}
                                                        </label>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="text-gray-400">Nenhuma categoria disponível.</div>
                                            )}
                                        </div>
                                    )}
                                </div>
                                <div className="mt-6">
                                    <button 
                                        type="submit" 
                                        className="text-white bg-orange-500 hover:bg-orange-700 p-3 rounded mt-4 w-full"
                                    >
                                        Atualizar Serviço
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default EditarServico;
