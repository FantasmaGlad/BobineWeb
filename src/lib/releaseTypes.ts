export interface ReleaseChannelInfo {
  version: string;
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
