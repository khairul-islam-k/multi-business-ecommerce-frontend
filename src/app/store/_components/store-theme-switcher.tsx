"use client";

import { Moon, Sun } from "lucide-react";
import { useStoreTheme } from "./theme/store-theme-provider";

export default function StoreThemeToggle() {
  const { mode, toggleTheme } = useStoreTheme();

  const isDark = mode === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="inline-flex h-10 items-center gap-2 rounded-full border border-[var(--store-border)] bg-[var(--store-card)] px-4 text-sm font-semibold text-[var(--store-text)] transition hover:bg-[var(--store-secondary)]"
    >
      {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}

      <span>{isDark ? "Light" : "Dark"}</span>
    </button>
  );
}