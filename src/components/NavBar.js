import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import ApplicationLogo from './ApplicationLogo';
import { useAuth } from 'src/app/context/AuthContext';

const NavBar = () => {
    const { user, loading, logout } = useAuth();
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [userType, setUserType] = useState('Locatário');
    const [userTypeDropdown, setUserTypeDropdown] = useState(false);

    // Atualiza o tipo de usuário e opções da NavBar ao logar/deslogar
    useEffect(() => {
        const storedUserType = localStorage.getItem('userType');
        if (storedUserType) {
            setUserType(storedUserType);
        } else if (user) {
            setUserType(user.tipousu || 'Locatário');
        }
    }, [user]);  // Monitorando a mudança no estado 'user'

    // Fecha dropdowns ao clicar fora
    useEffect(() => {
        const handleClickOutside = (event) => {
            if ((dropdownOpen || userTypeDropdown) && !event.target.closest('.dropdown')) {
                setDropdownOpen(false);
                setUserTypeDropdown(false);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [dropdownOpen, userTypeDropdown]);

    const handleLogout = async () => {
        await logout();
        // Recarregar a página para garantir que a Navbar atualize
        window.location.reload();  // Ou use router.push('/') se preferir não recarregar completamente
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/anuncios/search?query=${encodeURIComponent(searchQuery)}`);
        }
    };

    const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
    const toggleUserTypeDropdown = () => setUserTypeDropdown(!userTypeDropdown);

    const handleUserTypeChange = (type) => {
        setUserType(type);
        setUserTypeDropdown(false);
        localStorage.setItem('userType', type);
    };

    return (
        <nav className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center">
                        <Link href="/">
                            <ApplicationLogo className="block h-9 w-auto fill-current text-orange-400 dark:text-gray-200" />
                        </Link>
                        <div className="hidden space-x-8 sm:-my-px sm:ml-10 sm:flex">
                            <Link href="/paginicial" className="text-gray-900 hover:bg-gray-300 px-3 py-2 rounded-md text-sm font-medium mt-2">
                                Início
                            </Link>
                        </div>
                    </div>

                    <form onSubmit={handleSearchSubmit} className="flex items-center">
                        <input
                            type="text"
                            name="search"
                            placeholder="Procurar Anúncio"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full px-4 py-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                        <button
                            type="submit"
                            className="ml-3 bg-orange-500 hover:bg-orange-600 focus:bg-orange-600 text-white px-4 py-2 rounded-md"
                        >
                            Buscar
                        </button>
                    </form>

                    <div className="hidden sm:flex sm:items-center sm:ml-6">
                        {loading ? (
                            <span className="text-gray-900">Carregando...</span>
                        ) : user ? (
                            <div className="relative dropdown">
                                <button
                                    onClick={toggleDropdown}
                                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-orange-400 bg-white hover:text-gray-700 focus:outline-none transition ease-in-out duration-150"
                                >
                                    <span>{user.user.nome}</span>
                                </button>

                                {dropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                                        <div className="py-1">
                                            <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                                Meu Perfil
                                            </Link>
                                            <Link href="/relatorios" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                                Relatórios
                                            </Link>
                                            {userType === 'Locatário' && (
                                                <Link href="/agendados/visualizar" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                                    Minhas Reservas
                                                </Link>
                                            )}
                                            {userType === 'Locador' && (
                                                <>
                                                    <Link href="/anuncios/meus-anuncios" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                                        Meus Anúncios
                                                    </Link>
                                                    <Link href="/anuncios/create" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                                        Criar Anúncio
                                                    </Link>
                                                </>
                                            )}
                                            {userType === 'Prestador' && (
                                                <>
                                                    <Link href="/servicos/meus-servicos" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                                        Meus Serviços
                                                    </Link>
                                                    <Link href="/servicos/create" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                                        Criar Serviço
                                                    </Link>
                                                </>
                                            )}
                                            <button
                                                onClick={handleLogout}
                                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            >
                                                Sair
                                            </button>
                                        </div>
                                    </div>
                                )}

                                <div className="relative inline-block ml-3">
                                    <button
                                        onClick={toggleUserTypeDropdown}
                                        className="px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 rounded-md focus:outline-none"
                                    >
                                        {userType}
                                    </button>

                                    {userTypeDropdown && (
                                        <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg z-10">
                                            {['Locatário', 'Locador', 'Prestador'].map((type) => (
                                                <button
                                                    key={type}
                                                    onClick={() => handleUserTypeChange(type)}
                                                    className={`block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 ${userType === type ? 'font-semibold text-orange-500 bg-white' : 'bg-white'}`}
                                                >
                                                    {type}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="flex space-x-4">
                                <Link href="/login" className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-2 rounded-md text-sm font-medium">Login</Link>
                                <Link href="/register" className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-2 rounded-md text-sm font-medium">Registrar</Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default NavBar;
