/* eslint-disable @typescript-eslint/no-unused-vars */

"use server";

import { type TFormBranchData } from "@/components/forms/form_branch";
import { api } from "@/lib/api";
import { removeFormat } from "@/lib/utils";
import { IContacts } from "@/utils/types/branch.type";
import { revalidatePath } from "next/cache";

interface UpdateBranchProps extends TFormBranchData {
  id: string;
  contacts: IContacts[] | [];
}

export async function updateBranch(params: UpdateBranchProps) {
  // console.log("🚀 ~ updateBranch ~ params:", params);

  const resp = await api.put(`/branch/${params.id}`, {
    code: params.code,
    fantasyName: params.fantasyName,
    socialReason: params.socialReason,
    cnpj: params.cnpj ? removeFormat(params.cnpj) : null,
    city: params.city,
    uf: params.uf?.toUpperCase(),
    companyId: params.companyId,
    responsibleName: params.responsibleName,
    contacts: params.contacts,
  });

  // console.log(resp);

  revalidatePath("/filiais");
}
