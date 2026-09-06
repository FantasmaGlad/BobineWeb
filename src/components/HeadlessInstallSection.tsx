"use client";

import { useState } from "react";
import type { Locale } from "@/lib/i18n";
import TerminalDemo from "@/components/TerminalDemo";
import TauriDemo from "@/components/TauriDemo";
import NetworkIcon from "@/components/icons/NetworkIcon";

interface HeadlessInstallSectionProps {
  locale: Locale;
}

export default function HeadlessInstallSection({ locale }: { locale: Locale }) {
  const isEn = locale === "en";
  const [activeTab, setActiveTab] = useState<"bash" | "tauri">("bash");

  return (
    <section id="headless-installation" className="headless-section" aria-labelledby="headless-heading">
      <div className="headless-section__header">
        <span className="headless-section__eyebrow">
          {isEn ? "Dedicated Servers & Headless Appliances" : "Serveurs Dédiés & Appliances Headless"}
        </span>
        <h2 id="headless-heading" className="headless-section__title">
          {isEn ? "Advanced Installation Methods" : "Autres Méthodes d'Installation"}
        </h2>
        <p className="headless-section__subtitle">
          {isEn
            ? "Deploy an autonomous 24/7 playout kiosk on dedicated low-cost mini PCs (Dell Wyse 5070, HP ProDesk DM...) without desktop overhead, using the 1-line script or the graphical desktop orchestrator."
            : "Transformez un mini PC dédié (Dell Wyse 5070, HP ProDesk DM...) en borne 24/7 verrouillée sans bureau graphique parasite, grâce au script automatisé ou à l'assistant graphique d'orchestration."}
        </p>

        {/* Boutons d'installation séparés et découplés */}
        <div className="headless-action-tabs" role="tablist" aria-label={isEn ? "Installation method selector" : "Sélecteur de méthode d'installation"}>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "bash"}
            className={`headless-action-btn ${activeTab === "bash" ? "is-active" : ""}`}
            onClick={() => setActiveTab("bash")}
          >
            <div className="headless-action-btn__icon-wrap">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <polyline points="4 17 10 11 4 5" />
                <line x1="12" y1="19" x2="20" y2="19" />
              </svg>
            </div>
            <div className="headless-action-btn__text">
              <span className="headless-action-btn__title">{isEn ? "Bash Installer (CLI)" : "Installateur Bash (CLI)"}</span>
              <span className="headless-action-btn__desc">{isEn ? "One-line automated shell deploy" : "Script 1-ligne automatisé"}</span>
            </div>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "tauri"}
            className={`headless-action-btn ${activeTab === "tauri" ? "is-active" : ""}`}
            onClick={() => setActiveTab("tauri")}
          >
            <div className="headless-action-btn__icon-wrap">
              <NetworkIcon size={16} />
            </div>
            <div className="headless-action-btn__text">
              <span className="headless-action-btn__title">{isEn ? "Bobine Assistant (Tauri)" : "Bobine Assistant (Tauri)"}</span>
              <span className="headless-action-btn__desc">{isEn ? "Network discovery & desktop wizard" : "Découverte réseau & wizard guidé"}</span>
            </div>
          </button>
        </div>
      </div>

      {/* Contenu interactif selon l'onglet sélectionné */}
      <div className="headless-section__content">
        {activeTab === "bash" ? (
          <TerminalDemo locale={locale} />
        ) : (
          <TauriDemo locale={locale} />
        )}
      </div>
    </section>
  );
}
