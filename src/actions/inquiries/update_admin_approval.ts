/* eslint-disable @typescript-eslint/no-unused-vars */

"use server";

import { api } from "@/lib/api";
import { revalidatePath } from "next/cache";

interface UpdateAdminApprovalProps {
  id: string;
}

export async function updateAdminApproval(params: UpdateAdminApprovalProps) {
  const resp = await api.put(`/inquiry/admin-approved/${params.id}`);

  // console.log(resp);

  revalidatePath("/consultas");
}
