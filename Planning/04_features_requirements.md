# 04 — Tính Năng & Yêu Cầu (Features & Requirements)

---

## 1. Phân loại tính năng

```
Tính năng
├── F1. Tính toán cơ bản        (Must Have ⭐)
├── F2. Tính toán khoa học      (Must Have ⭐)
├── F3. Hiển thị biểu thức      (Must Have ⭐)
├── F4. Lịch sử tính toán       (Should Have ✅)
├── F5. Bộ nhớ (Memory)         (Should Have ✅)
├── F6. Phím tắt                (Should Have ✅)
├── F7. Theme Light/Dark        (Could Have 🔵)
└── F8. Chế độ lập trình        (Won't Have v1 ⬜)
```

---

## 2. User Stories

### F1 — Tính toán cơ bản

| ID | User Story | Acceptance Criteria |
|----|-----------|---------------------|
| US-01 | Là người dùng, tôi muốn thực hiện phép cộng | Nhập `5 + 3`, nhấn `=` → hiện `8` |
| US-02 | Là người dùng, tôi muốn thực hiện phép trừ | Nhập `10 - 4`, nhấn `=` → hiện `6` |
| US-03 | Là người dùng, tôi muốn thực hiện phép nhân | Nhập `6 × 7`, nhấn `=` → hiện `42` |
| US-04 | Là người dùng, tôi muốn thực hiện phép chia | Nhập `15 ÷ 3`, nhấn `=` → hiện `5` |
| US-05 | Là người dùng, tôi muốn tính phần trăm | Nhập `200 × 15%` → hiện `30` |
| US-06 | Là người dùng, tôi muốn đổi dấu số | Nhập `5`, nhấn `±` → hiện `-5` |
| US-07 | Là người dùng, tôi muốn xóa từng ký tự | Nhấn `←` (backspace) → xóa ký tự cuối |
| US-08 | Là người dùng, tôi muốn xóa toàn bộ | Nhấn `AC` → reset về `0` |
| US-09 | Là người dùng, tôi muốn chia cho 0 | Nhập `5 ÷ 0`, nhấn `=` → hiện `Error` |
| US-10 | Là người dùng, tôi muốn tính số thập phân | Nhập `1.5 + 2.7` → hiện `4.2` |

### F2 — Tính toán khoa học

| ID | User Story | Acceptance Criteria |
|----|-----------|---------------------|
| US-11 | Tính sin | `sin(30)` → `0.5` (độ) |
| US-12 | Tính cos | `cos(60)` → `0.5` |
| US-13 | Tính tan | `tan(45)` → `1` |
| US-14 | Tính log cơ số 10 | `log(100)` → `2` |
| US-15 | Tính ln | `ln(e)` → `1` |
| US-16 | Tính căn bậc 2 | `√(144)` → `12` |
| US-17 | Tính bình phương | `5²` → `25` |
| US-18 | Tính lũy thừa | `2^10` → `1024` |
| US-19 | Dùng hằng số π | Nhấn `π` → chèn `3.14159265...` |
| US-20 | Dùng hằng số e | Nhấn `e` → chèn `2.71828182...` |
| US-21 | Dấu ngoặc | Nhập `(2 + 3) × 4` → `20` |
| US-22 | Tính căn bậc n | `∛(27)` → `3` |

### F3 — Hiển thị biểu thức

| ID | User Story | Acceptance Criteria |
|----|-----------|---------------------|
| US-23 | Xem expression đang nhập | Phần trên hiển thị `2 + 3 ×` khi đang nhập |
| US-24 | Xem kết quả ngay | Phần dưới luôn hiện preview kết quả (nếu valid) |
| US-25 | Số quá dài | Font tự scale nhỏ lại, không bị cắt |
| US-26 | Kết quả quá dài | Hiện `1.234...e+15` dạng scientific notation |

### F4 — Lịch sử tính toán

| ID | User Story | Acceptance Criteria |
|----|-----------|---------------------|
| US-27 | Xem lịch sử | Mở panel lịch sử bằng icon/button |
| US-28 | Tái sử dụng kết quả | Click vào entry lịch sử → điền vào display |
| US-29 | Xóa lịch sử | Nút "Clear All" xóa toàn bộ lịch sử |
| US-30 | Giới hạn lịch sử | Lưu tối đa 50 entries, cũ hơn tự xóa |
| US-31 | Persist lịch sử | Lịch sử không mất khi đóng app (localStorage) |

### F5 — Bộ nhớ (Memory)

| ID | User Story | Acceptance Criteria |
|----|-----------|---------------------|
| US-32 | Lưu vào bộ nhớ | `M+` cộng vào bộ nhớ; `MS` thay thế |
| US-33 | Đọc bộ nhớ | `MR` hiện giá trị bộ nhớ vào display |
| US-34 | Trừ bộ nhớ | `M-` trừ giá trị hiện tại khỏi bộ nhớ |
| US-35 | Xóa bộ nhớ | `MC` reset bộ nhớ về 0 |
| US-36 | Indicator bộ nhớ | Khi bộ nhớ ≠ 0, hiện chữ `M` nhỏ trên display |

### F6 — Phím tắt bàn phím

| Phím | Chức năng |
|------|-----------|
| `0`–`9` | Nhập số |
| `.` hoặc `,` | Dấu thập phân |
| `+`, `-`, `*`, `/` | Toán tử |
| `Enter` hoặc `=` | Tính kết quả |
| `Backspace` | Xóa ký tự cuối |
| `Escape` | Clear all |
| `s` | sin |
| `c` | cos |
| `t` | tan |
| `l` | log |
| `n` | ln |
| `q` | √ (square root) |
| `p` | π |
| `(`, `)` | Dấu ngoặc |
| `h` | Toggle history |
| `m` | Toggle scientific mode |

---

## 3. Non-Functional Requirements

### 3.1 Performance
| Chỉ số | Yêu cầu |
|--------|---------|
| Thời gian tính toán | < 10ms cho tất cả operations |
| UI render lag | < 16ms (60 FPS) |
| Startup time | < 1.5 giây |
| Memory usage | < 100 MB |

### 3.2 Reliability
- Không crash với bất kỳ input hợp lệ nào
- Xử lý gracefully các edge cases: `0/0`, `√(-1)`, `log(0)`, overflow

### 3.3 Usability
- New user có thể tính được ngay, không cần hướng dẫn
- Phím tắt hiển thị trong tooltip

### 3.4 Maintainability
- Code coverage tối thiểu 80%
- Mỗi function không quá 50 dòng
- Tất cả public functions có documentation

---

## 4. Edge Cases cần xử lý

```
Toán học:
├── Chia cho 0:          5 ÷ 0      → "Error: Division by Zero"
├── Căn số âm:          √(-1)      → "Error: Invalid Input"  
├── Log số âm/0:        log(-1)    → "Error: Invalid Input"
├── Overflow:           1e308 × 10 → "Infinity"
├── Underflow:          1e-308 ÷ 10→ "0" (graceful)
└── Tan(90°):           tan(90)    → "Error: Undefined"

Input:
├── Nhập nhiều dấu chấm:  1.2.3   → chỉ nhận một dấu chấm
├── Bắt đầu bằng operator: × 5   → tự thêm 0 trước
├── Ngoặc không đóng:  (2 + 3     → tự đóng khi nhấn =
└── Expression rỗng:   [nhấn =]  → không làm gì
```

---

## 5. Acceptance Test Summary

| Test Group | Số test cases | Priority |
|------------|--------------|---------|
| Basic arithmetic | 20 | Critical |
| Scientific functions | 25 | High |
| Edge cases & errors | 15 | High |
| Memory operations | 10 | Medium |
| Keyboard shortcuts | 20 | Medium |
| UI interactions | 15 | Medium |
| History & persistence | 10 | Low |
| **Tổng** | **115** | |

---

*← [UI/UX Design](./03_ui_ux_design.md) | Tiếp theo: [Architecture →](./05_architecture.md)*
