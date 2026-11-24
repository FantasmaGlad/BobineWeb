"use client";

import { useId, useRef } from "react";
import type { Locale } from "@/lib/i18n";
import type { ReleaseChannelInfo } from "@/lib/releaseTypes";
import { DownloadPlatform, formatSize, resolveDownload } from "@/lib/downloadCatalog";
import { aptInstallScript, archInstallScript, fedoraInstallScript, type LinuxFamilyId, type PackageChannel } from "@/lib/linuxPackages";
import { DownloadHeroAction, DownloadOneLineBox } from "./DownloadActions";
import DownloadLinuxFlow from "./DownloadLinuxFlow";
import DownloadOptionsDrawer, { type ChannelRow } from "./DownloadOptionsDrawer";
import DownloadPanelHeader from "./DownloadPanelHeader";
import { useDownloadPanelState } from "./useDownloadPanelState";
import "@/styles/components/download-panel.css";

export type { DownloadPlatform, CpuArchitecture } from "@/lib/downloadCatalog";

interface DownloadPanelProps {
  isOpen: boolean;
  onClose: () => void;
  locale: Locale;
  initialPlatform?: DownloadPlatform;
  stable: ReleaseChannelInfo;
  beta: ReleaseChannelInfo;
  canary: ReleaseChannelInfo;
}

function scriptForFamily(family: LinuxFamilyId, channel: PackageChannel): string {
  if (family === "debian") return aptInstallScript(channel);
  if (family === "fedora") return fedoraInstallScript(channel);
  return archInstallScript(channel);
}

function oneLineFor(platform: DownloadPlatform, channel: PackageChannel): string {
  if (platform === "windows") {
    return channel === "stable"
      ? "irm https://bobine.fit/install.ps1 | iex"
      : `& ([scriptblock]::Create((irm https://bobine.fit/install.ps1))) -Channel ${channel}`;
  }
  return platform === "macos" && channel === "stable" ? "brew install --cask fantasmaglad/bobine/bobine" : "";
}

function buildChannelRows(isEn: boolean, stable: ReleaseChannelInfo, beta: ReleaseChannelInfo, canary: ReleaseChannelInfo): ChannelRow[] {
  const rolling = isEn ? "rolling" : "continue";
  return [
    { id: "stable", label: "Stable", version: stable.version },
    { id: "beta", label: isEn ? "Beta" : "Bêta", version: beta.commit ? `#${beta.commit}` : rolling },
    { id: "canary", label: "Canary", version: canary.commit ? `#${canary.commit}` : rolling },
  ];
}

export default function DownloadPanel({ isOpen, onClose, locale, initialPlatform = "windows", stable, beta, canary }: DownloadPanelProps) {
  const isEn = locale === "en";
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const titleId = useId();
  const state = useDownloadPanelState(isOpen, dialogRef);
  const platform = initialPlatform;
  const result = resolveDownload({ locale, platform, arch: state.arch, family: state.family, channel: state.channel, stable, beta, canary });
  const hasArch = platform === "windows" || platform === "linux";
  const isLinux = platform === "linux";
  const size = formatSize(result.file?.size, locale);
  const published = result.file?.updatedAt ?? result.publishedAt;
  const publishedLabel = published ? new Intl.DateTimeFormat(isEn ? "en-GB" : "fr-FR", { dateStyle: "medium" }).format(new Date(published)) : "";
  const oneLine = oneLineFor(platform, state.channel);
  const activeChannelLabel = state.channel === "stable" ? "Stable" : state.channel === "beta" ? (isEn ? "Beta" : "Bêta") : "Canary";

  return (
    <dialog ref={dialogRef} className={`dl-panel${isLinux ? " dl-panel--wide" : ""}`} aria-labelledby={titleId} onClose={onClose}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="dl-panel__sheet">
        <DownloadPanelHeader titleId={titleId} platform={platform} channel={state.channel} activeChannelLabel={activeChannelLabel}
          version={result.version} heading={result.heading} targets={result.targets} hasArch={hasArch} arch={state.arch} isEn={isEn} onClose={onClose} />

        <div className="dl-panel__body">
          {isLinux ? (
            <DownloadLinuxFlow titleId={titleId} locale={locale} isEn={isEn} family={state.family} onFamilyChange={state.setFamily}
              repoScript={scriptForFamily(state.family, state.channel)} filename={result.filename} size={size} url={result.url}
              copied={state.copied} onCopy={state.copy} />
          ) : (
            <DownloadHeroAction titleId={titleId} url={result.url} filename={result.filename} version={result.version}
              size={size} publishedLabel={publishedLabel} isEn={isEn} />
          )}

          {oneLine && (
            <DownloadOneLineBox titleId={titleId} platform={platform} oneLine={oneLine} copied={state.copied} onCopy={state.copy} isEn={isEn} />
          )}

          <DownloadOptionsDrawer titleId={titleId} locale={locale} isEn={isEn} isLinux={isLinux} hasArch={hasArch}
            arch={state.arch} onArchChange={state.setArch} channel={state.channel} onChannelChange={state.setChannel}
            channelRows={buildChannelRows(isEn, stable, beta, canary)} releaseUrl={result.releaseUrl} requirements={result.requirements}
            open={state.showMoreOptions} onToggle={state.toggleMoreOptions} onClose={onClose} />
        </div>

        <p className="dl-sr-only" role="status" aria-live="polite">
          {state.copied ? (isEn ? "Copied to the clipboard" : "Copié dans le presse-papiers") : ""}
        </p>
      </div>
    </dialog>
  );
}
