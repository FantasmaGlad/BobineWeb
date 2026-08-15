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

export default function ThemeSwitcher() {
  // Toujours initialisé au défaut serveur ("beige") pour que l'hydratation
  // corresponde exactement au HTML rendu côté serveur — le serveur ne connaît
  // pas le thème stocké en localStorage. La correction éventuelle (si un
  // thème différent est déjà posé sur <html> par le script anti-FOUC) se
  // fait une fois après le montage, ci-dessous.
  const [theme, setTheme] = useState<Theme>(defaultTheme);
  const [manualOpen, setManualOpen] = useState(false);
  const selectRef = useRef<HTMLSelectElement>(null);

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
        // Appliqué immédiatement, sans délai d'attente d'un éventuel second
        // clic : un double-clic déclenchera juste un second tirage avant que
        // onDoubleClick n'ouvre la sélection manuelle, ce qui est sans
        // conséquence (l'état final visible est le sélecteur ouvert).
        chooseTheme(randomTheme(theme));
      }}
      onDoubleClick={() => {
        setManualOpen(true);
      }}
      onKeyDown={(event) => {
        // Équivalent clavier du double-clic : le double-clic seul n'est pas
        // atteignable au clavier/lecteur d'écran.
        if (event.shiftKey && (event.key === "Enter" || event.key === " ")) {
          event.preventDefault();
          setManualOpen(true);
        }
      }}
    >
      Thème : {themeLabels[theme]}
    </button>
  );
}
