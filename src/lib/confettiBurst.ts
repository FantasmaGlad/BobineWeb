"use client";

interface ConfettiOptions {
  colors?: string[];
  particleCount?: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  rotation: number;
  spin: number;
}


export function spawnConfettiBurst(x: number, y: number, options: ConfettiOptions = {}) {
  if (typeof window === "undefined") return;
  if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

  const styles = getComputedStyle(document.documentElement);
  const colors = options.colors ?? ["--accent-primary", "--text-muted", "--bg-card"].map((token) => styles.getPropertyValue(token).trim());
  const particleCount = options.particleCount ?? 18;

  const canvas = document.createElement("canvas");
  canvas.style.position = "fixed";
  canvas.style.left = "0";
  canvas.style.top = "0";
  canvas.style.width = "100vw";
  canvas.style.height = "100vh";
  canvas.style.pointerEvents = "none";
  canvas.style.zIndex = "var(--z-9999)";

  const dpr = window.devicePixelRatio || 1;
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;

  document.body.appendChild(canvas);
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    canvas.remove();
    return;
  }
  ctx.scale(dpr, dpr);

  const particles: Particle[] = Array.from({ length: particleCount }).map(() => {
    const angle = Math.random() * Math.PI * 2;
    const speed = 3 + Math.random() * 5;
    return {
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 2,
      size: 4 + Math.random() * 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * Math.PI,
      spin: (Math.random() - 0.5) * 0.4,
    };
  });

  let frame = 0;
  const maxFrames = 42;

  function tick() {
    if (!ctx) return;
    frame += 1;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const life = Math.max(1 - frame / maxFrames, 0);
    particles.forEach((p) => {
      p.vy += 0.22;
      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.spin;
      ctx.save();
      ctx.globalAlpha = life;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      ctx.restore();
    });
    if (frame < maxFrames) {
      requestAnimationFrame(tick);
    } else {
      canvas.remove();
    }
  }

  requestAnimationFrame(tick);
}
