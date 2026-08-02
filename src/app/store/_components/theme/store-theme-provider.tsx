"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import styles from "../store-theme.module.css";
import { DashboardColors, ThemeConfig } from "@/types/website/website";

type StoreThemeMode = "light" | "dark";

type StoreThemeContextType = {
  mode: StoreThemeMode;
  toggleTheme: () => void;
  setMode: (mode: StoreThemeMode) => void;
};

type ThemeStyle = React.CSSProperties & {
  "--store-bg-1"?: string;
  "--store-bg-2"?: string;
  "--store-bg-3"?: string;
  "--store-card"?: string;
  "--store-text"?: string;
  "--store-muted"?: string;
  "--store-border"?: string;

  "--store-sidebar-bg"?: string;
  "--store-sidebar-text"?: string;

  "--store-navbar-bg"?: string;
  "--store-navbar-text"?: string;

  "--store-primary"?: string;
  "--store-secondary"?: string;
  "--store-accent"?: string;
  "--store-success"?: string;
  "--store-danger"?: string;
  "--store-warning"?: string;
  "--store-info"?: string;
  "--store-neutral"?: string;
  "--store-dark"?: string;
  "--store-light"?: string;
  "--store-footer-cosmetic"?: string;
};

const StoreThemeContext = createContext<StoreThemeContextType | null>(null);

const STORE_THEME_MODE_KEY = "store_theme_mode";

type StoreThemeProviderProps = {
  children: ReactNode;
  backendTheme?: ThemeConfig | null;
  sideBar: DashboardColors
};

export function StoreThemeProvider({
  children,
  backendTheme,
  sideBar
}: StoreThemeProviderProps) {
  const [mode, setModeState] = useState<StoreThemeMode>("light");

  useEffect(() => {
    const savedMode = localStorage.getItem(
      STORE_THEME_MODE_KEY
    ) as StoreThemeMode | null;

    if (savedMode === "light" || savedMode === "dark") {
      const handleTheme = () => {
        setModeState(savedMode);
      }
      handleTheme()
    }
  }, []);

  const setMode = (newMode: StoreThemeMode) => {
    setModeState(newMode);
    localStorage.setItem(STORE_THEME_MODE_KEY, newMode);
  };

  const toggleTheme = () => {
    setMode(mode === "dark" ? "light" : "dark");
  };

  /**
   * These colors are only important for light mode.
   * Dark mode colors come from StoreTheme.module.css.
   */
  const lightStyle: ThemeStyle = {
    "--store-bg-1": backendTheme?.accentColor || "#ffffff",
    "--store-bg-2": backendTheme?.primaryColor || "#fef8ee",
    "--store-bg-3": backendTheme?.secondaryColor || "#f6f6f6",
    "--store-card": sideBar?.cardColor || "#ffffff",

    "--store-sidebar-bg": sideBar?.sidebarBackgroundColor || "#ffffff",
    "--store-sidebar-text": sideBar?.sidebarTextColor || "#111827",

    // navbar
    "--store-navbar-bg": sideBar.navbarColor || "#ffffff",
    "--store-navbar-text": sideBar.navbarText || "#111827",

    "--store-text": "#111827",
    "--store-muted": "#6b7280",
    "--store-border": "#e5e7eb",

    "--store-primary": "#f16d59",
    "--store-secondary": "#111827",
    "--store-accent": "#0e7673",
    "--store-success": "#01be5f",
    "--store-danger": "#dc2626",
    "--store-warning": "#d97706",
    "--store-info": "#2563eb",
    "--store-neutral": "#64748b",
    "--store-dark": "#020617",
    "--store-light": "#f3f4f6",
    "--store-footer-cosmetic": "#fff8f7",
  };

  return (
    <StoreThemeContext.Provider value={{ mode, toggleTheme, setMode }}>
      <div
        style={mode === "light" ? lightStyle : undefined}
        className={`${styles.themeBase} ${mode === "dark" ? styles.dark : styles.light
          }`}
      >
        {children}
      </div>
    </StoreThemeContext.Provider>
  );
}

export function useStoreTheme() {
  const context = useContext(StoreThemeContext);

  if (!context) {
    throw new Error("useStoreTheme must be used inside StoreThemeProvider");
  }

  return context;
}