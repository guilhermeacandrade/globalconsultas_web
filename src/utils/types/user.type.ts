import { IBranch } from "./branch.type";
import { ICompany } from "./company.type";

export interface IUser {
  id: string;
  name?: string;
  email: string;
  profile: IUserProfile;
  status: boolean;
  companyId: string | null;
  company: Pick<ICompany, "id" | "name"> | null;
  branchId: string | null;
  branch: Pick<
    IBranch,
    | "id"
    | "fantasyName"
    | "socialReason"
    | "cnpj"
    | "companyId"
    | "company"
    | "city"
    | "uf"
  > | null;
}

export enum IUserProfile {
  ADMIN = "ADMIN",
  INVESTIGATOR = "INVESTIGATOR",
  COMPANY = "COMPANY",
  BRANCH = "BRANCH",
}

export const PROFILE_LABELS = {
  ADMIN: "Administrador",
  INVESTIGATOR: "Consultor",
  COMPANY: "Empresa",
  BRANCH: "Filial",
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
    value: IUserProfile.BRANCH,
    label: PROFILE_LABELS[IUserProfile.BRANCH],
  },
];
