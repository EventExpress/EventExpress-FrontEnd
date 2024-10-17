// src/pages/_app.js
import '../app/globals.css';
import { SessionProvider } from 'next-auth/react';
import { AuthProvider } from '@/context/AuthContext'; // Ajuste o caminho conforme necessário

function MyApp({ Component, pageProps }) {
  return (
    <SessionProvider session={pageProps.session}>
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </SessionProvider>
  );
}

export default MyApp;
