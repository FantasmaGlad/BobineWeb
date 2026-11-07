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

export interface DocSubsection {
  subtitle: string;
  paragraphs: string[];
  codeBlock?: string;
}

export interface DocChapter {
  id: string;
  badge: string;
  title: string;
  summary: string;
  icon: DocIconKey;
  subsections: DocSubsection[];
}
