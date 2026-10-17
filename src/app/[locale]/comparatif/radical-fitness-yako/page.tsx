import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n";
import { buildMetadata, lp } from "@/lib/seo";
import ShareButton from "@/components/ShareButton";
import BreadcrumbsJsonLd from "@/components/BreadcrumbsJsonLd";
import FaqJsonLd from "@/components/FaqJsonLd";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const isEn = locale === "en";

  return buildMetadata({
    locale: locale as Locale,
    pathname: "/comparatif/radical-fitness-yako",
    title: isEn
      ? "Alternative to Radical Fitness & Franchise Systems (Yako) — Open Playout for Gyms"
      : "Alternative à Radical Fitness & Cours de Franchise (Yako) — Régie Libre pour Studios Indépendants",
    description: isEn
      ? "Compare Radical Fitness and franchise-tied virtual programs with Bobine. Broadcast custom workout videos, indoor cycling, and HIIT with zero franchise fees and complete catalog freedom."
      : "Comparatif complet entre Radical Fitness, les cours de franchise (Yako) et Bobine. Diffusez vos propres cours de cycling, HIIT et renfo sans redevance de franchise et avec une liberté totale de catalogue.",
    keywords: [
      "Alternative Radical Fitness",
      "Alternative cours Yako",
      "Cours virtuels sans franchise",
      "Logiciel cycling indoor indépendant",
      "Alternative Top Ride Radical Fitness",
      "Diffusion vidéo salle de sport indépendante",
      "Bobine vs Radical Fitness",
    ],
  });
}

const CONTENT = {
  fr: {
    breadcrumb: "Comparatifs / Radical Fitness & Yako",
    badge: "Étude Franchise & Catalogues",
    title: "Bobine face à Radical Fitness & aux Programmes de Franchise (Yako)",
    subtitle:
      "Comment offrir une expérience de cours virtuels de qualité franchise à vos adhérents sans payer de redevance mensuelle ni être enfermé dans un catalogue imposé ?",
    summaryCards: [
      { label: "Liberté de Catalogue", value: "100% Ouvert", desc: "Importez n'importe quel cours MP4/MKV" },
      { label: "Redevance de Marque", value: "0 € / an", desc: "Zéro affiliation franchise requise" },
      { label: "Catégories de Cours", value: "Sur Mesure", desc: "Cycling, HIIT, Yoga, Pilates, Renfo..." },
      { label: "Télécommande Salle", value: "Web App + USB", desc: "Pilotez au smartphone ou à la télécommande" },
    ],
    table: {
      title: "Tableau Comparatif & Flexibilité",
      headers: ["Critère d'Évaluation", "Bobine (Agnostique & Libre)", "Radical Fitness & Yako (Franchises)"],
      rows: [
        {
          criterion: "Accessibilité aux Clubs Indépendants",
          bobine: "Ouvert à tous (Téléchargement libre immédiat)",
          competitor: "Yako réservé aux franchisés / Radical sous contrat de diffusion",
        },
        {
          criterion: "Liberté d'Import des Vidéos",
          bobine: "Glisser-déposer illimité de vos propres vidéos (MP4, MKV, WebM)",
          competitor: "Verrouillé aux contenus exclusifs fournis par l'enseigne",
        },
        {
          criterion: "Coût de Redevance Annuelle",
          bobine: "0 € / an (Code open-source AGPL-3.0)",
          competitor: "Inclus dans les royalties de franchise ou forfait mensuel",
        },
        {
          criterion: "Mise en Avant de Votre Marque",
          bobine: "Vos coachs, votre identité visuelle, vos couleurs",
          competitor: "Mise en avant obligatoire de la marque franchise ou du fournisseur",
        },
        {
          criterion: "Pilotage Hors-Ligne en Salle",
          bobine: "100% Autonome sur mini PC local sans coupure",
          competitor: "Selon solution de diffusion imposée par l'enseigne",
        },
        {
          criterion: "Télécommande Coach sans Application",
          bobine: "Scan QR code Wi-Fi local instantané (aucune application à installer)",
          competitor: "Rarement pris en charge de manière native",
        },
        {
          criterion: "Ambiance Musicale Continue",
          bobine: "Radio 24/7 avec fondu sonore et rappels de bienséance",
          competitor: "Non inclus (Nécessite un abonnement sono séparé)",
        },
      ],
    },
    sections: [
      {
        title: "1. Sortir du carcan des franchises et des marques imposées",
        text: "Des concepts comme Yako (L'Orange Bleue) ou Radical Fitness apportent des cours chorégraphiés clés en main, mais lient les gérants à un écosystème fermé. Pour un gérant de club indépendant ou un coach qui crée ses propres concepts, acheter une franchise n'a aucun sens économique. Bobine permet de créer sa propre chaîne de cours virtuels avec une qualité de diffusion identique.",
      },
      {
        title: "2. Valoriser vos propres coachs et contenus vidéo",
        text: "Avec Bobine, vos adhérents s'entraînent avec les visages et les voix de votre équipe. Vous pouvez filmer vos coachs résidents en studio ou intégrer des cours vidéo libres de droits en haute définition. L'importation s'effectue en quelques secondes par glisser-déposer depuis l'interface web, avec génération automatique des vignettes et des durées.",
      },
      {
        title: "3. Une régie polyvalente : cycling, renforcement, bien-être",
        text: "Bobine ne vous enferme pas dans une discipline unique. Configurez un studio de cycling immersif avec compte à rebours d'échauffement le matin, basculez en cours de mobilité l'après-midi, et activez la radio d'ambiance 24/7 sur le plateau le soir. Le tout est orchestré automatiquement par le planificateur hebdomadaire.",
      },
    ],
    cta: {
      title: "Créez votre propre régie vidéo dès aujourd'hui",
      desc: "Téléchargez Bobine, branchez votre mini PC à l'écran de votre salle et profitez d'une solution sur mesure sans redevance.",
      btnInstall: "Tutoriel d'installation",
      btnFeatures: "Découvrir les fonctionnalités",
    },
  },
  en: {
    breadcrumb: "Comparisons / Radical Fitness & Yako",
    badge: "Franchise & Content Analysis",
    title: "Bobine vs Radical Fitness & Franchise Systems",
    subtitle:
      "How independent gym owners can deliver franchise-grade virtual fitness classes without paying royalties or accepting rigid catalog lock-in.",
    summaryCards: [
      { label: "Content Freedom", value: "100% Open", desc: "Import any MP4 or MKV workout video" },
      { label: "Franchise Royalty", value: "$0 / year", desc: "No franchise affiliation required" },
      { label: "Workout Categories", value: "Fully Custom", desc: "Cycling, HIIT, Yoga, Pilates, Strength..." },
      { label: "In-Studio Remote", value: "Web App + USB", desc: "Control via smartphone or wireless remote" },
    ],
    table: {
      title: "Flexibility & Independence Comparison",
      headers: ["Evaluation Metric", "Bobine (Agnostic & Free)", "Radical Fitness & Franchise Programs"],
      rows: [
        {
          criterion: "Access for Independent Gyms",
          bobine: "Open to everyone (Free immediate download)",
          competitor: "Restricted to franchisees or tied commercial contracts",
        },
        {
          criterion: "Video Import Freedom",
          bobine: "Unlimited drag-and-drop for your custom videos (MP4, MKV)",
          competitor: "Locked to proprietary releases provided by the vendor",
        },
        {
          criterion: "Annual Royalty Overhead",
          bobine: "$0 / year (Open-source AGPL-3.0)",
          competitor: "Baked into franchise royalties or monthly subscription",
        },
        {
          criterion: "Brand Ownership",
          bobine: "Your coaches, your visual identity, your gym brand",
          competitor: "Mandatory promotion of third-party franchise brand",
        },
        {
          criterion: "Offline Studio Playout",
          bobine: "100% Autonomous on budget mini PC without outages",
          competitor: "Subject to vendor hardware and cloud requirements",
        },
        {
          criterion: "App-Free Coach Remote",
          bobine: "Instant local Wi-Fi QR scan (nothing to install)",
          competitor: "Rarely supported natively",
        },
        {
          criterion: "Continuous Background Audio",
          bobine: "Built-in 24/7 radio with crossfade & voice announcements",
          competitor: "Not included (Requires separate gym music service)",
        },
      ],
    },
    sections: [
      {
        title: "1. Breaking Free from Franchise Lock-in",
        text: "Franchise concepts provide turn-key workouts but lock club owners into expensive licensing structures. For independent gyms, boutique studios, and hotels, buying into a commercial franchise makes little financial sense. Bobine enables operators to build their own custom virtual fitness channel with equal or superior production reliability.",
      },
      {
        title: "2. Elevate Your Own Trainers and Custom Content",
        text: "With Bobine, gym members connect directly with your resident instructors. Record high-definition workouts in your own studio or license open fitness content. Uploading videos takes seconds via drag-and-drop in the web administration panel, with automatic thumbnail generation and metadata detection.",
      },
      {
        title: "3. Versatile Multi-Discipline Studio Management",
        text: "Bobine adapts to any fitness space. Power an immersive indoor cycling room with warm-up countdowns in the morning, schedule mobility and yoga in the afternoon, and run 24/7 background gym audio at night. Everything runs autonomously through the weekly scheduler.",
      },
    ],
    cta: {
      title: "Deploy your sovereign fitness studio today",
      desc: "Download Bobine, connect your mini PC to your studio TV, and enjoy a custom video playout suite with zero royalties.",
      btnInstall: "Installation Guide",
      btnFeatures: "Explore Features",
    },
  },
} as const;

export default async function RadicalComparisonPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const c = CONTENT[locale as Locale];
  const isEn = locale === "en";
  const breadcrumbs = [
    { name: isEn ? "Home" : "Accueil", url: `/${locale}` },
    { name: isEn ? "Comparisons" : "Comparatifs", url: lp(locale, `/comparatif`) },
    { name: "Radical Fitness & Yako", url: lp(locale, `/comparatif/radical-fitness-yako`) },
  ];

  const faqItems = [
    {
      category: "compare" as const,
      q: isEn
        ? "Can independent gym clubs access franchise virtual programs like Yako or Radical Fitness?"
        : "Les clubs indépendants peuvent-ils accéder aux cours de franchise comme Yako ou Radical Fitness ?",
      a: isEn
        ? "No. Proprietary franchise programs (such as Yako for L'Orange Bleue) are strictly reserved for franchisees, while Radical Fitness requires paying distribution contracts. Bobine empowers independent gym owners to broadcast their own professional courses without needing any franchise affiliation or licensing fee."
        : "Non. Les programmes de franchise (comme Yako pour L'Orange Bleue) sont réservés aux franchisés, tandis que Radical Fitness exige des contrats de licence payants. Bobine permet aux gérants de salles indépendantes de diffuser leurs propres cours professionnels sans affiliation de franchise ni redevance.",
    },
    {
      category: "compare" as const,
      q: isEn
        ? "What video formats and quality levels does Bobine support for gym classes?"
        : "Quels formats et résolutions vidéo Bobine prend-il en charge pour les cours ?",
      a: isEn
        ? "Bobine supports MP4, MKV, and WebM video containers with modern H.264 and HEVC/H.265 codecs, up to 4K resolution at 60 fps with crystal-clear 5.1/7.1 surround sound, thanks to hardware acceleration (VA-API, QuickSync, MediaCodec)."
        : "Bobine prend en charge les formats MP4, MKV et WebM avec les codecs H.264 et HEVC/H.265 jusqu'à la résolution 4K à 60 fps avec son stéréo ou surround 5.1/7.1, grâce à l'accélération matérielle native (VA-API, QuickSync, MediaCodec).",
    },
    {
      category: "compare" as const,
      q: isEn
        ? "Can independent studios build their own cycling, HIIT, or yoga catalog?"
        : "Les studios indépendants peuvent-ils créer leur propre catalogue de cycling, HIIT ou yoga ?",
      a: isEn
        ? "Absolutely. Clubs can record their own star coaches, license independent fitness videos, or buy one-off professional productions. With Bobine, there are zero catalog expirations and zero mandatory curriculum updates."
        : "Absolument. Les clubs peuvent filmer leurs propres coachs vedettes, acheter des productions vidéo professionnelles à l'unité ou diffuser des vidéos libres. Avec Bobine, aucun cours n'expire et aucune programmation n'est imposée.",
    },
    {
      category: "compare" as const,
      q: isEn
        ? "Is there an upfront cost or monthly charge for Bobine?"
        : "Quel est le coût d'achat ou d'abonnement de Bobine ?",
      a: isEn
        ? "Bobine is 100% free open-source software distributed under the GNU AGPL-3.0 license. There are zero upfront costs, zero monthly subscriptions, and zero per-screen charges. You only provide standard hardware (a ~€40-€80 mini PC and a screen)."
        : "Bobine est un logiciel 100% libre et gratuit sous licence GNU AGPL-3.0. Il n'y a aucun coût d'achat, aucun abonnement mensuel et aucun frais par écran. Vous fournissez simplement le matériel standard (un mini PC à 40-80 € et un écran).",
    },
  ];

  return (
    <>
      <BreadcrumbsJsonLd items={breadcrumbs} />
      <FaqJsonLd items={faqItems} />

      {/* En-tête */}
      <header style={{ paddingTop: "1rem", paddingBottom: "2rem", maxWidth: "860px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "0.75rem",
            flexWrap: "wrap",
            marginBottom: "0.75rem",
          }}
        >
          <span className="feature-category-label">{c.badge}</span>
          <ShareButton
            locale={locale as Locale}
            pathname="/comparatif/radical-fitness-yako"
            title={c.title}
            description={c.subtitle}
          />
        </div>
        <h1 style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.75rem)", fontWeight: 800, marginTop: "0.5rem", marginBottom: "1rem", color: "var(--text-heading)", lineHeight: 1.2 }}>
          {c.title}
        </h1>
        <p style={{ fontSize: "1.1rem", color: "var(--text-muted)", lineHeight: 1.6 }}>
          {c.subtitle}
        </p>
      </header>

      {/* Cartes Chiffres Clés */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem", marginBottom: "3rem" }}>
        {c.summaryCards.map((sc, idx) => (
          <div
            key={idx}
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "0.75rem",
              padding: "1.25rem",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <span style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)" }}>
              {sc.label}
            </span>
            <div style={{ fontSize: "1.45rem", fontWeight: 800, color: "var(--accent-primary)", margin: "0.35rem 0" }}>
              {sc.value}
            </div>
            <p style={{ fontSize: "0.825rem", color: "var(--text-body)", margin: 0 }}>
              {sc.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Tableau Comparatif */}
      <section style={{ marginBottom: "3.5rem" }}>
        <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--text-heading)", marginBottom: "1.25rem" }}>
          {c.table.title}
        </h2>
        <div className="comparison-table-wrapper">
          <table className="comparison-table">
            <thead>
              <tr>
                <th scope="col" className="col-feature">{c.table.headers[0]}</th>
                <th scope="col" className="col-bobine">
                  <strong>{c.table.headers[1]}</strong>
                  <span>{isEn ? "Open & Unrestricted" : "Libre & Agnostique"}</span>
                </th>
                <th scope="col" className="col-proprietary">
                  <strong>{c.table.headers[2]}</strong>
                  <span>{isEn ? "Franchise Tied" : "Franchises & Forfaits"}</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {c.table.rows.map((r, rIdx) => (
                <tr key={rIdx}>
                  <td className="cell-feature">{r.criterion}</td>
                  <td className="cell-bobine">
                    <div className="cell-bobine-content">
                      <svg className="icon-check" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <strong>{r.bobine}</strong>
                    </div>
                  </td>
                  <td className="cell-proprietary">{r.competitor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Sections d'analyse textuelle */}
      <section style={{ display: "flex", flexDirection: "column", gap: "2rem", marginBottom: "3.5rem", maxWidth: "860px" }}>
        {c.sections.map((sec, sIdx) => (
          <article key={sIdx} style={{ background: "var(--bg-surface)", border: "1px solid var(--border-subtle)", borderRadius: "0.85rem", padding: "1.75rem" }}>
            <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--text-heading)", marginBottom: "0.75rem" }}>
              {sec.title}
            </h3>
            <p style={{ fontSize: "0.95rem", color: "var(--text-body)", lineHeight: 1.65, margin: 0 }}>
              {sec.text}
            </p>
          </article>
        ))}
      </section>

      {/* Foire Aux Questions (FAQ) — visible pour l'utilisateur & Rich Results Google */}
      <section style={{ marginBottom: "3.5rem", maxWidth: "860px" }}>
        <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--text-heading)", marginBottom: "1.25rem" }}>
          {isEn ? "Frequently Asked Questions" : "Questions Fréquentes"}
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {faqItems.map((item, idx) => (
            <details
              key={idx}
              style={{
                background: "var(--bg-surface)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "0.75rem",
                padding: "1rem 1.25rem",
              }}
            >
              <summary
                style={{
                  fontWeight: 600,
                  fontSize: "1.05rem",
                  color: "var(--text-heading)",
                  cursor: "pointer",
                  outline: "none",
                }}
              >
                {item.q}
              </summary>
              <p
                style={{
                  marginTop: "0.75rem",
                  marginBottom: 0,
                  fontSize: "0.95rem",
                  color: "var(--text-body)",
                  lineHeight: 1.6,
                }}
              >
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </section>

      {/* Bloc CTA */}
      <section style={{ background: "var(--bg-card)", border: "1px solid var(--border-subtle)", borderRadius: "1rem", padding: "2.5rem 2rem", textAlign: "center", maxWidth: "860px" }}>
        <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--text-heading)", marginBottom: "0.75rem" }}>
          {c.cta.title}
        </h2>
        <p style={{ fontSize: "1rem", color: "var(--text-muted)", marginBottom: "1.5rem", maxWidth: "600px", margin: "0 auto 1.5rem auto" }}>
          {c.cta.desc}
        </p>
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          <Link href={`/${locale}/documentation`} className="btn-primary">
            {c.cta.btnInstall}
          </Link>
          <Link href={lp(locale, `/fonctionnalites`)} className="btn-secondary">
            {c.cta.btnFeatures}
          </Link>
        </div>
      </section>
    </>
  );
}
