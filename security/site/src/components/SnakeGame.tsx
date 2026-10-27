"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import type { SecurityStrings } from "../content/security-content";

interface SnakeGameProps {
  strings: SecurityStrings;
}

export default function SnakeGame({ strings }: SnakeGameProps) {
  const p = strings.snake;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const areaRef = useRef<HTMLElement>(null);

  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const gameState = useRef({
    snake: [{ x: 5, y: 5 }],
    dir: { x: 1, y: 0 },
    nextDir: { x: 1, y: 0 },
    food: { x: 10, y: 10 },
    cols: 20,
    rows: 15,
    cell: 20,
    ox: 0,
    oy: 0,
    w: 400,
    h: 300,
    timer: null as NodeJS.Timeout | null,
    delay: 120,
  });

  const readColors = () => {
    if (typeof window === "undefined") return { head: "#fff", body: "#aaa", food: "#0f0", line: "#333" };
    const s = getComputedStyle(document.documentElement);
    return {
      head: s.getPropertyValue("--text-heading").trim() || "#fff",
      body: s.getPropertyValue("--text-muted").trim() || "#aaa",
      food: s.getPropertyValue("--accent-success").trim() || "#10b981",
      line: s.getPropertyValue("--border-subtle").trim() || "#333",
    };
  };

  const placeFood = useCallback(() => {
    const s = gameState.current;
    const free: { x: number; y: number }[] = [];
    for (let x = 0; x < s.cols; x++) {
      for (let y = 0; y < s.rows; y++) {
        if (!s.snake.some((seg) => seg.x === x && seg.y === y)) {
          free.push({ x, y });
        }
      }
    }
    if (free.length > 0) {
      s.food = free[Math.floor(Math.random() * free.length)];
    }
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const s = gameState.current;
    const colors = readColors();

    ctx.clearRect(0, 0, s.w, s.h);

    // Draw grid
    ctx.strokeStyle = colors.line;
    ctx.lineWidth = 0.5;
    ctx.strokeRect(s.ox, s.oy, s.cols * s.cell, s.rows * s.cell);

    // Draw food
    ctx.fillStyle = colors.food;
    ctx.fillRect(s.ox + s.food.x * s.cell + 2, s.oy + s.food.y * s.cell + 2, s.cell - 4, s.cell - 4);

    // Draw snake
    s.snake.forEach((seg, idx) => {
      ctx.fillStyle = idx === 0 ? colors.head : colors.body;
      ctx.fillRect(s.ox + seg.x * s.cell + 1, s.oy + seg.y * s.cell + 1, s.cell - 2, s.cell - 2);
    });
  }, []);

  const tickRef = useRef<() => void>(() => {});

  const tick = useCallback(() => {
    const s = gameState.current;
    s.dir = s.nextDir;
    const head = { x: s.snake[0].x + s.dir.x, y: s.snake[0].y + s.dir.y };

    // Wall collision
    if (head.x < 0 || head.x >= s.cols || head.y < 0 || head.y >= s.rows) {
      setGameOver(true);
      return;
    }

    // Self collision
    if (s.snake.some((seg) => seg.x === head.x && seg.y === head.y)) {
      setGameOver(true);
      return;
    }

    s.snake.unshift(head);

    // Check food
    if (head.x === s.food.x && head.y === s.food.y) {
      setScore((prev) => {
        const next = prev + 1;
        setBest((b) => {
          const newBest = Math.max(b, next);
          try {
            localStorage.setItem("bobine_security_snake_best", String(newBest));
          } catch {
            // ignore
          }
          return newBest;
        });
        return next;
      });
      placeFood();
      s.delay = Math.max(60, s.delay - 2);
    } else {
      s.snake.pop();
    }

    draw();

    s.timer = setTimeout(() => {
      tickRef.current();
    }, s.delay);
  }, [draw, placeFood]);

  useEffect(() => {
    tickRef.current = tick;
  }, [tick]);

  const resetGame = useCallback(() => {
    const s = gameState.current;
    if (s.timer) clearTimeout(s.timer);
    s.snake = [
      { x: Math.floor(s.cols / 2), y: Math.floor(s.rows / 2) },
      { x: Math.floor(s.cols / 2) - 1, y: Math.floor(s.rows / 2) },
    ];
    s.dir = { x: 1, y: 0 };
    s.nextDir = { x: 1, y: 0 };
    s.delay = 120;
    setScore(0);
    setGameOver(false);
    placeFood();
    draw();
    s.timer = setTimeout(() => {
      tickRef.current();
    }, s.delay);
  }, [draw, placeFood]);

  useEffect(() => {
    try {
      const stored = parseInt(localStorage.getItem("bobine_security_snake_best") || "0", 10) || 0;
      if (stored) {
        requestAnimationFrame(() => setBest(stored));
      }
    } catch {
      // ignore
    }

    const handleResize = () => {
      const area = areaRef.current;
      const canvas = canvasRef.current;
      if (!area || !canvas) return;

      const r = area.getBoundingClientRect();
      const s = gameState.current;
      s.w = Math.max(320, Math.floor(r.width));
      s.h = Math.max(240, Math.floor(r.height));

      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.floor(s.w * dpr);
      canvas.height = Math.floor(s.h * dpr);
      canvas.style.width = `${s.w}px`;
      canvas.style.height = `${s.h}px`;

      const ctx = canvas.getContext("2d");
      if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const top = Math.round(Math.min(124, s.h * 0.22));
      s.cell = Math.max(16, Math.min(28, Math.floor(Math.min(s.w, s.h - top) / 22)));
      s.cols = Math.floor((s.w - 16) / s.cell);
      s.rows = Math.floor((s.h - top - 8) / s.cell);
      s.ox = Math.floor((s.w - s.cols * s.cell) / 2);
      s.oy = top + Math.floor((s.h - top - s.rows * s.cell) / 2);

      draw();
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    requestAnimationFrame(() => resetGame());

    const handleKeyDown = (e: KeyboardEvent) => {
      const s = gameState.current;
      if (["ArrowUp", "KeyW"].includes(e.code) && s.dir.y === 0) {
        s.nextDir = { x: 0, y: -1 };
        e.preventDefault();
      } else if (["ArrowDown", "KeyS"].includes(e.code) && s.dir.y === 0) {
        s.nextDir = { x: 0, y: 1 };
        e.preventDefault();
      } else if (["ArrowLeft", "KeyA"].includes(e.code) && s.dir.x === 0) {
        s.nextDir = { x: -1, y: 0 };
        e.preventDefault();
      } else if (["ArrowRight", "KeyD"].includes(e.code) && s.dir.x === 0) {
        s.nextDir = { x: 1, y: 0 };
        e.preventDefault();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    const state = gameState.current;
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("keydown", handleKeyDown);
      if (state.timer) clearTimeout(state.timer);
    };
  }, [draw, resetGame]);

  return (
    <main className="snake-main" id="gameArea" ref={areaRef}>
      <div className="snake-score" aria-label={`${p.score} / ${p.best}`}>
        <div className="snake-score__box">
          <span className="snake-score__label">{p.score}</span>
          <span className="snake-score__val" id="scoreVal">
            {score}
          </span>
        </div>
        <div className="snake-score__box">
          <span className="snake-score__label">{p.best}</span>
          <span className="snake-score__val" id="bestVal">
            {best}
          </span>
        </div>
      </div>

      <canvas id="snakeCanvas" ref={canvasRef} aria-label="Snake" />

      {gameOver && (
        <div
          className="snake-overlay"
          id="endOverlay"
          role="dialog"
          aria-modal="false"
          aria-labelledby="endTitle"
        >
          <h2 id="endTitle">{p.overTitle}</h2>
          <p id="endDesc">{p.overDesc}</p>
          <button
            type="button"
            className="btn btn--primary"
            id="restartBtn"
            onClick={resetGame}
          >
            {p.restartBtn}
          </button>
        </div>
      )}

      <footer className="site-footer site-footer--compact">
        <div className="site-footer__inner">
          <a href={strings.lang === "fr" ? "/fr/" : "/"}>{p.backLink}</a>
          <span>{strings.footerLead}</span>
        </div>
      </footer>
    </main>
  );
}
