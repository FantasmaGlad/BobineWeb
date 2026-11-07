"use client";

import ErrorPage from "@/components/ErrorPage";

export default function LocaleError() {
  return (
    <ErrorPage
      code="500"
      titleFr="Erreur du site"
      titleEn="Site error"
      textFr="Une erreur est survenue. Rechargez la page dans un instant."
      textEn="Something went wrong. Reload the page in a moment."
    />
  );
}
