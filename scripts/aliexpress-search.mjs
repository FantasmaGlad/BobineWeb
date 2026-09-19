// Recherche de candidats pour la curation du catalogue AliExpress (usage éditorial, hors bundle).
// Usage : node --env-file=.env.local scripts/aliexpress-search.mjs "<mots-clés>" [--min 80] [--max 300] [--floor 60] [--sales 20] [--page 1] [--sort LAST_VOLUME_DESC] [--all] [--raw]
//         node --env-file=.env.local scripts/aliexpress-search.mjs --detail <id1,id2> [--raw]
import { createHmac } from "node:crypto";

const GATEWAY = "https://api-sg.aliexpress.com/sync";
const { ALIEXPRESS_APP_KEY: key, ALIEXPRESS_APP_SECRET: secret, ALIEXPRESS_TRACKING_ID: tracking } = process.env;
if (!key || !secret || !tracking) {
  console.error("Variables ALIEXPRESS_* manquantes (lancer avec --env-file=.env.local)");
  process.exit(1);
}

const args = process.argv.slice(2);
const flag = (name) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : undefined;
};
const raw = args.includes("--raw");

async function call(method, params) {
  const q = { app_key: key, timestamp: String(Date.now()), sign_method: "sha256", method, tracking_id: tracking };
  for (const [k, v] of Object.entries(params)) if (v !== undefined) q[k] = String(v);
  const base = Object.keys(q).sort().map((k) => k + q[k]).join("");
  q.sign = createHmac("sha256", secret).update(base, "utf8").digest("hex").toUpperCase();
  const res = await fetch(GATEWAY, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded;charset=utf-8" },
    body: new URLSearchParams(q).toString(),
  });
  return res.json();
}

const common = { target_currency: "EUR", target_language: "FR", ship_to_country: "FR", country: "FR" };
const detailIds = flag("detail");
const json = detailIds
  ? await call("aliexpress.affiliate.productdetail.get", { ...common, product_ids: detailIds })
  : await call("aliexpress.affiliate.product.query", {
      ...common,
      keywords: args[0],
      min_sale_price: flag("min") ? Number(flag("min")) * 100 : undefined,
      max_sale_price: flag("max") ? Number(flag("max")) * 100 : undefined,
      page_no: flag("page") ?? 1,
      page_size: flag("size") ?? 20,
      sort: flag("sort"),
    });

if (raw) {
  console.log(JSON.stringify(json, null, 2));
  process.exit(0);
}
if (json.error_response) {
  console.error("Erreur API :", JSON.stringify(json.error_response));
  process.exit(1);
}
const root = Object.values(json)[0];
const products = root?.resp_result?.result?.products?.product ?? [];
console.log(`resp_code=${root?.resp_result?.resp_code} msg=${root?.resp_result?.resp_msg} total=${root?.resp_result?.result?.total_record_count} affichés=${products.length}\n`);
// Filtres de bon sens (désactivables avec --all) : pièces détachées et annonces suspectes.
const NOISE = /ventilateur|refroidisseur|dissipateur|coque|boîtier|boitier|étui|etui|housse|cover|remplacement|replacement|pour asus|pour lenovo|pour dell|pour hp|charni[eè]re|nappe|flex/i;
const minPrice = Number(flag("floor") ?? 0);
const minSales = Number(flag("sales") ?? 0);
const keep = args.includes("--all")
  ? products
  : products.filter(
      (p) =>
        !NOISE.test(p.product_title) &&
        Number(p.target_sale_price) >= minPrice &&
        Number(p.lastest_volume ?? 0) >= minSales &&
        (p.evaluate_rate == null || parseFloat(p.evaluate_rate) >= 90)
    );
console.log(`(${products.length - keep.length} masqué(s) par les filtres)\n`);
for (const p of keep) {
  console.log(
    `${p.product_id} | ${p.target_sale_price} ${p.target_sale_price_currency} (orig ${p.target_original_price}) | note ${p.evaluate_rate ?? "?"} | ventes ${p.lastest_volume ?? "?"} | ${p.shop_name ?? ""}\n  ${p.product_title}\n  ${p.promotion_link}\n`
  );
}
