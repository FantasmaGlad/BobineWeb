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

// Lavande — thème par défaut nacre irisée et améthyste profonde (clair)
export const defaultTheme: Theme = "lavande";

// Table de migration pour les anciennes clés de thèmes BobineWeb
const LEGACY_THEME_MAP: Record<string, Theme> = {
  aurore: "miel",
  glacier: "ciel",
  rose: "clair",
  foret: "menthe",
  abysse: "hiver",
};

export interface ThemeMeta {
  label: string;
  bg: string;
  accent: string;
  isDark: boolean;
  desc?: string;
}

export const themeMeta: Record<Theme, ThemeMeta> = {
  // --- Collection Claire (8 thèmes — Direction artistique Apple.com) ---
  charbon: { label: "Charbon", bg: "#f5f5f7", accent: "#1d1d1f", isDark: false, desc: "Albâtre & Carbone Apple" },
  clair: { label: "Carmin", bg: "#f8f5f6", accent: "#be123c", isDark: false, desc: "Porcelaine & Rubis" },
  miel: { label: "Ambre", bg: "#f8f6f2", accent: "#b45309", isDark: false, desc: "Ivoire & Or Solaire" },
  menthe: { label: "Sauge", bg: "#f4f7f5", accent: "#047857", isDark: false, desc: "Émeraude & Botanique" },
  ciel: { label: "Azur", bg: "#f4f6f9", accent: "#0071e3", isDark: false, desc: "Cristal & Bleu Cupertino" },
  lavande: { label: "Lavande", bg: "#f6f5f9", accent: "#6d28d9", isDark: false, desc: "Nacre & Améthyste" },
  beige: { label: "Sable", bg: "#f7f6f2", accent: "#854d0e", isDark: false, desc: "Lin & Terre Cuite" },
  coco: { label: "Cacao", bg: "#f4f5f7", accent: "#475569", isDark: false, desc: "Cachemire & Ardoise" },

  // --- Collection Sombre (8 thèmes — Contraste franc Apple Pro Dark) ---
  "les-mills-sombre": { label: "Onyx", bg: "#000000", accent: "#e4002b", isDark: true, desc: "Obsidienne & Cinabre" },
  "charbon-sombre": { label: "Graphite", bg: "#050507", accent: "#e5e5ea", isDark: true, desc: "Titane & Acier Brossé" },
  automne: { label: "Cuivre", bg: "#060504", accent: "#ff9f0a", isDark: true, desc: "Basalte & Ambre" },
  hiver: { label: "Abysse", bg: "#040608", accent: "#2997ff", isDark: true, desc: "Fjord & Azur Nocturne" },
  lune: { label: "Indigo", bg: "#050507", accent: "#818cf8", isDark: true, desc: "Nuit & Indigo Stellaire" },
  chili: { label: "Rubis", bg: "#070405", accent: "#ff453a", isDark: true, desc: "Velours & Grenat" },
  orchidee: { label: "Orchidée", bg: "#060408", accent: "#bf5af2", isDark: true, desc: "Nébuleuse & Améthyste" },
  taupe: { label: "Moka", bg: "#040705", accent: "#eab308", isDark: true, desc: "Quartz & Or Champagne" },
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
