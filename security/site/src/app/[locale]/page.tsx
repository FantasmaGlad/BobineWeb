import React from "react";
import SecurityHeader from "../../components/SecurityHeader";
import SecurityFooter from "../../components/SecurityFooter";
import PgpKeyBox from "../../components/PgpKeyBox";
import DisclosurePolicy from "../../components/DisclosurePolicy";
import { SECURITY_DATA } from "../../content/security-content";

export function generateStaticParams() {
  return [{ locale: "fr" }, { locale: "en" }];
}

export default async function SecurityPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const resolvedParams = await params;
  const locale = resolvedParams.locale === "fr" ? "fr" : "en";
  const strings = SECURITY_DATA[locale];

  return (
    <>
      <a className="skip-link" href="#main">
        {locale === "fr" ? "Aller au contenu" : "Skip to content"}
      </a>
      <SecurityHeader lang={locale} langLinks={["/", "/fr/"]} />

      <main id="main" className="page-main">
        <section className="hero">
          <span className="hero__category">{strings.heroCategory}</span>
          <h1 className="hero__title">{strings.heroTitle}</h1>
          <p className="hero__desc">{strings.heroDesc}</p>

          <div className="hero__meta">
            <span className="hero__meta-item">
              <span className="hero__meta-dot" aria-hidden="true" />
              <span>{strings.metaReportsOpen}</span>
            </span>
            <span className="hero__meta-item">Ed25519 + Curve25519</span>
            <span className="hero__meta-item">{strings.metaKeyValid}</span>
            <span className="hero__meta-item">security.txt signé (RFC 9116)</span>
          </div>
        </section>

        <PgpKeyBox strings={strings} />
        <DisclosurePolicy strings={strings} />
      </main>

      <SecurityFooter strings={strings} />
    </>
  );
}
