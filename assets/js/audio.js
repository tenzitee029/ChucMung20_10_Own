/**
 * BgMusic — nhạc nền.
 *  • Nếu APP_CONFIG.music.src có giá trị → phát file audio (loop).
 *  • Nếu không → tự tổng hợp giai điệu "hộp nhạc" bằng Web Audio API
 *    (không cần file, không lo bản quyền, dung lượng 0 KB).
 *  • Trình duyệt chặn autoplay → nhạc chỉ bắt đầu sau lần chạm/nhấn đầu tiên.
 *  • Ghi nhớ lựa chọn tắt nhạc của người dùng (localStorage).
 */
(function () {
  "use strict";

  const STORAGE_KEY = "thiep2010:music-muted";
  const cfg = (window.APP_CONFIG && window.APP_CONFIG.music) || {};

  /* ---------------- Bộ tổng hợp hộp nhạc ---------------- */
  const midiToFreq = (m) => 440 * Math.pow(2, (m - 69) / 12);

  // Vòng hợp âm C – Am – F – G, mỗi ô nhịp 8 phách móc đơn
  const CHORDS = [
    [48, 60, 64, 67], // C
    [45, 57, 60, 64], // Am
    [41, 57, 60, 65], // F
    [43, 55, 59, 62], // G
  ];
  const MELODY = [
    76, null, 79, null, 76, 74, 72, null,
    72, null, 76, null, 74, 72, 69, null,
    69, null, 72, null, 77, 76, 74, null,
    74, null, 71, null, 74, null, 79, null,
    79, null, 77, 76, 76, null, 72, null,
    72, 74, 76, null, 72, null, 69, null,
    69, null, 72, 74, 77, null, 76, 74,
    74, null, 76, 74, 71, null, 72, null,
  ];
  const ARP = [1, 2, 3, 2, 1, 2, 3, 2];
  const STEP_SEC = 60 / 76 / 2; // 76 BPM, nốt móc đơn

  class MusicBox {
    constructor() {
      this.ctx = null;
      this.master = null;
      this.step = 0;
      this.nextTime = 0;
      this.timer = 0;
    }

    ensureContext() {
      if (this.ctx) return;
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) throw new Error("Web Audio not supported");
      this.ctx = new AC();

      this.master = this.ctx.createGain();
      this.master.gain.value = 0;

      // Echo nhẹ tạo cảm giác không gian
      const delay = this.ctx.createDelay(1);
      delay.delayTime.value = STEP_SEC * 1.5;
      const feedback = this.ctx.createGain();
      feedback.gain.value = 0.28;
      const wet = this.ctx.createGain();
      wet.gain.value = 0.32;
      const lowpass = this.ctx.createBiquadFilter();
      lowpass.type = "lowpass";
      lowpass.frequency.value = 3200;

      this.bus = this.ctx.createGain();
      this.bus.connect(lowpass);
      lowpass.connect(this.master);
      lowpass.connect(delay);
      delay.connect(feedback);
      feedback.connect(delay);
      delay.connect(wet);
      wet.connect(this.master);
      this.master.connect(this.ctx.destination);
    }

    note(midi, time, { vel = 0.2, decay = 1.6, type = "sine" } = {}) {
      const ctx = this.ctx;
      const freq = midiToFreq(midi);
      const env = ctx.createGain();
      env.gain.setValueAtTime(0.0001, time);
      env.gain.exponentialRampToValueAtTime(vel, time + 0.012);
      env.gain.exponentialRampToValueAtTime(0.0001, time + decay);
      env.connect(this.bus);

      const o1 = ctx.createOscillator();
      o1.type = type;
      o1.frequency.value = freq;
      o1.connect(env);

      // Bồi âm tạo tiếng "chuông" hộp nhạc
      const o2 = ctx.createOscillator();
      const g2 = ctx.createGain();
      o2.type = "sine";
      o2.frequency.value = freq * 3.01;
      g2.gain.value = 0.18;
      o2.connect(g2);
      g2.connect(env);

      o1.start(time);
      o2.start(time);
      o1.stop(time + decay + 0.05);
      o2.stop(time + decay + 0.05);
    }

    schedule() {
      const ahead = this.ctx.currentTime + 0.15;
      while (this.nextTime < ahead) {
        const t = this.nextTime;
        const bar = Math.floor(this.step / 8) % CHORDS.length;
        const beat = this.step % 8;
        const chord = CHORDS[bar];

        if (beat === 0) this.note(chord[0], t, { vel: 0.16, decay: 2.6, type: "triangle" });
        this.note(chord[ARP[beat]] , t, { vel: 0.05, decay: 1.1, type: "triangle" });

        const m = MELODY[this.step % MELODY.length];
        if (m) this.note(m, t, { vel: 0.13, decay: 1.8 });

        this.step++;
        this.nextTime += STEP_SEC;
      }
    }

    async play(volume) {
      this.ensureContext();
      if (this.ctx.state === "suspended") await this.ctx.resume();
      if (!this.timer) {
        this.nextTime = this.ctx.currentTime + 0.08;
        this.timer = setInterval(() => this.schedule(), 40);
      }
      const now = this.ctx.currentTime;
      this.master.gain.cancelScheduledValues(now);
      this.master.gain.setTargetAtTime(volume, now, 0.4);
    }

    pause() {
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      this.master.gain.cancelScheduledValues(now);
      this.master.gain.setTargetAtTime(0, now, 0.15);
      clearInterval(this.timer);
      this.timer = 0;
      setTimeout(() => {
        if (!this.timer && this.ctx.state === "running") this.ctx.suspend();
      }, 700);
    }
  }

  /* ---------------- Trình phát file audio ---------------- */
  class FilePlayer {
    constructor(src) {
      this.el = new Audio(src);
      this.el.loop = true;
      this.el.preload = "auto";
    }
    async play(volume) {
      this.el.volume = Math.min(1, volume * 1.6);
      await this.el.play();
    }
    pause() {
      this.el.pause();
    }
  }

  /* ---------------- Điều khiển chung ---------------- */
  const BgMusic = {
    engine: null,
    playing: false,
    button: null,
    volume: typeof cfg.volume === "number" ? cfg.volume * 0.4 : 0.2,

    init(buttonId) {
      this.button = document.getElementById(buttonId);
      try {
        this.engine = cfg.src ? new FilePlayer(cfg.src) : new MusicBox();
      } catch (e) {
        if (this.button) this.button.hidden = true;
        return;
      }

      this.button?.addEventListener("click", (e) => {
        e.stopPropagation();
        this.toggle();
      });

      // Bắt đầu nhạc ở lần tương tác đầu tiên (chính sách autoplay)
      const kickoff = (e) => {
        if (this.button && this.button.contains(e.target)) return;
        if (localStorage.getItem(STORAGE_KEY) !== "1") this.play();
        window.removeEventListener("pointerdown", kickoff, true);
        window.removeEventListener("keydown", kickoff, true);
      };
      window.addEventListener("pointerdown", kickoff, true);
      window.addEventListener("keydown", kickoff, true);

      document.addEventListener("visibilitychange", () => {
        if (document.hidden && this.playing) {
          this.engine.pause();
        } else if (!document.hidden && this.playing) {
          this.engine.play(this.volume).catch(() => {});
        }
      });
    },

    async play() {
      try {
        await this.engine.play(this.volume);
        this.playing = true;
        localStorage.setItem(STORAGE_KEY, "0");
      } catch (e) {
        this.playing = false;
      }
      this.render();
    },

    pause() {
      this.engine.pause();
      this.playing = false;
      localStorage.setItem(STORAGE_KEY, "1");
      this.render();
    },

    toggle() {
      this.playing ? this.pause() : this.play();
    },

    render() {
      if (!this.button) return;
      this.button.setAttribute("aria-pressed", String(this.playing));
      this.button.setAttribute("aria-label", this.playing ? "Tắt nhạc nền" : "Bật nhạc nền");
      const label = this.button.querySelector(".music-toggle__label");
      if (label) label.textContent = this.playing ? "Đang phát" : "Nhạc";
    },
  };

  window.BgMusic = BgMusic;
})();
