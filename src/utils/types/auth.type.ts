export interface IAuth {
  id: string;
  name: string | null;
  email: string;
  profile: IUserProfile;
}

export enum IUserProfile {
  ADMIN = "ADMIN",
  INVESTIGATOR = "INVESTIGATOR",
  COMPANY = "COMPANY",
  RH = "RH",
}
