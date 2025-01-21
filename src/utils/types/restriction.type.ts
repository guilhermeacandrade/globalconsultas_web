export interface IRestriction {
  id: string;
  type: IRestrictionTypes;
  article?: string;
  description?: string;
}

export enum IRestrictionTypes {
  CIVIL = "CIVIL",
  LABOR = "LABOR",
  CRIMINAL = "CRIMINAL",
}

export const RESTRICTION_TYPES_LABELS = {
  CIVIL: "Civil",
  LABOR: "Trabalhista",
  CRIMINAL: "Criminal",
};

export const RESTRICTION_TYPES_OPTIONS = [
  {
    value: IRestrictionTypes.CIVIL,
    label: RESTRICTION_TYPES_LABELS[IRestrictionTypes.CIVIL],
  },
  {
    value: IRestrictionTypes.CRIMINAL,
    label: RESTRICTION_TYPES_LABELS[IRestrictionTypes.CRIMINAL],
  },
  {
    value: IRestrictionTypes.LABOR,
    label: RESTRICTION_TYPES_LABELS[IRestrictionTypes.LABOR],
  },
];
