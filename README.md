# Ví dụ Khởi đầu C++ WebView GUI

Kho lưu trữ này chứa mã nguồn cho video YouTube đi kèm: **sắp ra mắt**. Nó minh họa một ứng dụng desktop C++ hiện đại sử dụng [webview/webview](https://github.com/webview/webview) cho GUI đa nền tảng và [nlohmann/json](https://github.com/nlohmann/json) để phân tích cú pháp JSON.

## Tính năng

* GUI desktop đa nền tảng sử dụng WebView (Windows, macOS, Linux)
* Đọc tệp và giao tiếp JSON giữa frontend JS và backend C++
* Phụ thuộc tối thiểu
* CMake xử lý việc tải các thư viện cần thiết

## Yêu cầu Hệ thống

### Bắt buộc

* CMake ≥ 3.16
* Trình biên dịch C++17
    * **Windows:** MSVC 2019+
    * **macOS:** Apple Clang
    * **Linux:** GCC ≥ 9 hoặc Clang ≥ 11
* Node.JS (Khuyến nghị bản LTS mới nhất)

### Theo từng nền tảng (khi xây dựng)

| Nền tảng | Các thành phần phụ thuộc |
|-|-|
| Windows | WebView2 Runtime (đã bao gồm trong Windows 11) |
| macOS | WebKit qua Cocoa (đã bao gồm trong macOS) |
| Linux (GTK) | GTK 3 hoặc 4 và các thư viện phát triển WebKitGTK (4 hoặc 6) |

## Hướng dẫn Xây dựng

1. Sao chép kho lưu trữ:

```
git clone https://github.com/nikelaz/cpp-webview-gui.git
cd cpp-webview-gui
```

2. Xây dựng giao diện người dùng (UI)
```
cd ui
npm install
npm run build
```

3. Tạo thư mục build trong thư mục gốc của dự án và cấu hình:
```
mkdir build
cd build
cmake ..
```

4. Xây dựng dự án:
```
cmake --build .
```

Tệp thực thi sẽ nằm tại: `build/bin`

## Ghi chú

* Các tệp frontend được nhúng dưới dạng tệp tiêu đề (ui/dist/index_html.h) — không yêu cầu tệp bên ngoài.
* JavaScript giao tiếp với C++ thông qua các ràng buộc WebView, sử dụng JSON để truyền đối số.
* Dự án sử dụng CMake FetchContent để tự động tải webview và nlohmann/json.

