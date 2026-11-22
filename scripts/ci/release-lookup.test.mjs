import { test } from "node:test";
import assert from "node:assert/strict";
import { findRelease } from "../../src/lib/releaseLookup.ts";

const fallback = [{ slug: "beta", title: "repli bêta" }, { slug: "canary", title: "repli canary" }];
const stable = { slug: "V5.2.2", title: "5.2.2" };

test("une release publiée est trouvée sans tenir compte de la casse", () => {
  assert.equal(findRelease([stable], fallback, "v5.2.2"), stable);
  const canary = { slug: "canary", title: "canary publiée", isPrerelease: true };
  assert.equal(findRelease([stable, canary], fallback, "CANARY"), canary);
});

test("un canal mobile absent pendant sa republication garde sa page", () => {
  assert.equal(findRelease([stable], fallback, "canary").title, "repli canary");
  assert.equal(findRelease([stable], fallback, "BETA").title, "repli bêta");
});

test("une version absente reste introuvable", () => {
  assert.equal(findRelease([stable], fallback, "V9.9.9"), null);
});
