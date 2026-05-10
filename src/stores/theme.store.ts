"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type AppTheme = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

type ThemeState = {
  theme: AppTheme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: AppTheme) => void;
  setResolvedTheme: (theme: ResolvedTheme) => void;
  toggleTheme: () => void;
};

const getSystemTheme = (): ResolvedTheme => {
  if (typeof window === "undefined") return "light";

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: "system",
      resolvedTheme: getSystemTheme(),

      setTheme: (theme) =>
        set({
          theme,
          resolvedTheme: theme === "system" ? getSystemTheme() : theme,
        }),

      setResolvedTheme: (resolvedTheme) => set({ resolvedTheme }),

      toggleTheme: () => {
        const nextTheme = get().resolvedTheme === "dark" ? "light" : "dark";
        set({ theme: nextTheme, resolvedTheme: nextTheme });
      },
    }),
    {
      name: "onecomm-theme",
      partialize: (state) => ({ theme: state.theme }),
      onRehydrateStorage: () => (state) => {
        if (!state) return;

        state.setResolvedTheme(
          state.theme === "system" ? getSystemTheme() : state.theme,
        );
      },
    },
  ),
);
