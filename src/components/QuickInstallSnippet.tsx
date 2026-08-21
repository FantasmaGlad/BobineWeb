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
        marginBlock: "0.85rem 1.35rem",
        padding: "0.45rem 0.85rem",
        background: "var(--bg-surface)",
        border: "1px solid var(--border-subtle)",
        borderRadius: "0.45rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "0.75rem",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", minWidth: 0, flexWrap: "wrap" }}>
        <span
          style={{
            fontSize: "0.7rem",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            color: "var(--text-muted)",
          }}
        >
          {isEn ? "Quick install" : "Install rapide"}
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", overflowX: "auto" }}>
          <span style={{ color: "var(--accent-primary)", fontWeight: 700, fontFamily: "monospace", fontSize: "0.85rem" }}>$</span>
          <code
            style={{
              fontFamily: "monospace",
              fontSize: "0.85rem",
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
          padding: "0.25rem 0.6rem",
          fontSize: "0.75rem",
          display: "inline-flex",
          alignItems: "center",
          gap: "0.35rem",
          cursor: "pointer",
          flexShrink: 0,
        }}
        title={isEn ? "Copy command to clipboard" : "Copier la commande dans le presse-papier"}
        aria-label={isEn ? "Copy command to clipboard" : "Copier la commande dans le presse-papier"}
      >
        {copied ? (
          <>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span>{isEn ? "Copied" : "Copié"}</span>
          </>
        ) : (
          <>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
