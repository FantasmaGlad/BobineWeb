import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { ACTIVE_FILTER, frameworkFilter, normalizeResult, plainSnippet, relaxQuery } from "./results.mjs";
import { exportWeb, splitText } from "./export";
import { documentRows, retryableDocuments } from "./sync";

test("les filtres restreignent réellement le framework et la version", () => {
  assert.equal(frameworkFilter("nextjs", "16.4.2"), `${ACTIVE_FILTER} AND framework: ANY("nextjs") AND version: ANY("16.4.2")`);
  assert.throws(() => frameworkFilter('nextjs") OR true'));
  assert.throws(() => frameworkFilter("nextjs", '16") OR true'));
  assert.throws(() => frameworkFilter("all", "16.4.2"));
});
test("les Struct gRPC et les métadonnées canoniques classent les fiches sans heuristique de titre", () => {
  const result = normalizeResult({ document: { id: "x", structData: { fields: {
    title: { stringValue: "Mini PC" }, platform: { stringValue: "spec" }, source_url: { stringValue: "https://example.com" },
  } }, derivedStructData: { fields: { snippets: { listValue: { values: [ { structValue: { fields: { snippet: { stringValue: "<b>Intel</b> &amp; AMD" } } } } ] } } } } } });
  assert.equal(result?.platform, "spec"); assert.equal(result?.snippet, "Intel & AMD");
  assert.equal(result?.url, "https://example.com");
  assert.equal(normalizeResult({document:{id:"empty"}}), null);
});
test("l'architecture exportée reprend exactement les sources publiques et les prix courants restent hors index", () => {
  const bobineRoot = resolve(process.env.BOBINE_SOURCE_DIR || ["../Bobine", "../../Bobine"].find(p => existsSync(resolve(p))) || "../Bobine");
  const docs = exportWeb(bobineRoot);
  const architecture = docs.filter(d => d.key === "specs/docs/ARCHITECTURE.md" || d.key.startsWith("specs/docs/ARCHITECTURE.md#")).sort((a, b) => a.key.localeCompare(b.key));
  assert.equal(architecture.map(d => d.text).join(""), readFileSync(resolve(bobineRoot, "docs/ARCHITECTURE.md"), "utf8"));
  assert.ok(docs.every(d => d.text.length < 20000 || d.platform !== "doc"), "aucun document de documentation démesuré");
  assert.ok(docs.some(d => d.key.startsWith("docs/en/")));
  assert.ok(!docs.some(d => d.key.includes(".agents")));
});
test("l'import refuse une source vide, un doublon ou un secret et produit des empreintes stables", () => {
  const source = { key:"a",title:"A",text:"contenu",source_url:"https://example.com/a",platform:"doc",locale:"fr" };
  assert.deepEqual(documentRows([source]),documentRows([source]));
  assert.throws(() => documentRows([])); assert.throws(() => documentRows([source,source]));
  assert.throws(() => documentRows([{...source,text:"-----BEGIN " + "PRIVATE KEY-----"}]));
  assert.notEqual(documentRows([source])[0].hash,documentRows([{...source,text:"modifié"}])[0].hash);
});
test("un lien ou une révision qui bouge ne réimporte pas le corpus", () => {
  const source = { key:"a",title:"A",text:"contenu",source_url:"https://example.com/a",platform:"doc",locale:"fr",source_revision:"a".repeat(40) };
  const moved = { ...source, source_url:"https://example.com/a?rev=2", source_revision:"b".repeat(40) };
  assert.equal(documentRows([source])[0].hash, documentRows([moved])[0].hash);
  assert.equal(documentRows([source])[0].meta.source_revision, "a".repeat(40));
});

test("les extraits HTML sont lus par un parseur et ignorent les éléments exécutables", () => {
  assert.equal(plainSnippet('<p>Guide <b>utile</b></p><script>alert(1)</script ><style>body{}</style>'), "Guide utile");
  assert.equal(plainSnippet('<p>A &amp; B &#233;</p>'), "A & B é");
});

test("la reprise est bornée aux erreurs transitoires identifiées dans le manifeste", () => {
  const id = "a".repeat(32); const documents = [{ id, content: {uri:"gs://example/a.txt"} }];
  assert.deepEqual(retryableDocuments({ metadata:{failureCount:"1"},response:{errorSamples:[{code:5,message:`Document /documents/${id} absent temporairement`}] } },documents),documents);
  assert.throws(() => retryableDocuments({metadata:{failureCount:"2"},response:{errorSamples:[]}},documents));
  assert.throws(() => retryableDocuments({metadata:{failureCount:"1"},response:{errorSamples:[{code:7,message:`/documents/${id}`}] }},documents));
});

test("une question devient une recherche à mots alternatifs sans opérateur injectable", () => {
  assert.equal(relaxQuery("Comment fonctionne la radio ?"), "fonctionne OR radio");
  assert.equal(relaxQuery("mini PC pour 3 écrans"), "mini OR pc OR écrans");
  assert.equal(relaxQuery("Radio ?"), "radio");
  assert.equal(relaxQuery("Qui est Bobine ?", "radio"), "bobine OR radio");
  assert.equal(relaxQuery("Bobine", "bobine"), "bobine");
  assert.equal(relaxQuery("a OR (b) AND \"c\" -d NOT e: f"), "a or b and c d not e");
  assert.equal(relaxQuery('Tauri AND "secret" OR (admin) NOT user:root'), "tauri OR secret OR admin OR user OR root");
  assert.equal(relaxQuery("un deux trois quatre cinq six sept huit neuf dix").split(" OR ").length, 8);
});

test("le découpage des longs textes est sans perte et borné", () => {
  const long = Array.from({ length: 40 }, (_, i) => `## Section ${i}\n\n${"mot ".repeat(400)}\n`).join("\n");
  const parts = splitText(long);
  assert.ok(parts.length > 3); assert.equal(parts.join(""), long);
  assert.ok(parts.every(p => p.length <= 12000));
  assert.deepEqual(splitText("court"), ["court"]);
  const noHeadings = Array.from({ length: 200 }, () => "paragraphe ".repeat(40)).join("\n\n");
  assert.equal(splitText(noHeadings).join(""), noHeadings);
});
