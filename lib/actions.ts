"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function signOut() {
  const cookieStore = cookies();
  (await cookieStore).delete("myapp-token");
  redirect("/");
}
