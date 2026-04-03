---
title: Configuration & Biến Môi Trường
version: 1.0.0
updated: 2026-03-29
author: Engineering Team
status: Approved
---

# ⚙️ Configuration & Biến Môi Trường

Tài liệu mô tả toàn bộ cấu hình dự án: biến môi trường, Next.js config, TypeScript, ESLint, PostCSS, và package manager.

---

## Mục Lục

- [1. Environment Variables](#1-environment-variables)
- [2. Next.js Configuration](#2-nextjs-configuration)
- [3. TypeScript Configuration](#3-typescript-configuration)
- [4. ESLint Configuration](#4-eslint-configuration)
- [5. PostCSS & Tailwind](#5-postcss--tailwind)
- [6. Package Manager](#6-package-manager)
- [7. Build Scripts](#7-build-scripts)

---

## 1. Environment Variables

### 1.1. Danh Sách Biến Môi Trường

| Biến | Mô tả | Bắt buộc | Default | Scope |
|------|--------|----------|---------|-------|
| `NEXT_PUBLIC_API_URL` | Base URL cho REST API | ✅ | — | Client + Server |
| `NEXT_PUBLIC_WS_URL` | Base URL cho WebSocket (Socket.io) | ✅ | — | Client |
| `NEXT_PUBLIC_APP_NAME` | Tên hiển thị ứng dụng | ❌ | `Flash Pick Monitor` | Client |
| `NEXT_PUBLIC_APP_VERSION` | Version hiển thị | ❌ | Từ `package.json` | Client |
| `API_SECRET_KEY` | Secret key cho server-side API calls | ✅ | — | Server only |
| `DATABASE_URL` | Connection string database | ✅ | — | Server only |
| `JWT_SECRET` | Secret cho JWT token | ✅ | — | Server only |
| `NODE_ENV` | Environment mode | Auto | `development` | Both |

> [!IMPORTANT]
> Biến với prefix `NEXT_PUBLIC_` sẽ được expose cho client-side code. **Không đặt** secrets/credentials vào biến `NEXT_PUBLIC_`.

### 1.2. File .env Template

```env
# ─── Client-side (exposed to browser) ───────────────────
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_WS_URL=ws://localhost:3001

# ─── Server-side only ───────────────────────────────────
API_SECRET_KEY=your-secret-key-here
DATABASE_URL=postgresql://user:password@localhost:5432/fpm
JWT_SECRET=your-jwt-secret
```

### 1.3. Cấu Trúc File .env

| File | Mô tả | Git tracked |
|------|--------|------------|
| `.env` | Defaults (không chứa secrets) | ✅ |
| `.env.local` | Override cục bộ, chứa secrets | ❌ (.gitignore) |
| `.env.development` | Config cho dev mode | ✅ |
| `.env.production` | Config cho production | ✅ |

**Thứ tự ưu tiên (cao → thấp):**
`.env.local` → `.env.development` / `.env.production` → `.env`

---

## 2. Next.js Configuration

**File:** `next.config.ts`

```typescript
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // React Compiler (experimental)
  experimental: {
    reactCompiler: true,
  },

  // Image optimization domains
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.googleusercontent.com' },
    ],
  },

  // Redirect root to dashboard
  async redirects() {
    return [
      { source: '/', destination: '/dashboard', permanent: false },
    ];
  },
};

export default nextConfig;
```

### Các Tùy Chọn Quan Trọng

| Option | Giá trị | Mô tả |
|--------|---------|-------|
| `reactCompiler` | `true` | React Compiler tự động memoize |
| `images.remotePatterns` | Array | Domains cho phép next/image optimize |
| `output` | `'standalone'` (prod) | Docker-friendly build output |

---

## 3. TypeScript Configuration

**File:** `tsconfig.json`

### Path Aliases

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

**Sử dụng:**
```typescript
// Thay vì: import { cn } from '../../../common/utils/cn'
import { cn } from '@/common/utils/cn';
```

### Các Cấu Hình Quan Trọng

| Option | Giá trị | Mô tả |
|--------|---------|-------|
| `strict` | `true` | Strict type checking |
| `noEmit` | `true` | Next.js tự handle compilation |
| `jsx` | `preserve` | Next.js tự handle JSX transform |
| `moduleResolution` | `bundler` | Tương thích Next.js bundler |

---

## 4. ESLint Configuration

**File:** `eslint.config.mjs`

```javascript
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

const __dirname = dirname(fileURLToPath(import.meta.url));
const compat = new FlatCompat({ baseDirectory: __dirname });

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
];

export default eslintConfig;
```

### Rule Sets

| Ruleset | Mục đích |
|---------|----------|
| `next/core-web-vitals` | Performance rules (accessibility, image, font) |
| `next/typescript` | TypeScript specific rules |

### Chạy Lint

```bash
pnpm lint          # Kiểm tra toàn bộ project
```

---

## 5. PostCSS & Tailwind

### PostCSS Config

**File:** `postcss.config.mjs`

```javascript
const config = {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};
export default config;
```

### Tailwind v4

Dự án sử dụng **Tailwind CSS v4** — cấu hình trực tiếp trong CSS:

**File:** `src/app/globals.css`

```css
@import 'tailwindcss';

/* Custom theme tokens */
@theme {
  --color-primary: #f97316;
  --color-surface: #0F1629;
  /* ... */
  --font-headline: 'Space Grotesk', sans-serif;
  --font-label: 'Inter', sans-serif;
}

/* Custom components */
.glass-panel {
  @apply bg-surface-container/60 backdrop-blur-xl;
}
```

> [!NOTE]
> Tailwind v4 không sử dụng `tailwind.config.js`. Tất cả theme config nằm trong CSS `@theme` directive.

---

## 6. Package Manager

### pnpm

**File:** `pnpm-workspace.yaml`

```yaml
packages:
  - 'my-app'
```

### Commands

```bash
pnpm install              # Cài đặt dependencies
pnpm add <package>        # Thêm dependency
pnpm add -D <package>     # Thêm devDependency
pnpm remove <package>     # Xóa dependency
pnpm update               # Update tất cả
```

### Dependencies Chính

| Package | Version | Mục đích |
|---------|---------|----------|
| `next` | 16.2.1 | Framework |
| `react` | 19.2.4 | UI runtime |
| `tailwindcss` | ^4 | Styling |
| `class-variance-authority` | ^0.7.1 | Component variants |
| `clsx` | ^2.1.1 | Class merging |
| `tailwind-merge` | ^3.5.0 | Tailwind class dedup |
| `lucide-react` | ^1.7.0 | Icon library |

---

## 7. Build Scripts

| Script | Command | Mô tả |
|--------|---------|-------|
| `dev` | `next dev` | Development server (hot reload) |
| `build` | `next build` | Production build |
| `start` | `next start` | Production server |
| `lint` | `eslint` | Code quality check |

### Build Output

```bash
pnpm build
# Output:
# ├── .next/static/    ← Static assets (CSS, JS chunks)
# ├── .next/server/    ← Server-side bundles
# └── .next/cache/     ← Build cache
```

---

## Tài Liệu Liên Quan

| Tài liệu | Mô tả |
|-----------|--------|
| [Architecture](./02-ARCHITECTURE.md) | Core config layer |
| [API Integration](./06-API-INTEGRATION.md) | Axios instance config |
| [Deployment](./08-DEPLOYMENT.md) | Production config |
