import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [anuncios, setAnuncios] = useState([]);
  const [servicos, setServicos] = useState([]);
  const [userType, setUserType] = useState('Locatário');
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUserType = localStorage.getItem('userType');
      if (storedUserType) {
        setUserType(storedUserType);
      }
    }
  }, []);

  // Função para buscar o token de autenticação
  const getAuthToken = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  };

  // Função para verificar se o token existe e é válido
  const fetchUserAnunciosAndServicos = async () => {
    const token = getAuthToken();
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const headers = { Authorization: `Bearer ${token}` };

      // Requisição para obter o perfil do usuário
      const userResponse = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/profile`, { headers });
      setUser(userResponse.data);

      // Requisição para obter os anúncios do usuário
      const anunciosResponse = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/anuncios`, { headers });
      setAnuncios(anunciosResponse.data.anuncios);

      // Requisição para obter os serviços do usuário
      const servicosResponse = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/servicos`, { headers });
      setServicos(servicosResponse.data.servicos);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        // Token expirado ou inválido, faça logout e redirecione para o login
        console.error('Token expirado ou inválido. Redirecionando para login...');
        localStorage.removeItem('token');
        router.push('/login');
      } else {
        console.error('Erro ao buscar dados:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserAnunciosAndServicos();
  }, []);

  useEffect(() => {
    if (userType && typeof window !== 'undefined') {
      localStorage.setItem('userType', userType);
    }
  }, [userType]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/login`, { email, password });
      localStorage.setItem('token', response.data.token);  // Armazena o token no localStorage
      await fetchUserAnunciosAndServicos(); // Atualiza dados após o login
      router.replace('/');  // Redireciona para a página inicial
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setAnuncios([]);
    setServicos([]);
    setUserType('Locatário');
    router.push('/login');
  };

  const handleUserTypeChange = (newUserType) => {
    setUserType(newUserType);
  };

  return (
    <AuthContext.Provider value={{
      user, loading, anuncios, servicos, login, logout, userType, handleUserTypeChange
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
