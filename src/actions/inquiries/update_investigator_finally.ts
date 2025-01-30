/* eslint-disable @typescript-eslint/no-unused-vars */

"use server";

import { api } from "@/lib/api";
import { IResultInquiries } from "@/utils/types/inquiry.type";
import { revalidatePath } from "next/cache";

interface UpdateInvestigatorFinallyProps {
  id: string;
  result: IResultInquiries;
}

export async function updateInvestigatorFinally(
  params: UpdateInvestigatorFinallyProps
) {
  const resp = await api.put(
    `/inquiry/investigator/finally-inquiry/${params.id}`,
    {
      result: params.result,
      endDate: new Date(new Date().setHours(new Date().getHours() - 3)),
    }
  );

  // console.log(resp);

  revalidatePath("/consultas");
}
