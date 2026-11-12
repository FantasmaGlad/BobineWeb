export interface ReleaseFile {
  name: string;
  url: string;
  size: number;
  sha256?: string;
  updatedAt?: string;
}

export interface DeployPackages {
  version: string;
  htmlUrl: string;
  windows?: string;
  windowsArm64?: string;
  macos?: string;
  macosArm64?: string;
  deb?: string;
  debArm64?: string;
  rpm?: string;
  rpmArm64?: string;
}

export interface ReleaseChannelInfo {
  version: string;
  commit?: string;
  title: string;
  publishedAt: string;
  htmlUrl?: string;
  files?: Record<string, ReleaseFile>;
  checksumsSigned?: boolean;
  downloads: {
    windows: string;
    windowsArm64?: string;
    linux: string;
    linuxArm64?: string;
    linuxRpm?: string;
    linuxRpmArm64?: string;
    linuxArch?: string;
    linuxArchArm64?: string;
    macos: string;
    android: string;
    androidTv?: string;
    installScript: string;
  };
}
