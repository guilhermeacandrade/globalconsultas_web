export interface IUser {
  id: string;
  name?: string;
  email: string;
  profile: IUserProfile;
  status: boolean;
}

export enum IUserProfile {
  ADMIN = "ADMIN",
  INVESTIGATOR = "INVESTIGATOR",
  COMPANY = "COMPANY",
  RH = "RH",
}

export const PROFILE_LABELS = {
  ADMIN: "Administrador",
  INVESTIGATOR: "Consultor",
  COMPANY: "Empresa",
  RH: "RH",
};

export const PROFILE_OPTIONS = [
  {
    value: IUserProfile.ADMIN,
    label: PROFILE_LABELS[IUserProfile.ADMIN],
  },
  {
    value: IUserProfile.COMPANY,
    label: PROFILE_LABELS[IUserProfile.COMPANY],
  },
  {
    value: IUserProfile.INVESTIGATOR,
    label: PROFILE_LABELS[IUserProfile.INVESTIGATOR],
  },
  {
    value: IUserProfile.RH,
    label: PROFILE_LABELS[IUserProfile.RH],
  },
];
