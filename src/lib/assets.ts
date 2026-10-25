/**
 * Registre des icônes de marque (systèmes, navigateurs, puces, distributions). Source unique : `assets.json`, lu aussi
 * par `scripts/ci/check-assets.mjs` (fichier présent, poids, contraste dans les 16 thèmes, attribution dans NOTICE.md).
 * Aucun composant n'écrit de chemin d'icône à la main : il demande une clé à `BrandIcon`.
 *
 * `tone` décide de la couleur d'une icône à un seul tracé :
 *  - `brand` : couleur officielle (`color`), seulement si elle atteint 3:1 sur les surfaces des 16 thèmes ;
 *  - `ink` : couleur du texte du thème (`currentColor`), pour les marques noires ou trop claires.
 * Les icônes multicolores (`render: "image"`) sont affichées telles quelles.
 */
import data from "./assets.json";

export type AssetKey = keyof typeof data;

export interface AssetDef {
  /** Nom de la marque, tel qu'il doit figurer dans NOTICE.md. */
  name: string;
  src: string;
  render?: "mask" | "image";
  tone?: "brand" | "ink";
  color?: string;
  maxBytes?: number;
}

const registry = data as Record<AssetKey, AssetDef>;

export function getAsset(key: AssetKey): AssetDef {
  return registry[key];
}

export const ASSET_KEYS = Object.keys(registry) as AssetKey[];

/** Clé du logo d'un système d'après l'identifiant de plateforme utilisé par le site. */
export const OS_ASSET: Record<"windows" | "macos" | "linux" | "android" | "androidtv" | "googlebook", AssetKey> = {
  windows: "os.windows",
  macos: "os.macos",
  linux: "os.linux",
  android: "os.android",
  androidtv: "os.androidtv",
  googlebook: "os.googlebook",
};
