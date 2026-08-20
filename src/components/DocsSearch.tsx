"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Locale } from "@/lib/i18n";

interface SearchEntry {
  title: string;
  category: string;
  excerpt: string;
  href: string;
  tags: string[];
}

const SEARCH_DATABASE: Record<Locale, SearchEntry[]> = {
  fr: [
    {
      title: "Matériel requis & prérequis",
      category: "Démarrage rapide",
      excerpt: "Dell Wyse 5070, processeur Intel x86-64, 4 Go de RAM, clé USB 8 Go, câble HDMI et sono.",
      href: "/fr/documentation/demarrage-rapide#ce-quil-vous-faut",
      tags: ["hardware", "wyse", "ram", "cle usb", "materiel", "intel", "sono"],
    },
    {
      title: "Écrire l'image Debian sur clé USB (BalenaEtcher / dd)",
      category: "Installation",
      excerpt: "Flasher Debian 13 netinst avec BalenaEtcher ou la commande dd sous Linux.",
      href: "/fr/documentation/demarrage-rapide#etape-2--ecrire-limage-sur-la-cle-usb",
      tags: ["etcher", "flash", "usb", "debian", "dd", "iso"],
    },
    {
      title: "Installation Debian 13 minimale sans bureau",
      category: "Installation",
      excerpt: "Sélection des paquets : décocher GNOME/bureau, garder uniquement SSH et utilitaires système.",
      href: "/fr/documentation/demarrage-rapide#etape-4--installer-debian",
      tags: ["debian", "trixie", "ssh", "sans bureau", "kiosque"],
    },
    {
      title: "Script d'installation automatisé install.sh",
      category: "Installation",
      excerpt: "Exécuter git clone puis sudo ./install.sh pour installer Redis, Node, Python, MPV et les services systemd.",
      href: "/fr/documentation/demarrage-rapide#etape-6--installer-bobine",
      tags: ["install.sh", "script", "automatique", "systemd", "redis", "fastapi"],
    },
    {
      title: "Accéder à l'interface http://bobine.local",
      category: "Configuration",
      excerpt: "Première connexion depuis un navigateur sur le réseau local ou via l'adresse IP de la machine.",
      href: "/fr/documentation/demarrage-rapide#etape-7--ouvrir-linterface",
      tags: ["mdns", "bobine.local", "ip", "navigateur", "admin"],
    },
    {
      title: "Bibliothèque de cours & import vidéo",
      category: "Utilisation",
      excerpt: "Import par glisser-déposer, catégories libres, génération automatique de miniatures.",
      href: "/fr/documentation/utilisation#bibliotheque",
      tags: ["videos", "import", "mp4", "cours", "bibliotheque"],
    },
    {
      title: "Planificateur de cours hebdomadaire",
      category: "Utilisation",
      excerpt: "Grille horaire avec déclenchement à la seconde et allumage automatique de la télévision.",
      href: "/fr/documentation/utilisation#planification",
      tags: ["planning", "agenda", "cours", "horaires", "semaine"],
    },
    {
      title: "Borne Cinéma Membre & Tactile",
      category: "Utilisation",
      excerpt: "Sélection autonome par les adhérents sur écran tactile ou télécommande.",
      href: "/fr/documentation/utilisation#cinema-membre-borne-a-la-demande",
      tags: ["kiosque", "tactile", "adherent", "a la demande", "cinema"],
    },
    {
      title: "Télécommande smartphone sans installation",
      category: "Utilisation",
      excerpt: "Scan de QR code local sur téléphone pour contrôler le cours à distance (lecture, pause, volume).",
      href: "/fr/documentation/utilisation#telecommande-mobile",
      tags: ["smartphone", "remote", "qr code", "wifi", "volume", "telecommande"],
    },
    {
      title: "Radio d'ambiance 24/7 & alertes vocales",
      category: "Utilisation",
      excerpt: "Diffusion continue avec fondu enchaîné (crossfade) et annonces vocales programmées.",
      href: "/fr/documentation/utilisation#radio",
      tags: ["radio", "musique", "crossfade", "annonces", "voix"],
    },
    {
      title: "Allumage TV automatique HDMI-CEC",
      category: "FAQ",
      excerpt: "Pilote l'allumage et la mise en veille de la TV sans télécommande physique.",
      href: "/fr/documentation/faq#utilisation-quotidienne",
      tags: ["hdmi", "cec", "allumage", "veille", "tv", "ecran"],
    },
    {
      title: "Résilience aux coupures de courant & Chien de garde",
      category: "FAQ",
      excerpt: "Surveillance continue via /api/health et relance automatique autonome après coupure.",
      href: "/fr/documentation/faq#utilisation-quotidienne",
      tags: ["watchdog", "panne", "coupure", "courant", "reprise", "systemd"],
    },
    {
      title: "Architecture FastAPI, Redis, MPV & Next.js",
      category: "Développeurs",
      excerpt: "Détails de la pile logicielle multi-worker, SQLite, verrous distribués et WebSockets.",
      href: "/fr/documentation/developpeurs#architecture-en-bref",
      tags: ["fastapi", "python", "redis", "mpv", "sqlite", "architecture", "developpeurs"],
    },
  ],
  en: [
    {
      title: "Required Hardware & Prerequisites",
      category: "Quick Start",
      excerpt: "Dell Wyse 5070, Intel x86-64 CPU, 4GB RAM, 8GB USB drive, HDMI cable, and gym sound system.",
      href: "/en/documentation/demarrage-rapide#what-you-need",
      tags: ["hardware", "wyse", "ram", "usb", "intel", "sound", "amp"],
    },
    {
      title: "Write Debian ISO to USB (BalenaEtcher / dd)",
      category: "Installation",
      excerpt: "Flash Debian 13 netinst with BalenaEtcher or Linux dd command.",
      href: "/en/documentation/demarrage-rapide#step-2--write-image-to-usb-drive",
      tags: ["etcher", "flash", "usb", "debian", "dd", "iso"],
    },
    {
      title: "Minimal Headless Debian 13 Installation",
      category: "Installation",
      excerpt: "Package selection: uncheck desktop environments, keep SSH server and standard system utilities.",
      href: "/en/documentation/demarrage-rapide#step-4--install-debian",
      tags: ["debian", "trixie", "ssh", "headless", "kiosk"],
    },
    {
      title: "Automated Playout Installation Script install.sh",
      category: "Installation",
      excerpt: "Run git clone then sudo ./install.sh to deploy Redis, Node, Python, MPV, and systemd services.",
      href: "/en/documentation/demarrage-rapide#step-6--install-bobine",
      tags: ["install.sh", "script", "automation", "systemd", "redis", "fastapi"],
    },
    {
      title: "Open Interface at http://bobine.local",
      category: "Configuration",
      excerpt: "First connection from any local network browser or via the machine IP address.",
      href: "/en/documentation/demarrage-rapide#step-7--open-the-interface",
      tags: ["mdns", "bobine.local", "ip", "browser", "admin"],
    },
    {
      title: "Workout Library & Batch Video Upload",
      category: "Usage Guide",
      excerpt: "Drag-and-drop video imports, custom categories, automatic thumbnail generation.",
      href: "/en/documentation/utilisation#workout-library",
      tags: ["videos", "import", "mp4", "workouts", "library"],
    },
    {
      title: "Automated Weekly Timetable Scheduler",
      category: "Usage Guide",
      excerpt: "Weekly timetable with second-precise automated class triggers and auto TV power.",
      href: "/en/documentation/utilisation#weekly-scheduling",
      tags: ["schedule", "timetable", "classes", "automation", "calendar"],
    },
    {
      title: "Touchscreen Member Kiosk",
      category: "Usage Guide",
      excerpt: "Self-service workout browsing and launching for gym members between classes.",
      href: "/en/documentation/utilisation#member-cinema-on-demand-kiosk",
      tags: ["kiosk", "touch", "member", "on demand", "cinema"],
    },
    {
      title: "Mobile Remote via QR Code (No App)",
      category: "Usage Guide",
      excerpt: "Scan local QR code on phone to control class playback, pause, and volume.",
      href: "/en/documentation/utilisation#mobile-phone-remote",
      tags: ["smartphone", "remote", "qr code", "wifi", "volume"],
    },
    {
      title: "24/7 Background Music & Voice Reminders",
      category: "Usage Guide",
      excerpt: "Continuous audio playout with crossfade and automated spoken reminders.",
      href: "/en/documentation/utilisation#background-radio",
      tags: ["radio", "music", "crossfade", "announcements", "voice"],
    },
    {
      title: "Automated HDMI-CEC TV Standby & Power",
      category: "FAQ",
      excerpt: "Powers TV on before class and into standby after workout with no manual remote.",
      href: "/en/documentation/faq#daily-operation",
      tags: ["hdmi", "cec", "power", "standby", "tv", "screen"],
    },
    {
      title: "Power Cut Resilience & Watchdog Supervisor",
      category: "FAQ",
      excerpt: "Continuous health monitoring on /api/health and instant automated recovery.",
      href: "/en/documentation/faq#daily-operation",
      tags: ["watchdog", "power cut", "crash", "recovery", "systemd"],
    },
    {
      title: "FastAPI, Redis, MPV & Next.js Architecture",
      category: "Developers",
      excerpt: "Multi-worker backend details, SQLite database, distributed locks, and WebSockets.",
      href: "/en/documentation/developpeurs#architecture-overview",
      tags: ["fastapi", "python", "redis", "mpv", "sqlite", "architecture", "developers"],
    },
  ],
};

export default function DocsSearch({ locale }: { locale: Locale }) {
  const isEn = locale === "en";
  const [query, setQuery] = useState("");

  const entries = SEARCH_DATABASE[locale] || SEARCH_DATABASE.fr;

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    return entries.filter((item) => {
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchExcerpt = item.excerpt.toLowerCase().includes(q);
      const matchCategory = item.category.toLowerCase().includes(q);
      const matchTags = item.tags.some((tag) => tag.toLowerCase().includes(q));
      return matchTitle || matchExcerpt || matchCategory || matchTags;
    });
  }, [query, entries]);

  return (
    <div className="docs-search-container">
      <div className="docs-search-input-wrapper">
        <svg
          className="docs-search-icon"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>

        <input
          type="text"
          className="docs-search-input"
          placeholder={
            isEn
              ? "Search documentation & FAQ (e.g. Wyse, HDMI-CEC, install, sound)..."
              : "Rechercher dans la documentation & FAQ (ex. Wyse, HDMI-CEC, sono, install)..."
          }
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label={isEn ? "Search documentation" : "Rechercher dans la documentation"}
        />

        {query && (
          <button
            type="button"
            className="docs-search-clear-btn"
            onClick={() => setQuery("")}
            aria-label={isEn ? "Clear search" : "Effacer la recherche"}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>

      {/* Résultats de recherche en direct */}
      {query.trim().length > 0 && (
        <div className="docs-search-results">
          {results.length > 0 ? (
            <div className="docs-search-results__list">
              <div className="docs-search-results__header">
                {results.length} {isEn ? "results found" : "résultats trouvés"}
              </div>
              {results.map((res, idx) => (
                <Link
                  key={idx}
                  href={res.href}
                  className="docs-search-item"
                  onClick={() => setQuery("")}
                >
                  <div className="docs-search-item__top">
                    <span className="docs-search-item__title">{res.title}</span>
                    <span className="docs-search-item__cat">{res.category}</span>
                  </div>
                  <p className="docs-search-item__excerpt">{res.excerpt}</p>
                </Link>
              ))}
            </div>
          ) : (
            <div className="docs-search-empty">
              {isEn
                ? "No matching topics found in documentation."
                : "Aucun résultat trouvé pour cette recherche."}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
