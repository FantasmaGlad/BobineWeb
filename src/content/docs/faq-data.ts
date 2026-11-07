import type { Locale } from "@/lib/i18n";
import { ANDROID } from "@/lib/productFacts";
import { SIGNING_KEY_FINGERPRINT, archCommands, fedoraCommands, repoStatusNote } from "@/lib/linuxPackages";

/** Mention de statut des dépôts Fedora et Arch : vide une fois qu'ils sont en ligne. */
const soon = (family: "fedora" | "arch", l: "fr" | "en") => {
  const note = repoStatusNote(family, l);
  return note ? `${note} ` : "";
};

export type FaqCategory = "license" | "hardware" | "offline" | "updates" | "security";

export interface FaqItem {
  q: string;
  a: string;
  category: FaqCategory;
}

export const FAQ_CATEGORY_LABELS: Record<Locale, Record<FaqCategory, string>> = {
  fr: {
    license: "Licence & Coûts",
    hardware: "Matériel",
    offline: "Hors-ligne",
    updates: "Mises à jour",
    security: "Sécurité",
  },
  en: {
    license: "License & Cost",
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
      category: "offline",
      q: "Ai-je besoin d'une connexion internet pour faire tourner Bobine au quotidien ?",
      a: "Non, pas au quotidien. Internet n'est requis qu'une seule fois lors de l'installation initiale pour télécharger les paquets Debian. Ensuite, la salle diffuse ses cours de manière 100% autonome.",
    },
    {
      category: "hardware",
      q: "Quel matériel informatique faut-il acheter ?",
      a: "Un mini PC x86-64 ou ARM64 standard, du mini PC reconditionné d'entrée de gamme (Dell Wyse 5070, HP EliteDesk, Beelink N100) au mini PC industriel fanless, avec 8 à 16 Go de RAM et un écran HDMI standard. Bobine tourne également sur PC portable ARM Qualcomm Snapdragon, Mac mini Apple Silicon, tablette Android ou Google Book.",
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
      category: "hardware",
      q: "Bobine est-il compatible avec les PC portables Qualcomm Snapdragon (Windows ARM & Linux ARM) ?",
      a: "Oui. Bobine propose un installeur Windows 11 ARM64 natif (Bobine-Setup-x.y.z-arm64.exe) et un paquet Debian/Ubuntu ARM64 (bobine_x.y.z_arm64.deb). Les puces Snapdragon X Elite et Snapdragon X Plus offrent une autonomie record et une consommation de 5W à 10W en lecture vidéo continue.",
    },
    {
      category: "hardware",
      q: "Bobine fonctionne-t-il sur les ordinateurs portables Google Book (Aluminium OS) ?",
      a: "Oui. Bobine s'exécute nativement en plein écran sur les Google Books (système Aluminium OS / convergence Android) grâce au paquet Bobine-x.y.z.apk avec accélération MediaCodec/Vulkan, et sera très prochainement disponible directement sur le Google Play Store.",
    },
    {
      category: "hardware",
      q: "Bobine fonctionne-t-il sur Android TV, Google TV et les boîtiers 32 bits (Xiaomi) ?",
      a: `Oui, à partir d'Android ${ANDROID.minVersion} (API ${ANDROID.minApi}), comme tous les paquets Android de Bobine. Le paquet Bobine-TV-x.y.z.apk est universel : il s'installe sur les boîtiers 64 bits comme sur ceux dont le système est 32 bits (liste d'ABI armeabi-v7a), ce qui est le cas de plusieurs boîtiers Xiaomi malgré leur processeur 64 bits. Si l'installation échoue avec le message INSTALL_FAILED_NO_MATCHING_ABIS, retéléchargez le paquet depuis la page de téléchargement : les anciennes copies ne couvraient pas les systèmes 32 bits. Un boîtier resté sous Android 11 ou 12 ne peut pas installer Bobine : c'est le cas du Chromecast avec Google TV et du NVIDIA Shield TV. Le Google TV Streamer (Android ${ANDROID.minVersion}) convient.`,
    },
    {
      category: "offline",
      q: "Comment ajouter des sous-titres à un cours vidéo ?",
      a: "Depuis la bibliothèque, ajoutez un fichier .srt ou .vtt (2 Mo maximum) au cours, ou joignez-le à la vidéo lors de l'import. Les .srt sont convertis en WebVTT, la langue est reconnue d'après le nom du fichier (cours.fr.srt, cours.en.vtt) et plusieurs langues peuvent coexister pour un même cours. Les sous-titres restent stockés sur votre machine et s'activent depuis le menu de sous-titres de /cinema et du lecteur de la bibliothèque. Depuis l'administration, vous choisissez la piste affichée sur l'écran de salle ; le choix est appliqué en direct au kiosque et à /cinema.",
    },
    {
      category: "offline",
      q: "Comment ajouter des chapitres à un cours ?",
      a: "Depuis la fiche du cours dans la bibliothèque : saisie manuelle, import d'un fichier (JSON, WebVTT de type chapitres ou texte « 05:00 Titre » une ligne par chapitre), extraction des chapitres incorporés au fichier vidéo, ou export en JSON. Un fichier invalide est refusé avec la ligne en cause, sans rien modifier. Les chapitres apparaissent en repères sur la barre de progression, en liste pour sauter d'un chapitre à l'autre et en bandeau à l'écran au changement de chapitre.",
    },
    {
      category: "hardware",
      q: "Bobine redémarre-t-il tout seul après un redémarrage de l'appareil Android ?",
      a: "Oui, si Réglages > « Démarrage de l'appareil » est activé : le serveur Bobine se relance au redémarrage et après une mise à jour de l'application. L'ouverture automatique de l'écran dépend d'Android (autorisation « Afficher par-dessus d'autres applications », réinitialisée à chaque redémarrage sur certains boîtiers Android TV) : le serveur et les écrans distants fonctionnent déjà, il suffit d'ouvrir l'application pour afficher l'écran local.",
    },
    {
      category: "hardware",
      q: "Quels mini PC et cartes ARM64 (NVIDIA DGX Spark, Raspberry Pi, Orange Pi) sont recommandés ?",
      a: "Sous Linux ARM64, Bobine fonctionne parfaitement sur Raspberry Pi 5 (8 Go / 16 Go), Radxa Rock 5B/5B+ (RK3588), Orange Pi 5 Plus, NVIDIA Jetson Orin Nano Super, ainsi que sur les stations professionnelles NVIDIA DGX Spark (SoC Grace Blackwell GB10 sous DGX OS / Ubuntu ARM64). L'installation se fait en une commande via curl -fsSL https://bobine.fit/install.sh | sudo bash ou via le paquet .deb ARM64.",
    },
    {
      category: "updates",
      q: "Quelle est la différence entre les versions Stable, Bêta et Canary ?",
      a: "La version Stable (ex. Vx.y.z) est la version officielle recommandée pour la production et l'exploitation quotidienne en salle. La Bêta offre un lot de fonctionnalités/correctifs que je sélectionne et publie manuellement quand il est prêt. La Canary offre un accès anticipé continu, reconstruite automatiquement à chaque commit sur la branche principale, sans curation. Les trois canaux partagent les mêmes identifiants d'application, s'installent par-dessus la version existante sans créer de doublon, et vous pouvez revenir à la Stable à tout moment depuis Réglages > Mises à jour sans perte de données ni de médias.",
    },
    {
      category: "updates",
      q: "Comment changer de canal de mise à jour (Stable / Bêta / Canary) sur mon installation ?",
      a: "Sur le panneau d'administration web, rendez-vous dans Réglages > Mises à jour logicielles et choisissez le canal souhaité. Sur une appliance dédiée CLI, vous pouvez également relancer l'installeur avec l'option --channel=stable, --channel=beta ou --channel=canary (ex : curl -fsSL https://bobine.fit/install.sh | sudo bash -s -- --channel=beta).",
    },
    {
      category: "updates",
      q: "Comment installer Bobine et recevoir les mises à jour automatiques sur Linux (Debian / Ubuntu / Mint) ?",
      a: "La méthode recommandée pour les postes de bureau Debian, Ubuntu, Linux Mint, Pop!_OS et Zorin OS est d'ajouter le dépôt APT officiel signé cryptographiquement (https://packages.bobine.fit/debian). En 3 commandes dans votre terminal (import de la clé GPG depuis https://packages.bobine.fit/bobine.gpg, déclaration de la source packages.bobine.fit/debian stable, beta ou canary, puis sudo apt update && sudo apt install bobine), vous recevez automatiquement toutes les futures mises à jour sur x86_64 (amd64) et ARM64 (arm64) via apt upgrade.",
    },
    {
      category: "updates",
      q: "Bobine fonctionne-t-il sur Fedora, RHEL, AlmaLinux ou Rocky Linux, et comment recevoir les mises à jour ?",
      a: `${soon("fedora", "fr")}Oui, sur Fedora et Nobara : un paquet .rpm (x86_64 et aarch64) et un dépôt dnf signé (https://packages.bobine.fit/fedora). Deux commandes, ${fedoraCommands().addRepo} puis ${fedoraCommands().install}, et ${fedoraCommands().upgrade} met ensuite Bobine à jour avec le système ; bobine-beta.repo et bobine-canary.repo suivent les canaux Bêta et Canary. Fedora ne fournit qu'un ffmpeg amputé de codecs : ajoutez RPM Fusion pour le ffmpeg complet. Sur RHEL, AlmaLinux et Rocky Linux (version 10 ou plus récente uniquement, non couvertes par la CI), passez par EPEL (ffmpeg limité sans RPM Fusion). Les distributions immuables comme Bazzite ne conviennent pas à l'appliance kiosque. Empreinte de la clé : ${SIGNING_KEY_FINGERPRINT}.`,
    },
    {
      category: "updates",
      q: "Bobine fonctionne-t-il sur Arch Linux, EndeavourOS, CachyOS ou Manjaro, et comment recevoir les mises à jour ?",
      a: `${soon("arch", "fr")}Oui, sur Arch Linux, EndeavourOS et CachyOS : un paquet pacman (x86_64 et aarch64) et un dépôt [bobine] signé (https://packages.bobine.fit/arch). Importez et approuvez la clé, ajoutez la section [bobine] à /etc/pacman.conf (SigLevel = Required DatabaseOptional), puis ${archCommands().install} ; ${archCommands().upgrade} met ensuite Bobine à jour avec le système. Manjaro a des dépôts décalés de ceux d'Arch : à vos risques. Empreinte de la clé : ${SIGNING_KEY_FINGERPRINT}.`,
    },
    {
      category: "updates",
      q: "Comment fonctionne la désinstallation automatique en 1 clic ?",
      a: "Dans Réglages > Zone de danger, la désinstallation automatique déclenche le désinstalleur natif de votre plateforme (Polkit sur Linux .deb/.rpm/.pkg.tar.zst, Inno Setup sur Windows, purge des LaunchAgents sous macOS, Intent Android, script bobine-uninstall sous Debian headless). L'opération nécessite la saisie explicite du mot de passe de sécurité « DÉSINSTALLER » pour éviter toute fausse manipulation.",
    },
    {
      category: "hardware",
      q: "Comment la Console Régie Coach (/coach) aide-t-elle les éducateurs sportifs ?",
      a: "La console coach responsive s'adapte à tous les écrans : sur tablette paysage ou PC, elle offre un pupitre audio avec boutons 64px, un minuteur précis interpolé à 10 Hz, le retour vidéo direct Stage Monitor 16:9 de la salle et une palette d'ambiances visuelles 1-clic. Sur smartphone, elle bascule en vue monoposte avec tiroirs tactiles rétractables. Elle gère l'assignation d'ambiances vidéo différentes par piste musicale et démarre toujours en pause sécurisée pour laisser le coach s'installer.",
    },
    {
      q: "Quels navigateurs web sont pris en charge par famille (Chromium, Gecko/Firefox, WebKit/Safari) ?",
      a: "Bobine prend en charge les trois grandes familles de moteurs web pour l'administration, la régie coach (/coach) et les écrans réseau (/cinema, /kiosk, /radio) : 1) Famille Chromium / Blink (Google Chrome, Chromium, Microsoft Edge, Brave, Vivaldi sur Linux, Windows, macOS, Android et Google Book) avec Screen Wake Lock natif et décodage matériel ; 2) Famille Gecko (Mozilla Firefox 157+ sur bureau, Firefox pour Android, Firefox ESR et Tor Browser) vérifiée de bout en bout par des tests automatiques (reprise d'envoi de fichiers après coupure réseau, flux HTTP Range, transcodage H.264 automatique à la demande si une vidéo HEVC/10 bits n'est pas décodée matériellement) ; 3) Famille WebKit (Apple Safari sur macOS, iPadOS et iOS) idéale pour piloter le pupitre coach depuis un iPhone, un iPad ou un Mac. Un diagnostic local du navigateur est intégré dans les Réglages de Bobine.",
      category: "hardware",
    },
    {
      category: "security",
      q: "Comment signaler une faille de sécurité de façon confidentielle ?",
      a: "Écrivez à security@bobine.fit ou ouvrez un signalement privé de vulnérabilité sur le dépôt GitHub de Bobine (onglet Sécurité). Chiffrez tout rapport contenant des détails exploitables avec notre clé publique OpenPGP (empreinte 23CA D324 C507 FB0F 97E6 AECA 6E4C 020E F8BD FEB2, à télécharger sur https://bobine.fit/.well-known/security.asc ou à découvrir avec gpg --locate-keys security@bobine.fit) et vérifiez l'empreinte avant d'envoyer. Créez votre propre paire de clés (gpg --quick-generate-key \"Votre Nom <vous@exemple.org>\" future-default default 2y) et joignez votre clé publique : nous répondrons chiffré. Politique complète, périmètre et délais : https://security.bobine.fit/fr/.",
    },
  ],
  en: [
    {
      category: "license",
      q: "Is Bobine truly 100% free with no recurring fees?",
      a: "Yes. Free and open-source software under the copyleft AGPL-3.0 license. Zero subscription fees, zero royalties per screen, and no user accounts. Your only investment is standard refurbished hardware.",
    },
    {
      category: "hardware",
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
      a: "A standard x86-64 or ARM64 mini PC, from an entry-level refurbished unit (Dell Wyse 5070, HP EliteDesk, Beelink N100) to a fanless industrial mini PC, with 8-16GB RAM and a standard HDMI display. Bobine also runs on Snapdragon ARM laptops, Apple Silicon Mac minis, Android tablets, or Google Books.",
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
      category: "hardware",
      q: "Is Bobine compatible with Qualcomm Snapdragon ARM laptops (Windows ARM & Linux ARM)?",
      a: "Yes. Bobine provides a native Windows 11 ARM64 installer (Bobine-Setup-x.y.z-arm64.exe) and a Debian/Ubuntu ARM64 package (bobine_x.y.z_arm64.deb). Snapdragon X Elite and Snapdragon X Plus processors deliver record battery life and ultra-low 5W-10W power draw during continuous playback.",
    },
    {
      category: "hardware",
      q: "Does Bobine work on Google Book laptops (Aluminium OS)?",
      a: "Yes. Bobine runs natively in fullscreen on Google Book laptops (Aluminium OS / Android convergence) using the Bobine-x.y.z.apk package with full MediaCodec/Vulkan hardware acceleration, and will soon be available directly from the Google Play Store.",
    },
    {
      category: "hardware",
      q: "Does Bobine work on Android TV, Google TV and 32-bit boxes (Xiaomi)?",
      a: `Yes, from Android ${ANDROID.minVersion} (API ${ANDROID.minApi}) onwards, like every Bobine Android package. Bobine-TV-x.y.z.apk is universal: it installs on 64-bit boxes as well as on those with a 32-bit system (armeabi-v7a ABI list), as is the case for several Xiaomi boxes despite their 64-bit processor. If the installation fails with INSTALL_FAILED_NO_MATCHING_ABIS, download the package again from the download page: older copies did not cover 32-bit systems. A box still running Android 11 or 12 cannot install Bobine.`,
    },
    {
      category: "offline",
      q: "How do I add subtitles to a video class?",
      a: "From the library, add an .srt or .vtt file (2 MB maximum) to the class, or attach it to the video at import. .srt files are converted to WebVTT, the language is recognised from the file name (class.fr.srt, class.en.vtt) and several languages can coexist for one class. Subtitles stay stored on your machine and are switched on from the subtitles menu of /cinema and the library player. From the admin you choose the track shown on the studio screen; the choice is applied live to the kiosk and /cinema.",
    },
    {
      category: "offline",
      q: "How do I add chapters to a class?",
      a: "From the class panel in the library: type them in, import a file (JSON, chapter-type WebVTT or text with one \"05:00 Title\" line per chapter), extract the chapters embedded in the video file, or export them as JSON. An invalid file is rejected with the offending line, and nothing is changed. Chapters appear as marks on the progress bar, as a list to jump from chapter to chapter and as an on-screen banner when the chapter changes.",
    },
    {
      category: "hardware",
      q: "Does Bobine restart by itself after an Android device reboot?",
      a: "Yes, if Settings > \"Device startup\" is on: the Bobine server restarts after a reboot and after an app update. Opening the screen automatically depends on Android (the \"Display over other apps\" permission, reset at every reboot on some Android TV boxes): the server and the remote screens already work, just open the app to show the local screen.",
    },
    {
      category: "hardware",
      q: "Which ARM64 mini PCs and single-board computers (NVIDIA DGX Spark, Raspberry Pi, Orange Pi) are supported?",
      a: "Under Linux ARM64, Bobine runs smoothly on Raspberry Pi 5 (8GB / 16GB), Radxa Rock 5B/5B+ (RK3588), Orange Pi 5 Plus, NVIDIA Jetson Orin Nano Super, and workstation-class NVIDIA DGX Spark units (Grace Blackwell GB10 SoC running DGX OS / Ubuntu ARM64). Setup takes 1 command via curl -fsSL https://bobine.fit/install.sh | sudo bash or via the ARM64 .deb package.",
    },
    {
      category: "updates",
      q: "What is the difference between the Stable, Beta and Canary channels?",
      a: "The Stable release (e.g. Vx.y.z) is the official tested build recommended for production gym playout. Beta offers a batch of features/fixes I select and publish manually when ready. Canary provides continuous early access, rebuilt automatically on every commit to the main branch, with no curation. All three share identical system application IDs, install directly over your current version without creating duplicate apps, and allow reverting back to Stable anytime from Settings > Software Updates without data loss.",
    },
    {
      category: "updates",
      q: "How do I switch between Stable, Beta and Canary update channels on my setup?",
      a: "From the web administration dashboard, go to Settings > Software Updates and pick the channel you want. On a dedicated headless CLI appliance, you can run the installer with --channel=stable, --channel=beta or --channel=canary (e.g. curl -fsSL https://bobine.fit/install.sh | sudo bash -s -- --channel=beta).",
    },
    {
      category: "updates",
      q: "How do I install Bobine and receive automated updates on Linux (Debian / Ubuntu / Mint)?",
      a: "The recommended method for Debian, Ubuntu, Linux Mint, Pop!_OS and Zorin OS desktop machines is adding the official cryptographically signed APT repository (https://packages.bobine.fit/debian). In 3 simple terminal commands (import the official GPG key from https://packages.bobine.fit/bobine.gpg, add the packages.bobine.fit/debian stable, beta or canary source, and run sudo apt update && sudo apt install bobine), you receive seamless automated updates on both x86_64 (amd64) and ARM64 (arm64) via your standard system package manager (apt upgrade).",
    },
    {
      category: "updates",
      q: "Does Bobine run on Fedora, RHEL, AlmaLinux or Rocky Linux, and how do I get updates?",
      a: `${soon("fedora", "en")}Yes, on Fedora and Nobara: an .rpm package (x86_64 and aarch64) and a signed dnf repository (https://packages.bobine.fit/fedora). Two commands, ${fedoraCommands().addRepo} then ${fedoraCommands().install}, and ${fedoraCommands().upgrade} then updates Bobine along with the system; bobine-beta.repo and bobine-canary.repo follow the Beta and Canary channels. Fedora only ships a codec-stripped ffmpeg: add RPM Fusion for the full ffmpeg. On RHEL, AlmaLinux and Rocky Linux (version 10 or newer only, not covered by CI), go through EPEL (limited ffmpeg without RPM Fusion). Immutable distributions such as Bazzite do not suit the kiosk appliance. Key fingerprint: ${SIGNING_KEY_FINGERPRINT}.`,
    },
    {
      category: "updates",
      q: "Does Bobine run on Arch Linux, EndeavourOS, CachyOS or Manjaro, and how do I get updates?",
      a: `${soon("arch", "en")}Yes, on Arch Linux, EndeavourOS and CachyOS: a pacman package (x86_64 and aarch64) and a signed [bobine] repository (https://packages.bobine.fit/arch). Import and trust the key, add the [bobine] section to /etc/pacman.conf (SigLevel = Required DatabaseOptional), then ${archCommands().install}; ${archCommands().upgrade} then updates Bobine along with the system. Manjaro's repositories lag behind Arch's: at your own risk. Key fingerprint: ${SIGNING_KEY_FINGERPRINT}.`,
    },
    {
      category: "updates",
      q: "How does the 1-click automatic uninstaller work?",
      a: "In Settings > Danger Zone, automatic uninstallation triggers the native uninstaller for your platform (Polkit on Linux .deb/.rpm/.pkg.tar.zst, Inno Setup on Windows, LaunchAgent purge on macOS, Android intent, or the bobine-uninstall script on headless Debian). The operation requires explicitly typing the confirmation keyword 'UNINSTALL' ('DÉSINSTALLER') to prevent accidental removals.",
    },
    {
      q: "Which web browsers are supported by engine family (Chromium, Gecko/Firefox, WebKit/Safari)?",
      a: "Bobine supports all three major browser engine families for administration, the coach console (/coach), and network screens (/cinema, /kiosk, /radio): 1) Chromium / Blink family (Google Chrome, Chromium, Microsoft Edge, Brave, Vivaldi on Linux, Windows, macOS, Android, and Google Book) with native Screen Wake Lock and hardware decoding; 2) Gecko family (Mozilla Firefox 157+ on desktop, Firefox for Android, Firefox ESR, and Tor Browser) verified end-to-end by automated tests (resumable file uploads after network drops, HTTP Range video streams, on-demand H.264 fallback transcoding when a browser cannot hardware-decode HEVC/10-bit); 3) WebKit family (Apple Safari on macOS, iPadOS, and iOS), ideal for controlling the coach desk from an iPhone, iPad, or Mac. A local browser diagnostic tool is built into Bobine Settings.",
      category: "hardware",
    },
    {
      category: "security",
      q: "How do I report a security flaw confidentially?",
      a: "Write to security@bobine.fit or open a private vulnerability report on the Bobine GitHub repository (Security tab). Encrypt any report containing exploitable details with our OpenPGP public key (fingerprint 23CA D324 C507 FB0F 97E6 AECA 6E4C 020E F8BD FEB2, download it at https://bobine.fit/.well-known/security.asc or discover it with gpg --locate-keys security@bobine.fit) and check the fingerprint before sending. Create your own key pair (gpg --quick-generate-key \"Your Name <you@example.org>\" future-default default 2y) and attach your public key: we will reply encrypted. Full policy, scope and timelines: https://security.bobine.fit/.",
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
      issue: "Le port 1903 est déjà pris",
      cause: "Une autre application ou une ancienne instance de Bobine l'occupe",
      solution: "Bobine se replie seul sur un port libre. Sur l'appliance, où le port est fixe, libérez-le avec 'sudo fuser -k 1903/tcp' puis relancez le service.",
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
      issue: "Port 1903 already in use",
      cause: "Another application or a previous Bobine instance holds it",
      solution: "Bobine falls back to a free port on its own. On the appliance, where the port is fixed, free it with 'sudo fuser -k 1903/tcp' and restart the service.",
    },
    {
      issue: "Restoring a ZIP backup fails",
      cause: "Corrupted archive or exported from an incompatible version",
      solution: "Check integrity with 'sqlite3 bobine.db \"PRAGMA integrity_check;\"'. Export a fresh backup from the admin panel if the archive is corrupted.",
    },
  ],
};
