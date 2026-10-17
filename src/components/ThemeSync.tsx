"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { THEME_STORAGE_KEY, resolveTheme } from "@/lib/themes";

export default function ThemeSync() {
  const pathname = usePathname();

  useEffect(() => {
    try {
      const stored = localStorage.getItem(THEME_STORAGE_KEY);
      const theme = resolveTheme(stored);
      document.documentElement.setAttribute("data-theme", theme);
    } catch {}
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
