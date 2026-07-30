---
phase: 1
slug: admin-panel-auth-foundation-user-model-with-jwt-auth-admin-product-crud-ui
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-07-30
---

# Phase 1 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

The project has no test framework. The plan does NOT introduce one (out of scope for this phase). Validation is **manual UAT** with smoke checks via `curl` for HTTP boundaries.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | None — manual UAT only |
| **Config file** | None |
| **Quick run command** | `curl -i http://localhost:5000/...` and `curl -i http://localhost:3000/...` |
| **Full suite command** | Manual 20-step UAT (see below) |
| **Estimated runtime** | ~5–10 minutes end-to-end |

---

## Sampling Rate

- **After every task commit:** Manual smoke of the touched feature (login, dashboard, list, create, edit, delete, sign-out, storefront reflection).
- **After every plan wave:** Full manual UAT pass through the manual test plan below.
- **Before `/gsd-verify-work`:** Full manual UAT must be green.
- **Max feedback latency:** ~30 seconds (booting both servers is the slow part).

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 1-W0-01 | 01 | 0 | ENV-01 | T-01 | `JWT_SECRET` required, fails fast | Smoke | `cd backend && unset JWT_SECRET && npm run dev` → exits 1 | ✅ New | ⬜ pending |
| 1-W0-02 | 01 | 0 | ENV-02 | T-02 | `MONGODB_URI` env-driven with prod warning | Smoke | `cd backend && grep -n MONGODB_URI src/index.ts` | ✅ New | ⬜ pending |
| 1-01-01 | 02 | 1 | AUTH-01 | T-03 | User model with hashed password, no `password` in JSON | Smoke | `curl -s http://localhost:5000/shop/users -X POST` rejected (no public route) | ✅ New | ⬜ pending |
| 1-01-02 | 02 | 1 | AUTH-02 | T-04 | Login issues JWT, sets httpOnly cookie | Smoke | `curl -i -X POST .../auth/login -d '{...}'` | ✅ New | ⬜ pending |
| 1-01-03 | 02 | 1 | AUTH-03 | T-05 | Logout clears cookie | Smoke | `curl -i -X POST .../auth/logout` → `Set-Cookie: ...; Max-Age=0` | ✅ New | ⬜ pending |
| 1-01-04 | 02 | 1 | AUTH-04 | T-06 | Seed script idempotent (upsert) | Smoke | Run twice, only one admin in DB | ✅ New | ⬜ pending |
| 1-02-01 | 03 | 2 | AUTH-05 | T-07 | Middleware blocks unauthenticated `/admin` | Manual | Browser visit → redirect to `/admin/login` | ✅ New | ⬜ pending |
| 1-02-02 | 03 | 2 | AUTH-06 | T-08 | Middleware blocks non-admin role | Manual | Forge a customer cookie → redirect to `/admin/login?denied=1` | ✅ New | ⬜ pending |
| 1-03-01 | 04 | 3 | ADMIN-01 | T-09 | Dashboard renders real stats | Manual | Log in, see real counts (not faked) | ✅ New | ⬜ pending |
| 1-03-02 | 04 | 3 | ADMIN-02 | T-09 | Product list table | Manual | All seeded products in rows | ✅ New | ⬜ pending |
| 1-04-01 | 05 | 4 | ADMIN-03 | T-10 | Create form (all fields, 4 tabs) | Manual | Save → row appears in list | ✅ New | ⬜ pending |
| 1-04-02 | 05 | 4 | ADMIN-04 | T-10 | Edit form pre-populated | Manual | Change name → storefront reflects on next visit | ✅ New | ⬜ pending |
| 1-04-03 | 05 | 4 | ADMIN-05 | T-10 | Image upload (MIME + size enforced) | Manual | Drop JPG → preview → save → file on disk | ✅ New | ⬜ pending |
| 1-04-04 | 05 | 4 | ADMIN-06 | T-10 | Delete confirm (AlertDialog) | Manual | Click delete → confirm → row gone | ✅ New | ⬜ pending |
| 1-04-05 | 05 | 4 | ADMIN-07 | T-10 | Sign-out | Manual | Sign out → cookie cleared → `/admin` redirects to login | ✅ New | ⬜ pending |
| 1-04-06 | 05 | 4 | ADMIN-08 | T-11 | `/api/admin/**` rejects unauthenticated | Smoke | `curl -i http://localhost:3000/api/admin/products` → 401 | ✅ New | ⬜ pending |
| 1-04-07 | 05 | 4 | ADMIN-09 | T-11 | `/api/auth/**` proxy works | Smoke | `curl -i -X POST http://localhost:3000/api/auth/login ...` | ✅ New | ⬜ pending |
| 1-05-01 | 06 | 5 | STORE-01 | T-12 | Storefront reads from backend | Manual | Kill backend, refresh `/men` → clear error (not stale) | ✅ Modify | ⬜ pending |
| 1-05-02 | 06 | 5 | STORE-02 | T-12 | Admin edit reflects on storefront immediately | Manual | Edit name in admin → refresh `/product/<id>` → new name | ✅ Modify | ⬜ pending |
| 1-05-03 | 06 | 5 | STORE-03 | T-12 | `lib/products.ts` no longer exports mutating helpers | Smoke | `grep -r "getProductSection\|getCollection\|getProductById" app components lib` — no results | ✅ Modify | ⬜ pending |
| 1-05-04 | 06 | 5 | STORE-04 | T-13 | Seed endpoint populated from frontend | Smoke | `curl -X POST http://localhost:5000/shop/seed` → 33 products in DB | ✅ Modify | ⬜ pending |
| 1-06-01 | 07 | 6 | HYGIENE-01 | T-14 | `start` script correct | Smoke | `cat backend/package.json \| grep start` → `node dist/index.js` | ✅ Already correct | ⬜ pending |
| 1-06-02 | 07 | 6 | HYGIENE-02 | T-14 | `MONGODB_URI` warning in prod | Smoke | `NODE_ENV=production MONGODB_URI= npm run dev` → warning log | ✅ Modify | ⬜ pending |
| 1-06-03 | 07 | 6 | HYGIENE-03 | T-14 | Root `tsconfig.json` excludes `backend/` | Smoke | `grep -A2 '"exclude"' tsconfig.json` | ✅ Modify | ⬜ pending |
| 1-07-01 | 08 | 7 | UAT-01 | — | Full manual UAT (20 steps) | Manual | All 20 steps pass | — | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

No test framework exists. The "Wave 0" is the **env file + first boot** — a single task that:

- [ ] `.env.example` at repo root with all required vars (`JWT_SECRET`, `MONGODB_URI`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `BACKEND_URL`, `PORT`)
- [ ] `.env` (gitignored) for local dev with safe defaults
- [ ] `cd backend && npm install` (installs `jsonwebtoken`, `bcrypt`, `@types/*`)
- [ ] `npm install` at root (installs `jose`, `react-hook-form`, `zod`, `@hookform/resolvers`, `sonner` if used)
- [ ] `cd backend && npm run dev` — backend starts
- [ ] `npm run dev` — frontend starts
- [ ] `cd backend && npm run seed:admin` — admin user upserted
- [ ] `curl -X POST http://localhost:5000/shop/seed` — products populated

If any of these steps fail, the phase is blocked — nothing else can be tested.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Login form UX (error states, copy tone) | ADMIN-09 | Visual / copy | Enter wrong creds → error message matches brand voice (no generic "invalid credentials" template) |
| Dashboard empty state | ADMIN-01 | Visual | With no products in DB, dashboard shows an honest empty state (not a fake "0 products today" widget) |
| Form field interactions | ADMIN-03 | Visual | Tab through form → focus order is logical, all controls keyboard-reachable |
| iOS input zoom prevention | D-22 | Visual | On mobile Safari, all inputs render at ≥ 16px |
| Reduced-motion respect | D-22 | Visual | `prefers-reduced-motion: reduce` → no scroll reveals or hover animations play |
| Brand-voice copy in admin | D-21 | Editorial | Sign-out confirmation, error states, empty states read like the rest of Clothly (not stock admin) |
| Image upload dropzone UX | ADMIN-05 | Visual | Drag-and-drop feedback, error on wrong MIME, success state |
| Color contrast (WCAG 2.1 AA) | D-22 | A11y | Run axe DevTools or Lighthouse on every admin page |
| No urgency theater | D-21 | Editorial | No countdown timers, no "X admins online," no "session expires in 5:00" — just calm auth UX |

*If none: "All phase behaviors have automated verification." — N/A; this phase is primarily manual.*

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 30s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
