import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/Button'; // Ajuste o caminho conforme necessário

const LoginPage = () => {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true); // Ativa o estado de loading

        try {
            const apiUrl = `http://localhost:8000/api/login`;
            console.log('URL da API:', apiUrl); // Log da URL

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'Application/json',
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
            });

            if (!response.ok) {
                const errorText = await response.text(); // Obtém a resposta como texto para entender o erro
                console.error('Erro na requisição:', errorText); // Log do erro
                setMessage('Erro ao autenticar. Verifique suas credenciais ou se a API está funcionando.');
                return;
            }

            const data = await response.json(); // Tenta fazer o parse da resposta como JSON
            console.log('Success:', data); // Log de sucesso
            setMessage('Autenticado com sucesso!'); // Mensagem de sucesso
            localStorage.setItem('auth_token', data.token); // Salve o token se necessário
            
            // Redireciona para a homepage após login bem-sucedido
            router.push('/profile'); 

        } catch (error) {
            console.error('Erro na requisição:', error); // Log de erro na requisição
            setMessage('Erro ao realizar a requisição. Tente novamente mais tarde.'); // Mensagem de erro
        } finally {
            setIsLoading(false); // Desativa o estado de loading
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-gray-700 p-8 rounded-lg shadow-lg max-w-md mx-auto">
            <div>
                <label htmlFor="email" className="block text-orange-500">Email</label>
                <input
                    id="email"
                    className="block mt-1 w-full border border-gray-300 rounded-md shadow-sm p-2"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>

            <div className="mt-4">
                <label htmlFor="password" className="block text-orange-500">Senha</label>
                <input
                    id="password"
                    className="block mt-1 w-full border border-gray-300 rounded-md shadow-sm p-2"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </div>

            {message && <p className="text-red-500 mt-2">{message}</p>}

            <Button type="submit" loading={isLoading} className="mt-4 bg-orange-500 text-white py-2 px-4 rounded-md">
                Entrar
            </Button>
        </form>
    );
};

export default LoginPage;
