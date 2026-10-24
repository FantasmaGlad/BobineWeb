"use client";

import Link from "next/link";
import Image from "next/image";
import type { Dictionary, Locale } from "@/lib/i18n";
import GitHubIcon from "@/components/icons/GitHubIcon";
import { TOR_PROJECT_URL, TOR_SOURCE_URL } from "@/lib/onion";
import { lp } from "@/lib/seo";
import "@/styles/split/site-chrome.css";

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
      <div className="site-footer__inner site-div-1">
        {/* Grille principale du Footer */}
        <div className="site-div-2"
        >
          {/* Colonne 1 : Identité & Marque */}
          <div className="site-div-3">
            <Link href={`/${locale}`} aria-label="Bobine - Accueil" className="site-link-1">
              <Image
                src="/logo_bobine_entier.png"
                alt="Bobine"
                width={130}
                height={48} className="site-image-1"
              />
            </Link>
            <p className="site-p-1">
              {isEn
                ? "The free, self-hosted, 100% offline video playout and gym streaming system."
                : "La régie vidéo et système de streaming libre, auto-hébergé et 100% hors-ligne pour salles de sport."}
            </p>
          </div>

          {/* Colonne 2 : Navigation */}
          <div className="site-div-4">
            <span className="site-span-1">
              {isEn ? "Navigation" : "Navigation"}
            </span>
            <Link href={`/${locale}`} className="site-link-2">
              {dict.nav.home}
            </Link>
            <Link href={lp(locale, `/fonctionnalites`)} className="site-link-2">
              {dict.nav.features}
            </Link>
            <Link href={lp(locale, `/materiel/aliexpress`)} className="site-link-2">
              {dict.nav.hardware}
            </Link>
            <Link href={`/${locale}/baamix`} className="site-link-2">
              {isEn ? "Baamix AI assistant" : "Assistant IA Baamix"}
            </Link>
            <Link href={`/${locale}/documentation`} className="site-link-2">
              {dict.nav.documentation}
            </Link>
            <Link href={`/${locale}/blog`} className="site-link-2">
              {dict.nav.blog}
            </Link>
            <Link href={lp(locale, "/nouveautes")} className="site-link-2">
              {isEn ? "What's new" : "Nouveautés"}
            </Link>
            <Link href={lp(locale, "/canaux")} className="site-link-2">
              {isEn ? "Update channels" : "Canaux de mise à jour"}
            </Link>
            <Link href={lp(locale, "/ordinateur")} className="site-link-2">
              {isEn ? "PC & Mac" : "Ordinateur (PC & Mac)"}
            </Link>
            <Link href={lp(locale, "/linux")} className="site-link-2">
              Linux
            </Link>
            <Link href={lp(locale, "/android-tv")} className="site-link-2">
              {isEn ? "Android TV" : "Android TV"}
            </Link>
            <Link href={lp(locale, "/google-book")} className="site-link-2">
              {isEn ? "Google Book" : "Google Book"}
            </Link>
            <Link href={lp(locale, "/tor")} className="site-link-2">
              {isEn ? "Tor (.onion)" : "Tor (.onion)"}
            </Link>
          </div>

          {/* Colonne 3 : Comparatifs & Alternatives (SEO) */}
          <div className="site-div-4">
            <span className="site-span-1">
              {isEn ? "Comparisons & Alternatives" : "Comparatifs & Alternatives"}
            </span>
            <Link href={lp(locale, `/comparatif/les-mills-cinema`)} className="site-link-2">
              Les Mills Cinema
            </Link>
            <Link href={lp(locale, `/comparatif/wexer-fitness-on-demand`)} className="site-link-2">
              Wexer & FOD
            </Link>
            <Link href={lp(locale, `/comparatif/radical-fitness-yako`)} className="site-link-2">
              Radical Fitness & Yako
            </Link>
            <Link href={lp(locale, `/comparatif/affichage-dynamique-fitness`)} className="site-link-2">
              Affichage Dynamique
            </Link>
          </div>

          {/* Colonne 4 : Ressources & Communauté */}
          <div className="site-div-4">
            <span className="site-span-1">
              {isEn ? "Community & Legal" : "Communauté & Légal"}
            </span>
            <a
              href="https://github.com/FantasmaGlad/Bobine"
              target="_blank"
              rel="noreferrer" className="site-a-1"
            >
              <GitHubIcon size={13} />
              <span>{dict.footer.github}</span>
            </a>
            <a
              href="https://alternativeto.net/software/fantasmaglad-bobine/"
              target="_blank"
              rel="noreferrer" className="site-link-2"
            >
              AlternativeTo
            </a>
            <a
              href="https://www.linkedin.com/in/clement-barillot39"
              target="_blank"
              rel="noreferrer" className="site-link-2"
            >
              LinkedIn
            </a>
            <a
              href="mailto:clement.barillot@bobine.fit" className="site-link-2"
            >
              {isEn ? "Contact by email" : "Contact par e-mail"}
            </a>
            <Link href={lp(locale, `/soutenir`)} className="site-link-2">
              {dict.nav.support}
            </Link>
            <Link href={lp(locale, `/a-propos`)} className="site-link-2">
              {dict.nav.about}
            </Link>
            <Link href={lp(locale, `/mentions-legales`)} className="site-link-2">
              {dict.footer.legal}
            </Link>
            <Link href={lp(locale, `/confidentialite`)} className="site-link-2">
              {dict.footer.privacy}
            </Link>
            <Link href={lp(locale, `/securite`)} className="site-link-2">
              {isEn ? "Security" : "Sécurité"}
            </Link>
          </div>
        </div>

        {/* Ligne inférieure */}
        <div className="site-div-5">
          <span>© {new Date().getFullYear()} Bobine · {isEn ? "All rights reserved" : "Tous droits réservés"} · AGPL-3.0</span>
          <span>
            {isEn ? "Supporting the " : "Soutien au "}
            <a href={TOR_PROJECT_URL} target="_blank" rel="noopener noreferrer" className="site-a-2">
              {isEn ? "Tor Project" : "projet Tor"}
            </a>
            {" · "}
            <a href={TOR_SOURCE_URL} target="_blank" rel="noopener noreferrer" className="site-a-2">
              {isEn ? "source code" : "code source"}
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
