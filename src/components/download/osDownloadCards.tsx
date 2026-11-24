"use client";

import type { ReactNode } from "react";
import type { Locale } from "@/lib/i18n";
import type { ReleaseChannelInfo } from "@/lib/releaseTypes";
import { LINUX_FAMILIES } from "@/lib/linuxPackages";
import WindowsIcon from "@/components/icons/WindowsIcon";
import LinuxIcon from "@/components/icons/LinuxIcon";
import AppleIcon from "@/components/icons/AppleIcon";
import AndroidIcon from "@/components/icons/AndroidIcon";
import AndroidTvIcon from "@/components/icons/AndroidTvIcon";
import DistroLogo from "@/components/icons/DistroLogo";

export interface OsCard {
  id: string;
  name: string;
  subtitle: ReactNode;
  format: string;
  badge: string;
  statusLabel?: string;
  url: string;
  isComingSoon: boolean;
  icon: ReactNode;
}

export function buildOsCards(locale: Locale, stableInfo: ReleaseChannelInfo): OsCard[] {
  const isEn = locale === "en";
  const linuxDistros = [
    { name: "Debian", logo: "debian" as const, live: LINUX_FAMILIES.debian.live },
    { name: "Ubuntu", logo: "ubuntu" as const, live: LINUX_FAMILIES.debian.live },
    { name: "Fedora", logo: "fedora" as const, live: LINUX_FAMILIES.fedora.live },
    { name: "Arch", logo: "arch" as const, live: LINUX_FAMILIES.arch.live },
  ];
  const oneClick = isEn ? "1-click install" : "Installation 1 clic";
  const androidTvFallback = `https://github.com/FantasmaGlad/Bobine/releases/download/${stableInfo.version}/Bobine-TV-${stableInfo.version.replace(/^V/i, "")}.apk`;

  return [
    {
      id: "linux",
      name: "Linux",
      subtitle: (
        <span className="os-download-card__distros">
          {linuxDistros.map((d) => (
            <span key={d.name} className={`os-download-card__distro${d.live ? "" : " is-soon"}`} title={d.live ? d.name : `${d.name} (${isEn ? "soon" : "bientôt"})`}>
              <DistroLogo id={d.logo} />
              <span className="sr-only">{d.name}</span>
            </span>
          ))}
        </span>
      ),
      format: isEn ? "Linux package" : "Paquet Linux",
      badge: oneClick,
      url: stableInfo.downloads.linux,
      isComingSoon: false,
      icon: <LinuxIcon size={28} className="os-download-card__icon" />,
    },
    { id: "windows", name: "Windows", subtitle: "Windows 11 & 10", format: isEn ? "Installer .exe" : "Installeur .exe", badge: oneClick, url: stableInfo.downloads.windows, isComingSoon: false, icon: <WindowsIcon size={26} className="os-download-card__icon" /> },
    { id: "macos", name: "macOS", subtitle: "Apple Silicon", format: isEn ? "Disk image .dmg" : "Image disque .dmg", badge: oneClick, url: stableInfo.downloads.macos, isComingSoon: false, icon: <AppleIcon size={26} className="os-download-card__icon" /> },
    { id: "android", name: "Android", subtitle: "Google Book", format: isEn ? "Package .apk" : "Paquet .apk", badge: oneClick, url: stableInfo.downloads.android, isComingSoon: false, icon: <AndroidIcon size={27} className="os-download-card__icon" /> },
    { id: "android-tv", name: "Android TV", subtitle: "Google TV", format: isEn ? "Package .apk" : "Paquet .apk", badge: isEn ? "Soon on Google Play" : "Bientôt sur Google Play", url: stableInfo.downloads.androidTv || androidTvFallback, isComingSoon: false, icon: <AndroidTvIcon size={28} className="os-download-card__icon" /> },
  ];
}
