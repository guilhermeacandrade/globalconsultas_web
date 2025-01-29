/* eslint-disable @typescript-eslint/no-unused-vars */

"use server";

import { TFormInquiryRestrictionData } from "@/components/forms/form_inquiry";
import { api } from "@/lib/api";
import { IInquiryRestriction } from "@/utils/types/inquiry.type";
// import { revalidatePath } from "next/cache";

interface DeleteInquiryProps {
  id: string;
}

export async function deleteInquiryRestriction(params: DeleteInquiryProps) {
  const resp = await api.delete(`/inquiry-restriction/${params.id}`);

  // revalidatePath("/consultas");
}
