import { IUserProfile } from "./user.type";

export interface IAuth {
  id: string;
  name: string | null;
  email: string;
  profile: IUserProfile;
}
