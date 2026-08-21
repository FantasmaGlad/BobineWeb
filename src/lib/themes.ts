export const lightThemes = [
  "clair",
  "beige",
  "ciel",
  "menthe",
  "lavande",
  "aurore",
  "glacier",
  "rose",
] as const;

export const darkThemes = [
  "sombre",
  "charbon",
  "lune",
  "hiver",
  "chili",
  "automne",
  "orchidee",
  "taupe",
  "foret",
  "abysse",
] as const;

export const themes = [...lightThemes, ...darkThemes] as const;

export type Theme = (typeof themes)[number];
export type LightTheme = (typeof lightThemes)[number];
export type DarkTheme = (typeof darkThemes)[number];

// Clair — thème par défaut épuré noir et blanc
export const defaultTheme: Theme = "clair";

export const themeLabels: Record<Theme, string> = {
  // Thèmes Clairs
  clair: "Clair",
  beige: "Beige",
  ciel: "Ciel",
  menthe: "Menthe",
  lavande: "Lavande",
  aurore: "Aurore",
  glacier: "Glacier",
  rose: "Rose",
  // Thèmes Sombres
  sombre: "Sombre",
  charbon: "Charbon",
  lune: "Lune",
  hiver: "Hiver",
  chili: "Chili",
  automne: "Automne",
  orchidee: "Orchidée",
  taupe: "Taupe",
  foret: "Forêt",
  abysse: "Abysse",
};

export interface ThemeMeta {
  label: string;
  bg: string;
  accent: string;
  isDark: boolean;
  desc?: string;
}

export const themeMeta: Record<Theme, ThemeMeta> = {
  // --- Collection Claire ---
  clair: { label: "Clair", bg: "#f8fafc", accent: "#0f172a", isDark: false, desc: "Albâtre & Ardoise" },
  beige: { label: "Beige", bg: "#ede8d0", accent: "#372528", isDark: false, desc: "Sable & Moka" },
  ciel: { label: "Ciel", bg: "#e0f2fe", accent: "#0284c7", isDark: false, desc: "Azur & Océan" },
  menthe: { label: "Menthe", bg: "#f0fdf4", accent: "#16a34a", isDark: false, desc: "Émeraude & Botanique" },
  lavande: { label: "Lavande", bg: "#eef2ff", accent: "#6366f1", isDark: false, desc: "Améthyste & Indigo" },
  aurore: { label: "Aurore", bg: "#fff7ed", accent: "#ea580c", isDark: false, desc: "Ambre Solaire" },
  glacier: { label: "Glacier", bg: "#ecfeff", accent: "#0891b2", isDark: false, desc: "Givre Polaire" },
  rose: { label: "Rose", bg: "#fdf2f8", accent: "#db2777", isDark: false, desc: "Quartz & Pivoine" },

  // --- Collection Sombre ---
  sombre: { label: "Sombre", bg: "#0d0f12", accent: "#f8fafc", isDark: true, desc: "Studio & Titane" },
  charbon: { label: "Charbon", bg: "#08090a", accent: "#ffffff", isDark: true, desc: "OLED Noir Pur" },
  lune: { label: "Lune", bg: "#0d0c22", accent: "#818cf8", isDark: true, desc: "Indigo Cosmique" },
  hiver: { label: "Hiver", bg: "#06151c", accent: "#06b6d4", isDark: true, desc: "Glacier Boréal" },
  chili: { label: "Chili", bg: "#160305", accent: "#ef4444", isDark: true, desc: "Crimson Rubis" },
  automne: { label: "Automne", bg: "#161009", accent: "#f59e0b", isDark: true, desc: "Ambre & Cuir" },
  orchidee: { label: "Orchidée", bg: "#1c0b1a", accent: "#d946ef", isDark: true, desc: "Cyberpunk Magenta" },
  taupe: { label: "Taupe", bg: "#1a1715", accent: "#d97706", isDark: true, desc: "Espresso & Bronze" },
  foret: { label: "Forêt", bg: "#05150d", accent: "#10b981", isDark: true, desc: "Sapin & Émeraude" },
  abysse: { label: "Abysse", bg: "#040d1a", accent: "#38bdf8", isDark: true, desc: "Océan Abyssal" },
};

export const THEME_STORAGE_KEY = "bobineweb-theme";

export function isTheme(value: string): value is Theme {
  return (themes as readonly string[]).includes(value);
}

