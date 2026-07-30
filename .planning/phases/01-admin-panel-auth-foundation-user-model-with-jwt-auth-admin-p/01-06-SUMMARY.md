---
phase: "01"
plan: "01-06"
subsystem: ui
tags: [product-form, tabs, image-upload, admin-ui]

requires:
  - phase: "01-05"
    provides: shadcn primitives, toast hook
provides:
  - Shared product form (create/edit) with 4 tabs
  - Image dropzone (drag-and-drop, MIME/size validation)
  - Repeatable rows for images, sizes, variants via useFieldArray
  - Create page at /admin/products/new
  - Edit page at /admin/products/[id]
affects: [01-07]

key-files:
  created:
    - components/admin/product-form.tsx
    - components/admin/image-dropzone.tsx
    - app/admin/(authenticated)/products/new/page.tsx
    - app/admin/(authenticated)/products/[id]/page.tsx

requirements-completed:
  - ADMIN-03
  - ADMIN-04
  - ADMIN-05

duration: 25min
completed: 2026-07-30
status: complete
---

# Plan 01-06: Admin product form

**4-tab product form with image dropzone, repeatable rows, create/edit pages**

## Accomplishments
- Shared ProductForm component (create + edit modes) with zod validation mirroring backend
- 4 tabs: Basics (all core fields), Images (primary + gallery + dropzone), Sizes (repeatable string rows), Variants (repeatable {colorName, colorValue, image})
- useFieldArray for repeatable rows (not comma-separated text)
- Image dropzone: drag-and-drop + click-to-pick, validates MIME/size, POSTs to /api/admin/upload
- Sticky "Save product" button (full-width mobile, 200px desktop)
- Create page at /admin/products/new, Edit page at /admin/products/[id] with backendFetch pre-population and notFound()

## Task Commits

1. **Task 01-06-01: Install shadcn primitives** - `2f75c4d` (feat)
2. **Task 01-06-02: Image dropzone** - `2f75c4d` (feat)
3. **Task 01-06-03: Product form + pages** - `2f75c4d` (feat)
