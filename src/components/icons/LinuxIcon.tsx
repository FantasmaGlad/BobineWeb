import BrandIcon from "@/components/ui/BrandIcon";

export default function LinuxIcon({ className, size = 24 }: { className?: string; size?: number }) {
  return <BrandIcon name="os.linux" size={size} className={className} />;
}
