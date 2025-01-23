import { ICompany } from "./company.type";

export interface IBranch {
  id: string;
  code?: string;
  fantasyName: string;
  socialReason?: string;
  cnpj: string;
  city?: string;
  uf?: string;
  responsibleName?: string;
  companyId: string;
  company: Pick<ICompany, "id" | "name">;
  contacts: IContacts[] | [];
}

export interface IContacts {
  id: string;
  type: IContactsTypes;
  responsibleName?: string;
  contact: string;
  deleted: boolean;
}

export enum IContactsTypes {
  EMAIL = "EMAIL",
  NUMBER_MOBILE = "NUMBER_MOBILE",
  NUMBER_FIXED = "NUMBER_FIXED",
}

export const CONTACTS_TYPES_LABELS = {
  EMAIL: "E-mail",
  NUMBER_MOBILE: "Celular",
  NUMBER_FIXED: "Fixo",
};

export const CONTACTS_TYPES_OPTIONS = [
  {
    value: IContactsTypes.EMAIL,
    label: CONTACTS_TYPES_LABELS[IContactsTypes.EMAIL],
  },
  {
    value: IContactsTypes.NUMBER_FIXED,
    label: CONTACTS_TYPES_LABELS[IContactsTypes.NUMBER_FIXED],
  },
  {
    value: IContactsTypes.NUMBER_MOBILE,
    label: CONTACTS_TYPES_LABELS[IContactsTypes.NUMBER_MOBILE],
  },
];
