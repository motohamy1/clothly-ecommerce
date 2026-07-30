# External Integrations

**Analysis Date:** 2026-07-30

## APIs & External Services

**Internal REST API (Express backend):**
- Express 5 server running the "shop" API — `backend/src/index.ts`, routes in `backend/src/routers/clothes.ts`.
- Base URL (dev): `http://localhost:5000` (port from `process.env.PORT`, default `5000`).
- Routes exposed (all GET, all read-only):
  - `GET /shop/men` — returns all `menclothes` docs (`backend/src/routers/clothes.ts:7`).
  - `GET /shop/men/:id` — `findById` with no id argument (bug — ignores `req.params.id`, `backend/src/routers/clothes.ts:12`).
  - `GET /shop/women` — returns all `womenclothes` docs (`backend/src/routers/clothes.ts:17`).
  - `GET /shop/kids` — returns `menclothes` (placeholder stub reusing men collection, `backend/src/routers/clothes.ts:23`).
  - `GET /shop/couples` — returns `menclothes` (placeholder stub, `backend/src/routers/clothes.ts:29`).
- SDK/Client: none. The frontend does **not** currently call this API — products are served from the static catalog `lib/products.ts`. No `fetch`/`axios` calls to `/shop` exist in `app/` or `components/`. The API is effectively unused by the Next.js frontend right now.

**Third-party web services:**
- None. No `stripe`, `supabase`, `aws-sdk`, `@aws-sdk/*`, `firebase`, `cloudinary`, `algolia`, `resend`, `sendgrid`, Auth0/Clerk/NextAuth packages, or any other external SDK is present in either `package.json`.

## Data Storage

**Databases:**
- MongoDB — local instance only.
  - Connection: **hardcoded** string `mongodb://localhost:27017/Clothly-ecommerce` in `backend/src/index.ts:11`. No `MONGO_URI` env var.
  - Client/ODM: Mongoose `^9.2.1` (`backend/package.json`).
  - Collections (one Mongoose model each):
    - `menclothes` — model `menclothesModel` in `backend/src/models/menclothes.ts` (fields: `image` validated as URL, `productName`, `price`, `info`, `category`).
    - `womenClothes` (collection name inferred) — model `womenClothesModel` in `backend/src/models/womenclothes.ts`.
    - `kids` / `couples` — no dedicated models; the router queries `menclothesModel` for both (stubs).

**File Storage:**
- Local filesystem only. Product images served from `public/images/products/` (e.g. `/images/products/download (1).png` referenced in `lib/products.ts`). No S3 / R2 / Cloudinary / upload pipeline.

**Caching:**
- None. No Redis, no Next.js `revalidate`/`ISR` tags, no in-memory cache layer detected.

## Authentication & Identity

**Auth Provider:**
- None. There is no authentication, session, JWT, cookie, or user model anywhere in the codebase. The Express server mounts `app.use(express.json())` only — no `express-session`, `passport`, `jsonwebtoken`, `cookie-parser`, or auth middleware. The frontend `CartProvider` (`lib/cart-context.tsx`) holds cart state purely in React `useState`; there is no server-side cart or user concept.

## Monitoring & Observability

**Error Tracking:**
- None. No Sentry, `pino`, `winston`, or `otel`/OpenTelemetry packages in either `package.json`.

**Logs:**
- `console.log` / `console.error` only. The backend logs `Connected to MongoDB`, `Server is Running on port ${port}`, and `MongoDB connection error: ${err}` in `backend/src/index.ts`, and `console.log` of the queried array inside every route handler in `backend/src/routers/clothes.ts`. The frontend has no logging layer.

## CI/CD & Deployment

**Hosting:**
- Unspecified. No `vercel.json`, `netlify.toml`, `Dockerfile`, `docker-compose.yml`, `fly.toml`, or `render.yaml`. The `.gitignore` ignores `.vercel` (so Vercel CLI is the most likely intended target) but nothing commits a deployment config.

**CI Pipeline:**
- None detected. No `.github/workflows/`, no `.gitlab-ci.yml`, no `.circleci/`. The only "automation" file is a single-shot `installer.sh` setup script at repo root and `installer.sh` is not wired to any pipeline.

## Environment Configuration

**Required env vars:**
- `PORT` (backend, optional) — defaults to `5000` (`backend/src/index.ts:6`).
- No `MONGO_URI` / `DATABASE_URL` is read; the Mongo connection string is hardcoded.
- No `NEXT_PUBLIC_*` vars are referenced by the frontend anywhere (no `process.env.NEXT_PUBLIC_*` usage in `app/`, `components/`, `lib/`).

**Secrets location:**
- None. No `.env*` file is committed (`.gitignore` excludes `.env*`) and none exists in the working tree. There is no secrets manager integration and no credentials file pattern committed.

## Webhooks & Callbacks

**Incoming:**
- None. The only Express routes are REST GETs under `/shop`. No `POST`/`PUT`/`PATCH`/`DELETE` handlers, no webhook signature verification, no Stripe webhook route.

**Outgoing:**
- None. The frontend makes no outbound API calls (the static catalog in `lib/products.ts` is the source of truth for product data). The backend makes only the MongoDB driver connection to localhost.

---

## Integration gap summary (for the planner)

- The Express `/shop` API and the Next.js frontend are **disconnected**. The frontend reads from `lib/products.ts`; the backend is wired to MongoDB but is not consumed. Any feature that needs live product/cart/order data must first establish a client (`fetch` wrapper or React Query / SWR) and a base URL config (`NEXT_PUBLIC_API_URL`).
- The MongoDB connection string is hardcoded to localhost — moving off a local dev Mongo requires parameterizing it to `process.env.MONGO_URI` in `backend/src/index.ts`.
- No external commerce infrastructure exists yet (no payment provider, no email/transactional service, no image CDN). Adding Stripe, a transactional email service, or object storage for product imagery would be greenfield integrations.
- No auth layer exists server- or client-side; any user account / cart-persistence feature starts from zero.

*Integration audit: 2026-07-30*