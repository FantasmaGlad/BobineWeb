import Link from "next/link";
import BaamixViewerLoader from "@/components/three/BaamixViewerLoader";
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
            __html: `(function(){try{var t=localStorage.getItem('bobineweb-theme')||'clair';document.documentElement.setAttribute('data-theme',t);}catch(e){}})()`,
          }}
        />
      </head>
      <body>
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "2rem 1.5rem",
            textAlign: "center",
            boxSizing: "border-box",
          }}
        >
          {/* Modèle 3D Baamix interactif 360° */}
          <BaamixViewerLoader />

          <h1
            style={{
              fontSize: "clamp(1.5rem, 3.5vw, 2.1rem)",
              fontWeight: 700,
              color: "var(--text-heading)",
              margin: "0 0 0.6rem 0",
              lineHeight: 1.25,
            }}
          >
            Erreur 404 · Page introuvable
          </h1>

          <p
            style={{
              color: "var(--text-muted)",
              maxWidth: "34rem",
              margin: "0 0 1.5rem 0",
              fontSize: "0.95rem",
              lineHeight: 1.6,
            }}
          >
            La page demandée n&apos;existe pas ou a été déplacée. / The requested page does not exist or has been moved.
          </p>

          <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link
              href="/fr"
              className="btn-secondary"
              style={{
                padding: "0.5rem 1.15rem",
                fontSize: "0.875rem",
                fontWeight: 500,
                borderRadius: "0.5rem",
              }}
            >
              Retour à l&apos;accueil
            </Link>
            <Link
              href="/en"
              className="btn-secondary"
              style={{
                padding: "0.5rem 1.15rem",
                fontSize: "0.875rem",
                fontWeight: 500,
                borderRadius: "0.5rem",
              }}
            >
              Go to English Home
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
