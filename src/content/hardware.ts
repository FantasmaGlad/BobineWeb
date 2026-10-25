// La boutique et ses consommateurs serveur partagent les mêmes références canoniques.
export type { OsKey, TierKey, FormFactorKey, HardwareItem, HardwareTier, HardwareFormFactor, HardwareOsBundle, StandaloneAccessory } from "./hardwareTypes";
export { HARDWARE_BUNDLES, STANDALONE_ACCESSORIES } from "./bundles";
export { AMAZON_STORE_ID, buildProductUrl } from "@/lib/productSources";
