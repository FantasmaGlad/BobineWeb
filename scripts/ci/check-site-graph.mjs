#!/usr/bin/env node
// Garde-fou du plan du site (src/lib/siteMap.json) : chaque route a exactement un parent hub, une page réelle, un slug
// anglais cohérent ; chaque hub rend la liste de ses enfants ; aucun cycle ; aucune feuille orpheline.
// Code de sortie 1 au premier écart.
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const repo = fileURLToPath(new URL("../../", import.meta.url));
const file = process.env.SITEMAP_JSON ?? join(repo, "src/lib/siteMap.json");
const { routes } = JSON.parse(readFileSync(file, "utf8"));
const slugs = readFileSync(join(repo, "src/lib/slugs.ts"), "utf8");
const enSlug = Object.fromEntries([...slugs.matchAll(/"([^"]+)":\s*"([^"]+)"/g)].map((m) => [m[1], m[2]]));
const errors = [];
const fail = (msg) => errors.push(msg);
const byId = new Map(routes.map((r) => [r.id, r]));

if (byId.size !== routes.length) fail("identifiants de route en double");
const paths = new Set();
for (const r of routes) {
  if (paths.has(r.path)) fail(`${r.id} : chemin en double (${r.path || "/"})`);
  paths.add(r.path);
  for (const lang of ["fr", "en"]) {
    if (!r.label?.[lang]) fail(`${r.id} : libellé ${lang} manquant`);
    if (!r.description?.[lang]) fail(`${r.id} : description ${lang} manquante`);
  }
  if (r.id === "home") {
    if (r.parent) fail("home ne doit pas avoir de parent");
  } else {
    const parent = byId.get(r.parent);
    if (!parent) fail(`${r.id} : parent « ${r.parent} » introuvable`);
    else if (parent.kind !== "hub") fail(`${r.id} : le parent « ${r.parent} » n'est pas un hub`);
  }
  // Une page réelle existe pour chaque route (dossier français de l'application).
  const dir = join(repo, "src/app/[locale]", r.path);
  if (!existsSync(join(dir, "page.tsx")) && !existsSync(join(dir, "page.mdx"))) fail(`${r.id} : aucune page dans src/app/[locale]${r.path}`);
  // Le chemin anglais d'une page ne reprend pas un autre slug.
  if (r.path && enSlug[r.path] === undefined && /[àâçéèêëîïôùûü]|fonctionnalites|comparatif|materiel|canaux|nouveautes|propos|soutenir|mentions|confidentialite|securite|ordinateur|telechargement|ressources/.test(r.path)) {
    fail(`${r.id} : slug anglais absent de slugs.ts pour ${r.path}`);
  }
  if (r.kind === "hub" && r.id !== "home" && !r.dynamicChildren && !routes.some((c) => c.parent === r.id && !c.hidden)) fail(`${r.id} : hub sans page enfant visible`);
}

// Pas de cycle : chaque chemin remonte à l'accueil.
for (const r of routes) {
  const seen = new Set();
  for (let cur = r; cur; cur = byId.get(cur.parent)) {
    if (seen.has(cur.id)) { fail(`${r.id} : cycle dans la hiérarchie`); break; }
    seen.add(cur.id);
  }
  if (!seen.has("home")) fail(`${r.id} : ne remonte pas à l'accueil`);
}

// Chaque hub (hors accueil) rend la liste de ses enfants : HubPage/HubGrid de son identifiant, ou des liens vers chacun
// dans sa page, sa disposition (barre latérale de la documentation) ou le contenu de pages de canaux (landing.ts).
const landing = readFileSync(join(repo, "src/content/landing.ts"), "utf8");
const comparisons = readFileSync(join(repo, "src/content/compare.ts"), "utf8");
for (const r of routes.filter((x) => x.kind === "hub" && x.id !== "home")) {
  const dir = join(repo, "src/app/[locale]", r.path);
  const text = ["page.tsx", "page.mdx", "layout.tsx"].map((n) => join(dir, n)).filter(existsSync).map((p) => readFileSync(p, "utf8")).join("\n");
  if (new RegExp(`(?:HubPage|HubGrid|ResourceIndex)[^>]*\\bid="${r.id}"`).test(text)) continue;
  const source = `${text}\n${text.includes("LandingPage") ? landing : ""}\n${text.includes("ComparePage") ? comparisons : ""}`;
  const missing = routes.filter((c) => c.parent === r.id && !c.hidden && !source.includes(c.path) && !source.includes(`"${c.path.split("/").pop()}"`));
  if (missing.length) fail(`${r.id} : la page du hub ne mène pas à ${missing.map((c) => c.id).join(", ")}`);
}

// Le pied de page reste court : au plus 22 liens.
const footerLinks = routes.filter((r) => r.footer && !r.hidden).length + 1;
if (footerLinks > 22) fail(`pied de page : ${footerLinks} liens (maximum 22)`);

if (errors.length) {
  console.error(errors.map((e) => `::error::${e}`).join("\n"));
  process.exit(1);
}
console.log(`check-site-graph : ${routes.length} routes, ${routes.filter((r) => r.kind === "hub").length} hubs, ${footerLinks} liens de pied de page, aucune feuille orpheline.`);
