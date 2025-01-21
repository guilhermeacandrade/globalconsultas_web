/* eslint-disable @typescript-eslint/no-unused-vars */

"use server";

import { type TFormRestrictionData } from "@/components/forms/form_restriction";
import { api } from "@/lib/api";
import { revalidatePath } from "next/cache";

export async function createRestriction(params: TFormRestrictionData) {
  const resp = await api.post("/restriction", {
    type: params.type,
    article: params.article,
    description: params.description,
  });

  // console.log(resp);

  revalidatePath("/restricoes");
}
