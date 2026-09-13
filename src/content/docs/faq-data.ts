import type { Locale } from "@/lib/i18n";

export type FaqCategory = "license" | "compare" | "hardware" | "offline" | "updates";

export interface FaqItem {
  q: string;
  a: string;
  category: FaqCategory;
}

export const FAQ_CATEGORY_LABELS: Record<Locale, Record<FaqCategory, string>> = {
  fr: {
    license: "Licence & Coûts",
    compare: "Comparatifs",
    hardware: "Matériel",
    offline: "Hors-ligne",
    updates: "Mises à jour",
  },
  en: {
    license: "License & Cost",
    compare: "Comparisons",
    hardware: "Hardware",
    offline: "Offline",
    updates: "Updates",
  },
};

export const FAQ_ITEMS: Record<Locale, FaqItem[]> = {
  fr: [
    {
      category: "license",
      q: "Bobine est-il vraiment 100% gratuit et sans redevance ?",
      a: "Oui. Logiciel libre sous licence AGPL-3.0 : aucun abonnement, aucune redevance par écran, aucun compte obligatoire. Vous êtes l'unique propriétaire de votre matériel et de vos médias.",
    },
    {
      category: "compare",
      q: "En quoi Bobine diffère-t-il d'un outil d'affichage publicitaire / dynamique (Anthias, Screenly, Xibo, Yodeck) ?",
      a: "Les outils d'affichage dynamique généralistes font défiler des diaporamas ou des pages web en boucle, mais ils ne sont pas adaptés aux studios de fitness : pas de planning de cours programmés à la seconde, pas de borne tactile membre pour lancer un cours à la demande, pas de télécommande smartphone par QR code et pas de radio 24/7 avec fondu sonore. Bobine est spécialement pensé comme une régie de cours collectifs.",
    },
    {
      category: "compare",
      q: "En quoi Bobine remplace-t-il Les Mills Cinema, Wexer ou Spivi ?",
      a: "Même expérience haut de gamme en salle (cours planifiés, borne tactile membre à la demande, diffusion 1080p60/4K), mais sans abonnement exorbitant (0 € vs 150-400 €/mois) et sans catalogue imposé. Vous êtes propriétaire de vos appareils et tout tourne 100% hors-ligne sur SSD local.",
    },
    {
      category: "offline",
      q: "Ai-je besoin d'une connexion internet pour faire tourner Bobine au quotidien ?",
      a: "Non, pas au quotidien. Internet n'est requis qu'une seule fois lors de l'installation initiale pour télécharger les paquets Debian. Ensuite, la salle diffuse ses cours de manière 100% autonome.",
    },
    {
      category: "hardware",
      q: "Quel matériel informatique faut-il acheter ?",
      a: "Un mini PC x86-64 standard : Intel (Dell Wyse 5070 Celeron J4105 ~40-50 €, Lenovo ThinkCentre Tiny, Beelink N100) ou AMD (HP EliteDesk 705 G4/G5 Ryzen 3/5 Pro ~60-80 €, Lenovo M715q), 4 à 8 Go de RAM, et un écran HDMI standard.",
    },
    {
      category: "hardware",
      q: "Que se passe-t-il en cas de coupure de courant ou de plantage ?",
      a: "Un chien de garde systemd surveille en continu la santé des services et relance automatiquement les composants en cas d'anomalie. Les services redémarrent instantanément et de façon autonome dès le retour du courant électrique.",
    },
    {
      category: "hardware",
      q: "Quelles manettes de jeu et télécommandes sont compatibles avec Bobine ?",
      a: "Toutes les manettes standard via la spécification HTML5 Gamepad API : manettes sans fil ou filaires Microsoft Xbox Series / Xbox One, Sony PlayStation DualSense / DualShock 4, Nintendo Switch Pro, 8BitDo et manettes USB génériques. Les télécommandes multimédias USB/IR et les souris sont également reconnues nativement.",
    },
    {
      category: "hardware",
      q: "Comment Bobine mesure-t-il la puissance en Watts et la télémétrie matérielle ?",
      a: "Bobine intègre un sous-système de télémétrie éco-conçu interrogeant les compteurs matériels bas niveau sans droits root : le sous-système noyau intel-rapl en microjoules sur mini PC Intel, l'interface ioreg sous macOS Apple Silicon, les nœuds sysfs sous Android/Linux et WMI/powercfg sous Windows. Les températures CPU/GPU et la fréquence effective de la RAM (MT/s) sont également restituées en direct.",
    },
    {
      category: "updates",
      q: "Quelle est la différence entre la version Stable et la version Bêta (Rolling beta) ?",
      a: "La version Stable (ex. V3.0.5) est la version officielle recommandée pour la production et l'exploitation quotidienne en salle. La version Bêta (Rolling beta) offre un accès anticipé continu aux fonctionnalités en cours de test. Elle partage les mêmes identifiants d'application, s'installe par-dessus la version existante sans créer de doublon, et vous pouvez revenir à la Stable à tout moment depuis Réglages → Mises à jour sans perte de données ni de médias.",
    },
    {
      category: "updates",
      q: "Comment changer de canal de mise à jour (Stable / Bêta) sur mon installation ?",
      a: "Sur le panneau d'administration web, rendez-vous dans Réglages → Mises à jour logicielles et activez ou désactivez le « Programme Bobine Bêta ». Sur une appliance dédiée CLI, vous pouvez également relancer l'installeur avec l'option --channel=beta ou --channel=stable (ex : curl -fsSL https://bobine.fit/install.sh | sudo bash -s -- --channel=beta).",
    },
    {
      category: "updates",
      q: "Comment installer Bobine et recevoir les mises à jour automatiques sur Linux (Debian / Ubuntu / Mint) ?",
      a: "La méthode recommandée pour les postes de bureau Linux est d'ajouter le dépôt APT officiel signé cryptographiquement (https://apt.bobine.fit). En 3 commandes dans votre terminal (import de la clé GPG, déclaration de la source apt.bobine.fit stable ou beta, puis sudo apt update && sudo apt install bobine), vous recevez automatiquement toutes les futures mises à jour via votre gestionnaire de paquets habituel (apt upgrade).",
    },
    {
      category: "updates",
      q: "Comment fonctionne la désinstallation automatique en 1 clic ?",
      a: "Dans Réglages → Zone de danger, la désinstallation automatique déclenche le désinstalleur natif de votre plateforme (Polkit sur Linux .deb, Inno Setup sur Windows, purge des LaunchAgents sous macOS, Intent Android, script bobine-uninstall sous Debian headless). L'opération nécessite la saisie explicite du mot de passe de sécurité « DÉSINSTALLER » pour éviter toute fausse manipulation.",
    },
    {
      category: "compare",
      q: "Comment la Console Régie Coach (/coach) aide-t-elle les éducateurs sportifs ?",
      a: "La console coach responsive s'adapte à tous les écrans : sur tablette paysage ou PC, elle offre un pupitre audio avec boutons 64px, un minuteur précis interpolé à 10 Hz, le retour vidéo direct Stage Monitor 16:9 de la salle et une palette d'ambiances visuelles 1-clic. Sur smartphone, elle bascule en vue monoposte avec tiroirs tactiles rétractables. Elle gère l'assignation d'ambiances vidéo différentes par piste musicale et démarre toujours en pause sécurisée pour laisser le coach s'installer.",
    },
  ],
  en: [
    {
      category: "license",
      q: "Is Bobine truly 100% free with no recurring fees?",
      a: "Yes. Free and open-source software under the copyleft AGPL-3.0 license. Zero subscription fees, zero royalties per screen, and no user accounts. Your only investment is standard refurbished hardware.",
    },
    {
      category: "compare",
      q: "How does Bobine differ from general digital signage tools (Anthias, Screenly, Xibo, Yodeck)?",
      a: "General digital signage players loop slides and ad banners, but lack fitness-specific features: second-precise scheduled class timetables, interactive touch member kiosk, QR-code smartphone remote, and 24/7 background audio with voice crossfade. Bobine is purpose-built for gym studio playout.",
    },
    {
      category: "compare",
      q: "How does Bobine replace proprietary systems like Les Mills Cinema, Wexer, or Spivi?",
      a: "Same premium studio workout experience — automated weekly timetables, on-demand member touchscreen kiosk, 1080p60/4K playout — without recurring monthly fees ($0 vs $150-$400/mo) or locked catalogs. You own your devices, and playback is 100% offline from local SSD.",
    },
    {
      category: "compare",
      q: "How does the Responsive Coach Console (/coach) assist fitness instructors?",
      a: "The responsive coach console adapts to all screens: on landscape tablets or desktop PCs, it features an audio desk with 64px touch targets, a precise timer interpolated at 10 Hz, a live 16:9 Stage Monitor feed of the studio screen, and a 1-click visual ambiance palette. On smartphones, it switches to a single-operator view with retractable touch drawers. It supports per-track video ambiance assignment and always starts in safe pause mode so instructors can settle in.",
    },
    {
      category: "offline",
      q: "Do I need an active internet connection to run Bobine for daily operations?",
      a: "No, not for daily operations. Internet is only required once during the initial setup. Afterwards, your gym plays workout videos entirely offline from local storage.",
    },
    {
      category: "hardware",
      q: "What hardware do I need to equip my gym?",
      a: "A standard refurbished x86-64 mini PC: Intel (Dell Wyse 5070 Celeron J4105 ~40-50 EUR, Lenovo ThinkCentre Tiny, Beelink N100) or AMD (HP EliteDesk 705 G4/G5 Ryzen 3/5 Pro ~60-80 EUR, Lenovo M715q), 4-8GB RAM, and an HDMI TV display.",
    },
    {
      category: "hardware",
      q: "What happens if there is a power cut or system crash?",
      a: "A local systemd supervisor continuously monitors process health and restarts failing components automatically. All services boot autonomously upon power restoration after a blackout.",
    },
    {
      category: "hardware",
      q: "Which gamepads and remote controls are compatible with Bobine?",
      a: "All standard game controllers via the HTML5 Gamepad API: wired and wireless Microsoft Xbox Series / Xbox One, Sony PlayStation DualSense / DualShock 4, Nintendo Switch Pro, 8BitDo, and generic USB controllers. USB/IR multimedia remotes and standard mice are also natively supported with 2D spatial navigation.",
    },
    {
      category: "hardware",
      q: "How does Bobine measure power in Watts and real-time hardware telemetry?",
      a: "Bobine includes an eco-designed telemetry subsystem querying low-level hardware counters without root privileges: the intel-rapl kernel subsystem in microjoules on Intel mini PCs, the ioreg interface on macOS Apple Silicon, sysfs nodes on Android/Linux, and WMI/powercfg on Windows. CPU/GPU temperatures and effective RAM frequency (MT/s) are also reported in real time.",
    },
    {
      category: "updates",
      q: "What is the difference between the Stable and Beta (Rolling beta) channels?",
      a: "The Stable release (e.g. V3.0.5) is the official tested build recommended for production gym playout. The Beta release (Rolling beta) provides continuous early access to features currently being tested. It shares identical system application IDs, installs directly over your current version without creating duplicate apps, and allows reverting back to Stable anytime from Settings → Software Updates without data loss.",
    },
    {
      category: "updates",
      q: "How do I switch between Stable and Beta update channels on my setup?",
      a: "From the web administration dashboard, go to Settings → Software Updates and toggle the 'Bobine Beta Program'. On a dedicated headless CLI appliance, you can run the installer with --channel=beta or --channel=stable (e.g. curl -fsSL https://bobine.fit/install.sh | sudo bash -s -- --channel=beta).",
    },
    {
      category: "updates",
      q: "How do I install Bobine and receive automated updates on Linux (Debian / Ubuntu / Mint)?",
      a: "The recommended method for Linux desktop machines is adding the official cryptographically signed APT repository (https://apt.bobine.fit). In 3 simple terminal commands (import the official GPG key, add the apt.bobine.fit stable or beta source, and run sudo apt update && sudo apt install bobine), you receive seamless automated updates via your standard system package manager (apt upgrade).",
    },
    {
      category: "updates",
      q: "How does the 1-click automatic uninstaller work?",
      a: "In Settings → Danger Zone, automatic uninstallation triggers the native uninstaller for your platform (Polkit on Linux .deb, Inno Setup on Windows, LaunchAgent purge on macOS, Android intent, or the bobine-uninstall script on headless Debian). The operation requires explicitly typing the confirmation keyword 'UNINSTALL' ('DÉSINSTALLER') to prevent accidental removals.",
    },
  ],
};

export interface TroubleshootRow {
  issue: string;
  cause: string;
  solution: string;
}

export const TROUBLESHOOTING_ROWS: Record<Locale, TroubleshootRow[]> = {
  fr: [
    {
      issue: "http://bobine.local inaccessible",
      cause: "La box / routeur bloque le protocole mDNS (Bonjour)",
      solution: "Utilisez l'IP locale (ex: http://192.168.1.50). Tapez 'hostname -I' sur le mini PC pour la connaître.",
    },
    {
      issue: "Écran noir sur la TV en HDMI",
      cause: "Le kiosque Chromium a rencontré une anomalie X11 au démarrage",
      solution: "Relancez avec 'sudo systemctl restart bobine-kiosk'. Vérifiez le câble HDMI.",
    },
    {
      issue: "Pas de son sur la TV ou la sono",
      cause: "Sortie audio HDMI muette ou mal routée",
      solution: "Ouvrez 'alsamixer' pour démuter l'HDMI, ou définissez la sortie avec 'pactl set-default-sink'.",
    },
    {
      issue: "Vidéo saccadée / CPU saturé (>30%)",
      cause: "Accélération matérielle VA-API inactive",
      solution: "Vérifiez avec 'vainfo'. Installez le pilote adapté : intel-media-va-driver-non-free (Intel) ou mesa-va-drivers (AMD Radeon).",
    },
    {
      issue: "Conflit de port 8000 / 8001",
      cause: "Un ancien processus orphelin occupe le port web",
      solution: "Tuez le processus bloquant avec 'sudo fuser -k 8000/tcp' puis relancez les services.",
    },
    {
      issue: "Échec de restauration d'une sauvegarde ZIP",
      cause: "Archive corrompue ou exportée depuis une version incompatible",
      solution: "Vérifiez l'intégrité avec 'sqlite3 bobine.db \"PRAGMA integrity_check;\"'. Ré-exportez une sauvegarde fraîche depuis le panneau d'administration si l'archive est corrompue.",
    },
  ],
  en: [
    {
      issue: "http://bobine.local unreachable",
      cause: "Router / Wi-Fi blocks mDNS (Bonjour)",
      solution: "Use direct IP address (e.g. http://192.168.1.50). Run 'hostname -I' on the mini PC to find it.",
    },
    {
      issue: "Black screen on wired TV",
      cause: "Chromium kiosk encountered an X11 launch issue",
      solution: "Run 'sudo systemctl restart bobine-kiosk'. Check HDMI cable connection.",
    },
    {
      issue: "No sound through HDMI / Speakers",
      cause: "Audio sink misconfigured or muted",
      solution: "Run 'alsamixer' to unmute HDMI, or set default sink via 'pactl set-default-sink'.",
    },
    {
      issue: "Video stutter / high CPU load (>30%)",
      cause: "VA-API hardware acceleration disabled",
      solution: "Run 'vainfo'. Verify intel-media-va-driver-non-free (Intel) or mesa-va-drivers (AMD Radeon) is installed.",
    },
    {
      issue: "Port 8000 / 8001 Conflict",
      cause: "Stale process holding web server port",
      solution: "Kill lingering processes with 'sudo fuser -k 8000/tcp' and restart services.",
    },
    {
      issue: "Restoring a ZIP backup fails",
      cause: "Corrupted archive or exported from an incompatible version",
      solution: "Check integrity with 'sqlite3 bobine.db \"PRAGMA integrity_check;\"'. Export a fresh backup from the admin panel if the archive is corrupted.",
    },
  ],
};
