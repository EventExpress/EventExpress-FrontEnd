import React, { useContext } from 'react';
import Avaliacao from '../components/Avaliacao'; // Componente de avaliação
import { AuthContext } from '../app/context/AuthContext'; // Contexto de autenticação

const AvaliacaoPage = () => {
  const { user } = useContext(AuthContext); // Obtendo o usuário autenticado do contexto

  // Exemplo de data agendada
  const dataAgendamento = '2024-11-17T00:00:00Z'; // Substitua com a data real do agendamento do anúncio

  if (!user) {
    return <div>Carregando...</div>;
  }

  return (
    <div>
      <h1>Avaliação de Anúncio</h1>
      {/* Passa o tipo de usuário e a data de agendamento para o componente Avaliacao */}
      <Avaliacao tipoUsuario={user.tipousu} dataAgendamento={dataAgendamento} />
    </div>
  );
};

export default AvaliacaoPage;
