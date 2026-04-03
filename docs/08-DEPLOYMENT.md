---
title: Quy Trình Triển Khai
version: 1.0.0
updated: 2026-03-29
author: Engineering Team
status: Approved
---

# 🚀 Quy Trình Triển Khai (Deployment)

Tài liệu mô tả quy trình build, deploy, và vận hành ứng dụng Flash Pick Monitor trên các môi trường khác nhau.

---

## Mục Lục

- [1. Environments](#1-environments)
- [2. Build Process](#2-build-process)
- [3. Docker Deployment](#3-docker-deployment)
- [4. Vercel Deployment](#4-vercel-deployment)
- [5. CI/CD Pipeline](#5-cicd-pipeline)
- [6. Rollback](#6-rollback)
- [7. Monitoring](#7-monitoring)

---

## 1. Environments

| Môi trường | Mục đích | Branch | URL pattern |
|-----------|----------|--------|-------------|
| `development` | Phát triển local | `feature/*`, `fix/*` | `localhost:3000` |
| `staging` | QA / UAT testing | `develop` | `staging.fpm.internal` |
| `production` | Live cho end-users | `main` | `fpm.company.com` |

### Environment Matrix

| Biến | Development | Staging | Production |
|------|-------------|---------|------------|
| `NEXT_PUBLIC_API_URL` | `http://localhost:3001/api` | `https://staging-api.fpm.internal/api` | `https://api.fpm.company.com/api` |
| `NEXT_PUBLIC_WS_URL` | `ws://localhost:3001` | `wss://staging-ws.fpm.internal` | `wss://ws.fpm.company.com` |
| `NODE_ENV` | `development` | `production` | `production` |

---

## 2. Build Process

### 2.1. Local Build

```bash
# Kiểm tra type errors
pnpm tsc --noEmit

# Kiểm tra lint
pnpm lint

# Build production bundle
pnpm build

# Test production locally
pnpm start
```

### 2.2. Build Checklist

- [ ] `pnpm tsc --noEmit` — không có type errors
- [ ] `pnpm lint` — không có lint errors
- [ ] `pnpm build` — build thành công, không warnings nghiêm trọng
- [ ] Test smoke trên `pnpm start` — pages load, navigation hoạt động

---

## 3. Docker Deployment

### 3.1. Dockerfile

```dockerfile
# Stage 1: Dependencies
FROM node:20-alpine AS deps
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY my-app/package.json ./my-app/
RUN pnpm install --frozen-lockfile

# Stage 2: Build
FROM node:20-alpine AS builder
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm --filter my-app build

# Stage 3: Runtime
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/my-app/.next/standalone ./
COPY --from=builder /app/my-app/.next/static ./.next/static
COPY --from=builder /app/my-app/public ./public

EXPOSE 3000
CMD ["node", "server.js"]
```

### 3.2. Docker Compose

```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - '3000:3000'
    env_file:
      - .env.production
    restart: unless-stopped
    healthcheck:
      test: ['CMD', 'wget', '--spider', 'http://localhost:3000']
      interval: 30s
      timeout: 10s
      retries: 3
```

---

## 4. Vercel Deployment

### 4.1. Cấu Hình

```json
// vercel.json
{
  "buildCommand": "pnpm --filter my-app build",
  "outputDirectory": "my-app/.next",
  "installCommand": "pnpm install",
  "framework": "nextjs"
}
```

### 4.2. Deploy Commands

```bash
# Preview deploy (staging)
vercel deploy

# Production deploy
vercel deploy --prod
```

---

## 5. CI/CD Pipeline

### 5.1. GitHub Actions

```yaml
# .github/workflows/ci.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: 'pnpm' }
      - run: pnpm install --frozen-lockfile
      - run: pnpm tsc --noEmit
      - run: pnpm lint
      - run: pnpm build

  deploy-staging:
    needs: quality
    if: github.ref == 'refs/heads/develop'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: # Deploy to staging

  deploy-production:
    needs: quality
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: # Deploy to production
```

---

## 6. Rollback

### 6.1. Vercel Rollback

```bash
# Liệt kê deployments
vercel ls

# Rollback về deployment cụ thể
vercel rollback <deployment-id>
```

### 6.2. Docker Rollback

```bash
# Tag image trước khi deploy
docker tag fpm:latest fpm:v1.2.3

# Rollback
docker stop fpm-current
docker run -d --name fpm-current fpm:v1.2.2
```

### 6.3. Quy Trình Hot-fix

1. Tạo branch `fix/critical-bug` từ `main`
2. Fix → commit → PR → review → merge
3. CI/CD tự động deploy lên production
4. Backport fix sang `develop` nếu cần

---

## 7. Monitoring

### 7.1. Health Check

```bash
# Kiểm tra app đang chạy
curl -f http://localhost:3000/api/health
```

### 7.2. Metrics Cần Theo Dõi

| Metric | Ngưỡng cảnh báo | Tool |
|--------|-----------------|------|
| Response time (p95) | > 2s | APM tool |
| Error rate | > 1% | Sentry |
| CPU usage | > 80% | Infrastructure monitoring |
| Memory usage | > 85% | Infrastructure monitoring |
| Build time | > 5 phút | CI/CD dashboard |

---

## Tài Liệu Liên Quan

| Tài liệu | Mô tả |
|-----------|--------|
| [Configuration](./07-CONFIGURATION.md) | Cấu hình môi trường |
| [Troubleshooting](./09-TROUBLESHOOTING.md) | Xử lý sự cố |
| [Changelog](./10-CHANGELOG.md) | Lịch sử thay đổi |
