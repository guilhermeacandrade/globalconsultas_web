/* eslint-disable @typescript-eslint/no-unused-vars */

"use server";

import { type TFormBranchData } from "@/components/forms/form_branch";
import { api } from "@/lib/api";
import { removerFormat } from "@/lib/utils";
import { revalidatePath } from "next/cache";

interface UpdateBranchProps extends TFormBranchData {
  id: string;
}

export async function updateBranch(params: UpdateBranchProps) {
  // console.log("🚀 ~ updateBranch ~ params:", params);

  const resp = await api.put(`/branch/${params.id}`, {
    fantasyName: params.fantasyName,
    socialReason: params.socialReason,
    cnpj: params.cnpj ? removerFormat(params.cnpj) : null,
    companyId: params.companyId,
  });

  // console.log(resp);

  revalidatePath("/filiais");
}
