"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

export default function PlatformThemeShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const theme = (pathname?.includes("/materiel/aliexpress") || pathname?.includes("/hardware/aliexpress")) ? "platform-theme-aliexpress" : "platform-theme-amazon";

  return <div className={`platform-shell ${theme}`}>{children}</div>;
}
