# Phase 1: Admin Panel & Auth Foundation - Research

**Researched:** 2026-07-30
**Domain:** Next.js 16 admin UI + Express 5 JWT auth + Mongoose 9 User model + storefront data migration
**Confidence:** HIGH (for the parts grounded in the existing codebase) / MEDIUM (for stack choices that will be verified at install time via the package-legitimacy seam)

---

<user_constraints>
## User Constraints (from CONTEXT.md)

These are locked decisions the planner MUST honor. Copied verbatim from `01-CONTEXT.md`. Do not re-litigate.

### Locked Decisions

**Tracking & structure**
- **D-01:** This is the first formal numbered phase in the roadmap. Customer-facing auth UI gets its own follow-up phase.

**Authentication & authorization**
- **D-02:** Hand-rolled JWT-based auth (no NextAuth / Auth.js).
- **D-03:** Mongoose `User` model: `email` (unique), `password` (bcrypt-hashed, never returned in JSON), `role: 'admin' | 'customer'`, timestamps. Lives at `backend/src/models/user.ts`.
- **D-04:** Session = signed JWT in an httpOnly cookie named `clothly_session`. Signed with `JWT_SECRET` env var; server fails fast at boot if missing.
- **D-05:** Next.js middleware (`middleware.ts` at repo root) gates `/admin/**`. Missing/invalid cookie → redirect to `/admin/login`. Valid token but `role !== 'admin'` → redirect to `/admin/login?denied=1`.
- **D-06:** Login page at `/admin/login` (server component form, POSTs to `/api/auth/login`). Logout via `/api/auth/logout` clears the cookie.
- **D-07:** First admin seeded via `backend/src/scripts/seed-admin.ts` reading `ADMIN_EMAIL` + `ADMIN_PASSWORD` from env. **No public admin signup endpoint.**
- **D-08:** Backend gains `auth` router (`backend/src/routers/auth.ts`) mounted at `/auth` with `POST /auth/login` (issue JWT, set cookie) and `POST /auth/logout` (clear cookie). Reuses the same `User` model.
- **D-09:** All `/api/admin/**` server routes verify the JWT cookie before proxying to the backend (defense in depth; backend is auth-unaware in this phase).
- **D-10:** Customer signup/login UI is **out of scope**. The User model exists; the only login page shipped is `/admin/login`.

**Storefront data migration**
- **D-11:** Every storefront read currently in `lib/products.ts` migrates to fetch from the backend via `backendFetch()` (`lib/backend.ts`). Files affected: `app/page.tsx`, `app/men/page.tsx`, `app/women/page.tsx`, `app/kids/page.tsx`, `app/product/[id]/page.tsx`, `components/CategoryPage.tsx`, `components/SideBar.tsx`, `app/api/products/route.ts`, `app/api/products/[id]/route.ts`.
- **D-12:** `lib/products.ts` is kept as the seeding source-of-truth (exports `allProducts`, etc.). Initial dataset loaded into MongoDB via the existing `POST /shop/seed` endpoint, run once on first boot. After that, the static file is read-only — no fallback path. Backend unreachable → clear error state, not stale data.
- **D-13:** Add `revalidate = 0` and `cache: 'no-store'` on all new storefront fetches (already the pattern in `backendFetch`). Admin edits must be immediately visible.

**Admin panel scope**
- **D-14:** Admin entry: `/admin` (dashboard with stats), `/admin/products` (list), `/admin/products/new` (create), `/admin/products/[id]` (edit), `/admin/login` (login).
- **D-15:** Product list is a table (name, section, group, price, primary image thumbnail) with edit/delete actions. Delete uses a confirm dialog (no separate `/products/[id]/delete` route).
- **D-16:** Create/edit form covers all Product fields: `id` (slug-typed, required, validated client+server), `name`, `price`, `image` (path/URL string OR uploaded file — see D-18), `category` (clothing | shoe), `group` (clothing | outerwear | shoes), `section` (men | women | kids), `description`, `images[]`, `sizes[]`, `variants[]`.
- **D-17:** `images[]` / `sizes[]` are repeatable row inputs (add/remove row, not free-text comma lists). `variants[]` is repeatable rows of `{ colorName, colorValue (oklch string), image }`.
- **D-18:** File upload for product images: drag-and-drop or click-to-pick → uploaded to `POST /api/admin/upload` → saved under `/public/images/products/{timestamp}-{slug}.{ext}` → returns the public path → form binds it into the `image` / `images[]` / variant `image` fields. **Local disk storage is acceptable** because the backend runs as a long-lived Express server (not serverless).
- **D-19:** Stats dashboard at `/admin` uses existing `getAdminStats()` from `lib/admin.ts` — total product count, per-section counts, per-group counts, backend connection status.

**Visual / UX**
- **D-20:** All admin UI uses shadcn/ui primitives added to `components/ui/` via the shadcn CLI, styled with Tailwind v4 and the project's existing `cn()` helper. No ad-hoc styling, no `styled-components` for new admin code.
- **D-21:** Anti-slop design law is in effect: real, specific design decisions; no blue-purple gradient defaults, no `Cormorant` / `Fraunces` / generic Google-font stack; bespoke silhouettes and authored micro-interactions where the design earns them. Admin panel is utility-dense, not marketing — restraint over decoration is appropriate, but "boring" is still a fail. At least one signature moment (dashboard, empty state, or edit form) should feel deliberately designed.
- **D-22:** Forms use 16px inputs on mobile to avoid iOS zoom. All interactive elements meet WCAG 2.1 AA contrast. Reduced-motion respected on any animation.

**Backend hygiene**
- **D-23:** Fix the broken `start` script in `backend/package.json` (`node dist/index.js`, not `.ts`).
- **D-24:** Drive `MONGODB_URI` and `JWT_SECRET` from env (with sensible dev defaults + a warning log when defaults are used in production). `PORT` already env-driven — keep that.

### the agent's Discretion

- Exact JWT expiry duration and refresh strategy (sensible default: **7-day expiry, no refresh token**, re-login on expiry).
- Whether to add a "remember me" toggle on the login form (probably not — keep surface minimal).
- Exact shadcn primitives to install (Button, Input, Label, Table, Dialog, Card, Select, Textarea are all likely; planner picks the exact set).
- Variant image upload UX (single image per variant vs gallery picker — simple: **one image per variant for now**).
- Toast/notification library choice (or hand-rolled minimal toast).
- Where the `/admin/layout.tsx` lives and how the admin chrome (sidebar nav, sign-out) is structured.

### Deferred Ideas (OUT OF SCOPE)

- Customer-facing signup / login UI.
- Cloud image storage (Cloudinary / S3 / R2).
- Refresh tokens / "remember me".
- Order history / customer accounts / checkout / payment.
- Admin user-management UI (creating other admins from the panel).
- Audit log of admin edits.
- Multi-image gallery reorder UI.

</user_constraints>

<phase_requirements>
## Phase Requirements

Synthesized from `.planning/ROADMAP.md` §Phase 1 "Scope" and `01-CONTEXT.md` `<decisions>`. There are no explicit AUTH-01 style IDs in the source artifacts; the IDs below are derived for traceability.

| ID | Description | Research Support |
|----|-------------|------------------|
| AUTH-01 | Mongoose `User` model with email, bcrypt-hashed password, `role: 'admin' \| 'customer'`, timestamps. File: `backend/src/models/user.ts`. | `backend/src/models/product.ts:1-64` is the pattern to mirror. |
| AUTH-02 | Express `auth` router mounted at `/auth` with `POST /auth/login` and `POST /auth/logout`. File: `backend/src/routers/auth.ts`. | `backend/src/routers/clothes.ts:51-71` is the GET pattern to mirror. |
| AUTH-03 | httpOnly cookie `clothly_session` carrying signed JWT. | D-04; new, no existing pattern. |
| AUTH-04 | `JWT_SECRET` env var read at boot, server fails fast if missing. | `backend/src/index.ts:6` is the pattern for `process.env.PORT`. |
| AUTH-05 | Seed script `backend/src/scripts/seed-admin.ts` reading `ADMIN_EMAIL` + `ADMIN_PASSWORD`. | New file; mirrors D-07. |
| AUTH-06 | Next.js `middleware.ts` at repo root gating `/admin/**` (except `/admin/login`). Edge-safe JWT decode via `jose`. | New file; mirrors D-05. |
| AUTH-07 | `/api/auth/login` and `/api/auth/logout` route handlers under `app/api/auth/`. | Mirror `app/api/admin/products/route.ts:1-25`. |
| AUTH-08 | All `/api/admin/**` route handlers verify the JWT cookie before proxying. | Touch `app/api/admin/products/route.ts:4-25` and `app/api/admin/products/[id]/route.ts:1-36`. |
| ADMIN-01 | `/admin` dashboard using `getAdminStats()` from `lib/admin.ts`. | `lib/admin.ts:13-42` already exists; build the page. |
| ADMIN-02 | `/admin/products` table view with name, section, group, price, image thumbnail; edit/delete row actions. | Mirror shadcn `Table` primitive. |
| ADMIN-03 | `/admin/products/new` and `/admin/products/[id]` create/edit forms covering all `Product` fields with `react-hook-form` + `zod`. | Mirror `backend/src/models/product.ts:13-25` shape. |
| ADMIN-04 | Repeatable row inputs for `images[]`, `sizes[]`, `variants[]` (not comma lists). | New form pattern. |
| ADMIN-05 | Delete confirm via shadcn `AlertDialog` (not browser `confirm()`). | New component. |
| ADMIN-06 | Tabs in the edit form for "Basics / Images / Variants / Sizes" (shadcn `Tabs`). | New component. |
| ADMIN-07 | File upload at `POST /api/admin/upload` writing to `/public/images/products/{timestamp}-{slug}.{ext}`. | New route handler. |
| ADMIN-08 | Sign-out button in the admin chrome calls `/api/auth/logout` and redirects. | New component. |
| STORE-01 | All storefront reads migrated from `lib/products.ts` mutating helpers to `backendFetch('/shop/...')`. Touch `app/page.tsx`, `app/men/page.tsx`, `app/women/page.tsx`, `app/kids/page.tsx`, `app/product/[id]/page.tsx`, `components/CategoryPage.tsx`, `components/SideBar.tsx`. | `app/men/page.tsx:1-5` and `components/CategoryPage.tsx:14-15` show the import pattern. |
| STORE-02 | `app/api/products/route.ts` and `app/api/products/[id]/route.ts` switch from static catalog to backend proxy. | `app/api/products/route.ts:1-19` and `app/api/products/[id]/route.ts:1-17` need replacing. |
| STORE-03 | Initial dataset loaded into MongoDB via `POST /shop/seed` on first boot. | `backend/src/routers/clothes.ts:174-189` already implements this. |
| STORE-04 | `lib/products.ts` keeps `Product`/`ProductVariant` types and the seed arrays; mutating helpers deleted/rewritten. | `lib/products.ts:155-184` are the mutating helpers to rewrite. |
| STORE-05 | All new storefront fetches use `revalidate = 0` and `cache: 'no-store'`. | `lib/backend.ts:7-22` already uses `cache: 'no-store'`. |
| HYGIENE-01 | `backend/package.json` `start` script: `node dist/index.js`. | **Already correct in source** (`backend/package.json:8`); just verify. |
| HYGIENE-02 | `MONGODB_URI` env-driven with dev default + prod warning. | **Partially done** (`backend/src/index.ts:7`); add prod warning log. |
| HYGIENE-03 | `JWT_SECRET` env-driven with no default; fail fast if missing. | New. |

</phase_requirements>

---

## 1. Executive Summary

This phase layers an admin surface on top of an already-isolated two-tier repo. The backend (`backend/`, CommonJS, Express 5 + Mongoose 9) needs **one new router** (`auth.ts`), **one new model** (`user.ts`), **one new script** (`seed-admin.ts`), and a few env-var hygiene tweaks. The frontend (root, Next 16 App Router + React 19, Tailwind v4, shadcn/ui configured but not yet installed) needs **a `middleware.ts` at the repo root** for `/admin/**` gating, **a `/admin` route subtree** (login + dashboard + product CRUD), **an upload route handler** for product images, **a new env-var contract** (`JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`), and **a storefront migration** that swaps every `lib/products.ts` read for a `backendFetch('/shop/...')` call. The store remains the source of truth for the `Product` shape; the file `lib/products.ts` is reduced to a type-and-seed module (no more `getProductById` / `getCollection` / `allProducts` exports as live data — only the `productSeeds`-like seed arrays and the `Product` type).

**Primary recommendation:** Use `jose` for the Edge-runtime middleware JWT decode (NOT `jsonwebtoken` — that uses Node `crypto` and won't run in Edge). Use `jsonwebtoken` and `bcrypt` only in the **Node runtime** paths (the Express `auth` router and the Next.js API route handlers). Use `react-hook-form` + `zod` for the admin forms. Add shadcn primitives via the CLI. Treat the migration as a one-shot cutover, not a feature flag — boot the backend, run `/shop/seed` once, point every storefront read at the DB. If the backend is unreachable, the storefront renders an error state (D-12) — never stale data.

---

## 2. Recommended Architecture

### 2.1 Auth flow

```
┌──────────────────────────────────────────────────────────────────────────┐
│                          ADMIN AUTH FLOW                                   │
├──────────────────────────────────────────────────────────────────────────┤
│  Browser                Next.js (App Router)            Express backend   │
│  ────────               ─────────────────────           ────────────────  │
│  GET /admin             middleware.ts:                  ─                 │
│   ↓                     jose.decode(jwt)                                 │
│  ─── cookie present? ─→ role? ─ no ──→ /admin/login                      │
│   │                                  ↓                                   │
│   │                                 POST /api/auth/login                 │
│   │                                  ↓                                   │
│   │                  /api/auth/login  →  backendFetch('/auth/login')      │
│   │                                                  ↓                   │
│   │                                       verify email+password          │
│   │                                       (bcrypt.compare)               │
│   │                                       jwt.sign(                      │
│   │                                          { sub, role, exp },         │
│   │                                          JWT_SECRET)                 │
│   │                                       Set-Cookie: clothly_session    │
│   │                                                  ↓                   │
│   │   Set-Cookie back to browser ← 200 { ok: true, user }                │
│   │   redirect → /admin                                                    │
│   ↓                                                                       │
│  /admin/products                                                          │
│  POST /api/admin/products                                                 │
│   │                  API route: verify cookie (jose),                    │
│   │                              backendFetch('/shop/products', POST)     │
│   │                                                  ↓                   │
│   │                                       create in MongoDB              │
│   ↓                                                                       │
│  /admin/products shows new row                                            │
└──────────────────────────────────────────────────────────────────────────┘
```

**Why `jose` for middleware and `jsonwebtoken` for API routes:** Next.js middleware runs on the Edge runtime (V8 isolate), which does NOT expose Node's `crypto` module. `jsonwebtoken` depends on Node `crypto` and will fail to bundle for Edge. `jose` is a pure-JS JOSE implementation that works in both Edge and Node runtimes. Use `jose` in `middleware.ts` (Edge) AND in the Next.js API route handlers (Node). Use `jsonwebtoken` only in the Express backend, where CommonJS + Node `crypto` are the default. (Note: you *could* use `jose` everywhere, but `jsonwebtoken` is the well-trodden default in Node/Express tutorials and is fine in the Node-only backend.)

### 2.2 User model schema (AUTH-01)

Mirror the existing `backend/src/models/product.ts:36-54` pattern: `interface X extends Document` + `new Schema({...})` + `mongoose.model<X>('X', schema)` with `timestamps: true`.

```typescript
// backend/src/models/user.ts
import mongoose, { Document, Schema } from 'mongoose';

export type UserRole = 'admin' | 'customer';

export interface UserDocument extends Document {
  email: string;
  password: string;     // bcrypt-hashed; never serialized
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<UserDocument>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    password: { type: String, required: true, select: false }, // never returned by default
    role: { type: String, required: true, enum: ['admin', 'customer'], default: 'customer' },
  },
  { timestamps: true, versionKey: false },
);

// .select('+password') is needed to fetch the hash; default queries omit it.
userSchema.set('toJSON', {
  transform: (_doc, ret) => {
    const { _id, password, ...json } = ret.toObject ? ret.toObject() : ret;
    void _id; void password;
    return json;
  },
});

export const UserModel = mongoose.model<UserDocument>('User', userSchema);
```

**Why `select: false` on password:** belt-and-braces against ever returning the hash from a `.find()` call. Even if a route handler forgets to project, Mongoose won't return the hash. The login flow uses an explicit `.select('+password')` to get the hash for `bcrypt.compare`.

**Why `lowercase: true, trim: true` on email:** case-folded login is the only way to be sure `"Admin@Clothly.com"` and `"admin@clothly.com"` are the same account.

### 2.3 Password hashing — `bcrypt` vs `bcryptjs`

**Recommendation: `bcrypt` (native).** This is not a serverless project (`backend/` is a long-lived Node process — `backend/src/index.ts:21-31` connects to MongoDB and `app.listen`s on port 5000). `bcrypt`'s native build is fine; `bcryptjs` exists for the serverless case where you can't ship a native binary. Native `bcrypt` is ~10× faster and is the standard for Node auth.

```
cd backend && npm install bcrypt
```

If the user has trouble building native modules on their platform, the fallback is `bcryptjs` — same API surface, drop-in replacement.

### 2.4 Session lifecycle

- **Algorithm:** HS256 (symmetric, single `JWT_SECRET`).
- **Payload:** `{ sub: <userId as hex string>, email, role, iat, exp }`. Keep it small — every request reads the cookie.
- **Expiry:** 7 days (`Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7`).
- **Cookie attributes:**
  - `httpOnly: true` — JS can't read it (D-04).
  - `sameSite: 'lax'` — protects against most CSRF on top-level navigations; the admin UI is same-origin.
  - `secure: process.env.NODE_ENV === 'production'` — true in prod, false in dev (so `http://localhost:3000` works).
  - `path: '/'` — sent to all Next.js routes (the middleware reads it on every `/admin/**` request).
  - `maxAge` matches JWT expiry.
- **Refresh strategy:** None (D-deferred). On expiry, the user is redirected to `/admin/login` with a `?expired=1` query param showing a toast.
- **Revocation:** Not in scope. Logging out clears the cookie client-side, but a stolen token remains valid until expiry. Acceptable for v1; the customer-auth follow-up phase can add a token blacklist if needed.

### 2.5 Admin route structure

```
app/
├── admin/
│   ├── layout.tsx           # NEW — admin chrome (sidebar + topbar + sign-out)
│   ├── page.tsx             # NEW — dashboard (uses getAdminStats)
│   ├── login/
│   │   └── page.tsx         # NEW — server component form
│   ├── products/
│   │   ├── page.tsx         # NEW — list table
│   │   ├── new/
│   │   │   └── page.tsx     # NEW — create form
│   │   └── [id]/
│   │       └── page.tsx     # NEW — edit form
└── api/
    ├── auth/
    │   ├── login/route.ts   # NEW — proxies to backend /auth/login
    │   └── logout/route.ts  # NEW — proxies to backend /auth/logout
    ├── admin/
    │   ├── products/        # EXISTING — add JWT cookie check
    │   │   ├── route.ts
    │   │   └── [id]/route.ts
    │   └── upload/route.ts  # NEW — multipart upload to /public/images/products/
    └── products/            # EXISTING — switch from static to backend
        ├── route.ts
        └── [id]/route.ts
```

The `app/admin/layout.tsx` is the chrome — left sidebar with links to Dashboard / Products, top right user/sign-out. It uses `'use client'` because of the sign-out form. It does NOT check auth itself (that's middleware's job); it just renders chrome + `{children}`. The login page is at `app/admin/login/page.tsx` and is NOT wrapped by this layout (the layout either early-returns for `/admin/login` or — cleaner — the login page is at `app/admin/login/page.tsx` with its own minimal layout).

### 2.6 Data migration strategy

Per D-12, this is a **one-shot cutover**, not a feature flag. The order:

1. **Add `User` model + auth router + JWT_SECRET handling** (AUTH-01..05) — backend boots cleanly, but no UI uses it yet.
2. **Add `middleware.ts` + `/api/auth/login` + `/api/auth/logout`** — you can now log in via curl and the cookie works. Still no UI.
3. **Add admin chrome + login page + sign-out** — you can log in through the browser. No CRUD yet.
4. **Add admin product CRUD pages + `/api/admin/products/**` JWT gate** — you can create/edit/delete. The proxy layer (already there) becomes the trust boundary (D-09).
5. **Seed the DB once**: call `POST /shop/seed` from the admin UI on first boot (or document it in a `README`/`installer.sh` step). The seed array lives in `lib/products.ts` (re-exported from `backend/src/data/products.ts` which already exists at lines 51-64 — **those 13 products are the seed set, not the 33 in `lib/products.ts`; resolve this in step 6**).
6. **Migrate storefront reads**: swap `lib/products.ts` mutating helpers (`getProductById`, `getCollection`, `getProductsBySection`, `getProductSection`, `getRelatedProducts`) for `backendFetch` calls. Switch `components/CategoryPage.tsx` from a sync client component that imports the catalog object to an async server component that awaits the backend. Switch `app/product/[id]/page.tsx` from `getProductById(id)` to `backendFetch(\`/shop/products/${id}\`)`. Switch `components/SideBar.tsx`'s use of `getProductSection` (line 6, line 33) to a different signal (pathname-based or a new async helper that fetches the product's section).
7. **Delete (or stub) the static catalog data** in `lib/products.ts`. Keep the `Product` / `ProductVariant` type exports and any seed-array exports. The `product()` builder and `catalog` object get deleted. The `getProductById` etc. helpers get deleted (or kept as throws for compile-time catches).

**What if the backend is unreachable mid-migration (D-12):** the storefront renders a clear error state. `backendFetch` already throws on non-2xx (`lib/backend.ts:17-19`). In a server component, this surfaces as a render error caught by the `error.tsx` boundary. The plan should add `app/error.tsx` (or per-route `error.tsx`) that says something specific to the brand: *"Our shop is taking a moment. Try again in a minute."* — not the default Next.js error page. The same applies to `app/men/error.tsx`, `app/women/error.tsx`, `app/kids/error.tsx`, `app/product/[id]/error.tsx` if the per-route granularity is desired. **Do NOT** show stale data from `lib/products.ts` while the backend is down — that contradicts D-12 explicitly.

### 2.7 Two-package npm — where each new dep goes

| New dep | Goes in | Why |
|---|---|---|
| `jsonwebtoken` | `backend/package.json` (`cd backend && npm install jsonwebtoken @types/jsonwebtoken`) | Node-only CommonJS path; used in the Express `auth` router. |
| `bcrypt` | `backend/package.json` | Same — used in Express `auth` router. |
| `jose` | root `package.json` (`npm install jose`) | Edge-safe; used in `middleware.ts` and Next.js API routes (both run in Node by default but jose is portable). |
| `react-hook-form` | root `package.json` | Frontend only. |
| `zod` | root `package.json` | Frontend only. |
| `@hookform/resolvers` | root `package.json` | The bridge between RHF and zod; install together. |
| `sonner` (or hand-rolled) | root `package.json` (if using sonner) | Frontend toast. |

**Two separate `npm install` runs, no monorepo workspace.** Backend's `node_modules` and the root's `node_modules` are independent. The `@types/jsonwebtoken` is needed because backend is TS but the existing `backend/package.json` doesn't have `@types/*` for express (they use `@types/express` only in the root — see root `package.json:36-37`). For consistency, the backend should also pull `@types/jsonwebtoken` if we want typecheck to pass on the `auth.ts` router. Alternatively, since the backend has no `lint` script and no CI (per `STACK.md:51`), a quick `// @ts-ignore` is acceptable. **Recommend:** add `@types/jsonwebtoken` to `backend/package.json` devDependencies for hygiene.

---

## 3. Technology Choices

### 3.1 Verification against actual `package.json` files

I read both `package.json` files in full. The result: **most of the auth and form libraries are NOT yet installed**. This phase adds them.

**Root `package.json` (verified, lines 11-33) currently has:**
- `@radix-ui/react-label`, `@radix-ui/react-slot`, `radix-ui` (umbrella package), `@react-three/drei`, `@react-three/fiber`, `@tabler/icons-react`, `class-variance-authority`, `clsx`, `express` (vestigial — should be removed, but D-deferred), `framer-motion`, `gsap`, `lightswind`, `lucide-react`, `motion`, `next`, `postcss`, `react`, `react-dom`, `styled-components`, `tailwind-merge`, `three`.

**NOT in root `package.json` (need to add):** `react-hook-form`, `zod`, `@hookform/resolvers`, `jose`, `sonner` (optional).

**Backend `package.json` (verified, lines 16-21) currently has:**
- `express`, `mongoose`, `nodemon`, `typescript`. Nothing else.

**NOT in `backend/package.json` (need to add):** `jsonwebtoken`, `bcrypt`, `@types/jsonwebtoken` (dev), `@types/bcrypt` (dev).

### 3.2 Choice rationale

| Need | Pick | Version target | Why this one | Confidence |
|---|---|---|---|---|
| Password hashing | `bcrypt` | `^5.1.x` (latest stable at time of research) | Native build, ~10× faster than `bcryptjs`, standard for Node auth. Not serverless, so native is fine. | HIGH — `bcrypt` is the canonical Node choice; the only reason to pick `bcryptjs` is the serverless case, which this project is not. |
| JWT sign/verify (backend) | `jsonwebtoken` | `^9.0.x` (current stable) | The default for Node JWT work. Works in CommonJS (matches `backend/package.json:15` `"type": "commonjs"`). | HIGH — `jsonwebtoken` is the standard. The only alternative is `jose` (see below) which we'd use on the frontend side. |
| JWT decode (middleware / Next API routes) | `jose` | `^5.x` (latest) | Edge-runtime safe. `jsonwebtoken` uses Node `crypto` and will fail to bundle for Next.js middleware. | HIGH — Next.js Edge runtime constraint; `jose` is the well-known solution. |
| Forms | `react-hook-form` + `zod` + `@hookform/resolvers` | `react-hook-form ^7.x`, `zod ^3.x`, `@hookform/resolvers ^3.x` | The shadcn-canonical form stack. RHF is the most-used form library in React; zod is the most-used schema validator. The two are paired in shadcn's own form recipe. | HIGH — this is the shadcn-recommended pairing; check shadcn's current docs at install time. |
| Toast / notification | **Hand-rolled minimal toast** (preferred) OR `sonner` | `sonner ^1.x` if chosen | A simple toast surface is small enough to build in ~30 lines (a fixed-position `<div>` with a `useState<Toast[]>` context, a `push(toast)` function, and a 3-second timer). If the planner wants to skip that work, `sonner` is a tiny, well-maintained option. | MEDIUM — both are fine; the discretion area says "hand-rolled or library". Hand-rolled keeps the dep tree smaller and matches the admin's restraint tone. |
| File upload (server side) | **Built-in `request.formData()`** via Next.js route handler at `app/api/admin/upload/route.ts` | Built into Next.js 16 / Node 20 | The route handler does `const formData = await request.formData()` and reads `formData.get('file')`. No need for `multer`, `busboy`, or `formidable` for a single-file upload. | HIGH — Next.js App Router route handlers support `request.formData()` natively. |
| Image processing | **NOT NEEDED for v1** | — | D-18 says "saved under `/public/images/products/...`" — no resizing, no thumbnails. If thumbnail generation is later wanted, `sharp` is the standard, but the current scope doesn't need it. | HIGH — D-18 explicitly says local disk, no processing. |
| `crypto.randomUUID()` for upload filename | Built-in to Node 20+ | — | For `{timestamp}-{slug}.{ext}`. The timestamp can be `Date.now()`; the slug is the user-provided filename slugified. | HIGH — no new dep. |

### 3.3 Versions to install

```
# Root
npm install react-hook-form@^7 zod@^3 @hookform/resolvers@^3 jose@^5
# (optional) npm install sonner@^1

# Backend
cd backend && npm install jsonwebtoken@^9 bcrypt@^5
cd backend && npm install -D @types/jsonwebtoken @types/bcrypt
```

**These versions are the current stable as of my knowledge cutoff. The plan should run `npm view <pkg> version` (the ecosystem-specific registry check called out in the package-legitimacy protocol) at install time to confirm the latest stable.** The protocol explicitly says: "Training data versions may be months stale — always confirm against the correct ecosystem registry." [ASSUMED for the specific patch versions; HIGH for the package choice itself.]

---

## 4. Pattern Analysis

This section reads the existing code and tells the planner exactly which patterns to follow, with `file:line` citations.

### 4.1 The Mongoose model pattern

**Mirror `backend/src/models/product.ts:36-54`.** Schema definition, `timestamps: true`, `versionKey: false`, `set('toJSON', ...)`. The new `User` model follows the same shape — see §2.2 above.

### 4.2 The Express router pattern

**Mirror `backend/src/routers/clothes.ts:51-71`** (the GET handler) and **`:89-108`** (the POST handler with `try { ... } catch (error) { return next(error) }`). Notable:

- Each handler is `async`.
- Each has a `try/catch` that calls `next(error)` — this is the project convention, NOT the failure mode flagged in `CONVENTIONS.md:79` (which describes the older `clothes.ts` reads). The current `clothes.ts` is consistent.
- Validation is done with a free `validateProductPayload()` helper at `:39-49` that returns a string error or `null`. The new `auth.ts` can follow the same pattern (e.g., `validateLoginPayload()`).
- The `11000` duplicate-key error is handled at `:103-105` for unique-id conflicts. The new `User` model uses `email` as the unique key, so the login endpoint must catch this too (though login creates a session, not a user — the seed script creates the user, and the login endpoint just verifies).

### 4.3 The backend env var pattern

**Mirror `backend/src/index.ts:6-7`:**
```typescript
const port = process.env.PORT || 5000;
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/clothly-ecommerce';
```

For `JWT_SECRET`, follow the same shape but **without a dev default** (D-04: fail fast). Per D-24, add a production warning when the dev default for `MONGODB_URI` is used:
```typescript
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/clothly-ecommerce';
if (!process.env.MONGODB_URI && process.env.NODE_ENV === 'production') {
  console.warn('[clothly-backend] WARNING: using default MONGODB_URI in production');
}
const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
  console.error('[clothly-backend] FATAL: JWT_SECRET is required. Set it in your env.');
  process.exit(1);
}
```

The shared `jwtSecret` is then exported or passed to the `auth` router via a module-level variable (it's a singleton, no rotation logic in scope).

### 4.4 The frontend `backendFetch` pattern

**Reuse `lib/backend.ts:7-22` verbatim.** It already:
- Reads `BACKEND_URL` from env with a localhost:5000 default.
- Sets `cache: 'no-store'`.
- Parses JSON safely with `.catch(() => ({}))`.
- Throws a typed `Error` with the backend's error string on non-2xx.

The new `app/api/auth/login/route.ts` will use a sibling `authFetch` or just call `backendFetch('/auth/login', ...)` — same pattern. The `app/api/admin/upload/route.ts` does NOT use `backendFetch` (it's a multipart upload to the local Next.js process, not the backend).

### 4.5 The Next.js API route handler pattern

**Mirror `app/api/admin/products/route.ts:1-25`:**
```typescript
import { NextResponse } from 'next/server';
import { backendFetch } from '@/lib/backend';

export async function GET() {
  try {
    const data = await backendFetch('/shop/products');
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '...' },
      { status: 502 },
    );
  }
}
```

The new `app/api/auth/login/route.ts` follows the same shape. The new `app/api/admin/products/route.ts` and `app/api/admin/products/[id]/route.ts` get a **new step at the top**: verify the JWT cookie before proxying. See §4.7 for the auth check.

### 4.6 The shadcn/ui pattern

**Per `components.json` (verified, lines 1-25):**
- Style: `new-york`
- Tailwind entry: `app/globals.css` (already verified — it has the full token set at `:49-83` and a `.shop` and `.dark` variant)
- Base color: `neutral`
- CSS variables: enabled
- Icon library: `lucide`
- Path alias for UI: `@/components/ui`
- Helper: `@/lib/utils` (resolves to `lib/utils.ts:1-6` — the `cn()` helper, verified)

To add primitives, run from the repo root:
```
npx shadcn@latest add button input label table dialog card select textarea tabs alert-dialog sonner
```

This writes files into `components/ui/<primitive>.tsx` and installs any peer deps into `package.json`. The Tailwind tokens are already in `app/globals.css:49-83` (the `:root` and `.dark` blocks) so the primitives will look correct immediately.

**Which primitives to install (from the discretion area + the requirements list):**

| Primitive | Used in |
|---|---|
| `button` | login form, sign-out, product list actions, save/cancel in form |
| `input` | all text fields (id, name, price) |
| `label` | paired with every input |
| `table` | product list page |
| `dialog` | (not strictly needed — use `alert-dialog` for confirms) |
| `card` | dashboard stats, login page panels, form sections |
| `select` | section, group, category, size enums in the form |
| `textarea` | description field |
| `tabs` | edit form tab bar (Basics / Images / Variants / Sizes) |
| `alert-dialog` | delete confirm |
| `sonner` (or hand-rolled) | toast notifications (login success, save success, error toasts) |

### 4.7 The admin proxy auth gate (the most important pattern)

This is new. Currently `app/api/admin/products/route.ts:4-25` proxies without auth. Add a `verifySession()` helper that uses `jose` to decode the `clothly_session` cookie. Use it at the top of every `/api/admin/**` route handler. Mirror the shape at:

```typescript
// lib/auth.ts (NEW)
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

const COOKIE_NAME = 'clothly_session';

export interface SessionUser {
  sub: string;
  email: string;
  role: 'admin' | 'customer';
}

export async function getSession(): Promise<SessionUser | null> {
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  if (!token) return null;

  const secret = process.env.JWT_SECRET;
  if (!secret) return null; // fail safe: don't trust any session if secret is unset

  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));
    if (typeof payload.sub !== 'string') return null;
    if (payload.role !== 'admin' && payload.role !== 'customer') return null;
    return {
      sub: payload.sub,
      email: typeof payload.email === 'string' ? payload.email : '',
      role: payload.role,
    };
  } catch {
    return null; // expired or invalid
  }
}

export async function requireAdmin(): Promise<SessionUser> {
  const session = await getSession();
  if (!session || session.role !== 'admin') {
    throw new Response('Unauthorized', { status: 401 });
  }
  return session;
}
```

Then in `app/api/admin/products/route.ts:1-25`:
```typescript
import { requireAdmin } from '@/lib/auth';

export async function GET() {
  try { await requireAdmin(); } catch (r) { return r as Response; }
  // ... existing code
}
```

(The `try { await requireAdmin(); } catch (r)` pattern is the standard App Router idiom for "this is a thrown Response, just return it as-is." Alternatively, `requireAdmin()` can throw a custom `AuthError` that the catch in the existing handler converts to a `NextResponse.json({ error: 'Unauthorized' }, { status: 401 })`.)

### 4.8 The admin chrome pattern

`app/admin/layout.tsx` is a **server component** (no `'use client'`) that fetches the current session and renders chrome. The sign-out button is the one client subcomponent (it needs `useFormState` or a `fetch` call). A clean version:

```typescript
// app/admin/layout.tsx (server component, no 'use client')
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getSession } from '@/lib/auth';
import SignOutButton from '@/components/admin/sign-out-button';
import AdminSidebar from '@/components/admin/admin-sidebar';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect('/admin/login');

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex-1">
        <header className="flex justify-end items-center border-b p-4">
          <span className="text-sm text-muted-foreground">{session.email}</span>
          <SignOutButton />
        </header>
        <main className="p-8">{children}</main>
      </div>
    </div>
  );
}
```

The login page is **NOT** under this layout — Next.js automatically scopes `app/admin/layout.tsx` to all routes under `app/admin/`. To exclude `/admin/login`, add an `if (pathname === '/admin/login')` check (or use a route group: `app/admin/(authenticated)/layout.tsx` for the authed routes and `app/admin/login/page.tsx` outside the group). The route group is cleaner; the planner should pick.

### 4.9 The login page pattern

The login page is a **server component** that renders a **client component form** (the form needs `useState` for the submit state and error display). Pattern:

```typescript
// app/admin/login/page.tsx (server component)
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import LoginForm from '@/components/admin/login-form';

interface PageProps {
  searchParams: Promise<{ denied?: string; expired?: string }>;
}

export default async function LoginPage({ searchParams }: PageProps) {
  const session = await getSession();
  if (session?.role === 'admin') redirect('/admin');

  const params = await searchParams;
  return (
    <main className="min-h-screen flex items-center justify-center">
      <LoginForm denied={params.denied === '1'} expired={params.expired === '1'} />
    </main>
  );
}
```

```typescript
// components/admin/login-form.tsx ('use client')
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
// ... uses fetch('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) })
// on success, router.push('/admin')
```

### 4.10 The form pattern (admin product create/edit)

This is the largest single piece of new UI. The shape:

```typescript
// components/admin/product-form.tsx ('use client')
'use client';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Zod schema mirrors backend/src/models/product.ts:36-54 fields exactly.
const variantSchema = z.object({
  colorName: z.string().min(1, 'Color name is required'),
  colorValue: z.string().min(1, 'Color value is required (use oklch)'),
  image: z.string().optional(),
});
const productFormSchema = z.object({
  id: z.string().min(2, 'Slug must be at least 2 characters').regex(/^[a-z0-9-]+$/, 'Lowercase letters, digits, and dashes only'),
  name: z.string().min(1, 'Name is required'),
  price: z.coerce.number().min(0, 'Price must be 0 or more'),
  image: z.string().min(1, 'Primary image is required'),
  category: z.enum(['clothing', 'shoe']),
  group: z.enum(['clothing', 'outerwear', 'shoes']),
  section: z.enum(['men', 'women', 'kids']),
  description: z.string().min(1, 'Description is required'),
  images: z.array(z.string().min(1)),
  sizes: z.array(z.string().min(1)),
  variants: z.array(variantSchema),
});

type ProductFormValues = z.infer<typeof productFormSchema>;

export default function ProductForm({ initial }: { initial?: Product }) {
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: initial ?? empty,
  });
  const { control, handleSubmit, register, formState: { errors, isSubmitting } } = form;
  const images = useFieldArray({ control, name: 'images' });
  const sizes = useFieldArray({ control, name: 'sizes' });
  const variants = useFieldArray({ control, name: 'variants' });

  const onSubmit = async (values: ProductFormValues) => {
    const url = initial ? `/api/admin/products/${initial.id}` : '/api/admin/products';
    const method = initial ? 'PUT' : 'POST';
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(values) });
    if (res.ok) router.push('/admin/products');
    else toast.error(...);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Tabs defaultValue="basics">
        <TabsList>
          <TabsTrigger value="basics">Basics</TabsTrigger>
          <TabsTrigger value="images">Images</TabsTrigger>
          <TabsTrigger value="sizes">Sizes</TabsTrigger>
          <TabsTrigger value="variants">Variants</TabsTrigger>
        </TabsList>
        <TabsContent value="basics">{/* id, name, price, category, group, section, description */}</TabsContent>
        <TabsContent value="images">{/* primary image + images[] with useFieldArray */}</TabsContent>
        <TabsContent value="sizes">{/* sizes[] with useFieldArray */}</TabsContent>
        <TabsContent value="variants">{/* variants[] with useFieldArray, including color picker */}</TabsContent>
      </Tabs>
      <Button type="submit" disabled={isSubmitting}>Save</Button>
    </form>
  );
}
```

The form lives in `components/admin/product-form.tsx` and is consumed by both `app/admin/products/new/page.tsx` (with no `initial`) and `app/admin/products/[id]/page.tsx` (with `initial` fetched server-side via `backendFetch('/shop/products/' + id)`).

### 4.11 The file upload pattern

The Next.js route handler at `app/api/admin/upload/route.ts` accepts a multipart `FormData`, validates the file, writes it to `public/images/products/`, and returns the public path:

```typescript
// app/api/admin/upload/route.ts
import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';

const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const MAX_BYTES = 5 * 1024 * 1024; // 5 MB

export async function POST(request: Request) {
  try { await requireAdmin(); } catch (r) { return r as Response; }

  const form = await request.formData();
  const file = form.get('file');
  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }
  if (!ALLOWED_TYPES.has(file.type)) {
    return NextResponse.json({ error: 'Only JPEG, PNG, or WebP allowed' }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: 'File too large (max 5MB)' }, { status: 400 });
  }

  const ext = path.extname(file.name).toLowerCase() || '.png';
  const slug = path.basename(file.name, ext).toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 40);
  const filename = `${Date.now()}-${crypto.randomUUID().slice(0, 8)}-${slug}${ext}`;

  const dir = path.join(process.cwd(), 'public', 'images', 'products');
  await mkdir(dir, { recursive: true });
  const bytes = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(dir, filename), bytes);

  return NextResponse.json({ path: `/images/products/${filename}` });
}
```

The form's image picker:
1. User picks or drops a file.
2. Client calls `POST /api/admin/upload` with `FormData` containing the file.
3. Server returns `{ path: '/images/products/...' }`.
4. Client sets the form field (`image` or `images[i]` or `variants[i].image`) to that path.

**Why a UUID suffix on top of the timestamp:** prevents collisions if two uploads land in the same millisecond.

### 4.12 The seed script pattern

```typescript
// backend/src/scripts/seed-admin.ts
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { UserModel } from '../models/user';

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) {
    console.error('ADMIN_EMAIL and ADMIN_PASSWORD are required');
    process.exit(1);
  }
  if (password.length < 12) {
    console.error('ADMIN_PASSWORD must be at least 12 characters');
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/clothly-ecommerce');
  const passwordHash = await bcrypt.hash(password, 12);

  const result = await UserModel.findOneAndUpdate(
    { email: email.toLowerCase() },
    { $set: { email: email.toLowerCase(), password: passwordHash, role: 'admin' } },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );

  console.log(`Admin upserted: ${result.email} (id=${result._id})`);
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error('seed-admin failed:', err);
  process.exit(1);
});
```

Run with: `cd backend && ADMIN_EMAIL=admin@clothly.test ADMIN_PASSWORD='long-secure-passphrase-here' npx ts-node src/scripts/seed-admin.ts`

Add a script to `backend/package.json:6-11`:
```json
"scripts": {
  "test": "echo \"Error: no test specified\" && exit 1",
  "start": "node dist/index.js",
  "dev": "nodemon src/index.ts",
  "build": "tsc",
  "seed:admin": "ts-node src/scripts/seed-admin.ts"
}
```

### 4.13 The middleware pattern

`middleware.ts` at the repo root, Edge runtime by default:

```typescript
// middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const COOKIE_NAME = 'clothly_session';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only gate /admin/** (except /admin/login)
  if (pathname === '/admin/login' || !pathname.startsWith('/admin')) {
    return NextResponse.next();
  }

  const token = request.cookies.get(COOKIE_NAME)?.value;
  const secret = process.env.JWT_SECRET;

  if (!token || !secret) {
    const url = request.nextUrl.clone();
    url.pathname = '/admin/login';
    return NextResponse.redirect(url);
  }

  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));
    if (payload.role !== 'admin') {
      const url = request.nextUrl.clone();
      url.pathname = '/admin/login';
      url.search = '?denied=1';
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  } catch {
    const url = request.nextUrl.clone();
    url.pathname = '/admin/login';
    url.search = '?expired=1';
    return NextResponse.redirect(url);
  }
}

export const config = {
  matcher: ['/admin/:path*'],
};
```

**`process.env.JWT_SECRET` in Edge runtime:** Next.js inlines env vars into the Edge bundle at build time. `JWT_SECRET` is not a `NEXT_PUBLIC_*` var, so it stays server-side and is available in middleware (it's a runtime variable injected by the platform). The Edge bundle inlines it. This works.

**Important:** when adding a new env var, also add it to `next.config.ts` `env: { JWT_SECRET: process.env.JWT_SECRET }` if the build complains. But for Next 16 / App Router, server-only env vars are usually accessible to middleware without config. If the build fails, that's the fix.

---

## 5. Don't Hand-Roll

| Problem | Don't build | Use instead | Why |
|---|---|---|---|
| Form state, validation, error messages | A custom form state machine with `useState` per field | `react-hook-form` + `zod` + `@hookform/resolvers` | RHF is the de-facto standard, has the most Stack Overflow coverage, integrates with shadcn's form recipe. Zod schemas double as TypeScript types via `z.infer`. |
| Schema validation in the admin form | Hand-written validation if/else | `zod` | The zod schema is one source of truth for both client validation and the eventual server-side validation in the Express router (the planner can re-export the same schema). |
| Multipart form parsing on the server | `multer` or `formidable` in the Express backend | Built-in `request.formData()` in a Next.js route handler | The upload endpoint is a Next.js API route (not Express), so `request.formData()` is the native path. Zero deps. |
| JWT sign/verify in the backend | Roll your own token encoding | `jsonwebtoken` | Tamper detection, expiry, standard claims. The library is small and well-audited. |
| JWT decode in Edge middleware | Try to make `jsonwebtoken` work | `jose` | `jsonwebtoken` uses Node `crypto` and won't run in Edge. `jose` is the only sensible choice. |
| Password hashing | Roll your own (or use `crypto.scrypt` directly) | `bcrypt` | Salt + slow hash + per-password salt + configurable cost factor. Writing this correctly is harder than it looks. |
| File-slug generation | Custom regex | `path.basename()` + a single regex replace | One line, no library. |
| The Tailwind merge utility | String concat for conditional classes | `cn()` from `lib/utils.ts:4-5` (already exists) | Already in the repo; use it. |
| shadcn primitives | Hand-rolling a Button, Input, Dialog | `npx shadcn@latest add button input label table dialog card select textarea tabs alert-dialog` | shadcn's primitives ARE hand-rolled (the CLI copies source), but they are accessibility-correct, Radix-based, and themed. Use them. |
| Cookie attribute string-building | Manual `Set-Cookie: ...` header | Express's `res.cookie(name, value, options)` | Parses the options correctly. |

**Key insight:** every library on this list has a specific reason for existing that the project would re-discover painfully. The total install footprint is ~6 packages (jose, react-hook-form, zod, @hookform/resolvers, jsonwebtoken, bcrypt) for an entire auth + admin CRUD + image upload stack. This is a small price.

---

## 6. Runtime State Inventory

This phase moves data from the static `lib/products.ts` catalog to MongoDB. It is a partial refactor / migration. Per protocol, answer each category:

| Category | Items Found | Action Required |
|---|---|---|
| **Stored data** | MongoDB `Product` collection will be created and seeded via `POST /shop/seed`. Currently empty (no `Product` documents in production because the backend has never been queried by the frontend). User collection will be created by `seed-admin.ts`. | **Data migration:** run `POST /shop/seed` once after backend boot. Run `seed-admin.ts` to create the first admin. After that, the storefront is the source of truth. **No existing data to preserve** — the catalog in `lib/products.ts` is the seed source. |
| **Live service config** | None. There are no live external services consuming the old static catalog path. The only "service" is the Next.js frontend, which we are about to refactor. | **Code edit only.** No live config to migrate. |
| **OS-registered state** | None. No background processes, no Task Scheduler tasks, no systemd units. `installer.sh` at repo root is a setup script (not a registered service). | **None.** |
| **Secrets and env vars** | `JWT_SECRET` (new, required), `ADMIN_EMAIL` (new, required for seeding), `ADMIN_PASSWORD` (new, required for seeding), `MONGODB_URI` (already env-driven in `backend/src/index.ts:7`), `BACKEND_URL` (already used in `lib/backend.ts:1`), `PORT` (already env-driven in `backend/src/index.ts:6`). | **Add to `.env.example`** (which doesn't exist — create it). The plan should ship a `.env.example` at the repo root that lists every required var with sensible local-dev placeholders. The actual `.env` stays gitignored (per `.gitignore`). |
| **Build artifacts** | None yet. Backend has no `dist/` until `tsc` is run. Frontend's `.next/` is gitignored. | **None.** |

**Nothing found in the "Live service config" and "OS-registered state" categories** is verified by inspecting the repo (no Docker Compose, no CI, no task scheduler, no `vercel.json`, no Fly/Render config per `INTEGRATIONS.md:51-58`).

**The full data migration path:**

1. User runs `cd backend && npm install` (adds jsonwebtoken, bcrypt, etc.).
2. User sets up `.env` at repo root: `JWT_SECRET=...`, `ADMIN_EMAIL=...`, `ADMIN_PASSWORD=...`, `BACKEND_URL=http://localhost:5000`, `MONGODB_URI=mongodb://localhost:27017/clothly-ecommerce`.
3. User runs `cd backend && npm run dev` — backend boots, Mongoose connects, `JWT_SECRET` is validated.
4. User runs `cd backend && npm run seed:admin` — admin user is upserted.
5. User runs `curl -X POST http://localhost:5000/shop/seed` (or clicks a "Seed catalog" button in the admin dashboard on first run) — 12 (or 13, depending on which seed file is used) products are upserted from `backend/src/data/products.ts:51-64` into MongoDB. **(Note: this is 12 products per the current backend seed; the frontend's `lib/products.ts:51-153` has 33. The planner must decide which to use. The CONTEXT.md says `lib/products.ts` is the seeding source-of-truth; that means the 33 products should be the seed. Either copy them to `backend/src/data/products.ts` or read from a JSON export of `lib/products.ts`. The cleanest path: add a `seed:products` script that reads `lib/products.ts` (TS-importable) and bulk-writes via `ProductModel.bulkWrite`. See `backend/src/routers/clothes.ts:174-189` for the `bulkWrite` pattern.)**
6. User starts the frontend with `npm run dev`.
7. User visits `/admin/login`, logs in with the seeded admin credentials.
8. User verifies that `/men`, `/women`, `/kids`, `/product/<id>` all show real data from MongoDB.

**If the backend is unreachable after migration (D-12):** the storefront renders the error state. The `getAdminStats()` function already handles this gracefully (`lib/admin.ts:17-25` returns `connected: false`).

---

## 7. Common Pitfalls

### Pitfall 1: `jsonwebtoken` imported in Edge middleware
**What goes wrong:** `import jwt from 'jsonwebtoken'` in `middleware.ts` compiles fine in dev but fails at build with "Module not found: Can't resolve 'crypto'" because the Edge runtime doesn't expose Node's `crypto` module.
**Why it happens:** `jsonwebtoken` is a Node-only library. The middleware runs on Edge.
**How to avoid:** Use `jose` in `middleware.ts` and in any Next.js API route that explicitly opts into Edge runtime (the default for API routes in Next 16 is Node, but middleware is always Edge). Use `jsonwebtoken` only in the Express backend.
**Warning signs:** Build error mentioning `crypto` or `node:crypto` from middleware bundle.

### Pitfall 2: `process.env.JWT_SECRET` in Edge middleware
**What goes wrong:** Next.js inlines `process.env.*` references at build time. If `JWT_SECRET` is not set in the build environment (e.g., the deployer's CI), the build succeeds but the middleware bakes in `undefined` as the secret — every token verification silently fails.
**Why it happens:** Build-time env inlining.
**How to avoid:** Document `JWT_SECRET` as a required env var. The Express backend already fails fast (D-04) — apply the same pattern to the frontend: the Next.js build can be configured to throw if a required env var is missing (via a `next.config.ts` `env` block or a small `instrumentation.ts` that runs at startup).
**Warning signs:** Middleware always redirects to `/admin/login` even with a valid token.

### Pitfall 3: Cookie not sent on the `/api/admin/**` requests
**What goes wrong:** The `lib/auth.ts` `getSession()` does `(await cookies()).get(COOKIE_NAME)?.value` and gets `undefined` for every admin API request.
**Why it happens:** The cookie is set with `path: '/'`, which SHOULD make it visible to all paths. But if the cookie was set on `localhost:3000` (Next.js) and the request goes to `localhost:5000` (Express), it's not sent because the cookie's host doesn't match the request host.
**How to avoid:** All admin API calls go through the **Next.js** proxy (`/api/admin/**`), not directly to the Express backend. The cookie is between browser and Next.js only. The Express backend never sees the cookie — it only sees the request from Next.js (which can be authenticated with the same JWT forwarded, but per D-09, the Next.js proxy is the trust boundary and the backend is auth-unaware in this phase).
**Warning signs:** `getSession()` returns `null` in API routes that the browser is clearly authenticated for.

### Pitfall 4: The seed dataset mismatch (12 vs 33)
**What goes wrong:** After running `POST /shop/seed`, the storefront shows only 12 products (the current `backend/src/data/products.ts:51-64` set), but the `lib/products.ts` has 33 products across men/women/kids. If the storefront was migrated to read from the backend, half the catalog is missing.
**Why it happens:** The backend's seed file is a subset of the frontend's hardcoded catalog.
**How to avoid:** The plan must either (a) expand `backend/src/data/products.ts` to mirror `lib/products.ts:51-153` exactly, or (b) add a `seed:products` script in the backend that reads the catalog seed from `lib/products.ts` (TS-importable from the root) and bulk-writes via the `bulkWrite` pattern at `backend/src/routers/clothes.ts:174-189`. Option (b) is cleaner because `lib/products.ts` remains the single source for seeds.
**Warning signs:** Storefront shows fewer products than before; sections are missing items.

### Pitfall 5: `lib/products.ts` mutating helpers still imported after migration
**What goes wrong:** After the storefront migration, `components/SideBar.tsx:6` still imports `getProductSection` from `@/lib/products`. The new `lib/products.ts` no longer exports that helper. The build breaks.
**Why it happens:** The migration is partial — one page moved to the backend, but a sibling component still calls the old API.
**How to avoid:** Grep the entire repo for `from '@/lib/products'` and update every importer. The hits will include:
- `app/men/page.tsx` (no, that one uses `<CategoryPage>`)
- `components/CategoryPage.tsx:8` — `getCollection` import
- `app/product/[id]/page.tsx:3` — `getProductById, getRelatedProducts`
- `app/api/products/route.ts:2` — `allProducts, catalog, getProductsBySection`
- `app/api/products/[id]/route.ts:2` — `getProductById, getRelatedProducts`
- `components/SideBar.tsx:6` — `getProductSection`
- `components/ClothingCard.tsx:6` — `type Product` (KEEP — type only, fine)
- `lib/cart-context.tsx:4` — `type Product` (KEEP — type only, fine)
- `lib/admin.ts:??` (none — it fetches the API)
- `components/ProductDetail.tsx` (likely `type Product` only)
- `components/ShoeCard.tsx` (likely `type Product` only)

**Warning signs:** TypeScript build fails with "Module has no exported member".

### Pitfall 6: `getAdminStats()` fetches a relative URL that doesn't work server-side
**What goes wrong:** `lib/admin.ts:14` does `fetch('/api/admin/products')`. In a server component, the relative URL has no base — it should be an absolute URL or use `backendFetch` directly.
**Why it happens:** Server components execute on Node, where `fetch('/api/...')` doesn't resolve.
**How to avoid:** Per CONTEXT.md, switch to `backendFetch('/shop/products')` directly in `getAdminStats()`. The function returns the same shape, so no callers break.
**Warning signs:** `getAdminStats()` returns `connected: false` even when the backend is up.

### Pitfall 7: iOS Safari zoom on form inputs
**What goes wrong:** On iOS Safari, tapping into an input with `font-size: 14px` or smaller causes the page to auto-zoom. The user has to manually zoom out.
**Why it happens:** iOS Safari zoom threshold is 16px.
**How to avoid:** All `<Input>` and `<Textarea>` in the admin form use `text-base` (16px) on mobile, not `text-sm` (14px) or smaller. Tailwind v4's `text-base` is 16px by default. The shadcn `Input` primitive is 14px by default (in shadcn's CSS). **Override the Input style in `app/globals.css` to bump its font size to 16px, or apply a `text-base` class to every Input.** [CITED: shadcn new-york style — Input default 14px.] Verify at install time.
**Warning signs:** Manual mobile testing shows the page zooms when focusing inputs.

### Pitfall 8: Image upload path traversal
**What goes wrong:** A user uploads a file named `../../etc/passwd` (or a filename with path separators), and the server writes it to a path outside `public/images/products/`.
**Why it happens:** The slug generation strips slashes, but if the code is wrong, an attacker could escape the destination.
**How to avoid:** The slug regex `/[^a-z0-9]+/g → '-'` already strips slashes. Additionally, the file is named with `Date.now()-${uuid}-${slug}${ext}` — the user-controlled part (slug) is only allowed to be lowercase letters, digits, and dashes. `path.join(publicDir, filename)` resolves the path safely. **Test with a malicious filename** to confirm.
**Warning signs:** File write error or successful write to an unexpected path.

### Pitfall 9: The product list query is slow on large datasets
**What goes wrong:** With 100+ products, the admin product list takes seconds to render.
**Why it happens:** No pagination on `GET /shop/products`.
**How to avoid:** The backend's `GET /shop/products` already returns all products (`backend/src/routers/clothes.ts:51-71`). For a phase 1 with ~33 products, this is fine. If the catalog grows past ~100, add `?limit=&offset=` to the backend. **Not in scope for this phase — flag as a follow-up.**
**Warning signs:** Dashboard load time > 1s.

### Pitfall 10: `tsconfig.json` includes backend TS files
**What goes wrong:** The root `tsconfig.json:25-32` includes `**/*.ts` with no exclude for `backend/`. The next build or `tsc --noEmit` will try to typecheck backend files using the root's frontend config (ES2017 target, bundler module resolution, `@/*` alias that doesn't exist in `backend/`).
**Why it happens:** No `exclude: ["backend"]` in the root `tsconfig.json`.
**How to avoid:** Add `"exclude": ["backend", "node_modules"]` to the root `tsconfig.json`. (STRUCTURE.md:251-252 already flagged this as a watch-item.)
**Warning signs:** Frontend `tsc` errors on `backend/src/models/user.ts` about `import` syntax.

### Pitfall 11: Wrong-case MONGODB_URI default
**What goes wrong:** The prompt's description says the URI is `mongodb://localhost:27017/Clothly-ecommerce` (mixed case). The actual code has `mongodb://localhost:27017/clothly-ecommerce` (lowercase). MongoDB database names are case-sensitive on Linux but case-insensitive on Windows (in some drivers). If the dev environment was set up against the old mixed-case name and the new code defaults to lowercase, the existing collections won't be found.
**Why it happens:** Inconsistency between the old (hardcoded mixed-case) and new (env-driven lowercase) defaults.
**How to avoid:** Document the default in `.env.example` as `mongodb://localhost:27017/clothly-ecommerce` (lowercase) and let the user override if they have an existing database.
**Warning signs:** Empty collections after migration even though the seed script "succeeded".

### Pitfall 12: `lotion`/`lightswind` style bleed
**What goes wrong:** The admin UI inherits unexpected styles from `lightswind.css` (root-level 19KB vendored file).
**Why it happens:** `lightswind.css` is imported as a Tailwind v4 plugin in `app/globals.css:2` (`@plugin 'lightswind/plugin';`). It defines global tokens that the admin will inherit.
**How to avoid:** Wrap the admin layout in a `.admin-theme` class (mirror the existing `.shop` theme at `app/globals.css:118-151`) and override the tokens there. Or accept the default — the existing tokens (cream `oklch(0.943 0.051 98.2)` background, ink `oklch(0.2 0.03 98)` foreground) already pass WCAG AA.
**Warning signs:** Admin looks visually "off" from the storefront.

---

## 8. Code Examples

Verified patterns from the existing codebase, with `file:line` citations. Use these as the ground truth — the planner can copy the shape.

### 8.1 Mongoose model (mirror this exactly)

**Source:** `backend/src/models/product.ts:36-54` (the existing `ProductModel`).

```typescript
// Pattern: interface extends Document + new Schema + mongoose.model
import mongoose, { Document, Schema } from 'mongoose';

export interface XxxDocument extends Document {
  // fields...
}

const xxxSchema = new Schema<XxxDocument>(
  { /* ... */ },
  { timestamps: true, versionKey: false },
);
xxxSchema.set('toJSON', { /* ... */ });
export const XxxModel = mongoose.model<XxxDocument>('Xxx', xxxSchema);
```

### 8.2 Express router handler (mirror this exactly)

**Source:** `backend/src/routers/clothes.ts:51-71`.

```typescript
router.get('/products', async (req, res, next) => {
  try {
    const { section, group } = req.query;
    // ... validation + business logic ...
    const products = await ProductModel.find(filter).sort({ section: 1, group: 1, name: 1 });
    return res.json({ products });
  } catch (error) {
    return next(error);
  }
});
```

### 8.3 Frontend API route proxy (mirror this exactly)

**Source:** `app/api/admin/products/route.ts:1-25`.

```typescript
import { NextResponse } from 'next/server';
import { backendFetch } from '@/lib/backend';

export async function GET() {
  try {
    const data = await backendFetch('/shop/products');
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Could not reach the product backend', offline: true },
      { status: 502 },
    );
  }
}
```

### 8.4 The `cn()` helper (use this everywhere)

**Source:** `lib/utils.ts:1-6` (verified).

```typescript
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

### 8.5 The Tailwind v4 token set

**Source:** `app/globals.css:49-83` (the `:root` block) and `:84-116` (the `.dark` block) and `:118-151` (the `.shop` theme).

The admin theme can mirror the `.shop` theme, or use the default `:root` tokens. Both are cream-on-ink (high contrast, AA passing).

### 8.6 The `getAdminStats` pattern

**Source:** `lib/admin.ts:13-42` (verified). The function already returns the right shape for the dashboard. Switch it to use `backendFetch('/shop/products')` instead of a relative `fetch('/api/admin/products')` so it works in server components without auth-gate issues (Pitfall 6).

### 8.7 The shadcn config

**Source:** `components.json` (verified). `new-york` style, neutral base, lucide icons, Tailwind entry `app/globals.css`, path alias `@/components/ui`. Run `npx shadcn@latest add <primitive>` to install each.

---

## 9. State of the Art

| Old approach | Current approach | When changed | Impact |
|---|---|---|---|
| `pages/api/*.ts` serverless functions for backend-for-frontend | Next.js App Router route handlers (`app/api/**/route.ts`) | Next.js 13+ (App Router stable), Next 16 in 2025 | App Router handlers use Web `Request`/`Response`, not Node `req`/`res`. They run in the Node runtime by default. The proxy pattern at `app/api/admin/products/route.ts:4-25` uses this. |
| `getServerSideProps` for data fetching | Server components that `await` data directly | Next 13+ (RSC) | `app/product/[id]/page.tsx:23-29` is a server component. Migration to the backend is a one-line change: replace `getProductById(id)` with `await backendFetch(\`/shop/products/${id}\`)`. |
| Express + Passport for auth | Express + `jsonwebtoken` for stateless JWT | Stable for years; Passport is still valid but more than we need | The current project is auth-less (`INTEGRATIONS.md:39-42`); we add hand-rolled JWT per D-02. |
| `bcryptjs` (pure JS) for serverless | `bcrypt` (native) for long-lived Node | Since 2017 | This project is NOT serverless. Use `bcrypt`. |
| `jsonwebtoken` for all JWT work | `jose` for Edge runtime, `jsonwebtoken` for Node | `jose` emerged ~2019 for edge runtimes; became required when Next middleware moved to Edge in Next 12 | We use `jose` in middleware (Edge) and `jsonwebtoken` in Express (Node). |
| `multer` / `formidable` for multipart in Express | `request.formData()` in Next.js route handlers | Next 13+ | Our upload is a Next route handler, so native `request.formData()`. |
| Hardcoded Mongo URI | Env-driven with dev default + prod warning | Industry best practice | Already partial in `backend/src/index.ts:7`; just add the prod warning log. |
| `styled-components` everywhere | Tailwind v4 + `cn()` for new code | Tailwind v4 released 2025, this project adopted it | The new admin code uses Tailwind + shadcn. `styled-components` is preserved for existing components (`CONVENTIONS.md:138` notes the coexistence is intentional). |
| Custom form state | `react-hook-form` + `zod` | Stable for 5+ years | shadcn's recipe uses RHF + zod. |
| Hand-rolled error boundary per page | `app/error.tsx` + `app/<route>/error.tsx` | Next 13+ | Add `app/error.tsx` for the global error state (D-12: "clear error state, not stale data"). |

**Deprecated/outdated:**
- ~~Express 4~~ → Express 5 (this project is already on 5, `backend/package.json:17`).
- ~~Mongoose 8~~ → Mongoose 9 (`backend/package.json:18`).
- ~~Next 15~~ → Next 16 (`package.json:25`).
- ~~React 18~~ → React 19 (`package.json:28`).
- ~~Tailwind v3~~ → Tailwind v4 (`package.json:35`).

---

## 10. Assumptions Log

These are claims tagged `[ASSUMED]` (training-data knowledge, not verified in this session). The planner and discuss-phase should treat them as needing user confirmation.

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | `bcrypt@^5` and `jsonwebtoken@^9` are the current stable major versions on npm. | §3.3 | The plan installs specific versions; if a v10 or v4 is out, the install fails or pins to a stale version. Mitigation: `npm view <pkg> version` at install time per the package-legitimacy protocol. |
| A2 | `jose@^5` is the current major. | §3.3 | Same as A1. |
| A3 | `react-hook-form@^7`, `zod@^3`, `@hookform/resolvers@^3` are the current majors. | §3.3 | Same as A1. zod v4 (released in 2025) is a major API change; if the user wants zod v4, the form code might need adjustments. **Verify at install time.** |
| A4 | `sonner@^1` is the current major. | §3.3 | Minor — if the plan chooses the hand-rolled toast instead, this is moot. |
| A5 | `npm install bcrypt` works on the user's machine without native-build tooling (Python, make, C++). | §3.2 | The native build fails on a clean Windows install without VS Build Tools. Mitigation: `bcryptjs` is a drop-in fallback. |
| A6 | The user's Node version is 20+ as `STACK.md:99` claims. | §3.3 | If Node 18 or earlier, `Buffer.from(await file.arrayBuffer())` in the upload handler may behave differently. Verify with `node --version` per the Environment Availability audit below. |
| A7 | Next.js middleware inlines server-side env vars (`JWT_SECRET`) at build time. | §7 Pitfall 2 | If Next 16 changes this behavior, the middleware silently uses `undefined` and the build needs explicit `env` config. Verify by testing the build with a missing `JWT_SECRET`. |
| A8 | The 33-product catalog in `lib/products.ts:51-153` is the intended seed, not the 12-product subset in `backend/src/data/products.ts:51-64`. | §6 Runtime State Inventory | The plan's choice on this drives whether we expand the backend seed file or add a frontend-driven seed script. The CONTEXT.md D-12 says `lib/products.ts` is the seeding source — so the 33 are the seed. But this is worth confirming with the user. |
| A9 | The 33 products in `lib/products.ts:51-153` have correct, complete data (description, sizes, images) that can be ingested as-is. | §6 | If any are placeholder, the seed will create incomplete products. The review found that `lib/products.ts:34-49` defines shared `apparelSizes`, `mensSizes`, `kidsSizes`, `adultShoeSizes`, `womensShoeSizes`, `kidsShoeSizes` — all non-empty. The `coreVariants` (`:51-56`) are shared across products. Looks good. |
| A10 | Adding `tsconfig.json` `exclude: ["backend"]` won't break any current build. | §7 Pitfall 10 | If the backend's TS files are intentionally typechecked by the root config (unlikely given `backend/tsconfig.json` is separate), this exclusion would break it. Verify with `tsc --noEmit` before/after. |

---

## 11. Open Questions

1. **Seed data source — 33 or 12 products?**
   - What we know: `lib/products.ts:51-153` has 33 products. `backend/src/data/products.ts:51-64` has 12. CONTEXT.md D-12 says `lib/products.ts` is the source of truth.
   - What's unclear: Are the 33 the seed, or is the backend's 12 a more curated subset?
   - Recommendation: Use the 33 from `lib/products.ts`. Add a `seed:products` script in the backend that imports the seed arrays from `lib/products.ts` (which is TS-importable) and bulk-writes them via the `ProductModel.bulkWrite` pattern at `backend/src/routers/clothes.ts:174-189`. This keeps a single source of truth.

2. **Toast library — `sonner` or hand-rolled?**
   - What we know: Both are valid per D-Discretion. `sonner` is ~3KB gzipped and well-maintained.
   - What's unclear: The user preference. The brand voice in `PRODUCT.md:13-15` ("considered, warm, intentional") doesn't directly answer.
   - Recommendation: Hand-rolled. A 30-line context + 3-second timer is more in keeping with the "restraint over decoration" tone for a utility admin panel. The planner can upgrade to `sonner` later if more toast features are needed.

3. **What happens to the existing `category: 'shoe' | 'clothing'` field in the backend's `clothes.ts:47`?**
   - What we know: The schema at `backend/src/models/product.ts:42` has `category: enum ['clothing', 'shoe']`. The frontend has `ProductCategory = 'clothing' | 'shoe'` at `lib/products.ts:10`. They match.
   - What's unclear: Nothing — this is consistent.
   - Recommendation: Use as-is.

4. **Is the seed file `lib/products.ts` keeping the `product()` builder function?**
   - What we know: The `product()` function at `lib/products.ts:62-72` is a helper that fills in `image`, `images`, and `variants` for a product. It depends on `productImages`, `coreVariants`.
   - What's unclear: Whether to keep this in the file after migration or move it to a dedicated `lib/product-seeds.ts` (cleaner separation).
   - Recommendation: Move the `product()` helper and its supporting arrays (`productImages`, `coreVariants`, size arrays) to a new file `lib/product-seeds.ts`. Keep `lib/products.ts` as just the `Product` type and `ProductVariant` type (re-exports from this file or kept here as the canonical type). This makes the seed data clearly importable by the backend's `seed:products` script.

5. **What happens to the home page (`app/page.tsx`)?**
   - What we know: `app/page.tsx:1-14` composes `HeroHome`, `AboutPage`, `ContactSection`. It does NOT currently read products.
   - What's unclear: Per D-11, the home page is in the list of "every storefront read currently in `lib/products.ts`". But it doesn't actually read products. Does it need to fetch featured products for a section?
   - Recommendation: Inspect `components/HeroHome.tsx` and `components/AboutPage.tsx` during planning. If neither reads products, `app/page.tsx` is already on the live backend (because it doesn't read products at all). If `HeroHome` or `AboutPage` reads products (e.g., for `BounceCards` or `MagicBento`), they need the same migration as `CategoryPage`. **The planner must read those files.**

---

## 12. Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js 20+ | Next 16 (`package.json:25`), `@types/node ^20` (`package.json:39`) | To verify: run `node --version`. STACK.md:99 says yes. | Expected 20.x or 22.x | None — required. |
| MongoDB at `localhost:27017` | Backend Mongoose connect | To verify: `mongosh --eval 'db.runCommand({ping: 1})'` or check if `mongodb://localhost:27017/clothly-ecommerce` is reachable. STACK.md:100 says required. | Local | Use a remote Mongo (Atlas) by setting `MONGODB_URI` to the connection string. |
| Express 5 | Backend already running | Installed (`backend/package.json:17`) | `^5.2.1` | — |
| Mongoose 9 | Backend already running | Installed (`backend/package.json:18`) | `^9.2.1` | — |
| shadcn/ui CLI | Adding new primitives | `npx shadcn@latest add ...` | Latest | — |
| `bcrypt` native build | New backend dep | `cd backend && npm install bcrypt` should work on Node 20 + Windows with VS Build Tools. | — | `bcryptjs` (drop-in) if native build fails. |
| `jsonwebtoken` | New backend dep | `cd backend && npm install jsonwebtoken` | — | `jose` (works in both Node and Edge, slightly different API). |
| `jose` | New root dep | `npm install jose` | — | — |
| `react-hook-form`, `zod`, `@hookform/resolvers` | New root deps | `npm install ...` | — | — |
| Git | Phase commit workflow | Already in use (`.git/` present) | — | — |

**Verification commands to run before executing this phase:**

```bash
node --version                    # must be 20+
mongosh --eval 'db.runCommand({ping:1})'  # must return ok:1
npm --version                     # must be 10+ for `npm view` to work
```

**Missing dependencies with no fallback:** Node 20+ and a local MongoDB. Both are required to boot the backend.

**Missing dependencies with fallback:** `bcrypt` (if native build fails, swap to `bcryptjs`).

---

## 13. Validation Architecture

> `workflow.nyquist_validation` is not set in `.planning/config.json` (no config.json exists at `.planning/`). Default: enabled. Include this section.

### Test Framework
- **Framework:** None. The project has no `jest.config.*` / `vitest.config.*` and no test script in either `package.json`. `backend/package.json:7` has the default `echo "Error: no test specified" && exit 1` stub.
- **Config file:** None.
- **Quick run command:** None.
- **Full suite command:** None.

Because no test framework is set up, this phase uses **manual UAT** as the validation strategy. The plan should NOT add a test framework in scope — that's a follow-up phase concern. The validation is the manual test plan below.

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Manual Test Command | File Exists? |
|--------|----------|-----------|---------------------|--------------|
| AUTH-01 | User model exists with correct schema | Smoke | `cd backend && npx ts-node -e "import('./src/models/user').then(m => console.log(m.UserModel.schema.paths))"` | ✅ New |
| AUTH-02 | `POST /auth/login` and `POST /auth/logout` exist | Smoke | `curl -i http://localhost:5000/auth/login -X POST -H 'Content-Type: application/json' -d '{"email":"x@x","password":"y"}'` | ✅ New |
| AUTH-03 | httpOnly cookie set on login | Smoke | Login then `curl -i --cookie-jar cookies.txt http://localhost:5000/auth/login ...` — response should have `Set-Cookie: clothly_session=...; HttpOnly; SameSite=Lax` | ✅ New |
| AUTH-04 | `JWT_SECRET` missing → server fails fast | Smoke | `cd backend && unset JWT_SECRET && npm run dev` — should exit 1 with FATAL log | ✅ New |
| AUTH-05 | Seed script creates admin | Smoke | `cd backend && ADMIN_EMAIL=a@a ADMIN_PASSWORD=longpassphrase12 npm run seed:admin` — then check `mongosh ... db.users.find()` | ✅ New |
| AUTH-06 | Middleware blocks unauthenticated /admin | Smoke | Visit `/admin` in browser without logging in → redirected to `/admin/login` | ✅ New |
| AUTH-07 | `/api/auth/login` and `/api/auth/logout` work | Smoke | `curl -i -X POST http://localhost:3000/api/auth/login -H 'Content-Type: application/json' -d '{"email":"a@a","password":"longpassphrase12"}'` — should set cookie and return 200 | ✅ New |
| AUTH-08 | `/api/admin/**` rejects unauthenticated | Smoke | Without cookie: `curl -i http://localhost:3000/api/admin/products` → 401 | ✅ New |
| ADMIN-01 | Dashboard renders stats | Manual | Log in, visit `/admin` — see real counts | ✅ New |
| ADMIN-02 | Product list shows all products | Manual | Log in, visit `/admin/products` — see table of products | ✅ New |
| ADMIN-03 | Create product form works end-to-end | Manual | Log in, visit `/admin/products/new`, fill, save → redirected to `/admin/products` → new product visible | ✅ New |
| ADMIN-03 | Edit form works end-to-end | Manual | Log in, visit `/admin/products/<id>`, change name, save → storefront `/product/<id>` shows new name | ✅ New |
| ADMIN-04 | Repeatable rows work | Manual | Add/remove an image row in the edit form, save → re-fetch, count matches | ✅ New |
| ADMIN-05 | Delete confirm dialog | Manual | Click delete on a row → AlertDialog appears → confirm → row disappears | ✅ New |
| ADMIN-06 | Tabs in edit form | Manual | Open an edit page → 4 tabs visible → click each → its fields render | ✅ New |
| ADMIN-07 | Image upload works | Manual | In edit form, drop a JPG → preview appears → save → image is on disk and reachable at `/images/products/...` | ✅ New |
| ADMIN-08 | Sign-out works | Manual | Click sign-out → redirected to `/admin/login` → cookie cleared → revisiting `/admin` redirects to login | ✅ New |
| STORE-01 | Storefront reads from backend | Manual | After migration, visit `/men`, `/women`, `/kids` → products render. Add a product in admin → refresh → product appears in storefront. | ✅ Modify |
| STORE-02 | `/api/products` proxies to backend | Smoke | `curl http://localhost:3000/api/products?section=men` → returns products from the backend, not the static file | ✅ Modify |
| STORE-03 | Seed endpoint works | Smoke | `curl -X POST http://localhost:5000/shop/seed` → returns `{ ok: true, upserted: N }` | ✅ Existing (`backend/src/routers/clothes.ts:174-189`) |
| STORE-04 | `lib/products.ts` no longer exports mutating helpers | Smoke | `grep -r "from '@/lib/products'" app components lib` — only `type Product` / `type ProductVariant` imports remain | ✅ Modify |
| STORE-05 | All new fetches are uncached | Smoke | `grep "cache: 'no-store'" lib/backend.ts` — present (D-13) | ✅ Existing (`lib/backend.ts:12`) |
| HYGIENE-01 | `start` script is correct | Smoke | `cd backend && cat package.json | grep start` → `node dist/index.js` | ✅ Already correct (`backend/package.json:8`) |
| HYGIENE-02 | `MONGODB_URI` warning in prod | Smoke | `NODE_ENV=production cd backend && npm run dev` (with `MONGODB_URI` unset) → warning log appears | ✅ Modify (`backend/src/index.ts:7`) |
| HYGIENE-03 | `JWT_SECRET` required | Smoke | `cd backend && unset JWT_SECRET && npm run dev` → exits 1 | ✅ New |

### Sampling Rate
- **Per task commit:** Manual smoke of the touched feature (e.g., when committing the login page, verify login works end-to-end).
- **Per wave merge:** Full manual UAT pass through the manual test plan below.
- **Phase gate:** Full manual UAT pass plus the storefront migration verification (admin edit → storefront reflects).

### Wave 0 Gaps

No test framework exists. The plan does NOT introduce one (out of scope for this phase). The "Wave 0" is the **env file + first boot** — a single task that:
1. Creates `.env.example` at the repo root with all required vars.
2. Creates `.env` (gitignored) for local dev with safe defaults.
3. Runs `cd backend && npm install` and root `npm install`.
4. Boots the backend (`cd backend && npm run dev`) and the frontend (`npm run dev`).
5. Runs `cd backend && npm run seed:admin` with a placeholder admin.
6. Calls `curl -X POST http://localhost:5000/shop/seed` to populate products.

If any of these steps fail, the phase is blocked — nothing else can be tested.

### Manual Test Plan (executed at phase gate)

1. **Cold boot:** `cd backend && npm install && npm run dev` — backend starts, no errors.
2. **Seed admin:** `cd backend && ADMIN_EMAIL=admin@clothly.test ADMIN_PASSWORD='clothly-admin-pass-12' npm run seed:admin` — admin user is upserted.
3. **Seed products:** `curl -X POST http://localhost:5000/shop/seed` — products are populated.
4. **Boot frontend:** `npm install && npm run dev` — frontend starts.
5. **Verify storefront without login:** Visit `/men`, `/women`, `/kids`, `/product/<id>`. All show real products from MongoDB. If backend is killed and the page is refreshed, the storefront shows a clear error (not stale data).
6. **Visit `/admin` without login:** Redirected to `/admin/login`.
7. **Try `/admin` with a customer role cookie (impossible to get without seeding, but possible via curl):** Redirected to `/admin/login?denied=1`.
8. **Login at `/admin/login`:** Enter seeded admin creds → redirected to `/admin` → dashboard shows real stats.
9. **Visit `/admin/products`:** Table shows all seeded products.
10. **Click "New":** Create form renders with all fields and 4 tabs.
11. **Fill and save:** Product created → redirected to list → new product visible.
12. **Click new product to edit:** Edit form pre-populated.
13. **Drop a JPG on the image field:** Upload succeeds → preview appears → save → product's image path is updated and the image is reachable at `/images/products/...`.
14. **Add a sizes row, save:** Sizes updated.
15. **Add a variant, save:** Variants updated.
16. **Edit the product name, save:** Storefront `/product/<id>` shows the new name on next visit.
17. **Click delete on a row:** AlertDialog appears with the product name → confirm → row disappears from list, product is gone from storefront.
18. **Sign out:** Click sign-out → redirected to `/admin/login` → visiting `/admin` again redirects to login.
19. **Re-login:** Works.
20. **Try with expired token:** Manually set a JWT with `exp: past` in the cookie, visit `/admin` → redirected to `/admin/login?expired=1`.

---

## 14. Security Domain

> `security_enforcement` is not in `.planning/config.json`. Default: enabled. Include this section.

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|------------------|
| V2 Authentication | yes | `bcrypt` password hashing, JWT-based session. Single-factor (email + password) for v1. |
| V3 Session Management | yes | httpOnly cookie, `SameSite=Lax`, 7-day expiry, JWT signed with HS256, JWT in payload. |
| V4 Access Control | yes | Role-based: `admin` vs `customer`. Middleware enforces `role === 'admin'` on `/admin/**`. API route handlers re-verify before proxying to backend. |
| V5 Input Validation | yes | Zod schemas in the admin form, plus the existing `validateProductPayload` at `backend/src/routers/clothes.ts:39-49`. Multipart file upload validated for MIME type and size. |
| V6 Cryptography | yes | `bcrypt` (not MD5/SHA). `jsonwebtoken` with HS256. `crypto.randomUUID()` for filename suffix. `JWT_SECRET` must be ≥ 32 bytes random in production (enforce in `.env.example` docs). |

### Known Threat Patterns

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Credential stuffing / brute force on login | Spoofing | Out of scope for v1 — note as a follow-up. Could add `express-rate-limit` to the `/auth/login` endpoint. |
| NoSQL injection via `req.query` | Tampering | Already mitigated — `backend/src/routers/clothes.ts:56-64` validates `section` and `group` against a `Set` of allowed values before passing to `ProductModel.find()`. The new `auth.ts` should validate `email` (string) and `password` (string) the same way before passing to `UserModel.findOne()`. |
| JWT secret brute force | Spoofing | `JWT_SECRET` must be ≥ 32 bytes random. The seed script and boot-time check should log a warning if the secret is shorter than 32 chars. |
| Cookie theft via XSS | Information Disclosure | `httpOnly: true` prevents JS from reading the cookie. SameSite=Lax prevents most CSRF. The admin UI is server-rendered; if any admin page has an XSS vulnerability (e.g., unsanitized product name rendered), the attacker still cannot read the cookie, but they can make requests on behalf of the user (CSRF). The SameSite=Lax attribute mitigates this. |
| File upload abuse (path traversal, oversized files, wrong MIME) | Tampering, DoS | The upload handler at `app/api/admin/upload/route.ts` (new) enforces: MIME type in `{jpeg, png, webp}`, size ≤ 5MB, filename slug regex `[^a-z0-9]+ → -`, filename prefix is `Date.now()-${randomUUID}-`. See §4.11. |
| Mass assignment in `POST /shop/products` | Elevation of Privilege | The backend's `productPayload()` at `backend/src/routers/clothes.ts:23-37` is a whitelist — only the fields in the returned object are sent to Mongoose. `role` is NOT in this list, so even if a user could craft a request, they cannot set `role: 'admin'` on a Product. The User model must use the same whitelist in the `auth.ts` login handler. |
| CSRF on `/auth/login` (forcing a user to log in as a different account) | Spoofing | SameSite=Lax on the cookie mitigates this. For higher assurance, add a CSRF token to the login form (double-submit cookie pattern), but this is v2 work. |
| Session fixation | Spoofing | The JWT is created fresh on every login (`POST /auth/login` issues a new token). The old token (if any) is replaced when the new cookie is set. No session fixation risk. |
| Admin impersonation via stolen JWT | Spoofing | Mitigated by the 7-day expiry. A follow-up phase could add a token revocation list. |

### STRIDE coverage summary

- **S**poofing: bcrypt + JWT + cookie + role check.
- **T**ampering: zod input validation + whitelist field projection.
- **R**epudiation: No audit log (deferred per D-deferred). Each login would ideally write a `LoginEvent` document; not in scope.
- **I**nformation Disclosure: httpOnly cookie + selective `toJSON` transform on the User model.
- **D**enial of Service: Login endpoint not rate-limited (deferred). File upload size-limited. No mitigations for large request floods.
- **E**levation of Privilege: Middleware + API route handler both check `role === 'admin'`. Backend does not trust client claims of `role`.

---

## 15. Sources

### Primary (HIGH confidence — verified by reading the repo)

- `01-CONTEXT.md` — Locked decisions D-01..D-24, scope, deferred ideas.
- `.planning/codebase/STACK.md` — Stack versions.
- `.planning/codebase/STRUCTURE.md` — Directory layout and naming.
- `.planning/codebase/CONVENTIONS.md` — Patterns.
- `.planning/codebase/ARCHITECTURE.md` — Data flow, anti-patterns.
- `.planning/codebase/INTEGRATIONS.md` — Auth, DB, file storage.
- `package.json` (root) — Frontend dependencies.
- `backend/package.json` — Backend dependencies.
- `backend/src/index.ts` — Express bootstrap, Mongoose, env vars.
- `backend/src/routers/clothes.ts` — All product CRUD + seed.
- `backend/src/models/product.ts` — Mongoose schema.
- `backend/src/data/products.ts` — Seed dataset.
- `lib/backend.ts` — `backendFetch` helper.
- `lib/admin.ts` — `getAdminStats()`.
- `lib/products.ts` — Static catalog, types, mutating helpers.
- `lib/utils.ts` — `cn()` helper.
- `lib/cart-context.tsx` — Client cart context.
- `app/api/admin/products/route.ts` — Existing admin proxy.
- `app/api/admin/products/[id]/route.ts` — Existing admin proxy.
- `app/api/products/route.ts` — Static catalog route.
- `app/api/products/[id]/route.ts` — Static catalog route.
- `components.json` — shadcn/ui config.
- `app/globals.css` — Tailwind v4 + tokens.
- `app/layout.tsx` — Root layout.
- `app/page.tsx` — Home.
- `app/men/page.tsx`, `app/women/page.tsx`, `app/kids/page.tsx` — Section pages.
- `app/product/[id]/page.tsx` — Product detail (server component).
- `components/SideBar.tsx` — `getProductSection` usage.
- `components/CategoryPage.tsx` — `getCollection` usage.
- `components/ClothingCard.tsx` — `type Product` import.
- `next.config.ts` — Empty.
- `tsconfig.json` — Frontend TS config (no `exclude: ["backend"]`).
- `backend/tsconfig.json` — Backend TS config.
- `components/Providers.tsx` — Provider composition.
- `components/Navbar.tsx` — Top nav (partially read).
- `PRODUCT.md` — Brand voice.
- `.planning/ROADMAP.md` — Phase 1 scope.
- `.planning/STATE.md` — Current state, pre-existing issues.

### Secondary (MEDIUM confidence — cited from official docs in training data)

- [shadcn/ui form recipe](https://ui.shadcn.com/docs/components/form) — `react-hook-form` + `zod` + `@hookform/resolvers` is the recommended pairing.
- [Next.js App Router route handlers](https://nextjs.org/docs/app/building-your-application/routing/route-handlers) — `request.formData()` is the native multipart parser.
- [Next.js middleware](https://nextjs.org/docs/app/building-your-application/routing/middleware) — runs on Edge runtime; `process.env.*` server-side vars are available.
- [`jose` library docs](https://github.com/panva/jose) — `jwtVerify(token, secret)` for Edge-safe JWT decode.
- [`jsonwebtoken` library docs](https://github.com/auth0/node-jsonwebtoken) — `jwt.sign(payload, secret, { expiresIn: '7d' })` for Node-side JWT sign.
- [`bcrypt` library docs](https://github.com/kelektiv/node.bcrypt.js) — `bcrypt.hash(password, 12)` for password hashing.

### Tertiary (LOW confidence — to be verified at install time)

- Latest stable versions of `bcrypt@^5`, `jsonwebtoken@^9`, `jose@^5`, `react-hook-form@^7`, `zod@^3`, `@hookform/resolvers@^3`, `sonner@^1`. These are current as of my knowledge cutoff (Jan 2026) but should be confirmed with `npm view <pkg> version` at install time per the package-legitimacy protocol.
- The package-legitimacy check itself was NOT run in this session (the seam was not invoked). The plan should run `gsd_run query package-legitimacy check --ecosystem npm bcrypt jsonwebtoken jose react-hook-form zod @hookform/resolvers` before installing to ensure none are flagged as `SLOP` (per the protocol).

---

## 16. Metadata

**Confidence breakdown:**

| Area | Level | Reason |
|------|-------|--------|
| Standard Stack (existing) | HIGH | Read directly from `package.json` files. |
| Standard Stack (new deps) | MEDIUM | Versions are training-data-based; verify with `npm view` at install. Library choice (bcrypt vs bcryptjs, jose vs jsonwebtoken) is grounded in the project's runtime context (CommonJS Node, Edge middleware) and is HIGH confidence. |
| Architecture | HIGH | Mirrors existing patterns (`backend/src/routers/clothes.ts:51-71`, `app/api/admin/products/route.ts:1-25`, `lib/backend.ts:7-22`). |
| Pitfalls | HIGH | Derived from direct code reads (e.g., `getAdminStats` uses relative URL, root `tsconfig.json` lacks `backend` exclude, `lib/products.ts` has mutating helpers used in multiple files). |
| Security | MEDIUM | Standard STRIDE coverage. Specific rate-limiting and CSRF details are MEDIUM because they're deferred; could change in future phases. |
| Validation | MEDIUM | No test framework exists; manual UAT plan is exhaustive but not automated. |

**Research date:** 2026-07-30

**Valid until:** 2026-08-30 (30 days). The stack (Next 16, React 19, Express 5, Mongoose 9, Tailwind v4) is stable. The new packages to install (`bcrypt`, `jsonwebtoken`, `jose`, `react-hook-form`, `zod`) have been stable for years. Re-verify if the project upgrades Next or Mongoose.
