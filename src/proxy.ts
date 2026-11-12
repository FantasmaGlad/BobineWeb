import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { defaultLocale, locales, type Locale } from "@/lib/i18n";
import { ONION_SITE_URL } from "@/lib/onion";

export function proxy(request: NextRequest) {
  const host = request.headers.get("host") || "";
  const { pathname, searchParams } = request.nextUrl;

  if (host.startsWith("www.bobine.fit")) {
    return NextResponse.redirect(new URL(`https://bobine.fit${pathname}${request.nextUrl.search}`), 308);
  }

  const langFlag = searchParams.get("lang") || searchParams.get("locale") || searchParams.get("language");
  const normalizedFlag = langFlag?.toLowerCase().trim();
  const flagLocale: Locale | null = normalizedFlag === "fr" || normalizedFlag === "en" ? normalizedFlag : null;

  const acceptLang = request.headers.get("accept-language") || "";
  const detectedBrowserLocale: Locale = /\bfr\b/i.test(acceptLang) ? "fr" : "en";

  const currentLocale = locales.find(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );

  if (flagLocale && currentLocale && flagLocale !== currentLocale) {
    const segments = pathname.split("/").filter(Boolean);
    segments[0] = flagLocale;
    const newUrl = request.nextUrl.clone();
    newUrl.pathname = `/${segments.join("/")}`;
    newUrl.searchParams.delete("lang");
    newUrl.searchParams.delete("locale");
    newUrl.searchParams.delete("language");
    return NextResponse.redirect(newUrl, 308);
  }

  if (currentLocale) {
    const response = NextResponse.next();
    response.headers.set("Onion-Location", `${ONION_SITE_URL}${pathname}${request.nextUrl.search}`);
    return response;
  }

  const targetLocale = flagLocale || detectedBrowserLocale || defaultLocale;
  const url = request.nextUrl.clone();
  url.pathname = `/${targetLocale}${pathname}`;
  if (flagLocale) {
    url.searchParams.delete("lang");
    url.searchParams.delete("locale");
    url.searchParams.delete("language");
  }
  const response = NextResponse.redirect(url, flagLocale ? 308 : 307);
  response.headers.set("Vary", "Accept-Language");
  return response;
}

export const config = {
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
