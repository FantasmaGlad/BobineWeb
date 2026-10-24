// Tests d'injection du garde-fou des icônes : une régression doit faire échouer check-assets.mjs.
import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const script = fileURLToPath(new URL("./check-assets.mjs", import.meta.url));
const registry = JSON.parse(readFileSync(fileURLToPath(new URL("../../src/lib/assets.json", import.meta.url)), "utf8"));

function run(mutate) {
  const dir = mkdtempSync(join(tmpdir(), "assets-"));
  try {
    const copy = structuredClone(registry);
    mutate(copy);
    const file = join(dir, "assets.json");
    writeFileSync(file, JSON.stringify(copy));
    return spawnSync(process.execPath, [script], { env: { ...process.env, ASSETS_REGISTRY: file }, encoding: "utf8" });
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

test("le registre réel est conforme", () => {
  assert.equal(run(() => {}).status, 0);
});

test("une couleur officielle sous 3:1 est refusée", () => {
  const r = run((d) => { d["os.linux"].tone = "brand"; d["os.linux"].color = "#FCC624"; });
  assert.equal(r.status, 1);
  assert.match(r.stderr, /os\.linux .*minimum 3:1/);
});

test("un fichier absent du registre est refusé comme orphelin", () => {
  const r = run((d) => { delete d["browser.opera"]; });
  assert.equal(r.status, 1);
  assert.match(r.stderr, /orphelin/);
});

test("une marque absente de NOTICE.md est refusée", () => {
  const r = run((d) => { d["os.linux"].name = "Marque inventée"; });
  assert.equal(r.status, 1);
  assert.match(r.stderr, /NOTICE\.md n'attribue pas/);
});
