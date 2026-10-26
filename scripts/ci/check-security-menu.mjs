#!/usr/bin/env node
import assert from 'node:assert/strict';
import {launchChrome,delay} from './cdp.mjs';
const origin=process.env.SECURITY_CHECK_URL??'http://127.0.0.1:3104';
const b=await launchChrome();let views=0;
try {
  await b.send('Page.enable');
  await b.send('Emulation.setTouchEmulationEnabled',{enabled:true});
  await b.send('Emulation.setEmulatedMedia',{features:[{name:'pointer',value:'coarse'}]});
  for(const path of ['/','/fr/','/snake/','/fr/snake/'])for(const [width,height]of [[360,800],[640,360],[768,1024],[1280,900]]) {
    await b.send('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:width<961});
    await b.send('Page.navigate',{url:origin+path});
    for(let i=0;i<100;i++){if(await b.evaluate(`document.readyState==='complete' && !!document.getElementById('themeCycle')`))break;await delay(100)}
    assert(await b.evaluate(`document.documentElement.scrollWidth<=innerWidth`),`${path} ${width} débordement`);
    if(width<=960)await b.evaluate(`document.getElementById('menuBtn').click()`);
    await b.evaluate(`document.getElementById('themeToggle').click()`);
    const palette=await b.evaluate(`(()=>{const p=document.getElementById('themePalette');const r=p.getBoundingClientRect();return {hidden:p.hidden,left:r.left,right:r.right,top:r.top,bottom:r.bottom,count:p.querySelectorAll('[data-theme-value]').length}})()`);
    assert(!palette.hidden);assert.equal(palette.count,16);assert(palette.left>=-1&&palette.right<=width+1&&palette.top>=0&&palette.bottom<=height+1,`${path} ${width} palette hors écran ${JSON.stringify(palette)}`);
    assert(await b.evaluate(`Array.from(document.querySelectorAll('[data-theme-group]')).every(e=>{const r=e.getBoundingClientRect();return e.contains(document.elementFromPoint(r.left+r.width/2,r.top+r.height/2));})`),'onglets de palette visibles et accessibles');
    await b.evaluate(`document.querySelector('[data-theme-group="dark"]').click();document.querySelector('[data-theme-value="orchidee"]').click()`);
    assert(await b.evaluate(`document.documentElement.dataset.theme==='orchidee' && document.getElementById('themePalette').hidden`),'thème et repli');
    const visited=new Set();
    for(let i=0;i<16;i++)visited.add(await b.evaluate(`document.getElementById('themeCycle').click();document.documentElement.dataset.theme`));
    assert.equal(visited.size,16,'16 thèmes distincts accessibles');
    assert(await b.evaluate(`document.documentElement.dataset.theme==='orchidee'`),'16 thèmes accessibles');
    if(path.includes('snake'))assert(await b.evaluate(`document.getElementById('snakeCanvas').width>0 && document.getElementById('snakeCanvas').height>0`),'canvas visible');
    else assert.equal(await b.evaluate(`document.querySelectorAll('[data-copy]').length`),3);
    views++;
  }
  console.log(`Sécurité : ${views} vues FR/EN, palettes contenues, 16 thèmes et canvas conformes.`);
} finally {await b.close()}
