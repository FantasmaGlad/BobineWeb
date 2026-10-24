import type { Locale } from "@/lib/i18n";
import { LINUX_SHOWCASE_CONTENT } from "@/content/linuxShowcase";

export default function LinuxSecurityCard({ locale }: { locale: Locale }) {
  const t = LINUX_SHOWCASE_CONTENT[locale].security;

  return (
    <section className="linux-security-card">
      <h2 className="linux-security-card__title">{t.title}</h2>
      <p className="linux-security-card__desc">{t.desc}</p>

      <div className="linux-security-card__fpr-box">
        <code className="linux-security-card__fpr-code">{t.fingerprint}</code>
        <a
          href="https://packages.bobine.fit/bobine.gpg"
          target="_blank"
          rel="noopener noreferrer"
          className="linux-terminal__copy-btn"
          style={{ position: "static" }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          <span>{t.downloadKeyText}</span>
        </a>
      </div>
    </section>
  );
}
