#!/usr/bin/env node
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {join,resolve} from 'node:path';
const root=fileURLToPath(new URL('../../',import.meta.url));
export function validateCatalog(products, data, imageExists=(path)=>existsSync(join(root,'public',path))) {
  const referenced=new Set();let selections=0;
  for(const [id,p] of Object.entries(products)) {
    assert(!Object.keys(p).some(key=>/price|offer/i.test(key)),`${id}: prix Amazon stocké`);
    assert(['amazon','manufacturer'].includes(p.source),`${id}: source inconnue`);
    if(p.source==='amazon') {
      assert(/^[A-Z0-9]{10}$/.test(id)&&p.asin===id,`${id}: ASIN invalide`);
      assert.equal(p.listing,`https://www.amazon.fr/dp/${id}`,`${id}: fiche directe attendue`);
    } else assert(p.listing.startsWith('https://www.mi.com/'),`${id}: source fabricant non reconnue`);
    for(const locale of ['fr','en'])assert(p.name[locale]?.trim()&&p.requirements[locale]?.trim(),`${id}: texte ${locale} absent`);
    assert(p.illustration.startsWith('/images/hardware/editorial/')&&imageExists(p.illustration),`${id}: illustration éditoriale absente`);
  }
  for(const [os,bundle] of Object.entries(data.bundles)) for(const [form,factor] of Object.entries(bundle.formFactors)) {
    const mainIds=[];const alternatives=new Set();
    const tiers=Object.values(factor.tiers);
    const minimum=os==='android-tv'?2:4;
    assert.equal(tiers.length,minimum,`${os}/${form}: ${minimum} sélections distinctes attendues`);
    assert(factor.tiers[factor.defaultTier],`${os}/${form}: gamme par défaut absente`);
    for(const tier of tiers) {
      selections++;
      for(const id of [...tier.items,...tier.alternativeUnits]) {assert(products[id],`Référence absente ${id}`);referenced.add(id);}
      const main=tier.items.filter(id=>products[id].category==='uc');
      assert.equal(main.length,1,`${os}/${form}/${tier.id}: une unité principale attendue`);
      mainIds.push(main[0]);
      assert.equal(new Set(tier.items).size,tier.items.length,`${os}/${form}/${tier.id}: accessoire dupliqué`);
      for(const id of tier.alternativeUnits) {assert.equal(products[id].category,'uc');assert(!alternatives.has(id),`${os}/${form}: alternative répétée ${id}`);alternatives.add(id);}
    }
    assert.equal(new Set(mainIds).size,minimum,`${os}/${form}: unité principale répétée`);
    assert(!mainIds.some(id=>alternatives.has(id)),`${os}/${form}: unité présente dans plusieurs gammes`);
  }
  for(const a of data.accessories){assert(products[a.asin],`Accessoire absent ${a.asin}`);referenced.add(a.asin);}
  assert.equal(referenced.size,Object.keys(products).length,'Produit orphelin');
  return {products:referenced.size,selections};
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
  const data=JSON.parse(readFileSync(join(root,'src/content/bundles.json'),'utf8'));
  const products=JSON.parse(readFileSync(join(root,'src/content/products.json'),'utf8'));
  const count=validateCatalog(products,data);
  console.log(`Catalogue : ${count.products} fiches canoniques, ${count.selections} sélections ; ASIN, références, langues, illustrations et unités principales conformes, aucun prix Amazon stocké.`);
}
