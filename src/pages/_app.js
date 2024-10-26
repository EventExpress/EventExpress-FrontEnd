// src/pages/_app.js
import '../app/globals.css'; // Verifique se o caminho está correto
import { AuthProvider } from '/home/guilherme/Desktop/Projetos/eventexpress/src/app/context/AuthContext.js'; // Mantenha esta linha, se você está usando o alias

function MyApp({ Component, pageProps }) {
    return (
            <AuthProvider>
                <Component {...pageProps} />
            </AuthProvider>
    );
}

export default MyApp;
