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
const ownContent = text("Vidéos et musiques fournies par votre salle ; aucun catalogue de cours sous licence inclus.", "Videos and music supplied by your club; no licensed workout catalog included.");
const localPlayback = text("Lecture des fichiers importés depuis la machine locale ; réseau local requis pour les autres appareils.", "Imported files play from the local machine; other devices require a local network.");
const bobineLicense = text("Logiciel libre AGPL-3.0, sans abonnement logiciel. Matériel, contenus et maintenance restent à prévoir.", "AGPL-3.0 software with no software subscription. Budget separately for hardware, content and maintenance.");

export const comparisons = [
  {
    slug: "les-mills-cinema", routeId: "compare-lesmills", name: "Les Mills Cinema & Virtual", icon: "video", brand: "compare.lesmills",
    title: text("Bobine et Les Mills : comparer les usages", "Bobine and Les Mills: compare studio needs"),
    description: text("Comparez la régie locale Bobine aux offres Les Mills : contenus, programmation, matériel et budget. Sources officielles et points à vérifier.", "Compare local Bobine playout with Les Mills: content, scheduling, hardware and budget. Read official sources and check what your studio needs."),
    intro: text("Vous avez déjà vos vidéos, ou vous cherchez un catalogue de cours ? C’est la première distinction entre une régie comme Bobine et une offre de contenus Les Mills.", "Do you already have workout videos, or do you need a class catalog? That is the first distinction between Bobine playout and a Les Mills content offering."),
    focus: text("Régie et catalogue de cours", "Playout and workout catalogs"),
    columns: ["Bobine", "Les Mills Virtual"],
    rows: [
      { label: text("Contenus", "Content"), values: [ownContent, text("Programmes Les Mills ; vérifier le catalogue et les droits inclus dans l’offre choisie.", "Les Mills programs; check the catalog and rights included with your chosen offering.")], sources: ["lesmills"] },
      { label: text("Programmation", "Scheduling"), values: [text("Grille de diffusion et lancement à la demande des cours importés.", "Timetable and on-demand playback of imported classes."), text("Le Virtual Scheduler propose une grille mêlant cours virtuels et cours en direct.", "Virtual Scheduler supports a timetable combining virtual and live classes.")], sources: ["lesmills"] },
      { label: text("Borne à la demande", "On-demand kiosk"), values: [text("Interface kiosque pour choisir un cours disponible.", "Kiosk interface to select an available class."), text("Sélection de cours sur l’iPad Virtual pendant les créneaux à la demande.", "Class selection on the Virtual iPad during on-demand slots.")], sources: ["lesmills"] },
      { label: text("Lecture et connexion", "Playback and connection"), values: [localPlayback, text("Contenus téléchargés dans l’application ; connexion requise pour sa mise à jour. Confirmer les conditions hors ligne de votre offre.", "Content downloads into the app; updating it requires internet. Confirm your offering’s offline conditions.")], sources: ["lesmills"] },
      { label: text("Budget", "Budget"), values: [bobineLicense, text("Demander les conditions de l’offre Virtual ou Cinema choisie ; aucun tarif supposé ici.", "Request terms for your chosen Virtual or Cinema offering; no rates are assumed here.")], sources: [] },
    ],
    sections: [
      { title: text("Choisir selon le contenu à diffuser", "Choose around the content you need"), text: text("Bobine organise vos fichiers, mais ne fournit ni les cours Les Mills ni leurs droits de diffusion. Comparer les seuls frais du logiciel ne suffit donc pas à comparer deux offres complètes.", "Bobine organizes your files but supplies neither Les Mills classes nor rights to show them. Comparing software fees alone does not compare two complete offerings.") },
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
    intro: text("Une plateforme de cours peut aussi stocker ses vidéos localement. Comparez le contenu fourni, les fonctions incluses et les conditions d’exploitation de chaque offre.", "A class platform can store its videos locally too. Compare supplied content, included features and operating conditions for each offering."),
    focus: text("Contenus, lecture locale et services", "Content, local playback and services"),
    columns: ["Bobine", "Wexer Virtual", "Fitness On Demand"],
    rows: [
      { label: text("Catalogue", "Catalog"), values: [ownContent, text("Collection de cours Wexer.", "Wexer class collection."), text("Catalogue de cours et plusieurs plateformes selon les besoins du club.", "Class catalog and several platforms for different club needs.")], sources: ["wexerOffline", "fod"] },
      { label: text("Contenus propres", "Custom content"), values: [text("Import de vos vidéos et fichiers audio.", "Import your own video and audio files."), text("Virtual Connect permet d’importer les contenus produits par votre salle.", "Virtual Connect lets clubs upload their own content."), text("Personnalisation de marque et contenus personnalisés selon la plateforme ; préciser vos besoins lors de la démonstration.", "Brand customization and custom content vary by platform; specify your needs during the demo.")], sources: ["wexerConnect", "fod"] },
      { label: text("Sans internet", "Without internet"), values: [localPlayback, text("Les cours déjà stockés sur le Virtual Player restent disponibles hors ligne.", "Classes already stored on the Virtual Player remain available offline."), text("Faire confirmer le mode hors ligne de l’équipement et de l’offre retenus ; non établi par la page de présentation.", "Confirm offline behavior for your chosen device and offering; the overview page does not establish it.")], sources: ["wexerOffline", "fod"] },
      { label: text("Périmètre", "Scope"), values: [text("Régie locale, planning, kiosque et radio pour vos médias.", "Local playout, timetable, kiosk and radio for your media."), text("Cours virtuels et contenus du club via Virtual Connect.", "Virtual classes and club content through Virtual Connect."), text("Cours en studio, application, affichage dynamique et écrans tactiles selon la plateforme.", "Studio classes, an app, digital signage and touchscreens depending on the platform.")], sources: ["wexerConnect", "fod"] },
      { label: text("Budget", "Budget"), values: [bobineLicense, text("Demander un devis adapté au club et aux services souhaités.", "Request a quote for your club and required services."), text("Comparer l’offre et ses services sur devis ; aucun montant repris dans ce comparatif.", "Compare the offering and services in a quote; no price is reproduced here.")], sources: [] },
    ],
    sections: [
      { title: text("Tester plutôt que supposer", "Test rather than assume"), text: text("Demandez une démonstration avec vos propres vidéos et une coupure internet contrôlée. Notez les médias réellement disponibles, les commandes encore accessibles et le comportement au redémarrage.", "Request a demo with your own videos and a controlled internet outage. Record which media remain available, which controls still work and how playback behaves after restart.") },
      { title: text("Comparer un budget complet", "Compare a complete budget"), text: text("Incluez le matériel, les contenus, l’assistance, l’installation et la maintenance. Un logiciel sans abonnement ne remplace pas automatiquement ces services.", "Include hardware, content, support, installation and maintenance. Software without a subscription does not automatically replace these services.") },
    ],
    faq: [
      { q: text("Wexer dépend-il uniquement du streaming ?", "Does Wexer rely only on streaming?"), a: text("Non. La documentation du Virtual Player décrit un stockage local et la lecture hors ligne des cours déjà téléchargés.", "No. Virtual Player documentation describes local storage and offline playback of classes already downloaded.") },
      { q: text("La latence de Bobine est-elle garantie ?", "Is Bobine latency guaranteed?"), a: text("Non. Elle dépend du matériel, des fichiers et du réseau local. Aucune mesure universelle ni garantie de démarrage instantané n’est annoncée ici.", "No. It depends on hardware, files and the local network. No universal measurement or instant-start guarantee is claimed here.") },
    ],
    sources: ["wexerOffline", "wexerConnect", "fod"],
  },
  {
    slug: "radical-fitness-yako", routeId: "compare-radical", name: "Radical Fitness & Yako", icon: "layers", brand: "compare.radical",
    title: text("Bobine, Radical Fitness et Yako : quels rôles ?", "Bobine, Radical Fitness and Yako: different roles"),
    description: text("Distinguez la régie Bobine, les programmes Radical Fitness et les cours Yako du réseau L’Orange bleue. Comparez contenus, exploitation et budget.", "Distinguish Bobine playout, Radical Fitness programs and Yako classes from L’Orange bleue. Compare content, operation and the budget for your club."),
    intro: text("Un outil de diffusion, un catalogue de programmes et une offre de réseau répondent à des besoins différents. Yako désigne les cours du réseau L’Orange bleue, pas un fournisseur de régie indépendant.", "Playout software, a program catalog and a network offering meet different needs. Yako names the classes of the L’Orange bleue network, not an independent playout supplier."),
    focus: text("Logiciel, programmes et réseau", "Software, programs and network"),
    columns: ["Bobine", "Radical Virtual", "Yako / L’Orange bleue"],
    rows: [
      { label: text("Nature de l’offre", "Type of offering"), values: [text("Logiciel de diffusion pour les médias de votre salle.", "Playout software for your club’s media."), text("Offre de cours virtuels Radical Fitness.", "Radical Fitness virtual class offering."), text("Programmes de cours collectifs du réseau L’Orange bleue.", "Group fitness programs of the L’Orange bleue network.")], sources: ["radical", "yako"] },
      { label: text("Contenus", "Content"), values: [ownContent, text("Catalogue de programmes et nouvelles vidéos trimestrielles annoncées par l’éditeur.", "Program catalog with quarterly video updates announced by the provider."), text("Cours préchorégraphiés, renouvelés tous les deux mois selon le réseau.", "Pre-choreographed classes renewed every two months according to the network.")], sources: ["radical", "yako"] },
      { label: text("Organisation", "Organization"), values: [text("Vous importez les médias et préparez la grille de diffusion.", "You import media and prepare the playback timetable."), text("Faire préciser le lecteur, les droits et l’accompagnement dans l’offre Virtual.", "Confirm the player, rights and support included in the Virtual offering."), text("La plateforme pédagogique s’adresse aux coachs du réseau.", "The educational platform is intended for the network’s coaches.")], sources: ["radical", "yako"] },
      { label: text("Budget", "Budget"), values: [bobineLicense, text("Consulter l’éditeur pour les conditions de votre offre.", "Ask the provider for the terms of your offering."), text("Les conditions du réseau ne constituent pas un tarif de régie vidéo comparable.", "Network terms are not a directly comparable video playout price.")], sources: [] },
    ],
    sections: [
      { title: text("Partir de votre projet de salle", "Start with your club’s project"), text: text("Si vous produisez vos cours, Bobine permet d’en organiser la diffusion. Si vous cherchez des programmes préparés et renouvelés par un tiers, évaluez séparément le catalogue et l’accompagnement proposés.", "If you produce your own classes, Bobine can organize their playback. If you need programs prepared and renewed by a provider, assess the catalog and support separately.") },
      { title: text("Ne pas confondre outil et autorisation", "Distinguish software from permission"), text: text("Installer une régie ne transfère pas les droits d’un programme sportif, d’une vidéo ou d’une musique. Vérifiez auprès du détenteur des contenus ce que votre contrat permet de diffuser.", "Installing playout software does not transfer rights to fitness programs, videos or music. Check with the content owner what your agreement allows you to show.") },
    ],
    faq: [
      { q: text("Yako est-il un logiciel concurrent de Bobine ?", "Is Yako competing software?"), a: text("Non. Yako désigne des programmes de cours du réseau L’Orange bleue. Bobine est un logiciel qui organise la diffusion de médias fournis par la salle.", "No. Yako refers to class programs of the L’Orange bleue network. Bobine organizes playback of media supplied by a club.") },
      { q: text("Bobine remplace-t-il un catalogue de cours ?", "Does Bobine replace a class catalog?"), a: text("Non. Il faut fournir vos contenus et prévoir leur production, leur acquisition et leur renouvellement dans votre budget.", "No. You supply the content and budget for its production, acquisition and renewal.") },
    ],
    sources: ["radical", "yako"],
  },
  {
    slug: "affichage-dynamique-fitness", routeId: "compare-signage", name: "Anthias (Screenly OSE)", icon: "cpu", brand: "compare.signage",
    title: text("Bobine et Anthias : régie ou affichage dynamique ?", "Bobine and Anthias: playout or digital signage?"),
    description: text("Comparez Bobine et Anthias pour les écrans d’une salle : programmation, médias locaux et usages. Distinguez régie fitness et affichage dynamique.", "Compare Bobine and Anthias for gym screens: scheduling, local media and use cases. Distinguish fitness playout from general purpose digital signage."),
    intro: text("Afficher des annonces et piloter une grille de cours ne demandent pas les mêmes outils. Anthias sait aussi programmer ses médias : le choix dépend surtout de votre usage.", "Displaying announcements and running a class timetable call for different tools. Anthias can schedule media too: choose around your actual use case."),
    focus: text("Planning de cours et communication sur écran", "Class timetables and screen communication"),
    columns: ["Bobine", "Anthias (ex-Screenly OSE)"],
    rows: [
      { label: text("Usage principal", "Primary use"), values: [text("Régie de cours vidéo et audio, kiosque et radio d’ambiance.", "Video and audio class playout, kiosk and background radio."), text("Affichage d’images, de vidéos et de pages web.", "Display images, videos and web pages.")], sources: ["anthias"] },
      { label: text("Planification", "Scheduling"), values: [text("Grille de cours programmés et lecture à la demande.", "Scheduled class timetable and on-demand playback."), text("Plages horaires et jours de la semaine par média, avec dates de début et de fin.", "Per-asset time windows and weekdays, plus start and end dates.")], sources: ["anthiasSchedule"] },
      { label: text("Médias et réseau", "Media and network"), values: [localPlayback, text("Fichiers importés ou URL ; les besoins réseau varient selon le média affiché.", "Uploaded files or URLs; network needs vary with the displayed content.")], sources: ["anthias"] },
      { label: text("Matériel", "Hardware"), values: [text("Choisir un paquet adapté à Windows, macOS, Linux, Android ou Android TV.", "Choose a package for Windows, macOS, Linux, Android or Android TV."), text("Raspberry Pi et PC ; voir les installations prises en charge dans la documentation.", "Raspberry Pi and PCs; check supported installations in the documentation.")], sources: ["anthias"] },
      { label: text("Budget", "Budget"), values: [bobineLicense, text("Projet libre sans abonnement annoncé ; matériel et exploitation restent à prévoir.", "Open-source project advertised without subscriptions; budget for hardware and operation.")], sources: ["anthias"] },
    ],
    sections: [
      { title: text("Deux besoins qui peuvent coexister", "Two needs that can coexist"), text: text("Pour des annonces d’accueil ou des pages web, un afficheur généraliste peut convenir. Pour vos cours programmés, le kiosque adhérent et la radio, testez le parcours Bobine avec vos propres fichiers.", "General purpose signage can suit reception announcements or web pages. For scheduled classes, a member kiosk and radio, test the Bobine workflow with your own files.") },
      { title: text("Ne pas généraliser à tous les afficheurs", "Do not generalize across signage products"), text: text("Screenly, Yodeck, Xibo, OptiSigns, TouchPlayer et Waves sont des offres distinctes. Cette page documente Anthias ; elle n’attribue pas ses capacités ou ses limites à tous les autres produits.", "Screenly, Yodeck, Xibo, OptiSigns, TouchPlayer and Waves are distinct offerings. This page documents Anthias; it does not extend its capabilities or limitations to every other product.") },
    ],
    faq: [
      { q: text("Anthias sait-il programmer ses vidéos ?", "Can Anthias schedule videos?"), a: text("Oui. Sa documentation décrit des fenêtres horaires et des jours de diffusion par média. Il ne se limite pas à une boucle sans calendrier.", "Yes. Its documentation describes time windows and playback days for each asset. It is not limited to an unscheduled loop.") },
      { q: text("Anthias et Screenly sont-ils la même offre ?", "Are Anthias and Screenly the same offering?"), a: text("Non. Anthias est le projet libre anciennement nommé Screenly OSE. Les conditions de l’offre commerciale Screenly doivent être examinées séparément.", "No. Anthias is the open-source project formerly called Screenly OSE. Review the commercial Screenly offering separately.") },
    ],
    sources: ["anthias", "anthiasSchedule"],
  },
] as const satisfies readonly Comparison[];

export type CompareSlug = (typeof comparisons)[number]["slug"];

export const compareCopy = {
  title: text("Comparer les solutions pour votre salle", "Compare solutions for your fitness studio"),
  description: text("Comparez Bobine, les catalogues de cours et l’affichage dynamique pour votre salle. Sources officielles, usages et points de comparaison pour votre budget.", "Compare Bobine, class catalogs and digital signage for your fitness studio. Read official sources and evaluation points for your budget."),
  intro: text("Avez-vous besoin d’un catalogue de cours, d’une régie pour vos vidéos ou d’un afficheur d’accueil ? Comparez d’abord le service rendu, puis les coûts de votre projet.", "Do you need a class catalog, playout for your own videos, or a reception display? Compare what each service does, then work out the costs for your project."),
  noticeTitle: text("Comment lire ces comparatifs", "How to read these comparisons"),
  notice: text("Comparatifs rédigés par le projet Bobine, sans affiliation aux marques citées. Les offres évoluent : consultez les sources et confirmez les conditions avec chaque fournisseur. Aucun essai sur leur matériel n’est revendiqué. Bobine ne fournit pas de catalogue de cours ni de droits sur les médias.", "These comparisons are written by the Bobine project, with no affiliation to the named brands. Offerings change: read the sources and confirm terms with each supplier. No testing on their hardware is claimed. Bobine supplies neither a workout catalog nor rights to media."),
  download: text("Télécharger pour mon appareil", "Download for my device"),
  downloadNote: text("Windows, macOS, Linux, Android et Android TV : choisissez le paquet et consultez les prérequis.", "Windows, macOS, Linux, Android and Android TV: choose a package and check its requirements."),
  features: text("Voir les fonctionnalités", "Explore features"),
  read: text("Lire le comparatif", "Read the comparison"),
  criteria: text("Critère", "Criterion"),
  table: text("Les points à comparer", "Points to compare"),
  sources: text("Sources et périmètre", "Sources and scope"),
  checked: text("Consulté le", "Checked on"),
  faq: text("Questions fréquentes", "Frequently asked questions"),
  cta: text("Essayer avec vos propres médias", "Try it with your own media"),
  imageAlt: text("Illustration de Baamix avec un ordinateur portable, mascotte du projet Bobine", "Illustration of Bobine mascot Baamix with a laptop"),
} as const;

export function getComparison(slug: CompareSlug): Comparison {
  return comparisons.find((item) => item.slug === slug)!;
}
