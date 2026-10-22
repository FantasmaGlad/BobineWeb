"use client";

const RIPPLE_SELECTOR = ".btn-primary, .btn-secondary, .button, .download-modal__action-btn";

export function initGlobalRipple(): () => void {
  if (typeof window === "undefined") return () => {};
  if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return () => {};

  function handleClick(event: MouseEvent) {
    const target = (event.target as HTMLElement)?.closest(RIPPLE_SELECTOR) as HTMLElement | null;
    if (!target || target.getAttribute("aria-disabled") === "true") return;

    const rect = target.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 1.8;
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    const ripple = document.createElement("span");
    ripple.className = "gp-ripple";
    ripple.style.width = `${size}px`;
    ripple.style.height = `${size}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;

    const computedPosition = getComputedStyle(target).position;
    const hadInlinePosition = !!target.style.position;
    if (computedPosition === "static") target.style.position = "relative";
    const hadInlineOverflow = !!target.style.overflow;
    target.style.overflow = "hidden";
    target.appendChild(ripple);

    const cleanup = () => {
      ripple.remove();
      if (!hadInlineOverflow) target.style.overflow = "";
      if (!hadInlinePosition && computedPosition === "static") target.style.position = "";
    };

    ripple.addEventListener("animationend", cleanup, { once: true });
    // Filet de sécurité si l'animation ne se déclenche jamais (élément retiré du DOM, etc.)
    window.setTimeout(cleanup, 700);
  }

  document.addEventListener("click", handleClick);
  return () => document.removeEventListener("click", handleClick);
}
