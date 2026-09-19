import "server-only";
import { createHmac } from "node:crypto";

const GATEWAY = "https://api-sg.aliexpress.com/sync";
const TIMEOUT_MS = 8000;

export class AliexpressApiError extends Error {
  constructor(
    message: string,
    readonly code?: string
  ) {
    super(message);
    this.name = "AliexpressApiError";
  }
}

export function signParams(params: Record<string, string>, secret: string): string {
  const base = Object.keys(params)
    .sort()
    .map((key) => key + params[key])
    .join("");
  return createHmac("sha256", secret).update(base, "utf8").digest("hex").toUpperCase();
}

function credentials() {
  const appKey = process.env.ALIEXPRESS_APP_KEY;
  const appSecret = process.env.ALIEXPRESS_APP_SECRET;
  const trackingId = process.env.ALIEXPRESS_TRACKING_ID;
  if (!appKey || !appSecret || !trackingId) {
    throw new AliexpressApiError("Variables ALIEXPRESS_* manquantes");
  }
  return { appKey, appSecret, trackingId };
}

/**
 * Appel signé d'une méthode de l'API Affiliate AliExpress. Retourne le noeud
 * `<méthode>_response` déjà déballé ; toute erreur applicative est levée en AliexpressApiError.
 */
export async function callAliexpress<T = unknown>(
  method: string,
  params: Record<string, string | number | undefined> = {},
  revalidateSeconds?: number
): Promise<T> {
  const { appKey, appSecret, trackingId } = credentials();

  const query: Record<string, string> = {
    app_key: appKey,
    timestamp: String(Date.now()),
    sign_method: "sha256",
    method,
    tracking_id: trackingId,
  };
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") query[key] = String(value);
  }
  query.sign = signParams(query, appSecret);

  const res = await fetch(GATEWAY, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded;charset=utf-8" },
    body: new URLSearchParams(query).toString(),
    signal: AbortSignal.timeout(TIMEOUT_MS),
    ...(revalidateSeconds ? { next: { revalidate: revalidateSeconds } } : { cache: "no-store" as const }),
  });
  if (!res.ok) throw new AliexpressApiError(`HTTP ${res.status}`);

  const json = (await res.json()) as Record<string, unknown>;
  const errorNode = json.error_response as { code?: string | number; msg?: string } | undefined;
  if (errorNode) throw new AliexpressApiError(errorNode.msg ?? "Erreur API", String(errorNode.code ?? ""));

  const key = `${method.replace(/\./g, "_")}_response`;
  if (!(key in json)) throw new AliexpressApiError("Réponse inattendue");
  return json[key] as T;
}
