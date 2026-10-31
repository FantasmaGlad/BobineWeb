import type { CSSProperties } from "react";
import { getAsset, type AssetKey } from "@/lib/assets";
import "@/styles/components/brand-icon.css";

interface BrandIconProps {
  name: AssetKey;
  /** Taille CSS (nombre = pixels). Par défaut 1,15 fois le corps du texte. */
  size?: number | string;
  className?: string;
  /** Nom accessible, seulement quand le nom de la marque n'est pas écrit à côté. Sinon l'icône est décorative. */
  label?: string;
}

/** Logo d'un système, d'un navigateur, d'une puce ou d'une distribution, tiré du registre `assets.ts`. */
export default function BrandIcon({ name, size, className, label }: BrandIconProps) {
  const asset = getAsset(name);
  const dimension = typeof size === "number" ? `${size}px` : size;
  const a11y = label ? ({ role: "img", "aria-label": label } as const) : ({ "aria-hidden": true } as const);
  if (asset.render === "image") {
    const style = dimension ? ({ width: dimension, height: dimension } as CSSProperties) : undefined;
    // Icône multicolore : un masque la rendrait monochrome, l'image garde ses couleurs officielles.
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={asset.src} alt={label ?? ""} className={`brand-icon--image${asset.halo ? " brand-icon--halo" : ""}${className ? ` ${className}` : ""}`} style={style} {...(label ? {} : { "aria-hidden": true })} />;
  }
  const style = {
    "--brand-icon-src": `url("${asset.src}")`,
    ...(asset.tone !== "ink" && asset.color ? { "--brand-icon-color": asset.color } : {}),
    ...(dimension ? { width: dimension, height: dimension } : {}),
  } as CSSProperties;
  return <span className={`brand-icon${className ? ` ${className}` : ""}`} style={style} {...a11y} />;
}
