/**
 * ============================================================
 *  CẤU HÌNH NỘI DUNG THIỆP 20/10
 * ============================================================
 *  - Muốn thêm một người đặc biệt: thêm 1 object vào mảng `special`.
 *  - Việc so khớp tên KHÔNG phân biệt hoa/thường, KHÔNG phân biệt dấu
 *    và tự bỏ khoảng trắng thừa → "phan ngoc tuong vy" vẫn khớp.
 *  - Trong các chuỗi lời chúc, `{name}` sẽ được thay bằng tên người nhập.
 * ============================================================
 */
window.APP_CONFIG = Object.freeze({
  /** Tên người gửi (để trống "" nếu không muốn hiển thị) */
  senderName: "",

  /** Nhạc nền:
   *  - Để `src: ""` → dùng nhạc hộp nhạc (music box) tự tổng hợp bằng Web Audio, không cần file.
   *  - Hoặc đặt file vào assets/audio/ rồi điền: src: "assets/audio/background.mp3"
   */
  music: {
    src: "",
    volume: 0.5,
  },

  /** Những người bạn đặc biệt – có ảnh & lời chúc riêng */
  special: [
    {
      fullName: "Phan Ngọc Tường Vy",
      avatar: "assets/images/vy.jpg",
      badge: "🌸 Happy Women's Day 20/10",
      wish:
        "Nhân ngày Phụ nữ Việt Nam 20/10, chúc Bí Me luôn xinh đẹp, chúc Bí Me hạnh phúc nè, chúc Bí Me sống dai thành huyền thoại nè. Chúc mày học tập tốt và ăn càng ngày càng nhiều nha 💖",
    },
    {
      fullName: "Nguyễn Hữu Ngọc Ngân",
      avatar: "assets/images/ngan.jpg",
      badge: "🌸 Happy Women's Day 20/10",
      wish:
        "Nhân ngày Phụ nữ Việt Nam 20/10, chúc Ngọc Ngân luôn xinh đẹp, cười càng ngày càng to. Chúc mày luôn tràn đầy năng lượng, học tập tốt và mọi dự định sắp tới đều thành công 💖",
    },
    {
      fullName: "Lê Nguyễn Khánh Băng",
      avatar: "assets/images/bang.jpg",
      badge: "🌸 Happy Women's Day 20/10",
      wish:
        "Nhân ngày Phụ nữ Việt Nam 20/10, chúc bạn Băng luôn xinh đẹp, luôn vui, luôn cười. Chúc bạn Băng luôn năng lượng, học tập tốt và chúc bạn có những người bạn ĐÀNG HOÀNG nhé! 💖",
    },
    {
      fullName: "Nguyễn Phúc Đoan Trang",
      avatar: "assets/images/trang.jpg",
      badge: "🌸 Happy Women's Day 20/10",
      wish:
        "Nhân ngày Phụ nữ Việt Nam 20/10, chúc Don Chan luôn vui vẻ, luôn cười. Chúc mày luôn năng lượng và sáng tạo, chúc bạn của toi bớt stress vì deadline UTE, có những giấc ngủ ngon và đủ nha 💖",
    },
  ],

  /** Các bạn nữ khác */
  defaultFemale: {
    emoji: "💐",
    badge: "Happy Vietnamese Women's Day 20/10",
    greeting: "Thân gửi {name}",
    wish:
      "Nhân ngày Phụ nữ Việt Nam 20/10, xin gửi đến bạn những lời chúc tốt đẹp và chân thành nhất! Chúc bạn luôn xinh đẹp rạng ngời, ngập tràn niềm vui, hạnh phúc và gặt hái được thật nhiều thành công trong cuộc sống! 🌸💖",
  },

  /** Các bạn nam */
  male: {
    emoji: "😎",
    badge: "📢 Thông báo nhỏ",
    greeting: "Chào {name}!",
    highlight:
      "Bạn là Nam nên hôm nay (20/10) không phải là ngày lễ dành cho bạn rồi! 😄",
    wish:
      "Tuy nhiên, nhân dịp đặc biệt này, vẫn xin gửi đến bạn một lời chúc sức khỏe thật dồi dào, luôn giữ vững phong độ, tràn đầy năng lượng và gặp nhiều may mắn trong học tập cũng như công việc nhé! 💪✨",
  },
});
