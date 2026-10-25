#!/usr/bin/env node
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
const root = fileURLToPath(new URL("../../", import.meta.url));
const pages = ["fonctionnalites", "a-propos", "soutenir", "blog", "credits"];
for (const page of pages) {
  const counts = [];
  for (const locale of ["fr", "en"]) {
    const html = readFileSync(join(root, `.next/server/app/${locale}/${page}.html`), "utf8");
    const title = html.match(/<title>(.*?)<\/title>/)?.[1] ?? "";
    const description = html.match(/name="description" content="([^"]+)"/)?.[1] ?? "";
    assert(title.length >= 30 && title.length <= 60, `${locale}/${page}: titre entre 30 et 60 caractères`);
    assert(description.length >= 120 && description.length <= 160, `${locale}/${page}: description entre 120 et 160 caractères`);
    assert.equal((html.match(/<h1\b/g) ?? []).length, 1, `${locale}/${page}: un H1`);
    assert(html.includes('class="marketing-hero"'), `${locale}/${page}: en-tête compact`);
    assert(html.includes('<picture>') && /<img[^>]*alt="[^"]+"/.test(html), `${locale}/${page}: image et alternative`);
    assert(!/\b(?:page|about|support|blog)-div-\d/.test(html), `${locale}/${page}: classes sémantiques`);
    assert(!html.includes("PR #42"), `${locale}/${page}: référence fictive supprimée`);
    assert(/og:image" content="https:\/\/bobine.fit\/images\/(?:marketing|screens)\/[^" ]+-og.webp/.test(html), `${locale}/${page}: aperçu de section`);
    if (page === "fonctionnalites") {
      assert.equal((html.match(/class="marketing-card"/g) ?? []).length, 9, "neuf fonctions visibles");
      assert(!html.includes('class="feature-tech-details"'), "pas de spécifications cachées");
    }
    if (page === "blog" && locale === "en") assert(html.includes("original language"), "langue des notes annoncée");
    counts.push((html.match(/<h2\b/g) ?? []).length);
  }
  assert.equal(counts[0], counts[1], `${page}: mêmes sections FR/EN`);
}
console.log("Marketing : dix pages FR/EN, en-têtes compacts, images locales, neuf fonctions visibles et métadonnées conformes.");
