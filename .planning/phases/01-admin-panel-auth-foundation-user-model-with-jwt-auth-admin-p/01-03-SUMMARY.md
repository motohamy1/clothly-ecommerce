---
phase: "01"
plan: "01-03"
subsystem: ui
tags: [auth-ui, middleware, login, admin, shadcn]

requires:
  - phase: "01-02"
    provides: lib/auth.ts (getSession, requireAdmin), JWT cookie auth
provides:
  - Edge middleware gating /admin/** with redirects (denied=1, expired=1)
  - Login page at /admin/login with brand-voice form and error messages
  - Authenticated admin chrome (ink sidebar, topbar, session re-validation)
  - shadcn primitives: button, input, label, card (16px inputs for iOS)
  - react-hook-form + zod + @hookform/resolvers for form validation
  - Sign-out button (POST /api/auth/logout, redirect to /admin/login)
affects: [01-04, 01-05, 01-06]

tech-stack:
  added:
    - react-hook-form@^7 (root)
    - zod@^3 (root)
    - @hookform/resolvers@^3 (root)
  patterns:
    - Edge middleware using jose.jwtVerify (not jsonwebtoken)
    - Route group (authenticated) for scoped layout
    - Defense in depth: middleware + layout session re-validation

key-files:
  created:
    - middleware.ts
    - app/admin/login/page.tsx
    - app/admin/(authenticated)/layout.tsx
    - components/admin/login-form.tsx
    - components/admin/admin-sidebar.tsx
    - components/admin/sign-out-button.tsx
    - components/ui/button.tsx
    - components/ui/input.tsx
    - components/ui/label.tsx
    - components/ui/card.tsx

key-decisions:
  - Active sidebar: 1px warm-amber left bar + white text (no dot, no glow)
  - Login form: 380px card, 2px warm-amber rule, full-width ink button
  - Icons: bare lucide-react, no boxes/tiles behind them
  - Error messages: brand-voice, specific (UI-SPEC copy)
  - Layout re-validates getSession() on every render (defense in depth)

patterns-established:
  - Admin UI structure: route group + layout + sidebar + topbar + main
  - Form handling: react-hook-form + zod + @hookform/resolvers

requirements-completed:
  - AUTH-05
  - AUTH-06
  - ADMIN-07

coverage:
  - id: D1
    description: Edge middleware gates /admin/** with proper redirects (denied, expired)
    requirement: AUTH-05
    verification:
      - kind: manual_procedural
        ref: "middleware.ts exists with jwtVerify import and matcher: ['/admin/:path*']"
        status: pass
    human_judgment: false
  - id: D2
    description: Login page renders brand-voice form with shadcn primitives
    requirement: AUTH-06
    verification:
      - kind: manual_procedural
        ref: "test -f app/admin/login/page.tsx && test -f components/admin/login-form.tsx"
        status: pass
    human_judgment: false
  - id: D3
    description: Admin chrome with ink sidebar, active bar, sign-out, session re-validation
    requirement: ADMIN-07
    verification:
      - kind: manual_procedural
        ref: "test -f app/admin/(authenticated)/layout.tsx && test -f components/admin/admin-sidebar.tsx"
        status: pass
    human_judgment: false

duration: 20min
completed: 2026-07-30
status: complete
---

# Plan 01-03: Auth UI — middleware, login page, admin chrome

**Edge middleware gate, login page with brand-voice form, ink admin chrome with sidebar and sign-out**

## Performance

- **Duration:** ~20 min
- **Completed:** 2026-07-30
- **Tasks:** 3/3 complete
- **Files modified:** 12

## Accomplishments
- Edge middleware using jose.jwtVerify for /admin/** gating
- Login page at /admin/login with UI-SPEC copy and tokens
- react-hook-form + zod login form with proper error handling
- Admin chrome: ink sidebar (220px), warm-amber active bar, bare icons
- Sign-out button that clears cookie and redirects
- shadcn primitives installed (button, input, label, card) with 16px inputs
- Route group (authenticated) for scoped admin layout

## Task Commits

1. **Task 01-03-01: Install deps + shadcn primitives** - `37e6c4d` (feat)
2. **Task 01-03-02: Middleware + login page** - `37e6c4d` (feat)
3. **Task 01-03-03: Admin chrome (layout, sidebar, sign-out)** - `37e6c4d` (feat)

## Files Created/Modified
- `middleware.ts`
- `app/admin/login/page.tsx`
- `app/admin/(authenticated)/layout.tsx`
- `components/admin/login-form.tsx`
- `components/admin/admin-sidebar.tsx`
- `components/admin/sign-out-button.tsx`
- `components/ui/button.tsx`, `input.tsx`, `label.tsx`, `card.tsx`
- `package.json` — react-hook-form, zod, @hookform/resolvers

## Decisions Made
- Active sidebar state is a 1px warm-amber left bar, not a dot or underline
- Icons are bare lucide-react components with no container box
- Defense in depth: middleware + layout both validate session
- Inputs use text-base (16px) for iOS zoom prevention

## Deviations from Plan
None — plan executed exactly as specified.

## Next Phase Readiness
- Auth UI complete, ready for admin API auth gate (Plan 01-04)
- Login form ready to POST to /api/auth/login
- Admin chrome serves as wrapper for dashboard and product pages
