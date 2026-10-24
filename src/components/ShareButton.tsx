"use client";

import { useState, useRef, useEffect, useMemo, type ReactElement } from "react";
import type { Locale } from "@/lib/i18n";
import BrandIcon from "@/components/ui/BrandIcon";
import Icon from "@/components/ui/Icon";

interface ShareButtonProps {
  locale: Locale;
  title: string;
  description?: string;
  pathname: string;
  hashtags?: string[];
}

type NetworkId = "linkedin" | "whatsapp" | "x" | "telegram";

const ICONS: Record<NetworkId, ReactElement> = {
  linkedin: <BrandIcon name="app.linkedin" size={15} />,
  whatsapp: <BrandIcon name="app.whatsapp" size={15} />,
  x: <BrandIcon name="app.x" size={15} />,
  telegram: <BrandIcon name="app.telegram" size={15} />,
};

export default function ShareButton({
  locale,
  title,
  description = "Régie vidéo autonome et 100% hors-ligne pour salles de sport.",
  pathname,
  hashtags = ["OpenSource", "Fitness", "Bobine", "SportTech"],
}: ShareButtonProps) {
  const isEn = locale === "en";
  const [isOpen, setIsOpen] = useState(false);
  const [activeNetwork, setActiveNetwork] = useState<NetworkId>("linkedin");
  const [copied, setCopied] = useState<"text" | "link" | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const url = typeof window !== "undefined"
    ? `${window.location.origin}/${locale}${pathname}`
    : `https://bobine.fit/${locale}${pathname}`;

  const networks: { id: NetworkId; name: string; intentUrl: (text: string) => string; supportsPrefill: boolean }[] = useMemo(
    () => [
      {
        id: "linkedin",
        name: "LinkedIn",
        supportsPrefill: false,
        intentUrl: () => `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      },
      {
        id: "whatsapp",
        name: "WhatsApp",
        supportsPrefill: true,
        intentUrl: (text) => `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`,
      },
      {
        id: "x",
        name: "X (Twitter)",
        supportsPrefill: true,
        intentUrl: (text) => `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`,
      },
      {
        id: "telegram",
        name: "Telegram",
        supportsPrefill: true,
        intentUrl: (text) => `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
      },
    ],
    [url]
  );

  // Formats un texte adapté aux codes de chaque plateforme (longueur, ton, hashtags).
  const formattedTextFor = (network: NetworkId): string => {
    switch (network) {
      case "linkedin": {
        const tags = hashtags.slice(0, 4).map((h) => `#${h}`).join(" ");
        return isEn
          ? `${title}\n\n${description}\n\n${url}\n\n${tags}`
          : `${title}\n\n${description}\n\n${url}\n\n${tags}`;
      }
      case "x": {
        const tags = hashtags.slice(0, 2).map((h) => `#${h}`).join(" ");
        const budget = 280 - url.length - tags.length - 4;
        const shortTitle = title.length > budget ? `${title.slice(0, Math.max(0, budget - 1))}…` : title;
        return `${shortTitle}\n${url}\n${tags}`;
      }
      case "whatsapp":
      case "telegram":
        return isEn
          ? `${title} — ${url}`
          : `${title} — ${url}`;
      default:
        return `${title} ${url}`;
    }
  };

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen) setIsOpen(false);
    }
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const copyToClipboard = async (text: string, type: "text" | "link") => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      setTimeout(() => setCopied(null), 2500);
    } catch {
      // Fallback silencieux : l'utilisateur peut toujours sélectionner le texte affiché.
    }
  };

  const active = networks.find((n) => n.id === activeNetwork)!;
  const activeText = formattedTextFor(activeNetwork);

  return (
    <div ref={containerRef} className="share-widget-wrapper">
      <button
        type="button"
        className="share-trigger-btn"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-label={isEn ? "Share this page" : "Partager cette page"}
      >
        <Icon name="share" size={15} />
        <span>{isEn ? "Share" : "Partager"}</span>
      </button>

      {isOpen && (
        <>
          <div className="share-backdrop" onClick={() => setIsOpen(false)} />
          <div className="share-dropdown-panel" role="menu">
            <div className="share-dropdown-header">
              <span className="share-dropdown-title">
                {isEn ? "Share this resource" : "Partager cette page"}
              </span>
              <button
                type="button"
                className="share-close-btn"
                onClick={() => setIsOpen(false)}
                aria-label="Fermer"
              >
                ×
              </button>
            </div>

            {/* Sélecteur de plateforme */}
            <div className="share-networks-grid" role="tablist">
              {networks.map((n) => (
                <button
                  key={n.id}
                  type="button"
                  role="tab"
                  aria-selected={activeNetwork === n.id}
                  className={
                    "share-network-item" +
                    (activeNetwork === n.id ? " share-network-item--active" : "")
                  }
                  onClick={() => setActiveNetwork(n.id)}
                >
                  <span className="share-network-icon">{ICONS[n.id]}</span>
                  <span className="share-network-name">{n.name}</span>
                </button>
              ))}
            </div>

            {/* Aperçu du texte formaté pour la plateforme sélectionnée */}
            <div className="share-preview">
              <span className="share-preview__label">
                {isEn ? `Preview for ${active.name}` : `Aperçu pour ${active.name}`}
              </span>
              <pre className="share-preview__text">{activeText}</pre>
              {!active.supportsPrefill && (
                <p className="share-preview__note">
                  {isEn
                    ? "LinkedIn does not accept prefilled post text from a link — copy the text below, then paste it when the share window opens."
                    : "LinkedIn n'accepte pas de texte pré-rempli depuis un lien : copiez le texte ci-dessous, puis collez-le à l'ouverture de la fenêtre de partage."}
                </p>
              )}
            </div>

            <div className="share-copy-actions">
              <button
                type="button"
                className="share-copy-btn share-copy-btn--featured"
                onClick={() => copyToClipboard(activeText, "text")}
              >
                <Icon name="copy" size={14} />
                <span>
                  {copied === "text"
                    ? (isEn ? "Copied!" : "Copié !")
                    : (isEn ? `Copy ${active.name} text` : `Copier le texte ${active.name}`)}
                </span>
              </button>

              <a
                href={active.intentUrl(activeText)}
                target="_blank"
                rel="noopener noreferrer"
                className="share-copy-btn"
              >
                <Icon name="external" size={14} />
                <span>{isEn ? `Open ${active.name} share window` : `Ouvrir la fenêtre de partage ${active.name}`}</span>
              </a>

              <button
                type="button"
                className="share-copy-btn"
                onClick={() => copyToClipboard(url, "link")}
              >
                <Icon name="link" size={14} />
                <span>
                  {copied === "link"
                    ? (isEn ? "Link copied!" : "Lien direct copié !")
                    : (isEn ? "Copy direct URL" : "Copier le lien direct")}
                </span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
