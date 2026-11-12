import BrandIcon from "@/components/ui/BrandIcon";
import type { LinuxFamily } from "@/lib/linuxPackages";

export default function DistroLogo({ id, className }: { id: LinuxFamily["logo"]; className?: string }) {
  return <BrandIcon name={`distro.${id}`} className={`distro-logo${className ? ` ${className}` : ""}`} />;
}
