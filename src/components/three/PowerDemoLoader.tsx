"use client";

import dynamic from "next/dynamic";

// `ssr: false` n'est utilisable que depuis un Client Component — ce wrapper
// isole ça pour que la page (Server Component) reste simple.
const PowerDemoScene = dynamic(() => import("./PowerDemoScene"), {
  ssr: false,
  loading: () => (
    <div className="power-demo__loading">Chargement du modèle…</div>
  ),
});

export default function PowerDemoLoader() {
  return <PowerDemoScene />;
}
