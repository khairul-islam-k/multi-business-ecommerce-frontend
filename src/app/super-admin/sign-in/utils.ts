import { message } from "antd";

import { LoginFormValues } from "./schemas";

export async function login(values: LoginFormValues) {
  await new Promise((r) => setTimeout(r, 2000));
  message.success("Successfully signed-in!");
}
