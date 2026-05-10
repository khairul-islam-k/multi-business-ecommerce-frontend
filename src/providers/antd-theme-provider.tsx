"use client";

import type { ThemeConfig } from "antd";
import { ConfigProvider, theme as antdTheme } from "antd";
import React, { useEffect, useMemo } from "react";

import { useThemeStore, type AppTheme } from "@/stores/theme.store";

const { defaultAlgorithm, darkAlgorithm } = antdTheme;

const lightTheme: ThemeConfig = {
  token: {
    colorPrimary: "#2563EB",
    colorBgBase: "#FFFFFF",
    colorBgContainer: "#FFFFFF",
    colorText: "#111827",
    colorTextSecondary: "#6B7280",
    colorBorder: "#E5E7EB",
    borderRadius: 8,
    controlHeight: 38,
    controlItemBgActive: "#EFF6FF",
    controlItemBgHover: "#F8FAFC",
  },
  components: {
    Layout: {
      bodyBg: "#F6F8FB",
      headerBg: "#FFFFFF",
      siderBg: "#FFFFFF",
    },
    Card: {
      borderRadiusLG: 8,
      boxShadowTertiary: "0 1px 2px rgba(15, 23, 42, 0.04)",
    },
    Table: {
      headerBg: "#F8FAFC",
      headerColor: "#374151",
      rowHoverBg: "#F8FAFC",
    },
  },
};

const darkTheme: ThemeConfig = {
  token: {
    colorPrimary: "#60A5FA",
    colorBgBase: "#0F172A",
    colorBgContainer: "#111827",
    colorText: "#F8FAFC",
    colorTextSecondary: "#CBD5E1",
    colorBorder: "#263244",
    borderRadius: 8,
    controlHeight: 38,
    controlItemBgActive: "#1E3A5F",
    controlItemBgHover: "#172033",
  },
  components: {
    Layout: {
      bodyBg: "#0B1120",
      headerBg: "#111827",
      siderBg: "#111827",
    },
    Card: {
      borderRadiusLG: 8,
    },
    Table: {
      headerBg: "#172033",
      headerColor: "#E5E7EB",
      rowHoverBg: "#172033",
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
