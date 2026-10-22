import Link from "next/link";
import Image from "next/image";
import "@/styles/split/pages-misc.css";

export default function NotFound() {
  return (
    <div className="container not-found-div-1">
      <Image
        src="/images/BaamixInspector.webp"
        alt="Baamix Inspecteur"
        width={180}
        height={250} className="not-found-image-1"
      />

      <h1 className="not-found-h1-1"
      >
        Erreur 404 · Page introuvable
      </h1>

      <p className="not-found-p-1"
      >
        La ressource que vous recherchez semble introuvable ou a été déplacée. Vous pouvez reprendre votre navigation :
      </p>

      <div className="not-found-div-2"
      >
        <Link
          href="/fr"
          className="btn-secondary not-found-link-1"
        >
          Retour à l&apos;accueil
        </Link>
        <Link
          href="/fr/documentation"
          className="btn-secondary not-found-link-1"
        >
          Guide d&apos;installation
        </Link>
        <Link
          href="/fr/materiel/amazon"
          className="btn-secondary not-found-link-1"
        >
          Guide Matériel
        </Link>
      </div>
    </div>
  );
}
