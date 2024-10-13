// pages/create-anuncio.js
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/Button'; // Ajuste o caminho conforme necessário

const CreateAnuncioPage = () => {
    const router = useRouter();
    const [titulo, setTitulo] = useState('');
    const [cidade, setCidade] = useState('');
    const [cep, setCep] = useState('');
    const [numero, setNumero] = useState('');
    const [bairro, setBairro] = useState('');
    const [capacidade, setCapacidade] = useState('');
    const [descricao, setDescricao] = useState('');
    const [valor, setValor] = useState('');
    const [agenda, setAgenda] = useState('');
    const [categoriaId, setCategoriaId] = useState([]); // Aqui você pode ajustar para selecionar várias categorias
    const [imagens, setImagens] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleImageChange = async (e) => {
        const files = Array.from(e.target.files);
        const base64Images = await Promise.all(files.map(file => convertToBase64(file)));
        setImagens(base64Images); // Define o estado das imagens como os dados em base64
    };

    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result); // Retorna o resultado em base64
            reader.onerror = (error) => reject(error);
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const apiUrl = `http://localhost:8000/api/anuncios`;
            const token = localStorage.getItem('auth_token');

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, // Autenticação usando o token
                },
                body: JSON.stringify({
                    titulo,
                    cidade,
                    cep,
                    numero,
                    bairro,
                    capacidade,
                    descricao,
                    valor,
                    agenda,
                    categoriaId,
                    imagens,
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Erro ao criar anúncio:', errorText);
                throw new Error('Erro ao criar anúncio. Verifique os dados e tente novamente.');
            }

            setMessage('Anúncio criado com sucesso!');
            router.push('/paginicial'); // Redireciona após o sucesso

        } catch (error) {
            console.error('Erro:', error);
            setMessage(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-gray-700 p-8 rounded-lg shadow-lg max-w-md mx-auto">
            <h1 className="text-orange-500 text-2xl">Criar Anúncio</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="titulo" className="block text-orange-500">Título</label>
                    <input
                        id="titulo"
                        type="text"
                        value={titulo}
                        onChange={(e) => setTitulo(e.target.value)}
                        required
                        className="block mt-1 w-full border border-gray-300 rounded-md shadow-sm p-2"
                    />
                </div>

                <div>
                    <label htmlFor="cidade" className="block text-orange-500">Cidade</label>
                    <input
                        id="cidade"
                        type="text"
                        value={cidade}
                        onChange={(e) => setCidade(e.target.value)}
                        required
                        className="block mt-1 w-full border border-gray-300 rounded-md shadow-sm p-2"
                    />
                </div>

                <div>
                    <label htmlFor="cep" className="block text-orange-500">CEP</label>
                    <input
                        id="cep"
                        type="text"
                        value={cep}
                        onChange={(e) => setCep(e.target.value)}
                        required
                        className="block mt-1 w-full border border-gray-300 rounded-md shadow-sm p-2"
                    />
                </div>

                <div>
                    <label htmlFor="numero" className="block text-orange-500">Número</label>
                    <input
                        id="numero"
                        type="number"
                        value={numero}
                        onChange={(e) => setNumero(e.target.value)}
                        required
                        className="block mt-1 w-full border border-gray-300 rounded-md shadow-sm p-2"
                    />
                </div>

                <div>
                    <label htmlFor="bairro" className="block text-orange-500">Bairro</label>
                    <input
                        id="bairro"
                        type="text"
                        value={bairro}
                        onChange={(e) => setBairro(e.target.value)}
                        required
                        className="block mt-1 w-full border border-gray-300 rounded-md shadow-sm p-2"
                    />
                </div>

                <div>
                    <label htmlFor="capacidade" className="block text-orange-500">Capacidade</label>
                    <input
                        id="capacidade"
                        type="number"
                        value={capacidade}
                        onChange={(e) => setCapacidade(e.target.value)}
                        required
                        className="block mt-1 w-full border border-gray-300 rounded-md shadow-sm p-2"
                    />
                </div>

                <div>
                    <label htmlFor="descricao" className="block text-orange-500">Descrição</label>
                    <textarea
                        id="descricao"
                        value={descricao}
                        onChange={(e) => setDescricao(e.target.value)}
                        required
                        className="block mt-1 w-full border border-gray-300 rounded-md shadow-sm p-2"
                    />
                </div>

                <div>
                    <label htmlFor="valor" className="block text-orange-500">Valor</label>
                    <input
                        id="valor"
                        type="number"
                        value={valor}
                        onChange={(e) => setValor(e.target.value)}
                        required
                        className="block mt-1 w-full border border-gray-300 rounded-md shadow-sm p-2"
                    />
                </div>

                <div>
                    <label htmlFor="agenda" className="block text-orange-500">Agenda</label>
                    <input
                        id="agenda"
                        type="date"
                        value={agenda}
                        onChange={(e) => setAgenda(e.target.value)}
                        required
                        className="block mt-1 w-full border border-gray-300 rounded-md shadow-sm p-2"
                    />
                </div>

                <div>
                    <label htmlFor="categoriaId" className="block text-orange-500">Categoria ID</label>
                    <input
                        id="categoriaId"
                        type="text"
                        value={categoriaId}
                        onChange={(e) => setCategoriaId(e.target.value.split(','))} // Supondo que múltiplos IDs sejam separados por vírgula
                        required
                        className="block mt-1 w-full border border-gray-300 rounded-md shadow-sm p-2"
                    />
                </div>

                <div>
                    <label htmlFor="imagens" className="block text-orange-500">Imagens</label>
                    <input
                        id="imagens"
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageChange}
                        required
                        className="block mt-1 w-full border border-gray-300 rounded-md shadow-sm p-2"
                    />
                </div>

                {message && <p className="text-red-500 mt-2">{message}</p>}

                <Button type="submit" loading={isLoading} className="mt-4 bg-orange-500 text-white py-2 px-4 rounded-md">
                    Criar Anúncio
                </Button>
            </form>
        </div>
    );
};

export default CreateAnuncioPage;
