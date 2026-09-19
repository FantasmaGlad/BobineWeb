// Génère l'instantané de secours du catalogue AliExpress à partir des product_id retenus.
// Usage : node --env-file=.env.local scripts/aliexpress-snapshot.mjs
// Lit src/content/aliexpress-ids.json, écrit src/content/aliexpress-snapshot.json et les images
// locales /public/images/hardware/ali-<id>.webp (comme pour les ASIN Amazon).
import { createHmac } from "node:crypto";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import sharp from "sharp";

const GATEWAY = "https://api-sg.aliexpress.com/sync";
const { ALIEXPRESS_APP_KEY: key, ALIEXPRESS_APP_SECRET: secret, ALIEXPRESS_TRACKING_ID: tracking } = process.env;
if (!key || !secret || !tracking) throw new Error("Variables ALIEXPRESS_* manquantes");

async function call(method, params) {
  const q = { app_key: key, timestamp: String(Date.now()), sign_method: "sha256", method, tracking_id: tracking };
  for (const [k, v] of Object.entries(params)) q[k] = String(v);
  const base = Object.keys(q).sort().map((k) => k + q[k]).join("");
  q.sign = createHmac("sha256", secret).update(base, "utf8").digest("hex").toUpperCase();
  const res = await fetch(GATEWAY, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded;charset=utf-8" },
    body: new URLSearchParams(q).toString(),
  });
  return res.json();
}

const ids = [...new Set(JSON.parse(readFileSync("src/content/aliexpress-ids.json", "utf8")))];
const OUT = "src/content/aliexpress-snapshot.json";
const snapshot = existsSync(OUT) ? JSON.parse(readFileSync(OUT, "utf8")) : {};
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
// L'API renvoie parfois une liste vide (limitation de débit) : on relance les manquants.
for (let round = 0; round < 6; round++) {
  const todo = ids.filter((id) => !snapshot[id]);
  if (!todo.length) break;
  for (const id of todo) {
    await sleep(700);
    const json = await call("aliexpress.affiliate.productdetail.get", {
      product_ids: id,
      target_currency: "EUR",
      target_language: "FR",
      country: "FR",
      ship_to_country: "FR",
    });
    const p = (Object.values(json)[0]?.resp_result?.result?.products?.product ?? [])[0];
    if (!p) continue;
    const file = `public/images/hardware/ali-${id}.webp`;
    if (!existsSync(file)) {
      const img = Buffer.from(await (await fetch(p.product_main_image_url)).arrayBuffer());
      await sharp(img).resize(600, 600, { fit: "contain", background: "#ffffff" }).webp({ quality: 82 }).toFile(file);
    }
    snapshot[id] = {
      price: Number(p.target_sale_price),
      link: p.promotion_link,
      image: `/images/hardware/ali-${id}.webp`,
      title: p.product_title,
      shop: p.shop_name,
      rating: p.evaluate_rate ?? null,
      sales: p.lastest_volume ?? null,
      checkedAt: new Date().toISOString().slice(0, 10),
    };
  }
}
const missing = ids.filter((id) => !snapshot[id]);
writeFileSync(OUT, JSON.stringify(snapshot, null, 2) + "\n");
console.log(`${Object.keys(snapshot).length}/${ids.length} produits`, missing.length ? `MANQUANTS: ${missing.join(", ")}` : "");
