# Codebase Structure

**Analysis Date:** 2026-07-30

## Directory Layout

```
clothly-ecommerce/
├── app/                       # Next.js App Router (routes only)
│   ├── cart/                  # Cart page (client)
│   │   └── page.tsx
│   ├── kids/                  # Kids collection page (client, placeholder data)
│   │   └── page.tsx
│   ├── men/                   # Men collection page (client)
│   │   └── page.tsx
│   ├── women/                 # Women collection page (client, placeholder data)
│   │   └── page.tsx
│   ├── product/
│   │   └── [id]/page.tsx      # Dynamic product detail (server component)
│   ├── globals.css            # Tailwind v4 entry + global styles
│   ├── layout.tsx             # Root layout: fonts, Providers, Navbar, SideBar
│   └── page.tsx               # Home: HeroHome + AboutPage + ContactSection
├── components/                # Flat component library (no subfolders)
│   ├── AboutPage.tsx
│   ├── BounceCards.tsx / .css  # Hero floating-cards visual
│   ├── ClothingCard.tsx       # Apparel product card
│   ├── ContactSection.tsx     # Contact form + WhatsApp link
│   ├── GsapCarousel.tsx       # Horizontal carousel (GSAP)
│   ├── HeroHome.tsx           # Landing hero
│   ├── MagicBento.tsx         # Bento grid used by AboutPage
│   ├── Navbar.tsx             # Top nav + scroll spy + cart badge
│   ├── ProductDetail.tsx      # Product detail panel (PDP)
│   ├── Providers.tsx          # CartProvider wrapper
│   ├── Reveal.tsx             # Intersection-observer reveal wrapper
│   ├── ShoeCard.tsx           # Shoe product card
│   ├── SideBar.tsx            # Left vertical shop nav
│   ├── Stack.tsx              # Draggable card stack (motion)
│   └── TiltedCard.tsx         # 3D tilt card (motion)
├── lib/                       # Client-side logic / data / utilities
│   ├── cart-context.tsx       # CartProvider + useCart hook
│   ├── products.ts            # Catalog types + hardcoded men arrays + lookups
│   └── utils.ts               # cn() helper (clsx + tailwind-merge)
├── hooks/                     # (Empty — reserved)
├── constant/                  # (Empty — reserved)
├── backend/                   # Standalone Express + Mongoose service
│   ├── src/
│   │   ├── index.ts           # Express bootstrap + Mongoose connect
│   │   ├── routers/clothes.ts # /shop routes (men, women, kids, couples, :id)
│   │   └── models/
│   │       ├── menclothes.ts  # Mongoose model 'menclothes'
│   │       └── womenclothes.ts# Mongoose model 'Womenclothes'
│   ├── package.json           # Backend deps (express, mongoose, nodemon, ts)
│   ├── tsconfig.json           # Backend TS config (no @/ alias)
│   └── node_modules/          # Backend-local deps (committed side-by-side)
├── public/
│   ├── images/products/       # Product photos (download (n).png files)
│   └── images/textures/       # Background textures (hemp-weave.jpg)
├── plans/                     # (Legacy planning docs — not part of runtime)
├── .planning/                 # GSD planning artifacts
│   └── codebase/              # This document and siblings
├── .commandcode/taste/        # Local design-taste profile (non-runtime)
├── lightswind.css             # Tailwind v4 / lightswind token CSS
├── components.json            # shadcn/ui config
├── eslint.config.mjs          # ESLint flat config (next)
├── postcss.config.mjs         # PostCSS for Tailwind v4
├── next.config.ts             # Next.js config (currently empty)
├── tsconfig.json              # Root TS config — defines `@/*` alias
├── package.json               # Frontend deps
├── package-lock.json
├── PRODUCT.md                 # Product brief
└── README.md
```

## Directory Purposes

**`app/`:**
- Purpose: Next.js App Router file routes only.
- Contains: One `page.tsx` per route, `layout.tsx` at root, `globals.css`.
- Key files: `app/layout.tsx`, `app/page.tsx`, `app/product/[id]/page.tsx`.
- Convention: Route segments are lowercase directory names; dynamic segments use
  `[id]`. Interactive pages start with `'use client'`.

**`components/`:**
- Purpose: All reusable React components — presentational + interactive.
- Contains: Flat `.tsx` (and one `.css`) files. No subfolders; no barrel file.
- Key files: `Navbar.tsx`, `SideBar.tsx`, `ClothingCard.tsx`,
  `ProductDetail.tsx`, `GsapCarousel.tsx`, `Providers.tsx`.
- Convention: PascalCase filenames matching default export name; one component
  per file; `styled-components` wrappers named `StyledWrapper`.

**`lib/`:**
- Purpose: Cross-component client logic, types, and (currently) the catalog.
- Contains: TS/TSX modules exporting hooks, contexts, pure helpers, and data.
- Key files: `lib/cart-context.tsx`, `lib/products.ts`, `lib/utils.ts`.

**`hooks/`:**
- Purpose: Intended for custom React hooks.
- Contains: Empty.
- Key files: (none).
- Convention (proposed): hook files named `useXxx.ts`, exported as named
  functions. Currently `useCart` lives in `lib/cart-context.tsx` rather than
  here — follow the established precedent (hook colocated with its provider)
  unless adding unrelated standalone hooks.

**`constant/`:**
- Purpose: Intended for app-wide constants / enums.
- Contains: Empty.
- Key files: (none). Color constants currently live inline at the top of each
  component (e.g. `DARK`, `ACCENT` in `app/cart/page.tsx:10-13`).

**`backend/`:**
- Purpose: Standalone Express REST API over MongoDB — a sibling service.
- Contains: `src/index.ts`, `src/routers/*.ts`, `src/models/*.ts`, its own
  `package.json`/`tsconfig.json` and a local `node_modules/`.
- Key files: `backend/src/index.ts`, `backend/src/routers/clothes.ts`,
  `backend/src/models/menclothes.ts`, `backend/src/models/womenclothes.ts`.
- Convention: TS files compiled with `tsc` (`build` script); run with `nodemon`
  in dev. No path alias; use relative imports.

**`public/`:**
- Purpose: Static assets served verbatim by Next.js.
- Contains: `images/products/` (product photos), `images/textures/`
  (full-bleed textures like `hemp-weave.jpg`).

**`plans/` and `.planning/`:**
- Purpose: Non-runtime planning artifacts (`plans/` is legacy, `.planning/` is
  the active GSD workspace).
- Generated: partly. Committed: yes.

## Key File Locations

**Entry Points:**
- `app/layout.tsx`: Root layout, fonts (`Geist`, `Geist_Mono` via
  `next/font/google`), mounts `Providers`/`Navbar`/`SideBar`.
- `app/page.tsx`: Home route composition (`HeroHome` + `AboutPage` +
  `ContactSection`).
- `backend/src/index.ts`: Express server bootstrap.

**Configuration:**
- `tsconfig.json`: Root config; sets `paths: { "@/*": ["./*"] }`,
  `target: ES2017`, `strict: true`, `jsx: react-jsx`,
  `moduleResolution: bundler`.
- `backend/tsconfig.json`: Separate backend TS config (no `@/*` alias — use
  relative imports only).
- `next.config.ts`: Currently empty Next config.
- `eslint.config.mjs`: Next ESLint flat config.
- `postcss.config.mjs`: Tailwind v4 PostCSS plugin.
- `components.json`: shadcn/ui settings.
- `lightswind.css`: Tailwind v4 + lightswind design tokens.

**Core Logic:**
- `lib/products.ts`: Catalog source of truth (types `Product`, `ProductVariant`;
  `menClothing`/`menOuterwear`/`menShoes` arrays; `allProducts`;
  `getProductById`, `getProductSection`, `getRelatedProducts`).
- `lib/cart-context.tsx`: `CartProvider`, `useCart`, `CartItem`/`CartContextType`.
- `lib/utils.ts`: `cn()` className merge helper.
- `backend/src/routers/clothes.ts`: All backend HTTP routes.
- `backend/src/models/menclothes.ts` / `womenclothes.ts`: Mongoose schemas.

**Styling:**
- `app/globals.css`: Global Tailwind/v4 import + base styles.
- `lightswind.css`: Component-style token library.

**Testing:**
- Not present. No `*.test.*`, `*.spec.*`, `jest.config.*`, or
  `vitest.config.*` files exist in the repo.

## Naming Conventions

**Files:**
- Components: PascalCase, matching the default export (e.g.
  `components/ClothingCard.tsx` → `export default ClothingCard`).
- Pages: lowercase `page.tsx` inside route directory.
- Context/hooks: kebab-case `.tsx` (`lib/cart-context.tsx`).
- Pure modules: kebab-case `.ts` (`lib/products.ts`, `lib/utils.ts`).
- Co-located CSS: matches the component name (`components/BounceCards.css`).
- Backend models: lowercase, sometimes pluralized
  (`menclothes.ts`, `womenclothes.ts`) — matches Mongoose collection name.

**Directories:**
- Route dirs: lowercase, matching URL segment (`men`, `women`, `kids`, `cart`).
- Dynamic route: bracket syntax `app/product/[id]/`.
- Backend: lowercase (`routers`, `models`).

**Exports:**
- Components: default export per file.
- Lib modules: named exports (`export function getProductById`), types as named
  `export interface`/`export const`.
- Backend: `export default router`; `export const <model>Model`.

## Where to Add New Code

**New route / page:**
- Create `app/<route>/page.tsx`. Use `'use client'` if it needs interactivity
  (carousels, forms, cart); keep it a server component if it only composes
  server data via `lib/products.ts`.
- Add a matching nav entry in `components/SideBar.tsx` (`items` array) and/or
  `components/Navbar.tsx` (`defaultNavLinks`) as appropriate.

**New reusable component:**
- Add `components/<PascalCaseName>.tsx` with a default export.
- Colocate `styled-components` wrapper as `StyledWrapper` inside the file when
  scoped CSS is needed; otherwise prefer Tailwind v4 utilities + OKLCH inline
  colors to match the existing mix.
- Mount global providers (if introduced) inside `components/Providers.tsx`.

**New custom hook (unrelated to cart):**
- Place in `hooks/useXxx.ts` and export as a named function. If the hook is
  inseparable from a provider (like `useCart`), keep it in the same file as
  that provider under `lib/` instead — this is the established pattern.

**New global constant / enum / token:**
- Place in `constant/` (currently empty and reserved for this purpose).

**New catalog data:**
- Short term: extend `lib/products.ts` with new typed arrays and update
  `getProductSection`/`getRelatedProducts` accordingly.
- Intended long term: replace hardcoded arrays with calls into a typed API
  client under `lib/api/` hitting `backend/src/routers/clothes.ts`.

**New backend route:**
- Add a handler in `backend/src/routers/clothes.ts` (or split a new router file
  under `backend/src/routers/` and `app.use` it in `backend/src/index.ts`).
- Add a matching Mongoose model under `backend/src/models/` if a new
  collection is required. Match the frontend `Product` shape (`name`, `price`,
  `image`, `sizes`, `description`, `section`) to avoid the current schema
  drift (`productName`, `info`).

**New shared type:**
- If it relates to the catalog or cart, put it next to its producer
  (`lib/products.ts` for `Product`/`ProductVariant`,
  `lib/cart-context.tsx` for `CartItem`/`CartContextType`).
- Avoid introducing a separate `types/` directory — none exists and the
  pattern is to colocate types with their users.

**New static asset:**
- Drop into `public/images/products/` or `public/images/textures/`. Reference
  via absolute path (`/images/products/...`) or via `<img src={product.image}>`
  using the `image` field already present on `Product`.

## Special Directories

**`backend/`:**
- Purpose: Self-contained Express service; has its own `node_modules/`,
  `package.json`, `tsconfig.json`.
- Generated: No.
- Committed: Yes (the `node_modules/` dir is committed as a side-effect of the
  backend having no separate gitignore — verify before relying on this).
- Not referenced by the Next.js build; Next.js `tsconfig.json` `include` glob
  (`**/*.ts`) will pull backend TS files into the root typecheck unless
  excluded. (No `exclude` entry currently covers `backend/` — something to
  watch when extending the backend.)

**`.next/`:**
- Purpose: Next.js build output.
- Generated: Yes (by `next dev`/`next build`).
- Committed: No (gitignored).

**`plans/`:**
- Purpose: Legacy planning documents; not imported by runtime code.
- Generated: No. Committed: Yes.

**`.planning/`:**
- Purpose: GSD workflow artifacts (this file lives here).
- Generated: Yes (by GSD commands). Committed: Yes.

**`.commandcode/`:**
- Purpose: Local design-taste profile for tooling; not runtime.
- Generated: Yes. Committed: Yes.

---

*Structure analysis: 2026-07-30*