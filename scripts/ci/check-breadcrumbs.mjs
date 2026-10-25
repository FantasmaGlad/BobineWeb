#!/usr/bin/env node
// Contrôle des fils d'Ariane sur le build : chaque page prérendue, hors accueil, pages d'erreur et redirections, porte
// exactement un BreadcrumbList ; ses adresses sont celles de la langue de la page (jamais un chemin français sous /en,
// qui passe par une redirection 308) et son dernier maillon est la page elle-même.
// Usage : node scripts/ci/check-breadcrumbs.mjs [dossier du build, .next/server/app par défaut]
import { readFileSync, readdirSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const repo = fileURLToPath(new URL("../../", import.meta.url));
const root = process.argv[2] ?? join(repo, ".next/server/app");
const slugs = readFileSync(join(repo, "src/lib/slugs.ts"), "utf8");
const enSlug = Object.fromEntries([...slugs.matchAll(/"([^"]+)":\s*"([^"]+)"/g)].map((m) => [m[1], m[2]]));
const walk = (dir) => readdirSync(dir, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name)]));
const errors = [];
const fail = (m) => errors.push(m);
let pages = 0;

const SKIP = /^\/(?:_|en\.html|fr\.html)/;
for (const file of walk(root).filter((f) => f.endsWith(".html"))) {
  const path = "/" + relative(root, file).replace(/\\/g, "/");
  if (SKIP.test(path)) continue;
  const html = readFileSync(file, "utf8");
  // Une redirection permanente prérendue n'est pas une page de contenu.
  if (/<meta[^>]+http-equiv="refresh"/i.test(html) || /NEXT_REDIRECT/.test(html)) continue;
  const lists = [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)]
    .flatMap((m) => { try { const j = JSON.parse(m[1]); return Array.isArray(j) ? j : j["@graph"] ?? [j]; } catch { return []; } })
    .filter((n) => n["@type"] === "BreadcrumbList");
  pages++;
  if (lists.length !== 1) { fail(`${path} : ${lists.length} BreadcrumbList (1 attendu)`); continue; }
  const items = lists[0].itemListElement ?? [];
  const lang = path.startsWith("/en/") ? "en" : "fr";
  for (const item of items) {
    const url = String(item.item ?? "");
    const u = url.replace(/^https?:\/\/[^/]+/, "");
    if (lang === "en") {
      const french = u.replace(/^\/en/, "");
      if (enSlug[french] && enSlug[french] !== french) fail(`${path} : maillon « ${item.name} » vers ${u} (chemin français sous /en : redirection 308, utiliser /en${enSlug[french]})`);
    }
  }
}
if (!pages) fail(`aucune page trouvée sous ${root}`);
if (errors.length) { console.error(errors.map((e) => `::error::${e}`).join("\n")); process.exit(1); }
console.log(`check-breadcrumbs : ${pages} pages, un seul BreadcrumbList chacune, adresses dans la langue de la page.`);
