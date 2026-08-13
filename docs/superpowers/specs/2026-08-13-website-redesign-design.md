# Website Redesign: Vibrant & Colorful Style Upgrade

**Date:** 2026-08-13
**Project:** `website` (Astro + Tailwind CSS v4)
**Goal:** Transform the current minimal gray/white design into a vibrant, colorful style inspired by Figma/Notion

## Current State

- Astro 7.2.1 + Tailwind CSS v4 static site
- 11 templates across 5 categories (React, 3D, Vue, CLI, LLM)
- Bilingual support (English/Chinese)
- Live data: GitHub stars, npm downloads, last updated
- Design: All gray/white, basic typography, no visual hierarchy

## Design Decisions

### Style Direction

**Vibrant & Colorful** — playful, modern, with strong visual hierarchy. Inspired by Figma and Notion's design language: rounded corners, bold colors, friendly typography, delightful micro-interactions.

### Tech Stack Additions

| Tool | Purpose | Justification |
|------|---------|---------------|
| **Framer Motion** | Scroll animations, micro-interactions, page transitions | Best-in-class React-compatible animation library |
| **Lucide React** | Icon system | Lightweight, tree-shakeable, consistent style |
| **Tailwind CSS v4** | Continue as style foundation | Already in use, extend with custom theme |

### Bundle Strategy

- Framer Motion: ~30kb gzipped, loaded only where needed via Astro islands
- Lucide: Import individual icons, not the full library
- No additional CSS framework — extend Tailwind's theme

---

## Brand Color System

### Primary Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `primary` | `#6366f1` | Primary actions, links, brand identity |
| `primary-light` | `#818cf8` | Hover states, secondary elements |
| `accent-pink` | `#f472b6` | Decorative accents, gradients |
| `accent-green` | `#34d399` | Success states, positive metrics |
| `accent-amber` | `#fbbf24` | Highlights, attention |

### Category Colors

Each template category gets a distinct color for visual identity:

| Category | Color | Hex | Icon |
|----------|-------|-----|------|
| React | Blue | `#3b82f6` | `Atom` |
| 3D | Purple | `#8b5cf6` | `Box` |
| Vue | Emerald | `#10b981` | `Leaf` |
| CLI | Amber | `#f59e0b` | `Terminal` |
| LLM | Pink | `#ec4899` | `Brain` |

### Gradient Definitions

- **Hero gradient:** `linear-gradient(135deg, #6366f1, #f472b6, #3b82f6)` — purple to pink to blue
- **CTA button:** `linear-gradient(135deg, #6366f1, #8b5cf6)` — solid purple
- **Card accent:** Category color at 10% opacity for backgrounds

---

## Component Redesigns

### 1. Header

**Current:** Plain white header with text links
**New:**

- Add subtle backdrop blur with white/80% opacity
- Logo area: Add a small colored dot decoration next to the brand name
- Scroll behavior: Add shadow on scroll (detect via Intersection Observer)
- Navigation links: Hover underline animation with category color
- Mobile: Hamburger menu with slide-in drawer (currently no mobile menu)

### 2. Hero Section

**Current:** Plain gray background, basic title + subtitle + CTA button
**New:**

- **Background:** Gradient mesh (purple → pink → blue) with subtle geometric shapes (circles, hexagons) as decorative elements
- **Title:** Gradient text effect (`bg-clip-text text-transparent` with gradient)
- **Subtitle:** Larger, with a subtle text shadow for depth
- **Stats bar:** Below the CTA, show 3 key metrics:
  - Total templates (count)
  - Total GitHub stars (sum)
  - Total npm downloads (sum)
  - Each with an icon and animated counter
- **Animation:** Title fades in from below, stats count up on scroll into view

### 3. Category Filter

**Current:** Basic pill buttons, gray/white
**New:**

- **Active state:** Category color background (not just black)
- **Inactive state:** Category color text on white background with colored border
- **Icons:** Add Lucide icon before each category label
- **Mobile:** Horizontal scroll with snap points, hide scrollbar
- **Animation:** Active indicator slides between buttons (shared layout animation)

### 4. Template Card

**Current:** Simple bordered card with basic hover translate
**New:**

- **Top accent bar:** 4px colored bar matching category color
- **Card body:** White background with subtle shadow (`shadow-sm`), rounded corners (`rounded-2xl`)
- **Header area:**
  - Category icon (colored) + template name
  - Category badge uses category color scheme
- **Description:** Slightly larger text, better line-height
- **Tech stack tags:**
  - Use category color scheme (light background + dark text)
  - Rounded pills with subtle border
- **Stats footer:**
  - Custom icons (Star, Download, Clock from Lucide)
  - Better number formatting (1.2k instead of 1200)
  - Separated with subtle dividers
- **Action links:**
  - Styled as buttons: "View on GitHub" and "View on npm"
  - GitHub button: dark with icon
  - npm button: outlined with icon
- **Hover effects:**
  - Card lifts (`translateY(-4px)`)
  - Shadow expands (`shadow-xl`)
  - Subtle glow effect using box-shadow with category color at 20% opacity
  - Top accent bar grows slightly

### 5. Footer

**Current:** Very minimal, just copyright + 2 links
**New:**

- **Background:** Light gradient or pattern
- **Content:**
  - Brand name with tagline
  - Social links with icons (GitHub, npm, Twitter if applicable)
  - "Back to top" button with smooth scroll
  - Copyright notice
- **Layout:** Multi-column on desktop, stacked on mobile

---

## Animation Specifications

### Scroll Animations (Framer Motion)

```typescript
// Card entrance animation
const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1, // Stagger effect
      duration: 0.5,
      ease: "easeOut",
    },
  }),
};

// Hero title animation
const heroVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};
```

### Micro-interactions

| Element | Trigger | Animation |
|---------|---------|-----------|
| Card | Hover | `translateY(-4px)`, shadow expand, 200ms ease |
| Button | Hover | Scale `1.02`, shadow expand, 150ms ease |
| Button | Tap | Scale `0.98`, 100ms ease |
| Category pill | Click | Background color crossfade, 200ms |
| Stats number | Scroll into view | Count up animation, 1s |
| Tech tag | Hover | Slight scale up, 150ms |

### Page Transitions

Use Astro's View Transitions API:

```typescript
// In Layout.astro
import { ViewTransitions } from 'astro:transitions';

<head>
  <ViewTransitions />
</head>
```

---

## Mobile Optimizations

### Responsive Breakpoints

- **sm (640px):** 2-column card grid
- **md (768px):** Navigation collapses to hamburger
- **lg (1024px):** 3-column card grid, full navigation

### Touch Interactions

- Cards: Tap feedback (scale 0.98, 100ms)
- Category filter: Horizontal swipe with momentum
- Buttons: Minimum 44px touch targets

### Safe Areas

```css
/* iPhone notch/dynamic island */
body {
  padding-top: env(safe-area-inset-top);
  padding-bottom: env(safe-area-inset-bottom);
}
```

### Performance

- All animations use `transform` and `opacity` only (GPU-accelerated)
- `will-change` hints on animated elements
- Reduce motion for `prefers-reduced-motion: reduce`
- Lazy-load below-fold images/components

---

## Implementation Phases

### Phase 1: Foundation

- [ ] Install dependencies (Framer Motion, Lucide)
- [ ] Set up brand color system in Tailwind config
- [ ] Create CSS custom properties for theme

### Phase 2: Component Redesign

- [ ] Header: scroll shadow, mobile menu, brand decoration
- [ ] Hero: gradient background, animated title, stats bar
- [ ] Category Filter: colored states, icons, mobile scroll
- [ ] Template Card: accent bar, icons, colored tags, hover glow
- [ ] Footer: social links, back-to-top, multi-column layout

### Phase 3: Animations

- [ ] Framer Motion scroll animations for cards
- [ ] Hero entrance animation
- [ ] Category filter transition
- [ ] Stats counter animation
- [ ] Page transitions via View Transitions API

### Phase 4: Polish

- [ ] Mobile hamburger menu
- [ ] Touch interactions
- [ ] Safe area handling
- [ ] `prefers-reduced-motion` support
- [ ] Performance audit

---

## Accessibility

- All interactive elements have visible focus states
- Color contrast meets WCAG AA (4.5:1 for text)
- Animations respect `prefers-reduced-motion`
- Semantic HTML maintained throughout
- Screen reader labels for icons

---

## Open Questions

None — all design decisions have been made.
