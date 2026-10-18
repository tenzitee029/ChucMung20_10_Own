/**
 * Petals — hiệu ứng cánh hoa rơi trên <canvas>.
 * - Mật độ tự co giãn theo diện tích màn hình (nhẹ trên điện thoại).
 * - Giới hạn devicePixelRatio ≤ 2 để không tốn GPU.
 * - Tự tạm dừng khi tab bị ẩn để tiết kiệm pin.
 * - Tôn trọng prefers-reduced-motion.
 */
(function () {
  "use strict";

  const PALETTES = {
    female: [
      ["#ffd1e1", "#ff8fb5"],
      ["#ffe4ec", "#ffb3c9"],
      ["#ffc2d6", "#ff6f9f"],
      ["#fff0f5", "#f8bbd0"],
      ["#fcebc8", "#f3c97a"],
    ],
    male: [
      ["#dbe8ff", "#82b1ff"],
      ["#e3f6ff", "#80d8ff"],
      ["#fcebc8", "#f3c97a"],
      ["#e8eaff", "#9fa8ff"],
    ],
  };

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  class Petal {
    constructor(w, h, palette, initial) {
      this.reset(w, h, palette, initial);
    }

    reset(w, h, palette, initial) {
      this.size = 7 + Math.random() * 11;
      this.x = Math.random() * w;
      this.y = initial ? Math.random() * h : -20 - Math.random() * 60;
      this.vy = 0.35 + Math.random() * 0.75 + this.size * 0.02;
      this.vx = -0.2 + Math.random() * 0.4;
      this.swayAmp = 0.4 + Math.random() * 1.2;
      this.swayFreq = 0.008 + Math.random() * 0.014;
      this.phase = Math.random() * Math.PI * 2;
      this.rot = Math.random() * Math.PI * 2;
      this.vrot = (-0.5 + Math.random()) * 0.03;
      this.flip = Math.random() * Math.PI * 2; // xoay 3D giả lập
      this.vflip = 0.01 + Math.random() * 0.03;
      this.alpha = 0.55 + Math.random() * 0.4;
      this.colors = palette[(Math.random() * palette.length) | 0];
    }

    update(dt, w, h, palette, wind) {
      this.phase += this.swayFreq * dt;
      this.x += (this.vx + Math.sin(this.phase) * this.swayAmp + wind) * dt;
      this.y += this.vy * dt;
      this.rot += this.vrot * dt;
      this.flip += this.vflip * dt;

      if (this.y > h + 30 || this.x < -40 || this.x > w + 40) {
        this.reset(w, h, palette, false);
      }
    }

    draw(ctx) {
      const s = this.size;
      const scaleY = Math.cos(this.flip); // -1..1 → lật mặt cánh hoa
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rot);
      ctx.scale(1, 0.35 + Math.abs(scaleY) * 0.65);
      ctx.globalAlpha = this.alpha * (0.7 + Math.abs(scaleY) * 0.3);

      const grad = ctx.createLinearGradient(0, -s, 0, s);
      grad.addColorStop(0, this.colors[0]);
      grad.addColorStop(1, this.colors[1]);
      ctx.fillStyle = grad;

      // Hình cánh hoa: 2 đường cong bezier + khía nhỏ ở đỉnh
      ctx.beginPath();
      ctx.moveTo(0, s);
      ctx.bezierCurveTo(s * 0.95, s * 0.35, s * 0.75, -s * 0.75, s * 0.12, -s);
      ctx.lineTo(0, -s * 0.78);
      ctx.lineTo(-s * 0.12, -s);
      ctx.bezierCurveTo(-s * 0.75, -s * 0.75, -s * 0.95, s * 0.35, 0, s);
      ctx.closePath();
      ctx.fill();

      // Gân giữa mờ
      ctx.globalAlpha *= 0.35;
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 0.6;
      ctx.beginPath();
      ctx.moveTo(0, s * 0.85);
      ctx.lineTo(0, -s * 0.6);
      ctx.stroke();
      ctx.restore();
    }
  }

  const Petals = {
    canvas: null,
    ctx: null,
    petals: [],
    palette: PALETTES.female,
    w: 0,
    h: 0,
    dpr: 1,
    rafId: 0,
    last: 0,
    time: 0,
    burstUntil: 0,

    init(canvasId) {
      this.canvas = document.getElementById(canvasId);
      if (!this.canvas) return;
      this.ctx = this.canvas.getContext("2d");
      this.resize();
      this.populate(true);

      let resizeTimer;
      window.addEventListener("resize", () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
          this.resize();
          this.populate(false);
        }, 150);
      });

      document.addEventListener("visibilitychange", () => {
        document.hidden ? this.stop() : this.start();
      });
      reduceMotion.addEventListener?.("change", () => this.populate(false));

      this.start();
    },

    targetCount() {
      const area = this.w * this.h;
      let n = Math.round(area / 26000);
      n = Math.max(16, Math.min(n, 48));
      if (reduceMotion.matches) n = Math.round(n / 3);
      if (performance.now() < this.burstUntil) n = Math.round(n * 1.8);
      return n;
    },

    populate(initial) {
      const target = this.targetCount();
      while (this.petals.length < target) {
        this.petals.push(new Petal(this.w, this.h, this.palette, initial));
      }
      if (this.petals.length > target) this.petals.length = target;
    },

    resize() {
      this.dpr = Math.min(window.devicePixelRatio || 1, 2);
      this.w = window.innerWidth;
      this.h = window.innerHeight;
      this.canvas.width = Math.round(this.w * this.dpr);
      this.canvas.height = Math.round(this.h * this.dpr);
      this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    },

    /** Đổi bảng màu ("female" | "male") – cánh hoa mới sẽ dùng màu mới dần dần */
    setTheme(theme) {
      this.palette = PALETTES[theme] || PALETTES.female;
      this.petals.forEach((p, i) => {
        if (i % 2 === 0) p.colors = this.palette[(Math.random() * this.palette.length) | 0];
      });
    },

    /** Tăng mật độ cánh hoa trong một khoảng thời gian (khi mở thiệp) */
    burst(durationMs = 4000) {
      this.burstUntil = performance.now() + durationMs;
      const extra = this.targetCount() - this.petals.length;
      for (let i = 0; i < extra; i++) {
        const p = new Petal(this.w, this.h, this.palette, false);
        p.y = -Math.random() * this.h * 0.5;
        this.petals.push(p);
      }
      setTimeout(() => this.populate(false), durationMs + 6000);
    },

    start() {
      if (this.rafId || !this.ctx) return;
      this.last = performance.now();
      const loop = (now) => {
        // dt chuẩn hóa theo 60fps, chặn khi tab vừa quay lại
        const dt = Math.min((now - this.last) / 16.667, 3);
        this.last = now;
        this.time += dt;
        const wind = Math.sin(this.time * 0.004) * 0.35;

        this.ctx.clearRect(0, 0, this.w, this.h);
        for (const p of this.petals) {
          p.update(dt, this.w, this.h, this.palette, wind);
          p.draw(this.ctx);
        }
        this.rafId = requestAnimationFrame(loop);
      };
      this.rafId = requestAnimationFrame(loop);
    },

    stop() {
      cancelAnimationFrame(this.rafId);
      this.rafId = 0;
    },
  };

  window.Petals = Petals;
})();
