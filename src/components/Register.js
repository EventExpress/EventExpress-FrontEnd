"use client"; // Certifique-se de que este componente seja um Client Component

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
    const [fieldErrors, setFieldErrors] = useState({}); // Estado para mensagens de erro específicas dos campos

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

        // Limpa a mensagem de erro ao digitar
        setFieldErrors((prevErrors) => ({
            ...prevErrors,
            [name]: '', // Limpa o erro do campo específico
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true); // Ativa o estado de loading
        setFieldErrors({}); // Limpa os erros de campo ao iniciar o registro

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

                // Atualiza os erros específicos para os campos
                if (errorData.errors) {
                    setFieldErrors(errorData.errors); // Supondo que a API retorna erros em um formato específico
                } else {
                    setFieldErrors({ global: 'Erro ao registrar.' }); // Erro global
                }
            }
        } catch (error) {
            console.error('Verifique as informações.', error);
            setFieldErrors({ global: 'Verifique as informações.' }); // Define a mensagem de erro em caso de erro de rede
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
                        className={`block mt-1 w-full border ${fieldErrors.nome ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm p-2`}
                        type="text"
                        name="nome"
                        value={formData.nome}
                        onChange={handleChange}
                        required
                        autoFocus
                    />
                    {fieldErrors.nome && <p className="text-red-500 text-sm mt-1">{fieldErrors.nome}</p>} {/* Mensagem de erro */}
                </div>

                <div className="mt-4">
                    <label htmlFor="sobrenome" className="block text-orange-500">Sobrenome</label>
                    <input
                        id="sobrenome"
                        className={`block mt-1 w-full border ${fieldErrors.sobrenome ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm p-2`}
                        type="text"
                        name="sobrenome"
                        value={formData.sobrenome}
                        onChange={handleChange}
                        required
                    />
                    {fieldErrors.sobrenome && <p className="text-red-500 text-sm mt-1">{fieldErrors.sobrenome}</p>} {/* Mensagem de erro */}
                </div>

                <div className="mt-4">
                    <label htmlFor="telefone" className="block text-orange-500">Telefone</label>
                    <input
                        id="telefone"
                        className={`block mt-1 w-full border ${fieldErrors.telefone ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm p-2`}
                        type="text"
                        name="telefone"
                        value={formData.telefone}
                        onChange={handleChange}
                        required
                    />
                    {fieldErrors.telefone && <p className="text-red-500 text-sm mt-1">{fieldErrors.telefone}</p>} {/* Mensagem de erro */}
                </div>

                <div className="mt-4">
                    <label htmlFor="datanasc" className="block text-orange-500">Data de Nascimento</label>
                    <input
                        id="datanasc"
                        className={`block mt-1 w-full border ${fieldErrors.datanasc ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm p-2`}
                        type="date"
                        name="datanasc"
                        value={formData.datanasc}
                        onChange={handleChange}
                        required
                    />
                    {fieldErrors.datanasc && <p className="text-red-500 text-sm mt-1">{fieldErrors.datanasc}</p>} {/* Mensagem de erro */}
                </div>

                <div className="mt-4">
                    <label htmlFor="email" className="block text-orange-500">Email</label>
                    <input
                        id="email"
                        className={`block mt-1 w-full border ${fieldErrors.email ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm p-2`}
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                    {fieldErrors.email && <p className="text-red-500 text-sm mt-1">{fieldErrors.email}</p>} {/* Mensagem de erro */}
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
                        className={`block mt-1 w-full border ${fieldErrors.cpf ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm p-2`}
                        type="text"
                        name="cpf"
                        value={formData.cpf}
                        onChange={handleChange}
                        required
                    />
                    {fieldErrors.cpf && <p className="text-red-500 text-sm mt-1">{fieldErrors.cpf}</p>} {/* Mensagem de erro */}
                </div>

                <div className="mt-4">
                    <label htmlFor="cnpj" className="block text-orange-500">CNPJ</label>
                    <input
                        id="cnpj"
                        className={`block mt-1 w-full border ${fieldErrors.cnpj ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm p-2`}
                        type="text"
                        name="cnpj"
                        value={formData.cnpj}
                        onChange={handleChange}
                    />
                    {fieldErrors.cnpj && <p className="text-red-500 text-sm mt-1">{fieldErrors.cnpj}</p>} {/* Mensagem de erro */}
                </div>

                <div className="mt-4">
                    <label htmlFor="cidade" className="block text-orange-500">Cidade</label>
                    <input
                        id="cidade"
                        className={`block mt-1 w-full border ${fieldErrors.cidade ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm p-2`}
                        type="text"
                        name="cidade"
                        value={formData.cidade}
                        onChange={handleChange}
                        required
                    />
                    {fieldErrors.cidade && <p className="text-red-500 text-sm mt-1">{fieldErrors.cidade}</p>} {/* Mensagem de erro */}
                </div>

                <div className="mt-4">
                    <label htmlFor="cep" className="block text-orange-500">CEP</label>
                    <input
                        id="cep"
                        className={`block mt-1 w-full border ${fieldErrors.cep ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm p-2`}
                        type="text"
                        name="cep"
                        value={formData.cep}
                        onChange={handleChange}
                        required
                    />
                    {fieldErrors.cep && <p className="text-red-500 text-sm mt-1">{fieldErrors.cep}</p>} {/* Mensagem de erro */}
                </div>

                <div className="mt-4">
                    <label htmlFor="numero" className="block text-orange-500">Número</label>
                    <input
                        id="numero"
                        className={`block mt-1 w-full border ${fieldErrors.numero ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm p-2`}
                        type="text"
                        name="numero"
                        value={formData.numero}
                        onChange={handleChange}
                        required
                    />
                    {fieldErrors.numero && <p className="text-red-500 text-sm mt-1">{fieldErrors.numero}</p>} {/* Mensagem de erro */}
                </div>

                <div className="mt-4">
                    <label htmlFor="bairro" className="block text-orange-500">Bairro</label>
                    <input
                        id="bairro"
                        className={`block mt-1 w-full border ${fieldErrors.bairro ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm p-2`}
                        type="text"
                        name="bairro"
                        value={formData.bairro}
                        onChange={handleChange}
                        required
                    />
                    {fieldErrors.bairro && <p className="text-red-500 text-sm mt-1">{fieldErrors.bairro}</p>} {/* Mensagem de erro */}
                </div>

                <div className="mt-4">
                    <label htmlFor="password" className="block text-orange-500">Senha</label>
                    <input
                        id="password"
                        className={`block mt-1 w-full border ${fieldErrors.password ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm p-2`}
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                    {fieldErrors.password && <p className="text-red-500 text-sm mt-1">{fieldErrors.password}</p>} {/* Mensagem de erro */}
                </div>

                {fieldErrors.global && ( // Exibe a mensagem de erro global se existir
                    <div className="mt-4 text-red-500">
                        {fieldErrors.global}
                    </div>
                )}

                <Button type="submit" className={`mt-4 w-full ${isLoading ? 'bg-gray-400' : 'bg-orange-500 hover:bg-orange-600'}`} disabled={isLoading}>
                    {isLoading ? 'Registrando...' : 'Registrar'}
                </Button>
            </form>

            <p className="mt-4 text-gray-500">
                Já tem uma conta?{' '}
                <Link href="/login" className="text-orange-500 hover:underline">Faça login</Link>
            </p>
        </div>
    );
};

export default RegisterPage;
