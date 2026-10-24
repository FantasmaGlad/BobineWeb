import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { checkStyleTokens } from "./style-tokens.mjs";
const probes = [
  ["color", "css", ".probe { color: #abc; }"],
  ["color", "css", ".probe { background: hsl(12 34% 56%); }"],
  ["shadow", "css", ".probe { box-shadow: 0 0 2px rgb(12 34 56); }"],
  ["foreground", "css", ".probe { color: #fff; }"],
  ["zIndex", "css", ".probe { z-index: 123; }"],
  ["radius", "css", ".probe { border-radius: 42px; }"],
  ["fontSize", "css", ".probe { font-size: clamp(1rem, 2vw, 2rem); }"],
  ["fallback", "css", ".probe { color: var(--text-body, #fff); }"],
  ["color", "tsx", 'const component = <div style={{ color: "#abc" }} />;'],
  ["fontSize", "tsx", "const component = <div style={{ fontSize: 13 }} />;"],
];
for (const [category, extension, source] of probes) test(`refuser une injection ${category} dans ${extension}`, () => {
  const dir = mkdtempSync(join(tmpdir(), "bobine-style-probe-"));
  try {
    writeFileSync(join(dir, `probe.${extension}`), source);
    assert.ok(checkStyleTokens(dir).categories[category] > 0);
  } finally { rmSync(dir, { recursive: true, force: true }); }
});
test("accepter des propriétés utilisant les jetons", () => {
  const dir = mkdtempSync(join(tmpdir(), "bobine-style-probe-"));
  try {
    writeFileSync(join(dir, "probe.css"), ".probe { color: var(--text-body); border-radius: var(--radius-sm); z-index: var(--z-1); font-size: var(--fs-1rem); }");
    assert.deepEqual(checkStyleTokens(dir).errors, []);
  } finally { rmSync(dir, { recursive: true, force: true }); }
});
