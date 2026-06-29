import type {
  PackageBillingCycle,
  PackageLimitKey,
  PackageResetCycle,
  PackageStatus,
  PackageSubscriptionStatus,
} from "@/lib/api";

export const billingCycleOptions: PackageBillingCycle[] = [
  "FREE",
  "MONTHLY",
  "YEARLY",
  "LIFETIME",
];

export const packageStatusOptions: PackageStatus[] = [
  "ACTIVE",
  "INACTIVE",
  "ARCHIVED",
];

export const resetCycleOptions: PackageResetCycle[] = [
  "LIFETIME",
  "DAILY",
  "MONTHLY",
  "YEARLY",
];

export const limitKeyOptions: PackageLimitKey[] = [
  "MAX_MEDIAS",
  "MAX_PRODUCTS",
  "MAX_EMPLOYEES",
  "MAX_BUSINESSES",
];

export const subscriptionStatusOptions: PackageSubscriptionStatus[] = [
  "TRIALING",
  "ACTIVE",
  "PAST_DUE",
  "CANCELLED",
  "EXPIRED",
];

export function optionLabel(value: string) {
  return value
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function money(value: number | string, currencyCode = "BDT") {
  const amount = Number(value);

  if (!Number.isFinite(amount)) return `${currencyCode} ${value}`;

  return `${currencyCode} ${amount.toLocaleString()}`;
}
