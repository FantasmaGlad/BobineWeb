export const themes = [
  "beige",
  "sombre",
  "clair",
  "lune",
  "menthe",
  "automne",
  "hiver",
  "chili",
  "ciel",
  "orchidee",
  "taupe",
  "charbon",
  "lavande",
] as const;

export type Theme = (typeof themes)[number];

// Lavande — thème par défaut du site vitrine
export const defaultTheme: Theme = "lavande";

export const themeLabels: Record<Theme, string> = {
  beige: "Beige",
  sombre: "Sombre",
  clair: "Clair",
  lune: "Lune",
  menthe: "Menthe",
  automne: "Automne",
  hiver: "Hiver",
  chili: "Chili",
  ciel: "Ciel",
  orchidee: "Orchidée",
  taupe: "Taupe",
  charbon: "Charbon",
  lavande: "Lavande",
};

export interface ThemeMeta {
  label: string;
  bg: string;
  accent: string;
  isDark: boolean;
}

export const themeMeta: Record<Theme, ThemeMeta> = {
  beige: { label: "Beige", bg: "#ede8d0", accent: "#372528", isDark: false },
  sombre: { label: "Sombre", bg: "#0d0f12", accent: "#f8fafc", isDark: true },
  clair: { label: "Clair", bg: "#f8fafc", accent: "#0f172a", isDark: false },
  lune: { label: "Lune", bg: "#0f0e26", accent: "#818cf8", isDark: true },
  menthe: { label: "Menthe", bg: "#f0fdf4", accent: "#16a34a", isDark: false },
  automne: { label: "Automne", bg: "#18120c", accent: "#f59e0b", isDark: true },
  hiver: { label: "Hiver", bg: "#081a24", accent: "#06b6d4", isDark: true },
  chili: { label: "Chili", bg: "#180406", accent: "#ef4444", isDark: true },
  ciel: { label: "Ciel", bg: "#e0f2fe", accent: "#0284c7", isDark: false },
  orchidee: { label: "Orchidée", bg: "#200d1e", accent: "#d946ef", isDark: true },
  taupe: { label: "Taupe", bg: "#1c1917", accent: "#d97706", isDark: true },
  charbon: { label: "Charbon", bg: "#101114", accent: "#ffffff", isDark: true },
  lavande: { label: "Lavande", bg: "#eef2ff", accent: "#6366f1", isDark: false },
};


export const THEME_STORAGE_KEY = "bobineweb-theme";

export function isTheme(value: string): value is Theme {
  return (themes as readonly string[]).includes(value);
}

