# Clothly E-Commerce — Roadmap

**Created:** 2026-07-28 (bootstrapped for quick-task tracking)
**Updated:** 2026-07-30 (added Phase 1: Admin Panel & Auth Foundation)

## Milestones

### M1: Storefront Foundation (in progress)

- Next.js app scaffold, global styles, Navbar
- Home page layout with HeroHome, interactive BounceCards
- Dynamic navigation sidebar (SideBar.tsx) with GSAP/styled-components
- Backend: Express + MongoDB connection, WomenClothes model

### M2: Operations & Customer Surfaces (planned, kicks off after M1)

#### Phase 1: Admin Panel & Auth Foundation

**Goal:** Add an authenticated admin UI for managing products and migrate the storefront off the static catalog onto the live database so admin changes immediately reflect on the public site.

**Scope:**

- Mongoose `User` model (email, bcrypt-hashed password, `role: 'admin' | 'customer'`)
- Hand-rolled JWT auth: httpOnly cookie + Next.js middleware gating `/admin/**` by role
- First admin account bootstrapped via seed script (no public admin signup)
- Admin product CRUD UI (list, create, edit, delete with confirm) covering all fields per existing schema (`images[]`, `sizes[]`, `variants[]`)
- File upload for product images, stored locally under `/public/images/products`
- Stats dashboard reusing `lib/admin.ts` `getAdminStats()`
- Storefront (`app/page.tsx`, `men/women/kids`, `ProductDetail`, `CategoryPage`, `SideBar`, `/api/products`) migrates from static `lib/products.ts` to live fetches via `backendFetch('/shop/products')`
- Initial dataset seeded into MongoDB via existing `/shop/seed` endpoint from `lib/products.ts` catalog

**Out of scope (deferred to follow-up phase):**

- Customer-facing signup/login UI (uses the same User/auth foundation laid here)
- Cloud image storage (Cloudinary/S3)
- Order history, checkout, payment

**Depends on:** M1 (Storefront Foundation)

**Plans:** 4/8 plans executed

Plans:

- [x] 01-01-PLAN.md — Substrate: env files, install deps, env-var boot handling, tsconfig backend exclude
- [x] 01-02-PLAN.md — Server-side auth: User model, JWT, login/logout endpoints, seed:admin, /api/auth proxies
- [x] 01-03-PLAN.md — Auth UI: middleware, login page, admin chrome, shadcn install, sign-out
- [x] 01-04-PLAN.md — Admin API auth gate + /api/admin/upload route
- [x] 01-05-PLAN.md — Admin dashboard + product list with delete confirm
- [x] 01-06-PLAN.md — Admin product form (create + edit, 4 tabs, image dropzone)
- [x] 01-07-PLAN.md — Storefront migration: backend reads, seed:products, error boundary
- [x] 01-08-PLAN.md — Hygiene verification + full 20-step manual UAT pass

## Quick Tasks

Tracked separately in `.planning/quick/` and STATE.md — not part of ROADMAP phases.
