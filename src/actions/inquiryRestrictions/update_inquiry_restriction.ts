/* eslint-disable @typescript-eslint/no-unused-vars */

"use server";

import { TFormInquiryRestrictionData } from "@/components/forms/form_inquiry";
import { api } from "@/lib/api";
import { IInquiryRestriction } from "@/utils/types/inquiry.type";
// import { revalidatePath } from "next/cache";

interface UpdateInquiryProps extends TFormInquiryRestrictionData {
  id: string;
}

export async function updateInquiryRestriction(params: UpdateInquiryProps) {
  const resp = await api.put(`/inquiry-restriction/${params.id}`, {
    restrictionId: params.restrictionId,
    justification: params.justification,
  });

  const record: IInquiryRestriction = await resp.data.data;

  return record;

  // revalidatePath("/consultas");
}
