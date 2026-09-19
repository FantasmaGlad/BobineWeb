/**
 * Miroir Tor (.onion) : export statique du site, sans serveur, sans appel
 * externe. La variable est fixée au build par le workflow onion-mirror ;
 * elle est absente du build Vercel, qui reste inchangé.
 */
export const IS_ONION = process.env.NEXT_PUBLIC_BOBINE_ONION === "1";

export const CLEARNET_URL = "https://bobine.fit";
