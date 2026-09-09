"use client";

import type { Locale } from "@/lib/i18n";

interface TickerMetric {
  tag: string;
  label: string;
  value: string;
}

const METRICS_FR: TickerMetric[] = [
  { tag: "ANDROID", label: "Application native", value: "Sortie officielle Bobine-3.0.2.apk (Chaquopy, double affichage tactile / HDMI)" },
  { tag: "ACCÉLÉRATION GPU", label: "Réencodage matériel", value: "MediaCodec (Android), VideoToolbox (Apple Silicon) & VA-API (Linux)" },
  { tag: "MAXI PREMIUM", label: "Résolutions natives", value: "Conservation stricte du 2K (1440p) et 4K (2160p) sans sous-échantillonnage" },
  { tag: "ANNULATION", label: "Imports réactifs", value: "Arrêt immédiat FFmpeg en 1 clic (Croix), purge des temporaires & ETA temps réel" },
  { tag: "ÉCONOMIE", label: "Gain financier", value: "Économisez 1 500 € à 3 000 € / an par salle (Zéro redevance)" },
  { tag: "COÛT", label: "Abonnement logiciel", value: "0 € / mois · Licence libre AGPL-3.0 (Zéro coût caché)" },
  { tag: "DÉPÔT APT", label: "Linux Debian & Ubuntu", value: "Dépôt officiel apt.bobine.fit signé GPG RSA 4096 (apt install bobine)" },
  { tag: "CANAUX", label: "Programme Bêta", value: "Double canal Stable (Vx.y.z) et Bêta Rolling avec retour arrière en 1 clic sans perte" },
  { tag: "ASSISTANT", label: "Orchestrateur Tauri 2", value: "Scan réseau complet (tous appareils, DNS inverse) & import de clé SSH native" },
  { tag: "GPU", label: "Décodage matériel", value: "VA-API double support Intel QuickSync (iHD) & AMD Radeon (Mesa)" },
  { tag: "CPU", label: "Charge processeur", value: "< 8% en lecture 1080p60 (Zéro saccade)" },
  { tag: "MATÉRIEL", label: "Mini PC Référence", value: "Dell Wyse 5070 (Intel) / HP EliteDesk 705 (AMD) ~40-70 €" },
  { tag: "ÉNERGIE", label: "Consommation globale", value: "< 10 Watts en lecture (Éco-responsable)" },
  { tag: "MULTI-FENÊTRES", label: "Démarrage bureau", value: "Ouverture simultanée du tableau de bord et du kiosque câblé (Win, Mac, Linux)" },
  { tag: "CATALOGUE", label: "Liberté des cours", value: "100% Agnostique (Cycling, HIIT, Yoga, Pilates, cours maison)" },
  { tag: "SAUVEGARDE", label: "Export & restauration", value: "Archive ZIP en 1 clic avec vérification d'intégrité SQLite" },
  { tag: "MULTI-ÉCRANS", label: "Sorties indépendantes", value: "Écran HDMI câblé + Écran réseau simultanés" },
  { tag: "TÉLÉCOMMANDE", label: "Contrôle en salle", value: "Sans fil 2.4 GHz (Clavier HID) + Web App mobile QR-code" },
  { tag: "KIOSQUE", label: "Borne adhérents", value: "Tactile plein écran + Décompte créneau à la demande" },
  { tag: "COACH AUDIO", label: "Diffusion hybride", value: "Pistes voix synchronisées sur fonds visuels animés" },
  { tag: "SONO", label: "Radio plateau 24/7", value: "Fondu enchaîné Web Audio + Rappels vocaux de bienséance" },
  { tag: "RÉSEAU", label: "URLs dynamiques", value: "Calcul en direct des URLs locales par IP réseau (100% Hors-ligne)" },
  { tag: "LATENCE", label: "Bus temps réel", value: "WebSockets locaux (< 2 ms sur le LAN Wi-Fi)" },
  { tag: "RÉSILIENCE", label: "Watchdog systemd", value: "Sonde /api/health et relance automatique en < 1s" },
  { tag: "REPRISE", label: "Coupure secteur", value: "Rétablissement autonome au démarrage sans intervention" },
  { tag: "CONFIDENTIALITÉ", label: "Protection RGPD", value: "Zéro collecte · Zéro caméra/micro · Données 100% locales" },
  { tag: "INSTALLATION", label: "Déploiement rapide", value: "1 ligne (curl bobine.fit/install.sh) · Canaux --channel=stable|beta" },
  { tag: "STACK", label: "Architecture", value: "Debian 13 · FastAPI · SQLite · Chromium X11" },
  { tag: "LICENCE", label: "Souveraineté", value: "AGPL-3.0 (Code source 100% ouvert et auditable)" },
  { tag: "FEUILLE DE ROUTE", label: "Tablettes tactiles", value: "Android natif disponible · iPadOS (piste prospective)" },
];

const METRICS_EN: TickerMetric[] = [
  { tag: "ANDROID", label: "Native application", value: "Official Bobine-3.0.2.apk release (Chaquopy, dual tactile / HDMI displays)" },
  { tag: "GPU ACCELERATION", label: "Hardware transcoding", value: "MediaCodec (Android), VideoToolbox (Apple Silicon) & VA-API (Linux)" },
  { tag: "MAXI PREMIUM", label: "Native resolutions", value: "Strict 2K (1440p) and 4K (2160p) preservation without downscaling" },
  { tag: "CANCELLATION", label: "Reactive imports", value: "1-click instant FFmpeg cancel, orphan temp purge & live remaining ETA" },
  { tag: "SAVINGS", label: "Financial gain", value: "Save $1,500 to $3,000 / year per studio (Zero royalties)" },
  { tag: "COST", label: "Software license", value: "$0 / month · Free AGPL-3.0 license (Zero hidden fees)" },
  { tag: "APT REPO", label: "Linux Debian & Ubuntu", value: "Official GPG-signed apt.bobine.fit repository (apt install bobine)" },
  { tag: "CHANNELS", label: "Beta program", value: "Dual Stable (Vx.y.z) and Rolling Beta channels with 1-click zero-loss downgrade" },
  { tag: "ASSISTANT", label: "Tauri 2 orchestrator", value: "Full LAN discovery (all devices, reverse DNS) & native SSH key import" },
  { tag: "GPU", label: "Hardware decoding", value: "Dual VA-API support for Intel QuickSync (iHD) & AMD Radeon (Mesa)" },
  { tag: "CPU", label: "Processor load", value: "< 8% CPU in 1080p60 playback (Zero stutter)" },
  { tag: "HARDWARE", label: "Reference mini PC", value: "Dell Wyse 5070 (Intel) / HP EliteDesk 705 (AMD) ~$40-70" },
  { tag: "POWER", label: "Power consumption", value: "< 10 Watts active draw (Eco-friendly)" },
  { tag: "MULTI-WINDOW", label: "Desktop startup", value: "Simultaneous launch of admin dashboard and wired kiosk window (Win, Mac, Linux)" },
  { tag: "CATALOG", label: "Content freedom", value: "100% Agnostic (Indoor cycling, HIIT, Yoga, Pilates, custom videos)" },
  { tag: "BACKUP", label: "Export & restore", value: "1-click ZIP archive with SQLite integrity checks" },
  { tag: "MULTI-SCREEN", label: "Independent outputs", value: "Simultaneous wired HDMI + Network screen feeds" },
  { tag: "REMOTE", label: "Playout control", value: "2.4 GHz wireless HID remotes + Local Wi-Fi QR web app" },
  { tag: "KIOSK", label: "Member on-demand", value: "Fullscreen touch kiosk with live class countdown" },
  { tag: "AUDIO COACH", label: "Hybrid sessions", value: "Synchronized vocal tracks with animated visual loops" },
  { tag: "AUDIO", label: "Gym Radio 24/7", value: "Web Audio crossfade + Automated gym etiquette voice alerts" },
  { tag: "NETWORK", label: "Dynamic URLs", value: "Live local IP network URL calculation (100% Offline-first)" },
  { tag: "LATENCY", label: "Real-time bus", value: "Local WebSockets (< 2 ms on local LAN)" },
  { tag: "WATCHDOG", label: "Health supervisor", value: "systemd /api/health watchdog with auto-recovery in < 1s" },
  { tag: "UPTIME", label: "Blackout recovery", value: "Autonomous boot & playout restoration post power cut" },
  { tag: "PRIVACY", label: "GDPR Compliance", value: "Zero tracking · Zero camera/mic · 100% Local data" },
  { tag: "INSTALLATION", label: "Quick deployment", value: "1-line command (curl bobine.fit/install.sh) · --channel=stable|beta" },
  { tag: "STACK", label: "Technology", value: "Debian 13 · FastAPI · SQLite · Chromium X11" },
  { tag: "LICENSE", label: "Sovereignty", value: "AGPL-3.0 (100% Open source & auditable)" },
  { tag: "ROADMAP", label: "Touch tablets", value: "Native Android released · iPadOS (exploratory track)" },
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
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
