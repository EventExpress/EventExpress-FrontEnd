import React, { useState, useEffect, useRef } from 'react';
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

    const dropdownRef = useRef(null);
    const buttonRef = useRef(null);
    const userTypeButtonRef = useRef(null);

    // Atualiza o tipo de usuário e opções da NavBar ao logar/deslogar
    useEffect(() => {
        const storedUserType = localStorage.getItem('userType');
        if (storedUserType) {
            setUserType(storedUserType);
        } else if (user) {
            setUserType(user.tipousu || 'Locatário');
        }
    }, [user]);  // Monitorando a mudança no estado 'user'

    useEffect(() => {
        const handleClickOutside = (event) => {
            // Fechar dropdown principal de usuário se clicar fora
            if (dropdownOpen && buttonRef.current && dropdownRef.current && 
                !buttonRef.current.contains(event.target) && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
            // Fechar dropdown do tipo de usuário se clicar fora
            if (userTypeDropdown && userTypeButtonRef.current && dropdownRef.current &&
                !userTypeButtonRef.current.contains(event.target) && !dropdownRef.current.contains(event.target)) {
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
        window.location.reload();  
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            // Redireciona para a página de anúncios com o parâmetro de busca
            router.push(`/anuncios?search=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
    const toggleUserTypeDropdown = () => setUserTypeDropdown(!userTypeDropdown);

    const handleUserTypeChange = (type) => {
        setUserType(type);
        setUserTypeDropdown(false);
        localStorage.setItem('userType', type);
        router.push('/paginicial');
    };

    return (
        <nav className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center">
                        <Link href="/paginicial" className="flex items-center">
                            <ApplicationLogo className="block h-9 w-auto fill-current text-orange-400 dark:text-gray-200" />
                            <label className="ml-3 text-orange-400 font-bold text-xl cursor-pointer">
                                EventExpress
                            </label>
                        </Link>
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
                                    ref={buttonRef}  // Referência para o botão de dropdown
                                    onClick={toggleDropdown}
                                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-orange-400 bg-white hover:text-gray-700 focus:outline-none transition ease-in-out duration-150"
                                >
                                    <span>{user.user.nome}</span>
                                </button>

                                {dropdownOpen && (
                                    <div ref={dropdownRef} className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                                        <div className="py-1">
                                            <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                                Meu Perfil
                                            </Link>
                                            {userType === 'Locatário' && (
                                                <>
                                                    <Link href="/agendados/visualizar" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                                        Minhas Reservas
                                                    </Link>
                                                    <Link href="/agendados/historico" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                                        Histórico
                                                    </Link>
                                                    <Link href="/relatorios" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                                        Relatórios
                                                    </Link>
                                                </>
                                            )}
                                            {userType === 'Locador' && (
                                                <>
                                                    <Link href="/anuncios/meus-anuncios" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                                        Meus Anúncios
                                                    </Link>
                                                    <Link href="/anuncios/create" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                                        Criar Anúncio
                                                    </Link>
                                                    <Link href="/anuncios/relatorios" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                                        Relatórios
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
                                                    <Link href="/servicos/relatorios" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                                        Relatórios
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
                            </div>
                        ) : (
                            <div className="flex space-x-4">
                                <Link href="/login" className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-2 rounded-md text-sm font-medium">Login</Link>
                                <Link href="/register" className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-2 rounded-md text-sm font-medium">Registrar</Link>
                            </div>
                        )}

                        {/* Mostrar o tipo de usuário somente quando o usuário estiver logado */}
                        {user && (
                            <div className="relative inline-block ml-3">
                                <button
                                    ref={userTypeButtonRef}  // Referência para o botão de dropdown do tipo de usuário
                                    onClick={toggleUserTypeDropdown}
                                    className="px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 rounded-md focus:outline-none"
                                >
                                    {userType}
                                </button>

                                {userTypeDropdown && (
                                    <div ref={dropdownRef} className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg z-10">
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
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default NavBar;
