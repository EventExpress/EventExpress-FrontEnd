// src/pages/api/auth/[...nextauth].js
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";
import cookie from 'cookie'; // Para lidar com cookies do Sanctum

export default NextAuth({
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text", placeholder: "email@example.com" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials, req) {
                try {
                    // Primeira requisição para obter o cookie CSRF
                    await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/sanctum/csrf-cookie`, {
                        withCredentials: true,
                    });

                    // Enviar os dados de login com axios
                    const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/login`, {
                        email: credentials.email,
                        password: credentials.password,
                    }, {
                        withCredentials: true, // Necessário para enviar cookies do Sanctum
                    });

                    const user = res.data;

                    // Verificar se o login foi bem-sucedido
                    if (user && user.data) {
                        return user.data;
                    }

                    return null;
                } catch (error) {
                    console.error('Erro ao autenticar:', error);
                    return null;
                }
            },
        }),
    ],
    pages: {
        signIn: "/login", // Caminho para a página de login
    },
    session: {
        jwt: true,
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.nome = user.nome;
            }
            return token;
        },
        async session({ session, token }) {
            session.user.id = token.id;
            session.user.nome = token.nome;
            return session;
        },
    },
});
