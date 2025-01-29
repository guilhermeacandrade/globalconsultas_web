/* eslint-disable @typescript-eslint/no-unused-vars */

"use server";

import { TFormSetInvestigatorData } from "@/app/(private)/consultas/_components/dialog_set_investigator/form_set_investigator";
import { api } from "@/lib/api";
import { revalidatePath } from "next/cache";

interface UpdateInquiryProps extends TFormSetInvestigatorData {
  id: string;
}

export async function updateSetInvestigator(params: UpdateInquiryProps) {
  const resp = await api.put(`/inquiry/investigator/${params.id}`, {
    investigatorId: params.investigatorId,
  });

  // console.log(resp);

  revalidatePath("/consultas");
}
