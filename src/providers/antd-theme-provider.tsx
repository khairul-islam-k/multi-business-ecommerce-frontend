"use client";

import type { ThemeConfig } from "antd";
import { ConfigProvider, theme as antdTheme } from "antd";
import React, { useEffect, useMemo } from "react";

import { useActiveBusinessId } from "@/hooks/use-active-business";
import { useBusiness } from "@/lib/api";
import { getDashboardThemeTokens } from "@/lib/theme/dashboard-theme";
import type { AppTheme } from "@/stores/theme.store";

const { defaultAlgorithm } = antdTheme;

const hexToHslTriplet = (hex?: string | null) => {
  if (!hex) return undefined;

  const normalized = hex.replace("#", "");
  if (!/^[0-9a-fA-F]{6}$/.test(normalized)) return undefined;

  const r = Number.parseInt(normalized.slice(0, 2), 16) / 255;
  const g = Number.parseInt(normalized.slice(2, 4), 16) / 255;
  const b = Number.parseInt(normalized.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const delta = max - min;
    s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min);
    switch (max) {
      case r:
        h = (g - b) / delta + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / delta + 2;
        break;
      default:
        h = (r - g) / delta + 4;
    }
    h /= 6;
  }

  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
};

const lightTheme: ThemeConfig = {
  algorithm: defaultAlgorithm,
};

export default function AntdThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const businessId = useActiveBusinessId();
  const business = useBusiness(businessId);
  const branding = business.data?.branding;

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("dark");
    root.style.colorScheme = "light";
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const tokens = getDashboardThemeTokens(branding);

    Object.entries(tokens).forEach(([key, value]) => {
      root.style.setProperty(
        `--dashboard-${key.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)}`,
        String(value),
      );
    });

    root.style.setProperty("--brand-primary-color", tokens.primaryColor);
    root.style.setProperty("--brand-secondary-color", tokens.dashboardBackgroundColor);
    root.style.setProperty("--brand-accent-color", tokens.accentColor);
    root.style.setProperty("--brand-font-family", tokens.fontFamily);

    const primaryHsl = hexToHslTriplet(tokens.primaryColor);
    const backgroundHsl = hexToHslTriplet(tokens.dashboardBackgroundColor);
    const cardHsl = hexToHslTriplet(tokens.cardBackgroundColor);
    const textHsl = hexToHslTriplet(tokens.textPrimaryColor);
    const mutedHsl = hexToHslTriplet(tokens.textMutedColor);
    const borderHsl = hexToHslTriplet(tokens.borderSubtleColor);
    const accentHsl = hexToHslTriplet(tokens.accentColor);

    if (primaryHsl) {
      root.style.setProperty("--primary", primaryHsl);
      root.style.setProperty("--ring", primaryHsl);
      root.style.setProperty("--accent-foreground", primaryHsl);
    }
    if (backgroundHsl) {
      root.style.setProperty("--background", backgroundHsl);
      root.style.setProperty("--secondary", backgroundHsl);
      root.style.setProperty("--muted", backgroundHsl);
    }
    if (cardHsl) {
      root.style.setProperty("--card", cardHsl);
      root.style.setProperty("--popover", cardHsl);
    }
    if (textHsl) {
      root.style.setProperty("--foreground", textHsl);
      root.style.setProperty("--card-foreground", textHsl);
      root.style.setProperty("--popover-foreground", textHsl);
      root.style.setProperty("--secondary-foreground", textHsl);
    }
    if (mutedHsl) {
      root.style.setProperty("--muted-foreground", mutedHsl);
    }
    if (borderHsl) {
      root.style.setProperty("--border", borderHsl);
      root.style.setProperty("--input", borderHsl);
    }
    if (accentHsl) {
      root.style.setProperty("--accent", accentHsl);
      root.style.setProperty("--primary-glow", accentHsl);
    }
  }, [branding]);

  const config = useMemo<ThemeConfig>(() => {
    const baseTheme = lightTheme;
    const tokens = getDashboardThemeTokens(branding);

    return {
      ...baseTheme,
      token: {
        ...baseTheme.token,
        colorPrimary: tokens.primaryColor,
        colorPrimaryHover: tokens.primaryHoverColor,
        colorPrimaryActive: tokens.primaryActiveColor,
        colorInfo: tokens.infoColor,
        colorLink: tokens.accentColor,
        colorSuccess: tokens.successColor,
        colorWarning: tokens.warningColor,
        colorError: tokens.errorColor,
        colorBgBase: tokens.dashboardBackgroundColor,
        colorBgLayout: tokens.dashboardBackgroundColor,
        colorBgContainer: tokens.cardBackgroundColor,
        colorBgElevated: tokens.elevatedBackgroundColor,
        colorText: tokens.textPrimaryColor,
        colorTextSecondary: tokens.textSecondaryColor,
        colorTextTertiary: tokens.textMutedColor,
        colorTextQuaternary: tokens.textMutedColor,
        colorBorder: tokens.borderColor,
        colorBorderSecondary: tokens.borderSubtleColor,
        colorFillSecondary: tokens.disabledBackgroundColor,
        colorFillTertiary: tokens.dashboardBackgroundColor,
        colorFillQuaternary: tokens.inputBackgroundColor,
        colorTextLightSolid: tokens.textInverseColor,
        borderRadius: tokens.borderRadius,
        borderRadiusLG: tokens.borderRadius,
        borderRadiusSM: Math.max(tokens.borderRadius - 2, 2),
        controlHeight: tokens.controlHeight,
        controlItemBgActive: tokens.sidebarActiveBackgroundColor,
        controlItemBgHover: tokens.sidebarHoverBackgroundColor,
        fontFamily: tokens.fontFamily,
      },
      components: {
        ...baseTheme.components,
        Layout: {
          bodyBg: tokens.dashboardBackgroundColor,
          headerBg: tokens.headerBackgroundColor,
          siderBg: tokens.sidebarBackgroundColor,
        },
        Button: {
          primaryColor: tokens.textInverseColor,
        },
        Card: {
          colorBgContainer: tokens.cardBackgroundColor,
          colorBorderSecondary: tokens.borderSubtleColor,
          borderRadiusLG: tokens.borderRadius,
        },
        Dropdown: {
          colorBgElevated: tokens.elevatedBackgroundColor,
          controlItemBgHover: tokens.sidebarHoverBackgroundColor,
        },
        Menu: {
          ...baseTheme.components?.Menu,
          itemBg: tokens.sidebarBackgroundColor,
          subMenuItemBg: tokens.sidebarBackgroundColor,
          itemColor: tokens.sidebarTextColor,
          itemHoverBg: tokens.sidebarHoverBackgroundColor,
          itemHoverColor: tokens.sidebarTextColor,
          itemSelectedBg: tokens.sidebarActiveBackgroundColor,
          itemSelectedColor: tokens.sidebarActiveTextColor,
          itemActiveBg: tokens.sidebarActiveBackgroundColor,
        },
        Input: {
          ...baseTheme.components?.Input,
          activeBg: tokens.inputBackgroundColor,
          activeBorderColor: tokens.focusRingColor,
          hoverBg: tokens.inputBackgroundColor,
          hoverBorderColor: tokens.focusRingColor,
          colorBgContainer: tokens.inputBackgroundColor,
          colorBgContainerDisabled: tokens.disabledBackgroundColor,
        },
        Select: {
          ...baseTheme.components?.Select,
          selectorBg: tokens.inputBackgroundColor,
          optionActiveBg: tokens.sidebarHoverBackgroundColor,
          optionSelectedBg: tokens.sidebarActiveBackgroundColor,
        },
        Table: {
          borderColor: tokens.borderSubtleColor,
          headerBg: tokens.tableHeaderBackgroundColor,
          headerColor: tokens.textSecondaryColor,
          rowHoverBg: tokens.tableRowHoverColor,
        },
        Modal: {
          contentBg: tokens.elevatedBackgroundColor,
          headerBg: tokens.elevatedBackgroundColor,
        },
        Tooltip: {
          colorBgSpotlight: tokens.textPrimaryColor,
          colorTextLightSolid: tokens.textInverseColor,
        },
      },
    };
  }, [branding]);

  return <ConfigProvider theme={config}>{children}</ConfigProvider>;
}

export function useTheme() {
  return {
    theme: "light" as AppTheme,
    resolvedTheme: "light",
    isDark: false,
    setTheme: (_theme: AppTheme) => undefined,
    toggleTheme: () => undefined,
  };
}
