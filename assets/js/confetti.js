/**
 * Confetti — pháo giấy & tim lấp lánh, chỉ chạy khi có hạt (không tốn tài nguyên lúc rảnh).
 */
(function () {
  "use strict";

  const COLORS = {
    female: ["#ff5c93", "#ff80ab", "#ffc2d6", "#f3c97a", "#fcebc8", "#ffffff", "#c77dff"],
    male: ["#4f8dff", "#82b1ff", "#5ee7df", "#f3c97a", "#ffffff", "#b39dff"],
  };

  const Confetti = {
    canvas: null,
    ctx: null,
    particles: [],
    rafId: 0,
    w: 0,
    h: 0,
    dpr: 1,

    init(canvasId) {
      this.canvas = document.getElementById(canvasId);
      if (!this.canvas) return;
      this.ctx = this.canvas.getContext("2d");
      this.resize();
      window.addEventListener("resize", () => this.resize());
    },

    resize() {
      this.dpr = Math.min(window.devicePixelRatio || 1, 2);
      this.w = window.innerWidth;
      this.h = window.innerHeight;
      this.canvas.width = Math.round(this.w * this.dpr);
      this.canvas.height = Math.round(this.h * this.dpr);
      this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    },

    /**
     * Bắn pháo giấy.
     * @param {object} opts { x, y (0..1 theo màn hình), count, theme }
     */
    burst({ x = 0.5, y = 0.4, count = 120, theme = "female" } = {}) {
      if (!this.ctx) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) count = Math.round(count / 4);
      const palette = COLORS[theme] || COLORS.female;
      const ox = x * this.w;
      const oy = y * this.h;

      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 4 + Math.random() * 9;
        const r = Math.random();
        this.particles.push({
          x: ox,
          y: oy,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 5,
          size: 5 + Math.random() * 6,
          rot: Math.random() * Math.PI,
          vrot: (Math.random() - 0.5) * 0.3,
          tilt: Math.random() * Math.PI,
          shape: r < 0.5 ? "rect" : r < 0.8 ? "circle" : "heart",
          color: palette[(Math.random() * palette.length) | 0],
          life: 0,
          ttl: 110 + Math.random() * 70,
        });
      }
      this.start();
    },

    /** Hai luồng pháo bắn chéo từ hai góc dưới */
    celebrate(theme) {
      this.burst({ x: 0.5, y: 0.35, count: 90, theme });
      setTimeout(() => this.burst({ x: 0.12, y: 0.85, count: 50, theme }), 220);
      setTimeout(() => this.burst({ x: 0.88, y: 0.85, count: 50, theme }), 380);
    },

    drawHeart(ctx, s) {
      ctx.beginPath();
      ctx.moveTo(0, s * 0.3);
      ctx.bezierCurveTo(s * 0.5, -s * 0.3, s, s * 0.2, 0, s);
      ctx.bezierCurveTo(-s, s * 0.2, -s * 0.5, -s * 0.3, 0, s * 0.3);
      ctx.fill();
    },

    start() {
      if (this.rafId) return;
      let last = performance.now();
      const loop = (now) => {
        const dt = Math.min((now - last) / 16.667, 3);
        last = now;
        const ctx = this.ctx;
        ctx.clearRect(0, 0, this.w, this.h);

        for (let i = this.particles.length - 1; i >= 0; i--) {
          const p = this.particles[i];
          p.life += dt;
          p.vx *= Math.pow(0.985, dt);
          p.vy = p.vy * Math.pow(0.985, dt) + 0.22 * dt;
          p.x += p.vx * dt;
          p.y += p.vy * dt;
          p.rot += p.vrot * dt;
          p.tilt += 0.1 * dt;

          if (p.life > p.ttl || p.y > this.h + 40) {
            this.particles.splice(i, 1);
            continue;
          }

          const fade = Math.min(1, (p.ttl - p.life) / 30);
          ctx.save();
          ctx.globalAlpha = fade;
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rot);
          ctx.fillStyle = p.color;
          if (p.shape === "rect") {
            ctx.scale(1, Math.cos(p.tilt));
            ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
          } else if (p.shape === "circle") {
            ctx.beginPath();
            ctx.arc(0, 0, p.size / 3, 0, Math.PI * 2);
            ctx.fill();
          } else {
            this.drawHeart(ctx, p.size * 0.8);
          }
          ctx.restore();
        }

        if (this.particles.length) {
          this.rafId = requestAnimationFrame(loop);
        } else {
          ctx.clearRect(0, 0, this.w, this.h);
          this.rafId = 0;
        }
      };
      this.rafId = requestAnimationFrame(loop);
    },
  };

  window.Confetti = Confetti;
})();
