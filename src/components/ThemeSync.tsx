"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { THEME_MODE_STORAGE_KEY, THEME_STORAGE_KEY, resolveMode, resolveTheme } from "@/lib/themes";

export default function ThemeSync() {
  const pathname = usePathname();

  useEffect(() => {
    try {
      const { theme, mode } = resolveTheme(localStorage.getItem(THEME_STORAGE_KEY), localStorage.getItem(THEME_MODE_STORAGE_KEY));
      const prefersDark = typeof window.matchMedia === "function" && window.matchMedia("(prefers-color-scheme: dark)").matches;
      document.documentElement.setAttribute("data-theme", theme);
      document.documentElement.setAttribute("data-mode", resolveMode(mode, prefersDark));
    } catch {}
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
