import Image from "next/image";
import type { Locale } from "@/lib/i18n";
import { LINUX_SHOWCASE_CONTENT } from "@/content/linuxShowcase";

export default function FrameworkShowcase({ locale }: { locale: Locale }) {
  const t = LINUX_SHOWCASE_CONTENT[locale].framework;

  return (
    <section className="linux-framework-section">
      <div className="linux-framework__content">
        <div>
          <div className="linux-section-header__tag" style={{ textAlign: "left" }}>
            {t.sectionTag}
          </div>
          <h2 className="linux-framework__title">{t.title}</h2>
          <p className="linux-framework__desc">{t.desc}</p>

          <div className="linux-framework__specs">
            {t.specs.map((spec) => (
              <div key={spec.title} className="linux-framework__spec">
                <div className="linux-framework__spec-title">{spec.title}</div>
                <div className="linux-framework__spec-value">{spec.value}</div>
              </div>
            ))}
          </div>

          <a
            href="https://frame.work/"
            target="_blank"
            rel="noopener noreferrer"
            className="linux-framework__link"
          >
            <span>{t.linkText}</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="7" y1="17" x2="17" y2="7" />
              <polyline points="7 7 17 7 17 17" />
            </svg>
          </a>
        </div>

        <div style={{ position: "relative" }}>
          <Image
            src="/images/FrameworkBaamix.webp"
            alt="Framework Laptop modulaire sous Linux pour Bobine"
            width={640}
            height={480}
            className="linux-hero__image"
            style={{ borderRadius: "var(--radius-lg)" }}
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
}
