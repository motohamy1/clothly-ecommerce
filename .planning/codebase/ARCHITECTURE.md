<!-- refreshed: 2026-07-30 -->
# Architecture

**Analysis Date:** 2026-07-30

## System Overview

```text
┌─────────────────────────────────────────────────────────────────┐
│                       Next.js App Router (frontend)              │
│   `app/layout.tsx` → `<Providers>` → `<Navbar>` + `<SideBar>`    │
├──────────────────┬──────────────────┬────────────────────────────┤
│   Route pages    │   Component lib │   Client-side state         │
│  `app/*/page.tsx`│ `components/*.tsx`│  `lib/cart-context.tsx`    │
└────────┬─────────┴────────┬─────────┴──────────┬─────────────────┘
         │                  │                     │
         ▼                  ▼                     ▼
┌─────────────────────────────────────────────────────────────────┐
│              Static catalog layer (client monorepo)              │
│   `lib/products.ts`  (hardcoded men/women/kids product arrays)   │
│   `lib/utils.ts`     (cn())                                       │
└─────────────────────────────────────────────────────────────────┘
                          │ (NOT wired in yet)
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│              Express + MongoDB backend (decoupled)               │
│   `backend/src/index.ts` (Express app, mounts `/shop`)           │
│   `backend/src/routers/clothes.ts` (GET /men /women /kids ...)   │
│   `backend/src/models/*.ts` (Mongoose: menclothes, womenclothes)│
└─────────────────────────────────────────────────────────────────┘
```

The repository is a **two-tier monorepo**: a Next.js 16 frontend in the project
root and a standalone Express/Mongoose backend in `backend/`. Crucially, the two
tiers are **not yet integrated** — the frontend reads product data from a
hardcoded in-memory catalog (`lib/products.ts`), not from the Express API. The
backend exists as an in-progress parallel service that exposes shop endpoints
but is currently dead code from the frontend's perspective.

## Component Responsibilities

| Component | Responsibility | File |
|-----------|----------------|------|
| RootLayout | App shell, fonts, mounts `Providers`/`Navbar`/`SideBar`, sets `<main>` offset for sidebar | `app/layout.tsx` |
| Providers | Wraps app tree in `CartProvider` (single context provider entry point) | `components/Providers.tsx` |
| CartProvider / useCart | Client cart state, add/remove/update/clear, derives `totalItems`/`totalPrice` | `lib/cart-context.tsx` |
| Navbar | Top nav, scroll-spy dark-section detection, cart badge, hash links | `components/Navbar.tsx` |
| SideBar | Left vertical shop nav (Men/Women/Kids), route-aware active highlight, scroll-to-section | `components/SideBar.tsx` |
| HeroHome | Landing hero with `BounceCards` + `Stack`, staggered JS fade-in | `components/HeroHome.tsx` |
| AboutPage | About section composed of `MagicBento` + `Reveal` | `components/AboutPage.tsx` |
| ContactSection | Contact form with WhatsApp deep-link submit | `components/ContactSection.tsx` |
| ClothingCard | Product card for apparel, links to `/product/[id]` | `components/ClothingCard.tsx` |
| ShoeCard | Product card variant for shoes | `components/ShoeCard.tsx` |
| ProductDetail | Full PDP: variant/size pick, add-to-cart via `useCart`, Framer Motion reveal | `components/ProductDetail.tsx` |
| GsapCarousel | Horizontal scroll carousel built on GSAP, uses `useSyncExternalStore` for prev/next state | `components/GsapCarousel.tsx` |
| BounceCards / Stack / TiltedCard / MagicBento / Reveal | Presentational motion primitives | `components/*.tsx` |
| products.ts | Source of truth for catalog: `Product`/`ProductVariant` types, men arrays, `getProductById`/`getRelatedProducts`/`getProductSection` helpers | `lib/products.ts` |
| utils.ts | `cn()` className merge helper | `lib/utils.ts` |
| Backend Express app | HTTP server on port 5000, mounts `/shop` router | `backend/src/index.ts` |
| clothes router | GET `/shop/men`, `/shop/women`, `/shop/kids`, `/shop/couples`, `/shop/men/:id` | `backend/src/routers/clothes.ts` |
| Mongoose models | `menclothes`, `Womenclothes` collections in `Clothly-ecommerce` DB | `backend/src/models/*.ts` |

## Pattern Overview

**Overall:** Next.js App Router with server components + client components
distinguished by `'use client'` directives; React Context for client state; a
parallel Express/Mongoose REST backend running independently.

**Key Characteristics:**
- Routes are thin composition layers that import presentational components and
  catalog helpers from `lib/`/`components/`.
- Most interactive UI is client-rendered (`'use client'` on pages like
  `app/men/page.tsx`, `app/cart/page.tsx`, `components/Navbar.tsx`).
- The product detail route (`app/product/[id]/page.tsx`) is the only server
  component page, using `generateMetadata` and server-side `getProductById`.
- Styling is a mix: Tailwind v4 utility classes, inline `style` props with OKLCH
  colors, and `styled-components` for component-scoped CSS (`ClothingCard`,
  `men/women/kids` page wrappers).
- Motion uses three libraries side by side: `motion/react` (Framer Motion),
  `gsap` (GsapCarousel), and bespoke CSS/`requestAnimationFrame` reveals
  (`HeroHome`, `Reveal`).
- The catalog is a **statically-hosted client module** (`lib/products.ts`), not
  a fetched resource; `Product` ids like `mc1`, `ms4` are local-only.
- The Express backend has its own `package.json` and is started via `nodemon`
  (`backend/package.json`); it has no path alias and is not consumed anywhere
  in the Next.js tree.

## Layers

**Route layer (App Router pages):**
- Purpose: Map URL → composed UI; own route-specific metadata & in-page layout.
- Location: `app/**/page.tsx`
- Contains: One default export per route; `'use client'` on cart/men/women/kids
  because they render interactive cards/carousels.
- Depends on: `components/*`, `lib/products`, `lib/cart-context`.
- Used by: Next.js server runtime.

**Component layer:**
- Purpose: Reusable presentational + interactive UI building blocks.
- Location: `components/*.tsx`
- Contains: All `.tsx` capitalized-named components; flat directory (no
  subfolders). Each component owns its own `styled-components` wrapper when
  needed.
- Depends on: `lib/*`, external motion/icon libs.
- Used by: Route layer and each other.

**State / data layer:**
- Purpose: Client cart context + static catalog.
- Location: `lib/cart-context.tsx` (cart), `lib/products.ts` (catalog).
- Contains: Context provider/hook, in-memory product arrays, type definitions,
  pure lookup functions.
- Depends on: React only. **Does not call the Express backend.**
- Used by: Cards, ProductDetail, CartPage, Navbar (cart badge), SideBar
  (`getProductSection`).

**Backend service (decoupled):**
- Purpose: Intended REST API over MongoDB.
- Location: `backend/src/`
- Contains: Express entry, a single router, two Mongoose models.
- Depends on: `express`, `mongoose`.
- Used by: Nothing in the frontend yet. Documented here as the integration
  boundary that future work must connect.

## Data Flow

### Primary Request Path — Catalog browsing

1. User loads `/men` → `app/men/page.tsx` (client component) (`app/men/page.tsx:10`)
2. Imports `menClothing`, `menOuterwear`, `menShoes` from `lib/products.ts`
   (`app/men/page.tsx:8`)
3. Renders `GsapCarousel` × 3, mapping each product into `ClothingCard`/`ShoeCard`
   which `Link` to `/product/[id]` (`components/ClothingCard.tsx`).

### Product detail flow

1. Click `ClothingCard` → navigates to `/product/[id]` (`components/ClothingCard.tsx`)
2. `app/product/[id]/page.tsx` (server component) awaits `params.id`, calls
   `getProductById(id)` from `lib/products.ts` (`app/product/[id]/page.tsx:24-26`)
3. `generateMetadata` builds per-product title/description
   (`app/product/[id]/page.tsx:13-21`)
4. Renders `<ProductDetail product={...}/>` + related carousel
   (`app/product/[id]/page.tsx:35-59`). `ProductDetail` calls `useCart().addItem`
   on Add-to-Cart (`components/ProductDetail.tsx`).

### Cart flow

1. Any Add-to-Cart calls `useCart().addItem(product, size, color)`
   (`lib/cart-context.tsx:28-42`) — guarded by `CartProvider` mounted in
   `app/layout.tsx` → `components/Providers.tsx`.
2. `CartProvider` updates `useState<CartItem[]>` in-memory (no persistence,
   no backend write) (`lib/cart-context.tsx:26`).
3. `/cart` page (`app/cart/page.tsx`) reads `items`, `totalItems`, `totalPrice`
   and renders line items + summary; Checkout button is currently a no-op
   (`app/cart/page.tsx:207-213`).

### Backend request path (standalone, currently unused by frontend)

1. `backend/src/index.ts` connects Mongoose to
   `mongodb://localhost:27017/Clothly-ecommerce` and listens on port 5000
   (`backend/src/index.ts:11-16`).
2. Express mounts `clothesRouter` at `/shop` (`backend/src/index.ts:9`).
3. `GET /shop/men` → `menclothesModel.find().then(res.json)`
   (`backend/src/routers/clothes.ts:7-11`). `:id`, `/women`, `/kids`, `/couples`
   follow the same pattern.

**State Management:**
- Single React Context (`CartProvider`/`useCart`) for cart; no global store.
- No server state library (no SWR/React Query) — catalog is imported, not
  fetched.
- Backend holds its only persistent state inside MongoDB via Mongoose models.

## Key Abstractions

**Product (frontend catalog type):**
- Purpose: Canonical shape for a catalog item used across cards, PDP, cart.
- Examples: `lib/products.ts:13-26`
- Pattern: Plain exported `interface Product` + `interface ProductVariant`;
  consumed by type-only imports in components.

**CartItem (cart aggregate):**
- Purpose: A `Product` plus chosen size/quantity/color in the cart.
- Examples: `lib/cart-context.tsx:6-11`
- Pattern: Composite value object inside the CartContext; identity is
  `(product.id, selectedSize)`.

**Mongoose Document (backend):**
- Purpose: Persisted shop rows per section.
- Examples: `backend/src/models/menclothes.ts:3-9`, `backend/src/models/womenclothes.ts:3-9`
- Pattern: `interface XCollection extends Document` + `new Schema({...})` +
  `mongoose.model<XCollection>('name', schema)` (note: `men` model uses
  validators on `image`, `women` model does not — schema drift).

**Section-page convention:**
- Each of `/men`, `/women`, `/kids` reuses the same `StyledWrapper` + section
  layout and currently **imports the same `men*` arrays** (placeholder data
  for the not-yet-populated women/kids catalog).

## Entry Points

**Frontend (Next.js):**
- Location: `app/layout.tsx` (root layout), `app/page.tsx` (home route)
- Triggers: Next.js server runtime + browser; `next dev` / `next build`.
- Responsibilities: App shell composition (`Providers`, `Navbar`, `SideBar`,
  `main` content slot), global metadata.

**Backend (Express):**
- Location: `backend/src/index.ts`
- Triggers: `npm run dev` (nodemon) / `npm start` inside `backend/`.
- Responsibilities: HTTP server bootstrap, Mongoose connect, mount `/shop`.

## Architectural Constraints

- **Threading:** Frontend is single-threaded browser/Node Next runtime.
  Backend is single-process Node event loop with no worker threads.
- **Global state:** `CartProvider` is the only module-level mutable state on
  the client; everything else is component-local. The backend holds no
  in-process singletons — all state lives in MongoDB.
- **Circular imports:** None detected; `lib/products.ts` is a leaf module
  consumed by many components, and `lib/cart-context.tsx` depends only on
  `lib/products.ts`.
- **Two independent package trees:** Root `package.json` (Next app) and
  `backend/package.json` (Express) maintain separate dep sets. Mongoose is
  in `backend/` only; Express is duplicated in both manifests but used only
  server-side in `backend/`.
- **No path alias in backend:** Root `tsconfig.json` defines `"@/*": ["./*"]`
  for the frontend; `backend/tsconfig.json` is a separate TS config and must
  not rely on `@/` imports.
- **`CartProvider` does not persist** — cart is lost on refresh and never
  reaches the backend. This is the most important behavioral constraint for
  future phases to address.

## Anti-Patterns

### Frontend catalog only — backend not wired in

**What happens:** `lib/products.ts` hardcodes three `men*` arrays and exposes
`allProducts`/`getProductById`. No component imports anything from the Express
service, and `women`/`kids` pages render `menClothing`/`menOuterwear`/
`menShoes` verbatim.
**Why it's wrong:** The backend (`backend/src/routers/clothes.ts`) duplicates
concern the catalog already encodes on the client, but the duplication is
uncoordinated; women/kids pages ship placeholder data that visibly lies to a
shopper; schema fields (`productName`, `info`) differ from the frontend
`Product` fields (`name`, `description`).
**Do this instead:** Add a typed API client under `lib/api/` (e.g.
`lib/api/products.ts`) that fetches from the Express service, hydrate
`getProductById`/section pages from it, and delete the hardcoded arrays.
Normalize the Mongoose schema to match `Product` or vice-versa.

### `findById()` called without an argument

**What happens:** In `backend/src/routers/clothes.ts:13` the
`GET /shop/men/:id` handler does `menclothesModel.findById()` — no `id`
argument, no `req.params.id`. Mongoose will throw / return unexpected results.
**Why it's wrong:** The route parameter is never used; the endpoint cannot
return a single product correctly.
**Do this instead:** `menclothesModel.findById(req.params.id)` then handle the
`null` case with a 404.

### Cart not persisted and `Checkout` is a no-op

**What happens:** `addItem`/`removeItem` mutate in-memory `useState` and the
`Checkout` button in `app/cart/page.tsx:207-213` has no handler.
**Why it's wrong:** Refreshing the page empties the cart; there is no order
placement path; the e-commerce core (checkout) is absent.
**Do this instead:** Persist cart to `localStorage` (or a backend cart
endpoint) and implement checkout as a phase that writes an order to the
Express service.

### Mixed styling strategies

**What happens:** Three styling systems coexist — Tailwind utility classes,
inline `style={{ oklch(...) }}` objects, and `styled-components` wrappers —
often in the same component (`ClothingCard` has Tailwind classes inside a
styled-components `<StyledWrapper>`, `app/cart/page.tsx` mixes Tailwind + inline
styles).
**Why it's wrong:** Unclear single source of styling truth; hard to theme
centrally; risk of specificity conflicts.
**Do this instead:** Pick one primary styling layer (Tailwind v4 is already
installed and `lightswind.css` is present) and reserve `styled-components` for
genuinely component-scoped dynamic styling only — or migrate it away.

## Error Handling

**Strategy:** Minimal and ad-hoc.

**Patterns:**
- Frontend: server `app/product/[id]/page.tsx` calls `notFound()` when
  `getProductById` returns undefined (`app/product/[id]/page.tsx:27-29`).
- `useCart` throws on missing provider (`lib/cart-context.tsx:88-90`).
- Backend: `backend/src/index.ts` catches Mongoose connection error and logs.
  Route handlers have **no try/catch**; a thrown Mongoose error will crash the
  request and surface an unstructured 500.

## Cross-Cutting Concerns

**Logging:** `console.log`/`console.error` only (e.g.
`backend/src/routers/clothes.ts:9,18,25,31`; `backend/src/index.ts:12,15,19`).
No structured logger.

**Validation:** Mongoose schema validation only, and only on the `men` model's
`image` URL field (`backend/src/models/menclothes.ts:14-19`); `women` model has
no validators. Frontend has no input validation beyond React form state
(`ContactSection.tsx` local state).

**Authentication:** None. No auth provider, no session, no user model. The
Express service is unprotected and intended to be local-only.

---

*Architecture analysis: 2026-07-30*