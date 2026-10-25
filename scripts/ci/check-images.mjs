#!/usr/bin/env node
import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
const root = fileURLToPath(new URL("../../", import.meta.url));
const walk = (dir) => readdirSync(dir, { withFileTypes: true }).flatMap((e) => e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name)]);
for (const file of walk(join(root, "public/images"))) {
  if (file.includes("/hardware/")) continue;
  assert(statSync(file).size <= 250 * 1024, `${file}: image > 250 Ko`);
}
const media = JSON.parse(readFileSync(join(root, "src/content/media.json"), "utf8"));
for (const [id, entry] of Object.entries(media)) {
  assert(entry.alt.fr && entry.alt.en && entry.credit && entry.source, `${id}: métadonnées incomplètes`);
  for (const variant of entry.variants) for (const format of ["avif", "webp"]) assert(existsSync(join(root, "public", variant[format])), `${id}: ${format} manquant`);
}
for (const channel of ["stable", "beta", "canary"]) for (const format of ["png", "webp"]) {
  assert(!existsSync(join(root, `public/images/channels/${channel}.${format}`)), "Ancienne icône de canal restante");
  assert(existsSync(join(root, `public/images/channels/bobine-${channel}.${format}`)), "Icône de canal actuelle manquante");
}
console.log(`Images : ${Object.keys(media).length} médias documentés, alternatives FR/EN, formats et poids conformes ; anciennes icônes supprimées.`);
