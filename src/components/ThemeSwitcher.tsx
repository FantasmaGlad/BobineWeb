"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import {
  THEME_STORAGE_KEY,
  defaultTheme,
  isTheme,
  themeMeta,
  themes,
  type Theme,
} from "@/lib/themes";

function getCurrentTheme(): Theme {
  if (typeof document === "undefined") return defaultTheme;
  const attr = document.documentElement.getAttribute("data-theme");
  return attr && isTheme(attr) ? attr : defaultTheme;
}

const listeners = new Set<() => void>();

function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}

function applyTheme(next: Theme) {
  document.documentElement.setAttribute("data-theme", next);
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, next);
  } catch {}
  listeners.forEach((listener) => listener());
}

export default function ThemeSwitcher() {
  const theme = useSyncExternalStore(
    subscribe,
    getCurrentTheme,
    () => defaultTheme
  );
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  // Gestion du simple clic (thème suivant) vs double clic (ouvrir la sélection manuelle)
  function handleButtonClick(event: React.MouseEvent) {
    event.preventDefault();

    if (clickTimeoutRef.current) {
      // Double clic détecté : ouvrir la liste manuelle
      clearTimeout(clickTimeoutRef.current);
      clickTimeoutRef.current = null;
      setIsOpen((prev) => !prev);
    } else {
      // Attente d'un éventuel second clic
      clickTimeoutRef.current = setTimeout(() => {
        clickTimeoutRef.current = null;
        // Simple clic : cycle vers le thème suivant
        const currentIndex = themes.indexOf(theme);
        const nextTheme = themes[(currentIndex + 1) % themes.length];
        applyTheme(nextTheme);
      }, 250);
    }
  }

  function handleSelect(next: Theme) {
    applyTheme(next);
    setIsOpen(false);
  }

  const currentMeta = themeMeta[theme] || themeMeta[defaultTheme];

  return (
    <div className="theme-switcher-wrapper" ref={containerRef}>
      <button
        type="button"
        className="theme-switcher-btn"
        onClick={handleButtonClick}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        title="1 clic : thème suivant · Double-clic : menu des 13 thèmes"
        aria-label={`Thème actif : ${currentMeta.label}. 1 clic pour changer, double-clic pour ouvrir la liste.`}
      >
        <span
          className="theme-swatch-icon"
          style={{
            background: `linear-gradient(135deg, ${currentMeta.bg} 50%, ${currentMeta.accent} 50%)`,
          }}
        />
        <span>Thème : {currentMeta.label}</span>
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          onClick={(e) => {
            // Clic direct sur la flèche pour ouvrir immédiatement le menu
            e.stopPropagation();
            if (clickTimeoutRef.current) {
              clearTimeout(clickTimeoutRef.current);
              clickTimeoutRef.current = null;
            }
            setIsOpen((prev) => !prev);
          }}
          style={{
            transition: "transform 0.2s ease",
            transform: isOpen ? "rotate(180deg)" : "rotate(0)",
            cursor: "pointer",
          }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {isOpen && (
        <div className="theme-dropdown" role="listbox" aria-label="Choisir un thème">
          {themes.map((t) => {
            const meta = themeMeta[t];
            const isActive = t === theme;
            return (
              <button
                key={t}
                type="button"
                role="option"
                aria-selected={isActive}
                className={`theme-option ${isActive ? "is-active" : ""}`}
                onClick={() => handleSelect(t)}
              >
                <span
                  className="theme-swatch-icon"
                  style={{
                    background: `linear-gradient(135deg, ${meta.bg} 50%, ${meta.accent} 50%)`,
                  }}
                />
                <span>{meta.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
