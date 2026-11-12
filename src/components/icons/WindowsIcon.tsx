import BrandIcon from "@/components/ui/BrandIcon";

export default function WindowsIcon({ className, size = 20 }: { className?: string; size?: number }) {
  return <BrandIcon name="os.windows" size={size} className={className} />;
}
