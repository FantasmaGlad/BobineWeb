import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n";
import { IS_ONION } from "@/lib/onion";
import { buildMetadata } from "@/lib/seo";
import HubPage from "@/components/page/HubPage";
import OnionMirrorNotice from "@/components/OnionMirrorNotice";

const TEXT = {
  fr: {
    title: "Matériel compatible avec Bobine : PC, boîtiers et écrans",
    description:
      "Trouvez un mini-PC, un boîtier Android TV ou un écran compatible avec Bobine. Les liens vers les boutiques sont des liens d'affiliation, sans surcoût pour vous.",
    keywords: ["matériel Bobine", "mini-PC", "boîtier Android TV", "écran compatible"],
    lead: "Un ordinateur, un boîtier Android TV ou un mini-PC suffit pour diffuser vos cours sur un écran ou un vidéoprojecteur. Cette section regroupe des sélections de matériel dont les caractéristiques correspondent à ce que Bobine demande.",
    note: "Les liens vers les boutiques sont des liens d'affiliation : bobine.fit perçoit une commission sur les achats éligibles, sans surcoût pour vous. Les prix et la disponibilité sont à vérifier sur la boutique ; Bobine ne vend rien.",
    gridTitle: "Sélections de matériel",
  },
  en: {
    title: "Hardware that works with Bobine: PCs, boxes and displays",
    description:
      "Find a mini PC, an Android TV box or a display that works with Bobine. Links to stores are affiliate links, at no extra cost to you.",
    keywords: ["Bobine hardware", "mini PC", "Android TV box", "compatible display"],
    lead: "A computer, an Android TV box or a mini PC is enough to play your classes on a screen or a projector. This section gathers hardware selections whose specifications match what Bobine needs.",
    note: "Links to stores are affiliate links: bobine.fit earns a commission on eligible purchases, at no extra cost to you. Check prices and availability on the store; Bobine sells nothing.",
    gridTitle: "Hardware selections",
  },
} as const;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = TEXT[locale];
  return buildMetadata({ locale, pathname: "/materiel", title: t.title, description: t.description, keywords: [...t.keywords] });
}

export default async function HardwarePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  if (IS_ONION) {
    return <OnionMirrorNotice locale={locale} topic="materiel" clearnetPath="/materiel" />;
  }
  const t = TEXT[locale];
  return (
    <HubPage locale={locale as Locale} id="hardware" lead={t.lead} gridTitle={t.gridTitle}>
      <p className="pg-note">{t.note}</p>
    </HubPage>
  );
}
