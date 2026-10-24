import BrandIcon from "@/components/ui/BrandIcon";
import Icon, { type IconName } from "@/components/ui/Icon";
import type { AssetKey } from "@/lib/assets";

/** Icône d'une route du plan du site : `icon:<nom>` pour l'interface, `brand:<clé>` pour un logo. */
export default function RouteIcon({ icon, size = 22 }: { icon?: string; size?: number }) {
  if (!icon) return null;
  const [kind, name] = icon.split(":");
  if (kind === "brand") return <BrandIcon name={name as AssetKey} size={size} />;
  return <Icon name={name as IconName} size={size} />;
}
