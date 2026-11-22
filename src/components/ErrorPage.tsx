import "@/styles/split/pages-misc.css";

interface ErrorPageProps {
  code: string;
  titleFr: string;
  titleEn: string;
  textFr: string;
  textEn: string;
}

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
        <p>
          <a href="https://bobine.fit">bobine.fit</a> · <a href="https://packages.bobine.fit">packages</a> ·{" "}
          <a href="https://security.bobine.fit">security</a> · <a href="https://github.com/FantasmaGlad/Bobine">GitHub</a>
        </p>
      </footer>
    </div>
  );
}
