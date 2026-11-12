import type { CSSProperties } from "react";
import { getAsset, type AssetKey } from "@/lib/assets";
import "@/styles/components/brand-icon.css";

interface BrandIconProps {
  name: AssetKey;
  size?: number | string;
  className?: string;
  label?: string;
}

export default function BrandIcon({ name, size, className, label }: BrandIconProps) {
  const asset = getAsset(name);
  const dimension = typeof size === "number" ? `${size}px` : size;
  const a11y = label ? ({ role: "img", "aria-label": label } as const) : ({ "aria-hidden": true } as const);
  if (asset.render === "image") {
    const style = dimension ? ({ width: dimension, height: dimension } as CSSProperties) : undefined;
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
