import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [anuncios, setAnuncios] = useState([]);
  const [servicos, setServicos] = useState([]); // Novo estado para serviços
  const router = useRouter();

  const fetchUserAnunciosAndServicos = async () => {
    const token = localStorage.getItem('token');

    if (token) {
      try {
        // Busca o usuário autenticado
        const userResponse = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(userResponse.data);

        const anunciosResponse = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/anuncios`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAnuncios(anunciosResponse.data.anuncios);

        // Busca os serviços
        const servicosResponse = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/servicos`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setServicos(servicosResponse.data.servicos);
      } catch (error) {
        console.error('Erro ao buscar dados do usuário, anúncios ou serviços:', error);
        localStorage.removeItem('token'); 
        router.push('/login');
      }
    } else {
      router.push('/login');
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchUserAnunciosAndServicos();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/login`, {
        email,
        password,
      });
      localStorage.setItem('token', response.data.token);
      setUser(response.data.user);
      await fetchUserAnunciosAndServicos(); // Atualiza o usuário, anúncios e serviços após login
      router.push('/');
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
    setServicos([]); // Limpa os serviços ao sair
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, loading, anuncios, servicos, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
