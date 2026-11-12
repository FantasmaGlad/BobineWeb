"use client";

import { useEffect } from "react";

export default function FooterDetails() {
  useEffect(() => {
    const media = window.matchMedia("(min-width: 768px)");
    const sync = () => {
      document.querySelectorAll<HTMLDetailsElement>(".site-footer__group").forEach((el) => {
        el.open = media.matches;
      });
    };
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);
  return null;
}
