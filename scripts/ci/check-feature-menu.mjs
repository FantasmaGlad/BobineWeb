#!/usr/bin/env node
import assert from 'node:assert/strict';
import {launchChrome,delay} from './cdp.mjs';
const origin=process.env.MOBILE_CHECK_URL??'http://127.0.0.1:3102';
const b=await launchChrome();let views=0;
try {
  await b.send('Page.enable');
  await b.send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
  for(const path of ['/fr/fonctionnalites','/en/features'])for(const [width,height]of [[390,844],[640,360],[1280,900]]) {
    await b.send('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:width<961});
    await b.send('Page.navigate',{url:origin+path});
    for(let i=0;i<100;i++){if(await b.evaluate(`document.readyState==='complete' && !!document.querySelector('.feature-navigation')`))break;await delay(100)}
    await delay(600);
    if(width<961)await b.evaluate(`document.querySelector('.feature-navigation__mobile summary').click()`);
    const menu=await b.evaluate(`(()=>{const nav=[...document.querySelectorAll('.feature-navigation nav')].find(e=>e.getClientRects().length);const links=[...nav.querySelectorAll('a')];const r=links.map(e=>e.getBoundingClientRect());return {count:r.length,left:r.map(b=>b.left),top:r.map(b=>b.top),scroll:document.documentElement.scrollWidth,targets:links.every(a=>!!document.querySelector(a.getAttribute('href')))}})()`);
    assert.equal(menu.count,9);assert(menu.targets);assert(menu.scroll<=width);assert(menu.left.every(x=>Math.abs(x-menu.left[0])<1),'liste verticale');assert(menu.top.every((y,i)=>!i||y>menu.top[i-1]),'ordre vertical');
    if(width<961) {
      await b.evaluate(`document.querySelector('.feature-navigation__mobile a[href="#backup"]').click()`);await delay(150);
      assert(await b.evaluate(`!document.querySelector('.feature-navigation__mobile').open && location.hash==='#backup'`),'sélection et repli automatique');
    }
    views++;
  }
  console.log(`Fonctionnalités : ${views} vues, navigation verticale, neuf ancres et repli mobile conformes.`);
} finally {await b.close()}
