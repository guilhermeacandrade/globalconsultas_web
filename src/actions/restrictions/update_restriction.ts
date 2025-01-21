/* eslint-disable @typescript-eslint/no-unused-vars */

"use server";

import { type TFormRestrictionData } from "@/components/forms/form_restriction";
import { api } from "@/lib/api";
import { revalidatePath } from "next/cache";

interface UpdateRestrictionProps extends TFormRestrictionData {
  id: string;
}

export async function updateRestriction(params: UpdateRestrictionProps) {
  // console.log("🚀 ~ updateRestriction ~ params:", params);

  const resp = await api.put(`/restriction/${params.id}`, {
    type: params.type,
    article: params.article,
    description: params.description,
  });

  // console.log(resp);

  revalidatePath("/restricoes");
}
