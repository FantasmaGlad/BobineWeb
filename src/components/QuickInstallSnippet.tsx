"use client";

import { useState } from "react";
import type { Locale } from "@/lib/i18n";

export default function QuickInstallSnippet({ locale }: { locale: Locale }) {
  const [copied, setCopied] = useState(false);
  const isEn = locale === "en";
  const command = "curl -sSL https://bobine.fit/install.sh | bash";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <div
      style={{
        marginBlock: "1.75rem 2.25rem",
        padding: "1rem 1.25rem",
        background: "var(--bg-card)",
        border: "1px solid var(--border-subtle)",
        borderRadius: "0.65rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "1rem",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem", minWidth: 0 }}>
        <span
          style={{
            fontSize: "0.725rem",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            color: "var(--text-muted)",
          }}
        >
          {isEn ? "One-Line Automated Installation (Debian 13)" : "Installation Automatisée en 1 Ligne (Debian 13)"}
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", overflowX: "auto" }}>
          <span style={{ color: "var(--accent-primary)", fontWeight: 700, fontFamily: "monospace" }}>$</span>
          <code
            style={{
              fontFamily: "monospace",
              fontSize: "0.925rem",
              color: "var(--text-heading)",
              whiteSpace: "nowrap",
            }}
          >
            {command}
          </code>
        </div>
      </div>

      <button
        type="button"
        onClick={handleCopy}
        className="btn-secondary"
        style={{
          padding: "0.4rem 0.85rem",
          fontSize: "0.8rem",
          display: "inline-flex",
          alignItems: "center",
          gap: "0.4rem",
          cursor: "pointer",
          flexShrink: 0,
        }}
        title={isEn ? "Copy command to clipboard" : "Copier la commande dans le presse-papier"}
        aria-label={isEn ? "Copy command to clipboard" : "Copier la commande dans le presse-papier"}
      >
        {copied ? (
          <>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span>{isEn ? "Copied" : "Copié"}</span>
          </>
        ) : (
          <>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
            <span>{isEn ? "Copy" : "Copier"}</span>
          </>
        )}
      </button>
    </div>
  );
}
