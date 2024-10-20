// src/pages/api/auth/[...nextauth].js
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export default NextAuth({
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text", placeholder: "email@example.com" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                const res = await fetch("http://localhost:8000/api/login", { 
                    method: "POST",
                    body: JSON.stringify({
                        email: credentials.email,
                        password: credentials.password,
                    }),
                    headers: { "Content-Type": "application/json" },
                });

                const response = await res.json();

                if (!res.ok || !response.data) {
                    return null; // Retorne null se o login falhar
                }

                const user = response.data;

                // Adiciona o token JWT ao objeto do usuário para ser usado nos callbacks
                user.token = response.data.token;

                return user; // Retorna o usuário autenticado
            },
        }),
    ],
    pages: {
        signIn: "/login",
    },
    session: {
        strategy: "jwt", // Define o uso de JWT para a sessão
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.nome = user.nome;
                token.email = user.email;
                token.jwt = user.token; // Armazena o token JWT no callback JWT
            }
            return token;
        },
        async session({ session, token }) {
            session.user.id = token.id;
            session.user.nome = token.nome;
            session.user.email = token.email;
            session.user.jwt = token.jwt; // Adiciona o token JWT à sessão
            return session;
        },
    },
});
