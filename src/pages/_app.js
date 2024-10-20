// src/pages/_app.js
import '../app/globals.css'; // Verifique se o caminho está correto
import { AuthProvider } from 'src/app/context/AuthContext.js'; // Mantenha esta linha, se você está usando o alias
import { SessionProvider } from 'next-auth/react'; // Se você está usando NextAuth

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
