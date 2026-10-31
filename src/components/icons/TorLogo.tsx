import BrandIcon from "@/components/ui/BrandIcon";

interface TorLogoProps {
  size?: number;
  className?: string;
}

/** Tor : délègue au registre des icônes (src/lib/assets.ts). */
export default function TorLogo({ size = 20, className }: TorLogoProps) {
  return <BrandIcon name="os.tor" size={size} className={className} />;
}
