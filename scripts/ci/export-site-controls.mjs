#!/usr/bin/env node
// Exporte les mêmes règles de sélecteurs et les mêmes métadonnées pour les portails statiques.
import { readFile, writeFile } from "node:fs/promises";
import { resolve, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import postcss from "postcss";
import { themeMeta, lightThemes, darkThemes } from "../../src/lib/themes.ts";

const root = fileURLToPath(new URL("../../", import.meta.url));
async function load(file) {
  const sheet = postcss.parse(await readFile(file, "utf8"));
  for (const node of [...sheet.nodes]) {
    if (node.type === "atrule" && node.name === "import") {
      const path = node.params.match(/["']([^"']+)["']/)?.[1];
      if (path) node.replaceWith((await load(resolve(dirname(file), path))).nodes);
    }
  }
  return sheet;
}
const source = await load(join(root, "src/app/globals.css"));
const output = postcss.root();
source.walkRules((rule) => {
  const selectors = rule.selectors.filter((s) => /\.(?:theme-|locale-switcher|chevron-flip)/.test(s));
  if (!selectors.length) return;
  let copy = rule.clone({ selector: selectors.join(",\n") });
  for (let parent = rule.parent; parent?.type === "atrule"; parent = parent.parent) copy = parent.clone({ nodes: [copy] });
  output.append(copy);
});
const files = {
  "bobine-controls.css": "/* Généré depuis les sélecteurs du site principal. */\n" + output.toString() + "\n" + await readFile(join(root, "src/styles/components/brand-icon.css"), "utf8") + "\n" + Object.entries(themeMeta).map(([id, meta]) => `.theme-swatch-icon[data-theme="${id}"], [data-theme-value="${id}"] { --swatch-bg: ${meta.bg}; --swatch-accent: ${meta.accent}; }`).join("\n") + "\n",
  "bobine-themes.json": JSON.stringify({ lightThemes, darkThemes, themeMeta }, null, 2) + "\n",
  "bobine-icons.json": await readFile(join(root, "src/lib/assets.json"), "utf8"),
};
for (const [name, text] of Object.entries(files)) {
  const path = join(root, "public", name);
  if (process.argv.includes("--check")) {
    if (await readFile(path, "utf8") !== text) throw new Error(`${name} périmé`);
  } else await writeFile(path, text);
}
console.log("Sélecteurs, thèmes et registre d’icônes exportés depuis le site principal.");
