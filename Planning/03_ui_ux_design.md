# 03 — Thiết Kế UI/UX (Design Specification)

---

## 1. Triết lý thiết kế

> **"Đơn giản nhưng đẳng cấp — mỗi lần nhìn vào là muốn dùng"**

CalcPro áp dụng phong cách **Glassmorphism Dark** — sự kết hợp của:
- 🌑 **Dark Mode** làm nền chủ đạo (giảm mỏi mắt)
- 🪟 **Glass effect** tạo chiều sâu và hiện đại
- ✨ **Neon Accent** làm nổi bật các yếu tố tương tác
- 🎞️ **Micro-animations** tạo sự sống động

---

## 2. Color Palette (Bảng màu)

### 2.1 Background & Surface
```css
--bg-base:        #080810;  /* Nền tối nhất */
--bg-surface:     #0f0f1a;  /* Surface card */
--bg-glass:       rgba(255, 255, 255, 0.04);  /* Glass layer */
--bg-glass-hover: rgba(255, 255, 255, 0.08);  /* Glass hover */
--border-glass:   rgba(255, 255, 255, 0.10);  /* Glass border */
```

### 2.2 Accent Colors
```css
--accent-cyan:    #00d4ff;  /* Primary accent — nút operators */
--accent-purple:  #7b2fff;  /* Secondary accent */
--accent-gradient: linear-gradient(135deg, #00d4ff, #7b2fff);

--accent-orange:  #ff6b35;  /* Nút equals (=) */
--accent-red:     #ff3b5c;  /* Nút clear (C, AC) */
```

### 2.3 Text Colors
```css
--text-primary:   #ffffff;
--text-secondary: rgba(255, 255, 255, 0.60);
--text-muted:     rgba(255, 255, 255, 0.35);
--text-accent:    #00d4ff;
```

### 2.4 Button Colors
```css
/* Số (0-9, .) */
--btn-number-bg:  rgba(255, 255, 255, 0.06);
--btn-number-hover: rgba(255, 255, 255, 0.12);

/* Operators (+, -, ×, ÷) */
--btn-op-bg:      rgba(0, 212, 255, 0.12);
--btn-op-hover:   rgba(0, 212, 255, 0.22);
--btn-op-text:    #00d4ff;

/* Equals = */
--btn-eq-bg:      linear-gradient(135deg, #ff6b35, #ff3b5c);

/* Clear AC/C */
--btn-clear-bg:   rgba(255, 59, 92, 0.15);
--btn-clear-text: #ff3b5c;

/* Scientific functions */
--btn-sci-bg:     rgba(123, 47, 255, 0.12);
--btn-sci-hover:  rgba(123, 47, 255, 0.22);
--btn-sci-text:   #a570ff;
```

---

## 3. Typography (Chữ)

| Vai trò | Font | Weight | Size | Notes |
|---------|------|--------|------|-------|
| Display (kết quả) | JetBrains Mono | 300 | 48–64px | Auto scale khi số dài |
| Expression | JetBrains Mono | 300 | 20px | Màu muted |
| Button label | Inter | 500 | 18–22px | |
| Button label (sci) | Inter | 400 | 14px | |
| History text | JetBrains Mono | 300 | 14px | |

---

## 4. Layout & Sizing

### 4.1 Kích thước cửa sổ
```
Default: 400 × 680 px
Min:     360 × 600 px
Max:     600 × 900 px (khi mở scientific panel)
```

### 4.2 Grid Layout (Standard Mode)
```
┌──────────────────────────────┐
│         DISPLAY AREA         │  height: 160px
│  expression: "2 + 3 × 4"    │
│  result:        "14"         │
├──────────────────────────────┤
│  MEM   MR   MS   M+   M-    │  height: 48px  (5 cols)
├──────────────────────────────┤
│   AC   ±    %    ÷           │  height: 72px  (4 cols)
├──────────────────────────────┤
│   7    8    9    ×           │
├──────────────────────────────┤
│   4    5    6    -           │
├──────────────────────────────┤
│   1    2    3    +           │
├──────────────────────────────┤
│      0      .    =           │  0 chiếm 2 cols
└──────────────────────────────┘
```

### 4.3 Grid Layout (Scientific Mode — mở rộng)
```
┌────────────────────────────────────────────┐
│              DISPLAY AREA                   │
├────────────────────────────────────────────┤
│  sin   cos   tan   log   ln   √   x²  xⁿ  │  8 cols
├────────────────────────────────────────────┤
│  π     e     (     )    ←   AC   ±   %    │
├─────────────────────────┬──────────────────┤
│  [Standard Button Grid] │  [History Panel] │
│  (5 cols)               │  (collapsible)   │
└─────────────────────────┴──────────────────┘
```

---

## 5. Component Design

### 5.1 Display Area
```
┌─────────────────────────────────────────┐
│  ┌─────────────────────────────────┐    │
│  │ expression:  "sin(30) + 2 × π"  │    │
│  └─────────────────────────────────┘    │
│                                         │
│              1.570796...                │← font 56px, glow effect
│                                         │
│  [MEM] [HIST]              [SCI MODE]   │← icon buttons
└─────────────────────────────────────────┘
```
- Hiển thị expression mờ ở trên
- Kết quả to rõ ở dưới
- `text-overflow: ellipsis` từ trái khi số quá dài
- Hiệu ứng **glow** nhẹ trên số kết quả

### 5.2 Button States
```
Normal    → rgba(255,255,255, 0.06)  border: 1px solid rgba(255,255,255,0.08)
Hover     → rgba(255,255,255, 0.12)  scale(1.04)  border: glow
Active    → rgba(255,255,255, 0.18)  scale(0.97)  + ripple animation
Disabled  → opacity: 0.3
```

### 5.3 Ripple Effect (khi nhấn nút)
```css
@keyframes ripple {
  0%   { transform: scale(0); opacity: 0.6; }
  100% { transform: scale(2.5); opacity: 0; }
}
```

### 5.4 History Panel (slide-in từ phải)
```
┌──────────────────┐
│   📋 History      │
├──────────────────┤
│ 2 + 3 × 4 = 14  │
│ sin(90°) = 1     │
│ √144 = 12        │
│ ...              │
├──────────────────┤
│   [Clear All]    │
└──────────────────┘
```

---

## 6. Animations & Transitions

| Animation | Duration | Easing | Mô tả |
|-----------|----------|--------|-------|
| Button hover | 150ms | ease-out | Scale up + glow |
| Button click | 80ms | ease-in | Scale down |
| Ripple | 400ms | ease-out | Lan sóng từ điểm nhấn |
| Number update | 120ms | ease-in-out | Fade + slight slide |
| Panel toggle | 300ms | cubic-bezier(.4,0,.2,1) | Slide in/out |
| Error shake | 500ms | ease-in-out | Rung display khi lỗi |
| Mode switch | 250ms | ease | Expand/collapse layout |

---

## 7. Iconography

- Dùng **Lucide Icons** (lightweight SVG icons)
- Size icon: 18px × 18px
- Color: match với `--text-secondary`

---

## 8. Accessibility

| Yêu cầu | Triển khai |
|---------|-----------|
| Keyboard navigation | Tab order đúng, focus visible |
| ARIA labels | Mỗi button có `aria-label` rõ ràng |
| Color contrast | Tối thiểu WCAG AA (4.5:1) |
| Font size | Không nhỏ hơn 14px |
| Reduced motion | Tắt animation nếu user prefer |

```css
@media (prefers-reduced-motion: reduce) {
  * { animation-duration: 0.01ms !important; }
}
```

---

## 9. Mockup Layout Screens

### Screen 1: Standard Mode
```
╔═══════════════════════════════╗
║  ░░░░░░░░░░░░░░░░░░░░░░░░░░  ║  ← dark bg + subtle grid
║  ┌─────────────────────────┐  ║
║  │  2 + 3 × 4              │  ║  ← expression (muted)
║  │                         │  ║
║  │         14              │  ║  ← result (large, glow)
║  └─────────────────────────┘  ║
║  ┌────┬────┬────┬────┬────┐  ║
║  │MEM │ MR │ MS │ M+ │ M- │  ║  ← memory row
║  ├────┼────┼────┼────┴────┤  ║
║  │ AC │  ± │  % │    ÷    │  ║
║  ├────┼────┼────┼─────────┤  ║
║  │  7 │  8 │  9 │    ×    │  ║
║  ├────┼────┼────┼─────────┤  ║
║  │  4 │  5 │  6 │    -    │  ║
║  ├────┼────┼────┼─────────┤  ║
║  │  1 │  2 │  3 │    +    │  ║
║  ├─────────┼────┼─────────┤  ║
║  │    0    │  . │    =    │  ║
║  └─────────┴────┴─────────┘  ║
╚═══════════════════════════════╝
```

---

*← [Tech Stack](./02_tech_stack.md) | Tiếp theo: [Features & Requirements →](./04_features_requirements.md)*
