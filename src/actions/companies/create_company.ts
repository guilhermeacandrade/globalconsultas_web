"use server";

import { type TFormCompanyData } from "@/components/forms/form_company";
import { api } from "@/lib/api";
import { revalidatePath } from "next/cache";

export async function createCompany(params: TFormCompanyData) {
  const resp = await api.post("/company", {
    name: params.name,
  });

  console.log(resp);

  revalidatePath("/empresas");
}
