# 💌 Thiệp chúc mừng 20/10 · Ngày Phụ nữ Việt Nam

Thiệp chúc mừng 20/10 chạy ngay trên trình duyệt. Người nhận **chỉ cần bấm vào link**,
không phải tải hay cài gì cả. Điện thoại và máy tính đều xem tốt.

> Bản gốc là ứng dụng WPF (C#), hiện nằm trong thư mục [`desktop-wpf/`](desktop-wpf/).

## ✨ Tính năng

- Nhập **họ tên + giới tính** để mở thiệp. Logic giống hệt bản WPF:
  - **Nam**: một lời nhắc vui và lời chúc sức khỏe 😎
  - **Nữ có tên trong danh sách riêng**: thiệp riêng, có ảnh và lời chúc riêng
  - **Nữ khác**: thiệp chung, tự chèn tên người nhận
- Tên được so khớp **không phân biệt hoa/thường và có dấu/không dấu** (`phan ngoc tuong vy` vẫn khớp).
- Hiệu ứng mở **phong bì**, **lật thẻ**, **cánh hoa rơi**, **pháo giấy**, **chữ hiện dần như đang gõ**.
- **Nhạc nền hộp nhạc** được tạo bằng Web Audio, không cần file mp3. Có nút bật/tắt.
- Nút **Chia sẻ** tạo link dạng `?to=Tên`. Người nhận mở link sẽ thấy form đã điền sẵn tên.
- Có Glassmorphism, Mobile-First, hỗ trợ `prefers-reduced-motion`, và nút Back của điện thoại quay về màn nhập.

## 📁 Cấu trúc thư mục

```text
.
├── index.html              # Trang duy nhất: màn nhập tên + màn thiệp + phong bì
├── assets/
│   ├── css/
│   │   ├── style.css       # Design tokens, layout, glassmorphism, components
│   │   └── animations.css  # Keyframes & chuyển cảnh
│   ├── js/
│   │   ├── config.js       # ⭐ NỘI DUNG THIỆP: tên, ảnh, lời chúc (sửa ở đây)
│   │   ├── petals.js       # Cánh hoa rơi (canvas)
│   │   ├── confetti.js     # Pháo giấy (canvas)
│   │   ├── audio.js        # Nhạc nền (Web Audio / file mp3)
│   │   └── app.js          # Điều phối màn hình, form, chia sẻ
│   ├── images/             # Ảnh avatar + favicon
│   └── audio/              # (Tùy chọn) đặt background.mp3 ở đây
├── desktop-wpf/            # Mã nguồn ứng dụng WPF gốc (.NET 8)
├── .nojekyll               # Để GitHub Pages phục vụ file tĩnh nguyên trạng
└── README.md
```

## ✏️ Tùy chỉnh nội dung

Mở `assets/js/config.js`:

- **Thêm một người đặc biệt**: thêm một object vào mảng `special`, rồi chép ảnh vào `assets/images/`.
- **Sửa lời chúc chung**: sửa `defaultFemale` hoặc `male`. Dùng `{name}` để chèn tên.
- **Tên người gửi**: điền `senderName` để ký tên dưới thiệp.
- **Dùng nhạc riêng**: chép file vào `assets/audio/` rồi đặt `music.src = "assets/audio/background.mp3"`.

## ▶️ Chạy thử trên máy

Cách nhanh nhất là **double-click `index.html`**.

Muốn giống môi trường thật hơn thì chạy một server tĩnh:

```bash
npx serve .
# hoặc
python -m http.server 5500
```

## 🚀 Đưa lên mạng miễn phí

### Cách 1: GitHub Pages

1. Push code lên GitHub (nhánh `master` hoặc `main`).
2. Vào repo → **Settings** → **Pages**.
3. Ở mục **Source**, chọn **Deploy from a branch**. Chọn nhánh, chọn thư mục `/ (root)`, rồi bấm **Save**.
4. Đợi khoảng 1–2 phút. Link sẽ có dạng:
   `https://<username>.github.io/<tên-repo>/`
   (ví dụ: `https://tenzitee029.github.io/ChucMung20_10_Own/`)

### Cách 2: Vercel / Netlify

1. Đăng nhập [vercel.com](https://vercel.com) hoặc [netlify.com](https://netlify.com) bằng tài khoản GitHub.
2. Chọn **Add New → Project** rồi chọn repo này.
3. Framework chọn **Other**. Để trống Build Command. Output Directory để `.`. Bấm **Deploy**.

## 🔗 Gửi thiệp cho từng người

Mở thiệp của một người rồi bấm **Chia sẻ**. Cũng có thể tự tạo link:

```
https://<link-của-bạn>/?to=Nguyễn Hữu Ngọc Ngân
https://<link-của-bạn>/?to=Minh Khoa&g=m      # g=m: thiệp cho Nam
```

> [!NOTE]
> Ảnh trong `assets/images/` sẽ công khai cùng trang web. Chỉ dùng ảnh mà người trong ảnh đã đồng ý.
