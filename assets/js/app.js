/**
 * App — điều phối màn hình, xử lý form, dựng thiệp.
 * Luồng logic giữ nguyên như bản WPF (MainWindow.xaml.cs):
 *   Nam            → thiệp dành cho Nam
 *   Nữ + tên riêng → thiệp cá nhân hóa (ảnh + lời chúc riêng)
 *   Nữ khác        → thiệp chung có chèn tên
 */
(function () {
  "use strict";

  const CONFIG = window.APP_CONFIG;
  const reduceMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (id) => document.getElementById(id);
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));

  /* ------------------------------------------------------------------
   * Xử lý chuỗi tên
   * ------------------------------------------------------------------ */
  /** Bỏ khoảng trắng thừa (tương đương Regex.Replace(@"\s+", " ") trong C#) */
  const cleanName = (raw) => raw.normalize("NFC").replace(/\s+/g, " ").trim();

  /** Khóa so khớp: chữ thường + bỏ dấu tiếng Việt → gõ không dấu vẫn khớp */
  const matchKey = (name) =>
    cleanName(name)
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D")
      .toLowerCase();

  /** "nguyễn thị b" → "Nguyễn Thị B" */
  const titleCase = (name) =>
    name
      .toLocaleLowerCase("vi")
      .split(" ")
      .map((w) => (w ? w.charAt(0).toLocaleUpperCase("vi") + w.slice(1) : w))
      .join(" ");

  const fill = (tpl, name) => tpl.replace(/\{name\}/g, name);

  const SPECIAL_MAP = new Map(CONFIG.special.map((p) => [matchKey(p.fullName), p]));

  /** Trả về dữ liệu thiệp tương ứng – giống switch-case trong MainWindow.xaml.cs */
  function resolveCard(name, gender) {
    const display = titleCase(name);

    if (gender === "male") {
      const m = CONFIG.male;
      return {
        theme: "male",
        emoji: m.emoji,
        badge: m.badge,
        title: fill(m.greeting, display),
        highlight: m.highlight,
        wish: m.wish,
        celebrate: false,
      };
    }

    const person = SPECIAL_MAP.get(matchKey(name));
    if (person) {
      return {
        theme: "female",
        avatar: person.avatar,
        badge: person.badge,
        title: person.fullName,
        wish: person.wish,
        celebrate: true,
      };
    }

    const f = CONFIG.defaultFemale;
    return {
      theme: "female",
      emoji: f.emoji,
      badge: f.badge,
      title: fill(f.greeting, display),
      wish: fill(f.wish, display),
      celebrate: true,
    };
  }

  /* ------------------------------------------------------------------
   * Tham chiếu DOM
   * ------------------------------------------------------------------ */
  const el = {
    screenInput: $("screen-input"),
    screenCard: $("screen-card"),
    form: $("greeting-form"),
    name: $("input-name"),
    field: document.querySelector(".field"),
    error: $("name-error"),
    female: $("gender-female"),
    male: $("gender-male"),
    reset: $("btn-reset"),
    submit: $("btn-submit"),
    inviteHint: $("invite-hint"),
    card: $("greeting-card"),
    photoBg: $("card-photo-bg"),
    avatar: $("card-avatar"),
    avatarWrap: document.querySelector(".avatar"),
    badge: $("card-badge"),
    title: $("card-name"),
    highlight: $("card-highlight"),
    wish: $("card-wish"),
    wishBox: document.querySelector(".wish-box"),
    sign: $("card-sign"),
    back: $("btn-back"),
    share: $("btn-share"),
    envelope: $("envelope-overlay"),
    toast: $("toast"),
  };

  const state = {
    busy: false,
    current: null, // { name, gender }
    typer: null,
  };

  /* ------------------------------------------------------------------
   * Tiện ích UI
   * ------------------------------------------------------------------ */
  function animateOnce(node, className, fallbackMs = 1200) {
    return new Promise((resolve) => {
      let done = false;
      const finish = () => {
        if (done) return;
        done = true;
        node.removeEventListener("animationend", onEnd);
        resolve();
      };
      const onEnd = (e) => {
        if (e.target === node) finish();
      };
      node.addEventListener("animationend", onEnd);
      node.classList.add(className);
      setTimeout(finish, reduceMotion() ? 30 : fallbackMs);
    });
  }

  async function switchScreen(from, to) {
    await animateOnce(from, "is-leaving", 450);
    from.classList.remove("is-active", "is-leaving", "is-entering");
    to.classList.remove("is-leaving");
    to.classList.add("is-active", "is-entering");
    window.scrollTo({ top: 0 });
    setTimeout(() => to.classList.remove("is-entering"), 1800);
  }

  let toastTimer;
  function showToast(msg) {
    el.toast.textContent = msg;
    el.toast.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.toast.classList.remove("is-visible"), 2600);
  }

  function showError(show) {
    el.error.hidden = !show;
    el.field.classList.toggle("is-invalid", show);
    el.name.setAttribute("aria-invalid", String(show));
    if (show) {
      el.field.classList.remove("is-shaking");
      void el.field.offsetWidth; // restart animation
      el.field.classList.add("is-shaking");
      el.name.focus();
    }
  }

  /** Hiệu ứng gõ chữ; chạm vào khung để hiện toàn bộ ngay */
  function typeText(node, text, speed = 28) {
    stopTyping();
    const chars = Array.from(text);
    if (reduceMotion()) {
      node.textContent = text;
      return Promise.resolve();
    }
    node.textContent = "";
    node.classList.add("is-typing");
    return new Promise((resolve) => {
      let i = 0;
      const typer = {
        finish() {
          clearTimeout(typer.timer);
          node.textContent = text;
          node.classList.remove("is-typing");
          state.typer = null;
          resolve();
        },
        timer: 0,
      };
      const tick = () => {
        node.textContent += chars[i++];
        if (i >= chars.length) return typer.finish();
        const ch = chars[i - 1];
        const pause = /[,.!?]/.test(ch) ? speed * 6 : speed;
        typer.timer = setTimeout(tick, pause);
      };
      state.typer = typer;
      typer.timer = setTimeout(tick, 250);
    });
  }

  function stopTyping() {
    if (state.typer) state.typer.finish();
  }

  /* ------------------------------------------------------------------
   * Dựng thiệp
   * ------------------------------------------------------------------ */
  function renderCard(data) {
    el.card.dataset.theme = data.theme;

    // Avatar: ảnh thật hoặc emoji
    el.avatar.replaceChildren();
    if (data.avatar) {
      const img = new Image();
      img.src = data.avatar;
      img.alt = `Ảnh của ${data.title}`;
      img.decoding = "async";
      el.avatar.appendChild(img);
      el.photoBg.style.backgroundImage = `url("${data.avatar}")`;
      el.card.classList.add("has-photo");
    } else {
      el.avatar.textContent = data.emoji || "💐";
      el.photoBg.style.backgroundImage = "";
      el.card.classList.remove("has-photo");
    }

    el.badge.textContent = data.badge;
    el.title.textContent = data.title;

    el.highlight.hidden = !data.highlight;
    el.highlight.textContent = data.highlight || "";
    el.wish.textContent = "";

    el.sign.classList.remove("is-visible");
    el.sign.textContent = CONFIG.senderName
      ? `— ${CONFIG.senderName} 💐`
      : data.theme === "male"
        ? "Chúc bạn một ngày thật vui! 🍀"
        : "Với tất cả sự trân trọng 💐";

    el.avatarWrap.classList.remove("is-floating");
    document.title =
      data.theme === "male" ? "Gửi bạn một lời chúc 😎 · 20/10" : `💌 Thiệp 20/10 · ${data.title}`;
  }

  /** Chuỗi mở phong bì; bỏ qua khi người dùng giảm chuyển động */
  async function playEnvelope() {
    if (reduceMotion()) return;
    el.envelope.hidden = false;
    el.envelope.classList.remove("is-playing");
    void el.envelope.offsetWidth;
    el.envelope.classList.add("is-playing");
    await wait(2250);
    el.envelope.hidden = true;
    el.envelope.classList.remove("is-playing");
  }

  async function openCard(name, gender, { pushHistory = true } = {}) {
    if (state.busy) return;
    state.busy = true;
    state.current = { name, gender };

    const data = resolveCard(name, gender);

    // Tải trước ảnh trong lúc phong bì đang mở
    if (data.avatar) new Image().src = data.avatar;

    renderCard(data);
    window.Petals?.setTheme(data.theme);

    const envelopeDone = playEnvelope();
    await wait(reduceMotion() ? 0 : 1700);
    await switchScreen(el.screenInput, el.screenCard);
    await envelopeDone;

    if (pushHistory) {
      try {
        history.pushState({ card: true }, "", buildShareUrl(name, gender, false));
      } catch (_) {
        /* file:// có thể chặn pushState – bỏ qua */
      }
    }

    window.Petals?.burst(5000);
    if (data.celebrate) {
      setTimeout(() => window.Confetti?.celebrate(data.theme), 450);
    } else {
      setTimeout(() => window.Confetti?.burst({ x: 0.5, y: 0.3, count: 60, theme: data.theme }), 450);
    }

    state.busy = false;
    await wait(reduceMotion() ? 0 : 900);
    await typeText(el.wish, data.wish);
    el.sign.classList.add("is-visible");
    el.avatarWrap.classList.add("is-floating");
  }

  async function backToInput({ fromPopState = false } = {}) {
    if (state.busy) return;
    if (!fromPopState && history.state && history.state.card) {
      history.back(); // popstate sẽ gọi lại hàm này
      return;
    }
    state.busy = true;
    stopTyping();
    window.Petals?.setTheme("female");
    resetForm();
    document.title = "Thiệp chúc mừng 20/10 · Ngày Phụ nữ Việt Nam";
    await switchScreen(el.screenCard, el.screenInput);
    state.busy = false;
    el.name.focus({ preventScroll: true });
  }

  /* ------------------------------------------------------------------
   * Form
   * ------------------------------------------------------------------ */
  function resetForm() {
    el.name.value = "";
    el.female.checked = true;
    showError(false);
  }

  function handleSubmit(e) {
    e.preventDefault();
    const name = cleanName(el.name.value);
    if (!name) {
      showError(true);
      return;
    }
    showError(false);
    el.name.blur(); // ẩn bàn phím điện thoại
    const gender = el.male.checked ? "male" : "female";
    openCard(name, gender);
  }

  /* ------------------------------------------------------------------
   * Chia sẻ
   * ------------------------------------------------------------------ */
  function buildShareUrl(name, gender, absolute = true) {
    const url = new URL(window.location.href);
    url.hash = "";
    url.search = "";
    url.searchParams.set("to", name);
    if (gender === "male") url.searchParams.set("g", "m");
    return absolute ? url.toString() : url.pathname + url.search;
  }

  async function handleShare() {
    const { name, gender } = state.current || {};
    if (!name) return;
    const url = buildShareUrl(name, gender);
    const shareData = {
      title: "💌 Thiệp chúc mừng 20/10",
      text: `Có một tấm thiệp 20/10 dành cho ${titleCase(name)} nè! 🌸`,
      url,
    };

    try {
      if (navigator.share && (!navigator.canShare || navigator.canShare(shareData))) {
        await navigator.share(shareData);
        return;
      }
      await navigator.clipboard.writeText(url);
      showToast("Đã sao chép link thiệp 💌");
    } catch (err) {
      if (err && err.name === "AbortError") return;
      window.prompt("Sao chép link thiệp:", url);
    }
  }

  /** Link chia sẻ ?to=...&g=m → điền sẵn form, người nhận chỉ cần bấm "Mở thiệp" */
  function prefillFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const to = params.get("to");
    if (!to) return;
    el.name.value = cleanName(to).slice(0, 60);
    (params.get("g") === "m" ? el.male : el.female).checked = true;
    el.inviteHint.hidden = false;
    // Chuẩn hóa URL để nút Back hoạt động đúng
    history.replaceState(null, "", window.location.pathname);
  }

  /* ------------------------------------------------------------------
   * Khởi động
   * ------------------------------------------------------------------ */
  function bindEvents() {
    el.form.addEventListener("submit", handleSubmit);
    el.reset.addEventListener("click", () => {
      resetForm();
      el.inviteHint.hidden = true;
      el.name.focus();
    });
    el.name.addEventListener("input", () => {
      if (!el.error.hidden && el.name.value.trim()) showError(false);
    });
    el.field.addEventListener("animationend", () => el.field.classList.remove("is-shaking"));

    el.back.addEventListener("click", () => backToInput());
    el.share.addEventListener("click", handleShare);
    el.wishBox.addEventListener("click", stopTyping);

    window.addEventListener("popstate", () => {
      if (el.screenCard.classList.contains("is-active")) backToInput({ fromPopState: true });
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && el.screenCard.classList.contains("is-active")) backToInput();
    });
  }

  function init() {
    if (!CONFIG) {
      console.error("Thiếu assets/js/config.js");
      return;
    }
    window.Petals?.init("petal-canvas");
    window.Confetti?.init("confetti-canvas");
    window.BgMusic?.init("btn-music");

    bindEvents();
    prefillFromUrl();

    // Preload ảnh avatar khi trình duyệt rảnh
    const preload = () => CONFIG.special.forEach((p) => (new Image().src = p.avatar));
    "requestIdleCallback" in window ? requestIdleCallback(preload) : setTimeout(preload, 1500);

    el.screenInput.classList.add("is-entering");
    setTimeout(() => el.screenInput.classList.remove("is-entering"), 1600);

    // Chỉ tự focus trên máy tính – tránh bật bàn phím che màn hình điện thoại
    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      el.name.focus({ preventScroll: true });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
