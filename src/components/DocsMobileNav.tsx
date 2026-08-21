"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Locale } from "@/lib/i18n";
import DocsSearch from "@/components/DocsSearch";

interface DocsMobileNavProps {
  locale: Locale;
  items: ReadonlyArray<readonly [string, string]>;
}

export default function DocsMobileNav({ locale, items }: DocsMobileNavProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Trouver l'item actif
  const currentItem = items.find(([sub]) => {
    const target = sub === "" ? `/${locale}/documentation` : `/${locale}/documentation/${sub}`;
    return pathname === target;
  }) || items[0];

  const currentLabel = currentItem ? currentItem[1] : (locale === "en" ? "Documentation" : "Documentation");

  return (
    <div className="docs-mobile-nav-wrapper">
      <div className="docs-mobile-nav-bar">
        <button
          type="button"
          className="docs-mobile-nav-trigger"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-expanded={isOpen}
          aria-label={locale === "en" ? "Choose documentation chapter" : "Choisir un chapitre de documentation"}
        >
          <div className="docs-mobile-nav-trigger__info">
            <span className="docs-mobile-nav-trigger__tag">
              {locale === "en" ? "Chapter" : "Chapitre"}
            </span>
            <span className="docs-mobile-nav-trigger__title">{currentLabel}</span>
          </div>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              transition: "transform 0.2s ease",
              transform: isOpen ? "rotate(180deg)" : "rotate(0)",
            }}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
      </div>

      {isOpen && (
        <div className="docs-mobile-nav-dropdown">
          <div className="docs-mobile-nav-dropdown__header">
            <DocsSearch locale={locale} />
          </div>

          <div className="docs-mobile-nav-dropdown__list">
            <span className="docs-mobile-nav-dropdown__label">
              {locale === "en" ? "Table of Contents" : "Sommaire des guides"}
            </span>
            {items.map(([sub, label]) => {
              const href = sub === "" ? `/${locale}/documentation` : `/${locale}/documentation/${sub}`;
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`docs-mobile-nav-dropdown__item ${isActive ? "is-active" : ""}`}
                  onClick={() => setIsOpen(false)}
                >
                  <span>{label}</span>
                  {isActive && <span className="docs-mobile-nav-dropdown__dot" />}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
