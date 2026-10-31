import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BOBINE_VALUE_PILLARS, comparisons, COMPARE_SOURCES, compareCopy, getComparison, type CompareSlug, type CompareRow } from "@/content/compare";
import { isLocale, type Locale } from "@/lib/i18n";
import { buildMetadata, lp } from "@/lib/seo";
import Breadcrumbs from "@/components/page/Breadcrumbs";
import Icon from "@/components/ui/Icon";
import BrandIcon from "@/components/ui/BrandIcon";
import ShareButton from "@/components/ShareButton";
import FaqJsonLd from "@/components/FaqJsonLd";

export type ComparePageProps = { params: Promise<{ locale: string }> };

export async function compareMetadata({ params }: ComparePageProps, slug?: CompareSlug): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const entry = slug ? getComparison(slug) : null;
  return buildMetadata({
    locale,
    pathname: slug ? `/comparatif/${slug}` : "/comparatif",
    title: (entry?.title ?? compareCopy.title)[locale],
    description: (entry?.description ?? compareCopy.description)[locale],
    keywords: ["Bobine", entry?.name ?? (locale === "fr" ? "Comparatif fitness" : "Fitness comparison")],
    image: "/images/FrameworkBaamix-wide.webp",
  });
}

function ComparisonNotice({ locale }: { locale: Locale }) {
  return (
    <aside className="compare-notice" aria-labelledby="comparison-method">
      <h2 id="comparison-method"><Icon name="search" />{compareCopy.noticeTitle[locale]}</h2>
      <p>{compareCopy.notice[locale]}</p>
    </aside>
  );
}

/** Les libellés mobiles restent du vrai texte ; le tableau conserve ses en-têtes pour les lecteurs d’écran. */
function CompareTable({ locale, columns, rows }: { locale: Locale; columns: readonly string[]; rows: readonly CompareRow[] }) {
  return (
    <div className="comparison-table-wrapper">
      <table className="comparison-table compare-table" role="table">
        <caption className="compare-table__caption">{compareCopy.table[locale]}</caption>
        <thead role="rowgroup">
          <tr role="row">
            <th scope="col" role="columnheader">{compareCopy.criteria[locale]}</th>
            {columns.map((column, index) => <th key={column} scope="col" role="columnheader" className={index === 0 ? "col-bobine" : undefined}>{column}</th>)}
          </tr>
        </thead>
        <tbody role="rowgroup">
          {rows.map((row) => (
            <tr key={row.label} role="row">
              <th scope="row" role="rowheader" className="cell-feature">{row.label}</th>
              {row.values.map((value, index) => (
                <td key={columns[index]} role="cell" className={index === 0 ? "cell-bobine" : "cell-proprietary"}>
                  <span className="compare-table__mobile-label" aria-hidden="true">{columns[index]}</span>
                  {value}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


export default async function ComparePage({ params, slug }: ComparePageProps & { slug?: CompareSlug }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const entry = slug ? getComparison(slug) : null;
  const title = (entry?.title ?? compareCopy.title)[locale];
  const intro = (entry?.intro ?? compareCopy.intro)[locale];
  const pathname = slug ? `/comparatif/${slug}` : "/comparatif";
  const faq = entry?.faq.map((item) => ({ category: "compare" as const, q: item.q[locale], a: item.a[locale] }));
  const sources = entry?.sources ?? Object.keys(COMPARE_SOURCES) as (keyof typeof COMPARE_SOURCES)[];
  const dateFormat = new Intl.DateTimeFormat(locale === "fr" ? "fr-FR" : "en-GB", { dateStyle: "long", timeZone: "UTC" });

  return (
    <div className="compare-page">
      <Breadcrumbs locale={locale} id={entry?.routeId ?? "compare"} />
      {faq ? <FaqJsonLd items={faq} /> : null}
      <header className="compare-hero">
        <div className="compare-hero__copy">
          <h1>{title}</h1>
          <p>{intro}</p>
          <div className="compare-actions">
            <Link href={lp(locale, "/telechargement")} className="btn-primary"><Icon name="download" />{compareCopy.download[locale]}</Link>
            <ShareButton locale={locale} pathname={pathname} title={title} description={intro} />
          </div>
        </div>
        <Image src="/images/FrameworkBaamix-wide.webp" alt={compareCopy.imageAlt[locale]} width={1200} height={678} sizes="(max-width: 900px) 100vw, 40vw" preload className="compare-hero__image" />
      </header>

      {entry ? null : (
        <section className="compare-pillars" aria-labelledby="compare-pillars-title">
          <h2 id="compare-pillars-title">{compareCopy.pillarsHeading[locale]}</h2>
          <div className="compare-pillars__grid">
            {BOBINE_VALUE_PILLARS.map((pillar) => (
              <article key={pillar.id} className="compare-pillar">
                <h3>{pillar.title[locale]}</h3>
                <p>{pillar.body[locale]}</p>
                {pillar.osIcons ? (
                  <div className="compare-pillar__icons">
                    {pillar.osIcons.map((icon) => <BrandIcon key={icon} name={icon} size={20} />)}
                  </div>
                ) : null}
              </article>
            ))}
          </div>
        </section>
      )}

      {entry ? (
        <div className="compare-split">
          <section className="compare-section" aria-labelledby="compare-criteria">
            <h2 id="compare-criteria"><BrandIcon name={entry.brand} size={28} />{compareCopy.table[locale]}</h2>
            <CompareTable locale={locale} columns={entry.columns} rows={entry.rows.map((row) => ({ label: row.label[locale], values: row.values.map((value) => value[locale]) }))} />
            <ul className="compare-row-sources">
              {entry.rows.filter((row) => row.sources.length).map((row) => (
                <li key={row.label[locale]}>{row.label[locale]} : {row.sources.map((id, index) => <span key={id}>{index > 0 ? "; " : ""}<a href={`#source-${id}`}>{COMPARE_SOURCES[id].label}</a></span>)}</li>
              ))}
            </ul>
          </section>
          <div className="compare-analysis">
            {entry.sections.map((section) => <section key={section.title[locale]}><h2>{section.title[locale]}</h2><p>{section.text[locale]}</p></section>)}
          </div>
        </div>
      ) : (
        <section className="compare-studies" aria-label={locale === "fr" ? "Études comparatives" : "Comparison studies"}>
          {comparisons.map((comparison) => (
            <article key={comparison.slug} className="compare-study">
              <BrandIcon name={comparison.brand} size={32} />
              <h2>{comparison.name}</h2>
              <p className="compare-study__focus">{comparison.focus[locale]}</p>
              <p>{comparison.intro[locale]}</p>
              <Link href={lp(locale, `/comparatif/${comparison.slug}`)} className="btn-secondary">{compareCopy.read[locale]}<Icon name="arrow-right" /></Link>
            </article>
          ))}
        </section>
      )}

      <section className="compare-section" aria-labelledby="compare-sources">
        <h2 id="compare-sources"><Icon name="link" />{compareCopy.sources[locale]}</h2>
        <ul className="compare-sources">
          {sources.map((id) => {
            const source = COMPARE_SOURCES[id];
            return <li key={id} id={`source-${id}`}><a href={source.url} rel="noreferrer">{source.label}<Icon name="external" size={16} /></a><span><time dateTime={source.checked}>{dateFormat.format(new Date(`${source.checked}T00:00:00Z`))}</time></span></li>;
          })}
        </ul>
        <Link href={`/${locale}/documentation`} className="compare-doc-link">{locale === "fr" ? "Documentation des fonctionnalités Bobine" : "Bobine feature documentation"}</Link>
      </section>
      {faq ? (
        <section className="compare-section" aria-labelledby="compare-faq">
          <h2 id="compare-faq">{compareCopy.faq[locale]}</h2>
          <div className="compare-faq">
            {faq.map((item) => <details key={item.q}><summary>{item.q}</summary><p>{item.a}</p></details>)}
          </div>
        </section>
      ) : null}

      <ComparisonNotice locale={locale} />
    </div>
  );
}
