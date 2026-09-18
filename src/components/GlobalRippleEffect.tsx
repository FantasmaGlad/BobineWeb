"use client";

import { useEffect } from "react";
import { initGlobalRipple } from "@/lib/globalRipple";

export default function GlobalRippleEffect() {
  useEffect(() => {
    return initGlobalRipple();
  }, []);

  return null;
}
