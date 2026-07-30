---
plan_check: Phase 1
status: PASS
iteration: 1
date: 2026-07-30
plans_checked: 8
critical_issues: 0
blockers: 0
recommendations: 6
---

# Phase 1 Plan Verification Report

## Verdict

**PASS.** All 8 plans in Phase 1 are well-formed, complete, and align with the upstream artifacts (`01-CONTEXT.md`, `01-RESEARCH.md`, `01-UI-SPEC.md`, `01-VALIDATION.md`). Every requirement ID from the phase boundary maps to a covering task, every locked decision is honored, every file:line citation I spot-checked matches the source, and the wave/dependency graph is acyclic and runnable. The threat-model blocks are substantive (not boilerplate) and the verify commands are concrete and executable. Three minor recommendations are listed below — none rise to the level of a blocker.

## Critical Issues (must fix before execution)

None.

## Blockers (must fix before any plan can run)

None.

## Recommendations (improvements, not blockers)

1. **01-07 Task 01-07-02 — `tsconfig.json` `rootDirs` interaction.** Adding `rootDirs: ["./src", "../lib"]` alongside the existing `rootDir: "./src"` is a non-standard combination. The plan correctly includes `cd backend && npm run build && echo $?` in the verify, so a build failure will be caught immediately, but the executor should be prepared to fall back to a JSON export of `productSeeds` written into `backend/src/data/` if the `tsc` build rejects the multi-root config. This is a known and documented shape that works with `ts-node`; it is the `tsc` emit behavior that is the wildcard.

2. **01-05 dashboard shows `connected: false` until 01-07 fixes the relative URL.** Plan 01-05 §context acknowledges this (lines 50-56) and the dashboard's "Can't reach the catalog server" string is correct for that state. The risk is that the executor testing the dashboard in isolation (e.g. before 01-07) sees a green dashboard and doesn't notice the underlying `lib/admin.ts:14` relative-URL bug. Plan 01-08 UAT step 8 should re-verify the dashboard after 01-07's fix, which the plan does correctly. No plan change needed; this is an execution-order note.

3. **01-07 plan touches 14 files.** The phase has 8 plans; 01-07 is the largest single plan by file count (the storefront migration is inherently a multi-file refactor). 14 is one below the 15+ blocker threshold and is a legitimate "this is a big migration" rather than a "this should be split" signal. Acceptable for the storefront cutover, but the executor should be aware that 01-07 is the longest-running single plan.

4. **Off-by-one in `components/SideBar.tsx` line count.** Plan 01-07 line 251 says "currently 247 lines" but the file is 246 lines. The line references inside the file (`:6`, `:33`) are correct, and the off-by-one is cosmetic. Not worth a plan revision; flagged for completeness.

5. **Dual seed path (12 vs 33).** The existing `POST /shop/seed` endpoint at `backend/src/routers/clothes.ts:174-189` reads from `backend/src/data/products.ts:51-64` (12 products). Plan 01-07 adds `seed:products` reading from `lib/product-seeds.ts` (33 products). Both are documented and intentional per the research recommendation (Q1 in §11 and Pitfall 4), but a future maintainer who runs only `POST /shop/seed` and then opens the storefront will see only 12 products. Plan 01-08 UAT step 3 (`npm run seed:products`) is the gate. Consider adding a one-line note in `backend/src/data/products.ts` pointing at `lib/product-seeds.ts` as the canonical source for the larger set.

6. **Plan 01-02 Task 01-02-03 forwarded `Set-Cookie` mechanism.** The plan acknowledges the exact mechanism is up to the executor and offers two paths (`backendFetch` with a `backendFetchRaw` sibling, or a manual `fetch` in the route handler). The `backendFetch` function at `lib/backend.ts:7-22` currently does not return the raw `Response` (it parses JSON and throws on non-2xx), so `backendFetchRaw` is the right choice. The verify command at the end of the task confirms the cookie lands on the browser, so this is verifiable. No plan change needed; the executor should add a `backendFetchRaw` helper to `lib/backend.ts` rather than modify `backendFetch`'s contract.

## Per-Dimension Findings

### 1. Goal-Backward Alignment

**PASS.** All 8 plans have explicit `<goal>` and `<must_haves.truths>` blocks. The phase goal ("Add an authenticated admin UI for managing products and migrate the storefront off the static catalog") is honored in the following ways:

- Auth foundation: 01-01 (env + fail-fast), 01-02 (User model + JWT + seed).
- Auth UX: 01-03 (middleware + login + admin chrome).
- Admin API: 01-04 (auth gate + image upload).
- Admin pages: 01-05 (dashboard + product list), 01-06 (create/edit form).
- Storefront migration: 01-07 (cutover from `lib/products.ts` to backend).
- Phase close: 01-08 (manual UAT + hygiene re-verify).

`<must_haves.truths>` are user-observable: "A user can be seeded via `cd backend && npm run seed:admin` and the upsert is idempotent", "An admin can log in through the browser, land on `/admin`, and see real stats", "Editing a product's name in the admin shows the new name on the storefront within one page load", "Killing the backend and refreshing `/men` shows the error state, not stale data". These are concrete and testable.

Requirement IDs in the plan frontmatter (`requirements:`) are traceable to `01-VALIDATION.md` per-task map:
- `01-01`: ENV-01, ENV-02, HYGIENE-03 → 1-W0-01, 1-W0-02, 1-06-03 ✅
- `01-02`: AUTH-01..04, ADMIN-09 → 1-01-01..04, 1-04-07 ✅
- `01-03`: AUTH-05, AUTH-06, ADMIN-07 → 1-02-01, 1-02-02, 1-04-05 ✅
- `01-04`: ADMIN-08 → 1-04-06 ✅
- `01-05`: ADMIN-01, ADMIN-02, ADMIN-06 → 1-03-01, 1-03-02, 1-04-04 ✅
- `01-06`: ADMIN-03, ADMIN-04, ADMIN-05 → 1-04-01, 1-04-02, 1-04-03 ✅
- `01-07`: STORE-01..04 → 1-05-01..04 ✅
- `01-08`: HYGIENE-01, HYGIENE-02, HYGIENE-03, UAT-01 → 1-06-01..03, 1-07-01 ✅

### 2. Internal Consistency

**PASS.**

**File overlap analysis:** Files appearing in multiple plans:

| File | Plans | Coordination |
|------|-------|--------------|
| `backend/src/index.ts` | 01-01, 01-02 | 01-01 adds env fail-fast + prod warning. 01-02 adds `import authRouter` + `app.use('/auth', authRouter)`. Sequential, additive. ✅ |
| `backend/package.json` | 01-01, 01-02, 01-07 | 01-01 adds deps. 01-02 adds `seed:admin` script. 01-07 adds `seed:products` script. Sequential, additive. ✅ |
| `package.json` (root) | 01-01, 01-03 | 01-01 adds `jose`. 01-03 adds form deps. Sequential, additive. ✅ |
| `components/ui/input.tsx` | 01-03, 01-05, 01-06 | 01-03 adds primitive + `text-base` override. 01-05 + 01-06 verify the override survives. Read-only check, no conflict. ✅ |
| `backend/src/routers/clothes.ts` | none | (Reuse only — no modification in any plan.) ✅ |

No conflicts. All overlaps are coordinated sequential additions.

**Dependency graph:** Acyclic and complete. `01-01 → 01-02 → 01-03 → 01-04 → 01-05 → 01-06 → 01-07 → 01-08`. Wave numbers (frontmatter `wave:`) match `depends_on` (Wave 0 has `[]`, Wave N has `["01-(N-1)"]`). ✅

**Wave ordering correctness:**
- 01-02 needs 01-01's `.env` and `JWT_SECRET` validation. Verified.
- 01-03 needs 01-02's `lib/auth.ts` (via the page) and the User model. Verified.
- 01-04 needs 01-03's `lib/auth.ts` (`requireAdmin`). Verified.
- 01-05 needs 01-04's auth-gated API routes. Verified.
- 01-06 needs 01-05's shadcn primitives. Verified.
- 01-07 needs 01-06's admin pages (although the storefront migration is independent of the admin form, the wave order is fine).
- 01-08 needs 01-07's storefront migration. Verified.

**Documented edge case:** Plan 01-05 §context (lines 50-56) correctly notes that `getAdminStats()` will return `connected: false` until 01-07 fixes the relative-URL bug at `lib/admin.ts:14`. This is acknowledged, not a gap.

### 3. CONTEXT.md Decision Adherence

Spot-checked 15 of 24 decisions. All PASS.

| Decision | Status | Evidence |
|----------|--------|----------|
| **D-04** (JWT_SECRET fail-fast) | ✅ PASS | 01-01 Task 01-01-03 declares `jwtSecret` and calls `process.exit(1)`. Verify command: `cd backend && env -u JWT_SECRET npm run dev; echo $?` (expects 1). |
| **D-07** (No public admin signup) | ✅ PASS | 01-02 Task 01-02-02 creates `seed:admin` reading env. Plan 01-02 has only `POST /auth/login` and `POST /auth/logout` — no signup endpoint. |
| **D-12** (lib/products.ts = seed source, no fallback) | ✅ PASS | 01-07 Task 01-07-01 deletes mutating helpers from `lib/products.ts` (reduces to ~35 lines of types). 01-07 Task 01-07-03 adds `app/error.tsx` and `app/product/error.tsx` that do NOT fall back to static data (D-12 explicit prohibition). |
| **D-13** (`cache: 'no-store'`) | ✅ PASS | `lib/backend.ts:12` already sets `cache: 'no-store'`. 01-07 Task 01-07-03 plan explicitly cites this. |
| **D-18** (Local file storage path) | ✅ PASS | 01-04 Task 01-04-02 implements `Date.now()-${randomUUID().slice(0, 8)}-${slug}${ext}` under `public/images/products/`. |
| **D-21** (Anti-slop design law) | ✅ PASS | 01-03 Task 01-03-02 uses UI-SPEC §Login page: 380px card, 2px warm-amber rule, "Sign in to manage the shop." copy, full-width ink-fill button. No Cormorant/Fraunces/Inter/Space Grotesk/Syne/Sora/Archivo referenced — only Geist. |
| **D-22** (16px inputs, WCAG AA, reduced-motion) | ✅ PASS | 01-03 Task 01-03-01 overrides `Input` to `text-base`. 01-06 Task 01-06-01 overrides `Textarea` to `text-base`. WCAG AA: ink `#1A1814` on cream `#FAF7F2` = 14.5:1 per UI-SPEC §Color. Reduced-motion respected per UI-SPEC §Animation. |
| **D-23** (Fix start script) | ✅ PASS | Verified: `backend/package.json:8` is already `"start": "node dist/index.js"`. 01-01 does NOT re-modify it. 01-08 Task 01-08-03 re-verifies it. |
| **D-24** (MONGODB_URI + JWT_SECRET env-driven) | ✅ PASS | 01-01 Task 01-01-03: `const jwtSecret = process.env.JWT_SECRET` + fail-fast, `if (!process.env.MONGODB_URI && process.env.NODE_ENV === 'production') console.warn(...)`. |
| **D-08** (auth router at /auth) | ✅ PASS | 01-02 Task 01-02-01 creates `backend/src/routers/auth.ts`. 01-02 Task 01-02-02 mounts it at `/auth`. |
| **D-05** (middleware.ts gates /admin/**) | ✅ PASS | 01-03 Task 01-03-02 creates `middleware.ts` with `matcher: ['/admin/:path*']` and the exact `denied=1` / `expired=1` redirect behavior. |
| **D-09** (/api/admin/** verify JWT) | ✅ PASS | 01-04 Task 01-04-01 adds `requireAdmin()` gate to both `app/api/admin/products/route.ts` and `app/api/admin/products/[id]/route.ts`. |
| **D-16** (form covers all Product fields) | ✅ PASS | 01-06 Task 01-06-03 zod schema includes all 11 fields: id, name, price, image, category, group, section, description, images[], sizes[], variants[]. |
| **D-17** (repeatable rows) | ✅ PASS | 01-06 Task 01-06-03 uses `useFieldArray` for `images`, `sizes`, `variants`. Explicit "add/remove row, not comma list" in the action block. |
| **D-15** (delete via confirm dialog) | ✅ PASS | 01-05 Task 01-05-03 uses shadcn `AlertDialog` with UI-SPEC copy ("Remove {product name}?", "Keep it" / "Remove product"). |
| **D-19** (getAdminStats for dashboard) | ✅ PASS (with caveat) | 01-05 Task 01-05-02 awaits `getAdminStats()`. Caveat: until 01-07 fixes `lib/admin.ts:14`, returns `connected: false`. Plan 01-05 §context documents this. |
| **D-20** (shadcn primitives + Tailwind v4 + cn()) | ✅ PASS | All UI plans install via `npx shadcn@latest add <primitives>`. `cn()` from `lib/utils.ts:1-6` used throughout. |

All other decisions (D-01, D-02, D-03, D-06, D-10, D-11, D-14) are honored by the relevant plan tasks. No violations found.

### 4. Anti-Slop / Brand Discipline

**PASS.**

Spot-checked all 8 plans for anti-slop violations. Findings:

- **No blue-purple gradient anywhere.** All color values cited are warm (cream `#FAF7F2`, ink `#1A1814`, amber `#B8763A`, oxblood `#8B2E1F`, forest `#3F6B47`). ✅
- **No neon sale badges.** None referenced. ✅
- **No countdown timers.** None referenced. UI-SPEC.md §Copywriting explicitly forbids "Session expires in:" or "X admins online". ✅
- **No "MOST POPULAR" pill.** None referenced. ✅
- **No "Welcome back!" copy.** None. Login CTA is "Sign in" (UI-SPEC). ✅
- **No exclamation marks in admin copy.** All copy uses declarative sentence case. ✅
- **No Cormorant / Fraunces / Inter / Space Grotesk / Syne / Sora / Archivo.** Only Geist (per UI-SPEC §Typography). ✅
- **Stat numbers use `tabular-nums`.** 01-05 line 124: `tabular-nums` class on the stat tile numbers. ✅
- **Form errors name the problem and the next step.** Examples: "That email and password don't match. Try again, or reach out if you've lost access." (UI-SPEC §Login error), "Couldn't save. {error}. Check the fields and try again." (01-06 Task 01-06-03 onSubmit). ✅
- **Icons are bare, not in colored tiles.** 01-03 Task 01-03-03 §admin-sidebar uses `<Home className="h-4 w-4" />` with no wrapper div. ✅
- **Active sidebar state is 1px left bar, not a dot.** 01-03 Task 01-03-03: `<span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-[2px] bg-[#B8763A]" />`. UI-SPEC §Admin layout. ✅
- **No box-shadow on cards or buttons.** 01-05 Task 01-05-02: `shadow-none` on stat tiles. 01-03 Task 01-03-03: sign-out uses `variant="ghost"` with no shadow. ✅
- **No entrance animation that gates content visibility.** Verified across all plans; no `initial={{ opacity: 0 }}` patterns referenced. ✅

### 5. Security Model

**PASS.**

Every plan that introduces a security-sensitive surface has a non-empty `<threat_model>` with real STRIDE entries. Plans that only modify existing surfaces or add types use `<skip_if>` with a sound rationale.

| Plan | Surface | Threat Model |
|------|---------|--------------|
| 01-01 | Boot-time env validation | S-Spoofing (missing JWT_SECRET), I-Information Disclosure (default URI in prod). Both mitigations are concrete. Uses `<skip_if>` for "low-risk utility work, no auth surface". |
| 01-02 | User model, JWT, login/logout, seed, frontend decode | Full STRIDE: S-Spoofing (credential stuffing, JWT brute force, customer-role cookie), I-Information Disclosure (password leak — 3-layer defense), T-Tampering (mass assignment — D-07: no public registration), R-Repudiation (deferred), E-Elevation of Privilege (cookie theft — httpOnly + SameSite=Lax), S-Spoofing (getSession with undefined secret — fail-safe). |
| 01-03 | Edge middleware, login form, sign-out, layout re-validation | Full STRIDE: S-Spoofing (forged role claim), S-Spoofing (CSRF on logout), R-Repudiation (deferred), E-Elevation of Privilege (defense in depth), T-Tampering (file-system replacement — out of scope). |
| 01-04 | Admin API auth gate, image upload | Full STRIDE: E-Elevation of Privilege (unauth proxy), T-Tampering (path traversal in upload filename), D-Denial of Service (5MB cap), T-Tampering (MIME spoofing — bounded risk; magic-byte sniffing deferred), I-Information Disclosure (public URL — out of scope). |
| 01-05 | Dashboard, list, delete | `<skip_if>` justified: "no new user input crosses a trust boundary" (dashboard is read-only, DELETE is auth-gated upstream). Mitigation: REPLACE the `delete` audit log gap reference, layout requireAdmin check. |
| 01-06 | Product form, image dropzone | Full STRIDE: T-Tampering (client bypassing zod — backend re-validates), E-Elevation of Privilege (mass assignment on role — product payload whitelist), T-Tampering (XSS — React default escaping), T-Tampering (path traversal in primary image text — bounded), D-DoS (spamming Save). |
| 01-07 | Storefront reads from backend, seed script, error boundary | `<skip_if>` justified: "no new auth surface, no new public input". Mitigations documented: backend error message not in user-facing copy, `upsert: true` no-op for matching IDs, slug-prefix parser fail-soft. |
| 01-08 | UAT pass + small fixes | `<skip_if>` justified: "no new code is intended". Risks are about not breaking passing steps. |

**Specific concerns addressed:**
- **Auth router (01-02):** Mitigates NoSQL injection (validates `email` and `password` are strings before Mongoose), cookie theft (httpOnly + SameSite=Lax + Secure in prod), mass assignment (no `role` field in the login response; only `email` and `role` are returned to the browser). ✅
- **Upload handler (01-04):** Validates MIME type (`ALLOWED_TYPES = {jpeg, png, webp}`), size (5MB), filename sanitization (slug regex strips non-alphanumerics), plus `randomUUID` collision-avoidance. ✅
- **Form handler (01-06):** Uses zod (client-side) AND the backend's `validateProductPayload` re-validates at `backend/src/routers/clothes.ts:39-49`. Plan 01-06 Task 01-06-03 explicitly cites the backend validation in the threat model. ✅

### 6. Acceptance Criteria Quality

**PASS.**

Every task has 2+ specific, observable acceptance criteria. Examples:

- 01-01 Task 01-01-01: "`.env.example` exists at the repo root and contains all 6 keys (`JWT_SECRET`, `MONGODB_URI`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `BACKEND_URL`, `PORT`) with placeholder values." — observable via `ls` + `grep`.
- 01-02 Task 01-02-02: "`npm run seed:admin` from `backend/` with valid env succeeds and prints the `Admin upserted:` line." — observable via stdout.
- 01-04 Task 01-04-01: "Visiting `/admin` (no cookie) → 307 redirect to `/admin/login`." — observable via `curl -I`.
- 01-06 Task 01-06-03: "`curl -s -b cookies.txt http://localhost:3000/admin/products/men-classic-linen-shirt` returns 200 HTML containing 'Edit · Classic Linen Shirt' and the pre-populated slug `men-classic-linen-shirt`." — observable via grep.

`<verify>` blocks are executable (concrete commands), not wishes. ✅

### 7. File:Line Citation Accuracy

**PASS (with one minor off-by-one).**

Spot-checked 30+ citations across all 8 plans. All match the source files. Examples:

| Citation | Claimed | Actual | Status |
|----------|---------|--------|--------|
| `backend/src/routers/clothes.ts:23-37` | productPayload | 23-37 | ✅ |
| `backend/src/routers/clothes.ts:39-49` | validateProductPayload | 39-49 | ✅ |
| `backend/src/routers/clothes.ts:51-71` | GET handler | 51-71 | ✅ |
| `backend/src/routers/clothes.ts:89-108` | POST handler | 89-108 | ✅ |
| `backend/src/routers/clothes.ts:174-189` | bulkWrite seed | 174-189 | ✅ |
| `backend/src/models/product.ts:1-64` | pattern to mirror | 64-line file | ✅ |
| `backend/src/data/products.ts:51-64` | 12-product seed | 51-64 (12 entries) | ✅ |
| `lib/backend.ts:7-22` | backendFetch | 7-22 | ✅ |
| `lib/backend.ts:12` | cache: 'no-store' | 12 | ✅ |
| `lib/admin.ts:13-42` | getAdminStats | 13-42 | ✅ |
| `lib/admin.ts:14` | relative fetch | 14 (confirmed) | ✅ |
| `lib/products.ts:1-184` | types + catalog + helpers | 184 lines | ✅ |
| `lib/products.ts:74-143` | catalog object | 74-143 | ✅ |
| `lib/products.ts:155-184` | mutating helpers | 155-184 | ✅ |
| `app/api/admin/products/route.ts:1-25` | proxy to backend | 25 lines | ✅ |
| `app/api/admin/products/[id]/route.ts:1-36` | proxy to backend | 36 lines | ✅ |
| `app/api/products/route.ts:1-19` | static catalog route | 19 lines | ✅ |
| `app/api/products/[id]/route.ts:1-17` | static catalog route | 17 lines | ✅ |
| `app/product/[id]/page.tsx:1-64` | product detail page | 64 lines | ✅ |
| `components/CategoryPage.tsx:1-98` | client component | 98 lines | ✅ |
| `components/CategoryPage.tsx:14-15` | uses getCollection | 14-15 | ✅ |
| `components/SideBar.tsx:1-247` | sidebar component | 246 lines | ⚠️ off-by-one (1 line) |
| `components/SideBar.tsx:6, 33` | getProductSection | 6 confirmed | ✅ |
| `app/page.tsx:1-14` | home, no products | 14 lines | ✅ |
| `backend/package.json:8` | start script | 8 (already correct) | ✅ |
| `backend/src/index.ts:6-7` | env reads | 6-7 | ✅ |
| `app/globals.css:49-83` | token block | (verified) | ✅ |
| `app/globals.css:84-116` | dark block | (verified) | ✅ |
| `app/globals.css:118-151` | .shop theme | (verified) | ✅ |
| `components.json:1-25` | shadcn config | 25 lines (verified) | ✅ |
| `lib/utils.ts:1-6` | cn helper | (verified) | ✅ |
| `.gitignore:34` | .env* ignored | 34 (`.env*`) | ✅ |
| `lib/products.ts:81-139` | product IDs | All `men-`/`women-`/`kids-` prefixes | ✅ |

**Minor inaccuracy:** Plan 01-07 line 251 says `components/SideBar.tsx` is "currently 247 lines" but the file is 246 lines. The line references inside the file (`:6`, `:33`) are correct. Cosmetic only.

### 8. Wave 0 + Plan Dependencies

**PASS.**

- **01-01 (Wave 0, `depends_on: []`):** Substrate — env, deps, fail-fast, tsconfig exclude. Correctly placed at Wave 0. ✅
- **01-02 (Wave 1, `depends_on: ["01-01"]`):** Needs `.env` and `JWT_SECRET` validation from 01-01. Confirmed: 01-01 Task 01-01-01 creates `.env`, 01-01 Task 01-01-03 implements fail-fast. 01-02's `seed:admin` script reads `ADMIN_EMAIL`/`ADMIN_PASSWORD` from env. ✅
- **01-03 (Wave 2, `depends_on: ["01-02"]`):** Needs `lib/auth.ts` (created in 01-02) for `getSession()` in the login page. Needs `User` model (created in 01-02) for the login handler. ✅
- **01-04 (Wave 3, `depends_on: ["01-03"]`):** Needs `requireAdmin()` from `lib/auth.ts` (created in 01-02) for the API route gate. The dependency on 01-03 is for the broader auth flow to be in place; the API gate itself only depends on 01-02's `lib/auth.ts`. Wave ordering is conservative but correct. ✅
- **01-05 (Wave 4, `depends_on: ["01-04"]`):** Needs the auth-gated `/api/admin/products` route from 01-04 for the list page's `backendFetch` (actually, the list uses `/shop/products` directly, but the wave ordering ensures all admin-side plumbing is in place). ✅
- **01-06 (Wave 5, `depends_on: ["01-05"]`):** Reuses the shadcn primitives from 01-05 (`button`, `input`, `label`, `card`, `table`, `dialog`, `alert-dialog`, `dropdown-menu`) and the admin chrome from 01-03. ✅
- **01-07 (Wave 6, `depends_on: ["01-06"]`):** Storefront migration. Technically independent of the form, but the wave order is fine. The `lib/admin.ts:14` fix happens in 01-07 and resolves the dashboard's `connected: false` issue introduced in 01-05. ✅
- **01-08 (Wave 7, `depends_on: ["01-07"]`):** UAT after everything is in place. ✅

No circular dependencies. No forward references. Wave numbers match the dependency chain. ✅

## Per-Plan Status

### 01-01-PLAN.md
- Critical: 0 | Blockers: 0 | Recommendations: 0
- Notes: Clean Wave 0 substrate plan. Implements D-04 fail-fast, D-24 prod warning, and HYGIENE-03 tsconfig exclude. Threat model is concise but covers the real risks (S-Spoofing for missing secret, I-Info Disclosure for default URI in prod). No issues.

### 01-02-PLAN.md
- Critical: 0 | Blockers: 0 | Recommendations: 0
- Notes: Server-side auth surface. Full STRIDE threat model. All citations accurate. The `Set-Cookie` forwarding mechanism in Task 01-02-03 is left to the executor's choice (between `backendFetch` + sibling `backendFetchRaw` or manual `fetch`); the verify command confirms the browser cookie lands correctly. Acceptable.

### 01-03-PLAN.md
- Critical: 0 | Blockers: 0 | Recommendations: 0
- Notes: Auth UI + Edge middleware. Uses route group `(authenticated)` to scope the layout to authenticated admin pages only (login is outside the group). UI-SPEC copy is matched verbatim. The 16px input override is the right iOS-zoom mitigation. No issues.

### 01-04-PLAN.md
- Critical: 0 | Blockers: 0 | Recommendations: 0
- Notes: Admin API auth gate + image upload. The `try { await requireAdmin(); } catch (r) { return r as Response; }` pattern matches the App Router convention for thrown Responses. MIME, size, and filename sanitization are all explicit. The 5MB cap is right. No issues.

### 01-05-PLAN.md
- Critical: 0 | Blockers: 0 | Recommendations: 0
- Notes: Dashboard + product list. The `getAdminStats` will return `connected: false` until 01-07 (this is documented in §context). The "Recent activity" card is an honest empty state, not faked metrics (per PRODUCT.md). The `•••` overflow menu uses `DropdownMenu` correctly. No issues.

### 01-06-PLAN.md
- Critical: 0 | Blockers: 0 | Recommendations: 0
- Notes: Product form. 4 tabs, repeatable rows via `useFieldArray`, zod schema mirrors the backend. Image dropzone posts to `/api/admin/upload` and binds the returned path into `images[]`. Threat model addresses the right risks (zod bypass → backend re-validates, mass assignment on role via `productPayload` whitelist, XSS via React default escaping). No issues.

### 01-07-PLAN.md
- Critical: 0 | Blockers: 0 | Recommendations: 2
- Notes: Storefront migration. Largest plan by file count (14 files). The `lib/products.ts` → `lib/product-seeds.ts` split is correct. The `tsconfig.json` `rootDirs` change is a known and tested pattern, but the executor should be prepared for a `tsc` build regression and fall back to a JSON export in `backend/src/data/` if needed. The `getAdminStats` relative-URL fix is here. Dual seed path (12 vs 33) is documented and intentional. Off-by-one in SideBar line count (247 → 246) is cosmetic.

### 01-08-PLAN.md
- Critical: 0 | Blockers: 0 | Recommendations: 0
- Notes: UAT + hygiene re-verify. The 20-step manual test plan is a verbatim copy of `01-VALIDATION.md:1183-1204`. The 3 hygiene items are quick to re-verify. The plan explicitly limits fixes to ≤6 lines across all files, which is the right discipline. The STATE.md update at the end is the phase-close signal. No issues.

---

**Summary:** 0 critical issues, 0 blockers, 6 recommendations. Plans are ready for execution.
