import type { Locale } from "@/lib/i18n";

export type FaqCategory = "license" | "compare" | "hardware" | "offline" | "updates" | "security";

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
    security: "Sécurité",
  },
  en: {
    license: "License & Cost",
    compare: "Comparisons",
    hardware: "Hardware",
    offline: "Offline",
    updates: "Updates",
    security: "Security",
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
      a: "Un mini PC x86-64 standard, du reconditionné d'entrée de gamme (dès ~160 €) au mini PC industriel 100% fanless pour un silence absolu (~600 €), avec 8 à 16 Go de RAM et un écran HDMI standard. Le hub matériel bobine.fit/materiel référence des configurations vérifiées avec prix constatés et liens d'achat à jour, par système d'exploitation. Un panier « Mon Pack » permet d'y construire sa propre configuration produit par produit (bouton flottant en bas de la page), et l'assistant Baamix voit ce panier en direct pour signaler un oubli probable ou recommander un accessoire compatible.",
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
      q: "Quelle est la différence entre les versions Stable, Bêta et Canary ?",
      a: "La version Stable (ex. V4.0.3) est la version officielle recommandée pour la production et l'exploitation quotidienne en salle. La Bêta offre un lot de fonctionnalités/correctifs curés et publiés manuellement par le mainteneur quand il est prêt. La Canary offre un accès anticipé continu, reconstruite automatiquement à chaque commit sur la branche principale, sans curation. Les deux partagent les mêmes identifiants d'application, s'installent par-dessus la version existante sans créer de doublon, et vous pouvez revenir à la Stable à tout moment depuis Réglages → Mises à jour sans perte de données ni de médias.",
    },
    {
      category: "updates",
      q: "Comment changer de canal de mise à jour (Stable / Bêta / Canary) sur mon installation ?",
      a: "Sur le panneau d'administration web, rendez-vous dans Réglages → Mises à jour logicielles et choisissez le canal souhaité. Sur une appliance dédiée CLI, vous pouvez également relancer l'installeur avec l'option --channel=stable, --channel=beta ou --channel=canary (ex : curl -fsSL https://bobine.fit/install.sh | sudo bash -s -- --channel=beta).",
    },
    {
      category: "updates",
      q: "Comment installer Bobine et recevoir les mises à jour automatiques sur Linux (Debian / Ubuntu / Mint) ?",
      a: "La méthode recommandée pour les postes de bureau Linux est d'ajouter le dépôt APT officiel signé cryptographiquement (https://apt.bobine.fit). En 3 commandes dans votre terminal (import de la clé GPG, déclaration de la source apt.bobine.fit stable, beta ou canary, puis sudo apt update && sudo apt install bobine), vous recevez automatiquement toutes les futures mises à jour via votre gestionnaire de paquets habituel (apt upgrade).",
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
    {
      q: "Bobine fonctionne-t-il avec Firefox ?",
      a: "Oui. Depuis la version 4.0.3, l'interface d'administration et les lecteurs ouverts depuis un autre appareil (/radio, /kiosk, /cinema, /coach) sont vérifiés de bout en bout sur Firefox 157 par des tests automatiques : envoi de fichiers repris après une coupure réseau, flux vidéo conformes au protocole HTTP, lecture H.264. Quand un navigateur ne sait pas décoder une vidéo (HEVC, 10 bits selon le système et le matériel), Bobine lui sert une version H.264 compatible produite à la demande, sans toucher à l'original ; les Réglages offrent un diagnostic local du navigateur. Windows, macOS, Firefox pour Android et la version ESR ne sont pas encore mesurés. Firefox est une marque de la Mozilla Foundation, citée ici sans affiliation.",
      category: "compare",
    },
    {
      q: "Puis-je installer et mettre à jour Bobine via Tor ?",
      a: "Oui. Le dépôt APT et le site sont aussi disponibles en services onion (Tor), sans révéler votre adresse IP. Installez apt-transport-tor puis utilisez la source tor+http://rzvwjat5pidtxtwzcsvew7yc5ugfjvzz432ecpn3s5mlch4cs7vvmqad.onion/ stable main : les paquets restent signés par la même clé, vérifiée par apt (empreinte de la clé principale B77D 96D7 2F84 F36A CAA3 F872 9CBF 497D 829E E15A). Le site est aussi consultable dans Tor Browser : http://bobinedaoki42tt33rxacmtaab2gxvxb2orqgcyhvowv3aggxhruvrid.onion/. La boutique matériel n'y est pas proposée, et l'assistant Baamix n'y répond pas.",
      category: "updates",
    },
    {
      category: "security",
      q: "Comment signaler une faille de sécurité de façon confidentielle ?",
      a: "Écrivez à security@bobine.fit ou ouvrez un signalement privé de vulnérabilité sur le dépôt GitHub de Bobine (onglet Sécurité). Chiffrez tout rapport contenant des détails exploitables avec notre clé publique OpenPGP (empreinte 23CA D324 C507 FB0F 97E6 AECA 6E4C 020E F8BD FEB2, à télécharger sur https://bobine.fit/.well-known/security.asc ou à découvrir avec gpg --locate-keys security@bobine.fit) et vérifiez l'empreinte avant d'envoyer. Créez votre propre paire de clés (gpg --quick-generate-key \"Votre Nom <vous@exemple.org>\" future-default default 2y) et joignez votre clé publique : nous répondrons chiffré. Politique complète, périmètre et délais : https://bobine.fit/fr/securite.",
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
      a: "A standard x86-64 mini PC, anywhere from an entry-level refurbished unit (from ~€160) to a 100% fanless industrial mini PC for absolute silence (~€600), with 8-16GB RAM and a standard HDMI display. The hardware hub at bobine.fit/materiel lists verified configurations with checked prices and up-to-date purchase links, organized by operating system. A \"My Pack\" cart lets you build your own configuration product by product (floating button at the bottom of the page), and the Baamix assistant sees this cart live to flag a likely gap or recommend a compatible accessory.",
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
      q: "What is the difference between the Stable, Beta and Canary channels?",
      a: "The Stable release (e.g. V4.0.3) is the official tested build recommended for production gym playout. Beta offers a curated batch of features/fixes published manually by the maintainer when ready. Canary provides continuous early access, rebuilt automatically on every commit to the main branch, with no curation. Both share identical system application IDs, install directly over your current version without creating duplicate apps, and allow reverting back to Stable anytime from Settings → Software Updates without data loss.",
    },
    {
      category: "updates",
      q: "How do I switch between Stable, Beta and Canary update channels on my setup?",
      a: "From the web administration dashboard, go to Settings → Software Updates and pick the channel you want. On a dedicated headless CLI appliance, you can run the installer with --channel=stable, --channel=beta or --channel=canary (e.g. curl -fsSL https://bobine.fit/install.sh | sudo bash -s -- --channel=beta).",
    },
    {
      category: "updates",
      q: "How do I install Bobine and receive automated updates on Linux (Debian / Ubuntu / Mint)?",
      a: "The recommended method for Linux desktop machines is adding the official cryptographically signed APT repository (https://apt.bobine.fit). In 3 simple terminal commands (import the official GPG key, add the apt.bobine.fit stable, beta or canary source, and run sudo apt update && sudo apt install bobine), you receive seamless automated updates via your standard system package manager (apt upgrade).",
    },
    {
      category: "updates",
      q: "How does the 1-click automatic uninstaller work?",
      a: "In Settings → Danger Zone, automatic uninstallation triggers the native uninstaller for your platform (Polkit on Linux .deb, Inno Setup on Windows, LaunchAgent purge on macOS, Android intent, or the bobine-uninstall script on headless Debian). The operation requires explicitly typing the confirmation keyword 'UNINSTALL' ('DÉSINSTALLER') to prevent accidental removals.",
    },
    {
      q: "Does Bobine work with Firefox?",
      a: "Yes. Since version 4.0.3, the admin interface and the players opened from another device (/radio, /kiosk, /cinema, /coach) are verified end to end on Firefox 157 by automated tests: file uploads that resume after a network cut, HTTP-compliant video streams, H.264 playback. When a browser cannot decode a video (HEVC, 10-bit, depending on the system and hardware), Bobine serves it a compatible H.264 version produced on demand, without touching the original; Settings offers a local browser diagnostic. Windows, macOS, Firefox for Android and the ESR release are not measured yet. Firefox is a trademark of the Mozilla Foundation, mentioned here without affiliation.",
      category: "compare",
    },
    {
      q: "Can I install and update Bobine over Tor?",
      a: "Yes. The APT repository and the website are also available as onion services (Tor), without revealing your IP address. Install apt-transport-tor, then use the source tor+http://rzvwjat5pidtxtwzcsvew7yc5ugfjvzz432ecpn3s5mlch4cs7vvmqad.onion/ stable main: packages remain signed by the same key, checked by apt (primary key fingerprint B77D 96D7 2F84 F36A CAA3 F872 9CBF 497D 829E E15A). The site can also be browsed in Tor Browser: http://bobinedaoki42tt33rxacmtaab2gxvxb2orqgcyhvowv3aggxhruvrid.onion/. The hardware store is not offered there, and the Baamix assistant does not answer.",
      category: "updates",
    },
    {
      category: "security",
      q: "How do I report a security flaw confidentially?",
      a: "Write to security@bobine.fit or open a private vulnerability report on the Bobine GitHub repository (Security tab). Encrypt any report containing exploitable details with our OpenPGP public key (fingerprint 23CA D324 C507 FB0F 97E6 AECA 6E4C 020E F8BD FEB2, download it at https://bobine.fit/.well-known/security.asc or discover it with gpg --locate-keys security@bobine.fit) and check the fingerprint before sending. Create your own key pair (gpg --quick-generate-key \"Your Name <you@example.org>\" future-default default 2y) and attach your public key: we will reply encrypted. Full policy, scope and timelines: https://bobine.fit/en/securite.",
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
