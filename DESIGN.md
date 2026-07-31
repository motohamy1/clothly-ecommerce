---
name: Clothly Ecommerce
description: Curated fashion ecommerce for everyday clothing made to last.
colors:
  primary: "#1d2021"
  neutral-bg: "#f5f3e9"
  accent-amber: "#704214"
  border: "#dfdbc9"
typography:
  display:
    fontFamily: "Geist, sans-serif"
    fontSize: "clamp(2rem, 5vw, 4rem)"
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Geist, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
rounded:
  sm: "6px"
  md: "10px"
  lg: "16px"
spacing:
  sm: "8px"
  md: "16px"
  lg: "32px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.neutral-bg}"
    rounded: "{rounded.sm}"
    padding: "12px 24px"
  button-primary-hover:
    backgroundColor: "{colors.accent-amber}"
---

# Design System: Clothly Ecommerce

## 1. Overview

**Creative North Star: "The Considered Wardrobe"**

Clothly Ecommerce is a curated fashion experience built around warmth, restraint, and intentional choices. We treat everyday clothing with respect: real materials, clear fit guidance, and a calm shopping environment without urgency theater or neon badges.

The design system relies on warm tonal layering (soft cream backgrounds, deep ink typography, and warm amber accents) paired with clean geometric layout structure.

**Key Characteristics:**
- Warm neutral canvas (Cream `oklch(0.943 0.051 98.2)` + Ink `oklch(0.2 0.03 98)` + Warm Amber `oklch(0.3 0.1 60)`).
- Clear, balanced typographic hierarchy using Geist sans with tight display letter-spacing (`-0.02em`).
- Restrained elevation—flat surfaces with subtle borders and organic state-driven feedback.
- Zero fast-fashion gimmicks: no countdown timers, no neon sale tags, no aggressive popups.

## 2. Colors

Warm neutral palette anchored by warm cream and charcoal ink with disciplined amber accents.

### Primary
- **Deep Charcoal Ink** (`#1d2021` / `oklch(0.2 0.03 98)`): High-contrast text, primary CTA buttons, and key interactive elements.

### Neutral
- **Warm Cream** (`#f5f3e9` / `oklch(0.943 0.051 98.2)`): Default surface background across shop sections.
- **Muted Cream Border** (`#dfdbc9` / `oklch(0.88 0.04 98)`): Subtle card dividers and form input strokes.

### Accent
- **Warm Amber** (`#704214` / `oklch(0.3 0.1 60)`): Highlight tags, active states, and focal points (used on ≤10% of any view).

### Named Rules
**The Restrained Accent Rule.** Accent amber is reserved exclusively for focal actions and deliberate highlights. It must never occupy more than 10% of any viewport.

## 3. Typography

**Display Font:** Geist Sans
**Body Font:** Geist Sans

**Character:** Clean, readable modern grotesque with precise optical kerning and balanced text wrapping.

### Hierarchy
- **Display** (Semibold 600, `clamp(2rem, 5vw, 4rem)`, `1.1` line-height, `-0.02em` letter-spacing): Section headers and primary collection titles.
- **Headline** (Medium 500, `1.5rem`–`2rem`, `1.2` line-height): Card titles and feature headlines.
- **Body** (Regular 400, `1rem`, `1.6` line-height): Product descriptions and editorial prose.
- **Label** (Medium 500, `0.875rem`, `0.05em` letter-spacing, uppercase): Category filters and subtle metadata.

## 4. Elevation

The surface is flat by default with crisp subtle borders. Elevation appears strictly as responsive hover feedback or modal overlays.

### Shadow Vocabulary
- **Subtle Drop** (`0 4px 20px -2px rgba(29, 32, 33, 0.08)`): Used for elevated product cards on hover or sticky navigation.

### Named Rules
**The Border-First Rule.** Card containment and section boundaries are defined by subtle 1px borders or subtle background tonal shifts, never heavy shadows.

## 5. Components

### Buttons
- **Shape:** Rounded-sm (`6px` / `0.375rem`)
- **Primary:** Background Deep Ink (`#1d2021`), text Warm Cream (`#f5f3e9`), padding `12px 24px`.
- **Hover:** Shift to Warm Amber (`#704214`) with subtle 200ms ease transition.

### Cards / Containers
- **Corner Style:** Rounded-md (`10px` / `0.625rem`)
- **Background:** Soft Card Cream (`oklch(0.96 0.02 90)`)
- **Border:** 1px `oklch(0.88 0.04 98)`

### Inputs / Fields
- **Style:** 1px border `oklch(0.88 0.04 98)`, 16px padding, 16px min font size on mobile.
- **Focus:** Warm Amber ring offset (`oklch(0.3 0.1 60)`).

## 6. Do's and Don'ts

### Do:
- **Do** maintain a minimum text contrast ratio of 4.5:1 on all body elements against cream backgrounds.
- **Do** use `text-wrap: balance` on headers and `text-wrap: pretty` on prose.
- **Do** keep display letter-spacing at or above `-0.04em` (target `-0.02em`).

### Don't:
- **Don't** add fast-fashion urgency elements such as countdown timers, neon sale badges, or flash sale banners.
- **Don't** use gradient text or side-stripe border accents on cards.
- **Don't** use generic AI-minimal SaaS-cream templates without specific brand voice.
