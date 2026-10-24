"use client";

import { useState } from "react";
import type { Locale } from "@/lib/i18n";
import { LINUX_SHOWCASE_CONTENT, getTerminalCommand } from "@/content/linuxShowcase";

type Family = "debian" | "fedora" | "arch" | "appliance";
type Channel = "stable" | "beta" | "canary";

export default function LinuxTerminal({ locale }: { locale: Locale }) {
  const [family, setFamily] = useState<Family>("debian");
  const [channel, setChannel] = useState<Channel>("stable");
  const [copied, setCopied] = useState(false);

  const t = LINUX_SHOWCASE_CONTENT[locale].terminal;
  const currentCommand = getTerminalCommand(family, channel);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentCommand);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      // repli en cas d'interdiction presse-papier
    }
  };

  return (
    <section id="terminal" className="linux-terminal-section">
      <header className="linux-section-header">
        <div className="linux-section-header__tag">{t.sectionTag}</div>
        <h2 className="linux-section-header__title">{t.sectionTitle}</h2>
        <p className="linux-section-header__desc">{t.sectionDesc}</p>
      </header>

      <div className="linux-terminal">
        <div className="linux-terminal__bar">
          <div className="linux-terminal__dots" aria-hidden="true">
            <span className="linux-terminal__dot linux-terminal__dot--red" />
            <span className="linux-terminal__dot linux-terminal__dot--yellow" />
            <span className="linux-terminal__dot linux-terminal__dot--green" />
          </div>

          <div className="linux-terminal__bar-actions">
            {family !== "appliance" && (
              <div className="linux-terminal__pills" role="radiogroup" aria-label="Canal de mise à jour">
                {(["stable", "beta", "canary"] as const).map((ch) => (
                  <button
                    key={ch}
                    type="button"
                    role="radio"
                    aria-checked={channel === ch}
                    onClick={() => setChannel(ch)}
                    className="linux-terminal__pill"
                  >
                    {t.channels[ch]}
                  </button>
                ))}
              </div>
            )}

            <button
              type="button"
              onClick={handleCopy}
              className="linux-terminal__copy-btn"
              aria-label={copied ? t.copiedText : t.copyBtn}
            >
              {copied ? (
                <>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--accent-success)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span className="linux-terminal__copied-text">{t.copiedText}</span>
                </>
              ) : (
                <>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                  <span>{t.copyBtn}</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="linux-terminal__tabs" role="tablist" aria-label="Famille de distribution">
          <button
            type="button"
            role="tab"
            aria-selected={family === "debian"}
            onClick={() => setFamily("debian")}
            className="linux-terminal__tab"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/icons/distros/debian.svg" alt="" width={18} height={18} className="linux-terminal__tab-icon" aria-hidden="true" />
            <span>{t.tabs.debian}</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={family === "fedora"}
            onClick={() => setFamily("fedora")}
            className="linux-terminal__tab"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/icons/distros/fedora.svg" alt="" width={18} height={18} className="linux-terminal__tab-icon" aria-hidden="true" />
            <span>{t.tabs.fedora}</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={family === "arch"}
            onClick={() => setFamily("arch")}
            className="linux-terminal__tab"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/icons/distros/arch.svg" alt="" width={18} height={18} className="linux-terminal__tab-icon" aria-hidden="true" />
            <span>{t.tabs.arch}</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={family === "appliance"}
            onClick={() => setFamily("appliance")}
            className="linux-terminal__tab"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/icons/os/linux.svg" alt="" width={18} height={18} className="linux-terminal__tab-icon" aria-hidden="true" />
            <span>{t.tabs.appliance}</span>
          </button>
        </div>

        <div className="linux-terminal__body">
          <pre className="linux-terminal__code">
            <code>{currentCommand}</code>
          </pre>
        </div>

        <footer className="linux-terminal__footer">
          <span>
            {t.repoNote}{" "}
            <a href="https://packages.bobine.fit" target="_blank" rel="noopener noreferrer">
              {t.viewRepoLink}
            </a>
          </span>
          <span>{t.keyVerifiedNote}</span>
        </footer>
      </div>
    </section>
  );
}
