export interface ReleaseChannelInfo {
  version: string;
  /** Commit court (7 car.) vise par le tag mobile d'un canal rolling (Beta/Canary) — absent pour Stable. */
  commit?: string;
  title: string;
  publishedAt: string;
  downloads: {
    windows: string;
    linux: string;
    macos: string;
    android: string;
    androidTv?: string;
    assistant: string;
    installScript: string;
  };
}
