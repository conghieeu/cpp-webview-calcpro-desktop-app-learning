# 01 — Tổng Quan Dự Án (Project Overview)

---

## 1. Giới thiệu

**CalcPro** là một ứng dụng máy tính hiện đại, chạy trên desktop Windows, được xây dựng bằng kiến trúc **C++ + WebView**. Giao diện người dùng được thiết kế với phong cách glassmorphism tối (dark mode), mang lại trải nghiệm cao cấp, mượt mà và trực quan.

Dự án tận dụng nền tảng có sẵn `cpp-webview-gui` để render UI bằng HTML/CSS/JS bên trong một cửa sổ native, kết hợp sức mạnh tính toán của C++ với sự linh hoạt về giao diện của web.

---

## 2. Mục tiêu dự án

### 2.1 Mục tiêu chính
- ✅ Xây dựng ứng dụng máy tính desktop có giao diện **đẹp và chuyên nghiệp**
- ✅ Hỗ trợ **tính toán cơ bản** và **khoa học**
- ✅ Hiệu suất cao, phản hồi tức thì
- ✅ Trải nghiệm người dùng (UX) tốt, dễ sử dụng

### 2.2 Mục tiêu phụ
- ⬜ Hỗ trợ **lịch sử tính toán** (history)
- ⬜ Hỗ trợ **bộ nhớ** (Memory: M+, M-, MR, MC)
- ⬜ Chế độ **lập trình** (Programmer mode: HEX, BIN, OCT)
- ⬜ Hỗ trợ **theme** (Light / Dark)
- ⬜ Phím tắt bàn phím đầy đủ

---

## 3. Phạm vi dự án (Scope)

### ✅ Trong phạm vi (In Scope)
| Tính năng | Mô tả |
|-----------|--------|
| Calculator cơ bản | +, -, ×, ÷, %, dấu âm |
| Calculator khoa học | sin, cos, tan, log, ln, √, x², xⁿ, π, e |
| Hiển thị biểu thức | Hiển thị toàn bộ expression trước khi tính |
| Lịch sử | Lưu và hiển thị 20 phép tính gần nhất |
| Bộ nhớ | M+, M-, MR, MC |
| Phím tắt | Keyboard shortcuts đầy đủ |
| Responsive UI | Giao diện tương thích nhiều kích cỡ cửa sổ |

### ❌ Ngoài phạm vi (Out of Scope — v1.0)
- Đồ thị hàm số (graphing)
- Chuyển đổi đơn vị (unit conversion)
- Máy tính tài chính
- Hỗ trợ đa ngôn ngữ
- Cloud sync lịch sử

---

## 4. Đối tượng người dùng

### Primary Users
```
👨‍🎓 Học sinh / Sinh viên
  - Cần tính toán khoa học nhanh
  - Muốn giao diện hiện đại, không nhàm chán

👨‍💻 Lập trình viên / Kỹ sư
  - Thường xuyên cần máy tính trong công việc
  - Ưa chuộng phím tắt và hiệu quả cao

👩‍💼 Nhân viên văn phòng
  - Tính toán tài chính cơ bản
  - Cần giao diện sạch, không xao nhãng
```

---

## 5. Yêu cầu hệ thống

| Yêu cầu | Tối thiểu | Khuyến nghị |
|---------|-----------|-------------|
| OS | Windows 10 (1803+) | Windows 11 |
| RAM | 128 MB | 256 MB |
| Disk | 50 MB | 100 MB |
| CPU | Intel Core i3 / AMD Ryzen 3 | Intel Core i5+ |
| Display | 800×600 | 1920×1080 |
| Runtime | WebView2 Runtime | WebView2 Runtime (mới nhất) |

---

## 6. Điều kiện thành công (Definition of Done)

Dự án được coi là **hoàn thành** khi:

- [ ] Tất cả phép tính cơ bản và khoa học hoạt động chính xác (pass 100% unit tests)
- [ ] Giao diện không có lỗi hiển thị trên màn hình 1080p và 1440p
- [ ] Thời gian phản hồi của mỗi phép tính < 50ms
- [ ] Ứng dụng không crash trong 30 phút sử dụng liên tục
- [ ] Code được review và đạt tiêu chuẩn
- [ ] Tài liệu hướng dẫn sử dụng hoàn chỉnh

---

## 7. Rủi ro và biện pháp giảm thiểu

| Rủi ro | Mức độ | Biện pháp |
|--------|--------|-----------|
| WebView2 Runtime chưa được cài | Cao | Bundle WebView2 bootstrapper |
| Lỗi tính toán floating point | Trung bình | Dùng thư viện `mpfr` hoặc xử lý riêng |
| UI không tương thích DPI cao | Trung bình | Test trên nhiều setting DPI |
| Hiệu suất kém trên máy yếu | Thấp | Tối ưu render, tránh animation nặng |

---

*← [Quay lại Index](./README.md) | Tiếp theo: [Tech Stack →](./02_tech_stack.md)*
