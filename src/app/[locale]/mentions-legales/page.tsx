import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n";

const copy = {
  fr: {
    title: "Mentions légales",
    sections: [
      ["Éditeur du site", "Fanta — contact : clement.barillot3901@gmail.com"],
      ["Hébergeur", "Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis — vercel.com"],
      ["Nature du site", "Bobine.fit est un site vitrine et de documentation pour le logiciel libre Bobine (licence AGPL-3.0). Le site n'est pas une activité commerciale : aucune vente, aucun compte utilisateur."],
    ],
  },
  en: {
    title: "Legal notice",
    sections: [
      ["Site publisher", "Fanta — contact: clement.barillot3901@gmail.com"],
      ["Hosting provider", "Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, USA — vercel.com"],
      ["Nature of the site", "Bobine.fit is a showcase and documentation site for the free software Bobine (AGPL-3.0 license). The site is not a commercial activity: no sales, no user accounts."],
    ],
  },
} as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return { title: copy[locale].title };
}

export default async function LegalNoticePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = copy[locale as Locale];

  return (
    <div className="container" style={{ paddingBlock: "3rem", maxWidth: "40rem" }}>
      <h1>{t.title}</h1>
      {t.sections.map(([heading, body]) => (
        <section key={heading} style={{ marginBlock: "1.5rem" }}>
          <h2 style={{ fontSize: "1.1rem" }}>{heading}</h2>
          <p style={{ color: "var(--text-muted)" }}>{body}</p>
        </section>
      ))}
    </div>
  );
}
