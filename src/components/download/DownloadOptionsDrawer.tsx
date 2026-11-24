"use client";

import Image from "next/image";
import Link from "next/link";
import Icon from "@/components/ui/Icon";
import type { CpuArchitecture } from "@/lib/downloadCatalog";
import type { Locale } from "@/lib/i18n";
import type { PackageChannel } from "@/lib/linuxPackages";

export interface ChannelRow {
  id: PackageChannel;
  label: string;
  version: string;
}

interface DownloadOptionsDrawerProps {
  titleId: string;
  locale: Locale;
  isEn: boolean;
  isLinux: boolean;
  hasArch: boolean;
  arch: CpuArchitecture;
  onArchChange: (arch: CpuArchitecture) => void;
  channel: PackageChannel;
  onChannelChange: (channel: PackageChannel) => void;
  channelRows: ChannelRow[];
  releaseUrl: string;
  requirements?: string;
  open: boolean;
  onToggle: () => void;
  onClose: () => void;
}

function ArchField({ titleId, arch, onArchChange, isEn }: {
  titleId: string;
  arch: CpuArchitecture;
  onArchChange: (arch: CpuArchitecture) => void;
  isEn: boolean;
}) {
  return (
    <div role="group" aria-labelledby={`${titleId}-arch`} className="dl-field">
      <span id={`${titleId}-arch`} className="dl-field__label">
        {isEn ? "Processor architecture" : "Architecture processeur"}
      </span>
      <div className="dl-segmented">
        <button type="button" className="dl-segmented__btn" aria-pressed={arch === "x86_64"} onClick={() => onArchChange("x86_64")}>
          <span>x86_64</span>
          <small>Intel / AMD</small>
        </button>
        <button type="button" className="dl-segmented__btn" aria-pressed={arch === "arm64"} onClick={() => onArchChange("arm64")}>
          <span>ARM64</span>
          <small>Snapdragon / Pi 5</small>
        </button>
      </div>
    </div>
  );
}

export default function DownloadOptionsDrawer({
  titleId, locale, isEn, isLinux, hasArch, arch, onArchChange, channel, onChannelChange, channelRows, releaseUrl, requirements, open, onToggle, onClose,
}: DownloadOptionsDrawerProps) {
  return (
    <>
      <div className="dl-footer-bar">
        <button type="button" className="dl-more-toggle" aria-expanded={open} onClick={onToggle}>
          <Icon name={open ? "close" : "plus"} size={14} />
          <span>{isEn ? "More options (Channel, Architecture, Info)" : "Plus d'options (Canal, Architecture, Infos)"}</span>
        </button>
        <div className="dl-links">
          <a href={releaseUrl} target="_blank" rel="noopener noreferrer">{isEn ? "Release notes" : "Notes de version"}</a>
          <a href="https://github.com/FantasmaGlad/Bobine" target="_blank" rel="noopener noreferrer">{isEn ? "Source code" : "Code source"}</a>
          {isLinux && <Link href={`/${locale}/linux`} onClick={onClose}>{isEn ? "Linux page" : "Page Linux"}</Link>}
        </div>
      </div>

      <div className="dl-advanced-drawer" data-open={open ? "true" : "false"}>
        <div className="dl-advanced-drawer__inner">
          <div className="dl-advanced-grid">
            {hasArch && <ArchField titleId={titleId} arch={arch} onArchChange={onArchChange} isEn={isEn} />}
            <div role="group" aria-labelledby={`${titleId}-channel`} className="dl-field">
              <span id={`${titleId}-channel`} className="dl-field__label">{isEn ? "Release channel" : "Canal de version"}</span>
              <div className="dl-segmented">
                {channelRows.map((row) => (
                  <button key={row.id} type="button" className="dl-segmented__btn" aria-pressed={channel === row.id} onClick={() => onChannelChange(row.id)}>
                    <Image src={`/images/channels/bobine-${row.id}.webp`} alt="" width={16} height={16} className="dl-chip__logo" />
                    <span>{row.label}</span>
                    <small>{row.version}</small>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {requirements && (
            <p className="dl-requirements">
              <strong>{isEn ? "Requirements: " : "Prérequis : "}</strong>
              {requirements}{" "}
              {isEn ? "No account or online service required." : "Aucun compte ni service en ligne requis."}
            </p>
          )}
        </div>
      </div>
    </>
  );
}
