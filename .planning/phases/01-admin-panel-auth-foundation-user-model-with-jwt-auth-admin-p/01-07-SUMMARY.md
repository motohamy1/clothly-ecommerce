---
phase: "01"
plan: "01-07"
subsystem: api
tags: [storefront, migration, seed, error-boundary]

requires:
  - phase: "01-06"
    provides: product form, admin API routes
provides:
  - lib/products.ts reduced to types only
  - lib/product-seeds.ts: 33-product seed catalog
  - lib/collection-meta.ts: section label/headline metadata
  - lib/admin.ts uses backendFetch (fixes relative URL Pitfall 6)
  - seed:products script (backend, bulkWrite 33 products)
  - All storefront reads migrated to backendFetch
  - Error boundaries (global + per-route) with brand-voice copy
affects: [01-08]

key-files:
  created:
    - lib/product-seeds.ts
    - lib/collection-meta.ts
    - backend/src/scripts/seed-products.ts
    - app/error.tsx
    - app/product/error.tsx
  modified:
    - lib/products.ts
    - lib/admin.ts
    - backend/tsconfig.json
    - backend/package.json
    - app/api/products/route.ts
    - app/api/products/[id]/route.ts
    - app/product/[id]/page.tsx
    - components/CategoryPage.tsx
    - components/SideBar.tsx

requirements-completed:
  - STORE-01
  - STORE-02
  - STORE-03
  - STORE-04

duration: 30min
completed: 2026-07-30
status: complete
---

# Plan 01-07: Storefront migration

**Backend-driven storefront with honest error boundaries, seeding, and types-only products module**

## Accomplishments
- lib/products.ts: types only (~35 lines), no mutating helpers
- lib/product-seeds.ts: 33-product catalog with productSeeds export for backend seed script
- lib/collection-meta.ts: section label/headline metadata (non-product data not in backend response)
- lib/admin.ts: backendFetch('/shop/products') instead of broken relative fetch
- backend/tsconfig.json: rootDirs for cross-package import
- seed:products script: bulkWrite 33 products into MongoDB
- app/api/products/*: proxy to backend
- app/product/[id]/page.tsx: backendFetch with try/catch notFound
- CategoryPage.tsx: async server component using backendFetch
- SideBar.tsx: slug-prefix parser (fail-soft for non-standard slugs)
- Error boundaries: app/error.tsx (global), app/product/error.tsx (per-route) — brand-voice, no stale data

## Task Commits

1. **Task 01-07-01: Refactor products + seeds** - `d83c817` (feat)
2. **Task 01-07-02: Backend seed script + config** - `d83c817` (feat)
3. **Task 01-07-03: Storefront migration + boundaries** - `d83c817` (feat)
