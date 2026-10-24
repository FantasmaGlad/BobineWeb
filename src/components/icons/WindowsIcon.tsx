import BrandIcon from "@/components/ui/BrandIcon";

/** Windows : délègue au registre des icônes (src/lib/assets.ts). */
export default function WindowsIcon({ className, size = 20 }: { className?: string; size?: number }) {
  return <BrandIcon name="os.windows" size={size} className={className} />;
}
