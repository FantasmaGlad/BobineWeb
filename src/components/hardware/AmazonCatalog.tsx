import Link from "next/link";
import Image from "next/image";
import { BUNDLE_REFERENCES } from "@/content/bundles";
import { PRODUCTS, productHref, type Product } from "@/content/products";
import type { Locale } from "@/lib/i18n";
import { lp } from "@/lib/seo";
import AddToCartButton from "./AddToCartButton";
import "@/styles/components/amazon-catalog.css";

type Selection = {os?:string|string[];form?:string|string[];tier?:string|string[]};
const OS_LABELS: Record<string,string>={linux:"Linux",windows:"Windows",macos:"macOS",arm:"ARM64",android:"Android",'android-tv':"Android TV"};
const FORM_LABELS: Record<string,{fr:string;en:string}>={minipc:{fr:"Mini PC",en:"Mini PC"},laptop:{fr:"Portable",en:"Laptop"},tablet:{fr:"Tablette",en:"Tablet"},tv:{fr:"Boîtier TV",en:"TV box"}};
const TIER_LABELS: Record<string,{fr:string;en:string}>={essentiel:{fr:"Essentiel",en:"Essential"},recommande:{fr:"Recommandé",en:"Recommended"},pro:{fr:"Pro",en:"Pro"},premium:{fr:"Premium",en:"Premium"}};
const first=(value:string|string[]|undefined)=>Array.isArray(value)?value[0]:value;
function ProductCard({id,locale}:{id:string;locale:Locale}) {
  const p:Product=PRODUCTS[id], isEn=locale==='en';
  return <article className="amazon-product">
    <Image src={p.illustration} alt="" width={320} height={220} unoptimized />
    <div><h3>{p.name[locale]}</h3><p>{p.requirements[locale]}</p>
      <p className="amazon-product__reference">{p.asin ? `ASIN ${p.asin}` : isEn ? "Manufacturer specifications" : "Caractéristiques du fabricant"}</p>
      <div className="amazon-product__actions">
        <a className="btn-primary" href={productHref(p)} target="_blank" rel={p.source==='amazon'?'nofollow sponsored noopener noreferrer':'noopener noreferrer'}>{p.source==='amazon'?(isEn?'See price on Amazon':'Voir le prix sur Amazon'):(isEn?'View manufacturer specifications':'Consulter la fiche fabricant')}</a>
        {p.source==='amazon' ? <AddToCartButton locale={locale} item={{platform:'amazon',asin:id,name:p.name[locale],imageUrl:p.illustration,priceAmazon:null,amazonUrl:productHref(p)}} /> : null}
      </div>
    </div>
  </article>;
}
export default function AmazonCatalog({locale,selection}:{locale:Locale;selection:Selection}) {
  const isEn=locale==='en';
  const os=Object.hasOwn(BUNDLE_REFERENCES,first(selection.os)??'')?first(selection.os)!:'linux';
  const bundle=BUNDLE_REFERENCES[os as keyof typeof BUNDLE_REFERENCES];
  const forms=bundle.formFactors as Record<string,{defaultTier:string;tiers:Record<string,{items:string[];alternativeUnits:string[]}>}>;
  const form=Object.hasOwn(forms,first(selection.form)??'')?first(selection.form)!:Object.keys(forms)[0];
  const factor=forms[form];
  const tier=Object.hasOwn(factor.tiers,first(selection.tier)??'')?first(selection.tier)!:factor.defaultTier;
  const selected=factor.tiers[tier];
  const main=selected.items.find(id=>PRODUCTS[id].category==='uc')!;
  const href=(o= os,f=form,t=tier)=>`${lp(locale,'/materiel/amazon')}?${new URLSearchParams({os:o,form:f,tier:t})}`;
  return <section className="amazon-catalog">
    <header><h1>{isEn?'Hardware selections for Bobine':'Sélections de matériel pour Bobine'}</h1><p>{isEn?'Choose your system, device type and selection. These editorial references are not device certifications. Prices and availability are provided by the seller.':'Choisissez le système, le type d’appareil et la sélection. Ces références éditoriales ne constituent pas une certification du matériel. Les prix et disponibilités sont fournis par le vendeur.'}</p></header>
    <nav className="amazon-filters" aria-label={isEn?'Operating system':'Système'}>{Object.keys(BUNDLE_REFERENCES).map(key=><Link key={key} href={href(key,Object.keys(BUNDLE_REFERENCES[key as keyof typeof BUNDLE_REFERENCES].formFactors)[0],'recommande')} aria-current={os===key?'page':undefined}>{OS_LABELS[key]}</Link>)}</nav>
    <nav className="amazon-filters" aria-label={isEn?'Device type':'Type d’appareil'}>{Object.keys(forms).map(key=><Link key={key} href={href(os,key,'recommande')} aria-current={form===key?'page':undefined}>{FORM_LABELS[key][locale]}</Link>)}</nav>
    <nav className="amazon-filters" aria-label={isEn?'Selection':'Gamme'}>{Object.keys(factor.tiers).map(key=><Link key={key} href={href(os,form,key)} aria-current={tier===key?'page':undefined}>{TIER_LABELS[key][locale]}</Link>)}</nav>
    <h2>{OS_LABELS[os]} · {FORM_LABELS[form][locale]} · {TIER_LABELS[tier][locale]}</h2>
    <p className="amazon-catalog__notice">{isEn?'Editorial diagrams illustrate device types; they are not photographs of the products sold. Check the exact seller variant, video output, operating system and media compatibility before buying.':'Les schémas éditoriaux illustrent les types d’appareils : ce ne sont pas des photos des produits vendus. Vérifiez la variante du vendeur, la sortie vidéo, le système et la compatibilité de vos médias avant achat.'}</p>
    <ProductCard id={main} locale={locale}/>
    {selected.alternativeUnits.length ? <section><h2>{isEn?'Other references in this selection':'Autres références de cette sélection'}</h2><div className="amazon-product-grid">{selected.alternativeUnits.map(id=><ProductCard key={id} id={id} locale={locale}/>)}</div></section>:null}
    <section><h2>{isEn?'Accessories to check for your setup':'Accessoires à vérifier pour votre installation'}</h2><div className="amazon-product-grid">{selected.items.filter(id=>id!==main).map(id=><ProductCard key={id} id={id} locale={locale}/>)}</div></section>
    <p>{isEn?'Adding references to “My pack” saves a shopping list. No purchase is made on bobine.fit.':'L’ajout à « Mon Pack » conserve une liste de références. Aucun achat n’est effectué sur bobine.fit.'}</p>
  </section>;
}
