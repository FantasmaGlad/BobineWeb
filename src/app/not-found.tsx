import { THEME_INIT_SNIPPET } from "@/lib/themes";
import Link from "next/link";
import "./globals.css";
import "@/styles/split/pages-misc.css";

export default function GlobalNotFound() {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <title>404 · Page introuvable · Bobine</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/png" sizes="48x48" href="/favicon-48x48.png" />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{${THEME_INIT_SNIPPET}}catch(e){}})()`,
          }}
        />
      </head>
      <body>
        <div className="not-found-div-3"
        >
          <h1 className="not-found-h1-2"
          >
            Erreur 404 · Page introuvable
          </h1>

          <p className="not-found-p-2"
          >
            La page demandée n&apos;existe pas ou a été déplacée. / The requested page does not exist or has been moved.
          </p>

          <div className="not-found-div-2">
            <Link
              href="/fr"
              className="btn-secondary not-found-link-1"
            >
              Retour à l&apos;accueil
            </Link>
            <Link
              href="/en"
              className="btn-secondary not-found-link-1"
            >
              Go to English Home
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
