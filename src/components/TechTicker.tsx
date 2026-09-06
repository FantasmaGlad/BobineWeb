"use client";

import type { Locale } from "@/lib/i18n";

interface TickerMetric {
  tag: string;
  label: string;
  value: string;
}

const METRICS_FR: TickerMetric[] = [
  { tag: "ÉCONOMIE", label: "Gain financier", value: "Économisez 1 500 € à 3 000 € / an par salle (Zéro redevance)" },
  { tag: "COÛT", label: "Abonnement logiciel", value: "0 € / mois · Licence libre AGPL-3.0 (Zéro coût caché)" },
  { tag: "GPU", label: "Décodage matériel", value: "VA-API double support Intel QuickSync (iHD) & AMD Radeon (Mesa)" },
  { tag: "CPU", label: "Charge processeur", value: "< 8% en lecture 1080p60 (Zéro saccade)" },
  { tag: "MATÉRIEL", label: "Mini PC Référence", value: "Dell Wyse 5070 (Intel) / HP EliteDesk 705 (AMD) ~40-70 €" },
  { tag: "ÉNERGIE", label: "Consommation globale", value: "< 10 Watts en lecture (Éco-responsable)" },
  { tag: "CATALOGUE", label: "Liberté des cours", value: "100% Agnostique (Cycling, HIIT, Yoga, Pilates, cours maison)" },
  { tag: "SAUVEGARDE", label: "Export & restauration", value: "Archive ZIP en 1 clic avec vérification d'intégrité SQLite" },
  { tag: "MULTI-ÉCRANS", label: "Sorties indépendantes", value: "Écran HDMI câblé + Écran réseau simultanés" },
  { tag: "TÉLÉCOMMANDE", label: "Contrôle en salle", value: "Sans fil 2.4 GHz (Clavier HID) + Web App mobile QR-code" },
  { tag: "KIOSQUE", label: "Borne adhérents", value: "Tactile plein écran + Décompte créneau à la demande" },
  { tag: "COACH AUDIO", label: "Diffusion hybride", value: "Pistes voix synchronisées sur fonds visuels animés" },
  { tag: "SONO", label: "Radio plateau 24/7", value: "Fondu enchaîné Web Audio + Rappels vocaux de bienséance" },
  { tag: "RÉSEAU", label: "Mode de diffusion", value: "100% Hors-ligne · Découverte mDNS (bobine.local)" },
  { tag: "LATENCE", label: "Bus temps réel", value: "WebSockets + Redis (< 2 ms sur le LAN Wi-Fi)" },
  { tag: "RÉSILIENCE", label: "Watchdog systemd", value: "Sonde /api/health et relance automatique en < 1s" },
  { tag: "REPRISE", label: "Coupure secteur", value: "Rétablissement autonome au démarrage sans intervention" },
  { tag: "CONFIDENTIALITÉ", label: "Protection RGPD", value: "Zéro collecte · Zéro caméra/micro · Données 100% locales" },
  { tag: "INSTALLATION", label: "Déploiement rapide", value: "1 ligne (curl bobine.fit/install.sh) · Stack Linux / FastAPI / MPV" },
  { tag: "STACK", label: "Architecture", value: "Debian 13 · FastAPI · SQLite · Redis · Chromium X11" },
  { tag: "LICENCE", label: "Souveraineté", value: "AGPL-3.0 (Code source 100% ouvert et auditable)" },
];

const METRICS_EN: TickerMetric[] = [
  { tag: "SAVINGS", label: "Financial gain", value: "Save $1,500 to $3,000 / year per studio (Zero royalties)" },
  { tag: "COST", label: "Software license", value: "$0 / month · Free AGPL-3.0 license (Zero hidden fees)" },
  { tag: "GPU", label: "Hardware decoding", value: "Dual VA-API support for Intel QuickSync (iHD) & AMD Radeon (Mesa)" },
  { tag: "CPU", label: "Processor load", value: "< 8% CPU in 1080p60 playback (Zero stutter)" },
  { tag: "HARDWARE", label: "Reference mini PC", value: "Dell Wyse 5070 (Intel) / HP EliteDesk 705 (AMD) ~$40-70" },
  { tag: "POWER", label: "Power consumption", value: "< 10 Watts active draw (Eco-friendly)" },
  { tag: "CATALOG", label: "Content freedom", value: "100% Agnostic (Indoor cycling, HIIT, Yoga, Pilates, custom videos)" },
  { tag: "BACKUP", label: "Export & restore", value: "1-click ZIP archive with SQLite integrity checks" },
  { tag: "MULTI-SCREEN", label: "Independent outputs", value: "Simultaneous wired HDMI + Network screen feeds" },
  { tag: "REMOTE", label: "Playout control", value: "2.4 GHz wireless HID remotes + Local Wi-Fi QR web app" },
  { tag: "KIOSK", label: "Member on-demand", value: "Fullscreen touch kiosk with live class countdown" },
  { tag: "AUDIO COACH", label: "Hybrid sessions", value: "Synchronized vocal tracks with animated visual loops" },
  { tag: "AUDIO", label: "Gym Radio 24/7", value: "Web Audio crossfade + Automated gym etiquette voice alerts" },
  { tag: "NETWORK", label: "Playout resilience", value: "100% Offline-first · mDNS discovery (bobine.local)" },
  { tag: "LATENCY", label: "Real-time bus", value: "WebSockets + Redis (< 2 ms on local LAN)" },
  { tag: "WATCHDOG", label: "Health supervisor", value: "systemd /api/health watchdog with auto-recovery in < 1s" },
  { tag: "UPTIME", label: "Blackout recovery", value: "Autonomous boot & playout restoration post power cut" },
  { tag: "PRIVACY", label: "GDPR Compliance", value: "Zero tracking · Zero camera/mic · 100% Local data" },
  { tag: "INSTALLATION", label: "Quick deployment", value: "1-line command (curl bobine.fit/install.sh) · Linux / FastAPI / MPV stack" },
  { tag: "STACK", label: "Technology", value: "Debian 13 · FastAPI · SQLite · Redis · Chromium X11" },
  { tag: "LICENSE", label: "Sovereignty", value: "AGPL-3.0 (100% Open source & auditable)" },
];

export default function TechTicker({ locale }: { locale: Locale }) {
  const metrics = locale === "en" ? METRICS_EN : METRICS_FR;

  return (
    <div
      className="tech-ticker-wrapper"
      role="region"
      aria-label={locale === "en" ? "Technical specifications stream" : "Flux de spécifications techniques en continu"}
    >
      <div className="tech-ticker-track">
        {/* Double défilement pour boucle infinie fluide */}
        <div className="tech-ticker-content">
          {metrics.map((item, idx) => (
            <div key={`m1-${idx}`} className="tech-ticker-item">
              <span className="tech-ticker-tag">
                {item.tag}
              </span>
              <span className="tech-ticker-label">{item.label} :</span>
              <span className="tech-ticker-value">{item.value}</span>
              <span className="tech-ticker-separator">·</span>
            </div>
          ))}
        </div>

        <div className="tech-ticker-content" aria-hidden="true">
          {metrics.map((item, idx) => (
            <div key={`m2-${idx}`} className="tech-ticker-item">
              <span className="tech-ticker-tag">
                {item.tag}
              </span>
              <span className="tech-ticker-label">{item.label} :</span>
              <span className="tech-ticker-value">{item.value}</span>
              <span className="tech-ticker-separator">·</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
