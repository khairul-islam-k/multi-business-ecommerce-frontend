import { z } from "zod";

export const loginFormSchema = z.object({
  username: z.string().email(),
  password: z.string().min(8),
  remember: z.boolean().optional(),
});

export type LoginFormValues = z.infer<typeof loginFormSchema>;
