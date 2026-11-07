import { THEME_INIT_SNIPPET } from "@/lib/themes";
import ErrorPage from "@/components/ErrorPage";
import "./globals.css";

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
        <ErrorPage
          code="404"
          titleFr="Page introuvable"
          titleEn="Page not found"
          textFr="La page demandée n'existe pas ou a été déplacée."
          textEn="The requested page does not exist or has been moved."
        />
      </body>
    </html>
  );
}
