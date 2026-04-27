# 06 — Lịch Trình & Mốc Phát Triển (Timeline & Milestones)

---

## 1. Tổng quan lịch trình

```
Tổng thời gian: 4 tuần (28 ngày)
Phương pháp:    Agile — Sprint 1 tuần/sprint

Sprint 1 (Tuần 1): Foundation & Setup
Sprint 2 (Tuần 2): Core Calculator + UI
Sprint 3 (Tuần 3): Scientific + History + Memory
Sprint 4 (Tuần 4): Polish, Testing & Release
```

---

## 2. Gantt Chart

```
WEEK 1        |  M  T  W  T  F  S  S  |
──────────────┼─────────────────────────┤
Project Setup |  ████████               |
CMake Config  |  ████                   |
C++ Scaffold  |     ████████            |
WebView Setup |           ████████      |
HTML Skeleton |                 ████    |
──────────────┴─────────────────────────┘

WEEK 2        |  M  T  W  T  F  S  S  |
──────────────┼─────────────────────────┤
Parser Engine |  ████████████           |
Calculator.cpp|        ████████         |
JS Bridge     |              ████       |
Basic UI/CSS  |  ██████████████████████ |
──────────────┴─────────────────────────┘

WEEK 3        |  M  T  W  T  F  S  S  |
──────────────┼─────────────────────────┤
Scientific    |  ████████               |
Memory Mgr    |      ████████           |
History Panel |           ████████████  |
Keyboard      |                 ████    |
Animations    |     ████████████████   |
──────────────┴─────────────────────────┘

WEEK 4        |  M  T  W  T  F  S  S  |
──────────────┼─────────────────────────┤
Unit Testing  |  ████████████           |
Bug Fixes     |        ████████████     |
Performance   |              ████████   |
Documentation |  ████                   |
Final Build   |                    ████ |
──────────────┴─────────────────────────┘
```

---

## 3. Chi tiết từng Sprint

### 🏃 Sprint 1 — Foundation & Setup (Tuần 1)

**Goal:** Có thể build và chạy app với UI trống

| Task | Owner | Effort | Status |
|------|-------|--------|--------|
| Setup CMake với WebView2 | Dev | 0.5d | ⬜ |
| Tạo cấu trúc thư mục | Dev | 0.5d | ⬜ |
| C++ App class + Window setup | Dev | 1d | ⬜ |
| HTML boilerplate + CSS variables | Dev | 1d | ⬜ |
| WebView2 bridge hello world | Dev | 1d | ⬜ |
| Google Fonts + reset CSS | Dev | 0.5d | ⬜ |
| Git init + .gitignore | Dev | 0.5d | ⬜ |

**Definition of Done Sprint 1:**
- [ ] `dev.ps1` chạy được, mở cửa sổ app
- [ ] WebView load được `index.html`
- [ ] JS có thể gọi C++ và nhận kết quả về

---

### 🏃 Sprint 2 — Core Calculator (Tuần 2)

**Goal:** Calculator cơ bản hoạt động đầy đủ

| Task | Owner | Effort | Status |
|------|-------|--------|--------|
| Token + Lexer | Dev | 1d | ⬜ |
| Shunting-Yard Parser | Dev | 1.5d | ⬜ |
| Calculator evaluator | Dev | 1d | ⬜ |
| Error handling (div/0, overflow) | Dev | 0.5d | ⬜ |
| Bridge: calculate action | Dev | 0.5d | ⬜ |
| UI: Display area component | Dev | 1d | ⬜ |
| UI: Number & operator buttons | Dev | 1d | ⬜ |
| UI: CSS glassmorphism theme | Dev | 1d | ⬜ |
| JS: ui.js event handling | Dev | 0.5d | ⬜ |

**Definition of Done Sprint 2:**
- [ ] Nhập `123 + 456 × 7`, nhấn `=` → `3315`
- [ ] Nút `AC`, `←`, `±`, `%` hoạt động
- [ ] UI trông đúng theo thiết kế

---

### 🏃 Sprint 3 — Advanced Features (Tuần 3)

**Goal:** Scientific mode, History, Memory, Keyboard

| Task | Owner | Effort | Status |
|------|-------|--------|--------|
| C++: MathFunctions (sin/cos/tan/log/ln/√) | Dev | 1d | ⬜ |
| C++: Parser hỗ trợ functions | Dev | 1d | ⬜ |
| UI: Scientific mode panel | Dev | 1d | ⬜ |
| C++: MemoryManager | Dev | 0.5d | ⬜ |
| UI: Memory buttons (M+/M-/MR/MC) | Dev | 0.5d | ⬜ |
| JS: history.js + localStorage | Dev | 1d | ⬜ |
| UI: History panel (slide-in) | Dev | 1d | ⬜ |
| JS: keyboard.js shortcuts | Dev | 0.5d | ⬜ |
| CSS: Animations + micro-interactions | Dev | 1d | ⬜ |
| UI: Angle unit toggle (DEG/RAD) | Dev | 0.5d | ⬜ |

**Definition of Done Sprint 3:**
- [ ] `sin(30)` → `0.5` ở chế độ Degrees
- [ ] M+ lưu, MR lấy, MC xóa đúng
- [ ] Lịch sử hiện đúng, click tái sử dụng được
- [ ] Tất cả phím tắt hoạt động

---

### 🏃 Sprint 4 — Polish & Release (Tuần 4)

**Goal:** Sản phẩm hoàn chỉnh, không bug, ready to ship

| Task | Owner | Effort | Status |
|------|-------|--------|--------|
| Viết unit tests Calculator | Dev | 1.5d | ⬜ |
| Viết unit tests Parser | Dev | 1d | ⬜ |
| UI testing trên nhiều DPI | Dev | 0.5d | ⬜ |
| Performance profiling | Dev | 0.5d | ⬜ |
| Fix bugs từ testing | Dev | 1d | ⬜ |
| Tối ưu startup time | Dev | 0.5d | ⬜ |
| Build release version | Dev | 0.5d | ⬜ |
| Viết README hướng dẫn dùng | Dev | 0.5d | ⬜ |
| Code review cuối | Dev | 0.5d | ⬜ |

**Definition of Done Sprint 4:**
- [ ] Pass 100% unit tests
- [ ] Không crash trong 30 phút stress test
- [ ] Startup < 1.5s trên máy tham chiếu
- [ ] Release build < 10MB

---

## 4. Milestones

| Milestone | Ngày | Mô tả |
|-----------|------|-------|
| 🏁 M1 | Cuối Sprint 1 | App mở được, WebView load HTML |
| 🏁 M2 | Cuối Sprint 2 | Basic calculator hoạt động |
| 🏁 M3 | Cuối Sprint 3 | Full feature complete |
| 🏁 M4 | Cuối Sprint 4 | Release v1.0.0 ✅ |

---

## 5. Rủi ro lịch trình

| Rủi ro | Khả năng | Tác động | Phòng ngừa |
|--------|---------|---------|-----------|
| Parser khó hơn dự kiến | Trung bình | +2 ngày | Dùng expr-eval library làm fallback |
| WebView2 runtime issues | Thấp | +1 ngày | Test sớm trong Sprint 1 |
| CSS animation performance | Thấp | +0.5 ngày | Dùng GPU-composited props only |
| Scope creep | Cao | +3 ngày | Strict out-of-scope list |

---

## 6. Definition of Done (Toàn dự án)

Dự án **v1.0.0** được release khi:

```
✅ Tất cả Must-Have features hoàn thành
✅ Pass 100% unit tests (115 test cases)
✅ Không có bug Critical/High mở
✅ Performance đạt yêu cầu
✅ Code review xong
✅ Release build tạo thành công
✅ README hoàn chỉnh
```

---

*← [Architecture](./05_architecture.md) | Tiếp theo: [Testing Plan →](./07_testing_plan.md)*
