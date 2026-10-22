"use client";

import { useState } from "react";
import Shot from "@/components/Shot";
import InteractiveTerminal from "@/components/InteractiveTerminal";
import DownloadPdfButton from "@/components/DownloadPdfButton";
import ShareButton from "@/components/ShareButton";
import type { Locale } from "@/lib/i18n";
import "@/styles/split/pages-docs.css";

interface DocsUtilisationViewProps {
  locale: Locale;
}

export default function DocsUtilisationView({ locale }: DocsUtilisationViewProps) {
  const isEn = locale === "en";
  const [activeTab, setActiveTab] = useState<"basics" | "features" | "all">("basics");

  return (
    <>
      {/* En-tête de la page */}
      <div className="dx-div-4">
        <div>
          <span className="feature-category-label">
            {isEn ? "User Manual & Daily Operations" : "Guide Pratique & Exploitation"}
          </span>
          <h1 className="dx-h1-2">
            {isEn ? "Usage Guide & Operations" : "Utilisation & Guide Pratique"}
          </h1>
        </div>
        <div className="dx-div-2">
          <DownloadPdfButton locale={locale} chapterId="utilisation" />
          <ShareButton
            locale={locale}
            pathname="/documentation/utilisation"
            title={isEn ? "Bobine User Manual & Operations" : "Guide d'Utilisation Bobine"}
            description={isEn ? "Complete manual for the Bobine video playout and streaming system." : "Le guide complet de chaque écran et fonctionnalité de Bobine."}
          />
        </div>
      </div>

      <p className="dx-p-4">
        {isEn
          ? "Master every screen and tool in Bobine once installed. Choose a category below or browse the full reference."
          : "Maîtrisez chaque écran et outil de Bobine après son installation. Choisissez une rubrique ci-dessous ou parcourez l'ensemble du guide."}
      </p>

      {/* Barre d'onglets segmentée épurée */}
      <div
        role="tablist"
        aria-label={isEn ? "Documentation sections" : "Sections de la documentation"} className="dx-div-19"
      >
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "basics"}
          onClick={() => setActiveTab("basics")}
          className="dx-tab"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="3" width="20" height="14" rx="2" />
            <line x1="8" y1="21" x2="16" y2="21" />
            <line x1="12" y1="17" x2="12" y2="21" />
          </svg>
          <span>{isEn ? "1. Basics & First Steps" : "1. Bases & Prise en main"}</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "features"}
          onClick={() => setActiveTab("features")}
          className="dx-tab"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="5 3 19 12 5 21 5 3" />
          </svg>
          <span>{isEn ? "2. Features" : "2. Fonctionnalités"}</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "all"}
          onClick={() => setActiveTab("all")}
          className="dx-tab"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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

      {/* CONTENU : 1. BASES & PRISE EN MAIN */}
      {(activeTab === "basics" || activeTab === "all") && (
        <section className="dx-section-1">
          {activeTab === "all" && (
            <div className="dx-div-20">
              <h2 className="dx-h2-1">
                {isEn ? "Part 1 — Basics & First Connection" : "Partie 1 — Bases & Prise en Main"}
              </h2>
            </div>
          )}

          <div className="docs-callout docs-callout--info">
            <div className="docs-callout__content">
              <div className="docs-callout__title">{isEn ? "Universal Web Architecture" : "Architecture Web Universelle"}</div>
              <div>
                {isEn
                  ? "All control interfaces (Admin, Kiosk, Remote) are web applications rendered in your browser. Any tablet, smartphone, or laptop on the gym's Wi-Fi network can manage Bobine without downloading apps from an app store."
                  : "Toutes les interfaces de pilotage (Admin, Kiosque, Télécommande) sont des applications web servies en local. N'importe quel smartphone, tablette ou ordinateur connecté au Wi-Fi de la salle pilote Bobine sans passer par un magasin d'applications."}
              </div>
            </div>
          </div>

          <h2 id="admin-dashboard">{isEn ? "Admin Dashboard" : "Panneau d'administration"}</h2>
          <p>
            {isEn
              ? "Accessible on http://bobine.local from any web browser on your gym's local network — no client software or apps needed."
              : "Accessible sur http://bobine.local depuis n'importe quel navigateur du réseau local — aucune installation cliente nécessaire."}
          </p>
          <Shot caption={isEn ? "Overview of the Bobine web administration dashboard" : "Vue d'ensemble du panneau d'administration"} />

          <h3 id="workout-library">{isEn ? "Workout Library & Video Formats" : "Bibliothèque & Formats Vidéo Recommandés"}</h3>
          <p>
            {isEn
              ? "Drag-and-drop or batch video upload, custom category management (Spinning, HIIT, Yoga, Pilates, Stretching), multi-file actions, upload progress tracking, and automatic video thumbnail extraction."
              : "Import par glisser-déposer ou envoi en lot, catégories libres (les catégories de cours s'adaptent à votre catalogue), sélection groupée pour agir sur plusieurs fichiers à la fois, progression affichée fichier par fichier, miniatures générées automatiquement."}
          </p>

          <div className="docs-table-wrapper">
            <table className="docs-table">
              <thead>
                <tr>
                  <th>{isEn ? "Parameter" : "Paramètre"}</th>
                  <th>{isEn ? "Supported" : "Formats supportés"}</th>
                  <th>{isEn ? "Recommended Setting" : "Réglage recommandé"}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>{isEn ? "Video Codec" : "Codec Vidéo"}</strong></td>
                  <td>H.264 (AVC), H.265 (HEVC), VP9, AV1</td>
                  <td><code>H.264 / High Profile</code> ({isEn ? "100% hardware decoded" : "100% matériel"})</td>
                </tr>
                <tr>
                  <td><strong>{isEn ? "Resolution & FPS" : "Résolution & Fréquence"}</strong></td>
                  <td>720p, 1080p, 4K (24/30/60 FPS)</td>
                  <td><code>1080p @ 60 FPS</code></td>
                </tr>
                <tr>
                  <td><strong>{isEn ? "Bitrate" : "Débit binaire (Bitrate)"}</strong></td>
                  <td>{isEn ? "Up to 50 Mbps" : "Jusqu'à 50 Mbps"}</td>
                  <td><code>8 to 15 Mbps</code> (CBR/VBR)</td>
                </tr>
                <tr>
                  <td><strong>{isEn ? "Audio Format" : "Format Audio"}</strong></td>
                  <td>AAC-LC, MP3, FLAC, PCM</td>
                  <td><code>AAC 48kHz Stereo @ 256 kbps</code></td>
                </tr>
                <tr>
                  <td><strong>{isEn ? "Container" : "Conteneur"}</strong></td>
                  <td>MP4, MKV, WebM, MOV</td>
                  <td><code>.mp4</code> ({isEn ? "with faststart enabled" : "avec option faststart"})</td>
                </tr>
              </tbody>
            </table>
          </div>
          <Shot caption={isEn ? "Uploading video files via drag-and-drop into the media library" : "Import de vidéos par glisser-déposer dans la bibliothèque"} />

          <h3 id="settings-displays">{isEn ? "Settings & Screen Routing" : "Paramètres & Routage d'écran"}</h3>
          <p>
            {isEn
              ? "Control screen output routing (what plays on the wired HDMI TV vs what streams to networked browser displays), switch between the 17 dynamic dual-tone themes, language selection, and maintenance zone."
              : "Sortie d'écran (quel contenu sur l'écran câblé, quel contenu sur l'écran réseau), bascule instantanée parmi les 17 thèmes bicolores, langue, réseau, et zone de maintenance."}
          </p>

          <h3 id="system-health-watchdog">{isEn ? "System Health & Watchdog Supervisor" : "Santé et Supervision Automatique"}</h3>
          <p>
            {isEn
              ? "Bobine exposes a machine-readable health endpoint at GET http://bobine.local/api/health (monitoring SQLite and the Chromium kiosk). A local systemd watchdog continuously tests it and restarts failing components automatically — your workout room recovers autonomously with zero staff intervention, even after a total power cut."
              : "Bobine expose un point de contrôle machine-lisible, GET http://bobine.local/api/health, qui rapporte l'état de la base de données et du kiosque Chromium. Un chien de garde local le sonde en continu et redémarre automatiquement un composant en panne — la salle se rétablit sans intervention, y compris après une coupure de courant."}
          </p>
        </section>
      )}

      {/* CONTENU : 2. FONCTIONNALITÉS AVANCÉES & MOTEURS */}
      {(activeTab === "features" || activeTab === "all") && (
        <section className="dx-section-1">
          {activeTab === "all" && (
            <div className="dx-div-21">
              <h2 className="dx-h2-1">
                {isEn ? "Part 2 — Advanced Playout Engines & Features" : "Partie 2 — Fonctionnalités & Moteurs Multimédia"}
              </h2>
            </div>
          )}

          <h2 id="weekly-scheduling">{isEn ? "Weekly Scheduling & Automation" : "Planification & Automatisation"}</h2>
          <p>
            {isEn
              ? "Build a recurring weekly timetable: each scheduled class triggers automatically at the exact second on the chosen display."
              : "Construisez une timetable hebdomadaire : chaque créneau démarre automatiquement à l'heure prévue, sur l'écran choisi."}
          </p>
          <div className="docs-callout docs-callout--tip">
            <div className="docs-callout__content">
              <div className="docs-callout__title">{isEn ? "Resilient by Design" : "Résilient par conception"}</div>
              <div>
                {isEn
                  ? "If the schedule was interrupted by a reboot or a power cut, Bobine's watchdog resumes the correct playlist automatically — no missed class, no manual restart."
                  : "Si le planning est interrompu par un redémarrage ou une coupure de courant, le chien de garde de Bobine reprend automatiquement la bonne playlist — aucun cours manqué, aucun redémarrage manuel."}
              </div>
            </div>
          </div>
          <Shot caption={isEn ? "Weekly scheduling grid with scheduled workout slots" : "Planning hebdomadaire avec des créneaux de cours"} />

          <h2 id="member-cinema-on-demand-kiosk">{isEn ? "Member Cinema (On-Demand Kiosk)" : "Cinéma membre (borne à la demande)"}</h2>
          <p>
            {isEn
              ? "The wired HDMI screen displays a clean fullscreen touch menu: members can browse available workouts and start a session themselves, featuring an animated countdown when an upcoming scheduled class approaches."
              : "L'écran câblé (HDMI) affiche un menu de sélection plein écran : un membre parcourt les cours disponibles et en lance un lui-même, avec une animation de lancement et un compte à rebours « prochain cours » si un créneau planifié approche."}
          </p>
          <Shot caption={isEn ? "Member cinema kiosk selection menu" : "Menu de sélection de la borne cinéma, vue membre"} />

          <h2 id="network-secondary-display">{isEn ? "Network Secondary Display" : "Écran réseau secondaire"}</h2>
          <p>
            {isEn
              ? "A completely independent second display output — any device with a browser on the local network (smart TV, iPad, PC) can open and display it simultaneously."
              : "Une seconde sortie, totalement indépendante de l'écran câblé — n'importe quel appareil avec un navigateur sur le réseau local peut l'afficher en simultané."}
          </p>

          <h2 id="coach-audio-mode">{isEn ? "Coach Audio Mode" : "Mode coach audio"}</h2>
          <p>
            {isEn
              ? "For workouts where only voice instructions and music are needed over the gym's speakers: an animated or branded background is shown on the TV while audio plays through the sound output."
              : "Pour les cours diffusés uniquement en audio (sur les enceintes de la salle) : un fond visuel animé ou fixe s'affiche à l'écran pendant la lecture, pendant que le son passe par la sortie audio configurée."}
          </p>
          <Shot caption={isEn ? "Coach audio mode display screen with animated backdrop" : "Écran du mode coach audio avec fond animé"} />

          <h2 id="background-radio">{isEn ? "24/7 Background Music & Voice Alerts" : "Radio 24/7 & Rappels Vocaux"}</h2>
          <p>
            {isEn
              ? "A continuous background music player: smooth crossfades between songs (adjustable 0s to 12s), shuffle, repeat, and scheduled vocal safety announcements ('Please wipe down equipment', closing warnings)."
              : "Un lecteur de musique d'ambiance 24/7, façon Spotify : fondu enchaîné réglable (de 0s à 12s), lecture aléatoire, répétition, et rappels vocaux programmés (« re-rackez vos poids », consignes de fermeture)."}
          </p>
          <Shot caption={isEn ? "Admin Radio tab with active playlist and playback controls" : "Onglet Radio de l'admin : playlist en cours et contrôles"} />

          <InteractiveTerminal
            locale={locale}
            preset="usage"
            title={isEn ? "bash — bobine audio & operations console" : "bash — console sono & opérations bobine"}
          />

          <h2 id="mobile-phone-remote">{isEn ? "Mobile Phone Remote (QR Code)" : "Télécommande mobile (QR Code)"}</h2>
          <p>
            {isEn
              ? "Scan the local QR code or open http://bobine.local/remote on any phone connected to the gym Wi-Fi: the interface becomes a handheld controller for instructors (play, pause, seek, volume control, track skip)."
              : "Scannez le QR Code affiché dans l'administration ou ouvrez http://bobine.local/remote sur un téléphone connecté au Wi-Fi : l'interface devient une télécommande de poche pour les coachs (lecture, pause, avance, volume, passage de piste)."}
          </p>
          <Shot caption={isEn ? "Mobile remote control interface on a smartphone" : "Interface de télécommande mobile sur un téléphone"} />

          <h2 id="wireless-hardware-remote">{isEn ? "Wireless Hardware Remotes" : "Télécommandes physiques sans fil"}</h2>
          <p>
            {isEn
              ? "Bobine also supports standard plug-and-play USB air-mouse remotes (like presenter clickers): directional arrows and OK button to navigate and start classes, plus volume and playback controls with zero driver setup."
              : "La borne cinéma et l'écran radio répondent aussi à une télécommande USB « air remote » (type présentateur multimédia) : flèches et OK pour parcourir et lancer un cours, plus les touches lecture/pause, piste et volume."}
          </p>
        </section>
      )}
    </>
  );
}
