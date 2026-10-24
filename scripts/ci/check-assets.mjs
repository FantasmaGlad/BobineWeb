#!/usr/bin/env node
// Garde-fou des icônes de marque : chaque entrée du registre (src/lib/assets.json) existe, reste légère et sans raster ni
// fond, aucun fichier d'icône n'est orphelin, les couleurs officielles atteignent 3:1 sur les surfaces des 16 thèmes,
// chaque marque est attribuée dans NOTICE.md, et aucun composant n'écrit de chemin d'icône à la main.
// Code de sortie 1 au premier écart.
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { loadThemeColors } from "./theme-colors.mjs";

const repo = fileURLToPath(new URL("../../", import.meta.url));
const srcDir = join(repo, "src");
const iconsDir = join(repo, "public/images/icons");
// ASSETS_REGISTRY : registre alternatif, réservé aux tests d'injection.
const registry = JSON.parse(readFileSync(process.env.ASSETS_REGISTRY ?? join(srcDir, "lib/assets.json"), "utf8"));
const errors = [];
const fail = (msg) => errors.push(msg);
const walk = (dir) => readdirSync(dir, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name)]));

const MAX_BYTES = 12288;
const MIN_CONTRAST = 3;

// 1. Fichiers du registre ----------------------------------------------------------------------------------------
const used = new Set();
for (const [key, def] of Object.entries(registry)) {
  const file = join(repo, "public", def.src);
  used.add(file);
  if (!existsSync(file)) { fail(`${key} : ${def.src} manquant`); continue; }
  const size = statSync(file).size;
  if (size > MAX_BYTES) fail(`${key} : ${size} octets (maximum ${MAX_BYTES})`);
  const svg = readFileSync(file, "utf8");
  if (!/^\s*<svg[\s>]/.test(svg)) fail(`${key} : ${def.src} n'est pas un SVG`);
  if (/<image\b|data:image|<script\b|<foreignObject\b/i.test(svg)) fail(`${key} : raster, script ou objet étranger embarqué`);
  if (/<rect\b[^>]*\b(?:width="(?:100%|24|88)"[^>]*height="(?:100%|24|88)")[^>]*>/i.test(svg) && /<svg[^>]*>\s*<rect/.test(svg)) fail(`${key} : fond opaque probable`);
  if (!def.name) fail(`${key} : nom de marque manquant`);
  if (def.render !== "image" && def.tone !== "ink" && !/^#[0-9A-F]{6}$/i.test(def.color ?? "")) fail(`${key} : couleur officielle (#RRGGBB) requise en ton « brand »`);
}

// 2. Aucun fichier d'icône orphelin -----------------------------------------------------------------------------
for (const file of walk(iconsDir)) if (!used.has(file)) fail(`fichier orphelin : ${relative(repo, file)} (absent du registre)`);
if (existsSync(join(repo, "public/images/distros"))) fail("public/images/distros/ doit être supprimé : les logos vivent dans public/images/icons/distros/");

// 3. Contraste des couleurs officielles -------------------------------------------------------------------------
const files = walk(srcDir);
const css = files.filter((f) => f.endsWith(".css")).map((f) => readFileSync(f, "utf8")).join("\n");
const noComments = css.replace(/\/\*[\s\S]*?\*\//g, "");
const { themes, resolve, evaluate, materialColors, over, ratio } = loadThemeColors(noComments);
const toRgb = (hex) => ({ r: parseInt(hex.slice(1, 3), 16), g: parseInt(hex.slice(3, 5), 16), b: parseInt(hex.slice(5, 7), 16), a: 1 });
let measured = 0;
for (const theme of themes) {
  const vars = resolve(theme);
  const canvas = evaluate("var(--bg-canvas)", vars);
  const hotspot = over(evaluate("color-mix(in srgb, var(--accent-primary) 22%, transparent)", vars), canvas);
  for (const [key, def] of Object.entries(registry)) {
    if (def.render === "image" || def.tone === "ink" || !def.color) continue;
    for (const material of ["glass-surface-bg", "glass-card-bg", "glass-floating-bg", "glass-modal-bg", "glass-inset-bg"]) {
      for (const backdrop of [canvas, hotspot]) {
        for (const fill of materialColors(vars[material], vars)) {
          measured++;
          const r = ratio(toRgb(def.color), over(fill, backdrop));
          if (r < MIN_CONTRAST) fail(`${key} (${def.color}) sur ${material}, thème ${theme} : ${r.toFixed(2)}:1 (minimum ${MIN_CONTRAST}:1) ; passer en "tone": "ink"`);
        }
      }
    }
  }
}
if (themes.length !== 16) fail(`${themes.length} thèmes détectés (16 attendus)`);

// 4. Attribution dans NOTICE.md --------------------------------------------------------------------------------
const notice = readFileSync(join(repo, "NOTICE.md"), "utf8").toLowerCase();
for (const def of Object.values(registry)) if (!notice.includes(def.name.toLowerCase())) fail(`NOTICE.md n'attribue pas la marque « ${def.name} »`);

// 5. Aucun chemin d'icône écrit à la main ------------------------------------------------------------------------
const allowed = new Set([join(srcDir, "lib/assets.json")]);
for (const file of files) {
  if (allowed.has(file) || !/\.(tsx?|css|mdx?)$/.test(file)) continue;
  const text = readFileSync(file, "utf8");
  if (/images\/(?:icons|distros)\//.test(text)) fail(`${relative(repo, file)} : chemin d'icône écrit à la main, utiliser BrandIcon et une clé du registre`);
}

// 6. Cliquet des <svg> en ligne : la migration vers Icon et BrandIcon se fait page par page, le total ne doit jamais
// remonter. Baisser ce plafond à chaque migration ; viser 0 hors dessins propres à un composant (démonstrations, PDF).
const INLINE_SVG_CEILING = 123;
const inline = files.filter((f) => f.endsWith(".tsx") && !f.includes(`${join("components", "ui")}/`)).reduce((n, f) => n + (readFileSync(f, "utf8").match(/<svg\b/g)?.length ?? 0), 0);
if (inline > INLINE_SVG_CEILING) fail(`${inline} <svg> en ligne (plafond ${INLINE_SVG_CEILING}) : utiliser Icon ou BrandIcon`);

if (errors.length) {
  console.error(errors.map((e) => `::error::${e}`).join("\n"));
  process.exit(1);
}
console.log(`check-assets : ${Object.keys(registry).length} icônes, ${themes.length} thèmes, ${measured} mesures de contraste, aucune anomalie ; <svg> en ligne : ${inline}/${INLINE_SVG_CEILING}.`);
