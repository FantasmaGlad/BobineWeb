import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container" style={{ paddingBlock: "3rem", textAlign: "center", maxWidth: "42rem" }}>
      {/* Mascotte Hamster stylisée endormie */}
      <div
        style={{
          width: "90px",
          height: "90px",
          margin: "0 auto 1.5rem auto",
          background: "var(--accent-subtle)",
          border: "2px solid var(--accent-primary)",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1.75rem",
          fontWeight: 800,
          color: "var(--accent-primary)",
          boxShadow: "var(--shadow-card)",
        }}
      >
        <span>404</span>
      </div>

      <span
        style={{
          display: "inline-block",
          fontSize: "0.85rem",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          color: "var(--accent-primary)",
          background: "var(--accent-subtle)",
          padding: "0.25rem 0.75rem",
          borderRadius: "2rem",
          marginBottom: "0.75rem",
        }}
      >
        Erreur 404 · Page introuvable
      </span>

      <h1
        style={{
          fontSize: "clamp(1.8rem, 4vw, 2.5rem)",
          fontWeight: 800,
          color: "var(--text-heading)",
          marginBottom: "0.75rem",
          lineHeight: 1.2,
        }}
      >
        Page non trouvée
      </h1>

      <p
        style={{
          color: "var(--text-muted)",
          fontSize: "1.05rem",
          lineHeight: 1.6,
          marginBottom: "2rem",
        }}
      >
        La ressource que vous recherchez semble introuvable ou a été déplacée. Vous pouvez reprendre votre navigation :
      </p>

      <div
        style={{
          display: "flex",
          gap: "0.85rem",
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        <Link href="/fr" className="btn-primary">
          Retour à l&apos;accueil
        </Link>
        <Link href="/fr/documentation/demarrage-rapide" className="btn-secondary">
          Guide d&apos;installation
        </Link>
        <Link href="/fr/demo-3d" className="btn-secondary">
          Démo 3D
        </Link>
      </div>
    </div>
  );
}
