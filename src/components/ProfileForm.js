import { useState } from 'react';

const ProfileForm = ({ userData, setUserData }) => {
    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleAddressChange = (e) => {
        const { name, value } = e.target;
        setUserData((prevState) => ({
            ...prevState,
            endereco: {
                ...prevState.endereco,
                [name]: value,
            },
        }));
    };

    const handleTipoUsuChange = (e) => {
        const { value } = e.target;
        setUserData((prevState) => ({
            ...prevState,
            tipousu: value,
            cnpj: value !== 'Locador' ? '' : prevState.cnpj,
        }));
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('auth_token');
        if (!token) {
            
            return;
        }

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/${userData.id}`, {  
                method: 'PUT',  
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),  
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Erro ao atualizar o perfil:', errorText);
                throw new Error('Erro ao atualizar o perfil');
            }

            alert('Perfil atualizado com sucesso');
        } catch (error) {
            console.error('Erro na requisição de atualização do perfil:', error);
            alert('Erro ao atualizar o perfil');
        }
    };

    return (
        <div className="bg-gray-700 p-6 rounded-lg shadow-md mb-6">
            <h3 className="text-lg font-semibold text-orange-400">Dados do Perfil</h3>
            <form onSubmit={handleProfileUpdate} className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Campos de Dados do Usuário */}
                <div>
                    <label className="text-orange-400">Nome</label>
                    <input
                        type="text"
                        name="nome"
                        value={userData.nome}
                        onChange={handleChange}
                        className="bg-gray-300 p-2 rounded w-full"
                        required
                    />
                </div>
                <div>
                    <label className="text-orange-400">Sobrenome</label>
                    <input
                        type="text"
                        name="sobrenome"
                        value={userData.sobrenome}
                        onChange={handleChange}
                        className="bg-gray-300 p-2 rounded w-full"
                        required
                    />
                </div>
                <div>
                    <label className="text-orange-400">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={userData.email}
                        onChange={handleChange}
                        className="bg-gray-300 p-2 rounded w-full"
                        required
                    />
                </div>
                <div>
                    <label className="text-orange-400">Telefone</label>
                    <input
                        type="tel"
                        name="telefone"
                        value={userData.telefone}
                        onChange={handleChange}
                        className="bg-gray-300 p-2 rounded w-full"
                    />
                </div>
                <div>
                    <label className="text-orange-400">Data de Nascimento</label>
                    <input
                        type="date"
                        name="datanasc"
                        value={userData.datanasc}
                        onChange={handleChange}
                        className="bg-gray-300 p-2 rounded w-full"
                    />
                </div>
                <div>
                    <label className="text-orange-400">Tipo de Usuário</label>
                    <select
                        name="tipousu"
                        value={userData.tipousu}
                        onChange={handleTipoUsuChange}
                        className="bg-gray-300 p-2 rounded w-full"
                    >
                        <option value="Cliente">Cliente</option>
                        <option value="Locador">Locador</option>
                        <option value="Locatário">Locatário</option>
                    </select>
                </div>
                {userData.tipousu === 'Locador' && (
                    <div>
                        <label className="text-orange-400">CNPJ</label>
                        <input
                            type="text"
                            name="cnpj"
                            value={userData.cnpj}
                            onChange={handleChange}
                            className="bg-gray-300 p-2 rounded w-full"
                        />
                    </div>
                )}
                <div>
                    <label className="text-orange-400">Cidade</label>
                    <input
                        type="text"
                        name="cidade"
                        value={userData.endereco.cidade}
                        onChange={handleAddressChange}
                        className="bg-gray-300 p-2 rounded w-full"
                    />
                </div>
                <div>
                    <label className="text-orange-400">CEP</label>
                    <input
                        type="text"
                        name="cep"
                        value={userData.endereco.cep}
                        onChange={handleAddressChange}
                        className="bg-gray-300 p-2 rounded w-full"
                    />
                </div>
                <div>
                    <label className="text-orange-400">Número</label>
                    <input
                        type="text"
                        name="numero"
                        value={userData.endereco.numero}
                        onChange={handleAddressChange}
                        className="bg-gray-300 p-2 rounded w-full"
                    />
                </div>
                <div>
                    <label className="text-orange-400">Bairro</label>
                    <input
                        type="text"
                        name="bairro"
                        value={userData.endereco.bairro}
                        onChange={handleAddressChange}
                        className="bg-gray-300 p-2 rounded w-full"
                    />
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
