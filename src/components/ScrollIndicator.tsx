"use client";

import type { Locale } from "@/lib/i18n";

interface ScrollIndicatorProps {
  locale: Locale;
  label?: string;
  targetId?: string;
}

export default function ScrollIndicator({ locale, label, targetId }: ScrollIndicatorProps) {
  const defaultLabel = locale === "en" ? "Scroll down to discover" : "Défiler pour découvrir";
  const displayLabel = label || defaultLabel;

  const handleScroll = () => {
    if (targetId) {
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        return;
      }
    }
    // Défilement dynamique fluide vers la suite du contenu
    const targetY = window.innerHeight * 0.78;
    window.scrollBy({ top: targetY, behavior: "smooth" });
  };

  return (
    <button
      type="button"
      className="hero-fullscreen__scroll"
      onClick={handleScroll}
      aria-label={displayLabel}
    >
      <span>{displayLabel}</span>
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </button>
  );
}
