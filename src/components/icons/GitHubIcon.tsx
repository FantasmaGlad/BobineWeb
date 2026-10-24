import BrandIcon from "@/components/ui/BrandIcon";

/** GitHub : délègue au registre des icônes (src/lib/assets.ts). */
export default function GitHubIcon({ className, size = 20 }: { className?: string; size?: number }) {
  return <BrandIcon name="app.github" size={size} className={className} />;
}
