import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { execFileSync } from "node:child_process";
import { docChapters } from "../../src/content/docs/chapters";
import * as faq from "../../src/content/docs/faq-data";

export interface SourceDocument {
  key: string; title: string; text: string; source_url: string;
  platform: string; locale: string; framework?: string; version?: string; source_revision?: string;
}
export function exportWeb(root: string, bobineRoot: string): SourceDocument[] {
  const output: SourceDocument[] = [];
  for (const locale of ["fr", "en"] as const) {
    for (const ch of docChapters[locale]) output.push({
      key: `docs/${locale}/${ch.id}`, title: ch.title, locale, platform: "doc",
      source_url: `https://bobine.fit/${locale}/documentation#${ch.id}`,
      text: [`# ${ch.title}`, ch.summary, ...ch.subsections.flatMap(s => [`## ${s.subtitle}`, ...s.paragraphs])].join("\n\n"),
    });
  }
  output.push({ key: "docs/faq", title: "FAQ Bobine FR/EN", locale: "multi", platform: "doc",
    source_url: "https://bobine.fit/fr/documentation/faq", text: JSON.stringify(faq, null, 2) });
  const products = JSON.parse(readFileSync(join(root, "src/content/products.json"), "utf8"));
  for (const [id, p] of Object.entries(products) as [string, Record<string, unknown>][]) {
    // La fiche conserve les données canoniques, sans déduire une caractéristique absente.
    output.push({ key: `catalog/amazon/${id}`, title: `Amazon — ${(p.name as { fr: string }).fr}`,
      locale: "multi", platform: "amazon", source_url: String(p.listing || `https://www.amazon.fr/dp/${id}`),
      text: JSON.stringify(p, null, 2) });
  }
  const ali = JSON.parse(readFileSync(join(root, "src/content/aliexpress-snapshot.json"), "utf8"));
  for (const [id, raw] of Object.entries(ali) as [string, Record<string, unknown>][]) {
    const { price: _price, link: _link, ...p } = raw;
    void _price; void _link;
    output.push({ key: `catalog/aliexpress/${id}`, title: `AliExpress — ${p.title || id}`, locale: "multi",
      platform: "aliexpress", source_url: `https://fr.aliexpress.com/item/${id}.html`,
      text: `Prix à consulter dans le catalogue courant ou sur l'annonce ; les informations du snapshot sont datées et ne prouvent pas la disponibilité.\n${JSON.stringify(p, null, 2)}` });
  }
  const revision = execFileSync("git", ["-C", bobineRoot, "rev-parse", "HEAD"], { encoding: "utf8" }).trim();
  for (const file of ["docs/ARCHITECTURE.md", "docs/ARCHITECTURE.en.md", "assistant/README.md", "media/README.md", "media/PROTOCOL.md"]) {
    const path = join(bobineRoot, file);
    if (!existsSync(path)) throw new Error(`Source canonique absente : ${file}`);
    output.push({ key: `specs/${file}`, title: `Bobine — ${file}`, locale: file.includes(".en.") ? "en" : "multi",
      platform: "spec", source_revision: revision,
      source_url: `https://github.com/FantasmaGlad/Bobine/blob/${revision}/${file}`,
      text: readFileSync(path, "utf8") });
  }
  for (const file of ["src/content/README-hardware.md", "src/content/compare.ts"]) output.push({
    key: `specs/web/${file}`, title: `BobineWeb — ${file}`, locale: "multi", platform: "spec",
    source_url: `https://github.com/FantasmaGlad/BobineWeb/blob/main/${file}`, text: readFileSync(join(root, file), "utf8"),
  });
  return output;
}
