import BrandIcon from "@/components/ui/BrandIcon";

/** Android : délègue au registre des icônes (src/lib/assets.ts). */
export default function AndroidIcon({ className, size = 24 }: { className?: string; size?: number }) {
  return <BrandIcon name="os.android" size={size} className={className} />;
}
