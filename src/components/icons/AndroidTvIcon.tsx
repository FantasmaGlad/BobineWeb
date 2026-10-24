import BrandIcon from "@/components/ui/BrandIcon";

/** AndroidTv : délègue au registre des icônes (src/lib/assets.ts). */
export default function AndroidTvIcon({ className, size = 24 }: { className?: string; size?: number }) {
  return <BrandIcon name="os.androidtv" size={size} className={className} />;
}
