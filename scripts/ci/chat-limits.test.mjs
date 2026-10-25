// Tests de la limite de débit et des bornes de /api/chat (module sans dépendance, lu directement par Node).
import { test } from "node:test";
import assert from "node:assert/strict";
import { CHAT_BOUNDS, clientKey, createRateLimiter, validateChatPayload } from "../../src/lib/rateLimit.ts";

test("la 21e requête d'une minute est refusée avec un délai d'attente", () => {
  const check = createRateLimiter(20, 60_000);
  for (let i = 0; i < 20; i++) assert.equal(check("1.2.3.4", 1000 + i).allowed, true);
  const refused = check("1.2.3.4", 1500);
  assert.equal(refused.allowed, false);
  assert.ok(refused.retryAfter >= 1 && refused.retryAfter <= 60);
});

test("la fenêtre glisse : une requête est de nouveau acceptée après une minute", () => {
  const check = createRateLimiter(2, 60_000);
  check("a", 0); check("a", 10);
  assert.equal(check("a", 20).allowed, false);
  assert.equal(check("a", 60_001).allowed, true);
});

test("deux adresses ne partagent pas leur quota", () => {
  const check = createRateLimiter(1, 60_000);
  assert.equal(check("a", 0).allowed, true);
  assert.equal(check("b", 1).allowed, true);
  assert.equal(check("a", 2).allowed, false);
});

test("la mémoire reste bornée", () => {
  const check = createRateLimiter(1, 1000, 10);
  for (let i = 0; i < 50; i++) check(`ip-${i}`, i * 2000);
  assert.ok(check("nouvelle", 200_000).allowed);
});

test("l'adresse vient de Cloudflare avant X-Forwarded-For", () => {
  const h = (o) => ({ get: (n) => o[n] ?? null });
  assert.equal(clientKey(h({ "cf-connecting-ip": "9.9.9.9", "x-forwarded-for": "1.1.1.1, 2.2.2.2" })), "9.9.9.9");
  assert.equal(clientKey(h({ "x-forwarded-for": "1.1.1.1, 2.2.2.2" })), "1.1.1.1");
  assert.equal(clientKey(h({})), "inconnue");
});

test("les bornes de la conversation sont appliquées", () => {
  const ok = [{ role: "user", content: "bonjour" }];
  assert.equal(validateChatPayload({ messages: ok }), null);
  assert.equal(validateChatPayload({ messages: [] }), "format");
  assert.equal(validateChatPayload({ messages: [{ role: "system", content: "x" }] }), "format");
  assert.equal(validateChatPayload({ messages: [{ role: "user", content: "x".repeat(CHAT_BOUNDS.maxMessageChars + 1) }] }), "message-trop-long");
  assert.equal(validateChatPayload({ messages: Array.from({ length: CHAT_BOUNDS.maxMessages + 1 }, () => ok[0]) }), "trop-de-messages");
  assert.equal(validateChatPayload({ messages: ok, cart: Array.from({ length: CHAT_BOUNDS.maxCartItems + 1 }, () => ({})) }), "panier");
  assert.equal(validateChatPayload({ messages: [{ role: "assistant", content: "salut" }] }), "format");
});
