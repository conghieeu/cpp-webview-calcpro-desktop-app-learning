# 02 — Công Nghệ Sử Dụng (Tech Stack)

---

## 1. Tổng quan kiến trúc công nghệ

```
┌─────────────────────────────────────────────────────┐
│                   CalcPro App                        │
│                                                      │
│  ┌──────────────────────────────────────────────┐   │
│  │           Presentation Layer (UI)             │   │
│  │   HTML5 · CSS3 · Vanilla JavaScript          │   │
│  │   (Glassmorphism Dark Theme)                 │   │
│  └──────────────────┬───────────────────────────┘   │
│                     │ WebView2 Bridge (JS ↔ C++)    │
│  ┌──────────────────▼───────────────────────────┐   │
│  │           Application Layer                   │   │
│  │   C++17 · WebView2 API                       │   │
│  │   (Window Management, IPC)                   │   │
│  └──────────────────┬───────────────────────────┘   │
│                     │                               │
│  ┌──────────────────▼───────────────────────────┐   │
│  │           Computation Engine                  │   │
│  │   C++ Math Engine · Expression Parser        │   │
│  │   (Shunting-Yard Algorithm)                  │   │
│  └──────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

---

## 2. Frontend (UI Layer)

### 2.1 HTML5
- **Semantic HTML5** elements
- Không dùng framework (pure HTML)
- Single-page layout

### 2.2 CSS3
| Tính năng CSS | Mục đích sử dụng |
|---------------|-----------------|
| CSS Variables (`:root`) | Design tokens (màu, spacing, font) |
| CSS Grid | Layout tổng thể của calculator |
| CSS Flexbox | Căn chỉnh các phần tử trong button |
| `backdrop-filter: blur()` | Hiệu ứng glassmorphism |
| CSS Animations & Transitions | Micro-animations khi bấm nút |
| `@keyframes` | Hiệu ứng ripple, fade |
| CSS Custom Properties | Dynamic theming |

```css
/* Ví dụ design token */
:root {
  --color-bg-primary: #0d0d0d;
  --color-glass: rgba(255, 255, 255, 0.05);
  --color-accent: #00d4ff;
  --color-accent-2: #7b2fff;
  --blur-amount: 20px;
  --border-radius-btn: 16px;
  --font-primary: 'Inter', sans-serif;
  --font-display: 'JetBrains Mono', monospace;
}
```

### 2.3 JavaScript (Vanilla ES2022+)
| Module | Chức năng |
|--------|-----------|
| `calculator.js` | Logic tính toán phía JS (fallback) |
| `ui.js` | Xử lý DOM, event listeners |
| `history.js` | Quản lý lịch sử tính toán |
| `keyboard.js` | Xử lý phím tắt |
| `bridge.js` | Giao tiếp với C++ backend qua WebView2 |
| `theme.js` | Quản lý light/dark theme |

---

## 3. Backend (C++ Layer)

### 3.1 Ngôn ngữ & Tiêu chuẩn
- **C++17** — modern features, structured bindings, `std::optional`
- Compiler: **MSVC 2022** (Visual Studio Build Tools)
- Build system: **CMake 3.21+**

### 3.2 Thư viện chính
| Thư viện | Version | Mục đích |
|----------|---------|---------|
| `webview` | 0.11+ | WebView2 wrapper, C++ ↔ JS IPC |
| `WebView2 SDK` | 1.0.2+ | Microsoft Edge WebView2 |
| `nlohmann/json` | 3.11+ | Parse/serialize JSON cho IPC |

### 3.3 Cấu trúc C++ modules
```
src/
├── main.cpp              # Entry point, window setup
├── app/
│   ├── App.hpp           # Application class
│   └── App.cpp
├── engine/
│   ├── Calculator.hpp    # Core calculator logic
│   ├── Calculator.cpp
│   ├── Parser.hpp        # Expression parser (Shunting-Yard)
│   ├── Parser.cpp
│   └── MathFunctions.hpp # sin, cos, log, etc.
├── bridge/
│   ├── Bridge.hpp        # JS ↔ C++ communication
│   └── Bridge.cpp
└── utils/
    ├── Logger.hpp        # Logging utility
    └── Config.hpp        # App config
```

---

## 4. Build System

### 4.1 CMake
```cmake
# CMakeLists.txt (tóm tắt)
cmake_minimum_required(VERSION 3.21)
project(CalcPro VERSION 1.0.0 LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Dependencies
find_package(WebView2 REQUIRED)
# ...
```

### 4.2 Build Scripts
| Script | Mục đích |
|--------|---------|
| `dev.ps1` | Build debug + auto-reload |
| `build.ps1` | Build release |
| `clean.ps1` | Xóa build artifacts |

---

## 5. Development Tools

| Tool | Version | Mục đích |
|------|---------|---------|
| Visual Studio 2022 | Latest | IDE chính |
| VS Build Tools | 2022 | Compiler (MSVC) |
| CMake | 3.21+ | Build system |
| Git | Latest | Version control |
| Node.js | 20 LTS | Dev tools (live reload, etc.) |
| WebView2 Runtime | Latest | Runtime cho WebView |

---

## 6. Google Fonts được dùng

```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@300;400;500&display=swap" rel="stylesheet">
```

| Font | Dùng cho |
|------|---------|
| **Inter** | Button labels, UI text |
| **JetBrains Mono** | Display số, expressions |

---

## 7. Lý do chọn công nghệ

### Tại sao C++ + WebView?
- ✅ **Native performance**: C++ cho tốc độ tính toán tối ưu
- ✅ **Beautiful UI**: HTML/CSS không giới hạn về thiết kế
- ✅ **Nhỏ gọn**: Không cần Electron, bundle size nhỏ hơn nhiều
- ✅ **Native Window**: Tích hợp tốt với Windows (taskbar, tray, shortcuts)
- ✅ **WebView2**: Dùng Edge Chromium engine, stable và performant

### So sánh với các lựa chọn khác
| Approach | Bundle Size | Performance | UI Flexibility |
|----------|-------------|-------------|----------------|
| **C++ + WebView2** ✅ | ~5 MB | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Electron | ~150 MB | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Qt | ~30 MB | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| WinForms | ~10 MB | ⭐⭐⭐⭐ | ⭐⭐ |
| WPF | ~20 MB | ⭐⭐⭐⭐ | ⭐⭐⭐ |

---

*← [Project Overview](./01_project_overview.md) | Tiếp theo: [UI/UX Design →](./03_ui_ux_design.md)*
