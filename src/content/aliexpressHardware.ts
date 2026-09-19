/**
 * Catalogue AliExpress (périmètre actuel : Windows, Mini PC et PC portable).
 *
 * Voir docs/cahier-des-charges-aliexpress-affiliate.md. Ce fichier ne contient que des
 * identifiants curatés à la main et leur texte éditorial ; prix, lien affilié, image et
 * vendeur viennent de l'instantané `aliexpress-snapshot.json` (généré par
 * scripts/aliexpress-snapshot.mjs) puis, côté serveur, sont rafraîchis en direct par l'API.
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

/** OS ouverts sur la page AliExpress (les autres restent visibles mais inertes). */
export const ALIEXPRESS_ENABLED_OS: OsKey[] = ["windows"];

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

const NOTE_FR =
  "Sur AliExpress, le prix affiché est celui de la variante la moins chère de l'annonce : vérifiez la RAM et le SSD sélectionnés sur la fiche. Contrôlez aussi le pays d'expédition et la garantie du vendeur avant de commander.";
const NOTE_EN =
  "On AliExpress, the displayed price is the cheapest variant of the listing: check the selected RAM and SSD on the product page. Also check the shipping country and the seller's warranty before ordering.";

const windowsMiniPc: HardwareFormFactor = {
  titleFr: "Windows Desktop & Mini PC",
  titleEn: "Windows Desktop & Mini PC",
  subtitleFr: "Mini PC neufs livrés avec Windows 11, prêts à brancher",
  subtitleEn: "Brand new mini PCs shipped with Windows 11, ready to plug in",
  targetFr: "Clubs souhaitant une machine Windows polyvalente, mur LED haute résolution ou TV 4K",
  targetEn: "Clubs seeking a versatile Windows machine, high-res LED wall or 4K studio TV",
  defaultTier: "recommande",
  editorialNoteFr: NOTE_FR,
  editorialNoteEn: NOTE_EN,
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
  editorialNoteFr: NOTE_FR,
  editorialNoteEn: NOTE_EN,
  tiers: LAPTOP_TIERS,
};

export const ALIEXPRESS_BUNDLES: Partial<Record<OsKey, HardwareOsBundle>> = {
  windows: {
    os: "windows",
    formFactors: { minipc: windowsMiniPc, laptop: windowsLaptop } satisfies Partial<Record<FormFactorKey, HardwareFormFactor>>,
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
