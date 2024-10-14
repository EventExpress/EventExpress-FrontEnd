"use client"; // Certifique-se de que este componente seja um Client Component

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/Button'; // Ajuste o caminho conforme necessário
import ApplicationLogo from '@/components/ApplicationLogo'; // Importando a logo
import '@/app/globals.css';

const RegisterPage = () => {
    const router = useRouter();
    const [formData, setFormData] = useState({
        nome: '',
        sobrenome: '',
        telefone: '',
        datanasc: '',
        email: '',
        tipousu: [],
        cpf: '',
        cnpj: '',
        cidade: '',
        cep: '',
        numero: '',
        bairro: '',
        password: '',
    });
    const [isLoading, setIsLoading] = useState(false); // Estado para controle de loading

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "tipousu") {
            const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
            setFormData({ ...formData, [name]: selectedOptions });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true); // Ativa o estado de loading

        try {
            const response = await fetch('http://localhost:8000/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Usuário registrado com sucesso:', data);
                router.push('/login'); // Redireciona para a página de login após o registro bem-sucedido
            } else {
                const errorData = await response.json();
                console.error('Erro no registro:', errorData);
            }
        } catch (error) {
            console.error('Erro na requisição:', error);
        } finally {
            setIsLoading(false); // Desativa o estado de loading
        }
    };

    return (
        <div className="flex flex-col items-center p-4"> {/* Adicionando padding responsivo */}
            <ApplicationLogo className="mb-4" />
            <form onSubmit={handleSubmit} className="bg-gray-700 p-8 rounded-lg shadow-lg max-w-md w-full mx-auto">
                <div>
                    <label htmlFor="nome" className="block text-orange-500">Nome</label>
                    <input
                        id="nome"
                        className="block mt-1 w-full border border-gray-300 rounded-md shadow-sm p-2"
                        type="text"
                        name="nome"
                        value={formData.nome}
                        onChange={handleChange}
                        required
                        autoFocus
                    />
                </div>

                <div className="mt-4">
                    <label htmlFor="sobrenome" className="block text-orange-500">Sobrenome</label>
                    <input
                        id="sobrenome"
                        className="block mt-1 w-full border border-gray-300 rounded-md shadow-sm p-2"
                        type="text"
                        name="sobrenome"
                        value={formData.sobrenome}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mt-4">
                    <label htmlFor="telefone" className="block text-orange-500">Telefone</label>
                    <input
                        id="telefone"
                        className="block mt-1 w-full border border-gray-300 rounded-md shadow-sm p-2"
                        type="text"
                        name="telefone"
                        value={formData.telefone}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mt-4">
                    <label htmlFor="datanasc" className="block text-orange-500">Data de Nascimento</label>
                    <input
                        id="datanasc"
                        className="block mt-1 w-full border border-gray-300 rounded-md shadow-sm p-2"
                        type="date"
                        name="datanasc"
                        value={formData.datanasc}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mt-4">
                    <label htmlFor="email" className="block text-orange-500">Email</label>
                    <input
                        id="email"
                        className="block mt-1 w-full border border-gray-300 rounded-md shadow-sm p-2"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mt-4">
                    <label htmlFor="tipousu" className="block text-orange-500">Tipo de Usuário</label>
                    <select
                        id="tipousu"
                        name="tipousu"
                        value={formData.tipousu}
                        onChange={handleChange}
                        multiple
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    >
                        <option value="Locatario">Locatario</option>
                        <option value="Locador">Locador</option>
                        <option value="Prestador">Prestador</option>
                    </select>
                </div>

                <div className="mt-4">
                    <label htmlFor="cpf" className="block text-orange-500">CPF</label>
                    <input
                        id="cpf"
                        className="block mt-1 w-full border border-gray-300 rounded-md shadow-sm p-2"
                        type="text"
                        name="cpf"
                        value={formData.cpf}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mt-4" style={{ display: formData.tipousu.includes('Locador') || formData.tipousu.includes('Prestador') ? 'block' : 'none' }}>
                    <label htmlFor="cnpj" className="block text-orange-500">CNPJ</label>
                    <input
                        id="cnpj"
                        className="block mt-1 w-full border border-gray-300 rounded-md shadow-sm p-2"
                        type="text"
                        name="cnpj"
                        value={formData.cnpj}
                        onChange={handleChange}
                    />
                </div>

                <div className="mt-4">
                    <label htmlFor="cidade" className="block text-orange-500">Cidade</label>
                    <input
                        id="cidade"
                        className="block mt-1 w-full border border-gray-300 rounded-md shadow-sm p-2"
                        type="text"
                        name="cidade"
                        value={formData.cidade}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mt-4">
                    <label htmlFor="cep" className="block text-orange-500">CEP</label>
                    <input
                        id="cep"
                        className="block mt-1 w-full border border-gray-300 rounded-md shadow-sm p-2"
                        type="text"
                        name="cep"
                        value={formData.cep}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mt-4">
                    <label htmlFor="numero" className="block text-orange-500">Número</label>
                    <input
                        id="numero"
                        className="block mt-1 w-full border border-gray-300 rounded-md shadow-sm p-2"
                        type="text"
                        name="numero"
                        value={formData.numero}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mt-4">
                    <label htmlFor="bairro" className="block text-orange-500">Bairro</label>
                    <input
                        id="bairro"
                        className="block mt-1 w-full border border-gray-300 rounded-md shadow-sm p-2"
                        type="text"
                        name="bairro"
                        value={formData.bairro}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mt-4">
                    <label htmlFor="password" className="block text-orange-500">Senha</label>
                    <input
                        id="password"
                        className="block mt-1 w-full border border-gray-300 rounded-md shadow-sm p-2"
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>

                <Button type="submit" loading={isLoading} className="mt-4 bg-orange-500 text-white py-2 px-4 rounded-md w-full">
                    Registrar
                </Button>

                <div className="flex items-center justify-end mt-4">
                    <a className="underline text-sm text-orange-500 hover:text-gray-900" href="/login">
                        Já está registrado?
                    </a>
                </div>
            </form>
        </div>
    );
};

export default RegisterPage;
