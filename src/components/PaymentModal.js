import React, { useState, useEffect } from 'react';

const PaymentModal = ({ isOpen, onClose, onSelectPayment }) => {
    const [selectedPayment, setSelectedPayment] = useState('');
    const [expiryDate, setExpiryDate] = useState('');

    const handleSelectPayment = (paymentMethod) => {
        setSelectedPayment(paymentMethod);
        onSelectPayment(paymentMethod);
    };

    const handleExpiryDateChange = (e) => {
        // Remove todos os caracteres não numéricos
        let value = e.target.value.replace(/\D/g, '');
        
        // Formata a data para MM/AA
        if (value.length <= 2) {
            value = value.replace(/(\d{2})/, '$1'); // Exibe apenas o mês
        } else if (value.length <= 4) {
            value = value.replace(/(\d{2})(\d{2})/, '$1/$2'); // Adiciona a barra
        }

        // Limita a data a 5 caracteres (MM/AA)
        setExpiryDate(value.slice(0, 5));
    };

    // Verifica se o modal está aberto e renderiza ou não
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h3 className="text-xl font-semibold mb-4">Selecione a Forma de Pagamento</h3>
                <button 
                    className="block w-full mb-2 p-2 text-center text-white bg-blue-500 rounded-md"
                    onClick={() => handleSelectPayment('Pix')}
                >
                    Pix
                </button>
                <button 
                    className="block w-full mb-2 p-2 text-center text-white bg-blue-500 rounded-md"
                    onClick={() => handleSelectPayment('Boleto')}
                >
                    Boleto
                </button>
                <button 
                    className="block w-full mb-2 p-2 text-center text-white bg-blue-500 rounded-md"
                    onClick={() => handleSelectPayment('Cartão de Débito')}
                >
                    Cartão de Débito
                </button>
                <button 
                    className="block w-full mb-2 p-2 text-center text-white bg-blue-500 rounded-md"
                    onClick={() => handleSelectPayment('Cartão de Crédito')}
                >
                    Cartão de Crédito
                </button>
                <button 
                    className="block w-full mb-2 p-2 text-center text-white bg-blue-500 rounded-md"
                    onClick={() => handleSelectPayment('Transferência')}
                >
                    Transferência
                </button>
                
                {/* Renderização Condicional */}
                <div className="mt-4">
                    {selectedPayment === 'Pix' && (
                        <div>
                            <h4>Imagem do QR Code</h4>
                            <img src="/images/qrcode.jpg" alt="QR Code" />
                        </div>
                    )}

                    {selectedPayment === 'Boleto' && (
                        <div className="text-center">
                            <h4 className="font-semibold mb-2">Boleto Gerado</h4>
                            <img src="/images/boletobancario.jpg" alt="Boleto" />
                        </div>
                    )}

                    {['Cartão de Débito', 'Cartão de Crédito'].includes(selectedPayment) && (
                        <div>
                            <h4 className="font-semibold mb-2">Preencha os Dados do Cartão</h4>
                            <form>
                                <label className="block mb-2">Número do Cartão</label>
                                <input 
                                    type="text" 
                                    className="w-full p-2 mb-4 border rounded-md" 
                                    placeholder="0000 0000 0000 0000" 
                                    maxLength="16"
                                    pattern="\d{16}"
                                    title="Digite um número de cartão válido (16 dígitos)"
                                />
                                
                                <label className="block mb-2">Nome no Cartão</label>
                                <input 
                                    type="text" 
                                    className="w-full p-2 mb-4 border rounded-md" 
                                    placeholder="Nome Completo" 
                                />
                                
                                <label className="block mb-2">Data de Validade</label>
                                <input 
                                    type="text" 
                                    className="w-full p-2 mb-4 border rounded-md" 
                                    placeholder="MM/AA"
                                    maxLength="5" // Limita a 5 caracteres (MM/AA)
                                    value={expiryDate} // Vincula ao estado
                                    onChange={handleExpiryDateChange} // Atualiza ao digitar
                                />
                                
                                <label className="block mb-2">Código de Segurança</label>
                                <input 
                                    type="text" 
                                    className="w-full p-2 mb-4 border rounded-md" 
                                    placeholder="123" 
                                    maxLength="3"
                                    pattern="\d{3}"
                                    title="Digite um CVV válido (3 dígitos)"
                                />
                            </form>
                        </div>
                    )}

                    {selectedPayment === 'Transferência' && (
                        <div>
                            <h4 className="font-semibold mb-2">Detalhes da Transferência</h4>
                            <p>00000-000</p>
                        </div>
                    )}
                </div>

                <div className="mt-4 text-center">
                    <button 
                        className="text-red-500" 
                        onClick={onClose}
                    >
                        Fechar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentModal;
