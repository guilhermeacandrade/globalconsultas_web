import { ICompany } from "./company.type";

export interface IBranch {
  id: string;
  code?: string;
  fantasyName: string;
  socialReason?: string;
  cnpj: string;
  companyId: string;
  company: Pick<ICompany, "id" | "name">;
}
