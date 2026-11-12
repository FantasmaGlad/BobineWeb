import data from "./assets.json";

export type AssetKey = keyof typeof data;

export interface AssetDef {
  name: string;
  src: string;
  render?: "mask" | "image";
  tone?: "brand" | "ink";
  halo?: boolean;
  color?: string;
  maxBytes?: number;
}

const registry = data as Record<AssetKey, AssetDef>;

export function getAsset(key: AssetKey): AssetDef {
  return registry[key];
}
