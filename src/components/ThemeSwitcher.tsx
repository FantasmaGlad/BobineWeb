"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import {
  THEME_STORAGE_KEY,
  defaultTheme,
  isTheme,
  themeMeta,
  lightThemes,
  darkThemes,
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
  const currentMeta = themeMeta[theme] || themeMeta[defaultTheme];
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"light" | "dark">(() =>
    currentMeta.isDark ? "dark" : "light"
  );
  const containerRef = useRef<HTMLDivElement>(null);

  function handleToggleOpen() {
    setIsOpen((prev) => {
      const next = !prev;
      if (next) {
        setActiveTab(currentMeta.isDark ? "dark" : "light");
      }
      return next;
    });
  }

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

  function handleSelect(next: Theme) {
    applyTheme(next);
    setIsOpen(false);
  }

  const displayedThemes = activeTab === "light" ? lightThemes : darkThemes;

  return (
    <div className="theme-switcher-wrapper" ref={containerRef}>
      <button
        type="button"
        className="theme-switcher-btn"
        onClick={handleToggleOpen}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        title="Changer de thème (Collections Claire & Sombre)"
        aria-label={`Thème actif : ${currentMeta.label} (${currentMeta.isDark ? "Sombre" : "Clair"}). Cliquez pour ouvrir le sélecteur.`}
      >
        <span
          className="theme-swatch-icon"
          style={{
            background: `linear-gradient(135deg, ${currentMeta.bg} 50%, ${currentMeta.accent} 50%)`,
          }}
        />
        <span className="theme-switcher-btn__label">
          {currentMeta.isDark ? "🌙" : "☀️"} {currentMeta.label}
        </span>
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            transition: "transform 0.2s ease",
            transform: isOpen ? "rotate(180deg)" : "rotate(0)",
          }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {isOpen && (
        <div className="theme-dropdown-modal" role="dialog" aria-label="Palette des thèmes">
          {/* Contrôle segmenté Clair / Sombre */}
          <div className="theme-segmented-control" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "light"}
              className={`theme-segment-btn ${activeTab === "light" ? "is-active" : ""}`}
              onClick={() => setActiveTab("light")}
            >
              <span>☀️ Thèmes Clairs</span>
              <span className="theme-segment-count">{lightThemes.length}</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "dark"}
              className={`theme-segment-btn ${activeTab === "dark" ? "is-active" : ""}`}
              onClick={() => setActiveTab("dark")}
            >
              <span>🌙 Thèmes Sombres</span>
              <span className="theme-segment-count">{darkThemes.length}</span>
            </button>
          </div>

          {/* Grille de sélection des thèmes */}
          <div className="theme-grid" role="listbox">
            {displayedThemes.map((t) => {
              const meta = themeMeta[t];
              const isActive = t === theme;
              return (
                <button
                  key={t}
                  type="button"
                  role="option"
                  aria-selected={isActive}
                  className={`theme-card-option ${isActive ? "is-active" : ""}`}
                  onClick={() => handleSelect(t)}
                >
                  <div className="theme-card-option__swatch-wrapper">
                    <span
                      className="theme-card-option__swatch"
                      style={{
                        background: `linear-gradient(135deg, ${meta.bg} 50%, ${meta.accent} 50%)`,
                        boxShadow: `0 0 0 1px var(--border-subtle), 0 2px 4px rgba(0,0,0,0.15)`,
                      }}
                    />
                  </div>
                  <div className="theme-card-option__info">
                    <span className="theme-card-option__name">{meta.label}</span>
                    {meta.desc && (
                      <span className="theme-card-option__desc">{meta.desc}</span>
                    )}
                  </div>
                  {isActive && (
                    <span className="theme-card-option__check" aria-hidden="true">
                      ✓
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
