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
  ciel: { label: "Ciel", bg: "#f0f7fc", accent: "#0284c7", isDark: false, desc: "Azur & Océan" },
  menthe: { label: "Menthe", bg: "#f0f9f4", accent: "#059669", isDark: false, desc: "Émeraude & Botanique" },
  lavande: { label: "Lavande", bg: "#f3f4fd", accent: "#4f46e5", isDark: false, desc: "Améthyste & Indigo" },
  aurore: { label: "Aurore", bg: "#fff8f3", accent: "#ea580c", isDark: false, desc: "Ambre Solaire" },
  glacier: { label: "Glacier", bg: "#f0fbfd", accent: "#0891b2", isDark: false, desc: "Givre Polaire" },
  rose: { label: "Rose", bg: "#fdf2f7", accent: "#db2777", isDark: false, desc: "Quartz & Pivoine" },

  // --- Collection Sombre ---
  charbon: { label: "Charbon", bg: "#060708", accent: "#ffffff", isDark: true, desc: "OLED Noir Pur" },
  lune: { label: "Lune", bg: "#090818", accent: "#818cf8", isDark: true, desc: "Indigo Cosmique" },
  hiver: { label: "Hiver", bg: "#040f15", accent: "#06b6d4", isDark: true, desc: "Glacier Boréal" },
  chili: { label: "Chili", bg: "#100305", accent: "#e11d48", isDark: true, desc: "Crimson Rubis" },
  automne: { label: "Automne", bg: "#100a05", accent: "#f59e0b", isDark: true, desc: "Ambre & Cuir" },
  orchidee: { label: "Orchidée", bg: "#120511", accent: "#d946ef", isDark: true, desc: "Cyberpunk Magenta" },
  taupe: { label: "Taupe", bg: "#120f0e", accent: "#d97706", isDark: true, desc: "Espresso & Bronze" },
  foret: { label: "Forêt", bg: "#040f09", accent: "#10b981", isDark: true, desc: "Sapin & Émeraude" },
  abysse: { label: "Abysse", bg: "#030a14", accent: "#38bdf8", isDark: true, desc: "Océan Abyssal" },
};

export const THEME_STORAGE_KEY = "bobineweb-theme";

export function isTheme(value: string): value is Theme {
  return (themes as readonly string[]).includes(value);
}

