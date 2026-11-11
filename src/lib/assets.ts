/**
 * Registre des icônes de marque (systèmes, navigateurs, puces, distributions). Source unique : `assets.json`, lu aussi
 * par `scripts/ci/check-assets.mjs` (fichier présent, poids, contraste dans les 18 palettes, attribution dans NOTICE.md).
 * Aucun composant n'écrit de chemin d'icône à la main : il demande une clé à `BrandIcon`.
 *
 * `tone` décide de la couleur d'une icône à un seul tracé :
 *  - `brand` : couleur officielle (`color`), seulement si elle atteint 3:1 sur les surfaces des 18 palettes ;
 *  - `ink` : couleur du texte du thème (`currentColor`), pour les marques noires ou trop claires.
 * Les icônes multicolores (`render: "image"`) sont affichées telles quelles, sans fond ; `halo` ajoute un liseré quand
 * une de leurs couleurs disparaît sur un thème (contrôlé par `check-assets.mjs`).
 */
import data from "./assets.json";

export type AssetKey = keyof typeof data;

export interface AssetDef {
  /** Nom de la marque, tel qu'il doit figurer dans NOTICE.md. */
  name: string;
  src: string;
  render?: "mask" | "image";
  tone?: "brand" | "ink";
  /** Logo multicolore dont une couleur se confond avec une surface d'un thème : liseré au lieu d'un fond. */
  halo?: boolean;
  color?: string;
  maxBytes?: number;
}

const registry = data as Record<AssetKey, AssetDef>;

export function getAsset(key: AssetKey): AssetDef {
  return registry[key];
}
