/**
 * Catalogue canonique des recommandations matérielles et bundles Bobine.
 *
 * Règles strictes :
 * - ZÉRO EMOJI dans les intitulés, descriptions et badges.
 * - Amazon uniquement pour l'instant. Store ID "fantasmaglad-21" obligatoire sur chaque lien.
 * - Format de lien obligatoire : fiche produit directe (https://www.amazon.fr/dp/<ASIN>?tag=fantasmaglad-21).
 *   Bannissement des liens de recherche /s?k= : chaque ASIN a été vérifié individuellement
 *   (page produit réelle, en ligne, prix et image capturés à la date PRICE_CHECKED_AT ci-dessous).
 * - Amazon ne fournit pas de prix "live" sans l'API Product Advertising (PA-API), elle-même
 *   soumise à un quota de ventes qualifiantes que ce programme d'affiliation tout juste créé
 *   ne remplit pas encore (et PA-API est en cours de dépréciation côté Amazon). Le prix affiché
 *   est donc un prix CONSTATÉ à la date de vérification, jamais une estimation inventée :
 *   chaque carte renvoie vers la fiche Amazon réelle qui, elle, reste toujours à jour.
 * - Ne jamais écrire "fanless" / "sans ventilateur" pour une machine qui embarque un ventilateur.
 * - Chaque OS (sauf Android) propose deux voies matérielles interchangeables via un switch :
 *   "Mini PC" (appliance dédiée achetée neuve/reconditionnée) ou "PC Portable" (kit de
 *   connectique pour exploiter un ordinateur déjà possédé, fermé en mode clamshell).
 * - 4 gammes par voie matérielle : Essentiel, Recommandé, Pro, et Premium.
 * - Images produits dédiées locales (/images/hardware/*.webp), téléchargées depuis la fiche
 *   Amazon officielle de chaque ASIN (donc garanties correspondre au bon produit).
 */

export const AMAZON_STORE_ID = "fantasmaglad-21";

// Date de la dernière vérification manuelle de tous les ASIN, prix et images de ce fichier.
// Voir la note ci-dessus : sans accès PA-API, c'est la seule donnée de fraîcheur honnête
// que l'on puisse afficher. Mettre à jour cette date à chaque nouvelle vérification.
export const PRICE_CHECKED_AT = "2026-09-13";

export type OsKey = "linux" | "windows" | "macos" | "android";
export type TierKey = "essentiel" | "recommande" | "pro" | "premium";
export type FormFactorKey = "minipc" | "laptop" | "tablet";

export interface HardwareItem {
  id: string;
  name: string;
  category: "uc" | "cable-video" | "network" | "control" | "power-hub" | "mount";
  specs: string;
  description: string;
  imageUrl: string;
  asin: string; // ASIN Amazon officiel, vérifié individuellement (page en ligne)
  amazonUrl: string; // Lien direct fiche produit avec tag affilié
  priceAmazon: number; // Prix constaté sur la fiche Amazon à PRICE_CHECKED_AT
  hasFan: boolean; // true si l'unité embarque un ventilateur actif (jamais "fanless" si true)
}

export interface HardwareTier {
  id: TierKey;
  labelFr: string;
  labelEn: string;
  badgeFr?: string;
  badgeEn?: string;
  headlineFr: string;
  headlineEn: string;
  summaryFr: string;
  summaryEn: string;
  isPopular?: boolean;
  powerWatts: string;
  resolution: string;
  items: HardwareItem[];
}

export interface HardwareFormFactor {
  titleFr: string;
  titleEn: string;
  subtitleFr: string;
  subtitleEn: string;
  targetFr: string;
  targetEn: string;
  defaultTier: TierKey;
  editorialNoteFr?: string;
  editorialNoteEn?: string;
  tiers: Record<TierKey, HardwareTier>;
}

export interface HardwareOsBundle {
  os: OsKey;
  formFactors: Partial<Record<FormFactorKey, HardwareFormFactor>>;
}

export interface StandaloneAccessory {
  id: string;
  nameFr: string;
  nameEn: string;
  categoryFr: string;
  categoryEn: string;
  specs: string;
  descriptionFr: string;
  descriptionEn: string;
  imageUrl: string;
  asin: string;
  amazonUrl: string;
  priceAmazon: number;
  compatibleOs: OsKey[];
}

// Fonction utilitaire pour générer un lien affilié propre vers la fiche produit
export function buildProductUrl(asin: string): string {
  return `https://www.amazon.fr/dp/${asin}?tag=${AMAZON_STORE_ID}`;
}

// =============================================================================
// ÉLÉMENTS RÉUTILISÉS ENTRE PLUSIEURS GAMMES "PC PORTABLE EXISTANT"
// (mêmes ASIN vérifiés, le besoin de connectique étant indépendant de l'OS)
// =============================================================================

const hubUsbcBelkin = (id: string): HardwareItem => ({
  id,
  name: "Belkin Hub USB-C vers HDMI 4K 60Hz avec Power Delivery 100W",
  category: "power-hub",
  specs: "Entrée USB-C · Sortie HDMI 4K 60Hz · Power Delivery 100W · Transfert 5 Gbit/s",
  description: "Un seul câble USB-C relie le portable au hub : vidéo et recharge continue en même temps, fermé en mode clamshell.",
  imageUrl: "/images/hardware/hub-usbc.webp",
  asin: "B0FVYC8H5J",
  amazonUrl: buildProductUrl("B0FVYC8H5J"),
  priceAmazon: 27.99,
  hasFan: false,
});

const cableHdmi21 = (id: string): HardwareItem => ({
  id,
  name: "Câble HDMI 2.1 Ultra High Speed 48 Gbps (2 m)",
  category: "cable-video",
  specs: "HDMI 2.1 certifié · 48 Gbps · 4K 120Hz / 8K 60Hz",
  description: "Relie le hub à la prise HDMI du grand écran ou du vidéoprojecteur, sans micro-coupure.",
  imageUrl: "/images/hardware/cable-hdmi.webp",
  asin: "B0CFFFSFFN",
  amazonUrl: buildProductUrl("B0CFFFSFFN"),
  priceAmazon: 10.44,
  hasFan: false,
});

const remotePresentation = (id: string): HardwareItem => ({
  id,
  name: "Télécommande de Présentation 2.4 GHz USB",
  category: "control",
  specs: "Sans fil 2.4 GHz · Dongle USB plug-and-play · Boutons lecture/pause/navigation",
  description: "Permet au coach de lancer, mettre en pause ou changer de cours sans toucher au clavier.",
  imageUrl: "/images/hardware/remote-control.webp",
  asin: "B0BG2JVYY7",
  amazonUrl: buildProductUrl("B0BG2JVYY7"),
  priceAmazon: 14.99,
  hasFan: false,
});

const standVertical = (id: string): HardwareItem => ({
  id,
  name: "UGREEN Support Vertical en Aluminium pour Ordinateur Portable",
  category: "mount",
  specs: "Aluminium anodisé · Base antidérapante",
  description: "Maintient le portable fermé à la verticale en mode clamshell : encombrement minimal en régie.",
  imageUrl: "/images/hardware/stand-vertical.webp",
  asin: "B091B4SWR7",
  amazonUrl: buildProductUrl("B091B4SWR7"),
  priceAmazon: 23.09,
  hasFan: false,
});

const cableCat6a = (id: string): HardwareItem => ({
  id,
  name: "Câble Réseau RJ45 Cat 6A Blindé S-FTP (3 m)",
  category: "network",
  specs: "Cat 6A S-FTP double blindage · Jusqu'à 10 Gbps · Contacts plaqués or",
  description: "Connexion filaire stable, sans micro-coupure Wi-Fi pendant la diffusion.",
  imageUrl: "/images/hardware/cable-cat6a.webp",
  asin: "B075DKWRD6",
  amazonUrl: buildProductUrl("B075DKWRD6"),
  priceAmazon: 5.85,
  hasFan: false,
});

const remoteAirmouse = (id: string): HardwareItem => ({
  id,
  name: "Télécommande Air-Mouse Gyroscopique 2.4 GHz USB",
  category: "control",
  specs: "Air-mouse gyroscopique 6 axes · Dongle USB 2.4 GHz sans configuration",
  description: "Pilote la régie au pointeur virtuel depuis l'autre bout de la salle.",
  imageUrl: "/images/hardware/remote-airmouse.webp",
  asin: "B0H4K4T2CK",
  amazonUrl: buildProductUrl("B0H4K4T2CK"),
  priceAmazon: 9.57,
  hasFan: false,
});

const dockThunderbolt4 = (id: string): HardwareItem => ({
  id,
  name: "WAVLINK Dock Thunderbolt 4 (40 Gbps, 96W Power Delivery)",
  category: "power-hub",
  specs: "Bande passante 40 Gbps · Double sortie vidéo jusqu'à 8K / Quad 4K · Charge 96W",
  description: "Connecte grand écran, réseau câblé et charge rapide en un seul branchement Thunderbolt/USB-C.",
  imageUrl: "/images/hardware/dock-thunderbolt4.webp",
  asin: "B0GHQRQ12S",
  amazonUrl: buildProductUrl("B0GHQRQ12S"),
  priceAmazon: 229.99,
  hasFan: false,
});

const cableThunderbolt4 = (id: string): HardwareItem => ({
  id,
  name: "Câble Thunderbolt 4 / USB4 40 Gbps (1 m)",
  category: "cable-video",
  specs: "Certifié Thunderbolt 4 · Débit 40 Gbps · Charge 100W",
  description: "Câble de liaison entre le portable et le dock pour transfert vidéo ultra-haute vitesse sans latence.",
  imageUrl: "/images/hardware/cable-thunderbolt4.webp",
  asin: "B08Q2YC9LL",
  amazonUrl: buildProductUrl("B08Q2YC9LL"),
  priceAmazon: 12.34,
  hasFan: false,
});

const remoteKeyboard = (id: string): HardwareItem => ({
  id,
  name: "Mini Clavier Rétroéclairé sans Fil avec Touchpad",
  category: "control",
  specs: "Touchpad intégré · Rétroéclairage · Dongle USB 2.4 GHz",
  description: "L'outil du personnel technique : navigation complète et saisie clavier pour l'administration de la régie.",
  imageUrl: "/images/hardware/remote-keyboard.webp",
  asin: "B00WQG6A8C",
  amazonUrl: buildProductUrl("B00WQG6A8C"),
  priceAmazon: 24.99,
  hasFan: false,
});

const hubEthernetAcer = (id: string): HardwareItem => ({
  id,
  name: "Hub USB-C 6-en-1 avec Ethernet RJ45 1 Gbps + HDMI 4K60 + PD 100W",
  category: "power-hub",
  specs: "Port Ethernet RJ45 1 Gbps · Sortie HDMI 4K 60Hz · Charge continue 100W",
  description: "Ajoute un réseau filaire redondant : la diffusion reste fiable même en cas de panne Wi-Fi.",
  imageUrl: "/images/hardware/hub-usbc-ethernet.webp",
  asin: "B0G81K4C12",
  amazonUrl: buildProductUrl("B0G81K4C12"),
  priceAmazon: 25.99,
  hasFan: false,
});

function laptopKitTiers(osLabelFr: string, osLabelEn: string): Record<TierKey, HardwareTier> {
  return {
    essentiel: {
      id: "essentiel",
      labelFr: "Essentiel",
      labelEn: "Essential",
      headlineFr: "Hub USB-C vers HDMI — Le kit minimal",
      headlineEn: "USB-C to HDMI Hub — The minimal kit",
      summaryFr: `Un seul hub USB-C pour afficher l'écran de votre ${osLabelFr} sur le grand écran tout en le rechargeant en continu.`,
      summaryEn: `A single USB-C hub to display your ${osLabelEn} laptop on the big screen while charging it continuously.`,
      powerWatts: "100W PD",
      resolution: "4K 60fps",
      items: [
        hubUsbcBelkin("hub-usbc-essentiel"),
        cableHdmi21("cable-hdmi21-essentiel"),
        remotePresentation("remote-presentation-essentiel"),
      ],
    },
    recommande: {
      id: "recommande",
      labelFr: "Recommandé",
      labelEn: "Recommended",
      isPopular: true,
      headlineFr: "Hub USB-C + Support Vertical — Le combo studio",
      headlineEn: "USB-C Hub + Vertical Stand — The studio combo",
      summaryFr: "Le même hub, associé à un support vertical pour gagner de la place et un câble réseau filaire pour la stabilité.",
      summaryEn: "The same hub, paired with a vertical stand to save desk space and a wired network cable for stability.",
      powerWatts: "100W PD",
      resolution: "4K 60fps",
      items: [
        hubUsbcBelkin("hub-usbc-recommande"),
        standVertical("stand-vertical-recommande"),
        cableCat6a("cable-cat6a-recommande"),
        remoteAirmouse("remote-airmouse-recommande"),
      ],
    },
    pro: {
      id: "pro",
      labelFr: "Pro",
      labelEn: "Pro",
      headlineFr: "Dock Thunderbolt 4 — Débit et charge maximale",
      headlineEn: "Thunderbolt 4 Dock — Maximum throughput and charge",
      summaryFr: "Un dock Thunderbolt 4 pour les portables récents : jusqu'à 8K ou double 4K, charge 96W, port réseau intégré.",
      summaryEn: "A Thunderbolt 4 dock for recent laptops: up to 8K or dual 4K, 96W charge, built-in network port.",
      powerWatts: "96W PD",
      resolution: "8K / Quad 4K",
      items: [
        dockThunderbolt4("dock-tb4-pro"),
        standVertical("stand-vertical-pro"),
        cableThunderbolt4("cable-tb4-pro"),
        remoteKeyboard("remote-keyboard-pro"),
      ],
    },
    premium: {
      id: "premium",
      labelFr: "Premium",
      labelEn: "Premium",
      badgeFr: "Kit Complet",
      badgeEn: "Full Kit",
      headlineFr: "Dock Thunderbolt 4 + Réseau Filaire Redondant",
      headlineEn: "Thunderbolt 4 Dock + Redundant Wired Network",
      summaryFr: "Le même dock Thunderbolt 4, complété par un second hub Ethernet en secours : zéro dépendance au Wi-Fi.",
      summaryEn: "The same Thunderbolt 4 dock, backed by a second Ethernet hub as a spare: zero Wi-Fi dependency.",
      powerWatts: "96W PD",
      resolution: "8K / Quad 4K",
      items: [
        dockThunderbolt4("dock-tb4-premium"),
        standVertical("stand-vertical-premium"),
        cableThunderbolt4("cable-tb4-premium"),
        hubEthernetAcer("hub-ethernet-premium"),
        remoteKeyboard("remote-keyboard-premium"),
      ],
    },
  };
}

// =============================================================================
// 1. LES BUNDLES PAR OS — CHACUN AVEC 2 VOIES MATÉRIELLES (SAUF ANDROID)
// =============================================================================

export const HARDWARE_BUNDLES: Record<OsKey, HardwareOsBundle> = {
  // ---------------------------------------------------------------------------
  // A. LINUX
  // ---------------------------------------------------------------------------
  linux: {
    os: "linux",
    formFactors: {
      minipc: {
        titleFr: "Linux Appliance Dédiée",
        titleEn: "Dedicated Linux Appliance",
        subtitleFr: "Mini PC autonome ultra-silencieux, résistant à un usage 24/7 en studio",
        subtitleEn: "Autonomous, near-silent mini PC built for 24/7 studio use",
        targetFr: "Studio de cycling immersif, studio vidéo 24/7, régie autonome sans bureau",
        targetEn: "Immersive cycling studio, 24/7 video room, autonomous headless setup",
        defaultTier: "recommande",
        tiers: {
          essentiel: {
            id: "essentiel",
            labelFr: "Essentiel",
            labelEn: "Essential",
            headlineFr: "HP EliteDesk 800 Mini reconditionné — Le premier prix vérifié",
            headlineEn: "Refurbished HP EliteDesk 800 Mini — Verified budget pick",
            summaryFr: "Petit format d'entreprise reconditionné, très peu bruyant au repos, idéal pour démarrer sans risque en 1080p60.",
            summaryEn: "Refurbished corporate small-form-factor unit, very quiet at idle, ideal to start smoothly in 1080p60.",
            powerWatts: "20W - 35W",
            resolution: "1080p 60fps",
            items: [
              {
                id: "hp-elitedesk-800-i5",
                name: "HP EliteDesk 800 Mini reconditionné (Core i5-7400T / 8 Go RAM / 240 Go SSD)",
                category: "uc",
                specs: "4 cœurs 2.4 GHz · Intel HD 630 · Châssis SFF compact reconditionné grade A",
                description: "Ventilateur basse vitesse à peine audible (pas un modèle fanless) : format compact d'entreprise reconditionné, fiable pour un usage continu 1080p.",
                imageUrl: "/images/hardware/hp-elitedesk-800.webp",
                asin: "B0F9PF4ZC1",
                amazonUrl: buildProductUrl("B0F9PF4ZC1"),
                priceAmazon: 161,
                hasFan: true,
              },
              cableDpHdmi("essentiel"),
              cableCat6a("cable-cat6a-linux-essentiel"),
              remotePresentation("remote-presentation-linux-essentiel"),
            ],
          },
          recommande: {
            id: "recommande",
            labelFr: "Recommandé",
            labelEn: "Recommended",
            badgeFr: "Choix Bobine — Vraiment Fanless",
            badgeEn: "Bobine Pick — Actually Fanless",
            isPopular: true,
            headlineFr: "Mini PC Industriel N100 Fanless — Le seul vrai silence absolu",
            headlineEn: "Fanless N100 Industrial Mini PC — True absolute silence",
            summaryFr: "Le cœur de cible Bobine : châssis 100% passif à dissipateur ailetté, zéro ventilateur, double sortie HDMI + DisplayPort et double réseau filaire.",
            summaryEn: "The Bobine sweet spot: 100% passive finned-aluminium chassis, zero fan, dual HDMI + DisplayPort output and dual wired LAN.",
            powerWatts: "6W - 15W",
            resolution: "1080p & 4K 60fps",
            items: [
              {
                id: "fanless-mini-pc-n100",
                name: "Mini PC Industriel Fanless N100 (8 Go DDR4 / 256 Go NVMe SSD)",
                category: "uc",
                specs: "Intel N100 4 cœurs · Châssis aluminium ailetté 100% passif · 2x HDMI + 1x DisplayPort · 2x LAN Gigabit",
                description: "Dissipation entièrement passive par capot aluminium ailetté, confirmée par le châssis du fabricant : c'est la seule unité de cette page qui mérite vraiment le mot fanless.",
                imageUrl: "/images/hardware/fanless-n100-histton.webp",
                asin: "B0DMVYRPPP",
                amazonUrl: buildProductUrl("B0DMVYRPPP"),
                priceAmazon: 592,
                hasFan: false,
              },
              cableDpHdmi("recommande"),
              cableCat6a("cable-cat6a-linux-recommande"),
              remoteAirmouse("remote-airmouse-linux-recommande"),
            ],
          },
          pro: {
            id: "pro",
            labelFr: "Pro",
            labelEn: "Pro",
            headlineFr: "Minisforum MS-01 Workstation — Haute cadence & extensible",
            headlineEn: "Minisforum MS-01 Workstation — High performance & expandable",
            summaryFr: "Processeur Intel Core i9 vPro, double réseau 10 Gbps SFP+ et emplacement PCIe libre pour ajouter un GPU dédié si besoin.",
            summaryEn: "Intel Core i9 vPro CPU, dual 10 Gbps SFP+ networking and a free PCIe slot to add a dedicated GPU later.",
            powerWatts: "15W - 65W",
            resolution: "Multi-écran 4K 60fps",
            items: [
              {
                id: "minisforum-ms01-i9",
                name: "Minisforum MS-01 Mini Workstation (Intel Core i9-13900H vPro)",
                category: "uc",
                specs: "vPro · 2x SFP+ 10 Gbps + 2x RJ45 2.5G · 2x USB4 · 1x PCIe 4.0 x16 libre · RAM/SSD à ajouter",
                description: "Deux ventilateurs silencieux pilotés par la charge réelle (pas un modèle fanless) : châssis workstation compact taillé pour la vidéo multi-écran et l'extension future.",
                imageUrl: "/images/hardware/minisforum-ms01.webp",
                asin: "B0CT2DPBQT",
                amazonUrl: buildProductUrl("B0CT2DPBQT"),
                priceAmazon: 709,
                hasFan: true,
              },
              cableHdmi21("linux-pro"),
              cableCat7("linux-pro"),
              remoteKeyboard("remote-keyboard-linux-pro"),
            ],
          },
          premium: {
            id: "premium",
            labelFr: "Premium",
            labelEn: "Premium",
            badgeFr: "Station Ultime",
            badgeEn: "Ultimate Rig",
            headlineFr: "Mini PC AMD Ryzen AI 9 HX 470 — Puissance graphique maximale",
            headlineEn: "AMD Ryzen AI 9 HX 470 Mini PC — Maximum graphics headroom",
            summaryFr: "Processeur AMD Ryzen AI 9 HX 470 avec refroidissement à chambre à vapeur, pour piloter simultanément plusieurs écrans 4K sans aucune saccade.",
            summaryEn: "AMD Ryzen AI 9 HX 470 with vapour-chamber cooling, driving several simultaneous 4K displays without a single dropped frame.",
            powerWatts: "15W - 65W",
            resolution: "Multi-écran 4K 60fps",
            items: [
              {
                id: "ax9-max-ryzenai9",
                name: "Mini PC AX9 Max (AMD Ryzen AI 9 HX 470, refroidissement chambre à vapeur)",
                category: "uc",
                specs: "8 cœurs 16 threads · AMD Radeon 890M · Refroidissement VC (chambre à vapeur) · RAM/SSD à configurer",
                description: "Livré sous Windows 11 par défaut (installez ou dual-bootez votre distribution Linux) : ventilateur assisté par chambre à vapeur, pas un modèle fanless, mais parmi les plus silencieux de sa catégorie de puissance.",
                imageUrl: "/images/hardware/ax9-max-ryzenai9.webp",
                asin: "B0HDN8JQ7H",
                amazonUrl: buildProductUrl("B0HDN8JQ7H"),
                priceAmazon: 1549,
                hasFan: true,
              },
              cableHdmi21("linux-premium"),
              cableCat7("linux-premium"),
              remoteKeyboard("remote-keyboard-linux-premium"),
            ],
          },
        },
      },
      laptop: {
        titleFr: "PC Portable Existant (Linux)",
        titleEn: "Existing Laptop (Linux)",
        subtitleFr: "Connectez et rechargez en continu un ordinateur portable Linux déjà en votre possession",
        subtitleEn: "Connect and continuously charge a laptop already running Linux",
        targetFr: "Club possédant déjà un PC portable Linux ou en dual-boot, sans budget matériel supplémentaire",
        targetEn: "Gyms with an existing Linux or dual-boot laptop, no extra hardware budget",
        defaultTier: "recommande",
        editorialNoteFr: "Si vous achetez une machine dédiée pour Bobine, la communauté Linux recommande unanimement le Framework Laptop 13 — réparable, modulaire, pièces détachées officielles. Il n'est vendu qu'en direct sur frame.work, pas sur Amazon : le kit de connectique ci-dessous fonctionne avec ce modèle comme avec n'importe quel autre PC portable Linux.",
        editorialNoteEn: "If you're buying a dedicated machine for Bobine, the Linux community unanimously recommends the Framework Laptop 13 — repairable, modular, official spare parts. It's sold direct at frame.work only, not on Amazon: the kit below works with it just as well as with any other Linux laptop.",
        tiers: laptopKitTiers("Linux", "Linux"),
      },
    },
  },

  // ---------------------------------------------------------------------------
  // B. WINDOWS
  // ---------------------------------------------------------------------------
  windows: {
    os: "windows",
    formFactors: {
      minipc: {
        titleFr: "Windows Desktop & Mini PC",
        titleEn: "Windows Desktop & Mini PC",
        subtitleFr: "Mini PC neufs livrés avec Windows 11 Pro, prêts à brancher",
        subtitleEn: "Brand new mini PCs shipped with Windows 11 Pro, ready to plug in",
        targetFr: "Clubs souhaitant une machine Windows polyvalente, mur LED haute résolution ou TV 4K",
        targetEn: "Clubs seeking a versatile Windows machine, high-res LED wall or 4K studio TV",
        defaultTier: "recommande",
        tiers: {
          essentiel: {
            id: "essentiel",
            labelFr: "Essentiel",
            labelEn: "Essential",
            headlineFr: "Mini PC B20E Pentium 6500Y — L'entrée de gamme Windows",
            headlineEn: "B20E Pentium 6500Y Mini PC — Windows entry-level",
            summaryFr: "Châssis compact neuf avec Windows 11 Pro préinstallé, sortie 4K, budget serré.",
            summaryEn: "Brand new compact unit with Windows 11 Pro preloaded, 4K output, tight budget.",
            powerWatts: "10W - 15W",
            resolution: "1080p & 4K",
            items: [
              {
                id: "mini-pc-b20e",
                name: "Mini PC B20E (Pentium 6500Y / 8 Go RAM / 128 Go SSD / Windows 11 Pro)",
                category: "uc",
                specs: "2 cœurs basse consommation · Sortie 4K · Format ultra-compact",
                description: "Machine neuve d'entrée de gamme, ventilation discrète intégrée : suffisante pour la diffusion 1080p et le pilotage de la régie Bobine sans multitâche lourd.",
                imageUrl: "/images/hardware/mini-pc-b20e.webp",
                asin: "B0GL74YQ3C",
                amazonUrl: buildProductUrl("B0GL74YQ3C"),
                priceAmazon: 150.9,
                hasFan: true,
              },
              cableHdmi21("windows-essentiel"),
              cableCat6a("cable-cat6a-windows-essentiel"),
              remotePresentation("remote-presentation-windows-essentiel"),
            ],
          },
          recommande: {
            id: "recommande",
            labelFr: "Recommandé",
            labelEn: "Recommended",
            badgeFr: "Best-Seller",
            badgeEn: "Top Choice",
            isPopular: true,
            headlineFr: "Beelink Mini S12 Pro Intel N100 — Le meilleur rapport silence/prix",
            headlineEn: "Beelink Mini S12 Pro Intel N100 — Best silence-to-price ratio",
            summaryFr: "Processeur Intel N100 récent, 16 Go de RAM et SSD NVMe rapide, double sortie 4K.",
            summaryEn: "Recent Intel N100 processor, 16 GB RAM and fast NVMe storage, dual 4K output.",
            powerWatts: "6W - 15W",
            resolution: "Double 4K 60fps",
            items: [
              {
                id: "beelink-mini-s12-pro",
                name: "Beelink Mini S12 Pro (Intel N100 / 16 Go RAM / 512 Go SSD)",
                category: "uc",
                specs: "4 cœurs 3.4 GHz · Wi-Fi 6 · Double sortie HDMI 4K · LAN 2.5G",
                description: "Petit ventilateur discret (non fanless) : 16 Go de RAM pour naviguer dans l'interface sans latence, Windows 11 Pro officiel.",
                imageUrl: "/images/hardware/mini-pc-n100.webp",
                asin: "B0DPM4N1SL",
                amazonUrl: buildProductUrl("B0DPM4N1SL"),
                priceAmazon: 359,
                hasFan: true,
              },
              cableHdmi21("windows-recommande"),
              cableCat6a("cable-cat6a-windows-recommande"),
              remoteAirmouse("remote-airmouse-windows-recommande"),
            ],
          },
          pro: {
            id: "pro",
            labelFr: "Pro",
            labelEn: "Pro",
            headlineFr: "Minisforum UM760 Slim Ryzen 5 — Puissance graphique & triple affichage",
            headlineEn: "Minisforum UM760 Slim Ryzen 5 — Graphics power & triple display",
            summaryFr: "AMD Ryzen 5 7640HS 6 cœurs, graphismes Radeon 760M et triple sortie vidéo pour les installations multi-écrans.",
            summaryEn: "AMD Ryzen 5 7640HS 6-core, Radeon 760M graphics and triple video output for multi-screen setups.",
            powerWatts: "15W - 35W",
            resolution: "Triple 4K 60fps",
            items: [
              {
                id: "minisforum-um760-ryzen5",
                name: "Minisforum UM760 Slim (AMD Ryzen 5 7640HS / 16 Go DDR5 / 512 Go NVMe)",
                category: "uc",
                specs: "6 cœurs 12 threads jusqu'à 5,0 GHz · AMD Radeon 760M · Sorties HDMI + USB4 + DP · Wi-Fi 6E",
                description: "Ventilateur silencieux piloté par la charge (non fanless) : réencodage vidéo instantané et triple sortie vidéo indépendante pour les studios premium.",
                imageUrl: "/images/hardware/mini-pc-ryzen.webp",
                asin: "B0GG9PF2FM",
                amazonUrl: buildProductUrl("B0GG9PF2FM"),
                priceAmazon: 539,
                hasFan: true,
              },
              cableHdmi21("windows-pro"),
              cableCat7("windows-pro"),
              remoteKeyboard("remote-keyboard-windows-pro"),
            ],
          },
          premium: {
            id: "premium",
            labelFr: "Premium",
            labelEn: "Premium",
            badgeFr: "Haut de Gamme",
            badgeEn: "Flagship",
            headlineFr: "Mini PC AMD Ryzen AI 9 HX 470 — Le sommet de la puissance compacte",
            headlineEn: "AMD Ryzen AI 9 HX 470 Mini PC — Peak compact power",
            summaryFr: "Le même châssis haut de gamme que la référence Linux Premium, livré nativement sous Windows 11 Pro.",
            summaryEn: "The same flagship chassis as the Linux Premium pick, shipped natively with Windows 11 Pro.",
            powerWatts: "15W - 65W",
            resolution: "Multi-écran 4K 60fps",
            items: [
              {
                id: "ax9-max-ryzenai9-win",
                name: "Mini PC AX9 Max (AMD Ryzen AI 9 HX 470, refroidissement chambre à vapeur)",
                category: "uc",
                specs: "8 cœurs 16 threads · AMD Radeon 890M · Refroidissement VC · Windows 11 préinstallé",
                description: "Ventilateur assisté par chambre à vapeur (non fanless), parmi les plus silencieux de sa catégorie de puissance. Zéro compromis pour piloter plusieurs écrans 4K.",
                imageUrl: "/images/hardware/ax9-max-ryzenai9.webp",
                asin: "B0HDN8JQ7H",
                amazonUrl: buildProductUrl("B0HDN8JQ7H"),
                priceAmazon: 1549,
                hasFan: true,
              },
              cableHdmi21("windows-premium"),
              cableCat7("windows-premium"),
              remoteKeyboard("remote-keyboard-windows-premium"),
            ],
          },
        },
      },
      laptop: {
        titleFr: "PC Portable Existant (Windows)",
        titleEn: "Existing Laptop (Windows)",
        subtitleFr: "Connectez et rechargez en continu un ordinateur portable Windows déjà en votre possession",
        subtitleEn: "Connect and continuously charge a laptop already running Windows",
        targetFr: "Club possédant déjà un PC portable Windows 10/11, sans budget matériel supplémentaire",
        targetEn: "Gyms with an existing Windows 10/11 laptop, no extra hardware budget",
        defaultTier: "recommande",
        tiers: laptopKitTiers("Windows", "Windows"),
      },
    },
  },

  // ---------------------------------------------------------------------------
  // C. MACOS
  // ---------------------------------------------------------------------------
  macos: {
    os: "macos",
    formFactors: {
      minipc: {
        titleFr: "Mac Mini & Mac Studio Dédiés",
        titleEn: "Dedicated Mac Mini & Mac Studio",
        subtitleFr: "Poste Apple Silicon fixe, dissimulé en régie, décodage matériel natif",
        subtitleEn: "Stationary Apple Silicon unit, tucked away in the control room, native hardware decoding",
        targetFr: "Salles entièrement équipées Apple souhaitant une machine dédiée et invisible",
        targetEn: "All-Apple gyms wanting a dedicated, out-of-sight machine",
        defaultTier: "recommande",
        tiers: {
          essentiel: {
            id: "essentiel",
            labelFr: "Essentiel",
            labelEn: "Essential",
            headlineFr: "Mac Mini (Puce Apple M6) — L'entrée Apple Silicon actuelle",
            headlineEn: "Mac Mini (Apple M6 chip) — Today's Apple Silicon entry point",
            summaryFr: "Apple ne propose pas de version économique distincte : le Mac Mini M6 de base EST l'entrée de gamme Apple Silicon actuelle. Kit minimal pour démarrer.",
            summaryEn: "Apple does not offer a separate budget line: the base M6 Mac Mini IS today's Apple Silicon entry point. Minimal starter kit.",
            powerWatts: "4W - 12W",
            resolution: "4K 60fps natif",
            items: [
              macMiniM6("essentiel"),
              cableHdmi21("macos-essentiel"),
              remotePresentation("remote-presentation-macos-essentiel"),
            ],
          },
          recommande: {
            id: "recommande",
            labelFr: "Recommandé",
            labelEn: "Recommended",
            badgeFr: "Élégance & Silence",
            badgeEn: "Sleek & Silent",
            isPopular: true,
            headlineFr: "Mac Mini (Puce Apple M6) Régie Dédiée — Kit complet",
            headlineEn: "Dedicated Mac Mini (Apple M6 chip) — Full kit",
            summaryFr: "Le même Mac Mini M6, complété par un réseau filaire et une télécommande gyroscopique pour une régie autonome complète.",
            summaryEn: "The same M6 Mac Mini, completed with wired networking and a gyroscopic remote for a fully autonomous desk.",
            powerWatts: "4W - 12W",
            resolution: "4K 60fps natif",
            items: [
              macMiniM6("recommande"),
              cableHdmi21("macos-recommande"),
              cableCat6a("cable-cat6a-macos-recommande"),
              remoteAirmouse("remote-airmouse-macos-recommande"),
            ],
          },
          pro: {
            id: "pro",
            labelFr: "Pro",
            labelEn: "Pro",
            headlineFr: "Mac Mini (Puce Apple M5 Pro) — Puissance et réseau 10 Gbps",
            headlineEn: "Mac Mini (Apple M5 Pro chip) — Power and 10 Gbps networking",
            summaryFr: "Palier supérieur de la gamme Mac Mini actuelle. Disponibilité Apple annoncée au 22 septembre 2026 : commande possible dès maintenant, livraison à cette date.",
            summaryEn: "The higher tier of the current Mac Mini range. Apple-announced availability on September 22, 2026: orderable now, ships on that date.",
            powerWatts: "10W - 25W",
            resolution: "4K/6K 60fps natif",
            items: [
              {
                id: "mac-mini-m5-pro",
                name: "Apple Mac Mini (Puce Apple M5 Pro)",
                category: "uc",
                specs: "Puce Apple M5 Pro · Port Ethernet 10 Gbps · Multiples sorties vidéo · Sortie disponible le 22/09/2026",
                description: "Palier Pro du Mac Mini actuel : plus de cœurs GPU et un port réseau 10 Gbps natif pour la diffusion multi-flux.",
                imageUrl: "/images/hardware/mac-mini.webp",
                asin: "B0HGGDQ29W",
                amazonUrl: buildProductUrl("B0HGGDQ29W"),
                priceAmazon: 1999,
                hasFan: true,
              },
              cableHdmi21("macos-pro"),
              cableCat7("macos-pro"),
              remoteKeyboard("remote-keyboard-macos-pro"),
            ],
          },
          premium: {
            id: "premium",
            labelFr: "Premium",
            labelEn: "Premium",
            badgeFr: "Studio Ultime",
            badgeEn: "Ultimate Studio",
            headlineFr: "Apple Mac Studio (Puce M5 Max) — Production audiovisuelle de référence",
            headlineEn: "Apple Mac Studio (M5 Max chip) — Benchmark audiovisual production",
            summaryFr: "L'outil de production audiovisuelle de référence : architecture Apple Silicon surpuissante pour plusieurs flux 4K/8K simultanés en silence quasi total.",
            summaryEn: "Benchmark audiovisual workstation: massive Apple Silicon power driving several simultaneous 4K/8K displays in near silence.",
            powerWatts: "15W - 55W",
            resolution: "Multi-écrans 4K/6K/8K simultanés",
            items: [
              {
                id: "mac-studio-m5max",
                name: "Apple Mac Studio (Puce M5 Max)",
                category: "uc",
                specs: "Puce Apple M5 Max · 4x Thunderbolt 4/5 · Ethernet 10 Gbps · HDMI natif",
                description: "Châssis bloc aluminium massif refroidi par turbine à très bas régime. Décodage matériel ProRes, HEVC, H.264 et AV1 en flux continu.",
                imageUrl: "/images/hardware/mac-studio.webp",
                asin: "B0HGS3C159",
                amazonUrl: buildProductUrl("B0HGS3C159"),
                priceAmazon: 2999,
                hasFan: true,
              },
              cableHdmi21("macos-premium"),
              cableCat7("macos-premium"),
              remoteAirmouse("remote-airmouse-macos-premium"),
            ],
          },
        },
      },
      laptop: {
        titleFr: "MacBook Existant en Mode Clamshell",
        titleEn: "Existing MacBook in Clamshell Mode",
        subtitleFr: "Exploitez le MacBook du coach fermé, sans acheter de machine dédiée",
        subtitleEn: "Use the coach's MacBook closed, without buying a dedicated machine",
        targetFr: "Coachs déjà équipés en MacBook Air/Pro, sans budget matériel supplémentaire",
        targetEn: "Coaches already equipped with a MacBook Air/Pro, no extra hardware budget",
        defaultTier: "recommande",
        tiers: laptopKitTiers("macOS", "macOS"),
      },
    },
  },

  // ---------------------------------------------------------------------------
  // D. ANDROID TACTILE & MOBILITÉ (Tablette Pupitre & Sortie Vidéo HDMI)
  // ---------------------------------------------------------------------------
  android: {
    os: "android",
    formFactors: {
      tablet: {
        titleFr: "Android Tactile & Mobilité",
        titleEn: "Android Touch & Mobility",
        subtitleFr: "Pupitre tactile au doigt pour le coach avec projection vidéo directe sur grand écran",
        subtitleEn: "Touch control desk for the coach with direct video projection to the big screen",
        targetFr: "Coachs mobiles, vélos de cycling immersif, bornes murales en accès libre adhérents",
        targetEn: "Mobile coaches, indoor cycling bikes, wall-mounted self-service member kiosks",
        defaultTier: "recommande",
        tiers: {
          essentiel: {
            id: "essentiel",
            labelFr: "Essentiel",
            labelEn: "Essential",
            headlineFr: "Samsung Galaxy Tab A9+ + Support Mural Antivol",
            headlineEn: "Samsung Galaxy Tab A9+ + Anti-Theft Wall Mount",
            summaryFr: "Tablette Samsung officielle avec fixation murale antivol sécurisée pour consultation en accès libre ou pupitre de salle.",
            summaryEn: "Official Samsung tablet with secure anti-theft wall mount for self-service kiosk or room desk.",
            powerWatts: "5W - 10W",
            resolution: "Écran tactile 1920x1200",
            items: [
              {
                id: "tablet-galaxy-a9-plus",
                name: "Samsung Galaxy Tab A9+ 11\" (128 Go, Wi-Fi)",
                category: "uc",
                specs: "Écran 11 pouces 1920x1200 · Android · Wi-Fi · 128 Go de stockage",
                description: "Tablette officielle Samsung, fluide et lumineuse, idéale pour faire tourner Bobine en mode autonome ou borne tactile en accès libre.",
                imageUrl: "/images/hardware/tablet.webp",
                asin: "B0CMDKCSFS",
                amazonUrl: buildProductUrl("B0CMDKCSFS"),
                priceAmazon: 285,
                hasFan: false,
              },
              {
                id: "wall-mount-tablet-lock",
                name: "AboveTEK Support Mural Antivol Verrouillable pour Tablette",
                category: "mount",
                specs: "Verrouillage à clé · Modes portrait et paysage · Compatible 7 à 11 pouces",
                description: "Fixation murale sécurisée : protège la tablette contre le vol dans la salle tout en laissant l'écran tactile accessible.",
                imageUrl: "/images/hardware/wall-mount-tablet.webp",
                asin: "B087WSSRQ7",
                amazonUrl: buildProductUrl("B087WSSRQ7"),
                priceAmazon: 59.99,
                hasFan: false,
              },
              {
                id: "cable-usbc-100w-essentiel",
                name: "UGREEN Câble USB-C 100W PD 5A Charge Rapide Tressé (2 m)",
                category: "power-hub",
                specs: "100W PD3.0 · 20V/5A · Nylon tressé · 2 m",
                description: "Longueur et puissance dimensionnées pour une alimentation continue 24/7 sans goulot d'étranglement, de la prise murale jusqu'au support en hauteur.",
                imageUrl: "/images/hardware/cable-usbc-100w.webp",
                asin: "B0B27G1BZ9",
                amazonUrl: buildProductUrl("B0B27G1BZ9"),
                priceAmazon: 13.99,
                hasFan: false,
              },
            ],
          },
          recommande: {
            id: "recommande",
            labelFr: "Recommandé",
            labelEn: "Recommended",
            badgeFr: "Pack Studio Mobile",
            badgeEn: "Mobile Studio Pack",
            isPopular: true,
            headlineFr: "Xiaomi Pad 7 144Hz + Hub USB-C HDMI — Pupitre tactile & projection TV",
            headlineEn: "Xiaomi Pad 7 144Hz + USB-C HDMI Hub — Touch desk & TV projection",
            summaryFr: "Écran 144Hz très réactif au doigt, associé à un hub USB-C pour projeter sur le grand écran de la salle (vérifiez la compatibilité DisplayPort Alt Mode de votre unité avant achat du hub).",
            summaryEn: "Highly responsive 144Hz touch display, paired with a USB-C hub to project onto the gym's big screen (check your unit's DisplayPort Alt Mode support before buying the hub).",
            powerWatts: "8W - 18W",
            resolution: "Écran 3.2K 144Hz + HDMI 4K",
            items: [
              {
                id: "xiaomi-pad-7",
                name: "Xiaomi Pad 7 (Snapdragon 7+ Gen 3 / Écran 11,2\" 3.2K 144Hz)",
                category: "uc",
                specs: "Snapdragon 7+ Gen 3 · Écran LCD 3.2K 144Hz · Batterie 8850 mAh · Dolby Vision",
                description: "Tablette réactive et lumineuse pour la régie tactile `/coach`. Vérifiez la compatibilité DisplayPort Alt Mode de votre exemplaire avant d'investir dans le hub vidéo ci-dessous.",
                imageUrl: "/images/hardware/tablet-xiaomi-pad7.webp",
                asin: "B0G5LMP2YT",
                amazonUrl: buildProductUrl("B0G5LMP2YT"),
                priceAmazon: 409.99,
                hasFan: false,
              },
              hubUsbcBelkin("android-recommande"),
              cableHdmi21("android-recommande"),
              {
                id: "mount-bike-treadmill",
                name: "Support de Tablette pour Vélo, Tapis de Course & Elliptique",
                category: "mount",
                specs: "Compatible 4 à 13 pouces · Fixation guidon universelle · Mâchoires anti-vibration",
                description: "Maintien stable sur guidon de vélo RPM ou bras de tapis de course : la tablette ne vibre pas pendant les séances intenses.",
                imageUrl: "/images/hardware/mount-bike-treadmill.webp",
                asin: "B0BN28FP8D",
                amazonUrl: buildProductUrl("B0BN28FP8D"),
                priceAmazon: 25.88,
                hasFan: false,
              },
            ],
          },
          pro: {
            id: "pro",
            labelFr: "Pro",
            labelEn: "Pro",
            headlineFr: "Samsung Galaxy Tab S9 FE IP68 & Hub Réseau Filaire",
            headlineEn: "Samsung Galaxy Tab S9 FE IP68 & Wired Network Hub",
            summaryFr: "Tablette étanche IP68 avec S Pen inclus, hub multiport intégrant un port réseau RJ45 filaire pour éliminer tout risque Wi-Fi.",
            summaryEn: "IP68 water-resistant tablet with included S Pen, multiport hub with wired RJ45 Ethernet to eliminate Wi-Fi drops.",
            powerWatts: "8W - 20W",
            resolution: "Écran 10.9\" + HDMI 4K",
            items: [
              {
                id: "samsung-tab-s9-fe",
                name: "Samsung Galaxy Tab S9 FE 10,9\" (Étanche IP68 / S Pen inclus)",
                category: "uc",
                specs: "Certification IP68 eau et poussière · S Pen inclus · Batterie longue durée",
                description: "Résiste aux éclaboussures d'eau et à la transpiration en studio de cycling. S Pen inclus pour annoter les plannings de coach.",
                imageUrl: "/images/hardware/tablet-pro.webp",
                asin: "B0CHZ4BC72",
                amazonUrl: buildProductUrl("B0CHZ4BC72"),
                priceAmazon: 599.99,
                hasFan: false,
              },
              hubEthernetAcer("android-pro"),
              cableCat6a("cable-cat6a-android-pro"),
              {
                id: "wall-mount-articulated-lock",
                name: "AboveTEK Bras Mural Articulé Antivol à Long Bras",
                category: "mount",
                specs: "Bras articulé réglable · Verrou de sécurité et clé · Compatible 7 à 11 pouces",
                description: "Permet d'orienter l'écran vers les vélos ou vers l'estrade du coach, puis de le replier à plat contre le mur.",
                imageUrl: "/images/hardware/mount-wall-articulated.webp",
                asin: "B0876VQW4Q",
                amazonUrl: buildProductUrl("B0876VQW4Q"),
                priceAmazon: 53.99,
                hasFan: false,
              },
            ],
          },
          premium: {
            id: "premium",
            labelFr: "Premium",
            labelEn: "Premium",
            badgeFr: "Cockpit Studio",
            badgeEn: "Studio Cockpit",
            headlineFr: "Samsung Galaxy Tab S10 Ultra 14.6\" — Écran Géant & Bras Renforcé",
            headlineEn: "Samsung Galaxy Tab S10 Ultra 14.6\" — Giant Screen & Reinforced Mount",
            summaryFr: "L'expérience pupitre tactile la plus spectaculaire : écran géant 14.6\", Galaxy AI, et support mural robuste pour grand format.",
            summaryEn: "The most spectacular touch cockpit: giant 14.6\" display, Galaxy AI, and a heavy-duty wall mount for large tablets.",
            powerWatts: "10W - 25W",
            resolution: "Écran Géant 14.6\" + HDMI 4K",
            items: [
              {
                id: "tablet-galaxy-tab-s10-ultra",
                name: "Samsung Galaxy Tab S10 Ultra 14.6\" (256 Go, Wi-Fi)",
                category: "uc",
                specs: "Écran 14.6\" · Galaxy AI · 256 Go de stockage · Format le plus grand du catalogue Samsung",
                description: "La taille d'un ordinateur portable dans une tablette tactile ultrafine : lisibilité parfaite pour le coach en pleine séance de cycling ou de renforcement.",
                imageUrl: "/images/hardware/tablet-flagship.webp",
                asin: "B0DDTQYPJS",
                amazonUrl: buildProductUrl("B0DDTQYPJS"),
                priceAmazon: 1099.99,
                hasFan: false,
              },
              hubEthernetAcer("android-premium"),
              cableHdmi21("android-premium"),
              {
                id: "mount-gas-spring-anti-theft-pro",
                name: "Support Mural Renforcé Antivol pour Tablette 7-13 Pouces",
                category: "mount",
                specs: "Compatible jusqu'à 13 pouces · Verrouillage sécurisé · Structure renforcée",
                description: "Support mural grand format conçu pour les tablettes 12 à 14 pouces : la Tab S10 Ultra tient fermement, verrouillée contre le vol.",
                imageUrl: "/images/hardware/mount-wall-heavyduty.webp",
                asin: "B0CBPR36BF",
                amazonUrl: buildProductUrl("B0CBPR36BF"),
                priceAmazon: 78.59,
                hasFan: false,
              },
            ],
          },
        },
      },
    },
  },
};

// Petits constructeurs additionnels pour les câbles réutilisés avec un id unique par emplacement
function cableDpHdmi(suffix: string): HardwareItem {
  return {
    id: `cable-dp-hdmi-${suffix}`,
    name: "Câble DisplayPort vers HDMI 4K 60Hz Tressé (1,8 m)",
    category: "cable-video",
    specs: "DisplayPort mâle vers HDMI mâle · Nylon tressé plaqué or · 4K 60Hz",
    description: "Connecte directement la sortie DisplayPort du mini PC vers l'entrée HDMI du projecteur ou de la TV studio.",
    imageUrl: "/images/hardware/cable-dp-hdmi.webp",
    asin: "B081GGNWCX",
    amazonUrl: buildProductUrl("B081GGNWCX"),
    priceAmazon: 10.99,
    hasFan: false,
  };
}

function cableCat7(suffix: string): HardwareItem {
  return {
    id: `cable-cat7-${suffix}`,
    name: "Câble Réseau Cat 7 Plat 10 Gbps (2 m)",
    category: "network",
    specs: "Cat 7 · 10 Gbps · 600 MHz · Connecteurs blindés",
    description: "Liaison réseau haute performance vers la baie de brassage ou le port 10 Gbps du studio.",
    imageUrl: "/images/hardware/cable-rj45.webp",
    asin: "B00QV1F19W",
    amazonUrl: buildProductUrl("B00QV1F19W"),
    priceAmazon: 8.79,
    hasFan: false,
  };
}

function macMiniM6(suffix: string): HardwareItem {
  return {
    id: `mac-mini-m6-${suffix}`,
    name: "Apple Mac Mini (Puce Apple M6)",
    category: "uc",
    specs: "Puce Apple M6 · Moteur multimédia VideoToolbox · Port Ethernet Gigabit natif",
    description: "Régie haut de gamme ultra-compacte : silence quasi total, gestion de veille intelligente native Bobine, fluidité parfaite.",
    imageUrl: "/images/hardware/mac-mini.webp",
    asin: "B0HGGL1RJ1",
    amazonUrl: buildProductUrl("B0HGGL1RJ1"),
    priceAmazon: 1049,
    hasFan: true,
  };
}

// =============================================================================
// 2. ACCESSOIRES & CONNECTIQUE À L'UNITÉ (FILTRÉS PAR OS SÉLECTIONNÉ)
// =============================================================================

export const STANDALONE_ACCESSORIES: StandaloneAccessory[] = [
  {
    id: "acc-dp-hdmi",
    nameFr: "Câble DisplayPort vers HDMI 4K 60Hz Tressé",
    nameEn: "Braided DisplayPort to HDMI 4K 60Hz Cable",
    categoryFr: "Vidéo",
    categoryEn: "Video",
    specs: "DP mâle vers HDMI mâle · 1,8 m · Nylon tressé plaqué or",
    descriptionFr: "Idéal pour relier un mini PC fanless ou tout mini PC pro à la prise HDMI du projecteur ou de la TV studio.",
    descriptionEn: "Ideal to connect a fanless mini PC or any pro mini PC to studio TV or projector HDMI input.",
    imageUrl: "/images/hardware/cable-dp-hdmi.webp",
    asin: "B081GGNWCX",
    amazonUrl: buildProductUrl("B081GGNWCX"),
    priceAmazon: 10.99,
    compatibleOs: ["linux", "windows"],
  },
  {
    id: "acc-hdmi-21",
    nameFr: "Câble HDMI 2.1 Ultra High Speed 48 Gbps",
    nameEn: "HDMI 2.1 Ultra High Speed 48 Gbps Cable",
    categoryFr: "Vidéo",
    categoryEn: "Video",
    specs: "HDMI 2.1 certifié officiel · 4K 120Hz / 8K · 2 m",
    descriptionFr: "Élimine les micro-coupures et les désynchronisations sur les écrans récents et les murs vidéo.",
    descriptionEn: "Eliminates signal drops and stutter on modern 4K studio displays and video walls.",
    imageUrl: "/images/hardware/cable-hdmi.webp",
    asin: "B0CFFFSFFN",
    amazonUrl: buildProductUrl("B0CFFFSFFN"),
    priceAmazon: 10.44,
    compatibleOs: ["linux", "windows", "macos", "android"],
  },
  {
    id: "acc-remote-airmouse",
    nameFr: "Télécommande Air-Mouse Gyroscopique 2.4 GHz USB",
    nameEn: "2.4 GHz USB Gyroscopic Air-Mouse Remote",
    categoryFr: "Contrôle",
    categoryEn: "Control",
    specs: "Dongle USB plug-and-play · Capteur 6 axes",
    descriptionFr: "Permet de contrôler la régie à distance sans toucher au clavier : pointeur virtuel et navigation.",
    descriptionEn: "Control the playout desk from across the room: virtual mouse pointer and navigation.",
    imageUrl: "/images/hardware/remote-airmouse.webp",
    asin: "B0H4K4T2CK",
    amazonUrl: buildProductUrl("B0H4K4T2CK"),
    priceAmazon: 9.57,
    compatibleOs: ["linux", "windows", "macos"],
  },
  {
    id: "acc-remote-keyboard",
    nameFr: "Mini Clavier Rétroéclairé sans Fil avec Touchpad",
    nameEn: "Wireless Backlit Mini Keyboard with Touchpad",
    categoryFr: "Contrôle",
    categoryEn: "Control",
    specs: "Touchpad intégré · Rétroéclairage · Dongle USB 2.4 GHz",
    descriptionFr: "Le combiné idéal en régie : navigation au clavier et à la souris pour renommer les séances.",
    descriptionEn: "All-in-one control: keyboard and mouse navigation for quick text input.",
    imageUrl: "/images/hardware/remote-keyboard.webp",
    asin: "B00WQG6A8C",
    amazonUrl: buildProductUrl("B00WQG6A8C"),
    priceAmazon: 24.99,
    compatibleOs: ["linux", "windows", "macos"],
  },
  {
    id: "acc-hub-usbc-pd",
    nameFr: "Belkin Hub USB-C HDMI 4K 60Hz + Power Delivery 100W",
    nameEn: "Belkin USB-C Hub HDMI 4K 60Hz + Power Delivery 100W",
    categoryFr: "Connectique",
    categoryEn: "Connectivity",
    specs: "HDMI 4K60 · Power Delivery 100W · Transfert 5 Gbit/s",
    descriptionFr: "Indispensable pour diffuser la vidéo depuis un PC portable ou une tablette Android tout en maintenant la batterie chargée.",
    descriptionEn: "Essential to project video from a laptop or Android tablet while maintaining battery charge.",
    imageUrl: "/images/hardware/hub-usbc.webp",
    asin: "B0FVYC8H5J",
    amazonUrl: buildProductUrl("B0FVYC8H5J"),
    priceAmazon: 27.99,
    compatibleOs: ["linux", "windows", "macos", "android"],
  },
  {
    id: "acc-cable-cat6a",
    nameFr: "Câble Réseau RJ45 Cat 6A Blindé S-FTP (3 m)",
    nameEn: "Cat 6A S-FTP Shielded Ethernet Cable (3 m)",
    categoryFr: "Réseau",
    categoryEn: "Network",
    specs: "Cat 6A S-FTP blindé · Jusqu'à 10 Gbps · Connecteurs dorés",
    descriptionFr: "Garantit une diffusion locale sans aucune perte de paquets entre la régie et les écrans réseau.",
    descriptionEn: "Guarantees packet-loss-free local network streaming between the desk and connected screens.",
    imageUrl: "/images/hardware/cable-cat6a.webp",
    asin: "B075DKWRD6",
    amazonUrl: buildProductUrl("B075DKWRD6"),
    priceAmazon: 5.85,
    compatibleOs: ["linux", "windows", "macos", "android"],
  },
  {
    id: "acc-wall-mount-tablet",
    nameFr: "AboveTEK Support Mural Antivol Verrouillable pour Tablette",
    nameEn: "AboveTEK Secure Key-Lock Anti-Theft Wall Mount for Tablet",
    categoryFr: "Support",
    categoryEn: "Mount",
    specs: "Verrou à clé · Modes portrait et paysage · Compatible 7-11 pouces",
    descriptionFr: "Sécurise la tablette contre le vol en libre-service tout en gardant l'écran tactile immédiatement accessible.",
    descriptionEn: "Protects self-service tablets against theft while keeping touch screen immediately accessible.",
    imageUrl: "/images/hardware/wall-mount-tablet.webp",
    asin: "B087WSSRQ7",
    amazonUrl: buildProductUrl("B087WSSRQ7"),
    priceAmazon: 59.99,
    compatibleOs: ["android"],
  },
  {
    id: "acc-stand-vertical-laptop",
    nameFr: "UGREEN Support Vertical Réglable en Aluminium pour PC Portable",
    nameEn: "UGREEN Adjustable Aluminum Vertical Laptop Stand",
    categoryFr: "Support",
    categoryEn: "Mount",
    specs: "Aluminium anodisé · Base antidérapante",
    descriptionFr: "Maintient l'ordinateur portable fermé à la verticale en mode clamshell : encombrement minimal en régie.",
    descriptionEn: "Holds laptop closed vertically in clamshell mode: saves valuable counter space in the control room.",
    imageUrl: "/images/hardware/stand-vertical.webp",
    asin: "B091B4SWR7",
    amazonUrl: buildProductUrl("B091B4SWR7"),
    priceAmazon: 23.09,
    compatibleOs: ["linux", "windows", "macos"],
  },
];
