// src/context/AuthContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios'; // Certifique-se de que o axios está instalado
import { useRouter } from 'next/router';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem('auth_token');

            if (token) {
                try {
                    const response = await axios.get('http://localhost:8000/api/user/profile', {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    console.log('Dados do usuário:', response.data); // Verifique os dados aqui
                    setUser(response.data.user); // Certifique-se de que isso contém o tipo
                } catch (err) {
                    console.error('Erro ao buscar o perfil do usuário:', err);
                    setError('Erro ao buscar o perfil do usuário.');
                    setUser(null); // Se houver erro, defina o usuário como nulo
                }
            }
            setLoading(false);
        };

        fetchUser();
    }, []); // O array de dependências vazio faz a requisição apenas uma vez ao montar o componente

    const login = async (credentials) => {
        setLoading(true);
        try {
            const response = await axios.post('http://localhost:8000/api/login', credentials);
            const { token, user } = response.data;

            localStorage.setItem('auth_token', token);
            setUser(user);
            router.push('/paginicial');
        } catch (err) {
            console.error('Erro ao fazer login:', err);
            setError('Falha ao fazer login. Verifique suas credenciais.');
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem('auth_token');
        setUser(null);
        setError(null);
        router.push('/'); // Redireciona para a página inicial após logout
    };

    const updateUser = async () => {
        const token = localStorage.getItem('auth_token');
        if (token) {
            try {
                const response = await axios.get('http://localhost:8000/api/user/profile', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setUser(response.data.user); // Atualiza o estado do usuário
            } catch (err) {
                console.error('Erro ao atualizar o perfil do usuário:', err);
                setUser(null); // Se houver erro, defina o usuário como nulo
            }
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, error, login, logout, updateUser }}>
            {loading ? <div>Carregando...</div> : children}
            {error && <div className="error">{error}</div>}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
