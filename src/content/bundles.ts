import "server-only";
import data from "./bundles.json";
import { productItem, PRODUCTS } from "./products";
import type { HardwareOsBundle, OsKey, StandaloneAccessory, HardwareTier, TierKey, FormFactorKey } from "./hardwareTypes";

interface TierReference {id:TierKey;items:string[];alternativeUnits:string[]}
interface FactorReference {defaultTier:TierKey;tiers:Partial<Record<TierKey,TierReference>>}
interface BundleReference {os:OsKey;formFactors:Partial<Record<FormFactorKey,FactorReference>>}
export const BUNDLE_REFERENCES = data.bundles as Record<OsKey,BundleReference>;
const TIER_NAMES = {essentiel:{fr:"Essentiel",en:"Essential"},recommande:{fr:"Recommandé",en:"Recommended"},pro:{fr:"Pro",en:"Pro"},premium:{fr:"Premium",en:"Premium"}};

/** Le catalogue commun reçoit les mêmes fiches ; les caractéristiques n'appartiennent jamais à une gamme. */
export const HARDWARE_BUNDLES = Object.fromEntries(Object.entries(BUNDLE_REFERENCES).map(([os,bundle])=>[os,{
  os,
  formFactors:Object.fromEntries(Object.entries(bundle.formFactors).map(([form,factor])=>[form,{
    defaultTier:factor.defaultTier,
    titleFr:`${os} · ${form}`,titleEn:`${os} · ${form}`,
    subtitleFr:"Sélection éditoriale",subtitleEn:"Editorial selection",
    targetFr:"Vérifier les prérequis avant achat",targetEn:"Check requirements before buying",
    tiers:Object.fromEntries(Object.entries(factor.tiers).map(([tier,selection])=>[tier,{
      id:selection.id,labelFr:TIER_NAMES[selection.id].fr,labelEn:TIER_NAMES[selection.id].en,
      headlineFr:"Sélection éditoriale",headlineEn:"Editorial selection",
      summaryFr:"Consulter les fiches des vendeurs.",summaryEn:"Check the seller listings.",
      powerWatts:"",resolution:"",
      items:selection.items.map(id=>productItem(id)),
      alternativeUnits:selection.alternativeUnits.map(id=>productItem(id)),
    } satisfies HardwareTier])),
  }])),
}])) as Record<OsKey,HardwareOsBundle>;
export const STANDALONE_ACCESSORIES: StandaloneAccessory[] = data.accessories.map(({asin,compatibleOs})=>{
  const p=PRODUCTS[asin];
  return {id:asin,asin,nameFr:p.name.fr,nameEn:p.name.en,categoryFr:"Accessoire",categoryEn:"Accessory",specs:p.requirements.fr,descriptionFr:p.requirements.fr,descriptionEn:p.requirements.en,imageUrl:p.illustration,amazonUrl:productItem(asin).amazonUrl,priceAmazon:null,compatibleOs:compatibleOs as OsKey[]};
});
