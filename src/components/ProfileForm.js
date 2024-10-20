import React, { useState, useEffect } from 'react';
import axios from 'axios';

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
        tipousu: [], // Mantendo tipousu aqui
    });

    const fetchUserData = async () => {
        const token = localStorage.getItem('auth_token');
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
            setUserData({
                id: user.id,
                nome: user.nome,
                sobrenome: user.sobrenome,
                telefone: user.telefone,
                email: user.email,
                datanasc: user.datanasc,
                cnpj: user.cnpj,
                endereco: user.endereco,
                tipousu: user.tipousu || [], // Ajustado para usar tipousu
            });
        } catch (error) {
            console.error('Erro ao buscar os dados do usuário:', error);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []);

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
        const token = localStorage.getItem('auth_token');
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
            } else {
                console.error('Erro ao atualizar o perfil:', response.data);
                throw new Error('Erro ao atualizar o perfil');
            }
        } catch (error) {
            console.error('Erro na requisição de atualização do perfil:', error.response?.data || error);
            alert('Erro ao atualizar o perfil: ' + (error.response?.data.message || 'Erro desconhecido'));
        }
    };

    return (
        <form onSubmit={handleProfileUpdate} className="profile-form">
            <div>
                <label htmlFor="nome">Nome:</label>
                <input
                    type="text"
                    name="nome"
                    value={userData.nome || ''}
                    onChange={handleInputChange}
                    className="bg-gray-300 p-2 rounded w-full"
                />
            </div>
            <div>
                <label htmlFor="sobrenome">Sobrenome:</label>
                <input
                    type="text"
                    name="sobrenome"
                    value={userData.sobrenome || ''}
                    onChange={handleInputChange}
                    className="bg-gray-300 p-2 rounded w-full"
                />
            </div>
            <div>
                <label htmlFor="telefone">Telefone:</label>
                <input
                    type="text"
                    name="telefone"
                    value={userData.telefone || ''}
                    onChange={handleInputChange}
                    className="bg-gray-300 p-2 rounded w-full"
                />
            </div>
            <div>
                <label htmlFor="email">Email:</label>
                <input
                    type="email"
                    name="email"
                    value={userData.email || ''}
                    onChange={handleInputChange}
                    className="bg-gray-300 p-2 rounded w-full"
                />
            </div>
            <div>
                <label htmlFor="datanasc">Data de Nascimento:</label>
                <input
                    type="date"
                    name="datanasc"
                    value={userData.datanasc || ''}
                    onChange={handleInputChange}
                    className="bg-gray-300 p-2 rounded w-full"
                />
            </div>
            <div>
                <label htmlFor="cnpj">CNPJ:</label>
                <input
                    type="text"
                    name="cnpj"
                    value={userData.cnpj || ''}
                    onChange={handleInputChange}
                    className="bg-gray-300 p-2 rounded w-full"
                />
            </div>
            <div>
                <label htmlFor="cidade">Cidade:</label>
                <input
                    type="text"
                    name="cidade"
                    value={userData.endereco?.cidade || ''}
                    onChange={handleAddressChange}
                    className="bg-gray-300 p-2 rounded w-full"
                />
            </div>
            <div>
                <label htmlFor="cep">CEP:</label>
                <input
                    type="text"
                    name="cep"
                    value={userData.endereco?.cep || ''}
                    onChange={handleAddressChange}
                    className="bg-gray-300 p-2 rounded w-full"
                />
            </div>
            <div>
                <label htmlFor="numero">Número:</label>
                <input
                    type="text"
                    name="numero"
                    value={userData.endereco?.numero || ''}
                    onChange={handleAddressChange}
                    className="bg-gray-300 p-2 rounded w-full"
                />
            </div>
            <div>
                <label htmlFor="bairro">Bairro:</label>
                <input
                    type="text"
                    name="bairro"
                    value={userData.endereco?.bairro || ''}
                    onChange={handleAddressChange}
                    className="bg-gray-300 p-2 rounded w-full"
                />
            </div>
            <div>
    <label>Tipos de Usuário:</label>
    <select
        name="tipousu"
        value={userData.tipousu} // Aqui, usamos um array diretamente
        onChange={(e) => {
            const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
            handleInputChange({ target: { name: 'tipousu', value: selectedOptions } });
        }}
        multiple // Permite múltiplas seleções
        className="bg-gray-300 p-2 rounded w-full"
    >
        <option value="">Selecione</option>
        <option value="Locatario">Locatário</option>
        <option value="Locador">Locador</option>
        <option value="Prestador">Prestador</option>
        <option value="admin">Admin</option>
    </select>
</div>

            <button type="submit" className="bg-blue-500 text-white p-2 rounded mt-4">Atualizar Perfil</button>
        </form>
    );
};

export default ProfileForm;
