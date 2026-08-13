# Website Redesign: Vibrant & Colorful Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the Trapar Waves website from a minimal gray/white design into a vibrant, colorful style with animations, improved components, and mobile optimization.

**Architecture:** Extend the existing Astro + Tailwind CSS v4 stack. Use vanilla JS with Intersection Observer for scroll animations (instead of Framer Motion, since this is an Astro project without React). Use `lucide` (vanilla) for icons. All animations use CSS transitions for GPU-accelerated performance.

**Tech Stack:** Astro 7.2.1, Tailwind CSS v4, Lucide (vanilla), Vanilla JS (Intersection Observer)

## Global Constraints

- All projects use **pnpm** as package manager
- Project directory: `website/` (git submodule)
- Bilingual support required for all new text (English + Chinese)
- All animations use `transform` and `opacity` only (GPU-accelerated)
- Respect `prefers-reduced-motion: reduce`
- Minimum 44px touch targets for mobile
- WCAG AA color contrast (4.5:1 for text)

## File Structure

```
website/src/
├── styles/
│   └── global.css              # MODIFY: Add brand color system, custom utilities
├── layouts/
│   └── Layout.astro            # MODIFY: Add ViewTransitions, safe area styles
├── components/
│   ├── Header.astro            # MODIFY: Scroll shadow, mobile menu, brand decoration
│   ├── Hero.astro              # MODIFY: Gradient background, stats bar, animations
│   ├── CategoryFilter.astro    # MODIFY: Colored states, icons, mobile scroll
│   ├── TemplateCard.astro      # MODIFY: Accent bar, icons, colored tags, hover glow
│   ├── Footer.astro            # MODIFY: Social links, back-to-top, multi-column
│   └── AnimatedCounter.astro   # CREATE: Reusable animated counter component
├── data/
│   └── templates.ts            # MODIFY: Add category color/icon mappings
├── lib/
│   ├── github.ts               # NO CHANGE
│   └── npm.ts                  # NO CHANGE
├── pages/
│   ├── index.astro             # MODIFY: Pass stats data to Hero
│   └── zh/index.astro          # MODIFY: Pass stats data to Hero
└── public/
    └── favicon.svg             # NO CHANGE
```

---

### Task 1: Foundation — Dependencies & Color System

**Files:**
- Modify: `website/package.json`
- Modify: `website/src/styles/global.css`
- Modify: `website/src/data/templates.ts`

**Interfaces:**
- Produces: `CATEGORY_COLORS` constant (used by CategoryFilter, TemplateCard)
- Produces: `CATEGORY_ICONS` constant (used by CategoryFilter, TemplateCard)
- Produces: CSS custom properties for brand colors

- [ ] **Step 1: Install dependencies**

```bash
cd website
pnpm add lucide
```

- [ ] **Step 2: Update global.css with brand color system**

Replace `website/src/styles/global.css` with:

```css
@import "tailwindcss";

@theme {
  --font-sans: "Inter", system-ui, -apple-system, sans-serif;

  /* Brand colors */
  --color-primary: #6366f1;
  --color-primary-light: #818cf8;
  --color-accent-pink: #f472b6;
  --color-accent-green: #34d399;
  --color-accent-amber: #fbbf24;

  /* Category colors */
  --color-cat-react: #3b82f6;
  --color-cat-3d: #8b5cf6;
  --color-cat-vue: #10b981;
  --color-cat-cli: #f59e0b;
  --color-cat-llm: #ec4899;
}

/* Smooth scrolling */
html {
  scroll-behavior: smooth;
}

/* Safe areas for mobile */
body {
  padding-top: env(safe-area-inset-top);
  padding-bottom: env(safe-area-inset-bottom);
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* Hide scrollbar for category filter */
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
```

- [ ] **Step 3: Add category color and icon mappings to templates.ts**

Add to the end of `website/src/data/templates.ts`:

```typescript
export const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string; glow: string }> = {
  react: { bg: 'bg-blue-500', text: 'text-blue-500', border: 'border-blue-500', glow: 'shadow-blue-500/20' },
  '3d': { bg: 'bg-purple-500', text: 'text-purple-500', border: 'border-purple-500', glow: 'shadow-purple-500/20' },
  vue: { bg: 'bg-emerald-500', text: 'text-emerald-500', border: 'border-emerald-500', glow: 'shadow-emerald-500/20' },
  cli: { bg: 'bg-amber-500', text: 'text-amber-500', border: 'border-amber-500', glow: 'shadow-amber-500/20' },
  llm: { bg: 'bg-pink-500', text: 'text-pink-500', border: 'border-pink-500', glow: 'shadow-pink-500/20' },
};

export const CATEGORY_LIGHT_COLORS: Record<string, string> = {
  react: 'bg-blue-50 text-blue-700',
  '3d': 'bg-purple-50 text-purple-700',
  vue: 'bg-emerald-50 text-emerald-700',
  cli: 'bg-amber-50 text-amber-700',
  llm: 'bg-pink-50 text-pink-700',
};

export const CATEGORY_ICONS: Record<string, string> = {
  react: 'atom',
  '3d': 'box',
  vue: 'leaf',
  cli: 'terminal',
  llm: 'brain',
};
```

- [ ] **Step 4: Verify build still works**

```bash
cd website && pnpm build
```

Expected: Build succeeds with no errors.

- [ ] **Step 5: Commit**

```bash
cd website
git add package.json pnpm-lock.yaml src/styles/global.css src/data/templates.ts
git commit -m "feat: add brand color system and lucide dependency"
```

---

### Task 2: Header Redesign

**Files:**
- Modify: `website/src/components/Header.astro`

**Interfaces:**
- Consumes: None
- Produces: Updated Header component with scroll shadow, mobile menu, brand decoration

- [ ] **Step 1: Rewrite Header.astro**

Replace `website/src/components/Header.astro` with:

```astro
---
interface Props {
  lang?: 'en' | 'zh';
}

const { lang = 'en' } = Astro.props;
const isZh = lang === 'zh';
---

<header id="site-header" class="sticky top-0 z-50 border-b border-gray-200/50 bg-white/80 backdrop-blur-md transition-shadow duration-300">
  <div class="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
    <a href={isZh ? '/zh' : '/'} class="flex items-center gap-3 group">
      <img
        src="https://github.com/Trapar-waves.png"
        alt="Trapar Waves"
        class="h-8 w-8 rounded-full"
        loading="eager"
      />
      <span class="text-xl font-bold">Trapar Waves</span>
      <span class="h-2 w-2 rounded-full bg-gradient-to-br from-primary to-accent-pink opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
    </a>

    <!-- Desktop nav -->
    <nav class="hidden md:flex items-center gap-6">
      <a
        href="https://github.com/Trapar-waves"
        target="_blank"
        rel="noopener noreferrer"
        class="relative text-gray-600 hover:text-gray-900 transition-colors after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-primary after:transition-all after:duration-300"
      >
        GitHub
      </a>
      <a
        href={isZh ? '/' : '/zh'}
        class="relative text-gray-600 hover:text-gray-900 transition-colors after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-primary after:transition-all after:duration-300"
      >
        {isZh ? 'English' : '中文'}
      </a>
    </nav>

    <!-- Mobile hamburger -->
    <button
      id="mobile-menu-toggle"
      class="md:hidden flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100 transition-colors"
      aria-label="Toggle menu"
    >
      <svg id="menu-icon-open" class="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
      </svg>
      <svg id="menu-icon-close" class="w-5 h-5 text-gray-700 hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  </div>

  <!-- Mobile menu drawer -->
  <div id="mobile-menu" class="md:hidden hidden border-t border-gray-200/50 bg-white/95 backdrop-blur-md">
    <nav class="flex flex-col px-4 py-4 gap-4">
      <a
        href="https://github.com/Trapar-waves"
        target="_blank"
        rel="noopener noreferrer"
        class="text-gray-700 hover:text-primary transition-colors py-2"
      >
        GitHub
      </a>
      <a
        href={isZh ? '/' : '/zh'}
        class="text-gray-700 hover:text-primary transition-colors py-2"
      >
        {isZh ? 'English' : '中文'}
      </a>
    </nav>
  </div>
</header>

<script>
  // Scroll shadow detection
  const header = document.getElementById('site-header');
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry) {
        header?.classList.toggle('shadow-md', !entry.isIntersecting);
      }
    },
    { threshold: 1, rootMargin: '-1px 0px 0px 0px' }
  );

  // Create a sentinel element at the top of the page
  const sentinel = document.createElement('div');
  sentinel.style.height = '1px';
  sentinel.style.position = 'absolute';
  sentinel.style.top = '0';
  document.body.prepend(sentinel);
  observer.observe(sentinel);

  // Mobile menu toggle
  const toggle = document.getElementById('mobile-menu-toggle');
  const menu = document.getElementById('mobile-menu');
  const iconOpen = document.getElementById('menu-icon-open');
  const iconClose = document.getElementById('menu-icon-close');

  toggle?.addEventListener('click', () => {
    const isOpen = menu?.classList.contains('hidden');
    menu?.classList.toggle('hidden');
    iconOpen?.classList.toggle('hidden');
    iconClose?.classList.toggle('hidden');
  });
</script>
```

- [ ] **Step 2: Verify build**

```bash
cd website && pnpm build
```

Expected: Build succeeds.

- [ ] **Step 3: Commit**

```bash
cd website
git add src/components/Header.astro
git commit -m "feat: redesign header with scroll shadow and mobile menu"
```

---

### Task 3: Hero Section Redesign

**Files:**
- Modify: `website/src/components/Hero.astro`
- Create: `website/src/components/AnimatedCounter.astro`
- Modify: `website/src/pages/index.astro`
- Modify: `website/src/pages/zh/index.astro`

**Interfaces:**
- Consumes: `totalStars`, `totalDownloads`, `totalTemplates` props
- Produces: `AnimatedCounter.astro` component (reusable)

- [ ] **Step 1: Create AnimatedCounter.astro**

Create `website/src/components/AnimatedCounter.astro`:

```astro
---
interface Props {
  target: number;
  suffix?: string;
  class?: string;
}

const { target, suffix = '', class: className = '' } = Astro.props;
---

<span
  class:list={['tabular-nums', className]}
  data-counter-target={target}
  data-counter-suffix={suffix}
>
  0{suffix}
</span>

<script>
  function formatNumber(num: number): string {
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + 'M';
    if (num >= 1_000) return (num / 1_000).toFixed(1) + 'k';
    return num.toString();
  }

  function animateCounter(el: HTMLElement) {
    const target = parseInt(el.dataset.counterTarget || '0', 10);
    const suffix = el.dataset.counterSuffix || '';
    const duration = 1500;
    const start = performance.now();

    function update(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * target);
      el.textContent = formatNumber(current) + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }

  // Observe counters and animate on scroll into view
  const counters = document.querySelectorAll('[data-counter-target]');
  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target as HTMLElement);
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach((el) => counterObserver.observe(el));
</script>
```

- [ ] **Step 2: Rewrite Hero.astro**

Replace `website/src/components/Hero.astro` with:

```astro
---
import AnimatedCounter from './AnimatedCounter.astro';

interface Props {
  lang?: 'en' | 'zh';
  totalTemplates?: number;
  totalStars?: number;
  totalDownloads?: number;
}

const {
  lang = 'en',
  totalTemplates = 0,
  totalStars = 0,
  totalDownloads = 0,
} = Astro.props;
const isZh = lang === 'zh';
---

<section class="relative overflow-hidden border-b border-gray-200/50">
  <!-- Gradient background -->
  <div class="absolute inset-0 bg-gradient-to-br from-primary via-accent-pink to-cat-react opacity-90"></div>

  <!-- Decorative shapes -->
  <div class="absolute inset-0 overflow-hidden">
    <div class="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
    <div class="absolute top-1/2 -left-32 h-48 w-48 rounded-full bg-white/10 blur-2xl"></div>
    <div class="absolute bottom-0 right-1/4 h-32 w-32 rounded-full bg-white/5 blur-xl"></div>
    <!-- Geometric accents -->
    <div class="absolute top-20 right-1/4 h-16 w-16 rotate-45 rounded-lg border-2 border-white/20"></div>
    <div class="absolute bottom-20 left-1/3 h-12 w-12 rounded-full border-2 border-white/15"></div>
  </div>

  <div class="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
    <h1 class="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl hero-title">
      {isZh ? 'Trapar Waves 模板' : 'Trapar Waves Templates'}
    </h1>
    <p class="mt-4 max-w-2xl text-lg text-white/90">
      {isZh
        ? '现代项目模板集合，涵盖 React、Vue、CLI 和 LLM 开发'
        : 'Modern project templates for React, Vue, CLI, and LLM development'
      }
    </p>
    <div class="mt-8">
      <a
        href="#templates"
        class="inline-flex items-center rounded-xl bg-white px-6 py-3 text-sm font-semibold text-primary shadow-lg shadow-black/20 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
      >
        {isZh ? '浏览模板' : 'Browse Templates'}
      </a>
    </div>

    <!-- Stats bar -->
    <div class="mt-12 flex flex-wrap gap-8 sm:gap-12">
      <div class="flex items-center gap-3">
        <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20">
          <svg class="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <div>
          <div class="text-2xl font-bold text-white">
            <AnimatedCounter target={totalTemplates} />
          </div>
          <div class="text-sm text-white/70">{isZh ? '模板' : 'Templates'}</div>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20">
          <svg class="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
        </div>
        <div>
          <div class="text-2xl font-bold text-white">
            <AnimatedCounter target={totalStars} />
          </div>
          <div class="text-sm text-white/70">GitHub Stars</div>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20">
          <svg class="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
        </div>
        <div>
          <div class="text-2xl font-bold text-white">
            <AnimatedCounter target={totalDownloads} suffix="/mo" />
          </div>
          <div class="text-sm text-white/70">{isZh ? 'npm 下载' : 'npm Downloads'}</div>
        </div>
      </div>
    </div>
  </div>
</section>

<style>
  .hero-title {
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }
</style>
```

- [ ] **Step 3: Update index.astro to pass stats to Hero**

Modify `website/src/pages/index.astro` — update the Hero component usage:

```astro
---
import Layout from '../layouts/Layout.astro';
import Header from '../components/Header.astro';
import Hero from '../components/Hero.astro';
import CategoryFilter from '../components/CategoryFilter.astro';
import TemplateCard from '../components/TemplateCard.astro';
import Footer from '../components/Footer.astro';
import { templates } from '../data/templates';
import { fetchGitHubStats } from '../lib/github';
import { fetchNpmDownloads } from '../lib/npm';

// Fetch live data at build time
const templatesWithData = await Promise.all(
  templates.map(async (template) => {
    const [githubStats, npmStats] = await Promise.all([
      fetchGitHubStats(template.githubRepo),
      fetchNpmDownloads(template.npmPackage),
    ]);

    return {
      ...template,
      githubStars: githubStats?.stars,
      npmDownloads: npmStats?.downloads,
      lastUpdated: githubStats?.lastUpdated,
    };
  })
);

// Calculate totals for Hero stats
const totalTemplates = templates.length;
const totalStars = templatesWithData.reduce((sum, t) => sum + (t.githubStars ?? 0), 0);
const totalDownloads = templatesWithData.reduce((sum, t) => sum + (t.npmDownloads ?? 0), 0);
---

<Layout title="Trapar Waves Templates">
  <Header lang="en" />
  <Hero lang="en" totalTemplates={totalTemplates} totalStars={totalStars} totalDownloads={totalDownloads} />

  <main id="templates" class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
    <div class="mb-8">
      <CategoryFilter lang="en" />
    </div>

    <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {templatesWithData.map((template) => (
        <TemplateCard template={template} lang="en" />
      ))}
    </div>
  </main>

  <Footer lang="en" />
</Layout>
```

- [ ] **Step 4: Update zh/index.astro similarly**

Apply the same changes to `website/src/pages/zh/index.astro`:

```astro
---
import Layout from '../../layouts/Layout.astro';
import Header from '../../components/Header.astro';
import Hero from '../../components/Hero.astro';
import CategoryFilter from '../../components/CategoryFilter.astro';
import TemplateCard from '../../components/TemplateCard.astro';
import Footer from '../../components/Footer.astro';
import { templates } from '../../data/templates';
import { fetchGitHubStats } from '../../lib/github';
import { fetchNpmDownloads } from '../../lib/npm';

// Fetch live data at build time
const templatesWithData = await Promise.all(
  templates.map(async (template) => {
    const [githubStats, npmStats] = await Promise.all([
      fetchGitHubStats(template.githubRepo),
      fetchNpmDownloads(template.npmPackage),
    ]);

    return {
      ...template,
      githubStars: githubStats?.stars,
      npmDownloads: npmStats?.downloads,
      lastUpdated: githubStats?.lastUpdated,
    };
  })
);

// Calculate totals for Hero stats
const totalTemplates = templates.length;
const totalStars = templatesWithData.reduce((sum, t) => sum + (t.githubStars ?? 0), 0);
const totalDownloads = templatesWithData.reduce((sum, t) => sum + (t.npmDownloads ?? 0), 0);
---

<Layout title="Trapar Waves 模板" lang="zh">
  <Header lang="zh" />
  <Hero lang="zh" totalTemplates={totalTemplates} totalStars={totalStars} totalDownloads={totalDownloads} />

  <main id="templates" class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
    <div class="mb-8">
      <CategoryFilter lang="zh" />
    </div>

    <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {templatesWithData.map((template) => (
        <TemplateCard template={template} lang="zh" />
      ))}
    </div>
  </main>

  <Footer lang="zh" />
</Layout>
```

- [ ] **Step 5: Verify build**

```bash
cd website && pnpm build
```

Expected: Build succeeds.

- [ ] **Step 6: Commit**

```bash
cd website
git add src/components/Hero.astro src/components/AnimatedCounter.astro src/pages/index.astro src/pages/zh/index.astro
git commit -m "feat: redesign hero with gradient background and animated stats"
```

---

### Task 4: Category Filter Redesign

**Files:**
- Modify: `website/src/components/CategoryFilter.astro`

**Interfaces:**
- Consumes: `CATEGORY_ICONS`, `CATEGORY_COLORS` from `data/templates.ts`
- Produces: Updated CategoryFilter with colored states and icons

- [ ] **Step 1: Rewrite CategoryFilter.astro**

Replace `website/src/components/CategoryFilter.astro` with:

```astro
---
import { categories, CATEGORY_ICONS } from '../data/templates';

interface Props {
  lang?: 'en' | 'zh';
}

const { lang = 'en' } = Astro.props;
const isZh = lang === 'zh';

const categoryColorMap: Record<string, string> = {
  all: 'bg-gray-900 text-white',
  react: 'bg-blue-500 text-white',
  '3d': 'bg-purple-500 text-white',
  vue: 'bg-emerald-500 text-white',
  cli: 'bg-amber-500 text-white',
  llm: 'bg-pink-500 text-white',
};

const categoryInactiveMap: Record<string, string> = {
  all: 'border-gray-300 text-gray-700 hover:bg-gray-100',
  react: 'border-blue-300 text-blue-700 hover:bg-blue-50',
  '3d': 'border-purple-300 text-purple-700 hover:bg-purple-50',
  vue: 'border-emerald-300 text-emerald-700 hover:bg-emerald-50',
  cli: 'border-amber-300 text-amber-700 hover:bg-amber-50',
  llm: 'border-pink-300 text-pink-700 hover:bg-pink-50',
};
---

<div class="overflow-x-auto hide-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
  <div class="flex gap-2 sm:flex-wrap" id="category-filter">
    {categories.map((category) => (
      <button
        data-category={category.id}
        data-active-classes={categoryColorMap[category.id]}
        data-inactive-classes={categoryInactiveMap[category.id]}
        class:list={[
          'flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200 whitespace-nowrap',
          category.id === 'all'
            ? categoryColorMap[category.id] + ' border-transparent'
            : 'border-transparent ' + categoryInactiveMap[category.id],
        ]}
      >
        {category.id !== 'all' && (
          <span class="category-icon" data-icon={CATEGORY_ICONS[category.id]}></span>
        )}
        {isZh ? category.labelZh : category.label}
      </button>
    ))}
  </div>
</div>

<script>
  import { createElement } from 'lucide';

  // Render icons
  document.querySelectorAll('.category-icon').forEach((el) => {
    const iconName = (el as HTMLElement).dataset.icon;
    if (iconName) {
      const svg = createElement(iconName);
      svg.classList.add('w-4', 'h-4');
      el.appendChild(svg);
    }
  });

  // Category filter logic
  const filter = document.getElementById('category-filter');
  const cards = document.querySelectorAll('[data-template-category]');

  filter?.addEventListener('click', (e) => {
    const button = (e.target as HTMLElement).closest('button');
    if (!button) return;

    const category = button.dataset.category;
    const activeClasses = button.dataset.activeClasses || '';
    const inactiveClasses = button.dataset.inactiveClasses || '';

    // Update active button styles
    filter.querySelectorAll('button').forEach((btn) => {
      const btnActive = btn.dataset.activeClasses || '';
      const btnInactive = btn.dataset.inactiveClasses || '';
      btnActive.split(' ').forEach((c) => { if (c) btn.classList.remove(c); });
      btnInactive.split(' ').forEach((c) => { if (c) btn.classList.add(c); });
      btn.classList.remove('border-transparent');
      btn.classList.add('border-transparent');
    });

    activeClasses.split(' ').forEach((c) => { if (c) button.classList.add(c); });
    inactiveClasses.split(' ').forEach((c) => { if (c) button.classList.remove(c); });

    // Filter cards with animation
    cards.forEach((card) => {
      const cardCategory = (card as HTMLElement).dataset.templateCategory;
      if (category === 'all' || cardCategory === category) {
        (card as HTMLElement).style.display = '';
        (card as HTMLElement).style.opacity = '0';
        requestAnimationFrame(() => {
          (card as HTMLElement).style.transition = 'opacity 0.3s ease';
          (card as HTMLElement).style.opacity = '1';
        });
      } else {
        (card as HTMLElement).style.opacity = '0';
        setTimeout(() => {
          (card as HTMLElement).style.display = 'none';
        }, 300);
      }
    });
  });
</script>
```

- [ ] **Step 2: Verify build**

```bash
cd website && pnpm build
```

Expected: Build succeeds.

- [ ] **Step 3: Commit**

```bash
cd website
git add src/components/CategoryFilter.astro
git commit -m "feat: redesign category filter with colors, icons, and transitions"
```

---

### Task 5: Template Card Redesign

**Files:**
- Modify: `website/src/components/TemplateCard.astro`

**Interfaces:**
- Consumes: `CATEGORY_COLORS`, `CATEGORY_LIGHT_COLORS`, `CATEGORY_ICONS` from `data/templates.ts`
- Consumes: `Template` type from `types/template.ts`

- [ ] **Step 1: Rewrite TemplateCard.astro**

Replace `website/src/components/TemplateCard.astro` with:

```astro
---
import type { Template } from '../types/template';
import { CATEGORY_COLORS, CATEGORY_LIGHT_COLORS, CATEGORY_ICONS } from '../data/templates';

interface Props {
  template: Template;
  lang?: 'en' | 'zh';
}

const { template, lang = 'en' } = Astro.props;
const isZh = lang === 'zh';

const colors = CATEGORY_COLORS[template.category] ?? CATEGORY_COLORS.react;
const lightColors = CATEGORY_LIGHT_COLORS[template.category] ?? CATEGORY_LIGHT_COLORS.react;
const icon = CATEGORY_ICONS[template.category] ?? 'atom';

function formatNumber(num: number): string {
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + 'M';
  if (num >= 1_000) return (num / 1_000).toFixed(1) + 'k';
  return num.toString();
}
---

<article
  data-template-category={template.category}
  class:list={[
    'group relative overflow-hidden rounded-2xl bg-white border border-gray-200/50 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl',
    colors.glow,
  ]}
>
  <!-- Top accent bar -->
  <div class:list={['h-1 transition-all duration-300 group-hover:h-1.5', colors.bg]}></div>

  <div class="p-6">
    <!-- Header -->
    <div class="flex items-start justify-between">
      <div class="flex items-start gap-3">
        <div class:list={['flex h-9 w-9 items-center justify-center rounded-lg', lightColors]}>
          <span class="card-icon" data-icon={icon}></span>
        </div>
        <div>
          <h3 class="text-lg font-semibold">
            <a
              href={`https://github.com/Trapar-waves/${template.githubRepo}`}
              target="_blank"
              rel="noopener noreferrer"
              class="hover:text-primary transition-colors"
            >
              {template.name}
            </a>
          </h3>
          <p class="mt-0.5 text-sm text-gray-500">{template.packageName}</p>
        </div>
      </div>
      <span class:list={['rounded-full px-3 py-1 text-xs font-medium', lightColors]}>
        {template.category.toUpperCase()}
      </span>
    </div>

    <!-- Description -->
    <p class="mt-4 text-sm leading-relaxed text-gray-600">
      {isZh ? template.descriptionZh : template.description}
    </p>

    <!-- Tech stack tags -->
    <div class="mt-4 flex flex-wrap gap-2">
      {template.techStack.map((tech) => (
        <span class:list={['rounded-full border px-2.5 py-0.5 text-xs font-medium transition-transform duration-150 hover:scale-105', lightColors, 'border-current/20']}>
          {tech}
        </span>
      ))}
    </div>

    <!-- Stats -->
    <div class="mt-5 flex items-center gap-4 border-t border-gray-100 pt-4 text-sm text-gray-500">
      {template.githubStars !== undefined && (
        <span class="flex items-center gap-1.5">
          <svg class="h-4 w-4 text-amber-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
          {formatNumber(template.githubStars)}
        </span>
      )}
      {template.npmDownloads !== undefined && (
        <span class="flex items-center gap-1.5">
          <svg class="h-4 w-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          {formatNumber(template.npmDownloads)}
        </span>
      )}
      {template.lastUpdated && (
        <span class="flex items-center gap-1.5">
          <svg class="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {template.lastUpdated}
        </span>
      )}
    </div>

    <!-- Action buttons -->
    <div class="mt-4 flex gap-3">
      <a
        href={`https://github.com/Trapar-waves/${template.githubRepo}`}
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center gap-1.5 rounded-lg bg-gray-900 px-4 py-2 text-xs font-medium text-white hover:bg-gray-800 active:scale-[0.98] transition-all duration-150"
      >
        <svg class="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
        </svg>
        GitHub
      </a>
      <a
        href={`https://www.npmjs.com/package/${template.npmPackage}`}
        target="_blank"
        rel="noopener noreferrer"
        class:list={[
          'inline-flex items-center gap-1.5 rounded-lg border px-4 py-2 text-xs font-medium transition-all duration-150 active:scale-[0.98]',
          colors.border,
          colors.text,
          'hover:bg-gray-50',
        ]}
      >
        <svg class="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M1.763 0C.786 0 0 .786 0 1.763v20.474C0 23.214.786 24 1.763 24h20.474c.977 0 1.763-.786 1.763-1.763V1.763C24 .786 23.214 0 22.237 0zM5.13 5.323l13.837.01c.667 0 .667.648.667 1.458v7.43c0 .81 0 1.458-.667 1.458h-.01l-9.552.01c-.74 0-.74-.66-.74-1.47V9.63c0-.564.553-1.026 1.117-1.026h2.52c.564 0 1.026-.462 1.026-1.026V5.323c0-.564-.462-1.026-1.026-1.026H5.13c-.564 0-1.026.462-1.026 1.026v.01c0 .564.462 1.026 1.026 1.026z" />
        </svg>
        npm
      </a>
    </div>
  </div>
</article>

<script>
  import { createElement } from 'lucide';

  // Render card icons
  document.querySelectorAll('.card-icon').forEach((el) => {
    const iconName = (el as HTMLElement).dataset.icon;
    if (iconName) {
      const svg = createElement(iconName);
      svg.classList.add('w-4', 'h-4');
      el.appendChild(svg);
    }
  });

  // Scroll entrance animation
  const cards = document.querySelectorAll('[data-template-category]');
  const cardObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target as HTMLElement;
          el.style.opacity = '0';
          el.style.transform = 'translateY(20px)';
          requestAnimationFrame(() => {
            el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
          });
          cardObserver.unobserve(el);
        }
      });
    },
    { threshold: 0.1 }
  );

  cards.forEach((card) => cardObserver.observe(card));
</script>
```

- [ ] **Step 2: Verify build**

```bash
cd website && pnpm build
```

Expected: Build succeeds.

- [ ] **Step 3: Commit**

```bash
cd website
git add src/components/TemplateCard.astro
git commit -m "feat: redesign template card with accent bar, icons, and hover effects"
```

---

### Task 6: Footer Redesign

**Files:**
- Modify: `website/src/components/Footer.astro`

**Interfaces:**
- Produces: Updated Footer with social links, back-to-top button

- [ ] **Step 1: Rewrite Footer.astro**

Replace `website/src/components/Footer.astro` with:

```astro
---
interface Props {
  lang?: 'en' | 'zh';
}

const { lang = 'en' } = Astro.props;
const isZh = lang === 'zh';
---

<footer class="relative overflow-hidden border-t border-gray-200/50 bg-gradient-to-b from-gray-50 to-white">
  <!-- Decorative background -->
  <div class="absolute inset-0 overflow-hidden">
    <div class="absolute -bottom-20 -right-20 h-48 w-48 rounded-full bg-primary/5 blur-3xl"></div>
    <div class="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-accent-pink/5 blur-2xl"></div>
  </div>

  <div class="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
    <div class="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      <!-- Brand -->
      <div>
        <div class="flex items-center gap-3">
          <img
            src="https://github.com/Trapar-waves.png"
            alt="Trapar Waves"
            class="h-8 w-8 rounded-full"
            loading="lazy"
          />
          <span class="text-lg font-bold text-gray-900">Trapar Waves</span>
        </div>
        <p class="mt-3 text-sm text-gray-500 max-w-xs">
          {isZh
            ? '现代项目模板集合，帮助开发者快速启动高质量项目。'
            : 'Modern project templates to help developers bootstrap high-quality projects.'
          }
        </p>
      </div>

      <!-- Links -->
      <div>
        <h3 class="text-sm font-semibold text-gray-900">{isZh ? '链接' : 'Links'}</h3>
        <nav class="mt-4 flex flex-col gap-3">
          <a
            href="https://github.com/Trapar-waves"
            target="_blank"
            rel="noopener noreferrer"
            class="flex items-center gap-2 text-sm text-gray-500 hover:text-primary transition-colors"
          >
            <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            GitHub
          </a>
          <a
            href="https://www.npmjs.com/org/trapar-waves"
            target="_blank"
            rel="noopener noreferrer"
            class="flex items-center gap-2 text-sm text-gray-500 hover:text-primary transition-colors"
          >
            <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M1.763 0C.786 0 0 .786 0 1.763v20.474C0 23.214.786 24 1.763 24h20.474c.977 0 1.763-.786 1.763-1.763V1.763C24 .786 23.214 0 22.237 0zM5.13 5.323l13.837.01c.667 0 .667.648.667 1.458v7.43c0 .81 0 1.458-.667 1.458h-.01l-9.552.01c-.74 0-.74-.66-.74-1.47V9.63c0-.564.553-1.026 1.117-1.026h2.52c.564 0 1.026-.462 1.026-1.026V5.323c0-.564-.462-1.026-1.026-1.026H5.13c-.564 0-1.026.462-1.026 1.026v.01c0 .564.462 1.026 1.026 1.026z" />
            </svg>
            npm
          </a>
        </nav>
      </div>

      <!-- Back to top -->
      <div class="flex items-end justify-start lg:justify-end">
        <button
          id="back-to-top"
          class="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:shadow-md hover:border-primary hover:text-primary transition-all duration-200 active:scale-[0.98]"
        >
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
          {isZh ? '回到顶部' : 'Back to top'}
        </button>
      </div>
    </div>

    <!-- Copyright -->
    <div class="mt-10 border-t border-gray-200/50 pt-6">
      <p class="text-center text-sm text-gray-400">
        © {new Date().getFullYear()} Trapar Waves. {isZh ? '保留所有权利。' : 'All rights reserved.'}
      </p>
    </div>
  </div>
</footer>

<script>
  const backToTop = document.getElementById('back-to-top');
  backToTop?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
</script>
```

- [ ] **Step 2: Verify build**

```bash
cd website && pnpm build
```

Expected: Build succeeds.

- [ ] **Step 3: Commit**

```bash
cd website
git add src/components/Footer.astro
git commit -m "feat: redesign footer with social links and back-to-top button"
```

---

### Task 7: Layout & View Transitions

**Files:**
- Modify: `website/src/layouts/Layout.astro`

**Interfaces:**
- Produces: Updated Layout with View Transitions and safe area support

- [ ] **Step 1: Update Layout.astro**

Replace `website/src/layouts/Layout.astro` with:

```astro
---
import '../styles/global.css';
import { ViewTransitions } from 'astro:transitions';

interface Props {
  title: string;
  lang?: 'en' | 'zh';
}

const { title, lang = 'en' } = Astro.props;
---

<!doctype html>
<html lang={lang}>
  <head>
    <meta charset="UTF-8" />
    <meta name="description" content="Trapar Waves - Modern project templates for React, Vue, CLI, and LLM development" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
    <title>{title}</title>
    <ViewTransitions />
  </head>
  <body class="min-h-screen bg-white text-gray-900 font-sans antialiased">
    <slot />
  </body>
</html>
```

- [ ] **Step 2: Verify build**

```bash
cd website && pnpm build
```

Expected: Build succeeds.

- [ ] **Step 3: Commit**

```bash
cd website
git add src/layouts/Layout.astro
git commit -m "feat: add View Transitions and viewport-fit for safe areas"
```

---

### Task 8: Final Polish & Verification

**Files:**
- No new files — verification only

- [ ] **Step 1: Run full build**

```bash
cd website && pnpm build
```

Expected: Build succeeds with no errors or warnings.

- [ ] **Step 2: Verify all components render correctly**

Run dev server and check each page:

```bash
cd website && pnpm dev
```

Checklist:
- [ ] Header: sticky, backdrop blur, mobile hamburger works
- [ ] Hero: gradient background, decorative shapes, stats bar with counters
- [ ] Category Filter: colored pills, icons, horizontal scroll on mobile
- [ ] Template Cards: accent bar, colored tags, hover glow, scroll animation
- [ ] Footer: 3-column layout, social links, back-to-top button
- [ ] Chinese page (`/zh`): all text renders in Chinese

- [ ] **Step 3: Test mobile responsiveness**

Resize browser to mobile width (375px):
- [ ] Hamburger menu appears
- [ ] Category filter scrolls horizontally
- [ ] Cards stack to single column
- [ ] Footer stacks vertically
- [ ] Touch targets are ≥44px

- [ ] **Step 4: Test reduced motion**

Enable `prefers-reduced-motion: reduce` in browser DevTools:
- [ ] No animations play
- [ ] All content still visible and functional

- [ ] **Step 5: Final commit if any fixes needed**

```bash
cd website
git add -A
git commit -m "fix: polish responsive and accessibility issues"
```
