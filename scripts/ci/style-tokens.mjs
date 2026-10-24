import { readFileSync, readdirSync } from "node:fs";
import { join, relative } from "node:path";
import postcss from "postcss";
const walk = (dir) => readdirSync(dir, { withFileTypes: true }).flatMap((e) => e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name)]);
const exceptions = JSON.parse(readFileSync(new URL("./style-exceptions.json", import.meta.url), "utf8"));
const literal = /#[\da-f]{3}(?:[\da-f]{1}|[\da-f]{3}|[\da-f]{5})?\b|\b(?:rgb|hsl)a?\(/i;
export function checkStyleTokens(root) {
  const errors = [];
  const categories = { color: 0, shadow: 0, foreground: 0, zIndex: 0, radius: 0, fontSize: 0, fallback: 0 };
  const fail = (category, file, line, value) => { categories[category]++; errors.push(`${file}:${line} [${category}] ${value}`); };
  for (const file of walk(root)) {
    const name = relative(process.cwd(), file);
    if (file.endsWith(".css")) {
      postcss.parse(readFileSync(file, "utf8"), { from: file }).walkDecls((d) => {
        let print = false;
        for (let p = d.parent; p; p = p.parent) if (p.type === "atrule" && p.name === "media" && p.params === "print") print = true;
        if (print) return;
        const palette = d.prop.startsWith("--") && d.parent.type === "rule" && d.parent.selectors.every((s) => /^:root(?:\[data-theme(?:="[\w-]+")?\])?$/.test(s));
        if (palette) return;
        const officialColor = exceptions.cssColorSelectors.some((s) => new RegExp(s).test(d.parent.selector ?? ""));
        const line = d.source.start.line;
        if (literal.test(d.value) && !officialColor) fail(d.prop.includes("shadow") ? "shadow" : "color", name, line, `${d.prop}: ${d.value}`);
        if (/^(?:color|fill|stroke)$/.test(d.prop) && /#fff(?:fff)?\b|\bwhite\b/i.test(d.value) && !officialColor) fail("foreground", name, line, d.value);
        const cat = { "font-size": "fontSize", "border-radius": "radius", "z-index": "zIndex" }[d.prop];
        if (cat && /\d/.test(d.value.replace(/var\([^)]*\)/g, "")) && d.value !== "0") fail(cat, name, line, d.value);
        if (/var\(--[\w-]+\s*,/.test(d.value)) fail("fallback", name, line, d.value);
      });
    } else if (/\.tsx?$/.test(file)) {
      const source = readFileSync(file, "utf8");
      const print = name.startsWith("src/lib/pdf/") || name.endsWith("/opengraph-image.tsx");
      for (const [index, line] of source.split("\n").entries()) {
        if (!exceptions.typescriptColorFiles.includes(name) && /(?:["'`]#[\da-f]{3,8}["'`]|(?:rgb|hsl)a?\()/i.test(line)) fail("color", name, index + 1, line.trim());
        if (print) continue;
        for (const [prop, category] of [["zIndex", "zIndex"], ["borderRadius", "radius"], ["fontSize", "fontSize"]]) if (new RegExp(`\\b${prop}\\s*:\\s*(?:[\\d.]|["'][\\d.])`).test(line)) fail(category, name, index + 1, line.trim());
      }
    }
  }
  return { errors, categories };
}
