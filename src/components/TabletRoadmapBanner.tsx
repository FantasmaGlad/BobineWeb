import type { Locale } from "@/lib/i18n";
import AndroidIcon from "@/components/icons/AndroidIcon";
import AppleIcon from "@/components/icons/AppleIcon";

export default function TabletRoadmapBanner({ locale }: { locale: Locale }) {
  const isEn = locale === "en";

  return (
    <aside
      className="tablet-roadmap-banner"
      role="region"
      aria-label={isEn ? "Upcoming ARM Tablets Roadmap" : "Feuille de route tablettes ARM"}
    >
      <div className="tablet-roadmap-banner__badge-row">
        <span className="tablet-roadmap-banner__badge">
          {isEn ? "Prospective Roadmap" : "Feuille de Route Prospective"}
        </span>
        <div className="tablet-roadmap-banner__icons" aria-hidden="true">
          <AndroidIcon size={16} />
          <AppleIcon size={14} />
        </div>
      </div>

      <h3 className="tablet-roadmap-banner__title">
        {isEn
          ? "Upcoming Support: ARM Tablets with Video Output (Android & iPadOS)"
          : "Support Futur : Tablettes Tactiles ARM avec Sortie Vidéo (Android & iPadOS)"}
      </h3>

      <p className="tablet-roadmap-banner__text">
        {isEn
          ? "Engineering specifications include expanding Bobine to ARM tablets equipped with USB-C video output (DisplayPort / HDMI). A single wall-mounted tablet will serve simultaneously as an intuitive coach console and an autonomous 4K playout engine driving the room's display."
          : "Les spécifications d'ingénierie prévoient l'extension de Bobine aux tablettes tactiles ARM dotées d'un port USB-C avec sortie vidéo (DisplayPort / HDMI). Une simple tablette murale servira à la fois de pupitre coach tactile et de régie vidéo autonome propulsant le flux 4K sur l'écran ou le vidéoprojecteur du studio."}
      </p>
    </aside>
  );
}
