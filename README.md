# 🧮 CalcPro — Modern Desktop Calculator

[![C++](https://img.shields.io/badge/C%2B%2B-17-blue.svg)](https://isocpp.org/)
[![WebView2](https://img.shields.io/badge/WebView2-Edge-orange.svg)](https://developer.microsoft.com/en-us/microsoft-edge/webview2/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

**CalcPro** là một ứng dụng máy tính khoa học hiện đại dành cho Windows, được xây dựng bằng kiến trúc kết hợp giữa sức mạnh tính toán của **C++17** và sự linh hoạt của giao diện web (**HTML5/CSS3/JS**). Với thiết kế **Glassmorphism Dark Mode** cao cấp, CalcPro mang lại trải nghiệm người dùng mượt mà và trực quan.

---

## ✨ Tính năng nổi bật

- 🔢 **Máy tính đa năng**: Hỗ trợ đầy đủ các phép tính cơ bản (+, -, ×, ÷) và các hàm khoa học (sin, cos, tan, log, ln, √, lũy thừa...).
- 📜 **Lịch sử tính toán**: Tự động lưu lại các phép tính gần nhất để bạn có thể xem lại hoặc sử dụng kết quả.
- 💾 **Bộ nhớ thông minh**: Tích hợp các phím bộ nhớ (M+, M-, MR, MC) giúp quản lý các giá trị tính toán phức tạp.
- 🎨 **Giao diện hiện đại**: Phong cách kính mờ (Glassmorphism) với hiệu ứng dark mode sang trọng, micro-animations mượt mà.
- ⌨️ **Phím tắt bàn phím**: Hỗ trợ đầy đủ phím tắt giúp thao tác nhanh chóng như một chuyên gia.
- ⚡ **Hiệu suất cao**: Backend được viết bằng C++ đảm bảo độ chính xác tuyệt đối và phản hồi tức thì (< 50ms).

---

## 🛠️ Công nghệ sử dụng

| Lớp (Layer) | Công nghệ |
|-------------|-----------|
| **Giao diện (Frontend)** | HTML5, CSS3 (Vanilla CSS), JavaScript (ES2022) |
| **Ứng dụng (Backend)** | C++17, CMake |
| **Engine WebView** | [WebView2](https://developer.microsoft.com/en-us/microsoft-edge/webview2/) (Chromium) |
| **Truyền dữ liệu** | [nlohmann/json](https://github.com/nlohmann/json) (JSON IPC) |

---

## 💻 Yêu cầu hệ thống

- **Hệ điều hành**: Windows 10 (version 1803+) hoặc Windows 11.
- **Runtime**: Microsoft Edge WebView2 Runtime (thường đã có sẵn trên Win 11).
- **Phần cứng**: RAM tối thiểu 128MB, ổ cứng trống 50MB.

---

## 🚀 Hướng dẫn Xây dựng (Build)

### 1. Chuẩn bị
- Đã cài đặt **Visual Studio 2019/2022** (với C++ Desktop Development).
- **CMake** phiên bản 3.21 trở lên.
- **Node.js** (để build frontend).

### 2. Các bước thực hiện

#### Bước A: Build Frontend
```powershell
cd ui
npm install
npm run build
```

#### Bước B: Build Backend C++
Quay lại thư mục gốc của dự án:
```powershell
mkdir build
cd build
cmake ..
cmake --build . --config Release
```

Tệp thực thi `.exe` sẽ nằm trong thư mục `build/Release/`.

---

## 📂 Cấu trúc thư mục

```text
CalcPro/
├── src/                # Mã nguồn C++ (Engine, Bridge, Main)
├── ui/                 # Giao diện người dùng (HTML, CSS, JS)
│   ├── src/            # Mã nguồn frontend chưa build
│   └── dist/           # Kết quả build frontend (nhúng vào C++)
├── Planning/           # Tài liệu thiết kế và kế hoạch dự án
├── CMakeLists.txt      # Cấu hình build hệ thống
└── README.md           # Tài liệu hướng dẫn này
```

---

## 📄 Tài liệu chi tiết

Bạn có thể tìm hiểu thêm về thiết kế và kiến trúc dự án trong thư mục `Planning/`:
- [Tổng quan dự án](Planning/01_project_overview.md)
- [Chi tiết Tech Stack](Planning/02_tech_stack.md)
- [Thiết kế UI/UX](Planning/03_ui_ux_design.md)

---

## 📜 Giấy phép

Dự án này được phát hành dưới giấy phép **MIT**. Xem tệp `LICENSE` để biết thêm chi tiết.

---
*Phát triển bởi team CalcPro @ 2026*


