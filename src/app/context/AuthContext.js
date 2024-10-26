import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [anuncios, setAnuncios] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchUserAndAnuncios = async () => {
      const token = localStorage.getItem('auth_token');

      if (token) {
        try {
          // Busca o usuário autenticado
          const userResponse = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/profile`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setUser(userResponse.data);

          // Busca os anúncios autenticados
          const anunciosResponse = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/anuncios`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          // Ajuste aqui: use anunciosResponse.data.anuncios para setar o estado
          setAnuncios(anunciosResponse.data.anuncios); // Agora estamos pegando o array de anúncios
          console.log("Dados dos anúncios:", anunciosResponse.data.anuncios); // Verifica se os anúncios estão sendo recebidos corretamente
        } catch (error) {
          console.error('Erro ao buscar usuário ou anúncios:', error);
          router.push('/login');
        }
      } else {
        router.push('/login');
      }

      setLoading(false); // Mova para fora do bloco if para garantir que está sendo chamado
    };

    fetchUserAndAnuncios();
  }, []); // Adicionando o array vazio para garantir que o efeito só rode uma vez

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/login`, {
        email,
        password,
      });
      localStorage.setItem('auth_token', response.data.token);
      setUser(response.data.user);
      router.push('/');
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    setUser(null);
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
