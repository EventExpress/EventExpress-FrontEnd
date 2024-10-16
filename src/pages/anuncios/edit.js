// src/pages/anuncio/edit.js
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import NavBar from '../../components/NavBar'; // Importa a NavBar

const EditAnuncio = () => {
    const router = useRouter();
    const { id } = router.query; // Obtém o ID do anúncio da URL
    const [formData, setFormData] = useState({
        titulo: '',
        cidade: '',
        cep: '',
        numero: '',
        bairro: '',
        capacidade: '',
        descricao: '',
        categoriaId: [],
        imagem: null, // Adiciona um estado para a imagem
    });
    const [categorias, setCategorias] = useState([]);
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');
    const [checkboxOpen, setCheckboxOpen] = useState(false);

    useEffect(() => {
        // Busque as categorias da API
        fetch('http://localhost:8000/api/categorias')
            .then((response) => response.json())
            .then((data) => setCategorias(data))
            .catch((error) => console.error('Erro ao buscar categorias:', error));

        // Busque os dados do anúncio para editar
        if (id) {
            fetch(`http://localhost:8000/api/anuncio/${id}`)
                .then((response) => response.json())
                .then((data) => {
                    setFormData({
                        titulo: data.titulo,
                        cidade: data.endereco.cidade,
                        cep: data.endereco.cep,
                        numero: data.endereco.numero,
                        bairro: data.endereco.bairro,
                        capacidade: data.capacidade,
                        descricao: data.descricao,
                        categoriaId: data.categoriaId || [],
                        imagem: null, // Reseta a imagem para não conflitar com o estado anterior
                    });
                })
                .catch((error) => console.error('Erro ao buscar anúncio:', error));
        }
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
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

    const handleImageChange = (e) => {
        setFormData({ ...formData, imagem: e.target.files[0] }); // Captura o arquivo da imagem
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setSuccessMessage('');

        const formDataToSend = new FormData();
        Object.keys(formData).forEach((key) => {
            formDataToSend.append(key, formData[key]);
        });

        try {
            const response = await fetch(`http://localhost:8000/api/anuncio/${id}`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: formDataToSend, // Envia o FormData
            });

            if (response.ok) {
                setSuccessMessage('Anúncio editado com sucesso!');
                router.push('/anuncio'); // Redireciona após a edição
            } else {
                const errorData = await response.json();
                setErrors(errorData.errors || {});
            }
        } catch (error) {
            console.error('Erro ao enviar formulário:', error);
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
                        <div className="p-6 text-gray-900 dark:text-gray-800 rounded-lg">
                            {successMessage && (
                                <div className="mb-4 font-medium text-sm text-green-600">
                                    <strong>{successMessage}</strong>
                                </div>
                            )}

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

                            <h1 className="text-2xl font-semibold mb-4 text-orange-500">Editar Anúncio</h1>

                            <form onSubmit={handleSubmit}>
                                {['titulo', 'cidade', 'cep', 'numero', 'bairro', 'capacidade', 'descricao'].map((field, index) => (
                                    <div key={index} className="mb-4">
                                        <label htmlFor={field} className="block text-sm font-medium text-orange-500 capitalize">{field}:</label>
                                        <input
                                            type={field === 'capacidade' ? 'number' : 'text'}
                                            name={field}
                                            id={field}
                                            value={formData[field]}
                                            onChange={handleChange}
                                            required
                                            className="form-input mt-1 block w-full rounded-lg border-gray-300 focus:border-orange-500 focus:ring focus:ring-orange-500"
                                        />
                                        {errors[field] && (
                                            <div className="text-red-500 mt-1 text-sm">{errors[field]}</div>
                                        )}
                                    </div>
                                ))}

                                <div className="mb-4">
                                    <label htmlFor="imagem" className="block text-sm font-medium text-orange-500">Imagem:</label>
                                    <input
                                        type="file"
                                        name="imagem"
                                        id="imagem"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="form-input mt-1 block w-full rounded-lg border-gray-300 focus:border-orange-500 focus:ring focus:ring-orange-500"
                                    />
                                </div>

                                <div className="mb-4 relative">
                                    <label className="block text-sm font-medium text-orange-500">Trocar categoria:</label>
                                    <button type="button" onClick={toggleCheckboxes} className="block w-full mt-1 rounded-lg border border-gray-500 bg-white text-left px-4 py-2 focus:outline-none">
                                        Selecionar Categorias
                                    </button>
                                    {checkboxOpen && (
                                        <div className="absolute mt-1 w-full rounded-lg border border-gray-300 bg-white z-10 max-h-60 overflow-y-auto">
                                            {categorias.map((categoria) => (
                                                <div key={categoria.id} className="flex items-center px-4 py-2 hover:bg-gray-100">
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.categoriaId.includes(categoria.id)}
                                                        onChange={() => handleCheckboxChange(categoria.id)}
                                                        className="form-checkbox h-4 w-4 text-orange-600"
                                                    />
                                                    <label className="ml-2 block text-sm text-gray-900">
                                                        {categoria.nome}
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg">
                                        Editar Anúncio
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditAnuncio;
