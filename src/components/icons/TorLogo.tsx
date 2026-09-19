import Image from "next/image";

interface TorLogoProps {
  size?: number;
  className?: string;
}

export default function TorLogo({ size = 20, className = "" }: TorLogoProps) {
  return (
    <span
      className={`inline-flex items-center justify-center shrink-0 ${className}`}
      style={{ width: size, height: size, verticalAlign: "middle", display: "inline-flex" }}
      aria-hidden="true"
    >
      <Image
        src="/images/tor-onion.webp"
        alt=""
        width={size}
        height={size}
        unoptimized
        style={{ width: size, height: size, objectFit: "contain", display: "block" }}
      />
    </span>
  );
}
