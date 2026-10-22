"use client";

import { useState } from "react";
import type { Locale } from "@/lib/i18n";
import "@/styles/split/pages-docs.css";

export default function QuickInstallSnippet({ locale }: { locale: Locale }) {
  const [copied, setCopied] = useState(false);
  const [isVerbose, setIsVerbose] = useState(false);
  const isEn = locale === "en";

  const command = isVerbose
    ? "curl -sSL https://bobine.fit/install.sh | bash -s -- --verbose"
    : "curl -sSL https://bobine.fit/install.sh | bash";

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
    <div className="dx-div-23"
    >
      <div className="dx-div-24">
        {/* Toggle Mode Épuré vs Verbeux */}
        <div className="dx-div-25"
        >
          <button
            type="button"
            onClick={() => setIsVerbose(false)}
            aria-pressed={!isVerbose}
            className="dx-seg-btn"
          >
            {isEn ? "Clean" : "Épuré"}
          </button>
          <button
            type="button"
            onClick={() => setIsVerbose(true)}
            aria-pressed={isVerbose}
            className="dx-seg-btn"
          >
            {isEn ? "Verbose (-v)" : "Verbeux (-v)"}
          </button>
        </div>

        <div className="dx-div-26">
          <span className="dx-span-1">$</span>
          <code className="dx-code-2"
          >
            {command}
          </code>
        </div>
      </div>

      <button
        type="button"
        onClick={handleCopy}
        className="btn-secondary dx-button-2"
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
