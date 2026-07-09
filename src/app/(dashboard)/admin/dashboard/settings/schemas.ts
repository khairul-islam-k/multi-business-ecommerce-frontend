import { z } from "zod";

export const generalSettingsSchema = z.object({
  businessName: z.string().min(1),
  timezone: z.string(),
  currency: z.string(),
});

export const securitySettingsSchema = z.object({
  sessionTimeout: z.number().min(5),
  passwordLength: z.number().min(6),
  passwordStrength: z.enum(["basic", "medium", "strong"]),
});

export const notificationSettingsSchema = z.object({
  orderEmail: z.boolean(),
  orderSMS: z.boolean(),
  marketingEmail: z.boolean(),
  systemAlerts: z.boolean(),
});

export const apiKeySchema = z.object({
  keyName: z.string(),
  permissions: z.array(z.string()),
});

export const webhookSchema = z.object({
  eventName: z.string(),
  targetUrl: z.string().url(),
  secret: z.string(),
});

export const brandingSchema = z.object({
  logo: z.string().optional(),
  favicon: z.string().optional(),
  invoicePrefix: z.string(),
  orderPrefix: z.string(),
});

export const languageSchema = z.object({
  language: z.enum(["en", "bn"]),
  dateFormat: z.enum(["DD-MM-YYYY", "MM-DD-YYYY"]),
});

export const themeSchema = z.object({
  theme: z.enum(["light", "dark", "system"]),
  primaryColor: z.string(),
});

export const emailSettingsSchema = z.object({
  host: z.string(),
  port: z.number(),
  sender: z.string().email(),
  username: z.string(),
  password: z.string(),
});

export type GeneralSettingsValues = z.infer<typeof generalSettingsSchema>;
export type SecuritySettingsValues = z.infer<typeof securitySettingsSchema>;
export type NotificationSettingsValues = z.infer<
  typeof notificationSettingsSchema
>;
export type ApiKeyValues = z.infer<typeof apiKeySchema>;
export type WebhookValues = z.infer<typeof webhookSchema>;
export type BrandingValues = z.infer<typeof brandingSchema>;
export type LanguageValues = z.infer<typeof languageSchema>;
export type ThemeValues = z.infer<typeof themeSchema>;
export type EmailSettingsValues = z.infer<typeof emailSettingsSchema>;
