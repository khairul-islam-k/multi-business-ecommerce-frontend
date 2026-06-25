"use client";

import { useEffect, type ReactNode } from "react";

import type { AppTheme } from "@/stores/theme.store";

export const ShadcnThemeProvider = ({ children }: { children: ReactNode }) => {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("dark");
    root.style.colorScheme = "light";
  }, []);

  return <>{children}</>;
};

export const useTheme = () => {
  return {
    theme: "light" as AppTheme,
    resolvedTheme: "light",
    isDark: false,
    setTheme: (_theme: AppTheme) => undefined,
    toggle: () => undefined,
    toggleTheme: () => undefined,
  };
};
