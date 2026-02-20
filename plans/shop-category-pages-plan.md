# Shop Category Pages Architecture Plan

## Overview
Implement a multi-category shop section with 4 pages (Men, Women, Kids, Couples) featuring:
- Fixed navbar across all pages
- Consistent HeroShop layout for each category
- **Carousel slide effect** for navigation between categories
- Same background color (`#F0EDCC` - mencolor) for all categories
- `/shop` redirects to `/shop/men` as default

## Current Structure Analysis

### Existing Files
- [`app/shop/page.tsx`](app/shop/page.tsx) - Main shop page with Navbar and HeroShop
- [`app/shop/layout.tsx`](app/shop/layout.tsx) - Shop layout wrapper with theme
- [`app/shop/HeroShop.tsx`](app/shop/HeroShop.tsx) - Shop content with MagicBento and 3D carousel
- [`components/Navbar.tsx`](components/Navbar.tsx) - Reusable navbar with navLinks prop

### Available Dependencies
- `framer-motion` - For page transitions and animations
- `gsap` - For advanced animations
- `next` 16.1.6 - App Router with file-based routing

## Architecture Design

### File Structure
```
app/shop/
├── layout.tsx              # Updated with fixed navbar
├── page.tsx                # Redirects to /shop/men or default landing
├── HeroShop.tsx            # Shared component with category prop
├── men/
│   └── page.tsx            # Men category page
├── women/
│   └── page.tsx            # Women category page
├── kids/
│   └── page.tsx            # Kids category page
└── couples/
    └── page.tsx            # Couples category page

components/
├── Navbar.tsx              # Updated with active state highlighting
└── ui/
    └── PageTransition.tsx  # New: Page transition wrapper component
```

### Component Design

#### 1. Updated Shop Layout (`app/shop/layout.tsx`)
```tsx
// Fixed navbar at top, children render below
// Include page transition wrapper
```

#### 2. Enhanced HeroShop Component
- Add `category` prop to customize content per category
- Categories: 'men' | 'women' | 'kids' | 'couples'
- Dynamic title based on category
- Category-specific content can be added later

#### 3. Page Transition Component
**Selected: Carousel Slide Effect**
- Uses Framer Motion's `AnimatePresence` and motion components
- Slides pages left/right based on navigation direction
- Detects category order to determine slide direction
- Smooth, intuitive navigation experience

#### 4. Category Pages
Each page will:
- Use the shared HeroShop component
- Pass category prop
- Be wrapped in PageTransition component

## Navigation Flow

```mermaid
flowchart LR
    A[Navbar] -->|Men| B[/shop/men]
    A -->|Women| C[/shop/women]
    A -->|Kids| D[/shop/kids]
    A -->|Couples| E[/shop/couples]
    
    B -->|Transition| F[HeroShop category=men]
    C -->|Transition| G[HeroShop category=women]
    D -->|Transition| H[HeroShop category=kids]
    E -->|Transition| I[HeroShop category=couples]
```

## Page Transition Animation

### Carousel Effect Implementation
```tsx
// Direction-based slide animation
const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0
  }),
  center: {
    x: 0,
    opacity: 1
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 1000 : -1000,
    opacity: 0
  })
}
```

## Implementation Steps

### Step 1: Create PageTransition Component
- Create `components/ui/PageTransition.tsx`
- Implement carousel slide effect using Framer Motion
- Track navigation direction for proper animation

### Step 2: Update HeroShop Component
- Add category prop with type definition
- Update title to be dynamic based on category
- Prepare for category-specific content

### Step 3: Update Shop Layout
- Move Navbar to layout for fixed positioning
- Wrap children with AnimatePresence for transitions

### Step 4: Create Category Pages
- Create folder structure for each category
- Create page.tsx for each category
- Import and use HeroShop with category prop

### Step 5: Update Navbar
- Add active state detection using `usePathname`
- Highlight current category in navigation

### Step 6: Configure Redirects (Optional)
- Make `/shop` redirect to `/shop/men` as default

## Category Configuration

```typescript
export const SHOP_CATEGORIES = {
  men: {
    slug: 'men',
    label: 'Men',
    title: 'Men Collection',
    color: '#02343F' // mencolor
  },
  women: {
    slug: 'women', 
    label: 'Women',
    title: 'Women Collection',
    color: '#...' // to be defined
  },
  kids: {
    slug: 'kids',
    label: 'Kids', 
    title: 'Kids Collection',
    color: '#...' // to be defined
  },
  couples: {
    slug: 'couples',
    label: 'Couples',
    title: 'Couples Collection',
    color: '#...' // to be defined
  }
} as const
```

## Technical Considerations

### Performance
- Use `framer-motion`'s `LazyMotion` for reduced bundle size
- Implement `layoutId` for shared element transitions
- Preload adjacent pages for smoother navigation

### Accessibility
- Ensure transitions respect `prefers-reduced-motion`
- Maintain keyboard navigation during transitions
- Proper ARIA labels for navigation

### SEO
- Each category page should have unique metadata
- Implement proper canonical URLs
- Add structured data for products

## Decisions Made

- **Transition Effect**: Carousel slide effect (left/right based on navigation direction)
- **Category Colors**: Same background color (`#F0EDCC`) for all categories
- **Default Route**: `/shop` redirects to `/shop/men`
- **Mobile Navigation**: Same transition effect on all devices

## Next Steps

Switch to Code mode to implement:
1. PageTransition component with carousel slide effect
2. Updated HeroShop with category prop
3. Category page routes (men, women, kids, couples)
4. Updated layout with fixed navbar
5. Navbar active state highlighting
6. Redirect configuration for `/shop` → `/shop/men`