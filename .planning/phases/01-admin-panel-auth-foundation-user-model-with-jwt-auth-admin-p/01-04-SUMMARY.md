---
phase: "01"
plan: "01-04"
subsystem: api
tags: [auth-gate, upload, admin-api]

requires:
  - phase: "01-02"
    provides: requireAdmin() from lib/auth
  - phase: "01-03"
    provides: auth UI context
provides:
  - Auth gate on all /api/admin/** handlers (deny-by-default)
  - Image upload route with MIME/size validation and safe filename
affects: [01-05, 01-06]

tech-stack:
  patterns:
    - requireAdmin() try/catch gate pattern for App Router handlers
    - request.formData() for file uploads (no multer/formidable)
    - Server-side file validation before disk write

key-files:
  created:
    - app/api/admin/upload/route.ts
  modified:
    - app/api/admin/products/route.ts
    - app/api/admin/products/[id]/route.ts

key-decisions:
  - requireAdmin() gating: try/catch at handler top (returns 401 Response)
  - Upload: ALLOWED_TYPES = jpeg/png/webp, MAX_BYTES = 5MB
  - Filename: timestamp-uuid8-slug pattern (collision-safe)
  - MIME check before file write (rejected files never land on disk)

requirements-completed:
  - ADMIN-08

coverage:
  - id: D1
    description: Auth gate on all /api/admin/** handlers
    requirement: ADMIN-08
    verification:
      - kind: manual_procedural
        ref: "grep -n 'requireAdmin' app/api/admin/products/route.ts app/api/admin/products/[id]/route.ts"
        status: pass
    human_judgment: false
  - id: D2
    description: Image upload route with MIME/size validation
    requirement: ADMIN-08
    verification:
      - kind: manual_procedural
        ref: "test -f app/api/admin/upload/route.ts && grep -c 'ALLOWED_TYPES\|MAX_BYTES' app/api/admin/upload/route.ts"
        status: pass
    human_judgment: false

duration: 10min
completed: 2026-07-30
status: complete
---

# Plan 01-04: Admin API auth gate + image upload route

**requireAdmin() gate on all admin API handlers and new image upload endpoint with MIME/size validation**

## Performance

- **Duration:** ~10 min
- **Completed:** 2026-07-30
- **Tasks:** 2/2 complete
- **Files modified:** 3

## Accomplishments
- Auth gate added to all 4 existing admin API handlers (GET/POST on products, PUT/DELETE on products/[id])
- Image upload route with JPEG/PNG/WebP MIME whitelist and 5MB cap
- Safe filename generation (Date.now() + randomUUID prefix + slug)
- Files validated before any disk write

## Task Commits

1. **Task 01-04-01: Auth gate** - `26d430d` (feat)
2. **Task 01-04-02: Upload route** - `26d430d` (feat)

## Files Created/Modified
- `app/api/admin/products/route.ts` — Modified: requireAdmin gate on GET, POST
- `app/api/admin/products/[id]/route.ts` — Modified: requireAdmin gate on PUT, DELETE
- `app/api/admin/upload/route.ts` — Created: POST image upload handler

## Decisions Made
- requireAdmin throws a Response(401) caught by the try/catch pattern
- No magic-byte sniffing (trusts client MIME for now — bounded risk)
- Upload directory: public/images/products/ (auto-created)

## Deviations from Plan
None — plan executed exactly as specified.

## Next Phase Readiness
- Auth-gated admin API ready for dashboard and product list (Plan 01-05)
- Image upload ready for product form (Plan 01-06)
