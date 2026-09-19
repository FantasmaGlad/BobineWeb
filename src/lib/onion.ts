/**
 * Miroir Tor (.onion) : export statique du site, sans serveur, sans appel
 * externe. La variable est fixée au build par le workflow onion-mirror ;
 * elle est absente du build Vercel, qui reste inchangé.
 */
export const IS_ONION = process.env.NEXT_PUBLIC_BOBINE_ONION === "1";

export const CLEARNET_URL = "https://bobine.fit";

/** Adresses publiques du miroir (service onion v3), hebergees sur une machine du mainteneur. */
export const ONION_SITE_HOST = "bobinedaoki42tt33rxacmtaab2gxvxb2orqgcyhvowv3aggxhruvrid.onion";
export const ONION_APT_HOST = "rzvwjat5pidtxtwzcsvew7yc5ugfjvzz432ecpn3s5mlch4cs7vvmqad.onion";
export const ONION_SITE_URL = `http://${ONION_SITE_HOST}`;

/** Soutien au projet Tor : site officiel et code source du demon (liens cliquables, aucun chargement automatique). */
export const TOR_PROJECT_URL = "https://www.torproject.org/";
export const TOR_SOURCE_URL = "https://github.com/torproject/tor";
