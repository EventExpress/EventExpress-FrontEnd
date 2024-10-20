// src/context/AuthContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios'; // Certifique-se de que o axios está instalado

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
                    setUser(response.data.user); // Supondo que a resposta contém os dados do usuário
                } catch (err) {
                    console.error('Erro ao buscar o perfil do usuário:', err);
                    setError('Erro ao buscar o perfil do usuário.');
                }
            }
            setLoading(false);
        };

        fetchUser();
    }, []);

    const login = async (credentials) => {
        try {
            const response = await axios.post('http://localhost:8000/api/login', credentials);
            const { token, user } = response.data;

            localStorage.setItem('auth_token', token);
            setUser(user);
        } catch (err) {
            console.error('Erro ao fazer login:', err);
            setError('Falha ao fazer login. Verifique suas credenciais.');
        }
    };

    const logout = () => {
        localStorage.removeItem('auth_token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, error, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
//export const useAuth = () => {
//   return useContext(AuthContext);
//};
