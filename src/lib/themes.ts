import {
  DEFAULT_MODE,
  DEFAULT_THEME,
  LEGACY_THEMES,
  THEMES,
  THEME_IDS,
  isThemeMode,
  resolveMode,
  resolveStored,
  type ResolvedMode,
  type ThemeId,
  type ThemeMode,
} from "./themePalettes";

import { MODE_LABELS, OLDER_SITE_KEYS, THEME_LABELS } from "./themeLabels";
export { MODE_LABELS, OLDER_SITE_KEYS, THEME_LABELS };

export type Theme = ThemeId;
export type { ResolvedMode, ThemeMode };
export { DEFAULT_MODE, DEFAULT_THEME, LEGACY_THEMES, THEMES, THEME_IDS, isThemeMode, resolveMode };

export const themes: readonly Theme[] = THEME_IDS;
export const defaultTheme: Theme = DEFAULT_THEME;
export const defaultMode: ThemeMode = DEFAULT_MODE;

export const THEME_STORAGE_KEY = "bobineweb-theme";
export const THEME_MODE_STORAGE_KEY = "bobineweb-theme-mode";
export const THEME_COOKIE = "bobine-theme";
export const THEME_MODE_COOKIE = "bobine-theme-mode";

export function resolveTheme(value: string | null | undefined, mode?: string | null): { theme: Theme; mode: ThemeMode } {
  const key = value ? (OLDER_SITE_KEYS[value] ?? value) : null;
  return resolveStored(key, mode);
}

export const THEME_INIT_SNIPPET =
  `var ids=${JSON.stringify(THEME_IDS)},lg=${JSON.stringify(LEGACY_THEMES)},ol=${JSON.stringify(OLDER_SITE_KEYS)};` +
  `function ck(n){var c=document.cookie.match(new RegExp('(?:^|; )'+n+'=([\\\\w-]+)'));return c&&c[1];}` +
  `var t=ck(${JSON.stringify(THEME_COOKIE)})||localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)}),` +
  `m=ck(${JSON.stringify(THEME_MODE_COOKIE)})||localStorage.getItem(${JSON.stringify(THEME_MODE_STORAGE_KEY)});` +
  `if(t&&ol[t])t=ol[t];var l=t&&lg[t];` +
  `if(l&&(ids.indexOf(t)<0||(m!=='light'&&m!=='dark'&&m!=='auto'))){t=l.theme;m=(m==='light'||m==='dark')?m:l.mode;}` +
  `if(ids.indexOf(t)<0)t=${JSON.stringify(DEFAULT_THEME)};` +
  `if(m!=='light'&&m!=='dark'&&m!=='auto')m=${JSON.stringify(DEFAULT_MODE)};` +
  `if(m==='auto')m=window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';` +
  `document.documentElement.setAttribute('data-theme',t);document.documentElement.setAttribute('data-mode',m);`;
