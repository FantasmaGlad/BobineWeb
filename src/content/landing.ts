import type { Locale } from "@/lib/i18n";
import { ONION_APT_HOST, ONION_SITE_HOST, TOR_PROJECT_URL, TOR_SOURCE_URL } from "@/lib/onion";
import { ANDROID } from "@/lib/productFacts";

/**
 * Pages d'atterrissage thématiques (canaux de mise à jour, Android TV, Google Book, Tor,
 * nouveautés) : une page par intention de recherche, rendues par `LandingPage`. Le texte reste
 * factuel et court, sans version ni date en dur : celles-ci viennent de GitHub à l'affichage.
 */

export type LandingId =
  | "canaux"
  | "canal-stable"
  | "canal-beta"
  | "canal-canary"
  | "android-tv"
  | "google-book"
  | "tor"
  | "nouveautes";

export interface LandingSection {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
  code?: string;
}

export interface LandingFaq {
  q: string;
  a: string;
}

export interface LandingLink {
  label: string;
  /** Chemin français sans préfixe de langue (le slug anglais est résolu par `lp`). */
  path: string;
}

export interface LandingLocale {
  title: string;
  description: string;
  h1: string;
  lead: string;
  breadcrumb: string;
  keywords: string[];
  sections: LandingSection[];
  faq: LandingFaq[];
  related: LandingLink[];
}

export interface LandingContent {
  id: LandingId;
  /** Chemin français sans préfixe de langue. */
  path: string;
  /** Canal imposé à l'encart de téléchargement, le cas échéant. */
  channel?: "stable" | "beta" | "canary";
  fr: LandingLocale;
  en: LandingLocale;
}

const CHANNEL_CLI = (channel: string) =>
  `curl -fsSL https://bobine.fit/install.sh | sudo bash -s -- --channel=${channel}`;

const TOR_COMMANDS = `sudo apt install apt-transport-tor
curl -fsS --socks5-hostname 127.0.0.1:9050 http://${ONION_APT_HOST}/bobine.gpg | sudo gpg --dearmor -o /etc/apt/keyrings/bobine.gpg
echo "deb [signed-by=/etc/apt/keyrings/bobine.gpg] tor+http://${ONION_APT_HOST}/ stable main" | sudo tee /etc/apt/sources.list.d/bobine-onion.list
sudo apt update && sudo apt install bobine`;

const CHANNEL_RELATED_FR: LandingLink[] = [
  { label: "Tous les canaux de mise à jour", path: "/canaux" },
  { label: "Guide d'installation", path: "/documentation" },
  { label: "Nouveautés de Bobine", path: "/nouveautes" },
];
const CHANNEL_RELATED_EN: LandingLink[] = [
  { label: "All update channels", path: "/canaux" },
  { label: "Installation guide", path: "/documentation" },
  { label: "What's new in Bobine", path: "/nouveautes" },
];

/** Blocs communs à toutes les pages : configuration requise, vérification du fichier, mises à jour. */
export const LANDING_COMMON: Record<
  Locale,
  {
    requirementsTitle: string;
    requirementsNote: (androidMin: number) => string;
    verify: { heading: string; paragraphs: string[] };
    update: { heading: string; paragraphs: string[] };
  }
> = {
  fr: {
    requirementsTitle: "Configuration requise",
    requirementsNote: (androidMin) =>
      `Bobine s'exécute en local : aucun compte ni cloud n'est nécessaire. Les paquets Android exigent Android ${androidMin} ou supérieur.`,
    verify: {
      heading: "Vérifier le fichier téléchargé",
      paragraphs: [
        "GitHub affiche l'empreinte SHA-256 de chaque fichier sur la page de la release : comparez-la à celle de votre téléchargement (sha256sum sous Linux et macOS, Get-FileHash sous Windows).",
        "L'application revérifie elle-même l'empreinte SHA-256 de toute mise à jour avant de l'installer.",
      ],
    },
    update: {
      heading: "Mettre à jour et changer de canal",
      paragraphs: [
        "Les mises à jour se lancent depuis Réglages, Mises à jour logicielles, où l'on choisit aussi le canal : Stable, Bêta ou Canary. Changer de canal conserve la base de données et les médias.",
        "Depuis la Bêta ou la Canary, la dernière version Stable est proposée explicitement pour revenir en arrière.",
      ],
    },
  },
  en: {
    requirementsTitle: "System requirements",
    requirementsNote: (androidMin) =>
      `Bobine runs locally: no account or cloud is needed. Android packages require Android ${androidMin} or later.`,
    verify: {
      heading: "Verify the downloaded file",
      paragraphs: [
        "GitHub shows the SHA-256 checksum of every file on the release page: compare it with your download (sha256sum on Linux and macOS, Get-FileHash on Windows).",
        "The application re-checks the SHA-256 checksum of every update itself before installing it.",
      ],
    },
    update: {
      heading: "Update and switch channel",
      paragraphs: [
        "Updates start from Settings, Software updates, where you also choose the channel: Stable, Beta or Canary. Switching channel keeps the database and the media.",
        "From Beta or Canary, the latest Stable release is offered explicitly to go back.",
      ],
    },
  },
};

export const LANDING_PAGES: Record<LandingId, LandingContent> = {
  canaux: {
    id: "canaux",
    path: "/canaux",
    fr: {
      title: "Canaux de mise à jour Bobine : Stable, Bêta et Canary",
      description:
        "Bobine propose trois canaux de mise à jour : Stable (recommandé en salle), Bêta (lots curés) et Canary (reconstruit à chaque commit). Différences, téléchargements, installation et retour à Stable.",
      h1: "Canaux de mise à jour de Bobine : Stable, Bêta et Canary",
      lead:
        "Bobine, la régie vidéo libre pour salles de sport, se met à jour par trois canaux indépendants. Le canal Stable est celui de la production ; la Bêta et la Canary donnent un accès anticipé aux évolutions, avec un niveau de vérification décroissant.",
      breadcrumb: "Canaux de mise à jour",
      keywords: [
        "Bobine Stable",
        "Bobine Bêta",
        "Bobine Canary",
        "canaux de mise à jour Bobine",
        "Bobine version bêta",
        "Bobine dernière version",
        "mise à jour Bobine",
      ],
      sections: [
        {
          heading: "Quel canal choisir",
          bullets: [
            "Stable : versions officielles figées (tags Vx.y.z), recommandées pour une salle en exploitation.",
            "Bêta : lots de fonctionnalités et de correctifs choisis et publiés manuellement quand ils sont prêts, plus avancés que Stable et plus éprouvés que Canary.",
            "Canary : reconstruit automatiquement à chaque commit de la branche principale, sans curation ni test préalable, pour suivre le développement au jour le jour.",
          ],
        },
        {
          heading: "Changer de canal sans perdre ses données",
          paragraphs: [
            "Sur toutes les plateformes, les trois canaux partagent les mêmes identifiants d'application et s'installent par-dessus la version existante : la base de données et les médias ne sont pas touchés. Le choix se fait dans Réglages, Mises à jour logicielles, Canal de mise à jour, ou à l'installation de l'appliance Linux :",
          ],
          code: `${CHANNEL_CLI("stable")}\n${CHANNEL_CLI("beta")}\n${CHANNEL_CLI("canary")}`,
        },
        {
          heading: "Retour à la Stable à tout moment",
          paragraphs: [
            "Depuis la Bêta ou la Canary, la dernière Stable est proposée explicitement, même si son numéro est inférieur à celui du build installé. Ce retour en arrière n'est jamais appliqué automatiquement : il reste un clic volontaire.",
          ],
        },
        {
          heading: "Dépôt APT et fichiers",
          paragraphs: [
            "Le dépôt APT officiel (apt.bobine.fit) expose trois distributions, stable, beta et canary. Sur GitHub, chaque canal Bêta et Canary est une release unique dont le tag mobile est republié en place (beta et canary) ; les fichiers portent un nom fixe, par exemple Bobine-canary.apk ou bobine_beta_amd64.deb.",
          ],
        },
      ],
      faq: [
        {
          q: "Quelle est la différence entre Bêta et Canary ?",
          a: "La Bêta regroupe des lots de fonctionnalités et de correctifs choisis et publiés manuellement. La Canary est reconstruite automatiquement à chaque commit de la branche principale, sans curation ni test préalable.",
        },
        {
          q: "Quel canal est recommandé pour une salle de sport en exploitation ?",
          a: "Le canal Stable : ses versions sont figées, testées et accompagnées de notes de version.",
        },
        {
          q: "Puis-je revenir à la Stable après avoir testé la Bêta ou la Canary ?",
          a: "Oui, à tout moment et sans perte de données : Réglages, Mises à jour logicielles, canal Stable. La dernière Stable est proposée même si son numéro est inférieur.",
        },
      ],
      related: [
        { label: "Bobine Stable", path: "/canaux/stable" },
        { label: "Bobine Bêta", path: "/canaux/beta" },
        { label: "Bobine Canary", path: "/canaux/canary" },
        { label: "Nouveautés de Bobine", path: "/nouveautes" },
      ],
    },
    en: {
      title: "Bobine update channels: Stable, Beta and Canary",
      description:
        "Bobine ships through three update channels: Stable (recommended for studios), Beta (curated batches) and Canary (rebuilt on every commit). Differences, downloads, installation and switching back to Stable.",
      h1: "Bobine update channels: Stable, Beta and Canary",
      lead:
        "Bobine, the open-source gym video playout system, updates through three independent channels. Stable is the production channel; Beta and Canary give early access to new work, with decreasing levels of verification.",
      breadcrumb: "Update channels",
      keywords: [
        "Bobine Stable",
        "Bobine Beta",
        "Bobine Canary",
        "Bobine update channels",
        "Bobine beta version",
        "Bobine latest version",
        "Bobine update",
      ],
      sections: [
        {
          heading: "Which channel to choose",
          bullets: [
            "Stable: frozen official releases (Vx.y.z tags), recommended for a studio in daily operation.",
            "Beta: batches of features and fixes picked and published manually when they are ready, further ahead than Stable and better proven than Canary.",
            "Canary: rebuilt automatically on every commit to the main branch, with no curation and no prior testing, to follow development day by day.",
          ],
        },
        {
          heading: "Switching channels without losing data",
          paragraphs: [
            "On every platform the three channels share the same application IDs and install over the existing version: the database and the media are left untouched. The choice is made in Settings, Software updates, Update channel, or when installing the Linux appliance:",
          ],
          code: `${CHANNEL_CLI("stable")}\n${CHANNEL_CLI("beta")}\n${CHANNEL_CLI("canary")}`,
        },
        {
          heading: "Back to Stable at any time",
          paragraphs: [
            "From Beta or Canary, the latest Stable is offered explicitly, even when its number is lower than the installed build. This rollback is never applied automatically: it stays a deliberate click.",
          ],
        },
        {
          heading: "APT repository and files",
          paragraphs: [
            "The official APT repository (apt.bobine.fit) exposes three distributions: stable, beta and canary. On GitHub, each of the Beta and Canary channels is a single release whose moving tag (beta and canary) is republished in place; files carry fixed names, for example Bobine-canary.apk or bobine_beta_amd64.deb.",
          ],
        },
      ],
      faq: [
        {
          q: "What is the difference between Beta and Canary?",
          a: "Beta gathers batches of features and fixes that are picked and published manually. Canary is rebuilt automatically on every commit to the main branch, with no curation and no prior testing.",
        },
        {
          q: "Which channel is recommended for a studio in daily operation?",
          a: "The Stable channel: its releases are frozen, tested and come with release notes.",
        },
        {
          q: "Can I go back to Stable after trying Beta or Canary?",
          a: "Yes, at any time and without losing data: Settings, Software updates, Stable channel. The latest Stable is offered even when its number is lower.",
        },
      ],
      related: [
        { label: "Bobine Stable", path: "/canaux/stable" },
        { label: "Bobine Beta", path: "/canaux/beta" },
        { label: "Bobine Canary", path: "/canaux/canary" },
        { label: "What's new in Bobine", path: "/nouveautes" },
      ],
    },
  },

  "canal-stable": {
    id: "canal-stable",
    path: "/canaux/stable",
    channel: "stable",
    fr: {
      title: "Bobine Stable : téléchargement de la dernière version officielle",
      description:
        "Bobine Stable : la version officielle recommandée pour les salles de sport. Téléchargez la dernière Stable pour Windows, macOS, Linux, Android et Android TV, avec notes de version.",
      h1: "Bobine Stable, la version officielle",
      lead:
        "Le canal Stable de Bobine publie des versions figées, identifiées par un tag Vx.y.z, accompagnées de notes de version. C'est le canal par défaut de toutes les installations et celui à utiliser pour une salle en exploitation.",
      breadcrumb: "Stable",
      keywords: ["Bobine Stable", "Bobine dernière version stable", "télécharger Bobine", "Bobine version officielle"],
      sections: [
        {
          heading: "Ce que garantit le canal Stable",
          bullets: [
            "Une version par tag Vx.y.z strict, publiée sur GitHub Releases avec ses notes.",
            "Les mêmes fichiers sur toutes les plateformes : Windows (x86-64 et ARM64), macOS Apple Silicon, Linux (.deb amd64 et arm64), Android, Android TV, assistant Bobine Assistant.",
            "Une empreinte SHA-256 vérifiée avant toute installation lancée depuis l'application.",
          ],
        },
        {
          heading: "Installer ou revenir à la Stable",
          paragraphs: [
            "Sur l'appliance Linux, la Stable est le choix par défaut. Depuis une installation en Bêta ou en Canary, choisissez Stable dans Réglages, Mises à jour logicielles.",
          ],
          code: CHANNEL_CLI("stable"),
        },
      ],
      faq: [
        {
          q: "Comment savoir quelle est la dernière version stable de Bobine ?",
          a: "L'encart de téléchargement de cette page est lu directement depuis GitHub Releases et indique la version, sa date de publication et ses fichiers.",
        },
        {
          q: "Les mises à jour de la Stable sont-elles automatiques ?",
          a: "L'application propose la mise à jour en un clic et peut la planifier la nuit ; sur Debian et Ubuntu, le dépôt APT officiel la rend disponible via apt upgrade.",
        },
      ],
      related: CHANNEL_RELATED_FR,
    },
    en: {
      title: "Bobine Stable: download the latest official release",
      description:
        "Bobine Stable: the official release recommended for gyms and studios. Download the latest Stable for Windows, macOS, Linux, Android and Android TV, with release notes.",
      h1: "Bobine Stable, the official release",
      lead:
        "The Stable channel publishes frozen releases identified by a Vx.y.z tag and shipped with release notes. It is the default channel of every installation and the one to use for a studio in daily operation.",
      breadcrumb: "Stable",
      keywords: ["Bobine Stable", "Bobine latest stable version", "download Bobine", "Bobine official release"],
      sections: [
        {
          heading: "What the Stable channel guarantees",
          bullets: [
            "One release per strict Vx.y.z tag, published on GitHub Releases with its notes.",
            "The same files on every platform: Windows (x86-64 and ARM64), macOS Apple Silicon, Linux (.deb amd64 and arm64), Android, Android TV, and the Bobine Assistant.",
            "A SHA-256 digest verified before any installation started from the application.",
          ],
        },
        {
          heading: "Install or go back to Stable",
          paragraphs: [
            "On the Linux appliance, Stable is the default. From a Beta or Canary installation, pick Stable in Settings, Software updates.",
          ],
          code: CHANNEL_CLI("stable"),
        },
      ],
      faq: [
        {
          q: "How do I find the latest stable version of Bobine?",
          a: "The download card on this page is read straight from GitHub Releases and shows the version, its publication date and its files.",
        },
        {
          q: "Are Stable updates automatic?",
          a: "The application offers one-click updates and can schedule them overnight; on Debian and Ubuntu, the official APT repository makes them available through apt upgrade.",
        },
      ],
      related: CHANNEL_RELATED_EN,
    },
  },

  "canal-beta": {
    id: "canal-beta",
    path: "/canaux/beta",
    channel: "beta",
    fr: {
      title: "Bobine Bêta : lots de fonctionnalités curés, téléchargement et installation",
      description:
        "Bobine Bêta : le canal des lots de fonctionnalités et de correctifs sélectionnés et publiés manuellement. Téléchargez la Bêta pour Windows, macOS, Linux, Android et Android TV, ou installez-la en une commande.",
      h1: "Bobine Bêta, le canal des lots curés",
      lead:
        "La Bêta de Bobine regroupe des fonctionnalités et des correctifs que le mainteneur sélectionne et publie manuellement quand ils sont prêts. Elle est plus avancée que la Stable et plus éprouvée que la Canary.",
      breadcrumb: "Bêta",
      keywords: ["Bobine Bêta", "Bobine Beta", "Bobine version bêta", "télécharger Bobine bêta", "Bobine beta apk"],
      sections: [
        {
          heading: "Comment fonctionne la Bêta",
          bullets: [
            "Publication uniquement sur décision manuelle, jamais sur un simple commit.",
            "Une seule release GitHub, au tag mobile beta, republiée en place à chaque lot.",
            "Fichiers à nom fixe (Bobine-beta.apk, Bobine-TV-beta.apk, bobine_beta_amd64.deb, Bobine-Setup-beta.exe, Bobine-beta.dmg).",
            "Mise à jour détectée par comparaison de commit, puisqu'aucun numéro de version n'avance à chaque lot.",
          ],
        },
        {
          heading: "Rejoindre ou quitter la Bêta",
          paragraphs: [
            "Dans Réglages, Mises à jour logicielles, choisissez le canal Bêta (une confirmation est demandée). Sur l'appliance Linux :",
          ],
          code: CHANNEL_CLI("beta"),
        },
      ],
      faq: [
        {
          q: "La Bêta de Bobine est-elle publiée automatiquement ?",
          a: "Non. Elle n'est publiée que sur décision manuelle, quand un lot de fonctionnalités est prêt. C'est ce qui la distingue de la Canary.",
        },
        {
          q: "Mes cours et mon planning sont-ils conservés en passant à la Bêta ?",
          a: "Oui. Les canaux partagent les mêmes identifiants d'application et s'installent par-dessus la version existante, sans toucher à la base de données ni aux médias.",
        },
      ],
      related: CHANNEL_RELATED_FR,
    },
    en: {
      title: "Bobine Beta: curated feature batches, download and installation",
      description:
        "Bobine Beta: the channel of feature and fix batches that are picked and published manually. Download the Beta for Windows, macOS, Linux, Android and Android TV, or install it with one command.",
      h1: "Bobine Beta, the curated batches channel",
      lead:
        "Bobine Beta gathers features and fixes that the maintainer picks and publishes manually when they are ready. It is further ahead than Stable and better proven than Canary.",
      breadcrumb: "Beta",
      keywords: ["Bobine Beta", "Bobine beta version", "download Bobine beta", "Bobine beta apk"],
      sections: [
        {
          heading: "How the Beta works",
          bullets: [
            "Published only on a manual decision, never on a plain commit.",
            "A single GitHub release, on the moving tag beta, republished in place for each batch.",
            "Fixed file names (Bobine-beta.apk, Bobine-TV-beta.apk, bobine_beta_amd64.deb, Bobine-Setup-beta.exe, Bobine-beta.dmg).",
            "Updates are detected by comparing commits, since no version number moves with each batch.",
          ],
        },
        {
          heading: "Join or leave the Beta",
          paragraphs: [
            "In Settings, Software updates, choose the Beta channel (a confirmation is requested). On the Linux appliance:",
          ],
          code: CHANNEL_CLI("beta"),
        },
      ],
      faq: [
        {
          q: "Is the Bobine Beta published automatically?",
          a: "No. It is only published on a manual decision, when a batch of features is ready. That is what sets it apart from Canary.",
        },
        {
          q: "Are my classes and schedule kept when I move to the Beta?",
          a: "Yes. The channels share the same application IDs and install over the existing version, without touching the database or the media.",
        },
      ],
      related: CHANNEL_RELATED_EN,
    },
  },

  "canal-canary": {
    id: "canal-canary",
    path: "/canaux/canary",
    channel: "canary",
    fr: {
      title: "Bobine Canary : build automatique à chaque commit, téléchargement et installation",
      description:
        "Bobine Canary : le canal rolling reconstruit automatiquement à chaque commit de la branche principale, sans curation. Téléchargez la Canary pour Windows, macOS, Linux, Android et Android TV, ou installez-la en une commande.",
      h1: "Bobine Canary, le canal rolling",
      lead:
        "La Canary de Bobine est reconstruite automatiquement à chaque commit de la branche principale. C'est l'accès le plus anticipé aux évolutions du logiciel, sans curation ni test préalable : à réserver au suivi du développement.",
      breadcrumb: "Canary",
      keywords: [
        "Bobine Canary",
        "Bobine canary apk",
        "Bobine rolling release",
        "télécharger Bobine Canary",
        "Bobine build automatique",
      ],
      sections: [
        {
          heading: "Comment fonctionne la Canary",
          bullets: [
            "Une release GitHub unique, au tag mobile canary, republiée en place à chaque push sur la branche principale.",
            "Fichiers à nom fixe (Bobine-canary.apk, Bobine-TV-canary.apk, bobine_canary_amd64.deb, Bobine-Setup-canary.exe, Bobine-canary.dmg).",
            "Notes de version générées automatiquement : le journal des commits depuis la dernière Stable.",
            "Mise à jour détectée par comparaison de commit.",
          ],
        },
        {
          heading: "Rejoindre ou quitter la Canary",
          paragraphs: [
            "Dans Réglages, Mises à jour logicielles, choisissez le canal Canary. Sur l'appliance Linux ou depuis l'assistant Bobine Assistant :",
          ],
          code: CHANNEL_CLI("canary"),
        },
        {
          heading: "À savoir avant d'installer",
          paragraphs: [
            "La Canary peut contenir des régressions : elle n'a fait l'objet d'aucune curation. Pour une salle en exploitation, préférez la Stable. Le retour à la Stable reste possible à tout moment, sans perte de données.",
          ],
        },
      ],
      faq: [
        {
          q: "Qu'est-ce que Bobine Canary ?",
          a: "C'est le canal de mise à jour rolling de Bobine : une release reconstruite automatiquement à chaque commit de la branche principale, sans curation, pour essayer les évolutions au plus tôt.",
        },
        {
          q: "Où télécharger Bobine Canary ?",
          a: "Les fichiers de la Canary (Windows, macOS, Linux, Android, Android TV) sont listés dans l'encart de téléchargement de cette page, lu depuis GitHub Releases.",
        },
        {
          q: "La Canary est-elle adaptée à une salle de sport en exploitation ?",
          a: "Non, elle est destinée au suivi du développement. Pour l'exploitation quotidienne, le canal Stable est recommandé.",
        },
      ],
      related: CHANNEL_RELATED_FR,
    },
    en: {
      title: "Bobine Canary: automatic build on every commit, download and installation",
      description:
        "Bobine Canary: the rolling channel rebuilt automatically on every commit to the main branch, with no curation. Download the Canary for Windows, macOS, Linux, Android and Android TV, or install it with one command.",
      h1: "Bobine Canary, the rolling channel",
      lead:
        "Bobine Canary is rebuilt automatically on every commit to the main branch. It is the earliest access to the software's changes, with no curation and no prior testing: keep it for following development.",
      breadcrumb: "Canary",
      keywords: ["Bobine Canary", "Bobine canary apk", "Bobine rolling release", "download Bobine Canary", "Bobine automatic build"],
      sections: [
        {
          heading: "How the Canary works",
          bullets: [
            "A single GitHub release, on the moving tag canary, republished in place on every push to the main branch.",
            "Fixed file names (Bobine-canary.apk, Bobine-TV-canary.apk, bobine_canary_amd64.deb, Bobine-Setup-canary.exe, Bobine-canary.dmg).",
            "Automatically generated release notes: the commit log since the latest Stable.",
            "Updates are detected by comparing commits.",
          ],
        },
        {
          heading: "Join or leave the Canary",
          paragraphs: [
            "In Settings, Software updates, choose the Canary channel. On the Linux appliance or from the Bobine Assistant:",
          ],
          code: CHANNEL_CLI("canary"),
        },
        {
          heading: "Before you install",
          paragraphs: [
            "The Canary may contain regressions: it has had no curation. For a studio in daily operation, prefer Stable. Going back to Stable stays possible at any time, without losing data.",
          ],
        },
      ],
      faq: [
        {
          q: "What is Bobine Canary?",
          a: "It is Bobine's rolling update channel: a release rebuilt automatically on every commit to the main branch, with no curation, to try changes as early as possible.",
        },
        {
          q: "Where can I download Bobine Canary?",
          a: "The Canary files (Windows, macOS, Linux, Android, Android TV) are listed in the download card on this page, read from GitHub Releases.",
        },
        {
          q: "Is the Canary suitable for a studio in daily operation?",
          a: "No, it is meant for following development. For daily operation, the Stable channel is recommended.",
        },
      ],
      related: CHANNEL_RELATED_EN,
    },
  },

  "android-tv": {
    id: "android-tv",
    path: "/android-tv",
    fr: {
      title: "Bobine pour Android TV et Google TV : installation et téléchargement de l'APK",
      description:
        `Bobine sur Android TV et Google TV : APK dédié pour box et clés HDMI sous Android ${ANDROID.minVersion} ou supérieur (Google TV Streamer, Xiaomi TV Box S), ARM 32 et 64 bits, navigation à la télécommande. Téléchargement et installation.`,
      h1: "Bobine pour Android TV et Google TV",
      lead:
        "Bobine existe en application Android TV : un APK dédié (Bobine-TV) pour les box, clés HDMI et téléviseurs sous Android TV ou Google TV. Il ouvre l'interface grand écran, pilotable à 100 % à la télécommande, et diffuse les cours de la salle sans mini PC.",
      breadcrumb: "Android TV",
      keywords: [
        "Bobine Android TV",
        "Bobine Google TV",
        "Bobine Google TV Streamer",
        "Bobine Xiaomi TV Box",
        "Bobine Xiaomi TV Box S",
        "APK Android TV salle de sport",
        "Bobine TV apk",
      ],
      sections: [
        {
          heading: "Ce que fait l'application Android TV",
          bullets: [
            "Paquet dédié Bobine-TV (identifiant com.bobine.app.tv), distinct de l'APK tablette.",
            "Intégration au lanceur Leanback avec une bannière 16:9 ; aucun écran tactile requis.",
            "Ouverture directe sur l'interface grand écran (/kiosk), pilotable au D-Pad : flèches, touche centrale et retour.",
            "Prévention de la mise en veille pendant la diffusion.",
            "Stockage externe : une clé USB ou un SSD en FAT32 ou exFAT est détecté pour loger les cours hors de la mémoire interne de la box.",
          ],
        },
        {
          heading: "Boîtiers 32 bits et 64 bits",
          paragraphs: [
            `Le paquet Android TV est universel : il s'installe sur les boîtiers dont le système est 64 bits comme sur ceux dont le système est 32 bits (ABI armeabi-v7a), ce qui est le cas de plusieurs boîtiers Xiaomi malgré leur processeur 64 bits. Android ${ANDROID.minVersion} (API ${ANDROID.minApi}) ou supérieur est requis : un Chromecast avec Google TV ou un NVIDIA Shield resté sous Android 11 ou 12 ne peut pas installer Bobine.`,
          ],
        },
        {
          heading: "Installer l'APK sur la TV",
          paragraphs: [
            "Téléchargez Bobine-TV-<version>.apk depuis l'encart de téléchargement ci-dessus, puis transférez-le sur la TV avec une clé USB et un gestionnaire de fichiers, sans fil avec Send Files to TV ou Downloader, ou par ADB sur le réseau local. Autorisez l'installation d'applications inconnues dans les paramètres de la TV.",
          ],
          code: "adb connect <ip_de_la_tv>:5555\nadb install Bobine-TV-<version>.apk",
        },
        {
          heading: "Piloter la TV depuis un autre appareil",
          paragraphs: [
            "Depuis un téléphone, une tablette ou un ordinateur du même réseau Wi-Fi ou Ethernet, ouvrez http://bobine.local:8000 (ou l'adresse IP de la TV, port 8000) : vous accédez à la télécommande et au panneau d'administration de la salle sans toucher à la box.",
          ],
        },
      ],
      faq: [
        {
          q: "Bobine fonctionne-t-il sur Android TV ?",
          a: `Oui, depuis Android ${ANDROID.minVersion} (API ${ANDROID.minApi}) : un paquet dédié, Bobine-TV, s'installe sur les box et clés Android TV et Google TV, en ARM 32 comme en 64 bits.`,
        },
        {
          q: "Faut-il un mini PC en plus de la box Android TV ?",
          a: "Non pour diffuser sur l'écran de la TV : l'application embarque son propre serveur. Un mini PC reste utile pour une appliance dédiée 24/7 avec plusieurs écrans.",
        },
        {
          q: "Pourquoi l'installation échoue-t-elle avec INSTALL_FAILED_NO_MATCHING_ABIS ?",
          a: "Les anciennes copies de l'APK ne couvraient pas les systèmes 32 bits. Retéléchargez Bobine-TV depuis cette page.",
        },
      ],
      related: [
        { label: "Documentation d'installation", path: "/documentation" },
        { label: "Bobine sur Google Book", path: "/google-book" },
        { label: "Canaux de mise à jour", path: "/canaux" },
        { label: "Matériel recommandé", path: "/materiel/amazon" },
      ],
    },
    en: {
      title: "Bobine for Android TV and Google TV: APK installation and download",
      description:
        `Bobine on Android TV and Google TV: a dedicated APK for boxes and HDMI sticks running Android ${ANDROID.minVersion} or later (Google TV Streamer, Xiaomi TV Box S), 32-bit and 64-bit ARM, remote-control navigation. Download and installation.`,
      h1: "Bobine for Android TV and Google TV",
      lead:
        "Bobine comes as an Android TV app: a dedicated APK (Bobine-TV) for boxes, HDMI sticks and TVs running Android TV or Google TV. It opens the big-screen interface, fully usable with the remote control, and plays the studio's classes without a mini PC.",
      breadcrumb: "Android TV",
      keywords: [
        "Bobine Android TV",
        "Bobine Google TV",
        "Bobine Google TV Streamer",
        "Bobine Xiaomi TV Box",
        "Bobine Xiaomi TV Box S",
        "Android TV APK gym",
        "Bobine TV apk",
      ],
      sections: [
        {
          heading: "What the Android TV app does",
          bullets: [
            "Dedicated Bobine-TV package (ID com.bobine.app.tv), separate from the tablet APK.",
            "Leanback launcher integration with a 16:9 banner; no touchscreen required.",
            "Opens straight on the big-screen interface (/kiosk), driven with the D-pad: arrows, center key and back.",
            "Screen-saver prevention while playing.",
            "External storage: a FAT32 or exFAT USB drive or SSD is detected to hold the classes outside the box's internal memory.",
          ],
        },
        {
          heading: "32-bit and 64-bit boxes",
          paragraphs: [
            `The Android TV package is universal: it installs on boxes with a 64-bit system as well as on those with a 32-bit system (armeabi-v7a ABI), as is the case for several Xiaomi boxes despite their 64-bit processor. Android ${ANDROID.minVersion} (API ${ANDROID.minApi}) or later is required: a Chromecast with Google TV or an NVIDIA Shield left on Android 11 or 12 cannot install Bobine.`,
          ],
        },
        {
          heading: "Installing the APK on the TV",
          paragraphs: [
            "Download Bobine-TV-<version>.apk from the download card above, then move it to the TV with a USB drive and a file manager, wirelessly with Send Files to TV or Downloader, or through ADB on the local network. Allow the installation of unknown apps in the TV settings.",
          ],
          code: "adb connect <tv_ip>:5555\nadb install Bobine-TV-<version>.apk",
        },
        {
          heading: "Control the TV from another device",
          paragraphs: [
            "From a phone, tablet or computer on the same Wi-Fi or Ethernet network, open http://bobine.local:8000 (or the TV's IP address, port 8000): you reach the room's remote control and admin panel without touching the box.",
          ],
        },
      ],
      faq: [
        {
          q: "Does Bobine work on Android TV?",
          a: `Yes, from Android ${ANDROID.minVersion} (API ${ANDROID.minApi}): a dedicated package, Bobine-TV, installs on Android TV and Google TV boxes and sticks, in 32-bit as well as 64-bit ARM.`,
        },
        {
          q: "Do I need a mini PC in addition to the Android TV box?",
          a: "Not to play on the TV screen: the app embeds its own server. A mini PC remains useful for a dedicated 24/7 appliance with several screens.",
        },
        {
          q: "Why does installation fail with INSTALL_FAILED_NO_MATCHING_ABIS?",
          a: "Older copies of the APK did not cover 32-bit systems. Download Bobine-TV again from this page.",
        },
      ],
      related: [
        { label: "Installation documentation", path: "/documentation" },
        { label: "Bobine on Google Book", path: "/google-book" },
        { label: "Update channels", path: "/canaux" },
        { label: "Recommended hardware", path: "/materiel/amazon" },
      ],
    },
  },

  "google-book": {
    id: "google-book",
    path: "/google-book",
    fr: {
      title: "Bobine sur Google Book (Aluminium OS) : régie vidéo pour salle de sport",
      description:
        "Bobine sur les ordinateurs portables Google Book (Aluminium OS) : application Android native en ARM64, double affichage tactile et HDMI, accélération matérielle MediaCodec. Installation de l'APK.",
      h1: "Bobine sur Google Book (Aluminium OS)",
      lead:
        "Un Google Book peut devenir la régie vidéo d'une salle de sport : Bobine s'exécute en plein écran grâce à l'application Android native, sans abonnement ni cloud, avec la sortie HDMI vers le téléviseur ou le vidéoprojecteur.",
      breadcrumb: "Google Book",
      keywords: [
        "Bobine Google Book",
        "Google Book salle de sport",
        "Aluminium OS fitness",
        "régie vidéo Google Book",
        "application salle de sport Google Book",
      ],
      sections: [
        {
          heading: "Comment ça fonctionne",
          bullets: [
            `L'APK Bobine (Android ${ANDROID.minVersion} à ${ANDROID.maxVersion}, ARM64) embarque le serveur et l'interface : aucun cloud requis.`,
            "Double affichage indépendant : l'écran du portable pour piloter (/grid), la sortie HDMI pour diffuser le cours (/cinema).",
            "Décodage matériel via MediaCodec et service de premier plan persistant.",
            "Disponibilité sur le Google Play Store annoncée prochainement ; en attendant, l'APK se télécharge depuis cette page.",
          ],
        },
        {
          heading: "Installer",
          paragraphs: [
            "Téléchargez Bobine-<version>.apk depuis l'encart de téléchargement ci-dessus et ouvrez-le depuis le gestionnaire de fichiers. Sur Google Book, le paquet .deb du sous-système Linux reste une alternative.",
          ],
        },
        {
          heading: "Piloter depuis un autre appareil",
          paragraphs: [
            "Depuis un téléphone, une tablette ou un ordinateur du même réseau, ouvrez http://bobine.local:8000 pour accéder à la télécommande et au panneau d'administration de la salle.",
          ],
        },
      ],
      faq: [
        {
          q: "Bobine fonctionne-t-il sur un Google Book ?",
          a: "Oui, via l'application Android native (APK) en ARM64, avec accélération matérielle MediaCodec.",
        },
        {
          q: "Peut-on brancher un téléviseur ou un vidéoprojecteur ?",
          a: "Oui : la sortie HDMI diffuse le cours en plein écran (/cinema) pendant que l'écran du portable sert de pupitre de commande (/grid).",
        },
      ],
      related: [
        { label: "Documentation d'installation", path: "/documentation" },
        { label: "Bobine sur Android TV", path: "/android-tv" },
        { label: "Canaux de mise à jour", path: "/canaux" },
      ],
    },
    en: {
      title: "Bobine on Google Book (Aluminium OS): video playout for gyms",
      description:
        "Bobine on Google Book laptops (Aluminium OS): native ARM64 Android app, independent touch and HDMI dual display, MediaCodec hardware acceleration. APK installation.",
      h1: "Bobine on Google Book (Aluminium OS)",
      lead:
        "A Google Book can become a gym's video playout: Bobine runs fullscreen through the native Android app, with no subscription and no cloud, with the HDMI output feeding the TV or projector.",
      breadcrumb: "Google Book",
      keywords: ["Bobine Google Book", "Google Book gym", "Aluminium OS fitness", "Google Book video playout", "Google Book gym app"],
      sections: [
        {
          heading: "How it works",
          bullets: [
            `The Bobine APK (Android ${ANDROID.minVersion} to ${ANDROID.maxVersion}, ARM64) embeds the server and the interface: no cloud required.`,
            "Independent dual display: the laptop screen to drive the session (/grid), the HDMI output to play the class (/cinema).",
            "Hardware decoding through MediaCodec and a persistent foreground service.",
            "Google Play Store availability is announced as upcoming; meanwhile the APK can be downloaded from this page.",
          ],
        },
        {
          heading: "Installing",
          paragraphs: [
            "Download Bobine-<version>.apk from the download card above and open it from the file manager. On Google Book, the .deb package of the Linux subsystem remains an alternative.",
          ],
        },
        {
          heading: "Control it from another device",
          paragraphs: [
            "From a phone, tablet or computer on the same network, open http://bobine.local:8000 to reach the room's remote control and admin panel.",
          ],
        },
      ],
      faq: [
        {
          q: "Does Bobine work on a Google Book?",
          a: "Yes, through the native Android app (APK) in ARM64, with MediaCodec hardware acceleration.",
        },
        {
          q: "Can I plug in a TV or a projector?",
          a: "Yes: the HDMI output plays the class fullscreen (/cinema) while the laptop screen serves as the control desk (/grid).",
        },
      ],
      related: [
        { label: "Installation documentation", path: "/documentation" },
        { label: "Bobine on Android TV", path: "/android-tv" },
        { label: "Update channels", path: "/canaux" },
      ],
    },
  },

  tor: {
    id: "tor",
    path: "/tor",
    fr: {
      title: "Bobine sur Tor : miroir .onion du site et dépôt APT anonyme",
      description:
        "Bobine sur le réseau Tor : site miroir en service onion et dépôt APT officiel accessible en .onion, paquets signés par la même clé. Commandes d'installation et empreinte de la clé.",
      h1: "Bobine sur Tor : miroir .onion et dépôt APT",
      lead:
        "Pour installer et mettre à jour Bobine sans révéler votre adresse IP, le site et le dépôt APT officiel sont aussi proposés en services onion. C'est un miroir du site et du dépôt officiels : les paquets restent signés par la même clé.",
      breadcrumb: "Tor",
      keywords: ["Bobine Tor", "Bobine onion", "Bobine .onion", "dépôt APT Tor", "apt-transport-tor Bobine", "Bobine anonyme"],
      sections: [
        {
          heading: "Les adresses onion",
          bullets: [
            `Site : http://${ONION_SITE_HOST}/`,
            `Dépôt APT : tor+http://${ONION_APT_HOST}/`,
            "La boutique matériel et l'assistant Baamix ne sont pas proposés sur le miroir : ils reposent sur des liens d'affiliation et des services tiers.",
            "Le miroir est hébergé par le mainteneur, sans journal de visite, avec une disponibilité au mieux.",
          ],
        },
        {
          heading: "Installer Bobine par Tor sur Debian, Ubuntu ou Mint",
          paragraphs: [
            "Le script install-tor.sh fait les cinq étapes et s'arrête si l'empreinte de la clé diffère de celle publiée ; l'option --dry-run n'installe rien. À lire avant de l'exécuter :",
          ],
          code: "curl -fsSL https://bobine.fit/install-tor.sh | bash",
        },
        {
          heading: "Ou à la main",
          paragraphs: ["Les mêmes étapes, une par une :"],
          code: TOR_COMMANDS,
        },
        {
          heading: "Vérifier la clé",
          paragraphs: [
            "Comparez l'empreinte de la clé principale avec celle de https://apt.bobine.fit/bobine.gpg : B77D 96D7 2F84 F36A CAA3 F872 9CBF 497D 829E E15A. apt refuse tout paquet dont la signature ne correspond pas.",
            `Bobine n'est pas affilié au Tor Project. Pour soutenir le réseau Tor : ${TOR_PROJECT_URL} (code source : ${TOR_SOURCE_URL}).`,
          ],
        },
      ],
      faq: [
        {
          q: "Peut-on installer Bobine via Tor ?",
          a: "Oui, sur Debian, Ubuntu et Linux Mint : le dépôt APT officiel est aussi servi en .onion, avec les mêmes paquets signés par la même clé.",
        },
        {
          q: "Le miroir Tor est-il complet ?",
          a: "Il reprend le site statique (documentation, comparatifs, blog) ; la boutique matériel et l'assistant Baamix en sont exclus.",
        },
      ],
      related: [
        { label: "Documentation d'installation", path: "/documentation" },
        { label: "Sécurité", path: "/securite" },
        { label: "Canaux de mise à jour", path: "/canaux" },
      ],
    },
    en: {
      title: "Bobine on Tor: .onion site mirror and anonymous APT repository",
      description:
        "Bobine on the Tor network: a site mirror as an onion service and the official APT repository reachable over .onion, with packages signed by the same key. Installation commands and key fingerprint.",
      h1: "Bobine on Tor: .onion mirror and APT repository",
      lead:
        "To install and update Bobine without revealing your IP address, the site and the official APT repository are also offered as onion services. It is a mirror of the official site and repository: packages remain signed by the same key.",
      breadcrumb: "Tor",
      keywords: ["Bobine Tor", "Bobine onion", "Bobine .onion", "APT repository over Tor", "apt-transport-tor Bobine", "Bobine anonymous install"],
      sections: [
        {
          heading: "The onion addresses",
          bullets: [
            `Site: http://${ONION_SITE_HOST}/`,
            `APT repository: tor+http://${ONION_APT_HOST}/`,
            "The hardware store and the Baamix assistant are not offered on the mirror: they rely on affiliate links and third-party services.",
            "The mirror is hosted by the maintainer, keeps no visit log, and runs on a best-effort basis.",
          ],
        },
        {
          heading: "Installing Bobine over Tor on Debian, Ubuntu or Mint",
          paragraphs: [
            "The install-tor.sh script performs the five steps and stops if the key fingerprint differs from the published one; the --dry-run option installs nothing. Read it before running it:",
          ],
          code: "curl -fsSL https://bobine.fit/install-tor.sh | bash",
        },
        {
          heading: "Or by hand",
          paragraphs: ["The same steps, one at a time:"],
          code: TOR_COMMANDS,
        },
        {
          heading: "Checking the key",
          paragraphs: [
            "Compare the primary key fingerprint with the one at https://apt.bobine.fit/bobine.gpg: B77D 96D7 2F84 F36A CAA3 F872 9CBF 497D 829E E15A. apt rejects any package whose signature does not match.",
            `Bobine is not affiliated with the Tor Project. To support the Tor network: ${TOR_PROJECT_URL} (source code: ${TOR_SOURCE_URL}).`,
          ],
        },
      ],
      faq: [
        {
          q: "Can Bobine be installed over Tor?",
          a: "Yes, on Debian, Ubuntu and Linux Mint: the official APT repository is also served over .onion, with the same packages signed by the same key.",
        },
        {
          q: "Is the Tor mirror complete?",
          a: "It carries the static site (documentation, comparisons, blog); the hardware store and the Baamix assistant are left out.",
        },
      ],
      related: [
        { label: "Installation documentation", path: "/documentation" },
        { label: "Security", path: "/securite" },
        { label: "Update channels", path: "/canaux" },
      ],
    },
  },

  nouveautes: {
    id: "nouveautes",
    path: "/nouveautes",
    fr: {
      title: "Nouveautés de Bobine : dernières versions et changements",
      description:
        "Les nouveautés de Bobine : dernière version stable, Bêta et Canary en cours, et l'historique daté des versions publiées sur GitHub Releases, avec les changements principaux.",
      h1: "Nouveautés de Bobine",
      lead:
        "Cette page résume l'état du projet : la version stable en cours, l'état des canaux Bêta et Canary, et les dernières versions publiées. Les dates et les numéros sont lus directement depuis GitHub Releases.",
      breadcrumb: "Nouveautés",
      keywords: ["Bobine nouveautés", "Bobine changelog", "Bobine dernière version", "Bobine release notes", "Bobine 5"],
      sections: [
        {
          heading: "Plateformes prises en charge",
          bullets: [
            "Windows 11 et 10 : x86-64 et ARM64 (Snapdragon).",
            "macOS : Apple Silicon.",
            "Linux : Debian, Ubuntu et Mint en x86-64 et ARM64, dépôt APT officiel ; appliance dédiée Debian 13.",
            `Android ${ANDROID.minVersion} à ${ANDROID.maxVersion} : tablettes et Google Book (APK), Android TV et Google TV (APK dédié, ARM 32 et 64 bits).`,
          ],
        },
        {
          heading: "Principaux ajouts de la version 5",
          bullets: [
            "Trois canaux de mise à jour : Stable, Bêta et Canary.",
            "Prise en charge native d'ARM64 : PC Snapdragon sous Windows et Linux, stations Linux ARM64, Google Book.",
            "Nouvelle identité visuelle translucide et 16 thèmes.",
            "Sous-titres multilingues (.srt et .vtt) par cours vidéo.",
            "Pipeline de mise à jour fiabilisé et découverte réseau bobine.local consolidée.",
          ],
        },
      ],
      faq: [
        {
          q: "Quelle est la dernière version de Bobine ?",
          a: "La version stable en cours est indiquée en tête de cette page, lue depuis GitHub Releases. Les canaux Bêta et Canary avancent plus vite.",
        },
        {
          q: "Où trouver les notes de chaque version ?",
          a: "Dans le blog de bobine.fit et sur la page GitHub Releases du projet, qui détaillent chaque version.",
        },
      ],
      related: [
        { label: "Canaux de mise à jour", path: "/canaux" },
        { label: "Blog et versions", path: "/blog" },
        { label: "Documentation", path: "/documentation" },
      ],
    },
    en: {
      title: "What's new in Bobine: latest versions and changes",
      description:
        "What's new in Bobine: the current stable version, the running Beta and Canary, and the dated history of releases published on GitHub Releases, with the main changes.",
      h1: "What's new in Bobine",
      lead:
        "This page sums up the state of the project: the current stable version, the state of the Beta and Canary channels, and the latest releases. Dates and numbers are read straight from GitHub Releases.",
      breadcrumb: "What's new",
      keywords: ["Bobine what's new", "Bobine changelog", "Bobine latest version", "Bobine release notes", "Bobine 5"],
      sections: [
        {
          heading: "Supported platforms",
          bullets: [
            "Windows 11 and 10: x86-64 and ARM64 (Snapdragon).",
            "macOS: Apple Silicon.",
            "Linux: Debian, Ubuntu and Mint on x86-64 and ARM64, official APT repository; dedicated Debian 13 appliance.",
            `Android ${ANDROID.minVersion} to ${ANDROID.maxVersion}: tablets and Google Book (APK), Android TV and Google TV (dedicated APK, 32-bit and 64-bit ARM).`,
          ],
        },
        {
          heading: "Main additions of version 5",
          bullets: [
            "Three update channels: Stable, Beta and Canary.",
            "Native ARM64 support: Snapdragon PCs on Windows and Linux, ARM64 Linux workstations, Google Book.",
            "A new translucent visual identity and 16 themes.",
            "Multilingual subtitles (.srt and .vtt) per video class.",
            "A hardened update pipeline and a consolidated bobine.local network discovery.",
          ],
        },
      ],
      faq: [
        {
          q: "What is the latest version of Bobine?",
          a: "The current stable version is shown at the top of this page, read from GitHub Releases. The Beta and Canary channels move faster.",
        },
        {
          q: "Where are the notes of each version?",
          a: "On the bobine.fit blog and on the project's GitHub Releases page, which detail every version.",
        },
      ],
      related: [
        { label: "Update channels", path: "/canaux" },
        { label: "Blog and versions", path: "/blog" },
        { label: "Documentation", path: "/documentation" },
      ],
    },
  },
};

export const LANDING_IDS = Object.keys(LANDING_PAGES) as LandingId[];

export function getLanding(id: LandingId, locale: Locale): LandingLocale {
  return LANDING_PAGES[id][locale];
}
