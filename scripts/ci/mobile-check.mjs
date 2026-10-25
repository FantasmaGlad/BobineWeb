#!/usr/bin/env node
// Audit de géométrie sur le build servi : Chromium mesure des mises en page, pas du matériel Android.
import { delay, launchChrome } from "./cdp.mjs";
const origin = process.env.MOBILE_CHECK_URL ?? "http://127.0.0.1:3102";
const browser = await launchChrome();
const { send, evaluate } = browser;
try {
  await send("Page.enable");
  await send("Emulation.setTouchEmulationEnabled", { enabled: true, maxTouchPoints: 5 });
  await send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-motion", value: "reduce" }] });
  const failures = [];
  let measured = 0;
  const paths = process.env.MOBILE_CHECK_PATHS?.split(",") ?? ["/fr", "/en", "/fr/linux", "/en/linux", "/fr/documentation", "/en/documentation", "/fr/materiel/aliexpress", "/en/hardware/aliexpress", "/fr/materiel/amazon", "/en/hardware/amazon", "/fr/telechargement", "/en/download", "/fr/ressources", "/en/resources"];
  if (!process.env.MOBILE_CHECK_PATHS) paths.push(
    "/fr/fonctionnalites", "/en/features", "/fr/a-propos", "/en/about",
    "/fr/soutenir", "/en/support", "/fr/blog", "/en/blog", "/fr/credits", "/en/credits",
    "/fr/comparatif", "/en/compare",
    "/fr/comparatif/les-mills-cinema", "/en/compare/les-mills-cinema",
    "/fr/comparatif/wexer-fitness-on-demand", "/en/compare/wexer-fitness-on-demand",
    "/fr/comparatif/radical-fitness-yako", "/en/compare/radical-fitness-yako",
    "/fr/comparatif/affichage-dynamique-fitness", "/en/compare/digital-signage-fitness",
  );
  for (const path of paths) for (const width of [360, 390, 768, 1280]) {
    const response = await fetch(origin + path);
    if (!response.ok) throw new Error(`${path} : HTTP ${response.status}`);
    await send("Emulation.setDeviceMetricsOverride", { width, height: 900, deviceScaleFactor: 1, mobile: true });
    await send("Page.navigate", { url: origin + path });
    for (let retry = 0; retry < 100; retry++) {
      if (await evaluate(`document.readyState === 'complete' && location.pathname === ${JSON.stringify(path)}`)) break;
      await delay(100);
    }
    if (!await evaluate(`document.readyState === 'complete' && location.pathname === ${JSON.stringify(path)}`)) throw new Error(`${path} : navigation non terminée`);
    await evaluate("document.fonts.ready");
    for (const theme of ["lavande", "orchidee"]) {
      await evaluate(`document.documentElement.dataset.theme = ${JSON.stringify(theme)}; new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))`);
      await delay(700);
      const result = await evaluate(`(() => {
        const root = document.documentElement;
        const controls = [...document.querySelectorAll('button, a.button, a[class*="btn"], .site-header a, .site-footer a, .mobile-drawer a')].filter(e=>e.getClientRects().length && getComputedStyle(e).visibility !== 'hidden');
        return { path: location.pathname, width: root.clientWidth, scroll: root.scrollWidth, coarse: matchMedia('(pointer:coarse)').matches, reducedMotion: matchMedia('(prefers-reduced-motion:reduce)').matches,
          overflow: [...document.querySelectorAll("body *")].flatMap(e=>{const r=e.getBoundingClientRect();return r.right>root.clientWidth+1 && r.width>0 && getComputedStyle(e).position!=="fixed" && ![...function*(n){for(let p=n.parentElement;p&&p!==document.body;p=p.parentElement)yield p;}(e)].some(p=>["hidden","clip","auto","scroll"].includes(getComputedStyle(p).overflowX))?[{tag:e.tagName,class:e.className,right:r.right}]:[];}).slice(0,20),
          small: controls.flatMap(e=>{ const r=e.getBoundingClientRect(); return r.width<43.9||r.height<43.9 ? [{tag:e.tagName, class:e.className, text:e.textContent.trim().slice(0,40), w:r.width,h:r.height}] : []; }),
          escaped: [...document.querySelectorAll('.cmp-subnav__pill, .roi-slider-group input')].flatMap(e=>{const r=e.getBoundingClientRect(),p=e.parentElement.getBoundingClientRect();return r.left<p.left-1||r.right>p.right+1?[{class:e.className,left:r.left,right:r.right,parentLeft:p.left,parentRight:p.right}]:[];}) };
      })()`);
      measured++;
      if (result.scroll > width || result.width !== width || !result.coarse || !result.reducedMotion || result.small.length || result.escaped.length) failures.push({ path, width, theme, ...result });
    }
  }
  console.log(`G-MOBILE : ${measured} vues, 4 largeurs, 2 thèmes, pointeur grossier et mouvement réduit.`);
  if (failures.length) throw new Error(JSON.stringify(failures, null, 2));
} finally {
  await browser.close();
}
