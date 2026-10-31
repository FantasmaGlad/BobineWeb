import type { Locale } from "@/lib/i18n";
import type { RouteId } from "@/lib/siteMap";
import type { IconName } from "@/components/ui/Icon";
import type { AssetKey } from "@/lib/assets";

type Localized = Record<Locale, string>;
type Paragraph = { title: Localized; text: Localized };
type SourceId = keyof typeof COMPARE_SOURCES;
export type CompareRow = { label: string; values: readonly string[] };

export interface Comparison {
  slug: string;
  routeId: RouteId;
  name: string;
  icon: IconName;
  brand: AssetKey;
  title: Localized;
  description: Localized;
  intro: Localized;
  focus: Localized;
  columns: readonly string[];
  rows: readonly { label: Localized; values: readonly Localized[]; sources: readonly SourceId[] }[];
  sections: readonly Paragraph[];
  faq: readonly { q: Localized; a: Localized }[];
  sources: readonly SourceId[];
}

export const COMPARE_SOURCES = {
  lesmills: {
    label: "Les Mills · Virtual support",
    url: "https://www.lesmills.com/us/clubs-and-facilities/tools-resources/support",
    checked: "2026-10-25",
  },
  wexerOffline: {
    label: "Wexer · Virtual Player Content Storage",
    url: "https://helpcenter.wexer.com/hc/en-us/articles/25796557175447-Virtual-Player-Content-Storage",
    checked: "2026-10-25",
  },
  wexerConnect: {
    label: "Wexer · Virtual Connect",
    url: "https://wexer.com/blog/turn-your-virtual-studio-into-a-showcase-for-your-own-content-for-free/",
    checked: "2026-10-25",
  },
  fod: {
    label: "Fitness On Demand · Platform",
    url: "https://www.fitnessondemand247.com/",
    checked: "2026-10-25",
  },
  radical: {
    label: "Radical Virtual · Programs",
    url: "https://www.radicalfitness.net/virtual/english/programs.html",
    checked: "2026-10-25",
  },
  yako: {
    label: "L’Orange bleue · Yako",
    url: "https://coach.lorangebleue.fr/",
    checked: "2026-10-25",
  },
  anthias: {
    label: "Anthias · Digital signage",
    url: "https://anthias.screenly.io/",
    checked: "2026-10-25",
  },
  anthiasSchedule: {
    label: "Anthias · Asset scheduling",
    url: "https://anthias.screenly.io/docs/asset-scheduling/",
    checked: "2026-10-25",
  },
} as const;

const text = (fr: string, en: string): Localized => ({ fr, en });
const ownContent = text(
  "Vos propres vidéos et musiques (MP4, WebM, MP3, FLAC), ou coexistence sur le même écran avec un catalogue sous licence.",
  "Your own videos and music (MP4, WebM, MP3, FLAC), or coexistence on the same screen alongside a licensed catalog.",
);
const localPlayback = text(
  "100 % autonome en local : lecture directe depuis la machine et télécommande web LAN depuis tout navigateur sans internet.",
  "100% local autonomy: direct playback from the machine and LAN web remote control from any browser without internet.",
);
const crossOsSupport = text(
  "5 OS natifs : Windows 10/11 (x86_64 & ARM64), macOS (Apple Silicon), Linux (.deb, .rpm, pacman), Android & Android TV.",
  "5 native OSes: Windows 10/11 (x86_64 & ARM64), macOS (Apple Silicon), Linux (.deb, .rpm, pacman), Android & Android TV.",
);
const bobineLicense = text(
  "Logiciel libre AGPL-3.0, 0 € d’abonnement logiciel. Réutilisez votre matériel existant (Mini PC, Mac, TV).",
  "Free AGPL-3.0 software, €0 software subscription. Reuse your existing hardware (Mini PC, Mac, TV).",
);

export const BOBINE_VALUE_PILLARS: readonly {
  id: string;
  title: Localized;
  body: Localized;
  osIcons?: readonly AssetKey[];
}[] = [
  {
    id: "os",
    title: text("Ultra-compatibilité inter-OS", "Cross-OS native compatibility"),
    body: text(
      "Là où Anthias (Screenly) cible un Raspberry Pi / Debian dédié et où les catalogues imposent souvent un iPad ou boîtier propriétaire, Bobine tourne nativement sur Windows, macOS, Linux, Android et Android TV.",
      "Where Anthias (Screenly) targets a dedicated Raspberry Pi / Debian setup and catalogs often require a proprietary box or iPad, Bobine runs natively on Windows, macOS, Linux, Android and Android TV.",
    ),
    osIcons: ["os.windows", "os.macos", "os.linux", "os.android", "os.androidtv"],
  },
  {
    id: "local",
    title: text("100 % autonome hors-ligne", "100% offline autonomy"),
    body: text(
      "Aucun cloud requis : planning hebdomadaire, kiosque tactile adhérent, radio d’ambiance entre les cours et télécommande coach en réseau local continuent de fonctionner même sans internet.",
      "No cloud required: weekly schedule, member touch kiosk, background radio between classes and LAN coach remote keep working even without internet.",
    ),
  },
  {
    id: "freedom",
    title: text("Liberté de contenu & d’équipement", "Content & hardware freedom"),
    body: text(
      "Diffusez les cours produits par vos coachs ou vos licences internes sans abonnement logiciel récurrent (AGPL-3.0), sur le Mini PC, Mac ou téléviseur de votre choix.",
      "Play classes produced by your coaches or in-house licenses with zero recurring software subscription (AGPL-3.0), on the Mini PC, Mac or TV of your choice.",
    ),
  },
];

export const comparisons = [
  {
    slug: "les-mills-cinema", routeId: "compare-lesmills", name: "Les Mills Cinema & Virtual", icon: "video", brand: "compare.lesmills",
    title: text("Bobine et Les Mills : comparer les usages", "Bobine and Les Mills: compare studio needs"),
    description: text("Comparez la régie locale Bobine aux offres Les Mills : contenus, programmation, matériel et budget. Sources officielles et points à vérifier.", "Compare local Bobine playout with Les Mills: content, scheduling, hardware and budget. Read official sources and check what your studio needs."),
    intro: text("Vous avez déjà vos vidéos, ou vous cherchez un catalogue de cours sous licence ? C’est la distinction clé entre une régie universelle multi-OS comme Bobine et une offre de contenus Les Mills.", "Do you already have workout videos, or do you need a licensed class catalog? That is the key distinction between universal cross-OS playout with Bobine and a Les Mills content offering."),
    focus: text("Régie multi-OS vs catalogue sous licence", "Cross-OS playout vs licensed catalog"),
    columns: ["Bobine", "Les Mills Virtual"],
    rows: [
      { label: text("Systèmes & matériel", "OS & hardware"), values: [crossOsSupport, text("Écosystème Apple (iPad dédié) et équipement certifié selon l’offre Virtual ou Cinema retenue.", "Apple ecosystem (dedicated iPad) and certified hardware depending on your chosen Virtual or Cinema offering.")], sources: ["lesmills"] },
      { label: text("Contenus", "Content"), values: [ownContent, text("Programmes Les Mills ; vérifier le catalogue et les droits inclus dans l’offre choisie.", "Les Mills programs; check the catalog and rights included with your chosen offering.")], sources: ["lesmills"] },
      { label: text("Programmation", "Scheduling"), values: [text("Grille hebdomadaire, lancement à la demande et radio d’ambiance automatique entre les cours.", "Weekly timetable, on-demand playback and automatic background radio between classes."), text("Le Virtual Scheduler propose une grille mêlant cours virtuels et cours en direct.", "Virtual Scheduler supports a timetable combining virtual and live classes.")], sources: ["lesmills"] },
      { label: text("Borne à la demande", "On-demand kiosk"), values: [text("Mode kiosque adhérent intégré et télécommande web LAN depuis tout appareil.", "Built-in member kiosk mode and LAN web remote from any device."), text("Sélection de cours sur l’iPad Virtual pendant les créneaux à la demande.", "Class selection on the Virtual iPad during on-demand slots.")], sources: ["lesmills"] },
      { label: text("Lecture et connexion", "Playback and connection"), values: [localPlayback, text("Contenus téléchargés dans l’application ; connexion requise pour sa mise à jour. Confirmer les conditions hors ligne de votre offre.", "Content downloads into the app; updating it requires internet. Confirm your offering’s offline conditions.")], sources: ["lesmills"] },
      { label: text("Budget", "Budget"), values: [bobineLicense, text("Demander les conditions de l’offre Virtual ou Cinema choisie ; aucun tarif supposé ici.", "Request terms for your chosen Virtual or Cinema offering; no rates are assumed here.")], sources: [] },
    ],
    sections: [
      { title: text("Choisir selon le contenu à diffuser", "Choose around the content you need"), text: text("Bobine transforme n’importe quel PC, Mac ou Android TV en régie autonome pour vos propres vidéos, tandis que Les Mills fournit un catalogue de cours chorégraphiés sous licence.", "Bobine turns any PC, Mac or Android TV into an autonomous playout studio for your own videos, whereas Les Mills supplies a licensed catalog of choreographed classes.") },
      { title: text("Vérifier l’offre précise", "Check the specific offering"), text: text("Cinema, Virtual et les autres offres Les Mills ne sont pas interchangeables. La source ci-dessous décrit Virtual. Pour un projet Cinema, faites confirmer les équipements, les droits et l’assistance par votre interlocuteur.", "Cinema, Virtual and other Les Mills offerings are distinct. The source below describes Virtual. For a Cinema project, confirm equipment, rights and support with your supplier.") },
    ],
    faq: [
      { q: text("Bobine inclut-il les cours Les Mills ?", "Does Bobine include Les Mills classes?"), a: text("Non. Bobine est une régie de diffusion. Les contenus et les autorisations nécessaires sont à fournir séparément par la salle.", "No. Bobine is playout software. The club must separately supply content and the necessary permissions.") },
      { q: text("Les Mills Virtual propose-t-il aussi du cours à la demande ?", "Does Les Mills Virtual also offer on-demand classes?"), a: text("Oui. Son support décrit une sélection de cours sur iPad et des créneaux à la demande. Ce n’est pas une fonction exclusive à Bobine.", "Yes. Its support documentation describes iPad class selection and on-demand slots. This is not exclusive to Bobine.") },
    ],
    sources: ["lesmills"],
  },
  {
    slug: "wexer-fitness-on-demand", routeId: "compare-wexer", name: "Wexer & Fitness On Demand", icon: "display", brand: "compare.wexer",
    title: text("Bobine, Wexer et Fitness On Demand : comparer", "Bobine, Wexer and Fitness On Demand compared"),
    description: text("Comparez Bobine, Wexer et Fitness On Demand : catalogue, contenus propres, lecture locale et budget. Consultez les sources et préparez votre essai.", "Compare Bobine, Wexer and Fitness On Demand: catalogs, custom content, local playback and budget. Check official sources and plan your studio trial."),
    intro: text("Comparez l’autonomie matérielle multi-OS de Bobine avec les plateformes de catalogues intégrés comme Wexer et Fitness On Demand.", "Compare Bobine’s cross-OS hardware autonomy with integrated catalog platforms such as Wexer and Fitness On Demand."),
    focus: text("Autonomie multi-OS vs plateformes de catalogues", "Cross-OS autonomy vs catalog platforms"),
    columns: ["Bobine", "Wexer Virtual", "Fitness On Demand"],
    rows: [
      { label: text("Systèmes & matériel", "OS & hardware"), values: [crossOsSupport, text("Virtual Player dédié et écrans de contrôle selon la configuration Wexer.", "Dedicated Virtual Player and control screens per Wexer configuration."), text("Équipements et tablettes selon la plateforme Fitness On Demand retenue.", "Hardware and tablets depending on the chosen Fitness On Demand platform.")], sources: ["wexerOffline", "fod"] },
      { label: text("Catalogue", "Catalog"), values: [ownContent, text("Collection de cours Wexer.", "Wexer class collection."), text("Catalogue de cours et plusieurs plateformes selon les besoins du club.", "Class catalog and several platforms for different club needs.")], sources: ["wexerOffline", "fod"] },
      { label: text("Contenus propres", "Custom content"), values: [text("Import direct de vos vidéos et fichiers audio sur disque local, sans quota cloud.", "Direct import of your video and audio files on local disk, with no cloud quota."), text("Virtual Connect permet d’importer les contenus produits par votre salle.", "Virtual Connect lets clubs upload their own content."), text("Personnalisation de marque et contenus personnalisés selon la plateforme ; préciser vos besoins lors de la démonstration.", "Brand customization and custom content vary by platform; specify your needs during the demo.")], sources: ["wexerConnect", "fod"] },
      { label: text("Sans internet", "Without internet"), values: [localPlayback, text("Les cours déjà stockés sur le Virtual Player restent disponibles hors ligne.", "Classes already stored on the Virtual Player remain available offline."), text("Faire confirmer le mode hors ligne de l’équipement et de l’offre retenus ; non établi par la page de présentation.", "Confirm offline behavior for your chosen device and offering; the overview page does not establish it.")], sources: ["wexerOffline", "fod"] },
      { label: text("Périmètre", "Scope"), values: [text("Régie double écran, planning, kiosque tactile, radio d’ambiance et télécommande LAN.", "Dual-screen playout, timetable, touch kiosk, background radio and LAN remote."), text("Cours virtuels et contenus du club via Virtual Connect.", "Virtual classes and club content through Virtual Connect."), text("Cours en studio, application, affichage dynamique et écrans tactiles selon la plateforme.", "Studio classes, an app, digital signage and touchscreens depending on the platform.")], sources: ["wexerConnect", "fod"] },
      { label: text("Budget", "Budget"), values: [bobineLicense, text("Demander un devis adapté au club et aux services souhaités.", "Request a quote for your club and required services."), text("Comparer l’offre et ses services sur devis ; aucun montant repris dans ce comparatif.", "Compare the offering and services in a quote; no price is reproduced here.")], sources: [] },
    ],
    sections: [
      { title: text("Tester plutôt que supposer", "Test rather than assume"), text: text("Demandez une démonstration avec vos propres vidéos et une coupure internet contrôlée. Notez les médias réellement disponibles, les commandes encore accessibles et le comportement au redémarrage.", "Request a demo with your own videos and a controlled internet outage. Record which media remain available, which controls still work and how playback behaves after restart.") },
      { title: text("Comparer un budget complet", "Compare a complete budget"), text: text("Incluez le matériel, les contenus, l’assistance, l’installation et la maintenance. Un logiciel sans abonnement vous laisse libre du choix de vos machines.", "Include hardware, content, support, installation and maintenance. Subscription-free software leaves you free to choose your own hardware.") },
    ],
    faq: [
      { q: text("Wexer dépend-il uniquement du streaming ?", "Does Wexer rely only on streaming?"), a: text("Non. La documentation du Virtual Player décrit un stockage local et la lecture hors ligne des cours déjà téléchargés.", "No. Virtual Player documentation describes local storage and offline playback of classes already downloaded.") },
      { q: text("La latence de Bobine est-elle garantie ?", "Is Bobine latency guaranteed?"), a: text("Elle dépend du matériel, des fichiers et du réseau local : comme les vidéos sont lues directement sur le disque local sans tampon cloud, le lancement est immédiat sur un Mini PC ou Mac moderne.", "It depends on hardware, files and the local network: since videos play directly from local disk without cloud buffering, start-up is immediate on a modern Mini PC or Mac.") },
    ],
    sources: ["wexerOffline", "wexerConnect", "fod"],
  },
  {
    slug: "radical-fitness-yako", routeId: "compare-radical", name: "Radical Fitness & Yako", icon: "layers", brand: "compare.radical",
    title: text("Bobine, Radical Fitness et Yako : quels rôles ?", "Bobine, Radical Fitness and Yako: different roles"),
    description: text("Distinguez la régie Bobine, les programmes Radical Fitness et les cours Yako du réseau L’Orange bleue. Comparez contenus, exploitation et budget.", "Distinguish Bobine playout, Radical Fitness programs and Yako classes from L’Orange bleue. Compare content, operation and the budget for your club."),
    intro: text("Un moteur de diffusion universel (Bobine), un catalogue de programmes (Radical Fitness) et une offre de franchise (Yako) répondent à des rôles complémentaires.", "A universal playout engine (Bobine), a program catalog (Radical Fitness) and a franchise offering (Yako) serve complementary roles."),
    focus: text("Moteur de diffusion vs programmes & réseaux", "Playout engine vs programs & networks"),
    columns: ["Bobine", "Radical Virtual", "Yako / L’Orange bleue"],
    rows: [
      { label: text("Nature de l’offre", "Type of offering"), values: [text("Régie logicielle multi-OS pour automatiser la diffusion des médias de votre salle.", "Cross-OS playout software to automate playback of your club’s media."), text("Offre de cours virtuels Radical Fitness.", "Radical Fitness virtual class offering."), text("Programmes de cours collectifs du réseau L’Orange bleue.", "Group fitness programs of the L’Orange bleue network.")], sources: ["radical", "yako"] },
      { label: text("Systèmes compatibles", "Supported OSes"), values: [crossOsSupport, text("Faire préciser le lecteur matériel ou l’application préconisés dans l’offre Virtual.", "Confirm the recommended hardware player or app in the Virtual offering."), text("Outils pédagogiques destinés aux clubs affiliés au réseau.", "Educational tools intended for clubs affiliated with the network.")], sources: ["radical", "yako"] },
      { label: text("Contenus", "Content"), values: [ownContent, text("Catalogue de programmes et nouvelles vidéos trimestrielles annoncées par l’éditeur.", "Program catalog with quarterly video updates announced by the provider."), text("Cours préchorégraphiés, renouvelés tous les deux mois selon le réseau.", "Pre-choreographed classes renewed every two months according to the network.")], sources: ["radical", "yako"] },
      { label: text("Organisation", "Organization"), values: [text("Import glisser-déposer, grille hebdomadaire, kiosque tactile et télécommande LAN.", "Drag-and-drop import, weekly timetable, touch kiosk and LAN remote."), text("Faire préciser le lecteur, les droits et l’accompagnement dans l’offre Virtual.", "Confirm the player, rights and support included in the Virtual offering."), text("La plateforme pédagogique s’adresse aux coachs du réseau.", "The educational platform is intended for the network’s coaches.")], sources: ["radical", "yako"] },
      { label: text("Budget", "Budget"), values: [bobineLicense, text("Consulter l’éditeur pour les conditions de votre offre.", "Ask the provider for the terms of your offering."), text("Les conditions du réseau ne constituent pas un tarif de régie vidéo comparable.", "Network terms are not a directly comparable video playout price.")], sources: [] },
    ],
    sections: [
      { title: text("Partir de votre projet de salle", "Start with your club’s project"), text: text("Si vous produisez vos propres cours ou disposez de vidéos autorisées, Bobine automatise leur diffusion sur n’importe quel OS. Si vous cherchez des programmes préchorégraphiés renouvelés par un tiers, évaluez le catalogue proposé.", "If you produce your own classes or hold licensed videos, Bobine automates their playback on any OS. If you need pre-choreographed programs renewed by a provider, assess the catalog offered.") },
      { title: text("Ne pas confondre outil et autorisation", "Distinguish software from permission"), text: text("Installer une régie ne transfère pas les droits d’un programme sportif, d’une vidéo ou d’une musique. Vérifiez auprès du détenteur des contenus ce que votre contrat permet de diffuser.", "Installing playout software does not transfer rights to fitness programs, videos or music. Check with the content owner what your agreement allows you to show.") },
    ],
    faq: [
      { q: text("Yako est-il un logiciel concurrent de Bobine ?", "Is Yako competing software?"), a: text("Non. Yako désigne des programmes de cours du réseau L’Orange bleue. Bobine est un logiciel qui organise la diffusion de médias fournis par la salle.", "No. Yako refers to class programs of the L’Orange bleue network. Bobine organizes playback of media supplied by a club.") },
      { q: text("Bobine remplace-t-il un catalogue de cours ?", "Does Bobine replace a class catalog?"), a: text("Non. Bobine est le lecteur et planificateur de studio : vous fournissez vos contenus et conservez la maîtrise totale de votre matériel.", "No. Bobine is the studio player and scheduler: you supply your content and keep full control over your hardware.") },
    ],
    sources: ["radical", "yako"],
  },
  {
    slug: "affichage-dynamique-fitness", routeId: "compare-signage", name: "Anthias (Screenly OSE)", icon: "cpu", brand: "compare.signage",
    title: text("Bobine et Anthias : régie ou affichage dynamique ?", "Bobine and Anthias: playout or digital signage?"),
    description: text("Comparez Bobine et Anthias pour les écrans d’une salle : programmation, médias locaux et usages. Distinguez régie fitness et affichage dynamique.", "Compare Bobine and Anthias for gym screens: scheduling, local media and use cases. Distinguish fitness playout from general purpose digital signage."),
    intro: text("Face à Anthias (ex-Screenly OSE), la proposition de valeur de Bobine tient en deux points : une compatibilité native sur 5 systèmes d’exploitation et un ensemble de fonctions conçues spécifiquement pour une salle de sport.", "Compared with Anthias (formerly Screenly OSE), Bobine’s value proposition comes down to two strengths: native compatibility across 5 operating systems and features purpose-built for fitness studios."),
    focus: text("Ultra-compatibilité inter-OS & régie studio vs affichage d’accueil", "Cross-OS compatibility & studio playout vs lobby signage"),
    columns: ["Bobine", "Anthias (ex-Screenly OSE)"],
    rows: [
      { label: text("Compatibilité OS", "OS compatibility"), values: [crossOsSupport, text("Conçu pour Raspberry Pi et Debian / conteneurs dédiés uniquement (pas d’application native Windows, macOS, Android ou Android TV).", "Designed for Raspberry Pi and dedicated Debian / containers only (no native Windows, macOS, Android or Android TV app).")], sources: ["anthias"] },
      { label: text("Usage principal", "Primary use"), values: [text("Régie de cours vidéo et audio double écran, kiosque tactile adhérent, télécommande coach LAN et radio d’ambiance.", "Dual-screen video/audio class playout, member touch kiosk, LAN coach remote and background radio."), text("Affichage en boucle d’images, de vidéos et de pages web d’information.", "Looping display of images, videos and informational web pages.")], sources: ["anthias"] },
      { label: text("Planification", "Scheduling"), values: [text("Grille hebdomadaire de cours collectifs, lancement à la demande par les adhérents et reprise automatique de la radio.", "Weekly group-class timetable, member on-demand launch and automatic background radio resume."), text("Plages horaires et jours de la semaine par média, avec dates de début et de fin.", "Per-asset time windows and weekdays, plus start and end dates.")], sources: ["anthiasSchedule"] },
      { label: text("Médias et réseau", "Media and network"), values: [localPlayback, text("Fichiers importés ou URL ; les besoins réseau varient selon le média affiché.", "Uploaded files or URLs; network needs vary with the displayed content.")], sources: ["anthias"] },
      { label: text("Budget", "Budget"), values: [bobineLicense, text("Projet libre sans abonnement annoncé ; matériel dédié (Raspberry Pi / PC Linux) et exploitation à prévoir.", "Open-source project advertised without subscriptions; dedicated hardware (Raspberry Pi / Linux PC) and operation required.")], sources: ["anthias"] },
    ],
    sections: [
      { title: text("Pourquoi l’inter-compatibilité OS change tout", "Why cross-OS compatibility changes everything"), text: text("Anthias (Screenly OSE) impose de dédier un Raspberry Pi ou une machine Debian à l’affichage. Bobine s’installe directement en 1 clic sur le PC Windows existant de l’accueil, un Mac mini, un Mini PC Linux, une tablette Android ou directement sur une Smart TV Android TV en salle de cours.", "Anthias (Screenly OSE) requires dedicating a Raspberry Pi or Debian machine to signage. Bobine installs in 1 click directly on your existing reception Windows PC, a Mac mini, a Linux Mini PC, an Android tablet or directly on an Android TV in the studio.") },
      { title: text("Deux outils complémentaires dans un même club", "Two complementary tools in the same club"), text: text("Un afficheur généraliste comme Anthias convient pour diffuser des promotions ou des pages web à l’accueil sur un Raspberry Pi. Pour piloter les studios de cours collectifs (kiosque adhérent, grille horaire, double écran, radio entre les séances), Bobine apporte toute l’ergonomie métier d’une régie fitness.", "General signage like Anthias suits reception promotions or web pages on a Raspberry Pi. For running group fitness studios (member kiosk, class timetable, dual screen, background radio between sessions), Bobine provides purpose-built fitness playout ergonomics.") },
    ],
    faq: [
      { q: text("Anthias sait-il programmer ses vidéos ?", "Can Anthias schedule videos?"), a: text("Oui. Sa documentation décrit des fenêtres horaires et des jours de diffusion par média, mais sans mode kiosque adhérent, ni télécommande coach, ni radio d’ambiance automatique entre les cours.", "Yes. Its documentation describes time windows and playback days per asset, but without a member kiosk mode, coach remote or automatic background radio between classes.") },
      { q: text("Anthias et Screenly sont-ils la même offre ?", "Are Anthias and Screenly the same offering?"), a: text("Non. Anthias est le projet libre anciennement nommé Screenly OSE. Les conditions de l’offre commerciale Screenly doivent être examinées séparément.", "No. Anthias is the open-source project formerly called Screenly OSE. Review the commercial Screenly offering separately.") },
    ],
    sources: ["anthias", "anthiasSchedule"],
  },
] as const satisfies readonly Comparison[];

export type CompareSlug = (typeof comparisons)[number]["slug"];

export const compareCopy = {
  title: text("Comparer les solutions pour votre salle", "Compare solutions for your fitness studio"),
  description: text("Comparez Bobine, les catalogues de cours et l’affichage dynamique pour votre salle. Sources officielles, usages et points de comparaison pour votre budget.", "Compare Bobine, class catalogs and digital signage for your fitness studio. Read official sources and evaluation points for your budget."),
  intro: text("Bobine est une régie locale universelle compatible Windows, macOS, Linux, Android et Android TV. Voici comment sa proposition de valeur se situe face aux catalogues de cours sous licence et aux outils d’affichage dynamique.", "Bobine is a universal local playout studio compatible with Windows, macOS, Linux, Android and Android TV. Here is how its value proposition compares with licensed class catalogs and digital signage tools."),
  pillarsHeading: text("La proposition de valeur de Bobine", "Bobine’s value proposition"),
  noticeTitle: text("Note méthodologique & neutralité", "Methodological note & neutrality"),
  notice: text("Comparatifs rédigés par le projet Bobine, sans affiliation aux marques citées. Les offres évoluent : consultez les sources officielles et confirmez les conditions avec chaque fournisseur. Bobine est une régie logicielle multi-OS et ne vend pas de catalogue de cours sous licence.", "These comparisons are written by the Bobine project, with no affiliation to the named brands. Offerings change: read the official sources and confirm terms with each supplier. Bobine is cross-OS playout software and does not sell a licensed workout catalog."),
  download: text("Télécharger pour mon appareil", "Download for my device"),
  downloadNote: text("Windows, macOS, Linux, Android et Android TV : choisissez le paquet et consultez les prérequis.", "Windows, macOS, Linux, Android and Android TV: choose a package and check its requirements."),
  features: text("Voir les fonctionnalités", "Explore features"),
  read: text("Voir le comparatif", "Read comparison"),
  criteria: text("Critère", "Criterion"),
  table: text("Comparaison point par point", "Point-by-point comparison"),
  sources: text("Sources et périmètre", "Sources and scope"),
  checked: text("Consulté le", "Checked on"),
  faq: text("Questions fréquentes", "Frequently asked questions"),
  cta: text("Essayer avec vos propres médias", "Try it with your own media"),
  imageAlt: text("Illustration de Baamix avec un ordinateur portable, mascotte du projet Bobine", "Illustration of Bobine mascot Baamix with a laptop"),
} as const;

export function getComparison(slug: CompareSlug): Comparison {
  return comparisons.find((item) => item.slug === slug)!;
}
