import { NOT_VALIDATED_NOTE } from "@/lib/linuxPackages";
import type { Locale } from "@/lib/i18n";
import { LINUX_DISTRO_FAMILIES, LINUX_SHOWCASE_CONTENT } from "@/content/linuxShowcase";
import BrandIcon from "@/components/ui/BrandIcon";

export default function LinuxDistroGrid({ locale }: { locale: Locale }) {
  const t = LINUX_SHOWCASE_CONTENT[locale].distros;

  return (
    <section className="linux-distros-section">
      <header className="linux-section-header">
        <div className="linux-section-header__tag">{t.sectionTag}</div>
        <h2 className="linux-section-header__title">{t.sectionTitle}</h2>
        <p className="linux-section-header__desc">{t.sectionDesc}</p>
        <p className="linux-section-header__desc">{NOT_VALIDATED_NOTE[locale]}</p>
      </header>

      <div className="linux-distros-columns">
        {LINUX_DISTRO_FAMILIES.map((family) => (
          <div key={family.id} className="linux-distros-family">
            <div className="linux-distros-family__title">
              <span>{family.title[locale]}</span>
              <span className="linux-distros-family__badge">{family.badge[locale]}</span>
            </div>

            <div className="linux-distros-grid">
              {family.distros.map((distro) => (
                <a
                  key={distro.id}
                  href={distro.siteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="linux-distro-card"
                  title={`${distro.name} — ${distro.status[locale]}`}
                >
                  <div className="linux-distro-card__icon-wrap">
                    <BrandIcon name={distro.icon} className="linux-distro-card__icon" />
                  </div>

                  <div className="linux-distro-card__info">
                    <div className="linux-distro-card__name">{distro.name}</div>
                    <div className="linux-distro-card__meta">
                      <span className="linux-distro-card__status">{distro.status[locale]}</span>
                      <span>·</span>
                      <span>{distro.pkgFormat}</span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
