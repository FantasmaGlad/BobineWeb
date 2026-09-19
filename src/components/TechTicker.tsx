"use client";

import { usePathname } from "next/navigation";
import type { Locale } from "@/lib/i18n";

interface TickerMetric {
  tag: string;
  label: string;
  value: string;
}

const METRICS_FR: TickerMetric[] = [
  { tag: "ÉCONOMIE", label: "Gain financier", value: "Économisez 1 500 € à 3 000 € / an par studio (Zéro redevance logicielle)" },
  { tag: "SANS ABONNEMENT", label: "Coût d'usage", value: "0 € / mois · Logiciel libre sans engagement, sans coût caché" },
  { tag: "CODE OUVERT", label: "Transparence totale", value: "Code source public sur GitHub : auditable par n'importe qui, aucune boîte noire" },
  { tag: "MAC & MAC MINI", label: "Régie studio", value: "Idéal en studio sous macOS : silence quasi total, double écran HDMI & démarrage automatique" },
  { tag: "APPLE SILICON", label: "Puces M4 à M6", value: "Optimisé Apple Silicon : fluidité 4K instantanée sans aucune surchauffe" },
  { tag: "MINI PC VÉRIFIÉ", label: "Matériel accessible", value: "Mini PC reconditionné vérifié (HP EliteDesk, industriel fanless) dès 161 €" },
  { tag: "GUIDE VÉRIFIÉ", label: "Achats Amazon", value: "Chaque produit du guide matériel est vérifié à la main : ASIN réel, prix constaté, photo authentique" },
  { tag: "PC DÉJÀ POSSÉDÉ", label: "Zéro rachat", value: "Pas besoin d'acheter : fermez votre PC portable existant en mode clamshell et branchez un simple hub" },
  { tag: "ACCÉLÉRATION GRAPHIQUE", label: "Décodage fluide", value: "Décodage matériel ultra-rapide : lecture 4K et 2K 60 fps sans saccade" },
  { tag: "100% HORS-LIGNE", label: "Résilience fibre", value: "Fonctionne sans Internet : immunisé contre les pannes de réseau" },
  { tag: "BORNE TACTILE", label: "Libre accès", value: "Kiosque tactile adhérents avec décompte des créneaux à la demande" },
  { tag: "MULTI-ÉCRANS", label: "Double diffusion", value: "Diffusion simultanée : grand écran cours en salle + téléviseurs plateau" },
  { tag: "RADIO PLATEAU 24/7", label: "Ambiance sonore", value: "Flux musical continu avec fondu sonore et annonces programmées" },
  { tag: "COURS SUR MESURE", label: "Catalogue ouvert", value: "100% Libre : diffusez vos vidéos (Cycling, HIIT, Yoga, Pilates, Renfo)" },
  { tag: "MULTI-OS", label: "Compatibilité", value: "Windows 10/11, macOS, Linux, tablettes Android et étude iPadOS" },
  { tag: "ANDROID NATIF", label: "Application dédiée", value: "Disponible sur tablette tactile pour piloter le studio du bout des doigts" },
  { tag: "DÉPÔT APT LINUX", label: "Mises à jour natives", value: "Paquet .deb signé GPG sur apt.bobine.fit : mises à jour Linux via apt update" },
  { tag: "TÉLÉCOMMANDE SIMPLE", label: "Contrôle en salle", value: "Au choix : télécommande sans fil 2.4 GHz ou smartphone via QR code" },
  { tag: "CONFIDENTIALITÉ", label: "Protection RGPD", value: "100% Local : zéro pistage, zéro caméra, vos données restent dans votre club" },
  { tag: "REPRISE SUR COUPURE", label: "Sécurité électrique", value: "Rétablissement autonome et automatique de la diffusion après coupure secteur" },
  { tag: "SAUVEGARDE EN 1 CLIC", label: "Export universel", value: "Sauvegardez toute votre programmation et vos cours en une archive ZIP" },
  { tag: "ÉCO-RESPONSABLE", label: "Faible consommation", value: "Dès 6 Watts en configuration fanless : discret, économique et durable" },
];

const METRICS_EN: TickerMetric[] = [
  { tag: "SAVINGS", label: "Financial gain", value: "Save €1,500 to €3,000 / year per studio (Zero software royalties)" },
  { tag: "NO SUBSCRIPTION", label: "Software cost", value: "€0 / month · Open-source, zero recurring fees, no vendor lock-in" },
  { tag: "OPEN SOURCE", label: "Full transparency", value: "Public source code on GitHub: auditable by anyone, zero black box" },
  { tag: "MAC & MAC MINI", label: "Studio appliance", value: "Perfect control unit: near-total silence, dual HDMI screens & auto-launch" },
  { tag: "APPLE SILICON", label: "M4 to M6 chips", value: "Apple Silicon tuning: instant 4K playback with zero heat build-up" },
  { tag: "VERIFIED MINI PCS", label: "Accessible hardware", value: "Verified refurbished mini PC (HP EliteDesk, industrial fanless) from €161" },
  { tag: "VERIFIED GUIDE", label: "Amazon purchases", value: "Every hardware guide product is hand-verified: real ASIN, checked price, authentic photo" },
  { tag: "ALREADY OWN A LAPTOP", label: "Zero repurchase", value: "No purchase needed: close your existing laptop in clamshell mode and plug in a simple hub" },
  { tag: "GRAPHICS ACCELERATION", label: "Smooth playback", value: "Hardware-accelerated engine: buttery smooth 4K & 2K 60 fps playback" },
  { tag: "100% OFFLINE", label: "Outage proof", value: "Operates without Internet: resilient against fiber cuts and ISP outages" },
  { tag: "TOUCH KIOSK", label: "Self-service", value: "Member touchscreen with live class countdown and easy selection" },
  { tag: "DUAL SCREENS", label: "Multi-display", value: "Simultaneous feeds: main workout screen + gym floor TVs" },
  { tag: "24/7 GYM RADIO", label: "Background music", value: "Continuous music flow with seamless crossfade and automated voice alerts" },
  { tag: "CUSTOM CONTENT", label: "Catalog freedom", value: "100% Agnostic: play your own workouts (Cycling, HIIT, Yoga, Pilates)" },
  { tag: "MULTI-OS", label: "Cross-platform", value: "Windows 10/11, macOS, Linux, Android tablets and iPadOS exploration" },
  { tag: "NATIVE ANDROID", label: "Dedicated app", value: "Available on touchscreen tablets to control your fitness studio seamlessly" },
  { tag: "LINUX APT REPO", label: "Native updates", value: "GPG-signed .deb package on apt.bobine.fit: native Linux updates via apt update" },
  { tag: "SIMPLE REMOTE", label: "Easy control", value: "Choice of 2.4 GHz wireless clicker or local smartphone QR web app" },
  { tag: "PRIVACY & GDPR", label: "Data sovereignty", value: "100% Local: zero analytics, zero cameras, your data stays in your club" },
  { tag: "BLACKOUT RECOVERY", label: "Electrical resilience", value: "Autonomous auto-recovery and instant playout resume after power outage" },
  { tag: "1-CLICK BACKUP", label: "Universal export", value: "Export and restore your entire schedule and video catalog in a single ZIP" },
  { tag: "ECO-FRIENDLY", label: "Low power draw", value: "From 6 Watts in fanless configuration: silent, cost-effective and eco-friendly" },
];

export default function TechTicker({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const metrics = locale === "en" ? METRICS_EN : METRICS_FR;

  // Le chat plein écran (/baamix) occupe toute la hauteur : pas de bandeau défilant sur cette page.
  if (pathname?.includes("/baamix")) return null;

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
