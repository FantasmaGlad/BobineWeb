import Image from "next/image";
import media from "@/content/media.json";
import type { Locale } from "@/lib/i18n";

export type MediaId = keyof typeof media;

export default function MediaFrame({ id, locale, preload = false, caption }: { id: MediaId; locale: Locale; preload?: boolean; caption?: string }) {
  const item = media[id];
  const largest = item.variants[item.variants.length - 1];
  return (
    <figure className="media-frame">
      <picture>
        <source type="image/avif" srcSet={item.variants.map((v) => `${v.avif} ${v.width}w`).join(", ")} sizes="(max-width: 800px) calc(100vw - 2rem), 60vw" />
        <Image src={largest.webp} alt={item.alt[locale]} width={largest.width} height={largest.height} sizes="(max-width: 800px) calc(100vw - 2rem), 60vw" loading={preload ? "eager" : "lazy"} fetchPriority={preload ? "high" : undefined} unoptimized />
      </picture>
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  );
}
