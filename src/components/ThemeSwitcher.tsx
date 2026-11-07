"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type CSSProperties } from "react";
import {
  MODE_LABELS,
  THEMES,
  THEME_COOKIE,
  THEME_LABELS,
  THEME_MODE_COOKIE,
  THEME_MODE_STORAGE_KEY,
  THEME_STORAGE_KEY,
  defaultMode,
  defaultTheme,
  resolveMode,
  resolveTheme,
  themes,
  type Theme,
  type ThemeMode,
} from "@/lib/themes";
import { paletteOf } from "@/lib/themePalettes";

const MODES: readonly ThemeMode[] = ["auto", "light", "dark"];

function readCookie(name: string): string | undefined {
  return document.cookie.match(new RegExp(`(?:^|; )${name}=([\\w-]+)`))?.[1];
}

/** Choix courant « thème|mode » (une chaîne : instantané stable pour useSyncExternalStore). */
function getChoice(): string {
  if (typeof window === "undefined") return `${defaultTheme}|${defaultMode}`;
  try {
    const storedTheme = readCookie(THEME_COOKIE) || window.localStorage.getItem(THEME_STORAGE_KEY);
    const storedMode = readCookie(THEME_MODE_COOKIE) || window.localStorage.getItem(THEME_MODE_STORAGE_KEY);
    const { theme, mode } = resolveTheme(storedTheme, storedMode);
    return `${theme}|${mode}`;
  } catch {
    return `${defaultTheme}|${defaultMode}`;
  }
}

const listeners = new Set<() => void>();

function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}

function prefersDark(): boolean {
  return typeof window.matchMedia === "function" && window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function applyChoice(theme: Theme, mode: ThemeMode) {
  document.documentElement.setAttribute("data-theme", theme);
  document.documentElement.setAttribute("data-mode", resolveMode(mode, prefersDark()));
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    window.localStorage.setItem(THEME_MODE_STORAGE_KEY, mode);
    const domain = /(^|\.)bobine\.fit$/.test(location.hostname) ? "; domain=.bobine.fit" : "";
    const attributes = `${domain}; path=/; max-age=31536000; samesite=lax${location.protocol === "https:" ? "; secure" : ""}`;
    document.cookie = `${THEME_COOKIE}=${theme}${attributes}`;
    document.cookie = `${THEME_MODE_COOKIE}=${mode}${attributes}`;
  } catch {}
  listeners.forEach((listener) => listener());
}

export default function ThemeSwitcher() {
  const choice = useSyncExternalStore(subscribe, getChoice, () => `${defaultTheme}|${defaultMode}`);
  const [theme, mode] = choice.split("|") as [Theme, ThemeMode];
  const [isOpen, setIsOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const resolved = resolveMode(mode, dark);
  const current = paletteOf(theme, resolved);

  // « Automatique » suit le système : on le relit au montage et à chaque changement.
  useEffect(() => {
    const query = window.matchMedia?.("(prefers-color-scheme: dark)");
    if (!query) return;
    const update = () => {
      setDark(query.matches);
      if (mode === "auto") document.documentElement.setAttribute("data-mode", resolveMode("auto", query.matches));
    };
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, [mode]);

  useEffect(() => {
    if (!isOpen) return;
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) setIsOpen(false);
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setIsOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  function handleCycleTheme(e: React.MouseEvent) {
    e.stopPropagation();
    applyChoice(themes[(themes.indexOf(theme) + 1) % themes.length], mode);
  }

  return (
    <div className="theme-switcher-wrapper" ref={containerRef}>
      <div className="theme-switcher-pill-group">
        <button
          type="button"
          className="theme-switcher-btn"
          onClick={handleCycleTheme}
          title={`Thème actuel : ${THEME_LABELS[theme]}. Cliquez pour passer au thème suivant.`}
          aria-label={`Thème actif : ${THEME_LABELS[theme]}. Cliquez pour passer au thème suivant.`}
        >
          <span className="theme-swatch-icon" style={{ "--swatch-bg": current.bg, "--swatch-accent": current.accent } as CSSProperties} />
          <span className="theme-switcher-btn__label">{THEME_LABELS[theme]}</span>
        </button>

        <button
          type="button"
          className="theme-switcher-arrow-btn"
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen((prev) => !prev);
          }}
          aria-expanded={isOpen}
          aria-haspopup="dialog"
          title={`Ouvrir la liste des ${themes.length} thèmes et choisir le mode`}
          aria-label={`Ouvrir la liste des ${themes.length} thèmes et choisir le mode`}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={`chevron-flip${isOpen ? " is-open" : ""}`}>
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
      </div>

      {isOpen && (
        <div className="theme-dropdown-modal" role="dialog" aria-label="Palette des thèmes">
          {/* Mode : automatique (système), clair ou sombre */}
          <div className="theme-segmented-control" role="tablist" aria-label="Mode">
            {MODES.map((value) => (
              <button
                key={value}
                type="button"
                role="tab"
                aria-selected={mode === value}
                className={`theme-segment-btn ${mode === value ? "is-active" : ""}`}
                onClick={() => applyChoice(theme, value)}
              >
                <span>{MODE_LABELS[value]}</span>
              </button>
            ))}
          </div>

          {/* Les pastilles montrent la palette de chaque thème dans le mode appliqué. */}
          <div className="theme-grid" role="listbox">
            {THEMES.map((option) => {
              const palette = paletteOf(option.id, resolved);
              const isActive = option.id === theme;
              return (
                <button
                  key={option.id}
                  type="button"
                  role="option"
                  aria-selected={isActive}
                  className={`theme-card-option ${isActive ? "is-active" : ""}`}
                  onClick={() => {
                    applyChoice(option.id, mode);
                    setIsOpen(false);
                  }}
                >
                  <div className="theme-card-option__swatch-wrapper">
                    <span className="theme-card-option__swatch" style={{ "--swatch-bg": palette.bg, "--swatch-accent": palette.accent } as CSSProperties} />
                  </div>
                  <div className="theme-card-option__info">
                    <span className="theme-card-option__name">{THEME_LABELS[option.id]}</span>
                  </div>
                  {isActive && (
                    <span className="theme-card-option__check" aria-hidden="true">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
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
