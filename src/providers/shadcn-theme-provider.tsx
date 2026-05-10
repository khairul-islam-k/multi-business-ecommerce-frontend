"use client";

import { useEffect, type ReactNode } from "react";

import { useThemeStore, type AppTheme } from "@/stores/theme.store";

export const ShadcnThemeProvider = ({ children }: { children: ReactNode }) => {
  const resolvedTheme = useThemeStore((state) => state.resolvedTheme);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", resolvedTheme === "dark");
    root.style.colorScheme = resolvedTheme;
  }, [resolvedTheme]);

  return <>{children}</>;
};

export const useTheme = () => {
  const theme = useThemeStore((state) => state.theme);
  const resolvedTheme = useThemeStore((state) => state.resolvedTheme);
  const setTheme = useThemeStore((state) => state.setTheme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);

  return {
    theme,
    resolvedTheme,
    isDark: resolvedTheme === "dark",
    setTheme: setTheme as (theme: AppTheme) => void,
    toggle: toggleTheme,
    toggleTheme,
  };
};
