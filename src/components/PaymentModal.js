import React, { useState } from 'react';

const PaymentModal = ({ isOpen, onClose, onSelectPayment }) => {
    const [selectedPayment, setSelectedPayment] = useState('');
    const [expiryDate, setExpiryDate] = useState('');

    const handleSelectPayment = (e) => {
        const paymentMethod = e.target.value;
        setSelectedPayment(paymentMethod);
        onSelectPayment(paymentMethod);
    };

    const handleExpiryDateChange = (e) => {
        let value = e.target.value.replace(/\D/g, '');
        
        // Formata a data para MM/AA
        if (value.length <= 2) {
            value = value.replace(/(\d{2})/, '$1');
        } else if (value.length <= 4) {
            value = value.replace(/(\d{2})(\d{2})/, '$1/$2');
        }

        setExpiryDate(value.slice(0, 5));
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h3 className="text-xl font-semibold mb-4">Selecione a Forma de Pagamento</h3>
                
                <select
                    className="w-full p-2 mb-4 border rounded-md"
                    value={selectedPayment}
                    onChange={handleSelectPayment}
                >
                    <option value="">Selecione uma forma de pagamento</option>
                    <option value="Pix">Pix</option>
                    <option value="Boleto">Boleto</option>
                    <option value="Cartão de Débito">Cartão de Débito</option>
                    <option value="Cartão de Crédito">Cartão de Crédito</option>
                    <option value="Transferência">Transferência</option>
                </select>

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
                                    maxLength="5"
                                    value={expiryDate}
                                    onChange={handleExpiryDateChange} 
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
                        className="text-white-500" 
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
