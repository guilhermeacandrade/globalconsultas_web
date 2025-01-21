import { ICompany } from "./company.type";

export interface IBranch {
  id: string;
  code?: string;
  fantasyName: string;
  socialReason?: string;
  cnpj: string;
  city?: string;
  uf?: string;
  companyId: string;
  company: Pick<ICompany, "id" | "name">;
}
