import BrandIcon from "@/components/ui/BrandIcon";

export default function AndroidTvIcon({ className, size = 24 }: { className?: string; size?: number }) {
  return <BrandIcon name="os.androidtv" size={size} className={className} />;
}
