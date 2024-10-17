"use client"; // Certifique-se de que este componente é um Client Component

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ApplicationLogo from '@/components/ApplicationLogo';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [remember, setRemember] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch('http://localhost:8000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                const message = errorData.errors?.credentials?.[0] || 'Usuário não existe ou senha inválida.';
                setError(message);
                throw new Error(message);
            }

            const data = await response.json();
            localStorage.setItem('auth_token', data.token);
            router.push('/paginicial');
            router.reload(); // Atualiza a página para garantir que as mudanças sejam aplicadas
        } catch (error) {
            console.error('Erro na autenticação:', error);
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen flex items-center justify-center">
            <div className="bg-gray-700 p-8 rounded-lg shadow-lg max-w-md w-full">
                <div className="flex justify-center mb-4">
                    <ApplicationLogo className="h-16 w-16" />
                </div>

                <form onSubmit={handleSubmit}>
                    {error && <div className="text-red-500 mb-4 text-center">{error}</div>} 

                    <div>
                        <label htmlFor="email" className="block text-orange-500 mb-1">E-mail</label>
                        <input 
                            type="email" 
                            id="email" 
                            className="block w-full p-2 bg-gray-300 border border-orange-500 focus:border-orange-600 focus:ring focus:ring-orange-500 rounded-md" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                        />
                    </div>

                    <div className="mt-4">
                        <label htmlFor="password" className="block text-orange-500 mb-1">Senha</label>
                        <input 
                            type="password" 
                            id="password" 
                            className="block w-full p-2 bg-gray-300 border border-orange-500 focus:border-orange-600 focus:ring focus:ring-orange-500 rounded-md" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                        />
                    </div>

                    <div className="block mt-4">
                        <label className="inline-flex items-center text-orange-500">
                            <input 
                                type="checkbox" 
                                className="rounded border-gray-300 text-orange-600 shadow-sm focus:ring focus:ring-orange-500" 
                                checked={remember} 
                                onChange={(e) => setRemember(e.target.checked)} 
                            />
                            <span className="ml-2 text-sm">Lembrar de mim</span>
                        </label>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                        <Link href="/forgot-password" className="underline text-sm text-orange-500 hover:text-orange-400">Esqueceu sua senha?</Link>
                        <Link href="/register" className="underline text-sm text-orange-500 hover:text-orange-400">Não possui cadastro?</Link>
                    </div>

                    <button type="submit" className="mt-4 w-full bg-orange-500 hover:bg-orange-600 focus:bg-orange-600 text-white py-2 rounded-md transition duration-200 ease-in-out">Entrar</button>
                </form>
            </div>
        </div>
    );
};

export default Login;
