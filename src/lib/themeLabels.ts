// Noms affichés et anciennes clés du sélecteur de thèmes. Aucune importation : le module est aussi chargé tel quel par les scripts Node.
import type { ThemeId, ThemeMode } from "./themePalettes.ts";

// Clés d'avant l'alignement sur l'application (elles désignaient déjà un ancien thème de 15).
export const OLDER_SITE_KEYS: Record<string, string> = { aurore: "miel", glacier: "ciel", rose: "clair", abysse: "hiver" };

/** Noms affichés (français, comme le reste du sélecteur). */
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
