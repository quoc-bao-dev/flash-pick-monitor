---
title: Quy Chuẩn Tài Liệu Dự Án
version: 1.0.0
updated: 2026-03-29
author: Engineering Team
status: Approved
---

# 📐 Quy Chuẩn Tài Liệu Dự Án

Tài liệu này quy định cấu trúc, định dạng, và quy tắc viết cho **toàn bộ** tài liệu kỹ thuật trong dự án Flash Pick Monitor.

> [!IMPORTANT]
> Mọi tài liệu mới **bắt buộc** tuân thủ template này. Pull Request chứa docs không đúng format sẽ bị reject.

---

## 1. Cấu Trúc Thư Mục

```text
docs/
├── 00-DOCUMENT-TEMPLATE.md        ← File này: quy chuẩn viết docs
├── 01-OVERVIEW.md                 ← Tổng quan dự án
├── 02-ARCHITECTURE.md             ← Kiến trúc hệ thống
├── 03-CONVENTIONS.md              ← Convention & coding rules
├── 04-DESIGN-SYSTEM.md            ← Design system catalog
├── 05-STATE-MANAGEMENT.md         ← Chiến lược state management
├── 06-API-INTEGRATION.md          ← Hướng dẫn tích hợp API
├── 07-CONFIGURATION.md            ← Cấu hình môi trường
├── 08-DEPLOYMENT.md               ← Quy trình triển khai
├── 09-TROUBLESHOOTING.md          ← FAQ & xử lý sự cố
├── 10-CHANGELOG.md                ← Lịch sử thay đổi
└── modules/
    ├── MODULE-TEMPLATE.md         ← Template cho feature spec
    ├── auth.md
    ├── dashboard.md
    ├── crawl-sessions.md
    └── workers.md
```

**Quy tắc đặt tên:**

| Loại | Format | Ví dụ |
|------|--------|-------|
| Doc chính | `XX-TEN-FILE.md` (XX = số thứ tự) | `03-CONVENTIONS.md` |
| Module spec | `ten-module.md` (kebab-case) | `crawl-sessions.md` |
| Template | `*-TEMPLATE.md` (UPPER) | `MODULE-TEMPLATE.md` |

---

## 2. Frontmatter Bắt Buộc

Mỗi file doc **phải** bắt đầu bằng YAML frontmatter:

```yaml
---
title: Tên Tài Liệu Đầy Đủ
version: 1.0.0          # SemVer: major.minor.patch
updated: YYYY-MM-DD     # Lần cập nhật cuối
author: Tên người viết / Team
status: Draft | Review | Approved | Deprecated
---
```

| Trường | Mô tả | Bắt buộc |
|--------|--------|----------|
| `title` | Tiêu đề đầy đủ, rõ ràng | ✅ |
| `version` | Semantic Versioning | ✅ |
| `updated` | Ngày cập nhật cuối cùng (ISO 8601) | ✅ |
| `author` | Tác giả hoặc team chịu trách nhiệm | ✅ |
| `status` | Trạng thái hiện tại của tài liệu | ✅ |

---

## 3. Cấu Trúc Nội Dung Chuẩn

Mỗi tài liệu tuân theo outline sau:

```markdown
# [Emoji] Tiêu Đề Chính (H1 — duy nhất 1 lần)

Mô tả ngắn 1-2 câu về mục đích tài liệu.

---

## Mục Lục (nếu doc > 100 dòng)

- [Section 1](#section-1)
- [Section 2](#section-2)

---

## 1. Section Heading (H2 — đánh số thứ tự)

### 1.1. Sub-section (H3)

Nội dung...

---

## Tài Liệu Liên Quan

| Tài liệu | Mô tả |
|-----------|--------|
| [Architecture](./02-ARCHITECTURE.md) | Kiến trúc hệ thống |
```

---

## 4. Quy Tắc Viết

### 4.1. Ngôn Ngữ

- **Ngôn ngữ chính:** Tiếng Việt (nội dung chính, mô tả, giải thích)
- **Giữ nguyên tiếng Anh:** thuật ngữ kỹ thuật, tên package, code snippet, tên file, tên component

### 4.2. Tone & Voice

- Sử dụng văn phong kỹ thuật, ngắn gọn, rõ ràng
- Ưu tiên bullet points thay vì đoạn văn dài
- Dùng bảng khi so sánh > 3 items

### 4.3. Tham Chiếu Code

- Tên file/thư mục: đặt trong backtick — `src/common/utils/cn.ts`
- Tên component/function: đặt trong backtick — `Button`, `useModalContext()`
- Code block: **luôn** chỉ định language — ` ```typescript `
- Tham chiếu file khác: dùng relative link — `[Architecture](./02-ARCHITECTURE.md)`

### 4.4. Diagram

- Sử dụng **Mermaid** cho flowchart, sequence diagram, class diagram
- Đặt trong fenced code block: ` ```mermaid `
- Quote tất cả label chứa ký tự đặc biệt

### 4.5. Alerts

Sử dụng GitHub-style alerts cho thông tin quan trọng:

```markdown
> [!NOTE]
> Thông tin bổ sung, context hữu ích

> [!TIP]
> Best practice, gợi ý tối ưu

> [!IMPORTANT]
> Yêu cầu bắt buộc, thông tin cần thiết

> [!WARNING]
> Breaking change, vấn đề tương thích

> [!CAUTION]
> Hành động rủi ro cao, có thể gây mất dữ liệu
```

---

## 5. Quy Tắc Versioning

| Thay đổi | Version bump | Ví dụ |
|----------|-------------|-------|
| Sửa typo, format | Patch (`x.x.+1`) | 1.0.0 → 1.0.1 |
| Thêm section, cập nhật nội dung | Minor (`x.+1.0`) | 1.0.1 → 1.1.0 |
| Viết lại hoàn toàn, đổi cấu trúc | Major (`+1.0.0`) | 1.1.0 → 2.0.0 |

Khi cập nhật doc:
1. Bump version trong frontmatter
2. Cập nhật trường `updated`
3. Ghi lại thay đổi trong `10-CHANGELOG.md`

---

## 6. Checklist Review

Trước khi merge doc mới, kiểm tra:

- [ ] Có YAML frontmatter đúng format
- [ ] Duy nhất 1 heading H1
- [ ] Heading hierarchy đúng (H1 → H2 → H3, không skip)
- [ ] Code blocks có language specifier
- [ ] Tất cả internal links hoạt động
- [ ] Không có nội dung placeholder ("TODO", "TBD")
- [ ] Thuật ngữ kỹ thuật giữ nguyên tiếng Anh
- [ ] Đã cập nhật `10-CHANGELOG.md`

---

## Tài Liệu Liên Quan

| Tài liệu | Mô tả |
|-----------|--------|
| [Overview](./01-OVERVIEW.md) | Tổng quan dự án |
| [Changelog](./10-CHANGELOG.md) | Lịch sử thay đổi |
