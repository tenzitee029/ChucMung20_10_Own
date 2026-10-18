# 📖 HƯỚNG DẪN CHỈNH SỬA & TÙY BIẾN THIỆP 20/10

Tài liệu này hướng dẫn chi tiết từng bước cách thêm bạn mới, đổi ảnh, sửa lời chúc và cập nhật tự động lên trang web Vercel.

---

## ⚠️ Lưu ý quan trọng đầu tiên
- **KHÔNG sửa trong thư mục `desktop-wpf/`**: Thư mục này chỉ là bản lưu trữ mã nguồn phần mềm C# cũ cho máy tính. Trang web trên Vercel **không** dùng dữ liệu ở đó.
- Toàn bộ nội dung của trang Web nằm ở 2 vị trí:
  1. File cấu hình nội dung: **`assets/js/config.js`**
  2. Thư mục chứa hình ảnh: **`assets/images/`**

---

## 1. Cách THÊM một người bạn mới (có ảnh & lời chúc riêng)

### Bước 1: Thêm file ảnh của bạn đó
- Copy file ảnh (định dạng `.jpg` hoặc `.png`) bỏ vào thư mục: `assets/images/`
- *Ví dụ: bạn thêm ảnh `lan.jpg` vào `assets/images/lan.jpg`*.

### Bước 2: Thêm thông tin vào `assets/js/config.js`
- Mở file `assets/js/config.js`.
- Tìm đến mục `special: [ ... ]`.
- Thêm một khối thông tin của bạn mới vào trong mảng (nhớ có dấu phẩy `,` ngăn cách giữa các người):

```javascript
    {
      fullName: "Trần Thị Lan",
      avatar: "assets/images/lan.jpg",
      badge: "🌸 Happy Women's Day 20/10",
      wish: "Nhân ngày 20/10, chúc Lan luôn xinh đẹp rạng ngời, luôn vui vẻ và thành công trên con đường sắp tới nhé! 💖",
    },
```

> **Mẹo so khớp tên:** Hệ thống tự động so khớp **không phân biệt chữ hoa/thường** và **không phân biệt có dấu hay không dấu**. Vì vậy dù người nhận gõ `"Trần Thị Lan"` hay `"tran thi lan"` thì thiệp riêng vẫn sẽ tự động mở ra chính xác!

---

## 2. Cách SỬA lời chúc của người đã có sẵn

Trong file `assets/js/config.js`, tìm tên người bạn muốn sửa trong mục `special`:
- **Phan Ngọc Tường Vy**: Sửa nội dung ở trường `wish` tương ứng.
- **Nguyễn Hữu Ngọc Ngân**: Sửa nội dung ở trường `wish` tương ứng.
- **Lê Nguyễn Khánh Băng**: Sửa nội dung ở trường `wish` tương ứng.
- **Nguyễn Phúc Đoan Trang**: Sửa nội dung ở trường `wish` tương ứng.

*Nếu muốn đổi ảnh của họ, chỉ cần chép đè file ảnh mới có cùng tên vào `assets/images/` (hoặc đổi đường dẫn ở trường `avatar`).*

---

## 3. Cách SỬA lời chúc cho các bạn Nữ khác (Default)

Nếu người dùng nhập một tên nữ **không nằm trong danh sách đặc biệt**, trang web sẽ dùng lời chúc mặc định ở mục `defaultFemale`:

```javascript
  defaultFemale: {
    emoji: "💐",
    badge: "Happy Vietnamese Women's Day 20/10",
    greeting: "Thân gửi {name}",
    wish:
      "Nhân ngày Phụ nữ Việt Nam 20/10, xin gửi đến bạn những lời chúc tốt đẹp và chân thành nhất! Chúc bạn luôn xinh đẹp rạng ngời, ngập tràn niềm vui, hạnh phúc và gặt hái được thật nhiều thành công trong cuộc sống! 🌸💖",
  },
```
- Bạn có thể chỉnh sửa câu chữ trong `wish`.
- Chữ `{name}` sẽ tự động được thay thế bằng tên mà người đó đã nhập trên màn hình.

---

## 4. Cách SỬA lời chúc dành cho bạn Nam

Tìm mục `male` trong `assets/js/config.js`:

```javascript
  male: {
    emoji: "😎",
    badge: "📢 Thông báo nhỏ",
    greeting: "Chào {name}!",
    highlight:
      "Bạn là Nam nên hôm nay (20/10) không phải là ngày lễ dành cho bạn rồi! 😄",
    wish:
      "Tuy nhiên, nhân dịp đặc biệt này, vẫn xin gửi đến bạn một lời chúc sức khỏe thật dồi dào, luôn giữ vững phong độ, tràn đầy năng lượng và gặp nhiều may mắn trong học tập cũng như công việc nhé! 💪✨",
  },
```
- `highlight`: Dòng chữ nổi màu vàng nhấn mạnh.
- `wish`: Lời chúc chi tiết bên dưới.

---

## 5. Thêm chữ ký người gửi (Ví dụ: "— Từ Tiến 💐")

Mặc định ở đầu file `assets/js/config.js`:
```javascript
senderName: "",
```
Nếu bạn muốn cuối mỗi bức thiệp đều hiện tên bạn, chỉ cần điền tên vào đây:
```javascript
senderName: "Tiến",
```

---

## 6. Thay đổi bài nhạc nền (Background Music)

- **Mặc định**: Trang web tự tổng hợp giai điệu hộp nhạc (Music Box) lãng mạn nhẹ nhàng qua Web Audio (không cần bất kỳ file nhạc nào).
- **Nếu muốn dùng bài nhạc MP3 riêng của bạn**:
  1. Chép file bài hát vào: `assets/audio/background.mp3`
  2. Mở `assets/js/config.js`, sửa dòng:
     ```javascript
     music: {
       src: "assets/audio/background.mp3",
       volume: 0.5,
     },
     ```

---

## 7. CẬP NHẬT LÊN VERCEL (Chỉ 3 lệnh Git)

Sau khi chỉnh sửa xong các file trong máy tính, mở terminal tại thư mục dự án và chạy 3 lệnh sau:

```bash
git add .
git commit -m "update: cap nhat loi chuc va hinh anh"
git push
```

⏳ **Sau khi bấm Enter lệnh `git push`**:
Vercel sẽ nhận diện code mới và **tự động cập nhật trang web sau 5 - 10 giây**. Đường link domain `.vercel.app` của bạn vẫn giữ nguyên, bạn chỉ cần F5 lại trình duyệt là thấy ngay nội dung mới!

---

## 8. Cách tạo đường link điền sẵn tên để gửi tặng

Bạn có thể gửi link kèm tên người nhận qua Zalo/Messenger, khi họ bấm vào thì thiệp đã điền sẵn tên của họ:

- **Gửi bạn nữ**:
  `https://<ten-mien-cua-ban>.vercel.app/?to=Phan Ngọc Tường Vy`
- **Gửi bạn nam** (thêm `&g=m`):
  `https://<ten-mien-cua-ban>.vercel.app/?to=Minh Khoa&g=m`
