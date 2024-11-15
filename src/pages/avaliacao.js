// src/pages/avaliacao.js
import React, { useState } from 'react';
import Avaliacao from '../components/Avaliacao';

const AvaliacaoPage = () => {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Página de Avaliação</h1>
      <button 
        onClick={openModal} 
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Abrir Avaliação
      </button>
      {isOpen && <Avaliacao onClose={closeModal} />}
    </div>
  );
};

export default AvaliacaoPage;
