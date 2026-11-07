import ErrorPage from "@/components/ErrorPage";

export default function NotFound() {
  return (
    <ErrorPage
      code="404"
      titleFr="Page introuvable"
      titleEn="Page not found"
      textFr="La page demandée n'existe pas ou a été déplacée."
      textEn="The requested page does not exist or has been moved."
    />
  );
}
