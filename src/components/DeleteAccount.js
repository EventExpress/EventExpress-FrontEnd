// components/DeleteAccount.js
const DeleteAccount = ({ userId }) => {
    const handleDeleteAccount = async () => {
        const confirmDelete = confirm('Essa ação é irreversível. Você tem certeza que deseja deletar sua conta?');
        if (!confirmDelete) return;

        const token = localStorage.getItem('token');
        if (!token) {
            // Redirecionar para login se o token não estiver presente
            window.location.href = '/login';
            return;
        }

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/delete/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json', // Adicionando o cabeçalho de tipo de conteúdo
                },
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Erro ao deletar a conta:', errorText);
                throw new Error('Erro ao deletar a conta');
            }

            alert('Conta deletada com sucesso');
            localStorage.removeItem('token');
            window.location.href = '/login';
        } catch (error) {
            console.error('Erro na requisição de deleção de conta:', error);
            alert('Erro ao deletar a conta');
        }
    };

    return (
        <div className="bg-gray-700 p-6 rounded-lg shadow-md mb-6">
            <h3 className="text-lg font-semibold text-orange-400">Deletar Conta</h3>
            <p className="mt-2 text-sm text-gray-200">Depois que sua conta for excluída, todos os seus recursos e dados serão excluídos permanentemente. Por favor, confirme que deseja excluir permanentemente sua conta.</p>
            <button
                onClick={handleDeleteAccount}
                className="mt-4 bg-red-600 text-white p-2 rounded"
            >
                Deletar Conta
            </button>
        </div>
    );
};

export default DeleteAccount;
