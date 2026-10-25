#!/usr/bin/env node
// Contrôle de la fenêtre de téléchargement sur le build servi (Chromium, pas du matériel) :
// 0. les cartes de l'accueil ne sont recouvertes par aucun élément (1280 et 390 px) ;
// 1. le focus reste dans la fenêtre sur 40 tabulations (avant et arrière) ;
// 2. Échap la ferme et le focus revient au déclencheur ;
// 3. à 740 x 360 (téléphone en paysage), le corps défilable occupe au moins 50 % de la hauteur ;
// 4. à 360 px de large : aucun débordement horizontal, la feuille est collée en bas, cibles d'au moins 44 px.
import { delay, launchChrome } from "./cdp.mjs";

const origin = process.env.MODAL_CHECK_URL ?? "http://127.0.0.1:3102";
const path = process.env.MODAL_CHECK_PATH ?? "/fr/telechargement";
const browser = await launchChrome();
const { send, evaluate } = browser;
const failures = [];
const fail = (msg) => failures.push(msg);

async function open(width, height, mobile) {
  await send("Emulation.setDeviceMetricsOverride", { width, height, deviceScaleFactor: 1, mobile });
  await send("Emulation.setTouchEmulationEnabled", { enabled: mobile, maxTouchPoints: 5 });
  await send("Page.navigate", { url: origin + path });
  for (let i = 0; i < 100; i++) {
    if (await evaluate(`document.readyState === 'complete' && !![...document.querySelectorAll('a[data-platform]')].some((e) => e.getClientRects().length)`)) break;
    await delay(100);
  }
  await evaluate("document.fonts.ready");
  await delay(500);
  // Le déclencheur est une carte de plateforme ; on la focalise comme le ferait un clavier, puis on l'active.
  await evaluate(`(() => { const t = [...document.querySelectorAll('a[data-platform]')].find((e) => e.getClientRects().length); t.id = 'modal-trigger'; t.focus(); t.click(); })()`);
  for (let i = 0; i < 50; i++) {
    if (await evaluate(`!!document.querySelector('dialog.dl-panel[open]')`)) return;
    await delay(100);
  }
  throw new Error("la fenêtre de téléchargement ne s'ouvre pas");
}

const key = (k, extra = {}) => send("Input.dispatchKeyEvent", { type: "keyDown", key: k, code: k === "Tab" ? "Tab" : k, windowsVirtualKeyCode: k === "Tab" ? 9 : 27, ...extra }).then(() => send("Input.dispatchKeyEvent", { type: "keyUp", key: k, code: k === "Tab" ? "Tab" : k, windowsVirtualKeyCode: k === "Tab" ? 9 : 27, ...extra }));

// Les cartes de l'accueil doivent recevoir le survol et le clic : rien ne doit les recouvrir (un jeton z-index inversé
// les avait masquées, la page restait pourtant « verte » pour les contrôles de géométrie).
async function checkHomeCards(width, height, mobile) {
  await send("Emulation.setDeviceMetricsOverride", { width, height, deviceScaleFactor: 1, mobile });
  await send("Page.navigate", { url: origin + "/fr" });
  for (let i = 0; i < 100; i++) {
    if (await evaluate(`document.readyState === 'complete' && !!document.querySelector('a[data-platform]')`)) break;
    await delay(100);
  }
  await delay(600);
  const covered = await evaluate(`(() => [...document.querySelectorAll('a[data-platform]')].filter((e) => e.getClientRects().length).flatMap((e) => {
    e.scrollIntoView({ block: 'center', inline: 'center' });
    const r = e.getBoundingClientRect();
    const x = r.left + r.width / 2, y = r.top + r.height / 2;
    // Carrousel horizontal sur téléphone : une carte hors de l'écran ne peut pas être touchée, elle n'est pas testée.
    if (x < 0 || x > innerWidth || y < 0 || y > innerHeight) return [];
    const top = document.elementFromPoint(x, y);
    return e === top || e.contains(top) ? [] : [e.dataset.platform + ' recouverte par ' + (top ? top.tagName + '.' + String(top.className).slice(0, 40) : 'rien')];
  }))()`);
  if (covered.length) fail(`accueil ${width} px : cartes de téléchargement recouvertes : ${covered.join(", ")}`);
}

try {
  await send("Page.enable");
  await checkHomeCards(1280, 900, false);
  await checkHomeCards(390, 800, true);
  await send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-motion", value: "reduce" }] });

  // 1 et 2 : focus et retour de focus (bureau)
  await open(1280, 800, false);
  let outside = 0;
  for (let i = 0; i < 40; i++) {
    await key("Tab", i % 2 ? { modifiers: 8 } : {});
    if (!(await evaluate(`!!document.activeElement?.closest('dialog.dl-panel')`))) outside++;
  }
  if (outside) fail(`le focus sort de la fenêtre ${outside} fois sur 40 tabulations`);
  await key("Escape");
  await delay(300);
  if (await evaluate(`!!document.querySelector('dialog.dl-panel[open]')`)) fail("Échap ne ferme pas la fenêtre");
  if (!(await evaluate(`document.activeElement?.id === 'modal-trigger'`))) fail("le focus ne revient pas au déclencheur");

  // 3 : téléphone en paysage
  await open(740, 360, true);
  const landscape = await evaluate(`(() => { const b = document.querySelector('.dl-panel__body').getBoundingClientRect(); return { ratio: b.height / innerHeight, scroll: document.documentElement.scrollWidth, width: document.documentElement.clientWidth }; })()`);
  if (landscape.ratio < 0.5) fail(`corps utile à ${Math.round(landscape.ratio * 100)} % de la hauteur à 740 x 360 (minimum 50 %)`);
  if (landscape.scroll > landscape.width) fail("débordement horizontal à 740 x 360");

  // 4 : téléphone en portrait
  await open(360, 740, true);
  const portrait = await evaluate(`(() => {
    const dialog = document.querySelector('dialog.dl-panel');
    const r = dialog.getBoundingClientRect();
    const small = [...dialog.querySelectorAll('button, a, summary')].filter((e) => e.getClientRects().length).flatMap((e) => { const b = e.getBoundingClientRect(); return b.width < 43.9 || b.height < 43.9 ? [{ tag: e.tagName, text: e.textContent.trim().slice(0, 30), w: Math.round(b.width), h: Math.round(b.height) }] : []; });
    return { bottom: Math.round(innerHeight - r.bottom), width: Math.round(r.width), overflow: dialog.scrollWidth > dialog.clientWidth, docOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth, small };
  })()`);
  if (portrait.bottom > 1) fail(`la feuille n'est pas collée en bas (${portrait.bottom} px d'écart)`);
  if (portrait.overflow || portrait.docOverflow) fail("débordement horizontal à 360 px");
  if (portrait.small.length) fail(`cibles sous 44 px : ${JSON.stringify(portrait.small)}`);

  if (failures.length) throw new Error(failures.join("\n"));
  console.log("modal-check : focus conservé sur 40 tabulations, retour du focus, corps utile en paysage, feuille du bas à 360 px.");
} finally {
  await browser.close();
}
