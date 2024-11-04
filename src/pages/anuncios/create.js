import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import NavBar from '../../components/NavBar';
import Button from '@/components/Button';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

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
            <NavBar />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
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

                            <h2 className="font-semibold text-2xl text-gray-800 leading-tight">Adicionar Anúncio</h2>
                            <form onSubmit={handleSubmit}>
                                {['titulo', 'cidade', 'cep', 'numero', 'bairro', 'capacidade', 'valor'].map((field, index) => (
                                    <div key={index} className="mt-4">
                                        <label htmlFor={field} className="text-orange-500 capitalize">{field}:</label>
                                        <input
                                            type={field === 'capacidade' || field === 'valor' ? 'number' : 'text'}
                                            name={field}
                                            id={field}
                                            value={formData[field]}
                                            onChange={handleChange}
                                            required
                                            className="block mt-1 w-full rounded-md border-gray-300 focus:border-orange-500 focus:ring focus:ring-orange-500"
                                        />
                                    </div>
                                ))}

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

                                <div className="mt-4">
                                    <label className="text-orange-500">Imagens:</label>
                                    <input
                                        type="file"
                                        multiple
                                        onChange={handleImageChange}
                                        className="block mt-1 w-full rounded-md border-gray-300 focus:border-orange-500 focus:ring focus:ring-orange-500"
                                    />
                                </div>

                                <div className="mt-4">
                                    <label className="text-orange-500">Categorias:</label>
                                    <button type="button" onClick={toggleCheckboxes} className="text-blue-600">Selecionar Categorias</button>
                                    {checkboxOpen && (
                                        <div className="mt-2 border border-gray-300 rounded-md p-2">
                                            {categorias.length > 0 ? (
                                                categorias.map((categoria) => (
                                                    <div key={categoria.id}>
                                                        <label className="flex items-center">
                                                            <input
                                                                type="checkbox"
                                                                checked={formData.categoriaId.includes(categoria.id)}
                                                                onChange={() => handleCheckboxChange(categoria.id)}
                                                                className="mr-2"
                                                            />
                                                            {categoria.titulo}
                                                        </label>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="text-gray-500">Nenhuma categoria disponível.</div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                <div className="mt-6">
                                    <Button type="submit" loading={isLoading} disabled={isLoading}>Criar Anúncio</Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateAnuncio;
