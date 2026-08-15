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

// Beige — cohérent avec le choix éditorial du cahier des charges UI/UX,
// distinct du thème sombre par défaut de l'application Bobine elle-même.
export const defaultTheme: Theme = "beige";

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

export const THEME_STORAGE_KEY = "bobineweb-theme";

export function isTheme(value: string): value is Theme {
  return (themes as readonly string[]).includes(value);
}
