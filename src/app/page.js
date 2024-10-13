// src/pages/index.js

import Link from 'next/link';

const HomePage = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <h1 className="text-3xl mb-6">Bem-vindo ao Meu App!</h1>
      <Link href="/login" className="text-blue-500">
        Ir para a tela de login
      </Link>
      
    </div>
  );
};

export default HomePage;
