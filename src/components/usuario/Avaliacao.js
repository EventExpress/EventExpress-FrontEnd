import React, { useState, useEffect } from 'react';

const Avaliacao = ({ tipoUsuario, dataAgendamento }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [dataAtual, setDataAtual] = useState(new Date());

  useEffect(() => {
    // Verifica se o tipo de usuário é compatível e se a data de agendamento já passou
    if (new Date(dataAgendamento) < dataAtual) {
      setShowPopup(true); // Exibe o popup quando a data de agendamento já passou
    }
  }, [dataAgendamento, dataAtual]);

  // Função para exibir a avaliação dependendo do tipo de usuário
  const renderAvaliacao = () => {
    switch (tipoUsuario) {
      case 'Locatario':
        return (
          <div>
            <h2>Avalie o Locador e o Prestador</h2>
            {/* Campos para avaliação do Locador e Prestador */}
            <textarea placeholder="Avaliação do Locador" />
            <textarea placeholder="Avaliação do Prestador" />
          </div>
        );
      case 'Locador':
        return (
          <div>
            <h2>Avalie o Locatário</h2>
            <textarea placeholder="Avaliação do Locatário" />
          </div>
        );
      case 'Prestador':
        return (
          <div>
            <h2>Avalie o Locatário</h2>
            <textarea placeholder="Avaliação do Locatário" />
          </div>
        );
      default:
        return <div><h2>Avaliação não disponível</h2></div>;
    }
  };

  return (
    <>
      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <button onClick={() => setShowPopup(false)}>Fechar</button>
            {renderAvaliacao()}
            <button onClick={() => alert('Avaliação enviada!')}>Enviar Avaliação</button>
          </div>
        </div>
      )}
    </>
  );
};

export default Avaliacao;
