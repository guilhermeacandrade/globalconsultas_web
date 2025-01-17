import { IUserProfile } from "@/utils/types/auth.type";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    name: string;
    email: string;
    profile: IUserProfile;
    companyId: string | null;
    company: {
      id: string;
      name: string;
    } | null;
    branchId: string | null;
    branch: {
      id: string;
      fantasyName: string;
      socialReason: string | null;
      cnpj: string;
      company: {
        id: string;
        name: string;
      };
    } | null;
  }

  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      profile: IUserProfile;
      companyId: string | null;
      company: {
        id: string;
        name: string;
      } | null;
      branchId: string | null;
      branch: {
        id: string;
        fantasyName: string;
        socialReason: string | null;
        cnpj: string;
        company: {
          id: string;
          name: string;
        };
      } | null;
    } & DefaultSession["user"];
  }

  interface JWT {
    id: string;
    name: string;
    email: string;
    profile: IUserProfile;
    companyId: string | null;
    company: {
      id: string;
      name: string;
    } | null;
    branchId: string | null;
    branch: {
      id: string;
      fantasyName: string;
      socialReason: string | null;
      cnpj: string;
      company: {
        id: string;
        name: string;
      };
    } | null;
  }
}
