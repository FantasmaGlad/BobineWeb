"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Locale } from "@/lib/i18n";

export default function DocsSidebar({
  locale,
  items,
}: {
  locale: Locale;
  items: ReadonlyArray<readonly [string, string]>;
}) {
  const pathname = usePathname();

  return (
    <nav aria-label="Documentation" className="docs-sidebar">
      {items.map(([slug, label]) => {
        const href = `/${locale}/documentation${slug ? `/${slug}` : ""}`;
        const isActive = pathname === href;
        return (
          <Link
            key={slug}
            href={href}
            aria-current={isActive ? "page" : undefined}
            className={isActive ? "is-active" : undefined}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
