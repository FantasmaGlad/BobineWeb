import type { LinuxFamily } from "@/lib/linuxPackages";

/**
 * Logo d'une distribution Linux (public/images/distros/*.svg, dessin simple-icons inchangé). Il est dessiné comme un
 * masque rempli de `currentColor` : il prend la couleur du texte du thème et reste lisible dans les 16 thèmes.
 * Décoratif : le nom de la distribution est toujours écrit à côté.
 */
export default function DistroLogo({ id, className }: { id: LinuxFamily["logo"]; className?: string }) {
  return <span className={`distro-logo distro-logo--${id}${className ? ` ${className}` : ""}`} aria-hidden="true" />;
}
