---
title: Changelog
version: 1.0.0
updated: 2026-03-29
author: Engineering Team
status: Active
---

# 📋 Changelog

Tất cả thay đổi đáng chú ý trong dự án Flash Pick Monitor được ghi lại trong file này.

Format dựa trên [Keep a Changelog](https://keepachangelog.com/vi/1.1.0/), tuân thủ [Semantic Versioning](https://semver.org/).

---

## [Unreleased]

### Planned
- Tích hợp Tanstack Query + Axios service layer
- Socket.io real-time worker status updates
- Zustand global store (theme, auth)
- Add Worker modal (React Hook Form + Zod)
- Internationalization (next-intl)

---

## [0.3.0] — 2026-03-29

### Added
- **Workers Module**: Trang quản lý worker (`/workers`)
  - Bảng worker với status, resources, network speed
  - `WorkerStatusBadge` — status indicator component
  - `WorkerResourceBars` — CPU/RAM visualization
  - `MiniSparkline` — network speed mini chart
  - `LiveStreamPanel` — live stream viewport với compound stats
  - Fullscreen API integration cho stream viewport
  - Worker selection → live stream panel sticky
- **Design System**: `BarChart` component (data-driven, gradient opacity, hover tooltip)
- **Documentation**: Hệ thống tài liệu kỹ thuật (16 files)

### Changed
- Refactored `DashboardView` NetworkThroughput section để dùng`BarChart` component
- DashboardLayout sidebar thêm Workers navigation link

### Fixed
- Lint warnings: arbitrary Tailwind values trong `Modal`, `Checkbox`, `LogStream`

---

## [0.2.0] — 2026-03-28

### Added
- **Design System Overhaul**:
  - `Button` — 7 variants, 6 sizes (CVA)
  - `Input` — default/pill variants, leading/trailing icons, error state
  - `Textarea` — multi-line input
  - `Badge` — 7 color variants, dot + pulse animation
  - `Checkbox` — checkbox + toggle switch
  - `ProgressBar` — 5 colors, 3 heights, shimmer animation
  - `MetricCard` — KPI display với trend indicator
  - `StatusDot`, `SectionHeader`, `LogStream`, `IconBox`
  - `Modal` compound component (Root, Overlay, Card, Header, Body, Footer)
- **Crawl Sessions Module**: ActionModal, ConfirmationModal
- Stateless `Modal` hệ thống với animation enter/exit

### Changed
- Migrated từ Material Icons sang `lucide-react`
- Login form refactored to use design system components

---

## [0.1.0] — 2026-03-27

### Added
- **Auth Module**: Login page với Kinetic Glass aesthetic
  - `LoginView` — responsive layout với Network Pulse visualization
  - `LoginForm` — email/password + SSO buttons
- **Dashboard Module**: `DashboardView` với 7 metric sections
- **Project Setup**:
  - Next.js 16 App Router + React 19
  - Tailwind CSS v4 + PostCSS
  - `cn()` utility (clsx + tailwind-merge)
  - `DashboardLayout` sidebar navigation
  - Global CSS với `@theme` tokens (Kinetic Glass design system)

---

## Quy Ước Ghi Changelog

| Tag | Mô tả |
|-----|-------|
| `Added` | Tính năng mới |
| `Changed` | Thay đổi tính năng hiện có |
| `Deprecated` | Tính năng sẽ bị xóa |
| `Removed` | Tính năng đã xóa |
| `Fixed` | Sửa lỗi |
| `Security` | Vá lỗ hổng bảo mật |
