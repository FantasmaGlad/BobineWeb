import { NextResponse } from "next/server";
import { getServerCatalog } from "@/lib/catalog/server";

export const runtime = "nodejs";

/**
 * Résout des identifiants produit (ASIN Amazon ou product_id AliExpress) vers les fiches du
 * catalogue réel, pour les cartes produit et les comparatifs de Baamix. Ne renvoie que ce qui
 * existe dans le catalogue : jamais un identifiant inventé par le modèle.
 */
export async function GET(req: Request) {
  const idsParam = new URL(req.url).searchParams.get("ids") ?? "";
  const ids = [...new Set(idsParam.split(",").map((s) => s.trim()).filter(Boolean))].slice(0, 8);
  if (ids.length === 0) return NextResponse.json({ products: [] });

  const { entries } = await getServerCatalog();
  const byId = new Map(entries.map((e) => [e.id, e]));
  const products = ids.flatMap((id) => {
    const e = byId.get(id);
    return e
      ? [
          {
            id: e.id,
            platform: e.platform,
            name: e.name,
            price: e.price,
            imageUrl: e.imageUrl,
            url: e.url,
            specs: e.specs,
            hasFan: e.hasFan,
            category: e.category,
            seller: e.seller ?? null,
            os: e.os ?? null,
            form: e.form ?? null,
            tier: e.tier ?? null,
          },
        ]
      : [];
  });
  return NextResponse.json({ products }, { headers: { "Cache-Control": "public, s-maxage=600, stale-while-revalidate=3600" } });
}
