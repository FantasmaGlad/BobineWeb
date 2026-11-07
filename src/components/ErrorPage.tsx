import Link from "next/link";
import { IS_ONION, ONION_APT_HOST } from "@/lib/onion";
import "@/styles/split/pages-misc.css";

interface ErrorPageProps {
  code: string;
  titleFr: string;
  titleEn: string;
  textFr: string;
  textEn: string;
}

/** Page d'erreur minimale, bilingue : le code, deux lignes et les sites de Bobine. Aucun bouton. */
export default function ErrorPage({ code, titleFr, titleEn, textFr, textEn }: ErrorPageProps) {
  return (
    <div className="error-page">
      <main className="error-page__main">
        <p className="error-page__code">{code}</p>
        <h1 className="error-page__title">{titleFr}</h1>
        <p className="error-page__text">{textFr}</p>
        <p className="error-page__text" lang="en">{titleEn}. {textEn}</p>
      </main>
      <footer className="error-page__footer">
        {IS_ONION ? (
          <p>
            <Link href="/fr">bobine.fit</Link> · <a href={`http://${ONION_APT_HOST}/`}>packages</a>
          </p>
        ) : (
          <p>
            <a href="https://bobine.fit">bobine.fit</a> · <a href="https://packages.bobine.fit">packages</a> ·{" "}
            <a href="https://security.bobine.fit">security</a> · <a href="https://github.com/FantasmaGlad/Bobine">GitHub</a>
          </p>
        )}
      </footer>
    </div>
  );
}
