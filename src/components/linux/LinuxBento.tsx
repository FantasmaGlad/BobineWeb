import type { Locale } from "@/lib/i18n";
import { LINUX_SHOWCASE_CONTENT } from "@/content/linuxShowcase";

export default function LinuxBento({ locale }: { locale: Locale }) {
  const t = LINUX_SHOWCASE_CONTENT[locale].bento;

  return (
    <section className="linux-bento-section">
      <header className="linux-section-header">
        <div className="linux-section-header__tag">{t.sectionTag}</div>
        <h2 className="linux-section-header__title">{t.sectionTitle}</h2>
        <p className="linux-section-header__desc">{t.sectionDesc}</p>
      </header>

      <div className="linux-bento-grid">
        {t.cards.map((card) => (
          <article key={card.title} className="linux-bento-card">
            <div>
              <div className="linux-bento-card__badge">{card.badge}</div>
              <h3 className="linux-bento-card__title">{card.title}</h3>
              <p className="linux-bento-card__desc">{card.desc}</p>
            </div>

            <ul className="linux-bento-card__features">
              {card.features.map((feature) => (
                <li key={feature} className="linux-bento-card__feature">
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
