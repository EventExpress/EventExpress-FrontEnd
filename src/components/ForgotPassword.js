// src/components/ForgotPassword.js
"use client";
import { useState } from 'react';
import NavBar from './NavBar'; 
import ApplicationLogo from './ApplicationLogo';
import Footer from './Footer'; // Importe o Footer aqui

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      const response = await fetch('http://localhost:8000/api/forgot-password-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setMessage('Instruções para recuperação de senha enviadas ao seu e-mail.');
      } else {
        const errorData = await response.json();
        console.log(errorData);
        setError('Falha ao enviar instruções. Verifique o e-mail e tente novamente.');
      }
    } catch (error) {
      console.error(error);
      setError('Ocorreu um erro. Por favor, tente novamente mais tarde.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-cover bg-center" style={{ backgroundImage: "url('/images/evento.jpg')" }}>
      <NavBar />
      <div className="flex-1 flex items-center justify-center relative">
        {}
        <div className="absolute inset-0 bg-black opacity-50" />
        <div className="p-8 rounded-lg shadow-lg w-full max-w-md bg-gray-700 z-10">
          <div className="flex justify-center mb-4">
            <ApplicationLogo className="h-16 w-16" />
          </div>

          <h1 className="text-center text-white text-2xl font-semibold mb-4">Recuperação de Senha</h1>
          <p className="text-center text-gray-300 mb-6">
            Digite seu e-mail cadastrado para receber instruções.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col">
            {error && <div className="text-red-500 mb-4">{error}</div>}
            {message && <div className="text-green-500 mb-4">{message}</div>}

            <div>
              <label htmlFor="email" className="block text-orange-500 mb-1">E-mail</label>
              <input
                type="email"
                id="email"
                className="block w-full p-2 bg-gray-300 border border-orange-500 focus:border-orange-600 focus:ring focus:ring-orange-500 rounded-md"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="mt-4 w-full bg-orange-500 hover:bg-orange-600 focus:bg-orange-600 text-white py-2 rounded-md"
            >
              Enviar Instruções
            </button>
          </form>
        </div>
      </div>
      <Footer /> {}
    </div>
  );
};

export default ForgotPassword;
