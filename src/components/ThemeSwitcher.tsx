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

// Lit le thème déjà posé sur <html> par le script inline anti-FOUC du layout.
function getCurrentTheme(): Theme {
  if (typeof document === "undefined") return defaultTheme;
  const attr = document.documentElement.getAttribute("data-theme");
  return attr && isTheme(attr) ? attr : defaultTheme;
}

function applyTheme(next: Theme) {
  document.documentElement.setAttribute("data-theme", next);
  window.localStorage.setItem(THEME_STORAGE_KEY, next);
}

function randomTheme(exclude: Theme): Theme {
  const candidates = themes.filter((t) => t !== exclude);
  return candidates[Math.floor(Math.random() * candidates.length)];
}

// Interaction "roulette" : un clic tire un thème au hasard, un double-clic
// (ou Maj+Entrée au clavier) ouvre la sélection manuelle précise. Le simple
// clic est retardé le temps de détecter un éventuel second clic, pour ne pas
// tirer deux thèmes au hasard avant d'ouvrir le sélecteur manuel.
const DOUBLE_CLICK_WINDOW_MS = 300;

export default function ThemeSwitcher() {
  // Toujours initialisé au défaut serveur ("beige") pour que l'hydratation
  // corresponde exactement au HTML rendu côté serveur — le serveur ne connaît
  // pas le thème stocké en localStorage. La correction éventuelle (si un
  // thème différent est déjà posé sur <html> par le script anti-FOUC) se
  // fait une fois après le montage, ci-dessous.
  const [theme, setTheme] = useState<Theme>(defaultTheme);
  const [manualOpen, setManualOpen] = useState(false);
  const selectRef = useRef<HTMLSelectElement>(null);
  const clickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Aligne l'état React sur le DOM déjà correct (script anti-FOUC) — pas
    // une source de vérité dérivable du rendu, et ne réécrit rien.
    const current = getCurrentTheme();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (current !== defaultTheme) setTheme(current);
  }, []);

  useEffect(() => {
    if (manualOpen) selectRef.current?.focus();
  }, [manualOpen]);

  useEffect(() => {
    return () => {
      if (clickTimer.current) clearTimeout(clickTimer.current);
    };
  }, []);

  function chooseTheme(next: Theme) {
    setTheme(next);
    applyTheme(next);
  }

  if (manualOpen) {
    return (
      <select
        ref={selectRef}
        className="theme-switcher"
        value={theme}
        onChange={(event) => {
          const { value } = event.target;
          if (isTheme(value)) chooseTheme(value);
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
      title="Clic : thème au hasard — double-clic ou Maj+Entrée : choisir précisément"
      aria-keyshortcuts="Shift+Enter"
      aria-label={`Thème : ${themeLabels[theme]}. Entrée pour un thème au hasard, Maj+Entrée pour choisir précisément.`}
      onClick={() => {
        if (clickTimer.current) clearTimeout(clickTimer.current);
        clickTimer.current = setTimeout(() => {
          chooseTheme(randomTheme(theme));
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
      onKeyDown={(event) => {
        // Équivalent clavier du double-clic : le double-clic seul n'est pas
        // atteignable au clavier/lecteur d'écran.
        if (event.shiftKey && (event.key === "Enter" || event.key === " ")) {
          event.preventDefault();
          if (clickTimer.current) {
            clearTimeout(clickTimer.current);
            clickTimer.current = null;
          }
          setManualOpen(true);
        }
      }}
    >
      Thème : {themeLabels[theme]}
    </button>
  );
}
