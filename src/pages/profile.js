// pages/profile.js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import NavBar from '../components/NavBar'; // Verifique se o caminho está correto
import ProfileForm from '../components/ProfileForm'; // Novo componente
import PasswordUpdateForm from '../components/PasswordUpdateForm'; // Novo componente
import DeleteAccount from '../components/DeleteAccount'; // Novo componente

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
                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/profile`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    console.error('Erro ao buscar os dados do usuário:', errorText);
                    throw new Error('Erro ao buscar os dados do usuário');
                }

                const data = await response.json();
                if (data.status) {
                    setUserData(data.user);
                } else {
                    throw new Error('Usuário não encontrado');
                }
            } catch (error) {
                setError(error.message);
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
        </>
    );
};

export default ProfilePage;
