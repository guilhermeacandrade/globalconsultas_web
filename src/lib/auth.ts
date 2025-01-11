import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { api } from "./api";
import { IUserProfile } from "@/utils/types/auth.type";

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: {
    strategy: "jwt",
    maxAge: 1 * 3 * 60 * 60, // dias * horas * minutos * segundos (defaul: 30 * 24 * 60 * 60 -> 2.592.000s/30d)
  },

  pages: {
    signIn: "/entrar",
  },

  providers: [
    Credentials({
      credentials: {
        email: { label: "E-mail", type: "text" },
        password: { label: "Senha", type: "password" },
      },
      async authorize({ email, password }) {
        // Verifica se foi passado usuário e senha
        if (!email || !password) return null;

        // Busca usuário no banco de dados
        const response = await api.post("/auth", {
          email: email,
          password: password,
        });
        const user = response.data.data;

        if (!user) return null;

        // Se tudo OK, retornar login
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          profile: user.profile,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.profile = user.profile;
      }

      return token;
    },

    async session({ session, token }) {
      session.user.id = token.id as string;
      session.user.email = token.email as string;
      session.user.name = token.name as string;
      session.user.profile = token.profile as IUserProfile;

      return session;
    },
  },
});
