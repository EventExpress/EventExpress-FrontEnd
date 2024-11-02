// src/pages/servicos/criar.js

import NavBar from '../../components/NavBar'; // ajuste o caminho conforme necessário
import { useState } from 'react';

const CriarServico = () => {
    const [titulo, setTitulo] = useState('');
    const [descricao, setDescricao] = useState('');
    const [valor, setValor] = useState('');
    const [dataDisponibilidade, setDataDisponibilidade] = useState({
        dia: '',
        horarioInicio: '',
        horarioFim: '',
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch('http://localhost:8000/api/servicos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ 
                titulo, 
                descricao, 
                valor,
                dataDisponibilidade 
            }),
        });

        if (response.ok) {
            // redirecionar ou mostrar mensagem de sucesso
        } else {
            // lidar com erro
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
                                {/* Campos existentes */}
                                <div className="mb-4">
                                    <label htmlFor="titulo" className="block text-sm font-medium text-orange-500">Nome do Adicional:</label>
                                    <input
                                        type="text"
                                        name="titulo"
                                        id="titulo"
                                        value={titulo}
                                        onChange={(e) => setTitulo(e.target.value)}
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
                                        type="text"
                                        name="valor"
                                        id="valor"
                                        value={valor}
                                        onChange={(e) => setValor(e.target.value)}
                                        required
                                        className="form-input mt-1 block w-full rounded-lg"
                                    />
                                </div>
                                {/* Campos de data de disponibilidade */}
                                <div className="mb-4">
                                    <label htmlFor="dia" className="block text-sm font-medium text-orange-500">Data de Disponibilidade:</label>
                                    <input
                                        type="date"
                                        name="dia"
                                        id="dia"
                                        value={dataDisponibilidade.dia}
                                        onChange={(e) => setDataDisponibilidade({ ...dataDisponibilidade, dia: e.target.value })}
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
                                        value={dataDisponibilidade.horarioInicio}
                                        onChange={(e) => setDataDisponibilidade({ ...dataDisponibilidade, horarioInicio: e.target.value })}
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
                                        value={dataDisponibilidade.horarioFim}
                                        onChange={(e) => setDataDisponibilidade({ ...dataDisponibilidade, horarioFim: e.target.value })}
                                        required
                                        className="form-input mt-1 block w-full rounded-lg"
                                    />
                                </div>
                                <div>
                                    <button type="submit" className="bg-gray-700 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg">Enviar</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CriarServico;
