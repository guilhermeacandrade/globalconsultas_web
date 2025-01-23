/* eslint-disable @typescript-eslint/no-unused-vars */

"use server";

import { type TFormBranchData } from "@/components/forms/form_branch";
import { api } from "@/lib/api";
import { removeFormat } from "@/lib/utils";
import { IContacts } from "@/utils/types/branch.type";
import { revalidatePath } from "next/cache";

interface CreateBranchProps extends TFormBranchData {
  contacts: IContacts[] | [];
}

export async function createBranch(params: CreateBranchProps) {
  const resp = await api.post("/branch", {
    code: params.code,
    companyId: params.companyId,
    fantasyName: params.fantasyName,
    socialReason: params.socialReason,
    city: params.city,
    uf: params.uf?.toUpperCase(),
    cnpj: params.cnpj ? removeFormat(params.cnpj) : null,
    responsibleName: params.responsibleName,
    contacts: params.contacts,
  });

  // console.log(resp);

  revalidatePath("/filiais");
}
