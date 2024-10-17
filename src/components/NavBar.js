import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import ApplicationLogo from './ApplicationLogo';
import { useAuth } from '@/context/AuthContext'; // Importa o useAuth

const NavBar = () => {
    const { user, loading, logout } = useAuth(); // Obtém user, loading e logout do contexto
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // useEffect para re-renderizar o componente quando o estado de autenticação mudar
    useEffect(() => {
        // Esse efeito será chamado sempre que o estado de `user` mudar
    }, [user]);

    const handleLogout = () => {
        logout(); // Chama a função de logout do contexto
        window.location.reload(); // Atualiza a página após o logout para garantir que o estado seja redefinido
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        console.log('Buscando:', searchQuery);
        // Aqui você pode redirecionar para uma página de resultados de busca, se necessário
    };

    return (
        <nav className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <div className="shrink-0 flex items-center">
                            <Link href="/">
                                <ApplicationLogo className="block h-9 w-auto fill-current text-orange-400 dark:text-gray-200" />
                            </Link>
                        </div>

                        <div className="hidden space-x-8 sm:-my-px sm:ml-10 sm:flex">
                            <Link href="/" className="text-gray-900 hover:bg-gray-300 px-3 py-2 rounded-md text-sm font-medium">
                                Início
                            </Link>
                            {user && user.tipousu === 'Locatário' && (
                                <Link href="/reservas" className="text-gray-900 hover:bg-gray-300 px-3 py-2 rounded-md text-sm font-medium">
                                    Minhas Reservas
                                </Link>
                            )}
                            {user && user.tipousu === 'Locador' && (
                                <>
                                    <Link href="/meus-anuncios" className="text-gray-900 hover:bg-gray-300 px-3 py-2 rounded-md text-sm font-medium">
                                        Meus Anúncios
                                    </Link>
                                    <Link href="/anuncio/create" className="text-gray-900 hover:bg-gray-300 px-3 py-2 rounded-md text-sm font-medium">
                                        Criar Anúncio
                                    </Link>
                                </>
                            )}
                            {user && user.tipousu === 'Prestador' && (
                                <Link href="/meus-servicos" className="text-gray-900 hover:bg-gray-300 px-3 py-2 rounded-md text-sm font-medium">
                                    Meus Serviços
                                </Link>
                            )}
                        </div>
                    </div>

                    <form onSubmit={handleSearchSubmit} className="flex items-center justify-center">
                        <input
                            type="text"
                            name="search"
                            placeholder="Procurar Anúncio"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full px-4 py-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                        <button type="submit" className="ml-3 bg-orange-500 hover:bg-orange-600 focus:bg-orange-600 focus:ring-orange-500 text-white px-4 py-2 rounded-md">
                            Buscar
                        </button>
                    </form>

                    <div className="hidden sm:flex sm:items-center sm:ml-6">
                        {loading ? (
                            <span className="text-gray-900">Carregando...</span>
                        ) : user ? (
                            <div className="relative">
                                <button onClick={() => setDropdownOpen(!dropdownOpen)} className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-orange-400 dark:text-gray-400 bg-white dark:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none transition ease-in-out duration-150">
                                    <div>{user.nome}</div>
                                    <div className="ml-1">
                                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                </button>

                                {dropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                                        <div className="py-1">
                                            <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Meu Perfil</Link>
                                            <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                                Sair
                                            </button>
                                        </div>
                                    </div>
                                )}
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
