# Codebase Concerns

**Analysis Date:** 2026-07-30

This document captures technical debt, latent bugs, security risks, fragile areas, performance
bottlenecks, and missing critical features in the Clothly storefront/Express codebase. Every
finding includes a concrete file path so the next planner/executor can navigate straight to it.

---

## Tech Debt

### Backend is dead code — frontend never calls it

- Issue: An entire Express + MongoDB backend lives in `backend/` but no frontend code fetches it.
  The storefront renders entirely from the in-memory catalogue in `lib/products.ts` (`menClothing`,
  `menOuterwear`, `menShoes` — hardcoded arrays of 6/5/6 items).
- Files: `backend/src/index.ts`, `backend/src/routers/clothes.ts`, `lib/products.ts`, every file
  under `app/` (no `fetch`, no `axios`, no server actions call the backend).
- Impact: Two separately deployed apps exist for no functional reason. The backend is unmaintained
  drift (bugs below), the frontend's "catalogue" is a static fixture, and there is no single source
  of truth for products. Adding a real product requires editing source code, not the database.
- Fix approach: Decide one direction first. Either (a) wire the frontend to the backend (add a
  `lib/api.ts` client and replace the static arrays with `fetch('http://localhost:5000/shop/...')`
  in a server component / route handler), or (b) delete the backend and treat `lib/products.ts` as
  the catalogue until an admin is needed. Do not keep both running in drift.

### `/women` and `/kids` pages are copy-paste stubs of `/men`

- Issue: All three category pages import the same arrays (`menClothing`, `menOuterwear`,
  `menShoes`) and render identical content — only the eyebrow label and `id` attribute differ.
- Files: `app/men/page.tsx`, `app/women/page.tsx`, `app/kids/page.tsx` (byte-identical bodies apart
  from the page title and wrapper `id`).
- Impact: Women and Kids "collections" show men's clothing. The SideBar advertises three shops that
  are indistinguishable. Violates the product brief in `PRODUCT.md` ("Curated collections for the
  whole family").
- Fix approach: Add `womenClothing` / `womenOuterwear` / `womenShoes` and equivalent kids arrays
  to `lib/products.ts` (or drive them from the backend once wired). Refactor the three page bodies
  into one `<CategoryPage section="men" />` component to kill the triplication.

### Backend stub routes: `/kids` and `/couples` return the men's model

- Issue: `GET /shop/kids` and `GET /shop/couples` both query `menclothesModel.find()` and log +
  return the result. There are no kid or couple documents, and no women endpoint uses
  `womenClothesModel` except `/women`.
- Files: `backend/src/routers/clothes.ts:23-33`.
- Impact: Backend gives the wrong data for two of the four categories it claims to serve; "couples"
  has no model at all.
- Fix approach: Add `kidsClothesModel` / `couplesClothesModel` (or a single `Product` model with a
  `section` field), give `/kids` and `/couples` their own queries, and back them with real
  fixtures. Stop reusing `menclothesModel` as a placeholder.

### Mongoose schemas disagree on the same domain shape

- Issue: `menclothesSchema` validates `image` (URL regex) and marks `image`/`productName`
  `required`; `WomenClothesSchema` declares every field as a bare `String`/`Number` with no
  `required`, no validators, no indexing. Same domain, two contracts.
- Files: `backend/src/models/menclothes.ts:11-24`, `backend/src/models/womenclothes.ts:11-17`.
- Impact: Women's documents can be saved with empty strings or invalid image URLs; the two
  collections cannot be queried uniformly. A future unified `Product` model is blocked by this
  divergence.
- Fix approach: Extract one shared `productSchema` (image with URL validator + required,
  productName required, price `min: 0`, info, category enum) and have men/women/kids/couples all
  extend it with a discriminator key. Drop the per-gender shape.

### Empty scaffolding directories

- Issue: `hooks/` and `constant/` are committed empty directories with no `.gitkeep` or content.
- Files: `hooks/` (empty), `constant/` (empty).
- Impact: Misleads navigators into expecting shared hooks/constants; linters/CI treat them
  vacuously; no project conventions attach to them.
- Fix approach: Either populate `hooks/useScrollSpy.ts` (the Navbar/SideBar scroll logic
  currently inlined would fit) and `constant/colors.ts` (the duplicated `oklch` palette) and start
  using them, or delete the directories. Do not leave empty shells.

### Duplicated dependency trees

- Issue: `express`, `mongoose`, and `nodemon` live in `backend/package.json`; `express` ALSO
  appears in the root `package.json` deps (`"express": "^5.2.1"`), alongside a heavy frontend
  bundle (`three`, `@react-three/fiber`, `@react-three/drei`, `gsap`, `framer-motion`, `motion`,
  `styled-components`, `lightswind`, `lucide-react`, `tabler`, `radix-ui`, `tailwindcss`). The
  root `express` import is unused by the Next.js app.
- Files: `package.json:19`, `backend/package.json:16-20`.
- Impact: Two `node_modules` trees, larger CI footprint than necessary, vague version drift risk
  (Express 5.x evolves quickly). The stale root `express` exists only because the backend was
  once (or notionally) co-located with the frontend.
- Fix approach: Remove `express`, the three.js stack, and any other backend/unused polyfill from
  the root `package.json`; keep the root for Next.js/UI only and pin Express to the backend
  package. Verify `installer.sh` / `lightswind.css` aren't pulling express transitively.

## Known Bugs

### `findById()` is called with no ID argument

- Symptoms: `GET /shop/men/:id` always returns `null` (or throws `CastError` depending on Mongoose
  version) regardless of the `:id` passed in the URL. The frontend `app/product/[id]/page.tsx`
  never hits this endpoint (it reads from `lib/products.ts`), so the bug is latent.
- Files: `backend/src/routers/clothes.ts:12-15` — `const oneclothe = await menclothesModel.findById();`
- Trigger: `curl http://localhost:5000/shop/men/mc1` returns `{}` instead of the document.
- Workaround: None in code; the frontend bypasses the backend entirely.
- Fix approach: `await menclothesModel.findById(req.params.id)` and add a `try/catch` that returns
  `404` when null and `400` on `CastError`. Also add the equivalent lookups for women/kids/couples
  once their models exist.

### `ProductDetail.handleAddToCart` ignores the selected size

- Symptoms: A user picks a size on the product page (`selectedSize` state-driven UI), clicks "Add
  to Cart", and the cart item is recorded with NO size even when one was selected.
- Files: `components/ProductDetail.tsx:99-104` — `addItem(product, undefined, selectedColor.colorName);`
- Trigger: Select any size → Add to Cart → open `/cart` → the line shows no size even though the
  picker was highlighted.
- Workaround: None; the second positional argument is hardcoded to `undefined` instead of
  `selectedSize ?? undefined`.
- Fix approach: `addItem(product, selectedSize ?? undefined, selectedColor.colorName)`. Optionally
  block "Add to Cart" until a size is chosen (the picker is optional today — sizes list may be
  empty for some products, see `ProductDetail.tsx` "Size info on the way" branch).

### Navbar "Shop" link 404s

- Symptoms: Clicking "Shop" in the mobile overlay nav (`overlayLinks` injects
  `{ href: '/shop', label: 'Shop' }`) routes to `/shop`, which has no page in the App Router.
- Files: `components/Navbar.tsx:154-157` (injects `/shop`), `app/` directory has no `app/shop/`
  route — only `app/men/`, `app/women/`, `app/kids/`, `app/product/`, `app/cart/`.
- Trigger: Open the mobile menu, tap "Shop", land on the Next.js 404.
- Workaround: None. The desktop nav doesn't surface this link (mobile overlay only), masking it.
- Fix approach: Resolve the abandoned plan in `plans/shop-category-pages-plan.md` either by
  creating `app/shop/page.tsx` (redirect to `/shop/men`) or by hardcoding the overlay link to
  `/men` instead of `/shop`. The plan references `app/shop/...` paths that never got built.

### `lib/products.ts` references image paths with literal spaces/parens

- Symptoms: Image `src` values like `/images/products/download (1).png` are unencoded. Browsers
  tolerate them, but `<img>` caching, copy-paste, and any future `next/image` integration will
  misbehave. `HeroHome.tsx` separately hardcodes the encoded form (`download%20(1).png`) — the two
  files disagree on encoding for the same assets.
- Files: `lib/products.ts:29-52` (unencoded), `components/HeroHome.tsx:8-13` (encoded),
  confirmed assets live as `public/images/products/download (N).png`.
- Trigger: Visually fine today; an `Image` component swap will produce "Invalid src" warnings or
  fragment the cache.
- Fix approach: Rename the assets to kebab-case (e.g. `men-classic-linen-shirt.png`) and update
  both `lib/products.ts` and `HeroHome.tsx`. Real product photography should then replace the
  generic "download" PNGs (these are stock placeholders, not the actual products described).

### `backend/package.json` `start` script points at a `.ts` file

- Symptoms: `npm start` runs `node dist/index.ts`, which Node cannot execute without a TypeScript
  loader. `dev` runs `nodemon src/index.ts` similarly — only works if `nodemon` is configured with
  `ts-node`, but no `nodemon.json` / `tsconfig` exec mapping is present.
- Files: `backend/package.json:7-9`.
- Trigger: After `npm run build` (tsc → `dist/`), `npm start` fails with
  `SyntaxError: Unexpected token :` (TypeScript syntax at runtime).
- Fix approach: `"start": "node dist/index.js"`, `"dev": "ts-node src/index.ts"` (with
  `ts-node` already in root devDeps, or add it to the backend) or `nodemon --exec ts-node
  src/index.ts`. Add a `nodemon.json` to be explicit.

## Security Considerations

### Hardcoded MongoDB URI with no auth and no env override

- Risk: Production deploys would either silently connect to `localhost` (failing) or require code
  edits to point at a real cluster — secrets end up in git. There is no `.env` loader in the
  backend, and `.gitignore` only skips root `.env*` files.
- Files: `backend/src/index.ts:11` — `mongoose.connect('mongodb://localhost:27017/Clothly-ecommerce')`.
- Current mitigation: None. No `process.env.MONGO_URI`, no `dotenv`, no environment separation.
- Recommendations:
  1. `npm i dotenv` in `backend/`, add `import 'dotenv/config'` at the top of
     `backend/src/index.ts`.
  2. `mongoose.connect(process.env.MONGO_URI ?? 'mongodb://localhost:27017/Clothly-ecommerce-dev')`.
  3. Create `backend/.env.example` (committed) documenting `MONGO_URI` and `PORT`. Create
     `backend/.env` (gitignored, like the root `.gitignore:34` does for `.env*`).

### No CORS, no helmet, no rate limiting, no input validation on the Express server

- Risk: Once the frontend is wired to call the backend, any browser origin can hit the API; there
  is no `express-validator`/`zod` on `req.params.id` or query strings; no `express-rate-limit`
  means a public `/shop/men` is trivially DoS-able. Express 5's new async model can also surface
  unhandled rejections as 500s with stack traces if `NODE_ENV` isn't set.
- Files: `backend/src/index.ts` (only `express.json()` middleware), `backend/src/routers/clothes.ts`
  (no `try/catch`, no `req.params` validation).
- Current mitigation: The backend exposes GET only (no POST/PATCH/DELETE), so writable data is
  not at risk — BUT the `findById()` bug and unhandled rejections are.
- Recommendations: Add `cors({ origin: process.env.WEB_ORIGIN })`, `helmet()`,
  `express-rate-limit`, and wrap each handler in a `try/catch` returning `next(err)`. Validate
  `req.params.id` as a Mongoose ObjectId before querying.

### Personal Gmail address committed as the business contact

- Risk: `eltohamym660@gmail.com` is embedded in committed source as the public contact email,
  exposed to scrapers. The `mailto:` link href is `mailto:concierge@clothly.com` while the visible
  text is the Gmail address — a mismatch that drops delivered mail to the wrong inbox and looks
  accidental on the page.
- Files: `components/ContactSection.tsx:11` (`WHATSAPP_NUMBER = '201011111111'`),
  `components/ContactSection.tsx:138-147` (`mailto:concierge@clothly.com` / display text Gmail).
- Current mitigation: None.
- Recommendations: Use a real business email and a real WhatsApp number via env vars or a config
  module in `constant/`. Restore href/display consistency. The current "NYC studio team"
  (`ContactSection.tsx:177`) phrasing also conflicts with the Egypt address stated two lines above
  ("Great mosque St, Alezawy, Senbellawein, Mansoura") — fix the geographic inconsistency.

### `console.log` of full query results on every request

- Risk: Every API call logs the entire result set to stdout. In production with logging
  aggregation, this leaks PII (if any) and request volume, and inflates log costs.
- Files: `backend/src/routers/clothes.ts:9, 19, 25, 31`.
- Current mitigation: None.
- Recommendations: Remove the `console.log`s or wrap them in `if (process.env.NODE_ENV !==
  'production')`. Introduce a real logger (`pino`) with structured output.

## Performance Bottlenecks

### No `next/image` anywhere — raw `<img>` ships full-size PNGs

- Problem: Every product card, the cart, the product detail page, and `HeroHome` use `<img
  src={...}>` with no optimization. The `public/images/products/` PNGs are shipped as-is at
  whatever resolution they were saved.
- Files: `components/ClothingCard.tsx:18`, `components/ShoeCard.tsx:17`,
  `components/ProductDetail.tsx:300-313`, `app/cart/page.tsx:99-103`, `components/HeroHome.tsx`.
- Cause: Plain `img` bypasses Next.js image optimization (no AVIF/WebP, no responsive sizing, no
  lazy-by-default with `loading="lazy"`).
- Improvement path: Swap to `next/image` with explicit `width`/`height` (the cards know their
  aspect ratios). Rename assets to kebab-case first (see the encoding bug above) to make the
  import clean. Import them as static imports for automatic blur placeholders.

### Heavy 3D / animation stack loaded unconditionally on the home page

- Problem: `package.json` deps include `three`, `@react-three/fiber`, `@react-three/drei`,
  `gsap`, `framer-motion`, `motion`, `styled-components`, `lightswind`, `lucide-react`,
  `@tabler/icons-react`. `HeroHome` mounts `BounceCards` and `Stack` (which load
  `@react-three/fiber`), and three category pages each mount `GsapCarousel`.
- Files: `components/HeroHome.tsx:5-6`, `components/BounceCards.tsx`, `components/MagicBento.tsx`,
  `components/GsapCarousel.tsx:4`.
- Cause: No dynamic import / `next/dynamic` with `ssr: false`; the Three.js + GSAP runtime
  downloads even on routes that never use it (cart, product detail).
- Improvement path: `next/dynamic(() => import('./BounceCards'), { ssr: false })` on the hero
  visual; audit `lightswind.css` (601 KB) for the subset of utilities actually used. Consider
  whether Three.js is justified at all for a calm-fashion brief (`PRODUCT.md` says "calm is a
  feature") — the design law in `AGENTS.md` flags the generic 3D/animation pile as slop.

### `styled-components` used without a Next.js App Router registry

- Problem: `styled-components` v6 is imported in several `app/*/page.tsx` and
  `components/*.tsx`, but there is no `StyledComponentsRegistry` / `useServerInsertedHTML`
  provider in `app/layout.tsx`. App Router does not collect styled-components' generated CSS during
  SSR without a registry.
- Files: `app/men/page.tsx`, `app/women/page.tsx`, `app/kids/page.tsx`, `components/ClothingCard.tsx`,
  `components/ShoeCard.tsx`, `components/SideBar.tsx`, `components/GsapCarousel.tsx`,
  `components/BounceCards.tsx`. Registry missing from `app/layout.tsx`.
- Cause: Each styled component injects styles into the DOM during hydration; without server
  collection, hydration may briefly render unstyled content (FOUC) and Next 16 logs warnings.
- Improvement path: Either add the official `StyledComponentsRegistry` (Next.js docs "CSS in JS"
  recipe) wrapping `children` in `app/layout.tsx`, or move these components to Tailwind/CSS
  modules to remove the dependency entirely. The second option aligns better with the existing
  Tailwind v4 setup and removes a runtime + a cleanup of duplicate styling systems.

## Fragile Areas

### `SideBar` mutates state during render

- Files: `components/SideBar.tsx:23-27` — `setPrevPathname(pathname)` etc. are called directly in
  the render body, not inside `useEffect`.
- Why fragile: React will warn ("Cannot update a component while rendering a different
  component"). Under React 19 + Next 16, this can trigger hydration mismatches or be outright
  unsupported in a future React.
- Safe modification: Replace the imperative `prevPathname` block with a `useEffect([pathname])`
  that resets `activeIndex`/`hoveredIndex` on route change. Verify the `IntersectionObserver`
  cleanup (`component/SideBar.tsx:105`) runs before re-subscribing.
- Test coverage: None — this is exactly the kind of behavior a component regression test would
  surface (see TESTCOVERAGEGAPS below).

### `Navbar` scroll-spy uses direct DOM queries and `history.replaceState` in a `useEffect`

- Files: `components/Navbar.tsx:43-89` (the entire `handleScroll` callback).
- Why fragile: It queries `document.querySelectorAll('section[id]')` on every page, including
  `/men`, `/women`, `/kids`, which have NO `<section id>` — `darkSections` is an empty array
  (`Navbar.tsx:25`) so `isOverDarkSection` is permanently `false`; any future dark hero section
  must hand-edit the file. It also rewrites `window.history` on every scroll event, which can fight
  next/navigation's own history and break back-button behavior.
- Safe modification: Centralize the section registry (a `constant/sections.ts` with
  `{ id, dark }` entries) and drive both the Navbar and SideBar from it. Throttle
  `handleScroll`. Use `next/navigation`'s router for hash changes instead of direct
  `history.replaceState`.
- Test coverage: None.

### `useCart` context value is recomputed every render

- Files: `lib/cart-context.tsx:74-83` — `totalItems` and `totalPrice` are computed inline on every
  `CartProvider` render, and the provider `value` object is recreated each render, so every
  consumer re-renders even when the cart hasn't changed.
- Why fragile: Today this is fine because `totalItems` is cheap and consumers are few. As the app
  grows (multiple cart badges, mini-cart drawer), this becomes a real re-render cost. None of the
  action callbacks are memoized with `useMemo`-ed state either.
- Safe modification: Wrap the derived totals in `useMemo` keyed on `items`. Memoize the context
  `value` object so consumers only re-render when the value reference actually changes.
- Test coverage: None — a `useCart` render-harness test (recommended in
  `.planning/codebase/TESTING.md`) would catch a regression here.

### `HeroHome` entrance animation hides content behind JS timeout

- Files: `components/HeroHome.tsx:31-52` — every hero element starts at `opacity: 0` inline and is
  revealed by a `setTimeout` chain inside a `requestAnimationFrame`. If the client bundle is
  throttled (background tab, slow device, hydration error), the hero headline stays invisible.
- Why fragile: Violates the "content is visible by default" rule (`AGENTS.md` anti-slop law). The
  hero is the first viewport; a stranded invisible-hero is the highest-impact failure mode.
- Safe modification: Default `opacity` to `1` and `transform` to `none` in the inline style, and
  only hide-then-reveal inside the effect once JS confirms it can run. Confirm the page is fully
  readable with JS disabled before treating this as done.
- Test coverage: None.

## Scaling Limits

### Single-process Express server, no clustering, no graceful shutdown

- Current capacity: One Node event loop on `process.env.PORT || 5000`. Fine for a single user.
- Limit: `mongoose.connect` is called once at boot; if it disconnects (network blip), there is no
  reconnect handler (`mongoose.connection.on('disconnected', ...)` absent). The server also has
  no `SIGTERM` handler, so deploys drop in-flight requests.
- Scaling path: Add `mongoose.connection.on('disconnected'/'reconnected')` logging, a `SIGTERM`
  graceful-shutdown that calls `server.close` then `mongoose.disconnect`. When real traffic
  arrives, run behind a process manager (PM2) or container replicas; Express 5 supports this with
  no code change.

### In-memory cart with no persistence

- Current capacity: The cart lives in React state (`lib/cart-context.tsx:26`) only.
- Limit: A page refresh, a tab close, or a route revisit after a long absence clears the cart.
  There is no `localStorage` mirror and no server-side cart.
- Scaling path: Persist `items` to `localStorage` in a `useEffect`, hydrate on mount. Later, when
  auth exists, sync to a `carts` collection keyed by user ID.

## Dependencies at Risk

### `lightswind` dependency ships a 601 KB CSS file into the repo

- Risk: `lightswind.css` (601,874 bytes) is checked into the repo root and imported via
  `@plugin 'lightswind/plugin';` in `app/globals.css:2`. It's a third-party component CSS bundle
  with a postcss plugin; version `^3.1.21` is unspecified in `package.json` deps but pulled in.
- Impact: Locks the design system to a vendored CSS framework that wasn't audited against the
  brand voice (`PRODUCT.md` is specific about restraint). A breaking change to `lightswind` flips
  the whole stylesheet.
- Migration plan: Audit which `lightswind` utility classes are actually used (likely a small subset
  given the codebase mostly writes its own `oklch(...)` inline styles). Either pin it and document
  the usage, or replace the used subset with project-owned tokens.

### `motion` AND `framer-motion` both present, with overlapping APIs

- Risk: `package.json` declares `"framer-motion": "^12.34.0"` and `"motion": "^12.43.0`. The
  `motion` package is the rebrand of `framer-motion`; importing from both pulls two near-identical
  copies. Components import inconsistently — `components/cart/page.tsx` imports from
  `motion/react`, while nothing in `components/` imports `framer-motion` directly (audit needed).
- Impact: Bundle bloat, two copies of the same animation runtime, confused imports.
- Migration plan: Standardize on `motion/react` everywhere (the AGENTS.md "standing toolkit"
  recommends `motion`), then `npm uninstall framer-motion` and remove it from `package.json`.

## Missing Critical Features

### No checkout, no payment, no auth, no wishlist persistence

- Problem: The "Checkout" button (`app/cart/page.tsx:207-213`) and the "Buy Now" button
  (`components/ProductDetail.tsx:380-388`) are dead controls — no `onClick`. There is no Stripe /
  PayPal / payment SDK, no order model in the backend, and no user/account model. The Navbar
  "Account" button (`components/Navbar.tsx:342-350`) is also a no-op.
- Blocks: This is an e-commerce app that cannot complete a purchase. Until checkout exists, the
  cart is purely cosmetic.
- Fix path: Pick a payment provider (Stripe Checkout is the lowest lift). Add an
  `Order` Mongoose model + `POST /orders` route with validation. Replace the dead Checkout button
  with a redirect to a Stripe Checkout session. Add auth next (NextAuth or a custom JWT) before
  persisting orders against users.

### No admin / no way to add products at runtime

- Problem: The backend has only `GET` routes (`backend/src/routers/clothes.ts`). There is no
  `POST`/`PATCH`/`DELETE`, no admin UI, and no auth gate. Catalog changes require committing to
  `lib/products.ts` or seeding MongoDB by hand.
- Blocks: The shop cannot grow; it cannot be operated without engineering involvement.
- Fix path: Add admin routes behind auth (`POST /shop/products`, `PATCH`, `DELETE`), validation
  via `zod`/`express-validator`, and a minimal admin page at `app/admin/`. Defer the UI until auth
  is in place.

### No product reviews, no ratings, no inventory

- Problem: Neither the frontend `Product` interface (`lib/products.ts:13-26`) nor the Mongoose
  schema (`backend/src/models/menclothes.ts`) includes stock, reviews, ratings, or SKU. Out-of-stock
  products appear identical to in-stock ones.
- Blocks: Real e-commerce UX (low-stock urgency without the "scarcity theater" `PRODUCT.md`
  rejects, honest availability, social proof via reviews).
- Fix path: Extend the shared schema (`stock: Number, default 0, min 0`,
  `reviews: [{ author, rating, body, createdAt }]`). Surface stock honestly in the UI.

## Test Coverage Gaps

### Zero project-authored tests on either tier

- What's not tested: Everything. The most recent TESTING.md (`.planning/codebase/TESTING.md`)
  documents that no test runner is installed in either `package.json`; `backend/package.json`'s
  `"test"` script is the `npm init` placeholder `echo "Error: no test specified" && exit 1`.
- Files: No `*.test.*` / `*.spec.*` exist in `app/`, `components/`, `lib/`, `hooks/`,
  `backend/src/`.
- Risk: Every fragile-area item above (SideBar render-time state, Navbar scroll-spy, cart
  re-render, the `findById()` bug, the `handleAddToCart` size-handling bug) ships with no safety
  net. Refactors are blind.
- Priority: High — at minimum add Vitest + Testing Library, write tests for `lib/products.ts`
  pure functions and `lib/cart-context.tsx`, and a supertest test for the ` findById()` bug
  (which will fail today and force the fix).

### No CI / no lint-on-PR

- What's not enforced: `eslint.config.mjs` exists (`eslint-config-next` + typescript presets) but
  there is no GitHub Actions / CI config, no pre-commit hook, and `npm run lint` isn't gated.
- Files: No `.github/`, no `.husky/`, no `lint-staged` config.
- Risk: Quality bar depends on whoever happens to run `npm run lint` locally.
- Priority: Medium — add a minimal GitHub Action running `npm run lint` and `npm run build` on
  PR, and a `next build` on the backend build. Cheap, high signal.

---

*Concerns audit: 2026-07-30*