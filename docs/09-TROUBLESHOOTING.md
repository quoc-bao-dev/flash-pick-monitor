---
title: Troubleshooting & FAQ
version: 1.0.0
updated: 2026-03-29
author: Engineering Team
status: Approved
---

# 🔧 Troubleshooting & FAQ

Tài liệu tổng hợp các lỗi thường gặp, cách khắc phục, và câu hỏi thường gặp khi phát triển Flash Pick Monitor.

---

## Mục Lục

- [1. Lỗi Development](#1-lỗi-development)
- [2. Lỗi Build](#2-lỗi-build)
- [3. Lỗi Runtime](#3-lỗi-runtime)
- [4. Lỗi Styling](#4-lỗi-styling)
- [5. FAQ](#5-faq)

---

## 1. Lỗi Development

### 1.1. `pnpm install` thất bại

**Triệu chứng:** Lỗi peer dependency hoặc lockfile conflict.

**Giải pháp:**
```bash
# Xóa cache và cài lại
rm -rf node_modules .pnpm-store
pnpm install
```

### 1.2. Dev server không start

**Triệu chứng:** `pnpm dev` báo lỗi port hoặc module not found.

**Giải pháp:**
```bash
# Kiểm tra port 3000 có bị chiếm
npx kill-port 3000

# Xóa cache Next.js
rm -rf .next
pnpm dev
```

### 1.3. Hot Reload không hoạt động

**Triệu chứng:** Thay đổi code nhưng browser không cập nhật.

**Giải pháp:**
1. Kiểm tra file có đúng trong `src/` không (Next.js chỉ watch thư mục src)
2. Xóa `.next` cache: `rm -rf .next && pnpm dev`
3. Kiểm tra có lỗi TypeScript chặn compilation không

---

## 2. Lỗi Build

### 2.1. TypeScript errors

**Triệu chứng:** `Type error: Cannot find module '@/...'`

**Giải pháp:**
1. Kiểm tra `tsconfig.json` có path alias đúng:
   ```json
   { "paths": { "@/*": ["./src/*"] } }
   ```
2. Restart TypeScript server: `Ctrl+Shift+P` → "TypeScript: Restart TS Server"

### 2.2. ESLint arbitrary value warnings

**Triệu chứng:** Warning cho Tailwind arbitrary values.

**Giải pháp:** Thay arbitrary values bằng standard utilities:
```typescript
// ❌ text-[10px] → ✅ Dùng design token hoặc chuẩn Tailwind
// ❌ min-w-[3.5rem] → ✅ min-w-14
// ❌ duration-[250ms] → ✅ duration-250
```

### 2.3. Build out of memory

**Triệu chứng:** `JavaScript heap out of memory`

**Giải pháp:**
```bash
NODE_OPTIONS="--max-old-space-size=4096" pnpm build
```

---

## 3. Lỗi Runtime

### 3.1. `useContext` trả về null

**Triệu chứng:** `Modal compound components must be used within <Modal.Root>`

**Nguyên nhân:** Component con dùng bên ngoài `Modal.Root` provider.

**Giải pháp:** Đảm bảo cấu trúc compound đúng:
```tsx
<Modal.Root isOpen={isOpen} onClose={onClose}>
  <Modal.Overlay />
  <Modal.Card>
    <Modal.Header title="..." />  {/* Phải nằm trong Root */}
  </Modal.Card>
</Modal.Root>
```

### 3.2. Hydration mismatch

**Triệu chứng:** `Text content does not match server-rendered HTML`

**Nguyên nhân:** Client-only data (time, random, localStorage) render khác server.

**Giải pháp:**
```typescript
// Dùng useEffect để delay client-only values
const [mounted, setMounted] = useState(false);
useEffect(() => setMounted(true), []);
if (!mounted) return null; // hoặc skeleton
```

### 3.3. Fullscreen API không hoạt động

**Triệu chứng:** `requestFullscreen()` bị reject.

**Nguyên nhân:** Browser yêu cầu user gesture (click) để trigger fullscreen.

**Giải pháp:** Đảm bảo `requestFullscreen()` được gọi trong event handler:
```typescript
// ✅ Trong onClick handler
<Button onClick={toggleFullscreen}>Fullscreen</Button>

// ❌ Không gọi trong useEffect
useEffect(() => { ref.current?.requestFullscreen(); }, []); // Bị block!
```

---

## 4. Lỗi Styling

### 4.1. Tailwind classes không hoạt động

**Triệu chứng:** Class Tailwind không apply style.

**Giải pháp:**
1. Kiểm tra `globals.css` có `@import 'tailwindcss'`
2. Kiểm tra PostCSS config: `@tailwindcss/postcss` plugin
3. Xóa cache: `rm -rf .next && pnpm dev`

### 4.2. `glass-panel` class không hoạt động

**Nguyên nhân:** Custom class chưa define trong `globals.css`.

**Giải pháp:** Kiểm tra `globals.css` có:
```css
.glass-panel {
  @apply bg-surface-container/60 backdrop-blur-xl;
}
```

### 4.3. Tailwind merge conflict

**Triệu chứng:** Override class bị ghi đè bởi base class.

**Giải pháp:** Luôn dùng `cn()` thay vì string concat:
```typescript
// ✅ cn() xử lý merge đúng specificity
className={cn(baseClasses, overrideClasses)}

// ❌ String concat không resolve conflicts
className={`${baseClasses} ${overrideClasses}`}
```

---

## 5. FAQ

### Q: Khi nào tạo component mới trong `common/` vs `modules/`?

**A:** 
- `common/`: Component tái sử dụng ở ≥ 2 modules (Button, Input, ProgressBar)
- `modules/`: Component chỉ dùng trong 1 module (WorkerStatusBadge, LoginForm)

### Q: Có nên dùng `forwardRef` cho mọi component?

**A:** 
- `common/components/`: **Bắt buộc** (tương thích React Hook Form)
- `modules/components/`: Tùy chọn (chỉ cần nếu dùng với form hoặc animation lib)

### Q: Zustand vs useState — ranh giới ở đâu?

**A:** Dùng Zustand khi state cần share giữa **nhiều component không phải cha-con**. Nếu state chỉ nằm trong 1 component hoặc có thể truyền qua props 1-2 cấp, dùng `useState`.

### Q: Tại sao không dùng CSS Modules?

**A:** Dự án sử dụng Tailwind CSS v4 + CVA để:
- Consistency qua design tokens
- Type-safe variants (CVA)
- Utility-first = less custom CSS = less merge conflicts

### Q: Import từ barrel (`index.ts`) hay trực tiếp file?

**A:** 
- **Consumer code** (views, pages): Import từ barrel — `import { Button } from '@/common/components/ui'`
- **Internal code** (cùng thư mục): Import trực tiếp — `import { cn } from '../utils/cn'`

---

## Tài Liệu Liên Quan

| Tài liệu | Mô tả |
|-----------|--------|
| [Configuration](./07-CONFIGURATION.md) | Cấu hình môi trường |
| [Conventions](./03-CONVENTIONS.md) | Coding rules |
| [Deployment](./08-DEPLOYMENT.md) | Quy trình deploy |
