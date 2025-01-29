import { IRestrictionTypes } from "./restriction.type";

export interface IInquiry {
  id: string;
  code: number;
  requestDate: Date;
  endDate: Date | null;
  adminApprovalDate: Date | null;
  personId: string;
  result: IResultInquiries | null;
  observation: string | null;
  investigatorId: string | null;

  person: {
    // id: string;
    name: string;
    rg: string;
    cpf: string;
    bornDate: Date;
    mothersName: string | null;
    fathersName: string | null;
    branchId: string;
    branch: {
      code: string | null;
      fantasyName: string;
    };
  };

  investigator: {
    // id: string;
    name: string | null;
    email: string;
  } | null;

  inquieriesRestrictions: IInquiryRestriction[] | [];
}

export interface IInquiryRestriction {
  id: string;
  inquiryId: string;
  restrictionId: string;
  justification: string;

  restriction: {
    id: string;
    type: IRestrictionTypes;
    article: string | null;
    description: string | null;
  };
}

export enum IResultInquiries {
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export const RESULT_INQUIRY_LABELS = {
  APPROVED: "Aprovado",
  REJECTED: "Rejeitado",
};

export const RESULT_INQUIRY_OPTIONS = [
  {
    value: IResultInquiries.APPROVED,
    label: RESULT_INQUIRY_LABELS[IResultInquiries.APPROVED],
  },
  {
    value: IResultInquiries.REJECTED,
    label: RESULT_INQUIRY_LABELS[IResultInquiries.REJECTED],
  },
];
