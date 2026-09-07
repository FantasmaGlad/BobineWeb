import type { Locale } from "@/lib/i18n";
import type { DocChapter } from "./types";

/**
 * Source de contenu unique pour la documentation Bobine : consommée à la
 * fois par les pages web (src/components/Docs*.tsx) et par le générateur
 * PDF (src/lib/pdf/DocumentationPdf.tsx). Toute mise à jour ici se reflète
 * automatiquement dans les deux, ce qui évite la dérive entre le site et
 * le document téléchargeable.
 */

const fr: DocChapter[] = [
  {
    id: "manifeste",
    badge: "Vision & Identité",
    title: "1. Manifeste & Identité",
    icon: "manifesto",
    summary:
      "Bobine est né d'une volonté simple : libérer les salles de sport et les coachs de la rente des régies vidéo propriétaires. C'est une solution 100% hors-ligne, sobre et sous licence libre AGPL-3.0.",
    subsections: [
      {
        subtitle: "1.1 Le Pourquoi : en finir avec la rente des régies fermées",
        paragraphs: [
          "Pendant des années, les gérants de salle et les coachs ont été contraints de verser des abonnements mensuels de 150 € à 400 € par écran pour des boîtiers propriétaires fermés. Si la connexion internet du club a un hoquet en pleine heure de pointe, les cours collectifs se figent.",
          "Bobine élimine définitivement cette taxe récurrente et remet la souveraineté entre les mains des clubs : une régie diffusant des séances de sport dans une salle n'a pas besoin d'un abonnement cloud perpétuel.",
        ],
      },
      {
        subtitle: "1.2 Souveraineté locale et engagement Open Source",
        paragraphs: [
          "Toutes les vidéos, grilles horaires et réglages sont stockés localement sur le disque du mini PC. Internet n'est requis qu'une seule fois à l'installation : aucune coupure réseau ne perturbe les cours.",
          "L'intégralité du code source est ouverte, auditable sur GitHub et distribuée sous licence copyleft AGPL-3.0. Aucune télémétrie cachée, aucun verrouillage propriétaire.",
        ],
      },
      {
        subtitle: "1.3 La mascotte Baamix et la sobriété énergétique",
        paragraphs: [
          "Le nom Bobine rend hommage à la bobine de film 35mm. La mascotte Baamix, un hamster blanc, symbolise l'endurance et l'ingéniosité locale du projet.",
          "La solution tourne sur des mini PC reconditionnés (environ 40 à 50 €, par exemple un Dell Wyse 5070) consommant moins de 10 Watts en pleine lecture 1080p60/4K.",
        ],
      },
    ],
  },
  {
    id: "demarrage-rapide",
    badge: "Tutoriel",
    title: "2. Guide de Démarrage & Installation",
    icon: "install",
    summary:
      "Méthodes d'installation de Bobine V3.0.0 : applications de bureau en un clic pour un usage personnel (Windows, macOS, Linux), ou déploiement d'une appliance dédiée 24/7 pour une salle de sport.",
    subsections: [
      {
        subtitle: "2.1 Applications de bureau grand public (un clic)",
        paragraphs: [
          "Windows 11 / 10 : installeur Bobine-Setup-3.0.0.exe, démarrage silencieux en arrière-plan (icône dans la barre système), règle de pare-feu automatique pour activer la télécommande smartphone.",
          "macOS Apple Silicon (M1 à M4) : image disque Bobine-3.0.0.dmg, glisser-déposer dans le dossier Applications, icône compagnon dans la barre de menus. Le support Mac Intel (x86_64) est en cours de validation.",
          "Linux Bureau (Debian / Ubuntu) : paquet natif bobine_3.0.0_amd64.deb, installation via la logithèque ou via apt avec résolution automatique des dépendances.",
        ],
        codeBlock: "sudo apt install bobine",
      },
      {
        subtitle: "2.2 Appliance dédiée & salle 24/7 (mini PC headless)",
        paragraphs: [
          "Pour une diffusion permanente et ininterrompue sur un mini PC dédié (Dell Wyse 5070, Beelink N100, HP ProDesk) sous Debian 13 minimale sans bureau graphique.",
          "Commande d'installation unique et automatique, avec accélération matérielle VA-API pour la lecture vidéo :",
        ],
        codeBlock: "curl -fsSL https://bobine.fit/install.sh | bash",
      },
      {
        subtitle: "2.3 Orchestration réseau avec Bobine Assistant (Tauri)",
        paragraphs: [
          "Bobine Assistant est une application graphique légère en Rust et Tauri 2, pour découvrir les appliances sur le réseau local via mDNS (bobine.local), auditer le matériel par SSH et déployer sans ligne de commande.",
          "C'est un outil d'exploitation destiné aux techniciens qui gèrent plusieurs salles, distinct de l'application Bobine elle-même.",
        ],
      },
      {
        subtitle: "2.4 Canaux de version : Stable ou Bêta (Rolling beta)",
        paragraphs: [
          "Bobine propose deux canaux de version : le canal Stable (recommandé en production, tags Vx.y.z) et le canal Bêta (rolling beta, accès anticipé aux nouveautés en cours de test sur le tag fixe beta).",
          "Sur toutes les plateformes (Windows, macOS, Linux, Appliance), la version Bêta s'installe par-dessus la version existante sans créer d'application doublon ni altérer vos données. Pour installer l'appliance directement en canal Bêta :",
        ],
        codeBlock: "curl -fsSL https://bobine.fit/install.sh | sudo bash -s -- --channel=beta",
      },
    ],
  },
  {
    id: "utilisation",
    badge: "Guide Pratique",
    title: "3. Utilisation & Exploitation Quotidienne",
    icon: "play",
    summary:
      "Fonctionnement complet du panneau d'administration, de la borne cinéma membre, de la radio d'ambiance et des télécommandes.",
    subsections: [
      {
        subtitle: "3.1 Panneau d'administration web",
        paragraphs: [
          "Accessible depuis n'importe quel ordinateur, tablette ou smartphone connecté au réseau local (Wi-Fi ou câblé) de la salle, à l'adresse http://[IP_DU_MINI_PC]:8000.",
          "Permet d'ajouter des cours vidéo (H.264 ou HEVC), de configurer le planning hebdomadaire seconde par seconde et de piloter les volumes audio et vidéo.",
        ],
      },
      {
        subtitle: "3.2 Borne cinéma membre & contrôle tactile",
        paragraphs: [
          "En dehors des cours planifiés, un écran d'accueil interactif permet aux adhérents de sélectionner des séances vidéo à la demande en deux clics.",
          "Un QR code affiché à l'écran permet également à l'adhérent de télécommander la séance directement depuis son smartphone, sans installer d'application.",
        ],
      },
      {
        subtitle: "3.3 Radio d'ambiance & fondu musical",
        paragraphs: [
          "Bobine diffuse une musique d'ambiance continue sur le plateau, avec transition sans blanc (fondu enchaîné) et annonces vocales programmées (fermeture, consignes de sécurité).",
        ],
      },
    ],
  },
  {
    id: "fonctionnalites",
    badge: "Capacités",
    title: "4. Fonctionnalités",
    icon: "features",
    summary:
      "Vue d'ensemble des quatre grands modules de Bobine, avec le bénéfice concret pour la salle et les détails techniques pour les équipes qui en ont besoin.",
    subsections: [
      {
        subtitle: "4.1 Diffusion vidéo automatique",
        paragraphs: [
          "Les cours se lancent et s'arrêtent tout seuls, à l'heure prévue, sans opérateur derrière l'écran.",
          "Détail technique : moteur de rendu MPV avec décodage matériel VA-API (Intel QuickSync / iHD, AMD Radeon), 1080p et 4K jusqu'à 60 images par seconde, moins de 8% d'usage CPU en lecture active, codecs H.264, HEVC, VP9, AV1 et WebM.",
        ],
        techChips: [{ icon: "film", label: "MPV / VA-API" }],
      },
      {
        subtitle: "4.2 Sauvegarde et mises à jour automatiques",
        paragraphs: [
          "Une configuration entière (vidéothèque, planning, réglages) s'exporte en un clic et se restaure en quelques secondes sur une nouvelle machine.",
          "Détail technique : export ZIP complet avec vérification d'intégrité SQLite à la restauration, réinitialisation usine avec confirmation explicite requise, vérification automatique des nouvelles versions sur GitHub.",
        ],
        techChips: [{ icon: "server", label: "ZIP / SQLite" }],
      },
      {
        subtitle: "4.3 Borne libre-service pour les adhérents",
        paragraphs: [
          "Entre deux cours, la salle reste vivante : les adhérents lancent eux-mêmes une séance depuis l'écran tactile ou leur téléphone.",
          "Détail technique : interface plein écran tactile, télécommande smartphone par QR code Wi-Fi local sans application à installer, support des télécommandes USB de type air-mouse, WebSockets locaux pour un temps de réponse quasi instantané.",
        ],
        techChips: [{ icon: "smartphone", label: "QR code / WebSockets" }],
      },
      {
        subtitle: "4.4 Ambiance sonore et robustesse",
        paragraphs: [
          "Une musique de fond continue et une machine qui repart seule après une coupure de courant, sans intervention.",
          "Détail technique : fondu musical sans blanc sonore, annonces vocales programmées, supervision par chien de garde systemd avec relance automatique, reprise instantanée après coupure secteur.",
        ],
        techChips: [{ icon: "terminal", label: "systemd watchdog" }],
      },
    ],
  },
  {
    id: "faq",
    badge: "Support",
    title: "5. FAQ & Résolution des Problèmes",
    icon: "help",
    summary:
      "Réponses aux questions courantes, dépannage réseau, sauvegarde et astuces d'optimisation.",
    subsections: [
      {
        subtitle: "5.1 Comment sauvegarder ma configuration avant une réinstallation ?",
        paragraphs: [
          "Depuis le panneau d'administration, exportez une archive ZIP complète (vidéothèque, planning, réglages) en un clic, puis réimportez-la sur la nouvelle machine.",
          "Vérifiez l'intégrité de la base de données restaurée avec la commande suivante :",
        ],
        codeBlock: "sqlite3 bobine.db 'PRAGMA integrity_check;'",
      },
      {
        subtitle: "5.2 Bobine fonctionne-t-il sans connexion internet ?",
        paragraphs: [
          "Oui. 100% des fonctions (lecture vidéo matérielle, planning récurrent, télécommandes locales, radio d'ambiance) tournent en local, sans aucun accès internet requis après l'installation.",
        ],
      },
      {
        subtitle: "5.3 Quels sont les formats vidéo recommandés ?",
        paragraphs: [
          "Conteneur MP4 ou MKV, encodage vidéo H.264 ou HEVC (H.265) en 1080p 60 images par seconde, piste audio AAC à 192 kbps.",
        ],
      },
    ],
  },
  {
    id: "developpeurs",
    badge: "Technique",
    title: "6. Architecture Technique & Développeurs",
    icon: "code",
    summary:
      "Stack logicielle interne, services systemd et bases pour contribuer au projet open source.",
    subsections: [
      {
        subtitle: "6.1 Stack logicielle",
        paragraphs: [
          "Backend : Python 3 avec FastAPI pour les API REST et WebSockets à faible latence.",
          "Base de données : SQLite, pour la simplicité et la robustesse sans serveur de base de données à maintenir.",
          "Moteur de rendu vidéo : MPV avec accélération matérielle VA-API (Intel QuickSync et AMD Radeon).",
          "Interface web : Next.js et React, exportée statiquement et servie localement par l'appliance.",
        ],
        techChips: [
          { icon: "server", label: "Python 3 / FastAPI" },
          { icon: "database", label: "SQLite" },
          { icon: "film", label: "MPV / VA-API" },
          { icon: "code", label: "Next.js / React" },
        ],
      },
      {
        subtitle: "6.2 Services systemd & chien de garde",
        paragraphs: [
          "Bobine est découpé en services systemd isolés (bobine-server, bobine-player, bobine-kiosk), surveillés par un chien de garde (watchdog) qui relance automatiquement tout service en anomalie.",
        ],
        codeBlock: "sudo systemctl status bobine-server\nsudo systemctl restart bobine-player",
        techChips: [{ icon: "terminal", label: "systemd" }],
      },
      {
        subtitle: "6.3 Points d'entrée de l'API REST locale (extrait)",
        paragraphs: [
          "L'API REST locale, exposée par bobine-server sur le port 8000, pilote la vidéothèque, le planning et les télécommandes. Elle n'est accessible que sur le réseau local de la salle.",
          "Extrait des principaux endpoints (référence non exhaustive, voir le dépôt GitHub pour la liste complète) :",
        ],
        codeBlock:
          "GET  /api/videos            Liste la videotheque locale\nPOST /api/schedule          Cree ou met a jour un creneau hebdomadaire\nGET  /api/status            Etat des services (lecteur, watchdog)\nWS   /ws/remote             Canal temps reel pour la telecommande smartphone",
        techChips: [{ icon: "server", label: "REST / WebSocket" }],
      },
    ],
  },
  {
    id: "feuille-de-route",
    badge: "À venir",
    title: "7. Feuille de Route",
    icon: "roadmap",
    summary:
      "État réel des pistes d'extension de Bobine vers les tablettes tactiles, présenté sans survente : ce qui est à l'étude et ce qui reste une piste exploratoire.",
    subsections: [
      {
        subtitle: "7.1 Android : étude de faisabilité pour tablettes tactiles",
        paragraphs: [
          "L'objectif est d'étendre la portabilité de Bobine vers des tablettes tactiles autonomes comme les Xiaomi Pad (Xiaomi Pad 6, 7 ou 8) et les tablettes équipées d'un port USB-C 3.2 supportant la sortie vidéo DisplayPort (ex. Samsung Galaxy Tab).",
          "Une étude technique explore l'embarquement du serveur Bobine (Python/FastAPI) directement dans une application Android via un pont Python-Java (Chaquopy), avec sortie vidéo déportée vers le téléviseur ou vidéoprojecteur du studio par l'API Presentation d'Android.",
          "Cette piste permettrait à une unique tablette murale de servir à la fois de pupitre coach tactile et de régie vidéo autonome, sans nécessiter de mini PC ou de serveur séparé. La faisabilité est à l'étude en interne, sans date de livraison engagée à ce stade.",
        ],
        techChips: [{ icon: "smartphone", label: "Android / Chaquopy" }, { icon: "tablet", label: "Xiaomi Pad / USB-C DP" }],
      },
      {
        subtitle: "7.2 iOS / iPadOS : piste explorée pour iPads avec sortie vidéo USB-C / Thunderbolt",
        paragraphs: [
          "Dans la même optique de portabilité tactile maximale, la piste iPadOS est envisagée pour les iPads dotés d'une sortie vidéo filaire directe, notamment les iPad Pro à puce Apple Silicon (M1, M2, M4) pourvus d'un port Thunderbolt / USB 4, ainsi que les iPad Air (M2) avec sortie DisplayPort sur USB-C.",
          "Sur ce type d'appareil, un simple câble USB-C ou un dock permettrait d'alimenter la tablette tout en projetant le flux vidéo du cours sur le grand écran du studio, l'écran tactile de l'iPad restant dédié aux commandes de l'instructeur.",
          "Contrairement à l'écosystème Android, iOS restreint fortement l'exécution de processus serveurs locaux en arrière-plan. Le portage de l'architecture Bobine sur iPadOS constitue donc une piste prospective activement réfléchie, mais non engagée techniquement ni calendairement.",
        ],
        techChips: [{ icon: "tablet", label: "iPadOS / Thunderbolt" }],
      },
    ],
  },
];

const en: DocChapter[] = [
  {
    id: "manifeste",
    badge: "Vision & Identity",
    title: "1. Manifesto & Identity",
    icon: "manifesto",
    summary:
      "Bobine was built with a clear purpose: liberate fitness clubs and coaches from proprietary video subscriptions. It is a 100% offline-first, frugal solution licensed under AGPL-3.0.",
    subsections: [
      {
        subtitle: "1.1 The Why: ending proprietary playout lock-in",
        paragraphs: [
          "For years, gym owners and coaches were forced to pay recurring monthly fees of $150 to $400 per screen for closed proprietary boxes. If the club's internet connection stutters during peak hours, workout screens freeze mid-session.",
          "Bobine permanently removes this recurring cost and returns full sovereignty to the club: a screen broadcasting a workout session does not need a perpetual cloud subscription.",
        ],
      },
      {
        subtitle: "1.2 Local sovereignty and open-source commitment",
        paragraphs: [
          "All videos, schedules, and settings are stored locally on the mini PC's drive. Internet is only required once, during installation: no network outage disrupts a class.",
          "The entire codebase is open, auditable on GitHub, and distributed under the AGPL-3.0 copyleft license. No hidden telemetry, no proprietary lock-in.",
        ],
      },
      {
        subtitle: "1.3 The mascot Baamix and energy frugality",
        paragraphs: [
          "The name Bobine pays tribute to 35mm film reels. The mascot Baamix, a white hamster, symbolizes the project's endurance and local ingenuity.",
          "The software runs on refurbished mini PCs (roughly $40-50, e.g. a Dell Wyse 5070) consuming under 10 Watts at full 1080p60/4K playback.",
        ],
      },
    ],
  },
  {
    id: "demarrage-rapide",
    badge: "Tutorial",
    title: "2. Setup Guide & Installation",
    icon: "install",
    summary:
      "Bobine V3.0.0 installation methods: 1-click desktop apps for personal use (Windows, macOS, Linux), or a dedicated 24/7 appliance deployment for a gym.",
    subsections: [
      {
        subtitle: "2.1 Consumer desktop applications (1-click)",
        paragraphs: [
          "Windows 11 / 10: Bobine-Setup-3.0.0.exe installer, silent background startup (systray icon), automatic firewall rule to enable the smartphone remote.",
          "macOS Apple Silicon (M1 to M4): Bobine-3.0.0.dmg disk image, drag-and-drop into Applications, companion menu bar icon. Intel Mac (x86_64) support is currently in validation.",
          "Linux Desktop (Debian / Ubuntu): native bobine_3.0.0_amd64.deb package, installable through the software center or via apt with automatic dependency resolution.",
        ],
        codeBlock: "sudo apt install bobine",
      },
      {
        subtitle: "2.2 Dedicated 24/7 appliance (headless mini PC)",
        paragraphs: [
          "For uninterrupted, permanent playout on a dedicated mini PC (Dell Wyse 5070, Beelink N100, HP ProDesk) running minimal, desktop-less Debian 13.",
          "A single automated installation command, with VA-API hardware acceleration for video playback:",
        ],
        codeBlock: "curl -fsSL https://bobine.fit/install.sh | bash",
      },
      {
        subtitle: "2.3 Network orchestration with Bobine Assistant (Tauri)",
        paragraphs: [
          "Bobine Assistant is a lightweight Rust/Tauri 2 desktop app that discovers appliances on the local network via mDNS (bobine.local), audits hardware over SSH, and deploys without a terminal.",
          "It is an operations tool for technicians managing several venues, separate from the Bobine application itself.",
        ],
      },
      {
        subtitle: "2.4 Release channels: Stable or Beta (Rolling beta)",
        paragraphs: [
          "Bobine offers two release channels: the Stable channel (recommended for production, Vx.y.z tags) and the Beta channel (rolling beta, early access to upcoming features on the fixed beta tag).",
          "Across all platforms (Windows, macOS, Linux, Appliance), installing the Beta upgrades your existing installation in-place without creating a duplicate application or affecting your library and settings. To install the appliance directly on the Beta channel:",
        ],
        codeBlock: "curl -fsSL https://bobine.fit/install.sh | sudo bash -s -- --channel=beta",
      },
    ],
  },
  {
    id: "utilisation",
    badge: "User Manual",
    title: "3. Daily Operations & Usage",
    icon: "play",
    summary:
      "How the web administration dashboard, the member kiosk, the background radio, and remotes work day to day.",
    subsections: [
      {
        subtitle: "3.1 Web administration dashboard",
        paragraphs: [
          "Accessible from any computer, tablet, or smartphone on the venue's local network (Wi-Fi or wired) at http://[MINI_PC_IP]:8000.",
          "Lets you add workout videos (H.264 or HEVC), configure the weekly schedule down to the second, and control audio and video volume.",
        ],
      },
      {
        subtitle: "3.2 Member kiosk & touch control",
        paragraphs: [
          "Outside scheduled classes, an interactive home screen lets members pick an on-demand session in two taps.",
          "An on-screen QR code also lets a member remote-control the session directly from their phone, with no app to install.",
        ],
      },
      {
        subtitle: "3.3 Background radio & audio crossfade",
        paragraphs: [
          "Bobine plays continuous background music across the floor, with gap-free crossfade transitions and scheduled spoken announcements (closing time, safety notices).",
        ],
      },
    ],
  },
  {
    id: "fonctionnalites",
    badge: "Capabilities",
    title: "4. Features",
    icon: "features",
    summary:
      "Overview of Bobine's four core modules, with the concrete benefit for the venue first, and the technical detail for teams that need it.",
    subsections: [
      {
        subtitle: "4.1 Automatic video playout",
        paragraphs: [
          "Classes start and stop on their own, right on schedule, with no one operating a screen.",
          "Technical detail: MPV playout engine with VA-API hardware decoding (Intel QuickSync / iHD, AMD Radeon), 1080p and 4K up to 60 frames per second, under 8% CPU usage during active playback, H.264, HEVC, VP9, AV1 and WebM codecs.",
        ],
        techChips: [{ icon: "film", label: "MPV / VA-API" }],
      },
      {
        subtitle: "4.2 Automatic backup and updates",
        paragraphs: [
          "An entire configuration (video library, schedule, settings) exports in one click and restores in seconds on a new machine.",
          "Technical detail: full ZIP export with SQLite integrity checks on restore, factory reset requiring explicit typed confirmation, automatic check for new releases on GitHub.",
        ],
        techChips: [{ icon: "server", label: "ZIP / SQLite" }],
      },
      {
        subtitle: "4.3 Self-service member kiosk",
        paragraphs: [
          "Between classes, the room stays alive: members start their own session from the touch screen or their phone.",
          "Technical detail: full-screen touch interface, smartphone remote via a local Wi-Fi QR code with no app install, plug-and-play USB air-mouse remote support, local WebSockets for near-instant response.",
        ],
        techChips: [{ icon: "smartphone", label: "QR code / WebSockets" }],
      },
      {
        subtitle: "4.4 Background sound and resilience",
        paragraphs: [
          "Continuous background music, and a machine that comes back on its own after a power cut, with no manual intervention.",
          "Technical detail: gap-free audio crossfade, scheduled spoken announcements, systemd watchdog supervision with automatic recovery, instant resume after a power outage.",
        ],
        techChips: [{ icon: "terminal", label: "systemd watchdog" }],
      },
    ],
  },
  {
    id: "faq",
    badge: "Support",
    title: "5. FAQ & Troubleshooting",
    icon: "help",
    summary:
      "Answers to common questions, network troubleshooting, backups, and optimization tips.",
    subsections: [
      {
        subtitle: "5.1 How do I back up my configuration before reinstalling?",
        paragraphs: [
          "From the admin panel, export a complete ZIP archive (video library, schedule, settings) in one click, then re-import it on the new machine.",
          "Verify the restored database's integrity with the following command:",
        ],
        codeBlock: "sqlite3 bobine.db 'PRAGMA integrity_check;'",
      },
      {
        subtitle: "5.2 Does Bobine work without an internet connection?",
        paragraphs: [
          "Yes. 100% of the functions (hardware video playback, recurring schedule, local remotes, background radio) run locally, with no internet access required after installation.",
        ],
      },
      {
        subtitle: "5.3 What video formats are recommended?",
        paragraphs: [
          "MP4 or MKV container, H.264 or HEVC (H.265) video encoding at 1080p 60 frames per second, AAC audio at 192 kbps.",
        ],
      },
    ],
  },
  {
    id: "developpeurs",
    badge: "Technical",
    title: "6. Technical Architecture & Developers",
    icon: "code",
    summary:
      "Internal software stack, systemd services, and the basics for contributing to the open-source project.",
    subsections: [
      {
        subtitle: "6.1 Software stack",
        paragraphs: [
          "Backend: Python 3 with FastAPI for low-latency REST APIs and WebSockets.",
          "Database: SQLite, for simplicity and robustness with no database server to maintain.",
          "Video rendering engine: MPV with VA-API hardware acceleration (Intel QuickSync and AMD Radeon).",
          "Web interface: Next.js and React, statically exported and served locally by the appliance.",
        ],
        techChips: [
          { icon: "server", label: "Python 3 / FastAPI" },
          { icon: "database", label: "SQLite" },
          { icon: "film", label: "MPV / VA-API" },
          { icon: "code", label: "Next.js / React" },
        ],
      },
      {
        subtitle: "6.2 Systemd services & watchdog",
        paragraphs: [
          "Bobine is split into isolated systemd services (bobine-server, bobine-player, bobine-kiosk), supervised by a watchdog that automatically restarts any service in a faulty state.",
        ],
        codeBlock: "sudo systemctl status bobine-server\nsudo systemctl restart bobine-player",
        techChips: [{ icon: "terminal", label: "systemd" }],
      },
      {
        subtitle: "6.3 Local REST API endpoints (excerpt)",
        paragraphs: [
          "The local REST API, exposed by bobine-server on port 8000, drives the video library, the schedule, and the remotes. It is only reachable on the venue's local network.",
          "Excerpt of the main endpoints (non-exhaustive reference, see the GitHub repository for the full list):",
        ],
        codeBlock:
          "GET  /api/videos            List the local video library\nPOST /api/schedule          Create or update a weekly slot\nGET  /api/status            Service health (player, watchdog)\nWS   /ws/remote             Real-time channel for the smartphone remote",
        techChips: [{ icon: "server", label: "REST / WebSocket" }],
      },
    ],
  },
  {
    id: "feuille-de-route",
    badge: "Upcoming",
    title: "7. Roadmap",
    icon: "roadmap",
    summary:
      "The real state of Bobine's tablet expansion plans, presented without overselling: what is under study and what remains an open exploration.",
    subsections: [
      {
        subtitle: "7.1 Android: feasibility study for touch tablets",
        paragraphs: [
          "The objective is to expand Bobine's portability to standalone touch tablets such as Xiaomi Pad models (Xiaomi Pad 6, 7, or 8) and devices equipped with a USB-C 3.2 port supporting DisplayPort video output (e.g. Samsung Galaxy Tab).",
          "A technical study is exploring embedding the Bobine server (Python/FastAPI) directly inside an Android app through a Python-Java bridge (Chaquopy), with video output routed to the studio display or projector via Android's Presentation API.",
          "This track would enable a single wall-mounted tablet to serve simultaneously as a tactile coach console and as an autonomous video appliance, eliminating the need for a separate mini PC. Feasibility is under internal review, with no committed release date.",
        ],
        techChips: [{ icon: "smartphone", label: "Android / Chaquopy" }, { icon: "tablet", label: "Xiaomi Pad / USB-C DP" }],
      },
      {
        subtitle: "7.2 iOS / iPadOS: explored track for iPads with USB-C / Thunderbolt video output",
        paragraphs: [
          "With the same goal of maximum tactile portability, iPadOS support is actively explored for iPads equipped with wired display output, notably Apple Silicon iPad Pro models (M1, M2, M4) featuring Thunderbolt / USB 4, as well as iPad Air models (M2) with DisplayPort over USB-C.",
          "On these devices, a single USB-C cable or hub would provide power while driving the class video stream to the studio display or projector, leaving the iPad touchscreen dedicated to coach controls.",
          "Unlike the Android environment, iOS strictly sandboxes background server execution. Porting the Bobine architecture to iPadOS is therefore a prospective exploration, without technical or timeline commitment at this stage.",
        ],
        techChips: [{ icon: "tablet", label: "iPadOS / Thunderbolt" }],
      },
    ],
  },
];

export const docChapters: Record<Locale, DocChapter[]> = { fr, en };
