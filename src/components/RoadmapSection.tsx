import type { Locale } from "@/lib/i18n";
import AndroidIcon from "@/components/icons/AndroidIcon";
import AppleIcon from "@/components/icons/AppleIcon";
import { docChapters } from "@/content/docs/chapters";

export default function RoadmapSection({ locale }: { locale: Locale }) {
  const isEn = locale === "en";
  const chapter = docChapters[locale].find((c) => c.id === "feuille-de-route");
  if (!chapter) return null;
  const [android, ios] = chapter.subsections;
  const title = chapter.title.replace(/^\d+\.\s*/, "");

  return (
    <aside className="docs-roadmap" role="region" aria-label={title}>
      <span className="docs-roadmap__badge">{chapter.badge}</span>
      <h3 className="docs-roadmap__title">{title}</h3>
      <p className="docs-roadmap__intro">{chapter.summary}</p>

      <div className="docs-roadmap__grid">
        <div className="docs-roadmap__card">
          <div className="docs-roadmap__card-head">
            <AndroidIcon size={18} />
            <span className="docs-roadmap__status docs-roadmap__status--study">
              {isEn ? "Feasibility study" : "Étude de faisabilité"}
            </span>
          </div>
          <h4 className="docs-roadmap__card-title">{android.subtitle.replace(/^7\.\d\s/, "")}</h4>
          {android.paragraphs.map((p, i) => (
            <p key={i} className="docs-roadmap__card-text">
              {p}
            </p>
          ))}
        </div>

        <div className="docs-roadmap__card">
          <div className="docs-roadmap__card-head">
            <AppleIcon size={16} />
            <span className="docs-roadmap__status docs-roadmap__status--explore">
              {isEn ? "Explored idea" : "Piste explorée"}
            </span>
          </div>
          <h4 className="docs-roadmap__card-title">{ios.subtitle.replace(/^7\.\d\s/, "")}</h4>
          {ios.paragraphs.map((p, i) => (
            <p key={i} className="docs-roadmap__card-text">
              {p}
            </p>
          ))}
        </div>
      </div>
    </aside>
  );
}
