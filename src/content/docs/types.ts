export type DocIconKey =
  | "manifesto"
  | "install"
  | "play"
  | "features"
  | "help"
  | "code"
  | "roadmap"
  | "server"
  | "database"
  | "film"
  | "terminal"
  | "tv"
  | "smartphone"
  | "tablet";

export interface TechChip {
  icon: DocIconKey;
  label: string;
}

export type DeviceImageKey = "windows" | "macos" | "linux" | "android";

export interface DocSubsection {
  subtitle: string;
  paragraphs: string[];
  codeBlock?: string;
  techChips?: TechChip[];
  /** Photo d'appareil réel, utilisée uniquement par le générateur PDF (illustration). */
  deviceImage?: DeviceImageKey;
}

export interface DocChapter {
  id: string;
  badge: string;
  title: string;
  summary: string;
  icon: DocIconKey;
  subsections: DocSubsection[];
}

export interface RoadmapPlatform {
  id: string;
  label: string;
  status: string;
  title: string;
  paragraphs: string[];
}
