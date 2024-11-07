import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

const ProfileForm = () => {
    const [userData, setUserData] = useState({
        id: '',
        nome: '',
        sobrenome: '',
        telefone: '',
        email: '',
        datanasc: '',
        cnpj: '',
        endereco: {
            cidade: '',
            cep: '',
            numero: '',
            bairro: '',
        },
        tipousu: [], // Array para múltiplas seleções
    });

    const router = useRouter();

    // Função para buscar os dados do usuário
    const fetchUserData = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Token de autenticação não encontrado.');
            return;
        }

        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/profile`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                timeout: 10000,
            });
            const { user } = response.data;
            // Atualiza o estado com os dados do usuário
            setUserData({
                id: user.id,
                nome: user.nome,
                sobrenome: user.sobrenome,
                telefone: user.telefone,
                email: user.email,
                datanasc: user.datanasc,
                cnpj: user.cnpj,
                endereco: user.endereco,
                // Preenche o tipo de usuário aqui
                tipousu: user.tipousu || [],
            });
        } catch (error) {
            console.error('Erro ao buscar os dados do usuário:', error);
            alert('Erro ao buscar os dados do usuário. Tente novamente mais tarde.');
        }
    };

    useEffect(() => {
        // Chama a função apenas uma vez ao montar o componente
        fetchUserData();
    }, []); // Dependências vazias garantem que isso rode apenas uma vez

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleAddressChange = (e) => {
        const { name, value } = e.target;
        setUserData((prevData) => ({
            ...prevData,
            endereco: {
                ...prevData.endereco,
                [name]: value,
            },
        }));
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Token de autenticação não encontrado.');
            return;
        }

        try {
            const response = await axios.put(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/${userData.id}`,
                userData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (response.status === 200) {
                alert('Perfil atualizado com sucesso');
                window.location.replace('/paginicial');
            } else {
                console.error('Erro ao atualizar o perfil:', response.data);
                throw new Error('Erro ao atualizar o perfil');
            }
        } catch (error) {
            console.error('Erro na requisição de atualização do perfil:', error.response?.data || error);
            alert('Erro ao atualizar o perfil: ' + (error.response?.data.message || 'Erro desconhecido'));
        }
    };

    const handleUserTypeChange = (type) => {
        setUserData((prevData) => {
            const { tipousu } = prevData;
            if (tipousu.includes(type)) {
                return { ...prevData, tipousu: tipousu.filter((t) => t !== type) };
            } else {
                return { ...prevData, tipousu: [...tipousu, type] };
            }
        });
    };

    return (
        <div className="bg-gray-700 p-6 rounded-lg shadow-md mb-6">
            <h3 className="text-lg font-semibold text-orange-400">Atualizar Perfil</h3>
            <form onSubmit={handleProfileUpdate} className="mt-4 grid grid-cols-1 gap-6">
                <div>
                    <label className="text-orange-400">Nome:</label>
                    <input
                        type="text"
                        name="nome"
                        value={userData.nome || ''}
                        onChange={handleInputChange}
                        className="bg-gray-300 p-2 rounded w-full"
                    />
                </div>
                <div>
                    <label className="text-orange-400">Sobrenome:</label>
                    <input
                        type="text"
                        name="sobrenome"
                        value={userData.sobrenome || ''}
                        onChange={handleInputChange}
                        className="bg-gray-300 p-2 rounded w-full"
                    />
                </div>
                <div>
                    <label className="text-orange-400">Telefone:</label>
                    <input
                        type="text"
                        name="telefone"
                        value={userData.telefone || ''}
                        onChange={handleInputChange}
                        className="bg-gray-300 p-2 rounded w-full"
                    />
                </div>
                <div>
                    <label className="text-orange-400">Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={userData.email || ''}
                        onChange={handleInputChange}
                        className="bg-gray-300 p-2 rounded w-full"
                    />
                </div>
                <div>
                    <label className="text-orange-400">Data de Nascimento:</label>
                    <input
                        type="date"
                        name="datanasc"
                        value={userData.datanasc || ''}
                        onChange={handleInputChange}
                        className="bg-gray-300 p-2 rounded w-full"
                    />
                </div>
                <div>
                    <label className="text-orange-400">CNPJ:</label>
                    <input
                        type="text"
                        name="cnpj"
                        value={userData.cnpj || ''}
                        onChange={handleInputChange}
                        className="bg-gray-300 p-2 rounded w-full"
                    />
                </div>
                <div>
                    <label className="text-orange-400">Cidade:</label>
                    <input
                        type="text"
                        name="cidade"
                        value={userData.endereco?.cidade || ''}
                        onChange={handleAddressChange}
                        className="bg-gray-300 p-2 rounded w-full"
                    />
                </div>
                <div>
                    <label className="text-orange-400">CEP:</label>
                    <input
                        type="text"
                        name="cep"
                        value={userData.endereco?.cep || ''}
                        onChange={handleAddressChange}
                        className="bg-gray-300 p-2 rounded w-full"
                    />
                </div>
                <div>
                    <label className="text-orange-400">Número:</label>
                    <input
                        type="text"
                        name="numero"
                        value={userData.endereco?.numero || ''}
                        onChange={handleAddressChange}
                        className="bg-gray-300 p-2 rounded w-full"
                    />
                </div>
                <div>
                    <label className="text-orange-400">Bairro:</label>
                    <input
                        type="text"
                        name="bairro"
                        value={userData.endereco?.bairro || ''}
                        onChange={handleAddressChange}
                        className="bg-gray-300 p-2 rounded w-full"
                    />
                </div>
                <div>
                    <label className="text-orange-400">Tipos de Usuário:</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                        {['Locatario', 'Locador', 'Prestador'].map((type) => (
                            <div
                                key={type}
                                onClick={() => handleUserTypeChange(type)}
                                className={`border-2 p-4 rounded-lg cursor-pointer transition-colors duration-200
                                    ${userData.tipousu.includes(type) ? 'bg-orange-400 border-orange-500' : 'bg-gray-300 border-gray-400'}
                                    hover:bg-orange-400 hover:border-orange-500`}
                            >
                                {type}
                            </div>
                        ))}
                    </div>
                </div>
                <div className="col-span-1 sm:col-span-2">
                    <button type="submit" className="bg-orange-400 text-white p-2 rounded">
                        Atualizar Perfil
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProfileForm;
