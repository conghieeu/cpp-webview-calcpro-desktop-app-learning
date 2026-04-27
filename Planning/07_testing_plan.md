# 07 — Kế Hoạch Kiểm Thử (Testing Plan)

---

## 1. Chiến lược kiểm thử

```
Testing Pyramid
                    ┌───────┐
                    │  E2E  │  ← Ít nhất (UI automation)
                   ┌┴───────┴┐
                   │Integration│ ← Vừa (Bridge JS↔C++)
                  ┌┴──────────┴┐
                  │  Unit Tests  │ ← Nhiều nhất (C++ engine)
                 └──────────────┘
```

| Level | Số lượng | Tool | Chạy khi |
|-------|---------|------|---------|
| Unit | ~80 cases | Google Test (gtest) | Mỗi commit |
| Integration | ~20 cases | Manual + Script | Mỗi sprint |
| E2E / UI | ~15 cases | Manual | Trước release |

---

## 2. Unit Tests — C++ Engine

### 2.1 Calculator — Basic Arithmetic

```cpp
// File: tests/engine/calculator_test.cpp

TEST(BasicArithmetic, Addition) {
    Calculator calc;
    EXPECT_DOUBLE_EQ(calc.calculate("2 + 3"), 5.0);
    EXPECT_DOUBLE_EQ(calc.calculate("0 + 0"), 0.0);
    EXPECT_DOUBLE_EQ(calc.calculate("-5 + 3"), -2.0);
    EXPECT_DOUBLE_EQ(calc.calculate("1.5 + 2.5"), 4.0);
}

TEST(BasicArithmetic, Subtraction) {
    Calculator calc;
    EXPECT_DOUBLE_EQ(calc.calculate("10 - 4"), 6.0);
    EXPECT_DOUBLE_EQ(calc.calculate("0 - 5"), -5.0);
    EXPECT_DOUBLE_EQ(calc.calculate("-3 - -2"), -1.0);
}

TEST(BasicArithmetic, Multiplication) {
    Calculator calc;
    EXPECT_DOUBLE_EQ(calc.calculate("6 * 7"), 42.0);
    EXPECT_DOUBLE_EQ(calc.calculate("0 * 999"), 0.0);
    EXPECT_DOUBLE_EQ(calc.calculate("-3 * 4"), -12.0);
}

TEST(BasicArithmetic, Division) {
    Calculator calc;
    EXPECT_DOUBLE_EQ(calc.calculate("15 / 3"), 5.0);
    EXPECT_DOUBLE_EQ(calc.calculate("1 / 4"), 0.25);
    EXPECT_DOUBLE_EQ(calc.calculate("7 / 2"), 3.5);
}

TEST(BasicArithmetic, OperatorPrecedence) {
    Calculator calc;
    EXPECT_DOUBLE_EQ(calc.calculate("2 + 3 * 4"), 14.0);
    EXPECT_DOUBLE_EQ(calc.calculate("10 - 2 * 3"), 4.0);
    EXPECT_DOUBLE_EQ(calc.calculate("(2 + 3) * 4"), 20.0);
    EXPECT_DOUBLE_EQ(calc.calculate("2 ^ 3 + 1"), 9.0);
}
```

### 2.2 Scientific Functions

```cpp
TEST(ScientificFunctions, Trigonometry_Degrees) {
    Calculator calc;
    calc.setAngleUnit(AngleUnit::DEGREES);
    EXPECT_NEAR(calc.calculate("sin(0)"),   0.0, 1e-10);
    EXPECT_NEAR(calc.calculate("sin(30)"),  0.5, 1e-10);
    EXPECT_NEAR(calc.calculate("sin(90)"),  1.0, 1e-10);
    EXPECT_NEAR(calc.calculate("cos(0)"),   1.0, 1e-10);
    EXPECT_NEAR(calc.calculate("cos(60)"),  0.5, 1e-10);
    EXPECT_NEAR(calc.calculate("cos(90)"),  0.0, 1e-10);
    EXPECT_NEAR(calc.calculate("tan(45)"),  1.0, 1e-10);
}

TEST(ScientificFunctions, Logarithm) {
    Calculator calc;
    EXPECT_NEAR(calc.calculate("log(100)"),  2.0,  1e-10);
    EXPECT_NEAR(calc.calculate("log(1)"),    0.0,  1e-10);
    EXPECT_NEAR(calc.calculate("ln(1)"),     0.0,  1e-10);
    EXPECT_NEAR(calc.calculate("ln(e)"),     1.0,  1e-10);
}

TEST(ScientificFunctions, PowerAndRoot) {
    Calculator calc;
    EXPECT_NEAR(calc.calculate("sqrt(144)"), 12.0, 1e-10);
    EXPECT_NEAR(calc.calculate("sqrt(2)"),   1.41421356, 1e-7);
    EXPECT_NEAR(calc.calculate("2 ^ 10"),    1024.0, 1e-10);
    EXPECT_NEAR(calc.calculate("5 ^ 2"),     25.0,  1e-10);
}
```

### 2.3 Edge Cases & Errors

```cpp
TEST(ErrorHandling, DivisionByZero) {
    Calculator calc;
    auto result = calc.calculateWithError("5 / 0");
    EXPECT_TRUE(result.hasError);
    EXPECT_EQ(result.errorCode, ErrorCode::DIVISION_BY_ZERO);
}

TEST(ErrorHandling, SqrtOfNegative) {
    Calculator calc;
    auto result = calc.calculateWithError("sqrt(-1)");
    EXPECT_TRUE(result.hasError);
    EXPECT_EQ(result.errorCode, ErrorCode::INVALID_INPUT);
}

TEST(ErrorHandling, LogOfZero) {
    Calculator calc;
    auto result = calc.calculateWithError("log(0)");
    EXPECT_TRUE(result.hasError);
}

TEST(ErrorHandling, LogOfNegative) {
    Calculator calc;
    auto result = calc.calculateWithError("log(-5)");
    EXPECT_TRUE(result.hasError);
}

TEST(EdgeCases, Overflow) {
    Calculator calc;
    auto result = calc.calculateWithError("1e308 * 10");
    EXPECT_TRUE(result.isInfinity || result.hasError);
}
```

### 2.4 Memory Operations

```cpp
TEST(Memory, BasicOperations) {
    Calculator calc;
    calc.memoryStore(42.0);
    EXPECT_DOUBLE_EQ(calc.memoryRecall(), 42.0);
    EXPECT_TRUE(calc.hasMemory());

    calc.memoryAdd(8.0);
    EXPECT_DOUBLE_EQ(calc.memoryRecall(), 50.0);

    calc.memorySub(10.0);
    EXPECT_DOUBLE_EQ(calc.memoryRecall(), 40.0);

    calc.memoryClear();
    EXPECT_FALSE(calc.hasMemory());
    EXPECT_DOUBLE_EQ(calc.memoryRecall(), 0.0);
}
```

---

## 3. Integration Tests — Bridge

### 3.1 Test cases thủ công

| TC-ID | Mô tả | Input JSON | Expected Output |
|-------|-------|-----------|----------------|
| IT-01 | Calculate basic | `{action:"calculate", expression:"2+2"}` | `{value:"4"}` |
| IT-02 | Calculate error | `{action:"calculate", expression:"1/0"}` | `{error:"DIVISION_BY_ZERO"}` |
| IT-03 | Memory store | `{action:"memory", op:"store", value:42}` | `{type:"memory", value:42, hasValue:true}` |
| IT-04 | Memory recall | `{action:"memory", op:"recall"}` | `{type:"memory", value:42}` |
| IT-05 | Memory clear | `{action:"memory", op:"clear"}` | `{type:"memory", value:0, hasValue:false}` |
| IT-06 | Sin degrees | `{action:"calculate", expression:"sin(90)", angleUnit:"degrees"}` | `{value:"1"}` |
| IT-07 | Invalid JSON | `{action:"unknown"}` | `{error:"UNKNOWN_ACTION"}` |

---

## 4. UI Tests (Thủ công)

### 4.1 Checklist giao diện

**Display Area:**
- [ ] Số `0` hiện mặc định khi mở app
- [ ] Expression hiện đúng ở hàng trên
- [ ] Kết quả hiện to, đúng ở hàng dưới
- [ ] Auto-scale font khi số dài hơn 9 ký tự
- [ ] Hiệu ứng glow trên kết quả
- [ ] Shake animation khi có lỗi

**Buttons:**
- [ ] Hover: scale + border glow
- [ ] Click: scale down + ripple effect
- [ ] Số màu trắng, operator màu cyan, equals màu orange, clear màu đỏ
- [ ] Scientific buttons màu tím

**Layouts:**
- [ ] Standard mode: 4 cột, 7 hàng
- [ ] Scientific mode: mở thêm panel trên
- [ ] History panel: slide in từ phải

**Responsive:**
- [ ] Không bị overflow ở 400×680
- [ ] Không bị overflow ở 360×600
- [ ] Scale đẹp ở 600×900

### 4.2 Keyboard Test Checklist
- [ ] Số 0–9 nhập được
- [ ] `+`, `-`, `*`, `/` gọi đúng operator
- [ ] `Enter` = nhấn `=`
- [ ] `Backspace` = xóa 1 ký tự
- [ ] `Esc` = AC
- [ ] `h` toggle history
- [ ] `s` nhập `sin(`

---

## 5. Performance Tests

| Test | Method | Target | Pass/Fail |
|------|--------|--------|-----------|
| Startup time | Đo từ launch đến UI ready | < 1.5s | ⬜ |
| Calculate latency | 1000 phép tính liên tiếp | < 10ms/calc | ⬜ |
| Memory leak | Chạy 30 phút, monitor RAM | Không tăng quá 10MB | ⬜ |
| UI frame rate | Chrome DevTools | > 55 FPS khi animate | ⬜ |
| History render | 50 entries, mở panel | < 100ms | ⬜ |

---

## 6. Regression Test Checklist (trước mỗi release)

```
☐ Build thành công (0 warnings)
☐ Tất cả unit tests pass
☐ Các phép tính cơ bản đúng
☐ Tất cả scientific functions đúng
☐ Lỗi hiển thị đúng (không crash)
☐ Bộ nhớ hoạt động đúng
☐ Lịch sử lưu và load đúng
☐ Phím tắt hoạt động đúng
☐ Startup < 1.5s
☐ UI không có lỗi layout
☐ App không crash sau 30 phút
```

---

## 7. Bug Tracking Template

Khi phát hiện bug, ghi theo mẫu sau:

```markdown
## BUG-XXX: [Tiêu đề bug]

**Severity:** Critical / High / Medium / Low
**Sprint:** Sprint X
**Status:** Open / In Progress / Fixed / Closed

### Mô tả
[Mô tả rõ bug là gì]

### Các bước tái hiện
1. Mở app
2. Nhập...
3. Nhấn...

### Kết quả thực tế
[Điều gì xảy ra]

### Kết quả kỳ vọng
[Điều gì lẽ ra phải xảy ra]

### Screenshot / Log
[Đính kèm nếu có]
```

---

*← [Timeline](./06_timeline.md) | [Quay lại Index →](./README.md)*
