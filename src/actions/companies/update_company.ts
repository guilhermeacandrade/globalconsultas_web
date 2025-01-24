/* eslint-disable @typescript-eslint/no-unused-vars */

"use server";

import { type TFormCompanyData } from "@/components/forms/form_company";
import { api } from "@/lib/api";
import { revalidatePath } from "next/cache";

interface UpdateCompanyProps extends TFormCompanyData {
  id: string;
  imageLogoUrl: string | null;
}

export async function updateCompany(params: UpdateCompanyProps) {
  // console.log("🚀 ~ updateCompany ~ params:", params);

  const resp = await api.put(`/company/${params.id}`, {
    name: params.name,
    imageLogoUrl: params.imageLogoUrl,
  });

  // console.log(resp);

  revalidatePath("/empresas");
}
