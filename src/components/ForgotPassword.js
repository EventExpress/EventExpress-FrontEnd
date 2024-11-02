"use client";
import { useState } from 'react';
import NavBar from './NavBar'; 
import ApplicationLogo from './ApplicationLogo';
import Footer from './Footer';
import axios from 'axios';
import { useRouter } from 'next/router'; // Importar useRouter

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [code, setCode] = useState('');
  const [password, setNewPassword] = useState('');
  const [step, setStep] = useState(1); // Controla o passo do formulário

  const router = useRouter(); // Criar uma instância do router

  const handleSubmitEmail = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      const response = await axios.post('http://localhost:8000/api/forgot-password-code', {
        email,
      });

      setMessage('Instruções para recuperação de senha enviadas ao seu e-mail. Insira o código recebido.');
      setStep(2); // Avança para o passo de verificação do código
    } catch (error) {
      if (error.response) {
        console.error('Erro ao enviar email:', error.response.data);
        setError('Falha ao enviar instruções. Verifique o e-mail e tente novamente.');
      } else {
        console.error('Erro de conexão:', error);
        setError('Ocorreu um erro. Por favor, tente novamente mais tarde.');
      }
    }
  };

  const handleSubmitCode = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      const response = await axios.post('http://localhost:8000/api/reset-password-validate-code', {
        email,
        code,
      });

      setMessage('Código verificado! Agora, insira sua nova senha.');
      setStep(3); // Avança para o passo de criação da nova senha
    } catch (error) {
      if (error.response) {
        console.error('Erro ao validar código:', error.response.data);
        setError('Código inválido. Tente novamente.');
      } else {
        console.error('Erro de conexão:', error);
        setError('Ocorreu um erro. Por favor, tente novamente mais tarde.');
      }
    }
  };

  const handleSubmitNewPassword = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      const response = await axios.post('http://localhost:8000/api/reset-password-code', {
        email,
        code,
        password,
      });

      setMessage('Senha alterada com sucesso!');
      router.push('/login'); // Redireciona para a tela de login
    } catch (error) {
      if (error.response) {
        console.error('Erro ao alterar a senha:', error.response.data);
        setError('Falha ao alterar a senha. Tente novamente.');
      } else {
        console.error('Erro de conexão:', error);
        setError('Ocorreu um erro. Por favor, tente novamente mais tarde.');
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-cover bg-center" style={{ backgroundImage: "url('/images/evento.jpg')" }}>
      <NavBar />
      <div className="flex-1 flex items-center justify-center relative">
        <div className="absolute inset-0 bg-black opacity-50" />
        <div className="p-8 rounded-lg shadow-lg w-full max-w-md bg-gray-700 z-10">
          <div className="flex justify-center mb-4">
            <ApplicationLogo className="h-16 w-16" />
          </div>

          <h1 className="text-center text-white text-2xl font-semibold mb-4">Recuperação de Senha</h1>
          <p className="text-center text-gray-300 mb-6">
            {step === 1 && 'Digite seu e-mail cadastrado para receber instruções.'}
            {step === 2 && 'Insira o código que você recebeu por e-mail.'}
            {step === 3 && 'Insira sua nova senha.'}
          </p>

          {step === 1 && (
            <form onSubmit={handleSubmitEmail} className="flex flex-col">
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
          )}

          {step === 2 && (
            <form onSubmit={handleSubmitCode} className="flex flex-col">
              {error && <div className="text-red-500 mb-4">{error}</div>}
              {message && <div className="text-green-500 mb-4">{message}</div>}

              <div>
                <label htmlFor="code" className="block text-orange-500 mb-1">Código de Recuperação</label>
                <input
                  type="text"
                  id="code"
                  className="block w-full p-2 bg-gray-300 border border-orange-500 focus:border-orange-600 focus:ring focus:ring-orange-500 rounded-md"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="mt-4 w-full bg-orange-500 hover:bg-orange-600 focus:bg-orange-600 text-white py-2 rounded-md"
              >
                Verificar Código
              </button>
            </form>
          )}

          {step === 3 && (
            <form onSubmit={handleSubmitNewPassword} className="flex flex-col">
              {error && <div className="text-red-500 mb-4">{error}</div>}
              {message && <div className="text-green-500 mb-4">{message}</div>}

              <div>
                <label htmlFor="newPassword" className="block text-orange-500 mb-1">Nova Senha</label>
                <input
                  type="password"
                  id="password"
                  className="block w-full p-2 bg-gray-300 border border-orange-500 focus:border-orange-600 focus:ring focus:ring-orange-500 rounded-md"
                  value={password}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="mt-4 w-full bg-orange-500 hover:bg-orange-600 focus:bg-orange-600 text-white py-2 rounded-md"
              >
                Alterar Senha
              </button>
            </form>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ForgotPassword;
