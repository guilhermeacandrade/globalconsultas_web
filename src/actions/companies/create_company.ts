/* eslint-disable @typescript-eslint/no-unused-vars */

"use server";

import { type TFormCompanyData } from "@/components/forms/form_company";
import { api } from "@/lib/api";
import { ICompany } from "@/utils/types/company.type";
import { revalidatePath } from "next/cache";

interface CreateCompanyProps extends TFormCompanyData {
  imageLogoUrl: string | null;
}

export async function createCompany(
  params: CreateCompanyProps
): Promise<ICompany> {
  const resp = await api.post("/company", {
    name: params.name,
    imageLogoUrl: params.imageLogoUrl,
  });

  // console.log(resp);

  revalidatePath("/empresas");

  return resp.data.data;
}
