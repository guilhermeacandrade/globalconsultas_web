/* eslint-disable @typescript-eslint/no-unused-vars */

"use server";

import { TFormInquiryRestrictionData } from "@/components/forms/form_inquiry";
import { api } from "@/lib/api";
import { IInquiryRestriction } from "@/utils/types/inquiry.type";
// import { revalidatePath } from "next/cache";

interface CreateInquiryRestrictionProps extends TFormInquiryRestrictionData {
  inquiryId: string;
}

export async function createInquiryRestriction(
  params: CreateInquiryRestrictionProps
) {
  const resp = await api.post("/inquiry-restriction", {
    inquiryId: params.inquiryId,
    restrictionId: params.restrictionId,
    justification: params.justification,
  });

  const record: IInquiryRestriction = await resp.data.data;

  return record;

  // revalidatePath("/consultas");
}
