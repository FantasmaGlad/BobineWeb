"use client";

import type { Locale } from "@/lib/i18n";

interface TickerMetric {
  tag: string;
  label: string;
  value: string;
  status?: "live" | "ok" | "accent" | "warn";
}

const METRICS_FR: TickerMetric[] = [
  { tag: "COÛT", label: "Abonnement logiciel", value: "0 € / mois (Licence libre)", status: "live" },
  { tag: "RÉSEAU", label: "Mode de diffusion", value: "100% Hors-ligne (Zéro buffer)", status: "ok" },
  { tag: "MATÉRIEL", label: "Mini PC Référence", value: "Dell Wyse 5070 (~40-50 €)", status: "accent" },
  { tag: "ÉNERGIE", label: "Consommation globale", value: "< 10 Watts (Sobre)", status: "ok" },
  { tag: "CPU", label: "Charge processeur", value: "< 8% en lecture 1080p60 VA-API", status: "live" },
  { tag: "AFFICHAGE", label: "Contrôle TV", value: "HDMI-CEC Allumage/Veille automatique", status: "accent" },
  { tag: "MOTEUR", label: "Lecteur vidéo", value: "MPV + Intel QuickSync matériel", status: "ok" },
  { tag: "CODECS", label: "Formats supportés", value: "H.264 / HEVC (H.265) / AV1 / VP9", status: "ok" },
  { tag: "SONO", label: "Radio plateau 24/7", value: "Crossfade sans blanc + annonces vocales", status: "accent" },
  { tag: "KIOSQUE", label: "Borne adhérents", value: "Tactile plein écran + Décompte créneau", status: "live" },
  { tag: "MOBILE", label: "Télécommande coach", value: "Scan QR-code local (Zéro appli)", status: "accent" },
  { tag: "RÉSILIENCE", label: "Watchdog systemd", value: "Sonde /api/health + Relance auto 100%", status: "live" },
  { tag: "REPRISE", label: "Coupure secteur", value: "Rétablissement autonome sans intervention", status: "ok" },
  { tag: "LATENCE", label: "WebSockets locaux", value: "< 2 ms sur le LAN Wi-Fi", status: "live" },
  { tag: "STACK", label: "Architecture", value: "Debian 13 · FastAPI · SQLite · Redis", status: "ok" },
  { tag: "LICENCE", label: "Souveraineté", value: "AGPL-3.0 (Code source 100% ouvert)", status: "accent" },
];

const METRICS_EN: TickerMetric[] = [
  { tag: "COST", label: "Software license", value: "$0 / month (100% Free)", status: "live" },
  { tag: "NETWORK", label: "Playout resilience", value: "100% Offline-first (Zero buffer)", status: "ok" },
  { tag: "HARDWARE", label: "Reference mini PC", value: "Dell Wyse 5070 (~$40-50)", status: "accent" },
  { tag: "POWER", label: "Power consumption", value: "< 10 Watts (Ultra low)", status: "ok" },
  { tag: "CPU", label: "Processor load", value: "< 8% CPU in 1080p60 VA-API", status: "live" },
  { tag: "DISPLAY", label: "TV Automation", value: "Native HDMI-CEC Auto-Power/Standby", status: "accent" },
  { tag: "ENGINE", label: "Playout core", value: "MPV + Intel QuickSync acceleration", status: "ok" },
  { tag: "CODECS", label: "Supported video", value: "H.264 / HEVC (H.265) / AV1 / VP9", status: "ok" },
  { tag: "AUDIO", label: "Gym Radio 24/7", value: "Seamless crossfade + vocal alerts", status: "accent" },
  { tag: "KIOSK", label: "Member on-demand", value: "Fullscreen touch + class countdown", status: "live" },
  { tag: "MOBILE", label: "Staff remote", value: "Local Wi-Fi QR scan (No app needed)", status: "accent" },
  { tag: "WATCHDOG", label: "Health supervisor", value: "Systemd watchdog auto-recovery", status: "live" },
  { tag: "UPTIME", label: "Blackout recovery", value: "Instant auto-boot post power cut", status: "ok" },
  { tag: "LATENCY", label: "Local WebSockets", value: "< 2 ms roundtrip on local LAN", status: "live" },
  { tag: "STACK", label: "Technology", value: "Debian 13 · FastAPI · SQLite · Redis", status: "ok" },
  { tag: "LICENSE", label: "Sovereignty", value: "AGPL-3.0 (100% Open Source)", status: "accent" },
];

export default function TechTicker({ locale }: { locale: Locale }) {
  const metrics = locale === "en" ? METRICS_EN : METRICS_FR;

  return (
    <div
      className="tech-ticker-wrapper"
      role="region"
      aria-label={locale === "en" ? "Live technical specifications stream" : "Flux de télémétrie et métriques techniques en continu"}
    >
      <div className="tech-ticker-badge">
        <span className="tech-ticker-badge__dot" />
        <span className="tech-ticker-badge__title">
          {locale === "en" ? "LIVE TELEMETRY" : "TÉLÉMÉTRIE LIVE"}
        </span>
      </div>

      <div className="tech-ticker-track">
        {/* Double défilement pour boucle infinie fluide */}
        <div className="tech-ticker-content">
          {metrics.map((item, idx) => (
            <div key={`m1-${idx}`} className="tech-ticker-item">
              <span className={`tech-ticker-tag tech-ticker-tag--${item.status || "ok"}`}>
                {item.tag}
              </span>
              <span className="tech-ticker-label">{item.label} :</span>
              <span className="tech-ticker-value">{item.value}</span>
              <span className="tech-ticker-separator">{"///"}</span>

            </div>
          ))}
        </div>

        <div className="tech-ticker-content" aria-hidden="true">
          {metrics.map((item, idx) => (
            <div key={`m2-${idx}`} className="tech-ticker-item">
              <span className={`tech-ticker-tag tech-ticker-tag--${item.status || "ok"}`}>
                {item.tag}
              </span>
              <span className="tech-ticker-label">{item.label} :</span>
              <span className="tech-ticker-value">{item.value}</span>
              <span className="tech-ticker-separator">{"///"}</span>

            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
