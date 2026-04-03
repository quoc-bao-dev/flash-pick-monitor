---
title: Convention & Coding Rules
version: 1.0.0
updated: 2026-03-29
author: Engineering Team
status: Approved
---

# 📏 Convention & Coding Rules

Tổng hợp tất cả quy tắc code, convention, và best practices áp dụng trong dự án Flash Pick Monitor. Được biên soạn từ `architecture.md`, Vercel Composition Patterns, Vercel React Best Practices, và Frontend Design Skills.

> [!IMPORTANT]
> Mọi Pull Request **phải** tuân thủ các rules trong tài liệu này. Code review sẽ dựa trên checklist cuối tài liệu.

---

## Mục Lục

- [1. Import & Export](#1-import--export)
- [2. Component Architecture](#2-component-architecture)
- [3. State Management](#3-state-management)
- [4. Data Fetching](#4-data-fetching)
- [5. Form Handling](#5-form-handling)
- [6. Styling](#6-styling)
- [7. Performance](#7-performance)
- [8. Naming Conventions](#8-naming-conventions)
- [9. Git Conventions](#9-git-conventions)
- [10. Code Review Checklist](#10-code-review-checklist)

---

## 1. Import & Export

### 1.1. Absolute Imports

Luôn sử dụng path alias `@/` cho tất cả imports:

```typescript
// ✅ ĐÚNG
import { Button } from '@/common/components/ui/Button';
import { WorkersView } from '@/modules/workers';
import { cn } from '@/common/utils/cn';

// ❌ SAI
import { Button } from '../../../common/components/ui/Button';
import { cn } from '../../utils/cn';
```

**Quy tắc:** Không sử dụng relative path vượt quá 1 cấp (`../`). Dùng `@/` thay thế.

### 1.2. Barrel Exports

Mỗi thư mục `modules/` và `common/components/` **phải** có file `index.ts`:

```typescript
// src/modules/workers/index.ts
export { WorkersView } from './views/WorkersView';

// src/common/components/ui/index.ts
export { Button } from './Button';
export type { ButtonProps } from './Button';
export { Badge } from './Badge';
export type { BadgeProps } from './Badge';
// ...
```

### 1.3. Thứ Tự Import

```typescript
// 1. React & framework
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

// 2. Third-party libraries
import { cva } from 'class-variance-authority';
import { Monitor, Settings } from 'lucide-react';

// 3. Internal: common (design system)
import { Button } from '@/common/components/ui/Button';
import { cn } from '@/common/utils/cn';

// 4. Internal: module-specific
import { WorkerStatusBadge } from '../components/WorkerStatusBadge';
import type { Worker } from '../types';
```

---

## 2. Component Architecture

### 2.1. Stateless UI (Dumb Components)

Tất cả components trong `common/components/` **bắt buộc**:

| Rule | Chi tiết |
|------|----------|
| Không side-effect | Không `useEffect` gọi data, không gọi API |
| `forwardRef` | Tương thích React Hook Form & animation libraries |
| CVA + `cn` | Quản lý variants bằng `class-variance-authority`, merge bằng `cn()` |
| No business logic | Chỉ nhận props, render UI |

```typescript
// ✅ Component chuẩn trong common/
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, size, leadingIcon, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(inputVariants({ variant, size }), className)}
        {...props}
      />
    );
  },
);
```

### 2.2. Composition-First (Không Boolean Props)

> Nguồn: Vercel Composition Patterns

```typescript
// ❌ SAI: Boolean prop proliferation
<Modal showHeader showFooter showClose accentColor="red" size="lg" />

// ✅ ĐÚNG: Compound composition
<Modal.Root isOpen={isOpen} onClose={onClose}>
  <Modal.Overlay />
  <Modal.Card accentColor="red">
    <Modal.Header title="Xác nhận" />
    <Modal.Body>{content}</Modal.Body>
    <Modal.Footer>{actions}</Modal.Footer>
  </Modal.Card>
</Modal.Root>
```

**Quy tắc chính:**

| Rule ID | Rule | Ưu tiên |
|---------|------|---------|
| `architecture-avoid-boolean-props` | Dùng composition thay boolean props | HIGH |
| `architecture-compound-components` | Cấu trúc complex components với Context | HIGH |
| `patterns-explicit-variants` | Tạo variant components thay boolean modes | MEDIUM |
| `patterns-children-over-render-props` | Dùng `children` thay `renderX` props | MEDIUM |

### 2.3. State Decoupling

```typescript
// ❌ SAI: State logic lẫn trong UI
function WorkersTable() {
  const [workers, setWorkers] = useState([]);
  useEffect(() => {
    fetch('/api/workers').then(r => r.json()).then(setWorkers);
  }, []);
  return <table>...</table>;
}

// ✅ ĐÚNG: State tách riêng, UI chỉ nhận props
function WorkersTable({ workers }: { workers: Worker[] }) {
  return <table>...</table>;
}

// State logic ở parent hoặc store
function WorkersView() {
  const { data: workers } = useWorkerListQuery();
  return <WorkersTable workers={workers ?? []} />;
}
```

---

## 3. State Management

### 3.1. Quy Tắc Phạm Vi

| State type | Vị trí | Công cụ |
|-----------|--------|---------|
| Theme, auth, socket status | `core/store/` | Zustand |
| Module filters, selection | `modules/*/store/` | Zustand |
| Component UI state (open/hover) | Trong component | `useState` |
| Form values | Trong form | `useForm` (React Hook Form) |

### 3.2. Anti-patterns

```typescript
// ❌ SAI: Zustand cho state chỉ dùng trong 1 component
const useLocalToggle = create(() => ({ isOpen: false }));

// ✅ ĐÚNG: useState đủ rồi
const [isOpen, setIsOpen] = useState(false);
```

> [!TIP]
> Chỉ dùng Zustand khi state cần truy cập từ **nhiều component không phải cha-con**.

---

## 4. Data Fetching

### 4.1. Service Layer Pattern

```typescript
// ❌ SAI: UI import trực tiếp axios
import axios from 'axios';
const data = await axios.get('/api/workers');

// ✅ ĐÚNG: Qua service layer
// service/worker/api.ts
import { axiosInstance } from '@/core/axios';
export const workerApi = {
  getWorkers: () => axiosInstance.get<Worker[]>('/workers'),
};

// service/worker/query.ts
import { useQuery } from '@tanstack/react-query';
import { workerApi } from './api';
export const useWorkerListQuery = () =>
  useQuery({ queryKey: ['workers'], queryFn: workerApi.getWorkers });
```

### 4.2. Tanstack Query Keys Convention

```typescript
// Recommended key factory pattern
export const workerKeys = {
  all:    ['workers'] as const,
  lists:  () => [...workerKeys.all, 'list'] as const,
  list:   (filters: WorkerFilters) => [...workerKeys.lists(), filters] as const,
  details:  () => [...workerKeys.all, 'detail'] as const,
  detail: (id: string) => [...workerKeys.details(), id] as const,
};
```

---

## 5. Form Handling

### 5.1. Zod Schema Tách File

```typescript
// ❌ SAI: Validate inline trong component
<input required minLength={3} pattern="[a-z]+" />

// ✅ ĐÚNG: Schema riêng
// modules/auth/schema/login.schema.ts
import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(8, 'Mật khẩu tối thiểu 8 ký tự'),
  maintainSession: z.boolean().default(true),
});

export type LoginFormData = z.infer<typeof loginSchema>;
```

### 5.2. React Hook Form Integration

```typescript
// modules/auth/components/LoginForm.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginFormData } from '../schema/login.schema';
import { Input } from '@/common/components/ui/Input';

function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input
        {...register('email')}
        error={errors.email?.message}  // Auto error display
      />
    </form>
  );
}
```

---

## 6. Styling

### 6.1. Core Utilities

| Utility | File | Mô tả |
|---------|------|-------|
| `cn()` | `common/utils/cn.ts` | Merge Tailwind classes (clsx + tailwind-merge) |
| `cva()` | `class-variance-authority` | Quản lý component variants |

```typescript
// Luôn dùng cn() để merge classes
className={cn(buttonVariants({ variant, size }), className)}

// Không dùng string concat
className={`${baseClass} ${extraClass}`}  // ❌
```

### 6.2. Aesthetic Direction

**Kinetic Glass** — design system aesthetic:

| Thuộc tính | Giá trị |
|-----------|---------|
| Theme | Dark mode (background: `#0D1322`) |
| Primary | Orange (`#f97316`) |
| Glass effect | `bg-[...]/60 backdrop-blur-xl` |
| Font headline | Space Grotesk |
| Font body/label | Inter |
| Corner radius | Rounded (1rem default, 2rem lg, full for pills) |
| Shadows | Orange-tinted (`shadow-orange-500/20`) |

### 6.3. Quy Tắc Tailwind

- Sử dụng Tailwind standard utilities, **không** dùng arbitrary values khi có utility tương đương
- Ví dụ: `min-w-14` thay vì `min-w-[3.5rem]`, `duration-250` thay vì `duration-[250ms]`
- Dùng `glass-panel` class cho mọi card/panel (defined trong `globals.css`)

---

## 7. Performance

> Nguồn: Vercel React Best Practices (65 rules, 8 categories)

### 7.1. Critical Rules

| Rule | Mô tả | Ưu tiên |
|------|-------|---------|
| `async-parallel` | Dùng `Promise.all()` cho operations độc lập | CRITICAL |
| `async-suspense-boundaries` | Dùng Suspense để stream content | CRITICAL |
| `bundle-dynamic-imports` | `next/dynamic` cho components nặng | CRITICAL |
| `bundle-defer-third-party` | Load analytics sau hydration | CRITICAL |

### 7.2. Re-render Optimization

```typescript
// ❌ SAI: Inline component định nghĩa bên trong component khác
function ParentComponent() {
  const ChildComponent = () => <div>child</div>;  // Re-created mỗi render
  return <ChildComponent />;
}

// ✅ ĐÚNG: Tách component riêng
function ChildComponent() {
  return <div>child</div>;
}

function ParentComponent() {
  return <ChildComponent />;
}
```

### 7.3. Server Component First

```typescript
// ✅ Đẩy 'use client' xuống component nhỏ nhất
// page.tsx — Server Component (default)
export default function Page() {
  return (
    <div>
      <h1>Static content (server-rendered)</h1>
      <InteractiveWidget />  {/* Chỉ phần này là client */}
    </div>
  );
}
```

---

## 8. Naming Conventions

### 8.1. Files & Directories

| Loại | Convention | Ví dụ |
|------|-----------|-------|
| Component file | PascalCase | `Button.tsx`, `WorkerStatusBadge.tsx` |
| Hook file | camelCase, prefix `use` | `useWorkerList.ts` |
| Store file | camelCase | `workerStore.ts` |
| Type file | camelCase | `types.ts` |
| Schema file | kebab-case + `.schema` | `login.schema.ts` |
| Utility file | camelCase | `cn.ts`, `formatDate.ts` |
| Directory | kebab-case | `crawl-sessions/`, `design-system/` |
| Page file | `page.tsx` (Next.js convention) | `page.tsx` |

### 8.2. Code

| Loại | Convention | Ví dụ |
|------|-----------|-------|
| Component | PascalCase | `MetricCard`, `LiveStreamPanel` |
| Hook | camelCase, prefix `use` | `useWorkerListQuery` |
| Type / Interface | PascalCase | `Worker`, `WorkerStatus`, `ButtonProps` |
| Variable / Function | camelCase | `selectedWorker`, `toggleFullscreen` |
| Constant | UPPER_SNAKE_CASE | `MOCK_WORKERS`, `SYSTEM_LOGS` |
| CSS class (custom) | kebab-case | `glass-panel`, `shimmer-progress` |
| Enum value | UPPER_SNAKE_CASE | `'ONLINE'`, `'OFFLINE'` |

---

## 9. Git Conventions

### 9.1. Branch Naming

```
feature/module-name-description    ← Tính năng mới
fix/module-name-bug-description    ← Sửa lỗi
refactor/module-name-description   ← Refactor code
docs/description                   ← Tài liệu
chore/description                  ← Cấu hình, dependencies
```

### 9.2. Commit Message

Format: `type(scope): mô tả ngắn`

```
feat(workers): add fullscreen stream mode
fix(dashboard): correct ProgressBar animation
refactor(common): migrate Button to CVA variants
docs(architecture): update 5-layer diagram
chore(deps): upgrade Next.js to 16.2.1
```

| Type | Mô tả |
|------|-------|
| `feat` | Tính năng mới |
| `fix` | Sửa lỗi |
| `refactor` | Tái cấu trúc, không đổi behavior |
| `docs` | Tài liệu |
| `style` | Format, không đổi logic |
| `perf` | Cải thiện performance |
| `test` | Thêm/sửa test |
| `chore` | Build, CI, dependencies |

---

## 10. Code Review Checklist

Trước khi approve PR, kiểm tra:

### Architecture
- [ ] Không có business logic trong `app/`
- [ ] Không có API calls trong `common/`
- [ ] Components trong `common/` là stateless
- [ ] Module-specific components ở đúng module, không ở `common/`

### Code Quality
- [ ] Absolute imports (`@/`) thay vì relative paths sâu
- [ ] Barrel exports (`index.ts`) ở đúng nơi
- [ ] Không boolean prop proliferation — dùng composition
- [ ] `forwardRef` cho mọi component trong `common/`

### Styling
- [ ] Dùng `cn()` thay vì string concat class
- [ ] CVA cho variants, không inline ternary phức tạp
- [ ] Không sử dụng arbitrary Tailwind values khi có utility tương đương

### Performance
- [ ] `'use client'` chỉ ở component cần thiết (không ở page level)
- [ ] Không define component bên trong component khác
- [ ] Parallel fetching khi có thể

---

## Tài Liệu Liên Quan

| Tài liệu | Mô tả |
|-----------|--------|
| [Architecture](./02-ARCHITECTURE.md) | Kiến trúc hệ thống |
| [Design System](./04-DESIGN-SYSTEM.md) | Component catalog |
| [State Management](./05-STATE-MANAGEMENT.md) | Zustand strategy |
| [API Integration](./06-API-INTEGRATION.md) | Service layer guide |
