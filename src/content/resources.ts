import type { Locale } from "@/lib/i18n";

type Localized = Record<Locale, string>;

export interface ResourceItem {
  id: string;
  title: Localized;
  description: Localized;
  path: string;
  category: Localized;
  icon: string;
  tags: readonly string[];
}

const text = (fr: string, en: string): Localized => ({ fr, en });

export const resourceList: readonly ResourceItem[] = [
  {
    id: "channel-beta",
    title: text("Bêta (Canal de préversion)", "Beta (Prerelease channel)"),
    description: text("Testez les nouvelles fonctionnalités avant leur publication générale tout en conservant une bonne stabilité.", "Test new features before general release while maintaining strong operational stability."),
    path: "/canaux/beta",
    category: text("Mises à jour", "Updates"),
    icon: "icon:refresh",
    tags: ["beta", "canaux", "preversion", "test", "mises a jour"],
  },
  {
    id: "blog",
    title: text("Blog & Notes de version", "Blog & Release notes"),
    description: text("Consultez l'historique complet des versions, les nouveautés marquantes et les annonces de publication.", "Browse full release history, key changelogs, and official software release announcements."),
    path: "/blog",
    category: text("Actualités", "News"),
    icon: "icon:zap",
    tags: ["blog", "notes", "changelog", "versions", "mises a jour", "actualites"],
  },
  {
    id: "channels",
    title: text("Canaux de mise à jour", "Update channels"),
    description: text("Présentation des 3 canaux de distribution : Stable pour la production, Bêta pour anticiper, Canary pour l'avant-garde.", "Overview of the 3 release channels: Stable for production, Beta to anticipate, Canary for bleeding-edge."),
    path: "/canaux",
    category: text("Mises à jour", "Updates"),
    icon: "icon:layers",
    tags: ["canaux", "stable", "beta", "canary", "distribution", "channels"],
  },
  {
    id: "channel-canary",
    title: text("Canary (Canal expérimental)", "Canary (Experimental channel)"),
    description: text("Dernières compilations de développement au fil de l'eau pour tester les prototypes et les correctifs immédiats.", "Nightly automated development builds to preview prototypes and test early fixes."),
    path: "/canaux/canary",
    category: text("Mises à jour", "Updates"),
    icon: "icon:terminal",
    tags: ["canary", "experimental", "nightly", "developpement", "canaux"],
  },
  {
    id: "privacy",
    title: text("Confidentialité des données", "Privacy policy"),
    description: text("Politique de respect de la vie privée : fonctionnement 100% local, aucun pistage ni collecte de télémétrie.", "Privacy policy: 100% local execution, zero trackers, and zero telemetry collection."),
    path: "/confidentialite",
    category: text("Légal", "Legal"),
    icon: "icon:shield",
    tags: ["confidentialite", "donnees", "vie privee", "rgpd", "local", "privacy"],
  },
  {
    id: "docs-dev",
    title: text("Documentation Développeurs", "Developer documentation"),
    description: text("Architecture technique, compilation locale, API internes, protocoles réseau et contribution au code source.", "Technical architecture, local build instructions, internal APIs, network protocols, and code contributions."),
    path: "/documentation/developpeurs",
    category: text("Documentation", "Documentation"),
    icon: "icon:terminal",
    tags: ["documentation", "developpeurs", "dev", "code", "architecture", "api", "git"],
  },
  {
    id: "docs",
    title: text("Documentation Générale", "Main documentation"),
    description: text("Portail central de la documentation Bobine : installation, configuration, guides et bonnes pratiques.", "Central Bobine documentation hub: installation, setup, guides, and deployment best practices."),
    path: "/documentation",
    category: text("Documentation", "Documentation"),
    icon: "icon:display",
    tags: ["documentation", "guide", "manuel", "aide", "installation", "config"],
  },
  {
    id: "features",
    title: text("Fonctionnalités & Capacités", "Features & Capabilities"),
    description: text("Panorama complet des fonctionnalités de la régie : double canal, kiosque tactile, radio d'ambiance et stockage local.", "Complete overview of playout features: dual-channel output, touchscreen kiosk, background radio, and local media."),
    path: "/fonctionnalites",
    category: text("Produit", "Product"),
    icon: "icon:video",
    tags: ["fonctionnalites", "capacites", "double ecran", "kiosque", "radio", "regie", "video"],
  },
  {
    id: "docs-usage",
    title: text("Guide d'utilisation de la régie", "Playout user guide"),
    description: text("Manuel pas-à-pas pour exploiter la régie : import de vidéos, planification des grilles, pilotage coach et kiosque.", "Step-by-step user manual: importing videos, scheduling timetables, coach remote control, and kiosk mode."),
    path: "/documentation/utilisation",
    category: text("Documentation", "Documentation"),
    icon: "icon:display",
    tags: ["guide", "utilisation", "manuel", "cours", "planning", "coach", "kiosque"],
  },
  {
    id: "linux",
    title: text("Linux & Déploiement pro", "Linux & Pro deployment"),
    description: text("Guide d'installation pour Debian, Ubuntu, Fedora, Arch Linux sur architectures x86_64 et ARM64.", "Installation guide for Debian, Ubuntu, Fedora, Arch Linux across x86_64 and ARM64 architectures."),
    path: "/linux",
    category: text("Système", "System"),
    icon: "icon:terminal",
    tags: ["linux", "debian", "ubuntu", "fedora", "arch", "deb", "rpm", "arm64", "x86_64"],
  },
  {
    id: "legal",
    title: text("Mentions Légales", "Legal notices"),
    description: text("Informations sur l'éditeur, licence open source AGPL-3.0, hébergement et propriété intellectuelle.", "Publisher information, AGPL-3.0 open source license, hosting terms, and intellectual property."),
    path: "/mentions-legales",
    category: text("Légal", "Legal"),
    icon: "icon:shield",
    tags: ["mentions", "legales", "editeur", "agpl", "licence", "hebergement", "legal"],
  },
  {
    id: "docs-faq",
    title: text("Questions Fréquentes (FAQ)", "Frequently Asked Questions (FAQ)"),
    description: text("Réponses rapides aux interrogations courantes sur les formats vidéo, le réseau local, les sauvegardes et les pannes.", "Quick answers to common questions about video codecs, offline networking, backups, and troubleshooting."),
    path: "/documentation/faq",
    category: text("Documentation", "Documentation"),
    icon: "icon:search",
    tags: ["faq", "questions", "frequentes", "aide", "depannage", "formats", "codecs"],
  },
  {
    id: "security",
    title: text("Sécurité & Signalement de vulnérabilités", "Security & Vulnerability reporting"),
    description: text("Portail officiel de sécurité : modèle d'isolation sans cloud, politique de divulgation responsable RFC 9116, clé OpenPGP et signalements.", "Official security portal: cloud-free isolation model, RFC 9116 responsible disclosure policy, OpenPGP key and advisories."),
    path: "https://security.bobine.fit",
    category: text("Sécurité", "Security"),
    icon: "icon:shield",
    tags: ["securite", "vulnerabilite", "isolation", "local", "cve", "disclosure", "security", "rfc9116"],
  },
  {
    id: "channel-stable",
    title: text("Stable (Canal de production)", "Stable (Production channel)"),
    description: text("La version éprouvée et recommandée pour l'exploitation quotidienne en salle de sport, sans mauvaise surprise.", "The proven, recommended version for everyday gym operation with maximum reliability."),
    path: "/canaux/stable",
    category: text("Mises à jour", "Updates"),
    icon: "icon:check",
    tags: ["stable", "production", "recommande", "fiable", "canaux"],
  },
  {
    id: "download",
    title: text("Téléchargement des paquets", "Package downloads"),
    description: text("Téléchargez l'application Bobine pour Windows, macOS (Apple Silicon), Linux, Android et Android TV.", "Download Bobine for Windows, macOS (Apple Silicon), Linux, Android, and Android TV."),
    path: "/telechargement",
    category: text("Produit", "Product"),
    icon: "icon:download",
    tags: ["telechargement", "download", "windows", "macos", "linux", "android", "apk", "exe", "dmg"],
  },
  {
    id: "tor",
    title: text("Anonymisation", "Anonymization"),
    description: text("Installer et mettre à jour Bobine de façon anonyme.", "Install and update Bobine anonymously."),
    path: "/documentation/anonymisation",
    category: text("Distribution", "Distribution"),
    icon: "icon:globe",
    tags: ["anonymat", "miroir", "censure", "decentralise", "prive"],
  },
] as const;
