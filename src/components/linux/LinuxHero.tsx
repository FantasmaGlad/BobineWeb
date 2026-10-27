import Image from "next/image";
import type { Locale } from "@/lib/i18n";
import { LINUX_SHOWCASE_CONTENT } from "@/content/linuxShowcase";
import BrandIcon from "@/components/ui/BrandIcon";

export default function LinuxHero({ locale }: { locale: Locale }) {
  const t = LINUX_SHOWCASE_CONTENT[locale].hero;
  const chips = LINUX_SHOWCASE_CONTENT[locale].chips;

  return (
    <section className="linux-hero">
      <h1 className="linux-hero__title">{t.title}</h1>
      <p className="linux-hero__lead">{t.lead}</p>

      <div className="linux-hero__actions">
        <a href="#terminal" className="linux-hero__cta-primary">
          <span>{t.ctaPrimary}</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </a>
        <a href="https://packages.bobine.fit" target="_blank" rel="noopener noreferrer" className="linux-hero__cta-secondary">
          <span>{t.ctaSecondary}</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="7" y1="17" x2="17" y2="7" />
            <polyline points="7 7 17 7 17 17" />
          </svg>
        </a>
      </div>

      <div className="linux-hero__visual-wrap">
        <Image
          src="/images/FrameworkBaamix-wide.webp"
          alt="Framework Laptop 16 pouces avec Bobine en action sur Linux"
          width={1280}
          height={720}
          priority
          sizes="(max-width: 768px) 100vw, 1200px"
          className="linux-hero__image"
        />
      </div>

      <div className="linux-chips">
        <span className="linux-chips__label">
          {t.chipsLabel}
        </span>
        {chips.map((chip) => (
          <div key={chip.name} className="linux-chips__item">
            <BrandIcon name={chip.icon} size={24} className="linux-chips__icon" />
            <span>
              <strong>{chip.name}</strong> ({chip.note})
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
