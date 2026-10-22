import Image from "next/image";
import type { CSSProperties } from "react";
import "@/styles/split/pages-misc.css";

interface TorLogoProps {
  size?: number;
  className?: string;
}

export default function TorLogo({ size = 20, className = "" }: TorLogoProps) {
  return (
    <span
      className={`tor-logo ${className}`.trim()}
      style={{ "--tor-logo-size": `${size}px` } as CSSProperties}
      aria-hidden="true"
    >
      <Image
        src="/images/tor-onion.webp"
        alt=""
        width={size}
        height={size}
        unoptimized
        className="tor-logo__img"
      />
    </span>
  );
}
