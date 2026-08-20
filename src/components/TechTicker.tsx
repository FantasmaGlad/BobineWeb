"use client";

import type { Locale } from "@/lib/i18n";

interface TickerMetric {
  tag: string;
  label: string;
  value: string;
}

const METRICS_FR: TickerMetric[] = [
  { tag: "COÛT", label: "Abonnement logiciel", value: "0 € / mois (Licence libre)" },
  { tag: "RÉSEAU", label: "Mode de diffusion", value: "100% Hors-ligne (Zéro buffer)" },
  { tag: "MATÉRIEL", label: "Mini PC Référence", value: "Dell Wyse 5070 (~40-50 €)" },
  { tag: "ÉNERGIE", label: "Consommation globale", value: "< 10 Watts (Sobre)" },
  { tag: "CPU", label: "Charge processeur", value: "< 8% en lecture 1080p60 VA-API" },
  { tag: "AFFICHAGE", label: "Contrôle TV", value: "HDMI-CEC Allumage/Veille auto" },
  { tag: "MOTEUR", label: "Lecteur vidéo", value: "MPV + Intel QuickSync matériel" },
  { tag: "CODECS", label: "Formats supportés", value: "H.264 / HEVC (H.265) / AV1 / VP9" },
  { tag: "SONO", label: "Radio plateau 24/7", value: "Crossfade sans blanc + annonces vocales" },
  { tag: "KIOSQUE", label: "Borne adhérents", value: "Tactile plein écran + Décompte créneau" },
  { tag: "MOBILE", label: "Télécommande coach", value: "Scan QR-code local (Zéro appli)" },
  { tag: "RÉSILIENCE", label: "Watchdog systemd", value: "Sonde /api/health + Relance auto 100%" },
  { tag: "REPRISE", label: "Coupure secteur", value: "Rétablissement autonome sans intervention" },
  { tag: "LATENCE", label: "WebSockets locaux", value: "< 2 ms sur le LAN Wi-Fi" },
  { tag: "STACK", label: "Architecture", value: "Debian 13 · FastAPI · SQLite · Redis" },
  { tag: "LICENCE", label: "Souveraineté", value: "AGPL-3.0 (Code source 100% ouvert)" },
];

const METRICS_EN: TickerMetric[] = [
  { tag: "COST", label: "Software license", value: "$0 / month (100% Free)" },
  { tag: "NETWORK", label: "Playout resilience", value: "100% Offline-first (Zero buffer)" },
  { tag: "HARDWARE", label: "Reference mini PC", value: "Dell Wyse 5070 (~$40-50)" },
  { tag: "POWER", label: "Power consumption", value: "< 10 Watts (Ultra low)" },
  { tag: "CPU", label: "Processor load", value: "< 8% CPU in 1080p60 VA-API" },
  { tag: "DISPLAY", label: "TV Automation", value: "Native HDMI-CEC Auto-Power/Standby" },
  { tag: "ENGINE", label: "Playout core", value: "MPV + Intel QuickSync acceleration" },
  { tag: "CODECS", label: "Supported video", value: "H.264 / HEVC (H.265) / AV1 / VP9" },
  { tag: "AUDIO", label: "Gym Radio 24/7", value: "Seamless crossfade + vocal alerts" },
  { tag: "KIOSK", label: "Member on-demand", value: "Fullscreen touch + class countdown" },
  { tag: "MOBILE", label: "Staff remote", value: "Local Wi-Fi QR scan (No app needed)" },
  { tag: "WATCHDOG", label: "Health supervisor", value: "Systemd watchdog auto-recovery" },
  { tag: "UPTIME", label: "Blackout recovery", value: "Instant auto-boot post power cut" },
  { tag: "LATENCY", label: "Local WebSockets", value: "< 2 ms roundtrip on local LAN" },
  { tag: "STACK", label: "Technology", value: "Debian 13 · FastAPI · SQLite · Redis" },
  { tag: "LICENSE", label: "Sovereignty", value: "AGPL-3.0 (100% Open Source)" },
];

export default function TechTicker({ locale }: { locale: Locale }) {
  const metrics = locale === "en" ? METRICS_EN : METRICS_FR;

  return (
    <div
      className="tech-ticker-wrapper"
      role="region"
      aria-label={locale === "en" ? "Technical specifications stream" : "Flux de spécifications techniques en continu"}
    >
      <div className="tech-ticker-badge" title={locale === "en" ? "Live system stream" : "Flux système actif"}>
        <span className="tech-ticker-badge__dot" />
      </div>

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
