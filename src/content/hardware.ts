/**
 * Catalogue canonique des recommandations matérielles et bundles Bobine.
 *
 * Règles strictes :
 * - ZÉRO EMOJI dans les intitulés, descriptions et badges.
 * - Liens marchands Amazon : Store ID "fantasmaglad-21" obligatoire.
 * - Architecture multi-canaux : Amazon actif, Reconditionné et AliExpress prêts et typés.
 * - Documentation de l'API Partenaires (PA-API v5 / Creators API) intégrée.
 */

export const AMAZON_STORE_ID = "fantasmaglad-21";

export type OsKey = "linux" | "windows" | "macos" | "android";
export type TierKey = "essentiel" | "recommande" | "pro";
export type ChannelKey = "amazon" | "reconditionne" | "aliexpress";

export interface HardwareItem {
  id: string;
  name: string;
  category: "uc" | "cable-video" | "network" | "control" | "power-hub" | "mount";
  specs: string;
  description: string;
  asin?: string; // Référence Amazon ASIN pour PA-API v5
  amazonUrl: string;
  reconditionneUrl?: string; // Future activation AfB Shop / eBay
  aliexpressUrl?: string; // Future activation AliExpress Portals
  priceEstAmazon: number;
  priceEstRecon?: number;
  priceEstAli?: number;
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

export interface HardwareOsBundle {
  os: OsKey;
  titleFr: string;
  titleEn: string;
  subtitleFr: string;
  subtitleEn: string;
  targetFr: string;
  targetEn: string;
  defaultTier: TierKey;
  tiers: Record<TierKey, HardwareTier>;
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
  asin: string;
  amazonUrl: string;
  priceEst: number;
}

// =============================================================================
// 1. LES 4 BUNDLES PAR SYSTÈME D'EXPLOITATION (3 GAMMES CHACUN)
// =============================================================================

export const HARDWARE_BUNDLES: Record<OsKey, HardwareOsBundle> = {
  // ---------------------------------------------------------------------------
  // A. LINUX APPLIANCE (Recommandation Officielle n°1 Bobine)
  // ---------------------------------------------------------------------------
  linux: {
    os: "linux",
    titleFr: "Linux Appliance Dédiée",
    titleEn: "Dedicated Linux Appliance",
    subtitleFr: "Mini PC fanless autonome, 100% silencieux, résistant à la poussière de studio",
    subtitleEn: "Autonomous fanless mini PC, completely silent, gym dust and chalk resistant",
    targetFr: "Studio de cycling immersif, studio vidéo 24/7, régie autonome sans bureau",
    targetEn: "Immersive cycling studio, 24/7 video room, autonomous headless setup",
    defaultTier: "recommande",
    tiers: {
      essentiel: {
        id: "essentiel",
        labelFr: "Essentiel",
        labelEn: "Essential",
        headlineFr: "Dell Wyse 5070 Celeron — Le premier prix fiable",
        headlineEn: "Dell Wyse 5070 Celeron — Budget reliability",
        summaryFr: "Configuration économique déclassée d'entreprise, idéale pour démarrer sans risque en 1080p60.",
        summaryEn: "Cost-effective decommissioned enterprise unit, ideal to start smoothly in 1080p60.",
        powerWatts: "4W - 7W",
        resolution: "1080p 60fps",
        items: [
          {
            id: "wyse-5070-j4105",
            name: "Dell Wyse 5070 (Celeron J4105 / 4 Go RAM / 64 Go SSD)",
            category: "uc",
            specs: "4 cœurs 2.5 GHz · Intel UHD 600 · Châssis fanless passif · 4W repos",
            description: "Châssis professionnel étanche sans ventilateur. Zéro bruit, n'aspire pas la poussière ni la magnésie.",
            asin: "B07P969W7V",
            amazonUrl: `https://www.amazon.fr/s?k=Dell+Wyse+5070+J4105&tag=${AMAZON_STORE_ID}`,
            reconditionneUrl: "https://www.ebay.fr/sch/i.html?_nkw=Dell+Wyse+5070",
            aliexpressUrl: "https://fr.aliexpress.com/wholesale?SearchText=Dell+Wyse+5070",
            priceEstAmazon: 85,
            priceEstRecon: 49,
            priceEstAli: 58,
          },
          {
            id: "cable-dp-hdmi-std",
            name: "Câble DisplayPort vers HDMI 2.0 (1,8 m)",
            category: "cable-video",
            specs: "DisplayPort mâle vers HDMI mâle · Blindage anti-parasite · 4K 60Hz",
            description: "Connecte directement la sortie DisplayPort du Wyse 5070 vers l'entrée HDMI du projecteur ou de la TV studio.",
            asin: "B081VK779C",
            amazonUrl: `https://www.amazon.fr/s?k=cable+displayport+vers+hdmi+4k+60hz&tag=${AMAZON_STORE_ID}`,
            priceEstAmazon: 8.99,
            priceEstRecon: 6.9,
            priceEstAli: 4.2,
          },
          {
            id: "cable-rj45-cat6",
            name: "Câble Réseau RJ45 Ethernet Cat 6A Blindé (2 m)",
            category: "network",
            specs: "Cat 6A SFTP · Connecteurs plaqués or · Zéro latence LAN",
            description: "Indispensable pour garantir une transmission réseau locale sans micro-coupures Wi-Fi.",
            asin: "B00QV1F19W",
            amazonUrl: `https://www.amazon.fr/s?k=cable+ethernet+cat+6a+blind%C3%A9&tag=${AMAZON_STORE_ID}`,
            priceEstAmazon: 6.5,
            priceEstRecon: 4.5,
            priceEstAli: 2.8,
          },
          {
            id: "remote-24g-basic",
            name: "Télécommande de Présentation Studio 2.4 GHz USB",
            category: "control",
            specs: "Sans fil 2.4 GHz · Dongle USB plug-and-play · Portée 15 m",
            description: "Télécommande sobre avec dongle USB reconnu nativement sans pilote. Permet au coach de lancer, mettre en pause ou changer de cours.",
            asin: "B07P852V6C",
            amazonUrl: `https://www.amazon.fr/s?k=t%C3%A9l%C3%A9commande+pr%C3%A9sentation+usb+2.4ghz&tag=${AMAZON_STORE_ID}`,
            priceEstAmazon: 11.9,
            priceEstRecon: 9.9,
            priceEstAli: 5.5,
          },
        ],
      },
      recommande: {
        id: "recommande",
        labelFr: "Recommandé",
        labelEn: "Recommended",
        badgeFr: "Choix Bobine",
        badgeEn: "Bobine Pick",
        isPopular: true,
        headlineFr: "Dell Wyse 5070 Pentium Silver J5005 — La référence studio",
        headlineEn: "Dell Wyse 5070 Pentium Silver J5005 — The studio benchmark",
        summaryFr: "Le cœur de cible Bobine : processeur J5005 plus puissant (+50% GPU), 8 Go de RAM et fondu vidéo A/B Deck ultra-fluide.",
        summaryEn: "The Bobine sweet spot: J5005 CPU with +50% GPU headroom, 8 GB RAM, and seamless A/B Deck video crossfades.",
        powerWatts: "4W - 8W",
        resolution: "1080p & 4K 60fps",
        items: [
          {
            id: "wyse-5070-j5005",
            name: "Dell Wyse 5070 (Pentium Silver J5005 / 8 Go RAM / 128 Go SSD M.2)",
            category: "uc",
            specs: "4 cœurs 2.8 GHz Turbo · Intel UHD 605 (18 EUs) · 8 Go DDR4 double canal · Fanless",
            description: "Modèle supérieur avec processeur J5005 : son GPU Intel UHD 605 embarque 18 unités d'exécution (+50% face au J4105), assurant une lecture 4K60 sans aucune saccade.",
            asin: "B0892W8T99",
            amazonUrl: `https://www.amazon.fr/s?k=Dell+Wyse+5070+Pentium+Silver+J5005&tag=${AMAZON_STORE_ID}`,
            reconditionneUrl: "https://www.ebay.fr/sch/i.html?_nkw=Dell+Wyse+5070+J5005",
            aliexpressUrl: "https://fr.aliexpress.com/wholesale?SearchText=Dell+Wyse+5070+J5005",
            priceEstAmazon: 109,
            priceEstRecon: 69,
            priceEstAli: 79,
          },
          {
            id: "cable-dp-hdmi-braided",
            name: "Câble DisplayPort 1.4 vers HDMI 2.0 Tressé Blindé (2 m)",
            category: "cable-video",
            specs: "DisplayPort vers HDMI 4K 60Hz · Gaine nylon tressée renforcée · HDR",
            description: "Câble tressé haute durabilité résistant aux torsions et aux passages de câbles studio intensifs.",
            asin: "B082C7PP81",
            amazonUrl: `https://www.amazon.fr/s?k=cable+displayport+vers+hdmi+2.0+tress%C3%A9+4k60&tag=${AMAZON_STORE_ID}`,
            priceEstAmazon: 10.99,
            priceEstRecon: 7.9,
            priceEstAli: 5.5,
          },
          {
            id: "cable-rj45-cat6a-braided",
            name: "Câble Ethernet Cat 6A Snagless Gigabit (3 m)",
            category: "network",
            specs: "Cat 6A blindé SSTP · Connectique protégée · Bande passante 500 MHz",
            description: "Connexion filaire stable pour le streaming réseau secondaire et la télécommande mobile locale.",
            asin: "B01F346Q34",
            amazonUrl: `https://www.amazon.fr/s?k=cable+ethernet+cat+6a+3m&tag=${AMAZON_STORE_ID}`,
            priceEstAmazon: 7.99,
            priceEstRecon: 5.5,
            priceEstAli: 3.5,
          },
          {
            id: "remote-24g-pro-airmouse",
            name: "Télécommande Gyroscopique Régie 2.4 GHz USB",
            category: "control",
            specs: "Air-mouse gyroscopique · Dongle USB 2.4 GHz sans configuration · Rétroéclairage",
            description: "Aspect professionnel studio : permet de piloter la régie au pointeur virtuel ou aux flèches directionnelles depuis l'autre bout de la salle.",
            asin: "B07RRTYHWK",
            amazonUrl: `https://www.amazon.fr/s?k=t%C3%A9l%C3%A9commande+air+mouse+gyroscopique+usb+2.4ghz&tag=${AMAZON_STORE_ID}`,
            priceEstAmazon: 15.9,
            priceEstRecon: 12.9,
            priceEstAli: 7.9,
          },
        ],
      },
      pro: {
        id: "pro",
        labelFr: "Pro",
        labelEn: "Pro",
        headlineFr: "HP ProDesk 400 Mini / Dell Micro — Haute cadence & multi-écrans",
        headlineEn: "HP ProDesk 400 Mini / Dell Micro — High performance & multi-display",
        summaryFr: "Processeur Intel Core i5 6 cœurs et double sortie vidéo pour alimenter simultanément grand écran et pupitre coach.",
        summaryEn: "Intel Core i5 6-core CPU with dual video output to drive studio big screen and coach desk simultaneously.",
        powerWatts: "10W - 25W",
        resolution: "Double affichage 4K 60fps",
        items: [
          {
            id: "hp-prodesk-i5",
            name: "HP ProDesk 400 Desktop Mini (Intel Core i5 / 16 Go DDR4 / 256 Go NVMe)",
            category: "uc",
            specs: "6 cœurs physiques · Intel UHD 630 · 16 Go RAM · Double sortie DisplayPort + HDMI",
            description: "Station compacte professionnelle reconditionnée certifiée. Puissance de calcul abondante pour réencodage vidéo instantané et double écran indépendant.",
            asin: "B07P8WCR7R",
            amazonUrl: `https://www.amazon.fr/s?k=HP+ProDesk+400+Desktop+Mini+i5&tag=${AMAZON_STORE_ID}`,
            reconditionneUrl: "https://www.ebay.fr/sch/i.html?_nkw=HP+ProDesk+400+Mini+i5",
            aliexpressUrl: "https://fr.aliexpress.com/wholesale?SearchText=HP+ProDesk+400+Mini+i5",
            priceEstAmazon: 169,
            priceEstRecon: 125,
            priceEstAli: 140,
          },
          {
            id: "pack-dual-cables-dp-hdmi",
            name: "Lot de 2 Câbles DisplayPort vers HDMI 2.0 4K 60Hz (2 m)",
            category: "cable-video",
            specs: "2x Câbles 4K 60Hz · Prises plaquées or · Double flux vidéo indépendant",
            description: "Permet de relier à la fois l'écran géant de diffusion (`/kiosk`) et le moniteur de contrôle régie du coach (`/coach`).",
            asin: "B09W2Z87T9",
            amazonUrl: `https://www.amazon.fr/s?k=lot+2+cables+displayport+hdmi+4k60&tag=${AMAZON_STORE_ID}`,
            priceEstAmazon: 16.99,
            priceEstRecon: 12.5,
            priceEstAli: 8.9,
          },
          {
            id: "cable-cat7-shielded",
            name: "Câble Réseau Cat 7 Gigabit 10 Gbps SFTP (5 m)",
            category: "network",
            specs: "Cat 7 double blindage SFTP · Débit 10 000 Mbps · 600 MHz",
            description: "Blindage maximal contre les rayonnements électromagnétiques des moteurs de tapis de course et amplis audio.",
            asin: "B00V310JMC",
            amazonUrl: `https://www.amazon.fr/s?k=cable+ethernet+cat+7+blind%C3%A9+5m&tag=${AMAZON_STORE_ID}`,
            priceEstAmazon: 9.99,
            priceEstRecon: 7.9,
            priceEstAli: 5.2,
          },
          {
            id: "remote-24g-keyboard-pro",
            name: "Télécommande Double Face Studio 2.4 GHz avec Clavier Intégré",
            category: "control",
            specs: "Face avant boutons régie multimédia · Face arrière clavier complet · Dongle USB",
            description: "Solution complète pour le personnel : télécommande à une main en cours, clavier AZERTY/QWERTY au dos pour renommer les séances ou taper les réglages.",
            asin: "B00ZGXU4EK",
            amazonUrl: `https://www.amazon.fr/s?k=t%C3%A9l%C3%A9commande+clavier+sans+fil+usb+2.4ghz&tag=${AMAZON_STORE_ID}`,
            priceEstAmazon: 17.9,
            priceEstRecon: 14.5,
            priceEstAli: 9.5,
          },
        ],
      },
    },
  },

  // ---------------------------------------------------------------------------
  // B. WINDOWS DESKTOP (Polyvalence & Performance Mini PC)
  // ---------------------------------------------------------------------------
  windows: {
    os: "windows",
    titleFr: "Windows Desktop & Mini PC",
    titleEn: "Windows Desktop & Mini PC",
    subtitleFr: "Mini PC Intel Alder Lake & Ryzen neufs, prêts à l'emploi avec Windows 11 Pro",
    subtitleEn: "Brand new Intel Alder Lake & Ryzen mini PCs, out of the box with Windows 11 Pro",
    targetFr: "Clubs souhaitant une machine Windows polyvalente, mur LED haute résolution ou TV 4K",
    targetEn: "Clubs seeking a versatile Windows machine, high-res LED wall or 4K studio TV",
    defaultTier: "recommande",
    tiers: {
      essentiel: {
        id: "essentiel",
        labelFr: "Essentiel",
        labelEn: "Essential",
        headlineFr: "Mini PC Intel N95 / N97 — L'entrée de gamme Windows moderne",
        headlineEn: "Intel N95 / N97 Mini PC — Modern Windows entry-level",
        summaryFr: "Châssis compact neuf avec Windows 11 Pro préinstallé, double sortie HDMI 4K.",
        summaryEn: "Brand new compact unit with Windows 11 Pro preloaded, dual 4K HDMI output.",
        powerWatts: "8W - 15W",
        resolution: "1080p & 4K 60fps",
        items: [
          {
            id: "mini-pc-n95",
            name: "Mini PC Intel N95 / N97 (8 Go RAM / 256 Go SSD / Windows 11 Pro)",
            category: "uc",
            specs: "4 cœurs jusqu'à 3.4 GHz · Double port HDMI 4K · Wi-Fi 5 + Bluetooth",
            description: "Machine neuve ultra-compacte (10 cm x 10 cm), consommation maîtrisée, fixable derrière un téléviseur avec support VESA inclus.",
            asin: "B0CP1Y8D9J",
            amazonUrl: `https://www.amazon.fr/s?k=mini+pc+intel+n95+windows+11+pro&tag=${AMAZON_STORE_ID}`,
            aliexpressUrl: "https://fr.aliexpress.com/wholesale?SearchText=mini+pc+intel+n95",
            priceEstAmazon: 139,
            priceEstRecon: 119,
            priceEstAli: 99,
          },
          {
            id: "cable-hdmi-20-braided",
            name: "Câble HDMI 2.0 Tressé Haute Vitesse 18 Gbps (2 m)",
            category: "cable-video",
            specs: "HDMI mâle-mâle · 4K 60Hz · Connecteurs plaqués or",
            description: "Câble vidéo universel pour relier le mini PC à l'écran HDMI du studio.",
            asin: "B004XJCLP8",
            amazonUrl: `https://www.amazon.fr/s?k=cable+hdmi+2.0+tress%C3%A9+4k60&tag=${AMAZON_STORE_ID}`,
            priceEstAmazon: 7.99,
            priceEstRecon: 5.9,
            priceEstAli: 3.5,
          },
          {
            id: "cable-rj45-cat6-2m",
            name: "Câble Ethernet Cat 6 Snagless (2 m)",
            category: "network",
            specs: "RJ45 Gigabit · Contacts plaqués or · Zéro configuration",
            description: "Connexion filaire directe au routeur de la salle.",
            asin: "B00QV1F19W",
            amazonUrl: `https://www.amazon.fr/s?k=cable+ethernet+cat+6+2m&tag=${AMAZON_STORE_ID}`,
            priceEstAmazon: 6.5,
            priceEstRecon: 4.5,
            priceEstAli: 2.8,
          },
          {
            id: "remote-24g-windows",
            name: "Télécommande Multimédia Régie 2.4 GHz avec Récepteur USB",
            category: "control",
            specs: "Touches volume, play/pause, suivant/précédent, mode veille · Dongle USB",
            description: "Prise en main immédiate par tout coach sans apprentissage. Dongle USB reconnu sous Windows sans aucun pilote additionnel.",
            asin: "B07P852V6C",
            amazonUrl: `https://www.amazon.fr/s?k=t%C3%A9l%C3%A9commande+pr%C3%A9sentation+usb+2.4ghz&tag=${AMAZON_STORE_ID}`,
            priceEstAmazon: 12.9,
            priceEstRecon: 9.9,
            priceEstAli: 5.5,
          },
        ],
      },
      recommande: {
        id: "recommande",
        labelFr: "Recommandé",
        labelEn: "Recommended",
        badgeFr: "Best-Seller",
        badgeEn: "Top Choice",
        isPopular: true,
        headlineFr: "Beelink S12 Pro Intel N100 16 Go DDR5 — Le silence et la modernité",
        headlineEn: "Beelink S12 Pro Intel N100 16 GB DDR5 — Silent & modern",
        summaryFr: "Processeur Intel Alder Lake-N N100 dernière génération, 16 Go de RAM DDR5 et SSD NVMe rapide.",
        summaryEn: "Latest generation Intel Alder Lake-N N100 processor, 16 GB DDR5 RAM and fast NVMe storage.",
        powerWatts: "6W - 15W",
        resolution: "Double 4K 60fps",
        items: [
          {
            id: "beelink-s12-pro-n100",
            name: "Beelink S12 Pro (Intel N100 / 16 Go RAM DDR5 / 500 Go SSD NVMe)",
            category: "uc",
            specs: "4 cœurs 3.4 GHz · Intel UHD Graphics 24 EUs · Wi-Fi 6 AX · Double sortie HDMI 4K60",
            description: "La référence du mini PC compact : ventilateur quasi inaudible (<28 dB), 16 Go de DDR5 pour naviguer dans l'interface sans latence, Windows 11 Pro officiel.",
            asin: "B0BVLS7ZHP",
            amazonUrl: `https://www.amazon.fr/s?k=Beelink+S12+Pro+Intel+N100+16GB&tag=${AMAZON_STORE_ID}`,
            aliexpressUrl: "https://fr.aliexpress.com/wholesale?SearchText=Beelink+S12+Pro+N100",
            priceEstAmazon: 189,
            priceEstRecon: 155,
            priceEstAli: 139,
          },
          {
            id: "cable-hdmi-21-48gbps",
            name: "Câble HDMI 2.1 Ultra High Speed 48 Gbps Certifié (2 m)",
            category: "cable-video",
            specs: "Bande passante 48 Gbps · 4K 120Hz / 8K 60Hz · eARC · Triple blindage",
            description: "Garantit zéro décrochage d'image sur les téléviseurs 4K de studio récents, élimine les coupures de signal.",
            asin: "B08M9HHPW3",
            amazonUrl: `https://www.amazon.fr/s?k=cable+hdmi+2.1+ultra+high+speed+certifie&tag=${AMAZON_STORE_ID}`,
            priceEstAmazon: 10.99,
            priceEstRecon: 8.9,
            priceEstAli: 5.9,
          },
          {
            id: "cable-rj45-cat6a-3m",
            name: "Câble Réseau RJ45 Cat 6A Blindé SSTP (3 m)",
            category: "network",
            specs: "Cat 6A · 10 Gbps ready · Blindage paire par paire",
            description: "Évite toute perturbation réseau causée par les équipements électriques du studio.",
            asin: "B01F346Q34",
            amazonUrl: `https://www.amazon.fr/s?k=cable+ethernet+cat+6a+3m&tag=${AMAZON_STORE_ID}`,
            priceEstAmazon: 7.99,
            priceEstRecon: 5.5,
            priceEstAli: 3.5,
          },
          {
            id: "remote-24g-pro-airmouse-win",
            name: "Télécommande Gyroscopique Régie 2.4 GHz avec Dongle USB",
            category: "control",
            specs: "Pointeur air-mouse · Flèches de navigation · Rétroéclairage des touches",
            description: "Aspect professionnel studio : contrôle de la console Bobine et du kiosque à distance avec précision fluide.",
            asin: "B07RRTYHWK",
            amazonUrl: `https://www.amazon.fr/s?k=t%C3%A9l%C3%A9commande+air+mouse+gyroscopique+usb+2.4ghz&tag=${AMAZON_STORE_ID}`,
            priceEstAmazon: 15.9,
            priceEstRecon: 12.9,
            priceEstAli: 7.9,
          },
        ],
      },
      pro: {
        id: "pro",
        labelFr: "Pro",
        labelEn: "Pro",
        headlineFr: "Mini PC AMD Ryzen 5 / 7 — Puissance graphique & triple affichage",
        headlineEn: "AMD Ryzen 5 / 7 Mini PC — Graphics power & triple display",
        summaryFr: "Architecture multi-cœurs 6/12 threads, cœur graphique Radeon pour les installations avec murs LED ou multiples écrans.",
        summaryEn: "6/12 threads multi-core architecture, Radeon graphics for video walls or multi-screen setups.",
        powerWatts: "15W - 35W",
        resolution: "Triple 4K 60fps",
        items: [
          {
            id: "minisforum-ryzen5",
            name: "Mini PC AMD Ryzen 5 (16 Go DDR5 / 512 Go NVMe / Windows 11 Pro)",
            category: "uc",
            specs: "6 cœurs 12 threads · AMD Radeon Graphics · Triple sortie vidéo (HDMI + DP + USB-C)",
            description: "Puissance de calcul continue pour les studios premium : réencodage matériel instantané, administration fluide même pendant la diffusion intensive.",
            asin: "B0C77GZQ54",
            amazonUrl: `https://www.amazon.fr/s?k=mini+pc+amd+ryzen+5+windows+11+pro&tag=${AMAZON_STORE_ID}`,
            aliexpressUrl: "https://fr.aliexpress.com/wholesale?SearchText=mini+pc+amd+ryzen+5",
            priceEstAmazon: 299,
            priceEstRecon: 239,
            priceEstAli: 219,
          },
          {
            id: "cable-hdmi-21-pro",
            name: "Câble HDMI 2.1 Renforcé Tressé 48 Gbps (3 m)",
            category: "cable-video",
            specs: "HDMI 2.1 certifié · Gaine tressée épaisse · Connecteurs aluminium usiné",
            description: "Conçu pour les longueurs de câbles en studio et les écrans 4K professionnels.",
            asin: "B08M9HHPW3",
            amazonUrl: `https://www.amazon.fr/s?k=cable+hdmi+2.1+ultra+high+speed+certifie&tag=${AMAZON_STORE_ID}`,
            priceEstAmazon: 12.99,
            priceEstRecon: 9.9,
            priceEstAli: 6.9,
          },
          {
            id: "cable-cat7-shielded-pro",
            name: "Câble Réseau Cat 7 SFTP Blindé Professionnel (5 m)",
            category: "network",
            specs: "Cat 7 blindé · Prises métal blindées · 10 Gbps",
            description: "Transmission réseau irréprochable sur longue distance studio.",
            asin: "B00V310JMC",
            amazonUrl: `https://www.amazon.fr/s?k=cable+ethernet+cat+7+blind%C3%A9+5m&tag=${AMAZON_STORE_ID}`,
            priceEstAmazon: 9.99,
            priceEstRecon: 7.9,
            priceEstAli: 5.2,
          },
          {
            id: "remote-24g-keyboard-pro-win",
            name: "Télécommande Double Face Studio 2.4 GHz avec Clavier",
            category: "control",
            specs: "Face avant multimédia · Face arrière clavier complet · Dongle USB",
            description: "L'outil tout-en-un du coach pour piloter la séance et saisir les textes sans brancher d'autre périphérique.",
            asin: "B00ZGXU4EK",
            amazonUrl: `https://www.amazon.fr/s?k=t%C3%A9l%C3%A9commande+clavier+sans+fil+usb+2.4ghz&tag=${AMAZON_STORE_ID}`,
            priceEstAmazon: 17.9,
            priceEstRecon: 14.5,
            priceEstAli: 9.5,
          },
        ],
      },
    },
  },

  // ---------------------------------------------------------------------------
  // C. MACOS DESKTOP & STUDIO (MacBook Clamshell & Mac Mini)
  // ---------------------------------------------------------------------------
  macos: {
    os: "macos",
    titleFr: "macOS Studio & Mac Mini",
    titleEn: "macOS Studio & Mac Mini",
    subtitleFr: "Exploitez votre Mac existant en mode bureau fermé ou déployez un Mac Mini dédié",
    subtitleEn: "Use your existing Mac in clamshell mode or deploy a dedicated Mac Mini",
    targetFr: "Coachs équipés en MacBook Air/Pro, salles adeptes de l'écosystème Apple Silicon",
    targetEn: "Coaches with MacBook Air/Pro, gyms committed to the Apple Silicon ecosystem",
    defaultTier: "recommande",
    tiers: {
      essentiel: {
        id: "essentiel",
        labelFr: "Essentiel",
        labelEn: "Essential",
        headlineFr: "Pack Clamshell MacBook Coach — Utilisez votre ordinateur portable",
        headlineEn: "MacBook Coach Clamshell Pack — Leverage your existing laptop",
        summaryFr: "Kit de connectique pour brancher le MacBook du coach sur l'écran du studio tout en le rechargeant en continu.",
        summaryEn: "Connectivity kit to plug coach's MacBook into studio display while charging continuously.",
        powerWatts: "5W - 15W",
        resolution: "4K 60fps",
        items: [
          {
            id: "hub-usbc-hdmi-pd",
            name: "Hub Multiport USB-C vers HDMI 4K 60Hz avec Power Delivery 100W",
            category: "power-hub",
            specs: "Entrée USB-C · Sortie HDMI 4K 60Hz · Port de charge USB-C PD 100W · Ports USB 3.0",
            description: "Permet de brancher le câble d'alimentation du Mac sur le hub : un seul câble USB-C est relié au MacBook pour la vidéo et la recharge continue.",
            asin: "B0874HH4ZZ",
            amazonUrl: `https://www.amazon.fr/s?k=hub+usb+c+hdmi+4k+60hz+power+delivery+100w&tag=${AMAZON_STORE_ID}`,
            priceEstAmazon: 27.9,
            priceEstRecon: 21.9,
            priceEstAli: 15.9,
          },
          {
            id: "cable-hdmi-20-mac",
            name: "Câble HDMI 2.0 Tressé Haute Vitesse (2 m)",
            category: "cable-video",
            specs: "HDMI mâle-mâle · 4K 60Hz · Blindage tressé",
            description: "Relie le hub USB-C à la prise HDMI du grand écran ou du vidéoprojecteur.",
            asin: "B004XJCLP8",
            amazonUrl: `https://www.amazon.fr/s?k=cable+hdmi+2.0+tress%C3%A9+4k60&tag=${AMAZON_STORE_ID}`,
            priceEstAmazon: 7.99,
            priceEstRecon: 5.9,
            priceEstAli: 3.5,
          },
          {
            id: "remote-24g-mac",
            name: "Télécommande de Présentation Multimédia 2.4 GHz USB",
            category: "control",
            specs: "Dongle USB compatible macOS sans pilote · Portée 15 m",
            description: "Permet au coach de lancer les cours ou de mettre en pause depuis le vélo sans toucher au Mac.",
            asin: "B07P852V6C",
            amazonUrl: `https://www.amazon.fr/s?k=t%C3%A9l%C3%A9commande+pr%C3%A9sentation+usb+2.4ghz&tag=${AMAZON_STORE_ID}`,
            priceEstAmazon: 11.9,
            priceEstRecon: 9.9,
            priceEstAli: 5.5,
          },
        ],
      },
      recommande: {
        id: "recommande",
        labelFr: "Recommandé",
        labelEn: "Recommended",
        badgeFr: "Élégance & Silence",
        badgeEn: "Sleek & Silent",
        isPopular: true,
        headlineFr: "Mac Mini M2 / M4 Régie Dédiée — Le silence absolu Apple Silicon",
        headlineEn: "Dedicated Mac Mini M2 / M4 — Pure Apple Silicon silence",
        summaryFr: "Poste fixe compact dissimulé en régie, décodage matériel VideoToolbox et consommation de quelques Watts.",
        summaryEn: "Compact stationary unit tucked away in the control room, VideoToolbox hardware decoding, minimal power.",
        powerWatts: "4W - 12W",
        resolution: "4K 60fps natif",
        items: [
          {
            id: "mac-mini-m2",
            name: "Apple Mac Mini (Puce M2 ou M4 / 8-16 Go RAM / 256 Go SSD)",
            category: "uc",
            specs: "CPU 8 cœurs · GPU 10 cœurs · Moteur multimédia VideoToolbox · Port Ethernet Gigabit natif",
            description: "Régie haut de gamme ultra-compacte : silence absolu, gestion de veille intelligente native Bobine (`caffeinate`), fluidité parfaite.",
            asin: "B0BSHF7LPS",
            amazonUrl: `https://www.amazon.fr/s?k=Apple+Mac+Mini+M2&tag=${AMAZON_STORE_ID}`,
            priceEstAmazon: 599,
            priceEstRecon: 420,
            priceEstAli: 450,
          },
          {
            id: "cable-hdmi-21-macmini",
            name: "Câble HDMI 2.1 Ultra High Speed 48 Gbps (2 m)",
            category: "cable-video",
            specs: "HDMI 2.1 certifié · 4K 120Hz / 8K · Triple blindage",
            description: "Connecté directement à la sortie HDMI native du Mac Mini pour une transmission sans compression.",
            asin: "B08M9HHPW3",
            amazonUrl: `https://www.amazon.fr/s?k=cable+hdmi+2.1+ultra+high+speed+certifie&tag=${AMAZON_STORE_ID}`,
            priceEstAmazon: 10.99,
            priceEstRecon: 8.9,
            priceEstAli: 5.9,
          },
          {
            id: "cable-rj45-cat6a-mac",
            name: "Câble Réseau Ethernet Cat 6A Blindé (3 m)",
            category: "network",
            specs: "Cat 6A SFTP · Gigabit 1000 Mbps · Contacts plaqués or",
            description: "Relié au port Ethernet natif du Mac Mini pour sécuriser la liaison réseau du studio.",
            asin: "B01F346Q34",
            amazonUrl: `https://www.amazon.fr/s?k=cable+ethernet+cat+6a+3m&tag=${AMAZON_STORE_ID}`,
            priceEstAmazon: 7.99,
            priceEstRecon: 5.5,
            priceEstAli: 3.5,
          },
          {
            id: "remote-24g-airmouse-mac",
            name: "Télécommande Gyroscopique Régie 2.4 GHz avec Dongle USB",
            category: "control",
            specs: "Air-mouse gyroscopique · Dongle USB compatible macOS · Rétroéclairage",
            description: "Navigation précise à distance sur la console Bobine sans avoir à brancher souris ou clavier physique.",
            asin: "B07RRTYHWK",
            amazonUrl: `https://www.amazon.fr/s?k=t%C3%A9l%C3%A9commande+air+mouse+gyroscopique+usb+2.4ghz&tag=${AMAZON_STORE_ID}`,
            priceEstAmazon: 15.9,
            priceEstRecon: 12.9,
            priceEstAli: 7.9,
          },
        ],
      },
      pro: {
        id: "pro",
        labelFr: "Pro",
        labelEn: "Pro",
        headlineFr: "Station Mac Studio & Dock Thunderbolt 4 Aluminium",
        headlineEn: "Mac Studio & Aluminum Thunderbolt 4 Dock Setup",
        summaryFr: "Support vertical ventilé en aluminium pour MacBook fermé et dock Thunderbolt 4 multi-écrans haute fidélité.",
        summaryEn: "Vertical aluminum stand for closed clamshell MacBook and high-fidelity multi-screen Thunderbolt 4 dock.",
        powerWatts: "10W - 25W",
        resolution: "Double 4K 60fps / 8K",
        items: [
          {
            id: "dock-thunderbolt4-pro",
            name: "Dock Hub Thunderbolt 4 / USB4 Aluminium avec Charge 100W PD",
            category: "power-hub",
            specs: "Bande passante 40 Gbps · Double sortie vidéo 4K60 · Port Ethernet Gigabit · Port USB-C PD 100W",
            description: "Châssis monobloc en aluminium dissipateur de chaleur : connecte grand écran, réseau câblé, télécommande et charge rapide en un seul branchement USB-C.",
            asin: "B09B2SFQ3C",
            amazonUrl: `https://www.amazon.fr/s?k=dock+thunderbolt+4+usb4+hdmi+ethernet+pd100w&tag=${AMAZON_STORE_ID}`,
            priceEstAmazon: 69,
            priceEstRecon: 49,
            priceEstAli: 39,
          },
          {
            id: "stand-vertical-macbook",
            name: "Support Vertical Réglable en Aluminium pour MacBook (Mode Clamshell)",
            category: "mount",
            specs: "Aluminium anodisé · Patins silicone anti-rayures · Écartement ajustable à vis",
            description: "Maintient le MacBook fermé à la verticale : gain de place absolu sur le bureau de régie et circulation d'air optimale.",
            asin: "B0892D5FGB",
            amazonUrl: `https://www.amazon.fr/s?k=support+vertical+macbook+aluminium&tag=${AMAZON_STORE_ID}`,
            priceEstAmazon: 19.9,
            priceEstRecon: 15.9,
            priceEstAli: 11.5,
          },
          {
            id: "cable-tb4-braided",
            name: "Câble Thunderbolt 4 / USB-C 40 Gbps Vidéo 8K / Charge 100W (1 m)",
            category: "cable-video",
            specs: "Certifié Thunderbolt 4 · Débit 40 Gbps · Blindage renforcé · Prises métal",
            description: "Câble de liaison entre le Mac et le dock pour transfert vidéo ultra-haute vitesse sans aucune latence.",
            asin: "B094MKV81N",
            amazonUrl: `https://www.amazon.fr/s?k=cable+thunderbolt+4+100w+40gbps&tag=${AMAZON_STORE_ID}`,
            priceEstAmazon: 18.9,
            priceEstRecon: 14.5,
            priceEstAli: 9.9,
          },
          {
            id: "remote-24g-keyboard-mac-pro",
            name: "Télécommande Double Face Studio 2.4 GHz avec Clavier",
            category: "control",
            specs: "Face avant multimédia · Face arrière clavier complet · Dongle USB",
            description: "Contrôle à distance pratique pour piloter les volumes et naviguer dans les listes de lecture audio coach.",
            asin: "B00ZGXU4EK",
            amazonUrl: `https://www.amazon.fr/s?k=t%C3%A9l%C3%A9commande+clavier+sans+fil+usb+2.4ghz&tag=${AMAZON_STORE_ID}`,
            priceEstAmazon: 17.9,
            priceEstRecon: 14.5,
            priceEstAli: 9.5,
          },
        ],
      },
    },
  },

  // ---------------------------------------------------------------------------
  // D. ANDROID TACTILE & MOBILITÉ (Tablette Pupitre & Sortie Vidéo HDMI)
  // ---------------------------------------------------------------------------
  android: {
    os: "android",
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
        headlineFr: "Pack Borne Murale Tablette — Affichage autonome & navigation tactile",
        headlineEn: "Wall Mount Tablet Pack — Autonomous display & touch browsing",
        summaryFr: "Tablette Android avec fixation murale antivol sécurisée pour consultation en accès libre ou pupitre de salle.",
        summaryEn: "Android tablet with secure anti-theft wall mount for self-service kiosk or room desk.",
        powerWatts: "5W - 10W",
        resolution: "Écran tactile 1080p",
        items: [
          {
            id: "tablet-galaxy-a9-plus",
            name: "Tablette Samsung Galaxy Tab A9+ 11\" (ou Lenovo Tab M11)",
            category: "uc",
            specs: "Écran 11 pouces 90Hz · Processeur Snapdragon 8 cœurs · Wi-Fi rapide · Android 14+",
            description: "Tablette fluide et lumineuse idéale pour faire tourner Bobine en mode autonome ou borne tactile en accès libre.",
            asin: "B0CJ2B8K6Z",
            amazonUrl: `https://www.amazon.fr/s?k=Samsung+Galaxy+Tab+A9+Plus+11&tag=${AMAZON_STORE_ID}`,
            aliexpressUrl: "https://fr.aliexpress.com/wholesale?SearchText=Samsung+Galaxy+Tab+A9+Plus",
            priceEstAmazon: 169,
            priceEstRecon: 129,
            priceEstAli: 135,
          },
          {
            id: "wall-mount-tablet-lock",
            name: "Support Mural Antivol Sécurisé en Aluminium à Clé pour Tablette 10-11\"",
            category: "mount",
            specs: "Châssis aluminium renforcé · Verrouillage par clé physique antivol · Compatible VESA 75/100 · Passage de câble dissimulé",
            description: "Fixation murale sécurisée professionnelle : protège la tablette contre le vol dans la salle tout en laissant l'écran tactile accessible et le câble d'alimentation protégé.",
            asin: "B07P853XYZ",
            amazonUrl: `https://www.amazon.fr/s?k=support+mural+antivol+tablette+10+11+pouces+vesa&tag=${AMAZON_STORE_ID}`,
            priceEstAmazon: 34.9,
            priceEstRecon: 26.9,
            priceEstAli: 19.9,
          },
          {
            id: "cable-usbc-power-fast",
            name: "Câble USB-C Tressé Coudé 90° et Chargeur Rapide 25W",
            category: "power-hub",
            specs: "Câble coudé discret 90° (2 m) · Alimentation continue sécurisée 24/7",
            description: "La fiche coudée se loge parfaitement dans l'encadrement du support mural sans tordre le connecteur.",
            asin: "B0892DXYZ1",
            amazonUrl: `https://www.amazon.fr/s?k=cable+usb+c+coude+90+degres+tresse+chargeur&tag=${AMAZON_STORE_ID}`,
            priceEstAmazon: 14.9,
            priceEstRecon: 11.9,
            priceEstAli: 7.5,
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
        headlineFr: "Xiaomi Pad 6/7 + Hub HDMI Power Delivery — Pupitre tactile & projection TV",
        headlineEn: "Xiaomi Pad 6/7 + HDMI Power Delivery Hub — Touch desk & TV projection",
        summaryFr: "La tablette avec sortie vidéo DisplayPort Alt Mode native : régie coach tactile au doigt et diffusion simultanée sur le grand écran de la salle.",
        summaryEn: "Tablet with native DisplayPort Alt Mode video output: touch coach desk and simultaneous gym TV broadcast.",
        powerWatts: "8W - 18W",
        resolution: "Écran 2.8K 144Hz + HDMI 4K 60fps",
        items: [
          {
            id: "xiaomi-pad-6",
            name: "Tablette Xiaomi Pad 6 ou Pad 7 (Snapdragon 870 / Écran 11\" 144Hz 2.8K)",
            category: "uc",
            specs: "Snapdragon haute performance · Port USB-C 3.2 avec sortie DisplayPort Alt Mode native · 6-8 Go RAM · Finition métal",
            description: "L'une des rares tablettes à ce tarif dotée d'une vraie sortie vidéo filaire USB 3.2 : permet d'afficher la régie `/coach` sur la tablette et d'envoyer le flux plein écran `/cinema` sur le vidéoprojecteur.",
            asin: "B0C77GYZ89",
            amazonUrl: `https://www.amazon.fr/s?k=Xiaomi+Pad+6+128GB&tag=${AMAZON_STORE_ID}`,
            aliexpressUrl: "https://fr.aliexpress.com/wholesale?SearchText=Xiaomi+Pad+6",
            priceEstAmazon: 289,
            priceEstRecon: 219,
            priceEstAli: 235,
          },
          {
            id: "hub-usbc-active-hdmi-pd",
            name: "Hub Adaptateur USB-C Actif vers HDMI 4K 60Hz avec Charge Continue PD 100W",
            category: "power-hub",
            specs: "Port USB-C mâle vers HDMI 4K 60Hz + Port USB-C Power Delivery 100W + Port USB 3.0",
            description: "Élément clé : permet d'alimenter la tablette en continu sur le secteur tout en transmettant la vidéo en direct sans aucune latence.",
            asin: "B0874HH4ZZ",
            amazonUrl: `https://www.amazon.fr/s?k=hub+usb+c+hdmi+4k+60hz+power+delivery+100w&tag=${AMAZON_STORE_ID}`,
            priceEstAmazon: 27.9,
            priceEstRecon: 21.9,
            priceEstAli: 15.9,
          },
          {
            id: "cable-hdmi-20-slim",
            name: "Câble HDMI 2.0 Tressé Haute Vitesse (3 m)",
            category: "cable-video",
            specs: "HDMI 2.0 4K 60Hz · Gaine tressée flexible · Zéro parasite",
            description: "Câble fin et souple parfait pour relier le pupitre coach au projecteur ou à la prise murale.",
            asin: "B004XJCLP8",
            amazonUrl: `https://www.amazon.fr/s?k=cable+hdmi+2.0+tress%C3%A9+4k60&tag=${AMAZON_STORE_ID}`,
            priceEstAmazon: 8.99,
            priceEstRecon: 6.9,
            priceEstAli: 3.9,
          },
          {
            id: "mount-wall-or-bike-pro",
            name: "Support Mural Orientable & Fixation Guidon Vélo Cycling en Aluminium",
            category: "mount",
            specs: "Double fixation : platine murale VESA ou pince guidon 22-38 mm · Mâchoires silicone anti-vibration · Rotation 360°",
            description: "Maintien ultra-stable sur guidon de vélo RPM ou sur bras mural en studio : la tablette ne vibre pas pendant les séances intenses.",
            asin: "B07PBX9Q88",
            amazonUrl: `https://www.amazon.fr/s?k=support+tablette+guidon+velo+cycling+aluminium&tag=${AMAZON_STORE_ID}`,
            priceEstAmazon: 25.9,
            priceEstRecon: 19.9,
            priceEstAli: 13.5,
          },
        ],
      },
      pro: {
        id: "pro",
        labelFr: "Pro",
        labelEn: "Pro",
        headlineFr: "Station Tablette Pro Étanche & Réseau Câblé RJ45",
        headlineEn: "Waterproof Pro Tablet Desk & Wired RJ45 Ethernet",
        summaryFr: "Tablette étanche IP68, hub multiport intégrant un port réseau RJ45 filaire pour éliminer tout risque Wi-Fi, et fixation antivol renforcée.",
        summaryEn: "IP68 water-resistant tablet, multiport dock with wired RJ45 Ethernet to eliminate Wi-Fi drops, heavy-duty anti-theft mount.",
        powerWatts: "8W - 20W",
        resolution: "Écran Pro 2.5K + HDMI 4K 60fps",
        items: [
          {
            id: "samsung-tab-s9-fe",
            name: "Samsung Galaxy Tab S9 FE 11\" (Étanche IP68 / Stylet S-Pen inclus)",
            category: "uc",
            specs: "Certification IP68 eau et sueur · Écran 90Hz · Sortie vidéo USB-C · Stylet tactile pour coach",
            description: "Résiste aux éclaboussures d'eau et à la transpiration en studio de cycling. Autonomie record et solidité renforcée.",
            asin: "B0CHWR89GZ",
            amazonUrl: `https://www.amazon.fr/s?k=Samsung+Galaxy+Tab+S9+FE+11&tag=${AMAZON_STORE_ID}`,
            priceEstAmazon: 429,
            priceEstRecon: 339,
            priceEstAli: 350,
          },
          {
            id: "hub-usbc-ethernet-hdmi-pd",
            name: "Hub Multiport USB-C avec Ethernet RJ45 Gigabit + HDMI 4K60 + PD 100W",
            category: "power-hub",
            specs: "Port Ethernet RJ45 1000 Mbps · Sortie HDMI 4K 60Hz · Port charge continue PD 100W",
            description: "Apporte une connexion réseau filaire stable à la tablette : la synchronisation des cours et de la musique reste infaillible même en cas de panne Wi-Fi.",
            asin: "B08C9H3NZZ",
            amazonUrl: `https://www.amazon.fr/s?k=hub+usb+c+ethernet+rj45+hdmi+4k60+pd100w&tag=${AMAZON_STORE_ID}`,
            priceEstAmazon: 32.9,
            priceEstRecon: 25.9,
            priceEstAli: 18.5,
          },
          {
            id: "cable-rj45-cat6a-android",
            name: "Câble Réseau Cat 6A Blindé SSTP (3 m)",
            category: "network",
            specs: "Cat 6A Gigabit · Contacts dorés · Protection anti-pliure",
            description: "Raccordement réseau direct vers la baie ou la prise murale.",
            asin: "B01F346Q34",
            amazonUrl: `https://www.amazon.fr/s?k=cable+ethernet+cat+6a+3m&tag=${AMAZON_STORE_ID}`,
            priceEstAmazon: 7.99,
            priceEstRecon: 5.5,
            priceEstAli: 3.5,
          },
          {
            id: "wall-mount-articulated-lock",
            name: "Bras Mural Articulé Antivol VESA en Métal avec Verrouillage à Clé",
            category: "mount",
            specs: "Double bras articulé métal · Verrou à clé pour tablette · Passe-câbles intégré",
            description: "Permet d'orienter l'écran vers les vélos ou vers l'estrade du coach, puis de le replier à plat contre le mur.",
            asin: "B07P853XYZ",
            amazonUrl: `https://www.amazon.fr/s?k=bras+mural+articule+antivol+tablette+vesa&tag=${AMAZON_STORE_ID}`,
            priceEstAmazon: 42.9,
            priceEstRecon: 34.9,
            priceEstAli: 24.9,
          },
        ],
      },
    },
  },
};

// =============================================================================
// 2. ACCESSOIRES & CONNECTIQUE À L'UNITÉ
// =============================================================================

export const STANDALONE_ACCESSORIES: StandaloneAccessory[] = [
  {
    id: "acc-dp-hdmi",
    nameFr: "Câble DisplayPort vers HDMI 2.0 4K 60Hz",
    nameEn: "DisplayPort to HDMI 2.0 4K 60Hz Cable",
    categoryFr: "Vidéo",
    categoryEn: "Video",
    specs: "DP mâle vers HDMI mâle · Longueur 2 m · Tressé blindé",
    descriptionFr: "Idéal pour relier le Dell Wyse 5070 ou tout mini PC pro à la prise HDMI du projecteur ou de la TV studio.",
    descriptionEn: "Ideal to connect Dell Wyse 5070 or any pro mini PC to studio TV or projector HDMI input.",
    asin: "B082C7PP81",
    amazonUrl: `https://www.amazon.fr/s?k=cable+displayport+vers+hdmi+2.0+tress%C3%A9+4k60&tag=${AMAZON_STORE_ID}`,
    priceEst: 10.99,
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
    asin: "B08M9HHPW3",
    amazonUrl: `https://www.amazon.fr/s?k=cable+hdmi+2.1+ultra+high+speed+certifie&tag=${AMAZON_STORE_ID}`,
    priceEst: 10.99,
  },
  {
    id: "acc-remote-airmouse",
    nameFr: "Télécommande Gyroscopique Régie 2.4 GHz USB",
    nameEn: "2.4 GHz USB Gyroscopic Air-Mouse Remote",
    categoryFr: "Contrôle",
    categoryEn: "Control",
    specs: "Dongle USB plug-and-play · Capteur 6 axes · Portée 15 m",
    descriptionFr: "Permet de contrôler la régie à distance sans toucher au clavier : pointeur virtuel et touches multimédias.",
    descriptionEn: "Control the playout desk from across the room: virtual mouse pointer and tactile media keys.",
    asin: "B07RRTYHWK",
    amazonUrl: `https://www.amazon.fr/s?k=t%C3%A9l%C3%A9commande+air+mouse+gyroscopique+usb+2.4ghz&tag=${AMAZON_STORE_ID}`,
    priceEst: 15.9,
  },
  {
    id: "acc-remote-keyboard",
    nameFr: "Télécommande Double Face avec Clavier Rétroéclairé",
    nameEn: "Dual-Sided Remote with Backlit Keyboard",
    categoryFr: "Contrôle",
    categoryEn: "Control",
    specs: "Face multimédia + Clavier complet au dos · Dongle USB 2.4 GHz",
    descriptionFr: "Le combiné idéal en régie : boutons de volume et play/pause à l'avant, clavier au verso pour renommer les séances.",
    descriptionEn: "All-in-one control: playback controls in front, full keyboard on back for quick text input.",
    asin: "B00ZGXU4EK",
    amazonUrl: `https://www.amazon.fr/s?k=t%C3%A9l%C3%A9commande+clavier+sans+fil+usb+2.4ghz&tag=${AMAZON_STORE_ID}`,
    priceEst: 17.9,
  },
  {
    id: "acc-hub-usbc-pd",
    nameFr: "Hub Multiport USB-C HDMI 4K 60Hz + PD 100W",
    nameEn: "USB-C Multiport Hub HDMI 4K 60Hz + PD 100W",
    categoryFr: "Connectique",
    categoryEn: "Connectivity",
    specs: "HDMI 4K60 · Port USB-C charge continue 100W · Ports USB 3.0",
    descriptionFr: "Indispensable pour diffuser la vidéo depuis un MacBook ou une tablette Android tout en maintenant la batterie à 100%.",
    descriptionEn: "Essential to project video from MacBook or Android tablet while maintaining battery charge 24/7.",
    asin: "B0874HH4ZZ",
    amazonUrl: `https://www.amazon.fr/s?k=hub+usb+c+hdmi+4k+60hz+power+delivery+100w&tag=${AMAZON_STORE_ID}`,
    priceEst: 27.9,
  },
  {
    id: "acc-cable-cat6a",
    nameFr: "Câble Réseau RJ45 Cat 6A SSTP Blindé (3 m)",
    nameEn: "Cat 6A SSTP Shielded Ethernet Cable (3 m)",
    categoryFr: "Réseau",
    categoryEn: "Network",
    specs: "Cat 6A SFTP blindé · Débit 10 Gbps · Connecteurs dorés",
    descriptionFr: "Garantit une diffusion locale sans aucune perte de paquets entre la régie et les écrans réseau.",
    descriptionEn: "Guarantees packet-loss-free local network streaming between the desk and connected screens.",
    asin: "B01F346Q34",
    amazonUrl: `https://www.amazon.fr/s?k=cable+ethernet+cat+6a+3m&tag=${AMAZON_STORE_ID}`,
    priceEst: 7.99,
  },
  {
    id: "acc-wall-mount-tablet",
    nameFr: "Support Mural Antivol Sécurisé à Clé pour Tablette",
    nameEn: "Secure Key-Lock Anti-Theft Wall Mount for Tablet",
    categoryFr: "Support",
    categoryEn: "Mount",
    specs: "Châssis aluminium · Compatible VESA 75/100 · Verrou à clé",
    descriptionFr: "Sécurise la tablette contre le vol en libre-service tout en gardant l'écran tactile immédiatement accessible.",
    descriptionEn: "Protects self-service tablets against theft while keeping touch screen immediately accessible.",
    asin: "B07P853XYZ",
    amazonUrl: `https://www.amazon.fr/s?k=support+mural+antivol+tablette+10+11+pouces+vesa&tag=${AMAZON_STORE_ID}`,
    priceEst: 34.9,
  },
  {
    id: "acc-stand-vertical-laptop",
    nameFr: "Support Vertical Réglable en Aluminium pour PC/Mac",
    nameEn: "Adjustable Aluminum Vertical Laptop Stand",
    categoryFr: "Support",
    categoryEn: "Mount",
    specs: "Aluminium usiné massif · Vis d'écartement réglable · Silicone",
    descriptionFr: "Maintient l'ordinateur portable fermé à la verticale en mode clamshell : encombrement minimal en régie.",
    descriptionEn: "Holds laptop closed vertically in clamshell mode: saves valuable counter space in the control room.",
    asin: "B0892D5FGB",
    amazonUrl: `https://www.amazon.fr/s?k=support+vertical+macbook+aluminium&tag=${AMAZON_STORE_ID}`,
    priceEst: 19.9,
  },
];

// =============================================================================
// 3. COMPARATIF ÉCONOMIQUE ROI : BOBINE VS SOLUTIONS PROPRIÉTAIRES
// =============================================================================

export interface RoiComparisonItem {
  id: string;
  name: string;
  hardwareUpfront: number;
  monthlySubscription: number;
  costYear1: number;
  costYear3: number;
  license: string;
  ownership: string;
}

export const ROI_DATA: {
  bobineWyse: RoiComparisonItem;
  competitorLesMills: RoiComparisonItem;
  competitorWexer: RoiComparisonItem;
} = {
  bobineWyse: {
    id: "bobine",
    name: "Bobine + Pack Wyse J5005",
    hardwareUpfront: 109, // Wyse J5005 + Câble DP-HDMI + Câble Réseau + Télécommande 2.4G
    monthlySubscription: 0,
    costYear1: 109,
    costYear3: 109,
    license: "GNU AGPL-3.0 Libre & Gratuit à vie",
    ownership: "Matériel 100% à vous, zéro abonnement",
  },
  competitorLesMills: {
    id: "les-mills-cinema",
    name: "Les Mills Cinema / Virtual",
    hardwareUpfront: 2490,
    monthlySubscription: 299,
    costYear1: 2490 + 299 * 12, // 6 078 €
    costYear3: 2490 + 299 * 36, // 13 254 €
    license: "Propriétaire fermée avec DRM",
    ownership: "Location forcée, arrêt complet si impayé",
  },
  competitorWexer: {
    id: "wexer-fod",
    name: "Wexer & Fitness On Demand",
    hardwareUpfront: 3200,
    monthlySubscription: 280,
    costYear1: 3200 + 280 * 12, // 6 560 €
    costYear3: 3200 + 280 * 36, // 13 280 €
    license: "SaaS propriétaire fermé",
    ownership: "Borne verrouillée, dépendance cloud totale",
  },
};
