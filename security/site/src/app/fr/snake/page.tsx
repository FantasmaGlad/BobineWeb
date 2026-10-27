import SnakePage from "../../[locale]/snake/page";

export default function FrSnakePage() {
  return <SnakePage params={Promise.resolve({ locale: "fr" })} />;
}
