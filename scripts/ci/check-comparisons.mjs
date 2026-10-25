#!/usr/bin/env node
// Vérifie le HTML livré, dont la parité de structure et les sources, sans dépendre de l’hydratation du navigateur.
import assert from "node:assert/strict";
import { readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const repo = fileURLToPath(new URL("../../", import.meta.url));
const graph = JSON.parse(readFileSync(join(repo, "src/lib/siteMap.json"), "utf8"));
const routes = graph.routes.filter((route) => route.id === "compare" || route.parent === "compare");
const slugs = readFileSync(join(repo, "src/lib/slugs.ts"), "utf8");
const enSlug = Object.fromEntries([...slugs.matchAll(/"([^"]+)":\s*"([^"]+)"/g)].map((match) => [match[1], match[2]]));
const root = process.argv[2] ?? join(repo, ".next/server/app");
const sizes = new Map();
let pages = 0;

for (const route of routes) {
  const structures = [];
  for (const locale of ["fr", "en"]) {
    const file = join(root, locale, `${route.path.slice(1)}.html`);
    const html = readFileSync(file, "utf8");
    assert.equal((html.match(/<h1\b/g) ?? []).length, 1, `${file}: un H1`);
    assert(!/\bcmp-(?:div|p|h\d|section)-\d/.test(html), `${file}: classes sémantiques`);
    assert(/class="pg-breadcrumbs"/.test(html), `${file}: fil visible`);
    assert(/href="\/(?:fr\/telechargement|en\/download)"/.test(html), `${file}: téléchargement multi-plateformes`);
    const description = html.match(/<meta name="description" content="([^"]+)"/)[1];
    assert(description.length >= 120 && description.length <= 160, `${file}: description ${description.length} caractères`);
    const title = html.match(/<title>(.*?)<\/title>/)[1].replace(/ · Bobine$/, "");
    assert(title.length >= 30 && title.length <= 60, `${file}: titre ${title.length} caractères`);
    assert(/<img[^>]+alt="[^"]+"/.test(html), `${file}: image avec alternative`);
    const sources = [...html.matchAll(/<li id="source-([^"]+)"/g)].map((match) => match[1]);
    assert(sources.length > 0, `${file}: sources visibles`);
    assert.equal(new Set(sources).size, sources.length, `${file}: sources uniques`);
    for (const id of sources) assert(new RegExp(`id="source-${id}"[\\s\\S]*?<time dateTime="\\d{4}-\\d{2}-\\d{2}"`).test(html), `${file}: date de source ${id}`);
    if (route.id === "compare") {
      for (const child of routes.filter((item) => item.parent === "compare" && !item.hidden)) {
        const href = `/${locale}${locale === "en" ? enSlug[child.path] : child.path}`;
        assert(html.includes(`href="${href}"`), `${file}: lien rendu vers ${child.id}`);
      }
    } else {
      assert(/<table[^>]*role="table"/.test(html), `${file}: tableau sémantique`);
      assert(/scope="row"/.test(html), `${file}: en-têtes de lignes`);
      assert(/compare-table__mobile-label/.test(html), `${file}: libellés des cartes mobiles`);
      for (const ref of html.matchAll(/href="#source-([^"]+)"/g)) assert(sources.includes(ref[1]), `${file}: ancre de source ${ref[1]}`);
    }
    structures.push({
      headings: html.match(/<h[12]\b/g)?.length,
      rows: html.match(/role="rowheader"/g)?.length ?? 0,
      cells: html.match(/role="cell"/g)?.length ?? 0,
      faq: html.match(/<details\b/g)?.length ?? 0,
      sources,
    });
    for (const src of html.matchAll(/<meta property="og:image" content="https:\/\/[^/]+(\/images\/[^" ]+\.webp)"/g)) {
      if (!sizes.has(src[1])) sizes.set(src[1], statSync(join(repo, "public", src[1])).size);
      assert(sizes.get(src[1]) <= 250 * 1024, `${file}: image > 250 Ko`);
    }
    pages++;
  }
  assert.deepEqual(structures[0], structures[1], `${route.path}: parité des sections FR/EN`);
}
assert.equal(pages, 10, "hub et quatre études en deux langues");
assert(sizes.size > 0, "visuels locaux contrôlés");
console.log(`check-comparisons : ${pages} pages, parité FR/EN, titres, descriptions, sources datées, liens et structure conformes.`);
