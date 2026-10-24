"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { spawnConfettiBurst } from "@/lib/confettiBurst";
import type { Locale } from "@/lib/i18n";
import { lp } from "@/lib/seo";

interface PlatformSelectorSidebarProps {
  locale: Locale;
}

const PLATFORMS = [
  {
    key: "aliexpress",
    labelFr: "AliExpress",
    labelEn: "AliExpress",
    icon: "/images/hardware/aliexpress-icon-mark-cutout.webp",
    confettiColors: ["#FF4747", "#E62E04", "#FFF6F2"],
  },
] as const;

export default function PlatformSelectorSidebar({ locale }: PlatformSelectorSidebarProps) {
  const pathname = usePathname();
  const isEn = locale === "en";

  return (
    <nav
      className="platform-rail"
      role="tablist"
      aria-label={isEn ? "Choose a marketplace" : "Choisir une plateforme"}
    >
      {PLATFORMS.map((platform) => {
        const href = lp(locale, `/materiel/${platform.key}`);
        const isActive = pathname?.includes(`/materiel/${platform.key}`) ?? false;

        return (
          <Link
            key={platform.key}
            href={href}
            role="tab"
            aria-selected={isActive}
            aria-label={isEn ? platform.labelEn : platform.labelFr}
            title={isEn ? platform.labelEn : platform.labelFr}
            className={`platform-rail__icon ${isActive ? "is-active" : ""}`}
            onClick={(event) => {
              spawnConfettiBurst(event.clientX, event.clientY, {
                colors: [...platform.confettiColors],
              });
            }}
          >
            <span className="platform-rail__icon-shape">
              <Image src={platform.icon} alt="" width={44} height={44} aria-hidden="true" />
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
