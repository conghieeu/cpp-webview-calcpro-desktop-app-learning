# 05 — Kiến Trúc Hệ Thống (Architecture)

---

## 1. Tổng quan kiến trúc

CalcPro áp dụng kiến trúc **3-Layer** rõ ràng:

```
┌──────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                  │
│  HTML · CSS · JavaScript (ui/, keyboard, history...)  │
│                                                        │
│  Giao tiếp qua WebView2 JS Bridge (JSON messages)    │
├──────────────────────────────────────────────────────┤
│                   APPLICATION LAYER                    │
│  C++ App class · Window Manager · Bridge Handler     │
│                                                        │
│  Điều phối giữa UI và Engine                         │
├──────────────────────────────────────────────────────┤
│                    DOMAIN LAYER                        │
│  Calculator Engine · Expression Parser                │
│  Math Functions · Memory Manager                     │
└──────────────────────────────────────────────────────┘
```

---

## 2. Data Flow (Luồng dữ liệu)

### 2.1 Luồng tính toán cơ bản

```
User nhấn nút "="
      │
      ▼
[JS: ui.js]
  Lấy expression string
      │
      ▼
[JS: bridge.js]
  window.chrome.webview.postMessage({
    action: "calculate",
    expression: "2 + 3 × 4"
  })
      │
      ▼  (WebView2 IPC)
      │
[C++: Bridge::onMessage()]
  Parse JSON message
      │
      ▼
[C++: Parser::parse("2 + 3 × 4")]
  Tokenize → Shunting-Yard → AST
      │
      ▼
[C++: Calculator::evaluate(AST)]
  Tính kết quả = 14.0
      │
      ▼
[C++: Bridge::sendResult()]
  webview.eval(
    "window.onResult({value: '14', error: null})"
  )
      │
      ▼  (JS callback)
      │
[JS: ui.js onResult()]
  Cập nhật display → "14"
  Lưu vào history
```

### 2.2 Luồng xử lý lỗi

```
Parser / Calculator gặp lỗi
      │
      ▼
Trả về ErrorResult {
  type: "DIVISION_BY_ZERO" | "INVALID_INPUT" | ...,
  message: "Cannot divide by zero"
}
      │
      ▼
Bridge gửi về JS: { error: "Cannot divide by zero" }
      │
      ▼
UI hiển thị "Error" + shake animation
```

---

## 3. Cấu trúc thư mục dự án

```
cpp-webview-gui-main/
│
├── 📁 Planning/                    # Tài liệu kế hoạch (file này)
│
├── 📁 src/                         # C++ source code
│   ├── main.cpp                    # Entry point
│   ├── 📁 app/
│   │   ├── App.hpp                 # Application class
│   │   └── App.cpp
│   ├── 📁 engine/                  # Core calculation engine
│   │   ├── Calculator.hpp
│   │   ├── Calculator.cpp
│   │   ├── Parser.hpp              # Expression parser
│   │   ├── Parser.cpp
│   │   ├── Token.hpp               # Token types
│   │   ├── MathFunctions.hpp       # sin, cos, log, etc.
│   │   └── MathFunctions.cpp
│   ├── 📁 bridge/                  # JS ↔ C++ bridge
│   │   ├── Bridge.hpp
│   │   └── Bridge.cpp
│   └── 📁 utils/
│       ├── Logger.hpp
│       ├── Logger.cpp
│       └── StringUtils.hpp
│
├── 📁 ui/                          # Frontend (HTML/CSS/JS)
│   ├── index.html                  # Main HTML
│   ├── 📁 css/
│   │   ├── main.css                # Global styles, variables
│   │   ├── display.css             # Display area styles
│   │   ├── buttons.css             # Button styles
│   │   ├── history.css             # History panel styles
│   │   └── animations.css          # All animations
│   ├── 📁 js/
│   │   ├── app.js                  # App init
│   │   ├── ui.js                   # UI controller
│   │   ├── bridge.js               # WebView2 bridge
│   │   ├── calculator.js           # JS-side calc (fallback)
│   │   ├── history.js              # History management
│   │   ├── memory.js               # Memory operations
│   │   └── keyboard.js             # Keyboard shortcuts
│   └── 📁 assets/
│       ├── 📁 icons/               # SVG icons
│       └── 📁 fonts/               # (nếu bundle offline)
│
├── 📁 tests/                       # Unit tests
│   ├── 📁 engine/
│   │   ├── calculator_test.cpp
│   │   └── parser_test.cpp
│   └── CMakeLists.txt
│
├── 📁 build/                       # Build output (gitignored)
├── CMakeLists.txt
├── dev.ps1
└── README.md
```

---

## 4. C++ Class Diagram

```
┌─────────────────────────────┐
│          App                │
│ ─────────────────────────── │
│ - window: webview::webview  │
│ - bridge: Bridge*           │
│ ─────────────────────────── │
│ + run()                     │
│ + setupWindow()             │
│ + bindCallbacks()           │
└──────────────┬──────────────┘
               │
               │ owns
               ▼
┌─────────────────────────────┐
│          Bridge             │
│ ─────────────────────────── │
│ - calculator: Calculator    │
│ - window: webview&          │
│ ─────────────────────────── │
│ + onMessage(json)           │
│ + sendResult(result)        │
│ + sendError(error)          │
└──────────────┬──────────────┘
               │
               │ uses
               ▼
┌─────────────────────────────┐        ┌──────────────────────┐
│        Calculator           │        │       Parser          │
│ ─────────────────────────── │ uses   │ ──────────────────── │
│ - memory: double            │───────▶│ + parse(expr): AST   │
│ ─────────────────────────── │        │ - tokenize(expr)     │
│ + calculate(expr): Result   │        │ - shuntingYard()     │
│ + memoryAdd(val)            │        └──────────────────────┘
│ + memorySub(val)            │
│ + memoryRecall(): double    │
│ + memoryClear()             │
└─────────────────────────────┘
```

---

## 5. Expression Parser (Shunting-Yard Algorithm)

### 5.1 Token Types
```cpp
enum class TokenType {
    NUMBER,      // 3.14
    OPERATOR,    // + - * / ^ %
    FUNCTION,    // sin cos tan log ln sqrt
    LPAREN,      // (
    RPAREN,      // )
    CONSTANT,    // pi, e
    END
};
```

### 5.2 Operator Precedence
| Operator | Precedence | Associativity |
|----------|------------|---------------|
| `^` (power) | 4 | Right |
| `×`, `÷`, `%` | 3 | Left |
| `+`, `-` | 2 | Left |
| Functions | 5 | Right |

### 5.3 Ví dụ parse
```
Input:  "2 + 3 × 4"
Tokens: [2, +, 3, ×, 4]

Shunting-Yard output (RPN): [2, 3, 4, ×, +]

Evaluate:
  Stack: [2]
  Stack: [2, 3]
  Stack: [2, 3, 4]
  × → pop 3,4 → push 12 → Stack: [2, 12]
  + → pop 2,12 → push 14 → Stack: [14]
  
Result: 14
```

---

## 6. JS ↔ C++ Message Protocol

### 6.1 JS → C++ (Request)
```json
{
  "action": "calculate",
  "expression": "sin(30) + 2",
  "angleUnit": "degrees"
}
```

```json
{
  "action": "memory",
  "operation": "add",   // "add" | "sub" | "recall" | "clear"
  "value": 42.0
}
```

### 6.2 C++ → JS (Response)
```json
{
  "type": "result",
  "value": "14",
  "fullValue": "14.000000",
  "expression": "2 + 3 × 4"
}
```

```json
{
  "type": "error",
  "code": "DIVISION_BY_ZERO",
  "message": "Không thể chia cho 0"
}
```

```json
{
  "type": "memory",
  "value": 42.0,
  "hasValue": true
}
```

---

## 7. State Management (JS side)

```javascript
// Global app state
const AppState = {
  // Display
  currentExpression: "",      // "2 + 3 ×"
  currentValue: "0",          // "0"
  isResult: false,            // vừa bấm = hay chưa
  hasError: false,

  // Memory
  memoryValue: 0,
  hasMemory: false,

  // UI
  isScientificMode: false,
  isHistoryOpen: false,
  angleUnit: "degrees",       // "degrees" | "radians"

  // History
  history: []                 // [{expression, result, timestamp}]
};
```

---

*← [Features](./04_features_requirements.md) | Tiếp theo: [Timeline →](./06_timeline.md)*
