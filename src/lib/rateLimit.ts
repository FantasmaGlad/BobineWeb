/**
 * Limite de débit à fenêtre glissante, par clé (adresse IP). Mémoire du processus : sur un hébergement sans état partagé
 * elle protège chaque instance séparément, ce qui borne déjà un client isolé ; la règle de limitation de débit de
 * Cloudflare sur /api/chat reste la défense principale et celle-ci la double. Aucun import : lisible par les tests Node.
 */
export interface RateLimitResult {
  allowed: boolean;
  /** Secondes avant la prochaine requête acceptée (0 si acceptée). */
  retryAfter: number;
}

export function createRateLimiter(limit: number, windowMs: number, maxKeys = 5000) {
  const hits = new Map<string, number[]>();

  return function check(key: string, now: number = Date.now()): RateLimitResult {
    const cutoff = now - windowMs;
    const recent = (hits.get(key) ?? []).filter((t) => t > cutoff);
    if (recent.length >= limit) {
      hits.set(key, recent);
      return { allowed: false, retryAfter: Math.max(1, Math.ceil((recent[0] + windowMs - now) / 1000)) };
    }
    recent.push(now);
    hits.set(key, recent);
    // Mémoire bornée : au-delà de maxKeys clés, on purge celles dont toutes les requêtes sont sorties de la fenêtre.
    if (hits.size > maxKeys) {
      for (const [k, times] of hits) if (times[times.length - 1] <= cutoff) hits.delete(k);
    }
    return { allowed: true, retryAfter: 0 };
  };
}

/** Adresse du client : Cloudflare, puis le premier saut de X-Forwarded-For, puis X-Real-IP. */
export function clientKey(headers: { get(name: string): string | null }): string {
  const cf = headers.get("cf-connecting-ip");
  if (cf) return cf.trim();
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return headers.get("x-real-ip")?.trim() || "inconnue";
}

export interface ChatBounds {
  maxBodyBytes: number;
  maxMessages: number;
  maxMessageChars: number;
  maxTotalChars: number;
  maxCartItems: number;
}

export const CHAT_BOUNDS: ChatBounds = {
  maxBodyBytes: 64 * 1024,
  maxMessages: 40,
  maxMessageChars: 4000,
  maxTotalChars: 24000,
  maxCartItems: 60,
};

/** Vérifie la forme et la taille de la conversation ; renvoie la raison du refus ou null. */
export function validateChatPayload(payload: { messages?: unknown; cart?: unknown }, bounds: ChatBounds = CHAT_BOUNDS): string | null {
  const { messages, cart } = payload;
  if (!Array.isArray(messages) || messages.length === 0) return "format";
  if (messages.length > bounds.maxMessages) return "trop-de-messages";
  let total = 0;
  for (const m of messages) {
    if (!m || typeof m !== "object") return "format";
    const { role, content } = m as { role?: unknown; content?: unknown };
    if (role !== "user" && role !== "assistant") return "format";
    if (typeof content !== "string") return "format";
    if (content.length > bounds.maxMessageChars) return "message-trop-long";
    total += content.length;
  }
  if (total > bounds.maxTotalChars) return "conversation-trop-longue";
  if (messages[messages.length - 1]?.role !== "user") return "format";
  if (cart !== undefined && (!Array.isArray(cart) || cart.length > bounds.maxCartItems)) return "panier";
  return null;
}
