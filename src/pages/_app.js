// src/pages/_app.js
import '../app/globals.css'; 
import 'react-calendar/dist/Calendar.css';
import { AuthProvider } from '../app/context/AuthContext';
import { SessionProvider } from 'next-auth/react';

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
