"use client";

import { useEffect, useState } from "react";
import {
  THEME_STORAGE_KEY,
  defaultTheme,
  isTheme,
  themeLabels,
  themes,
  type Theme,
} from "@/lib/themes";

// Lit le thème déjà posé sur <html> par le script inline anti-FOUC du layout
// (exécuté avant hydratation) plutôt que de le relire depuis un effet — évite
// à la fois un flash (l'ancien effet de montage réécrivait brièvement le
// défaut serveur avant de corriger) et un state géré uniquement par effet.
function getCurrentTheme(): Theme {
  if (typeof document === "undefined") return defaultTheme;
  const attr = document.documentElement.getAttribute("data-theme");
  return attr && isTheme(attr) ? attr : defaultTheme;
}

export default function ThemeSwitcher() {
  const [theme, setTheme] = useState<Theme>(getCurrentTheme);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  return (
    <label className="theme-switcher">
      <span>Thème</span>
      <select
        value={theme}
        onChange={(event) => {
          const { value } = event.target;
          if (isTheme(value)) setTheme(value);
        }}
      >
        {themes.map((t) => (
          <option key={t} value={t}>
            {themeLabels[t]}
          </option>
        ))}
      </select>
    </label>
  );
}
