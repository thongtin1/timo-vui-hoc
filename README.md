# TIMO Vui Học

Web ôn thi TIMO lớp 1 theo từng dạng toán, cùng bạn Zoombe. Chạy hoàn toàn trên trình duyệt, không cần máy chủ.

## Mỗi dạng toán có 4 phần
1. **📖 Học từ** – thuật ngữ Anh–Việt, bấm để nghe đọc, kèm bí kíp làm bài.
2. **🧩 Ví dụ** – bấm "Tiếp theo" để xem lời giải từng bước, hình chạy theo.
3. **🎮 Luyện tập** – câu ngẫu nhiên, biết đúng sai ngay, có gợi ý.
4. **📝 Bài tự làm** – câu lấy từ đề ôn TIMO. Làm hết rồi nộp bài. Câu đúng xem được cách giải; câu sai chỉ báo sai (không hiện đáp án) để bé làm lại.

Chỉ **Bài tự làm** và **Thử thách TIMO** được cộng ⭐, và chỉ khi đúng ngay lần đầu. Câu đã làm sai thì làm lại đúng cũng không được sao.

Làm đúng được ⭐. Cứ 10 ⭐ mở 1 sticker. Sao dùng để đổi quà ở trang **🎁 Đổi quà**; bố mẹ tự đặt quà, phần cài đặt có câu hỏi chặn để bé không tự sửa.

## Mở trên điện thoại
Web được đăng bằng GitHub Pages. Mở link trên điện thoại rồi:
- **Android (Chrome):** menu ⋮ → *Thêm vào màn hình chính*.
- **iPhone (Safari):** nút Chia sẻ → *Thêm vào MH chính*.

App có icon riêng, mở toàn màn hình và dùng được cả khi không có mạng.

Giọng đọc tiếng Việt:
- **Android:** Cài đặt → Hệ thống → Ngôn ngữ → Chuyển văn bản thành giọng nói → Google, tải gói *Tiếng Việt*.
- **iPhone:** có sẵn giọng *Linh*.

> Sao và kết quả lưu riêng trên từng máy. Học trên điện thoại thì sao nằm trên điện thoại.

## Cập nhật
Sửa code xong, chạy:
```
node test/check.js   # kiểm tra đáp án và lời giải
git add -A && git commit -m "..." && git push
```
Khoảng 1 phút sau, điện thoại sẽ có bản mới (mở lại app khi có mạng).

## Thêm dạng toán mới
1. Tạo file `js/topics/<mã>.js` theo mẫu `js/topics/day-so.js`.
2. Thêm thẻ `<script>` của file đó vào `chu-de.html`, `index.html`, `album.html`, và thêm tên file vào `sw.js`.
3. Chạy `node test/check.js`.

Thư mục `doc/` (đề PDF gốc) chỉ để trên máy, không đưa lên GitHub.
