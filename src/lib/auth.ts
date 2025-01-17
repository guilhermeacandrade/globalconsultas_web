import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { api } from "./api";
import { IUserProfile } from "@/utils/types/user.type";

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
        try {
          const response = await api.post("/auth", {
            email: email,
            password: password,
          });
          console.log("🚀 ~ authorize ~ response:", response);

          const user = response.data.data;
          console.log("🚀 ~ authorize ~ user:", user);

          if (!user) return null;

          if (!user.status) return null;

          // Se tudo OK, retornar login
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            profile: user.profile,
            companyId: user.companyId,
            company: user.company,
            branchId: user.branchId,
            branch: user.branch,
          };
        } catch (err: any) {
          console.log("🚀 ~ authorize ~ err:", err);
          return null;
        }
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
        token.companyId = user.companyId;
        token.company = user.company;
        token.branchId = user.branchId;
        token.branch = user.branch;
      }

      return token;
    },

    async session({ session, token }) {
      session.user.id = token.id as string;
      session.user.email = token.email as string;
      session.user.name = token.name as string;
      session.user.profile = token.profile as IUserProfile;
      session.user.companyId = token.companyId as string | null;
      session.user.company = token.company as {
        id: string;
        name: string;
      } | null;
      session.user.branchId = token.branchId as string | null;
      session.user.branch = token.branch as {
        id: string;
        fantasyName: string;
        socialReason: string | null;
        cnpj: string;
        company: {
          id: string;
          name: string;
        };
      } | null;

      return session;
    },
  },
});
