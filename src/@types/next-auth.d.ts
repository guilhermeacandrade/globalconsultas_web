import { IUserProfile } from "@/utils/types/auth.type";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    name: string;
    email: string;
    profile: IUserProfile;
  }

  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      profile: IUserProfile;
    } & DefaultSession["user"];
  }

  interface JWT {
    id: string;
    name: string;
    email: string;
    profile: IUserProfile;
  }
}
