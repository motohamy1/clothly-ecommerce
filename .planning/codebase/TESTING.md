# Testing Patterns

**Analysis Date:** 2026-07-30

## Test Framework

**Runner:**
- **None configured.** No test framework is installed in either the root `package.json` or `backend/package.json`.
- Root `package.json` scripts: `dev`, `build`, `start`, `lint` — no `test` script.
- `backend/package.json` defines `"test": "echo \"Error: no test specified\" && exit 1"` — the npm-init default placeholder, which forces a non-zero exit.

**Assertion Library:** None installed.

**Run Commands:**
```bash
npm run lint          # The closest thing to a quality gate (ESLint only, root repo)
npm run build         # Type-checks the Next.js app (next build)
cd backend && npm run build   # Type-checks the backend (tsc, no tests emitted)
```
There are NO test commands. Do not write `npm test` in any new phase plan without first installing a framework.

## Test File Organization

**Location:** No test files exist anywhere in the project source.

A repo-wide search for `*.test.{ts,tsx,js,jsx}` and `*.spec.{ts,tsx,js,jsx}` returned matches ONLY inside `backend/node_modules/` (third-party packages). NO project-authored tests exist in:
- `app/`
- `components/`
- `lib/`
- `hooks/`
- `backend/src/`

**Naming:** No naming convention established yet.

## Test Structure

**Suite Organization:** Not applicable — no tests.

## Mocking

**Framework:** None.

**What to Mock (recommended future conventions):**
- `lib/cart-context.tsx` `useCart`/`CartProvider` should be tested with a consumer component render harness.
- `lib/products.ts` pure functions (`getProductById`, `getRelatedProducts`, `getProductSection`) need NO mocks — test against the in-file exported arrays.
- `backend/src/routers/clothes.ts` would need `supertest` + an in-memory mongoose (`mongodb-memory-server`) or model mocks.

## Fixtures and Factories

**Test Data:** None.

Practical note: `lib/products.ts` already exports typed product arrays (`menClothing`, `menOuterwear`, `menShoes`, `allProducts`) that double as ready fixtures for frontend unit tests once a runner is added.

## Coverage

**Requirements:** None enforced. No coverage tool installed.

## Test Types

**Unit Tests:** None.

**Integration Tests:** None.

**E2E Tests:** None (no Playwright/Cypress installed).

## Quality Gates Actually In Place

1. **TypeScript compilation** (`tsconfig.json` strict mode — both tiers). `next build` fails on type errors; `backend/tsc` will too.
2. **ESLint** (`eslint.config.mjs`, Next.js core-web-vitals + typescript presets). Run via `npm run lint`. Custom ignores only; no custom rules.
3. **Manual runtime verification** — nothing automated for behavior.

## Recommended Setup (for future phases)

If a phase requires testing, install before writing tests. Suggested baseline:

**Frontend (root):**
```bash
npm i -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom
```
- Co-locate component tests as `components/<Name>.test.tsx`.
- Pure lib tests in `lib/__tests__/` or co-located `lib/<name>.test.ts`.
- Add script: `"test": "vitest"`, `"test:run": "vitest run"`.

**Backend:**
```bash
npm i -D vitest supertest mongodb-memory-server @types/supertest
```
- Router tests in `backend/src/routers/__tests__/clothes.test.ts` using `supertest(app)` and an in-memory mongo instance.
- Requires refactoring `backend/src/index.ts` to export the `app` (currently it listens directly without exporting).

## Common Patterns

**Async Testing:** N/A — no tests yet.

**Error Testing:** N/A — no tests yet. Note for future: the backend router handlers currently have NO `try/catch` (see `backend/src/routers/clothes.ts`), so error-path tests cannot pass until error handling is added.

## Known Testability Gaps Blocking Future Tests

- **`backend/src/index.ts` is not importable for supertest** — it calls `app.listen` at module top level with no export of `app`. Refactor to `export default app` and add a `server.ts`/CLI bin pattern.
- **`backend/src/routers/clothes.ts` lacks async error handling** — Express 5 will reject unhandled async rejections at runtime; tests asserting behavior must first add `.catch`/try-catch or an `express-async-handler` wrapper.
- **Mongo URI is hardcoded** to `mongodb://localhost:27017/Clothly-ecommerce` (`backend/src/index.ts:11`) with no env override — tests against a real DB would be slow/flaky. Move to `process.env.MONGO_URI`.
- **`findById()` is called with no argument** (`backend/src/routers/clothes.ts:13`) — a latent bug that no test currently catches. A test for `GET /shop/men/:id` would surface it immediately once added.

---

*Testing analysis: 2026-07-30*