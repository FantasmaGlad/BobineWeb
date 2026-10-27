import SecurityPage from "../[locale]/page";

export default function FrSecurityPage() {
  return <SecurityPage params={Promise.resolve({ locale: "fr" })} />;
}
