// pages/profile.js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import NavBar from '../components/NavBar'; // Verifique se o caminho está correto
import ProfileForm from '../components/ProfileForm'; // Novo componente
import PasswordUpdateForm from '../components/PasswordUpdateForm'; // Novo componente
import DeleteAccount from '../components/DeleteAccount'; // Novo componente
import axios from 'axios'; // Importa o axios
import Footer from '../components/Footer'; // Importa o Footer

const ProfilePage = () => {
    const [userData, setUserData] = useState({
        nome: '',
        sobrenome: '',
        email: '',
        telefone: '',
        datanasc: '',
        tipousu: 'Locatário',
        cpf: '',
        cnpj: '',
        endereco: {
            cidade: '',
            cep: '',
            numero: '',
            bairro: '',
        },
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem('auth_token');
            if (!token) {
                router.push('/login');
                return;
            }

            try {
                const response = await axios.get('http://localhost:8000/api/user/profile', {
                    headers: {
                        Authorization: `Bearer ${token}`, // Adiciona o token de autenticação
                    },
                });

                console.log('Usuário encontrado com sucesso:', response.data);
                setUserData(response.data.user); // Atualiza os dados do usuário
            } catch (error) {
                console.error('Erro ao buscar os dados do usuário:', error.response?.data || error.message);
                setError('Erro ao buscar os dados do usuário'); // Atualiza a mensagem de erro
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [router]);

    if (loading) return <div className="loading">Carregando...</div>;
    if (error) return <div className="error">Erro: {error}</div>;

    return (
        <>
            <NavBar />
            <section className="mx-auto mt-10 max-w-7xl w-full md:w-3/4 lg:w-2/3 xl:w-1/2">
                <h1 className="text-3xl font-semibold text-orange-400">Meu Perfil</h1>
                <ProfileForm userData={userData} setUserData={setUserData} />
                <PasswordUpdateForm />
                <DeleteAccount />
            </section>
            <Footer /> {/* Adiciona o Footer ao final da página */}
        </>
    );
};

export default ProfilePage;
