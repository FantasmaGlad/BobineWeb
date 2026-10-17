"use client";

import Link from "next/link";
import Image from "next/image";
import type { Dictionary, Locale } from "@/lib/i18n";
import GitHubIcon from "@/components/icons/GitHubIcon";
import { TOR_PROJECT_URL, TOR_SOURCE_URL } from "@/lib/onion";
import { lp } from "@/lib/seo";

export default function Footer({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const isEn = locale === "en";

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
                src="/logo_bobine_entier.png"
                alt="Bobine"
                width={130}
                height={48}
                style={{ filter: "var(--logo-filter)", width: "auto", height: "36px" }}
              />
            </Link>
            <p style={{ fontSize: "0.825rem", color: "var(--text-muted)", lineHeight: 1.4, margin: 0 }}>
              {isEn
                ? "The free, self-hosted, 100% offline video playout and gym streaming system."
                : "La régie vidéo et système de streaming libre, auto-hébergé et 100% hors-ligne pour salles de sport."}
            </p>
          </div>

          {/* Colonne 2 : Navigation */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
            <span style={{ fontSize: "0.775rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-heading)" }}>
              {isEn ? "Navigation" : "Navigation"}
            </span>
            <Link href={`/${locale}`} style={{ fontSize: "0.825rem", color: "var(--text-muted)", textDecoration: "none" }}>
              {dict.nav.home}
            </Link>
            <Link href={lp(locale, `/fonctionnalites`)} style={{ fontSize: "0.825rem", color: "var(--text-muted)", textDecoration: "none" }}>
              {dict.nav.features}
            </Link>
            <Link href={lp(locale, `/materiel/amazon`)} style={{ fontSize: "0.825rem", color: "var(--text-muted)", textDecoration: "none" }}>
              {dict.nav.hardware}
            </Link>
            <Link href={`/${locale}/baamix`} style={{ fontSize: "0.825rem", color: "var(--text-muted)", textDecoration: "none" }}>
              {isEn ? "Baamix AI assistant" : "Assistant IA Baamix"}
            </Link>
            <Link href={`/${locale}/documentation`} style={{ fontSize: "0.825rem", color: "var(--text-muted)", textDecoration: "none" }}>
              {dict.nav.documentation}
            </Link>
            <Link href={`/${locale}/blog`} style={{ fontSize: "0.825rem", color: "var(--text-muted)", textDecoration: "none" }}>
              {dict.nav.blog}
            </Link>
            <Link href={lp(locale, "/nouveautes")} style={{ fontSize: "0.825rem", color: "var(--text-muted)", textDecoration: "none" }}>
              {isEn ? "What's new" : "Nouveautés"}
            </Link>
            <Link href={lp(locale, "/canaux")} style={{ fontSize: "0.825rem", color: "var(--text-muted)", textDecoration: "none" }}>
              {isEn ? "Update channels" : "Canaux de mise à jour"}
            </Link>
            <Link href={lp(locale, "/android-tv")} style={{ fontSize: "0.825rem", color: "var(--text-muted)", textDecoration: "none" }}>
              {isEn ? "Android TV" : "Android TV"}
            </Link>
            <Link href={lp(locale, "/google-book")} style={{ fontSize: "0.825rem", color: "var(--text-muted)", textDecoration: "none" }}>
              {isEn ? "Google Book" : "Google Book"}
            </Link>
            <Link href={lp(locale, "/tor")} style={{ fontSize: "0.825rem", color: "var(--text-muted)", textDecoration: "none" }}>
              {isEn ? "Tor (.onion)" : "Tor (.onion)"}
            </Link>
          </div>

          {/* Colonne 3 : Comparatifs & Alternatives (SEO) */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
            <span style={{ fontSize: "0.775rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-heading)" }}>
              {isEn ? "Comparisons & Alternatives" : "Comparatifs & Alternatives"}
            </span>
            <Link href={lp(locale, `/comparatif/les-mills-cinema`)} style={{ fontSize: "0.825rem", color: "var(--text-muted)", textDecoration: "none" }}>
              Les Mills Cinema
            </Link>
            <Link href={lp(locale, `/comparatif/wexer-fitness-on-demand`)} style={{ fontSize: "0.825rem", color: "var(--text-muted)", textDecoration: "none" }}>
              Wexer & FOD
            </Link>
            <Link href={lp(locale, `/comparatif/radical-fitness-yako`)} style={{ fontSize: "0.825rem", color: "var(--text-muted)", textDecoration: "none" }}>
              Radical Fitness & Yako
            </Link>
            <Link href={lp(locale, `/comparatif/affichage-dynamique-fitness`)} style={{ fontSize: "0.825rem", color: "var(--text-muted)", textDecoration: "none" }}>
              Affichage Dynamique
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
            <a
              href="https://alternativeto.net/software/fantasmaglad-bobine/"
              target="_blank"
              rel="noreferrer"
              style={{ fontSize: "0.825rem", color: "var(--text-muted)", textDecoration: "none" }}
            >
              AlternativeTo
            </a>
            <a
              href="https://www.linkedin.com/in/clement-barillot39"
              target="_blank"
              rel="noreferrer"
              style={{ fontSize: "0.825rem", color: "var(--text-muted)", textDecoration: "none" }}
            >
              LinkedIn
            </a>
            <a
              href="mailto:clement.barillot@bobine.fit"
              style={{ fontSize: "0.825rem", color: "var(--text-muted)", textDecoration: "none" }}
            >
              {isEn ? "Contact by email" : "Contact par e-mail"}
            </a>
            <Link href={lp(locale, `/soutenir`)} style={{ fontSize: "0.825rem", color: "var(--text-muted)", textDecoration: "none" }}>
              {dict.nav.support}
            </Link>
            <Link href={lp(locale, `/a-propos`)} style={{ fontSize: "0.825rem", color: "var(--text-muted)", textDecoration: "none" }}>
              {dict.nav.about}
            </Link>
            <Link href={lp(locale, `/mentions-legales`)} style={{ fontSize: "0.825rem", color: "var(--text-muted)", textDecoration: "none" }}>
              {dict.footer.legal}
            </Link>
            <Link href={lp(locale, `/confidentialite`)} style={{ fontSize: "0.825rem", color: "var(--text-muted)", textDecoration: "none" }}>
              {dict.footer.privacy}
            </Link>
            <Link href={lp(locale, `/securite`)} style={{ fontSize: "0.825rem", color: "var(--text-muted)", textDecoration: "none" }}>
              {isEn ? "Security" : "Sécurité"}
            </Link>
          </div>
        </div>

        {/* Ligne inférieure */}
        <div style={{ borderTop: "1px solid var(--border-subtle)", paddingTop: "0.75rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem", fontSize: "0.75rem", color: "var(--text-muted)" }}>
          <span>© {new Date().getFullYear()} Bobine · {isEn ? "All rights reserved" : "Tous droits réservés"} · AGPL-3.0</span>
          <span>
            {isEn ? "Supporting the " : "Soutien au "}
            <a href={TOR_PROJECT_URL} target="_blank" rel="noopener noreferrer" style={{ color: "inherit", textDecoration: "underline", textUnderlineOffset: "0.2em" }}>
              {isEn ? "Tor Project" : "projet Tor"}
            </a>
            {" · "}
            <a href={TOR_SOURCE_URL} target="_blank" rel="noopener noreferrer" style={{ color: "inherit", textDecoration: "underline", textUnderlineOffset: "0.2em" }}>
              {isEn ? "source code" : "code source"}
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
