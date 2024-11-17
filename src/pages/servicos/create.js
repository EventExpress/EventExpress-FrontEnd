import NavBar from '../../components/NavBar';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Footer from '../../components/Footer';

const CriarServico = () => {
    const router = useRouter();
    const [categorias, setCategorias] = useState([]);
    const [categoriaSelecionada, setCategoriaSelecionada] = useState('');
    const [descricao, setDescricao] = useState('');
    const [valor, setValor] = useState('');
    const [agenda, setAgenda] = useState([]);
    const [cidade, setCidade] = useState('');
    const [bairro, setBairro] = useState('');
    const [scategoriaId, setScategoriaId] = useState([]);
    const [selectedDate, setSelectedDate] = useState('');
    const [checkboxOpen, setCheckboxOpen] = useState(false);

    const toggleCheckboxes = () => {
        setCheckboxOpen(!checkboxOpen);
    };

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

    const addDateToAgenda = (date) => {
        if (!agenda.includes(date)) {
            setAgenda(prevAgenda => [...prevAgenda, date]);
        }
    };
    
    const removeDateFromAgenda = (date) => {
        setAgenda(prevAgenda => prevAgenda.filter(item => item !== date));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        router.push('/paginicial');
        console.log("Formulário enviado!");
    
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
    
    const handleRadioChange = (id) => {
        setCategoriaSelecionada(id);
    };

    return (
        <div className="bg-cover bg-center bg-fixed" style={{ backgroundImage: "url('/images/servico.jpg')" }}>
            <NavBar />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 " >
                    <div className=" overflow-hidden shadow-sm sm:rounded-lg" >
                        <div className="bg-gray-700 p-6 rounded-lg shadow-md mb-6 overflow-hidden shadow-sm sm:rounded-lg">
                            <h2 className="font-semibold text-2xl text-white leading-tight">Adicionar Serviço</h2>
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
                                            value={selectedDate}
                                            onChange={(e) => {
                                                setSelectedDate(e.target.value);
                                                addDateToAgenda(e.target.value);
                                            }}
                                            required
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
                                                    onClick={() => removeDateFromAgenda(date)}
                                                    className="text-red-500"
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
                                                            id={`categoria-${categoria.id}`}
                                                            name="categoria"
                                                            checked={categoriaSelecionada === categoria.id}
                                                            onChange={() => handleRadioChange(categoria.id)}
                                                            className="rounded border-gray-300 text-orange-500 focus:ring-2 focus:ring-orange-500"
                                                        />
                                                        <label 
                                                            htmlFor={`categoria-${categoria.id}`}
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
            <Footer />
        </div>
    );
};

export default CriarServico;
