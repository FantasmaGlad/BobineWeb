import type { Locale } from "@/lib/i18n";
import type { DocChapter } from "./types";
import { ANDROID } from "@/lib/productFacts";

const fr: DocChapter[] = [
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
          "Le hub de paquets Linux unifié (packages.bobine.fit) reflète les trois canaux dans ses distributions stable, beta et canary pour Debian/Ubuntu (packages.bobine.fit/debian, apt), Fedora (packages.bobine.fit/fedora, dnf) et Arch Linux (packages.bobine.fit/arch, pacman), avec la même clé de signature GPG.",
        ],
      },
      {
        subtitle: "7.1 Android : application native officielle pour tablettes tactiles",
        paragraphs: [
          "L'application native Android (.apk) est officiellement disponible et éprouvée en conditions réelles de cours. Elle transforme n'importe quelle tablette moderne (Xiaomi Pad 6, 7 ou 8, Samsung Galaxy Tab avec port USB-C DisplayPort) en régie autonome sans PC.",
          `Bobine embarque le moteur FastAPI sous CPython via Chaquopy (3.13 sur tablettes) et un ForegroundService persistant. Le paquet Android TV (Bobine-TV) reprend ce moteur pour les boîtiers ARM 32 et 64 bits, sous Android ${ANDROID.minVersion} ou supérieur. La sortie vidéo déportée vers le téléviseur ou projecteur diffuse la vitrine /cinema en HDMI sans barre système, tandis que la tablette tactile affiche le pupitre de commande /grid ou la console coach /coach.`,
          "L'application gère l'accélération matérielle MediaCodec, le relais des touches de manettes et télécommandes vers la sortie externe, la mémorisation mDNS (bobine.local) et le double stockage partitionné (interne F2FS pour la base et externe FUSE pour les médias).",
        ],
      },
      {
        subtitle: "7.2 iOS / iPadOS : piste explorée pour iPads avec sortie vidéo USB-C / Thunderbolt",
        paragraphs: [
          "Dans la même optique de portabilité tactile maximale, la piste iPadOS est envisagée pour les iPads dotés d'une sortie vidéo filaire directe, notamment les iPad Pro à puce Apple Silicon (M1, M2, M4) pourvus d'un port Thunderbolt / USB 4, ainsi que les iPad Air (M2) avec sortie DisplayPort sur USB-C.",
          "Contrairement à l'écosystème Android, iOS restreint fortement l'exécution de processus serveurs locaux en arrière-plan. Le portage de l'architecture Bobine sur iPadOS constitue donc une piste prospective activement réfléchie, mais non engagée techniquement ni calendairement.",
        ],
      },
    ],
  },
];

const en: DocChapter[] = [
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
          "The unified Linux package hub (packages.bobine.fit) mirrors all three channels in its stable, beta and canary distributions for Debian/Ubuntu (packages.bobine.fit/debian, apt), Fedora (packages.bobine.fit/fedora, dnf) and Arch Linux (packages.bobine.fit/arch, pacman), with the same GPG signing key.",
        ],
      },
      {
        subtitle: "7.1 Android: official native application for touch tablets",
        paragraphs: [
          "The native Android application (.apk) is officially available and battle-tested in real gym conditions. It turns any modern tablet (Xiaomi Pad 6, 7, or 8, Samsung Galaxy Tab with USB-C DisplayPort) into an autonomous playout appliance without requiring a PC.",
          `Bobine embeds FastAPI under CPython via Chaquopy (3.13 on tablets) and a persistent ForegroundService. The Android TV package (Bobine-TV) reuses this engine for 32-bit and 64-bit ARM boxes, on Android ${ANDROID.minVersion} or later. The video feed connected to the TV or projector displays the /cinema view over HDMI without system bars, while the tablet touchscreen runs the /grid desk or /coach console.`,
          "The app includes MediaCodec hardware acceleration, gamepad and remote control forwarding to the external display, mDNS discovery (bobine.local), and dual storage partitioning (fast internal F2FS for database and external FUSE for media).",
        ],
      },
      {
        subtitle: "7.2 iOS / iPadOS: explored track for iPads with USB-C / Thunderbolt video output",
        paragraphs: [
          "With the same goal of maximum tactile portability, iPadOS support is actively explored for iPads equipped with wired display output, notably Apple Silicon iPad Pro models (M1, M2, M4) featuring Thunderbolt / USB 4, as well as iPad Air models (M2) with DisplayPort over USB-C.",
          "Unlike the Android environment, iOS strictly sandboxes background server execution. Porting the Bobine architecture to iPadOS is therefore a prospective exploration, without technical or timeline commitment at this stage.",
        ],
      },
    ],
  },
];

export const docChapters: Record<Locale, DocChapter[]> = { fr, en };

export const FEATURE_OVERVIEW = [
  {
    "id": "playback",
    "icon": "video",
    "title": {
      "fr": "Cours vidéo et régie",
      "en": "Video classes and playout"
    },
    "description": {
      "fr": "Importez vos vidéos, organisez la médiathèque et programmez leur diffusion.",
      "en": "Import videos, organize the library and schedule playback."
    },
    "detail": {
      "fr": "Lecture locale ; codecs et résolution selon le matériel et le navigateur.",
      "en": "Local playback; codecs and resolution depend on hardware and browser."
    },
    "href": "/documentation/utilisation",
    "anchor": "workout-library"
  },
  {
    "id": "outputs",
    "icon": "display",
    "title": {
      "fr": "Deux canaux indépendants",
      "en": "Two independent channels"
    },
    "description": {
      "fr": "Préparez séparément la sortie câblée et la sortie réseau, avec leurs propres contenus et plannings.",
      "en": "Prepare wired and network outputs separately, each with its own content and timetable."
    },
    "detail": {
      "fr": "La sortie réseau nécessite une connexion locale entre les appareils.",
      "en": "Network output requires a local connection between devices."
    },
    "href": "/documentation/utilisation",
    "anchor": "settings-displays"
  },
  {
    "id": "kiosk",
    "icon": "layers",
    "title": {
      "fr": "Kiosque et télécommande",
      "en": "Kiosk and remote control"
    },
    "description": {
      "fr": "Proposez le choix d’un cours à la demande et pilotez la régie depuis un navigateur du réseau local.",
      "en": "Offer on-demand class selection and control playout from a browser on the local network."
    },
    "detail": {
      "fr": "Les possibilités tactiles et télécommande dépendent de l’appareil.",
      "en": "Touch and remote control capabilities depend on the device."
    },
    "href": "/documentation/utilisation",
    "anchor": "member-cinema-on-demand-kiosk"
  },
  {
    "id": "audio",
    "icon": "zap",
    "title": {
      "fr": "Radio et table de mixage",
      "en": "Radio and mixer"
    },
    "description": {
      "fr": "Diffusez vos musiques d’ambiance et vos cours audio. Réglez les volumes depuis la régie coach.",
      "en": "Play background music and audio classes. Adjust levels from the coach console."
    },
    "detail": {
      "fr": "Bibliothèques audio, fondus et annonces programmées ; contenus à fournir.",
      "en": "Audio libraries, crossfades and scheduled announcements; supply your own content."
    },
    "href": "/documentation/utilisation",
    "anchor": "coach-audio-mode"
  },
  {
    "id": "storage",
    "icon": "cpu",
    "title": {
      "fr": "Stockage externe",
      "en": "External storage"
    },
    "description": {
      "fr": "Choisissez un emplacement pour vos médias et consultez les périphériques de stockage.",
      "en": "Choose a location for media and inspect storage devices."
    },
    "detail": {
      "fr": "Accès USB, permissions et formats de disque selon le système.",
      "en": "USB access, permissions and disk formats depend on the operating system."
    },
    "href": "/documentation",
    "anchor": ""
  },
  {
    "id": "themes",
    "icon": "layers",
    "title": {
      "fr": "Des thèmes pour votre salle",
      "en": "Themes for your studio"
    },
    "description": {
      "fr": "Adaptez les couleurs des interfaces avec les thèmes clairs et sombres, synchronisés entre les écrans.",
      "en": "Choose light or dark interface themes, synchronized across displays."
    },
    "detail": {
      "fr": "Préférences enregistrées localement ; interfaces adaptées au tactile et au clavier.",
      "en": "Locally stored preferences; interfaces support touch and keyboard navigation."
    },
    "href": "/documentation/utilisation",
    "anchor": "settings-displays"
  },
  {
    "id": "backup",
    "icon": "refresh",
    "title": {
      "fr": "Sauvegardes et mises à jour",
      "en": "Backups and updates"
    },
    "description": {
      "fr": "Exportez votre configuration et restaurez-la sur une autre installation. Choisissez votre canal de mises à jour.",
      "en": "Export your configuration and restore it on another installation. Choose your update channel."
    },
    "detail": {
      "fr": "Stable, Bêta et Canary ; vérifier une sauvegarde avant un changement de machine.",
      "en": "Stable, Beta and Canary; verify a backup before moving to another machine."
    },
    "href": "/canaux",
    "anchor": ""
  },
  {
    "id": "platforms",
    "icon": "globe",
    "title": {
      "fr": "Choisir votre plateforme",
      "en": "Choose your platform"
    },
    "description": {
      "fr": "Des paquets existent pour Windows, macOS, Linux, Android et Android TV.",
      "en": "Packages are available for Windows, macOS, Linux, Android and Android TV."
    },
    "detail": {
      "fr": "Consultez les prérequis du paquet ; une plateforme annoncée ne vaut pas validation de chaque appareil.",
      "en": "Check package requirements; platform availability does not validate every device."
    },
    "href": "",
    "anchor": ""
  }
] as const;
