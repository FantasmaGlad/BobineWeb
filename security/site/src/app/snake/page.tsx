import SnakePage from "../[locale]/snake/page";

export default function RootSnakePage() {
  return <SnakePage params={Promise.resolve({ locale: "en" })} />;
}
