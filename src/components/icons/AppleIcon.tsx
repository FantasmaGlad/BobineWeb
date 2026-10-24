import BrandIcon from "@/components/ui/BrandIcon";

/** Apple : délègue au registre des icônes (src/lib/assets.ts). */
export default function AppleIcon({ className, size = 20 }: { className?: string; size?: number }) {
  return <BrandIcon name="os.macos" size={size} className={className} />;
}
