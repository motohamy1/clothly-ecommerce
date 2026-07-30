# Technology Stack

**Analysis Date:** 2026-07-30

## Languages

**Primary:**
- TypeScript `^5` (frontend) — All app code under `app/`, `components/`, `lib/`, `hooks/`, `constant/`. Configured in `tsconfig.json` (target `ES2017`, `module: esnext`, `moduleResolution: bundler`, `strict: true`, path alias `@/*` → `./*`).
- TypeScript `^5.9.3` (backend) — All backend code under `backend/src/`. Configured in `backend/tsconfig.json` (target `ES2020`, `module: commonjs`, `rootDir: ./src`, `outDir: ./dist`, `strict: true`).

**Secondary:**
- CSS / PostCSS — Styling via Tailwind v4 (`app/globals.css` is the Tailwind entry per `components.json`); `lightswind.css` is a vendored utility stylesheet at repo root.

## Runtime

**Environment:**
- Node.js (no `.nvmrc` / `.python-version` present; version pinned only transitively through `@types/node` `^20.19.33`). The frontend runs on the Next.js runtime (Node for SSR / build, browser for client).
- The backend is a Node + Express server (`backend/src/index.ts`).

**Package Manager:**
- npm — Root lockfile `package-lock.json` present. Backend has its own `backend/package-lock.json` and `backend/node_modules/`, i.e. the repo uses **two separate npm workspaces**, not a monorepo npm workspaces config.
- The backend `package.json` declares `"type": "commonjs"`; the frontend relies on Next.js' ESM bundler resolution.

## Frameworks

**Core:**
- Next.js `^16.2.12` — Frontend framework. App Router structure under `app/` (routes: `cart`, `kids`, `men`, `women`, `product`). Config in `next.config.ts` (currently empty). ESLint wired via `eslint-config-next` (`eslint.config.mjs`).
- Express `^5.2.1` — Backend HTTP server (`backend/src/index.ts`), listens on `process.env.PORT || 5000`, mounted route `/shop`.
- Mongoose `^9.2.1` — ODM for MongoDB (`backend/src/index.ts`, `backend/src/models/`).

**UI / Component layer:**
- React `19.2.3` + `react-dom` `19.2.3` (peer of Next 16).
- Tailwind CSS `^4.1.18` via `@tailwindcss/postcss` (`postcss.config.mjs`). shadcn/ui config in `components.json` (style `new-york`, `rsc: true`, base color `neutral`, CSS variables enabled, icon library `lucide`).
- Radix UI primitives: `radix-ui` `^1.4.3`, plus scoped packages `@radix-ui/react-label` `^2.1.8`, `@radix-ui/react-slot` `^1.2.4`.
- `class-variance-authority` `^0.7.1`, `clsx` `^2.1.1`, `tailwind-merge` `^3.4.0` — the standard `cn()` helper pattern in `lib/utils.ts`.

**Animation / 3D:**
- `framer-motion` `^12.34.0`, `motion` `^12.43.0`, `gsap` `^3.15.0` — animation libraries used across `components/Reveal.tsx`, `components/GsapCarousel.tsx`, etc.
- `three` `^0.167.1`, `@react-three/fiber` `^9.5.0`, `@react-three/drei` `^10.7.7` — 3D/WebGL (`components/BounceCards.tsx`, `components/TiltedCard.tsx`, `components/MagicBento.tsx`).
- `tw-animate-css` `^1.4.0` (dev) — Tailwind animation utility plugin.

**Styling extras:**
- `styled-components` `^6.4.4` — present in deps; coexists with Tailwind (used by some `components/*.tsx`).
- `lightswind` `^3.1.21` — component library dependency (vendored CSS also at `lightswind.css`).

**Icons:**
- `lucide-react` `^0.563.0` (per `components.json` `iconLibrary`).
- `@tabler/icons-react` `^3.36.1`.

**Testing:**
- None. There is no test runner, no `jest.config.*` / `vitest.config.*`, no `*.test.*` / `*.spec.*` files, and no test script in either `package.json`. `backend/package.json` `test` is the default `echo "Error: no test specified" && exit 1` stub.

**Build/Dev:**
- Next.js build (`next build`) / dev (`next dev`) / start (`next start`) — `package.json` scripts.
- `ts-node` `^10.9.2` (dev, frontend) — TS execution helper.
- Backend dev: `nodemon` `^3.1.13` watching `backend/src/index.ts` (`dev` script); backend build: `tsc` → `backend/dist/` (`build` script). Note: `start` script is `node dist/index.ts` (likely a bug — runs `tsc` output through node but references `.ts` path).

## Key Dependencies

**Critical (frontend):**
- `next` `^16.2.12` — App Router framework; the whole `app/` directory is its surface.
- `react` / `react-dom` `19.2.3` — UI runtime.
- `tailwindcss` `^4.1.18` + `@tailwindcss/postcss` — primary styling system.

**Critical (backend):**
- `express` `^5.2.1` — HTTP server.
- `mongoose` `^9.2.1` — MongoDB access layer.

**Infrastructure:**
- MongoDB driver is brought in transitively by `mongoose` (the `mongodb` package lives in `backend/node_modules/mongodb`). No direct MongoDB client dependency declared.

**Utility / icons (notable):**
- `framer-motion`, `motion`, `gsap` — three overlapping animation libs (potential bundle-size / maintenance concern).
- `three` + `@react-three/fiber` + `@react-three/drei` — WebGL stack, heavy.
- `styled-components` `^6.4.4` — coexists with Tailwind rather than being removed.

## Configuration

**Environment:**
- Frontend: no `.env`, `.env.local`, or `NEXT_PUBLIC_*` variables detected anywhere in the repo (`.gitignore` lists `.env*`). The frontend currently consumes products from the hardcoded catalog `lib/products.ts`, not from the backend.
- Backend: `process.env.PORT` is read in `backend/src/index.ts` (defaults to `5000`). The MongoDB connection string is **hardcoded** as `mongodb://localhost:27017/Clothly-ecommerce` — there is no `MONGO_URI` env var in use.
- No secrets location exists in the repo (no `.env*`, no `.npmrc`, no credentials files).

**Build:**
- `tsconfig.json` (frontend, target ES2017, bundler resolution, `@/*` path alias).
- `backend/tsconfig.json` (target ES2020, CommonJS, `src` → `dist`).
- `next.config.ts` — empty config object; no `images`, `experimental`, `rewrites`, or `env` customization.
- `postcss.config.mjs` — only the `@tailwindcss/postcss` plugin.
- `eslint.config.mjs` — `eslint-config-next/core-web-vitals` + `/typescript` presets.
- `components.json` — shadcn/ui config: style `new-york`, Tailwind entry `app/globals.css`, aliases `@/components`, `@/lib`, `@/components/ui`, `@/hooks`; extra registry `@react-bits` → `https://reactbits.dev/r/{name}.json`.

**Scripts:**
- Frontend (`package.json`): `dev` (`next dev`), `build` (`next build`), `start` (`next start`), `lint` (`eslint`).
- Backend (`backend/package.json`): `dev` (`nodemon src/index.ts`), `build` (`tsc`), `start` (`node dist/index.ts`).

## Platform Requirements

**Development:**
- Node.js 20+ (implied by `@types/node` `^20` and Next.js 16 engine requirements).
- A local MongoDB instance reachable at `mongodb://localhost:27017` for the backend to boot (else `mongoose.connect` rejects and the server never calls `app.listen`).
- Two separate `npm install` runs: one at repo root for the Next.js app, one inside `backend/` for the Express/Mongoose server. They are independent dependency trees.

**Production:**
- Deployment target not specified anywhere (no `vercel.json`, no Dockerfile, no CI workflow files). `next.config.ts` has no production customization. The backend `start` script is malformed (`node dist/index.ts`) and would need fixing before any production run.

---

*Stack analysis: 2026-07-30*