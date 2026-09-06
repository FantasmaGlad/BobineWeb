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

export interface DocSubsection {
  subtitle: string;
  paragraphs: string[];
  codeBlock?: string;
  techChips?: TechChip[];
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
