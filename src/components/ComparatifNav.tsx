"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Locale } from "@/lib/i18n";
import { lp } from "@/lib/seo";

interface ComparatifNavProps {
  locale: Locale;
  currentTitle?: string;
}

export default function ComparatifNav({ locale, currentTitle }: ComparatifNavProps) {
  const pathname = usePathname();
  const isEn = locale === "en";

  const navItems = [
    {
      href: lp(locale, "/comparatif"),
      label: isEn ? "Overview" : "Vue d'ensemble",
    },
    {
      href: lp(locale, "/comparatif/les-mills-cinema"),
      label: "Les Mills Cinema",
    },
    {
      href: lp(locale, "/comparatif/wexer-fitness-on-demand"),
      label: "Wexer & FOD",
    },
    {
      href: lp(locale, "/comparatif/radical-fitness-yako"),
      label: "Radical & Yako",
    },
    {
      href: lp(locale, "/comparatif/affichage-dynamique-fitness"),
      label: isEn ? "Digital Signage" : "Affichage Dynamique",
    },
  ];

  return (
    <>
      <nav
        aria-label={isEn ? "Comparison studies navigation" : "Navigation des études comparatives"}
        className="cmp-subnav"
      >
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`cmp-subnav__pill${active ? " cmp-subnav__pill--active" : ""}`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
