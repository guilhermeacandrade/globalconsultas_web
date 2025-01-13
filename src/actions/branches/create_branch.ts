/* eslint-disable @typescript-eslint/no-unused-vars */

"use server";

import { type TFormBranchData } from "@/components/forms/form_branch";
import { api } from "@/lib/api";
import { revalidatePath } from "next/cache";

export async function createBranch(params: TFormBranchData) {
  const resp = await api.post("/branch", {
    companyId: params.companyId,
    fantasyName: params.fantasyName,
    socialReason: params.socialReason,
    cnpj: params.cnpj,
  });

  // console.log(resp);

  revalidatePath("/filiais");
}
