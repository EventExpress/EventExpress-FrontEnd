// src/components/NavBar.js
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import ApplicationLogo from './ApplicationLogo';

const NavBar = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            setLoading(true);
            const token = localStorage.getItem('token'); // Obtenha o token de onde está armazenado

            if (token) {
                try {
                    const response = await fetch('http://localhost:8000/user', {
                        method: 'GET',
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    });

                    if (response.ok) {
                        const data = await response.json();
                        setUser(data); // Ajuste conforme a estrutura de resposta da sua API
                    } else {
                        console.error('Falha ao buscar usuário:', response.statusText);
                    }
                } catch (error) {
                    console.error('Erro ao buscar usuário:', error);
                }
            }
            setLoading(false);
        };

        fetchUser();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token'); // Remova o token ao fazer logout
        setUser(null); // Limpe o estado do usuário
    };

    return (
        <nav className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex">
                        {/* Logo */}
                        <div className="shrink-0 flex items-center">
                            <Link href="/">
                                <ApplicationLogo className="block h-9 w-auto fill-current text-orange-400 dark:text-gray-200" />
                            </Link>
                        </div>

                        {/* Navigation Links */}
                        <div className="hidden space-x-8 sm:-my-px sm:ml-10 sm:flex items-center">
                            <Link href="/" className="text-gray-900 hover:bg-gray-300 px-3 py-2 rounded-md text-sm font-medium">
                                Início
                            </Link>
                            {user && user.tipousu !== 'Locador' && (
                                <Link href="/anuncio/create" className="text-gray-900 hover:bg-gray-300 px-3 py-2 rounded-md text-sm font-medium">
                                    Criar Anúncio
                                </Link>
                            )}
                        </div>
                    </div>

                    <div className="hidden sm:flex sm:items-center sm:ml-6">
                        {loading ? (
                            <span className="text-gray-900">Carregando...</span>
                        ) : user ? (
                            <div className="flex items-center space-x-4">
                                <span className="text-gray-900">{user.nome}</span> {/* Ajuste conforme a propriedade correta */}
                                <Link href="/profile" className="text-gray-900 hover:bg-gray-300 px-3 py-2 rounded-md text-sm font-medium">
                                    Meu Perfil
                                </Link>
                                <Link href="/reservas" className="text-gray-900 hover:bg-gray-300 px-3 py-2 rounded-md text-sm font-medium">
                                    Visualizar Reservas
                                </Link>
                                <button
                                    onClick={handleLogout} // Chama a função de logout
                                    className="text-gray-900 hover:bg-gray-300 px-3 py-2 rounded-md text-sm font-medium"
                                >
                                    Sair
                                </button>
                            </div>
                        ) : (
                            <div>
                                <Link href="/login" className="bg-orange-500 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-orange-600">Login</Link>
                                <Link href="/register" className="bg-gray-500 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-gray-600 ml-2">Registrar</Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default NavBar;
