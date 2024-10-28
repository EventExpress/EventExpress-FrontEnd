// components/PasswordUpdateForm.js
import { useState } from 'react';

const PasswordUpdateForm = () => {
    const [passwordData, setPasswordData] = useState({
        current_password: '',
        new_password: '',
        password_confirmation: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPasswordData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        if (!token) {
            // Redirecionar para login se o token não estiver presente
            return;
        }

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/update-password`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(passwordData),
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Erro ao atualizar a senha:', errorText);
                throw new Error('Erro ao atualizar a senha');
            }

            alert('Senha atualizada com sucesso');
        } catch (error) {
            console.error('Erro na requisição de atualização de senha:', error);
            alert('Erro ao atualizar a senha');
        }
    };

    return (
        <div className="bg-gray-700 p-6 rounded-lg shadow-md mb-6">
            <h3 className="text-lg font-semibold text-orange-400">Atualizar Senha</h3>
            <form onSubmit={handlePasswordUpdate} className="mt-4 grid grid-cols-1 gap-6">
                <div>
                    <label className="text-orange-400">Senha Atual</label>
                    <input
                        type="password"
                        name="current_password"
                        required
                        onChange={handleChange}
                        className="bg-gray-300 p-2 rounded w-full"
                    />
                </div>
                <div>
                    <label className="text-orange-400">Nova Senha</label>
                    <input
                        type="password"
                        name="new_password"
                        required
                        onChange={handleChange}
                        className="bg-gray-300 p-2 rounded w-full"
                    />
                </div>
                <div>
                    <label className="text-orange-400">Confirmar Nova Senha</label>
                    <input
                        type="password"
                        name="password_confirmation"
                        required
                        onChange={handleChange}
                        className="bg-gray-300 p-2 rounded w-full"
                    />
                </div>
                <div className="col-span-1 sm:col-span-2">
                    <button type="submit" className="bg-orange-400 text-white p-2 rounded">
                        Atualizar Senha
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PasswordUpdateForm;
