(function () {
  const currentLang = document.documentElement.lang;
  const I18N = {en:{score_label:'SCORE'},fr:{score_label:'SCORE'}};
    const canvas = document.getElementById("snakeCanvas");
    const ctx = canvas.getContext("2d");
    const area = document.getElementById("gameArea");
    const scoreEl = document.getElementById("scoreVal");
    const bestEl = document.getElementById("bestVal");
    const overlay = document.getElementById("endOverlay");
    const overDesc = document.getElementById("endDesc");

    const STEP_START = 120, STEP_MIN = 60;
    let W = 0, H = 0, CELL = 24, COLS = 0, ROWS = 0, OX = 0, OY = 0;
    let snake = [], dir = { x: 1, y: 0 }, nextDir = { x: 1, y: 0 }, food = { x: 0, y: 0 };
    let score = 0, best = 0, over = false, timer = null, delay = STEP_START;
    let colors = {};

    try { best = parseInt(localStorage.getItem("bobine_security_snake_best") || "0", 10) || 0; } catch {}
    bestEl.textContent = String(best);

    function readColors() {
      const s = getComputedStyle(document.documentElement);
      colors = {
        head: s.getPropertyValue("--text-heading").trim(),
        body: s.getPropertyValue("--text-muted").trim(),
        food: s.getPropertyValue("--accent-success").trim(),
        line: s.getPropertyValue("--border-subtle").trim()
      };
    }

    function layout() {
      const r = area.getBoundingClientRect();
      W = Math.max(320, Math.floor(r.width));
      H = Math.max(240, Math.floor(r.height));
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.floor(W * dpr);
      canvas.height = Math.floor(H * dpr);
      canvas.style.width = W + "px";
      canvas.style.height = H + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const top = Math.round(Math.min(124, H * 0.22));
      // La grille reste verrouillée tant qu'elle tient dans l'écran : un redimensionnement
      // (barre d'adresse mobile, rotation légère) ne doit pas réinitialiser la partie.
      const fits = COLS > 0 && Math.floor((W - 16) / CELL) >= COLS && Math.floor((H - top - 8) / CELL) >= ROWS;
      let changed = false;
      if (!fits) {
        CELL = Math.max(16, Math.min(28, Math.floor(Math.min(W, H - top) / 22)));
        COLS = Math.floor((W - 16) / CELL);
        ROWS = Math.floor((H - top - 8) / CELL);
        changed = true;
      }
      OX = Math.floor((W - COLS * CELL) / 2);
      OY = top + Math.floor((H - top - ROWS * CELL) / 2);
      return changed;
    }

    function placeFood() {
      const free = [];
      for (let x = 0; x < COLS; x++) for (let y = 0; y < ROWS; y++) {
        if (!snake.some(s => s.x === x && s.y === y)) free.push({ x, y });
      }
      food = free.length ? free[Math.floor(Math.random() * free.length)] : { x: -1, y: -1 };
    }

    function restart() {
      clearTimeout(timer);
      const cy = Math.floor(ROWS / 2), cx = Math.max(3, Math.floor(COLS / 4));
      snake = [{ x: cx, y: cy }, { x: cx - 1, y: cy }, { x: cx - 2, y: cy }];
      dir = { x: 1, y: 0 }; nextDir = { x: 1, y: 0 };
      score = 0; over = false; delay = STEP_START;
      scoreEl.textContent = "0";
      overlay.classList.remove("is-visible");
      placeFood();
      draw();
      timer = setTimeout(tick, 500);
    }

    function gameOver() {
      over = true;
      if (score > best) {
        best = score;
        bestEl.textContent = String(best);
        try { localStorage.setItem("bobine_security_snake_best", String(best)); } catch {}
      }
      const dict = I18N[currentLang] || I18N.en;
      overDesc.textContent = dict.score_label + " " + score;
      overlay.classList.add("is-visible");
    }

    function tick() {
      dir = nextDir;
      const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };
      const eats = head.x === food.x && head.y === food.y;
      const body = eats ? snake : snake.slice(0, -1);
      if (head.x < 0 || head.y < 0 || head.x >= COLS || head.y >= ROWS || body.some(s => s.x === head.x && s.y === head.y)) {
        draw();
        return gameOver();
      }
      snake.unshift(head);
      if (eats) {
        score++;
        scoreEl.textContent = String(score);
        delay = Math.max(STEP_MIN, STEP_START - score * 2.5);
        placeFood();
      } else {
        snake.pop();
      }
      draw();
      timer = setTimeout(tick, delay);
    }

    function cell(x, y, color) {
      ctx.fillStyle = color;
      ctx.fillRect(OX + x * CELL + 1, OY + y * CELL + 1, CELL - 2, CELL - 2);
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);
      ctx.strokeStyle = colors.line;
      ctx.lineWidth = 1;
      ctx.strokeRect(OX + 0.5, OY + 0.5, COLS * CELL - 1, ROWS * CELL - 1);
      if (food.x >= 0) cell(food.x, food.y, colors.food);
      for (let i = snake.length - 1; i >= 0; i--) cell(snake[i].x, snake[i].y, i === 0 ? colors.head : colors.body);
    }

    function turn(x, y) {
      if (over) return;
      if (x === -dir.x && y === -dir.y) return;
      nextDir = { x, y };
    }

    const KEYS = {
      ArrowUp: [0, -1], w: [0, -1], z: [0, -1],
      ArrowDown: [0, 1], s: [0, 1],
      ArrowLeft: [-1, 0], a: [-1, 0], q: [-1, 0],
      ArrowRight: [1, 0], d: [1, 0]
    };

    window.addEventListener("keydown", e => {
      if (e.target.closest("button,a,input,select,[role=dialog]")) return;
      const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      if (over && (k === "Enter" || k === " ")) { e.preventDefault(); return restart(); }
      if (KEYS[k]) { e.preventDefault(); turn(KEYS[k][0], KEYS[k][1]); }
    });

    let touch = null;
    canvas.addEventListener("touchstart", e => { const t = e.changedTouches[0]; touch = { x: t.clientX, y: t.clientY }; }, { passive: true });
    canvas.addEventListener("touchend", e => {
      if (!touch) return;
      const t = e.changedTouches[0], dx = t.clientX - touch.x, dy = t.clientY - touch.y;
      touch = null;
      if (Math.max(Math.abs(dx), Math.abs(dy)) < 24) return;
      if (Math.abs(dx) > Math.abs(dy)) turn(dx > 0 ? 1 : -1, 0); else turn(0, dy > 0 ? 1 : -1);
    }, { passive: true });

    window.addEventListener("resize", () => { if (layout()) restart(); else draw(); });

    document.getElementById('restartBtn').addEventListener('click', restart);
    new MutationObserver(() => { readColors(); draw(); }).observe(document.documentElement, {attributes:true,attributeFilter:['data-theme']});
    readColors();
    layout();
    restart();


})();
