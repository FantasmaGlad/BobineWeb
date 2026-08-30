"use client";

import { useState } from "react";
import InteractiveTerminal from "@/components/InteractiveTerminal";
import DownloadPdfButton from "@/components/DownloadPdfButton";
import ShareButton from "@/components/ShareButton";
import type { Locale } from "@/lib/i18n";

interface FaqItem {
  q: string;
  a: string;
  category: "license" | "compare" | "hardware" | "offline";
}

const FAQ_ITEMS: Record<Locale, FaqItem[]> = {
  fr: [
    {
      category: "license",
      q: "Bobine est-il vraiment 100% gratuit et sans redevance ?",
      a: "Oui. Logiciel libre sous licence AGPL-3.0 : aucun abonnement, aucune redevance par écran, aucun compte obligatoire. Vous êtes l'unique propriétaire de votre matériel et de vos médias.",
    },
    {
      category: "compare",
      q: "En quoi Bobine diffère-t-il d'un outil d'affichage publicitaire / dynamique (Anthias, Screenly, Xibo, Yodeck) ?",
      a: "Les outils d'affichage dynamique généralistes font défiler des diaporamas ou des pages web en boucle, mais ils ne sont pas adaptés aux studios de fitness : pas d'allumage TV par HDMI-CEC synchronisé à la seconde, pas de borne tactile membre pour lancer un cours à la demande, pas de télécommande smartphone par QR code et pas de radio 24/7 avec fondu sonore. Bobine est spécialement pensé comme une régie de cours collectifs.",
    },
    {
      category: "compare",
      q: "En quoi Bobine remplace-t-il Les Mills Cinema, Wexer ou Spivi ?",
      a: "Même expérience haut de gamme en salle (cours planifiés, borne tactile membre à la demande, diffusion 1080p60/4K), mais sans abonnement exorbitant (0 € vs 150-400 €/mois) et sans catalogue imposé. Vous êtes propriétaire de vos appareils et tout tourne 100% hors-ligne sur SSD local.",
    },
    {
      category: "offline",
      q: "Ai-je besoin d'une connexion internet pour faire tourner Bobine au quotidien ?",
      a: "Non, pas au quotidien. Internet n'est requis qu'une seule fois lors de l'installation initiale pour télécharger les paquets Debian. Ensuite, la salle diffuse ses cours de manière 100% autonome.",
    },
    {
      category: "hardware",
      q: "Quel matériel informatique faut-il acheter ?",
      a: "Un mini PC x86-64 standard : Intel (Dell Wyse 5070 Celeron J4105 ~40-50 €, Lenovo ThinkCentre Tiny, Beelink N100) ou AMD (HP EliteDesk 705 G4/G5 Ryzen 3/5 Pro ~60-80 €, Lenovo M715q), 4 à 8 Go de RAM, et un écran HDMI standard.",
    },
    {
      category: "hardware",
      q: "Que se passe-t-il en cas de coupure de courant ou de plantage ?",
      a: "Un chien de garde systemd surveille en continu la santé des services et relance automatiquement les composants en cas d'anomalie. Les services redémarrent instantanément et de façon autonome dès le retour du courant électrique.",
    },
  ],
  en: [
    {
      category: "license",
      q: "Is Bobine truly 100% free with no recurring fees?",
      a: "Yes. Free and open-source software under the copyleft AGPL-3.0 license. Zero subscription fees, zero royalties per screen, and no user accounts. Your only investment is standard refurbished hardware.",
    },
    {
      category: "compare",
      q: "How does Bobine differ from general digital signage tools (Anthias, Screenly, Xibo, Yodeck)?",
      a: "General digital signage players loop slides and ad banners, but lack fitness-specific features: automated HDMI-CEC TV wake/standby synchronized to timetables, interactive touch member kiosk, QR-code smartphone remote, and 24/7 background audio with voice crossfade. Bobine is purpose-built for gym studio playout.",
    },
    {
      category: "compare",
      q: "How does Bobine replace proprietary systems like Les Mills Cinema, Wexer, or Spivi?",
      a: "Same premium studio workout experience — automated weekly timetables, on-demand member touchscreen kiosk, 1080p60/4K playout — without recurring monthly fees ($0 vs $150-$400/mo) or locked catalogs. You own your devices, and playback is 100% offline from local SSD.",
    },
    {
      category: "offline",
      q: "Do I need an active internet connection to run Bobine for daily operations?",
      a: "No, not for daily operations. Internet is only required once during the initial setup. Afterwards, your gym plays workout videos entirely offline from local storage.",
    },
    {
      category: "hardware",
      q: "What hardware do I need to equip my gym?",
      a: "A standard refurbished x86-64 mini PC: Intel (Dell Wyse 5070 Celeron J4105 ~40-50 EUR, Lenovo ThinkCentre Tiny, Beelink N100) or AMD (HP EliteDesk 705 G4/G5 Ryzen 3/5 Pro ~60-80 EUR, Lenovo M715q), 4-8GB RAM, and an HDMI TV display.",
    },
    {
      category: "hardware",
      q: "What happens if there is a power cut or system crash?",
      a: "A local systemd supervisor continuously monitors process health and restarts failing components automatically. All services boot autonomously upon power restoration after a blackout.",
    },
  ],
};

const TROUBLESHOOTING_ROWS = {
  fr: [
    {
      issue: "http://bobine.local inaccessible",
      cause: "La box / routeur bloque le protocole mDNS (Bonjour)",
      solution: "Utilisez l'IP locale (ex: http://192.168.1.50). Tapez 'hostname -I' sur le mini PC pour la connaître.",
    },
    {
      issue: "Écran noir sur la TV en HDMI",
      cause: "Le kiosque Chromium a rencontré une anomalie X11 au démarrage",
      solution: "Relancez avec 'sudo systemctl restart bobine-kiosk'. Vérifiez le câble HDMI.",
    },
    {
      issue: "Pas de son sur la TV ou la sono",
      cause: "Sortie audio HDMI muette ou mal routée",
      solution: "Ouvrez 'alsamixer' pour démuter l'HDMI, ou définissez la sortie avec 'pactl set-default-sink'.",
    },
    {
      issue: "Vidéo saccadée / CPU saturé (>30%)",
      cause: "Accélération matérielle VA-API inactive",
      solution: "Vérifiez avec 'vainfo'. Installez le pilote adapté : intel-media-va-driver-non-free (Intel) ou mesa-va-drivers (AMD Radeon).",
    },
    {
      issue: "Conflit de port 8000 / 8001",
      cause: "Un ancien processus orphelin occupe le port web",
      solution: "Tuez le processus bloquant avec 'sudo fuser -k 8000/tcp' puis relancez les services.",
    },
    {
      issue: "La TV ne s'allume pas en HDMI-CEC",
      cause: "Option CEC désactivée sur la TV ou droits utilisateur",
      solution: "Activez le CEC (Anynet+, Bravia Sync, Simplink) dans le menu TV. Ajoutez l'utilisateur : 'sudo usermod -aG video,dialout $USER'.",
    },
  ],
  en: [
    {
      issue: "http://bobine.local unreachable",
      cause: "Router / Wi-Fi blocks mDNS (Bonjour)",
      solution: "Use direct IP address (e.g. http://192.168.1.50). Run 'hostname -I' on the mini PC to find it.",
    },
    {
      issue: "Black screen on wired TV",
      cause: "Chromium kiosk encountered an X11 launch issue",
      solution: "Run 'sudo systemctl restart bobine-kiosk'. Check HDMI cable connection.",
    },
    {
      issue: "No sound through HDMI / Speakers",
      cause: "Audio sink misconfigured or muted",
      solution: "Run 'alsamixer' to unmute HDMI, or set default sink via 'pactl set-default-sink'.",
    },
    {
      issue: "Video stutter / high CPU load (>30%)",
      cause: "VA-API hardware acceleration disabled",
      solution: "Run 'vainfo'. Verify intel-media-va-driver-non-free (Intel) or mesa-va-drivers (AMD Radeon) is installed.",
    },
    {
      issue: "Port 8000 / 8001 Conflict",
      cause: "Stale process holding web server port",
      solution: "Kill lingering processes with 'sudo fuser -k 8000/tcp' and restart services.",
    },
    {
      issue: "TV does not power on via HDMI-CEC",
      cause: "CEC disabled in TV settings or missing user group permissions",
      solution: "Enable HDMI-CEC (Anynet+, Bravia Sync, Simplink) in TV menu. Add user: 'sudo usermod -aG video,dialout $USER'.",
    },
  ],
};

export default function DocsFaqView({ locale }: { locale: Locale }) {
  const isEn = locale === "en";
  const [mainTab, setMainTab] = useState<"faq" | "troubleshoot" | "all">("faq");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [openIndexes, setOpenIndexes] = useState<Record<number, boolean>>({ 0: true, 1: true, 2: true, 3: true, 4: true, 5: true });

  const toggleQuestion = (idx: number) => {
    setOpenIndexes((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const faqList = FAQ_ITEMS[locale] || FAQ_ITEMS.fr;
  const filteredFaq = selectedCategory === "all"
    ? faqList
    : faqList.filter((item) => item.category === selectedCategory);

  const troubleList = TROUBLESHOOTING_ROWS[locale] || TROUBLESHOOTING_ROWS.fr;

  return (
    <>
      {/* En-tête */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem", marginBottom: "1.25rem" }}>
        <div>
          <span className="feature-category-label">
            {isEn ? "Support & Knowledge Base" : "Support & Connaissances"}
          </span>
          <h1 style={{ margin: 0, fontSize: "clamp(1.75rem, 3.5vw, 2.4rem)", fontWeight: 800, color: "var(--text-heading)", letterSpacing: "-0.02em" }}>
            {isEn ? "FAQ & Troubleshooting" : "FAQ & Dépannage"}
          </h1>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <DownloadPdfButton locale={locale} chapterId="faq" />
          <ShareButton
            locale={locale}
            pathname="/documentation/faq"
            title={isEn ? "Bobine FAQ & Troubleshooting" : "FAQ & Dépannage Bobine"}
            description={isEn ? "Answers to common questions and troubleshooting guide for Bobine." : "Réponses aux questions fréquentes et guide de résolution des erreurs."}
          />
        </div>
      </div>

      <p style={{ color: "var(--text-muted)", fontSize: "1.025rem", lineHeight: 1.6, margin: "0 0 1.5rem 0" }}>
        {isEn
          ? "Find fast answers to frequently asked questions and step-by-step diagnostic solutions for common hardware and network inquiries."
          : "Retrouvez les réponses aux questions fréquentes ainsi que les solutions pas-à-pas pour diagnostiquer et résoudre rapidement vos besoins d'exploitation."}
      </p>

      {/* Onglets principaux de navigation */}
      <div
        role="tablist"
        aria-label={isEn ? "FAQ Sections" : "Sections FAQ"}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          paddingBottom: "0.75rem",
          marginBottom: "1.75rem",
          borderBottom: "1px solid var(--border-subtle)",
          overflowX: "auto",
          WebkitOverflowScrolling: "touch",
        }}
      >
        <button
          type="button"
          role="tab"
          aria-selected={mainTab === "faq"}
          onClick={() => setMainTab("faq")}
          className="stepper-mode-btn"
          style={{
            padding: "0.5rem 1rem",
            borderRadius: "0.5rem",
            fontSize: "0.875rem",
            fontWeight: 700,
            cursor: "pointer",
            background: mainTab === "faq" ? "var(--accent-primary)" : "var(--bg-surface)",
            color: mainTab === "faq" ? "var(--accent-primary-fg)" : "var(--text-muted)",
            border: `1px solid ${mainTab === "faq" ? "var(--accent-primary)" : "var(--border-subtle)"}`,
            transition: "all 0.15s ease",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.45rem",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          <span>{isEn ? "1. Frequently Asked Questions" : "1. Questions Fréquemment Posées"}</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={mainTab === "troubleshoot"}
          onClick={() => setMainTab("troubleshoot")}
          className="stepper-mode-btn"
          style={{
            padding: "0.5rem 1rem",
            borderRadius: "0.5rem",
            fontSize: "0.875rem",
            fontWeight: 700,
            cursor: "pointer",
            background: mainTab === "troubleshoot" ? "var(--accent-primary)" : "var(--bg-surface)",
            color: mainTab === "troubleshoot" ? "var(--accent-primary-fg)" : "var(--text-muted)",
            border: `1px solid ${mainTab === "troubleshoot" ? "var(--accent-primary)" : "var(--border-subtle)"}`,
            transition: "all 0.15s ease",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.45rem",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
          </svg>
          <span>{isEn ? "2. Troubleshooting & Diagnostics" : "2. Dépannage & Diagnostics"}</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={mainTab === "all"}
          onClick={() => setMainTab("all")}
          className="stepper-mode-btn"
          style={{
            padding: "0.5rem 1rem",
            borderRadius: "0.5rem",
            fontSize: "0.875rem",
            fontWeight: 700,
            cursor: "pointer",
            background: mainTab === "all" ? "var(--accent-primary)" : "var(--bg-surface)",
            color: mainTab === "all" ? "var(--accent-primary-fg)" : "var(--text-muted)",
            border: `1px solid ${mainTab === "all" ? "var(--accent-primary)" : "var(--border-subtle)"}`,
            transition: "all 0.15s ease",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.45rem",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="8" y1="6" x2="21" y2="6" />
            <line x1="8" y1="12" x2="21" y2="12" />
            <line x1="8" y1="18" x2="21" y2="18" />
            <line x1="3" y1="6" x2="3.01" y2="6" />
            <line x1="3" y1="12" x2="3.01" y2="12" />
            <line x1="3" y1="18" x2="3.01" y2="18" />
          </svg>
          <span>{isEn ? "View All" : "Tout afficher"}</span>
        </button>
      </div>

      {/* SECTION 1 : QUESTIONS FRÉQUENTES AVEC FILTRES PAR THÈME */}
      {(mainTab === "faq" || mainTab === "all") && (
        <section style={{ marginBottom: "3rem" }}>
          {mainTab === "all" && (
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.25rem", borderBottom: "2px solid var(--accent-primary)", paddingBottom: "0.5rem" }}>
              <h2 style={{ margin: 0, fontSize: "1.35rem", fontWeight: 800, color: "var(--text-heading)" }}>
                {isEn ? "Part 1 — Frequently Asked Questions" : "Partie 1 — Questions Fréquemment Posées"}
              </h2>
            </div>
          )}

          {/* Filtres thématiques par boutons puces */}
          <div style={{ display: "flex", gap: "0.45rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
            {[
              { id: "all", label: isEn ? "All Topics" : "Tous les thèmes" },
              { id: "license", label: isEn ? "Free License & Cost" : "Gratuité & Licence" },
              { id: "compare", label: isEn ? "vs Les Mills / Wexer" : "vs Les Mills & Wexer" },
              { id: "offline", label: isEn ? "100% Offline Autonomy" : "100% Hors-Ligne" },
              { id: "hardware", label: isEn ? "Mini PC Hardware" : "Matériel Mini PC" },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                style={{
                  padding: "0.35rem 0.75rem",
                  borderRadius: "999px",
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  background: selectedCategory === cat.id ? "color-mix(in srgb, var(--accent-primary) 12%, var(--bg-surface))" : "var(--bg-surface)",
                  color: selectedCategory === cat.id ? "var(--accent-primary)" : "var(--text-muted)",
                  border: `1px solid ${selectedCategory === cat.id ? "var(--accent-primary)" : "var(--border-subtle)"}`,
                  transition: "all 0.15s ease",
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Liste épurée des questions/réponses sans boîte-dans-une-boîte */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {filteredFaq.map((item, idx) => {
              const isOpen = !!openIndexes[idx];
              return (
                <article
                  key={item.q}
                  style={{
                    borderBottom: "1px solid var(--border-subtle)",
                    paddingBottom: "1rem",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => toggleQuestion(idx)}
                    style={{
                      width: "100%",
                      textAlign: "left",
                      background: "transparent",
                      border: "none",
                      padding: "0.35rem 0",
                      cursor: "pointer",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "1rem",
                    }}
                  >
                    <h3 style={{ margin: 0, fontSize: "1.05rem", fontWeight: 700, color: "var(--text-heading)", lineHeight: 1.4 }}>
                      {item.q}
                    </h3>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      style={{
                        transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                        transition: "transform 0.2s ease",
                        flexShrink: 0,
                        color: "var(--text-muted)",
                      }}
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>

                  {isOpen && (
                    <div style={{ marginTop: "0.65rem", color: "var(--text-base)", fontSize: "0.95rem", lineHeight: 1.65 }}>
                      <p style={{ margin: 0 }}>{item.a}</p>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </section>
      )}

      {/* SECTION 2 : TABLEAU DE DÉPANNAGE & DIAGNOSTICS */}
      {(mainTab === "troubleshoot" || mainTab === "all") && (
        <section style={{ marginBottom: "3rem" }}>
          {mainTab === "all" && (
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.25rem", borderBottom: "2px solid var(--accent-primary)", paddingBottom: "0.5rem", paddingTop: "1rem" }}>
              <h2 style={{ margin: 0, fontSize: "1.35rem", fontWeight: 800, color: "var(--text-heading)" }}>
                {isEn ? "Part 2 — Troubleshooting Matrix & Diagnostics" : "Partie 2 — Dépannage & Diagnostics"}
              </h2>
            </div>
          )}

          <h2 id="troubleshooting-matrix" style={{ fontSize: "1.3rem", fontWeight: 750, color: "var(--text-heading)", marginBottom: "0.75rem" }}>
            {isEn ? "Common Error Resolution Matrix" : "Tableau de Résolution des Erreurs Courantes"}
          </h2>

          <div className="docs-table-wrapper">
            <table className="docs-table">
              <thead>
                <tr>
                  <th>{isEn ? "Issue / Symptom" : "Problème / Symptôme"}</th>
                  <th>{isEn ? "Probable Cause" : "Cause probable"}</th>
                  <th>{isEn ? "Step-by-Step Resolution" : "Solution pas-à-pas"}</th>
                </tr>
              </thead>
              <tbody>
                {troubleList.map((row) => (
                  <tr key={row.issue}>
                    <td><code>{row.issue}</code></td>
                    <td>{row.cause}</td>
                    <td>{row.solution}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 id="diagnostic-commands" style={{ fontSize: "1.3rem", fontWeight: 750, color: "var(--text-heading)", marginTop: "2rem", marginBottom: "0.75rem" }}>
            {isEn ? "Interactive Diagnostic Console" : "Commandes de Diagnostic & Résolution Interactive"}
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>
            {isEn
              ? "Simulate diagnostic checks or run them over SSH directly on your Bobine mini PC:"
              : "Simulez les vérifications de diagnostic ou exécutez-les via SSH directement sur votre mini PC Bobine :"}
          </p>

          <InteractiveTerminal
            locale={locale}
            preset="troubleshooting"
            title={isEn ? "bash — bobine diagnostic console" : "bash — console de diagnostic bobine"}
          />

          <div className="docs-callout docs-callout--tip" style={{ marginTop: "2rem" }}>
            <div className="docs-callout__content">
              <div className="docs-callout__title">{isEn ? "Interactive AI Assistant & Community Support" : "Assistant IA Baamix & Support Communautaire"}</div>
              <div>
                {isEn ? (
                  <>You can ask technical questions to our AI assistant Baamix using the chat widget on the right, or open a ticket on <a href="https://github.com/FantasmaGlad/Bobine/issues" target="_blank" rel="noreferrer">GitHub Issues</a>.</>
                ) : (
                  <>Vous pouvez poser vos questions techniques directement à Baamix via la bulle de discussion à droite, ou ouvrir un ticket sur <a href="https://github.com/FantasmaGlad/Bobine/issues" target="_blank" rel="noreferrer">GitHub Issues</a>.</>
                )}
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
