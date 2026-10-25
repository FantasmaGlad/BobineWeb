export type OsKey = "linux" | "windows" | "macos" | "arm" | "android" | "android-tv";
export type TierKey = "essentiel" | "recommande" | "pro" | "premium";
export type FormFactorKey = "minipc" | "laptop" | "tablet" | "tv";

export interface HardwareItem {
  id: string;
  name: string;
  category: "uc" | "cable-video" | "network" | "control" | "power-hub" | "mount" | "storage";
  specs: string;
  description: string;
  imageUrl: string;
  asin: string; // ASIN Amazon, identifiant AliExpress ou référence fabricant.
  amazonUrl: string; // Lien direct fiche produit avec tag affilié
  priceAmazon: number | null; // Prix AliExpress ; toujours null pour les fiches Amazon.
  hasFan: boolean; // true si l'unité embarque un ventilateur actif (jamais "fanless" si true)
  // Renseigné uniquement pour les places de marché tierces (AliExpress) : boutique vendeuse,
  // note et nombre de ventes issus de l'API, affichés comme signal de confiance.
  seller?: { name: string; rating: string | null; sales: number | null };
  // Vrai lorsque le prix vient d'un rafraîchissement en direct (l'affichage "prix constaté le"
  // est alors retiré). Absent pour un prix statique vérifié manuellement.
  isLive?: boolean;
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
  // Marques alternatives pour l'unité centrale de cette gamme (ASIN réels vérifiés,
  // mêmes exigences que items) : laisse le choix à l'acheteur sans dupliquer les
  // accessoires, qui restent pensés autour de l'unité principale ci-dessus.
  alternativeUnits?: HardwareItem[];
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
  tiers: Partial<Record<TierKey, HardwareTier>>;
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
  priceAmazon: number | null;
  compatibleOs: OsKey[];
}

