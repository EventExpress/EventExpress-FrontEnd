import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import NavBar from '../../components/NavBar';
import Button from '@/components/Button';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import Footer from '../../components/Footer';

const CreateAnuncio = () => {
    const router = useRouter();
    const [formData, setFormData] = useState({
        titulo: '',
        cidade: '',
        cep: '',
        numero: '',
        bairro: '',
        capacidade: '',
        descricao: '',
        valor: '',
        categoriaId: [],
        imagens: [],
        agenda: []
    });

    const [categorias, setCategorias] = useState([]);
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [checkboxOpen, setCheckboxOpen] = useState(false);
    const [datasIndisponiveis, setDatasIndisponiveis] = useState([]);
    const [dataSelecionada, setDataSelecionada] = useState(null);

    // Fetching available categories
    const fetchCategorias = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('Token não encontrado!');
                return;
            }
            const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/categoria`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (Array.isArray(response.data)) {
                setCategorias(response.data);
            } else if (response.data.categorias) {
                setCategorias(response.data.categorias);
            }
        } catch (error) {
            console.error('Erro ao buscar categorias:', error);
        }
    };

    useEffect(() => {
        fetchCategorias();
    }, []);

    // Handling input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleImageChange = async (e) => {
        const files = Array.from(e.target.files);
        const base64Images = await Promise.all(files.map(file => convertToBase64AndResize(file, 800, 600))); // Redimensionando para 800x600
        setFormData({ ...formData, imagens: base64Images });
    };

    const convertToBase64AndResize = (file, maxWidth, maxHeight) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                const img = new Image();
                img.src = reader.result;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');

                    // Calculate new dimensions while maintaining aspect ratio
                    let width = img.width;
                    let height = img.height;

                    if (width > height) {
                        if (width > maxWidth) {
                            height *= maxWidth / width;
                            width = maxWidth;
                        }
                    } else {
                        if (height > maxHeight) {
                            width *= maxHeight / height;
                            height = maxHeight;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;
                    ctx.drawImage(img, 0, 0, width, height);
                    const base64 = canvas.toDataURL('image/jpeg'); // Utilize o formato que você preferir
                    resolve(base64);
                };
                img.onerror = (error) => reject(error);
            };
            reader.onerror = (error) => reject(error);
        });
    };

    const handleCheckboxChange = (id) => {
        setFormData((prevState) => {
            const isChecked = prevState.categoriaId.includes(id);
            return {
                ...prevState,
                categoriaId: isChecked
                    ? prevState.categoriaId.filter((catId) => catId !== id)
                    : [...prevState.categoriaId, id],
            };
        });
    };

    const handleAddDate = () => {
        if (dataSelecionada && !datasIndisponiveis.includes(dataSelecionada.getTime())) {
            setDatasIndisponiveis((prev) => [...prev, dataSelecionada.getTime()]);
            setDataSelecionada(null);
        } else {
            alert('Data já adicionada ou inválida!');
        }
    };

    const handleRemoveDate = (timestamp) => {
        setDatasIndisponiveis((prev) => prev.filter(date => date !== timestamp));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setSuccessMessage('');
        setIsLoading(true);

        const formDataWithDates = { ...formData, datasIndisponiveis };

        try {
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/anuncios`,
                formDataWithDates,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );

            if (response.status === 201) {
                setSuccessMessage('Anúncio criado com sucesso!');
                setFormData({
                    titulo: '',
                    cidade: '',
                    cep: '',
                    numero: '',
                    bairro: '',
                    capacidade: '',
                    descricao: '',
                    valor: '',
                    categoriaId: [],
                    imagens: [],
                });
                setDatasIndisponiveis([]);
                router.push('/paginicial');
            }
        } catch (error) {
            if (error.response && error.response.data) {
                setErrors(error.response.data.errors || {});
            } else {
                console.error('Erro ao enviar formulário:', error);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const toggleCheckboxes = () => {
        setCheckboxOpen(!checkboxOpen);
    };

    return (
        <div>
            <NavBar /> {/* Incluindo a NavBar */}
            <div
                className="flex flex-col items-center p-4 min-h-screen"
                style={{
                    backgroundImage: "url('/images/teste.jpg')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            >
                <div className="py-5">
                    <div className="max-w-7xl mx-auto sm:px-5 lg:px-8">
                        <div className="bg-gray-700 p-6 rounded-lg shadow-md mb-6 overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                {Object.keys(errors).length > 0 && (
                                    <div className="mb-4 font-medium text-sm text-red-600">
                                        <strong>Erros:</strong>
                                        <ul>
                                            {Object.values(errors).map((error, index) => (
                                                <li key={index}>{error}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
    
                                {successMessage && (
                                    <div className="mb-4 font-medium text-sm text-green-600">
                                        <strong>{successMessage}</strong>
                                    </div>
                                )}
    
                                <h2 className="font-semibold text-2xl text-white leading-tight">Adicionar Anúncio</h2>
                                <form onSubmit={handleSubmit}>
                                    {/* Título */}
                                    <div className="mt-4">
                                        <label htmlFor="titulo" className="text-orange-500 capitalize">Título:</label>
                                        <input
                                            type="text"
                                            name="titulo"
                                            id="titulo"
                                            value={formData.titulo}
                                            onChange={handleChange}
                                            required
                                            className="block mt-1 w-full rounded-md border-gray-300 focus:border-orange-500 focus:ring focus:ring-orange-500"
                                        />
                                    </div>
    
                                    {/* Endereço (CEP, cidade, número, bairro) na mesma linha */}
                                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                                        <div>
                                            <label htmlFor="cep" className="text-orange-500">CEP:</label>
                                            <input
                                                type="text"
                                                name="cep"
                                                id="cep"
                                                value={formData.cep}
                                                onChange={handleChange}
                                                required
                                                className="block mt-1 w-full rounded-md border-gray-300 focus:border-orange-500 focus:ring focus:ring-orange-500"
                                            />
                                        </div>
    
                                        <div>
                                            <label htmlFor="cidade" className="text-orange-500">Cidade:</label>
                                            <input
                                                type="text"
                                                name="cidade"
                                                id="cidade"
                                                value={formData.cidade}
                                                onChange={handleChange}
                                                required
                                                className="block mt-1 w-full rounded-md border-gray-300 focus:border-orange-500 focus:ring focus:ring-orange-500"
                                            />
                                        </div>
    
                                        <div>
                                            <label htmlFor="numero" className="text-orange-500">Número:</label>
                                            <input
                                                type="text"
                                                name="numero"
                                                id="numero"
                                                value={formData.numero}
                                                onChange={handleChange}
                                                required
                                                className="block mt-1 w-full rounded-md border-gray-300 focus:border-orange-500 focus:ring focus:ring-orange-500"
                                            />
                                        </div>
    
                                        <div>
                                            <label htmlFor="bairro" className="text-orange-500">Bairro:</label>
                                            <input
                                                type="text"
                                                name="bairro"
                                                id="bairro"
                                                value={formData.bairro}
                                                onChange={handleChange}
                                                required
                                                className="block mt-1 w-full rounded-md border-gray-300 focus:border-orange-500 focus:ring focus:ring-orange-500"
                                            />
                                        </div>
                                    </div>
    
                                    {/* Outros campos */}
                                    <div className="mt-4">
                                        <label htmlFor="descricao" className="text-orange-500">Descrição:</label>
                                        <textarea
                                            name="descricao"
                                            id="descricao"
                                            value={formData.descricao}
                                            onChange={handleChange}
                                            required
                                            className="block mt-1 w-full rounded-md border-gray-300 focus:border-orange-500 focus:ring focus:ring-orange-500"
                                        />
                                    </div>
                                    <div className="mt-4">
                                        <label htmlFor="capacidade" className="text-orange-500">Capacidade:</label>
                                        <input
                                            type="number"
                                            name="capacidade"
                                            id="capacidade"
                                            value={formData.capacidade}
                                            onChange={handleChange}
                                            required
                                            className="block mt-1 w-full rounded-md border-gray-300 focus:border-orange-500 focus:ring focus:ring-orange-500"
                                        />
                                    </div>
                                                        
                                    <div className="mt-4">
                                        <label htmlFor="valor" className="text-orange-500">Valor:</label>
                                        <input
                                            type="number"
                                            name="valor"
                                            id="valor"
                                            value={formData.valor}
                                            onChange={handleChange}
                                            required
                                            className="block mt-1 w-full rounded-md border-gray-300 focus:border-orange-500 focus:ring focus:ring-orange-500"
                                        />
                                    </div>
    
                                    {/* Datas Indisponíveis */}
                                    <div className="mt-4">
                                        <label className="text-orange-500">Datas Indisponíveis:</label>
                                        <div className="flex flex-col">
                                            <DatePicker
                                                selected={dataSelecionada}
                                                onChange={(date) => setDataSelecionada(date)}
                                                dateFormat="yyyy/MM/dd"
                                                className="block mt-1 w-full rounded-md border-gray-300 focus:border-orange-500 focus:ring focus:ring-orange-500"
                                                placeholderText="Selecione uma data"
                                            />
                                            <div className="flex mt-2">
                                                <button type="button" onClick={handleAddDate} className="bg-blue-500 text-white px-3 py-1 rounded text-sm">Adicionar</button>
                                            </div>
                                            <ul className="mt-2">
                                                {datasIndisponiveis.map((timestamp, index) => (
                                                    <li key={index} className="flex justify-between items-center">
                                                        {new Date(timestamp).toLocaleDateString()}
                                                        <button type="button" onClick={() => handleRemoveDate(timestamp)} className="text-red-500 ml-2">Remover</button>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
    
                                    {/* Imagens */}
                                    <div className="mt-4">
                                        <label className="text-orange-500">Imagens:</label>
                                        <input
                                            type="file"
                                            multiple
                                            onChange={handleImageChange}
                                            className="bg-gray-700 text-white file:border-none file:bg-orange-500 file:rounded-md file:px-2 file:py-2 hover:file:bg-orange-600 focus:outline-none focus:ring-0"
                                        />
                                    </div>
    
                                    {/* Categorias */}
                                    <div className="mt-6">
                                        <label className="text-orange-500">Categorias:</label>
                                        <button 
                                            type="button" 
                                            onClick={toggleCheckboxes} 
                                            className="text-black bg-orange-500 hover:bg-orange-600 focus:ring-4 focus:ring-orange-300 rounded-md px-4 py-2 mt-2 transition duration-200 ease-in-out"
                                        >
                                            Selecionar Categorias
                                        </button>
    
                                        {checkboxOpen && (
                                            <div className="mt-4 bg-gray-800 border border-gray-500 rounded-md p-4 shadow-lg">
                                                {categorias.length > 0 ? (
                                                    categorias.map((categoria) => (
                                                        <div key={categoria.id} className="flex items-center space-x-2 mb-3">
                                                            <input
                                                                type="checkbox"
                                                                checked={formData.categoriaId.includes(categoria.id)}
                                                                onChange={() => handleCheckboxChange(categoria.id)}
                                                                className="rounded border-gray-300 text-orange-500 focus:ring-2 focus:ring-orange-500"
                                                            />
                                                            <label className="text-white">{categoria.titulo}</label>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="text-gray-400">Nenhuma categoria disponível.</div>
                                                )}
                                            </div>
                                        )}
                                    </div>
    
                                    {/* Botão de Envio */}
                                    <div className="mt-6">
                                        <Button type="submit" loading={isLoading} disabled={isLoading}>Criar Anúncio</Button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};    
export default CreateAnuncio;

