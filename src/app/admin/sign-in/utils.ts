import { message } from "antd";
import { redirect } from "next/navigation";

import { LoginFormValues } from "./schemas";

export async function login(values: LoginFormValues) {
  await new Promise((r) => setTimeout(r, 2000));
  message.success("Successfully signed-in!");
  redirect("/admin/dashboard");
}
