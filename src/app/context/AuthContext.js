import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [anuncios, setAnuncios] = useState([]);
  const router = useRouter();

  const fetchUserAndAnuncios = async () => {
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

        // Busca os anúncios do usuário
        const anunciosResponse = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/anuncios`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setAnuncios(anunciosResponse.data.anuncios);
        console.log("Dados dos anúncios:", anunciosResponse.data.anuncios);
      } catch (error) {
        console.error('Erro ao buscar usuário ou anúncios:', error);
        localStorage.removeItem('token'); // Limpa o token em caso de erro
        router.push('/login');
      }
    } else {
      router.push('/login');
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchUserAndAnuncios();
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
      await fetchUserAndAnuncios(); // Atualiza o usuário e anúncios após login
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
    setAnuncios([]); // Limpa os anúncios ao sair
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, loading, anuncios, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
