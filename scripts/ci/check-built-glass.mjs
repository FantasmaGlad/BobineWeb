#!/usr/bin/env node
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import postcss from "postcss";
const walk = (dir) => readdirSync(dir, { withFileTypes: true }).flatMap((e) => e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name)]);
let sourceRules = 0;
for (const file of walk("src").filter((f) => f.endsWith(".css"))) postcss.parse(readFileSync(file, "utf8")).walkDecls("backdrop-filter", () => sourceRules++);
let rules = 0;
const errors = [];
for (const file of walk(".next/static").filter((f) => f.endsWith(".css"))) {
  postcss.parse(readFileSync(file, "utf8")).walkRules((rule) => {
    const standard = rule.nodes.filter((n) => n.type === "decl" && n.prop === "backdrop-filter");
    for (const d of standard) {
      const prefix = rule.nodes.find((n) => n.type === "decl" && n.prop === "-webkit-backdrop-filter" && n.value === d.value);
      if (!prefix || rule.nodes.indexOf(prefix) > rule.nodes.indexOf(d)) errors.push(`${file} : ${rule.selector}`);
      rules++;
    }
  });
}
if (rules === 0 || rules !== sourceRules || errors.length) throw new Error(`Verre construit : ${rules}/${sourceRules} règles, ${errors.length} préfixes manquants ou mal ordonnés\n${errors.join("\n")}`);
console.log(`Verre construit : ${rules} règles avec préfixe WebKit avant la propriété standard.`);
