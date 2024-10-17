// src/pages/servicos/edit.js
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import NavBar from '../../components/NavBar'; 

const EditServico = () => {
    const router = useRouter();
    const { id } = router.query; // Obtém o ID do serviço da URL
    const [formData, setFormData] = useState({
        nome: '',
        descricao: '',
        preco: '',
        categoriaId: [],
        dataDisponibilidade: {
            dia: '',
            horarioInicio: '',
            horarioFim: '',
        },
    });
    const [categorias, setCategorias] = useState([]);
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');
    const [checkboxOpen, setCheckboxOpen] = useState(false);

    useEffect(() => {
        // Verifica o tipo de usuário
        const user = JSON.parse(localStorage.getItem('user')); 
        if (!user || user.tipo !== 'Prestador') {
            router.push('/'); // Redireciona se não for Prestador
        }

        // Busque as categorias da API
        fetch('http://localhost:8000/api/categorias')
            .then((response) => response.json())
            .then((data) => setCategorias(data))
            .catch((error) => console.error('Erro ao buscar categorias:', error));

        // Busca os dados do serviço para editar
        if (id) {
            fetch(`http://localhost:8000/api/servico/${id}`)
                .then((response) => response.json())
                .then((data) => {
                    setFormData({
                        nome: data.nome,
                        descricao: data.descricao,
                        preco: data.preco,
                        categoriaId: data.categoriaId || [],
                        dataDisponibilidade: {
                            dia: data.dataDisponibilidade.dia || '',
                            horarioInicio: data.dataDisponibilidade.horarioInicio || '',
                            horarioFim: data.dataDisponibilidade.horarioFim || '',
                        },
                    });
                })
                .catch((error) => console.error('Erro ao buscar serviço:', error));
        }
    }, [id, router]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleDataChange = (e) => {
        const { name, value } = e.target;
        setFormData({ 
            ...formData, 
            dataDisponibilidade: { ...formData.dataDisponibilidade, [name]: value } 
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

        const formDataToSend = {
            ...formData,
        };

        try {
            const response = await fetch(`http://localhost:8000/api/servico/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(formDataToSend),
            });

            if (response.ok) {
                setSuccessMessage('Serviço editado com sucesso!');
                router.push('/servicos');
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
            <NavBar />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200 rounded-lg">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Editar Serviço</h2>
                            {successMessage && <p className="text-green-500">{successMessage}</p>}
                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <label htmlFor="nome" className="block text-sm font-medium text-orange-500">Nome:</label>
                                    <input
                                        type="text"
                                        name="nome"
                                        id="nome"
                                        value={formData.nome}
                                        onChange={handleChange}
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
                                        value={formData.descricao}
                                        onChange={handleChange}
                                        required
                                        className="form-input mt-1 block w-full rounded-lg"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="preco" className="block text-sm font-medium text-orange-500">Preço:</label>
                                    <input
                                        type="text"
                                        name="preco"
                                        id="preco"
                                        value={formData.preco}
                                        onChange={handleChange}
                                        required
                                        className="form-input mt-1 block w-full rounded-lg"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="dia" className="block text-sm font-medium text-orange-500">Data de Disponibilidade:</label>
                                    <input
                                        type="date"
                                        name="dia"
                                        id="dia"
                                        value={formData.dataDisponibilidade.dia}
                                        onChange={handleDataChange}
                                        required
                                        className="form-input mt-1 block w-full rounded-lg"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="horarioInicio" className="block text-sm font-medium text-orange-500">Horário de Início:</label>
                                    <input
                                        type="time"
                                        name="horarioInicio"
                                        id="horarioInicio"
                                        value={formData.dataDisponibilidade.horarioInicio}
                                        onChange={handleDataChange}
                                        required
                                        className="form-input mt-1 block w-full rounded-lg"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="horarioFim" className="block text-sm font-medium text-orange-500">Horário de Fim:</label>
                                    <input
                                        type="time"
                                        name="horarioFim"
                                        id="horarioFim"
                                        value={formData.dataDisponibilidade.horarioFim}
                                        onChange={handleDataChange}
                                        required
                                        className="form-input mt-1 block w-full rounded-lg"
                                    />
                                </div>
                                <div>
                                    <button type="submit" className="bg-gray-700 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg">Salvar</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditServico;
