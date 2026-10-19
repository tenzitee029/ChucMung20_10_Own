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
    src: "assets/audio/romantic-piano.mp3",
    volume: 0.8,
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
    {
      fullName: "Trần Triệu Thiên Tú",
      avatar: "assets/images/tu.jpg",
      badge: "🌸 Happy Women's Day 20/10",
      wish:
        "Chuc di Tenzi",
    },
    {
      fullName: "Cao Như Ngọc", 
      avatar: "assets/images/ngoc.jpg",
      badge: "🌸 Happy Women's Day 20/10",
      wish:
        "Nhân ngày Phụ nữ Việt Nam 20/10, chúc bạn Ngọc luôn xinh đẹp, cười càng ngày càng to, thiết kế càng ngày càng đẹp. Chúc ní luôn tràn đầy năng lượng, học tập tốt và mọi dự định sắp tới đều thành công 💖",
    },
    {
      fullName: "Trương Ngọc Gia Hân",
      avatar: "assets/images/han.jpg",
      badge: "🌸 Happy Women's Day 20/10",
      wish:
        "Nhân ngày Phụ nữ Việt Nam 20/10, chúc bạn Hân luôn xinh đẹp, luôn vui vẻ, ý tưởng dạt dào, deadline thong thả, thầy cô nhẹ tay. ngập tràn yêu thương!. Chúc mày sẽ thành công trên con đường học tập cũng như các dự định sắp tới nhen💖",
    },
  ],

  /** Các bạn nữ khác */
  defaultFemale: {
    emoji: "💐",
    badge: "Happy Vietnamese Women's Day 20/10",
    greeting: "Thân gửi {name}",
    /** Mỗi lần mở thiệp sẽ chọn ngẫu nhiên 1 câu. Có thể thêm/bớt tùy ý. */
    wishes: [
      // 1. Ngọt ngào, yêu đời
      "Nhân ngày 20/10, chúc {name} luôn rạng ngời như nắng sớm, nụ cười lúc nào cũng tỏa sáng và mỗi ngày đều có thật nhiều lý do để mỉm cười nhé! 🌸",
      // 2. Thành công, bản lĩnh
      "Chúc {name} một 20/10 thật rực rỡ! Mong bạn luôn tự tin, bản lĩnh, vững vàng trên con đường mình chọn và chạm tới mọi mục tiêu đã đặt ra. 💼✨",
      // 3. Bình yên, thư thả
      "20/10 này, chúc {name} ít deadline hơn một chút, ngủ ngon hơn một chút, và tâm hồn lúc nào cũng nhẹ nhàng, an yên giữa những bộn bề. 🍃",
      // 4. Hạnh phúc, viên mãn
      "Chúc {name} luôn được bao bọc bởi những người thật lòng thương mình, được yêu thương trọn vẹn và hạnh phúc theo cách mà bạn xứng đáng nhận được. 💖",
      // 5. Năng lượng, tích cực
      "Chúc {name} một ngày 20/10 tràn đầy năng lượng! Mong mỗi ngày của bạn đều có một niềm vui nhỏ bất ngờ, đủ để thấy cuộc sống này thật đáng yêu. ☀️",
      // 6. Sức khỏe, sắc đẹp
      "Nhân ngày Phụ nữ Việt Nam, chúc {name} nhan sắc ngày càng thăng hạng, sức khỏe dồi dào và lúc nào cũng tươi tắn, rạng rỡ như hôm nay. 🌷",
      // 7. Truyền cảm hứng
      "Gửi {name}: bạn là phiên bản duy nhất và đặc biệt. Chúc bạn luôn tự tin vào vẻ đẹp riêng của mình và tiếp tục truyền cảm hứng cho những người xung quanh. 🌟",
      // 8. Hài hước, gần gũi
      "20/10 vui vẻ nha {name}! Chúc bạn ăn hoài không béo, ví lúc nào cũng dày, crush tự động nhắn tin và lòng chẳng vướng bận điều gì. 😆💸",
      // 9. Chân thành, ấm áp
      "Cảm ơn {name} vì những điều tốt đẹp và cả những cố gắng thầm lặng mà bạn đã mang lại. Chúc bạn một 20/10 thật ấm áp và luôn được trân trọng. 💐",
      // 10. Trọn vẹn
      "Chúc {name} một ngày 20/10 trọn vẹn: may mắn đến gõ cửa, thành công theo sát bên, niềm vui ngập tràn và vạn sự như ý! 🎀",
    ],
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
