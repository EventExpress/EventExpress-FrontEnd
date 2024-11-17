import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import NavBar from '../../components/NavBar';
import Button from '@/components/Button';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import Footer from '../../components/Footer';
import Modal from 'react-modal'; 


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
    const [isModalOpen, setIsModalOpen] = useState(false);

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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const resizeImage = (file, maxWidth = 800, maxHeight = 800) => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            const reader = new FileReader();
    
            reader.onload = (e) => {
                img.src = e.target.result;
            };
    
            reader.onerror = (error) => reject(error);
            reader.readAsDataURL(file);
    
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                let width = img.width;
                let height = img.height;
    
                if (width > height) {
                    if (width > maxWidth) {
                        height = Math.round(height * (maxWidth / width));
                        width = maxWidth;
                    }
                } else {
                    if (height > maxHeight) {
                        width = Math.round(width * (maxHeight / height));
                        height = maxHeight;
                    }
                }
    
                canvas.width = width;
                canvas.height = height;
                ctx.drawImage(img, 0, 0, width, height);
    
                const resizedDataUrl = canvas.toDataURL(file.type);
                resolve(resizedDataUrl);
            };
        });
    };
    
    const handleImageChange = async (e) => {
        const files = Array.from(e.target.files);
        const resizedImages = await Promise.all(files.map(async (file) => {
            return await resizeImage(file);
        }));
        setFormData({ ...formData, imagens: resizedImages });
    };

    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            if (typeof window !== 'undefined') {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => resolve(reader.result);
                reader.onerror = (error) => reject(error);
            } else {
                reject(new Error("FileReader não é suportado no servidor"));
            }
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
                setIsModalOpen(true);
                setTimeout(() => {
                    router.push('/paginicial');
                }, 2000);
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
    const closeModal = () => setIsModalOpen(false);

    const toggleCheckboxes = () => {
        setCheckboxOpen(!checkboxOpen);
    };

    return (
        <div>
            <NavBar /> 
            <div className="bg-cover bg-center bg-fixed"
                style={{backgroundImage: "url('/images/teste.jpg')", backgroundSize: "cover", backgroundPosition: "center",
                }}>
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
                                    <div className="mt-4">
                                        <label htmlFor="titulo" className="text-orange-500 capitalize">Título:</label>
                                        <input type="text" name="titulo" id="titulo" value={formData.titulo}
                                            onChange={handleChange}
                                            required
                                            className="block mt-1 w-full rounded-md border-gray-300 focus:border-orange-500 focus:ring focus:ring-orange-500"/>
                                    </div>
                                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                                        <div>
                                            <label htmlFor="cep" className="text-orange-500">CEP:</label>
                                            <input type="text" name="cep" id="cep" value={formData.cep}
                                                onChange={handleChange}
                                                required
                                                className="block mt-1 w-full rounded-md border-gray-300 focus:border-orange-500 focus:ring focus:ring-orange-500"/>
                                        </div>
                                        <div>
                                            <label htmlFor="cidade" className="text-orange-500">Cidade:</label>
                                            <input type="text" name="cidade" id="cidade" value={formData.cidade}
                                                onChange={handleChange}
                                                required
                                                className="block mt-1 w-full rounded-md border-gray-300 focus:border-orange-500 focus:ring focus:ring-orange-500"/>
                                        </div>
                                        <div>
                                            <label htmlFor="numero" className="text-orange-500">Número:</label>
                                            <input type="text" name="numero" id="numero" value={formData.numero}
                                                onChange={handleChange}
                                                required
                                                className="block mt-1 w-full rounded-md border-gray-300 focus:border-orange-500 focus:ring focus:ring-orange-500"/>
                                        </div>
                                        <div>
                                            <label htmlFor="bairro" className="text-orange-500">Bairro:</label>
                                            <input type="text" name="bairro" id="bairro" value={formData.bairro}
                                                onChange={handleChange}
                                                required
                                                className="block mt-1 w-full rounded-md border-gray-300 focus:border-orange-500 focus:ring focus:ring-orange-500"/>
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <label htmlFor="descricao" className="text-orange-500">Descrição:</label>
                                        <textarea name="descricao" id="descricao" value={formData.descricao}
                                            onChange={handleChange}
                                            required
                                            className="block mt-1 w-full rounded-md border-gray-300 focus:border-orange-500 focus:ring focus:ring-orange-500"/>
                                    </div>
                                    <div className="mt-4">
                                        <label htmlFor="capacidade" className="text-orange-500">Capacidade:</label>
                                        <input type="number" name="capacidade" id="capacidade" value={formData.capacidade}
                                            onChange={handleChange}
                                            required
                                            className="block mt-1 w-full rounded-md border-gray-300 focus:border-orange-500 focus:ring focus:ring-orange-500"/>
                                    </div>                                                       
                                    <div className="mt-4">
                                        <label htmlFor="valor" className="text-orange-500">Valor:</label>
                                        <input type="number" name="valor" id="valor" value={formData.valor}
                                            onChange={handleChange}
                                            required
                                            className="block mt-1 w-full rounded-md border-gray-300 focus:border-orange-500 focus:ring focus:ring-orange-500"/>
                                    </div>
                                    <div className="mt-4">
                                        <label className="text-orange-500">Datas Indisponíveis:</label>
                                        <div className="flex flex-col">
                                            <DatePicker selected={dataSelecionada}
                                                onChange={(date) => setDataSelecionada(date)}
                                                dateFormat="yyyy/MM/dd"
                                                className="block mt-1 w-full rounded-md border-gray-300 focus:border-orange-500 focus:ring focus:ring-orange-500"
                                                placeholderText="Selecione uma data"/>
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
                                        <label htmlFor="imagens" className="text-orange-500">Imagens:</label>
                                        <input type="file" name="imagens" id="imagens" multiple accept="image/*"
                                            onChange={handleImageChange}
                                            className="block mt-1 w-full rounded-md border-gray-300 focus:border-orange-500 focus:ring focus:ring-orange-500"/>
                                        <div className="mt-2">
                                            {formData.imagens && formData.imagens.length > 0 && (
                                                <div className="flex flex-wrap gap-4">{formData.imagens.map((image, index) => (
                                                    <img key={index} src={image} alt={`Imagem ${index + 1}`} className="w-32 h-32 object-cover rounded-md" />
                                                ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="mt-6">
                                        <label className="text-orange-500">Categorias:</label>
                                        <button type="button" onClick={toggleCheckboxes} 
                                            className="text-black bg-orange-500 hover:bg-orange-600 focus:ring-4 focus:ring-orange-300 rounded-md px-4 py-2 mt-2 transition duration-200 ease-in-out">
                                            Selecionar Categorias
                                        </button>
                                        {checkboxOpen && (
                                            <div className="mt-4 bg-gray-800 border border-gray-500 rounded-md p-4 shadow-lg">
                                                {categorias.length > 0 ? ( categorias.map((categoria) => (
                                                        <div key={categoria.id} className="flex items-center space-x-2 mb-3">
                                                            <input type="checkbox" checked={formData.categoriaId.includes(categoria.id)}
                                                                onChange={() => handleCheckboxChange(categoria.id)}
                                                                className="rounded border-gray-300 text-orange-500 focus:ring-2 focus:ring-orange-500"/>
                                                            <label className="text-white">{categoria.titulo}</label>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="text-gray-400">Nenhuma categoria disponível.</div>
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
                <Modal isOpen={!!successMessage} onRequestClose={() => setSuccessMessage('')}
                    contentLabel="Anúncio Criado"
                    className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50"
                    overlayClassName="fixed inset-0 bg-gray-800 bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full text-center">
                        <h2 className="text-xl font-semibold text-green-600">Sucesso!</h2>
                        <p className="mt-2 text-gray-700">{successMessage}</p>
                        <button onClick={() => setSuccessMessage('')} className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Fechar</button>
                    </div>
                </Modal>
            </div>
            <Footer />
        </div>
    );
};

export default CreateAnuncio;

