import type { AssetKey } from "@/lib/assets";
import type { Locale } from "@/lib/i18n";
import { ONION_APT_HOST, ONION_SITE_HOST, TOR_PROJECT_URL, TOR_SOURCE_URL } from "@/lib/onion";
import { ANDROID } from "@/lib/productFacts";
import {
  FAMILY_NOTES,
  NOT_VALIDATED_NOTE,
  SIGNING_KEY_FINGERPRINT,
  archInstallScript,
  aptInstallScript,
  fedoraCommands,
  fedoraInstallScript,
  keyCheckCommand,
  linuxFormatsShort,
  linuxFormatsSummary,
  packageFileName,
  repoStatusNote,
  slidingChannelPackageNames,
} from "@/lib/linuxPackages";

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
  | "ordinateur"
  | "linux"
  | "android-tv"
  | "google-book"
  | "tor"
  | "nouveautes";

export type LandingSectionIcon =
  | "cpu"
  | "display"
  | "shield"
  | "terminal"
  | "layers"
  | "download"
  | "network"
  | "spark";

export interface LandingSection {
  heading: string;
  icon?: LandingSectionIcon;
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

export interface LandingChip {
  label: string;
  note: string;
  icon?: AssetKey;
}

export interface LandingShowcaseCard {
  title: string;
  subtitle: string;
  image: string;
  href: string;
  cta: string;
}

export interface LandingHardwareCta {
  title: string;
  desc: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel: string;
  secondaryHref: string;
}

export interface LandingLocale {
  title: string;
  description: string;
  badge?: string;
  h1: string;
  lead: string;
  breadcrumb: string;
  keywords: string[];
  heroImage?: { src: string; alt: string; width: number; height: number };
  chips?: LandingChip[];
  showcaseCards?: LandingShowcaseCard[];
  hardwareCta?: LandingHardwareCta;
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

/** Phrase ajoutée tant que les dépôts Fedora et Arch ne sont pas en ligne, vide ensuite. */
const soonSuffix = (l: "fr" | "en") => {
  const note = repoStatusNote("fedora", l);
  return note ? ` ${note}` : "";
};
const slidingNames = (channel: "beta" | "canary") => slidingChannelPackageNames(channel).join(", ");

const CHANNEL_RELATED_FR: LandingLink[] = [
  { label: "Tous les canaux de mise à jour", path: "/canaux" },
  { label: "Guide d'installation", path: "/documentation" },
  { label: "Bobine pour Linux (Debian, Fedora, Arch)", path: "/linux" },
  { label: "Nouveautés de Bobine", path: "/nouveautes" },
];
const CHANNEL_RELATED_EN: LandingLink[] = [
  { label: "All update channels", path: "/canaux" },
  { label: "Installation guide", path: "/documentation" },
  { label: "Bobine for Linux (Debian, Fedora, Arch)", path: "/linux" },
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
      badge: "Canaux de distribution · Stable · Bêta · Canary",
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
      showcaseCards: [
        {
          title: "Canal Stable",
          subtitle: "Versions officielles figées (Vx.y.z), testées et signées pour les salles en exploitation 24/7.",
          image: "/images/channels/bobine-stable.webp",
          href: "/canaux/stable",
          cta: "Ouvrir Stable",
        },
        {
          title: "Canal Bêta",
          subtitle: "Lots de fonctionnalités et de correctifs sélectionnés et publiés manuellement.",
          image: "/images/channels/bobine-beta.webp",
          href: "/canaux/beta",
          cta: "Ouvrir Bêta",
        },
        {
          title: "Canal Canary",
          subtitle: "Canal rolling reconstruit automatiquement à chaque commit sur la branche principale.",
          image: "/images/channels/bobine-canary.webp",
          href: "/canaux/canary",
          cta: "Ouvrir Canary",
        },
      ],
      sections: [
        {
          heading: "Quel canal choisir",
          icon: "layers",
          bullets: [
            "Stable : versions officielles figées (tags Vx.y.z), recommandées pour une salle en exploitation.",
            "Bêta : lots de fonctionnalités et de correctifs choisis et publiés manuellement quand ils sont prêts, plus avancés que Stable et plus éprouvés que Canary.",
            "Canary : reconstruit automatiquement à chaque commit de la branche principale, sans curation ni test préalable, pour suivre le développement au jour le jour.",
          ],
        },
        {
          heading: "Changer de canal sans perdre ses données",
          icon: "terminal",
          paragraphs: [
            "Sur toutes les plateformes, les trois canaux partagent les mêmes identifiants d'application et s'installent par-dessus la version existante : la base de données et les médias ne sont pas touchés. Le choix se fait dans Réglages, Mises à jour logicielles, Canal de mise à jour, ou à l'installation de l'appliance Linux :",
          ],
          code: `${CHANNEL_CLI("stable")}\n${CHANNEL_CLI("beta")}\n${CHANNEL_CLI("canary")}`,
        },
        {
          heading: "Retour à la Stable à tout moment",
          icon: "shield",
          paragraphs: [
            "Depuis la Bêta ou la Canary, la dernière Stable est proposée explicitement, même si son numéro est inférieur à celui du build installé. Ce retour en arrière n'est jamais appliqué automatiquement : il reste un clic volontaire.",
          ],
        },
        {
          heading: "Dépôts Linux unifiés et fichiers",
          icon: "download",
          paragraphs: [
            "Le dépôt APT officiel (packages.bobine.fit/debian) expose trois suites, stable, beta et canary. Sur GitHub, chaque canal Bêta et Canary est une release unique dont le tag mobile est republié en place (beta et canary) ; les fichiers portent un nom fixe, par exemple Bobine-canary.apk ou bobine_beta_amd64.deb.",
            `Les dépôts Fedora (packages.bobine.fit/fedora, dnf) et Arch Linux (packages.bobine.fit/arch, pacman) suivent les mêmes trois canaux, signés par la même clé GPG.${soonSuffix("fr")}`,
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
      badge: "Release Channels · Stable · Beta · Canary",
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
      showcaseCards: [
        {
          title: "Stable Channel",
          subtitle: "Frozen official releases (Vx.y.z), tested and signed for 24/7 studio operation.",
          image: "/images/channels/bobine-stable.webp",
          href: "/canaux/stable",
          cta: "Open Stable",
        },
        {
          title: "Beta Channel",
          subtitle: "Curated feature and fix batches picked and published manually.",
          image: "/images/channels/bobine-beta.webp",
          href: "/canaux/beta",
          cta: "Open Beta",
        },
        {
          title: "Canary Channel",
          subtitle: "Rolling channel rebuilt automatically on every commit to the main branch.",
          image: "/images/channels/bobine-canary.webp",
          href: "/canaux/canary",
          cta: "Open Canary",
        },
      ],
      sections: [
        {
          heading: "Which channel to choose",
          icon: "layers",
          bullets: [
            "Stable: frozen official releases (Vx.y.z tags), recommended for a studio in daily operation.",
            "Beta: batches of features and fixes picked and published manually when they are ready, further ahead than Stable and better proven than Canary.",
            "Canary: rebuilt automatically on every commit to the main branch, with no curation and no prior testing, to follow development day by day.",
          ],
        },
        {
          heading: "Switching channels without losing data",
          icon: "terminal",
          paragraphs: [
            "On every platform the three channels share the same application IDs and install over the existing version: the database and the media are left untouched. The choice is made in Settings, Software updates, Update channel, or when installing the Linux appliance:",
          ],
          code: `${CHANNEL_CLI("stable")}\n${CHANNEL_CLI("beta")}\n${CHANNEL_CLI("canary")}`,
        },
        {
          heading: "Back to Stable at any time",
          icon: "shield",
          paragraphs: [
            "From Beta or Canary, the latest Stable is offered explicitly, even when its number is lower than the installed build. This rollback is never applied automatically: it stays a deliberate click.",
          ],
        },
        {
          heading: "Unified Linux repositories and files",
          icon: "download",
          paragraphs: [
            "The official APT repository (packages.bobine.fit/debian) exposes three distributions: stable, beta and canary. On GitHub, each of the Beta and Canary channels is a single release whose moving tag (beta and canary) is republished in place; files carry fixed names, for example Bobine-canary.apk or bobine_beta_amd64.deb.",
            `The Fedora (packages.bobine.fit/fedora, dnf) and Arch Linux (packages.bobine.fit/arch, pacman) repositories follow the same three channels, signed by the same GPG key.${soonSuffix("en")}`,
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
      badge: "Canal Stable · Recommandé en production 24/7",
      h1: "Bobine Stable, la version officielle",
      lead:
        "Le canal Stable de Bobine publie des versions figées, identifiées par un tag Vx.y.z, accompagnées de notes de version. C'est le canal par défaut de toutes les installations et celui à utiliser pour une salle en exploitation.",
      breadcrumb: "Stable",
      keywords: ["Bobine Stable", "Bobine dernière version stable", "télécharger Bobine", "Bobine version officielle"],
      sections: [
        {
          heading: "Ce que garantit le canal Stable",
          icon: "shield",
          bullets: [
            "Une version par tag Vx.y.z strict, publiée sur GitHub Releases avec ses notes.",
            `Les mêmes fichiers sur toutes les plateformes : Windows (x86-64 et ARM64), macOS Apple Silicon, ${linuxFormatsShort("fr")}, Android, Android TV, assistant Bobine Assistant.`,
            "Une empreinte SHA-256 vérifiée avant toute installation lancée depuis l'application.",
          ],
        },
        {
          heading: "Installer ou revenir à la Stable",
          icon: "terminal",
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
          a: `L'application propose la mise à jour en un clic et peut la planifier la nuit ; sur Debian et Ubuntu, le dépôt APT officiel la rend disponible via apt upgrade, et les dépôts dnf (Fedora) et pacman (Arch Linux) font de même avec dnf upgrade et pacman -Syu.${soonSuffix("fr")}`,
        },
      ],
      related: CHANNEL_RELATED_FR,
    },
    en: {
      title: "Bobine Stable: download the latest official release",
      description:
        "Bobine Stable: the official release recommended for gyms and studios. Download the latest Stable for Windows, macOS, Linux, Android and Android TV, with release notes.",
      badge: "Stable Channel · Recommended for 24/7 production",
      h1: "Bobine Stable, the official release",
      lead:
        "The Stable channel publishes frozen releases identified by a Vx.y.z tag and shipped with release notes. It is the default channel of every installation and the one to use for a studio in daily operation.",
      breadcrumb: "Stable",
      keywords: ["Bobine Stable", "Bobine latest stable version", "download Bobine", "Bobine official release"],
      sections: [
        {
          heading: "What the Stable channel guarantees",
          icon: "shield",
          bullets: [
            "One release per strict Vx.y.z tag, published on GitHub Releases with its notes.",
            `The same files on every platform: Windows (x86-64 and ARM64), macOS Apple Silicon, ${linuxFormatsShort("en")}, Android, Android TV, and the Bobine Assistant.`,
            "A SHA-256 digest verified before any installation started from the application.",
          ],
        },
        {
          heading: "Install or go back to Stable",
          icon: "terminal",
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
          a: `The application offers one-click updates and can schedule them overnight; on Debian and Ubuntu, the official APT repository makes them available through apt upgrade, and the dnf (Fedora) and pacman (Arch Linux) repositories do the same with dnf upgrade and pacman -Syu.${soonSuffix("en")}`,
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
      badge: "Canal Bêta · Lots curés manuellement",
      h1: "Bobine Bêta, le canal des lots curés",
      lead:
        "La Bêta de Bobine regroupe des fonctionnalités et des correctifs que le mainteneur sélectionne et publie manuellement quand ils sont prêts. Elle est plus avancée que la Stable et plus éprouvée que la Canary.",
      breadcrumb: "Bêta",
      keywords: ["Bobine Bêta", "Bobine Beta", "Bobine version bêta", "télécharger Bobine bêta", "Bobine beta apk"],
      sections: [
        {
          heading: "Comment fonctionne la Bêta",
          icon: "layers",
          bullets: [
            "Publication uniquement sur décision manuelle, jamais sur un simple commit.",
            "Une seule release GitHub, au tag mobile beta, republiée en place à chaque lot.",
            `Fichiers à nom fixe (Bobine-beta.apk, Bobine-TV-beta.apk, ${slidingNames("beta")}, Bobine-Setup-beta.exe, Bobine-beta.dmg).`,
            "Mise à jour détectée par comparaison de commit, puisqu'aucun numéro de version n'avance à chaque lot.",
          ],
        },
        {
          heading: "Rejoindre ou quitter la Bêta",
          icon: "terminal",
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
      badge: "Beta Channel · Manually curated batches",
      h1: "Bobine Beta, the curated batches channel",
      lead:
        "Bobine Beta gathers features and fixes that the maintainer picks and publishes manually when they are ready. It is further ahead than Stable and better proven than Canary.",
      breadcrumb: "Beta",
      keywords: ["Bobine Beta", "Bobine beta version", "download Bobine beta", "Bobine beta apk"],
      sections: [
        {
          heading: "How the Beta works",
          icon: "layers",
          bullets: [
            "Published only on a manual decision, never on a plain commit.",
            "A single GitHub release, on the moving tag beta, republished in place for each batch.",
            `Fixed file names (Bobine-beta.apk, Bobine-TV-beta.apk, ${slidingNames("beta")}, Bobine-Setup-beta.exe, Bobine-beta.dmg).`,
            "Updates are detected by comparing commits, since no version number moves with each batch.",
          ],
        },
        {
          heading: "Join or leave the Beta",
          icon: "terminal",
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
      badge: "Canal Canary · Rolling release par commit",
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
          icon: "spark",
          bullets: [
            "Une release GitHub unique, au tag mobile canary, republiée en place à chaque push sur la branche principale.",
            `Fichiers à nom fixe (Bobine-canary.apk, Bobine-TV-canary.apk, ${slidingNames("canary")}, Bobine-Setup-canary.exe, Bobine-canary.dmg).`,
            "Notes de version générées automatiquement : le journal des commits depuis la dernière Stable.",
            "Mise à jour détectée par comparaison de commit.",
          ],
        },
        {
          heading: "Rejoindre ou quitter la Canary",
          icon: "terminal",
          paragraphs: [
            "Dans Réglages, Mises à jour logicielles, choisissez le canal Canary. Sur l'appliance Linux ou depuis l'assistant Bobine Assistant :",
          ],
          code: CHANNEL_CLI("canary"),
        },
        {
          heading: "À savoir avant d'installer",
          icon: "shield",
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
      badge: "Canary Channel · Rolling release per commit",
      h1: "Bobine Canary, the rolling channel",
      lead:
        "Bobine Canary is rebuilt automatically on every commit to the main branch. It is the earliest access to the software's changes, with no curation and no prior testing: keep it for following development.",
      breadcrumb: "Canary",
      keywords: ["Bobine Canary", "Bobine canary apk", "Bobine rolling release", "download Bobine Canary", "Bobine automatic build"],
      sections: [
        {
          heading: "How the Canary works",
          icon: "spark",
          bullets: [
            "A single GitHub release, on the moving tag canary, republished in place on every push to the main branch.",
            `Fixed file names (Bobine-canary.apk, Bobine-TV-canary.apk, ${slidingNames("canary")}, Bobine-Setup-canary.exe, Bobine-canary.dmg).`,
            "Automatically generated release notes: the commit log since the latest Stable.",
            "Updates are detected by comparing commits.",
          ],
        },
        {
          heading: "Join or leave the Canary",
          icon: "terminal",
          paragraphs: [
            "In Settings, Software updates, choose the Canary channel. On the Linux appliance or from the Bobine Assistant:",
          ],
          code: CHANNEL_CLI("canary"),
        },
        {
          heading: "Before you install",
          icon: "shield",
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

  ordinateur: {
    id: "ordinateur",
    path: "/ordinateur",
    fr: {
      title: "Bobine pour Ordinateur (PC Windows, Mac Apple Silicon, Linux & Mini-PC 24/7)",
      description:
        "Bobine sur ordinateur de bureau, portable et mini-PC 24/7 : Windows 11/10 (x86-64 Intel/AMD et ARM64 Snapdragon X Elite/Plus), macOS Apple Silicon (M1 à M4), Linux (16 distributions via packages.bobine.fit) et Framework Laptop. Fiches matériel et téléchargements.",
      badge: "Windows 11/10 · macOS Apple Silicon · Linux Bureau · Appliance 24/7",
      h1: "Bobine pour Ordinateur : PC, Mac et Mini-PC 24/7",
      lead:
        "Que vous équipiez une salle de cours collectifs avec un mini-PC fanless dédié 24/7, un Mac mini M4 en régie principale ou un ordinateur portable Windows / Linux / Framework, Bobine s'installe nativement en x86-64 comme en ARM64 et fonctionne 100 % hors-ligne.",
      breadcrumb: "Ordinateur (PC & Mac)",
      keywords: [
        "Bobine PC",
        "Bobine Windows 11",
        "Bobine Mac Apple Silicon",
        "Bobine Mac mini M4",
        "Bobine mini PC salle de sport",
        "Bobine Snapdragon X Elite",
        "Bobine Intel N100",
        "Bobine AMD Ryzen",
        "Bobine Framework Laptop",
        "logiciel régie vidéo fitness PC",
      ],
      heroImage: {
        src: "/images/FrameworkBaamix-wide.webp",
        alt: "Bobine exécuté sur un ordinateur portable Framework avec l'assistant Baamix",
        width: 1200,
        height: 675,
      },
      chips: [
        { label: "Intel Core Ultra & N100 / N95", note: "Windows 11/10 & Linux x86-64", icon: "chip.intel" },
        { label: "AMD Ryzen 5 / 7 / 9 & Ryzen AI", note: "Windows 11/10 & Linux x86-64", icon: "chip.amd" },
        { label: "Qualcomm Snapdragon X Elite / X Plus", note: "Windows 11 ARM64 & Linux aarch64", icon: "chip.snapdragon" },
        { label: "Apple Silicon M1, M2, M3 & M4", note: "macOS 12+ natif arm64", icon: "os.macos" },
        { label: "Framework Laptop 13 & 16", note: "Windows & Linux modulaire", icon: "os.framework" },
        { label: "Raspberry Pi 5 & NVIDIA DGX Spark", note: "Linux ARM64 (aarch64)", icon: "distro.raspberrypi" },
      ],
      showcaseCards: [
        {
          title: "Mini-PC Régie 24/7 (Intel / AMD)",
          subtitle: "Geekom IT13, Minisforum, Bosgame, NiPoGi et Dell Wyse 5070 pour une diffusion continue sur TV ou projecteur.",
          image: "/images/hardware/editorial/minipc.svg",
          href: "/materiel/amazon",
          cta: "Voir les mini-PC recommandés",
        },
        {
          title: "Mac mini M4 & Mac Studio",
          subtitle: "Application native Apple Silicon (.dmg) ultra-silencieuse avec décodage matériel VideoToolbox et double sortie.",
          image: "/images/hardware/editorial/minipc.svg",
          href: "/materiel/amazon",
          cta: "Voir la sélection Apple",
        },
        {
          title: "Portables PC, Snapdragon X & Framework",
          subtitle: "ThinkPad, ASUS Vivobook S15 Snapdragon X Elite, Surface Laptop 7 et Framework Laptop pour piloter et diffuser.",
          image: "/images/hardware/editorial/laptop.svg",
          href: "/materiel/amazon",
          cta: "Voir les portables compatibles",
        },
        {
          title: "Cartes ARM64 & Raspberry Pi 5",
          subtitle: "Kits Raspberry Pi 5 (8 Go), Orange Pi 5 Plus, Radxa Rock 5B et stations NVIDIA Jetson / DGX Spark.",
          image: "/images/hardware/editorial/minipc.svg",
          href: "/materiel/aliexpress",
          cta: "Voir les kits ARM64",
        },
      ],
      hardwareCta: {
        title: "Fiches matériel dédiées par budget et usage",
        desc: "Consultez notre comparateur matériel complet (mini-PC fanless, Mac mini, portables Windows/Linux, câbles HDMI fibre optique et adaptateurs) avec configurations vérifiées pour Bobine.",
        primaryLabel: "Sélection Amazon (Livraison rapide)",
        primaryHref: "/materiel/amazon",
        secondaryLabel: "Sélection AliExpress (Mini-PC & ARM)",
        secondaryHref: "/materiel/aliexpress",
      },
      sections: [
        {
          heading: "Windows 11 et Windows 10 (x86-64 et ARM64 natif)",
          icon: "display",
          bullets: [
            "Deux installateurs dédiés signés : Bobine-Setup-<version>.exe pour les processeurs Intel Core (i3/i5/i7/i9, Core Ultra, N100/N200) et AMD Ryzen, et Bobine-Setup-<version>-arm64.exe pour les PC Copilot+ équipés de puces Qualcomm Snapdragon X Elite, X Plus et 8cx Gen 3.",
            "Exécution autonome en arrière-plan avec ouverture automatique de l'interface et création du raccourci Bureau.",
            "Double affichage natif : écran principal pour la grille de sélection des coachs (/grid) et sortie HDMI / DisplayPort secondaire en plein écran (/cinema) vers le téléviseur ou le vidéoprojecteur.",
          ],
        },
        {
          heading: "macOS Apple Silicon (M1, M2, M3, M4)",
          icon: "cpu",
          bullets: [
            "Image disque native Bobine-<version>.dmg compilée pour l'architecture arm64 d'Apple (Mac mini, Mac Studio, iMac 24 pouces, MacBook Air et MacBook Pro sous macOS 12 Monterey ou supérieur).",
            "Décodage matériel H.264/HEVC ultra-sobre et silencieux, idéal pour les studios haut de gamme.",
            "Découverte automatique sur le réseau local via Bonjour / mDNS (http://bobine.local:8000) pour piloter la séance depuis un iPad ou un iPhone.",
          ],
        },
        {
          heading: "Linux Bureau (16 distributions) et Appliance Kiosque 24/7",
          icon: "terminal",
          paragraphs: [
            "Sur poste de travail Linux, Bobine dispose de dépôts officiels signés sur packages.bobine.fit pour les trois grandes familles : Debian / Ubuntu / Linux Mint / Pop!_OS / Zorin (.deb), Fedora / Nobara / RHEL / AlmaLinux / Rocky Linux (.rpm) et Arch Linux / CachyOS / EndeavourOS / Manjaro (.pkg.tar.zst), en x86_64 et ARM64.",
            "Pour transformer un mini-PC dédié (Dell Wyse 5070, Intel NUC, Beelink, Geekom, Minisforum ou Raspberry Pi 5) en régie autonome 24/7 sous Debian 13, une seule commande configure le serveur, le kiosque graphique plein écran et le point d'accès réseau :",
          ],
          code: "curl -fsSL https://bobine.fit/install.sh | sudo bash",
        },
        {
          heading: "Navigateurs pris en charge pour le pilotage et l'écran salle",
          icon: "network",
          bullets: [
            "Famille Chromium / Blink (Google Chrome 109+, Brave, Microsoft Edge, Vivaldi) : prise en charge complète du mode kiosque, de la synthèse vocale locale et de la sortie HDMI secondaire.",
            "Famille Gecko (Mozilla Firefox 115+ Desktop, Firefox ESR, Firefox Android, Tor Browser) : compatibilité totale avec la régie, le tableau de bord d'administration et l'assistant IA local Baamix.",
            "Famille WebKit (Apple Safari 16+ sur macOS, iPadOS et iOS) : télécommande tactile fluide au bord du studio et affichage plein écran AirPlay / HDMI.",
          ],
        },
      ],
      faq: [
        {
          q: "Quel mini-PC choisir pour faire tourner Bobine 24h/24 dans une salle de sport ?",
          a: "Un mini-PC à processeur Intel N100, Intel Core i3/i5 ou AMD Ryzen 5 avec 8 Go de RAM et un SSD de 256 à 512 Go suffit largement. Pour un budget minimal et silencieux (fanless), un client léger reconditionné Dell Wyse 5070 sous Debian 13 est une référence éprouvée.",
        },
        {
          q: "Quelle version télécharger pour un PC Windows équipé d'une puce Snapdragon X Elite ou X Plus ?",
          a: "Choisissez l'installateur Windows ARM64 (Bobine-Setup-<version>-arm64.exe) dans la fenêtre de téléchargement : il s'exécute nativement sur l'architecture ARM64 de Qualcomm sans émulation x86.",
        },
        {
          q: "Peut-on utiliser un ordinateur portable pour piloter la séance tout en projetant la vidéo ?",
          a: "Oui. Branchez le téléviseur ou le vidéoprojecteur en HDMI ou USB-C DisplayPort, étendez l'affichage dans votre système, placez la fenêtre /cinema en plein écran sur le projecteur et gardez la grille /grid sur l'écran du portable.",
        },
        {
          q: "Où trouver les fiches matériel détaillées pour acheter le PC ou les accessoires ?",
          a: "Rendez-vous sur la page Matériel (/fr/materiel/amazon ou /fr/materiel/aliexpress), qui classe chaque mini-PC, Mac, portable, tablette et câble par usage et par budget.",
        },
      ],
      related: [
        { label: "Fiches Matériel recommandé (Amazon)", path: "/materiel/amazon" },
        { label: "Mini-PC & Cartes ARM (AliExpress)", path: "/materiel/aliexpress" },
        { label: "Bobine pour Linux (Debian, Fedora, Arch)", path: "/linux" },
        { label: "Bobine sur Google Book", path: "/google-book" },
        { label: "Documentation et navigateurs compatibles", path: "/documentation" },
      ],
    },
    en: {
      title: "Bobine for Computer (Windows PC, Apple Silicon Mac, Linux & 24/7 Mini-PC)",
      description:
        "Bobine on desktops, laptops and 24/7 mini-PCs: Windows 11/10 (x86-64 Intel/AMD and ARM64 Snapdragon X Elite/Plus), Apple Silicon macOS (M1 to M4), Linux (16 distros via packages.bobine.fit) and Framework Laptop. Hardware sheets and downloads.",
      badge: "Windows 11/10 · Apple Silicon macOS · Linux Desktop · 24/7 Appliance",
      h1: "Bobine for Computer: PC, Mac and 24/7 Mini-PC",
      lead:
        "Whether you are fitting a group fitness studio with a dedicated fanless 24/7 mini-PC, an M4 Mac mini at the main desk, or a Windows / Linux / Framework laptop, Bobine installs natively on both x86-64 and ARM64 and runs 100% offline.",
      breadcrumb: "PC & Mac",
      keywords: [
        "Bobine PC",
        "Bobine Windows 11",
        "Bobine Apple Silicon Mac",
        "Bobine Mac mini M4",
        "Bobine gym mini PC",
        "Bobine Snapdragon X Elite",
        "Bobine Intel N100",
        "Bobine AMD Ryzen",
        "Bobine Framework Laptop",
        "gym video playout PC software",
      ],
      heroImage: {
        src: "/images/FrameworkBaamix-wide.webp",
        alt: "Bobine running on a Framework laptop with the Baamix AI assistant",
        width: 1200,
        height: 675,
      },
      chips: [
        { label: "Intel Core Ultra & N100 / N95", note: "Windows 11/10 & Linux x86-64", icon: "chip.intel" },
        { label: "AMD Ryzen 5 / 7 / 9 & Ryzen AI", note: "Windows 11/10 & Linux x86-64", icon: "chip.amd" },
        { label: "Qualcomm Snapdragon X Elite / X Plus", note: "Windows 11 ARM64 & Linux aarch64", icon: "chip.snapdragon" },
        { label: "Apple Silicon M1, M2, M3 & M4", note: "Native arm64 macOS 12+", icon: "os.macos" },
        { label: "Framework Laptop 13 & 16", note: "Modular Windows & Linux", icon: "os.framework" },
        { label: "Raspberry Pi 5 & NVIDIA DGX Spark", note: "Linux ARM64 (aarch64)", icon: "distro.raspberrypi" },
      ],
      showcaseCards: [
        {
          title: "24/7 Playout Mini-PCs (Intel / AMD)",
          subtitle: "Geekom IT13, Minisforum, Bosgame, NiPoGi and Dell Wyse 5070 for continuous playout on TVs or projectors.",
          image: "/images/hardware/editorial/minipc.svg",
          href: "/materiel/amazon",
          cta: "View recommended mini-PCs",
        },
        {
          title: "M4 Mac mini & Mac Studio",
          subtitle: "Whisper-quiet native Apple Silicon app (.dmg) with VideoToolbox hardware decoding and dual display output.",
          image: "/images/hardware/editorial/minipc.svg",
          href: "/materiel/amazon",
          cta: "View Apple selection",
        },
        {
          title: "Windows, Snapdragon X & Framework Laptops",
          subtitle: "ThinkPad, ASUS Vivobook S15 Snapdragon X Elite, Surface Laptop 7 and Framework Laptop for control and playout.",
          image: "/images/hardware/editorial/laptop.svg",
          href: "/materiel/amazon",
          cta: "View compatible laptops",
        },
        {
          title: "ARM64 Boards & Raspberry Pi 5",
          subtitle: "Raspberry Pi 5 (8 GB) kits, Orange Pi 5 Plus, Radxa Rock 5B and NVIDIA Jetson / DGX Spark workstations.",
          image: "/images/hardware/editorial/minipc.svg",
          href: "/materiel/aliexpress",
          cta: "View ARM64 kits",
        },
      ],
      hardwareCta: {
        title: "Dedicated hardware sheets by budget and use case",
        desc: "Browse our complete hardware directory (fanless mini-PCs, Mac mini, Windows/Linux laptops, fiber-optic HDMI cables and adapters) with configurations to check against Bobine requirements.",
        primaryLabel: "Amazon Selection (Fast delivery)",
        primaryHref: "/materiel/amazon",
        secondaryLabel: "AliExpress Selection (Mini-PC & ARM)",
        secondaryHref: "/materiel/aliexpress",
      },
      sections: [
        {
          heading: "Windows 11 and Windows 10 (native x86-64 and ARM64)",
          icon: "display",
          bullets: [
            "Two signed dedicated installers: Bobine-Setup-<version>.exe for Intel Core (i3/i5/i7/i9, Core Ultra, N100/N200) and AMD Ryzen processors, and Bobine-Setup-<version>-arm64.exe for Copilot+ PCs powered by Qualcomm Snapdragon X Elite, X Plus and 8cx Gen 3 chips.",
            "Self-contained background runtime with automatic browser launch and Desktop shortcut creation.",
            "Native dual display: primary screen for the coach selection grid (/grid) and secondary fullscreen HDMI / DisplayPort output (/cinema) feeding the TV or projector.",
          ],
        },
        {
          heading: "macOS Apple Silicon (M1, M2, M3, M4)",
          icon: "cpu",
          bullets: [
            "Native Bobine-<version>.dmg disk image compiled for Apple arm64 architecture (Mac mini, Mac Studio, 24-inch iMac, MacBook Air and MacBook Pro running macOS 12 Monterey or later).",
            "Low-power, silent H.264/HEVC hardware decoding ideal for premium studios.",
            "Automatic local network discovery over Bonjour / mDNS (http://bobine.local:8000) to drive sessions from an iPad or iPhone.",
          ],
        },
        {
          heading: "Linux Desktop (16 distributions) and 24/7 Kiosk Appliance",
          icon: "terminal",
          paragraphs: [
            "On Linux workstations, Bobine provides official signed repositories on packages.bobine.fit across all three major families: Debian / Ubuntu / Linux Mint / Pop!_OS / Zorin (.deb), Fedora / Nobara / RHEL / AlmaLinux / Rocky Linux (.rpm) and Arch Linux / CachyOS / EndeavourOS / Manjaro (.pkg.tar.zst), on both x86_64 and ARM64.",
            "To turn a dedicated mini-PC (Dell Wyse 5070, Intel NUC, Beelink, Geekom, Minisforum or Raspberry Pi 5) into an autonomous 24/7 appliance on Debian 13, a single command sets up the server, fullscreen graphical kiosk and network discovery:",
          ],
          code: "curl -fsSL https://bobine.fit/install.sh | sudo bash",
        },
        {
          heading: "Supported browsers for control desk and studio screen",
          icon: "network",
          bullets: [
            "Chromium / Blink family (Google Chrome 109+, Brave, Microsoft Edge, Vivaldi): full support for kiosk mode, local speech synthesis and secondary HDMI output.",
            "Gecko family (Mozilla Firefox 115+ Desktop, Firefox ESR, Firefox Android, Tor Browser): full compatibility with the playout engine, admin dashboard and local Baamix AI assistant.",
            "WebKit family (Apple Safari 16+ on macOS, iPadOS and iOS): smooth touch remote control on the studio floor and fullscreen AirPlay / HDMI output.",
          ],
        },
      ],
      faq: [
        {
          q: "Which mini-PC should I pick to run Bobine 24/7 in a gym?",
          a: "A mini-PC with an Intel N100, Intel Core i3/i5 or AMD Ryzen 5 processor, 8 GB of RAM and a 256 to 512 GB SSD is more than enough. For a silent, low-budget fanless setup, a refurbished Dell Wyse 5070 thin client running Debian 13 is a proven workhorse.",
        },
        {
          q: "Which version should I download for a Windows PC with a Snapdragon X Elite or X Plus chip?",
          a: "Pick the Windows ARM64 installer (Bobine-Setup-<version>-arm64.exe) in the download modal: it runs natively on Qualcomm's ARM64 architecture with no x86 emulation.",
        },
        {
          q: "Can I use a laptop to control the session while projecting the video?",
          a: "Yes. Plug the TV or projector into HDMI or USB-C DisplayPort, extend the desktop in your OS, place the /cinema window fullscreen on the projector and keep the /grid control view on the laptop screen.",
        },
        {
          q: "Where can I find the detailed hardware sheets to buy a PC or accessories?",
          a: "Visit the Hardware section (/en/hardware/amazon or /en/hardware/aliexpress), which organizes every mini-PC, Mac, laptop, tablet and cable by use case and budget.",
        },
      ],
      related: [
        { label: "Recommended Hardware Sheets (Amazon)", path: "/materiel/amazon" },
        { label: "Mini-PCs & ARM Boards (AliExpress)", path: "/materiel/aliexpress" },
        { label: "Bobine for Linux (Debian, Fedora, Arch)", path: "/linux" },
        { label: "Bobine on Google Book", path: "/google-book" },
        { label: "Documentation and browser support", path: "/documentation" },
      ],
    },
  },

  linux: {
    id: "linux",
    path: "/linux",
    fr: {
      title: "Bobine pour Linux : Debian, Ubuntu, Fedora et Arch Linux (paquets .deb, .rpm, pacman)",
      description:
        "Bobine sur Linux : paquet .deb pour Debian, Ubuntu et Mint, paquet .rpm et dépôt dnf pour Fedora et dérivés, paquet et dépôt pacman pour Arch Linux et dérivés, en x86-64 et ARM64. Commandes d'installation, mises à jour et clé de signature.",
      badge: "Linux Natif · Debian · Fedora · Arch · x86_64 & ARM64",
      h1: "Bobine pour Linux : Debian, Ubuntu, Fedora et Arch",
      lead:
        "Bobine s'installe sur Linux avec un paquet natif par famille de distribution : .deb pour Debian, Ubuntu et Mint, .rpm pour Fedora et dérivés, paquet pacman pour Arch Linux et dérivés, en x86-64 et ARM64. Chaque famille a son dépôt signé sur packages.bobine.fit : les mises à jour arrivent avec celles du système.",
      breadcrumb: "Linux",
      keywords: [
        "Bobine Linux",
        "Bobine Debian",
        "Bobine Ubuntu",
        "Bobine Fedora",
        "Bobine Arch Linux",
        "Bobine rpm",
        "Bobine pacman",
        "dépôt dnf Bobine",
        "dépôt APT Bobine",
        "paquet .deb Bobine",
      ],
      sections: [
        {
          heading: "Choisir sa famille de distribution",
          icon: "layers",
          bullets: [
            "Debian, Ubuntu, Linux Mint, Pop!_OS, Zorin OS : paquet .deb, dépôt APT packages.bobine.fit/debian, mises à jour avec apt upgrade.",
            "Fedora, Nobara, RHEL, AlmaLinux, Rocky Linux : paquet .rpm, dépôt dnf packages.bobine.fit/fedora, mises à jour avec dnf upgrade.",
            "Arch Linux, EndeavourOS, CachyOS, Manjaro : paquet pacman, dépôt packages.bobine.fit/arch, mises à jour avec pacman -Syu.",
            "Les trois dépôts publient les canaux Stable, Bêta et Canary, signés par la même clé GPG.",
          ],
        },
        {
          heading: "Debian, Ubuntu et Linux Mint",
          icon: "terminal",
          paragraphs: [
            "Le dépôt APT est en ligne : ajoutez la clé et la source, puis installez. Remplacez stable par beta ou canary pour suivre un autre canal.",
          ],
          code: aptInstallScript(),
        },
        {
          heading: "Fedora et dérivés",
          icon: "terminal",
          paragraphs: [
            `Ajoutez le dépôt dnf, puis installez. Sur dnf 4 (RHEL, AlmaLinux, Rocky Linux), la première commande devient ${fedoraCommands().addRepoLegacy}. bobine-beta.repo et bobine-canary.repo suivent la Bêta et la Canary.${soonSuffix("fr")}`,
            "Fedora ne fournit qu'un ffmpeg amputé de plusieurs codecs : pour lire tous les formats de cours, ajoutez RPM Fusion et installez le ffmpeg complet.",
          ],
          code: `${fedoraInstallScript()}\n\n# ffmpeg complet\n${fedoraCommands().ffmpeg}`,
        },
        {
          heading: "Arch Linux et dérivés",
          icon: "terminal",
          paragraphs: [
            `Importez et approuvez la clé, ajoutez la section [bobine] à /etc/pacman.conf, puis installez. Remplacez stable par beta ou canary dans la ligne Server pour suivre un autre canal. L'installation passe par -Syu : sur Arch, un paquet ne se met jamais à jour seul.${soonSuffix("fr")}`,
          ],
          code: archInstallScript(),
        },
        {
          heading: "Vérifier la clé de signature",
          icon: "shield",
          paragraphs: [
            `Empreinte de la clé principale : ${SIGNING_KEY_FINGERPRINT}. Lisez celle de la clé publiée avant de l'approuver : apt, dnf et pacman refusent ensuite tout paquet dont la signature ne correspond pas.`,
          ],
          code: keyCheckCommand("debian"),
        },
        {
          heading: "Dérivés et limites",
          icon: "cpu",
          bullets: [
            ...FAMILY_NOTES.fedora.derivatives.map((d) => d.fr),
            ...FAMILY_NOTES.arch.derivatives.map((d) => d.fr),
            ...FAMILY_NOTES.fedora.limits.map((d) => d.fr),
            NOT_VALIDATED_NOTE.fr,
          ],
        },
      ],
      faq: [
        {
          q: "Bobine existe-t-il en paquet pour Fedora ?",
          a: `Oui : un paquet .rpm (${packageFileName("fedora", "stable", "x86_64", "x.y.z")}) et un dépôt dnf signé, en x86_64 et aarch64.${soonSuffix("fr")}`,
        },
        {
          q: "Bobine existe-t-il en paquet pour Arch Linux ?",
          a: `Oui : un paquet pacman (${packageFileName("arch", "stable", "x86_64", "x.y.z")}) et un dépôt [bobine] signé, en x86_64 (aarch64 pour Arch Linux ARM).${soonSuffix("fr")}`,
        },
        {
          q: "Quelle distribution choisir pour une appliance dédiée 24/7 ?",
          a: "Debian 13 minimale reste la référence : c'est elle que cible le script install.sh. Les paquets .rpm et pacman sont destinés aux postes de bureau Linux.",
        },
        {
          q: "Bobine fonctionne-t-il sur Bazzite ou Fedora Silverblue ?",
          a: "Les distributions immuables ne conviennent pas à l'appliance kiosque, car le système y est en lecture seule.",
        },
      ],
      related: [
        { label: "Bobine pour Ordinateur (PC & Mac)", path: "/ordinateur" },
        { label: "Documentation d'installation", path: "/documentation" },
        { label: "Canaux de mise à jour", path: "/canaux" },
        { label: "Bobine sur Tor : dépôt APT anonyme", path: "/tor" },
        { label: "Sécurité et clé de signature", path: "/securite" },
      ],
    },
    en: {
      title: "Bobine for Linux: Debian, Ubuntu, Fedora and Arch Linux (.deb, .rpm and pacman packages)",
      description:
        "Bobine on Linux: .deb package for Debian, Ubuntu and Mint, .rpm package and dnf repository for Fedora and derivatives, pacman package and repository for Arch Linux and derivatives, on x86-64 and ARM64. Installation commands, updates and signing key.",
      badge: "Native Linux · Debian · Fedora · Arch · x86_64 & ARM64",
      h1: "Bobine for Linux: Debian, Ubuntu, Fedora and Arch",
      lead:
        "Bobine installs on Linux with one native package per distribution family: .deb for Debian, Ubuntu and Mint, .rpm for Fedora and derivatives, pacman package for Arch Linux and derivatives, on x86-64 and ARM64. Each family has its own signed repository on packages.bobine.fit: updates arrive with the system's.",
      breadcrumb: "Linux",
      keywords: [
        "Bobine Linux",
        "Bobine Debian",
        "Bobine Ubuntu",
        "Bobine Fedora",
        "Bobine Arch Linux",
        "Bobine rpm",
        "Bobine pacman",
        "Bobine dnf repository",
        "Bobine APT repository",
        "Bobine .deb package",
      ],
      sections: [
        {
          heading: "Choosing your distribution family",
          icon: "layers",
          bullets: [
            "Debian, Ubuntu, Linux Mint, Pop!_OS, Zorin OS: .deb package, APT repository packages.bobine.fit/debian, updates with apt upgrade.",
            "Fedora, Nobara, RHEL, AlmaLinux, Rocky Linux: .rpm package, dnf repository packages.bobine.fit/fedora, updates with dnf upgrade.",
            "Arch Linux, EndeavourOS, CachyOS, Manjaro: pacman package, packages.bobine.fit/arch repository, updates with pacman -Syu.",
            "All three repositories publish the Stable, Beta and Canary channels, signed by the same GPG key.",
          ],
        },
        {
          heading: "Debian, Ubuntu and Linux Mint",
          icon: "terminal",
          paragraphs: [
            "The APT repository is online: add the key and the source, then install. Replace stable with beta or canary to follow another channel.",
          ],
          code: aptInstallScript(),
        },
        {
          heading: "Fedora and derivatives",
          icon: "terminal",
          paragraphs: [
            `Add the dnf repository, then install. On dnf 4 (RHEL, AlmaLinux, Rocky Linux) the first command becomes ${fedoraCommands().addRepoLegacy}. bobine-beta.repo and bobine-canary.repo follow Beta and Canary.${soonSuffix("en")}`,
            "Fedora only ships a ffmpeg stripped of several codecs: to play every class format, add RPM Fusion and install the full ffmpeg.",
          ],
          code: `${fedoraInstallScript()}\n\n# full ffmpeg\n${fedoraCommands().ffmpeg}`,
        },
        {
          heading: "Arch Linux and derivatives",
          icon: "terminal",
          paragraphs: [
            `Import and trust the key, add the [bobine] section to /etc/pacman.conf, then install. Replace stable with beta or canary in the Server line to follow another channel. Installation uses -Syu: on Arch a package is never updated alone.${soonSuffix("en")}`,
          ],
          code: archInstallScript(),
        },
        {
          heading: "Verify the signing key",
          icon: "shield",
          paragraphs: [
            `Primary key fingerprint: ${SIGNING_KEY_FINGERPRINT}. Read the one of the published key before trusting it: apt, dnf and pacman then reject any package whose signature does not match.`,
          ],
          code: keyCheckCommand("debian"),
        },
        {
          heading: "Derivatives and limits",
          icon: "cpu",
          bullets: [
            ...FAMILY_NOTES.fedora.derivatives.map((d) => d.en),
            ...FAMILY_NOTES.arch.derivatives.map((d) => d.en),
            ...FAMILY_NOTES.fedora.limits.map((d) => d.en),
            NOT_VALIDATED_NOTE.en,
          ],
        },
      ],
      faq: [
        {
          q: "Is there a Bobine package for Fedora?",
          a: `Yes: an .rpm package (${packageFileName("fedora", "stable", "x86_64", "x.y.z")}) and a signed dnf repository, on x86_64 and aarch64.${soonSuffix("en")}`,
        },
        {
          q: "Is there a Bobine package for Arch Linux?",
          a: `Yes: a pacman package (${packageFileName("arch", "stable", "x86_64", "x.y.z")}) and a signed [bobine] repository, on x86_64 (aarch64 for Arch Linux ARM).${soonSuffix("en")}`,
        },
        {
          q: "Which distribution for a dedicated 24/7 appliance?",
          a: "Minimal Debian 13 remains the reference: it is what the install.sh script targets. The .rpm and pacman packages are meant for Linux desktops.",
        },
        {
          q: "Does Bobine run on Bazzite or Fedora Silverblue?",
          a: "Immutable distributions do not suit the kiosk appliance, because the system is read-only there.",
        },
      ],
      related: [
        { label: "Bobine for Computer (PC & Mac)", path: "/ordinateur" },
        { label: "Installation documentation", path: "/documentation" },
        { label: "Update channels", path: "/canaux" },
        { label: "Bobine over Tor: anonymous APT repository", path: "/tor" },
        { label: "Security and signing key", path: "/securite" },
      ],
    },
  },

  "android-tv": {
    id: "android-tv",
    path: "/android-tv",
    fr: {
      title: "Bobine pour Android TV et Google TV : installation et téléchargement de l'APK",
      description:
        `Bobine sur Android TV et Google TV : APK dédié pour box et clés HDMI sous Android ${ANDROID.minVersion} ou supérieur (Google TV Streamer 4K, Xiaomi TV Box S 2nd & 3rd Gen), ARM 32 et 64 bits, navigation D-Pad à la télécommande. Téléchargement et installation.`,
      badge: `Android TV & Google TV · Android ${ANDROID.minVersion}+ · ARM 32 & 64 bits`,
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
      chips: [
        { label: "Google TV Streamer (4K)", note: "MediaTek MT8696 · Android TV 14", icon: "os.android" },
        { label: "Xiaomi TV Box S (3rd Gen)", note: "Amlogic S905X4 / S905X5M · Google TV", icon: "os.android" },
        { label: "Amlogic S905X4 / S905Y4 & Realtek", note: "ABI universelle arm64-v8a & armeabi-v7a", icon: "os.android" },
        { label: "Téléviseurs Sony Bravia, TCL & Philips", note: "Google TV intégré (Android 13 / 14+)", icon: "os.android" },
      ],
      showcaseCards: [
        {
          title: "Google TV Streamer (4K)",
          subtitle: "Port Ethernet Gigabit intégré, 4 Go de RAM, 32 Go de stockage et Android TV 14 d'origine : la référence pour une salle connectée en USB-C.",
          image: "/images/hardware/editorial/tv.svg",
          href: "/materiel/amazon",
          cta: "Voir la fiche Google TV Streamer",
        },
        {
          title: "Xiaomi TV Box S (3rd Gen)",
          subtitle: "Format ultra-compact 4K avec port USB-A dédié pour brancher directement la clé USB contenant vos cours vidéo.",
          image: "/images/hardware/editorial/tv.svg",
          href: "/materiel/amazon",
          cta: "Voir la fiche Xiaomi TV Box S",
        },
        {
          title: "Clés USB & SSD externes exFAT / FAT32",
          subtitle: "Stockez des centaines de séances H.264/HEVC sur clé USB ou SSD externe sans saturer la mémoire interne de la box TV.",
          image: "/images/hardware/editorial/storage.svg",
          href: "/materiel/amazon",
          cta: "Voir les stockages recommandés",
        },
      ],
      hardwareCta: {
        title: "Choisir un boîtier Android TV pour votre salle",
        desc: "Retrouvez les boîtiers Google TV Streamer 4K, Xiaomi TV Box S, hubs USB-C et clés USB haute vitesse dont les prérequis sont à vérifier avant installation.",
        primaryLabel: "Boîtiers TV sur Amazon",
        primaryHref: "/materiel/amazon",
        secondaryLabel: "Comparatif PC & Mini-PC",
        secondaryHref: "/ordinateur",
      },
      sections: [
        {
          heading: "Ce que fait l'application Android TV",
          icon: "display",
          bullets: [
            "Paquet dédié Bobine-TV (identifiant com.bobine.app.tv), distinct de l'APK tablette.",
            "Intégration au lanceur Leanback avec une bannière 16:9 ; aucun écran tactile requis.",
            "Ouverture directe sur l'interface grand écran (/kiosk), pilotable au D-Pad : flèches, touche centrale et retour.",
            "Prévention de la mise en veille pendant la diffusion.",
            "Stockage externe : une clé USB ou un SSD en FAT32 ou exFAT est détecté pour loger les cours hors de la mémoire interne de la box.",
          ],
        },
        {
          heading: "Boîtiers 32 bits et 64 bits (Amlogic, MediaTek, Realtek)",
          icon: "cpu",
          paragraphs: [
            `Le paquet Android TV est universel : il s'installe sur les boîtiers dont le système est 64 bits (arm64-v8a) comme sur ceux dont le système s'exécute en mode 32 bits (ABI armeabi-v7a), ce qui est le cas de plusieurs boîtiers Xiaomi TV Box S malgré leur processeur 64 bits Amlogic. Android ${ANDROID.minVersion} (API ${ANDROID.minApi}) ou supérieur est requis : un Chromecast avec Google TV ou un NVIDIA Shield resté sous Android 11 ou 12 ne peut pas installer Bobine.`,
          ],
        },
        {
          heading: "Installer l'APK sur la TV",
          icon: "download",
          paragraphs: [
            "Téléchargez Bobine-TV-<version>.apk depuis l'encart de téléchargement ci-dessus, puis transférez-le sur la TV avec une clé USB et un gestionnaire de fichiers, sans fil avec Send Files to TV ou Downloader, ou par ADB sur le réseau local. Autorisez l'installation d'applications inconnues dans les paramètres de la TV.",
          ],
          code: "adb connect <ip_de_la_tv>:5555\nadb install Bobine-TV-<version>.apk",
        },
        {
          heading: "Piloter la TV depuis un autre appareil",
          icon: "network",
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
        { label: "Bobine pour Ordinateur (PC & Mac)", path: "/ordinateur" },
        { label: "Bobine sur Google Book & Tablettes", path: "/google-book" },
        { label: "Documentation d'installation", path: "/documentation" },
        { label: "Matériel recommandé", path: "/materiel/amazon" },
      ],
    },
    en: {
      title: "Bobine for Android TV and Google TV: APK installation and download",
      description:
        `Bobine on Android TV and Google TV: a dedicated APK for boxes and HDMI sticks running Android ${ANDROID.minVersion} or later (Google TV Streamer 4K, Xiaomi TV Box S 2nd & 3rd Gen), 32-bit and 64-bit ARM, remote-control navigation. Download and installation.`,
      badge: `Android TV & Google TV · Android ${ANDROID.minVersion}+ · 32 & 64-bit ARM`,
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
      chips: [
        { label: "Google TV Streamer (4K)", note: "MediaTek MT8696 · Android TV 14", icon: "os.android" },
        { label: "Xiaomi TV Box S (3rd Gen)", note: "Amlogic S905X4 / S905X5M · Google TV", icon: "os.android" },
        { label: "Amlogic S905X4 / S905Y4 & Realtek", note: "Universal arm64-v8a & armeabi-v7a ABI", icon: "os.android" },
        { label: "Sony Bravia, TCL & Philips TVs", note: "Built-in Google TV (Android 13 / 14+)", icon: "os.android" },
      ],
      showcaseCards: [
        {
          title: "Google TV Streamer (4K)",
          subtitle: "Built-in Gigabit Ethernet, 4 GB RAM, 32 GB storage and Android TV 14 out of the box: the benchmark for a USB-C studio setup.",
          image: "/images/hardware/editorial/tv.svg",
          href: "/materiel/amazon",
          cta: "View Google TV Streamer",
        },
        {
          title: "Xiaomi TV Box S (3rd Gen)",
          subtitle: "Ultra-compact 4K box with a dedicated USB-A port to plug in the USB flash drive holding your video classes.",
          image: "/images/hardware/editorial/tv.svg",
          href: "/materiel/amazon",
          cta: "View Xiaomi TV Box S",
        },
        {
          title: "exFAT / FAT32 USB Drives & External SSDs",
          subtitle: "Store hundreds of H.264/HEVC workouts on a USB stick or external SSD without filling up the TV box's internal storage.",
          image: "/images/hardware/editorial/storage.svg",
          href: "/materiel/amazon",
          cta: "View recommended storage",
        },
      ],
      hardwareCta: {
        title: "Choose an Android TV box for your studio",
        desc: "Browse Google TV Streamer 4K, Xiaomi TV Box S, USB-C hubs and high-speed flash drives with requirements to check before installation.",
        primaryLabel: "TV Boxes on Amazon",
        primaryHref: "/materiel/amazon",
        secondaryLabel: "PC & Mini-PC Overview",
        secondaryHref: "/ordinateur",
      },
      sections: [
        {
          heading: "What the Android TV app does",
          icon: "display",
          bullets: [
            "Dedicated Bobine-TV package (ID com.bobine.app.tv), separate from the tablet APK.",
            "Leanback launcher integration with a 16:9 banner; no touchscreen required.",
            "Opens straight on the big-screen interface (/kiosk), driven with the D-pad: arrows, center key and back.",
            "Screen-saver prevention while playing.",
            "External storage: a FAT32 or exFAT USB drive or SSD is detected to hold the classes outside the box's internal memory.",
          ],
        },
        {
          heading: "32-bit and 64-bit boxes (Amlogic, MediaTek, Realtek)",
          icon: "cpu",
          paragraphs: [
            `The Android TV package is universal: it installs on boxes with a 64-bit system (arm64-v8a) as well as on those running in 32-bit mode (armeabi-v7a ABI), as is the case for several Xiaomi TV Box S models despite their 64-bit Amlogic processor. Android ${ANDROID.minVersion} (API ${ANDROID.minApi}) or later is required: a Chromecast with Google TV or an NVIDIA Shield left on Android 11 or 12 cannot install Bobine.`,
          ],
        },
        {
          heading: "Installing the APK on the TV",
          icon: "download",
          paragraphs: [
            "Download Bobine-TV-<version>.apk from the download card above, then move it to the TV with a USB drive and a file manager, wirelessly with Send Files to TV or Downloader, or through ADB on the local network. Allow the installation of unknown apps in the TV settings.",
          ],
          code: "adb connect <tv_ip>:5555\nadb install Bobine-TV-<version>.apk",
        },
        {
          heading: "Control the TV from another device",
          icon: "network",
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
        { label: "Bobine for Computer (PC & Mac)", path: "/ordinateur" },
        { label: "Bobine on Google Book & Tablets", path: "/google-book" },
        { label: "Installation documentation", path: "/documentation" },
        { label: "Recommended hardware", path: "/materiel/amazon" },
      ],
    },
  },

  "google-book": {
    id: "google-book",
    path: "/google-book",
    fr: {
      title: "Bobine sur Google Book (Aluminium OS) et Tablettes Android : régie vidéo",
      description:
        "Bobine sur les ordinateurs portables Google Book (Aluminium OS) et tablettes Android (Snapdragon 8 Gen 2, 8 Gen 3, 8 Elite, MediaTek Dimensity, Google Tensor) : application ARM64 native, double affichage tactile et HDMI, MediaCodec.",
      badge: `Google Book · Aluminium OS · Tablettes Android ${ANDROID.minVersion}+`,
      h1: "Bobine sur Google Book (Aluminium OS) et Tablettes Pro",
      lead:
        "Un Google Book ou une tablette Android dotée d'une sortie vidéo USB-C peut devenir la régie autonome d'une salle de sport : Bobine s'exécute en local grâce à l'application Android native en ARM64, avec l'écran tactile en pupitre de commande et la sortie HDMI vers le téléviseur ou le vidéoprojecteur.",
      breadcrumb: "Google Book",
      keywords: [
        "Bobine Google Book",
        "Google Book salle de sport",
        "Aluminium OS fitness",
        "régie vidéo Google Book",
        "application salle de sport Google Book",
        "Bobine Snapdragon 8 Gen 2",
        "Bobine Snapdragon 8 Gen 3",
        "Bobine Galaxy Tab",
        "Bobine Xiaomi Pad",
      ],
      heroImage: {
        src: "/images/googlebooks.webp",
        alt: "Bobine exécuté sur un ordinateur portable Google Book avec sortie HDMI vers l'écran de la salle",
        width: 1200,
        height: 675,
      },
      chips: [
        { label: "Snapdragon 8 Gen 2 / 8 Gen 3 / 8 Elite", note: "Galaxy Tab S9/S10/S11, Xiaomi Pad 7 Pro, OnePlus Pad 2", icon: "chip.snapdragon" },
        { label: "Snapdragon X Elite / X Plus & 7s Gen 2", note: "Google Book ARM64 & tablettes grand public", icon: "chip.snapdragon" },
        { label: "MediaTek Kompanio & Dimensity 9300+ / 8300", note: "Google Book & Lenovo IdeaTab / Tab P12", icon: "os.android" },
        { label: "Google Tensor G2 / G3 / G4 & Exynos", note: "Pixel Tablet, Google Book & Galaxy Tab S FE", icon: "os.android" },
      ],
      showcaseCards: [
        {
          title: "Tablettes Flagship (Sortie TV USB-C HDMI)",
          subtitle: "Samsung Galaxy Tab S10 / S11 Ultra (Snapdragon / Dimensity) avec DisplayPort Alt-Mode pour séparer l'écran coach et le projecteur.",
          image: "/images/hardware/editorial/tablet.svg",
          href: "/materiel/amazon",
          cta: "Voir les tablettes Pro",
        },
        {
          title: "Xiaomi Pad 7 & Tablettes Snapdragon",
          subtitle: "Écran 144 Hz haute luminosité, puce Qualcomm Snapdragon et autonomie longue durée pour le pupitre de salle.",
          image: "/images/hardware/editorial/tablet.svg",
          href: "/materiel/amazon",
          cta: "Voir la Xiaomi Pad 7",
        },
        {
          title: "Supports muraux & Pupitres sur pied",
          subtitle: "Supports antivol articulés et hubs USB-C Ethernet + HDMI + Power Delivery 100 W pour une installation fixe.",
          image: "/images/hardware/editorial/mount.svg",
          href: "/materiel/amazon",
          cta: "Voir les supports et hubs",
        },
      ],
      hardwareCta: {
        title: "Choisir votre Google Book, tablette ou PC de régie",
        desc: "Comparez les tablettes compatibles sortie HDMI (DisplayPort Alt-Mode) et les ordinateurs PC/Mac dans notre guide matériel.",
        primaryLabel: "Tablettes & Hubs sur Amazon",
        primaryHref: "/materiel/amazon",
        secondaryLabel: "Page Ordinateur (PC & Mac)",
        secondaryHref: "/ordinateur",
      },
      sections: [
        {
          heading: "Comment fonctionne le double affichage (Tactile + HDMI)",
          icon: "display",
          bullets: [
            `L'APK Bobine (Android ${ANDROID.minVersion} à ${ANDROID.maxVersion}, ARM64) embarque le serveur FastAPI/SQLite et l'interface : aucun cloud ni abonnement requis.`,
            "Double affichage indépendant : l'écran tactile du Google Book ou de la tablette sert de pupitre (/grid) pendant que la sortie USB-C / HDMI diffuse le cours en plein écran (/cinema) sur le téléviseur ou le vidéoprojecteur.",
            "Décodage matériel H.264/HEVC via MediaCodec et service de premier plan persistant.",
            "Disponibilité sur le Google Play Store annoncée prochainement ; en attendant, l'APK signé se télécharge directement depuis cette page.",
          ],
        },
        {
          heading: "Puces et appareils compatibles (ARM64)",
          icon: "cpu",
          bullets: [
            "Qualcomm Snapdragon grand public et pro : Snapdragon 8 Gen 2, Snapdragon 8 Gen 3, Snapdragon 8 Elite, Snapdragon 8s Gen 3, Snapdragon 7+ Gen 3, Snapdragon 7s Gen 2, Snapdragon 6 Gen 1 et Snapdragon X Elite / X Plus.",
            "MediaTek & Google : MediaTek Dimensity 9300+, 9200, 8300-Ultra, Kompanio 1380/838, Helio G99 et Google Tensor G2 / G3 / G4.",
            "Samsung Exynos : Exynos 1580, 1480 et 1380 (séries Galaxy Tab S9 FE / S10 FE et Galaxy Tab A9+).",
            "Pour la sortie HDMI directe par câble USB-C, vérifiez que l'appareil prend en charge USB-C 3.1+ DisplayPort Alt-Mode ; sinon, associez la tablette à une box Android TV ou un mini-PC sur le Wi-Fi local.",
          ],
        },
        {
          heading: "Installer sur Google Book ou Tablette Android",
          icon: "download",
          paragraphs: [
            "Téléchargez Bobine-<version>.apk depuis l'encart de téléchargement ci-dessus et ouvrez-le depuis le gestionnaire de fichiers. Sur les Google Book disposant de l'environnement Linux (Debian aarch64 ou x86_64), le paquet natif .deb via packages.bobine.fit/debian reste également disponible.",
          ],
        },
        {
          heading: "Piloter depuis un autre appareil ou navigateur",
          icon: "network",
          paragraphs: [
            "Depuis un téléphone, une tablette ou un ordinateur du même réseau Wi-Fi ou Ethernet, ouvrez http://bobine.local:8000 dans Chrome, Brave, Firefox, Edge ou Safari pour accéder à la télécommande et au panneau d'administration de la salle.",
          ],
        },
      ],
      faq: [
        {
          q: "Bobine fonctionne-t-il sur un Google Book ?",
          a: "Oui, via l'application Android native (APK) en ARM64 avec accélération matérielle MediaCodec, ou via le paquet .deb Linux sur le sous-système Debian.",
        },
        {
          q: "Quelles puces mobiles sont recommandées pour le décodage vidéo 1080p/4K et le double écran ?",
          a: "Les SoC Qualcomm Snapdragon 8 Gen 2, Snapdragon 8 Gen 3, Snapdragon 8 Elite, Snapdragon X Plus/Elite, MediaTek Dimensity 8300/9300+ et Google Tensor G3/G4 offrent un décodage matériel MediaCodec instantané et gèrent la sortie secondaire DisplayPort Alt-Mode sans chauffe.",
        },
        {
          q: "Peut-on brancher un téléviseur ou un vidéoprojecteur ?",
          a: "Oui : la sortie HDMI ou USB-C DisplayPort diffuse le cours en plein écran (/cinema) pendant que l'écran du portable ou de la tablette sert de pupitre de commande (/grid).",
        },
      ],
      related: [
        { label: "Bobine pour Ordinateur (PC & Mac)", path: "/ordinateur" },
        { label: "Bobine sur Android TV", path: "/android-tv" },
        { label: "Bobine pour Linux", path: "/linux" },
        { label: "Matériel recommandé (Tablettes & Hubs)", path: "/materiel/amazon" },
      ],
    },
    en: {
      title: "Bobine on Google Book (Aluminium OS) and Android Tablets: gym video playout",
      description:
        "Bobine on Google Book laptops (Aluminium OS) and Android tablets (Snapdragon 8 Gen 2, 8 Gen 3, 8 Elite, MediaTek Dimensity, Google Tensor): native ARM64 app, independent touch and HDMI dual display, MediaCodec.",
      badge: `Google Book · Aluminium OS · Android ${ANDROID.minVersion}+ Tablets`,
      h1: "Bobine on Google Book (Aluminium OS) and Pro Tablets",
      lead:
        "A Google Book or an Android tablet with USB-C video output can act as a self-contained gym video playout system: Bobine runs locally through the native ARM64 Android app, using the touchscreen as the control desk and the HDMI output for the TV or projector.",
      breadcrumb: "Google Book",
      keywords: [
        "Bobine Google Book",
        "Google Book gym",
        "Aluminium OS fitness",
        "Google Book video playout",
        "Google Book gym app",
        "Bobine Snapdragon 8 Gen 2",
        "Bobine Snapdragon 8 Gen 3",
        "Bobine Galaxy Tab",
        "Bobine Xiaomi Pad",
      ],
      heroImage: {
        src: "/images/googlebooks.webp",
        alt: "Bobine running on a Google Book laptop with HDMI output to the studio screen",
        width: 1200,
        height: 675,
      },
      chips: [
        { label: "Snapdragon 8 Gen 2 / 8 Gen 3 / 8 Elite", note: "Galaxy Tab S9/S10/S11, Xiaomi Pad 7 Pro, OnePlus Pad 2", icon: "chip.snapdragon" },
        { label: "Snapdragon X Elite / X Plus & 7s Gen 2", note: "ARM64 Google Book & mainstream tablets", icon: "chip.snapdragon" },
        { label: "MediaTek Kompanio & Dimensity 9300+ / 8300", note: "Google Book & Lenovo IdeaTab / Tab P12", icon: "os.android" },
        { label: "Google Tensor G2 / G3 / G4 & Exynos", note: "Pixel Tablet, Google Book & Galaxy Tab S FE", icon: "os.android" },
      ],
      showcaseCards: [
        {
          title: "Flagship Tablets (USB-C HDMI TV Out)",
          subtitle: "Samsung Galaxy Tab S10 / S11 Ultra (Snapdragon / Dimensity) with DisplayPort Alt-Mode to split the coach screen and projector.",
          image: "/images/hardware/editorial/tablet.svg",
          href: "/materiel/amazon",
          cta: "View Pro tablets",
        },
        {
          title: "Xiaomi Pad 7 & Snapdragon Tablets",
          subtitle: "High-brightness 144 Hz display, Qualcomm Snapdragon chip and all-day battery life for the studio control desk.",
          image: "/images/hardware/editorial/tablet.svg",
          href: "/materiel/amazon",
          cta: "View Xiaomi Pad 7",
        },
        {
          title: "Wall Mounts & Floor Stands",
          subtitle: "Articulated security mounts and USB-C Ethernet + HDMI + 100W Power Delivery hubs for permanent studio setups.",
          image: "/images/hardware/editorial/mount.svg",
          href: "/materiel/amazon",
          cta: "View mounts and hubs",
        },
      ],
      hardwareCta: {
        title: "Choose your Google Book, tablet or playout PC",
        desc: "Compare HDMI-capable tablets (DisplayPort Alt-Mode) and PC/Mac computers in our hardware directory.",
        primaryLabel: "Tablets & Hubs on Amazon",
        primaryHref: "/materiel/amazon",
        secondaryLabel: "Computer Page (PC & Mac)",
        secondaryHref: "/ordinateur",
      },
      sections: [
        {
          heading: "How dual display works (Touch + HDMI)",
          icon: "display",
          bullets: [
            `The Bobine APK (Android ${ANDROID.minVersion} to ${ANDROID.maxVersion}, ARM64) embeds the FastAPI/SQLite server and the interface: no cloud or subscription required.`,
            "Independent dual display: the Google Book or tablet touchscreen serves as the control desk (/grid) while the USB-C / HDMI output plays the class fullscreen (/cinema) on the TV or projector.",
            "Hardware H.264/HEVC decoding through MediaCodec and a persistent foreground service.",
            "Google Play Store availability is announced as upcoming; meanwhile the signed APK can be downloaded directly from this page.",
          ],
        },
        {
          heading: "Supported processors and SoCs (ARM64)",
          icon: "cpu",
          bullets: [
            "Consumer and pro Qualcomm Snapdragon: Snapdragon 8 Gen 2, Snapdragon 8 Gen 3, Snapdragon 8 Elite, Snapdragon 8s Gen 3, Snapdragon 7+ Gen 3, Snapdragon 7s Gen 2, Snapdragon 6 Gen 1 and Snapdragon X Elite / X Plus.",
            "MediaTek & Google: MediaTek Dimensity 9300+, 9200, 8300-Ultra, Kompanio 1380/838, Helio G99 and Google Tensor G2 / G3 / G4.",
            "Samsung Exynos: Exynos 1580, 1480 and 1380 (Galaxy Tab S9 FE / S10 FE and Galaxy Tab A9+ series).",
            "For wired USB-C to HDMI video output, check that your device supports USB-C 3.1+ DisplayPort Alt-Mode; otherwise, pair the tablet over local Wi-Fi with an Android TV box or mini-PC.",
          ],
        },
        {
          heading: "Installing on Google Book or Android Tablet",
          icon: "download",
          paragraphs: [
            "Download Bobine-<version>.apk from the download card above and open it from the file manager. On Google Books featuring the Linux environment (Debian aarch64 or x86_64), the native .deb package from packages.bobine.fit/debian is also available.",
          ],
        },
        {
          heading: "Control it from another device or browser",
          icon: "network",
          paragraphs: [
            "From a phone, tablet or computer on the same Wi-Fi or Ethernet network, open http://bobine.local:8000 in Chrome, Brave, Firefox, Edge or Safari to reach the room's remote control and admin panel.",
          ],
        },
      ],
      faq: [
        {
          q: "Does Bobine work on a Google Book?",
          a: "Yes, through the native Android app (APK) in ARM64 with MediaCodec hardware acceleration, or via the Linux .deb package on the Debian subsystem.",
        },
        {
          q: "Which mobile chips are recommended for 1080p/4K video decoding and dual display?",
          a: "Qualcomm Snapdragon 8 Gen 2, Snapdragon 8 Gen 3, Snapdragon 8 Elite, Snapdragon X Plus/Elite, MediaTek Dimensity 8300/9300+ and Google Tensor G3/G4 deliver instant MediaCodec hardware decoding and drive secondary DisplayPort Alt-Mode outputs effortlessly.",
        },
        {
          q: "Can I plug in a TV or a projector?",
          a: "Yes: the HDMI or USB-C DisplayPort output plays the class fullscreen (/cinema) while the laptop or tablet screen serves as the control desk (/grid).",
        },
      ],
      related: [
        { label: "Bobine for Computer (PC & Mac)", path: "/ordinateur" },
        { label: "Bobine on Android TV", path: "/android-tv" },
        { label: "Bobine for Linux", path: "/linux" },
        { label: "Recommended hardware (Tablets & Hubs)", path: "/materiel/amazon" },
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
      badge: "Réseau Tor · Services Onion v3 · Dépôt APT signé",
      h1: "Bobine sur Tor : miroir .onion et dépôt APT",
      lead:
        "Pour installer et mettre à jour Bobine sans révéler votre adresse IP, le site et le dépôt APT officiel sont aussi proposés en services onion. C'est un miroir du site et du dépôt officiels : les paquets restent signés par la même clé.",
      breadcrumb: "Tor",
      keywords: ["Bobine Tor", "Bobine onion", "Bobine .onion", "dépôt APT Tor", "apt-transport-tor Bobine", "Bobine anonyme"],
      heroImage: {
        src: "/images/baamix-tor.webp",
        alt: "Architecture du miroir Tor et du dépôt APT .onion de Bobine",
        width: 1200,
        height: 675,
      },
      sections: [
        {
          heading: "Les adresses onion",
          icon: "network",
          bullets: [
            `Site : http://${ONION_SITE_HOST}/`,
            `Dépôt APT : tor+http://${ONION_APT_HOST}/`,
            "La boutique matériel et l'assistant Baamix ne sont pas proposés sur le miroir : ils reposent sur des liens d'affiliation et des services tiers.",
            "Le miroir est hébergé par le mainteneur, sans journal de visite, avec une disponibilité au mieux.",
          ],
        },
        {
          heading: "Installer Bobine par Tor sur Debian, Ubuntu ou Mint",
          icon: "terminal",
          paragraphs: [
            "Le script install-tor.sh fait les cinq étapes et s'arrête si l'empreinte de la clé diffère de celle publiée ; l'option --dry-run n'installe rien. Le canal de mise à jour (Stable, Bêta ou Canary) se choisit avec --channel=stable, --channel=beta ou --channel=canary ; sans l'option, le script pose la question sur un terminal et prend Stable sinon. À lire avant de l'exécuter :",
          ],
          code: "curl -fsSL https://bobine.fit/install-tor.sh | bash",
        },
        {
          heading: "Ou à la main",
          icon: "terminal",
          paragraphs: ["Les mêmes étapes, une par une. Le dernier mot de la ligne deb est la suite APT, donc le canal : stable, beta ou canary, les trois étant publiées par le dépôt onion :"],
          code: TOR_COMMANDS,
        },
        {
          heading: "Vérifier la clé",
          icon: "shield",
          paragraphs: [
            "Comparez l'empreinte de la clé principale avec celle de https://packages.bobine.fit/bobine.gpg : B77D 96D7 2F84 F36A CAA3 F872 9CBF 497D 829E E15A. apt refuse tout paquet dont la signature ne correspond pas.",
            `Bobine n'est pas affilié au Tor Project. Pour soutenir le réseau Tor : ${TOR_PROJECT_URL} (code source : ${TOR_SOURCE_URL}).`,
          ],
        },
      ],
      faq: [
        {
          q: "Peut-on installer Bobine via Tor ?",
          a: "Oui, sur Debian, Ubuntu et Linux Mint (APT), sur Fedora et dérivés (DNF) et sur Arch Linux et dérivés (Pacman) : les trois dépôts officiels sont aussi servis en .onion, avec les mêmes paquets signés par la même clé.",
        },
        {
          q: "Peut-on suivre la Bêta ou la Canary par Tor ?",
          a: "Oui : les dépôts en .onion publient les trois canaux, stable, beta et canary. install-tor.sh --channel=beta (ou canary) configure la source correspondante pour APT, DNF ou Pacman.",
        },
        {
          q: "Et sur Fedora ou Arch Linux ?",
          a: "Les dépôts Fedora (DNF) et Arch Linux (Pacman) sont servis en .onion comme le dépôt APT, avec la même clé de signature ; install-tor.sh détecte la famille et configure le gestionnaire de paquets. Leur installation par Tor a été essayée dans des conteneurs Debian, Fedora et Arch, pas encore sur des machines réelles. Les mêmes dépôts restent servis en HTTPS sur packages.bobine.fit.",
        },
        {
          q: "Le miroir Tor est-il complet ?",
          a: "Il reprend le site statique (documentation, comparatifs, blog) ; la boutique matériel et l'assistant Baamix en sont exclus.",
        },
      ],
      related: [
        { label: "Bobine pour Linux (Debian, Fedora, Arch)", path: "/linux" },
        { label: "Documentation d'installation", path: "/documentation" },
        { label: "Sécurité", path: "/securite" },
        { label: "Canaux de mise à jour", path: "/canaux" },
      ],
    },
    en: {
      title: "Bobine on Tor: .onion site mirror and anonymous APT repository",
      description:
        "Bobine on the Tor network: a site mirror as an onion service and the official APT repository reachable over .onion, with packages signed by the same key. Installation commands and key fingerprint.",
      badge: "Tor Network · Onion v3 Services · Signed APT Repo",
      h1: "Bobine on Tor: .onion mirror and APT repository",
      lead:
        "To install and update Bobine without revealing your IP address, the site and the official APT repository are also offered as onion services. It is a mirror of the official site and repository: packages remain signed by the same key.",
      breadcrumb: "Tor",
      keywords: ["Bobine Tor", "Bobine onion", "Bobine .onion", "APT repository over Tor", "apt-transport-tor Bobine", "Bobine anonymous install"],
      heroImage: {
        src: "/images/baamix-tor.webp",
        alt: "Bobine Tor mirror and .onion APT repository architecture",
        width: 1200,
        height: 675,
      },
      sections: [
        {
          heading: "The onion addresses",
          icon: "network",
          bullets: [
            `Site: http://${ONION_SITE_HOST}/`,
            `APT repository: tor+http://${ONION_APT_HOST}/`,
            "The hardware store and the Baamix assistant are not offered on the mirror: they rely on affiliate links and third-party services.",
            "The mirror is hosted by the maintainer, keeps no visit log, and runs on a best-effort basis.",
          ],
        },
        {
          heading: "Installing Bobine over Tor on Debian, Ubuntu or Mint",
          icon: "terminal",
          paragraphs: [
            "The install-tor.sh script performs the five steps and stops if the key fingerprint differs from the published one; the --dry-run option installs nothing. The update channel (Stable, Beta or Canary) is chosen with --channel=stable, --channel=beta or --channel=canary; without the option, the script asks on a terminal and falls back to Stable otherwise. Read it before running it:",
          ],
          code: "curl -fsSL https://bobine.fit/install-tor.sh | bash",
        },
        {
          heading: "Or by hand",
          icon: "terminal",
          paragraphs: ["The same steps, one at a time. The last word of the deb line is the APT suite, hence the channel: stable, beta or canary, all three being published by the onion repository:"],
          code: TOR_COMMANDS,
        },
        {
          heading: "Checking the key",
          icon: "shield",
          paragraphs: [
            "Compare the primary key fingerprint with the one at https://packages.bobine.fit/bobine.gpg: B77D 96D7 2F84 F36A CAA3 F872 9CBF 497D 829E E15A. apt rejects any package whose signature does not match.",
            `Bobine is not affiliated with the Tor Project. To support the Tor network: ${TOR_PROJECT_URL} (source code: ${TOR_SOURCE_URL}).`,
          ],
        },
      ],
      faq: [
        {
          q: "Can Bobine be installed over Tor?",
          a: "Yes, on Debian, Ubuntu and Linux Mint (APT), on Fedora and derivatives (DNF) and on Arch Linux and derivatives (Pacman): the three official repositories are also served over .onion, with the same packages signed by the same key.",
        },
        {
          q: "Can the Beta or Canary channel be followed over Tor?",
          a: "Yes: the .onion repositories publish all three channels, stable, beta and canary. install-tor.sh --channel=beta (or canary) sets up the matching source for APT, DNF or Pacman.",
        },
        {
          q: "What about Fedora or Arch Linux?",
          a: "The Fedora (DNF) and Arch Linux (Pacman) repositories are served over .onion like the APT repository, with the same signing key; install-tor.sh detects the family and configures the package manager. Installing over Tor was tried in Debian, Fedora and Arch containers, not yet on real machines. The same repositories are still served over HTTPS on packages.bobine.fit.",
        },
        {
          q: "Is the Tor mirror complete?",
          a: "It carries the static site (documentation, comparisons, blog); the hardware store and the Baamix assistant are left out.",
        },
      ],
      related: [
        { label: "Bobine for Linux (Debian, Fedora, Arch)", path: "/linux" },
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
        "Les nouveautés de Bobine : dernière version stable V5.0.5 Résonance, Bêta et Canary en cours, et l'historique daté des versions publiées sur GitHub Releases, avec les changements principaux.",
      badge: "Journal des versions · V5.0.5 « Résonance »",
      h1: "Nouveautés de Bobine",
      lead:
        "Cette page résume l'état du projet : la version stable en cours, l'état des canaux Bêta et Canary, et les dernières versions publiées. Les dates et les numéros sont lus directement depuis GitHub Releases.",
      breadcrumb: "Nouveautés",
      keywords: ["Bobine nouveautés", "Bobine changelog", "Bobine dernière version", "Bobine release notes", "Bobine 5", "Bobine 5.0.5"],
      sections: [
        {
          heading: "Plateformes prises en charge",
          icon: "cpu",
          bullets: [
            "Windows 11 et 10 : x86-64 (Intel Core / N100, AMD Ryzen) et ARM64 (Qualcomm Snapdragon X Elite / X Plus).",
            "macOS 12+ : Apple Silicon (M1, M2, M3, M4).",
            `${linuxFormatsSummary("fr")}, dépôts officiels unifiés et signés sur packages.bobine.fit ; appliance dédiée Debian 13.`,
            `Android ${ANDROID.minVersion} à ${ANDROID.maxVersion} : tablettes et Google Book (APK ARM64), Android TV et Google TV (APK dédié, ARM 32 et 64 bits).`,
          ],
        },
        {
          heading: "Principaux ajouts de la série 5 (V5.0.5 « Résonance »)",
          icon: "spark",
          bullets: [
            "Unification des dépôts Linux signés (.deb, .rpm, .pkg.tar.zst) sur packages.bobine.fit et mise à jour multi-distribution depuis l'application.",
            "Trois canaux de mise à jour : Stable, Bêta et Canary, avec bascule sans perte de données.",
            "Prise en charge native d'ARM64 : PC Snapdragon sous Windows et Linux, stations Linux ARM64, Raspberry Pi 5, Google Book et tablettes Snapdragon 8 Gen 2 / Gen 3 / 8 Elite.",
            "Identité visuelle Apple Liquid Glass (verre lavande et orchidée) et 16 thèmes adaptatifs.",
            "Gestionnaire de périphériques audio/HDMI (/devices) et assistant de formatage de stockage externe (/storage).",
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
        { label: "Bobine pour Ordinateur (PC & Mac)", path: "/ordinateur" },
        { label: "Blog et versions", path: "/blog" },
        { label: "Documentation", path: "/documentation" },
      ],
    },
    en: {
      title: "What's new in Bobine: latest versions and changes",
      description:
        "What's new in Bobine: the current V5.0.5 Résonance stable version, the running Beta and Canary, and the dated history of releases published on GitHub Releases, with the main changes.",
      badge: "Release History · V5.0.5 “Résonance”",
      h1: "What's new in Bobine",
      lead:
        "This page sums up the state of the project: the current stable version, the state of the Beta and Canary channels, and the latest releases. Dates and numbers are read straight from GitHub Releases.",
      breadcrumb: "What's new",
      keywords: ["Bobine what's new", "Bobine changelog", "Bobine latest version", "Bobine release notes", "Bobine 5", "Bobine 5.0.5"],
      sections: [
        {
          heading: "Supported platforms",
          icon: "cpu",
          bullets: [
            "Windows 11 and 10: x86-64 (Intel Core / N100, AMD Ryzen) and ARM64 (Qualcomm Snapdragon X Elite / X Plus).",
            "macOS 12+: Apple Silicon (M1, M2, M3, M4).",
            `${linuxFormatsSummary("en")}, unified official signed repositories on packages.bobine.fit; dedicated Debian 13 appliance.`,
            `Android ${ANDROID.minVersion} to ${ANDROID.maxVersion}: tablets and Google Book (ARM64 APK), Android TV and Google TV (dedicated APK, 32-bit and 64-bit ARM).`,
          ],
        },
        {
          heading: "Main additions of series 5 (V5.0.5 “Résonance”)",
          icon: "spark",
          bullets: [
            "Unified signed Linux repositories (.deb, .rpm, .pkg.tar.zst) on packages.bobine.fit and in-app multi-distro updater.",
            "Three update channels: Stable, Beta and Canary, with lossless channel switching.",
            "Native ARM64 support: Snapdragon PCs on Windows and Linux, ARM64 Linux workstations, Raspberry Pi 5, Google Book and Snapdragon 8 Gen 2 / Gen 3 / 8 Elite tablets.",
            "Apple Liquid Glass visual identity (lavender and orchid glass) and 16 adaptive themes.",
            "Audio/HDMI device manager (/devices) and external storage formatting wizard (/storage).",
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
        { label: "Bobine for Computer (PC & Mac)", path: "/ordinateur" },
        { label: "Blog and versions", path: "/blog" },
        { label: "Documentation", path: "/documentation" },
      ],
    },
  },
};

export function getLanding(id: LandingId, locale: Locale): LandingLocale {
  return LANDING_PAGES[id][locale];
}
