/** Fichier d'une release GitHub : taille et empreinte SHA-256 telles que l'API les publie (jamais inventées). */
export interface ReleaseFile {
  name: string;
  url: string;
  size: number;
  /** Empreinte SHA-256 en hexadécimal, issue du champ `digest` de l'API GitHub. */
  sha256?: string;
  updatedAt?: string;
}

export interface ReleaseChannelInfo {
  version: string;
  /** Commit court (7 car.) visé par le tag mobile d'un canal rolling (Beta/Canary) — absent pour Stable. */
  commit?: string;
  title: string;
  publishedAt: string;
  /** Page de la release sur GitHub (notes de version). */
  htmlUrl?: string;
  /** Fichiers de la release, par adresse de téléchargement ; absent quand les valeurs viennent du repli statique. */
  files?: Record<string, ReleaseFile>;
  /** Vrai quand la release joint SHA256SUMS et sa signature SHA256SUMS.asc. */
  checksumsSigned?: boolean;
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
