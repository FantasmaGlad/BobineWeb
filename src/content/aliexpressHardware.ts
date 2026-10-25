/**
 * Catalogue AliExpress (Windows, Linux, Android ; macOS redirige vers Windows et Linux).
 *
 * Ce fichier ne contient que des identifiants curatés à la main et leur texte éditorial ;
 * prix, lien affilié, image et vendeur viennent de l'instantané `aliexpress-snapshot.json` (généré par
 * un outil local non versionné) puis, côté serveur, sont rafraîchis en direct par l'API.
 *
 * Convention : les objets réutilisent le type HardwareItem d'Amazon pour partager les composants
 * d'affichage. Pour AliExpress, `asin` = product_id, `amazonUrl` = lien affilié de suivi et
 * `priceAmazon` = prix "à partir de" (variante la moins chère de l'annonce).
 *
 * Règle stricte : aucun produit sans entrée dans l'instantané (jamais de faux produit).
 * Connectique et câbles : boutiques officielles uniquement (Ugreen, Baseus, Hagibis, CYANMI...).
 */
import snapshotJson from "./aliexpress-snapshot.json";
import type {
  FormFactorKey,
  HardwareFormFactor,
  HardwareItem,
  HardwareOsBundle,
  HardwareTier,
  OsKey,
  TierKey,
} from "./hardware";

export interface AliSnapshotEntry {
  price: number;
  link: string;
  image: string;
  title: string;
  shop: string;
  rating: string | null;
  sales: number | null;
  checkedAt: string;
}

export const ALIEXPRESS_SNAPSHOT = snapshotJson as Record<string, AliSnapshotEntry>;

/** OS ouverts sur la page AliExpress. macOS n'a pas de catalogue : voir ALIEXPRESS_UNAVAILABLE_OS. */
export const ALIEXPRESS_ENABLED_OS: OsKey[] = ["linux", "windows", "macos", "arm", "android", "android-tv"];

export const ALIEXPRESS_SNAPSHOT_DATE = Object.values(ALIEXPRESS_SNAPSHOT)
  .map((e) => e.checkedAt)
  .sort()
  .at(-1)!;

type Category = HardwareItem["category"];

interface Editorial {
  name: string;
  specs: string;
  description: string;
  category?: Category;
  hasFan?: boolean;
}

function ali(productId: string, keySuffix: string, e: Editorial): HardwareItem {
  const snap = ALIEXPRESS_SNAPSHOT[productId];
  if (!snap) throw new Error(`Produit AliExpress absent de l'instantané : ${productId}`);
  return {
    id: `ali-${productId}-${keySuffix}`,
    name: e.name,
    category: e.category ?? "uc",
    specs: e.specs,
    description: e.description,
    imageUrl: snap.image,
    asin: productId,
    amazonUrl: snap.link,
    priceAmazon: snap.price,
    hasFan: e.hasFan ?? true,
    seller: { name: snap.shop, rating: snap.rating, sales: snap.sales },
  };
}

// -----------------------------------------------------------------------------
// Accessoires (boutiques officielles)
// -----------------------------------------------------------------------------
const hdmiBaseus = (k: string) =>
  ali("1005005167479204", k, {
    category: "cable-video",
    name: "Câble HDMI 2.1 Baseus 48 Gbps",
    specs: "HDMI 2.1 · 48 Gbps · 8K 60Hz / 4K 120Hz",
    description: "Relie la machine au grand écran ou au vidéoprojecteur. Vérifiez la longueur choisie sur la fiche avant de commander.",
    hasFan: false,
  });
const hdmiFiber = (k: string) =>
  ali("1005006859527888", k, {
    category: "cable-video",
    name: "Câble HDMI 2.1 fibre optique CYANMI (10 m)",
    specs: "Fibre optique · 48 Gbps · 8K 60Hz / 4K 120Hz · 10 m",
    description: "Pour une régie éloignée de l'écran : la fibre optique évite les pertes de signal des longs câbles cuivre.",
    hasFan: false,
  });
const ethernetUgreen = (k: string) =>
  ali("1005002583644370", k, {
    category: "network",
    name: "Câble Ethernet UGREEN Cat8 40 Gbps tressé",
    specs: "Cat8 · 40 Gbps · 2000 MHz · RJ45 · gaine tressée",
    description: "Liaison filaire stable pour la régie : préférable au Wi-Fi pour une diffusion continue en salle.",
    hasFan: false,
  });
const remoteI8 = (k: string) =>
  ali("1005010110892536", k, {
    category: "control",
    name: "Mini clavier air mouse MRSVI I8 (2.4 GHz)",
    specs: "Récepteur USB 2.4 GHz · pavé tactile · format télécommande",
    description: "Piloter la régie depuis la salle sans se pencher sur la machine.",
    hasFan: false,
  });
const remoteMx3 = (k: string) =>
  ali("1005006741151205", k, {
    category: "control",
    name: "Air mouse MRSVI MX3 (2.4 GHz, apprentissage IR)",
    specs: "Récepteur USB 2.4 GHz · air mouse · apprentissage IR",
    description: "Télécommande gyroscopique : pointer et cliquer à distance, en plus de l'apprentissage infrarouge pour piloter aussi le téléviseur.",
    hasFan: false,
  });
const flashMovespeed = (k: string) =>
  ali("1005009110731940", k, {
    category: "storage",
    name: "Clé USB-C MOVESPEED 150 Mo/s (OTG)",
    specs: "USB 3.1 Type-C · jusqu'à 150 Mo/s · capacités 64 Go à 512 Go",
    description: "Transporter les vidéos de cours d'une machine à l'autre. Le prix affiché est celui de la plus petite capacité.",
    hasFan: false,
  });
const ssdKodak = (k: string) =>
  ali("1005012782024246", k, {
    category: "storage",
    name: "SSD portable KODAK X200 (USB 3.1 Type-C)",
    specs: "USB 3.1 Type-C · jusqu'à 450 Mo/s · capacités 256 Go à 1 To",
    description: "Bibliothèque de vidéos sur un disque externe, sans encombrer le stockage interne. Prix affiché : capacité la plus basse.",
    hasFan: false,
  });
const standBaseus = (k: string) =>
  ali("1005004301018577", k, {
    category: "mount",
    name: "Support ordinateur portable aluminium Baseus",
    specs: "Aluminium · portables 10 à 18 pouces",
    description: "Surélève le portable pour mieux évacuer la chaleur pendant les longues sessions de diffusion.",
    hasFan: false,
  });
const hubUgreen8 = (k: string) =>
  ali("1005007227813985", k, {
    category: "power-hub",
    name: "Hub USB-C UGREEN 8-en-1 triple affichage",
    specs: "HDMI 4K + DisplayPort · USB 3.2 10 Gbps · Power Delivery 100 W",
    description: "Un seul câble USB-C vers le portable : vidéo, périphériques et recharge en même temps.",
    hasFan: false,
  });
const hubUgreenRj45 = (k: string) =>
  ali("1005003016375106", k, {
    category: "power-hub",
    name: "Hub USB-C UGREEN 4K60 HDMI + RJ45",
    specs: "HDMI 4K 60Hz · RJ45 · lecteur SD/TF · Power Delivery 100 W",
    description: "Le hub minimal pour exploiter un portable fermé : HDMI, réseau filaire et recharge.",
    hasFan: false,
  });
const dockHagibis = (k: string) =>
  ali("1005010468223503", k, {
    category: "power-hub",
    name: "Dock USB4 Hagibis triple affichage",
    specs: "USB4 40 Gbps · triple affichage · compatible Thunderbolt 4",
    description: "Multi-écrans depuis un seul port USB4 ou Thunderbolt du portable.",
    hasFan: false,
  });
const dockCabletime = (k: string) =>
  ali("1005009356822999", k, {
    category: "power-hub",
    name: "Dock USB-C CABLETIME 16-en-1",
    specs: "HDMI 4K 60Hz MST · 10 Gbps · Power Delivery 100 W · LAN 1000 Mbps",
    description: "La station d'accueil complète pour un portable en régie : vidéo, réseau, USB et recharge.",
    hasFan: false,
  });
const cableUsb4 = (k: string) =>
  ali("1005008596633098", k, {
    category: "power-hub",
    name: "Câble USB4 Hagibis 80 Gbps 240 W",
    specs: "USB4 · 80 Gbps · 240 W · Thunderbolt 4/5",
    description: "Câble certifié pleine fonction pour dock et SSD, à ne pas confondre avec un simple câble de charge USB-C.",
    hasFan: false,
  });

// -----------------------------------------------------------------------------
// Mini PC Windows
// -----------------------------------------------------------------------------
const MINIPC_TIERS: Record<TierKey, HardwareTier> = {
  essentiel: {
    id: "essentiel",
    labelFr: "Essentiel",
    labelEn: "Essential",
    headlineFr: "BMAX B3 Pro N4500 — L'entrée de gamme Windows",
    headlineEn: "BMAX B3 Pro N4500 — Windows entry level",
    summaryFr: "Mini PC neuf avec Windows 11 et 4K 60Hz, pour la diffusion 1080p et le pilotage de la régie. Trois alternatives de marques différentes.",
    summaryEn: "Brand new mini PC with Windows 11 and 4K 60Hz, for 1080p playout and control. Three alternatives from other brands.",
    powerWatts: "10W - 25W",
    resolution: "1080p & 4K",
    items: [
      ali("1005012736853392", "main", {
        name: "BMAX B3 Pro Mini PC (Intel N4500 / 8 Go RAM / 256 Go SSD / Windows 11)",
        specs: "Intel N4500 · 8 Go · 256 Go SSD · HDMI 4K 60Hz · Wi-Fi double bande",
        description: "Entrée de gamme Windows 11 neuve, ventilation discrète : suffisante pour la diffusion 1080p sans multitâche lourd.",
      }),
      hdmiBaseus("mp-ess"),
      ethernetUgreen("mp-ess"),
      remoteI8("mp-ess"),
      flashMovespeed("mp-ess"),
    ],
    alternativeUnits: [
      ali("1005012441681661", "alt", {
        name: "NiPoGi Mini PC (Pentium Silver N5030 / 8 Go / 256 Go SSD / Windows 11)",
        specs: "Pentium Silver N5030 · 8 Go LPDDR4 · 256 Go SSD · extensible jusqu'à 2 To",
        description: "Alternative NiPoGi vendue par la boutique ACEMAGIC, SSD remplaçable.",
      }),
      ali("1005011942336333", "alt", {
        name: "Blackview MP20 (Ryzen 3 3300U / 16 Go / 512 Go SSD / Windows 11)",
        specs: "Ryzen 3 3300U · 16 Go DDR4 (32 Go max) · 512 Go SSD · 4K",
        description: "Plus de mémoire et un processeur AMD plus musclé pour un budget proche.",
      }),
      ali("1005009348587036", "alt", {
        name: "BMAX B6 Plus (Intel i3-1000NG4 / 12 Go / 512 Go SSD / Windows 11)",
        specs: "Core i3-1000NG4 · 12 Go DDR4 · 512 Go NVMe · 2 HDMI · 3 USB 3.0",
        description: "Vendu par la boutique BMAX Poland : double sortie HDMI et SSD NVMe.",
      }),
    ],
  },
  recommande: {
    id: "recommande",
    labelFr: "Recommandé",
    labelEn: "Recommended",
    badgeFr: "Meilleur Rapport Puissance/Prix",
    badgeEn: "Best Performance-to-Price",
    isPopular: true,
    headlineFr: "Blackview MP100 Ryzen 5 7430U — Vraie puissance AMD",
    headlineEn: "Blackview MP100 Ryzen 5 7430U — Real AMD power",
    summaryFr: "Six cœurs AMD, 16 Go de RAM et Wi-Fi 6 pour une régie quotidienne fluide. Trois alternatives allant du Ryzen 5 au Ryzen 7.",
    summaryEn: "Six AMD cores, 16 GB RAM and Wi-Fi 6 for a smooth daily control room. Three alternatives from Ryzen 5 to Ryzen 7.",
    powerWatts: "15W - 35W",
    resolution: "4K 60fps",
    items: [
      ali("1005010617748284", "main", {
        name: "Blackview MP100 (Ryzen 5 7430U / 16 Go / 512 Go SSD / Windows 11)",
        specs: "Ryzen 5 7430U 6 cœurs 12 threads · 16 Go · 512 Go · Wi-Fi 6 · Bluetooth 5.2",
        description: "Ventilateur piloté par la charge (non fanless). L'annonce propose aussi 32 Go et 1 To : choisissez la variante sur la fiche.",
      }),
      hdmiBaseus("mp-rec"),
      ethernetUgreen("mp-rec"),
      remoteMx3("mp-rec"),
      flashMovespeed("mp-rec"),
    ],
    alternativeUnits: [
      ali("1005011751896307", "alt", {
        name: "MLLSE G5 Pro (Ryzen 7 5800H / 16 Go / 512 Go SSD / Windows 11)",
        specs: "Ryzen 7 5800H · 16 Go · 512 Go SSD · Wi-Fi 6 · Bluetooth 5.2",
        description: "Huit cœurs pour le prix d'un Ryzen 5 : très commandé sur AliExpress.",
      }),
      ali("1005011942256447", "alt", {
        name: "FIREBAT AM02 (Ryzen 5 6600H / 16 Go DDR5 / 512 Go SSD / Windows 11)",
        specs: "Ryzen 5 6600H · 16 Go DDR5 · 512 Go SSD · Wi-Fi 6 · port réseau",
        description: "Mémoire DDR5 et graphismes Radeon 660M pour un rendu plus fluide.",
      }),
      ali("1005010678963645", "alt", {
        name: "FIREBAT R2 (Ryzen 5 3500U / 16 Go / 512 Go SSD / Windows 11)",
        specs: "Ryzen 5 3500U · 16 Go · 512 Go SSD · double affichage 4K · Wi-Fi 5",
        description: "Option plus économique de la boutique officielle Firebat.",
      }),
    ],
  },
  pro: {
    id: "pro",
    labelFr: "Pro",
    labelEn: "Pro",
    headlineFr: "ACEMAGIC Ryzen 7 H225 — 32 Go & 1 To, triple 4K",
    headlineEn: "ACEMAGIC Ryzen 7 H225 — 32 GB & 1 TB, triple 4K",
    summaryFr: "Ryzen 7, 32 Go de RAM et 1 To de SSD pour les installations multi-écrans. Trois alternatives Ryzen 5 et Ryzen 7.",
    summaryEn: "Ryzen 7, 32 GB RAM and 1 TB SSD for multi-screen setups. Three Ryzen 5 and Ryzen 7 alternatives.",
    powerWatts: "25W - 55W",
    resolution: "Triple 4K",
    items: [
      ali("1005012340565655", "main", {
        name: "ACEMAGIC Mini PC (Ryzen 7 H225 / 32 Go LPDDR5 / 1 To SSD / Windows 11 Pro)",
        specs: "Ryzen 7 H225 · 32 Go LPDDR5 · 1 To SSD · triple écran 4K · Wi-Fi 6",
        description: "Configuration généreuse déjà livrée avec Windows 11 Pro par la boutique officielle ACEMAGIC.",
      }),
      hdmiBaseus("mp-pro"),
      ethernetUgreen("mp-pro"),
      ssdKodak("mp-pro"),
    ],
    alternativeUnits: [
      ali("1005010435673111", "alt", {
        name: "CHUWI UBox (Ryzen 5 6600H / 16 Go LPDDR5 / 512 Go SSD / Windows 11 Pro)",
        specs: "Ryzen 5 6600H · 16 Go LPDDR5 · 512 Go · décodage 4K 144Hz · extension M.2",
        description: "Boutique officielle CHUWI, extensible avec deux emplacements M.2.",
      }),
      ali("1005010143153559", "alt", {
        name: "BMAX B8 A Pro (Ryzen 7 8745HS / 16 Go DDR5 / 512 Go SSD / Windows 11)",
        specs: "Ryzen 7 8745HS · Radeon 780M · 16 Go DDR5 · 512 Go NVMe · 4K 60Hz",
        description: "Un des processeurs graphiques intégrés les plus performants de la gamme.",
      }),
      ali("1005009795110087", "alt", {
        name: "GMKtec M6 Ultra (Ryzen 5 7640HS / 16 Go / 512 Go / Windows 11 Pro)",
        specs: "Ryzen 5 7640HS · 16 Go · 512 Go PCIe 3.0 · double LAN 2,5G",
        description: "Boutique GMKtec Direct, avec double réseau 2,5 Gbit/s pour les installations connectées.",
      }),
    ],
  },
  premium: {
    id: "premium",
    labelFr: "Premium",
    labelEn: "Premium",
    badgeFr: "Haut de Gamme",
    badgeEn: "Flagship",
    headlineFr: "PELADN HO5 AI — Ryzen AI 9 HX 470, 32 Go & 1 To",
    headlineEn: "PELADN HO5 AI — Ryzen AI 9 HX 470, 32 GB & 1 TB",
    summaryFr: "Le sommet de la puissance compacte, avec Wi-Fi 7 et OCuLink. Trois alternatives Ryzen AI 9 et Core Ultra.",
    summaryEn: "Peak compact power, with Wi-Fi 7 and OCuLink. Three Ryzen AI 9 and Core Ultra alternatives.",
    powerWatts: "25W - 65W",
    resolution: "Triple 4K",
    items: [
      ali("1005012474520295", "main", {
        name: "PELADN HO5 AI (Ryzen AI 9 HX 470 / 32 Go DDR5 / 1 To SSD)",
        specs: "Ryzen AI 9 HX 470 12 cœurs · 32 Go DDR5 · 1 To · Wi-Fi 7 · OCuLink · triple affichage",
        description: "Même processeur que la référence premium Amazon, vendu par la boutique officielle PELADN (CreNotion). Peu de ventes à ce jour : lisez les avis.",
      }),
      hdmiFiber("mp-prem"),
      ethernetUgreen("mp-prem"),
      ssdKodak("mp-prem"),
    ],
    alternativeUnits: [
      ali("1005009305925093", "alt", {
        name: "PELADN Mini PC (Ryzen AI 9 HX 370 / 32 Go LPDDR5X / 1 To SSD)",
        specs: "Ryzen AI 9 HX 370 12 cœurs · 32 Go LPDDR5X · 1 To PCIe 4.0 · Wi-Fi 7 · double LAN 2,5G · USB4",
        description: "La génération précédente du même constructeur, bien plus vendue.",
      }),
      ali("1005012261652447", "alt", {
        name: "FIREBAT A8 (Ryzen AI 9 365 / 32 Go DDR5 / 1 To SSD / Windows 11 Pro)",
        specs: "Ryzen AI 9 365 · 32 Go DDR5 · 1 To PCIe 4.0 · OCuLink · 2 USB4",
        description: "Boutique officielle Firebat : deux ports USB4 et OCuLink pour évoluer.",
      }),
      ali("1005009606529991", "alt", {
        name: "BMAX B11 Power (Core Ultra 7 155H / 24 Go LPDDR5 / 1 To / Windows 11 Pro)",
        specs: "Core Ultra 7 155H · 24 Go LPDDR5 4400 · 1 To SSD · Wi-Fi 6 · USB-C",
        description: "L'alternative Intel Core Ultra, à un prix nettement inférieur.",
      }),
    ],
  },
};

// -----------------------------------------------------------------------------
// PC portable Windows (un vrai portable neuf + kit de connectique)
// -----------------------------------------------------------------------------
const LAPTOP_TIERS: Record<TierKey, HardwareTier> = {
  essentiel: {
    id: "essentiel",
    labelFr: "Essentiel",
    labelEn: "Essential",
    headlineFr: "CHUWI CoreBook 14\" — Portable Windows premier prix",
    headlineEn: "CHUWI CoreBook 14\" — Budget Windows laptop",
    summaryFr: "Un portable Windows 11 neuf à petit prix, complété par le hub USB-C minimal pour l'exploiter fermé en régie.",
    summaryEn: "A budget Windows 11 laptop, completed with the minimal USB-C hub to run it closed in the control room.",
    powerWatts: "100W PD",
    resolution: "4K 60fps (via hub)",
    items: [
      ali("1005012101925260", "main", {
        name: "CHUWI CoreBook 14\" (Core i3-10100Y / 8 Go / 256 Go SSD / Windows 11)",
        specs: "Core i3-10100Y · 8 Go · 256 Go SSD · écran 14 pouces · Intel UHD",
        description: "Suffisant pour la régie Bobine et la bureautique légère. Processeur d'ancienne génération : à réserver aux petits budgets.",
      }),
      hubUgreenRj45("lt-ess"),
      hdmiBaseus("lt-ess"),
      remoteI8("lt-ess"),
      flashMovespeed("lt-ess"),
    ],
    alternativeUnits: [
      ali("1005002537404634", "alt", {
        name: "CHUWI CoreBook 14\" — boutique officielle (Core i3-10100Y / 8 Go / 256 Go)",
        specs: "Core i3-10100Y · 8 Go · 256 Go SSD · écran 14 pouces",
        description: "Le même modèle vendu directement par la boutique officielle CHUWI.",
      }),
      ali("1005009759927376", "alt", {
        name: "ACEMAGIC AX18PRO 18,5\" (Ryzen 3 4300U / 16 Go / 512 Go / Windows 11 Pro)",
        specs: "Ryzen 3 4300U · 16 Go LPDDR4 · 512 Go SSD · écran 18,5 pouces · batterie 7000 mAh",
        description: "Très grand écran et 16 Go de RAM : très commandé sur AliExpress.",
      }),
    ],
  },
  recommande: {
    id: "recommande",
    labelFr: "Recommandé",
    labelEn: "Recommended",
    badgeFr: "Meilleur Rapport Puissance/Prix",
    badgeEn: "Best Performance-to-Price",
    isPopular: true,
    headlineFr: "Ninkear A15 Pro Ryzen 5 — 16 pouces 2.5K, 16 Go & 1 To",
    headlineEn: "Ninkear A15 Pro Ryzen 5 — 16-inch 2.5K, 16 GB & 1 TB",
    summaryFr: "Portable 16 pouces à écran 120 Hz avec 1 To de stockage, complété par le hub, le support et le réseau filaire.",
    summaryEn: "16-inch 120 Hz laptop with 1 TB storage, completed with the hub, stand and wired network.",
    powerWatts: "100W PD",
    resolution: "4K 60fps (via hub)",
    items: [
      ali("1005012036800477", "main", {
        name: "Ninkear A15 Pro 16\" (Ryzen 5 5500U / 16 Go / 1 To SSD / Windows 11)",
        specs: "Ryzen 5 5500U · 16 Go · 1 To · écran 16\" 2.5K 120Hz IPS · Wi-Fi 6",
        description: "Châssis métal et grand écran : un portable polyvalent pour une régie quotidienne.",
      }),
      hubUgreen8("lt-rec"),
      standBaseus("lt-rec"),
      ethernetUgreen("lt-rec"),
      remoteMx3("lt-rec"),
      flashMovespeed("lt-rec"),
    ],
    alternativeUnits: [
      ali("1005012985645862", "alt", {
        name: "CHUWI CoreBook Air Plus 16\" (Ryzen 5 6600H / 16 Go / 512 Go / Windows 11)",
        specs: "Ryzen 5 6600H · 16 Go · 512 Go SSD · ultra-léger 16 pouces",
        description: "Vendu par la boutique CHUWI EU Choice, processeur de la génération suivante.",
      }),
      ali("1005011904515834", "alt", {
        name: "Ninkear 14\" (Ryzen 5 6600H / 16 Go LPDDR5 / 512 Go / Windows 11)",
        specs: "Ryzen 5 6600H · 16 Go LPDDR5 · 512 Go · écran 14\" 2.2K 100% sRGB · 1 kg",
        description: "Le plus compact et le plus léger de la sélection.",
      }),
    ],
  },
  pro: {
    id: "pro",
    labelFr: "Pro",
    labelEn: "Pro",
    headlineFr: "ACEMAGIC LX15PRO Ryzen 7 — Puissance multitâche",
    headlineEn: "ACEMAGIC LX15PRO Ryzen 7 — Multitasking power",
    summaryFr: "Un portable Ryzen 7 à écran IPS 15,6 pouces, complété par un dock USB4 pour le multi-écran.",
    summaryEn: "A Ryzen 7 laptop with a 15.6-inch IPS display, completed with a USB4 dock for multi-screen.",
    powerWatts: "96W PD",
    resolution: "Multi-écran (via dock)",
    items: [
      ali("1005012643971397", "main", {
        name: "ACEMAGIC LX15PRO 15,6\" (Ryzen 7 7730U / 16 Go / 512 Go / Windows)",
        specs: "Ryzen 7 7730U · 16 Go DDR4 · 512 Go NVMe · écran IPS 15,6\" · pavé numérique",
        description: "Même processeur que la référence Pro d'Amazon. Peu de ventes à ce jour sur cette annonce : lisez les avis.",
      }),
      dockHagibis("lt-pro"),
      standBaseus("lt-pro"),
      cableUsb4("lt-pro"),
      ssdKodak("lt-pro"),
    ],
    alternativeUnits: [
      ali("1005012967808954", "alt", {
        name: "ACEMAGIC S16 16\" (Ryzen 7 H255 / 24 Go LPDDR5 / 512 Go / Windows 11 Pro)",
        specs: "Ryzen 7 H255 · Radeon 780M · 24 Go LPDDR5 · 512 Go NVMe · Wi-Fi 6",
        description: "Nettement plus puissant côté graphique, avec 24 Go de RAM.",
      }),
      ali("1005006098452747", "alt", {
        name: "CHUWI CoreBook Air Plus 16\" — boutique officielle (Ryzen 5 6600H / 16 Go / 512 Go)",
        specs: "Ryzen 5 6600H · 16 Go · 512 Go SSD · ultra-léger 16 pouces",
        description: "Très bien vendu sur la boutique officielle CHUWI.",
      }),
    ],
  },
  premium: {
    id: "premium",
    labelFr: "Premium",
    labelEn: "Premium",
    badgeFr: "Kit Complet",
    badgeEn: "Full Kit",
    headlineFr: "CHUWI CoreBook Air — Intel Core Ultra 5 226V",
    headlineEn: "CHUWI CoreBook Air — Intel Core Ultra 5 226V",
    summaryFr: "Ultra-léger 14 pouces avec Windows 11 Pro, complété par un dock 16-en-1, un câble USB4 et un réseau filaire.",
    summaryEn: "Ultra-light 14-inch with Windows 11 Pro, completed with a 16-in-1 dock, a USB4 cable and wired network.",
    powerWatts: "100W PD",
    resolution: "4K 60fps (via dock)",
    items: [
      ali("1005012631967310", "main", {
        name: "CoreBook Air 14\" (Core Ultra 5 226V / 16 Go / Windows 11 Pro)",
        specs: "Core Ultra 5 226V 8 cœurs jusqu'à 4,5 GHz · 16 Go · Windows 11 Pro",
        description: "Ultra-léger, très peu de ventes à ce jour : à considérer comme une option, pas comme un choix éprouvé.",
      }),
      dockCabletime("lt-prem"),
      cableUsb4("lt-prem"),
      ethernetUgreen("lt-prem"),
      hdmiFiber("lt-prem"),
      ssdKodak("lt-prem"),
    ],
    alternativeUnits: [
      ali("1005012967808954", "alt-prem", {
        name: "ACEMAGIC S16 16\" (Ryzen 7 H255 / 24 Go LPDDR5 / 512 Go / Windows 11 Pro)",
        specs: "Ryzen 7 H255 · Radeon 780M · 24 Go LPDDR5 · 512 Go NVMe · Wi-Fi 6",
        description: "L'alternative éprouvée si le Core Ultra manque de recul.",
      }),
    ],
  },
};

const windowsMiniPc: HardwareFormFactor = {
  titleFr: "Windows Desktop & Mini PC",
  titleEn: "Windows Desktop & Mini PC",
  subtitleFr: "Mini PC neufs livrés avec Windows 11, prêts à brancher",
  subtitleEn: "Brand new mini PCs shipped with Windows 11, ready to plug in",
  targetFr: "Clubs souhaitant une machine Windows polyvalente, mur LED haute résolution ou TV 4K",
  targetEn: "Clubs seeking a versatile Windows machine, high-res LED wall or 4K studio TV",
  defaultTier: "recommande",
  tiers: MINIPC_TIERS,
};

const windowsLaptop: HardwareFormFactor = {
  titleFr: "PC Portable (Windows)",
  titleEn: "Laptop (Windows)",
  subtitleFr: "Un portable Windows 11 par gamme, plus le kit de connectique pour l'exploiter fermé en régie",
  subtitleEn: "A Windows 11 laptop for every tier, plus the connectivity kit to run it closed in the control room",
  targetFr: "Clubs qui préfèrent un ordinateur portable polyvalent à une appliance fixe",
  targetEn: "Gyms who prefer a versatile laptop over a fixed appliance",
  defaultTier: "recommande",
  tiers: LAPTOP_TIERS,
};


// -----------------------------------------------------------------------------
// Accessoires supplémentaires (Android)
// -----------------------------------------------------------------------------
const mountOutmixLock = (k: string) =>
  ali("1005005945494291", k, {
    category: "mount",
    name: "Support mural tablette antivol OUTMIX (verrou de sécurité)",
    specs: "Bras extensible métal · verrou antivol · tablettes 7 à 13 pouces",
    description: "Fixe la tablette au mur avec un verrou, pour un pupitre tactile en salle sans risque de vol.",
    hasFan: false,
  });
const mountOutmixArm = (k: string) =>
  ali("1005005458523230", k, {
    category: "mount",
    name: "Bras mural tablette OUTMIX à long bras",
    specs: "Bras long réglable métal · 4 à 13 pouces",
    description: "Bras articulé pour approcher ou éloigner l'écran selon la position du coach.",
    hasFan: false,
  });
const cableUsbcUgreen = (k: string) =>
  ali("1005007138811658", k, {
    category: "power-hub",
    name: "Câble USB-C vers USB-C UGREEN 100 W",
    specs: "USB-C · Power Delivery 100 W · 5 A · charge rapide",
    description: "Alimentation continue de la tablette montée au mur. Vérifiez la longueur choisie sur la fiche.",
    hasFan: false,
  });
const hubUgreen6 = (k: string) =>
  ali("1005010255498921", k, {
    category: "power-hub",
    name: "Hub USB-C UGREEN 6-en-1 (HDMI 4K 120 Hz, RJ45)",
    specs: "HDMI 4K 120Hz · USB-A/C 5 Gbps · Power Delivery 100 W · Ethernet 1000 Mbps",
    description: "Projette la tablette sur le grand écran et la relie au réseau filaire, en un seul câble USB-C.",
    hasFan: false,
  });

// -----------------------------------------------------------------------------
// Linux : mêmes familles de machines, à réinstaller sous Linux
// -----------------------------------------------------------------------------
const LINUX_MINIPC_TIERS: Record<TierKey, HardwareTier> = {
  essentiel: {
    id: "essentiel",
    labelFr: "Essentiel",
    labelEn: "Essential",
    headlineFr: "XCY N150 sans ventilateur — La vraie appliance silencieuse",
    headlineEn: "XCY N150 fanless — The truly silent appliance",
    summaryFr: "Boîtier sans ventilateur, compatible Linux d'après la fiche : idéal en studio poussiéreux, en marche 24 h sur 24. Trois alternatives ventilées plus puissantes.",
    summaryEn: "Fanless case, Linux compatible according to the listing: ideal in dusty studios, running 24/7. Three more powerful fan-cooled alternatives.",
    powerWatts: "6W - 15W",
    resolution: "1080p & 4K",
    items: [
      ali("1005007367188226", "lx-main", {
        name: "XCY Mini PC sans ventilateur (Intel N150 / 4 x Ethernet 2,5G)",
        specs: "Intel N150 · aucun ventilateur · 4 x Ethernet 2,5G · Windows ou Linux",
        hasFan: false,
        description: "Seule machine réellement fanless de la sélection. L'annonce regroupe plusieurs processeurs (N150, J4125, J1900...) : choisissez la variante N150 et la RAM/SSD voulus.",
      }),
      hdmiBaseus("lx-ess"),
      ethernetUgreen("lx-ess"),
      remoteI8("lx-ess"),
      flashMovespeed("lx-ess"),
    ],
    alternativeUnits: [
      ali("1005010678963645", "lx-alt", {
        name: "FIREBAT R2 (Ryzen 5 3500U / 16 Go / 512 Go SSD)",
        specs: "Ryzen 5 3500U · 16 Go · 512 Go SSD · double affichage 4K · Wi-Fi 5",
        description: "Processeur AMD bien pris en charge par Linux. Livré avec Windows 11 : à remplacer par Ubuntu ou Debian.",
      }),
      ali("1005011692049187", "lx-alt", {
        name: "Blackview MP50 (Ryzen 5 3500U / 16 Go DDR4 / 512 Go SSD)",
        specs: "Ryzen 5 3500U · Radeon Vega 8 · 16 Go DDR4 · 512 Go SSD · expédié depuis la Pologne",
        description: "Expédition européenne annoncée sur la fiche. Livré avec Windows 11 Pro.",
      }),
      ali("1005012736853392", "lx-alt", {
        name: "BMAX B3 Pro (Intel N4500 / 8 Go / 256 Go SSD)",
        specs: "Intel N4500 · 8 Go · 256 Go SSD · HDMI 4K 60Hz",
        description: "Petit budget Intel, livré avec Windows 11 à remplacer par Linux.",
      }),
    ],
  },
  recommande: {
    id: "recommande",
    labelFr: "Recommandé",
    labelEn: "Recommended",
    badgeFr: "Meilleur Rapport Puissance/Prix",
    badgeEn: "Best Performance-to-Price",
    isPopular: true,
    headlineFr: "MLLSE G5 Pro Ryzen 7 5800H — Huit cœurs pour un Linux confortable",
    headlineEn: "MLLSE G5 Pro Ryzen 7 5800H — Eight cores for comfortable Linux",
    summaryFr: "Ryzen 7 à huit cœurs, 16 Go de RAM et Wi-Fi 6 : de la marge pour la régie et le décodage vidéo. À réinstaller sous Linux.",
    summaryEn: "Eight-core Ryzen 7, 16 GB RAM and Wi-Fi 6: plenty of headroom for playout and video decoding. Reinstall with Linux.",
    powerWatts: "15W - 45W",
    resolution: "4K 60fps",
    items: [
      ali("1005011751896307", "lx-main", {
        name: "MLLSE G5 Pro (Ryzen 7 5800H / 16 Go / 512 Go SSD)",
        specs: "Ryzen 7 5800H · 16 Go · 512 Go SSD · Wi-Fi 6 · Bluetooth 5.2",
        description: "Très commandé sur AliExpress. Livré avec Windows 11 : installez Ubuntu ou Debian avant usage.",
      }),
      hdmiBaseus("lx-rec"),
      ethernetUgreen("lx-rec"),
      remoteMx3("lx-rec"),
      flashMovespeed("lx-rec"),
    ],
    alternativeUnits: [
      ali("1005011942256447", "lx-alt", {
        name: "FIREBAT AM02 (Ryzen 5 6600H / 16 Go DDR5 / 512 Go SSD)",
        specs: "Ryzen 5 6600H · 16 Go DDR5 · 512 Go SSD · Wi-Fi 6",
        description: "Mémoire DDR5 et graphismes Radeon récents.",
      }),
      ali("1005010617748284", "lx-alt", {
        name: "Blackview MP100 (Ryzen 5 7430U / 16 Go / 512 Go SSD)",
        specs: "Ryzen 5 7430U 6 cœurs 12 threads · 16 Go · 512 Go · Wi-Fi 6",
        description: "Six cœurs Zen 3, l'option la plus sobre du lot.",
      }),
      ali("1005010435673111", "lx-alt", {
        name: "CHUWI UBox (Ryzen 5 6600H / 16 Go LPDDR5 / 512 Go SSD)",
        specs: "Ryzen 5 6600H · 16 Go LPDDR5 · 512 Go · extension M.2",
        description: "Boutique officielle CHUWI, deux emplacements M.2 pour stocker les vidéos.",
      }),
    ],
  },
  pro: {
    id: "pro",
    labelFr: "Pro",
    labelEn: "Pro",
    headlineFr: "BMAX B8 A Pro Ryzen 7 8745HS — Radeon 780M pour le multi-écran",
    headlineEn: "BMAX B8 A Pro Ryzen 7 8745HS — Radeon 780M for multi-screen",
    summaryFr: "Un des meilleurs processeurs graphiques intégrés AMD, parfaitement adapté aux installations multi-écrans sous Linux.",
    summaryEn: "One of AMD's best integrated GPUs, well suited to multi-screen Linux installations.",
    powerWatts: "25W - 65W",
    resolution: "Triple 4K",
    items: [
      ali("1005010143153559", "lx-main", {
        name: "BMAX B8 A Pro (Ryzen 7 8745HS / 16 Go DDR5 / 512 Go SSD)",
        specs: "Ryzen 7 8745HS · Radeon 780M · 16 Go DDR5 · 512 Go NVMe",
        description: "Livré avec Windows 11 : à remplacer par Linux. Le GPU AMD est bien pris en charge par les pilotes libres.",
      }),
      hdmiBaseus("lx-pro"),
      ethernetUgreen("lx-pro"),
      ssdKodak("lx-pro"),
    ],
    alternativeUnits: [
      ali("1005012340565655", "lx-alt", {
        name: "ACEMAGIC (Ryzen 7 H225 / 32 Go LPDDR5 / 1 To SSD)",
        specs: "Ryzen 7 H225 · 32 Go LPDDR5 · 1 To SSD · triple écran 4K",
        description: "Configuration généreuse, boutique officielle ACEMAGIC.",
      }),
      ali("1005009795110087", "lx-alt", {
        name: "GMKtec M6 Ultra (Ryzen 5 7640HS / 16 Go / 512 Go)",
        specs: "Ryzen 5 7640HS · 16 Go · 512 Go PCIe 3.0 · double LAN 2,5G",
        description: "Double réseau 2,5 Gbit/s, boutique GMKtec Direct.",
      }),
      ali("1005011680641618", "lx-alt", {
        name: "FIREBAT F1 P (Ryzen 7 H255 / 16 Go DDR5 / 512 Go SSD)",
        specs: "Ryzen 7 H255 · 16 Go DDR5 · 512 Go SSD · USB4 · Wi-Fi 6",
        description: "Très commandé, avec un port USB4.",
      }),
    ],
  },
  premium: {
    id: "premium",
    labelFr: "Premium",
    labelEn: "Premium",
    badgeFr: "Haut de Gamme",
    badgeEn: "Flagship",
    headlineFr: "PELADN Ryzen AI 9 HX 370 — Le sommet AMD sous Linux",
    headlineEn: "PELADN Ryzen AI 9 HX 370 — The AMD peak on Linux",
    summaryFr: "Douze cœurs Zen 5, 32 Go de RAM rapide et 1 To de SSD PCIe 4.0 : de quoi piloter plusieurs écrans 4K.",
    summaryEn: "Twelve Zen 5 cores, 32 GB fast RAM and a 1 TB PCIe 4.0 SSD: enough to drive several 4K screens.",
    powerWatts: "25W - 65W",
    resolution: "Triple 4K",
    items: [
      ali("1005009305925093", "lx-main", {
        name: "PELADN Mini PC (Ryzen AI 9 HX 370 / 32 Go LPDDR5X / 1 To SSD)",
        specs: "Ryzen AI 9 HX 370 12 cœurs · 32 Go LPDDR5X · 1 To PCIe 4.0 · Wi-Fi 7 · USB4",
        description: "Boutique officielle PELADN. Livré avec Windows : à remplacer par Linux (noyau récent recommandé pour ce processeur).",
      }),
      hdmiFiber("lx-prem"),
      ethernetUgreen("lx-prem"),
      ssdKodak("lx-prem"),
    ],
    alternativeUnits: [
      ali("1005012474520295", "lx-alt", {
        name: "PELADN HO5 AI (Ryzen AI 9 HX 470 / 32 Go DDR5 / 1 To SSD)",
        specs: "Ryzen AI 9 HX 470 · 32 Go DDR5 · 1 To · Wi-Fi 7 · OCuLink",
        description: "La génération la plus récente, encore peu vendue : lisez les avis.",
      }),
      ali("1005012261652447", "lx-alt", {
        name: "FIREBAT A8 (Ryzen AI 9 365 / 32 Go DDR5 / 1 To SSD)",
        specs: "Ryzen AI 9 365 · 32 Go DDR5 · 1 To PCIe 4.0 · OCuLink · 2 USB4",
        description: "Boutique officielle Firebat.",
      }),
      ali("1005009606529991", "lx-alt", {
        name: "BMAX B11 Power (Core Ultra 7 155H / 24 Go LPDDR5 / 1 To)",
        specs: "Core Ultra 7 155H · 24 Go LPDDR5 · 1 To SSD · Wi-Fi 6",
        description: "L'alternative Intel Core Ultra, nettement moins chère.",
      }),
    ],
  },
};

const LINUX_LAPTOP_TIERS: Record<TierKey, HardwareTier> = {
  essentiel: {
    id: "essentiel",
    labelFr: "Essentiel",
    labelEn: "Essential",
    headlineFr: "ACEMAGIC AX18PRO 18,5\" — Très grand écran, AMD",
    headlineEn: "ACEMAGIC AX18PRO 18.5\" — Very large screen, AMD",
    summaryFr: "Portable AMD à très grand écran et 16 Go de RAM, complété par le hub USB-C minimal. À réinstaller sous Linux.",
    summaryEn: "AMD laptop with a very large screen and 16 GB RAM, completed with the minimal USB-C hub. Reinstall with Linux.",
    powerWatts: "100W PD",
    resolution: "4K 60fps (via hub)",
    items: [
      ali("1005009759927376", "lx-main", {
        name: "ACEMAGIC AX18PRO 18,5\" (Ryzen 3 4300U / 16 Go / 512 Go / Windows 11 Pro)",
        specs: "Ryzen 3 4300U · 16 Go LPDDR4 · 512 Go SSD · écran 18,5 pouces · batterie 7000 mAh",
        description: "Très commandé. Livré avec Windows 11 Pro : à remplacer par Linux.",
      }),
      hubUgreenRj45("lx-lt-ess"),
      hdmiBaseus("lx-lt-ess"),
      remoteI8("lx-lt-ess"),
      flashMovespeed("lx-lt-ess"),
    ],
    alternativeUnits: [
      ali("1005011904515834", "lx-alt", {
        name: "Ninkear 14\" (Ryzen 5 6600H / 16 Go LPDDR5 / 512 Go)",
        specs: "Ryzen 5 6600H · 16 Go LPDDR5 · 512 Go · écran 14\" 2.2K · 1 kg",
        description: "Plus compact et plus puissant, pour un budget supérieur.",
      }),
    ],
  },
  recommande: {
    id: "recommande",
    labelFr: "Recommandé",
    labelEn: "Recommended",
    badgeFr: "Meilleur Rapport Puissance/Prix",
    badgeEn: "Best Performance-to-Price",
    isPopular: true,
    headlineFr: "Ninkear A15 Pro Ryzen 5 — 16 pouces, 16 Go & 1 To",
    headlineEn: "Ninkear A15 Pro Ryzen 5 — 16-inch, 16 GB & 1 TB",
    summaryFr: "Portable métal à écran 16 pouces 2.5K, complété par le hub, le support et le réseau filaire. À réinstaller sous Linux.",
    summaryEn: "Metal 16-inch 2.5K laptop, completed with the hub, stand and wired network. Reinstall with Linux.",
    powerWatts: "100W PD",
    resolution: "4K 60fps (via hub)",
    items: [
      ali("1005012036800477", "lx-main", {
        name: "Ninkear A15 Pro 16\" (Ryzen 5 5500U / 16 Go / 1 To SSD)",
        specs: "Ryzen 5 5500U · 16 Go · 1 To · écran 16\" 2.5K 120Hz IPS",
        description: "Processeur AMD bien pris en charge par Linux. Livré avec Windows 11.",
      }),
      hubUgreen8("lx-lt-rec"),
      standBaseus("lx-lt-rec"),
      ethernetUgreen("lx-lt-rec"),
      remoteMx3("lx-lt-rec"),
      flashMovespeed("lx-lt-rec"),
    ],
    alternativeUnits: [
      ali("1005012985645862", "lx-alt", {
        name: "CHUWI CoreBook Air Plus 16\" (Ryzen 5 6600H / 16 Go / 512 Go)",
        specs: "Ryzen 5 6600H · 16 Go · 512 Go SSD · ultra-léger 16 pouces",
        description: "Vendu par la boutique CHUWI EU Choice.",
      }),
      ali("1005011904515834", "lx-alt-b", {
        name: "Ninkear 14\" (Ryzen 5 6600H / 16 Go LPDDR5 / 512 Go)",
        specs: "Ryzen 5 6600H · 16 Go LPDDR5 · 512 Go · écran 14\" 2.2K · 1 kg",
        description: "Le plus léger de la sélection.",
      }),
    ],
  },
  pro: {
    id: "pro",
    labelFr: "Pro",
    labelEn: "Pro",
    headlineFr: "ACEMAGIC LX15PRO Ryzen 7 — Puissance multitâche",
    headlineEn: "ACEMAGIC LX15PRO Ryzen 7 — Multitasking power",
    summaryFr: "Portable Ryzen 7 à écran IPS 15,6 pouces, complété par un dock USB4 pour le multi-écran.",
    summaryEn: "Ryzen 7 laptop with a 15.6-inch IPS display, completed with a USB4 dock for multi-screen.",
    powerWatts: "96W PD",
    resolution: "Multi-écran (via dock)",
    items: [
      ali("1005012643971397", "lx-main", {
        name: "ACEMAGIC LX15PRO 15,6\" (Ryzen 7 7730U / 16 Go / 512 Go)",
        specs: "Ryzen 7 7730U · 16 Go DDR4 · 512 Go NVMe · écran IPS 15,6\"",
        description: "Peu de ventes à ce jour sur cette annonce : lisez les avis.",
      }),
      dockHagibis("lx-lt-pro"),
      standBaseus("lx-lt-pro"),
      cableUsb4("lx-lt-pro"),
      ssdKodak("lx-lt-pro"),
    ],
    alternativeUnits: [
      ali("1005012967808954", "lx-alt", {
        name: "ACEMAGIC S16 16\" (Ryzen 7 H255 / 24 Go LPDDR5 / 512 Go)",
        specs: "Ryzen 7 H255 · Radeon 780M · 24 Go LPDDR5 · 512 Go NVMe",
        description: "Nettement plus puissant côté graphique.",
      }),
      ali("1005006098452747", "lx-alt", {
        name: "CHUWI CoreBook Air Plus 16\" — boutique officielle",
        specs: "Ryzen 5 6600H · 16 Go · 512 Go SSD · ultra-léger 16 pouces",
        description: "Très bien vendu sur la boutique officielle CHUWI.",
      }),
    ],
  },
  premium: {
    id: "premium",
    labelFr: "Premium",
    labelEn: "Premium",
    badgeFr: "Kit Complet",
    badgeEn: "Full Kit",
    headlineFr: "ACEMAGIC S16 Ryzen 7 H255 — 24 Go & Radeon 780M",
    headlineEn: "ACEMAGIC S16 Ryzen 7 H255 — 24 GB & Radeon 780M",
    summaryFr: "Le portable AMD le plus puissant de la sélection, complété par un dock 16-en-1, un câble USB4 et un réseau filaire.",
    summaryEn: "The most powerful AMD laptop in the selection, completed with a 16-in-1 dock, a USB4 cable and wired network.",
    powerWatts: "100W PD",
    resolution: "4K 60fps (via dock)",
    items: [
      ali("1005012967808954", "lx-main-prem", {
        name: "ACEMAGIC S16 16\" (Ryzen 7 H255 / 24 Go LPDDR5 / 512 Go / Windows 11 Pro)",
        specs: "Ryzen 7 H255 · Radeon 780M · 24 Go LPDDR5 · 512 Go NVMe · Wi-Fi 6",
        description: "Livré avec Windows 11 Pro : à remplacer par Linux. Le GPU AMD est bien pris en charge.",
      }),
      dockCabletime("lx-lt-prem"),
      cableUsb4("lx-lt-prem"),
      ethernetUgreen("lx-lt-prem"),
      hdmiFiber("lx-lt-prem"),
      ssdKodak("lx-lt-prem"),
    ],
    alternativeUnits: [
      ali("1005012643971397", "lx-alt-prem", {
        name: "ACEMAGIC LX15PRO 15,6\" (Ryzen 7 7730U / 16 Go / 512 Go)",
        specs: "Ryzen 7 7730U · 16 Go DDR4 · 512 Go NVMe · écran IPS 15,6\"",
        description: "Une option plus sobre et moins chère.",
      }),
    ],
  },
};

// -----------------------------------------------------------------------------
// Android : tablettes tactiles + fixation murale
// -----------------------------------------------------------------------------
const ANDROID_TIERS: Record<TierKey, HardwareTier> = {
  essentiel: {
    id: "essentiel",
    labelFr: "Essentiel",
    labelEn: "Essential",
    headlineFr: "Lenovo Xiaoxin Pad 11 + Support Mural Antivol",
    headlineEn: "Lenovo Xiaoxin Pad 11 + Anti-theft Wall Mount",
    summaryFr: "Tablette 11 pouces 2,5K 90 Hz au prix d'une tablette d'entrée de gamme, avec support mural à verrou et câble d'alimentation.",
    summaryEn: "11-inch 2.5K 90 Hz tablet at an entry-level price, with a locking wall mount and power cable.",
    powerWatts: "10W - 30W",
    resolution: "Écran 2.5K",
    items: [
      ali("1005010626634585", "an-main", {
        name: "Lenovo Xiaoxin Pad 11 2025 (Dimensity 6300 / écran 11\" 2.5K 90 Hz)",
        specs: "MediaTek Dimensity 6300 · 11\" 2.5K 90Hz · batterie 7040 mAh · ROM globale",
        hasFan: false,
        description: "Vérifiez que la ROM est bien « globale » (Google Play, français) sur la fiche vendeur avant de commander.",
      }),
      mountOutmixLock("an-ess"),
      cableUsbcUgreen("an-ess"),
    ],
    alternativeUnits: [
      ali("1005012939859854", "an-alt", {
        name: "Xiaomi Redmi Pad 2 (Helio G100-Ultra / 11\" 90 Hz)",
        specs: "Helio G100-Ultra · 11\" 90Hz · batterie 9000 mAh · stockage extensible",
        hasFan: false,
        description: "Version mondiale, très commandée sur AliExpress.",
      }),
      ali("1005012698634190", "an-alt", {
        name: "Xiaomi Redmi Pad 2 WIFI (écran 2.5K 90 Hz / 9000 mAh)",
        specs: "Helio G100-Ultra · écran 2.5K 90Hz · batterie 9000 mAh · charge rapide",
        hasFan: false,
        description: "Même tablette, autre vendeur.",
      }),
    ],
  },
  recommande: {
    id: "recommande",
    labelFr: "Recommandé",
    labelEn: "Recommended",
    badgeFr: "Meilleur Rapport Puissance/Prix",
    badgeEn: "Best Performance-to-Price",
    isPopular: true,
    headlineFr: "Xiaomi Pad 7 144 Hz + Hub USB-C HDMI — Pupitre & projection TV",
    headlineEn: "Xiaomi Pad 7 144 Hz + USB-C HDMI Hub — Console & TV projection",
    summaryFr: "Snapdragon 7+ Gen 3 et écran 3,2K 144 Hz, avec hub USB-C pour projeter sur le grand écran et support mural antivol.",
    summaryEn: "Snapdragon 7+ Gen 3 and 3.2K 144 Hz display, with a USB-C hub to project on the big screen and an anti-theft wall mount.",
    powerWatts: "15W - 45W",
    resolution: "3.2K 144Hz",
    items: [
      ali("1005012029926789", "an-main", {
        name: "Xiaomi Pad 7 (Snapdragon 7+ Gen 3 / 11,2\" 3.2K 144 Hz)",
        specs: "Snapdragon 7+ Gen 3 · 11,2\" 3.2K 144Hz · batterie 8850 mAh · version internationale",
        hasFan: false,
        description: "Même tablette que la référence recommandée Amazon, vendue en version internationale.",
      }),
      hubUgreen6("an-rec"),
      mountOutmixLock("an-rec"),
      cableUsbcUgreen("an-rec"),
    ],
    alternativeUnits: [
      ali("1005011941332108", "an-alt", {
        name: "POCO Pad M1 (Snapdragon 7s Gen 4 / 2.5K 120 Hz)",
        specs: "Snapdragon 7s Gen 4 · écran 2.5K 120Hz · charge 33 W · version globale",
        hasFan: false,
        description: "Très commandée (plus de 1400 ventes), pour un prix inférieur.",
      }),
      ali("1005011779542897", "an-alt", {
        name: "POCO Pad X1 (Snapdragon 7+ Gen 3 / 3.2K 144 Hz)",
        specs: "Snapdragon 7+ Gen 3 · écran 3,2K 144Hz · batterie 8850 mAh · charge 45 W",
        hasFan: false,
        description: "Même processeur que le Xiaomi Pad 7, version globale.",
      }),
    ],
  },
  pro: {
    id: "pro",
    labelFr: "Pro",
    labelEn: "Pro",
    headlineFr: "Xiaomi Pad 8 Pro — Snapdragon 8 Elite & Wi-Fi 7",
    headlineEn: "Xiaomi Pad 8 Pro — Snapdragon 8 Elite & Wi-Fi 7",
    summaryFr: "Tablette haut de gamme 11,2\" 3,2K 144 Hz avec Wi-Fi 7, hub réseau filaire et bras mural articulé.",
    summaryEn: "High-end 11.2\" 3.2K 144 Hz tablet with Wi-Fi 7, wired network hub and articulated wall arm.",
    powerWatts: "15W - 45W",
    resolution: "3.2K 144Hz",
    items: [
      ali("1005012569625035", "an-main", {
        name: "Xiaomi Pad 8 Pro (Snapdragon 8 Elite / 11,2\" 3.2K 144 Hz / Wi-Fi 7)",
        specs: "Snapdragon 8 Elite · 11,2\" 3.2K 144Hz · 9200 mAh · Wi-Fi 7 · sans chargeur",
        hasFan: false,
        description: "Livrée sans chargeur d'après la fiche. Peu de ventes à ce jour : lisez les avis.",
      }),
      hubUgreen6("an-pro"),
      mountOutmixArm("an-pro"),
      cableUsbcUgreen("an-pro"),
    ],
    alternativeUnits: [
      ali("1005011812750575", "an-alt", {
        name: "Xiaomi Pad 8 Pro (8 Go / 256 Go, Wi-Fi 7)",
        specs: "Snapdragon 8 Elite · 3,2K · Wi-Fi 7 · 8 Go/256 Go ou 12 Go/512 Go",
        hasFan: false,
        description: "Même tablette, autre vendeur.",
      }),
      ali("1005010122467382", "an-alt", {
        name: "Xiaomi Redmi Pad 2 Pro (12,1\" 2.5K / 12 000 mAh)",
        specs: "Snapdragon 7s Gen 4 · 12,1\" 2.5K · batterie 12 000 mAh · version mondiale",
        hasFan: false,
        description: "Grand écran et énorme batterie, pour un prix nettement plus bas.",
      }),
    ],
  },
  premium: {
    id: "premium",
    labelFr: "Premium",
    labelEn: "Premium",
    badgeFr: "Écran Géant",
    badgeEn: "Giant Screen",
    headlineFr: "OnePlus Pad 4 13,2\" — Écran Géant & Bras Renforcé",
    headlineEn: "OnePlus Pad 4 13.2\" — Giant Screen & Reinforced Arm",
    summaryFr: "Le plus grand écran de la sélection : 13,2 pouces 3,4K 144 Hz, Snapdragon 8 Elite Gen 5 et huit haut-parleurs.",
    summaryEn: "The largest screen in the selection: 13.2-inch 3.4K 144 Hz, Snapdragon 8 Elite Gen 5 and eight speakers.",
    powerWatts: "15W - 55W",
    resolution: "3.4K 144Hz",
    items: [
      ali("1005012387257329", "an-main", {
        name: "OnePlus Pad 4 (Snapdragon 8 Elite Gen 5 / 13,2\" 3.4K 144 Hz)",
        specs: "Snapdragon 8 Elite Gen 5 · 13,2\" 3.4K 144Hz · Wi-Fi 7 · Android 16 · version européenne",
        hasFan: false,
        description: "Peu de ventes à ce jour (annonce récente) : lisez les avis avant de commander.",
      }),
      hubUgreen6("an-prem"),
      mountOutmixArm("an-prem"),
      cableUsbcUgreen("an-prem"),
    ],
    alternativeUnits: [
      ali("1005008666557560", "an-alt", {
        name: "Xiaomi Pad 7 Pro (Snapdragon 8s Gen 3 / 11,2\" 3.2K 144 Hz)",
        specs: "Snapdragon 8s Gen 3 · 11,2\" 3.2K 144Hz · 8850 mAh · 50 MP · version mondiale",
        hasFan: false,
        description: "Une option plus compacte. Très peu de ventes sur cette annonce.",
      }),
      ali("1005011812750575", "an-alt-prem", {
        name: "Xiaomi Pad 8 Pro (8 Go / 256 Go, Wi-Fi 7)",
        specs: "Snapdragon 8 Elite · 3,2K · Wi-Fi 7 · 8 Go/256 Go ou 12 Go/512 Go",
        hasFan: false,
        description: "L'alternative éprouvée, plus compacte.",
      }),
    ],
  },
};

const linuxMiniPc: HardwareFormFactor = {
  titleFr: "Linux Appliance Dédiée",
  titleEn: "Dedicated Linux Appliance",
  subtitleFr: "Mini PC autonomes à réinstaller sous Linux, dont un modèle sans ventilateur",
  subtitleEn: "Standalone mini PCs to reinstall with Linux, including a fanless model",
  targetFr: "Studios de cycling immersif et cours virtuels quotidiens, régie autonome sans bureau",
  targetEn: "Immersive cycling studios and daily virtual classes, standalone control room",
  defaultTier: "recommande",
  tiers: LINUX_MINIPC_TIERS,
};

const linuxLaptop: HardwareFormFactor = {
  titleFr: "PC Portable (Linux)",
  titleEn: "Laptop (Linux)",
  subtitleFr: "Un portable AMD par gamme à réinstaller sous Linux, plus le kit de connectique",
  subtitleEn: "An AMD laptop for every tier to reinstall with Linux, plus the connectivity kit",
  targetFr: "Clubs qui préfèrent un ordinateur portable polyvalent à une appliance fixe",
  targetEn: "Gyms who prefer a versatile laptop over a fixed appliance",
  defaultTier: "recommande",
  tiers: LINUX_LAPTOP_TIERS,
};

const ANDROID_TV_TIERS: Record<TierKey, HardwareTier> = {
  essentiel: {
    id: "essentiel",
    labelFr: "Essentiel",
    labelEn: "Essential",
    headlineFr: "Boîtier TV X96 Max+ Ultra 4K + Clé USB + Télécommande Air Mouse",
    headlineEn: "X96 Max+ Ultra 4K TV Box + USB Drive + Air Mouse Remote",
    summaryFr: "Boîtier abordable doté de 4 Go de RAM et 64 Go de stockage interne avec télécommande gyroscopique air-mouse et clé USB pour vos cours.",
    summaryEn: "Affordable box equipped with 4GB RAM and 64GB storage, gyroscopic air-mouse remote and USB drive for class storage.",
    powerWatts: "5W - 8W",
    resolution: "4K UHD 60Hz",
    items: [
      ali("1005012776659803", "tv-ali-ess", {
        name: "Boîtier TV X96 Max+ Ultra 4K (4 Go / 64 Go)",
        specs: "Android 11 · Amlogic S905X4 · 4 Go RAM · 64 Go ROM · Ethernet · USB 3.0",
        description: "Boîtier économique généreux en mémoire vive et stockage pour les cours locaux et l'installation de Bobine Kiosque.",
        hasFan: false,
      }),
      hdmiBaseus("tv-ali-ess"),
      flashMovespeed("tv-ali-ess"),
      remoteMx3("tv-ali-ess"),
    ],
    alternativeUnits: [
      ali("1005006492898488", "tv-ali-ess-alt", {
        name: "MECOOL KM7 PLUS Boîtier Google TV 4K",
        specs: "Google TV officiel · Amlogic S905Y4 · 2 Go RAM · 16 Go ROM · 4K HDR",
        description: "Alternative certifiée officielle Google TV avec interface Leanback native.",
        hasFan: false,
      }),
    ],
  },
  recommande: {
    id: "recommande",
    labelFr: "Recommandé",
    labelEn: "Recommended",
    isPopular: true,
    headlineFr: "MECOOL KM7 PLUS 4K Google TV + Câble HDMI Baseus + Clé USB 128 Go",
    headlineEn: "MECOOL KM7 PLUS 4K Google TV + Baseus HDMI Cable + 128GB USB Drive",
    summaryFr: "Le juste équilibre certifié Google TV officiel : port USB pour clé de cours amovible, télécommande Bluetooth et câble Ethernet Cat8 pour diffusion continue.",
    summaryEn: "Balanced certified Google TV setup: USB port for removable class storage, Bluetooth remote, and Cat8 Ethernet cable.",
    powerWatts: "8W - 12W",
    resolution: "4K UHD 60Hz",
    items: [
      ali("1005006492898488", "tv-ali-rec", {
        name: "MECOOL KM7 PLUS Boîtier Google TV 4K",
        specs: "Google TV officiel · Amlogic S905Y4 · 2 Go RAM · 16 Go ROM · 4K HDR",
        description: "Boîtier compact certifié Google TV, parfait pour installer Bobine Kiosque et diffuser en toute fluidité avec télécommande vocale.",
        hasFan: false,
      }),
      hdmiBaseus("tv-ali-rec"),
      flashMovespeed("tv-ali-rec"),
      ethernetUgreen("tv-ali-rec"),
    ],
    alternativeUnits: [
      ali("1005012776659803", "tv-ali-rec-alt", {
        name: "Boîtier TV X96 Max+ Ultra 4K (4 Go / 64 Go)",
        specs: "Android 11 · Amlogic S905X4 · 4 Go RAM · 64 Go ROM · Ethernet",
        description: "Alternative avec 4 Go de mémoire vive pour un multitâche renforcé.",
        hasFan: false,
      }),
    ],
  },
  pro: {
    id: "pro",
    labelFr: "Pro",
    labelEn: "Pro",
    headlineFr: "MECOOL KM2 PLUS Deluxe (Wi-Fi 6 & Gigabit) + SSD Portable KODAK",
    headlineEn: "MECOOL KM2 PLUS Deluxe (Wi-Fi 6 & Gigabit) + KODAK Portable SSD",
    summaryFr: "Boîtier TV haute cadence avec port Ethernet Gigabit 1000 Mbps filaire, 4 Go de RAM, Wi-Fi 6 et disque SSD portable pour une vitesse d'accès maximale.",
    summaryEn: "High-cadence TV box with wired 1000 Mbps Gigabit Ethernet, 4GB RAM, Wi-Fi 6, and portable SSD drive for maximum access speed.",
    powerWatts: "10W - 15W",
    resolution: "4K UHD 60Hz HDR",
    items: [
      ali("1005006303737998", "tv-ali-pro", {
        name: "MECOOL KM2 PLUS Deluxe 4K Google TV (Wi-Fi 6 & Gigabit)",
        specs: "Amlogic S905X4 · 4 Go RAM · 32 Go ROM · Wi-Fi 6 · Ethernet Gigabit 1000 Mbps",
        description: "Boîtier TV haut de gamme avec Ethernet Gigabit pour liaison filaire ultra-stable et 4 Go de mémoire pour les cours les plus exigeants.",
        hasFan: false,
      }),
      hdmiBaseus("tv-ali-pro"),
      ssdKodak("tv-ali-pro"),
      ethernetUgreen("tv-ali-pro"),
    ],
    alternativeUnits: [
      ali("1005012358422552", "tv-ali-pro-alt", {
        name: "MECOOL KM2 PLUS Boîtier Smart TV 4K",
        specs: "Google TV certifié · 4K 60fps · Port USB natif · Télécommande vocale D-Pad",
        description: "La version classique avec Google TV officiel.",
        hasFan: false,
      }),
    ],
  },
  premium: {
    id: "premium",
    labelFr: "Premium",
    labelEn: "Premium",
    headlineFr: "X96 X10 Pro S928X (8 Go DDR4 / Cortex-A76) + Câble Fibre Optique 10 m + SSD 1 To",
    headlineEn: "X96 X10 Pro S928X (8GB DDR4 / Cortex-A76) + 10m Optical Fiber Cable + 1TB SSD",
    summaryFr: "Le fleuron absolu : puce Amlogic S928X ultra-puissante avec cœur Cortex-A76, 8 Go de RAM DDR4, décodage 8K/4K 120Hz, câble HDMI fibre optique 10 m et disque SSD 1 To.",
    summaryEn: "The undisputed flagship: high-power Amlogic S928X chip with Cortex-A76 core, 8GB DDR4 RAM, 8K/4K 120Hz decoding, 10m fiber optic HDMI cable, and 1TB SSD.",
    powerWatts: "15W - 25W",
    resolution: "8K UHD / 4K 120Hz HDR",
    items: [
      ali("1005006103642542", "tv-ali-prem", {
        name: "Boîtier TV X96 X10 Pro Amlogic S928X (8 Go RAM / 64 Go ROM)",
        specs: "Amlogic S928X Cortex-A76 · 8 Go DDR4 · 64 Go ROM · Wi-Fi 6 · Ethernet Gigabit 1000 Mbps · 8K/4K 120Hz",
        description: "Le boîtier le plus puissant d'AliExpress : processeur penta-core avec cœur ARM Cortex-A76 haute cadence, 8 Go de RAM DDR4 et fluidité absolue.",
        hasFan: false,
      }),
      hdmiFiber("tv-ali-prem"),
      ssdKodak("tv-ali-prem"),
      ethernetUgreen("tv-ali-prem"),
    ],
    alternativeUnits: [
      ali("1005006303737998", "tv-ali-prem-alt", {
        name: "MECOOL KM2 PLUS Deluxe 4K Google TV (Wi-Fi 6 & Gigabit)",
        specs: "Amlogic S905X4 · 4 Go RAM · 32 Go ROM · Wi-Fi 6 · Ethernet Gigabit 1000 Mbps",
        description: "L'alternative certifiée Google TV officiel avec port réseau Gigabit.",
        hasFan: false,
      }),
    ],
  },
};

const androidTv: HardwareFormFactor = {
  titleFr: "Android TV & Kiosque Grand Écran",
  titleEn: "Android TV & Big Screen Kiosk",
  subtitleFr: "Boîtiers TV et streaming 100% pilotables à la télécommande, avec stockage externe USB pour vos cours",
  subtitleEn: "Streaming boxes fully operable via remote control, with external USB storage for your classes",
  targetFr: "Studios fitness, cours collectifs sur grand écran, régie autonome sans clavier ni souris",
  targetEn: "Fitness studios, group classes on big screens, standalone playout without keyboard or mouse",
  defaultTier: "recommande",
  tiers: ANDROID_TV_TIERS,
};

const androidTablet: HardwareFormFactor = {
  titleFr: "Android Tactile & Mobilité",
  titleEn: "Android Touch & Mobility",
  subtitleFr: "Pupitre tactile au doigt pour le coach avec projection vidéo directe sur grand écran",
  subtitleEn: "Touch console for the coach with direct video projection on a big screen",
  targetFr: "Coachs qui pilotent la séance depuis la salle, tablette fixée au mur",
  targetEn: "Coaches driving the session from the room, tablet wall-mounted",
  defaultTier: "recommande",
  tiers: ANDROID_TIERS,
};

// -----------------------------------------------------------------------------
// ARM64 : cartes et kits Raspberry Pi 5 / Rock 5B RK3588 sous Linux ARM64
// -----------------------------------------------------------------------------
const ARM_MINIPC_TIERS: Record<TierKey, HardwareTier> = {
  essentiel: {
    id: "essentiel",
    labelFr: "Essentiel",
    labelEn: "Essential",
    headlineFr: "Raspberry Pi 5 BCM2712 Cortex-A76 — L'entrée Linux ARM64 compacte",
    headlineEn: "Raspberry Pi 5 BCM2712 Cortex-A76 — Compact Linux ARM64 entry",
    summaryFr: "Carte Raspberry Pi 5 officielle à processeur Broadcom BCM2712 quad-core Cortex-A76 2,4 GHz, accompagnée du réseau filaire et de la télécommande.",
    summaryEn: "Official Raspberry Pi 5 board with Broadcom BCM2712 quad-core 2.4 GHz Cortex-A76 processor, paired with wired networking and remote control.",
    powerWatts: "5W - 12W",
    resolution: "Double 4K 60fps",
    items: [
      ali("1005010530220745", "arm-ali-ess", {
        name: "Raspberry Pi 5 BCM2712 Quad-Core Arm Cortex-A76 2,4 GHz (Options 4 Go / 8 Go)",
        specs: "Broadcom BCM2712 Cortex-A76 64 bits 2,4 GHz · Double Micro-HDMI 4K60 · Gigabit Ethernet · PCIe 2.0",
        description: "Exécute nativement le paquet bobine_x.y.z_arm64.deb sous Raspberry Pi OS / Debian ARM64. Choisissez la variante 8 Go sur la fiche vendeur.",
        hasFan: false,
      }),
      ethernetUgreen("arm-ali-ess"),
      remoteI8("arm-ali-ess"),
      flashMovespeed("arm-ali-ess"),
    ],
    alternativeUnits: [
      ali("1005009119644607", "arm-ali-ess-alt", {
        name: "Kit Raspberry Pi 5 8 Go (Alimentation PD, Ventilateur dissipateur, Carte 64 Go)",
        specs: "Raspberry Pi 5 · Alimentation USB-C PD · Dissipateur ventilé actif · Carte 64 Go + lecteur",
        description: "Kit complet prêt à monter avec refroidissement actif et alimentation dédiée.",
        hasFan: true,
      }),
    ],
  },
  recommande: {
    id: "recommande",
    labelFr: "Recommandé",
    labelEn: "Recommended",
    badgeFr: "Kit Complet ARM64",
    badgeEn: "Full ARM64 Kit",
    isPopular: true,
    headlineFr: "Kit Raspberry Pi 5 8 Go Ventilé + Alimentation USB-C PD + Clé USB-C",
    headlineEn: "Cooled Raspberry Pi 5 8GB Kit + USB-C PD Power + USB-C Drive",
    summaryFr: "Pack complet comprenant la carte Raspberry Pi 5, son dissipateur ventilé, l'alimentation USB-C Power Delivery, une carte 64 Go et les accessoires de régie.",
    summaryEn: "Complete pack including the Raspberry Pi 5 board, active heatsink fan, USB-C Power Delivery supply, 64GB card and control room accessories.",
    powerWatts: "5W - 12W",
    resolution: "Double 4K 60fps",
    items: [
      ali("1005009119644607", "arm-ali-rec", {
        name: "Kit Raspberry Pi 5 8 Go / 16 Go (Alimentation PD, Ventilateur, Carte 64 Go, RTC)",
        specs: "BCM2712 Cortex-A76 2,4 GHz · Ventilateur PWM actif · Alimentation USB-C PD · Carte 64 Go",
        description: "Solution clé en main refroidie activement pour faire tourner Bobine Linux ARM64 24h/24 en régie.",
        hasFan: true,
      }),
      ethernetUgreen("arm-ali-rec"),
      remoteMx3("arm-ali-rec"),
      flashMovespeed("arm-ali-rec"),
    ],
    alternativeUnits: [
      ali("1005012743637315", "arm-ali-rec-alt", {
        name: "Raspberry Pi 5 Original 8 Go / 16 Go Cortex-A76 (Board Master Store)",
        specs: "Broadcom BCM2712 Cortex-A76 · Options jusqu'à 16 Go LPDDR4X · PCIe · Gigabit Ethernet",
        description: "Annonce proposant la déclinaison 16 Go de RAM pour une marge mémoire doublée sous Linux ARM64.",
        hasFan: false,
      }),
    ],
  },
  pro: {
    id: "pro",
    labelFr: "Pro",
    labelEn: "Pro",
    headlineFr: "Raspberry Pi 5 16 Go LPDDR4X + SSD Portable KODAK + Réseau Cat8",
    headlineEn: "Raspberry Pi 5 16GB LPDDR4X + KODAK Portable SSD + Cat8 Network",
    summaryFr: "Configuration 16 Go de mémoire vive avec stockage SSD externe haute vitesse en USB 3.0 pour héberger une large vidéothèque de cours en local.",
    summaryEn: "16GB RAM configuration with high-speed external USB 3.0 SSD storage to host a large local class video library.",
    powerWatts: "6W - 15W",
    resolution: "Double 4K 60fps",
    items: [
      ali("1005012743637315", "arm-ali-pro", {
        name: "Raspberry Pi 5 Original (Version 16 Go RAM Cortex-A76 Linux ARM64)",
        specs: "Cortex-A76 Quad-Core 2,4 GHz · Jusqu'à 16 Go RAM · USB 3.0 · Gigabit Ethernet · PCIe",
        description: "Version haute capacité mémoire du Raspberry Pi 5, idéale pour combiner Bobine et bobine-assistant-arm64.",
        hasFan: false,
      }),
      ethernetUgreen("arm-ali-pro"),
      remoteMx3("arm-ali-pro"),
      ssdKodak("arm-ali-pro"),
    ],
    alternativeUnits: [
      ali("1005012461480262", "arm-ali-pro-alt", {
        name: "Radxa ROCK 5B+ RK3588 Octa-Core (HDMI 8K & Wi-Fi 6)",
        specs: "Rockchip RK3588 8 cœurs · Sortie HDMI 2.1 8K · Wi-Fi 6 · M.2 NVMe · LAN 2.5 GbE",
        description: "Passage au processeur 8 cœurs Rockchip RK3588 avec sortie HDMI 2.1 plein format.",
        hasFan: false,
      }),
    ],
  },
  premium: {
    id: "premium",
    labelFr: "Premium",
    labelEn: "Premium",
    badgeFr: "Octa-Core RK3588 8K",
    badgeEn: "8K Octa-Core RK3588",
    headlineFr: "Radxa ROCK 5B+ RK3588 Octa-Core + SSD KODAK + Câble Fibre Optique 10 m",
    headlineEn: "Radxa ROCK 5B+ RK3588 Octa-Core + KODAK SSD + 10m Optical Fiber Cable",
    summaryFr: "Puce 8 cœurs Rockchip RK3588 (4x Cortex-A76 + 4x Cortex-A55) avec décodage matériel 8K60, Wi-Fi 6, SSD externe et liaison HDMI 2.1 fibre optique de 10 mètres.",
    summaryEn: "8-core Rockchip RK3588 chip (4x Cortex-A76 + 4x Cortex-A55) with 8K60 hardware decoding, Wi-Fi 6, external SSD and 10-meter fiber optic HDMI 2.1 link.",
    powerWatts: "8W - 18W",
    resolution: "4K 120fps / 8K 60fps",
    items: [
      ali("1005012461480262", "arm-ali-prem", {
        name: "Carte Radxa ROCK 5B+ RK3588 Octa-Core (HDMI 8K, Wi-Fi 6, Double NVMe)",
        specs: "Rockchip RK3588 Octa-Core · HDMI 2.1 8K · Wi-Fi 6 · LAN 2.5 GbE · Linux ARM64",
        description: "Puissance ARM64 8 cœurs sous Debian/Ubuntu ARM64 pour une diffusion multi-flux 4K/8K sans compromis.",
        hasFan: false,
      }),
      hdmiFiber("arm-ali-prem"),
      ethernetUgreen("arm-ali-prem"),
      remoteMx3("arm-ali-prem"),
      ssdKodak("arm-ali-prem"),
    ],
    alternativeUnits: [
      ali("1005011544464931", "arm-ali-prem-alt", {
        name: "Radxa ROCK 5B RK3588 Octa-Core 8K",
        specs: "Rockchip RK3588 8 cœurs · Sortie 8K · LAN 2.5 GbE · M.2 NVMe",
        description: "Révision ROCK 5B classique à processeur RK3588.",
        hasFan: false,
      }),
    ],
  },
};

const armMiniPc: HardwareFormFactor = {
  titleFr: "Mini PC & Stations ARM64",
  titleEn: "ARM64 Mini PCs & Workstations",
  subtitleFr: "Cartes et kits Linux ARM64 (Raspberry Pi 5, RK3588) ultra-sobres pour régie 24/7",
  subtitleEn: "Ultra-efficient Linux ARM64 boards and kits (Raspberry Pi 5, RK3588) for 24/7 playout",
  targetFr: "Régies Linux ARM64 basse consommation compatibles avec bobine_x.y.z_arm64.deb",
  targetEn: "Low-power Linux ARM64 control rooms compatible with bobine_x.y.z_arm64.deb",
  defaultTier: "recommande",
  editorialNoteFr:
    "Installation native sous Linux ARM64 via bobine_x.y.z_arm64.deb, le dépôt packages.bobine.fit/debian et bobine-assistant-arm64 (également compatible avec NVIDIA DGX Spark sous DGX OS Ubuntu ARM64). Vérifiez les prérequis de votre appareil avant de choisir un paquet.",
  editorialNoteEn:
    "Native installation on Linux ARM64 via bobine_x.y.z_arm64.deb, the packages.bobine.fit/debian repository and bobine-assistant-arm64 (also compatible with NVIDIA DGX Spark on DGX OS Ubuntu ARM64). Check your device requirements before choosing a package.",
  tiers: ARM_MINIPC_TIERS,
};

/** OS sans catalogue AliExpress : la page redirige vers les OS proposés. */
export const ALIEXPRESS_UNAVAILABLE_OS: Partial<
  Record<OsKey, { textFr: string; textEn: string; alternatives: OsKey[] }>
> = {
  macos: {
    textFr:
      "AliExpress ne propose pas de Mac mini ni de MacBook neufs auprès de vendeurs fiables : aucune offre Apple n'est référencée ici. Pour un poste macOS, retrouvez les Mac mini et MacBook sur Amazon. Sinon, deux alternatives sont proposées sur AliExpress.",
    textEn:
      "AliExpress has no brand-new Mac mini or MacBook from reliable sellers, so no Apple offer is listed here. For a macOS setup, see the Mac mini and MacBook picks on Amazon. Otherwise, two alternatives are offered on AliExpress.",
    alternatives: ["windows", "linux"],
  },
};

export const ALIEXPRESS_BUNDLES: Partial<Record<OsKey, HardwareOsBundle>> = {
  linux: {
    os: "linux",
    formFactors: { minipc: linuxMiniPc, laptop: linuxLaptop } satisfies Partial<Record<FormFactorKey, HardwareFormFactor>>,
  },
  windows: {
    os: "windows",
    formFactors: { minipc: windowsMiniPc, laptop: windowsLaptop } satisfies Partial<Record<FormFactorKey, HardwareFormFactor>>,
  },
  arm: {
    os: "arm",
    formFactors: { minipc: armMiniPc } satisfies Partial<Record<FormFactorKey, HardwareFormFactor>>,
  },
  android: {
    os: "android",
    formFactors: {
      tablet: androidTablet,
    } satisfies Partial<Record<FormFactorKey, HardwareFormFactor>>,
  },
  "android-tv": {
    os: "android-tv",
    formFactors: {
      tv: androidTv,
    } satisfies Partial<Record<FormFactorKey, HardwareFormFactor>>,
  },
};

/** Tous les product_id référencés (pour le rafraîchissement en direct). */
export function getAliexpressProductIds(bundles: Partial<Record<OsKey, HardwareOsBundle>> = ALIEXPRESS_BUNDLES): string[] {
  const ids = new Set<string>();
  for (const bundle of Object.values(bundles)) {
    for (const ff of Object.values(bundle!.formFactors)) {
      for (const tier of Object.values(ff!.tiers)) {
        tier.items.forEach((i) => ids.add(i.asin));
        tier.alternativeUnits?.forEach((i) => ids.add(i.asin));
      }
    }
  }
  return [...ids];
}
