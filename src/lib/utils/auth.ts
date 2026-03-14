import { z } from "zod";

import { loginFormSchema } from "@/schemas/super-admin/auth";

export async function login(values: z.infer<typeof loginFormSchema>) {
  await new Promise((r) => setTimeout(r, 2000));
  console.log(values);
}
