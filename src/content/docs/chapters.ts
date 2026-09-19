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
          "La solution tourne sur des mini PC reconditionnés (à partir d'environ 160 €, par exemple un HP EliteDesk 800 Mini) ou sur un mini PC industriel 100% fanless (environ 600 €) consommant quelques Watts en pleine lecture 1080p60/4K.",
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
      "Méthodes d'installation de Bobine V3.0.5 : applications de bureau en un clic (Windows, macOS, Linux), application native pour tablettes Android, ou déploiement d'une appliance dédiée 24/7 pour une salle de sport.",
    subsections: [
      {
        subtitle: "2.1 Windows 11 / 10 & Windows IoT",
        paragraphs: [
          "Installeur officiel Bobine-Setup-3.0.5.exe : exécution silencieuse en arrière-plan (icône près de l'horloge), mode capot fermé (clamshell) sans mise en veille via powercfg, règle de pare-feu automatique et désinstallation en 1 clic via Inno Setup.",
          "Matériel de référence testé : mini PC Intel N100 ou AMD Ryzen neuf, livré avec Windows 11 Pro préinstallé (voir le hub matériel bobine.fit/materiel pour des références vérifiées et leur prix constaté).",
        ],
        deviceImage: "windows",
      },
      {
        subtitle: "2.2 macOS Apple Silicon (M1 à M4) & Intel",
        paragraphs: [
          "Image disque Bobine-3.0.5.dmg : glisser-déposer dans Applications, menu discret dans la barre supérieure, prévention de veille native caffeinate et accélération matérielle VideoToolbox.",
          "Matériel de référence testé : Mac Mini Apple Silicon en régie dédiée, ou MacBook du coach exploité fermé (mode clamshell) via un hub ou dock USB-C.",
        ],
        deviceImage: "macos",
      },
      {
        subtitle: "2.3 Linux Bureau (Debian / Ubuntu / Mint)",
        paragraphs: [
          "Dépôt APT officiel signé cryptographiquement (https://apt.bobine.fit) pour des mises à jour automatiques via apt upgrade, ou paquet autonome bobine_3.0.5_amd64.deb pour la logithèque. Désinstallation Polkit sécurisée en 1 clic.",
          "Matériel de référence testé : mini PC industriel fanless (dissipation 100% passive, zéro ventilateur), le choix Bobine pour un silence absolu en studio 24/7.",
        ],
        codeBlock:
          "# Dépôt APT officiel Linux (apt.bobine.fit)\ncurl -fsSL https://apt.bobine.fit/bobine.gpg | sudo gpg --dearmor -o /etc/apt/keyrings/bobine.gpg\necho \"deb [signed-by=/etc/apt/keyrings/bobine.gpg] https://apt.bobine.fit/ stable main\" | sudo tee /etc/apt/sources.list.d/bobine.list\nsudo apt update && sudo apt install bobine",
        deviceImage: "linux",
      },
      {
        subtitle: "2.3 bis Linux via le réseau Tor (.onion)",
        paragraphs: [
          "Pour installer et mettre à jour Bobine sans révéler votre adresse IP, le dépôt APT est aussi proposé en service onion (réseau Tor). C'est une copie miroir du dépôt officiel : les paquets restent signés par la même clé, et apt refuse tout paquet dont la signature ne correspond pas.",
          "Comparez l'empreinte de la clé principale avec celle de https://apt.bobine.fit/bobine.gpg : B77D 96D7 2F84 F36A CAA3 F872 9CBF 497D 829E E15A.",
          "Le site est également consultable dans Tor Browser (http://bobinedaoki42tt33rxacmtaab2gxvxb2orqgcyhvowv3aggxhruvrid.onion/). La boutique matériel et l'assistant Baamix n'y sont pas proposés : ils reposent sur des liens d'affiliation et des services tiers. Le miroir est hébergé par le mainteneur, sans journal de visite, avec une disponibilité au mieux. En soutien à la communauté du libre, découvrez le projet Tor : https://www.torproject.org/ (code source : https://github.com/torproject/tor).",
        ],
        codeBlock:
          "# Dépôt APT officiel via Tor (miroir onion)\nsudo apt install apt-transport-tor\ncurl -fsSL https://apt.bobine.fit/bobine.gpg | sudo gpg --dearmor -o /etc/apt/keyrings/bobine.gpg\necho \"deb [signed-by=/etc/apt/keyrings/bobine.gpg] tor+http://rzvwjat5pidtxtwzcsvew7yc5ugfjvzz432ecpn3s5mlch4cs7vvmqad.onion/ stable main\" | sudo tee /etc/apt/sources.list.d/bobine-onion.list\nsudo apt update && sudo apt install bobine",
        deviceImage: "linux",
      },
      {
        subtitle: "2.4 Tablettes Android ARM64",
        paragraphs: [
          "Paquet natif Bobine-3.0.5.apk (API 34-36), embarquant CPython 3.13 et FastAPI via Chaquopy, service de premier plan persistant, accélération MediaCodec et double affichage (/grid tactile + /cinema HDMI USB-C DisplayPort).",
          "Matériel de référence testé : tablette Samsung Galaxy Tab ou Xiaomi Pad avec port USB-C compatible DisplayPort Alt Mode pour la sortie vidéo filaire vers l'écran de salle.",
        ],
        deviceImage: "android",
      },
      {
        subtitle: "2.5 Appliance dédiée & salle 24/7 (script automatisé en 18 étapes)",
        paragraphs: [
          "Pour une diffusion permanente et ininterrompue sur un mini PC dédié sous Debian 13 minimale sans bureau graphique parasite.",
          "L'installation s'exécute de façon entièrement automatisée et idempotente en 18 étapes vérifiées (détection GPU, pilotes VA-API QuickSync, venv Python 3.13, build Next.js SSG, services systemd, audio ALSA, synchronisation NTP, URL mDNS, watchdog, optimisations CPU et vérification des capacités matérielles) :",
        ],
        codeBlock: "curl -fsSL https://bobine.fit/install.sh | sudo bash",
      },
      {
        subtitle: "2.6 Orchestration réseau avec Bobine Assistant (Tauri 2)",
        paragraphs: [
          "Bobine Assistant est une application graphique légère en Rust et Tauri 2 : elle balaie le sous-réseau local et répertorie tous les appareils répondants (nom d'hôte résolu en DNS inverse, IP, OS estimé, ports SSH/Bobine/partage/impression).",
          "La connexion à la cible s'opère par mot de passe ou par import d'une clé SSH privée locale (.ssh/id_ed25519) via le sélecteur natif de fichiers. L'assistant audite le matériel (puissance instantanée en Watts, RAM et fréquence MT/s) et lance le déploiement en 18 étapes avec journal d'évènements compact temps réel sans ouvrir de terminal.",
        ],
      },
      {
        subtitle: "2.7 Canaux de version : Stable ou Bêta (Rolling beta)",
        paragraphs: [
          "Bobine propose deux canaux de mise à jour : le canal Stable (recommandé en production de salle, tags Vx.y.z stricts) et le canal Bêta (rolling beta sur tag unique mobile beta, déployé automatiquement à chaque push sur main).",
          "Sur tous les OS, la Bêta partage les mêmes identifiants applicatifs et s'installe par-dessus la version existante sans créer de doublon ni affecter les bases de données ou médias. Le choix s'effectue dans Réglages → Mises à jour logicielles ou via le paramètre CLI :",
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
      "Fonctionnement de la régie coach, du hub d'ambiances, de la vitrine cinéma membre, du tableau de bord d'assiduité, de la radio 24/7 et des contrôles universels.",
    subsections: [
      {
        subtitle: "3.1 Panneau d'administration web & bibliothèque",
        paragraphs: [
          "Accessible depuis n'importe quel appareil connecté au réseau local (Wi-Fi ou câble) à l'adresse http://[IP_BORNE]:8000.",
          "Permet d'importer des vidéos avec détection FFprobe en direct des canaux audio réels (Stéréo 2.0, Surround 5.1, Mono 1.0) et résolutions (4K Ultra HD, 1080p, etc.), de rédiger des synopsis de cours affichés sur l'écran de pause cinématique, et de programmer la grille hebdomadaire seconde par seconde.",
        ],
      },
      {
        subtitle: "3.2 Console Régie Coach responsive (/coach)",
        paragraphs: [
          "Conçue pour les éducateurs sportifs animant des cours audio ou des chorégraphies en studio :",
          "Sur tablette paysage et ordinateur : pupitre musical à gauche (commandes tactiles 64px, minuteur et jauge de progression interpolés à 10 Hz, tiroir playlist) et Stage Monitor 16:9 en direct avec palette d'ambiances 1-clic à droite.",
          "Sur smartphone ou format portrait : bascule automatique en affichage monoposte avec tiroirs tactiles rétractables (Bottom Sheets) manipulables d'une seule main.",
          "Démarrage sécurisé en pause par défaut, modes d'enchaînement Auto et Manuel épurés, et synchronisation immédiate de la sortie câblée /kiosk sans rechargement de page.",
        ],
      },
      {
        subtitle: "3.3 Hub d'Ambiances Visuelles (/backgrounds) & projection par piste",
        paragraphs: [
          "Galerie cinématique 16:9 regroupant les boucles vidéo et visuels du club, avec prévisualisation automatique au survol ou à l'appui tactile long.",
          "Permet la projection directe 1-clic sur les sorties Câblée (HDMI de salle) ou Réseau, et l'assignation d'une ambiance visuelle distincte par piste audio au sein d'un même cours (échauffement, intensité cardio, étirements, ou option Écran Sobre pour yoga et pilates).",
        ],
      },
      {
        subtitle: "3.4 Vitrine Cinéma Membre & Contrôles Universels",
        paragraphs: [
          "Entre les cours programmés, les adhérents explorent la bibliothèque vidéo sur l'écran de salle (/cinema).",
          "Pilotage universel complet : manettes de jeu (Xbox Series/One, PlayStation DualSense/DS4, Switch Pro, 8BitDo via HTML5 Gamepad API) avec navigation 2D euclidienne fluide et triggers de volume sonore, télécommandes physiques USB/Bluetooth/IR, souris, écran tactile ou QR code smartphone sans application.",
          "Défilement horizontal fluide MarqueeText sur les titres longs et dimensions de miniatures strictement verrouillées à 280px pour préserver l'alignement visuel de la grille.",
        ],
      },
      {
        subtitle: "3.5 Tableau de bord d'assiduité & avis 5 étoiles (/metrics)",
        paragraphs: [
          "Mesure de la fréquentation du club en circuit fermé sans dépendance cloud : 4 KPIs de performance (sessions, heures cumulées, assiduité moyenne, note globale), histogramme horaire 24h en CSS pur et classement des cours les plus plébiscités.",
          "Recueil automatique d'avis avec jauge tactile 5 étoiles apparaissant en fin de séance sur /grid et /cinema, télécommandable à distance et doté d'une fermeture progressive de 5 minutes.",
        ],
      },
      {
        subtitle: "3.6 Radio d'ambiance 24/7 & alertes vocales",
        paragraphs: [
          "Diffusion musicale continue hors séance avec fondu enchaîné sans blanc sonore (Web Audio API) et alertes vocales de sécurité ou d'horaires programmables.",
        ],
      },
    ],
  },
  {
    id: "fonctionnalites",
    badge: "Capacités",
    title: "4. Fonctionnalités & Innovations Métier",
    icon: "features",
    summary:
      "Vue d'ensemble des modules logiciels de Bobine V3.0.5 : moteur Gapless A/B Deck, régie coach, contrôles universels, télémétrie éco-conçue et résilience système.",
    subsections: [
      {
        subtitle: "4.1 Moteur Vidéo Gapless A/B Deck & Diffusion automatique",
        paragraphs: [
          "Élimination totale des écrans noirs de 200 à 600 ms et des coupures HDMI entre les cours grâce à deux instances vidéo maintenues actives dans le DOM avec transition en fondu croisé de 0,4 seconde.",
          "Détail technique : décodage matériel VA-API (Intel QuickSync, AMD Radeon), Apple VideoToolbox et Android MediaCodec jusqu'à 4K 60 fps avec moins de 8% de charge processeur. Suppression définitive de l'animation d'introduction pour un démarrage immédiat.",
        ],
        techChips: [{ icon: "film", label: "Gapless A/B Deck" }, { icon: "film", label: "VA-API / MediaCodec" }],
      },
      {
        subtitle: "4.2 Console Régie Coach & Hub d'Ambiances Visuelles",
        paragraphs: [
          "Pupitre réactif double colonne pensé pour les éducateurs sportifs : régie audio 64px, retour vidéo direct Stage Monitor 16:9, palettes d'ambiances 1-clic et enchaînement sonore Auto/Manuel épuré.",
          "Détail technique : importation audio multi-pistes automatisée (dossiers, ZIP, sélections multiples), détection automatique des préfixes numériques de pistes et extraction déterministe des durées par FFprobe.",
        ],
        techChips: [{ icon: "play", label: "Console Coach /coach" }, { icon: "film", label: "Hub Ambiances" }],
      },
      {
        subtitle: "4.3 Contrôles Universels & Défilement Marquee",
        paragraphs: [
          "Navigation fluide à la manette de jeu (HTML5 Gamepad API), télécommandes multimédias, souris et tactile.",
          "Détail technique : calcul spatial euclidien 2D (moveDomFocus2D), zone morte calibrée (0.45), debouncing et lissage monotone du temps. Titres longs animés en aller-retour alterné (MarqueeText) et miniatures verrouillées en 16:9.",
        ],
        techChips: [{ icon: "smartphone", label: "HTML5 Gamepad API" }, { icon: "film", label: "MarqueeText" }],
      },
      {
        subtitle: "4.4 Métriques d'Assiduité Club & Télémétrie Matérielle Éco-Conçue",
        paragraphs: [
          "Supervision locale complète du club et du matériel : assiduité, avis 5 étoiles, consommation énergétique en direct et veille préventive.",
          "Détail technique : mesure de la puissance instantanée en Watts (W) et Wh (Intel RAPL, Apple ioreg, sysfs Android/Linux, WMI Windows), températures CPU/GPU en direct, et télémétrie RAM sans privilèges root (constructeur, technologie LPDDR5X/DDR5/DDR4, fréquence MT/s).",
        ],
        techChips: [{ icon: "server", label: "Analytics /metrics" }, { icon: "terminal", label: "Télémétrie Watts & RAM" }],
      },
      {
        subtitle: "4.5 Mises à Jour Automatiques Planifiées & Désinstallation 1 Clic",
        paragraphs: [
          "Mise à jour en un clic avec machine à états WebSocket temps réel, vérification d'intégrité SHA-256 via digest natif GitHub Releases, et planification nocturne configurable (défaut 03:00).",
          "Désinstallation automatique universelle en 1 clic (/api/system/uninstall) sur les 5 systèmes d'exploitation avec modale de sécurité stricte par saisie du mot DÉSINSTALLER.",
        ],
        techChips: [{ icon: "server", label: "Update Orchestrator" }, { icon: "terminal", label: "Désinstallation 1-clic" }],
      },
      {
        subtitle: "4.6 Sauvegarde Intégrale ZIP & Résilience Watchdog",
        paragraphs: [
          "Une configuration entière (vidéothèque, musiques, plannings, réglages) s'exporte en un clic en archive ZIP avec contrôle d'intégrité SQLite PRAGMA à la restauration.",
          "Détail technique : surveillance continue par le démon bobine-audio-guard et le timer bobine-watchdog, redémarrage inconditionnel post-coupure secteur.",
        ],
        techChips: [{ icon: "database", label: "ZIP / SQLite" }, { icon: "terminal", label: "systemd watchdog" }],
      },
    ],
  },
  {
    id: "faq",
    badge: "Support",
    title: "5. FAQ & Résolution des Problèmes",
    icon: "help",
    summary:
      "Réponses aux questions d'exploitation, compatibilité des manettes, console coach, télémétrie, sauvegarde et dépannage.",
    subsections: [
      {
        subtitle: "5.1 Comment sauvegarder ma configuration avant une réinstallation ?",
        paragraphs: [
          "Depuis le panneau d'administration (Réglages → Sauvegarde & Restauration), exportez une archive ZIP complète en un clic, puis réimportez-la sur la nouvelle machine.",
          "Vérifiez l'intégrité de la base de données restaurée avec la commande SQLite suivante :",
        ],
        codeBlock: "sqlite3 bobine.db 'PRAGMA integrity_check;'",
      },
      {
        subtitle: "5.2 Quelles manettes et télécommandes sont compatibles avec Bobine ?",
        paragraphs: [
          "Toutes les manettes USB ou Bluetooth standard reconnues par l'API HTML5 Gamepad : manettes Microsoft Xbox Series / Xbox One, Sony PlayStation DualSense / DualShock 4, Nintendo Switch Pro Controller, 8BitDo et manettes génériques. Les télécommandes multimédias USB/IR et les souris sont également prises en charge nativement.",
        ],
      },
      {
        subtitle: "5.3 Bobine fonctionne-t-il sans connexion internet ?",
        paragraphs: [
          "Oui, à 100%. L'ensemble des fonctionnalités (lecture vidéo matérielle A/B deck, régie coach, planning, télécommandes locales, radio d'ambiance, métriques) s'exécute en local sur SSD sans aucun accès distant.",
        ],
      },
      {
        subtitle: "5.4 Comment fonctionne la désinstallation automatique en 1 clic ?",
        paragraphs: [
          "Dans Réglages → Zone de danger, la section « Désinstaller Bobine » déclenche le processus adapté au système (Polkit sur Linux .deb, Inno Setup sur Windows, purge de bundle et LaunchAgent sur Mac, intent Android, script bobine-uninstall sur headless). L'opération nécessite la saisie explicite du mot de confirmation « DÉSINSTALLER ».",
        ],
      },
      {
        subtitle: "5.5 Quels sont les formats vidéo et audio recommandés ?",
        paragraphs: [
          "Vidéo : conteneur MP4 ou MKV, encodage H.264 ou HEVC (H.265) jusqu'en 4K à 60 fps. Audio : pistes MP3, M4A, AAC ou WAV, piste stéréo ou surround 5.1.",
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
      "Stack logicielle unifiée, services systemd, résolution déterministe multimédia et endpoints d'API REST/WebSockets.",
    subsections: [
      {
        subtitle: "6.1 Stack logicielle & modèle mono-processus",
        paragraphs: [
          "Backend : Python 3.13 avec FastAPI et Uvicorn mono-processus (zéro dépendance externe Redis).",
          "Base de données : SQLite avec schéma versionné, migrations automatiques et backfill d'extraction de durées et métadonnées.",
          "Moteurs multimédias : MPV avec VA-API sous Linux, moteur Gapless A/B Deck sous HTML5 (/cinema), et module déterministe app.utils.ffmpeg_binaries pour résoudre FFmpeg/FFprobe sur tous les OS.",
          "Frontend : Next.js App Router, export SSG statique, 17 thèmes calibrés WCAG AAA/AA, aucun emoji.",
        ],
        techChips: [
          { icon: "server", label: "FastAPI / Python 3.13" },
          { icon: "database", label: "SQLite" },
          { icon: "film", label: "Gapless A/B / MPV" },
          { icon: "code", label: "Next.js SSG" },
        ],
      },
      {
        subtitle: "6.2 Services systemd de l'Appliance Headless",
        paragraphs: [
          "Sur Debian 13 dédiée, l'architecture repose sur trois démons supervisés : bobine-backend.service (API FastAPI port 8000), bobine-kiosk.service (Chromium X11 plein écran) et bobine-audio-guard.service (veille sonore et santé audio), encadrés par le timer bobine-watchdog.timer.",
        ],
        codeBlock: "sudo systemctl status bobine-backend bobine-kiosk bobine-audio-guard\nsudo systemctl restart bobine-backend",
        techChips: [{ icon: "terminal", label: "systemd" }],
      },
      {
        subtitle: "6.3 Points d'entrée de l'API REST locale & WebSockets (extrait)",
        paragraphs: [
          "L'API REST locale exposée sur le port 8000 pilote la régie, les métriques, la télémétrie et les mises à jour :",
        ],
        codeBlock:
          "GET  /api/playback/state?channel=cable   Etat de lecture et canal actif\nPOST /api/coach/action                  Commandes du pupitre coach (pause, next, volume)\nGET  /api/metrics/dashboard             KPIs d'assiduité, histogramme 24h et notes\nGET  /api/settings/system               Télémétrie Watts, températures CPU/GPU et RAM\nPOST /api/updates/orchestrate           Lancement mise à jour avec suivi WebSocket\nPOST /api/system/uninstall              Désinstallation automatique 1-clic sécurisée",
        techChips: [{ icon: "server", label: "REST / WebSockets" }],
      },
      {
        subtitle: "6.4 Développement & Gouvernance du Projet",
        paragraphs: [
          "Bobine est conçu, développé et maintenu par FantasmaGlad alias Clément Barillot (contact : clement.barillot@bobine.fit). Le projet est sous licence GNU AGPL-3.0 copyleft stricte, garantissant la pérennité libre du code source pour tous les clubs.",
        ],
      },
    ],
  },
  {
    id: "feuille-de-route",
    badge: "Évolutions",
    title: "7. Feuille de Route & Écosystème",
    icon: "roadmap",
    summary:
      "Suivi des versions publiées, état de l'application native Android pour tablettes tactiles et pistes d'élargissement vers d'autres supports.",
    subsections: [
      {
        subtitle: "7.0 Suivi des versions & publication continue",
        paragraphs: [
          "Chaque nouvelle version est publiée sur GitHub Releases (github.com/FantasmaGlad/Bobine/releases) avec son changelog détaillé, ses binaires signés pour les 5 systèmes d'exploitation, et son SHA-256 de vérification d'intégrité.",
          "Deux canaux permettent de suivre l'avancement du projet : le canal Stable (tags Vx.y.z figés, recommandé en production de salle) et le canal Bêta (rolling beta reconstruit automatiquement à chaque évolution du code sur la branche principale, pour les clubs souhaitant tester les prochaines fonctionnalités en avant-première).",
          "Le dépôt APT officiel (apt.bobine.fit) reflète les deux canaux dans ses distributions stable et beta, permettant une mise à jour automatique via apt upgrade sans réinstallation manuelle.",
        ],
      },
      {
        subtitle: "7.1 Android : application native officielle pour tablettes tactiles",
        paragraphs: [
          "L'application native Android (.apk) est officiellement disponible et éprouvée en conditions réelles de cours (V3.0.5). Elle transforme n'importe quelle tablette moderne (Xiaomi Pad 6, 7 ou 8, Samsung Galaxy Tab avec port USB-C DisplayPort) en régie autonome sans PC.",
          "Bobine embarque le moteur FastAPI sous CPython 3.13 via Chaquopy et un ForegroundService persistant. La sortie vidéo déportée vers le téléviseur ou projecteur diffuse la vitrine /cinema en HDMI sans barre système, tandis que la tablette tactile affiche le pupitre de commande /grid ou la console coach /coach.",
          "L'application gère l'accélération matérielle MediaCodec, le relais des touches de manettes et télécommandes vers la sortie externe, la mémorisation mDNS (bobine.local) et le double stockage partitionné (interne F2FS pour la base et externe FUSE pour les médias).",
        ],
        techChips: [{ icon: "smartphone", label: "Android ARM64 / Chaquopy" }, { icon: "tablet", label: "Xiaomi Pad / USB-C DP" }, { icon: "film", label: "MediaCodec" }],
      },
      {
        subtitle: "7.2 iOS / iPadOS : piste explorée pour iPads avec sortie vidéo USB-C / Thunderbolt",
        paragraphs: [
          "Dans la même optique de portabilité tactile maximale, la piste iPadOS est envisagée pour les iPads dotés d'une sortie vidéo filaire directe, notamment les iPad Pro à puce Apple Silicon (M1, M2, M4) pourvus d'un port Thunderbolt / USB 4, ainsi que les iPad Air (M2) avec sortie DisplayPort sur USB-C.",
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
          "The software runs on refurbished mini PCs (starting around $160, e.g. an HP EliteDesk 800 Mini) or a 100% fanless industrial mini PC (around $600) consuming just a few Watts at full 1080p60/4K playback.",
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
      "Bobine V3.0.5 installation methods: 1-click desktop applications (Windows, macOS, Linux), native Android tablet app, or a dedicated 24/7 appliance deployment for a gym studio.",
    subsections: [
      {
        subtitle: "2.1 Windows 11 / 10 & Windows IoT",
        paragraphs: [
          "Official Bobine-Setup-3.0.5.exe installer: silent background execution (systray icon near clock), clamshell laptop mode without sleep via powercfg, automatic firewall rule, and 1-click uninstaller via Inno Setup.",
          "Reference hardware tested: a new Intel N100 or AMD Ryzen mini PC shipped with Windows 11 Pro (see the hardware hub at bobine.fit/materiel for verified picks and their checked price).",
        ],
        deviceImage: "windows",
      },
      {
        subtitle: "2.2 macOS Apple Silicon (M1 to M4) & Intel",
        paragraphs: [
          "Bobine-3.0.5.dmg disk image: drag-and-drop into Applications, discreet menu bar icon, native caffeinate sleep prevention, and VideoToolbox hardware acceleration.",
          "Reference hardware tested: a dedicated Apple Silicon Mac Mini, or the coach's MacBook run closed (clamshell mode) through a USB-C hub or dock.",
        ],
        deviceImage: "macos",
      },
      {
        subtitle: "2.3 Linux Desktop (Debian / Ubuntu / Mint)",
        paragraphs: [
          "Official cryptographically signed APT repository (https://apt.bobine.fit) for automated updates via apt upgrade, or standalone bobine_3.0.5_amd64.deb package for the software center. 1-click Polkit uninstaller.",
          "Reference hardware tested: a fanless industrial mini PC (100% passive cooling, zero fan) — the Bobine pick for absolute silence in a 24/7 studio.",
        ],
        codeBlock:
          "# Official Linux APT repository (apt.bobine.fit)\ncurl -fsSL https://apt.bobine.fit/bobine.gpg | sudo gpg --dearmor -o /etc/apt/keyrings/bobine.gpg\necho \"deb [signed-by=/etc/apt/keyrings/bobine.gpg] https://apt.bobine.fit/ stable main\" | sudo tee /etc/apt/sources.list.d/bobine.list\nsudo apt update && sudo apt install bobine",
        deviceImage: "linux",
      },
      {
        subtitle: "2.3 bis Linux over the Tor network (.onion)",
        paragraphs: [
          "To install and update Bobine without revealing your IP address, the APT repository is also offered as an onion service (Tor network). It is a mirror of the official repository: packages remain signed by the same key, and apt rejects any package whose signature does not match.",
          "Compare the primary key fingerprint with the one at https://apt.bobine.fit/bobine.gpg: B77D 96D7 2F84 F36A CAA3 F872 9CBF 497D 829E E15A.",
          "The site can also be browsed in Tor Browser (http://bobinedaoki42tt33rxacmtaab2gxvxb2orqgcyhvowv3aggxhruvrid.onion/). The hardware store and the Baamix assistant are not offered there: they rely on affiliate links and third-party services. The mirror is hosted by the maintainer, keeps no visit log, and is available on a best-effort basis. In support of the free-software community, discover the Tor project: https://www.torproject.org/ (source code: https://github.com/torproject/tor).",
        ],
        codeBlock:
          "# Official APT repository over Tor (onion mirror)\nsudo apt install apt-transport-tor\ncurl -fsSL https://apt.bobine.fit/bobine.gpg | sudo gpg --dearmor -o /etc/apt/keyrings/bobine.gpg\necho \"deb [signed-by=/etc/apt/keyrings/bobine.gpg] tor+http://rzvwjat5pidtxtwzcsvew7yc5ugfjvzz432ecpn3s5mlch4cs7vvmqad.onion/ stable main\" | sudo tee /etc/apt/sources.list.d/bobine-onion.list\nsudo apt update && sudo apt install bobine",
        deviceImage: "linux",
      },
      {
        subtitle: "2.4 Android ARM64 Tablets",
        paragraphs: [
          "Certified native Bobine-3.0.5.apk (API 34-36), embedding CPython 3.13 and FastAPI via Chaquopy, persistent ForegroundService, native MediaCodec acceleration, and dual display (touchscreen /grid + HDMI TV /cinema over USB-C DisplayPort).",
          "Reference hardware tested: a Samsung Galaxy Tab or Xiaomi Pad tablet with a USB-C port supporting DisplayPort Alt Mode for wired video output to the studio screen.",
        ],
        deviceImage: "android",
      },
      {
        subtitle: "2.5 Dedicated 24/7 appliance (18-step automated shell script)",
        paragraphs: [
          "For uninterrupted, permanent playout on a dedicated mini PC running minimal, desktop-less Debian 13.",
          "Installation executes in 18 idempotent and verified steps (GPU detection, QuickSync VA-API drivers, Python 3.13 venv, Next.js SSG build, systemd services, ALSA audio, NTP sync, mDNS URL, watchdog, CPU tuning, and hardware playback verification):",
        ],
        codeBlock: "curl -fsSL https://bobine.fit/install.sh | sudo bash",
      },
      {
        subtitle: "2.6 Network orchestration with Bobine Assistant (Tauri 2)",
        paragraphs: [
          "Bobine Assistant is a lightweight Rust/Tauri 2 desktop app that scans the local subnet and lists every responding device (reverse-DNS hostname, IP address, estimated OS, open ports for SSH/Bobine/Samba/printing).",
          "Connect to targets via password or by importing a local private SSH key (.ssh/id_ed25519) through the native file picker. The assistant audits hardware (real-time power in Watts, RAM and MT/s frequency) and executes the 18-step deployment with a live compact log stream without opening a terminal.",
        ],
      },
      {
        subtitle: "2.7 Release channels: Stable or Beta (Rolling beta)",
        paragraphs: [
          "Bobine offers two release channels: the Stable channel (recommended for production gym playout, strict Vx.y.z tags) and the Beta channel (rolling beta on fixed mobile tag beta, rebuilt automatically on every push to main).",
          "Across all platforms, Beta shares identical application IDs and upgrades existing installations in-place without creating duplicate applications or altering media and databases. Toggle anytime in Settings → Software Updates or via CLI flag:",
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
      "How the coach console, ambiances hub, member cinema display, attendance analytics, 24/7 radio, and universal controllers work day to day.",
    subsections: [
      {
        subtitle: "3.1 Web administration dashboard & media library",
        paragraphs: [
          "Accessible from any computer, tablet, or smartphone on the local network (Wi-Fi or wired) at http://[APPLIANCE_IP]:8000.",
          "Enables video imports with live FFprobe extraction of true audio channels (Stereo 2.0, Surround 5.1, Mono 1.0) and resolutions (4K Ultra HD, 1080p), custom class synopsis editing displayed on the cinematic pause screen, and weekly second-by-second scheduling.",
        ],
      },
      {
        subtitle: "3.2 Responsive Coach Console (/coach)",
        paragraphs: [
          "Tailored for fitness instructors leading audio classes and studio choreography:",
          "On landscape tablets and desktop computers: audio desk on the left (large 64px touch controls, 10 Hz interpolated countdown timer and progress bar, collapsible playlist drawer) and live 16:9 HDMI Stage Monitor with 1-click visual ambiances palette on the right.",
          "On smartphones or portrait mode: automatically switches to single-column layout with retractable Bottom Sheets operable with one hand during class.",
          "Safe start paused by default, clean Auto and Manual chaining modes, and instant /kiosk cabled display synchronization without refreshing.",
        ],
      },
      {
        subtitle: "3.3 Visual Ambiances Hub (/backgrounds) & per-track projection",
        paragraphs: [
          "Cinematic 16:9 gallery of video loops and club visuals, featuring automatic video playback previews on mouse hover or long touch press.",
          "Supports 1-click projection onto Cabled (HDMI) or Network outputs, and dynamic per-track visual assignments within the same audio course (warm-up, cardio peak, recovery, or minimalist dark screen for yoga and pilates).",
        ],
      },
      {
        subtitle: "3.4 Member Cinema Display & Universal Controls",
        paragraphs: [
          "Between scheduled classes, gym members explore the class catalog directly on the studio display (/cinema).",
          "Full universal control support: gamepads (Xbox Series/One, PlayStation DualSense/DS4, Switch Pro, 8BitDo via HTML5 Gamepad API) with 2D Euclidean spatial navigation and volume triggers, multimedia remotes (USB, Bluetooth, IR), mouse, touchscreen tap on video, or local Wi-Fi QR-code smartphone remote with zero app install.",
          "Smooth MarqueeText back-and-forth horizontal animation for long titles and strictly locked thumbnail dimensions (280px cards, 157.5px height) preventing grid warping.",
        ],
      },
      {
        subtitle: "3.5 Attendance analytics & 5-star ratings (/metrics)",
        paragraphs: [
          "Track club attendance locally without cloud dependencies: 4 key KPIs (total sessions, cumulative workout hours, average attendance rate, overall rating), 24-hour native CSS peak-hours histogram, and class popularity ranking.",
          "Automated feedback collection via a 5-star touch-friendly rating widget appearing at class completion on /grid and /cinema, operable by remote control and featuring a 5-minute auto-dismiss timer.",
        ],
      },
      {
        subtitle: "3.6 Background radio 24/7 & voice announcements",
        paragraphs: [
          "Continuous background music across the gym floor with seamless Web Audio crossfading and scheduled spoken announcements (closing time reminders, safety etiquette).",
        ],
      },
    ],
  },
  {
    id: "fonctionnalites",
    badge: "Capabilities",
    title: "4. Features & Studio Innovations",
    icon: "features",
    summary:
      "Overview of Bobine V3.0.5 software modules: Gapless A/B Deck video engine, coach console, universal controls, eco-designed telemetry, and system resilience.",
    subsections: [
      {
        subtitle: "4.1 Gapless A/B Deck Video Engine & Automated Playout",
        paragraphs: [
          "Complete elimination of 200-600ms black frames and projector HDMI handshake resyncs between consecutive workouts via dual continuous video instances in the DOM and 0.4s crossfading.",
          "Technical detail: hardware-accelerated decoding via VA-API (Intel QuickSync, AMD Radeon), Apple VideoToolbox, and Android MediaCodec up to 4K 60 fps at under 8% CPU usage. Permanent removal of intro animations for zero-latency instant start.",
        ],
        techChips: [{ icon: "film", label: "Gapless A/B Deck" }, { icon: "film", label: "VA-API / MediaCodec" }],
      },
      {
        subtitle: "4.2 Responsive Coach Console & Visual Ambiances Hub",
        paragraphs: [
          "Purpose-built studio workstation for coaches: 64px audio deck, direct 16:9 Stage Monitor video feed, 1-click ambient palettes, and clean Auto/Manual audio chaining.",
          "Technical detail: automated multi-track audio imports (folders, ZIP archives, multiple selections), automatic track ordering by numeric filename prefixes, and deterministic FFprobe duration calculation.",
        ],
        techChips: [{ icon: "play", label: "Coach Console /coach" }, { icon: "film", label: "Ambiances Hub" }],
      },
      {
        subtitle: "4.3 Universal Controls & Marquee Scrolling",
        paragraphs: [
          "Smooth navigation via gamepads (HTML5 Gamepad API), physical multimedia remotes, mouse, and touchscreen.",
          "Technical detail: 2D Euclidean spatial focus calculation (moveDomFocus2D), calibrated deadzone (0.45), debouncing, and strictly monotonic time smoothing. Animated MarqueeText for long titles and locked 16:9 thumbnail dimensions.",
        ],
        techChips: [{ icon: "smartphone", label: "HTML5 Gamepad API" }, { icon: "film", label: "MarqueeText" }],
      },
      {
        subtitle: "4.4 Club Attendance Metrics & Eco-Designed Hardware Telemetry",
        paragraphs: [
          "Comprehensive local supervision: member attendance, 5-star reviews, live power consumption, and thermal safety.",
          "Technical detail: real-time electrical power measurement in Watts (W) and Wh (Intel RAPL, Apple ioreg, Linux/Android sysfs, Windows WMI), live CPU/GPU temperatures, and non-root RAM telemetry (manufacturer, LPDDR5X/DDR5/DDR4 technology, MT/s clock speed).",
        ],
        techChips: [{ icon: "server", label: "Analytics /metrics" }, { icon: "terminal", label: "Telemetry Watts & RAM" }],
      },
      {
        subtitle: "4.5 Scheduled Auto-Updates & 1-Click Uninstaller",
        paragraphs: [
          "1-click updates powered by a WebSocket state machine, native SHA-256 digest validation against GitHub Releases, and configurable nightly update scheduling (default 03:00).",
          "Automated universal 1-click uninstallation (/api/system/uninstall) across all 5 operating systems protected by a strict confirmation modal requiring typing UNINSTALL.",
        ],
        techChips: [{ icon: "server", label: "Update Orchestrator" }, { icon: "terminal", label: "1-Click Uninstall" }],
      },
      {
        subtitle: "4.6 Full ZIP Backup & Watchdog Resilience",
        paragraphs: [
          "Full venue configuration (video library, music tracks, schedules, settings) exports in one click as a ZIP archive with SQLite PRAGMA integrity validation upon restoration.",
          "Technical detail: continuous supervision by the bobine-audio-guard daemon and bobine-watchdog timer, unconditional reboot post blackout.",
        ],
        techChips: [{ icon: "database", label: "ZIP / SQLite" }, { icon: "terminal", label: "systemd watchdog" }],
      },
    ],
  },
  {
    id: "faq",
    badge: "Support",
    title: "5. FAQ & Troubleshooting",
    icon: "help",
    summary:
      "Answers to operational questions, gamepad compatibility, coach console, telemetry, backups, and troubleshooting.",
    subsections: [
      {
        subtitle: "5.1 How do I back up my configuration before reinstalling?",
        paragraphs: [
          "From the administration panel (Settings → Backup & Restore), export a full ZIP archive in one click, then restore it on the new machine.",
          "Verify the restored database integrity using the following SQLite command:",
        ],
        codeBlock: "sqlite3 bobine.db 'PRAGMA integrity_check;'",
      },
      {
        subtitle: "5.2 What gamepads and remotes are compatible with Bobine?",
        paragraphs: [
          "Any standard USB or Bluetooth gamepad recognized by the HTML5 Gamepad API: Microsoft Xbox Series / Xbox One, Sony PlayStation DualSense / DualShock 4, Nintendo Switch Pro Controller, 8BitDo, and generic USB gamepads. USB/IR multimedia remotes and mice are also supported plug-and-play.",
        ],
      },
      {
        subtitle: "5.3 Does Bobine work without an active internet connection?",
        paragraphs: [
          "Yes, 100%. All features (hardware A/B deck playback, coach console, timetables, local remotes, background radio, attendance analytics) execute locally from SSD storage with zero cloud dependencies.",
        ],
      },
      {
        subtitle: "5.4 How does the 1-click automatic uninstaller work?",
        paragraphs: [
          "In Settings → Danger Zone, clicking 'Uninstall Bobine' executes the OS-specific purge process (Polkit on Linux .deb, Inno Setup on Windows, bundle and LaunchAgent removal on macOS, Android delete intent, bobine-uninstall script on headless). The action requires typing the confirmation keyword 'DÉSINSTALLER' (or UNINSTALL).",
        ],
      },
      {
        subtitle: "5.5 What video and audio formats are recommended?",
        paragraphs: [
          "Video: MP4 or MKV container, H.264 or HEVC (H.265) encoding up to 4K at 60 fps. Audio: MP3, M4A, AAC, or WAV files in stereo or surround 5.1.",
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
      "Unified software stack, systemd services, deterministic multimedia resolution, and REST API/WebSocket endpoints.",
    subsections: [
      {
        subtitle: "6.1 Software stack & single-process architecture",
        paragraphs: [
          "Backend: Python 3.13 with FastAPI and single-process Uvicorn (zero external Redis dependency).",
          "Database: SQLite with versioned schema, automated migrations, and duration/metadata backfills.",
          "Playout engines: MPV with VA-API on Linux, HTML5 Gapless A/B Deck on /cinema, and deterministic app.utils.ffmpeg_binaries resolution across all platforms.",
          "Frontend: Next.js App Router, static SSG export, 17 WCAG AAA/AA calibrated themes, zero emoji.",
        ],
        techChips: [
          { icon: "server", label: "FastAPI / Python 3.13" },
          { icon: "database", label: "SQLite" },
          { icon: "film", label: "Gapless A/B / MPV" },
          { icon: "code", label: "Next.js SSG" },
        ],
      },
      {
        subtitle: "6.2 Dedicated Headless Appliance Systemd Services",
        paragraphs: [
          "On Debian 13 minimal, Bobine runs on three supervised daemons: bobine-backend.service (FastAPI API on port 8000), bobine-kiosk.service (Chromium X11 fullscreen kiosk), and bobine-audio-guard.service (audio watchdog and safety), framed by the bobine-watchdog.timer.",
        ],
        codeBlock: "sudo systemctl status bobine-backend bobine-kiosk bobine-audio-guard\nsudo systemctl restart bobine-backend",
        techChips: [{ icon: "terminal", label: "systemd" }],
      },
      {
        subtitle: "6.3 Local REST API endpoints & WebSockets (excerpt)",
        paragraphs: [
          "The local REST API exposed on port 8000 controls playout, coach mode, attendance metrics, telemetry, and updates:",
        ],
        codeBlock:
          "GET  /api/playback/state?channel=cable   Playout state and active channel\nPOST /api/coach/action                  Coach desk controls (pause, next, volume)\nGET  /api/metrics/dashboard             Attendance KPIs, 24h peak histogram, ratings\nGET  /api/settings/system               Live Watts, CPU/GPU temperatures, RAM telemetry\nPOST /api/updates/orchestrate           Trigger update with WebSocket stream progress\nPOST /api/system/uninstall              Secure 1-click automatic uninstaller",
        techChips: [{ icon: "server", label: "REST / WebSockets" }],
      },
      {
        subtitle: "6.4 Development & Project Governance",
        paragraphs: [
          "Bobine is designed, developed, and maintained by FantasmaGlad alias Clément Barillot (contact: clement.barillot@bobine.fit). The project is licensed under GNU AGPL-3.0 copyleft, ensuring perpetual open-source freedom for sports clubs.",
        ],
      },
    ],
  },
  {
    id: "feuille-de-route",
    badge: "Ecosystem",
    title: "7. Roadmap & Ecosystem",
    icon: "roadmap",
    summary:
      "Release tracking, status of the native Android application for touch tablets, and exploratory expansion pathways.",
    subsections: [
      {
        subtitle: "7.0 Release tracking & continuous publishing",
        paragraphs: [
          "Every new version is published on GitHub Releases (github.com/FantasmaGlad/Bobine/releases) with a detailed changelog, signed binaries for all 5 operating systems, and a SHA-256 integrity checksum.",
          "Two channels track the project's progress: the Stable channel (frozen Vx.y.z tags, recommended for production gym playout) and the Beta channel (rolling beta, automatically rebuilt on every change to the main branch, for clubs wanting an early look at upcoming features).",
          "The official APT repository (apt.bobine.fit) mirrors both channels in its stable and beta distributions, enabling automatic updates via apt upgrade with no manual reinstall.",
        ],
      },
      {
        subtitle: "7.1 Android: official native application for touch tablets",
        paragraphs: [
          "The native Android application (.apk) is officially available and battle-tested in real gym conditions (V3.0.5). It turns any modern tablet (Xiaomi Pad 6, 7, or 8, Samsung Galaxy Tab with USB-C DisplayPort) into an autonomous playout appliance without requiring a PC.",
          "Bobine embeds FastAPI under CPython 3.13 via Chaquopy and a persistent ForegroundService. The video feed connected to the TV or projector displays the /cinema view over HDMI without system bars, while the tablet touchscreen runs the /grid desk or /coach console.",
          "The app includes MediaCodec hardware acceleration, gamepad and remote control forwarding to the external display, mDNS discovery (bobine.local), and dual storage partitioning (fast internal F2FS for database and external FUSE for media).",
        ],
        techChips: [{ icon: "smartphone", label: "Android ARM64 / Chaquopy" }, { icon: "tablet", label: "Xiaomi Pad / USB-C DP" }, { icon: "film", label: "MediaCodec" }],
      },
      {
        subtitle: "7.2 iOS / iPadOS: explored track for iPads with USB-C / Thunderbolt video output",
        paragraphs: [
          "With the same goal of maximum tactile portability, iPadOS support is actively explored for iPads equipped with wired display output, notably Apple Silicon iPad Pro models (M1, M2, M4) featuring Thunderbolt / USB 4, as well as iPad Air models (M2) with DisplayPort over USB-C.",
          "Unlike the Android environment, iOS strictly sandboxes background server execution. Porting the Bobine architecture to iPadOS is therefore a prospective exploration, without technical or timeline commitment at this stage.",
        ],
        techChips: [{ icon: "tablet", label: "iPadOS / Thunderbolt" }],
      },
    ],
  },
];

export const docChapters: Record<Locale, DocChapter[]> = { fr, en };
