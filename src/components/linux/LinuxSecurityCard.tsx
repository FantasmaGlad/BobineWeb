"use client";

import { useState } from "react";
import type { Locale } from "@/lib/i18n";
import { LINUX_SHOWCASE_CONTENT } from "@/content/linuxShowcase";

export default function LinuxSecurityCard({ locale }: { locale: Locale }) {
  const isEn = locale === "en";
  const t = LINUX_SHOWCASE_CONTENT[locale].security;
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(t.fingerprint);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      // repli en cas d'interdiction presse-papier
    }
  };

  return (
    <section className="linux-security-card">
      <div className="linux-security-card__head">
        <div className="linux-section-header__tag linux-section-header__tag--left">
          {isEn ? "Cryptographic Verification" : "Vérification Cryptographique"}
        </div>
        <h2 className="linux-security-card__title">{t.title}</h2>
        <p className="linux-security-card__desc">{t.desc}</p>
      </div>

      <div className="linux-security-card__fpr-box">
        <code className="linux-security-card__fpr-code">{t.fingerprint}</code>
        <div className="linux-security-card__actions">
          <button
            type="button"
            onClick={handleCopy}
            className="linux-terminal__copy-btn linux-security-card__btn"
            aria-label={copied ? (isEn ? "Fingerprint copied" : "Empreinte copiée") : (isEn ? "Copy fingerprint" : "Copier l'empreinte")}
          >
            {copied ? (
              <>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--accent-success)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span className="linux-terminal__copied-text">{isEn ? "Copied" : "Copiée"}</span>
              </>
            ) : (
              <>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
                <span>{isEn ? "Copy fingerprint" : "Copier l'empreinte"}</span>
              </>
            )}
          </button>

          <a
            href="https://packages.bobine.fit/bobine.gpg"
            target="_blank"
            rel="noopener noreferrer"
            className="linux-terminal__copy-btn linux-security-card__btn"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            <span>{t.downloadKeyText}</span>
          </a>
        </div>
      </div>
    </section>
  );
}
