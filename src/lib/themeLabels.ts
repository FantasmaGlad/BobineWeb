import type { ThemeId, ThemeMode } from "./themePalettes.ts";

export const OLDER_SITE_KEYS: Record<string, string> = { aurore: "miel", glacier: "ciel", rose: "clair", abysse: "hiver" };

export const THEME_LABELS: Record<ThemeId, string> = {
  ardoise: "Ardoise",
  chili: "Chili",
  canary: "Canary",
  "rose-vif": "Rose vif",
  charbon: "Charbon",
  orchidee: "Orchidée",
  foret: "Forêt",
  ocean: "Océan",
  pumpkin: "Citrouille",
};

export const MODE_LABELS: Record<ThemeMode, string> = { auto: "Automatique", light: "Clair", dark: "Sombre" };
