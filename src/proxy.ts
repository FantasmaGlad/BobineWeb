import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { defaultLocale, locales } from "@/lib/i18n";
import { ONION_SITE_URL } from "@/lib/onion";

export function proxy(request: NextRequest) {
  const host = request.headers.get("host") || "";
  const { pathname, search } = request.nextUrl;

  if (host.startsWith("www.bobine.fit")) {
    return NextResponse.redirect(new URL(`https://bobine.fit${pathname}${search}`), 308);
  }

  const hasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );
  if (hasLocale) {
    // Tor Browser affiche alors « .onion disponible » (ignore par les autres navigateurs).
    const response = NextResponse.next();
    response.headers.set("Onion-Location", `${ONION_SITE_URL}${pathname}${search}`);
    return response;
  }

  const url = request.nextUrl.clone();
  url.pathname = `/${defaultLocale}${pathname}`;
  return NextResponse.redirect(url, 308);
}

export const config = {
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
