# Coding Conventions

**Analysis Date:** 2026-07-30

## Project Layout

Two-tier TypeScript monorepo-style split (no workspace manager):

- **Frontend** (repo root): Next.js 16 App Router + React 19, TypeScript strict, Tailwind v4 (`app/`, `components/`, `lib/`, `hooks/`, `constant/`).
- **Backend** (`backend/`): standalone Express 5 + Mongoose 9, its own `package.json` and `tsconfig.json` (`backend/src/`).

Each tier has independent scripts. The root `package.json` does NOT build or start the backend. Run them separately.

## Naming Patterns

**Files:**
- Next.js App Router routes use filesystem convention: `app/<route>/page.tsx`, dynamic segment `app/product/[id]/page.tsx`.
- React components are PascalCase `.tsx` and default-exported: `components/ClothingCard.tsx`, `components/Navbar.tsx`, `components/HeroHome.tsx`.
- Client components colocate sibling CSS when needed: `components/BounceCards.tsx` + `components/BounceCards.css`.
- Hooks live in `hooks/` as `useXxx.ts` (camelCase).
- Lib modules are kebab-case: `lib/cart-context.tsx`, `lib/products.ts`, `lib/utils.ts`.
- Backend routers/models are lowercase: `backend/src/routers/clothes.ts`, `backend/src/models/menclothes.ts`.
- Mongoose model exports are camelCase and suffixed `Model`: `menclothesModel`, `womenClothesModel` (`backend/src/models/menclothes.ts`, `backend/src/models/womenclothes.ts`).

**Functions:**
- camelCase everywhere: `getProductById`, `getRelatedProducts`, `useCart`, `addItem`, `updateQuantity`.
- Builder/context factory pattern: `CartProvider` (PascalCase React component), `CartContext` (PascalCase context object).

**Variables:**
- camelCase for locals; constants grouped in uppercase-ish object literals only for color tokens (`primary`, `darkSections`). No SCREAMING_SNAKE for module constants.

**Types:**
- `interface` for component props and domain shapes: `ClothingCardProps`, `Product`, `ProductVariant`, `CartItem`, `CartContextType`.
- Backend document interfaces extend `mongoose.Document`: `interface MenCollection extends Document { ... }` (`backend/src/models/menclothes.ts`).
- Props interface named `<Component>Props` immediately above the component (`components/ClothingCard.tsx`, `components/Navbar.tsx`).

## Code Style

**Formatting:**
- No Prettier config present (no `.prettierrc` / prettier in `package.json`). Indentation is hand-maintained: 2 spaces in root Next.js code, 4 spaces in `backend/src/`.
- Semicolons: omitted in most root `.ts/.tsx` files (noise-free style); present inconsistently in backend (mixed).
- Quotes: double quotes `"..."` in backend (`backend/src/index.ts`, `backend/src/models/*`), single quotes `'...'` in root frontend (`lib/`, `components/`).
- Trailing commas in multi-line object literals, aligned JSX attributes.

**Linting:**
- Tool: ESLint 9 flat config in `eslint.config.mjs`.
- Config: extends `eslint-config-next/core-web-vitals` and `eslint-config-next/typescript` only — no custom rules.
- Global ignores: `.next/**`, `out/**`, `build/**`, `next-env.d.ts`.
- Run: `npm run lint` (root only; backend has no lint script).

**TypeScript:**
- Root `tsconfig.json`: `"strict": true`, `"jsx": "react-jsx"`, `"moduleResolution": "bundler"`, target `ES2017`, `isolatedModules`, `incremental`.
- Path alias `@/*` → `./*` (root-relative). Components import via `@/components/...`, `@/lib/...`, `@/hooks/...`.
- Backend `tsconfig.json`: independent, `commonjs`, target `ES2020`, `strict`, `esModuleInterop`, `outDir: dist`, `rootDir: src`.

## Import Organization

**Order (observed in `app/product/[id]/page.tsx`, `components/Navbar.tsx`):**
1. Next.js framework imports (`next/link`, `next/navigation`, `next/font`).
2. React hooks (`useState`, `useEffect`, `useRef`).
3. Third-party libraries (`styled-components`, `framer-motion`, `gsap`, `mongoose`).
4. Local modules via `@/` alias (`@/lib/...`, `@/components/...`).
5. Type-only imports with `import type` (`import type { Metadata } from 'next'`).
6. CSS/asset imports last (`import './globals.css'`).

**Path Aliases:**
- `@/*` → repo root (e.g. `@/components/Navbar`, `@/lib/cart-context`, `@/hooks`). Configured in both `tsconfig.json` and `components.json` (shadcn).

**Backend imports:** relative only (`import clothesRouter from './routers/clothes'`, `import { menclothesModel } from '../models/menclothes'`). No `@/` alias in backend.

## Error Handling

**Strategy:** Mostly defensive-by-return and throw-on-missing-context on the frontend; ad-hoc on the backend.

**Patterns:**
- **Not-found routing:** Server components call `notFound()` from `next/navigation` after a lookup returns falsy — see `app/product/[id]/page.tsx:27`. Pair with `generateMetadata` that handles the missing product gracefully (returns a "Not Found" title).
- **Context guard:** Custom hooks throw a descriptive error if used outside their provider — `useCart()` in `lib/cart-context.tsx:88` throws `'useCart must be used within a CartProvider'`.
- **Mongoose connection:** `backend/src/index.ts:18` logs `console.error('MongoDB connection error:', err)` on connect failure; server only starts after successful connect.
- **Missing route error handling (anti-pattern):** `backend/src/routers/clothes.ts` route handlers are `async` but contain NO `try/catch`, no `next(err)`, and no `.catch()` on Mongoose queries. Unhandled rejections will crash or hang the Express process. The `:id` route also calls `menclothesModel.findById()` with NO argument — a bug.
- **No global error middleware:** `backend/src/index.ts` registers no error-handling middleware and no 404 handler.

## Logging

**Framework:** Plain `console` only. No logger library (no pino, winston, debug).

**Patterns:**
- Backend startup: `console.log('Connected to MongoDB')`, `console.log('Server is Running on port ${port}')` (`backend/src/index.ts`).
- Backend data debugging (should be removed): `console.log(menclothes)` left in every GET handler in `backend/src/routers/clothes.ts`.
- Frontend: no `console.log` calls in `app/` or `components/` source. Keep it that way for new code.

## Comments

**When to Comment:**
- Section dividers in long JSX: `{/* ── Fullscreen mobile overlay ── */}` style header comments in `components/Navbar.tsx`.
- Documented TODO/intent notes on domain models: `lib/products.ts` uses JSDoc `/** ... */` on optional fields (`variants`, `sizes`) explaining deferral until backend provides real data.
- Inline spec hints referencing interface contracts (e.g. OKLCH swatch purpose on `ProductVariant.colorValue`).

**JSDoc/TSDoc:**
- Used selectively in `lib/products.ts` only. Not enforced project-wide. Component props rely on TypeScript interface signatures, not prose docs.

**Disabled code:** Large commented-out blocks left in place — e.g. the `Add to Cart` button in `components/ClothingCard.tsx:29-38`. Prefer deleting dead code; keep history in git.

## Function Design

**Size:** Most components are single-file single-purpose; some exceed 200 lines due to inline styled-components (`components/ClothingCard.tsx` 217 lines, `components/Navbar.tsx` 359 lines). Royal rule observed but not enforced: extract large styled blocks into separate files when they grow.

**Parameters:**
- Component props via a typed `interface XxxProps` with all fields optional-or-defaulted where it makes sense (`NavbarProps` uses destructuring defaults in `components/Navbar.tsx:27-31`).
- Event handlers receive the full React event typed (`(e: React.MouseEvent<HTMLAnchorElement>, href: string)`).

**Return Values:**
- Server components `export default async function` returning JSX (App Router RSC).
- Client components `export default function` returning JSX.
- Lib functions return typed domain objects (`Product | undefined`, `Product[]`).
- Backend handlers return `res.json(...)` with no typed response shape.

## Module Design

**Exports:**
- Components: one default export per file (PascalCase identifier matches filename).
- Lib: named exports for types/functions/factories (`export function cn`, `export interface Product`, `export const menClothing`, `export function CartProvider`, `export function useCart`).
- Backend: named exports for Mongoose models (`export const menclothesModel`), default exports for routers (`export default router`).

**Barrel Files:** Not used. No `index.ts` re-exports in `lib/` or `components/`. Imports are direct and explicit (`@/components/Navbar`, `@/lib/products`).

**Client/Server Boundary:**
- Mark client components explicitly with `'use client';` as the FIRST line (`components/Navbar.tsx:1`, `lib/cart-context.tsx:1`, `components/ClothingCard.tsx:1`).
- Server components (default) live under `app/` route files (`app/product/[id]/page.tsx`). Do NOT add `'use client'` to them unless they need hooks/state.

## Styling Conventions

- Tailwind v4 via `@tailwindcss/postcss` (`postcss.config.mjs`). Global stylesheet `app/globals.css` plus a large custom `lightswind.css` framework file at root.
- shadcn/ui "new-york" style configured in `components.json` (`baseColor: neutral`, `cssVariables: true`, `iconLibrary: lucide`). Add primitives to `components/ui/` via the shadcn CLI.
- Class merge helper `cn()` in `lib/utils.ts` using `clsx` + `tailwind-merge` — use this for conditional classnames, not string concatenation.
- Color system: hardcoded `oklch(...)` values inline in `style={{}}` or styled-components (e.g. `oklch(0.943 0.051 98.2)` cream, `oklch(0.2 0.03 98)` ink). Some tokens defined in the `primary` object literal inside components (`components/Navbar.tsx:38`).
- `lightswind.css` is a vendored CSS framework file (committed, ~600KB) — do not hand-edit; treat as a dependency.
- Animation library mix: `framer-motion`, `motion`, and `gsap` are all present (`package.json`). Prefer `motion` (the current `motion/react` import path) for new animation; `gsap` is used for the carousel (`components/GsapCarousel.tsx`).

---

*Convention analysis: 2026-07-30*