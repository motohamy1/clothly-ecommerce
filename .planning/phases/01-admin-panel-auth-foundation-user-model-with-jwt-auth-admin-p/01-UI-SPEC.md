---
phase: 1
slug: admin-panel-auth-foundation-user-model-with-jwt-auth-admin-product-crud-ui
status: draft
shadcn_initialized: false
preset: none
created: 2026-07-30
---

# Phase 1 — UI Design Contract

> Visual and interaction contract for the admin panel and storefront migration. Source: `PRODUCT.md` brand voice + `AGENTS.md` anti-slop design law + `01-CONTEXT.md` decisions.

---

## Design System

| Property | Value |
|----------|-------|
| Tool | shadcn/ui (new-york, neutral base, CSS variables, `lucide` icons) — already configured in `components.json` |
| Preset | not applicable — we author per-element; no Tailark/MagicUI/Aceternity presets |
| Component library | Radix UI primitives (already in root `package.json`) |
| Icon library | `lucide-react` (per `components.json`) — bare, no box behind them |
| Font | **Body:** system-ui stack via `Geist` (already loaded by `app/layout.tsx:13-20`). **Display:** same family at heavier weight. Do NOT add Cormorant / Fraunces / Inter / Space Grotesk / Syne / Sora / Archivo — all flagged in the anti-slop design law. Geist is already in the project; we do not introduce another display face. |

---

## Spacing Scale

Declared values (multiples of 4; tokens are 4px-grid):

| Token | Value | Usage |
|-------|-------|-------|
| xs | 4px | Icon gaps, inline padding, badge inner padding |
| sm | 8px | Compact element spacing, table cell padding |
| md | 16px | Default element spacing, form field gaps, button padding |
| lg | 24px | Section padding within a page, card padding |
| xl | 32px | Layout gaps between major blocks (sidebar ↔ main) |
| 2xl | 48px | Major section breaks inside admin pages |
| 3xl | 64px | Page-level spacing (admin top → first content) |

Exceptions: the product detail page on the storefront keeps its existing spacing — admin surfaces use the scale above; storefront migration does not redesign existing product cards.

---

## Typography

| Role | Size | Weight | Line Height | Notes |
|------|------|--------|-------------|-------|
| Body | 15px | 400 | 1.6 | All admin body copy, table rows, form labels |
| Body emphasis | 15px | 500 | 1.6 | Inline emphasis, table cell primary text |
| Label (form) | 13px | 500 | 1.4 | Form field labels, table headers — uppercase NOT required |
| Helper text | 13px | 400 | 1.5 | Field descriptions, captions, hints |
| Heading (h2 page) | 24px | 600 | 1.3 | Page title (e.g. "Products", "Edit product") |
| Heading (h3 section) | 18px | 600 | 1.35 | Section dividers inside a page (tab labels, card titles) |
| Stat number | 32px | 600 | 1.1 | Dashboard stat tile numbers — keep tabular numerals |
| Display (login headline) | 28px | 500 | 1.25 | The login page's only display moment — `font-feature-settings: "ss01"` is OK if available, but do not reach for an italic accent word |

**Type discipline:**
- One font family across the admin (Geist) — no secondary display face.
- Do not use letter-spaced uppercase caps for eyebrows, buttons, or labels. (The anti-slop law treats "one label treatment, everywhere" as a tell.)
- Stat numbers use `font-variant-numeric: tabular-nums` so columns align in the dashboard.

---

## Color

| Role | Value | Usage |
|------|-------|-------|
| Dominant (60%) | `#FAF7F2` (warm off-white, the project's "paper" surface) | Page background, table background, form background |
| Secondary (30%) | `#1A1814` (warm ink) | All primary text, sidebar background, top nav background, table header strip |
| Surface elevation | `#FFFFFF` (slightly warmer than dominant) | Cards, inputs, dialog surfaces — feel lifted by value, not by shadow |
| Hairline border | `rgba(26, 24, 20, 0.08)` | Table row separators, card edges, input borders — self-colored, not a contrasting outline |
| Accent (10%) | `#B8763A` (warm amber, the brand's "considered" accent) | Reserved for: the active nav indicator (text color shift, NOT a dot underneath), the "Save" button's filled state, the focus ring, and the dashboard's primary stat highlight. **Never** on every interactive element. |
| Destructive | `#8B2E1F` (oxblood, not bright red) | Destructive button (`Delete`), destructive confirmation |
| Success / confirm | `#3F6B47` (muted forest) | Toast "Product saved" only |
| Muted text | `rgba(26, 24, 20, 0.6)` | Helper text, secondary labels, table cell secondary line |

**Color discipline:**
- 60/30/10 with discipline. The accent appears on at most 3 places in any single view.
- No blue, no purple, no gradient fills. No `background: linear-gradient(...)` on buttons or pages. (Anti-slop law §"Saturated accent color".)
- No neon sale badges. No countdown timers. No "X% off" highlights. (PRODUCT.md anti-references.)
- WCAG 2.1 AA: `#1A1814` on `#FAF7F2` is 14.5:1 (body text passes easily). `#B8763A` on `#FAF7F2` is 3.6:1 — use for **large text and icons only**, never body copy.

---

## Copywriting Contract

Voice: considered, warm, intentional (per `PRODUCT.md` §Brand Personality). Declarative and quiet. Earned specifics over superlatives.

| Element | Copy |
|---------|------|
| Login page headline | "Sign in to manage the shop." |
| Login page helper | "Enter the email and password you set up with the team." |
| Login CTA | "Sign in" (verb-first, single button) |
| Login error (wrong creds) | "That email and password don't match. Try again, or reach out if you've lost access." |
| Login error (no `JWT_SECRET` server-side) | "The shop can't sign anyone in right now. The site owner needs to set the auth secret on the server." |
| Empty dashboard (no products) | "Nothing here yet. Add your first piece to start the catalog." |
| Dashboard stat label | "Products", "Men", "Women", "Kids" (just the noun — no "Total" prefix) |
| Backend disconnected banner | "Can't reach the catalog right now. Admin changes are saved locally; the storefront will catch up when the server is back." |
| Products list — empty | "No products yet. Start by adding one." |
| Products list — table column "Section" | "Section" (not "Category") |
| Create form — page title | "New product" |
| Edit form — page title | "Edit · {product name}" |
| Edit form — tab labels | "Basics", "Images", "Sizes", "Variants" (no period, no chevron) |
| Save button | "Save product" |
| Save error | "Couldn't save. {error message}. Check the fields and try again." |
| Delete trigger | "Remove" (not "Delete" — softer, more on-brand) |
| Delete dialog title | "Remove {product name}?" |
| Delete dialog body | "This will take the product off the storefront immediately. You can re-add it later, but any product details will need to be re-entered." |
| Delete dialog confirm | "Remove product" |
| Delete dialog cancel | "Keep it" |
| Sign out | "Sign out" |
| Image upload — dropzone prompt | "Drop an image here, or click to pick. JPG, PNG, or WebP. 5 MB max." |
| Image upload — error (wrong type) | "That file type isn't supported. Use a JPG, PNG, or WebP." |
| Image upload — error (too large) | "That image is over 5 MB. Try a smaller file." |
| Image upload — success | "Image uploaded." |
| Field required error | "This field is required." |
| iOS input zoom (D-22) | All inputs render at 16px on mobile to avoid iOS Safari auto-zoom. |

**Copy discipline:**
- No countdown timers. No "Session expires in:". No "X admins online." (PRODUCT.md anti-references.)
- No urgency theater. No "limited drop." No "while supplies last."
- No generic AI phrasing. No "Welcome back!" No exclamation marks.
- No "limited" / "exclusive" / "premium" / "luxury" superlatives (anti-slop + PRODUCT.md).
- Errors name the problem and the next step. No "Something went wrong."

---

## Registry Safety

| Registry | Blocks Used | Safety Gate |
|----------|-------------|-------------|
| shadcn official | `button`, `input`, `label`, `table`, `dialog`, `card`, `select`, `textarea`, `tabs`, `alert-dialog`, `sonner` (or hand-rolled toast — pick at plan time) | not required (official primitives are the trusted foundation) |
| Third-party (none planned) | — | n/a — do NOT pull from Tailark / MagicUI / Aceternity / Kokonut for this phase |

**Use real primitives, not a prebuilt marketing block.** The shadcn blocks are accessible defaults — we override the styling at the component level with the tokens above, but the underlying Radix behavior is trusted.

---

## Animation & Motion

| Trigger | Behavior | Reduced-motion |
|---------|----------|----------------|
| Hover on a button | Background tone shifts (200ms ease-out). No translateY. No scale. | respected (no-op) |
| Hover on a table row | Background tone shifts (150ms). | respected |
| Tab change in the edit form | Content cross-fades (200ms). No slide. | respected |
| Dialog open | Fade + slight scale from 0.98 to 1 (180ms). | scale removed; fade only |
| Toast | Slides up 16px and fades (220ms). | slide removed; fade only |
| Sign-in success | Redirect (no client animation). | n/a |
| Dashboard stat numbers | Count-up animation on first paint (600ms ease-out). | skip if `prefers-reduced-motion: reduce` |

**Animation discipline:**
- Never animate `opacity` from 0 to 1 as the *only* way content becomes visible. Content is visible by default; entrance animation is enhancement, not gate. (Anti-slop law §"Never hide content behind an entrance animation".)
- No floating cards. No parallax in the admin.
- No box-shadow bloom on hover. Depth from tone shift only.
- No glow / drop-shadow on the active nav item. Active state is a text color + 1px left bar (warm amber) on the sidebar item.

---

## Layout & Components

### Login page (`/admin/login`)

- Centered card on the warm off-white page background.
- Card width: 380px max, full width minus 32px gutters on mobile.
- Card padding: 32px.
- The card is the only signature moment on the auth surface: a 1px hairline border (self-colored, not contrasting), an inset highlight on the top edge (1px `#FFFFFF` at 60% opacity), and a 2px warm-amber rule above the form that reads as a bookmark, not a decoration.
- The headline sits above the email field, not floating over an image.
- The "Sign in" button is full-width, filled with `#1A1814` (ink), white label, 16px padding, 8px corner radius. No gradient. No glow.
- Below the form: a single line of muted helper text ("Need help? Reach the team at hello@clothly.test.") — small, restrained, on-brand.
- No "forgot password" link (out of scope, no public signup).

### Admin layout (`/admin/**`)

- Two-column: left sidebar (220px) + main content (fluid).
- Sidebar: ink background, off-white labels. Active item: 1px warm-amber left bar + text color `#FAF7F2` at 100%. No dot. No underline.
- Sidebar items: "Dashboard", "Products", "— spacer —", "Sign out" (anchored bottom).
- Top of the main area: a thin (1px) hairline separator from the sidebar (not a hard line — `rgba(26, 24, 20, 0.08)`).
- The admin chrome is **deliberately quiet** — the work is the content. No floating cards, no gradient headers, no oversized wordmark.

### Dashboard (`/admin`)

- Page title: "Dashboard" (h2, 24px, 600).
- Below the title: a single line of muted helper ("Real-time view of what's in the catalog.").
- Stats grid: 4 tiles in a row (Total / Men / Women / Kids). Each tile: 1px hairline border, no shadow, no icon-tile. The number is large (32px, 600). The label is below in 13px muted.
- Backend connection status: a single line at the top of the page — "Connected to the catalog server." or "Can't reach the catalog server." — with a 4px-wide vertical bar in `#3F6B47` or `#8B2E1F` to the left of the text. No badge. No pill.
- Below the stats: a "Recent activity" placeholder card. **Empty state:** "No edits yet. Add your first product to see activity here." — not faked metrics. (PRODUCT.md §Anti-references.)

### Products list (`/admin/products`)

- Page title: "Products" + a primary "New product" button on the right (ink fill, off-white label).
- Search input above the table (full width, max 320px). Filters by name.
- Table columns: thumbnail (40×40, square, no border-radius beyond 4px), Name, Section, Group, Price, Updated, Actions (a `•••` overflow menu, not three text buttons).
- Row hover: background tone shifts to `rgba(26, 24, 20, 0.03)`.
- Empty state: "No products yet. Start by adding one." + a single "New product" button.

### Create / Edit form (`/admin/products/new`, `/admin/products/[id]`)

- Tabs (Radix Tabs, our shadcn `Tabs` primitive): Basics · Images · Sizes · Variants.
- Each tab is a separate `<form>` section, but the Save button lives at the bottom of the page (sticky footer on desktop, normal flow on mobile) and submits all tabs together.
- Field groups separated by 24px vertical space; sections inside a tab separated by a 1px hairline + 24px.
- Repeatable rows (`images[]`, `sizes[]`, `variants[]`): each row is a card with the row fields + a small `×` icon button (not a text "Remove" button) to delete the row. Add-row link below the list: "+ Add another image" / "+ Add a size" / "+ Add a variant" — not a "+ Add" button.
- Image upload on the "Images" tab: a single dropzone at the top of the tab. After upload, the file is added to `images[]` and a preview chip appears below.
- The Save button is full-width on mobile, 200px on desktop, anchored to the sticky footer.

### Sign out

- Single sidebar item. Clicking it POSTs to `/api/auth/logout` and redirects to `/admin/login`.

---

## Typography & Color Discipline Checklist

These are the items the gsd-ui-checker will verify against this contract:

- [ ] Body copy uses `Geist` (or its variable) — no Cormorant, Fraunces, Inter, Space Grotesk, Syne, Sora, Archivo, or any other font pulled in this phase.
- [ ] No letter-spaced uppercase caps used as eyebrows, labels, or button text. Tab labels, button labels, and table column headers are sentence case.
- [ ] No blue / purple / cyan / magenta / pink / orange highlights. The only accent color is warm amber `#B8763A` and it appears on at most 3 elements per view.
- [ ] No gradient fills on buttons, cards, or pages. No `background: linear-gradient(...)` anywhere in admin styles.
- [ ] No countdown timers, no "session expires in" widgets, no urgency theater of any kind.
- [ ] No oversized footer wordmark on admin pages. No brand-mark "logo" in the admin sidebar (the sidebar shows the word "Admin" or the section name, not a logo).
- [ ] No box-shadow on cards or buttons. Depth comes from tone shift (`#FFFFFF` on `#FAF7F2`).
- [ ] No "MOST POPULAR" or "RECOMMENDED" pill on any element.
- [ ] No icon-in-a-colored-tile. Icons are bare, sized to the field, in `#1A1814` (ink) or `rgba(26, 24, 20, 0.6)` (muted).
- [ ] No glassmorphism, no neumorphism, no skeuomorphic effects.
- [ ] All interactive elements meet WCAG 2.1 AA contrast (4.5:1 for body, 3:1 for large text and UI).
- [ ] All form inputs render at 16px on mobile to avoid iOS Safari auto-zoom.
- [ ] `prefers-reduced-motion: reduce` is respected on every animation.
- [ ] Content is visible by default; no entrance reveal hides content if the animation does not run.

---

## Checker Sign-Off

- [ ] Dimension 1 Copywriting: PASS
- [ ] Dimension 2 Visuals: PASS
- [ ] Dimension 3 Color: PASS
- [ ] Dimension 4 Typography: PASS
- [ ] Dimension 5 Spacing: PASS
- [ ] Dimension 6 Registry Safety: PASS

**Approval:** pending
