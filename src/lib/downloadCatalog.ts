/**
 * Catalogue de téléchargement : pour une plateforme, une architecture, une famille Linux et un canal, quel fichier de
 * quelle release proposer, sous quel nom, avec quelle taille et quelle empreinte. Source unique de la fenêtre de
 * téléchargement ; aucune valeur n'est inventée : taille et empreinte viennent de l'API GitHub et sont absentes du
 * repli statique.
 */
import type { Locale } from "@/lib/i18n";
import type { ReleaseChannelInfo, ReleaseFile } from "@/lib/releaseTypes";
import { ANDROID, REQUIREMENTS } from "@/lib/productFacts";
import {
  LINUX_FAMILIES,
  downloadKey,
  packageFileName,
  packageUrl,
  type LinuxFamilyId,
  type PackageChannel,
} from "@/lib/linuxPackages";

export type DownloadPlatform = "windows" | "macos" | "linux" | "android" | "android-tv" | "cli" | "tauri" | "assistant";
export type CpuArchitecture = "x86_64" | "arm64";

export const SIGNING_KEY_HELP = "B77D 96D7 2F84 F36A CAA3 F872 9CBF 497D 829E E15A";

export interface DownloadRequest {
  locale: Locale;
  platform: DownloadPlatform;
  arch: CpuArchitecture;
  family: LinuxFamilyId;
  channel: PackageChannel;
  stable: ReleaseChannelInfo;
  beta: ReleaseChannelInfo;
  canary: ReleaseChannelInfo;
}

export interface ResolvedDownload {
  /** Plateforme affichée dans le titre (« Windows », « Linux (Debian, Ubuntu) »...). */
  heading: string;
  /** Systèmes visés, tels qu'ils sont décrits dans le produit (jamais une validation sur matériel). */
  targets: string;
  /** Configuration requise, depuis les faits produit. */
  requirements?: string;
  format: string;
  channel: PackageChannel;
  version: string;
  releaseUrl: string;
  publishedAt?: string;
  url?: string;
  filename?: string;
  file?: ReleaseFile;
  /** Commande unique (appliance) à la place d'un fichier. */
  command?: string;
  /** Vrai quand la release joint SHA256SUMS et sa signature. */
  checksumsSigned: boolean;
}

const RELEASES_PAGE = "https://github.com/FantasmaGlad/Bobine/releases";

function channelInfo(req: DownloadRequest): ReleaseChannelInfo {
  return req.channel === "stable" ? req.stable : req.channel === "beta" ? req.beta : req.canary;
}

/** Octets lisibles (Mo ou Go), ou chaîne vide quand la taille est inconnue. */
export function formatSize(bytes: number | undefined, locale: Locale): string {
  if (!bytes || bytes <= 0) return "";
  const mb = bytes / (1024 * 1024);
  const value = mb >= 1024 ? mb / 1024 : mb;
  const unit = mb >= 1024 ? (locale === "en" ? "GB" : "Go") : locale === "en" ? "MB" : "Mo";
  return `${value.toLocaleString(locale === "en" ? "en-US" : "fr-FR", { maximumFractionDigits: value >= 100 ? 0 : 1 })} ${unit}`;
}

export function resolveDownload(req: DownloadRequest): ResolvedDownload {
  const isEn = req.locale === "en";
  const info = channelInfo(req);
  const tag = info.version;
  const fileVersion = req.channel === "stable" ? tag.replace(/^V/i, "") : req.channel;
  const isArm = req.arch === "arm64";
  const d = info.downloads;

  let url: string | undefined;
  let filename: string | undefined;
  let heading: string;
  let targets: string;
  let requirements: string | undefined;
  let format: string;
  let command: string | undefined;

  switch (req.platform) {
    case "windows":
      heading = "Windows";
      targets = isArm ? "Windows 11 ARM64 (Qualcomm Snapdragon X Elite / X Plus, PC ARM)" : "Windows 11, 10 et Windows IoT, x86_64 (Intel Core, N100, AMD Ryzen)";
      requirements = REQUIREMENTS.windows[req.locale];
      format = isArm ? ".exe (ARM64)" : ".exe (x86_64)";
      url = isArm ? d.windowsArm64 : d.windows;
      filename = `Bobine-Setup-${fileVersion}${isArm ? "-arm64" : ""}.exe`;
      break;
    case "macos":
      heading = "macOS";
      targets = "Apple Silicon (M1, M2, M3, M4 : MacBook Air, MacBook Pro, Mac mini, iMac)";
      requirements = REQUIREMENTS.macos[req.locale];
      format = ".dmg (arm64)";
      url = d.macos;
      filename = `Bobine-${fileVersion}.dmg`;
      break;
    case "linux": {
      const family = LINUX_FAMILIES[req.family];
      const arch = isArm ? "arm64" : "x86_64";
      heading = isEn ? `Linux (${family.label.en})` : `Linux (${family.label.fr})`;
      targets = `${family.distros[req.locale]} · ${isArm ? "ARM64 (Snapdragon X, NVIDIA DGX Spark, Raspberry Pi 5, Orange Pi)" : "x86_64 (Intel Core, N100, AMD Ryzen)"}`;
      requirements = REQUIREMENTS.linux[req.locale];
      format = `${family.extension} (${isArm ? "ARM64" : "x86_64"})`;
      url = d[downloadKey(req.family, arch)] || (family.live ? packageUrl(req.family, req.channel, arch, tag) : undefined);
      filename = packageFileName(req.family, req.channel, arch, fileVersion);
      break;
    }
    case "android-tv":
      heading = "Android TV";
      targets = isEn
        ? `Android TV and Google TV boxes and televisions (Android ${ANDROID.minVersion}+), ARM 32 and 64-bit`
        : `Box et téléviseurs Android TV et Google TV (Android ${ANDROID.minVersion}+), ARM 32 et 64 bits`;
      requirements = REQUIREMENTS["android-tv"][req.locale];
      format = ".apk (TV)";
      url = d.androidTv;
      filename = `Bobine-TV-${fileVersion}.apk`;
      break;
    case "android":
      heading = "Android";
      targets = isEn
        ? "Android tablets, Google Books and ARM64 kiosks"
        : "Tablettes Android, Google Books et bornes ARM64";
      requirements = REQUIREMENTS.android[req.locale];
      format = ".apk (ARM64)";
      url = d.android;
      filename = `Bobine-${fileVersion}.apk`;
      break;
    case "cli": {
      heading = isEn ? "Dedicated appliance" : "Appliance dédiée";
      targets = isEn
        ? "Dedicated mini PCs on Debian (Dell Wyse 5070, HP ProDesk, Beelink, Raspberry Pi 5), installed by script"
        : "Mini PC dédiés sous Debian (Dell Wyse 5070, HP ProDesk, Beelink, Raspberry Pi 5), installés par script";
      format = "bash";
      url = d.installScript;
      filename = "install.sh";
      const suffix = req.channel === "stable" ? "" : ` -s -- --channel=${req.channel}`;
      command = `curl -fsSL https://bobine.fit/install.sh | sudo bash${suffix}`;
      break;
    }
    case "tauri":
    case "assistant":
      heading = isEn ? "Bobine Assistant" : "Bobine Assistant";
      targets = isEn
        ? "SSH orchestrator with network discovery and channel selector, Linux"
        : "Orchestrateur SSH avec découverte réseau et sélecteur de canal, Linux";
      format = isArm ? (isEn ? "ARM64 binary" : "Binaire ARM64") : isEn ? "x86_64 binary" : "Binaire x86_64";
      url = isArm ? d.assistantArm64 : d.assistant;
      filename = isArm ? "bobine-assistant-arm64" : "bobine-assistant";
      break;
  }

  return {
    heading,
    targets,
    requirements,
    format,
    channel: req.channel,
    version: req.channel === "stable" ? tag : info.commit ? `#${info.commit}` : isEn ? "rolling" : "continue",
    publishedAt: info.files ? info.publishedAt : undefined,
    releaseUrl: info.htmlUrl || `${RELEASES_PAGE}/tag/${tag}`,
    url,
    filename,
    file: url ? info.files?.[url] : undefined,
    command,
    checksumsSigned: Boolean(info.checksumsSigned),
  };
}
