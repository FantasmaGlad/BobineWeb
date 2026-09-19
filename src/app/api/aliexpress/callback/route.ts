import { NextResponse } from "next/server";

// URL de rappel OAuth déclarée dans la console AliExpress Open Platform. L'API Affiliate
// classique n'a pas besoin de jeton : on accuse simplement réception, sans rien stocker.
export function GET() {
  return NextResponse.json({ ok: true });
}
