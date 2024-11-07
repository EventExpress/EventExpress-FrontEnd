import { useRouter } from 'next/router';

export default function Pagamento() {
    const router = useRouter();
    const { reservaData } = router.query; // Dados passados pela tela de reserva

    const handlePagamentoConfirmado = async () => {
        // Simule a confirmação do pagamento (aqui você integra com sua API de pagamento)
        const reserva = JSON.parse(reservaData);
        try {
            // Envie a reserva para ser criada após o pagamento
            const response = await axios.post('http://localhost:8000/api/agendados', reserva, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });

            console.log('Reserva criada com sucesso!', response.data);
            router.push('/paginicial'); // Redireciona para a página inicial após a criação da reserva
        } catch (error) {
            console.error('Erro ao criar reserva:', error);
            // Exiba mensagem de erro, caso algo dê errado
        }
    };

    return (
        <div>
            <h2>Tela de Pagamento</h2>
            {/* Exiba as informações da reserva aqui */}
            <div>
                <p>Data de Início: {reservaData.data_inicio}</p>
                <p>Data de Fim: {reservaData.data_fim}</p>
                <p>Serviços Selecionados: {reservaData.servicos_ids.join(', ')}</p>
            </div>

            {/* Formulário de pagamento */}
            <button onClick={handlePagamentoConfirmado}>Confirmar Pagamento</button>
        </div>
    );
}
