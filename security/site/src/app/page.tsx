import SecurityPage from "./[locale]/page";

export default function RootPage() {
  return <SecurityPage params={Promise.resolve({ locale: "en" })} />;
}
