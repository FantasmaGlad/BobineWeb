/**
 * Paquets Linux de Bobine : l'unique endroit où vivent les conventions de nommage des fichiers, les adresses
 * des dépôts, l'empreinte de la clé de signature et les commandes d'installation et de mise à jour des trois
 * familles (Debian et Ubuntu en .deb, Fedora en .rpm, Arch Linux en .pkg.tar.zst). Ces conventions sont celles du
 * dépôt Bobine (workflow de release et dépôts packages.bobine.fit/fedora et packages.bobine.fit/arch) : si l'une change, c'est ce
 * fichier, et lui seul, qu'il faut corriger. Les interfaces (fenêtre de téléchargement, documentation, pages de
 * référencement) n'écrivent jamais un nom de fichier ni une commande de dépôt à la main.
 */
import type { ReleaseChannelInfo } from "@/lib/releaseTypes";

/**
 * Interrupteur unique des dépôts Fedora (dnf) et Arch (pacman). Faux tant que packages.bobine.fit/fedora et packages.bobine.fit/arch ne
 * sont pas en ligne et que les paquets ne sont pas publiés dans les releases : le site affiche alors « Bientôt »,
 * sans lien cliquable, et présente les commandes comme valables « dès la mise en ligne des dépôts ». Passer à
 * `true` active d'un coup la fenêtre de téléchargement, la documentation et les pages de référencement.
 * `scripts/ci/check-release-sync.sh` lit cette ligne : à `true`, les paquets doivent exister dans les trois canaux.
 */
export const PACKAGE_REPOS_LIVE = true;

export type LinuxFamilyId = "debian" | "fedora" | "arch";
export type PackageChannel = "stable" | "beta" | "canary";
export type PackageArch = "x86_64" | "arm64";

export const LINUX_FAMILY_IDS: readonly LinuxFamilyId[] = ["debian", "fedora", "arch"];
export const PACKAGE_CHANNELS: readonly PackageChannel[] = ["stable", "beta", "canary"];

export const RELEASES_BASE = "https://github.com/FantasmaGlad/Bobine/releases/download";

/** Hôtes des dépôts unifiés sous packages.bobine.fit : .deb (APT), .rpm (DNF) et .pkg.tar.zst (pacman). */
export const REPO_HOSTS: Record<LinuxFamilyId, string> = {
  debian: "packages.bobine.fit/debian",
  fedora: "packages.bobine.fit/fedora",
  arch: "packages.bobine.fit/arch",
};

/** Clé de signature commune aux trois dépôts. */
export const SIGNING_KEY_FINGERPRINT = "B77D 96D7 2F84 F36A CAA3 F872 9CBF 497D 829E E15A";
export const SIGNING_KEY_FINGERPRINT_COMPACT = SIGNING_KEY_FINGERPRINT.replace(/\s+/g, "");
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const SIGNING_KEY_URL = (_family?: LinuxFamilyId) => "https://packages.bobine.fit/bobine.gpg";

interface Localized {
  fr: string;
  en: string;
}

export interface LinuxFamily {
  id: LinuxFamilyId;
  /** Identifiant du logo dans le registre des icônes (`distro.<logo>` de src/lib/assets.ts). */
  logo: "debian" | "ubuntu" | "fedora" | "arch";
  /** Libellé court du sélecteur. */
  label: Localized;
  /** Extension du paquet. */
  extension: string;
  /** Distributions concernées, une phrase. */
  distros: Localized;
  /** Gestionnaire de paquets. */
  manager: string;
  /** Vrai quand les paquets et le dépôt sont réellement en ligne. */
  live: boolean;
}

export const LINUX_FAMILIES: Record<LinuxFamilyId, LinuxFamily> = {
  debian: {
    id: "debian",
    logo: "debian",
    label: { fr: "Debian / Ubuntu", en: "Debian / Ubuntu" },
    extension: ".deb",
    distros: { fr: "Debian, Ubuntu, Linux Mint, Pop!_OS, Zorin OS", en: "Debian, Ubuntu, Linux Mint, Pop!_OS, Zorin OS" },
    manager: "apt",
    live: true,
  },
  fedora: {
    id: "fedora",
    logo: "fedora",
    label: { fr: "Fedora", en: "Fedora" },
    extension: ".rpm",
    distros: { fr: "Fedora, Nobara, RHEL, AlmaLinux, Rocky Linux", en: "Fedora, Nobara, RHEL, AlmaLinux, Rocky Linux" },
    manager: "dnf",
    live: PACKAGE_REPOS_LIVE,
  },
  arch: {
    id: "arch",
    logo: "arch",
    label: { fr: "Arch Linux", en: "Arch Linux" },
    extension: ".pkg.tar.zst",
    distros: { fr: "Arch Linux, EndeavourOS, CachyOS, Manjaro", en: "Arch Linux, EndeavourOS, CachyOS, Manjaro" },
    manager: "pacman",
    live: PACKAGE_REPOS_LIVE,
  },
};

/** Dérivés et limites de chaque famille, partagés par la documentation, la page Linux et la FAQ. */
export const FAMILY_NOTES: Record<"fedora" | "arch", { derivatives: Localized[]; limits: Localized[] }> = {
  fedora: {
    derivatives: [
      { fr: "Fedora Workstation et Server : cible principale.", en: "Fedora Workstation and Server: the main target." },
      { fr: "Nobara : même base Fedora, mêmes paquets.", en: "Nobara: same Fedora base, same packages." },
      {
        fr: "RHEL, AlmaLinux et Rocky Linux : installation via EPEL, avec un ffmpeg limité tant que RPM Fusion n'est pas ajouté.",
        en: "RHEL, AlmaLinux and Rocky Linux: install through EPEL, with a limited ffmpeg until RPM Fusion is added.",
      },
    ],
    limits: [
      {
        fr: "Fedora fournit un ffmpeg amputé de plusieurs codecs (ffmpeg-free) : pour lire tous les formats de cours, installez le ffmpeg complet de RPM Fusion.",
        en: "Fedora ships a ffmpeg stripped of several codecs (ffmpeg-free): to play every class format, install the full ffmpeg from RPM Fusion.",
      },
      {
        fr: "Les distributions immuables (Bazzite, Silverblue, Kinoite) ne conviennent pas à l'appliance kiosque : le système y est en lecture seule.",
        en: "Immutable distributions (Bazzite, Silverblue, Kinoite) do not suit the kiosk appliance: the system is read-only there.",
      },
    ],
  },
  arch: {
    derivatives: [
      { fr: "Arch Linux, EndeavourOS et CachyOS : cibles principales (x86_64).", en: "Arch Linux, EndeavourOS and CachyOS: the main targets (x86_64)." },
      {
        fr: "Manjaro : ses dépôts sont décalés de ceux d'Arch, donc des dépendances peuvent manquer ou différer ; installation à vos risques.",
        en: "Manjaro: its repositories lag behind Arch's, so dependencies may be missing or differ; install at your own risk.",
      },
      { fr: "Arch Linux ARM (aarch64) : voie prévue pour l'ARM64, pas encore essayée.", en: "Arch Linux ARM (aarch64): the intended route for ARM64, not yet tried." },
    ],
    limits: [
      {
        fr: "Évitez d'ajouter le dépôt sur un système qui n'est pas à jour : sur Arch, un paquet se met à jour avec tout le système (pacman -Syu), jamais seul.",
        en: "Do not add the repository on a system that is not up to date: on Arch a package is updated together with the whole system (pacman -Syu), never alone.",
      },
    ],
  },
};

/** Statut de validation affiché tant qu'aucune machine Fedora ou Arch n'a servi d'essai. */
export const NOT_VALIDATED_NOTE: Localized = {
  fr: "Ces paquets sont nouveaux : les commandes suivent les conventions de chaque famille, mais elles n'ont pas encore été validées sur une machine Fedora ou Arch.",
  en: "These packages are new: the commands follow each family's conventions, but they have not yet been validated on a Fedora or Arch machine.",
};

/** Mention affichée à côté des commandes Fedora et Arch tant que l'interrupteur est faux. */
export const REPOS_SOON_NOTE: Localized = {
  fr: "Ce dépôt est temporairement indisponible. Consultez packages.bobine.fit pour connaître les canaux disponibles.",
  en: "This repository is temporarily unavailable. Check packages.bobine.fit for available channels.",
};

/** Phrase de statut d'une famille pour une langue : vide quand son dépôt est réellement en ligne. */
export function repoStatusNote(family: LinuxFamilyId, locale: "fr" | "en"): string {
  return isFamilyLive(family) ? "" : REPOS_SOON_NOTE[locale];
}

export const isFamilyLive = (family: LinuxFamilyId): boolean => LINUX_FAMILIES[family].live;

// --- Noms de fichiers et adresses de téléchargement -----------------------------------------------------------

/** Architecture telle que l'écrit chaque famille dans le nom du fichier. */
function archToken(family: LinuxFamilyId, arch: PackageArch): string {
  if (family === "debian") return arch === "arm64" ? "arm64" : "amd64";
  return arch === "arm64" ? "aarch64" : "x86_64";
}

/**
 * Nom du fichier publié dans les releases GitHub. `fileVersion` est le fragment de version sans « V » (5.0.2) pour
 * la Stable ; Bêta et Canary sont des canaux glissants à nom fixe (`beta`, `canary`).
 *   .deb      bobine_5.0.2_amd64.deb              bobine_beta_amd64.deb
 *   .rpm      bobine-5.0.2-1.x86_64.rpm           bobine-beta.x86_64.rpm
 *   Arch      bobine-5.0.2-1-x86_64.pkg.tar.zst   bobine-beta-x86_64.pkg.tar.zst
 */
export function packageFileName(family: LinuxFamilyId, channel: PackageChannel, arch: PackageArch, fileVersion: string): string {
  const a = archToken(family, arch);
  const v = channel === "stable" ? fileVersion : channel;
  switch (family) {
    case "debian":
      return `bobine_${v}_${a}.deb`;
    case "fedora":
      return channel === "stable" ? `bobine-${v}-1.${a}.rpm` : `bobine-${v}.${a}.rpm`;
    case "arch":
      return channel === "stable" ? `bobine-${v}-1-${a}.pkg.tar.zst` : `bobine-${v}-${a}.pkg.tar.zst`;
  }
}

/** Adresse de téléchargement d'un paquet : `tag` est le tag GitHub (V5.0.2, beta ou canary). */
export function packageUrl(family: LinuxFamilyId, channel: PackageChannel, arch: PackageArch, tag: string): string {
  const fileVersion = channel === "stable" ? tag.replace(/^V/i, "") : channel;
  return `${RELEASES_BASE}/${tag}/${packageFileName(family, channel, arch, fileVersion)}`;
}

type Downloads = ReleaseChannelInfo["downloads"];

/** Champ de `downloads` qui porte le paquet d'une famille et d'une architecture. */
export function downloadKey(family: LinuxFamilyId, arch: PackageArch): keyof Downloads {
  if (family === "debian") return arch === "arm64" ? "linuxArm64" : "linux";
  if (family === "fedora") return arch === "arm64" ? "linuxRpmArm64" : "linuxRpm";
  return arch === "arm64" ? "linuxArchArm64" : "linuxArch";
}

/**
 * Lien du paquet pour un canal, ou `undefined` quand il ne doit pas être proposé : famille pas encore en ligne
 * (interrupteur faux) ou fichier absent de la release. L'interface affiche alors « Bientôt », jamais un lien mort.
 */
export function packageLink(downloads: Downloads, family: LinuxFamilyId, arch: PackageArch): string | undefined {
  if (!isFamilyLive(family)) return undefined;
  return downloads[downloadKey(family, arch)] || undefined;
}

/** Retire des liens de repli les paquets Fedora et Arch : une release lue sur GitHub n'a que ce qu'elle contient. */
export function withoutNewPackages(downloads: Downloads): Downloads {
  return { ...downloads, linuxRpm: undefined, linuxRpmArm64: undefined, linuxArch: undefined, linuxArchArm64: undefined };
}

/** Range un fichier de release dans le bon champ de `downloads` ; renvoie faux si ce n'est pas un de nos paquets. */
export function assignPackageAsset(downloads: Downloads, name: string, url: string): boolean {
  const lower = name.toLowerCase();
  const isArm = lower.includes("aarch64") || lower.includes("arm64");
  if (lower.endsWith(".rpm")) {
    if (isArm) downloads.linuxRpmArm64 = url;
    else downloads.linuxRpm = url;
    return true;
  }
  if (lower.endsWith(".pkg.tar.zst")) {
    if (isArm) downloads.linuxArchArm64 = url;
    else downloads.linuxArch = url;
    return true;
  }
  return false;
}

/** Liens de repli Fedora et Arch d'un canal, pour `releaseFallbacks.ts`. */
export function fallbackNewPackages(tag: string, channel: PackageChannel): Partial<Downloads> {
  return {
    linuxRpm: packageUrl("fedora", channel, "x86_64", tag),
    linuxRpmArm64: packageUrl("fedora", channel, "arm64", tag),
    linuxArch: packageUrl("arch", channel, "x86_64", tag),
    linuxArchArm64: packageUrl("arch", channel, "arm64", tag),
  };
}

// --- Dépôts, installation et mise à jour -------------------------------------------------------------------------

/** Adresse publique de chaque dépôt (page d'accueil ou fichier de définition du canal). */
export function repoUrl(family: LinuxFamilyId, channel: PackageChannel = "stable"): string {
  switch (family) {
    case "debian":
      return `https://${REPO_HOSTS.debian}`;
    case "fedora":
      return `https://${REPO_HOSTS.fedora}/bobine-${channel}.repo`;
    case "arch":
      return `https://${REPO_HOSTS.arch}/${channel}/$arch`;
  }
}

export interface FedoraCommands {
  addRepo: string;
  /** dnf 4 (RHEL, AlmaLinux, Rocky Linux) : l'extension s'appelle autrement. */
  addRepoLegacy: string;
  install: string;
  upgrade: string;
  /** ffmpeg complet via RPM Fusion. */
  ffmpeg: string;
}

export function fedoraCommands(channel: PackageChannel = "stable"): FedoraCommands {
  const repoFile = repoUrl("fedora", channel);
  return {
    addRepo: `sudo dnf config-manager addrepo --from-repofile=${repoFile}`,
    addRepoLegacy: `sudo dnf config-manager --add-repo ${repoFile}`,
    install: "sudo dnf install bobine",
    upgrade: "sudo dnf upgrade",
    ffmpeg: [
      "sudo dnf install https://mirrors.rpmfusion.org/free/fedora/rpmfusion-free-release-$(rpm -E %fedora).noarch.rpm",
      "sudo dnf swap ffmpeg-free ffmpeg --allowerasing",
    ].join("\n"),
  };
}

export interface ArchCommands {
  importKey: string;
  trustKey: string;
  /** Section à ajouter à /etc/pacman.conf, avant les dépôts officiels si l'on veut les masquer, après sinon. */
  pacmanConf: string;
  install: string;
  upgrade: string;
}

export function archCommands(channel: PackageChannel = "stable"): ArchCommands {
  return {
    importKey: `curl -fsSL ${SIGNING_KEY_URL("arch")} | sudo pacman-key --add -`,
    trustKey: `sudo pacman-key --lsign-key ${SIGNING_KEY_FINGERPRINT_COMPACT}`,
    pacmanConf: ["[bobine]", "SigLevel = Required DatabaseOptional", `Server = ${repoUrl("arch", channel)}`].join("\n"),
    // -Syu et non -S : synchroniser les index sans mettre le système à jour est un état non pris en charge sur Arch.
    install: "sudo pacman -Syu bobine",
    upgrade: "sudo pacman -Syu",
  };
}

/** Commande qui affiche l'empreinte de la clé publiée, à comparer à `SIGNING_KEY_FINGERPRINT` avant de l'approuver. */
export function keyCheckCommand(family: LinuxFamilyId): string {
  return `curl -fsSL ${SIGNING_KEY_URL(family)} | gpg --show-keys --fingerprint`;
}

/** Commande de mise à jour de chaque famille (avec le reste du système). */
export function updateCommand(family: LinuxFamilyId): string {
  if (family === "debian") return "sudo apt update && sudo apt upgrade";
  return family === "fedora" ? fedoraCommands().upgrade : archCommands().upgrade;
}

/** Fichier brut des commandes, d'une seule pièce, pour les boutons « Copier » et les fichiers de référencement. */
/** Source APT du .deb (déjà en ligne) : clé, source signée, installation. */
export function aptInstallScript(channel: PackageChannel = "stable"): string {
  return [
    `curl -fsSL ${SIGNING_KEY_URL("debian")} | sudo gpg --dearmor -o /etc/apt/keyrings/bobine.gpg`,
    `echo "deb [signed-by=/etc/apt/keyrings/bobine.gpg] ${repoUrl("debian")}/ ${channel} main" | sudo tee /etc/apt/sources.list.d/bobine.list`,
    "sudo apt update && sudo apt install bobine",
  ].join("\n");
}

export function fedoraInstallScript(channel: PackageChannel = "stable"): string {
  const c = fedoraCommands(channel);
  return [c.addRepo, c.install].join("\n");
}

export function archInstallScript(channel: PackageChannel = "stable"): string {
  const c = archCommands(channel);
  return [c.importKey, c.trustKey, `sudo tee -a /etc/pacman.conf <<'EOF'\n\n${c.pacmanConf}\nEOF`, c.install].join("\n");
}

/**
 * Formats de paquets Linux publiés, en une phrase, pour les listes de plateformes : n'annonce Fedora et Arch que
 * lorsque leurs dépôts sont en ligne, sinon les donne comme à venir.
 */
export function linuxFormatsSummary(locale: "fr" | "en"): string {
  if (PACKAGE_REPOS_LIVE) {
    return locale === "fr"
      ? "Linux : .deb (Debian, Ubuntu, Mint), .rpm (Fedora et dérivés) et paquet pacman (Arch Linux et dérivés), en x86-64 et ARM64"
      : "Linux: .deb (Debian, Ubuntu, Mint), .rpm (Fedora and derivatives) and pacman package (Arch Linux and derivatives), on x86-64 and ARM64";
  }
  return locale === "fr"
    ? "Linux : .deb (Debian, Ubuntu, Mint) en x86-64 et ARM64 ; paquets Fedora (.rpm) et Arch Linux (pacman) bientôt"
    : "Linux: .deb (Debian, Ubuntu, Mint) on x86-64 and ARM64; Fedora (.rpm) and Arch Linux (pacman) packages coming soon";
}

/** Version très courte pour une énumération de fichiers : « Linux (.deb, .rpm, pacman) ». */
export function linuxFormatsShort(locale: "fr" | "en"): string {
  if (PACKAGE_REPOS_LIVE) return "Linux (.deb amd64/arm64, .rpm x86_64/aarch64, pacman x86_64/aarch64)";
  return locale === "fr"
    ? "Linux (.deb amd64 et arm64 ; .rpm et pacman bientôt)"
    : "Linux (.deb amd64 and arm64; .rpm and pacman coming soon)";
}

/** Noms de fichiers à nom fixe d'un canal glissant, Fedora et Arch compris dès que leurs dépôts sont en ligne. */
export function slidingChannelPackageNames(channel: "beta" | "canary"): string[] {
  const names = [packageFileName("debian", channel, "x86_64", channel)];
  if (PACKAGE_REPOS_LIVE) {
    names.push(packageFileName("fedora", channel, "x86_64", channel), packageFileName("arch", channel, "x86_64", channel));
  }
  return names;
}
