"use client";

import { useState, type ReactNode } from "react";
import type { Locale } from "@/lib/i18n";
import type { ReleaseChannelInfo } from "@/lib/releaseTypes";
import { useDetectedPlatform } from "@/lib/detectPlatform";
import type { PlatformId } from "@/lib/productFacts";
import WindowsIcon from "@/components/icons/WindowsIcon";
import AppleIcon from "@/components/icons/AppleIcon";
import LinuxIcon from "@/components/icons/LinuxIcon";
import AndroidIcon from "@/components/icons/AndroidIcon";
import AndroidTvIcon from "@/components/icons/AndroidTvIcon";
import { LINUX_FAMILIES, LINUX_FAMILY_IDS, packageLink } from "@/lib/linuxPackages";

type Channel = "stable" | "beta" | "canary";

/** Données minimales d'un canal, sérialisables du serveur vers le client. */
export interface LandingChannelData {
  label: string;
  version: string;
  downloads: ReleaseChannelInfo["downloads"];
}

interface Props {
  locale: Locale;
  channels: Record<Channel, LandingChannelData>;
  /** Canal imposé (pages de canal) ; sinon l'utilisateur choisit. */
  lockedChannel?: Channel;
  /** Plateforme proposée quand l'appareil n'est pas reconnu (ex. Android TV sur la page Android TV). */
  fallback: PlatformId;
}

const ICONS: Record<PlatformId, ReactNode> = {
  windows: <WindowsIcon size={18} />,
  macos: <AppleIcon size={18} />,
  linux: <LinuxIcon size={18} />,
  android: <AndroidIcon size={18} />,
  "android-tv": <AndroidTvIcon size={18} />,
};
const PLATFORMS: PlatformId[] = ["windows", "macos", "linux", "android", "android-tv"];
const NAMES: Record<PlatformId, string> = { windows: "Windows", macos: "macOS", linux: "Linux", android: "Android", "android-tv": "Android TV" };

function fileName(url: string): string {
  return decodeURIComponent(url.split("/").pop() ?? url);
}

/** Fichiers proposés pour une plateforme : un par architecture. */
function filesFor(platform: PlatformId, d: ReleaseChannelInfo["downloads"]): Array<{ arch: string; url?: string }> {
  switch (platform) {
    case "windows":
      return [{ arch: "x86-64", url: d.windows }, { arch: "ARM64", url: d.windowsArm64 }];
    case "linux":
      // Debian et Ubuntu toujours ; Fedora et Arch seulement une fois leurs paquets publiés (jamais de lien mort).
      return LINUX_FAMILY_IDS.flatMap((id) => [
        { arch: `${LINUX_FAMILIES[id].label.en} x86-64`, url: id === "debian" ? d.linux : packageLink(d, id, "x86_64") },
        { arch: `${LINUX_FAMILIES[id].label.en} ARM64`, url: id === "debian" ? d.linuxArm64 : packageLink(d, id, "arm64") },
      ]);
    case "macos":
      return [{ arch: "Apple Silicon", url: d.macos }];
    case "android":
      return [{ arch: "APK", url: d.android }];
    case "android-tv":
      return [{ arch: "APK", url: d.androidTv }];
  }
}

/**
 * Encart de téléchargement des pages de référencement : propose le fichier adapté à l'appareil du visiteur (détecté
 * après le montage, jamais pendant le rendu serveur) et laisse choisir une autre plateforme ou un autre canal.
 * La liste complète des fichiers reste rendue côté serveur, pour les moteurs de recherche.
 */
export default function LandingDownload({ locale, channels, lockedChannel, fallback }: Props) {
  const isEn = locale === "en";
  const detected = useDetectedPlatform();
  const [pickedPlatform, setPickedPlatform] = useState<PlatformId | null>(null);
  const [pickedChannel, setPickedChannel] = useState<Channel>("stable");

  const detectedPlatform: PlatformId | null = detected && detected !== "ios" ? detected : null;
  const platform = pickedPlatform ?? detectedPlatform ?? fallback;
  const channel = lockedChannel ?? pickedChannel;
  const info = channels[channel];
  const files = filesFor(platform, info.downloads).filter((f): f is { arch: string; url: string } => Boolean(f.url));

  const t = {
    title: isEn ? "Download for your device" : "Télécharger pour votre appareil",
    yours: isEn ? "Your device" : "Votre appareil",
    channel: isEn ? "Release channel" : "Canal de version",
    version: isEn ? "Version" : "Version",
    unavailable: isEn ? "No file is published for this platform on this channel." : "Aucun fichier n'est publié pour cette plateforme sur ce canal.",
    ios: isEn
      ? "iPhone and iPad: the app cannot be installed (route explored, not committed). Once Bobine runs on another device, you can still control the room from your phone's browser."
      : "iPhone et iPad : l'application ne s'installe pas (piste explorée, non engagée). Une fois Bobine installé sur un autre appareil, vous pouvez piloter la salle depuis le navigateur du téléphone.",
    all: isEn ? "All files of this version" : "Tous les fichiers de cette version",
    platformLabel: isEn ? "Platform" : "Plateforme",
    linuxSoon: isEn
      ? "Fedora (.rpm) and Arch Linux (.pkg.tar.zst) packages: coming soon."
      : "Paquets Fedora (.rpm) et Arch Linux (.pkg.tar.zst) : bientôt.",
  };
  const linuxSoon = platform === "linux" && LINUX_FAMILY_IDS.some((id) => !LINUX_FAMILIES[id].live);

  return (
    <section className="landing-dl landing-card landing-section" aria-labelledby="landing-dl-title">
      <header className="landing-dl__head">
        <h2 id="landing-dl-title" className="landing-h2">{t.title}</h2>
        {detectedPlatform && platform === detectedPlatform && <span className="landing-dl__badge">{t.yours}</span>}
      </header>

      <div className="landing-dl__pills" role="group" aria-label={t.platformLabel}>
        {PLATFORMS.map((p) => (
          <button key={p} type="button" className="landing-dl__pill" aria-pressed={p === platform} onClick={() => setPickedPlatform(p)}>
            {ICONS[p]}
            <span>{NAMES[p]}</span>
          </button>
        ))}
      </div>

      {!lockedChannel && (
        <div className="landing-dl__pills landing-dl__pills--channels" role="group" aria-label={t.channel}>
          {(Object.keys(channels) as Channel[]).map((c) => (
            <button key={c} type="button" className="landing-dl__pill" aria-pressed={c === channel} onClick={() => setPickedChannel(c)}>
              <span>{channels[c].label}</span>
            </button>
          ))}
        </div>
      )}

      {detected === "ios" && !pickedPlatform && <p className="landing-dl__note">{t.ios}</p>}

      <p className="landing-dl__meta">
        {t.version} : <strong>{info.version}</strong> · {info.label}
      </p>

      {files.length > 0 ? (
        <div className="landing-dl__actions">
          {files.map((f) => (
            <a key={f.url} className="btn-primary landing-dl__cta" href={f.url} rel="noopener noreferrer">
              <span className="landing-dl__cta-label">
                {isEn ? "Download" : "Télécharger"} {NAMES[platform]}
                {files.length > 1 ? ` · ${f.arch}` : ""}
              </span>
              <small>{fileName(f.url)}</small>
            </a>
          ))}
        </div>
      ) : (
        <p className="landing-dl__note">{t.unavailable}</p>
      )}

      {linuxSoon && <p className="landing-dl__note">{t.linuxSoon}</p>}

      <details className="landing-dl__all">
        <summary>{t.all}</summary>
        <ul>
          {PLATFORMS.flatMap((p) =>
            filesFor(p, info.downloads)
              .filter((f): f is { arch: string; url: string } => Boolean(f.url))
              .map((f) => (
                <li key={`${p}-${f.url}`}>
                  <span>{NAMES[p]}{filesFor(p, info.downloads).length > 1 ? ` · ${f.arch}` : ""}</span>
                  <a href={f.url} rel="noopener noreferrer">{fileName(f.url)}</a>
                </li>
              )),
          )}
        </ul>
      </details>
    </section>
  );
}
