#!/usr/bin/env node
// Garde-fou du verre et des jetons de style : aucune valeur figée, aucune variable non définie, ordre des préfixes
// de `backdrop-filter`, mode « transparence réduite », et contraste du texte sur chaque matériau de verre dans les 16
// thèmes (jetons réels du CSS, pas des copies). Code de sortie 1 au premier écart.
import { checkStyleTokens } from "./style-tokens.mjs";
import { loadThemeColors } from "./theme-colors.mjs";
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

const tokenCheck = checkStyleTokens(root);
const errors = [...tokenCheck.errors];
const fail = (msg) => errors.push(msg);

// 0. Taille des feuilles : aucune feuille de plus de 600 lignes (globals.css n'est qu'une liste d'@import ; ajouter les
// règles dans la partie qui correspond au domaine, ou dans une feuille de composant sous src/styles/components/).
const MAX_CSS_LINES = 600;
for (const f of files.filter((f) => f.endsWith(".css"))) {
  const n = readFileSync(f, "utf8").split("\n").length;
  if (n > MAX_CSS_LINES) fail(`${f.replace(root, "src/")} : ${n} lignes (maximum ${MAX_CSS_LINES}) : scinder la feuille, ne pas l'allonger`);
}

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

// 2bis. Chaque jeton --z-N porte exactement N (une collision de noms a déjà inversé un z-index de 1 en -1 : contenu masqué,
// cartes sans survol ni clic) ; les valeurs négatives se nomment --z-neg-N.
for (const m of noComments.matchAll(/(--z-(neg-)?(\d+))\s*:\s*(-?\d+)\s*;/g)) {
  const expected = (m[2] ? -1 : 1) * Number(m[3]);
  if (Number(m[4]) !== expected) fail(`${m[1]} vaut ${m[4]} (attendu ${expected})`);
}

// 3. Transparence réduite -----------------------------------------------------------------------------------------
const reduced = /@media \(prefers-reduced-transparency: reduce\)\s*\{([\s\S]*?)\n\}/.exec(noComments)?.[1] ?? "";
for (const t of ["--blur-scale: 0", "--glass-surface-bg", "--glass-card-bg", "--glass-floating-bg", "--glass-modal-bg"]) if (!reduced.includes(t)) fail(`mode transparence réduite : ${t} absent`);

const opaque = /@supports not \(\(backdrop-filter:[\s\S]*?\)\)\s*\{([\s\S]*?)\n\}/.exec(noComments)?.[1] ?? "";
for (const t of ["--blur-scale: 0", "--glass-surface-bg: var(--bg-card)", "--glass-card-bg: var(--bg-card)", "--glass-floating-bg: var(--bg-surface-elevated)", "--glass-modal-bg: var(--bg-surface-elevated)"]) if (!opaque.includes(t)) fail(`repli sans filtre : ${t} absent`);

// 4. Contraste sur les matériaux de verre, thème par thème -------------------------------------------------------
const { themes, resolve, evaluate, materialColors, over, ratio } = loadThemeColors(noComments);

let measured = 0;
for (const theme of themes) {
  const vars = resolve(theme);
  try {
    const canvas = evaluate("var(--bg-canvas)", vars);
    const hotspot = over(evaluate("color-mix(in srgb, var(--accent-primary) 22%, transparent)", vars), canvas);
    for (const material of ["glass-surface-bg", "glass-card-bg", "glass-floating-bg", "glass-modal-bg", "glass-inset-bg"]) {
      for (const backdrop of [canvas, hotspot]) {
        for (const fill of materialColors(vars[material], vars)) {
          const surface = over(fill, backdrop);
          for (const [token, min] of [["text-heading", 7], ["text-body", 7], ["text-muted", 4.5], ["accent-text", 4.5], ["accent-success", 4.5], ["text-dim", 4.5], ["status-warning-text", 4.5], ["status-danger-text", 4.5], ["status-info-text", 4.5], ["channel-beta", 4.5], ["channel-canary", 4.5]]) {
            measured++;
            const r = ratio(evaluate(`var(--${token})`, vars), surface);
            if (r < min) fail(`${theme} : ${token} sur ${material} = ${r.toFixed(2)}:1 (min ${min})`);
          }
        }
      }
    }
    for (const family of ["success", "warning", "danger", "info"]) {
      const r = ratio(evaluate(`var(--status-${family}-fg)`, vars), evaluate(`var(--status-${family})`, vars));
      measured++;
      if (r < 4.5) fail(`${theme} : texte sur état ${family} = ${r.toFixed(2)}:1`);
      const label = ratio(evaluate(`var(--status-${family}-text)`, vars), evaluate(`var(--status-${family}-bg)`, vars));
      measured++;
      if (label < 4.5) fail(`${theme} : libellé sur fond d’état ${family} = ${label.toFixed(2)}:1`);
    }
    for (const channel of ["stable", "beta", "canary"]) {
      const r = ratio(evaluate(`var(--channel-${channel}-fg)`, vars), evaluate(`var(--channel-${channel}-bg)`, vars));
      measured++;
      if (r < 4.5) fail(`${theme} : texte sur canal ${channel} = ${r.toFixed(2)}:1`);
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
console.log(`Cliquet : ${JSON.stringify(tokenCheck.categories)}`);
console.log(`glass-check : ${themes.length} thèmes, ${measured} mesures de contraste, aucune valeur figée.`);
