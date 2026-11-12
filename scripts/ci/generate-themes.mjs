#!/usr/bin/env node
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { DEFAULT_THEME, SEMANTIC_COLORS, THEMES, contrast, deriveTokens, mix, paletteOf } from "../../src/lib/themePalettes.ts";

const target = fileURLToPath(new URL("../../src/styles/base/00-themes-generes.css", import.meta.url));

export function siteTokens(palette, mode) {
  const t = deriveTokens(palette, mode);
  const { bg, surface } = palette;
  const light = mode === "light";
  const canvas = light ? mix(bg, surface, 0.28) : bg;
  const card = light ? bg : mix(bg, surface, 0.5);
  const plane = light ? mix(bg, surface, 0.45) : mix(bg, surface, 0.75);
  const elevated = light ? bg : surface;
  const hover = light ? mix(bg, surface, 0.7) : t["bg-surface-hover"];
  const text = t["text-main"];
  const fgIsDark = contrast(t["accent-primary-fg"], "#000000") < contrast(t["accent-primary-fg"], "#ffffff");
  const border = mix(canvas, text, light ? 0.24 : 0.3);
  return {
    "bg-canvas": canvas,
    "bg-main": canvas,
    "bg-card": card,
    "bg-card-hover": light ? mix(bg, surface, 0.2) : mix(bg, surface, 0.62),
    "bg-surface": plane,
    "bg-surface-elevated": elevated,
    "bg-surface-hover": hover,
    "bg-inset": light ? mix(bg, surface, 0.6) : mix(bg, "#000000", 0.3),
    "text-heading": text,
    "text-main": text,
    "text-body": text,
    "text-base": text,
    "text-muted": t["text-muted"],
    "text-dim": t["text-dim"],
    "accent-primary": t["accent-primary"],
    "accent-primary-fg": t["accent-primary-fg"],
    "accent-text": t["accent-text"],
    "accent-hover": fgIsDark ? mix(t["accent-primary"], "#ffffff", 0.14) : mix(t["accent-primary"], "#000000", 0.14),
    "accent-success": t["accent-success-text"],
    "accent-warning": t["accent-warning-text"],
    "accent-error-text": t["accent-error-text"],
    "accent-info-text": t["accent-info-text"],
    "border-subtle": mix(canvas, text, light ? 0.14 : 0.2),
    "border-color": border,
    "border-hover": mix(border, text, 0.2),
    "border-vibrant": t["accent-text"],
    "border-focus": t["accent-text"],
  };
}

export function render() {
  const fallback = Object.entries(siteTokens(paletteOf(DEFAULT_THEME, "dark"), "dark")).map(([n, v]) => `  --${n}: ${v};`).join("\n");
  const semantic = Object.entries(SEMANTIC_COLORS).map(([n, v]) => `  --accent-${n}-base: ${v};`).join("\n");
  const blocks = [];
  for (const theme of THEMES) {
    for (const mode of ["light", "dark"]) {
      const body = Object.entries(siteTokens(paletteOf(theme.id, mode), mode)).map(([n, v]) => `  --${n}: ${v};`).join("\n");
      blocks.push(`:root[data-theme="${theme.id}"][data-mode="${mode}"] {\n  color-scheme: ${mode};\n${body}\n}`);
    }
  }
  return `/* GÉNÉRÉ par scripts/ci/generate-themes.mjs depuis src/lib/themePalettes.ts : ne pas modifier à la main.\n   Neuf thèmes, chacun en clair et en sombre : les quatre couleurs de la palette et les jetons qui en sont déduits. */\n:root {\n${fallback}\n${semantic}\n}\n\n${blocks.join("\n\n")}\n`;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const css = render();
  if (process.argv.includes("--check")) {
    if (readFileSync(target, "utf8") !== css) {
      console.error("src/styles/base/00-themes-generes.css n'est pas à jour : lancer « node scripts/ci/generate-themes.mjs ».");
      process.exit(1);
    }
  } else {
    writeFileSync(target, css);
    console.log(`00-themes-generes.css : ${THEMES.length * 2} palettes écrites.`);
  }
}
