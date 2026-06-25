import type { BusinessBranding } from "@/lib/api";

export type DashboardDensity = "COMPACT" | "DEFAULT" | "COMFORTABLE";

export type DashboardThemeTokens = {
  primaryColor: string;
  primaryHoverColor: string;
  primaryActiveColor: string;
  accentColor: string;
  successColor: string;
  warningColor: string;
  errorColor: string;
  infoColor: string;
  dashboardBackgroundColor: string;
  sidebarBackgroundColor: string;
  sidebarTextColor: string;
  sidebarMutedTextColor: string;
  sidebarActiveBackgroundColor: string;
  sidebarActiveTextColor: string;
  sidebarHoverBackgroundColor: string;
  headerBackgroundColor: string;
  headerTextColor: string;
  cardBackgroundColor: string;
  elevatedBackgroundColor: string;
  tableHeaderBackgroundColor: string;
  tableRowHoverColor: string;
  inputBackgroundColor: string;
  disabledBackgroundColor: string;
  textPrimaryColor: string;
  textSecondaryColor: string;
  textMutedColor: string;
  textInverseColor: string;
  borderColor: string;
  borderSubtleColor: string;
  focusRingColor: string;
  fontFamily: string;
  borderRadius: number;
  density: DashboardDensity;
  controlHeight: number;
};

export const defaultDashboardThemeTokens: DashboardThemeTokens = {
  primaryColor: "#1D4ED8",
  primaryHoverColor: "#2563EB",
  primaryActiveColor: "#1E40AF",
  accentColor: "#0284C7",
  successColor: "#16A34A",
  warningColor: "#D97706",
  errorColor: "#DC2626",
  infoColor: "#0284C7",
  dashboardBackgroundColor: "#F1F5F9",
  sidebarBackgroundColor: "#FFFFFF",
  sidebarTextColor: "#334155",
  sidebarMutedTextColor: "#64748B",
  sidebarActiveBackgroundColor: "#DBEAFE",
  sidebarActiveTextColor: "#1D4ED8",
  sidebarHoverBackgroundColor: "#EFF6FF",
  headerBackgroundColor: "#FFFFFF",
  headerTextColor: "#0F172A",
  cardBackgroundColor: "#FFFFFF",
  elevatedBackgroundColor: "#FFFFFF",
  tableHeaderBackgroundColor: "#F8FAFC",
  tableRowHoverColor: "#F8FAFC",
  inputBackgroundColor: "#FFFFFF",
  disabledBackgroundColor: "#F1F5F9",
  textPrimaryColor: "#0F172A",
  textSecondaryColor: "#475569",
  textMutedColor: "#64748B",
  textInverseColor: "#FFFFFF",
  borderColor: "#CBD5E1",
  borderSubtleColor: "#E2E8F0",
  focusRingColor: "#1D4ED8",
  fontFamily: 'var(--font-open-sans), "Open Sans", sans-serif',
  borderRadius: 8,
  density: "DEFAULT",
  controlHeight: 38,
};

const asNumber = (value: string | number | null | undefined, fallback: number) => {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const parsed = Number.parseFloat(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return fallback;
};

export function getDashboardThemeTokens(
  branding?: BusinessBranding | null,
): DashboardThemeTokens {
  const density = branding?.density ?? "DEFAULT";
  const fallback = defaultDashboardThemeTokens;

  return {
    primaryColor: branding?.primaryColor ?? fallback.primaryColor,
    primaryHoverColor: branding?.primaryHoverColor ?? fallback.primaryHoverColor,
    primaryActiveColor:
      branding?.primaryActiveColor ?? fallback.primaryActiveColor,
    accentColor: branding?.accentColor ?? fallback.accentColor,
    successColor: branding?.successColor ?? fallback.successColor,
    warningColor: branding?.warningColor ?? fallback.warningColor,
    errorColor: branding?.errorColor ?? fallback.errorColor,
    infoColor: branding?.infoColor ?? fallback.infoColor,
    dashboardBackgroundColor:
      branding?.dashboardBackgroundColor ??
      branding?.secondaryColor ??
      fallback.dashboardBackgroundColor,
    sidebarBackgroundColor:
      branding?.sidebarBackgroundColor ?? fallback.sidebarBackgroundColor,
    sidebarTextColor: branding?.sidebarTextColor ?? fallback.sidebarTextColor,
    sidebarMutedTextColor:
      branding?.sidebarMutedTextColor ?? fallback.sidebarMutedTextColor,
    sidebarActiveBackgroundColor:
      branding?.sidebarActiveBackgroundColor ??
      fallback.sidebarActiveBackgroundColor,
    sidebarActiveTextColor:
      branding?.sidebarActiveTextColor ??
      branding?.primaryColor ??
      fallback.sidebarActiveTextColor,
    sidebarHoverBackgroundColor:
      branding?.sidebarHoverBackgroundColor ??
      fallback.sidebarHoverBackgroundColor,
    headerBackgroundColor:
      branding?.headerBackgroundColor ?? fallback.headerBackgroundColor,
    headerTextColor: branding?.headerTextColor ?? fallback.headerTextColor,
    cardBackgroundColor:
      branding?.cardBackgroundColor ?? fallback.cardBackgroundColor,
    elevatedBackgroundColor:
      branding?.elevatedBackgroundColor ?? fallback.elevatedBackgroundColor,
    tableHeaderBackgroundColor:
      branding?.tableHeaderBackgroundColor ??
      fallback.tableHeaderBackgroundColor,
    tableRowHoverColor:
      branding?.tableRowHoverColor ?? fallback.tableRowHoverColor,
    inputBackgroundColor:
      branding?.inputBackgroundColor ?? fallback.inputBackgroundColor,
    disabledBackgroundColor:
      branding?.disabledBackgroundColor ?? fallback.disabledBackgroundColor,
    textPrimaryColor: branding?.textPrimaryColor ?? fallback.textPrimaryColor,
    textSecondaryColor:
      branding?.textSecondaryColor ?? fallback.textSecondaryColor,
    textMutedColor: branding?.textMutedColor ?? fallback.textMutedColor,
    textInverseColor: branding?.textInverseColor ?? fallback.textInverseColor,
    borderColor: branding?.borderColor ?? fallback.borderColor,
    borderSubtleColor:
      branding?.borderSubtleColor ?? fallback.borderSubtleColor,
    focusRingColor:
      branding?.focusRingColor ?? branding?.primaryColor ?? fallback.focusRingColor,
    fontFamily: branding?.fontFamily ?? fallback.fontFamily,
    borderRadius: asNumber(branding?.borderRadius, fallback.borderRadius),
    density,
    controlHeight:
      density === "COMPACT" ? 32 : density === "COMFORTABLE" ? 44 : 38,
  };
}
