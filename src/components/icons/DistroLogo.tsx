import BrandIcon from "@/components/ui/BrandIcon";
import type { LinuxFamily } from "@/lib/linuxPackages";

/**
 * Logo d'une famille de distributions Linux, tiré du registre `src/lib/assets.ts` (dessin simple-icons inchangé, couleur du
 * texte du thème). Décoratif : le nom de la distribution est toujours écrit à côté.
 */
export default function DistroLogo({ id, className }: { id: LinuxFamily["logo"]; className?: string }) {
  return <BrandIcon name={`distro.${id}`} className={`distro-logo${className ? ` ${className}` : ""}`} />;
}
