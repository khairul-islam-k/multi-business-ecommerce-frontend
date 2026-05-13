"use client";

import type { ThemeConfig } from "antd";
import { ConfigProvider, theme as antdTheme } from "antd";
import React, { useEffect, useMemo } from "react";

import { useThemeStore, type AppTheme } from "@/stores/theme.store";

const { defaultAlgorithm, darkAlgorithm } = antdTheme;

const lightTheme: ThemeConfig = {
  token: {
    colorPrimary: "#1D4ED8",
    colorInfo: "#0284C7",
    colorSuccess: "#16A34A",
    colorWarning: "#D97706",
    colorError: "#DC2626",
    colorBgBase: "#F8FAFC",
    colorBgLayout: "#F1F5F9",
    colorBgContainer: "#FFFFFF",
    colorBgElevated: "#FFFFFF",
    colorText: "#0F172A",
    colorTextSecondary: "#475569",
    colorTextTertiary: "#64748B",
    colorBorder: "#CBD5E1",
    colorBorderSecondary: "#E2E8F0",
    borderRadius: 8,
    controlHeight: 38,
    controlItemBgActive: "#DBEAFE",
    controlItemBgHover: "#EFF6FF",
    colorFillSecondary: "#EEF2F7",
    colorFillTertiary: "#F8FAFC",
  },
  components: {
    Layout: {
      bodyBg: "#F1F5F9",
      headerBg: "#FFFFFF",
      siderBg: "#FFFFFF",
    },
    Card: {
      borderRadiusLG: 8,
      boxShadowTertiary: "0 1px 2px rgba(15, 23, 42, 0.06)",
      colorBorderSecondary: "#E2E8F0",
    },
    Dropdown: {
      colorBgElevated: "#FFFFFF",
      controlItemBgHover: "#EFF6FF",
    },
    Input: {
      activeBorderColor: "#2563EB",
      hoverBorderColor: "#2563EB",
    },
    Menu: {
      itemHoverBg: "#F1F5F9",
      itemSelectedBg: "#DBEAFE",
      itemSelectedColor: "#1D4ED8",
    },
    Select: {
      optionSelectedBg: "#DBEAFE",
      optionActiveBg: "#EFF6FF",
    },
    Table: {
      borderColor: "#E2E8F0",
      headerBg: "#F1F5F9",
      headerColor: "#334155",
      rowHoverBg: "#F8FAFC",
    },
    Upload: {
      actionsColor: "#475569",
      colorFillAlter: "#F8FAFC",
    },
  },
};

const darkTheme: ThemeConfig = {
  token: {
    colorPrimary: "#3B82F6",
    colorInfo: "#38BDF8",
    colorSuccess: "#22C55E",
    colorWarning: "#F59E0B",
    colorError: "#F87171",
    colorBgBase: "#070A12",
    colorBgLayout: "#0B1020",
    colorBgContainer: "#111827",
    colorBgElevated: "#172033",
    colorText: "#E5EDF7",
    colorTextSecondary: "#A8B3C7",
    colorTextTertiary: "#7D8AA2",
    colorBorder: "#334155",
    colorBorderSecondary: "#243044",
    borderRadius: 8,
    controlHeight: 38,
    controlItemBgActive: "#1E3A5F",
    controlItemBgHover: "#172033",
    colorFillSecondary: "#182235",
    colorFillTertiary: "#111827",
  },
  components: {
    Layout: {
      bodyBg: "#0B1120",
      headerBg: "#111827",
      siderBg: "#111827",
    },
    Card: {
      borderRadiusLG: 8,
      colorBgContainer: "#111827",
      colorBorderSecondary: "#243044",
      boxShadowTertiary: "0 12px 30px rgba(0, 0, 0, 0.22)",
    },
    Dropdown: {
      colorBgElevated: "#172033",
      controlItemBgHover: "#1E293B",
    },
    Input: {
      activeBg: "#111827",
      activeBorderColor: "#3B82F6",
      addonBg: "#172033",
      hoverBg: "#111827",
      hoverBorderColor: "#60A5FA",
    },
    Menu: {
      darkItemBg: "#111827",
      itemBg: "#111827",
      itemColor: "#A8B3C7",
      itemHoverBg: "#172033",
      itemHoverColor: "#E5EDF7",
      itemSelectedBg: "#1E3A5F",
      itemSelectedColor: "#BFDBFE",
      subMenuItemBg: "#111827",
    },
    Select: {
      optionActiveBg: "#1E293B",
      optionSelectedBg: "#1E3A5F",
      selectorBg: "#111827",
    },
    Table: {
      borderColor: "#243044",
      headerBg: "#172033",
      headerColor: "#E5E7EB",
      rowExpandedBg: "#111827",
      rowHoverBg: "#172033",
    },
    Tag: {
      defaultBg: "#172033",
      defaultColor: "#A8B3C7",
    },
    Upload: {
      actionsColor: "#A8B3C7",
      colorFillAlter: "#111827",
    },
  },
};

export default function AntdThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = useThemeStore((state) => state.theme);
  const resolvedTheme = useThemeStore((state) => state.resolvedTheme);
  const setResolvedTheme = useThemeStore((state) => state.setResolvedTheme);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", resolvedTheme === "dark");
    root.style.colorScheme = resolvedTheme;
  }, [resolvedTheme]);

  useEffect(() => {
    if (theme !== "system") return;

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const syncSystemTheme = () =>
      setResolvedTheme(media.matches ? "dark" : "light");

    syncSystemTheme();
    media.addEventListener("change", syncSystemTheme);

    return () => media.removeEventListener("change", syncSystemTheme);
  }, [theme, setResolvedTheme]);

  const config = useMemo<ThemeConfig>(
    () => ({
      algorithm: resolvedTheme === "dark" ? darkAlgorithm : defaultAlgorithm,
      ...(resolvedTheme === "dark" ? darkTheme : lightTheme),
    }),
    [resolvedTheme],
  );

  return <ConfigProvider theme={config}>{children}</ConfigProvider>;
}

export function useTheme() {
  const theme = useThemeStore((state) => state.theme);
  const resolvedTheme = useThemeStore((state) => state.resolvedTheme);
  const setTheme = useThemeStore((state) => state.setTheme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);

  return {
    theme,
    resolvedTheme,
    isDark: resolvedTheme === "dark",
    setTheme: setTheme as (theme: AppTheme) => void,
    toggleTheme,
  };
}
