/* eslint-disable @typescript-eslint/no-unused-vars */

"use server";

import { type TFormUserData } from "@/components/forms/form_user";
import { api } from "@/lib/api";
import { revalidatePath } from "next/cache";

export async function createUser(params: TFormUserData) {
  const resp = await api.post("/user", {
    name: params.name,
    email: params.email,
    password: params.password,
    profile: params.profile,
  });

  // console.log(resp);

  revalidatePath("/usuarios");
}
