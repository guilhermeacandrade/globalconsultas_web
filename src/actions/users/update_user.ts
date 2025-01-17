/* eslint-disable @typescript-eslint/no-unused-vars */

"use server";

import { type TFormUserData } from "@/components/forms/form_user";
import { api } from "@/lib/api";
import { IUserProfile } from "@/utils/types/user.type";
import { revalidatePath } from "next/cache";

interface UpdateUserProps extends TFormUserData {
  id: string;
}

export async function updateUser(params: UpdateUserProps) {
  // console.log("🚀 ~ updateUser ~ params:", params);

  const resp = await api.put(`/user/${params.id}`, {
    name: params.name,
    email: params.email,
    profile: params.profile,
    password: params.password,
    status: params.status,
    companyId:
      params.profile === IUserProfile.COMPANY ? params.companyId : null,
    branchId: params.profile === IUserProfile.RH ? params.branchId : null,
  });

  // console.log(resp);

  revalidatePath("/usuarios");
}
