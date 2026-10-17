"use client";

import type { ReactNode } from "react";

export default function PlatformThemeShell({ children }: { children: ReactNode }) {
  return <div className="platform-shell">{children}</div>;
}
