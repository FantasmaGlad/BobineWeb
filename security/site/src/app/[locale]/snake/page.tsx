import React from "react";
import SecurityHeader from "../../../components/SecurityHeader";
import SnakeGame from "../../../components/SnakeGame";
import { SECURITY_DATA } from "../../../content/security-content";

export function generateStaticParams() {
  return [{ locale: "fr" }, { locale: "en" }];
}

export default async function SnakePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const resolvedParams = await params;
  const locale = resolvedParams.locale === "fr" ? "fr" : "en";
  const strings = SECURITY_DATA[locale];

  return (
    <div className="snake-page">
      <a className="skip-link" href="#gameArea">
        {locale === "fr" ? "Aller au jeu" : "Skip to game"}
      </a>
      <SecurityHeader lang={locale} langLinks={["/snake/", "/fr/snake/"]} />
      <SnakeGame strings={strings} />
    </div>
  );
}
