// pages/profile.js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const ProfilePage = () => {
    const [userData, setUserData] = useState(null);
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
                console.log('Dados do usuário:', data); // Log para verificar os dados
                if (data.status) {
                    setUserData(data.user); // Acesse o campo 'user'
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

    const handleLogout = async () => {
        const token = localStorage.getItem('auth_token');
        if (!token) {
            router.push('/login');
            return;
        }

        try {
            const response = await fetch(`http://localhost:8000/api/user/logout`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Erro ao fazer logout:', errorText);
                throw new Error('Erro ao fazer logout');
            }

            localStorage.removeItem('auth_token'); // Remove o token do localStorage
            router.push('/login'); // Redireciona para a página de login
        } catch (error) {
            console.error('Erro na requisição de logout:', error);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;
    if (!userData) return <p>No user data found.</p>;

    return (
        <div className="bg-gray-700 p-8 rounded-lg shadow-lg max-w-md mx-auto">
            <h1 className="text-orange-500 text-2xl">Perfil do Usuário</h1>
            <div className="mt-4">
                <p><strong>ID:</strong> {userData.id}</p>
                <p><strong>Nome:</strong> {userData.nome}</p>
                <p><strong>Sobrenome:</strong> {userData.sobrenome}</p>
                <p><strong>Email:</strong> {userData.email}</p>
                <p><strong>Telefone:</strong> {userData.telefone}</p>
                <p><strong>Data de Nascimento:</strong> {userData.datanasc}</p>
                <p><strong>CPF:</strong> {userData.cpf}</p>
                <p><strong>CNPJ:</strong> {userData.cnpj}</p>
                <p><strong>Endereço:</strong></p>
                <ul>
                    <li><strong>Cidade:</strong> {userData.endereco?.cidade || 'N/A'}</li>
                    <li><strong>CEP:</strong> {userData.endereco?.cep || 'N/A'}</li>
                    <li><strong>Número:</strong> {userData.endereco?.numero || 'N/A'}</li>
                    <li><strong>Bairro:</strong> {userData.endereco?.bairro || 'N/A'}</li>
                </ul>
                <p><strong>Tipo de Usuário:</strong> {userData.type_users?.map(type => type.tipousu).join(', ') || 'N/A'}</p>
                <p><strong>Data de Criação:</strong> {userData.created_at}</p>
                <p><strong>Última Atualização:</strong> {userData.updated_at}</p>
            </div>
            <button 
                onClick={handleLogout} 
                className="mt-6 bg-red-500 text-white py-2 px-4 rounded-md"
            >
                Sair
            </button>
        </div>
    );
};

export default ProfilePage;
