"use client";

import { useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Locale } from "@/lib/i18n";

const MAX_RESULTS = 8;

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

/** Découpe le texte affiché en segments, avec les portions correspondant à `terms` marquées pour surlignage. */
function highlightSegments(text: string, terms: string[]): Array<{ value: string; match: boolean }> {
  const normalizedText = normalize(text);
  const ranges: Array<[number, number]> = [];
  for (const term of terms) {
    if (!term) continue;
    let from = 0;
    for (;;) {
      const idx = normalizedText.indexOf(term, from);
      if (idx === -1) break;
      ranges.push([idx, idx + term.length]);
      from = idx + term.length;
    }
  }
  if (ranges.length === 0) return [{ value: text, match: false }];

  ranges.sort((a, b) => a[0] - b[0]);
  const merged: Array<[number, number]> = [];
  for (const [start, end] of ranges) {
    const last = merged[merged.length - 1];
    if (last && start <= last[1]) {
      last[1] = Math.max(last[1], end);
    } else {
      merged.push([start, end]);
    }
  }

  const segments: Array<{ value: string; match: boolean }> = [];
  let cursor = 0;
  for (const [start, end] of merged) {
    if (start > cursor) segments.push({ value: text.slice(cursor, start), match: false });
    segments.push({ value: text.slice(start, end), match: true });
    cursor = end;
  }
  if (cursor < text.length) segments.push({ value: text.slice(cursor), match: false });
  return segments;
}

function Highlighted({ text, terms }: { text: string; terms: string[] }): ReactNode {
  const segments = highlightSegments(text, terms);
  return (
    <>
      {segments.map((seg, i) =>
        seg.match ? <mark key={i}>{seg.value}</mark> : <span key={i}>{seg.value}</span>
      )}
    </>
  );
}

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
      excerpt: "Dell Wyse 5070, HP EliteDesk 705, processeurs Intel et AMD x86-64, 4 Go de RAM, clé USB, HDMI et sono.",
      href: "/fr/documentation#ce-quil-vous-faut",
      tags: ["hardware", "wyse", "ram", "cle usb", "materiel", "intel", "amd", "ryzen", "sono"],
    },
    {
      title: "Écrire l'image Debian sur clé USB (BalenaEtcher / dd)",
      category: "Installation",
      excerpt: "Flasher Debian 13 netinst avec BalenaEtcher ou la commande dd sous Linux.",
      href: "/fr/documentation#etape-2--ecrire-limage-sur-la-cle-usb",
      tags: ["etcher", "flash", "usb", "debian", "dd", "iso"],
    },
    {
      title: "Installation Debian 13 minimale sans bureau",
      category: "Installation",
      excerpt: "Sélection des paquets : décocher GNOME/bureau, garder uniquement SSH et utilitaires système.",
      href: "/fr/documentation#etape-4--installer-debian",
      tags: ["debian", "trixie", "ssh", "sans bureau", "kiosque"],
    },
    {
      title: "Script d'installation automatisé install.sh",
      category: "Installation",
      excerpt: "Exécuter git clone puis sudo ./install.sh pour installer Node, Python, MPV et les services systemd.",
      href: "/fr/documentation#etape-6--installer-bobine",
      tags: ["install.sh", "script", "automatique", "systemd", "fastapi"],
    },
    {
      title: "Accéder à l'interface http://bobine.local",
      category: "Configuration",
      excerpt: "Première connexion depuis un navigateur sur le réseau local ou via l'adresse IP de la machine.",
      href: "/fr/documentation#etape-7--ouvrir-linterface",
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
      title: "Sauvegarde et restauration ZIP",
      category: "FAQ",
      excerpt: "Exportez toute votre configuration en un clic et restaurez-la sur une nouvelle machine.",
      href: "/fr/documentation/faq#utilisation-quotidienne",
      tags: ["sauvegarde", "restauration", "zip", "backup", "sqlite"],
    },
    {
      title: "Résilience aux coupures de courant & Chien de garde",
      category: "FAQ",
      excerpt: "Surveillance continue via /api/health et relance automatique autonome après coupure.",
      href: "/fr/documentation/faq#utilisation-quotidienne",
      tags: ["watchdog", "panne", "coupure", "courant", "reprise", "systemd"],
    },
    {
      title: "Tableau de résolution des erreurs courantes",
      category: "Dépannage",
      excerpt: "Diagnostic pas à pas pour mDNS, écran noir, audio HDMI, VA-API et sauvegardes.",
      href: "/fr/documentation/faq#tableau-depannage",
      tags: ["erreur", "depannage", "audio", "ecran noir", "sauvegarde", "mdns", "vainfo"],
    },
    {
      title: "Commandes de diagnostic indispensables (systemctl, vainfo, logs)",
      category: "Dépannage",
      excerpt: "Commandes terminal pour tester les services systemd, les flux de logs et l'API de santé.",
      href: "/fr/documentation/faq#commandes-diagnostic",
      tags: ["diagnostic", "journalctl", "systemctl", "vainfo", "terminal", "ssh"],
    },
    {
      title: "Référence de l'API REST Locale (/api/health, /api/status, /api/playout)",
      category: "Développeurs",
      excerpt: "Documentation complète des endpoints REST asynchrones pour le contrôle de lecture et de la santé.",
      href: "/fr/documentation/developpeurs#reference-api-rest",
      tags: ["api", "rest", "endpoints", "health", "status", "playout", "json"],
    },
    {
      title: "Protocole d'Événements WebSockets temps réel (/ws/events)",
      category: "Développeurs",
      excerpt: "Flux d'événements bidirectionnel pour la synchronisation instantanée des états entre écrans et télécommandes.",
      href: "/fr/documentation/developpeurs#flux-websockets",
      tags: ["websocket", "ws", "events", "temps reel", "broadcast", "etat"],
    },
    {
      title: "Architecture FastAPI, SQLite, MPV & Next.js",
      category: "Développeurs",
      excerpt: "Détails de la pile logicielle multi-worker, SQLite, verrous distribués et WebSockets.",
      href: "/fr/documentation/developpeurs#stack-technique",
      tags: ["fastapi", "python", "mpv", "sqlite", "architecture", "developpeurs"],
    },
  ],
  en: [
    {
      title: "Required Hardware & Prerequisites",
      category: "Quick Start",
      excerpt: "Dell Wyse 5070, HP EliteDesk 705, Intel & AMD x86-64 CPUs, 4GB RAM, USB drive, HDMI cable, and gym sound system.",
      href: "/en/documentation#what-you-need",
      tags: ["hardware", "wyse", "ram", "usb", "intel", "amd", "ryzen", "sound", "amp"],
    },
    {
      title: "Write Debian ISO to USB (BalenaEtcher / dd)",
      category: "Installation",
      excerpt: "Flash Debian 13 netinst with BalenaEtcher or Linux dd command.",
      href: "/en/documentation#step-2--write-image-to-usb-drive",
      tags: ["etcher", "flash", "usb", "debian", "dd", "iso"],
    },
    {
      title: "Minimal Headless Debian 13 Installation",
      category: "Installation",
      excerpt: "Package selection: uncheck desktop environments, keep SSH server and standard system utilities.",
      href: "/en/documentation#step-4--install-debian",
      tags: ["debian", "trixie", "ssh", "headless", "kiosk"],
    },
    {
      title: "Automated Playout Installation Script install.sh",
      category: "Installation",
      excerpt: "Run git clone then sudo ./install.sh to deploy Node, Python, MPV, and systemd services.",
      href: "/en/documentation#step-6--install-bobine",
      tags: ["install.sh", "script", "automation", "systemd", "fastapi"],
    },
    {
      title: "Post-Install Validation & Hardware VA-API",
      category: "Installation",
      excerpt: "Verify Intel or AMD hardware video acceleration with vainfo and check systemd service units.",
      href: "/en/documentation#step-7--verify-system",
      tags: ["vainfo", "intel", "amd", "vaapi", "systemd", "validation", "speaker-test"],
    },
    {
      title: "Open Interface at http://bobine.local",
      category: "Configuration",
      excerpt: "First connection from any local network browser or via the machine IP address.",
      href: "/en/documentation#step-8--open-the-interface",
      tags: ["mdns", "bobine.local", "ip", "browser", "admin"],
    },
    {
      title: "Workout Library & Batch Video Upload",
      category: "Usage Guide",
      excerpt: "Drag-and-drop video imports, custom categories, automatic thumbnail generation.",
      href: "/en/documentation/user-guide#workout-library",
      tags: ["videos", "import", "mp4", "workouts", "library"],
    },
    {
      title: "Automated Weekly Timetable Scheduler",
      category: "Usage Guide",
      excerpt: "Weekly timetable with second-precise automated class triggers and auto TV power.",
      href: "/en/documentation/user-guide#weekly-scheduling",
      tags: ["schedule", "timetable", "classes", "automation", "calendar"],
    },
    {
      title: "Touchscreen Member Kiosk",
      category: "Usage Guide",
      excerpt: "Self-service workout browsing and launching for gym members between classes.",
      href: "/en/documentation/user-guide#member-cinema-on-demand-kiosk",
      tags: ["kiosk", "touch", "member", "on demand", "cinema"],
    },
    {
      title: "Mobile Remote via QR Code (No App)",
      category: "Usage Guide",
      excerpt: "Scan local QR code on phone to control class playback, pause, and volume.",
      href: "/en/documentation/user-guide#mobile-phone-remote",
      tags: ["smartphone", "remote", "qr code", "wifi", "volume"],
    },
    {
      title: "24/7 Background Music & Voice Reminders",
      category: "Usage Guide",
      excerpt: "Continuous audio playout with crossfade and automated spoken reminders.",
      href: "/en/documentation/user-guide#background-radio",
      tags: ["radio", "music", "crossfade", "announcements", "voice"],
    },
    {
      title: "Common Error Resolution Matrix",
      category: "Troubleshooting",
      excerpt: "Step-by-step diagnostic fixes for mDNS, black screens, HDMI audio, and backups.",
      href: "/en/documentation/faq#troubleshooting-matrix",
      tags: ["error", "troubleshooting", "audio", "black screen", "backup", "mdns"],
    },
    {
      title: "Essential Diagnostic Commands (systemctl, vainfo, logs)",
      category: "Troubleshooting",
      excerpt: "Terminal diagnostic commands to inspect service health, live logs, and audio.",
      href: "/en/documentation/faq#diagnostic-commands",
      tags: ["diagnostic", "journalctl", "systemctl", "vainfo", "terminal", "ssh"],
    },
    {
      title: "Local REST API Reference (/api/health, /api/status, /api/playout)",
      category: "Developers",
      excerpt: "Complete technical reference for local REST endpoints, request/response models.",
      href: "/en/documentation/developers#rest-api-reference",
      tags: ["api", "rest", "endpoints", "health", "status", "playout", "json"],
    },
    {
      title: "Real-Time WebSocket Protocol (/ws/events)",
      category: "Developers",
      excerpt: "Real-time state broadcast events for multi-screen and remote control synchronization.",
      href: "/en/documentation/developers#websocket-events",
      tags: ["websocket", "ws", "events", "realtime", "broadcast", "state"],
    },
    {
      title: "FastAPI, SQLite, MPV & Next.js Architecture",
      category: "Developers",
      excerpt: "Multi-worker backend details, SQLite database, distributed locks, and WebSockets.",
      href: "/en/documentation/developers#software-stack",
      tags: ["fastapi", "python", "mpv", "sqlite", "architecture", "developers"],
    },
  ],
};

export default function DocsSearch({ locale }: { locale: Locale }) {
  const isEn = locale === "en";
  const [query, setQuery] = useState("");
  const router = useRouter();

  const entries = SEARCH_DATABASE[locale] || SEARCH_DATABASE.fr;

  const terms = useMemo(
    () =>
      normalize(query.trim())
        .split(/\s+/)
        .filter(Boolean),
    [query]
  );

  const results = useMemo(() => {
    if (terms.length === 0) return [];

    const scored = entries
      .map((item) => {
        const title = normalize(item.title);
        const category = normalize(item.category);
        const excerpt = normalize(item.excerpt);
        const tags = item.tags.map(normalize);

        // Chaque mot de la requête doit correspondre a au moins un champ (recherche "ET").
        let score = 0;
        for (const term of terms) {
          if (title === term) score += 12;
          else if (title.startsWith(term)) score += 8;
          else if (title.includes(term)) score += 5;
          else if (tags.some((tag) => tag === term)) score += 4;
          else if (tags.some((tag) => tag.includes(term))) score += 3;
          else if (category.includes(term)) score += 2;
          else if (excerpt.includes(term)) score += 1;
          else return null; // Un des mots ne correspond a rien : on exclut l'entree.
        }
        return { item, score };
      })
      .filter((r): r is { item: SearchEntry; score: number } => r !== null)
      .sort((a, b) => b.score - a.score)
      .map((r) => r.item);

    return scored;
  }, [terms, entries]);

  const visibleResults = results.slice(0, MAX_RESULTS);

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
          placeholder={isEn ? "Search docs..." : "Rechercher..."}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              setQuery("");
              (e.target as HTMLInputElement).blur();
            } else if (e.key === "Enter" && visibleResults[0]) {
              router.push(visibleResults[0].href);
              setQuery("");
            }
          }}
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
          {visibleResults.length > 0 ? (
            <div className="docs-search-results__list">
              <div className="docs-search-results__header">
                {results.length > MAX_RESULTS
                  ? isEn
                    ? `${MAX_RESULTS} of ${results.length} results`
                    : `${MAX_RESULTS} sur ${results.length} résultats`
                  : `${results.length} ${isEn ? (results.length > 1 ? "results found" : "result found") : results.length > 1 ? "résultats trouvés" : "résultat trouvé"}`}
              </div>
              {visibleResults.map((res, idx) => (
                <Link
                  key={idx}
                  href={res.href}
                  className="docs-search-item"
                  onClick={() => setQuery("")}
                >
                  <div className="docs-search-item__top">
                    <span className="docs-search-item__title">
                      <Highlighted text={res.title} terms={terms} />
                    </span>
                    <span className="docs-search-item__cat">{res.category}</span>
                  </div>
                  <p className="docs-search-item__excerpt">
                    <Highlighted text={res.excerpt} terms={terms} />
                  </p>
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
