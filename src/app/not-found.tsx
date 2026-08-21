import Link from "next/link";

export default function GlobalNotFound() {
  return (
    <html lang="fr">
      <body style={{ margin: 0, padding: 0, background: "#eef2ff", color: "#1e1b4b", fontFamily: "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" }}>
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "2rem", textAlign: "center" }}>
          <div style={{ fontSize: "3rem", fontWeight: 800, color: "#6366f1", marginBottom: "0.5rem", letterSpacing: "-0.04em" }}>404</div>
          <h1 style={{ fontSize: "2rem", fontWeight: 800, margin: "0 0 0.5rem 0" }}>Page introuvable / Page Not Found</h1>
          <p style={{ color: "#4f46e5", maxWidth: "32rem", margin: "0 0 1.5rem 0" }}>
            La page demandée n&apos;existe pas. / The requested page does not exist.
          </p>
          <Link
            href="/fr"
            style={{
              display: "inline-block",
              background: "#6366f1",
              color: "#ffffff",
              fontWeight: 600,
              textDecoration: "none",
              padding: "0.65rem 1.25rem",
              borderRadius: "0.5rem",
            }}
          >
            Retour à l&apos;accueil / Go Home
          </Link>
        </div>
      </body>
    </html>
  );
}
