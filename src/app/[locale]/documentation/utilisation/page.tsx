import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n";


import Shot from "@/components/Shot";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import ShareButton from "@/components/ShareButton";
import BreadcrumbsJsonLd from "@/components/BreadcrumbsJsonLd";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const isEn = locale === "en";
  return buildMetadata({
    locale: locale as Locale,
    pathname: "/documentation/utilisation",
    title: isEn
      ? "User Manual & Daily Operations — Bobine | Les Mills Cinema Alternative"
      : "Guide d'Utilisation & Exploitation Quotidienne — Bobine | Alternative Les Mills Cinema",
    description: isEn
      ? "Comprehensive usage manual for Bobine: Admin dashboard, video library management, weekly timetable scheduler, member touch kiosk, and 24/7 background radio."
      : "Manuel complet d'utilisation de Bobine : panneau d'administration, médiathèque vidéo, planificateur de cours hebdomadaire, borne tactile et radio 24/7.",
    keywords: [
      "Guide utilisation Bobine",
      "Alternative Les Mills Cinema",
      "Alternative Les Mills Virtual",
      "Panneau administration vidéo fitness",
      "Planificateur cours collectif",
      "Borne tactile membre fitness",
      "Télécommande smartphone QR code",
      "Gym video operations guide",
    ],
  });
}

export default async function UtilisationPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const isEn = locale === "en";

  const breadcrumbs = [
    { name: "Bobine", url: `/${locale}` },
    { name: "Documentation", url: `/${locale}/documentation` },
    { name: isEn ? "Operations Manual" : "Utilisation & Exploitation", url: `/${locale}/documentation/utilisation` },
  ];

  return isEn ? (
    <>
      <BreadcrumbsJsonLd items={breadcrumbs} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem", marginBottom: "1rem" }}>
        <div>
          <span className="feature-category-label">User Manual & Operations</span>
          <h1 style={{ margin: 0 }}>Usage Guide & Operations</h1>
        </div>
        <ShareButton
          locale={locale as Locale}
          pathname="/documentation/utilisation"
          title="Bobine User Manual & Operations"
          description="Complete manual for the Bobine video playout and streaming system."
        />
      </div>

      <p>
        The complete guide to every screen, feature, and tool once Bobine is installed (see the <Link href={`/${locale}/documentation/demarrage-rapide`}>Quick Start Guide</Link> if you haven&apos;t installed it yet).
      </p>

      <div className="docs-callout docs-callout--info">
        <div className="docs-callout__icon">🌐</div>
        <div className="docs-callout__content">
          <div className="docs-callout__title">Universal Web Architecture</div>
          <div>All control interfaces (Admin, Kiosk, Remote) are web applications rendered in your browser. Any tablet, smartphone, or laptop on the gym&apos;s Wi-Fi network can manage Bobine without downloading apps from an app store.</div>
        </div>
      </div>

      <h2 id="admin-dashboard">Admin Dashboard</h2>
      <p>
        Accessible on <code>http://bobine.local</code> from any web browser on your gym&apos;s local network — no client software or apps needed.
      </p>
      <Shot caption="Overview of the Bobine web administration dashboard" />

      <h3 id="workout-library">Workout Library & Video Formats</h3>
      <p>
        Drag-and-drop or batch video upload, custom category management (Spinning, HIIT, Yoga, Pilates, Stretching), multi-file actions, upload progress tracking, and automatic video thumbnail extraction.
      </p>

      <div className="docs-table-wrapper">
        <table className="docs-table">
          <thead>
            <tr>
              <th>Parameter</th>
              <th>Supported</th>
              <th>Recommended Setting</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Video Codec</strong></td>
              <td>H.264 (AVC), H.265 (HEVC), VP9, AV1</td>
              <td><code>H.264 / High Profile</code> (100% hardware decoded)</td>
            </tr>
            <tr>
              <td><strong>Resolution & FPS</strong></td>
              <td>720p, 1080p, 4K (24/30/60 FPS)</td>
              <td><code>1080p @ 60 FPS</code></td>
            </tr>
            <tr>
              <td><strong>Bitrate</strong></td>
              <td>Up to 50 Mbps</td>
              <td><code>8 to 15 Mbps</code> (CBR/VBR)</td>
            </tr>
            <tr>
              <td><strong>Audio Format</strong></td>
              <td>AAC-LC, MP3, FLAC, PCM</td>
              <td><code>AAC 48kHz Stereo @ 256 kbps</code></td>
            </tr>
            <tr>
              <td><strong>Container</strong></td>
              <td>MP4, MKV, WebM, MOV</td>
              <td><code>.mp4</code> (with faststart enabled)</td>
            </tr>
          </tbody>
        </table>
      </div>
      <Shot caption="Uploading video files via drag-and-drop into the media library" />

      <h3 id="weekly-scheduling">Weekly Scheduling & Automation</h3>
      <p>
        Build a recurring weekly timetable: each scheduled class triggers automatically at the exact second on the chosen display.
      </p>
      <div className="docs-callout docs-callout--tip">
        <div className="docs-callout__icon">⚡</div>
        <div className="docs-callout__content">
          <div className="docs-callout__title">Automated TV Power (HDMI-CEC)</div>
          <div>Bobine automatically sends an HDMI-CEC power-on command to your TV <strong>2 minutes before</strong> the class starts, switches the input channel, and puts the screen into standby <strong>5 minutes after</strong> the workout ends.</div>
        </div>
      </div>
      <Shot caption="Weekly scheduling grid with scheduled workout slots" />

      <h3 id="playlists">Playlists & Rotation</h3>
      <p>
        Create custom playlists for both the cinema screen and background radio — loop modes, shuffle playback, and custom track sequencing.
      </p>

      <h3 id="settings-displays">Settings & Screen Routing</h3>
      <p>
        Control screen output routing (what plays on the wired HDMI TV vs what streams to networked browser displays), switch between the 13 dynamic themes, language selection, and danger zone.
      </p>

      <h2 id="member-cinema-on-demand-kiosk">Member Cinema (On-Demand Kiosk)</h2>
      <p>
        The wired HDMI screen displays a clean fullscreen touch menu: members can browse available workouts and start a session themselves, featuring an animated countdown when an upcoming scheduled class approaches.
      </p>
      <Shot caption="Member cinema kiosk selection menu" />

      <h2 id="network-secondary-display">Network Secondary Display</h2>
      <p>
        A completely independent second display output — any device with a browser on the local network (smart TV, iPad, PC) can open and display it simultaneously.
      </p>

      <h2 id="coach-audio-mode">Coach Audio Mode</h2>
      <p>
        For workouts where only voice instructions and music are needed over the gym&apos;s speakers: an animated or branded background is shown on the TV while audio plays through the sound output.
      </p>
      <Shot caption="Coach audio mode display screen with animated backdrop" />

      <h2 id="background-radio">24/7 Background Music & Voice Alerts</h2>
      <p>
        A continuous background music player: smooth crossfades between songs (adjustable 0s to 12s), shuffle, repeat, and scheduled vocal safety announcements (&quot;Please wipe down equipment&quot;, closing warnings).
      </p>
      <Shot caption="Admin Radio tab with active playlist and playback controls" />

      <h2 id="mobile-phone-remote">Mobile Phone Remote (QR Code)</h2>
      <p>
        Scan the local QR code or open <code>http://bobine.local/remote</code> on any phone connected to the gym Wi-Fi: the interface becomes a handheld controller for instructors (play, pause, seek, volume control, track skip).
      </p>
      <Shot caption="Mobile remote control interface on a smartphone" />

      <h2 id="wireless-hardware-remote">Wireless Hardware Remotes</h2>
      <p>
        Bobine also supports standard plug-and-play USB air-mouse remotes (like presenter clickers): directional arrows and OK button to navigate and start classes, plus volume and playback controls with zero driver setup.
      </p>

      <h2 id="system-health-watchdog">System Health & Watchdog Supervisor</h2>
      <p>
        Bobine exposes a machine-readable health endpoint at <code>GET http://bobine.local/api/health</code> (monitoring Redis, SQLite, and Chromium kiosk). A local systemd watchdog continuously tests it and restarts failing components automatically — your workout room recovers autonomously with zero staff intervention, even after a total power cut.
      </p>
    </>
  ) : (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem", marginBottom: "1rem" }}>
        <div>
          <span className="feature-category-label">Guide Pratique & Exploitation</span>
          <h1 style={{ margin: 0 }}>Utilisation & Guide Pratique</h1>
        </div>
        <ShareButton
          locale={locale as Locale}
          pathname="/documentation/utilisation"
          title="Guide d'Utilisation Bobine"
          description="Le guide complet de chaque écran et fonctionnalité de Bobine."
        />
      </div>

      <p>
        Le guide complet de chaque écran et de chaque outil, une fois Bobine installé (voir le <Link href={`/${locale}/documentation/demarrage-rapide`}>démarrage rapide</Link> si ce n&apos;est pas encore fait).
      </p>

      <div className="docs-callout docs-callout--info">
        <div className="docs-callout__icon">🌐</div>
        <div className="docs-callout__content">
          <div className="docs-callout__title">Architecture Web Universelle</div>
          <div>Toutes les interfaces de pilotage (Admin, Kiosque, Télécommande) sont des applications web servies en local. N&apos;importe quel smartphone, tablette ou ordinateur connecté au Wi-Fi de la salle pilote Bobine sans passer par un magasin d&apos;applications.</div>
        </div>
      </div>

      <h2 id="panneau-dadministration">Panneau d&apos;administration</h2>
      <p>
        Accessible sur <code>http://bobine.local</code> depuis n&apos;importe quel navigateur du réseau local — aucune installation cliente nécessaire.
      </p>
      <Shot caption="Vue d'ensemble du panneau d'administration" />

      <h3 id="bibliotheque">Bibliothèque & Formats Vidéo Recommandés</h3>
      <p>
        Import par glisser-déposer ou envoi en lot, catégories libres (les catégories de cours s&apos;adaptent à votre catalogue), sélection groupée pour agir sur plusieurs fichiers à la fois, progression affichée fichier par fichier, miniatures générées automatiquement.
      </p>

      <div className="docs-table-wrapper">
        <table className="docs-table">
          <thead>
            <tr>
              <th>Paramètre</th>
              <th>Formats supportés</th>
              <th>Réglage recommandé</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Codec Vidéo</strong></td>
              <td>H.264 (AVC), H.265 (HEVC), VP9, AV1</td>
              <td><code>H.264 / High Profile</code> (100% matériel)</td>
            </tr>
            <tr>
              <td><strong>Résolution & Fréquence</strong></td>
              <td>720p, 1080p, 4K (24/30/60 FPS)</td>
              <td><code>1080p @ 60 FPS</code></td>
            </tr>
            <tr>
              <td><strong>Débit binaire (Bitrate)</strong></td>
              <td>Jusqu&apos;à 50 Mbps</td>
              <td><code>8 à 15 Mbps</code> (CBR/VBR)</td>
            </tr>
            <tr>
              <td><strong>Format Audio</strong></td>
              <td>AAC-LC, MP3, FLAC, PCM</td>
              <td><code>AAC 48kHz Stéréo @ 256 kbps</code></td>
            </tr>
            <tr>
              <td><strong>Conteneur</strong></td>
              <td>MP4, MKV, WebM, MOV</td>
              <td><code>.mp4</code> (avec option faststart)</td>
            </tr>
          </tbody>
        </table>
      </div>
      <Shot caption="Import de vidéos par glisser-déposer dans la bibliothèque" />

      <h3 id="planification">Planification & Automatisation</h3>
      <p>
        Construisez une timetable hebdomadaire : chaque créneau démarre automatiquement à l&apos;heure prévue, sur l&apos;écran choisi.
      </p>
      <div className="docs-callout docs-callout--tip">
        <div className="docs-callout__icon">⚡</div>
        <div className="docs-callout__content">
          <div className="docs-callout__title">Allumage TV automatique (HDMI-CEC)</div>
          <div>Bobine envoie un signal HDMI-CEC pour allumer la télévision <strong>2 minutes avant</strong> le début du cours, bascule sur la bonne entrée, et remet l&apos;écran en veille <strong>5 minutes après</strong> la fin de la séance.</div>
        </div>
      </div>
      <Shot caption="Planning hebdomadaire avec des créneaux de cours" />

      <h3 id="playlists">Playlists</h3>
      <p>
        Des playlists pour la borne cinéma comme pour la radio — ordre des pistes, lecture aléatoire, répétition.
      </p>

      <h3 id="parametres">Paramètres & Routage d&apos;écran</h3>
      <p>
        Sortie d&apos;écran (quel contenu sur l&apos;écran câblé, quel contenu sur l&apos;écran réseau), thèmes, langue, réseau, et la zone de danger (désinstallation).
      </p>

      <h2 id="cinema-membre-borne-a-la-demande">Cinéma membre (borne à la demande)</h2>
      <p>
        L&apos;écran câblé (HDMI) affiche un menu de sélection plein écran : un membre parcourt les cours disponibles et en lance un lui-même, avec une animation de lancement et un compte à rebours « prochain cours » si un créneau planifié approche.
      </p>
      <Shot caption="Menu de sélection de la borne cinéma, vue membre" />

      <h2 id="ecran-reseau">Écran réseau</h2>
      <p>
        Une seconde sortie, totalement indépendante de l&apos;écran câblé — n&apos;importe quel appareil avec un navigateur sur le réseau local peut l&apos;afficher en simultané.
      </p>

      <h2 id="mode-coach-audio">Mode coach audio</h2>
      <p>
        Pour les cours diffusés uniquement en audio (sur les enceintes de la salle) : un fond visuel animé ou fixe s&apos;affiche à l&apos;écran pendant la lecture, pendant que le son passe par la sortie audio configurée.
      </p>
      <Shot caption="Écran du mode coach audio avec fond animé" />

      <h2 id="radio">Radio 24/7 & Rappels Vocaux</h2>
      <p>
        Un lecteur de musique d&apos;ambiance 24/7, façon Spotify : fondu enchaîné réglable (de 0s à 12s), lecture aléatoire, répétition, et rappels vocaux programmés (« re-rackez vos poids », consignes de fermeture).
      </p>
      <Shot caption="Onglet Radio de l'admin : playlist en cours et contrôles" />

      <h2 id="telecommande-mobile">Télécommande mobile (QR Code)</h2>
      <p>
        Scannez le QR Code affiché dans l&apos;administration ou ouvrez <code>http://bobine.local/remote</code> sur un téléphone connecté au Wi-Fi : l&apos;interface devient une télécommande de poche pour les coachs (lecture, pause, avance, volume, passage de piste).
      </p>
      <Shot caption="Interface de télécommande mobile sur un téléphone" />

      <h2 id="telecommande-physique">Télécommande physique</h2>
      <p>
        La borne cinéma et l&apos;écran radio répondent aussi à une télécommande USB « air remote » (type présentateur multimédia) : flèches et OK pour parcourir et lancer un cours, plus les touches lecture/pause, piste et volume.
      </p>

      <h2 id="sante-et-supervision">Santé et supervision</h2>
      <p>
        Bobine expose un point de contrôle machine-lisible, <code>GET http://bobine.local/api/health</code>, qui rapporte l&apos;état de Redis, de la base de données et du kiosque Chromium. Un chien de garde local le sonde en continu et redémarre automatiquement un composant en panne — la salle se rétablit sans intervention, y compris après une coupure de courant.
      </p>
    </>
  );
}
