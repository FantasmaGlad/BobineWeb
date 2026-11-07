#!/usr/bin/env node
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import postcss from "postcss";
// globals.css n'est plus qu'une liste d'importations : on lit les fichiers dans l'ordre de la cascade.
const readCss = (file) => readFileSync(file, "utf8").replace(/@import\s+"([^"]+)";\s*/g, (_, rel) => readCss(join(dirname(file), rel)));
const css = postcss.parse(readCss("src/app/globals.css"));
import { THEME_IDS } from "../../src/lib/themePalettes.ts";
const themeNames = [...THEME_IDS];
const output = postcss.root();
output.append(postcss.comment({ text: "Fichier généré par scripts/ci/export-tokens.mjs ; modifier les sources des jetons." }));
const found = new Set();
css.walkRules((rule) => {
  if (!rule.selectors.every((s) => /^:root(?:\[data-theme(?:="[\w-]+")?\])?(?:\[data-mode(?:="(?:light|dark)")?\])?$/.test(s))) return;
  const copy = rule.clone({ nodes: [] });
  rule.each((node) => { if (node.type === "decl" && node.prop.startsWith("--")) copy.append(node.clone()); });
  if (!copy.nodes.length) return;
  for (const name of rule.selector.matchAll(/data-theme="([\w-]+)"\]\[data-mode="(light|dark)"/g)) found.add(name[1] + "/" + name[2]);
  if (rule.parent.type === "atrule") {
    const wrapper = rule.parent.clone({ nodes: [] }); wrapper.append(copy); output.append(wrapper);
  } else output.append(copy);
});
if (themeNames.length !== 9 || themeNames.some((name) => !found.has(name + "/light") || !found.has(name + "/dark"))) throw new Error("Le CSS et le registre des 9 thèmes (clair et sombre) divergent");
const content = output.toString().trim() + "\n";
const target = "public/bobine-tokens.css";
if (process.argv.includes("--check")) {
  if (readFileSync(target, "utf8") !== content) throw new Error(`${target} périmé : node scripts/ci/export-tokens.mjs`);
} else writeFileSync(target, content);
console.log(`Jetons exportés : ${themeNames.length} thèmes, contrôle ${process.argv.includes("--check") ? "conforme" : "généré"}.`);
