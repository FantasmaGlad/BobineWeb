#!/usr/bin/env node
// Garde-fou du verre et des jetons de style : aucune valeur figée, aucune variable non définie, ordre des préfixes
// de `backdrop-filter`, mode « transparence réduite », et contraste du texte sur chaque matériau de verre dans les 16
// thèmes (jetons réels du CSS, pas des copies). Code de sortie 1 au premier écart.
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../../src/", import.meta.url));
const walk = (dir) => readdirSync(dir, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name)]));
const files = walk(root);
const css = files.filter((f) => f.endsWith(".css")).map((f) => readFileSync(f, "utf8")).join("\n");
const tsx = files.filter((f) => /\.tsx?$/.test(f)).map((f) => readFileSync(f, "utf8")).join("\n");
const noComments = css.replace(/\/\*[\s\S]*?\*\//g, "");
const source = noComments.replace(/url\([^)]*\)/g, "url()").replace(/^\s*--(ink|specular)\s*:.*$/gm, "");

const errors = [];
const fail = (msg) => errors.push(msg);

// 1. Valeurs figées ------------------------------------------------------------------------------------------
const filters = [...source.matchAll(/(?<!-webkit-)backdrop-filter\s*:\s*([^;{}]+)[;}]/g)].map((m) => m[1].trim());
const count = (n, label) => n > 0 && fail(`${n} ${label}`);
count(filters.filter((v) => /blur\(\s*[\d.]+px/.test(v)).length, "flou(s) en pixels : utiliser blur(var(--blur-*))");
count(filters.filter((v) => v !== "none" && !v.includes("blur(")).length, "backdrop-filter sans blur() : déclaration invalide");
count(filters.filter((v) => /saturate\(\s*[\d.]+%/.test(v)).length, "saturate() figé : utiliser var(--saturate-*)");
count([...source.matchAll(/rgba\(\s*(?:0\s*,\s*0\s*,\s*0|255\s*,\s*255\s*,\s*255)\s*,\s*(?!0\s*\))/g)].length, "rgba noir ou blanc figé : color-mix sur var(--ink) ou var(--specular)");
const mixes = [];
for (let i = source.indexOf("color-mix("); i !== -1; i = source.indexOf("color-mix(", i + 1)) {
  let depth = 0;
  for (let j = i + 9; j < source.length; j++) {
    if (source[j] === "(") depth++;
    if (source[j] === ")" && --depth === 0) { mixes.push(source.slice(i, j + 1)); break; }
  }
}
count(mixes.filter((c) => /#(?:0{3}|0{6}|f{3}|f{6})\b|\b(?:black|white)\b/i.test(c)).length, "neutre littéral dans un color-mix");
count([...source.matchAll(/(?<![-\w])backdrop-filter\s*:[^;{}]+;\s*-webkit-backdrop-filter\s*:/g)].length, "règle(s) avec backdrop-filter avant -webkit-backdrop-filter (le minifieur supprime la version standard)");
count([...source.matchAll(/([^{}]+)\{([^{}]*)\}/g)].filter((m) => /(?<![-\w])backdrop-filter\s*:/.test(m[2]) && !/-webkit-backdrop-filter/.test(m[2])).length, "règle(s) sans -webkit-backdrop-filter");
count([...tsx.matchAll(/rgba\(\s*(?:0\s*,\s*0\s*,\s*0|255\s*,\s*255\s*,\s*255)\s*,/g)].length, "rgba figé dans un style en ligne (TSX)");

// 2. Variables utilisées sans définition --------------------------------------------------------------------------
const defined = new Set([...noComments.matchAll(/(--[\w-]+)\s*:/g)].map((m) => m[1]));
for (const m of tsx.matchAll(/["'](--[\w-]+)["']/g)) defined.add(m[1]);
const undef = [...new Set([...noComments.matchAll(/var\((--[\w-]+)/g)].map((m) => m[1]))].filter((n) => !defined.has(n));
if (undef.length) fail(`variables non définies : ${undef.join(", ")}`);

// 3. Transparence réduite -----------------------------------------------------------------------------------------
const reduced = /@media \(prefers-reduced-transparency: reduce\)\s*\{([\s\S]*?)\n\}/.exec(noComments)?.[1] ?? "";
for (const t of ["--blur-scale: 0", "--glass-surface-bg", "--glass-card-bg", "--glass-floating-bg"]) if (!reduced.includes(t)) fail(`mode transparence réduite : ${t} absent`);

// 4. Contraste sur les matériaux de verre, thème par thème -------------------------------------------------------
const rules = [...noComments.matchAll(/(^|\n)(:root[^{}]*)\{([^{}]*)\}/g)].map((m) => {
  const vars = {};
  for (const d of m[3].matchAll(/--([\w-]+)\s*:\s*([^;]+);/g)) vars[d[1]] = d[2].trim().replace(/\s+/g, " ");
  return { selectors: m[2].split(",").map((s) => s.trim()), vars };
});
const themes = [...new Set(rules.flatMap((r) => r.selectors).map((s) => /data-theme="([\w-]+)"/.exec(s)?.[1]).filter(Boolean))].filter((t) => rules.some((r) => r.selectors.includes(`:root[data-theme="${t}"]`) && "bg-canvas" in r.vars));
const resolve = (theme) => {
  const vars = {};
  for (const r of rules) if (r.selectors.includes(":root") || r.selectors.includes(`:root[data-theme="${theme}"]`)) Object.assign(vars, r.vars);
  return vars;
};
const split = (text) => {
  const parts = []; let depth = 0, cur = "";
  for (const ch of text) { if (ch === "(") depth++; if (ch === ")") depth--; if (ch === "," && depth === 0) { parts.push(cur.trim()); cur = ""; } else cur += ch; }
  parts.push(cur.trim()); return parts;
};
function evaluate(expr, vars) {
  const e = expr.trim();
  if (e === "transparent") return { r: 0, g: 0, b: 0, a: 0 };
  const hex = /^#([0-9a-f]{6})$/i.exec(e);
  if (hex) return { r: parseInt(hex[1].slice(0, 2), 16), g: parseInt(hex[1].slice(2, 4), 16), b: parseInt(hex[1].slice(4, 6), 16), a: 1 };
  const rgb = /^rgba?\(([^)]+)\)$/.exec(e);
  if (rgb) { const [r, g, b, a = "1"] = rgb[1].split(",").map((x) => x.trim()); return { r: +r, g: +g, b: +b, a: +a }; }
  const v = /^var\(--([\w-]+)\)$/.exec(e);
  if (v) { if (vars[v[1]] === undefined) throw new Error(`--${v[1]} introuvable`); return evaluate(vars[v[1]], vars); }
  const mix = /^color-mix\(([\s\S]*)\)$/.exec(e);
  if (mix) {
    const [, c1, c2] = split(mix[1]);
    const pct = (s) => { const m = /^(.*?)\s+([\d.]+)%$/.exec(s); return m ? { c: m[1], p: +m[2] / 100 } : { c: s, p: undefined }; };
    let { c: ca, p: pa } = pct(c1); let { c: cb, p: pb } = pct(c2);
    if (pa === undefined && pb === undefined) pa = pb = 0.5; else if (pa === undefined) pa = 1 - pb; else if (pb === undefined) pb = 1 - pa;
    const A = evaluate(ca, vars), B = evaluate(cb, vars), wa = pa * A.a, wb = pb * B.a, a = wa + wb;
    return a === 0 ? { r: 0, g: 0, b: 0, a: 0 } : { r: (A.r * wa + B.r * wb) / a, g: (A.g * wa + B.g * wb) / a, b: (A.b * wa + B.b * wb) / a, a };
  }
  throw new Error(`expression non prise en charge : ${e}`);
}
/** Couleurs d'un matériau : une couleur, ou les arrêts d'un dégradé (le pire cas est testé). */
const materialColors = (expr, vars) => {
  const g = /^linear-gradient\(([\s\S]*)\)$/.exec(expr.trim());
  if (!g) return [evaluate(expr, vars)];
  return split(g[1]).slice(1).map((stop) => evaluate(stop.replace(/\s+[\d.]+%$/, ""), vars));
};
const over = (top, below) => { const a = top.a + below.a * (1 - top.a); const m = (t, b) => (t * top.a + b * below.a * (1 - top.a)) / a; return { r: m(top.r, below.r), g: m(top.g, below.g), b: m(top.b, below.b), a }; };
const lum = (c) => { const f = (v) => { const s = v / 255; return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b); };
const ratio = (a, b) => { const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x); return (hi + 0.05) / (lo + 0.05); };

let measured = 0;
for (const theme of themes) {
  const vars = resolve(theme);
  try {
    const canvas = evaluate("var(--bg-canvas)", vars);
    const hotspot = over(evaluate("color-mix(in srgb, var(--accent-primary) 22%, transparent)", vars), canvas);
    for (const material of ["glass-surface-bg", "glass-card-bg", "glass-floating-bg", "glass-inset-bg"]) {
      for (const backdrop of [canvas, hotspot]) {
        for (const fill of materialColors(vars[material], vars)) {
          const surface = over(fill, backdrop);
          for (const [token, min] of [["text-heading", 7], ["text-body", 7], ["text-muted", 4.5]]) {
            measured++;
            const r = ratio(evaluate(`var(--${token})`, vars), surface);
            if (r < min) fail(`${theme} : ${token} sur ${material} = ${r.toFixed(2)}:1 (min ${min})`);
          }
        }
      }
    }
    measured++;
    if (ratio(evaluate("var(--accent-primary-fg)", vars), evaluate("var(--accent-primary)", vars)) < 4.5) fail(`${theme} : texte sur bouton principal < 4,5:1`);
  } catch (err) {
    fail(`${theme} : ${err.message}`);
  }
}
if (themes.length !== 16) fail(`${themes.length} thèmes détectés (16 attendus) : ${themes.join(", ")}`);

if (errors.length) {
  console.error(errors.map((e) => `::error::${e}`).join("\n"));
  process.exit(1);
}
console.log(`glass-check : ${themes.length} thèmes, ${measured} mesures de contraste, aucune valeur figée.`);
