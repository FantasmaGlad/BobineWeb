"use client";

import Image from "next/image";
import BrandIcon from "@/components/ui/BrandIcon";
import Icon from "@/components/ui/Icon";
import type { AssetKey } from "@/lib/assets";
import type { CpuArchitecture, DownloadPlatform } from "@/lib/downloadCatalog";
import type { PackageChannel } from "@/lib/linuxPackages";

const HEADING_ICON: Record<string, AssetKey> = {
  windows: "os.windows",
  macos: "os.macos",
  linux: "os.linux",
  android: "os.android",
  "android-tv": "os.androidtv",
};

interface DownloadPanelHeaderProps {
  titleId: string;
  platform: DownloadPlatform;
  channel: PackageChannel;
  activeChannelLabel: string;
  version: string;
  heading: string;
  targets: string;
  hasArch: boolean;
  arch: CpuArchitecture;
  isEn: boolean;
  onClose: () => void;
}

export default function DownloadPanelHeader({
  titleId, platform, channel, activeChannelLabel, version, heading, targets, hasArch, arch, isEn, onClose,
}: DownloadPanelHeaderProps) {
  return (
    <header className="dl-panel__header">
      <BrandIcon name={HEADING_ICON[platform] ?? "os.linux"} size={36} className="dl-panel__logo" />
      <div className="dl-panel__heading">
        <div className="dl-panel__title-row">
          <h2 id={titleId} className="dl-panel__title">
            {isEn ? `Bobine for ${heading}` : `Bobine pour ${heading}`}
          </h2>
          <span className="dl-panel__badge">
            <Image src={`/images/channels/bobine-${channel}.webp`} alt="" width={16} height={16} className="dl-panel__badge-logo" />
            <span>{activeChannelLabel} · {version}</span>
            {hasArch && <span>· {arch}</span>}
          </span>
        </div>
        <p className="dl-panel__targets">{targets}</p>
      </div>
      <button type="button" className="dl-panel__close" onClick={onClose} autoFocus aria-label={isEn ? "Close" : "Fermer"}>
        <Icon name="close" size={18} />
      </button>
    </header>
  );
}
