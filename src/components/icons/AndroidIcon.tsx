import BrandIcon from "@/components/ui/BrandIcon";

export default function AndroidIcon({ className, size = 24 }: { className?: string; size?: number }) {
  return <BrandIcon name="os.android" size={size} className={className} />;
}
