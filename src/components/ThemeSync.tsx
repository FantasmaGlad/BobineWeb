"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { THEME_STORAGE_KEY, defaultTheme, isTheme, type Theme } from "@/lib/themes";

export default function ThemeSync() {
  const pathname = usePathname();

  useEffect(() => {
    try {
      const stored = localStorage.getItem(THEME_STORAGE_KEY);
      const theme: Theme = stored && isTheme(stored) ? (stored as Theme) : defaultTheme;
      document.documentElement.setAttribute("data-theme", theme);
    } catch {}
  }, [pathname]);

  return null;
}
