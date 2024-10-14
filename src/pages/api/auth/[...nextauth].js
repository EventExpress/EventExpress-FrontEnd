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
                const res = await fetch("http://localhost:8000/api/login", { // Altere para o seu endpoint de login
                    method: "POST",
                    body: JSON.stringify({
                        email: credentials.email,
                        password: credentials.password,
                    }),
                    headers: { "Content-Type": "application/json" },
                });

                const user = await res.json();

                // Verifique se a resposta é bem-sucedida
                if (!res.ok || !user || !user.data) {
                    return null; // Retorne null se não houver usuário
                }

                return user.data; // Certifique-se de que está retornando a parte correta do usuário
            },
        }),
    ],
    pages: {
        signIn: "/login", // Altere para o caminho do seu login
    },
    session: {
        jwt: true,
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id; // Certifique-se de que 'user' tem a propriedade 'id'
                token.nome = user.nome; // Adicione qualquer outra informação necessária
            }
            return token;
        },
        async session({ session, token }) {
            session.user.id = token.id;
            session.user.nome = token.nome; // Adicione qualquer outra informação necessária à sessão
            return session;
        },
    },
});
