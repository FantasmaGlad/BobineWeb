#!/usr/bin/env node
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import postcss from "postcss";
// globals.css n'est plus qu'une liste d'importations : on lit les fichiers dans l'ordre de la cascade.
const readCss = (file) => readFileSync(file, "utf8").replace(/@import\s+"([^"]+)";\s*/g, (_, rel) => readCss(join(dirname(file), rel)));
const css = postcss.parse(readCss("src/app/globals.css"));
const registry = readFileSync("src/lib/themes.ts", "utf8");
const themeNames = [...registry.slice(0, registry.indexOf("export const themes")).matchAll(/"([\w-]+)"/g)].map((m) => m[1]);
const output = postcss.root();
output.append(postcss.comment({ text: "Fichier généré par scripts/ci/export-tokens.mjs ; modifier les sources des jetons." }));
const found = new Set();
css.walkRules((rule) => {
  if (!rule.selectors.every((s) => /^:root(?:\[data-theme(?:="[\w-]+")?\])?$/.test(s))) return;
  const copy = rule.clone({ nodes: [] });
  rule.each((node) => { if (node.type === "decl" && node.prop.startsWith("--")) copy.append(node.clone()); });
  if (!copy.nodes.length) return;
  for (const name of rule.selector.matchAll(/data-theme="([\w-]+)"/g)) found.add(name[1]);
  if (rule.parent.type === "atrule") {
    const wrapper = rule.parent.clone({ nodes: [] }); wrapper.append(copy); output.append(wrapper);
  } else output.append(copy);
});
if (themeNames.length !== 16 || themeNames.some((name) => !found.has(name))) throw new Error("Le CSS et le registre des 16 thèmes divergent");
const content = output.toString().trim() + "\n";
const target = "public/bobine-tokens.css";
if (process.argv.includes("--check")) {
  if (readFileSync(target, "utf8") !== content) throw new Error(`${target} périmé : node scripts/ci/export-tokens.mjs`);
} else writeFileSync(target, content);
console.log(`Jetons exportés : ${themeNames.length} thèmes, contrôle ${process.argv.includes("--check") ? "conforme" : "généré"}.`);
