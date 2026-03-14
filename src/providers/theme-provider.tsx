"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { ConfigProvider, theme as antdTheme } from "antd";
import type { ThemeConfig } from "antd";

const { defaultAlgorithm, darkAlgorithm } = antdTheme;

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

const lightTheme: ThemeConfig = {
  token: {
    colorPrimary: "#6366F1",
    colorSuccess: "#22C55E",
    colorWarning: "#F97316",
    colorError: "#EF4444",

    colorBgBase: "#FFFFFF",
    colorBgContainer: "#FFFFFF",
    colorBgElevated: "#FFFFFF",

    colorText: "#0F172A",
    colorTextSecondary: "#64748B",

    colorBorder: "#E4E4E7",

    borderRadius: 8,

    controlItemBgActive: "#EEF2FF",
    controlItemBgHover: "#F5F7FF",
  },
};

const darkTheme: ThemeConfig = {
  token: {
    colorPrimary: "#6366F1",

    colorSuccess: "#22C55E",
    colorWarning: "#F97316",
    colorError: "#DC2626",

    colorBgBase: "#0B0B0F",
    colorBgContainer: "#111113",
    colorBgElevated: "#111113",

    colorText: "#F4F4F5",
    colorTextSecondary: "#A1A1AA",

    colorBorder: "#27272A",

    borderRadius: 8,

    controlItemBgActive: "#1E1E2F",
    controlItemBgHover: "#191927",
  },
};

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const stored = localStorage.getItem("theme") as Theme | null;

    if (stored) {
      setTheme(stored);
      return;
    }

    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;

    setTheme(prefersDark ? "dark" : "light");
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === "light" ? "dark" : "light"));

  const config: ThemeConfig = {
    algorithm: theme === "dark" ? darkAlgorithm : defaultAlgorithm,
    ...(theme === "dark" ? darkTheme : lightTheme),
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      <ConfigProvider theme={config}>{children}</ConfigProvider>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used inside ThemeProvider");
  }

  return context;
}
