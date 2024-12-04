import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

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
        // console.log({ username, password });

        // Verifica se foi passado usuário e senha
        if (!email || !password) return null;

        // Busca usuário no banco de dados
        // const user = await api

        // Se tudo OK, retornar login
        return {
          // id: user.id,
          // name: user.name,
          // email: user.email,
          id: "",
          name: "",
          email: "",
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
      }

      return token;
    },

    async session({ session, token }) {
      session.user.id = token.id as string;
      session.user.email = token.email as string;
      session.user.name = token.name;

      return session;
    },
  },
});
