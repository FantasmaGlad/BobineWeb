#!/usr/bin/env node
// Les sources restent locales : le build du site et le miroir Tor n’ont besoin d’aucun téléchargement d’image.
import sharp from "sharp";
import { readFile, writeFile, mkdir, stat } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { join } from "node:path";

const root = fileURLToPath(new URL("../../", import.meta.url));
const sources = JSON.parse(await readFile(join(root, "scripts/images/sources.json"), "utf8"));
const manifest = {};
for (const source of sources) {
  if (!source.alt?.fr?.trim() || !source.alt?.en?.trim() || !source.credit || !source.source) throw new Error(`${source.id}: alternative ou crédit absent`);
  if (!/^[a-z0-9-]+$/.test(source.id) || !["marketing", "screens"].includes(source.folder)) throw new Error("Identifiant de média invalide");
  const input = join(root, source.input);
  const metadata = await sharp(input).rotate().metadata();
  const widths = [...new Set([Math.min(640, metadata.width), Math.min(1280, metadata.width)])];
  const variants = [];
  await mkdir(join(root, "public/images", source.folder), { recursive: true });
  for (const width of widths) {
    const paths = {};
    let info;
    for (const format of ["avif", "webp"]) {
      const url = `/images/${source.folder}/${source.id}-${width}.${format}`;
      for (const quality of [72, 60, 48, 36]) {
        info = await sharp(input).rotate().resize({ width, withoutEnlargement: true }).toFormat(format, { quality }).toFile(join(root, "public", url));
        if ((await stat(join(root, "public", url))).size <= 250 * 1024) break;
      }
      if ((await stat(join(root, "public", url))).size > 250 * 1024) throw new Error(`${url}: poids supérieur à 250 Ko`);
      paths[format] = url;
    }
    variants.push({ width: info.width, height: info.height, ...paths });
  }
  const og = `/images/${source.folder}/${source.id}-og.webp`;
  await sharp(input).rotate().resize(1200, 630, { fit: "contain", background: "#f4efff" }).webp({ quality: 70 }).toFile(join(root, "public", og));
  manifest[source.id] = { alt: source.alt, credit: source.credit, source: source.source, version: source.version ?? null, og, variants };
  console.log(`${source.id}: ${variants.map((v) => v.width).join("/")} px, AVIF et WebP`);
}
await writeFile(join(root, "src/content/media.json"), JSON.stringify(manifest, null, 2) + "\n");

// Les trois canaux partent des icônes actuelles du logiciel, conservées avec les sources.
await mkdir(join(root, "public/images/channels"), { recursive: true });
for (const channel of ["stable", "beta", "canary"]) {
  const input = join(root, `scripts/images/channels/bobine-${channel}.png`);
  for (const format of ["png", "webp"]) {
    await sharp(input).resize(256, 256, { fit: "contain" }).toFormat(format).toFile(join(root, `public/images/channels/bobine-${channel}.${format}`));
  }
}
