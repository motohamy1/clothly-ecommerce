---
phase: "01"
plan: "01-01"
subsystem: config
tags: [env, jwt, tsconfig, deps, backend]

requires: []
provides:
  - Env-var contract (.env.example + .env) with JWT_SECRET, MONGODB_URI, ADMIN_EMAIL, ADMIN_PASSWORD, BACKEND_URL, PORT
  - JWT_SECRET boot-time fail-fast in backend
  - MONGODB_URI production default warning
  - Root tsconfig.json excludes backend/ from frontend typechecking
  - jose installed at root; jsonwebtoken, bcrypt, @types installed in backend/
affects: [01-02, 01-03, 01-04]

tech-stack:
  added:
    - jose@^5 (root)
    - jsonwebtoken@^9 (backend)
    - bcrypt@^5 (backend)
    - @types/jsonwebtoken@^9 (backend dev)
    - @types/bcrypt@^6 (backend dev)
  patterns:
    - Env-driven config with fail-fast on required secrets
    - Production-warning on default localhost URIs

key-files:
  created:
    - .env.example
    - .env
  modified:
    - backend/src/index.ts
    - backend/package.json
    - package.json (root)
    - tsconfig.json

key-decisions:
  - JWT_SECRET must be set at boot or server exits with FATAL log
  - MONGODB_URI uses localhost default in dev, warns in production
  - Root tsconfig excludes backend/ to avoid frontend tsc errors

patterns-established:
  - Env validation: fail-fast on required secrets before any I/O
  - Dep management: frontend deps in root package.json, backend deps in backend/

requirements-completed:
  - ENV-01
  - ENV-02
  - HYGIENE-03

coverage:
  - id: D1
    description: Env files with 6 documented keys and gitignored .env
    requirement: ENV-01
    verification:
      - kind: manual_procedural
        ref: "test -f .env.example && grep -c 'JWT_SECRET' .env.example"
        status: pass
      - kind: manual_procedural
        ref: "test -f .env && git check-ignore .env"
        status: pass
    human_judgment: false
  - id: D2
    description: Root tsconfig excludes backend from typechecking
    requirement: HYGIENE-03
    verification:
      - kind: manual_procedural
        ref: "grep -A2 '\"exclude\"' tsconfig.json"
        status: pass
    human_judgment: false
  - id: D3
    description: Backend boots with JWT_SECRET fail-fast and MONGODB_URI prod warning
    requirement: ENV-02
    verification:
      - kind: manual_procedural
        ref: "grep -n 'jwtSecret' backend/src/index.ts"
        status: pass
      - kind: manual_procedural
        ref: "grep -n 'MONGODB_URI' backend/src/index.ts"
        status: pass
    human_judgment: false
  - id: D4
    description: Auth dependencies installed in root and backend
    requirement: ENV-01
    verification:
      - kind: manual_procedural
        ref: "node -e \"const p=require('./package.json'); console.log(p.dependencies.jose)\""
        status: pass
      - kind: manual_procedural
        ref: "cd backend && node -e \"const p=require('./package.json'); console.log(p.dependencies.jsonwebtoken, p.dependencies.bcrypt)\""
        status: pass
    human_judgment: false
  - id: D5
    description: Backend environment validation fail-fast without JWT_SECRET
    requirement: ENV-02
    verification:
      - kind: manual_procedural
        ref: "cd backend && env -u JWT_SECRET timeout 3 npm run dev; echo $?"
        status: pass
    human_judgment: true
    rationale: Requires running backend process; side-effect test that may fail if MongoDB is not running locally

duration: 15min
completed: 2026-07-30
status: complete
---

# Plan 01-01: Substrate — env, deps, boot handling

**Env-var contract with JWT_SECRET fail-fast, tsconfig exclusion, and auth dependency installation**

## Performance

- **Duration:** ~15 min (partial pre-execution, closed out manually)
- **Completed:** 2026-07-30
- **Tasks:** 3/3 complete
- **Files modified:** 6

## Accomplishments
- Created `.env.example` with all 6 documented keys and placeholder values
- Created `.env` with working local-dev values, gitignored
- Added `backend` to root `tsconfig.json` exclude array so frontend tsc doesn't typecheck backend
- Added JWT_SECRET boot-time fail-fast to `backend/src/index.ts`
- Added MONGODB_URI production-default warning to `backend/src/index.ts`
- Installed `jose` at root, `jsonwebtoken` + `bcrypt` + `@types/*` in backend

## Task Commits

1. **Task 01-01-01: Create env files** - `e6aa7fe` (chore)
2. **Task 01-01-02: Fix tsconfig exclude** - `4ba38c4` (fix)
3. **Task 01-01-03: Add JWT fail-fast + deps** - `6fdb3b1` (feat)

## Files Created/Modified
- `.env.example` — Created with 6 documented env vars and placeholder values
- `.env` — Created with working local-dev values (gitignored)
- `tsconfig.json` — Added `backend` to exclude array
- `backend/src/index.ts` — JWT_SECRET fail-fast + MONGODB_URI production warning
- `backend/package.json` — Added jsonwebtoken, bcrypt, @types/jsonwebtoken, @types/bcrypt
- `package.json` (root) — Added jose

## Decisions Made
- JWT_SECRET must be set at boot or the server refuses to start
- MONGODB_URI defaults to localhost for dev but warns in production
- Backend deps live in `backend/package.json`, not root — keeps separation clean

## Deviations from Plan
None — plan executed exactly as specified.

## Issues Encountered
- `npx tsc --noEmit` shows pre-existing errors in `lib/admin.ts` (not part of this plan, will be fixed in Plan 01-05)

## Next Phase Readiness
- Env contract ready for auth foundation (Plan 01-02)
- Backend JWT_SECRET fail-fast protects all downstream auth surfaces
- Root tsconfig cleanly excludes backend from frontend typechecking
