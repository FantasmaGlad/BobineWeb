import type { Locale } from "@/lib/i18n";
import type { DocChapter } from "./types";
import { ANDROID } from "@/lib/productFacts";
import {
  FAMILY_NOTES,
  NOT_VALIDATED_NOTE,
  SIGNING_KEY_FINGERPRINT,
  archCommands,
  archInstallScript,
  fedoraCommands,
  fedoraInstallScript,
  packageFileName,
  repoStatusNote,
} from "@/lib/linuxPackages";

const rpmName = (arch: "x86_64" | "arm64") => packageFileName("fedora", "stable", arch, "x.y.z");
const archName = (arch: "x86_64" | "arm64") => packageFileName("arch", "stable", arch, "x.y.z");
const noteList = (items: Array<{ fr: string; en: string }>, l: "fr" | "en") => items.map((i) => i[l]).join(" ");

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
        deviceImage: "mascot",
      },
    ],
  },
  {
    id: "demarrage-rapide",
    badge: "Tutoriel",
    title: "2. Guide de Démarrage & Installation",
    icon: "install",
    summary:
      "Méthodes d'installation de Bobine : applications de bureau en un clic (Windows, macOS, Linux), applications natives pour tablettes Android et boîtiers Android TV, ou déploiement d'une appliance dédiée 24/7 pour une salle de sport.",
    subsections: [
      {
        subtitle: "2.1 Windows 11 / 10 & Windows ARM (Qualcomm Snapdragon)",
        paragraphs: [
          "Installeurs officiels Bobine-Setup-x.y.z.exe (x86_64 pour processeurs Intel et AMD) et Bobine-Setup-x.y.z-arm64.exe (architecture native ARM64 pour puces Qualcomm Snapdragon X Elite et Snapdragon X Plus) : exécution silencieuse en arrière-plan (icône près de l'horloge), mode capot fermé (clamshell) sans mise en veille via powercfg, règle de pare-feu automatique et désinstallation en 1 clic via Inno Setup.",
          "Matériel de référence testé : PC portables Copilot+ Snapdragon X (Surface Laptop 7, ASUS Vivobook S 15, Lenovo Yoga Slim 7x, Samsung Galaxy Book4 Edge) et mini PC Intel N100 / AMD Ryzen livrés avec Windows 11 Pro (voir le hub matériel bobine.fit/materiel pour des références vérifiées et leur prix constaté).",
        ],
        deviceImage: "windows",
      },
      {
        subtitle: "2.2 macOS Apple Silicon (M1 à M4)",
        paragraphs: [
          "Image disque Bobine-x.y.z.dmg : glisser-déposer dans Applications, menu discret dans la barre supérieure, prévention de veille native caffeinate et accélération matérielle VideoToolbox.",
          "Matériel de référence testé : Mac Mini Apple Silicon en régie dédiée, ou MacBook du coach exploité fermé (mode clamshell) via un hub ou dock USB-C.",
        ],
        deviceImage: "macos",
      },
      {
        subtitle: "2.3 Linux Bureau Debian / Ubuntu / Mint (paquet .deb — x86_64 & ARM64)",
        paragraphs: [
          "Dépôt APT officiel signé cryptographiquement (https://apt.bobine.fit) distribuant nativement les architectures amd64 et arm64 pour des mises à jour automatiques via apt upgrade. Paquets autonomes directs disponibles : bobine_x.y.z_amd64.deb et bobine_x.y.z_arm64.deb (pour PC Snapdragon sous Linux, NVIDIA DGX Spark, Raspberry Pi 5, Orange Pi 5 et Radxa Rock 5B). Désinstallation Polkit sécurisée en 1 clic.",
          "Matériel de référence testé : mini PC industriel fanless x86 (Intel N100) et stations/cartes ARM64 basse consommation (NVIDIA DGX Spark, Raspberry Pi 5 8 Go), le choix Bobine pour un silence absolu en studio 24/7.",
        ],
        codeBlock:
          "# Dépôt APT officiel Linux (apt.bobine.fit — compatible amd64 & arm64)\ncurl -fsSL https://apt.bobine.fit/bobine.gpg | sudo gpg --dearmor -o /etc/apt/keyrings/bobine.gpg\necho \"deb [signed-by=/etc/apt/keyrings/bobine.gpg] https://apt.bobine.fit/ stable main\" | sudo tee /etc/apt/sources.list.d/bobine.list\nsudo apt update && sudo apt install bobine",
        deviceImage: "linux",
      },
      {
        subtitle: "2.3 bis Linux Bureau Fedora, RHEL et dérivés (paquet .rpm — x86_64 & ARM64)",
        paragraphs: [
          `Dépôt dnf officiel signé cryptographiquement (https://rpm.bobine.fit) pour Fedora, Nobara et, via EPEL, RHEL, AlmaLinux et Rocky Linux, en x86_64 et aarch64. Une fois le dépôt ajouté, ${fedoraCommands().upgrade} met Bobine à jour avec le reste du système. Paquets autonomes directs : ${rpmName("x86_64")} et ${rpmName("arm64")}, à installer avec sudo dnf install ./fichier.rpm. Sur dnf 4 (RHEL, AlmaLinux, Rocky Linux), la commande d'ajout est ${fedoraCommands().addRepoLegacy}.`,
          `Le fichier bobine-stable.repo suit la Stable ; bobine-beta.repo et bobine-canary.repo suivent la Bêta et la Canary, avec la même clé de signature. Au premier dnf install, dnf affiche l'empreinte de la clé : comparez-la à ${SIGNING_KEY_FINGERPRINT} avant d'accepter.`,
          `ffmpeg : Fedora ne fournit que ffmpeg-free, privé de plusieurs codecs. Pour lire tous les formats de cours, ajoutez RPM Fusion puis remplacez-le par le ffmpeg complet (commandes ci-dessous). ${noteList(FAMILY_NOTES.fedora.derivatives.slice(1), "fr")} ${FAMILY_NOTES.fedora.limits[1].fr}`,
          [repoStatusNote("fedora", "fr"), NOT_VALIDATED_NOTE.fr].filter(Boolean).join(" "),
        ],
        codeBlock: `# Dépôt dnf officiel (rpm.bobine.fit — x86_64 & aarch64)\n${fedoraInstallScript()}\n\n# ffmpeg complet via RPM Fusion (recommandé)\n${fedoraCommands().ffmpeg}\n\n# Mise à jour\n${fedoraCommands().upgrade}`,
      },
      {
        subtitle: "2.3 ter Linux Bureau Arch Linux et dérivés (paquet pacman — x86_64 & ARM64)",
        paragraphs: [
          `Dépôt pacman officiel [bobine] (https://arch.bobine.fit) pour Arch Linux, EndeavourOS, CachyOS et Manjaro en x86_64, et Arch Linux ARM en aarch64. Importez et approuvez la clé de signature, puis ajoutez la section [bobine] à /etc/pacman.conf avec SigLevel = Required DatabaseOptional : pacman refuse alors tout paquet dont la signature ne correspond pas. ${archCommands().upgrade} met ensuite Bobine à jour avec le système.`,
          `Pour suivre la Bêta ou la Canary, remplacez stable par beta ou canary dans la ligne Server. Paquets autonomes directs : ${archName("x86_64")} et ${archName("arm64")}, à installer avec sudo pacman -U ./fichier. Avant d'approuver la clé, comparez son empreinte avec ${SIGNING_KEY_FINGERPRINT}.`,
          `${noteList(FAMILY_NOTES.arch.derivatives.slice(1), "fr")} ${FAMILY_NOTES.arch.limits[0].fr}`,
          [repoStatusNote("arch", "fr"), NOT_VALIDATED_NOTE.fr].filter(Boolean).join(" "),
        ],
        codeBlock: `# Dépôt pacman officiel (arch.bobine.fit — x86_64 & aarch64)\n${archInstallScript()}\n\n# Mise à jour\n${archCommands().upgrade}`,
      },
      {
        subtitle: "2.3 quater Linux via le réseau Tor (.onion)",
        paragraphs: [
          "Pour installer et mettre à jour Bobine sans révéler votre adresse IP, le dépôt APT est aussi proposé en service onion (réseau Tor). C'est une copie miroir du dépôt officiel : les paquets restent signés par la même clé, et apt refuse tout paquet dont la signature ne correspond pas.",
          "Le script https://bobine.fit/install-tor.sh (à lire avant de l'exécuter) fait ces étapes à votre place et s'arrête si l'empreinte de la clé diffère de celle publiée. Le dépôt onion publie les trois suites, stable, beta et canary : l'option --channel=stable|beta|canary choisit le canal de mise à jour (sans l'option, le script pose la question sur un terminal et prend stable sinon), et --dry-run n'installe rien. Les commandes ci-dessous sont la version manuelle, sur le canal stable ; remplacez le dernier mot de la ligne deb par beta ou canary pour suivre un autre canal.",
          "Comparez l'empreinte de la clé principale avec celle de https://apt.bobine.fit/bobine.gpg : B77D 96D7 2F84 F36A CAA3 F872 9CBF 497D 829E E15A.",
          "Le site est également consultable dans Tor Browser (http://bobinedaoki42tt33rxacmtaab2gxvxb2orqgcyhvowv3aggxhruvrid.onion/). La boutique matériel et l'assistant Baamix n'y sont pas proposés : ils reposent sur des liens d'affiliation et des services tiers. J'héberge ce miroir moi-même, sans journal de visite, avec une disponibilité au mieux. En soutien à la communauté du libre, découvrez le projet Tor : https://www.torproject.org/ (code source : https://github.com/torproject/tor).",
        ],
        codeBlock:
          "# Dépôt APT officiel via Tor (miroir onion)\nsudo apt install apt-transport-tor\ncurl -fsS --socks5-hostname 127.0.0.1:9050 http://rzvwjat5pidtxtwzcsvew7yc5ugfjvzz432ecpn3s5mlch4cs7vvmqad.onion/bobine.gpg | sudo gpg --dearmor -o /etc/apt/keyrings/bobine.gpg\necho \"deb [signed-by=/etc/apt/keyrings/bobine.gpg] tor+http://rzvwjat5pidtxtwzcsvew7yc5ugfjvzz432ecpn3s5mlch4cs7vvmqad.onion/ stable main\" | sudo tee /etc/apt/sources.list.d/bobine-onion.list\nsudo apt update && sudo apt install bobine",
        deviceImage: "linux",
      },
      {
        subtitle: "2.4 Tablettes Android & Google Books (Aluminium OS)",
        paragraphs: [
          `Paquet natif Bobine-x.y.z.apk (Android ${ANDROID.minVersion} à ${ANDROID.maxVersion}, API ${ANDROID.minApi}-${ANDROID.maxApi}), embarquant CPython 3.13 et FastAPI via Chaquopy, service de premier plan persistant, accélération MediaCodec et double affichage (/grid tactile + /cinema HDMI USB-C DisplayPort avec résolution robuste du branchement à chaud sans écran noir).`,
          "Compatibilité Google Books : Bobine s'exécute nativement en plein écran sur les ordinateurs portables Google Book (Aluminium OS) via l'APK avec accélération matérielle complète, et sera très prochainement disponible en téléchargement direct 1 clic sur le Google Play Store.",
          "Matériel de référence testé : tablettes Samsung Galaxy Tab ou Xiaomi Pad avec port USB-C compatible DisplayPort Alt Mode, et ordinateurs portables Google Book.",
          "Démarrage avec l'appareil : Réglages → « Démarrage de l'appareil » (case « Lancer Bobine au démarrage de l'appareil ») relance le serveur Bobine quand l'appareil redémarre ou que l'application est mise à jour. L'ouverture automatique de l'écran dépend d'Android : elle exige l'autorisation « Afficher par-dessus d'autres applications », que certains appareils (dont des boîtiers Android TV) réinitialisent à chaque redémarrage. Dans ce cas, le serveur et les écrans distants fonctionnent déjà ; ouvrez simplement l'application pour afficher l'écran local.",
          "Mises à jour intégrées : si Android bloque l'installation depuis l'application (source inconnue non autorisée), Bobine l'indique avant de télécharger et ouvre le réglage correspondant au lieu d'échouer en cours de route.",
        ],
        deviceImage: ["android", "googlebook"],
      },
      {
        subtitle: "2.4 bis Android TV & Google TV (Box TV, Clés & Smart TVs)",
        paragraphs: [
          "Paquet dédié officiel Bobine-TV-x.y.z.apk (com.bobine.app.tv) conçu pour les boîtiers grand public (Google TV Streamer, Xiaomi TV Box S, Smart TVs et boîtiers sous Android TV / Google TV 14 ou supérieur). L'application s'intègre au lanceur officiel Leanback avec sa bannière 16:9, neutralise le prérequis d'écran tactile, empêche la mise en veille (FLAG_KEEP_SCREEN_ON) et s'ouvre par défaut sur le kiosque plein écran (/kiosk) navigable à 100% à la télécommande directionnelle D-Pad.",
          `Architecture : le paquet TV est universel. Il s'installe aussi bien sur les boîtiers dont le système est 64 bits que sur ceux dont le système est 32 bits (ARM armeabi-v7a), ce qui est le cas de plusieurs boîtiers Xiaomi, bien que leur processeur soit 64 bits. Android ${ANDROID.minVersion} (API ${ANDROID.minApi}) ou supérieur est requis, comme pour tous les paquets Android de Bobine.`,
          "Stockage externe USB indispensable : Les box TV n'embarquent généralement que 4 à 8 Go de stockage flash eMMC interne (largement saturé par le système). Pour stocker vos cours vidéo en mode autonome, le branchement d'une clé USB 3.0 ou d'un SSD externe (formaté en FAT32 ou exFAT) via un adaptateur USB-C OTG est indispensable. Bobine détecte et sélectionne automatiquement ce stockage amovible sans aucune manipulation technique.",
          "Méthodes d'installation (Sideload) : Vous pouvez transférer sans fil l'APK depuis votre smartphone ou PC vers la TV grâce à l'application « Send Files to TV », l'installer depuis une clé USB via un gestionnaire de fichiers TV (File Commander), ou le pousser via le réseau local en ADB Wi-Fi (adb connect <ip_tv>:5555 && adb install Bobine-TV-x.y.z.apk).",
          "Google Play Store : Bobine pour Android TV est en cours de déploiement officiel sur le Play Store. Dès sa publication, l'installation et les futures mises à jour se feront en 1 clic directement depuis votre téléviseur.",
        ],
      },
      {
        subtitle: "2.5 Appliance dédiée & salle 24/7 (script automatisé en 18 étapes — x86_64 & ARM64)",
        paragraphs: [
          "Pour une diffusion permanente et ininterrompue sur un mini PC dédié sous Debian 13 minimale sans bureau graphique parasite, que ce soit sur architecture x86_64 ou ARM64 (aarch64 : mini PC Snapdragon sous Linux, NVIDIA DGX Spark, Raspberry Pi 5, Orange Pi 5, Radxa Rock 5B).",
          "L'installation s'exécute de façon entièrement automatisée et idempotente en 18 étapes vérifiées (détection GPU, pilotes VA-API QuickSync, venv Python 3.13, build Next.js SSG, services systemd, audio ALSA, synchronisation NTP, URL mDNS, watchdog, optimisations CPU et vérification des capacités matérielles) :",
        ],
        codeBlock: "curl -fsSL https://bobine.fit/install.sh | sudo bash",
      },
      {
        subtitle: "2.6 Orchestration réseau avec Bobine Assistant (Tauri 2 — x86_64 & ARM64)",
        paragraphs: [
          "Bobine Assistant est une application graphique légère en Rust et Tauri 2 disponible pour Linux en binaires x86_64 (bobine-assistant) et ARM64 (bobine-assistant-arm64) : elle balaie le sous-réseau local et répertorie tous les appareils répondants (nom d'hôte résolu en DNS inverse, IP, OS estimé, ports SSH/Bobine/partage/impression).",
          "La connexion à la cible s'opère par mot de passe ou par import d'une clé SSH privée locale (.ssh/id_ed25519) via le sélecteur natif de fichiers. L'assistant audite le matériel (puissance instantanée en Watts, RAM et fréquence MT/s) et lance le déploiement en 18 étapes avec journal d'évènements compact temps réel sans ouvrir de terminal.",
        ],
      },
      {
        subtitle: "2.7 Canaux de version : Stable, Bêta ou Canary",
        paragraphs: [
          "Bobine propose trois canaux de mise à jour : le canal Stable (recommandé en production de salle, tags Vx.y.z stricts), le canal Bêta (lots de fonctionnalités/correctifs que je curate et publie manuellement) et le canal Canary (rolling sur tag mobile canary, reconstruit automatiquement à chaque push sur main, zéro curation).",
          "Sur tous les OS, Bêta et Canary partagent les mêmes identifiants applicatifs et s'installent par-dessus la version existante sans créer de doublon ni affecter les bases de données ou médias. Le choix s'effectue dans Réglages → Mises à jour logicielles ou via le paramètre CLI (l'installeur Tor, install-tor.sh, accepte la même option --channel et pose la question sur un terminal quand elle est absente) :",
        ],
        codeBlock: "curl -fsSL https://bobine.fit/install.sh | sudo bash -s -- --channel=beta   # ou --channel=canary",
        deviceImage: "channels",
      },
      {
        subtitle: "2.8 Navigateurs supportés (Firefox, Chrome, Edge, Safari)",
        paragraphs: [
          "L'interface d'administration et les lecteurs ouverts depuis un autre appareil (/radio, /kiosk, /cinema, /coach) fonctionnent dans Firefox (version courante, précédente et ESR, bureau et Android), Chrome, Edge et Safari. Depuis la 4.0.3, le support de Firefox est vérifié de bout en bout sur Firefox 157 par des tests automatiques (envoi de fichiers repris après une coupure réseau, flux vidéo conformes au protocole HTTP, lecture H.264). Windows, macOS, Firefox pour Android et la version ESR ne sont pas encore mesurés.",
          "Quand un navigateur ne sait pas décoder une vidéo (HEVC ou 10 bits, selon le système et le matériel), Bobine lui sert une version H.264 compatible produite à la demande, sans jamais modifier l'original. Réglages → Compatibilité navigateur affiche un diagnostic local (formats décodés, fonctions disponibles, mesure d'images perdues). Le verrou d'écran et les manettes exigent HTTPS ou localhost.",
        ],
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
          "Depuis la 5.0.2, la radio compte deux sorties indépendantes : la radio câblée (/radio?channel=cable), jouée sur l'écran physiquement connecté une fois celui-ci basculé sur Radio depuis la page Sortie Câblé, et la radio réseau (/radio?channel=network), pour tout autre appareil du réseau local (/radio seul reste un alias de la radio réseau). Chaque sortie a sa file d'attente, son volume, ses rappels, son planning et ses réglages du son (égaliseur 5 bandes, renfort des basses, loudness, protection anti-saturation, trois préréglages) ; la bibliothèque musicale et les playlists restent communes.",
        ],
      },
      {
        subtitle: "3.7 Sous-titres multilingues (.srt / .vtt)",
        paragraphs: [
          "Chaque cours vidéo peut recevoir plusieurs pistes de sous-titres : fichiers .srt ou .vtt ajoutés depuis la bibliothèque, ou joints au fichier vidéo lors de l'import (glisser-déposer). Les fichiers .srt sont convertis automatiquement en WebVTT, la langue est reconnue d'après le nom du fichier (par exemple cours.fr.srt, cours.en.vtt ; français par défaut) et chaque fichier est limité à 2 Mo.",
          "Les sous-titres sont stockés localement avec le reste des données et s'activent depuis le menu de sous-titres de /cinema et dans le lecteur de la bibliothèque. Supprimer un cours supprime aussi ses fichiers de sous-titres.",
          "Depuis l'administration (tableau de bord et télécommande mobile), vous choisissez la piste de sous-titres affichée sur l'écran de salle : le choix est transmis en direct au kiosque et à /cinema, sans toucher à l'écran.",
        ],
      },
      {
        subtitle: "3.8 Chapitres de cours (JSON, WebVTT, texte)",
        paragraphs: [
          "Un cours peut porter une liste de chapitres (début, fin, titre ; 200 chapitres et 120 caractères par titre au maximum). Depuis la fiche du cours dans la bibliothèque, vous pouvez les saisir à la main, importer un fichier, extraire ceux qui sont incorporés au fichier vidéo (lus avec FFprobe) ou exporter la liste au format JSON.",
          "Trois formats d'import sont reconnus d'après le contenu : JSON (une liste « chapters » d'objets avec « start » ou « start_seconds », « end » facultatif et « title », éventuellement localisé {\"fr\": …, \"en\": …}), WebVTT de type chapitres, ou texte brut avec un chapitre par ligne (« 05:00 Cardio », « [1:02:10] - Étirements »). Un fichier invalide est refusé avec un message qui indique la ligne en cause, sans rien modifier.",
          "Les chapitres apparaissent en repères sur la barre de progression du tableau de bord, de la télécommande mobile et de /cinema, en liste sur laquelle on appuie pour sauter au chapitre, et en bandeau discret à l'écran quand le cours change de chapitre (kiosque et /cinema).",
        ],
      },
      {
        subtitle: "3.9 Administration sur smartphone (télécommande mobile)",
        paragraphs: [
          "Sur téléphone, l'administration adopte une mise en page dédiée. Le bloc « En cours » est un widget en verre dépoli avec la miniature, le titre, la durée, la progression et les commandes à portée de pouce.",
          "« Lancer un cours » ouvre une feuille plein écran avec trois onglets (Cours, Playlists, Fonds), une recherche instantanée et un aperçu (miniature, durée, description) avant le lancement, comme sur ordinateur. Les listes déroulantes de plus de quelques éléments (bibliothèque, planning, playlists, journaux) s'ouvrent en feuille avec recherche au lieu du sélecteur natif.",
          "L'adresse affichée en haut de l'administration est celle du réseau Wi-Fi ou Ethernet de l'appareil (les interfaces VPN, conteneurs et réseau mobile sont écartées), et la liste complète des adresses joignables figure dans Réglages. Sur Android, l'adresse est lue directement auprès du système.",
        ],
      },
      {
        subtitle: "3.10 Périphériques : audio, Bluetooth et Wi-Fi (5.0.2)",
        paragraphs: [
          "L'entrée Périphériques regroupe les sorties audio, le Bluetooth et le Wi-Fi de la machine qui diffuse. Le premier onglet est une vue globale en carte (la machine au centre, ses connexions autour : sorties audio, appareils Bluetooth, réseau, écrans et télécommandes Bobine connectés) ; un clic sur une sortie audio ouvre son détail (niveau, balance, son de test, analyse, profil, nom personnalisé, masquage).",
          "La fonction est désactivée par défaut. L'écran local de la machine est de confiance ; tout autre appareil saisit un code PIN à 6 chiffres défini depuis l'écran local (jamais stocké en clair, session de 15 minutes, blocage temporaire après 5 essais). Toute modification du Wi-Fi est à confirmer : sans confirmation sous 60 secondes, l'ancien réseau est rétabli. Le réseau local étant en HTTP, le PIN y circule en clair : il se saisit sur un réseau de confiance.",
          "Selon le système : Linux (bureau et appliance) gère tout via PipeWire, BlueZ et NetworkManager ; Android gère les sorties audio et le volume, le Bluetooth, et affiche l'état du Wi-Fi en lecture seule avec un accès aux réglages d'Android ; sous Windows et macOS, le composant natif bobine-devices est embarqué avec les paquets.",
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
      "Vue d'ensemble des modules logiciels de Bobine : moteur Gapless A/B Deck, régie coach, contrôles universels, télémétrie éco-conçue et résilience système.",
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
      {
        subtitle: "4.7 Identité visuelle « glassmorphism » & 16 thèmes",
        paragraphs: [
          "Toute l'interface d'administration (bibliothèque, planning, audio, radio, réglages, journaux) adopte un style translucide inspiré d'Apple : cartes en verre dépoli, dégradés doux et contours marqués. Le thème Lavande est le thème par défaut ; 16 thèmes calibrés WCAG sont disponibles.",
          "L'écran de pause de /cinema reprend le recouvrement façon Netflix, et le changement de sortie câblée/réseau est animé, sur Android (tactile et HDMI) comme sur ordinateur. Le logo officiel du menu et l'écran de démarrage Android sont déclinés selon le canal de mise à jour actif (Stable, Bêta ou Canary).",
        ],
        techChips: [{ icon: "film", label: "Glassmorphism" }],
      },
      {
        subtitle: "4.8 Découverte réseau bobine.local & mises à jour fiabilisées",
        paragraphs: [
          "Le service mDNS republie périodiquement l'adresse de bobine.local et retente avec un délai croissant après un changement d'IP (DHCP, Wi-Fi) ou un échec. Son état réel est visible dans Réglages, avec une alerte si bobine.local ne répond pas.",
          "Le pipeline de mise à jour est fiabilisé sur toutes les plateformes : le retour de Bêta ou Canary vers Stable est proposé explicitement, l'empreinte SHA-256 est vérifiée avant toute installation (y compris sous Android, qui choisit l'APK téléphone ou Android TV selon l'appareil), et l'acquittement de la notification est conservé côté serveur.",
        ],
        techChips: [{ icon: "server", label: "mDNS / Update Orchestrator" }],
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
          "Backend : Python avec FastAPI et Uvicorn mono-processus (zéro dépendance externe Redis). Python 3.11 minimum : 3.13 sur Debian 13 et les tablettes Android, 3.11 dans le paquet Android TV (seul runtime embarqué disponible pour les systèmes 32 bits).",
          "Base de données : SQLite avec schéma versionné, migrations automatiques et backfill d'extraction de durées et métadonnées.",
          "Moteurs multimédias : MPV avec VA-API sous Linux, moteur Gapless A/B Deck sous HTML5 (/cinema), et module déterministe app.utils.ffmpeg_binaries pour résoudre FFmpeg/FFprobe sur tous les OS.",
          "Frontend : Next.js App Router, export SSG statique, 16 thèmes calibrés WCAG AAA/AA, aucun emoji.",
        ],
        techChips: [
          { icon: "server", label: "FastAPI / Python 3.11+" },
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
          "Trois canaux permettent de suivre l'avancement du projet : le canal Stable (tags Vx.y.z figés, recommandé en production de salle), le canal Bêta (lots de fonctionnalités/correctifs curés, publiés manuellement) et le canal Canary (rolling, reconstruit automatiquement à chaque évolution du code sur la branche principale, pour les clubs souhaitant tester les toutes dernières modifications sans attendre un lot).",
          "Le dépôt APT officiel (apt.bobine.fit) reflète les trois canaux dans ses distributions stable, beta et canary, permettant une mise à jour automatique via apt upgrade sans réinstallation manuelle. Le dépôt APT du miroir Tor (.onion) publie les mêmes trois suites. Les dépôts Fedora (rpm.bobine.fit, dnf) et Arch Linux (arch.bobine.fit, pacman) suivent les mêmes trois canaux, avec la même clé de signature.",
        ],
      },
      {
        subtitle: "7.1 Android : application native officielle pour tablettes tactiles",
        paragraphs: [
          "L'application native Android (.apk) est officiellement disponible et éprouvée en conditions réelles de cours. Elle transforme n'importe quelle tablette moderne (Xiaomi Pad 6, 7 ou 8, Samsung Galaxy Tab avec port USB-C DisplayPort) en régie autonome sans PC.",
          `Bobine embarque le moteur FastAPI sous CPython via Chaquopy (3.13 sur tablettes) et un ForegroundService persistant. Le paquet Android TV (Bobine-TV) reprend ce moteur pour les boîtiers ARM 32 et 64 bits, sous Android ${ANDROID.minVersion} ou supérieur. La sortie vidéo déportée vers le téléviseur ou projecteur diffuse la vitrine /cinema en HDMI sans barre système, tandis que la tablette tactile affiche le pupitre de commande /grid ou la console coach /coach.`,
          "L'application gère l'accélération matérielle MediaCodec, le relais des touches de manettes et télécommandes vers la sortie externe, la mémorisation mDNS (bobine.local) et le double stockage partitionné (interne F2FS pour la base et externe FUSE pour les médias).",
        ],
        techChips: [{ icon: "smartphone", label: "Android ARM 32/64 bits / Chaquopy" }, { icon: "tablet", label: "Xiaomi Pad / USB-C DP" }, { icon: "film", label: "MediaCodec" }],
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
        deviceImage: "mascot",
      },
    ],
  },
  {
    id: "demarrage-rapide",
    badge: "Tutorial",
    title: "2. Setup Guide & Installation",
    icon: "install",
    summary:
      "Bobine installation methods: 1-click desktop applications (Windows, macOS, Linux), native apps for Android tablets and Android TV boxes, or a dedicated 24/7 appliance deployment for a gym studio.",
    subsections: [
      {
        subtitle: "2.1 Windows 11 / 10 & Windows ARM (Qualcomm Snapdragon)",
        paragraphs: [
          "Official Bobine-Setup-x.y.z.exe installer (x86_64 for Intel/AMD processors) and Bobine-Setup-x.y.z-arm64.exe (native ARM64 architecture for Qualcomm Snapdragon X Elite and Snapdragon X Plus SoCs): silent background execution (systray icon near clock), clamshell laptop mode without sleep via powercfg, automatic firewall rule, and 1-click uninstaller via Inno Setup.",
          "Reference hardware tested: Copilot+ Snapdragon X laptops (Surface Laptop 7, ASUS Vivobook S 15, Lenovo Yoga Slim 7x, Samsung Galaxy Book4 Edge) and new Intel N100 / AMD Ryzen mini PCs shipped with Windows 11 Pro (see the hardware hub at bobine.fit/materiel for verified picks and their checked price).",
        ],
        deviceImage: "windows",
      },
      {
        subtitle: "2.2 macOS Apple Silicon (M1 to M4)",
        paragraphs: [
          "Bobine-x.y.z.dmg disk image: drag-and-drop into Applications, discreet menu bar icon, native caffeinate sleep prevention, and VideoToolbox hardware acceleration.",
          "Reference hardware tested: a dedicated Apple Silicon Mac Mini, or the coach's MacBook run closed (clamshell mode) through a USB-C hub or dock.",
        ],
        deviceImage: "macos",
      },
      {
        subtitle: "2.3 Linux Desktop Debian / Ubuntu / Mint (.deb package — x86_64 & ARM64)",
        paragraphs: [
          "Official cryptographically signed APT repository (https://apt.bobine.fit) natively serving both amd64 and arm64 architectures for automated updates via apt upgrade. Standalone direct packages available: bobine_x.y.z_amd64.deb and bobine_x.y.z_arm64.deb (for Snapdragon Linux laptops, NVIDIA DGX Spark, Raspberry Pi 5, Orange Pi 5, and Radxa Rock 5B). 1-click Polkit uninstaller.",
          "Reference hardware tested: fanless industrial mini PCs (Intel N100) and ultra low power ARM64 single-board stations (NVIDIA DGX Spark, Raspberry Pi 5 8 GB) — the Bobine pick for absolute silence in a 24/7 studio.",
        ],
        codeBlock:
          "# Official Linux APT repository (apt.bobine.fit — amd64 & arm64 compatible)\ncurl -fsSL https://apt.bobine.fit/bobine.gpg | sudo gpg --dearmor -o /etc/apt/keyrings/bobine.gpg\necho \"deb [signed-by=/etc/apt/keyrings/bobine.gpg] https://apt.bobine.fit/ stable main\" | sudo tee /etc/apt/sources.list.d/bobine.list\nsudo apt update && sudo apt install bobine",
        deviceImage: "linux",
      },
      {
        subtitle: "2.3 bis Linux Desktop Fedora, RHEL and derivatives (.rpm package — x86_64 & ARM64)",
        paragraphs: [
          `Official cryptographically signed dnf repository (https://rpm.bobine.fit) for Fedora, Nobara and, through EPEL, RHEL, AlmaLinux and Rocky Linux, on x86_64 and aarch64. Once the repository is added, ${fedoraCommands().upgrade} updates Bobine along with the rest of the system. Standalone direct packages: ${rpmName("x86_64")} and ${rpmName("arm64")}, installed with sudo dnf install ./file.rpm. On dnf 4 (RHEL, AlmaLinux, Rocky Linux) the command to add it is ${fedoraCommands().addRepoLegacy}.`,
          `The bobine-stable.repo file follows Stable; bobine-beta.repo and bobine-canary.repo follow Beta and Canary, with the same signing key. At the first dnf install, dnf shows the key fingerprint: compare it with ${SIGNING_KEY_FINGERPRINT} before accepting.`,
          `ffmpeg: Fedora only ships ffmpeg-free, stripped of several codecs. To play every class format, add RPM Fusion and swap it for the full ffmpeg (commands below). ${noteList(FAMILY_NOTES.fedora.derivatives.slice(1), "en")} ${FAMILY_NOTES.fedora.limits[1].en}`,
          [repoStatusNote("fedora", "en"), NOT_VALIDATED_NOTE.en].filter(Boolean).join(" "),
        ],
        codeBlock: `# Official dnf repository (rpm.bobine.fit — x86_64 & aarch64)\n${fedoraInstallScript()}\n\n# Full ffmpeg through RPM Fusion (recommended)\n${fedoraCommands().ffmpeg}\n\n# Update\n${fedoraCommands().upgrade}`,
      },
      {
        subtitle: "2.3 ter Linux Desktop Arch Linux and derivatives (pacman package — x86_64 & ARM64)",
        paragraphs: [
          `Official pacman repository [bobine] (https://arch.bobine.fit) for Arch Linux, EndeavourOS, CachyOS and Manjaro on x86_64, and Arch Linux ARM on aarch64. Import and trust the signing key, then add the [bobine] section to /etc/pacman.conf with SigLevel = Required DatabaseOptional: pacman then rejects any package whose signature does not match. ${archCommands().upgrade} then updates Bobine along with the system.`,
          `To follow Beta or Canary, replace stable with beta or canary in the Server line. Standalone direct packages: ${archName("x86_64")} and ${archName("arm64")}, installed with sudo pacman -U ./file. Before trusting the key, compare its fingerprint with ${SIGNING_KEY_FINGERPRINT}.`,
          `${noteList(FAMILY_NOTES.arch.derivatives.slice(1), "en")} ${FAMILY_NOTES.arch.limits[0].en}`,
          [repoStatusNote("arch", "en"), NOT_VALIDATED_NOTE.en].filter(Boolean).join(" "),
        ],
        codeBlock: `# Official pacman repository (arch.bobine.fit — x86_64 & aarch64)\n${archInstallScript()}\n\n# Update\n${archCommands().upgrade}`,
      },
      {
        subtitle: "2.3 quater Linux over the Tor network (.onion)",
        paragraphs: [
          "To install and update Bobine without revealing your IP address, the APT repository is also offered as an onion service (Tor network). It is a mirror of the official repository: packages remain signed by the same key, and apt rejects any package whose signature does not match.",
          "The https://bobine.fit/install-tor.sh script (read it before running it) performs these steps for you and stops if the key fingerprint differs from the published one. The onion repository publishes all three suites, stable, beta and canary: the --channel=stable|beta|canary option picks the update channel (without it, the script asks on a terminal and falls back to stable otherwise), and --dry-run installs nothing. The commands below are the manual version, on the stable channel; replace the last word of the deb line with beta or canary to follow another channel.",
          "Compare the primary key fingerprint with the one at https://apt.bobine.fit/bobine.gpg: B77D 96D7 2F84 F36A CAA3 F872 9CBF 497D 829E E15A.",
          "The site can also be browsed in Tor Browser (http://bobinedaoki42tt33rxacmtaab2gxvxb2orqgcyhvowv3aggxhruvrid.onion/). The hardware store and the Baamix assistant are not offered there: they rely on affiliate links and third-party services. I host this mirror myself, keep no visit log, and run it on a best-effort basis. In support of the free-software community, discover the Tor project: https://www.torproject.org/ (source code: https://github.com/torproject/tor).",
        ],
        codeBlock:
          "# Official APT repository over Tor (onion mirror)\nsudo apt install apt-transport-tor\ncurl -fsS --socks5-hostname 127.0.0.1:9050 http://rzvwjat5pidtxtwzcsvew7yc5ugfjvzz432ecpn3s5mlch4cs7vvmqad.onion/bobine.gpg | sudo gpg --dearmor -o /etc/apt/keyrings/bobine.gpg\necho \"deb [signed-by=/etc/apt/keyrings/bobine.gpg] tor+http://rzvwjat5pidtxtwzcsvew7yc5ugfjvzz432ecpn3s5mlch4cs7vvmqad.onion/ stable main\" | sudo tee /etc/apt/sources.list.d/bobine-onion.list\nsudo apt update && sudo apt install bobine",
        deviceImage: "linux",
      },
      {
        subtitle: "2.4 Android Tablets & Google Books (Aluminium OS)",
        paragraphs: [
          `Certified native Bobine-x.y.z.apk (Android ${ANDROID.minVersion} to ${ANDROID.maxVersion}, API ${ANDROID.minApi}-${ANDROID.maxApi}), embedding CPython 3.13 and FastAPI via Chaquopy, persistent ForegroundService, native MediaCodec acceleration, and robust dual display (touchscreen /grid + HDMI TV /cinema over USB-C DisplayPort with resilient hotplug handling).`,
          "Google Books compatibility: Bobine runs natively in fullscreen mode on Google Book laptops (Aluminium OS) via the APK with full hardware acceleration, and will be arriving soon as a 1-click install from the Google Play Store.",
          "Reference hardware tested: Samsung Galaxy Tab or Xiaomi Pad tablets with a USB-C port supporting DisplayPort Alt Mode, and Google Book laptops.",
          "Starting with the device: Settings → \"Device startup\" (\"Launch Bobine when the device starts\") restarts the Bobine server when the device reboots or the app is updated. Opening the screen automatically depends on Android: it requires the \"Display over other apps\" permission, which some devices (including Android TV boxes) reset at every reboot. In that case the server and the remote screens already work; just open the app to show the local screen.",
          "Built-in updates: if Android blocks installs from the app (unknown sources not allowed), Bobine says so before downloading and opens the matching setting instead of failing midway.",
        ],
        deviceImage: ["android", "googlebook"],
      },
      {
        subtitle: "2.4 bis Android TV & Google TV (Streaming Boxes, Sticks & Smart TVs)",
        paragraphs: [
          "Dedicated official build Bobine-TV-x.y.z.apk (com.bobine.app.tv) tailored for streaming boxes (Google TV Streamer, Xiaomi TV Box S, Smart TVs and boxes running Android TV / Google TV 14 or later). The app integrates into the Leanback home screen with its 16:9 banner, eliminates touchscreen requirements, enforces FLAG_KEEP_SCREEN_ON, and launches straight into the fullscreen kiosk interface (/kiosk) fully operable with a directional D-Pad remote control.",
          `Architecture: the TV package is universal. It installs on boxes with a 64-bit system as well as on those with a 32-bit system (ARM armeabi-v7a), as is the case for several Xiaomi boxes, even though their processor is 64-bit. Android ${ANDROID.minVersion} (API ${ANDROID.minApi}) or later is required, as for every Bobine Android package.`,
          "Essential external USB storage: Streaming TV devices typically ship with meager 4 to 8 GB internal eMMC flash storage (mostly occupied by OS system files). To store your studio video classes in standalone server mode, connecting a USB 3.0 flash drive or external SSD (formatted in FAT32 or exFAT) via a USB-C OTG hub is required. Bobine automatically detects and selects this mounted removable drive.",
          "Current Sideload Installation Methods: Wirelessly transfer the APK from your phone or PC using the 'Send Files to TV' app, install it from a USB flash drive via a TV file explorer (File Commander), or deploy it over the local network via ADB Wi-Fi (adb connect <tv_ip>:5555 && adb install Bobine-TV-x.y.z.apk).",
          "Google Play Store: Bobine for Android TV will soon be available on the Google Play Store. Once published, installation and future updates will be available in 1 click directly from your TV's app store.",
        ],
      },
      {
        subtitle: "2.5 Dedicated 24/7 appliance (18-step automated shell script — x86_64 & ARM64)",
        paragraphs: [
          "For uninterrupted, permanent playout on a dedicated mini PC running minimal, desktop-less Debian 13, on either x86_64 or ARM64 hardware (aarch64: Snapdragon Linux PCs, NVIDIA DGX Spark, Raspberry Pi 5, Orange Pi 5, Radxa Rock 5B).",
          "Installation executes in 18 idempotent and verified steps (GPU detection, QuickSync VA-API drivers, Python 3.13 venv, Next.js SSG build, systemd services, ALSA audio, NTP sync, mDNS URL, watchdog, CPU tuning, and hardware playback verification):",
        ],
        codeBlock: "curl -fsSL https://bobine.fit/install.sh | sudo bash",
      },
      {
        subtitle: "2.6 Network orchestration with Bobine Assistant (Tauri 2 — x86_64 & ARM64)",
        paragraphs: [
          "Bobine Assistant is a lightweight Rust/Tauri 2 desktop app available for Linux in both x86_64 (bobine-assistant) and ARM64 (bobine-assistant-arm64) binaries: it scans the local subnet and lists every responding device (reverse-DNS hostname, IP address, estimated OS, open ports for SSH/Bobine/Samba/printing).",
          "Connect to targets via password or by importing a local private SSH key (.ssh/id_ed25519) through the native file picker. The assistant audits hardware (real-time power in Watts, RAM and MT/s frequency) and executes the 18-step deployment with a live compact log stream without opening a terminal.",
        ],
      },
      {
        subtitle: "2.7 Release channels: Stable, Beta or Canary",
        paragraphs: [
          "Bobine offers three release channels: the Stable channel (recommended for production gym playout, strict Vx.y.z tags), the Beta channel (batches of features/fixes I curate and publish manually) and the Canary channel (rolling on fixed mobile tag canary, rebuilt automatically on every push to main, zero curation).",
          "Across all platforms, Beta and Canary share identical application IDs and upgrade existing installations in-place without creating duplicate applications or altering media and databases. Toggle anytime in Settings → Software Updates or via CLI flag (the Tor installer, install-tor.sh, accepts the same --channel option and asks on a terminal when it is missing):",
        ],
        codeBlock: "curl -fsSL https://bobine.fit/install.sh | sudo bash -s -- --channel=beta   # or --channel=canary",
        deviceImage: "channels",
      },
      {
        subtitle: "2.8 Supported browsers (Firefox, Chrome, Edge, Safari)",
        paragraphs: [
          "The admin interface and the players opened from another device (/radio, /kiosk, /cinema, /coach) work in Firefox (current, previous and ESR releases, desktop and Android), Chrome, Edge and Safari. Since 4.0.3, Firefox support is verified end to end on Firefox 157 by automated tests (file uploads that resume after a network cut, HTTP-compliant video streams, H.264 playback). Windows, macOS, Firefox for Android and the ESR release are not measured yet.",
          "When a browser cannot decode a video (HEVC or 10-bit, depending on the system and hardware), Bobine serves it a compatible H.264 version produced on demand, without ever modifying the original. Settings → Browser compatibility shows a local diagnostic (decoded formats, available features, dropped-frame measurement). Screen wake lock and gamepads require HTTPS or localhost.",
        ],
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
          "Since 5.0.2 the radio has two independent outputs: the cabled radio (/radio?channel=cable), played on the physically connected screen once it is switched to Radio from the Cabled Output page, and the network radio (/radio?channel=network), for any other device on the local network (plain /radio remains an alias of the network radio). Each output has its own queue, volume, reminders, schedule and sound settings (5-band equalizer, bass boost, loudness, anti-saturation protection, three presets); the music library and the playlists stay shared.",
        ],
      },
      {
        subtitle: "3.7 Multilingual subtitles (.srt / .vtt)",
        paragraphs: [
          "Every video class can carry several subtitle tracks: .srt or .vtt files added from the library, or attached to the video file at import (drag and drop). .srt files are converted to WebVTT automatically, the language is recognised from the file name (for example class.fr.srt, class.en.vtt; French by default) and each file is limited to 2 MB.",
          "Subtitles are stored locally with the rest of the data and are switched on from the subtitles menu of /cinema and in the library player. Deleting a class also deletes its subtitle files.",
          "From the admin (dashboard and mobile remote) you choose which subtitle track is shown on the studio screen: the choice is sent live to the kiosk and to /cinema, without touching the screen.",
        ],
      },
      {
        subtitle: "3.8 Class chapters (JSON, WebVTT, text)",
        paragraphs: [
          "A class can carry a list of chapters (start, end, title; at most 200 chapters and 120 characters per title). From the class panel in the library you can type them in, import a file, extract the ones embedded in the video file (read with FFprobe) or export the list as JSON.",
          "Three import formats are recognised from the content: JSON (a \"chapters\" list of objects with \"start\" or \"start_seconds\", an optional \"end\" and a \"title\", possibly localised {\"fr\": …, \"en\": …}), chapter-type WebVTT, or plain text with one chapter per line (\"05:00 Cardio\", \"[1:02:10] - Stretching\"). An invalid file is rejected with a message that names the offending line, and nothing is changed.",
          "Chapters show up as marks on the progress bar of the dashboard, the mobile remote and /cinema, as a list you tap to jump to a chapter, and as a discreet banner on screen when the class moves to a new chapter (kiosk and /cinema).",
        ],
      },
      {
        subtitle: "3.9 Admin on a smartphone (mobile remote)",
        paragraphs: [
          "On a phone the admin switches to a dedicated layout. The \"Now playing\" block is a frosted-glass widget with the thumbnail, title, duration, progress and thumb-friendly controls.",
          "\"Launch a class\" opens a full-screen sheet with three tabs (Classes, Playlists, Backgrounds), instant search and a preview (thumbnail, duration, description) before launch, as on desktop. Drop-down lists with more than a few items (library, schedule, playlists, logs) open as a sheet with search instead of the native picker.",
          "The address shown at the top of the admin is the one of the device's Wi-Fi or Ethernet network (VPN, container and mobile-data interfaces are ignored), and the full list of reachable addresses is in Settings. On Android the address is read directly from the system.",
        ],
      },
      {
        subtitle: "3.10 Devices: audio, Bluetooth and Wi-Fi (5.0.2)",
        paragraphs: [
          "The Devices entry gathers the audio outputs, Bluetooth and Wi-Fi of the machine that plays. The first tab is a global map view (the machine at the centre, its connections around it: audio outputs, Bluetooth devices, network, connected Bobine screens and remotes); clicking an audio output opens its detail (level, balance, test sound, analysis, profile, custom name, hiding).",
          "The feature is disabled by default. The machine's local screen is trusted; any other device enters a 6-digit PIN set from the local screen (never stored in clear text, 15-minute session, temporary lockout after 5 attempts). Every Wi-Fi change must be confirmed: without confirmation within 60 seconds the previous network is restored. The local network is plain HTTP, so the PIN travels in clear text: enter it on a trusted network.",
          "Depending on the system: Linux (desktop and appliance) handles everything through PipeWire, BlueZ and NetworkManager; Android handles audio outputs and volume and Bluetooth, and shows the Wi-Fi state read-only with a shortcut to Android's settings; on Windows and macOS the native bobine-devices component ships with the packages.",
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
      "Overview of Bobine software modules: Gapless A/B Deck video engine, coach console, universal controls, eco-designed telemetry, and system resilience.",
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
      {
        subtitle: "4.7 \"Glassmorphism\" visual identity & 16 themes",
        paragraphs: [
          "The whole admin interface (library, schedule, audio, radio, settings, logs) adopts a translucent Apple-inspired style: frosted-glass cards, soft gradients and defined outlines. Lavender is the default theme; 16 WCAG-calibrated themes are available.",
          "The /cinema pause screen uses a Netflix-style overlay, and switching between the cabled and network outputs is animated, on Android (touch and HDMI) as on desktop. The official logo in the menu and the Android startup screen follow the active update channel (Stable, Beta or Canary).",
        ],
        techChips: [{ icon: "film", label: "Glassmorphism" }],
      },
      {
        subtitle: "4.8 bobine.local network discovery & hardened updates",
        paragraphs: [
          "The mDNS service periodically republishes the bobine.local address and retries with growing delays after an IP change (DHCP, Wi-Fi) or a failure. Its real state is shown in Settings, with an alert if bobine.local does not answer.",
          "The update pipeline is hardened on every platform: going back from Beta or Canary to Stable is offered explicitly, the SHA-256 digest is verified before any installation (Android included, which picks the phone or Android TV APK according to the device), and the notification acknowledgement is kept server-side.",
        ],
        techChips: [{ icon: "server", label: "mDNS / Update Orchestrator" }],
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
          "Backend: Python with FastAPI and single-process Uvicorn (zero external Redis dependency). Python 3.11 minimum: 3.13 on Debian 13 and Android tablets, 3.11 in the Android TV package (the only embedded runtime available for 32-bit systems).",
          "Database: SQLite with versioned schema, automated migrations, and duration/metadata backfills.",
          "Playout engines: MPV with VA-API on Linux, HTML5 Gapless A/B Deck on /cinema, and deterministic app.utils.ffmpeg_binaries resolution across all platforms.",
          "Frontend: Next.js App Router, static SSG export, 16 WCAG AAA/AA calibrated themes, zero emoji.",
        ],
        techChips: [
          { icon: "server", label: "FastAPI / Python 3.11+" },
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
          "Three channels track the project's progress: the Stable channel (frozen Vx.y.z tags, recommended for production gym playout), the Beta channel (curated batches of features/fixes, published manually) and the Canary channel (rolling, automatically rebuilt on every change to the main branch, for clubs wanting the very latest changes without waiting for a batch).",
          "The official APT repository (apt.bobine.fit) mirrors all three channels in its stable, beta and canary distributions, enabling automatic updates via apt upgrade with no manual reinstall. The APT repository of the Tor mirror (.onion) publishes the same three suites. The Fedora (rpm.bobine.fit, dnf) and Arch Linux (arch.bobine.fit, pacman) repositories follow the same three channels, with the same signing key.",
        ],
      },
      {
        subtitle: "7.1 Android: official native application for touch tablets",
        paragraphs: [
          "The native Android application (.apk) is officially available and battle-tested in real gym conditions. It turns any modern tablet (Xiaomi Pad 6, 7, or 8, Samsung Galaxy Tab with USB-C DisplayPort) into an autonomous playout appliance without requiring a PC.",
          `Bobine embeds FastAPI under CPython via Chaquopy (3.13 on tablets) and a persistent ForegroundService. The Android TV package (Bobine-TV) reuses this engine for 32-bit and 64-bit ARM boxes, on Android ${ANDROID.minVersion} or later. The video feed connected to the TV or projector displays the /cinema view over HDMI without system bars, while the tablet touchscreen runs the /grid desk or /coach console.`,
          "The app includes MediaCodec hardware acceleration, gamepad and remote control forwarding to the external display, mDNS discovery (bobine.local), and dual storage partitioning (fast internal F2FS for database and external FUSE for media).",
        ],
        techChips: [{ icon: "smartphone", label: "Android ARM 32/64 bits / Chaquopy" }, { icon: "tablet", label: "Xiaomi Pad / USB-C DP" }, { icon: "film", label: "MediaCodec" }],
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
