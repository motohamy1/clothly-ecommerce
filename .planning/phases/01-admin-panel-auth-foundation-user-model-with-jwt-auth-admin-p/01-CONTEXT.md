# Phase 1: Admin Panel & Auth Foundation - Context

**Gathered:** 2026-07-30
**Status:** Ready for planning

<domain>
## Phase Boundary

Add an authenticated admin UI for managing products, and migrate the public storefront off the static `lib/products.ts` catalog so that any add/edit/delete performed by an admin is immediately visible on the public site.

This phase delivers the **auth foundation** (User model + JWT) and the **admin-only** surface that uses it. Customer-facing signup/login pages, account state, and customer-side session UX are explicitly deferred to a follow-up phase that will reuse the User model and auth utilities built here.
</domain>

<decisions>
## Implementation Decisions

### Tracking & structure
- **D-01:** This is the first formal numbered phase in the roadmap (M1 storefront work is a milestone-level achievement, not phase-tracked). Customer-facing auth UI gets its own follow-up phase rather than being bundled here.

### Authentication & authorization
- **D-02:** Hand-rolled JWT-based auth (no NextAuth / Auth.js).
- **D-03:** Mongoose `User` model: `email` (unique), `password` (bcrypt-hashed, never returned in JSON), `role: 'admin' | 'customer'`, timestamps. Lives in `backend/src/models/user.ts`.
- **D-04:** Session = signed JWT in an httpOnly cookie. Cookie name: `clothly_session`. Signed with `JWT_SECRET` env var (required at boot, server fails fast if missing).
- **D-05:** Next.js middleware (`middleware.ts` at repo root) checks the cookie for any `/admin/**` route and redirects to `/admin/login` if missing/invalid; on valid token, checks `role === 'admin'` and redirects to `/admin/login` with a `?denied=1` flag otherwise.
- **D-06:** Login page lives at `/admin/login` (server component form, POSTs to `/api/auth/login`). Logout via `/api/auth/logout` clears the cookie.
- **D-07:** First admin account is bootstrapped via a seed script (`backend/src/scripts/seed-admin.ts`) that reads `ADMIN_EMAIL` + `ADMIN_PASSWORD` from env and upserts the admin user. **No public admin signup endpoint exists.**
- **D-08:** Backend gains an `auth` router (`backend/src/routers/auth.ts`) mounted at `/auth` with `POST /auth/login` (issue JWT, sets cookie) and `POST /auth/logout` (clears cookie). It reuses the same `User` model — single source of truth across frontend and backend since both run on Node.
- **D-09:** All `/api/admin/**` server routes verify the JWT cookie before proxying to the backend (defense in depth — the backend does not yet check auth, but the Next.js proxy is the trust boundary for the admin UI).
- **D-10:** Customer signup/login UI is **out of scope** for this phase. The User model exists, but the only login page shipped is `/admin/login`. Public-facing auth surfaces come in a later phase.

### Storefront data migration
- **D-11:** Every storefront read currently in `lib/products.ts` is migrated to fetch from the backend via the existing `backendFetch()` helper in `lib/backend.ts`. Files affected:
  - `app/page.tsx` (home, if it reads products)
  - `app/men/page.tsx`, `app/women/page.tsx`, `app/kids/page.tsx` (currently server components that read from `lib/products.ts` — convert to `await backendFetch('/shop/{section}')` or read from `/api/products?section=...`)
  - `app/product/[id]/page.tsx` (currently `getProductById` from static catalog — switch to `backendFetch('/shop/products/{id}')`)
  - `components/CategoryPage.tsx`, `components/SideBar.tsx` — switch to async fetches or read from a new typed server-side data helper.
  - `app/api/products/route.ts` and `app/api/products/[id]/route.ts` — stop serving from the static file, proxy to backend.
- **D-12:** `lib/products.ts` is **kept** as the seeding source-of-truth (it already exports `allProducts` etc.). The initial dataset is loaded into MongoDB via the existing `POST /shop/seed` endpoint, run once on first boot. After that, the static file is read-only — no fallback path. If the backend is unreachable, the storefront renders a clear error state (not stale data).
- **D-13:** Add `revalidate = 0` and `cache: 'no-store'` on all new storefront fetches (already the pattern in `lib/backend.ts`). Admin edits must be immediately visible.

### Admin panel scope
- **D-14:** Admin entry: `/admin` (dashboard with stats), `/admin/products` (product list), `/admin/products/new` (create form), `/admin/products/[id]` (edit form), `/admin/login` (login).
- **D-15:** Product list is a table (name, section, group, price, primary image thumbnail) with edit/delete actions. Delete uses a confirm dialog (no separate `/products/[id]/delete` route).
- **D-16:** Create/edit form covers all Product fields: `id` (slug-typed, required, validated client+server), `name`, `price`, `image` (path or URL string, OR uploaded file — see D-18), `category` (clothing | shoe), `group` (clothing | outerwear | shoes), `section` (men | women | kids), `description`, `images[]`, `sizes[]`, `variants[]`.
- **D-17:** `images[]` / `sizes[]` are repeatable row inputs (add/remove row, not free-text comma lists — keep it explicit). `variants[]` is repeatable rows of `{ colorName, colorValue (oklch string), image }`.
- **D-18:** File upload for product images: drag-and-drop or click-to-pick → uploaded to `POST /api/admin/upload` → saved under `/public/images/products/{timestamp}-{slug}.{ext}` → returns the public path → form binds it into the `image` / `images[]` / variant `image` fields. **Local disk storage** is acceptable because the backend runs as a long-lived Express server (not serverless), and there is no deployment to a serverless platform in scope.
- **D-19:** Stats dashboard at `/admin` uses the existing `getAdminStats()` from `lib/admin.ts` — total product count, per-section counts, per-group counts, backend connection status.

### Visual / UX
- **D-20:** All admin UI uses shadcn/ui primitives added to `components/ui/` via the shadcn CLI, styled with Tailwind v4 and the project's existing `cn()` helper. No ad-hoc styling, no `styled-components` for new admin code.
- **D-21:** Anti-slop design law is in effect for any UI work: real, specific design decisions; no blue-purple gradient defaults, no `Cormorant` / `Fraunces` / generic Google-font stack; bespoke silhouettes and authored micro-interactions where the design earns them. The admin panel is utility-dense, not marketing — restraint over decoration is appropriate, but "boring" is still a fail. At least one signature moment (the dashboard, the empty state, or the edit form) should feel deliberately designed, not defaulted.
- **D-22:** Forms use 16px inputs on mobile to avoid iOS zoom. All interactive elements meet WCAG 2.1 AA contrast. Reduced-motion respected on any animation.

### Backend hygiene (small fixes shipped alongside, not new scope)
- **D-23:** Fix the broken `start` script in `backend/package.json` (`node dist/index.js`, not `.ts`).
- **D-24:** Drive `MONGODB_URI` and `JWT_SECRET` from env (with sensible dev defaults + a warning log when defaults are used in production). `PORT` already env-driven — keep that.

### the agent's Discretion
- Exact JWT expiry duration and refresh strategy (sensible default: 7-day expiry, no refresh token in this phase — re-login on expiry).
- Whether to add a "remember me" toggle on the login form (probably not — keep surface minimal).
- Exact shadcn primitives to install (Button, Input, Label, Table, Dialog, Card, Select, Textarea are all likely; the planner picks the exact set).
- Variant image upload UX (single image per variant vs gallery picker — simple: one image per variant for now).
- Toast/notification library choice (or hand-rolled minimal toast).
- Where the `/admin/layout.tsx` lives and how the admin chrome (sidebar nav, sign-out) is structured.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project context
- `PRODUCT.md` — Brand voice, anti-references, design principles, accessibility baseline. Admin UI copy and tone should match the "considered, warm, intentional" voice. **No countdown timers, no urgency theater** in any admin messaging.
- `.planning/ROADMAP.md` §M1 + §Phase 1 — Phase boundary, scope, out-of-scope items.
- `.planning/codebase/STACK.md` — Stack versions and config (Next 16, React 19, Express 5, Mongoose 9, Tailwind v4, shadcn/ui new-york style).
- `.planning/codebase/CONVENTIONS.md` — Naming, file layout, import order, `'use client'` discipline, Tailwind v4 + `cn()` pattern. **Note: this file references outdated `menclothesModel` — codebase maps may be stale, treat with skepticism on backend details.**

### Existing backend (rebuild / extend — don't replace)
- `backend/src/index.ts` — Express bootstrap, Mongoose connect, route mount at `/shop`. **Reads here for the new `JWT_SECRET`/`MONGODB_URI` env handling.**
- `backend/src/routers/clothes.ts` — Full CRUD (`GET/POST/PUT/DELETE /shop/products`). **Reuse as-is.** Has duplicate-id (409) handling and validation.
- `backend/src/models/product.ts` — `ProductModel` Mongoose schema. **The admin form schema mirrors this exactly.**
- `backend/src/data/products.ts` — Seed dataset (currently 33 products). Used by `POST /shop/seed` for initial DB load.

### Existing admin wiring (rebuild / extend — don't replace)
- `app/api/admin/products/route.ts` — Next.js proxy `GET/POST /api/admin/products` → `backendFetch('/shop/products')`. **Add auth gate here.**
- `app/api/admin/products/[id]/route.ts` — `PUT/DELETE` proxy. **Add auth gate here.**
- `lib/admin.ts` — `getAdminStats()` server-side helper. Reuse for the dashboard. **Currently does a relative `/api/admin/products` fetch — verify it works in server components, otherwise switch to `backendFetch` directly.**

### Storefront code that must be migrated off `lib/products.ts`
- `lib/products.ts` — Source of catalog data, exports `Product`, `ProductCollection`, `catalog`, `allProducts`, `getCollection`, `getProductById`, etc. Becomes the **seeding source** and the `Product` type definition. Mutating functions (`getCollection`, `getProductById`, etc.) get deleted or rewritten to call `backendFetch`.
- `app/page.tsx` — Home (uses HeroHome, BounceCards, but may also read products — verify).
- `app/men/page.tsx`, `app/women/page.tsx`, `app/kids/page.tsx` — Section landing pages.
- `app/product/[id]/page.tsx` — Product detail page.
- `components/CategoryPage.tsx` — Category listing component.
- `components/SideBar.tsx` — `getProductSection` usage needs replacement.
- `components/ClothingCard.tsx`, `components/ShoeCard.tsx`, `components/ProductDetail.tsx` — Product-rendering components, only need to switch their data source if they currently call into `lib/products.ts` mutating helpers.
- `app/api/products/route.ts`, `app/api/products/[id]/route.ts` — Switch from static file to backend proxy.

### Existing infra / shared patterns
- `lib/backend.ts` — `backendFetch(path, init?)` — wraps `fetch(BACKEND_URL + path, { cache: 'no-store' })`. Use this from server components and API routes.
- `lib/utils.ts` — `cn()` helper (clsx + tailwind-merge). Standard for all new components.
- `lib/cart-context.tsx` — Existing client-side cart context. Model shape to follow for the admin's client-side state if needed.
- `components.json` — shadcn/ui config (style `new-york`, base color `neutral`, icon library `lucide`). Use the shadcn CLI to add new primitives.
- `next.config.ts` — Currently empty. May need `images.remotePatterns` if external image URLs are allowed in the upload flow.
- `middleware.ts` — **Does not exist yet — must be created** for `/admin/**` route protection.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- **`backendFetch` in `lib/backend.ts`** — Drop-in server-side fetcher for the Express backend with `cache: 'no-store'`. Use for all new server components and admin API routes that need backend data.
- **`backend/src/routers/clothes.ts`** — All product CRUD lives here. Admin UI talks to the Next.js proxy (`/api/admin/products/**`), which talks to this. Don't duplicate.
- **`getAdminStats` in `lib/admin.ts`** — Computes section/group/total counts. Already designed for the dashboard; just consume it.
- **shadcn/ui via `components.json`** — `npx shadcn@latest add button input label table dialog card select textarea ...` to add primitives. They're styled by the project config already.
- **`ProductModel` schema in `backend/src/models/product.ts`** — Single source of truth for product field shape. Mirror it in the admin form types and the `POST /api/admin/products` body validation.
- **`<Product>` TypeScript type in `lib/products.ts`** — Re-export or alias from this — don't redefine. After migration, `lib/products.ts` keeps the type but loses the catalog object.

### Established Patterns
- **Server components default, `'use client'` only when needed.** Admin forms will be client components (state, file picker). Admin list/table can be a client component too (needs row actions + delete confirm).
- **Tailwind v4 + `cn()` for all styling.** No styled-components for new admin code (they coexist in the repo but should not extend that pattern).
- **Import order: Next → React → third-party → `@/` → types → CSS.** Follow this in new files.
- **Backend errors go through the existing global `try { ... } catch (err) { next(err) }` pattern in routers.** No new error-handling style.
- **Env vars live in `.env` (gitignored) and are read at boot.** Add `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `MONGODB_URI` (override), `BACKEND_URL` (already partial — see `lib/backend.ts`).
- **Mongoose models live in `backend/src/models/`, lowercase filename, `<Name>Model` export.** Follow for the new `User` model.

### Integration Points
- **Express backend at `localhost:5000`** (configurable via `BACKEND_URL` env). New auth router mounts at `/auth`. New admin endpoints inside `/shop/admin/**` are **not** added — admin auth lives in the Next.js middleware + `/api/admin/**` proxy layer. The Express backend stays auth-unaware for this phase.
- **Next.js middleware at repo root** (`middleware.ts` — new file). Single source of truth for `/admin/**` access decisions.
- **`httpOnly` cookie set by the Express backend on `POST /auth/login`** with `SameSite=Lax`, `Secure` in production. The frontend reads it via middleware.

</code_context>

<specifics>
## Specific Ideas

- **Admin login UX is part of the brand.** A utility login page is fine, but it should match Clothly's "considered, warm, intentional" voice (per `PRODUCT.md`) — not a stock admin template. Sign-in copy, error states, and the empty signed-in state should read like the rest of the brand.
- **No dashboard fake metrics.** The dashboard shows real `getAdminStats()` numbers and a real backend-connection status indicator. No fabricated "X orders today" widgets.
- **Edit form is a real editor, not a placeholder.** Tabs for "Basics / Images / Variants / Sizes" so the form doesn't become a wall of inputs. Use shadcn `Tabs` primitive.
- **Delete confirm is a shadcn `AlertDialog`, not a browser `confirm()`.** Stylistically consistent, accessible, and recoverable.
- **Form state is local + server-validated.** No client-side only validation, no optimistic updates that don't reconcile — the source of truth is the backend. Use `react-hook-form` + `zod` for the form layer (already-common shadcn pairing; check if either is already in `package.json` before adding).

</specifics>

<deferred>
## Deferred Ideas

These came up during discussion and are explicitly out of scope for Phase 1. They belong in a follow-up phase or in the roadmap backlog.

- **Customer-facing signup / login UI** — Build the auth foundation (User model, JWT, middleware) in this phase, then build `/signup`, `/login`, account state in a follow-up phase. Single source-of-truth for the User model, but UI is split.
- **Cloud image storage (Cloudinary / S3 / R2)** — Local disk is fine while backend runs as a long-lived Express server. Add cloud storage when deployment moves off a single-server model.
- **Refresh tokens / "remember me"** — Single 7-day JWT, re-login on expiry. Refresh token flow belongs in the customer-auth phase (where sessions are longer-lived).
- **Order history / customer accounts / checkout / payment** — Unrelated to this phase.
- **Admin user-management UI** (creating other admins from the panel) — First admin is seeded via env. Adding "create another admin" inside the panel is a later feature; bootstrap-only for now.
- **Audit log of admin edits** — Nice-to-have, not in scope. If needed, fold into a later "operations hardening" phase.
- **Multi-image gallery reorder UI** — Drag-to-reorder of `images[]` is not in scope. Plain list with add/remove is enough.

None — discussion stayed within phase scope (with explicit deferral list above).

</deferred>

---

*Phase: 1-Admin Panel & Auth Foundation*
*Context gathered: 2026-07-30*
