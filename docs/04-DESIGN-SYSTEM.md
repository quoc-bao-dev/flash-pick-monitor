---
title: Design System Catalog
version: 1.0.0
updated: 2026-03-29
author: Engineering Team
status: Approved
---

# 🎨 Design System Catalog

Catalog đầy đủ các UI components trong hệ thống thiết kế Flash Pick Monitor. Tất cả components nằm trong `src/common/` và tuân thủ nguyên tắc **stateless**, **CVA variants**, **forwardRef**.

---

## Mục Lục

- [1. Design Tokens](#1-design-tokens)
- [2. UI Components](#2-ui-components)
- [3. Overlay Components](#3-overlay-components)
- [4. Layout Components](#4-layout-components)
- [5. Utilities](#5-utilities)

---

## 1. Design Tokens

### 1.1. Bảng Màu (Color Palette)

| Token | Giá trị | Sử dụng |
|-------|---------|---------|
| `primary` | `#f97316` (orange-500) | CTA buttons, active badges, accent borders |
| `tertiary` | Orange-to-amber gradient | Brand gradient |
| `surface` | `#0F1629` | Main background |
| `surface-container` | `#161D32` | Card/panel background |
| `surface-container-high` | `#1C2541` | Input background, elevated elements |
| `surface-container-highest` | `#222B45` | Focused input background |
| `on-surface` | `#E5E7EB` | Text trên surface |
| `error` | `#ef4444` (red-500) | Destructive actions, error states |
| `success` | `#10b981` (emerald-500) | Positive indicators |
| `warning` | `#fb923c` (orange-400) | Warning states |
| `info` | `#60a5fa` (blue-400) | Informational elements |

### 1.2. Typography

| Font | CSS Variable | Sử dụng |
|------|-------------|---------|
| Space Grotesk | `font-headline` | Headings, KPI values, buttons |
| Inter | `font-label` | Labels, body text, metadata |
| System Mono | `font-mono` | Code, session IDs, timestamps |

### 1.3. Shape & Spacing

| Token | Giá trị | Sử dụng |
|-------|---------|---------|
| Radius default | `rounded-xl` (1rem) | Buttons, inputs, cards |
| Radius large | `rounded-2xl` (1.5rem) | Modals, panels |
| Radius pill | `rounded-full` | Login buttons, tags |
| Glass effect | `glass-panel` class | Panels, modals, cards |
| Shadow primary | `shadow-orange-500/20` | Primary CTA glow |

---

## 2. UI Components

### 2.1. Button

**File:** `common/components/ui/Button.tsx`

Nút hành động với 7 variants và 6 sizes, sử dụng CVA.

#### Props

| Prop | Type | Default | Mô tả |
|------|------|---------|-------|
| `variant` | `'primary' \| 'secondary' \| 'ghost' \| 'destructive' \| 'destructive-subtle' \| 'link' \| 'icon-ghost'` | `'secondary'` | Giao diện nút |
| `size` | `'sm' \| 'md' \| 'lg' \| 'pill' \| 'icon' \| 'icon-lg'` | `'md'` | Kích thước |
| `className` | `string` | — | Override class |
| `...rest` | `ButtonHTMLAttributes` | — | Native button props |

#### Variants

| Variant | Mô tả | Sử dụng |
|---------|-------|---------|
| `primary` | Orange fill, glow shadow | CTA chính (Submit, Create) |
| `secondary` | Surface fill, subtle border | Hành động phụ |
| `ghost` | Transparent, text only | Dismiss, cancel trong modal |
| `destructive` | Red fill, glow shadow | Xóa, terminate |
| `destructive-subtle` | Red outline, subtle | Xóa nhưng ít nhấn mạnh |
| `link` | Text + underline hover | Navigation links |
| `icon-ghost` | Transparent, icon only | Toolbar actions |

#### Ví dụ

```tsx
<Button variant="primary" size="pill">Secure Sign In</Button>
<Button variant="destructive" size="md">Terminate</Button>
<Button variant="icon-ghost" size="icon"><Settings size={16} /></Button>
```

---

### 2.2. Input

**File:** `common/components/ui/Input.tsx`

Text input với support leading/trailing icons, labels, error states.

#### Props

| Prop | Type | Default | Mô tả |
|------|------|---------|-------|
| `variant` | `'default' \| 'pill'` | `'default'` | Hình dạng |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Chiều cao |
| `leadingIcon` | `ReactNode` | — | Icon bên trái |
| `trailingIcon` | `ReactNode` | — | Icon/button bên phải |
| `label` | `string` | — | Label bên trên |
| `error` | `string` | — | Error message bên dưới |
| `wrapperClassName` | `string` | — | Class cho wrapper div |

#### Ví dụ

```tsx
<Input
  type="email"
  variant="pill"
  size="lg"
  label="Terminal Identity"
  placeholder="admin@kinetic.local"
  leadingIcon={<AtSign className="w-5 h-5" />}
  error="Email không hợp lệ"
/>
```

---

### 2.3. Textarea

**File:** `common/components/ui/Input.tsx` (cùng file với Input)

Multi-line text input.

#### Props

| Prop | Type | Default | Mô tả |
|------|------|---------|-------|
| `label` | `string` | — | Label bên trên |
| `error` | `string` | — | Error message |
| `wrapperClassName` | `string` | — | Class cho wrapper |

---

### 2.4. Badge

**File:** `common/components/ui/Badge.tsx`

Label trạng thái nhỏ gọn với dot indicator tùy chọn.

#### Props

| Prop | Type | Default | Mô tả |
|------|------|---------|-------|
| `variant` | `'success' \| 'warning' \| 'error' \| 'info' \| 'neutral' \| 'active' \| 'primary'` | `'neutral'` | Màu sắc |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Kích thước |
| `dot` | `boolean` | `false` | Hiển thị dot phía trước |
| `pulse` | `boolean` | `false` | Animate dot (yêu cầu `dot=true`) |

#### Ví dụ

```tsx
<Badge variant="active" size="sm" dot pulse>Live</Badge>
<Badge variant="error">Offline</Badge>
<Badge variant="success" dot>Online</Badge>
```

---

### 2.5. Checkbox

**File:** `common/components/ui/Checkbox.tsx`

Checkbox và Toggle switch.

#### Props

| Prop | Type | Default | Mô tả |
|------|------|---------|-------|
| `label` | `string` | — | Label text |
| `checked` | `boolean` | — | Trạng thái checked |
| `variant` | `'checkbox' \| 'toggle'` | `'checkbox'` | Hình dạng |
| `onChange` | `ChangeEventHandler` | — | Callback |

---

### 2.6. ProgressBar

**File:** `common/components/ui/ProgressBar.tsx`

Thanh tiến trình với nhiều color presets.

#### Props

| Prop | Type | Default | Mô tả |
|------|------|---------|-------|
| `value` | `number` (0-100) | — | Giá trị phần trăm |
| `label` | `string` | — | Label bên trái |
| `valueLabel` | `string` | `"${value}%"` | Label bên phải |
| `color` | `'primary' \| 'success' \| 'error' \| 'warning' \| 'info'` | `'primary'` | Màu fill |
| `animated` | `boolean` | `false` | Shimmer effect |
| `height` | `'xs' \| 'sm' \| 'md'` | `'xs'` | Chiều cao thanh |
| `showLabel` | `boolean` | `true` | Hiện/ẩn labels |

#### Ví dụ

```tsx
<ProgressBar label="CPU" value={78} color="warning" height="sm" />
<ProgressBar label="Memory" value={45} valueLabel="4.2 GB" color="info" />
```

---

### 2.7. BarChart

**File:** `common/components/ui/BarChart.tsx`

Biểu đồ cột data-driven, hỗ trợ gradient opacity và hover tooltip.

#### Props

| Prop | Type | Default | Mô tả |
|------|------|---------|-------|
| `data` | `number[] \| BarChartDataPoint[]` | — | Dữ liệu chart |
| `height` | `number` (px) | `64` | Chiều cao chart |
| `color` | `'primary' \| 'success' \| 'error' \| 'warning' \| 'info'` | `'primary'` | Màu cột |
| `gap` | `number` (px) | `2` | Khoảng cách giữa cột |
| `showTooltip` | `boolean` | `false` | Hiện tooltip khi hover |
| `gradientOpacity` | `boolean` | `true` | Gradient opacity từ thấp đến cao |

#### DataPoint Type

```typescript
interface BarChartDataPoint {
  value: number;
  label?: string;
}
```

---

### 2.8. MetricCard

**File:** `common/components/ui/MetricCard.tsx`

Card hiển thị KPI metrics với trend indicator.

#### Props

| Prop | Type | Default | Mô tả |
|------|------|---------|-------|
| `label` | `string` | — | Tên metric |
| `value` | `ReactNode` | — | Giá trị hiển thị |
| `trend` | `string` | — | Text trend ("+12%", "-3%") |
| `trendDir` | `'up' \| 'down' \| 'neutral'` | `'neutral'` | Hướng trend |
| `invertTrend` | `boolean` | `false` | Đảo sentiment (up = bad) |
| `size` | `'sm' \| 'md'` | `'md'` | Kích thước card |

---

### 2.9. Các Components Khác

| Component | File | Props chính | Mô tả |
|-----------|------|------------|-------|
| `StatusDot` | `StatusDot.tsx` | `color`, `pulse` | Dot nhỏ hiển thị trạng thái |
| `SectionHeader` | `SectionHeader.tsx` | `title`, `subtitle`, `icon`, `action` | Header cho section |
| `LogStream` | `LogStream.tsx` | `logs[]`, `maxLines` | Terminal-style log viewer |
| `IconBox` | `IconBox.tsx` | `icon`, `color`, `size` | Icon container có background |

---

## 3. Overlay Components

### 3.1. Modal (Compound Component)

**File:** `common/components/overlay/Modal.tsx`

Modal dialog sử dụng compound component pattern với animation enter/exit.

#### Sub-components

| Component | Props chính | Mô tả |
|-----------|------------|-------|
| `Modal.Root` | `isOpen`, `onClose`, `duration` | Container + Portal + Context |
| `Modal.Overlay` | `className` | Backdrop mờ, click để đóng |
| `Modal.Card` | `accentColor`, `maxWidth` | Glass card container |
| `Modal.Header` | `title`, `subtitle`, `icon`, `showClose` | Header với nút close |
| `Modal.Body` | `children`, `className` | Nội dung chính |
| `Modal.Footer` | `children`, `className` | Actions area |

#### Accent Colors

| Color | Border & Glow |
|-------|--------------|
| `'orange'` | Orange border + glow (default) |
| `'red'` | Red border + glow (destructive) |
| `'blue'` | Blue border + glow (informational) |
| `'none'` | White border, no glow |

#### Animation

- **Enter:** opacity 0→1, scale 0.95→1, translateY 4→0 (250ms ease-out)
- **Exit:** opacity 1→0, scale 1→0.95, translateY 0→4 (250ms)
- Overlay: opacity transition riêng biệt

#### Ví dụ

```tsx
<Modal.Root isOpen={isOpen} onClose={() => setIsOpen(false)}>
  <Modal.Overlay />
  <Modal.Card accentColor="orange">
    <Modal.Header
      title="Tạo Worker Mới"
      subtitle="Nhập thông tin worker"
      icon={<IconBox icon={Plus} color="primary" />}
    />
    <Modal.Body>
      <Input label="Worker Name" />
      <Input label="IP Address" />
    </Modal.Body>
    <Modal.Footer>
      <Button variant="primary">Tạo Worker</Button>
      <Button variant="ghost" onClick={() => setIsOpen(false)}>Hủy</Button>
    </Modal.Footer>
  </Modal.Card>
</Modal.Root>
```

---

## 4. Layout Components

### 4.1. DashboardLayout

**File:** `common/layouts/DashboardLayout.tsx`

Layout chính cho dashboard với sidebar collapsible và top bar.

#### Cấu trúc

```
┌─────────────────────────────────────────┐
│ Sidebar (fixed left)     │ Main Content │
│ ┌─────────────────────┐  │              │
│ │ Logo                │  │  ┌────────┐  │
│ │ Nav Items           │  │  │ View   │  │
│ │ • Dashboard         │  │  │Content │  │
│ │ • Sessions          │  │  │        │  │
│ │ • Workers           │  │  └────────┘  │
│ │ • Settings          │  │              │
│ └─────────────────────┘  │              │
└─────────────────────────────────────────┘
```

#### Nav Items

| Label | Route | Icon |
|-------|-------|------|
| Dashboard | `/dashboard` | `LayoutDashboard` |
| Sessions | `/crawl-sessions` | `Database` |
| Workers | `/workers` | `Monitor` |
| Settings | `/settings` | `Settings` |

---

## 5. Utilities

### 5.1. `cn()` — Class Name Merger

**File:** `common/utils/cn.ts`

Kết hợp `clsx` + `tailwind-merge` để merge Tailwind classes an toàn:

```typescript
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

**Khi nào dùng:**
- Merge variant classes với className override
- Conditional classes (object syntax)
- Đảm bảo Tailwind specificity đúng

---

## Tài Liệu Liên Quan

| Tài liệu | Mô tả |
|-----------|--------|
| [Architecture](./02-ARCHITECTURE.md) | Kiến trúc hệ thống |
| [Conventions](./03-CONVENTIONS.md) | Coding rules |
