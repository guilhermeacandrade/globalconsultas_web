/* eslint-disable @typescript-eslint/no-unused-vars */

"use server";

import { api } from "@/lib/api";
import { revalidatePath } from "next/cache";

interface UpdateAdminReverseProps {
  id: string;
}

export async function updateAdminReverse(params: UpdateAdminReverseProps) {
  const resp = await api.put(`/inquiry/admin-reverse/${params.id}`);

  // console.log(resp);

  revalidatePath("/consultas");
}
