"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import type { Dictionary, Locale } from "@/lib/i18n";
import GitHubIcon from "@/components/icons/GitHubIcon";

export default function Footer({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const pathname = usePathname();
  const isEn = locale === "en";

  // Masquer le footer sur l'écran de démo 3D pour préserver la scène immersive plein écran
  if (pathname && pathname.includes("/demo-3d")) {
    return null;
  }

  return (
    <footer className="site-footer">
      <div className="site-footer__inner" style={{ display: "flex", flexDirection: "column", gap: "1.25rem", width: "100%" }}>
        {/* Grille principale du Footer */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
            gap: "1.25rem",
            width: "100%",
          }}
        >
          {/* Colonne 1 : Identité & Marque */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem" }}>
            <Link href={`/${locale}`} aria-label="Bobine - Accueil" style={{ display: "inline-block" }}>
              <Image
                src="/logo-bobine.png"
                alt="Bobine"
                width={100}
                height={37}
                style={{ filter: "var(--logo-filter)", width: "auto", height: "36px" }}
              />
            </Link>
            <p style={{ fontSize: "0.825rem", color: "var(--text-muted)", lineHeight: 1.4, margin: 0 }}>
              {isEn
                ? "The free, self-hosted, 100% offline video playout and gym streaming system."
                : "La régie vidéo et système de streaming libre, auto-hébergé et 100% hors-ligne pour salles de sport."}
            </p>
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600 }}>
              {dict.footer.tagline}
            </span>
          </div>

          {/* Colonne 2 : Navigation */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
            <span style={{ fontSize: "0.775rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-heading)" }}>
              {isEn ? "Navigation" : "Navigation"}
            </span>
            <Link href={`/${locale}`} style={{ fontSize: "0.825rem", color: "var(--text-muted)", textDecoration: "none" }}>
              {dict.nav.home}
            </Link>
            <Link href={`/${locale}/fonctionnalites`} style={{ fontSize: "0.825rem", color: "var(--text-muted)", textDecoration: "none" }}>
              {dict.nav.features}
            </Link>
            <Link href={`/${locale}/demo-3d`} style={{ fontSize: "0.825rem", color: "var(--text-muted)", textDecoration: "none" }}>
              {dict.nav.demo}
            </Link>
            <Link href={`/${locale}/documentation`} style={{ fontSize: "0.825rem", color: "var(--text-muted)", textDecoration: "none" }}>
              {dict.nav.documentation}
            </Link>
            <Link href={`/${locale}/blog`} style={{ fontSize: "0.825rem", color: "var(--text-muted)", textDecoration: "none" }}>
              {dict.nav.blog}
            </Link>
          </div>

          {/* Colonne 3 : Comparatifs & Alternatives (SEO) */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
            <span style={{ fontSize: "0.775rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-heading)" }}>
              {isEn ? "Comparisons & Alternatives" : "Comparatifs & Alternatives"}
            </span>
            <Link href={`/${locale}/comparatif/les-mills-cinema`} style={{ fontSize: "0.825rem", color: "var(--text-muted)", textDecoration: "none" }}>
              vs Les Mills Cinema
            </Link>
            <Link href={`/${locale}/comparatif/wexer-fitness-on-demand`} style={{ fontSize: "0.825rem", color: "var(--text-muted)", textDecoration: "none" }}>
              vs Wexer & FOD
            </Link>
            <Link href={`/${locale}/comparatif/radical-fitness-yako`} style={{ fontSize: "0.825rem", color: "var(--text-muted)", textDecoration: "none" }}>
              vs Radical Fitness & Yako
            </Link>
            <Link href={`/${locale}/comparatif/affichage-dynamique-fitness`} style={{ fontSize: "0.825rem", color: "var(--text-muted)", textDecoration: "none" }}>
              vs Affichage Dynamique
            </Link>
          </div>

          {/* Colonne 4 : Ressources & Communauté */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
            <span style={{ fontSize: "0.775rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-heading)" }}>
              {isEn ? "Community & Legal" : "Communauté & Légal"}
            </span>
            <a
              href="https://github.com/FantasmaGlad/Bobine"
              target="_blank"
              rel="noreferrer"
              style={{ fontSize: "0.825rem", color: "var(--text-muted)", textDecoration: "none", display: "flex", alignItems: "center", gap: "0.4rem" }}
            >
              <GitHubIcon size={13} />
              <span>{dict.footer.github}</span>
            </a>
            <Link href={`/${locale}/soutenir`} style={{ fontSize: "0.825rem", color: "var(--text-muted)", textDecoration: "none" }}>
              {dict.nav.support}
            </Link>
            <Link href={`/${locale}/a-propos`} style={{ fontSize: "0.825rem", color: "var(--text-muted)", textDecoration: "none" }}>
              {dict.nav.about}
            </Link>
            <Link href={`/${locale}/mentions-legales`} style={{ fontSize: "0.825rem", color: "var(--text-muted)", textDecoration: "none" }}>
              {dict.footer.legal}
            </Link>
            <Link href={`/${locale}/confidentialite`} style={{ fontSize: "0.825rem", color: "var(--text-muted)", textDecoration: "none" }}>
              {dict.footer.privacy}
            </Link>
          </div>
        </div>

        {/* Ligne inférieure */}
        <div style={{ borderTop: "1px solid var(--border-subtle)", paddingTop: "0.75rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem", fontSize: "0.75rem", color: "var(--text-muted)" }}>
          <span>© {new Date().getFullYear()} Bobine · {isEn ? "All rights reserved" : "Tous droits réservés"} · AGPL-3.0</span>
          <span>bobine.fit</span>
        </div>
      </div>
    </footer>
  );
}
