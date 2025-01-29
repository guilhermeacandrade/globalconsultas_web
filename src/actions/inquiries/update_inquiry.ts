/* eslint-disable @typescript-eslint/no-unused-vars */

"use server";

import { TFormInquiryData } from "@/components/forms/form_inquiry";
import { api } from "@/lib/api";
import { removeFormat } from "@/lib/utils";
import { revalidatePath } from "next/cache";

interface UpdateInquiryProps extends TFormInquiryData {
  id: string;
}

export async function updateInquiry(params: UpdateInquiryProps) {
  const [day, month, year] = params.bornDate.split("/");
  const bornDateFormatted = `${year}-${month}-${day}`;

  const resp = await api.put(`/inquiry/${params.id}`, {
    name: params.name,
    cpf: removeFormat(params.cpf),
    rg: removeFormat(params.rg),
    bornDate: new Date(bornDateFormatted),
    mothersName: params.mothersName,
    fathersName: params.fathersName,
    branchId: params.branchId,
    observation: params.observation,
  });

  // console.log(resp);

  revalidatePath("/consultas");
}
