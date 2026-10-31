import BrandIcon from "@/components/ui/BrandIcon";

/** Linux : délègue au registre des icônes (src/lib/assets.ts). */
export default function LinuxIcon({ className, size = 24 }: { className?: string; size?: number }) {
  return <BrandIcon name="os.linux" size={size} className={className} />;
}
