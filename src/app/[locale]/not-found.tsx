import Link from "next/link";
import BaamixViewerLoader from "@/components/three/BaamixViewerLoader";

export default function NotFound() {
  return (
    <div className="container" style={{ paddingBlock: "3rem", textAlign: "center", maxWidth: "42rem" }}>
      {/* Mascotte Hamster Baamix 3D manipulable en 360° */}
      <BaamixViewerLoader />

      <h1
        style={{
          fontSize: "clamp(1.5rem, 3.5vw, 2.1rem)",
          fontWeight: 700,
          color: "var(--text-heading)",
          marginBottom: "0.6rem",
          lineHeight: 1.25,
        }}
      >
        Erreur 404 · Page introuvable
      </h1>

      <p
        style={{
          color: "var(--text-muted)",
          fontSize: "0.95rem",
          lineHeight: 1.6,
          marginBottom: "1.75rem",
        }}
      >
        La ressource que vous recherchez semble introuvable ou a été déplacée. Vous pouvez reprendre votre navigation :
      </p>

      <div
        style={{
          display: "flex",
          gap: "0.75rem",
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
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
          href="/fr/documentation"
          className="btn-secondary"
          style={{
            padding: "0.5rem 1.15rem",
            fontSize: "0.875rem",
            fontWeight: 500,
            borderRadius: "0.5rem",
          }}
        >
          Guide d&apos;installation
        </Link>
        <Link
          href="/fr/materiel/amazon"
          className="btn-secondary"
          style={{
            padding: "0.5rem 1.15rem",
            fontSize: "0.875rem",
            fontWeight: 500,
            borderRadius: "0.5rem",
          }}
        >
          Guide Matériel
        </Link>
      </div>
    </div>
  );
}
