"use client";

import { useEffect, useRef, useState } from "react";
import {
  THEME_STORAGE_KEY,
  defaultTheme,
  isTheme,
  themeLabels,
  themes,
  type Theme,
} from "@/lib/themes";

// Lit le thème déjà posé sur <html> par le script inline anti-FOUC du layout
// (exécuté avant hydratation) plutôt que de le relire depuis un effet.
function getCurrentTheme(): Theme {
  if (typeof document === "undefined") return defaultTheme;
  const attr = document.documentElement.getAttribute("data-theme");
  return attr && isTheme(attr) ? attr : defaultTheme;
}

function randomTheme(exclude: Theme): Theme {
  const candidates = themes.filter((t) => t !== exclude);
  return candidates[Math.floor(Math.random() * candidates.length)];
}

// Interaction "roulette" : un clic tire un thème au hasard, un double-clic
// ouvre la sélection manuelle précise. Le simple clic est retardé le temps
// de détecter un éventuel second clic, pour ne pas tirer deux thèmes au
// hasard avant d'ouvrir le sélecteur manuel.
const DOUBLE_CLICK_WINDOW_MS = 300;

export default function ThemeSwitcher() {
  const [theme, setTheme] = useState<Theme>(getCurrentTheme);
  const [manualOpen, setManualOpen] = useState(false);
  const selectRef = useRef<HTMLSelectElement>(null);
  const clickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  useEffect(() => {
    if (manualOpen) selectRef.current?.focus();
  }, [manualOpen]);

  useEffect(() => {
    return () => {
      if (clickTimer.current) clearTimeout(clickTimer.current);
    };
  }, []);

  if (manualOpen) {
    return (
      <select
        ref={selectRef}
        className="theme-switcher"
        value={theme}
        onChange={(event) => {
          const { value } = event.target;
          if (isTheme(value)) setTheme(value);
          setManualOpen(false);
        }}
        onBlur={() => setManualOpen(false)}
      >
        {themes.map((t) => (
          <option key={t} value={t}>
            {themeLabels[t]}
          </option>
        ))}
      </select>
    );
  }

  return (
    <button
      type="button"
      className="theme-switcher"
      title="Clic : thème au hasard — double-clic : choisir précisément"
      onClick={() => {
        if (clickTimer.current) clearTimeout(clickTimer.current);
        clickTimer.current = setTimeout(() => {
          setTheme((current) => randomTheme(current));
          clickTimer.current = null;
        }, DOUBLE_CLICK_WINDOW_MS);
      }}
      onDoubleClick={() => {
        if (clickTimer.current) {
          clearTimeout(clickTimer.current);
          clickTimer.current = null;
        }
        setManualOpen(true);
      }}
    >
      Thème : {themeLabels[theme]}
    </button>
  );
}
