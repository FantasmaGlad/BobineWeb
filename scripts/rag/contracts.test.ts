import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { ACTIVE_FILTER, frameworkFilter, normalizeResult, plainSnippet } from "../../src/lib/rag/results.mjs";
import { exportWeb } from "./export";
import { documentRows } from "./sync";

test("les filtres restreignent réellement le framework et la version", () => {
  assert.equal(frameworkFilter("nextjs", "16.4.2"), `${ACTIVE_FILTER} AND framework: ANY("nextjs") AND version: ANY("16.4.2")`);
  assert.throws(() => frameworkFilter('nextjs") OR true'));
  assert.throws(() => frameworkFilter("nextjs", '16") OR true'));
  assert.throws(() => frameworkFilter("all", "16.4.2"));
});
test("les Struct gRPC et les métadonnées canoniques classent les fiches sans heuristique de titre", () => {
  const result = normalizeResult({ document: { id: "x", structData: { fields: {
    title: { stringValue: "Mini PC" }, platform: { stringValue: "amazon" }, source_url: { stringValue: "https://example.com" },
  } }, derivedStructData: { fields: { snippets: { listValue: { values: [ { structValue: { fields: { snippet: { stringValue: "<b>Intel</b> &amp; AMD" } } } } ] } } } } } });
  assert.equal(result?.platform, "amazon"); assert.equal(result?.snippet, "Intel & AMD");
  assert.equal(result?.url, "https://example.com");
  assert.equal(normalizeResult({document:{id:"empty"}}), null);
});
test("l'architecture exportée reprend exactement les sources publiques et les prix courants restent hors index", () => {
  const root = resolve("."); const bobineRoot = resolve(process.env.BOBINE_SOURCE_DIR || "../Bobine");
  const docs = exportWeb(root, bobineRoot);
  assert.equal(docs.find(d => d.key === "specs/docs/ARCHITECTURE.md")?.text, readFileSync(resolve(bobineRoot, "docs/ARCHITECTURE.md"), "utf8"));
  assert.ok(docs.some(d => d.key.startsWith("docs/en/")));
  assert.ok(docs.filter(d => d.platform === "aliexpress").every(d => !d.text.includes('"price"')));
  assert.ok(!docs.some(d => d.key.includes(".agents")));
});
test("l'import refuse une source vide, un doublon ou un secret et produit des empreintes stables", () => {
  const source = { key:"a",title:"A",text:"contenu",source_url:"https://example.com/a",platform:"doc",locale:"fr" };
  assert.deepEqual(documentRows([source]),documentRows([source]));
  assert.throws(() => documentRows([])); assert.throws(() => documentRows([source,source]));
  assert.throws(() => documentRows([{...source,text:"-----BEGIN " + "PRIVATE KEY-----"}]));
  assert.notEqual(documentRows([source])[0].hash,documentRows([{...source,text:"modifié"}])[0].hash);
});

test("les extraits HTML sont lus par un parseur et ignorent les éléments exécutables", () => {
  assert.equal(plainSnippet('<p>Guide <b>utile</b></p><script>alert(1)</script ><style>body{}</style>'), "Guide utile");
  assert.equal(plainSnippet('<p>A &amp; B &#233;</p>'), "A & B é");
});
