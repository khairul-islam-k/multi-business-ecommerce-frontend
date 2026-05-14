import type { PackageSubscriptionStatus } from "@/lib/api";

export const subscriptionStatusColor: Record<
  PackageSubscriptionStatus,
  string
> = {
  ACTIVE: "green",
  CANCELLED: "default",
  EXPIRED: "red",
  PAST_DUE: "red",
  TRIALING: "blue",
};

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

export function dateText(value?: string | null) {
  return value ? new Date(value).toLocaleDateString() : "-";
}
