"use client";

import { useState } from "react";
import Link from "next/link";
import type { Locale } from "@/lib/i18n";

interface ProfileData {
  id: string;
  tabTitle: string;
  badge: string;
  headline: string;
  description: string;
  points: Array<{
    title: string;
    detail: string;
  }>;
  ctaText: string;
  ctaHref: string;
}

export default function ProfileTabs({ locale }: { locale: Locale }) {
  const isEn = locale === "en";
  const [activeTab, setActiveTab] = useState<string>("managers");

  const profiles: ProfileData[] = isEn
    ? [
        {
          id: "managers",
          tabTitle: "Gym Managers",
          badge: "Profitability & Autonomy",
          headline: "Zero subscription fees, immediate return on investment",
          description:
            "Stop paying hundreds of euros per month and per screen. Bobine transforms standard refurbished mini PCs into dedicated video streaming players with zero licensing costs.",
          points: [
            {
              title: "0 EUR monthly per screen",
              detail:
                "Free AGPL-3.0 software license. No royalties, no recurring fees, no surprise cost hikes.",
            },
            {
              title: "Affordable hardware (around 40-50 EUR)",
              detail:
                "Runs reliably on standard mini PCs (e.g. Dell Wyse 5070) with power consumption under 10W.",
            },
            {
              title: "Full hardware ownership",
              detail:
                "No locked proprietary boxes. You own your devices, your local storage, and your video files.",
            },
          ],
          ctaText: "Calculate your savings",
          ctaHref: `/${locale}/fonctionnalites`,
        },
        {
          id: "members",
          tabTitle: "Members & Coaches",
          badge: "Zero Downtime & Fluency",
          headline: "Smooth virtual classes, zero buffering during sessions",
          description:
            "Classes launch precisely on schedule without latency. Even if the gym's internet connection fails, videos continue playing flawlessly directly from local storage.",
          points: [
            {
              title: "100% Offline resilience",
              detail:
                "All media files are stored locally on SSD. No buffering, no pixelation, no stopped workouts.",
            },
            {
              title: "Automated weekly schedule",
              detail:
                "Automated countdowns and scheduled start times for Spinning, HIIT, Yoga, Pilates, and Body Sculpt.",
            },
            {
              title: "Automated TV control via HDMI-CEC",
              detail:
                "The screen turns on automatically before the workout and switches to standby at the end.",
            },
          ],
          ctaText: "Discover features",
          ctaHref: `/${locale}/fonctionnalites`,
        },
        {
          id: "opensource",
          tabTitle: "Open Source & Privacy",
          badge: "Sovereignty & Code Auditability",
          headline: "Fully auditable AGPL-3.0 software, local data privacy",
          description:
            "Your gym does not depend on a remote cloud provider. The source code is publicly accessible on GitHub, transparent, and completely free from trackers.",
          points: [
            {
              title: "AGPL-3.0 Copyleft License",
              detail:
                "Guaranteed long-term freedom. Any improvements benefit the entire sports and fitness community.",
            },
            {
              title: "Zero telemetry or surveillance",
              detail:
                "No user tracking, no personal data sent to third parties, strictly privacy-respecting.",
            },
            {
              title: "Standard Linux stack (Ubuntu / Debian)",
              detail:
                "Built on MPV, systemd, and native hardware acceleration (Intel QuickSync / VA-API).",
            },
          ],
          ctaText: "View on GitHub",
          ctaHref: "https://github.com/FantasmaGlad/Bobine",
        },
      ]
    : [
        {
          id: "managers",
          tabTitle: "Gérants de salle",
          badge: "Rentabilité & Maîtrise",
          headline: "0 € d'abonnement mensuel, amortissement immédiat",
          description:
            "Ne payez plus des centaines d'euros chaque mois par écran. Bobine transforme des mini PC reconditionnés standard en régies vidéo autonomes sans aucun coût de licence.",
          points: [
            {
              title: "0 € de redevance par écran",
              detail:
                "Licence libre AGPL-3.0. Aucune commission, aucun abonnement récurrent, aucun verrouillage financier.",
            },
            {
              title: "Matériel économique (~40-50 €)",
              detail:
                "Fonctionne sur mini PC standard (ex. Dell Wyse 5070) avec une consommation électrique inférieure à 10 Watts.",
            },
            {
              title: "Propriétaire de votre matériel",
              detail:
                "Aucun boîtier propriétaire bridé. Vous maîtrisez vos machines, vos disques et vos fichiers vidéo.",
            },
          ],
          ctaText: "Découvrir les fonctionnalités",
          ctaHref: `/${locale}/fonctionnalites`,
        },
        {
          id: "members",
          tabTitle: "Adhérents & Coachs",
          badge: "Zéro Panne & Fluidité",
          headline: "Des cours collectifs fluides, sans coupure en plein effort",
          description:
            "Les cours démarrent à la seconde près selon la grille horaire. Même en cas de coupure de la fibre de la salle, la séance continue sans interruption depuis le stockage local.",
          points: [
            {
              title: "100% Résilient hors-ligne",
              detail:
                "Vidéos stockées en local sur SSD NVMe. Zéro mise en mémoire tampon, zéro écran noir pendant le cours.",
            },
            {
              title: "Planificateur hebdomadaire autonome",
              detail:
                "Lancement automatique des cours de Biking (RPM), HIIT, Yoga, Pilates, Stretching et Cuisses-Abdos-Fessiers.",
            },
            {
              title: "Allumage TV automatique (HDMI-CEC)",
              detail:
                "L'écran s'allume automatiquement 2 minutes avant le cours et se met en veille à la fin de la session.",
            },
          ],
          ctaText: "Voir le guide d'utilisation",
          ctaHref: `/${locale}/documentation/utilisation`,
        },
        {
          id: "opensource",
          tabTitle: "Open Source & Souveraineté",
          badge: "Transparence & Code Libre",
          headline: "Logiciel auditable sous licence AGPL-3.0, données locales",
          description:
            "Votre salle ne dépend d'aucun éditeur tiers ni d'aucun cloud extérieur. Le code source est public sur GitHub, pérenne et exempt de tout traceur.",
          points: [
            {
              title: "Licence libre AGPL-3.0",
              detail:
                "Garantie de liberté et de pérennité. Les améliorations profitent à l'ensemble des salles et clubs indépendants.",
            },
            {
              title: "Zéro télémétrie ni traceur",
              detail:
                "Aucune collecte de données sur les adhérents ou l'usage, respect strict de la confidentialité.",
            },
            {
              title: "Stack Linux standard (Ubuntu / Debian)",
              detail:
                "Basé sur MPV, systemd et le décodage matériel natif Intel QuickSync / VA-API.",
            },
          ],
          ctaText: "Explorer le code sur GitHub",
          ctaHref: "https://github.com/FantasmaGlad/Bobine",
        },
      ];

  const current = profiles.find((p) => p.id === activeTab) || profiles[0];

  return (
    <section className="profile-tabs-section">
      <div className="profile-tabs-nav" role="tablist" aria-label="Profils utilisateurs">
        {profiles.map((profile) => {
          const isActive = profile.id === activeTab;
          return (
            <button
              key={profile.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={`profile-tab-btn ${isActive ? "is-active" : ""}`}
              onClick={() => setActiveTab(profile.id)}
            >
              <span className="profile-tab-btn__title">{profile.tabTitle}</span>
            </button>
          );
        })}
      </div>

      <div className="profile-tab-card" role="tabpanel">
        <div className="profile-tab-card__header">
          <span className="profile-tab-card__badge">{current.badge}</span>
          <h3 className="profile-tab-card__title">{current.headline}</h3>
          <p className="profile-tab-card__desc">{current.description}</p>
        </div>

        <div className="profile-tab-card__grid">
          {current.points.map((pt, idx) => (
            <div key={idx} className="profile-point">
              <div className="profile-point__indicator" />
              <div>
                <h4 className="profile-point__title">{pt.title}</h4>
                <p className="profile-point__detail">{pt.detail}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="profile-tab-card__footer">
          {current.ctaHref.startsWith("http") ? (
            <a
              href={current.ctaHref}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
            >
              {current.ctaText}
              <span aria-hidden="true"> &rarr;</span>
            </a>
          ) : (
            <Link href={current.ctaHref} className="btn-primary">
              {current.ctaText}
              <span aria-hidden="true"> &rarr;</span>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
