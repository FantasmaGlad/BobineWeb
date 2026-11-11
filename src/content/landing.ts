import type { AssetKey } from "@/lib/assets";
import type { Locale } from "@/lib/i18n";
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
  packageFileName,
  repoStatusNote,
  slidingChannelPackageNames,
} from "@/lib/linuxPackages";

/**
 * Pages d'atterrissage thématiques (canaux de mise à jour, Linux) :
 * une page par intention de recherche, rendues par `LandingPage`. Le texte reste
 * factuel et court, sans version ni date en dur : celles-ci viennent de GitHub à l'affichage.
 */

export type LandingId =
  | "canaux"
  | "canal-stable"
  | "canal-beta"
  | "canal-canary"
  | "linux";

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
  { label: "Notes de version (Blog)", path: "/blog" },
];
const CHANNEL_RELATED_EN: LandingLink[] = [
  { label: "All update channels", path: "/canaux" },
  { label: "Installation guide", path: "/documentation" },
  { label: "Bobine for Linux (Debian, Fedora, Arch)", path: "/linux" },
  { label: "Release notes (Blog)", path: "/blog" },
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
        { label: "Notes de version (Blog)", path: "/blog" },
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
        { label: "Release notes (Blog)", path: "/blog" },
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
            `Les mêmes fichiers sur toutes les plateformes : Windows (x86-64 et ARM64), macOS Apple Silicon, ${linuxFormatsShort("fr")}, Android, Android TV, et Bobine Deploy pour l'installation à distance.`,
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
            `The same files on every platform: Windows (x86-64 and ARM64), macOS Apple Silicon, ${linuxFormatsShort("en")}, Android, Android TV, and Bobine Deploy for remote installation.`,
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
            "Dans Réglages, Mises à jour logicielles, choisissez le canal Canary. Sur l'appliance Linux :",
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
            "In Settings, Software updates, choose the Canary channel. On the Linux appliance:",
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
            "Fedora, Nobara, RHEL 10+, AlmaLinux 10+, Rocky Linux 10+ : paquet .rpm, dépôt dnf packages.bobine.fit/fedora, mises à jour avec dnf upgrade.",
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
        { label: "Documentation d'installation", path: "/documentation" },
        { label: "Canaux de mise à jour", path: "/canaux" },
        { label: "Sécurité et clé de signature", path: "https://security.bobine.fit/fr/" },
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
            "Fedora, Nobara, RHEL 10+, AlmaLinux 10+, Rocky Linux 10+: .rpm package, dnf repository packages.bobine.fit/fedora, updates with dnf upgrade.",
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
        { label: "Installation documentation", path: "/documentation" },
        { label: "Update channels", path: "/canaux" },
        { label: "Security and signing key", path: "https://security.bobine.fit/" },
      ],
    },
  },
};

export function getLanding(id: LandingId, locale: Locale): LandingLocale {
  return LANDING_PAGES[id][locale];
}
