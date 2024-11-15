// src/components/Avaliacao.js
import React from 'react';

const Avaliacao = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h1 className="text-xl font-bold">Avaliação</h1>
        <p>Conteúdo da avaliação...</p>
        <button 
          onClick={onClose} 
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Fechar
        </button>
      </div>
    </div>
  );
};

export default Avaliacao;
