"use client"; // Certifique-se de que este componente seja um Client Component

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios'; // Importa o axios
import Button from '@/components/Button'; // Ajuste o caminho conforme necessário
import ApplicationLogo from '@/components/ApplicationLogo'; // Importando a logo
import Link from 'next/link'; // Importando o Link do Next.js
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
            const newTipousu = formData.tipousu.includes(value)
                ? formData.tipousu.filter((tip) => tip !== value)
                : [...formData.tipousu, value];

            setFormData({ ...formData, tipousu: newTipousu });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true); // Ativa o estado de loading

        try {
            const response = await axios.post('http://localhost:8000/api/register', formData);
            console.log('Usuário registrado com sucesso:', response.data);
            router.push('/login'); // Redireciona para a página de login após o registro bem-sucedido
        } catch (error) {
            if (error.response) {
                console.error('Erro no registro:', error.response.data);
            } else {
                console.error('Erro na requisição:', error.message);
            }
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

                {/* Seção de Tipo de Usuário com Checkboxes */}
                <div className="mt-4">
                    <label className="block text-orange-500">Tipo de Usuário</label>
                    <div className="flex flex-col">
                        <label className="inline-flex items-center mt-2">
                            <input
                                type="checkbox"
                                name="tipousu"
                                value="Locatario"
                                checked={formData.tipousu.includes("Locatario")}
                                onChange={handleChange}
                                className="form-checkbox h-5 w-5 text-orange-600"
                            />
                            <span className="ml-2 text-white">Locatário</span>
                        </label>
                        <label className="inline-flex items-center mt-2">
                            <input
                                type="checkbox"
                                name="tipousu"
                                value="Locador"
                                checked={formData.tipousu.includes("Locador")}
                                onChange={handleChange}
                                className="form-checkbox h-5 w-5 text-orange-600"
                            />
                            <span className="ml-2 text-white">Locador</span>
                        </label>
                        <label className="inline-flex items-center mt-2">
                            <input
                                type="checkbox"
                                name="tipousu"
                                value="Prestador"
                                checked={formData.tipousu.includes("Prestador")}
                                onChange={handleChange}
                                className="form-checkbox h-5 w-5 text-orange-600"
                            />
                            <span className="ml-2 text-white">Prestador</span>
                        </label>
                    </div>
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

                <Button type="submit" className="mt-6 w-full" disabled={isLoading}>
                    {isLoading ? 'Registrando...' : 'Registrar'}
                </Button>

                {/* Adicionando "Já possui cadastro?" abaixo do botão */}
                <p className="mt-4 text-center text-white">
                    Já possui cadastro?{' '}
                    <Link href="/login" className="text-orange-500 underline">
                        Faça login
                    </Link>
                </p>
            </form>
        </div>
    );
};

export default RegisterPage;
