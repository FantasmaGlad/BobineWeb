#!/usr/bin/env node
// Génère les pages statiques avec les mêmes jetons et sélecteurs que le site principal.
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {join,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {renderControls} from './controls.mjs';
const root=fileURLToPath(new URL('../../',import.meta.url));
const source=fileURLToPath(new URL('./',import.meta.url));
const themes=JSON.parse(readFileSync(join(root,'public/bobine-themes.json'),'utf8'));
const output=join(root,'security/site');
const check=process.argv.includes('--check');
const files={};
const text=(file)=>readFileSync(join(source,'templates',file),'utf8');
function header(locale) {
  const fr=locale==='fr';const home=`https://bobine.fit/${locale}`;
  const links=['/','/fr/'];
  return `<header class="site-header"><div class="site-header__inner"><a class="brand" href="${home}" aria-label="Bobine"><img src="/logo_bobine_entier.png" width="112" height="28" alt="Bobine"><span>${fr?'Sécurité':'Security'}</span></a><button class="menu-btn" id="menuBtn" type="button" aria-controls="siteNav" aria-expanded="false" aria-label="Menu"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16"></path></svg></button><nav class="header-nav" id="siteNav" aria-label="${fr?'Navigation principale':'Main navigation'}"><a href="${home}/documentation">Documentation</a><a href="${fr?'/fr/#specs-heading':'/#specs-heading'}">${fr?'Politique':'Policy'}</a><a href="${fr?'/fr/':'/'}">${fr?'Signalement':'Report'}</a>${renderControls(locale,links,themes)}</nav></div></header>`;
}
function footer(locale) {
  const fr=locale==='fr';
  return `<footer class="site-footer"><div class="site-footer__inner"><span>${fr?'Bobine, régie locale et logiciel libre sous AGPL-3.0.':'Bobine, local playout and free software under AGPL-3.0.'}</span><nav class="footer-links" aria-label="Footer"><a href="https://bobine.fit/${locale}">bobine.fit</a><a href="https://github.com/FantasmaGlad/Bobine">GitHub</a><a href="/security.asc">${fr?'Clé publique':'Public key'}</a><a href="/.well-known/security.txt">security.txt</a><a href="https://bobine.fit/${locale}/${fr?'confidentialite':'privacy'}">${fr?'Confidentialité':'Privacy'}</a><a href="mailto:security@bobine.fit">security@bobine.fit</a></nav></div></footer>`;
}
for(const locale of ['en','fr']) {
  const name=locale;
  const path=locale==='fr'?'fr/index.html':'index.html';
  files[path]=`<!DOCTYPE html>\n<html lang="${locale}" data-theme="${themes.defaultTheme}" data-mode="light"><head>${text(`${name}-head.html`)}<script src="/assets/theme-init.js"></script><link rel="stylesheet" href="/assets/bobine-tokens.css"><link rel="stylesheet" href="/assets/site.css"><link rel="stylesheet" href="/assets/bobine-controls.css"><script src="/assets/site.js" defer></script></head><body class="security-page"><a class="skip-link" href="#main">${locale==='fr'?'Aller au contenu':'Skip to content'}</a>${header(locale)}${text(`${name}.html`).replace('<main class="page-main">','<main class="page-main" id="main">')}<p id="copyStatus" class="sr-only" role="status" aria-live="polite"></p>${footer(locale)}</body></html>\n`;
}
for(const file of ['site.css','site.js'])files[`assets/${file}`]=readFileSync(join(source,'assets',file));
files['assets/theme-init.js']=readFileSync(join(source,'assets','theme-init.js'),'utf8').replace('/*THEME_DATA*/{}',JSON.stringify({themes:themes.themes.map(({id})=>({id})),legacy:themes.legacy,defaultTheme:themes.defaultTheme,defaultMode:themes.defaultMode}));
for(const file of ['bobine-tokens.css','bobine-controls.css'])files[`assets/${file}`]=readFileSync(join(root,'public',file));
for(const file of ['favicon.ico','logo_bobine_entier.png'])files[file]=readFileSync(join(root,'public',file));
for(const [file,body]of Object.entries(files)) {
  const target=join(output,file);
  if(check) {
    if(!readFileSync(target).equals(Buffer.from(body)))throw new Error(`${file} : génération périmée`);
  } else {mkdirSync(dirname(target),{recursive:true});writeFileSync(target,body);}
}
console.log(`Site de sécurité : ${Object.keys(files).length} pages et ressources ${check?'à jour':'générées'}, 9 thèmes communs, clairs et sombres.`);
