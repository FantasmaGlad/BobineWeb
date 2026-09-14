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

// Clavier filaire pour les Mini PC headless (aucun clavier natif) : jamais utilisé sur la
// voie "PC Portable", qui dispose déjà d'un clavier intégré sur l'ordinateur lui-même.
const glabKeyboard = (id: string): HardwareItem => ({
  id,
  name: "The G-Lab Keyz Hydrogen — Clavier Gamer Semi-mécanique 60% AZERTY",
  category: "control",
  specs: "Format compact 60% · Switches semi-mécaniques · Rétroéclairage · Filaire USB",
  description: "Clavier filaire compact pour l'administration du mini PC headless (aucun clavier natif sur cette configuration).",
  imageUrl: "/images/hardware/keyboard-glab-hydrogen.webp",
  asin: "B0HF5JQCTG",
  amazonUrl: buildProductUrl("B0HF5JQCTG"),
  priceAmazon: 18.76,
  hasFan: false,
});

// Souris pour tout usage pointeur : complète le clavier G-Lab (dépourvu de trackpad) sur
// Mini PC, ou sert de pointeur ponctuel sur PC Portable sans dupliquer le clavier existant.
const logitechMouse = (id: string): HardwareItem => ({
  id,
  name: "Logitech M185 Souris Sans Fil 2.4 GHz avec Mini Récepteur USB",
  category: "control",
  specs: "Sans fil 2.4 GHz · Nano-récepteur USB · Autonomie ~12 mois",
  description: "Pointeur de précision plug-and-play pour l'administration de la régie, sans dupliquer un clavier déjà présent.",
  imageUrl: "/images/hardware/mouse-logitech-m185.webp",
  asin: "B00552K0GM",
  amazonUrl: buildProductUrl("B00552K0GM"),
  priceAmazon: 11.99,
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

// Chaque gamme "PC Portable" recommande desormais un vrai laptop achetable (ASIN verifie),
// en plus du kit de connectique : l'ordinateur n'est plus implicite, il est vendu sur la carte.
interface LaptopTierConfig {
  item: HardwareItem;
  headlineFr: string;
  headlineEn: string;
  summaryFr: string;
  summaryEn: string;
  badgeFr?: string;
  badgeEn?: string;
  isPopular?: boolean;
}

function buildLaptopTiers(config: Record<TierKey, LaptopTierConfig>): Record<TierKey, HardwareTier> {
  return {
    essentiel: {
      id: "essentiel",
      labelFr: "Essentiel",
      labelEn: "Essential",
      badgeFr: config.essentiel.badgeFr,
      badgeEn: config.essentiel.badgeEn,
      isPopular: config.essentiel.isPopular,
      headlineFr: config.essentiel.headlineFr,
      headlineEn: config.essentiel.headlineEn,
      summaryFr: config.essentiel.summaryFr,
      summaryEn: config.essentiel.summaryEn,
      powerWatts: "100W PD",
      resolution: "4K 60fps (via hub)",
      items: [
        config.essentiel.item,
        hubUsbcBelkin("hub-usbc-essentiel"),
        cableHdmi21("cable-hdmi21-essentiel"),
        remotePresentation("remote-presentation-essentiel"),
      ],
    },
    recommande: {
      id: "recommande",
      labelFr: "Recommandé",
      labelEn: "Recommended",
      badgeFr: config.recommande.badgeFr,
      badgeEn: config.recommande.badgeEn,
      isPopular: config.recommande.isPopular ?? true,
      headlineFr: config.recommande.headlineFr,
      headlineEn: config.recommande.headlineEn,
      summaryFr: config.recommande.summaryFr,
      summaryEn: config.recommande.summaryEn,
      powerWatts: "100W PD",
      resolution: "4K 60fps (via hub)",
      items: [
        config.recommande.item,
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
      badgeFr: config.pro.badgeFr,
      badgeEn: config.pro.badgeEn,
      isPopular: config.pro.isPopular,
      headlineFr: config.pro.headlineFr,
      headlineEn: config.pro.headlineEn,
      summaryFr: config.pro.summaryFr,
      summaryEn: config.pro.summaryEn,
      powerWatts: "96W PD",
      resolution: "8K / Quad 4K (via dock)",
      items: [
        config.pro.item,
        dockThunderbolt4("dock-tb4-pro"),
        standVertical("stand-vertical-pro"),
        cableThunderbolt4("cable-tb4-pro"),
        logitechMouse("mouse-laptop-pro"),
      ],
    },
    premium: {
      id: "premium",
      labelFr: "Premium",
      labelEn: "Premium",
      badgeFr: config.premium.badgeFr ?? "Kit Complet",
      badgeEn: config.premium.badgeEn ?? "Full Kit",
      isPopular: config.premium.isPopular,
      headlineFr: config.premium.headlineFr,
      headlineEn: config.premium.headlineEn,
      summaryFr: config.premium.summaryFr,
      summaryEn: config.premium.summaryEn,
      powerWatts: "96W PD",
      resolution: "8K / Quad 4K (via dock)",
      items: [
        config.premium.item,
        dockThunderbolt4("dock-tb4-premium"),
        standVertical("stand-vertical-premium"),
        cableThunderbolt4("cable-tb4-premium"),
        hubEthernetAcer("hub-ethernet-premium"),
        logitechMouse("mouse-laptop-premium"),
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
              glabKeyboard("keyboard-linux-pro"),
              logitechMouse("mouse-linux-pro"),
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
              glabKeyboard("keyboard-linux-premium"),
              logitechMouse("mouse-linux-premium"),
            ],
          },
        },
      },
      laptop: {
        titleFr: "PC Portable (Linux)",
        titleEn: "Laptop (Linux)",
        subtitleFr: "Un vrai PC portable par gamme, plus le kit de connectique pour l'exploiter fermé en régie",
        subtitleEn: "A real laptop for every tier, plus the connectivity kit to run it closed in the control room",
        targetFr: "Clubs qui préfèrent un ordinateur portable polyvalent, transportable, à une appliance fixe",
        targetEn: "Gyms who prefer a versatile, portable laptop over a fixed appliance",
        defaultTier: "recommande",
        editorialNoteFr: "Le meilleur choix communautaire n'est pas ici : la communauté Linux recommande unanimement le Framework Laptop 13 — réparable, modulaire, pièces détachées officielles. Il n'est vendu qu'en direct sur frame.work, pas sur Amazon, donc absent des cartes ci-dessous qui ne référencent que des produits Amazon vérifiés. Le kit de connectique fonctionne avec ce modèle comme avec n'importe quel autre PC portable.",
        editorialNoteEn: "The best community pick isn't listed here: the Linux community unanimously recommends the Framework Laptop 13 — repairable, modular, official spare parts. It's sold direct at frame.work only, not on Amazon, so it's absent from the cards below, which only reference verified Amazon products. The connectivity kit works with it just as well as with any other laptop.",
        tiers: buildLaptopTiers({
          essentiel: {
            item: {
              id: "laptop-linux-essentiel",
              name: "Ordinateur Portable 15,3\" (Core i5-8210Y / 24 Go RAM / 512 Go SSD, Windows 11)",
              category: "uc",
              specs: "2 cœurs jusqu'à 3,6 GHz · Écran 1920x1200 100% sRGB · HDMI + USB-A",
              description: "Livré sous Windows 11 (aucune offre neuve française ne propose Linux préinstallé) : installez votre distribution par-dessus ou en dual-boot. Suffisant pour la régie Bobine en 1080p.",
              imageUrl: "/images/hardware/laptop-linux-essentiel.webp",
              asin: "B0H3P2WZ9Z",
              amazonUrl: buildProductUrl("B0H3P2WZ9Z"),
              priceAmazon: 322.99,
              hasFan: true,
            },
            headlineFr: "PC Portable 15,3\" Core i5 — Premier prix vérifié",
            headlineEn: "15.3\" Core i5 Laptop — Verified budget pick",
            summaryFr: "Un ordinateur portable neuf et abordable, accompagné du hub USB-C minimal pour l'afficher en grand.",
            summaryEn: "An affordable new laptop, paired with the minimal USB-C hub to display it on the big screen.",
          },
          recommande: {
            item: {
              id: "laptop-linux-recommande",
              name: "MSI Modern 14 (AMD Ryzen 7 7730U / 16 Go RAM / 512 Go SSD, sans système d'exploitation)",
              category: "uc",
              specs: "8 cœurs 16 threads · AMD Radeon Graphics · Livré sans OS · Clavier rétroéclairé",
              description: "Le seul de cette page vendu réellement sans système d'exploitation : zéro licence Windows payée pour rien, votre distribution Linux s'installe directement dessus.",
              imageUrl: "/images/hardware/laptop-msi-modern14.webp",
              asin: "B0GR1DNB5G",
              amazonUrl: buildProductUrl("B0GR1DNB5G"),
              priceAmazon: 705.31,
              hasFan: true,
            },
            badgeFr: "Vraiment Sans OS",
            badgeEn: "Genuinely No OS",
            headlineFr: "MSI Modern 14 sans OS — Fait pour Linux",
            headlineEn: "MSI Modern 14 No-OS — Built for Linux",
            summaryFr: "Livré sans système d'exploitation : le choix le plus honnête pour une machine 100% Linux, complété par le combo studio.",
            summaryEn: "Shipped with no operating system: the most honest pick for an all-Linux machine, completed with the studio combo.",
          },
          pro: {
            item: {
              id: "laptop-linux-pro",
              name: "ASUS Vivobook X1607CA 16\" (Intel Core Ultra 7 255H / 16 Go RAM / 512 Go SSD, Windows 11 Pro)",
              category: "uc",
              specs: "16 cœurs Core Ultra 7 · Écran WUXGA 16\" · Clavier AZERTY rétroéclairé",
              description: "Puce Intel Core Ultra récente, très bien supportée par les noyaux Linux modernes. Livré sous Windows 11 Pro : dual-boot ou remplacement complet au choix.",
              imageUrl: "/images/hardware/laptop-asus-vivobook-x1607.webp",
              asin: "B0H6GZKCSW",
              amazonUrl: buildProductUrl("B0H6GZKCSW"),
              priceAmazon: 1200,
              hasFan: true,
            },
            headlineFr: "ASUS Vivobook Core Ultra 7 — Puissance et grand écran",
            headlineEn: "ASUS Vivobook Core Ultra 7 — Power and a big screen",
            summaryFr: "Seize cœurs et un écran 16 pouces pour le montage et la régie multitâche, associé au dock Thunderbolt 4.",
            summaryEn: "Sixteen cores and a 16-inch screen for editing and multitasking, paired with the Thunderbolt 4 dock.",
          },
          premium: {
            item: {
              id: "laptop-linux-premium",
              name: "Lenovo ThinkPad X1 Carbon Gen 12 (Intel Core Ultra 5 125U / 16 Go RAM / 512 Go SSD)",
              category: "uc",
              specs: "Châssis fibre de carbone · Wi-Fi 6E · Clavier ThinkPad best-in-class",
              description: "La série la plus plébiscitée par la communauté Linux (drivers matures, images de distribution dédiées, clavier reconnu) : le choix premium pour une régie qui voyage.",
              imageUrl: "/images/hardware/laptop-thinkpad-x1carbon.webp",
              asin: "B0F142ZQLN",
              amazonUrl: buildProductUrl("B0F142ZQLN"),
              priceAmazon: 1922.29,
              hasFan: true,
            },
            headlineFr: "Lenovo ThinkPad X1 Carbon — Le favori de la communauté Linux",
            headlineEn: "Lenovo ThinkPad X1 Carbon — The Linux community favorite",
            summaryFr: "Le portable le plus documenté et supporté sous Linux, complété par le dock Thunderbolt 4 et un réseau filaire redondant.",
            summaryEn: "The most documented and supported laptop under Linux, completed with the Thunderbolt 4 dock and redundant wired network.",
          },
        }),
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
              glabKeyboard("keyboard-windows-pro"),
              logitechMouse("mouse-windows-pro"),
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
              glabKeyboard("keyboard-windows-premium"),
              logitechMouse("mouse-windows-premium"),
            ],
          },
        },
      },
      laptop: {
        titleFr: "PC Portable (Windows)",
        titleEn: "Laptop (Windows)",
        subtitleFr: "Un vrai PC portable Windows 11 par gamme, plus le kit de connectique pour l'exploiter fermé en régie",
        subtitleEn: "A real Windows 11 laptop for every tier, plus the connectivity kit to run it closed in the control room",
        targetFr: "Clubs qui préfèrent un ordinateur portable polyvalent, transportable, à une appliance fixe",
        targetEn: "Gyms who prefer a versatile, portable laptop over a fixed appliance",
        defaultTier: "recommande",
        tiers: buildLaptopTiers({
          essentiel: {
            item: {
              id: "laptop-windows-essentiel",
              name: "Acer Aspire Go 17 (Intel N150 / 8 Go RAM / 128 Go UFS, Windows 11)",
              category: "uc",
              specs: "4 cœurs · Écran 17,3\" FHD 60Hz · Clavier AZERTY",
              description: "Grand écran 17 pouces neuf à petit prix, Windows 11 officiel préinstallé : suffisant pour la régie Bobine et la bureautique légère.",
              imageUrl: "/images/hardware/laptop-acer-aspire-go17.webp",
              asin: "B0B8QYXY9H",
              amazonUrl: buildProductUrl("B0B8QYXY9H"),
              priceAmazon: 403.75,
              hasFan: true,
            },
            headlineFr: "Acer Aspire Go 17 — Grand écran, premier prix",
            headlineEn: "Acer Aspire Go 17 — Big screen, budget price",
            summaryFr: "Un portable Windows 11 neuf à écran 17 pouces, complété par le hub USB-C minimal.",
            summaryEn: "A brand new 17-inch Windows 11 laptop, completed with the minimal USB-C hub.",
          },
          recommande: {
            item: {
              id: "laptop-windows-recommande",
              name: "HP 15-fc0012sf (AMD Ryzen 3-7320U / 8 Go RAM / 512 Go SSD, Windows 11)",
              category: "uc",
              specs: "4 cœurs AMD Ryzen 3 · Écran 15,6\" FHD · AMD Radeon Graphics",
              description: "Grande marque, SSD confortable de 512 Go, Windows 11 officiel : le meilleur équilibre pour une régie quotidienne.",
              imageUrl: "/images/hardware/laptop-hp-15-ryzen3.webp",
              asin: "B0G3XT2BLZ",
              amazonUrl: buildProductUrl("B0G3XT2BLZ"),
              priceAmazon: 529,
              hasFan: true,
            },
            headlineFr: "HP 15 Ryzen 3 — Le combo studio complet",
            headlineEn: "HP 15 Ryzen 3 — The full studio combo",
            summaryFr: "Portable HP fiable avec 512 Go de stockage, complété par le support vertical et le réseau filaire.",
            summaryEn: "Reliable HP laptop with 512 GB storage, completed with the vertical stand and wired network.",
          },
          pro: {
            item: {
              id: "laptop-windows-pro",
              name: "HP 15-fc0009sf (AMD Ryzen 7-7730U / 16 Go RAM / 512 Go SSD, Windows 11)",
              category: "uc",
              specs: "8 cœurs AMD Ryzen 7 · Écran 15,6\" FHD IPS · AMD Radeon Graphics",
              description: "Huit cœurs et 16 Go de RAM pour le multitâche exigeant, associé au dock Thunderbolt 4 pour le multi-écran.",
              imageUrl: "/images/hardware/laptop-hp-15-ryzen7.webp",
              asin: "B0G3XPHHP2",
              amazonUrl: buildProductUrl("B0G3XPHHP2"),
              priceAmazon: 634.99,
              hasFan: true,
            },
            headlineFr: "HP 15 Ryzen 7 — Puissance multitâche",
            headlineEn: "HP 15 Ryzen 7 — Multitasking power",
            summaryFr: "Un portable Windows 11 puissant à écran IPS, complété par le dock Thunderbolt 4.",
            summaryEn: "A powerful Windows 11 laptop with an IPS display, completed with the Thunderbolt 4 dock.",
          },
          premium: {
            item: {
              id: "laptop-windows-premium",
              name: "Dell XPS 13 (Intel Core Ultra 7 258V / 32 Go RAM / 1 To SSD)",
              category: "uc",
              specs: "Intel Core Ultra 7 258V · 32 Go RAM · Écran 13,4\" · Thunderbolt 4 natif",
              description: "L'ultrabook Windows de référence : Thunderbolt 4 natif, 32 Go de RAM, châssis premium. Zéro compromis pour une régie haut de gamme.",
              imageUrl: "/images/hardware/laptop-dell-xps13.webp",
              asin: "B0GPN76ZSX",
              amazonUrl: buildProductUrl("B0GPN76ZSX"),
              priceAmazon: 1779,
              hasFan: true,
            },
            headlineFr: "Dell XPS 13 — L'ultrabook Windows de référence",
            headlineEn: "Dell XPS 13 — The benchmark Windows ultrabook",
            summaryFr: "32 Go de RAM et Thunderbolt 4 natif, complété par le dock et un réseau filaire redondant.",
            summaryEn: "32 GB RAM and native Thunderbolt 4, completed with the dock and redundant wired network.",
          },
        }),
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
            headlineFr: "Mac Mini (Puce Apple M6, RAM/SSD supérieurs) — Kit complet",
            headlineEn: "Mac Mini (Apple M6 chip, higher RAM/SSD) — Full kit",
            summaryFr: "Le même châssis M6 en configuration mémoire et stockage supérieure, complété par un réseau filaire et une télécommande gyroscopique pour une régie autonome complète.",
            summaryEn: "The same M6 chassis with a higher memory and storage configuration, completed with wired networking and a gyroscopic remote for a fully autonomous desk.",
            powerWatts: "4W - 12W",
            resolution: "4K 60fps natif",
            items: [
              macMiniM6Plus("recommande"),
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
              glabKeyboard("keyboard-macos-pro"),
              logitechMouse("mouse-macos-pro"),
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
              glabKeyboard("keyboard-macos-premium"),
              logitechMouse("mouse-macos-premium"),
            ],
          },
        },
      },
      laptop: {
        titleFr: "MacBook en Mode Clamshell",
        titleEn: "MacBook in Clamshell Mode",
        subtitleFr: "Un vrai MacBook par gamme, plus le kit de connectique pour l'exploiter fermé en régie",
        subtitleEn: "A real MacBook for every tier, plus the connectivity kit to run it closed in the control room",
        targetFr: "Coachs et clubs déjà dans l'écosystème Apple, ou prêts à y entrer via un portable",
        targetEn: "Coaches and clubs already in the Apple ecosystem, or ready to enter it via a laptop",
        defaultTier: "recommande",
        tiers: buildLaptopTiers({
          essentiel: {
            item: {
              id: "laptop-macos-essentiel",
              name: "Apple MacBook Air 15\" (Puce M4 / 16 Go RAM / 256 Go SSD)",
              category: "uc",
              specs: "Puce Apple M4 · Écran Liquid Retina 15,3\" · Touch ID · Sans ventilateur",
              description: "Le MacBook Air le plus abordable de la gamme Apple Silicon actuelle (génération M4, une génération sous le M5) : silencieux, autonome, largement suffisant pour la régie Bobine.",
              imageUrl: "/images/hardware/laptop-macbook-air-m4-15.webp",
              asin: "B0DZDCKSD2",
              amazonUrl: buildProductUrl("B0DZDCKSD2"),
              priceAmazon: 1269,
              hasFan: false,
            },
            headlineFr: "MacBook Air 15\" (Puce M4) — L'entrée Apple Silicon",
            headlineEn: "MacBook Air 15\" (M4 chip) — The Apple Silicon entry point",
            summaryFr: "Apple ne vend pas de MacBook réellement économique : le M4 Air est le point d'entrée actuel le plus raisonnable, complété par le hub minimal.",
            summaryEn: "Apple doesn't sell a truly budget MacBook: the M4 Air is today's most reasonable entry point, completed with the minimal hub.",
          },
          recommande: {
            item: {
              id: "laptop-macos-recommande",
              name: "Apple MacBook Air 13\" (Puce M5 / 24 Go RAM / 1 To SSD)",
              category: "uc",
              specs: "Puce Apple M5 · Écran Liquid Retina 13,6\" · Wi-Fi 7 · Sans ventilateur",
              description: "Dernière génération M5, 24 Go de mémoire unifiée et 1 To de stockage : confortable pour tourner Bobine et gérer les médias en local sans jamais manquer d'espace.",
              imageUrl: "/images/hardware/laptop-macbook-air-m5-13.webp",
              asin: "B0GR1SJYGS",
              amazonUrl: buildProductUrl("B0GR1SJYGS"),
              priceAmazon: 1799,
              hasFan: false,
            },
            headlineFr: "MacBook Air 13\" (Puce M5) — Le combo studio complet",
            headlineEn: "MacBook Air 13\" (M5 chip) — The full studio combo",
            summaryFr: "Puce M5 récente et 1 To de stockage, complété par le support vertical et le réseau filaire.",
            summaryEn: "Recent M5 chip and 1 TB storage, completed with the vertical stand and wired network.",
          },
          pro: {
            item: {
              id: "laptop-macos-pro",
              name: "Apple MacBook Pro 14\" (Puce M5 / 32 Go RAM / 1 To SSD)",
              category: "uc",
              specs: "Puce Apple M5 10 cœurs CPU / 10 cœurs GPU · Écran Liquid Retina XDR 14,2\" · Wi-Fi 7",
              description: "Écran XDR et 32 Go de mémoire unifiée pour le montage vidéo et le multitâche exigeant, associé au dock Thunderbolt pour le multi-écran.",
              imageUrl: "/images/hardware/laptop-macbook-pro-m5-14.webp",
              asin: "B0GR1RL3W6",
              amazonUrl: buildProductUrl("B0GR1RL3W6"),
              priceAmazon: 2439,
              hasFan: true,
            },
            headlineFr: "MacBook Pro 14\" (Puce M5) — Écran XDR & puissance",
            headlineEn: "MacBook Pro 14\" (M5 chip) — XDR display & power",
            summaryFr: "Ventilateur actif mais quasi silencieux : puce M5 complète et écran XDR, complété par le dock Thunderbolt.",
            summaryEn: "Active but near-silent fan: full M5 chip and XDR display, completed with the Thunderbolt dock.",
          },
          premium: {
            item: {
              id: "laptop-macos-premium",
              name: "Apple MacBook Pro 16\" (Puce M5 Pro / 24 Go RAM / 1 To SSD)",
              category: "uc",
              specs: "Puce Apple M5 Pro 18 cœurs CPU / 20 cœurs GPU · Écran Liquid Retina XDR 16,2\" · Wi-Fi 7",
              description: "Le MacBook le plus puissant du catalogue Apple actuel : idéal pour une régie qui double comme poste de montage professionnel.",
              imageUrl: "/images/hardware/laptop-macbook-pro-m5pro-16.webp",
              asin: "B0GR1NMSKK",
              amazonUrl: buildProductUrl("B0GR1NMSKK"),
              priceAmazon: 3099,
              hasFan: true,
            },
            headlineFr: "MacBook Pro 16\" (Puce M5 Pro) — Le sommet Apple",
            headlineEn: "MacBook Pro 16\" (M5 Pro chip) — The Apple summit",
            summaryFr: "18 cœurs CPU et écran géant XDR, complété par le dock Thunderbolt et un réseau filaire redondant.",
            summaryEn: "18 CPU cores and a giant XDR display, completed with the Thunderbolt dock and redundant wired network.",
          },
        }),
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
    name: "Apple Mac Mini (Puce Apple M6, configuration de base)",
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

// Meme chassis M6, configuration RAM/stockage superieure : evite d'afficher le produit
// identique sur Essentiel et Recommande (ASIN et prix reellement differents, verifies).
function macMiniM6Plus(suffix: string): HardwareItem {
  return {
    id: `mac-mini-m6plus-${suffix}`,
    name: "Apple Mac Mini (Puce Apple M6, configuration supérieure RAM/SSD)",
    category: "uc",
    specs: "Puce Apple M6 · RAM/SSD supérieurs à la config de base · Port Ethernet Gigabit natif",
    description: "Le même châssis M6, avec davantage de mémoire et de stockage : plus de marge pour la bibliothèque vidéo locale et le multitâche de régie.",
    imageUrl: "/images/hardware/mac-mini.webp",
    asin: "B0HGGBZNTT",
    amazonUrl: buildProductUrl("B0HGGBZNTT"),
    priceAmazon: 1269,
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
    id: "acc-keyboard-glab",
    nameFr: "The G-Lab Keyz Hydrogen — Clavier Gamer Semi-mécanique 60% AZERTY",
    nameEn: "The G-Lab Keyz Hydrogen — 60% Semi-Mechanical Gaming Keyboard",
    categoryFr: "Contrôle",
    categoryEn: "Control",
    specs: "Format compact 60% · Switches semi-mécaniques · Rétroéclairage · Filaire USB",
    descriptionFr: "Pour un mini PC headless sans clavier natif : administration complète de la régie au clavier, filaire pour une fiabilité maximale.",
    descriptionEn: "For a headless mini PC with no native keyboard: full desk administration, wired for maximum reliability.",
    imageUrl: "/images/hardware/keyboard-glab-hydrogen.webp",
    asin: "B0HF5JQCTG",
    amazonUrl: buildProductUrl("B0HF5JQCTG"),
    priceAmazon: 18.76,
    compatibleOs: ["linux", "windows", "macos"],
  },
  {
    id: "acc-mouse-logitech",
    nameFr: "Logitech M185 Souris Sans Fil 2.4 GHz",
    nameEn: "Logitech M185 Wireless Mouse 2.4 GHz",
    categoryFr: "Contrôle",
    categoryEn: "Control",
    specs: "Sans fil 2.4 GHz · Nano-récepteur USB · Autonomie ~12 mois",
    descriptionFr: "Complète le clavier G-Lab (sans trackpad) sur mini PC, ou sert de pointeur ponctuel sur un PC portable sans dupliquer son clavier.",
    descriptionEn: "Completes the G-Lab keyboard (no trackpad) on a mini PC, or serves as an occasional pointer on a laptop without duplicating its keyboard.",
    imageUrl: "/images/hardware/mouse-logitech-m185.webp",
    asin: "B00552K0GM",
    amazonUrl: buildProductUrl("B00552K0GM"),
    priceAmazon: 11.99,
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
