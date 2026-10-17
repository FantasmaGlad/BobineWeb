export const lightThemes = [
  "charbon",
  "clair",
  "miel",
  "menthe",
  "ciel",
  "lavande",
  "beige",
  "coco",
] as const;

export const darkThemes = [
  "les-mills-sombre",
  "charbon-sombre",
  "automne",
  "hiver",
  "lune",
  "chili",
  "orchidee",
  "taupe",
] as const;

export const themes = [...lightThemes, ...darkThemes] as const;

export type Theme = (typeof themes)[number];
export type LightTheme = (typeof lightThemes)[number];
export type DarkTheme = (typeof darkThemes)[number];

// Charbon — thème par défaut épuré noir et blanc (Charbon Clair)
export const defaultTheme: Theme = "charbon";

// Table de migration pour les anciennes clés de thèmes BobineWeb
const LEGACY_THEME_MAP: Record<string, Theme> = {
  aurore: "miel",
  glacier: "ciel",
  rose: "clair",
  foret: "menthe",
  abysse: "hiver",
};

export const themeLabels: Record<Theme, string> = {
  // Thèmes Clairs
  charbon: "Charbon",
  clair: "Carmin",
  miel: "Ambre",
  menthe: "Sauge",
  ciel: "Azur",
  lavande: "Lavande",
  beige: "Sable",
  coco: "Cacao",
  // Thèmes Sombres
  "les-mills-sombre": "Onyx",
  "charbon-sombre": "Graphite",
  automne: "Cuivre",
  hiver: "Abysse",
  lune: "Indigo",
  chili: "Rubis",
  orchidee: "Orchidée",
  taupe: "Moka",
};

export interface ThemeMeta {
  label: string;
  bg: string;
  accent: string;
  isDark: boolean;
  desc?: string;
}

export const themeMeta: Record<Theme, ThemeMeta> = {
  // --- Collection Claire (8 thèmes) ---
  charbon: { label: "Charbon", bg: "#f4f4f5", accent: "#18181b", isDark: false, desc: "Albâtre & Carbone" },
  clair: { label: "Carmin", bg: "#f6f7f9", accent: "#e11d48", isDark: false, desc: "Porcelaine & Rubis" },
  miel: { label: "Ambre", bg: "#faf8f5", accent: "#d97706", isDark: false, desc: "Ivoire & Or Solaire" },
  menthe: { label: "Sauge", bg: "#f4f8f6", accent: "#059669", isDark: false, desc: "Émeraude & Botanique" },
  ciel: { label: "Azur", bg: "#f4f7fb", accent: "#0071e3", isDark: false, desc: "Cristal & Saphir" },
  lavande: { label: "Lavande", bg: "#f7f6fb", accent: "#7c3aed", isDark: false, desc: "Nacre & Améthyste" },
  beige: { label: "Sable", bg: "#f7f5f0", accent: "#9a5b25", isDark: false, desc: "Lin & Terre Cuite" },
  coco: { label: "Cacao", bg: "#f8f5f2", accent: "#7c3a19", isDark: false, desc: "Cachemire & Expresso" },

  // --- Collection Sombre (8 thèmes) ---
  "les-mills-sombre": { label: "Onyx", bg: "#08090b", accent: "#e4002b", isDark: true, desc: "Obsidienne & Cinabre" },
  "charbon-sombre": { label: "Graphite", bg: "#0a0c10", accent: "#e2e8f0", isDark: true, desc: "Titane & Acier Brossé" },
  automne: { label: "Cuivre", bg: "#0b0908", accent: "#f97316", isDark: true, desc: "Basalte & Magma" },
  hiver: { label: "Abysse", bg: "#070b0f", accent: "#06b6d4", isDark: true, desc: "Fjord & Cyan Arctique" },
  lune: { label: "Indigo", bg: "#080911", accent: "#6366f1", isDark: true, desc: "Nuit & Indigo Stellaire" },
  chili: { label: "Rubis", bg: "#0b0809", accent: "#f43f5e", isDark: true, desc: "Velours & Grenat" },
  orchidee: { label: "Orchidée", bg: "#09080d", accent: "#d946ef", isDark: true, desc: "Nébuleuse & Améthyste" },
  taupe: { label: "Moka", bg: "#0b0a09", accent: "#eab308", isDark: true, desc: "Quartz & Or Champagne" },
};

export const THEME_STORAGE_KEY = "bobineweb-theme";

export function isTheme(value: string): value is Theme {
  return (themes as readonly string[]).includes(value);
}

export function resolveTheme(value: string | null | undefined): Theme {
  if (!value) return defaultTheme;
  if (isTheme(value)) return value;
  return LEGACY_THEME_MAP[value] ?? defaultTheme;
}
