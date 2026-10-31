import type { AssetKey } from "@/lib/assets";

export interface DistroItem {
  id: string;
  name: string;
  icon: AssetKey;
  pkgFormat: string;
  architectures: string[];
  status: {
    fr: string;
    en: string;
  };
  siteUrl: string;
}

export interface DistroFamily {
  id: string;
  title: {
    fr: string;
    en: string;
  };
  badge: {
    fr: string;
    en: string;
  };
  manager: string;
  distros: DistroItem[];
}

export const LINUX_DISTRO_FAMILIES: DistroFamily[] = [
  {
    id: "debian",
    title: {
      fr: "Famille Debian & Ubuntu",
      en: "Debian & Ubuntu Family",
    },
    badge: {
      fr: "Gestionnaire APT (.deb)",
      en: "APT Package Manager (.deb)",
    },
    manager: "apt",
    distros: [
      {
        id: "debian",
        name: "Debian 12 / 13",
        icon: "distro.debian",
        pkgFormat: ".deb",
        architectures: ["x86_64", "aarch64"],
        status: { fr: "Compatibilité à vérifier", en: "Compatibility to verify" },
        siteUrl: "https://www.debian.org",
      },
      {
        id: "ubuntu",
        name: "Ubuntu 22.04 / 24.04 LTS",
        icon: "distro.ubuntu",
        pkgFormat: ".deb",
        architectures: ["x86_64", "aarch64"],
        status: { fr: "Compatibilité à vérifier", en: "Compatibility to verify" },
        siteUrl: "https://ubuntu.com",
      },
      {
        id: "linuxmint",
        name: "Linux Mint 21 / 22",
        icon: "distro.linuxmint",
        pkgFormat: ".deb",
        architectures: ["x86_64"],
        status: { fr: "Compatibilité à vérifier", en: "Compatibility to verify" },
        siteUrl: "https://linuxmint.com",
      },
      {
        id: "popos",
        name: "Pop!_OS 22.04 / 24.04",
        icon: "distro.popos",
        pkgFormat: ".deb",
        architectures: ["x86_64"],
        status: { fr: "Compatibilité à vérifier", en: "Compatibility to verify" },
        siteUrl: "https://system76.com/pop",
      },
      {
        id: "zorin",
        name: "Zorin OS 17",
        icon: "distro.zorin",
        pkgFormat: ".deb",
        architectures: ["x86_64"],
        status: { fr: "Compatibilité à vérifier", en: "Compatibility to verify" },
        siteUrl: "https://zorin.com",
      },
      {
        id: "raspberrypi",
        name: "Raspberry Pi OS (64-bit)",
        icon: "distro.raspberrypi",
        pkgFormat: ".deb",
        architectures: ["aarch64"],
        status: { fr: "Compatibilité à vérifier", en: "Compatibility to verify" },
        siteUrl: "https://www.raspberrypi.com/software/",
      },
    ],
  },
  {
    id: "fedora",
    title: {
      fr: "Famille Fedora & Dérivés RPM",
      en: "Fedora & RPM Derivatives",
    },
    badge: {
      fr: "Gestionnaire DNF (.rpm)",
      en: "DNF Package Manager (.rpm)",
    },
    manager: "dnf",
    distros: [
      {
        id: "fedora",
        name: "Fedora 39 / 40 / 41",
        icon: "distro.fedora",
        pkgFormat: ".rpm",
        architectures: ["x86_64", "aarch64"],
        status: { fr: "Compatibilité à vérifier", en: "Compatibility to verify" },
        siteUrl: "https://fedoraproject.org",
      },
      {
        id: "nobara",
        name: "Nobara Linux",
        icon: "distro.nobara",
        pkgFormat: ".rpm",
        architectures: ["x86_64"],
        status: { fr: "Compatibilité à vérifier", en: "Compatibility to verify" },
        siteUrl: "https://nobaraproject.org",
      },
      {
        id: "rhel",
        name: "Red Hat Enterprise Linux",
        icon: "distro.rhel",
        pkgFormat: ".rpm",
        architectures: ["x86_64", "aarch64"],
        status: { fr: "Compatibilité à vérifier", en: "Compatibility to verify" },
        siteUrl: "https://www.redhat.com",
      },
      {
        id: "almalinux",
        name: "AlmaLinux 9",
        icon: "distro.almalinux",
        pkgFormat: ".rpm",
        architectures: ["x86_64", "aarch64"],
        status: { fr: "Compatibilité à vérifier", en: "Compatibility to verify" },
        siteUrl: "https://almalinux.org",
      },
      {
        id: "rockylinux",
        name: "Rocky Linux 9",
        icon: "distro.rockylinux",
        pkgFormat: ".rpm",
        architectures: ["x86_64", "aarch64"],
        status: { fr: "Compatibilité à vérifier", en: "Compatibility to verify" },
        siteUrl: "https://rockylinux.org",
      },
      {
        id: "opensuse",
        name: "openSUSE Tumbleweed & Leap",
        icon: "distro.opensuse",
        pkgFormat: ".rpm",
        architectures: ["x86_64", "aarch64"],
        status: { fr: "Compatibilité à vérifier", en: "Compatibility to verify" },
        siteUrl: "https://www.opensuse.org",
      },
    ],
  },
  {
    id: "arch",
    title: {
      fr: "Famille Arch Linux & Dérivés",
      en: "Arch Linux & Derivatives",
    },
    badge: {
      fr: "Gestionnaire Pacman (.pkg.tar.zst)",
      en: "Pacman Package Manager (.pkg.tar.zst)",
    },
    manager: "pacman",
    distros: [
      {
        id: "arch",
        name: "Arch Linux",
        icon: "distro.arch",
        pkgFormat: "pacman",
        architectures: ["x86_64", "aarch64"],
        status: { fr: "Compatibilité à vérifier", en: "Compatibility to verify" },
        siteUrl: "https://archlinux.org",
      },
      {
        id: "endeavouros",
        name: "EndeavourOS",
        icon: "distro.endeavouros",
        pkgFormat: "pacman",
        architectures: ["x86_64"],
        status: { fr: "Compatibilité à vérifier", en: "Compatibility to verify" },
        siteUrl: "https://endeavouros.com",
      },
      {
        id: "cachyos",
        name: "CachyOS",
        icon: "distro.cachyos",
        pkgFormat: "pacman",
        architectures: ["x86_64"],
        status: { fr: "Compatibilité à vérifier", en: "Compatibility to verify" },
        siteUrl: "https://cachyos.org",
      },
      {
        id: "manjaro",
        name: "Manjaro Linux",
        icon: "distro.manjaro",
        pkgFormat: "pacman",
        architectures: ["x86_64", "aarch64"],
        status: { fr: "Compatibilité à vérifier", en: "Compatibility to verify" },
        siteUrl: "https://manjaro.org",
      },
    ],
  },
];

export const LINUX_SHOWCASE_CONTENT = {
  fr: {
    hero: {
      badge: "Appliance Kiosque & Poste de Bureau 2026",
      title: "La puissance de Bobine. La liberté de Linux.",
      lead: "Conçu pour les salles de sport, cinémas associatifs et régies audiovisuelles exigeantes : découvrez l'appliance autonome et le logiciel de diffusion le plus complet sur Linux. Paquets natifs signés pour Debian, Fedora et Arch.",
      ctaPrimary: "Installer sur votre machine",
      ctaSecondary: "Explorer les dépôts officiels",
      chipsLabel: "Architectures ciblées (matériel non validé) :",
    },
    chips: [
      { name: "AMD Ryzen", note: "Zen 3/4/5, Ryzen AI, Radeon VA-API", icon: "chip.amd" as const },
      { name: "Intel Core & N-Series", note: "Core Ultra, Gen 12–15, N-Series QSV", icon: "chip.intel" as const },
      { name: "Qualcomm Snapdragon", note: "ARM64 X-Series, Bornes & Tablettes ARM", icon: "chip.snapdragon" as const },
      { name: "Framework & SBC ARM64", note: "Framework 13/16, Bornes & Mini PC ARM", icon: "os.framework" as const },
    ],
    terminal: {
      sectionTag: "Installation Express & Dépôts",
      sectionTitle: "Installez Bobine en une ligne de commande.",
      sectionDesc: "Chaque famille de distribution dispose d'un dépôt signé et sécurisé. Choisissez votre système et votre canal de mise à jour pour obtenir immédiatement la commande exacte.",
      tabs: {
        debian: "Debian & Ubuntu",
        fedora: "Fedora & RHEL",
        arch: "Arch Linux",
        appliance: "Script Appliance Dédiée",
      },
      channels: {
        stable: "Stable (Production)",
        beta: "Bêta (Préversion)",
        canary: "Canary (En continu)",
      },
      copyBtn: "Copier la commande",
      copiedText: "Commande copiée",
      repoNote: "Portail interactif des dépôts officiels :",
      viewRepoLink: "packages.bobine.fit",
      keyVerifiedNote: "Signatures vérifiées par clé OpenPGP",
    },
    distros: {
      sectionTag: "Familles de distributions",
      sectionTitle: "16 distributions Linux à explorer.",
      sectionDesc: "Qu'il s'agisse d'une appliance Debian dédiée tournant en continu 24h/24 ou de votre station de travail de montage Fedora ou Arch, Bobine s'intègre comme un paquet système natif.",
    },
    bento: {
      sectionTag: "Architecture Audiovisuelle",
      sectionTitle: "Pourquoi Bobine excelle sur Linux.",
      sectionDesc: "Conçu sans artifice ni couche superflue, Bobine exploite les primitives noyau les plus performantes pour garantir une fluidité vidéo absolue sans consommer de ressources inutiles.",
      cards: [
        {
          badge: "Accélération Matérielle 4K",
          title: "Décodage direct VA-API & NVDEC à 60 fps",
          desc: "Déchargez intégralement le processeur grâce au décodage vidéo par la puce graphique Intel, AMD, Qualcomm Adreno ou NVIDIA. Même sur un mini-PC fanless ou un portable reconditionné, la lecture reste d'une fluidité parfaite sans chauffer.",
          features: [
            "Support matériel H.264, HEVC / H.265, VP9 et AV1",
            "Sortie multi-écrans HDMI indépendante en plein écran natif",
            "Zéro saccade ni déchirement d'image (V-Sync Wayland / X11)",
          ],
        },
        {
          badge: "Résilience Kiosque 24/7",
          title: "Appliance durcie avec auto-guérison Systemd",
          desc: "En mode appliance, Bobine démarre instantanément à l'allumage sans afficher de bureau. Le service systemd est sécurisé en bac à sable strict et surveillé en continu par un watchdog matériel.",
          features: [
            "Démarrage silencieux direct vers l'écran de projection",
            "Redémarrage automatique en sous-seconde en cas d'anomalie",
            "Montage automatique sécurisé des clés USB de cours",
          ],
        },
        {
          badge: "Souveraineté & Respect",
          title: "100% Hors-ligne, zéro abonnement, zéro cloud",
          desc: "Vos plannings, vos vidéos et vos données d'adhérents restent sur votre machine locale. Aucune connexion internet n'est requise pour diffuser vos cours, piloter la régie ou lancer le kiosque cinéma.",
          features: [
            "Contrôle local immédiat depuis smartphone ou tablette",
            "Zéro compte requis, zéro télémétrie invasive",
            "Licence libre AGPL-3.0 : vous êtes propriétaire de votre outil",
          ],
        },
        {
          badge: "Intégration Système",
          title: "Mises à jour silencieuses avec votre OS",
          desc: "Fini les installeurs manuels ou les binaires dispersés : Bobine se met à jour naturellement lors de vos `apt upgrade`, `dnf upgrade` ou `pacman -Syu` réguliers.",
          features: [
            "Contrôle strict de parité binaire FHS (/usr/lib/bobine)",
            "Paquets signés cryptographiquement par clé OpenPGP",
            "Retour sans perte vers la version Stable à tout moment",
          ],
        },
      ],
    },
    framework: {
      sectionTag: "Matériel Recommandé & Éprouvé",
      title: "Framework Laptop : Le matériel idéal pour Bobine.",
      desc: "Nous recommandons chaleureusement le Framework Laptop (13 et 16 pouces) pour déployer Bobine en salle ou en régie. Son châssis en aluminium usiné, sa réparabilité exemplaire (indice 10/10) et ses cartes d'extension interchangeables permettent de brancher deux écrans HDMI directs sans adaptateur fragile.",
      specs: [
        { title: "Processeurs supportés", value: "AMD Ryzen, Intel Core Ultra & Snapdragon" },
        { title: "Sorties d'affichage", value: "Cartes HDMI & DP modulaires" },
        { title: "Indice de réparabilité", value: "10 / 10 (Pièces remplaçables)" },
        { title: "Compatibilité Linux", value: "100% native avec Bobine" },
      ],
      linkText: "Découvrir les ordinateurs Framework sur frame.work",
    },
    security: {
      title: "Clé de signature OpenPGP officielle",
      desc: "Tous les paquets, dépôts APT, dépôts DNF et bases de données Pacman sont signés par la clé OpenPGP officielle de Bobine. Vérifiez systématiquement cette empreinte avant d'autoriser l'installation :",
      fingerprint: "B77D 96D7 2F84 F36A CAA3 F872 9CBF 497D 829E E15A",
      downloadKeyText: "Télécharger la clé publique (bobine.gpg)",
    },
  },
  en: {
    hero: {
      badge: "Kiosk Appliance & Desktop Playout 2026",
      title: "The power of Bobine. The freedom of Linux.",
      lead: "Engineered for fitness studios, community cinemas and demanding audiovisual desks: experience the most reliable autonomous playout system on Linux. Native signed packages for Debian, Fedora and Arch Linux.",
      ctaPrimary: "Install on your machine",
      ctaSecondary: "Explore official package repositories",
      chipsLabel: "Target architectures (hardware not validated):",
    },
    chips: [
      { name: "AMD Ryzen", note: "Zen 3/4/5, Ryzen AI, Radeon VA-API", icon: "chip.amd" as const },
      { name: "Intel Core & N-Series", note: "Core Ultra, Gen 12–15, N-Series QSV", icon: "chip.intel" as const },
      { name: "Qualcomm Snapdragon", note: "ARM64 X-Series, ARM Kiosks & Tablets", icon: "chip.snapdragon" as const },
      { name: "Framework & ARM64 SBC", note: "Framework 13/16, ARM Kiosks & Mini PCs", icon: "os.framework" as const },
    ],
    terminal: {
      sectionTag: "Quick Installation & Repositories",
      sectionTitle: "Install Bobine with a single terminal command.",
      sectionDesc: "Each distribution family has a dedicated, cryptographically signed repository. Select your distribution and update channel to get the exact install command instantly.",
      tabs: {
        debian: "Debian & Ubuntu",
        fedora: "Fedora & RHEL",
        arch: "Arch Linux",
        appliance: "Dedicated Kiosk Script",
      },
      channels: {
        stable: "Stable (Production)",
        beta: "Beta (Curated)",
        canary: "Canary (Nightly)",
      },
      copyBtn: "Copy command",
      copiedText: "Command copied",
      repoNote: "Official interactive repository portal:",
      viewRepoLink: "packages.bobine.fit",
      keyVerifiedNote: "All signatures verified against the Bobine OpenPGP key",
    },
    distros: {
      sectionTag: "Distribution families",
      sectionTitle: "Explore 16 Linux distributions.",
      sectionDesc: "Whether running on a dedicated 24/7 Debian appliance or on your Fedora or Arch production workstation, Bobine integrates as a native system package.",
    },
    bento: {
      sectionTag: "Audiovisual Architecture",
      sectionTitle: "Why Bobine thrives on Linux.",
      sectionDesc: "Built without unnecessary bloat, Bobine leverages low-level Linux kernel primitives to deliver rock-solid 4K video playback with minimal system load.",
      cards: [
        {
          badge: "4K Hardware Acceleration",
          title: "Direct VA-API & NVDEC decoding at 60 fps",
          desc: "Offload the entire video decoding pipeline to your Intel, AMD, Qualcomm Adreno or NVIDIA GPU. Even on silent fanless mini-PCs or refurbished laptops, playback remains buttery-smooth with minimal thermal footprint.",
          features: [
            "Hardware decoding for H.264, HEVC / H.265, VP9 and AV1",
            "Independent multi-screen HDMI output in native fullscreen",
            "Zero tearing or frame drops (V-Sync Wayland / X11)",
          ],
        },
        {
          badge: "24/7 Kiosk Resilience",
          title: "Hardened appliance with Systemd watchdog",
          desc: "In appliance mode, Bobine boots directly into the projection screen without displaying any desktop chrome. The systemd service is sandboxed and constantly monitored by a hardware watchdog.",
          features: [
            "Silent boot straight into the classroom or kiosk display",
            "Sub-second automatic restart in case of unexpected failure",
            "Automatic and secure mounting of removable instructor media",
          ],
        },
        {
          badge: "Sovereignty & Privacy",
          title: "100% Offline, zero subscriptions, zero cloud",
          desc: "Your schedules, videos, and member data remain strictly on your local machine. No internet connection is ever needed to run classes, trigger automation, or manage the cinema kiosk.",
          features: [
            "Instant local control from any smartphone or tablet",
            "Zero accounts needed, zero telemetry or tracking",
            "AGPL-3.0 open-source license: you own your equipment",
          ],
        },
        {
          badge: "System Integration",
          title: "Seamless updates with your operating system",
          desc: "Say goodbye to manual tarballs and scattered binaries: Bobine updates naturally with your routine `apt upgrade`, `dnf upgrade`, or `pacman -Syu` workflows.",
          features: [
            "Strict FHS binary parity compliance (/usr/lib/bobine)",
            "Cryptographically signed with official OpenPGP key",
            "Seamless rollback to Stable at any time without data loss",
          ],
        },
      ],
    },
    framework: {
      sectionTag: "Recommended Hardware",
      title: "Framework Laptop: The ideal hardware for Bobine.",
      desc: "We enthusiastically recommend Framework Laptops (13 and 16 inches) for studio and control room deployments. Its machined aluminum chassis, 10/10 reparability score, and hot-swappable I/O cards allow connecting dual independent HDMI displays without fragile dongles.",
      specs: [
        { title: "Processors supported", value: "AMD Ryzen, Intel Core Ultra & Snapdragon" },
        { title: "Display outputs", value: "Modular HDMI & DP expansion cards" },
        { title: "Reparability score", value: "10 / 10 (Replaceable parts)" },
        { title: "Linux compatibility", value: "100% native with Bobine" },
      ],
      linkText: "Discover Framework Laptops at frame.work",
    },
    security: {
      title: "Official OpenPGP Signing Key",
      desc: "All packages, APT repositories, DNF repositories, and Pacman databases are signed by the official Bobine OpenPGP key. Always verify this fingerprint before trusting installation:",
      fingerprint: "B77D 96D7 2F84 F36A CAA3 F872 9CBF 497D 829E E15A",
      downloadKeyText: "Download public key (bobine.gpg)",
    },
  },
};

export function getTerminalCommand(family: string, channel: string): string {
  if (family === "debian") {
    return [
      "# 1. Importer la clé de signature OpenPGP officielle",
      "sudo install -m 0755 -d /etc/apt/keyrings",
      "curl -fsSL https://packages.bobine.fit/bobine.gpg \\",
      "  | sudo gpg --dearmor -o /etc/apt/keyrings/bobine.gpg",
      "",
      `# 2. Configurer le dépôt APT officiel Bobine (${channel})`,
      `echo "deb [signed-by=/etc/apt/keyrings/bobine.gpg] \\`,
      `  https://packages.bobine.fit/debian/ ${channel} main" \\`,
      "  | sudo tee /etc/apt/sources.list.d/bobine.list",
      "",
      "# 3. Mettre à jour et installer Bobine",
      "sudo apt update && sudo apt install bobine",
    ].join("\n");
  }

  if (family === "fedora") {
    return [
      "# 1. Importer la clé OpenPGP et ajouter le dépôt DNF Bobine",
      "sudo rpm --import https://packages.bobine.fit/bobine.gpg",
      `sudo dnf config-manager addrepo \\`,
      `  --from-repofile=https://packages.bobine.fit/fedora/bobine-${channel}.repo`,
      "",
      "# 2. Installer Bobine",
      "sudo dnf install bobine",
      "",
      "# Note RHEL / AlmaLinux / Rocky Linux (dnf 4) :",
      `# sudo dnf config-manager --add-repo https://packages.bobine.fit/fedora/bobine-${channel}.repo`,
    ].join("\n");
  }

  if (family === "arch") {
    return [
      "# 1. Importer et certifier localement la clé OpenPGP Bobine",
      "curl -fsSL https://packages.bobine.fit/bobine.gpg | sudo pacman-key --add -",
      "sudo pacman-key --lsign-key B77D96D72F84F36ACAA3F8729CBF497D829EE15A",
      "",
      "# 2. Ajouter le dépôt [bobine] à /etc/pacman.conf",
      "sudo tee -a /etc/pacman.conf << 'EOF'",
      "",
      "[bobine]",
      "SigLevel = Required DatabaseOptional",
      `Server = https://packages.bobine.fit/arch/${channel}/$arch`,
      "EOF",
      "",
      "# 3. Synchroniser et installer Bobine",
      "sudo pacman -Syu bobine",
    ].join("\n");
  }

  // appliance direct script
  return [
    "# Script d'installation automatique pour appliance dédiée (Debian 13 minimale)",
    `curl -fsSL https://bobine.fit/install.sh | bash${channel !== "stable" ? ` -s -- --channel=${channel}` : ""}`,
  ].join("\n");
}
