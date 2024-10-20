// src/pages/anuncio/create.js
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios'; // Importa o axios
import NavBar from '../../components/NavBar'; // Importa a NavBar
import Button from '@/components/Button'; // Ajuste o caminho conforme necessário

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
        agenda: '',
        categoriaId: [],
        imagens: [], // Adiciona o campo para imagens
    });
    const [categorias, setCategorias] = useState([]);
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [checkboxOpen, setCheckboxOpen] = useState(false);

    useEffect(() => {
        // Busque as categorias da API usando axios
        const fetchCategorias = async () => {
            try {
                const token = localStorage.getItem('token'); // Ou obtenha o token de onde você o armazena
                const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/anuncios/categoria`, {
                    headers: {
                        Authorization: `Bearer ${token}`, // Envia o token de autenticação
                    },
                });
                setCategorias(response.data);
            } catch (error) {
                console.error('Erro ao buscar categorias:', error);
            }
        };
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleImageChange = async (e) => {
        const files = Array.from(e.target.files);
        const base64Images = await Promise.all(files.map(file => convertToBase64(file)));
        setFormData({ ...formData, imagens: base64Images }); // Define o estado das imagens como os dados em base64
    };

    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result); // Retorna o resultado em base64
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setSuccessMessage('');
        setIsLoading(true);

        try {
            const response = await axios.post(
                'http://localhost:8000/api/anuncio',
                formData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`, // Adiciona o token no cabeçalho
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
                    agenda: '',
                    categoriaId: [],
                    imagens: [], // Limpa os campos após sucesso
                });
                router.push('/paginicial'); // Redireciona após o sucesso
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
            <NavBar /> {/* Adiciona a NavBar */}
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 block mt-1 w-full focus:border-orange-600 focus:ring-orange-500 rounded-md">
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
                                    <label htmlFor="agenda" className="text-orange-500">Agenda:</label>
                                    <input
                                        type="date"
                                        name="agenda"
                                        id="agenda"
                                        value={formData.agenda}
                                        onChange={handleChange}
                                        required
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
                            {categoria.nome}
                        </label>
                    </div>
                ))
            ) : (
                <div className="text-gray-500">Nenhuma categoria disponível.</div>
            )}
        </div>
    )}
</div>

                                <div className="mt-4">
                                    <label htmlFor="imagens" className="block text-orange-500 font-semibold mb-1">Imagens</label>
                                    <input
                                        id="imagens"
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={handleImageChange}
                                        required
                                        className="block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring focus:ring-orange-500"
                                    />
                                </div>

                                <div className="mt-6">
                                    <Button type="submit" loading={isLoading} className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition duration-200">
                                        Criar Anúncio
                                    </Button>
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
