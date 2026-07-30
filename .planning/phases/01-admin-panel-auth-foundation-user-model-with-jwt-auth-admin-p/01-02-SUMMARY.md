---
phase: "01"
plan: "01-02"
subsystem: auth
tags: [jwt, user-model, auth, backend, cookies]

requires:
  - phase: "01-01"
    provides: env-var contract (JWT_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD), jose, jsonwebtoken, bcrypt deps
provides:
  - Mongoose User model (email, bcrypt-hashed password, role)
  - Express auth router at /auth with POST login/logout
  - JWT clothly_session httpOnly cookie (HS256, 7-day expiry)
  - seed:admin script (idempotent upsert from env vars)
  - lib/auth.ts with getSession / requireAdmin using jose
  - Next.js proxy routes at /api/auth/login and /api/auth/logout
affects: [01-03, 01-04]

tech-stack:
  patterns:
    - Express async-try-catch-next error handling
    - Mongoose select: false + toJSON transform for password safety
    - JWT auth with httpOnly + SameSite=Lax cookies
    - Next.js App Router route handlers as auth proxies

key-files:
  created:
    - backend/src/models/user.ts
    - backend/src/routers/auth.ts
    - backend/src/scripts/seed-admin.ts
    - lib/auth.ts
    - app/api/auth/login/route.ts
    - app/api/auth/logout/route.ts
  modified:
    - backend/src/index.ts
    - backend/package.json

key-decisions:
  - Password field: select: false at schema level + toJSON transform strip (defense in depth)
  - JWT: HS256, 7-day expiry, no refresh token in this phase
  - seed:admin: password length floor of 12 characters, bcrypt cost 12
  - lib/auth.ts: getSession returns null on any failure (never throws)
  - requireAdmin throws Response(401) — caught by Next.js error boundary

patterns-established:
  - Three-layer password protection: select: false + toJSON transform + explicit projection
  - Backend auth router mounted at /auth with async-try-catch-next
  - Frontend auth via getSession/requireAdmin using jose

requirements-completed:
  - AUTH-01
  - AUTH-02
  - AUTH-03
  - AUTH-04
  - ADMIN-09

coverage:
  - id: D1
    description: User model with password select:false, email unique+lowercase, toJSON strips password
    requirement: AUTH-01
    verification:
      - kind: manual_procedural
        ref: "npx ts-node -e 'import(\"./src/models/user\")...' prints constructor, String, false, [admin,customer]"
        status: pass
    human_judgment: false
  - id: D2
    description: Auth router with POST /auth/login (bcrypt compare, JWT, cookie) and POST /auth/logout
    requirement: AUTH-02
    verification:
      - kind: manual_procedural
        ref: "grep -c 'bcrypt.compare\|jwt.sign' backend/src/routers/auth.ts"
        status: pass
    human_judgment: false
  - id: D3
    description: seed:admin script with idempotent upsert and password length validation
    requirement: AUTH-03
    verification:
      - kind: manual_procedural
        ref: "grep -c 'ADMIN_PASSWORD\|findOneAndUpdate.*upsert: true' backend/src/scripts/seed-admin.ts"
        status: pass
    human_judgment: false
  - id: D4
    description: lib/auth.ts with getSession (null-safe) and requireAdmin (throws 401)
    requirement: AUTH-04
    verification:
      - kind: manual_procedural
        ref: "grep -c 'getSession\|requireAdmin\|clothly_session' lib/auth.ts"
        status: pass
    human_judgment: false
  - id: D5
    description: Next.js proxy routes forwarding Set-Cookie
    requirement: ADMIN-09
    verification:
      - kind: manual_procedural
        ref: "test -f app/api/auth/login/route.ts && test -f app/api/auth/logout/route.ts"
        status: pass
    human_judgment: false

duration: 25min
completed: 2026-07-30
status: complete
---

# Plan 01-02: Server-side auth — User model, JWT, login/logout, seed

**User model with bcrypt hashing, Express auth router with JWT cookie auth, seed:admin script, and Next.js proxy routes**

## Performance

- **Duration:** ~25 min
- **Completed:** 2026-07-30
- **Tasks:** 3/3 complete
- **Files modified:** 8

## Accomplishments
- Mongoose User model with email (unique, lowercase), password (select: false), role (admin|customer)
- Auth router at /auth with POST login/logout (bcrypt compare, JWT HS256, httpOnly cookie)
- seed:admin script that idempotently upserts the first admin from env vars
- lib/auth.ts with getSession (null-safe jose verify) and requireAdmin (throws 401 Response)
- Next.js API route proxies at /api/auth/login and /api/auth/logout

## Task Commits

1. **Task 01-02-01: User model + auth router** - `10cff14` (feat)
2. **Task 01-02-02: Mount auth, seed:admin script** - `10cff14` (feat)
3. **Task 01-02-03: lib/auth.ts + Next.js proxy routes** - `10cff14` (feat)

## Files Created/Modified
- `backend/src/models/user.ts` — Created: Mongoose User model
- `backend/src/routers/auth.ts` — Created: Express auth router
- `backend/src/scripts/seed-admin.ts` — Created: Admin seed script
- `lib/auth.ts` — Created: JWT decode + auth helpers
- `app/api/auth/login/route.ts` — Created: Next.js login proxy
- `app/api/auth/logout/route.ts` — Created: Next.js logout proxy
- `backend/src/index.ts` — Modified: mounted auth router at /auth
- `backend/package.json` — Modified: added seed:admin script

## Decisions Made
- Password protection at 3 layers: schema select:false, toJSON transform, explicit projection
- JWT uses HS256 algorithm with 7-day expiry
- No rate limiting on login (deferred to follow-up)
- requireAdmin throws a Response object (caught by Next.js error boundary)

## Deviations from Plan
None — plan executed exactly as specified.

## Issues Encountered
- Pre-existing tsc type errors in `lib/admin.ts` and `backend/src/routers/clothes.ts` unrelated to this plan

## Next Phase Readiness
- Auth surface ready for Plan 01-03 (middleware, login page, admin chrome)
- JWT verification available via lib/auth.ts getSession/requireAdmin
- Admin seed creates the first admin account for login testing
