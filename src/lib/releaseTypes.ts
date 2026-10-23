export interface ReleaseChannelInfo {
  version: string;
  /** Commit court (7 car.) visé par le tag mobile d'un canal rolling (Beta/Canary) — absent pour Stable. */
  commit?: string;
  title: string;
  publishedAt: string;
  downloads: {
    windows: string;
    windowsArm64?: string;
    linux: string;
    linuxArm64?: string;
    /** Paquets Fedora (.rpm) et Arch Linux (.pkg.tar.zst) : présents seulement une fois publiés dans la release. */
    linuxRpm?: string;
    linuxRpmArm64?: string;
    linuxArch?: string;
    linuxArchArm64?: string;
    macos: string;
    android: string;
    androidTv?: string;
    assistant: string;
    assistantArm64?: string;
    installScript: string;
  };
}
