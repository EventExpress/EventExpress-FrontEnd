// src/components/ReservaSuccessModal.js
import React from 'react';

const ReservaSuccessModal = ({ isOpen, closeReservaSuccessModal }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-lg font-semibold">Reserva Confirmada!</h2>
        <p className="mt-4">Sua reserva foi realizada com sucesso.</p>
        <button
          onClick={closeReservaSuccessModal}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg"
        >
          Fechar
        </button>
      </div>
    </div>
  );
};

export default ReservaSuccessModal;
