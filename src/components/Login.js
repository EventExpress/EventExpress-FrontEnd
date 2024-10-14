"use client"; // Certifique-se de que este componente é um Client Component 

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Importa useRouter
import ApplicationLogo from '@/components/ApplicationLogo'; // Importe o componente da logo

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [remember, setRemember] = useState(false);
    const router = useRouter(); // Cria uma instância do roteador

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const response = await fetch('http://localhost:8000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                throw new Error('Falha na autenticação');
            }

            const data = await response.json();
            localStorage.setItem('auth_token', data.token); // Salve o token se necessário

            // Redirecionar para a página desejada após login
            router.push('/paginicial'); // Alterado para redirecionar para paginicial
        } catch (error) {
            console.error('Erro na autenticação:', error);
        }
    };

    return (
        <div className="bg-gray-10 min-h-screen flex items-center justify-center">
            <div className="bg-gray-700 p-8 rounded-lg shadow-lg w-full max-w-md">
                {/* Componente da logo */}
                <div className="flex justify-center mb-4">
                    <ApplicationLogo className="h-16 w-16" />
                </div>

                <form onSubmit={handleSubmit}>
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
                                className="rounded border-gray-300 text-orange-600 shadow-sm focus:ring-orange-500" 
                                checked={remember} 
                                onChange={(e) => setRemember(e.target.checked)} 
                            />
                            <span className="ml-2 text-sm">lembrar de mim</span>
                        </label>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                        <Link href="/forgot-password" className="underline text-sm text-orange-500 hover:text-orange-400">Esqueceu sua senha?</Link>
                        <Link href="/register" className="underline text-sm text-orange-500 hover:text-orange-400">Não possui cadastro?</Link>
                    </div>

                    <button type="submit" className="mt-4 w-full bg-orange-500 hover:bg-orange-600 focus:bg-orange-600 text-white py-2 rounded-md">Entrar</button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
