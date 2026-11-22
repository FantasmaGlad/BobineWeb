import type { ReleaseChannelInfo } from "@/lib/releaseTypes";

export const PACKAGE_REPOS_LIVE = true;

export type LinuxFamilyId = "debian" | "fedora" | "arch";
export type PackageChannel = "stable" | "beta" | "canary";
export type PackageArch = "x86_64" | "arm64";

export const LINUX_FAMILY_IDS: readonly LinuxFamilyId[] = ["debian", "fedora", "arch"];

export const RELEASES_BASE = "https://github.com/FantasmaGlad/Bobine/releases/download";

export const REPO_HOSTS: Record<LinuxFamilyId, string> = {
  debian: "packages.bobine.fit/debian",
  fedora: "packages.bobine.fit/fedora",
  arch: "packages.bobine.fit/arch",
};

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
  logo: "debian" | "ubuntu" | "fedora" | "arch";
  label: Localized;
  extension: string;
  distros: Localized;
  manager: string;
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

function archToken(family: LinuxFamilyId, arch: PackageArch): string {
  if (family === "debian") return arch === "arm64" ? "arm64" : "amd64";
  return arch === "arm64" ? "aarch64" : "x86_64";
}

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

export function packageUrl(family: LinuxFamilyId, channel: PackageChannel, arch: PackageArch, tag: string): string {
  const fileVersion = channel === "stable" ? tag.replace(/^V/i, "") : channel;
  return `${RELEASES_BASE}/${tag}/${packageFileName(family, channel, arch, fileVersion)}`;
}

type Downloads = ReleaseChannelInfo["downloads"];

export function downloadKey(family: LinuxFamilyId, arch: PackageArch): keyof Downloads {
  if (family === "debian") return arch === "arm64" ? "linuxArm64" : "linux";
  if (family === "fedora") return arch === "arm64" ? "linuxRpmArm64" : "linuxRpm";
  return arch === "arm64" ? "linuxArchArm64" : "linuxArch";
}

export function withoutNewPackages(downloads: Downloads): Downloads {
  return { ...downloads, linuxRpm: undefined, linuxRpmArm64: undefined, linuxArch: undefined, linuxArchArm64: undefined };
}

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

export function fallbackNewPackages(tag: string, channel: PackageChannel): Partial<Downloads> {
  return {
    linuxRpm: packageUrl("fedora", channel, "x86_64", tag),
    linuxRpmArm64: packageUrl("fedora", channel, "arm64", tag),
    linuxArch: packageUrl("arch", channel, "x86_64", tag),
    linuxArchArm64: packageUrl("arch", channel, "arm64", tag),
  };
}

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
  addRepoLegacy: string;
  install: string;
  upgrade: string;
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
  pacmanConf: string;
  install: string;
  upgrade: string;
}

export function archCommands(channel: PackageChannel = "stable"): ArchCommands {
  return {
    importKey: `curl -fsSL ${SIGNING_KEY_URL("arch")} | sudo pacman-key --add -`,
    trustKey: `sudo pacman-key --lsign-key ${SIGNING_KEY_FINGERPRINT_COMPACT}`,
    pacmanConf: ["[bobine]", "SigLevel = Required DatabaseOptional", `Server = ${repoUrl("arch", channel)}`].join("\n"),
    install: "sudo pacman -Syu bobine",
    upgrade: "sudo pacman -Syu",
  };
}

export function aptInstallScript(channel: PackageChannel = "stable"): string {
  return [
    `curl -fsSL ${SIGNING_KEY_URL("debian")} \\`,
    "  | sudo gpg --dearmor -o /etc/apt/keyrings/bobine.gpg",
    `echo "deb [signed-by=/etc/apt/keyrings/bobine.gpg] ${repoUrl("debian")}/ ${channel} main" \\`,
    "  | sudo tee /etc/apt/sources.list.d/bobine.list",
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
