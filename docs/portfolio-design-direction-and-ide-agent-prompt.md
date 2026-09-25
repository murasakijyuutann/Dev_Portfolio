# Portfolio Design Direction and IDE Agent Prompt

## Purpose

This document defines the visual system, content hierarchy, implementation rules, and quality standard for a professional software-engineering portfolio. It is intended to prevent generic AI-generated layouts while maintaining a distinctive visual identity.

The portfolio should feel intentionally designed around real engineering work—not assembled from a dashboard template or a collection of fashionable UI effects.

**Stack:** Next.js (App Router) with Tailwind CSS v4 and shadcn/ui, built as a fully static site (`output: "export"` in `next.config.ts`). There is no backend: no API routes, server actions, or database. If a contact form is ever needed, use a third-party form service.

**This file is the single source of truth.** Keep it in the repository (for example `docs/design.md`, or as `AGENTS.md` / `CLAUDE.md` / `.cursor/rules` depending on what the IDE agent reads automatically). Do not maintain a second, longer copy of these rules elsewhere; duplicated rule sets drift apart and start contradicting each other. See the short prompt at the end of this file.

---

## Project Structure

```
portfolio/
├── app/
│   ├── [locale]/                    # builds /ja and /en as separate static pages
│   │   ├── layout.tsx               # the root layout: <html lang>, fonts, dark class, grain
│   │   ├── page.tsx                 # the one page: Hero → Projects → Journey → Skills → Contact
│   │   └── not-found.tsx            # custom 404, links back to /{locale}/#projects
│   ├── globals.css                  # design tokens: the source of truth
│   ├── icon.svg                     # favicon (Next picks it up automatically)
│   └── opengraph-image.png          # link-preview image (1200×630)
│
├── components/
│   ├── site-header.tsx              # anchor nav + active section ("use client")
│   ├── language-switch.tsx          # EN / 日本語 toggle (plain links to /en, /ja)
│   ├── sections/
│   │   ├── hero.tsx
│   │   ├── projects.tsx             # maps content → one of the case-study layouts
│   │   ├── journey.tsx
│   │   ├── skills.tsx
│   │   └── contact.tsx
│   ├── case-study/                  # the three project compositions
│   │   ├── case-study-image-first.tsx
│   │   ├── case-study-text-first.tsx
│   │   └── case-study-breakdown.tsx # no screenshot, e.g. the HR audit
│   ├── screenshot.tsx               # <figure class="shot"> + <img> + caption
│   └── ui/                          # shadcn components you add, restyled to the tokens
│       └── button.tsx               # variants in cva: primary / outline / ghost …
│
├── content/                         # all copy lives here, not in components
│   ├── profile.ts                   # name, role, pitch, links { en, ja }
│   ├── projects.ts                  # case-study data + which layout each uses
│   ├── journey.ts                   # timeline entries
│   └── skills.ts                    # skill → the project that proves it
│
├── lib/
│   ├── i18n.ts                      # locales ["ja","en"], UI labels, t() helper
│   └── utils.ts                     # cn() from shadcn
│
├── public/
│   ├── resume-ja.pdf
│   ├── resume-en.pdf
│   ├── screenshots/                 # real captures at 2×, 16:10 crops
│   │   ├── ec-platform-listing.webp
│   │   └── ec-platform-checkout.webp
│   └── _redirects                   # "/  /ja/  302": host-level redirect (Cloudflare/Netlify)
│
├── docs/
│   └── design.md                    # this spec (or AGENTS.md / CLAUDE.md at the root)
├── scripts/
│   └── check-design.mjs             # the lint check (Section 10)
│
├── components.json                  # shadcn config
├── next.config.ts                   # output: "export", images: { unoptimized: true }
├── postcss.config.mjs               # @tailwindcss/postcss
├── tsconfig.json
└── package.json                     # "check:design": "node scripts/check-design.mjs"
```

### Structure rules

- **Copy lives in `content/`, never in components.** Every string a recruiter reads is stored there with `en` and `ja` versions side by side. Components receive content as props and contain no hardcoded copy. The agent must not write new copy into components; if content is missing, it asks for it.
- **Each language is its own static page.** `/ja` and `/en` are generated from `app/[locale]/` via `generateStaticParams`, each with the correct `<html lang>`, so the `:lang()` typography rules in `globals.css` apply automatically and both languages are indexable.
- **The language switch is a link, not a JavaScript toggle.** The URL always shows the current language, and the site stays fully static.
- **One component per case-study composition.** Each project in `content/projects.ts` sets `layout: "image-first" | "text-first" | "breakdown"`, and `sections/projects.tsx` picks the matching component. Do not collapse these into one generic card.
- **`components/ui/` stays minimal.** Add a shadcn primitive only when a real feature needs it, and restyle it to the tokens immediately.
- **No backend code.** No `app/api/`, no server actions, no `middleware.ts`. None of them run in a static export.
- **The `/` redirect lives at the host.** Because middleware is unavailable, `/` → `/ja/` is configured in `public/_redirects` (Cloudflare Pages / Netlify) or `vercel.json` (Vercel). Japanese is the default because the target audience is Japanese employers.

### `next.config.ts`

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,          // /ja/ → out/ja/index.html, works on any static host
  images: { unoptimized: true } // the image optimizer needs a server
};

export default nextConfig;
```

### `lib/i18n.ts`

```ts
export const locales = ["ja", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "ja";

// Content is stored as { ja, en } pairs.
export type Localized<T = string> = Record<Locale, T>;

export function t<T>(value: Localized<T>, locale: Locale): T {
  return value[locale];
}
```

---

## 1. Design Position

### Concept

**A late-night arcade cabinet interpreted as an engineering case-study portfolio: saturated accents on a neutral dark base, sharp geometry, a faint print-like texture, and playful details that never become childish.**

The arcade influence should appear through typography, contrast, sharp geometry, and small interface details. The site must still read primarily as a serious engineer's portfolio.

### Intended impression

- Technically capable and detail-oriented
- Distinctive without being visually noisy
- Professional, but not corporate or generic
- Dense where technical content requires it
- Restrained in decoration and animation

### First-impression rule

On first load, the visitor must notice **the name, the role, and the selected projects** before they notice the style. If the styling is the first thing that registers, turn it down.

### Theme decision

**Dark only.** There is no light theme. Do not add a theme toggle, and do not write light-mode variants. `<html>` always carries the `dark` class so shadcn's `dark:` variants apply.

### Texture ("slightly gritty") — defined

Exactly one texture is permitted: a static, fine grain overlay applied through the `grain` utility on `<body>`, at very low opacity (≈4%). It must be static.

Not permitted: scanlines, CRT curvature, chromatic aberration, flicker, animated noise, glitch effects, or textures on individual components.

---

## 2. Design Tokens

The source of truth is `app/globals.css`. All values below live there; this section documents their **responsibilities**.

### Token rules

- Never hardcode colors, radii, shadows, or font families inside components.
- Use CSS variables or Tailwind theme tokens only.
- If a needed semantic token does not exist, **propose it** in the pre-code summary and define it in `globals.css` before using it. Never invent a value inline.
- Component variants belong in `cva`; do not scatter equivalent one-off class combinations across the application.

### Complete token set

| Token | Value | Responsibility |
|---|---|---|
| `--background` | `oklch(0.155 0.006 85)` | Page base. Neutral warm near-black. |
| `--foreground` | `oklch(0.95 0.01 90)` | Main text. |
| `--card` / `--card-foreground` | `oklch(0.19 0.006 85)` / foreground | Raised surfaces, used rarely. |
| `--popover` / `--popover-foreground` | `oklch(0.21 0.007 85)` / foreground | Dialogs, menus, select lists. |
| `--primary` | `oklch(0.78 0.19 145)` | Acid green. Links, focus, selection, primary actions. |
| `--primary-foreground` | `oklch(0.17 0.03 145)` | **Dark** text on green. Never white. |
| `--secondary` / `--secondary-foreground` | `oklch(0.25 0.007 85)` / foreground | Secondary buttons. |
| `--muted` / `--muted-foreground` | `oklch(0.22 0.006 85)` / `oklch(0.72 0.012 90)` | Quiet surfaces; secondary text and metadata. |
| `--accent` / `--accent-foreground` | `oklch(0.26 0.008 85)` / foreground | **shadcn hover surface** (menu items, ghost buttons). Not the orange. |
| `--highlight` / `--highlight-foreground` | `oklch(0.74 0.19 50)` / `oklch(0.17 0.03 50)` | Hot orange. Status, warnings, rare editorial emphasis. |
| `--destructive` / `--destructive-foreground` | `oklch(0.64 0.22 25)` / `oklch(0.17 0.03 25)` | Errors and destructive actions only. Dark text on red. |
| `--border` | `oklch(0.34 0.008 85)` | Structural 1px dividers, inputs. |
| `--border-strong` | = foreground | High-contrast 1px borders where emphasis is intended. |
| `--input` | `oklch(0.52 0.008 85)` | Form control borders (≥3:1 against background). |
| `--ring` | = primary | Focus rings. |
| `--radius` | `0.25rem` | Base radius. |
| `--shadow-hard` | `4px 4px 0 var(--foreground)` | The only emphasis shadow. |

Notes on decisions that changed from the first draft:

- **Background chroma reduced (0.02 → 0.006) and hue moved (280 → 85).** At hue 280 the base had a violet cast, which conflicts with the "no purple" rule. The new base is a neutral near-black with a faint warm tint that matches the foreground.
- **The orange is no longer called `--accent`.** In shadcn, `--accent` is the hover background for menu items, select options, and ghost buttons. Mapping the orange there would turn every hover state orange. The orange now lives in `--highlight`.
- **Orange hue moved (25 → 50).** Hue 25 is red-coral and was indistinguishable from `--destructive`. Hue 50 reads as a true hot orange and keeps warnings visually distinct from errors.

### Measured contrast (WCAG 2.x)

| Pair | Ratio |
|---|---|
| foreground / background | 16.9:1 |
| muted-foreground / background | 7.9:1 |
| primary / background (green links) | 10.4:1 |
| primary-foreground / primary (button text) | 10.2:1 |
| highlight / background | 7.7:1 |
| highlight-foreground / highlight | 7.6:1 |
| destructive-foreground / destructive | 5.1:1 |
| input / background (control border) | 3.5:1 |

`--border` (1.7:1) is decorative only. Never use it as the sole boundary of an interactive control; use `--input` or `--border-strong`.

### Color responsibilities

- **Background and foreground:** the dominant neutral foundation.
- **Primary green:** the principal interactive accent for links, focus states, selected states, and primary actions. Text on green is always `--primary-foreground` (dark).
- **Highlight orange:** reserved for status, warnings, or occasional editorial emphasis. It is not a second general-purpose decorative color. Guideline: no more than one orange element visible per viewport.
- Do not introduce purple, blue, or indigo gradients.
- Do not leave the default shadcn zinc or slate palette unchanged.

### Shape, borders, and shadows

- Use sharp corners through the radius token. `rounded-lg`, `rounded-xl`, `rounded-2xl`, and `rounded-3xl` are all clamped to `--radius` in `globals.css`, so they cannot produce soft corners, but still do not write them.
- `rounded-full` remains available for genuinely circular elements (avatar, status dot).
- Use `border-border` for structure and `border-border-strong` for intentional emphasis.
- Prefer no shadow. When emphasis genuinely requires one, use `shadow-hard` (or `shadow-hard-sm`, `shadow-hard-primary`).
- The Tailwind soft-shadow scale (`shadow-sm` … `shadow-2xl`) is neutralized to nothing in `globals.css`. Do not rely on it.
- Avoid glowing borders, glassmorphism, translucent blur panels, and decorative bloom effects.
- Do not surround every content block with a border or container.

---

## 3. Typography

### Font roles

- **Display:** Space Grotesk
- **Body:** IBM Plex Sans
- **Technical metadata only:** JetBrains Mono
- **Japanese / Korean fallback:** Hiragino Sans → Noto Sans JP → Yu Gothic → Meiryo; Apple SD Gothic Neo → Noto Sans KR

JetBrains Mono is restricted to code, dates, compact labels, version information, and technical metadata. It should not become a third general-purpose text style.

Do not use Inter, Roboto, or `system-ui` as the main Latin typeface.

### Font loading

Fonts load through `next/font` in `app/[locale]/layout.tsx`, which is the root layout (there is no `app/layout.tsx`). The CSS variable names below are what `globals.css` expects; do not rename them.

```tsx
// app/[locale]/layout.tsx
import type { ReactNode } from "react";
import { Space_Grotesk, IBM_Plex_Sans, JetBrains_Mono, Noto_Sans_JP } from "next/font/google";
import { locales, type Locale } from "@/lib/i18n";
import "../globals.css";

const display = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk", display: "swap" });
const sans = IBM_Plex_Sans({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-ibm-plex-sans", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains-mono", display: "swap" });
// Noto Sans JP gives consistent Japanese rendering on Windows, where Yu Gothic renders thin.
const jp = Noto_Sans_JP({ weight: ["400", "500", "700"], variable: "--font-noto-sans-jp", display: "swap", preload: false });

// Static export: build exactly /ja and /en, nothing else.
export const dynamicParams = false;
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  return (
    <html
      lang={locale}
      className={`dark ${display.variable} ${sans.variable} ${mono.variable} ${jp.variable}`}
    >
      <body className="grain">{children}</body>
    </html>
  );
}
```

Fonts must never be imported from Google Fonts inside a component or through `@import url(...)`.

### Type scale (tokens)

Use these utilities; do not use arbitrary `text-[...]` sizes.

| Utility | Size | Line height | Tracking | Use |
|---|---|---|---|---|
| `text-hero` | `clamp(3rem, 8vw, 7rem)` | 0.92 | -0.04em | Name / hero only, once per page |
| `text-section` | `clamp(2rem, 4vw, 4rem)` | 1.0 | -0.025em | Section headings |
| `text-subhead` | `1.375rem` | 1.3 | -0.01em | Project titles, sub-sections |
| `text-body` | `1.0625rem` | 1.6 | normal | Body copy (default) |
| `text-small` | `0.9375rem` | 1.5 | normal | Captions, secondary copy |
| `text-meta` | `0.8125rem` | 1.4 | 0.04em | Mono metadata: dates, tags, versions |

- Keep body copy within `max-w-measure` (68ch).
- Establish hierarchy through size, weight, spacing, and position. Do not rely primarily on changing text colors.
- Headings use `text-wrap: balance`; paragraphs use `text-wrap: pretty` (set globally).

### Multilingual typography

Handled in `globals.css` via `:lang()` selectors, so it works as long as `lang` is set correctly on `<html>` or on the element:

- Japanese paragraphs: line height 1.8, slight positive tracking (0.02em).
- Japanese headings: no negative tracking, line height ≈1.35, `word-break: auto-phrase` so lines break at natural phrase boundaries.
- Japanese `em`/`i`: rendered as weight, never italic.
- Korean: `word-break: keep-all` so words are not split mid-syllable-block.
- Verify headings and navigation at realistic English and Japanese text lengths.
- Korean can be included where useful, but Japanese and English are the primary portfolio languages.

---

## 4. Layout and Composition

### General layout

- Use an asymmetric, grid-based layout on a 12-column grid within `max-w-page` (80rem).
- Keep text left-aligned by default.
- Align content to a small number of consistent vertical edges.
- Use Tailwind's default 4px spacing scale. No arbitrary `p-[13px]` values.
- Give related elements less space and separate major sections with substantially more space.
- Allow generous whitespace, but retain technical density where the content benefits from it.
- Every responsive breakpoint must preserve a deliberate reading order.

### Single-page anchor navigation

The portfolio is **one page per language** (`app/[locale]/page.tsx`, built as `/ja` and `/en`). Navbar links do not route to other `.tsx` files; they scroll to sections on the same page using `#id` anchors. The browser handles the scroll. No routing library or scroll library is needed.

Rules:

- Every navigable section has a stable, lowercase `id` (`projects`, `journey`, `skills`, `contact`) and an `aria-labelledby` pointing at its heading.
- Nav links are plain `<a href="#id">`. Use `next/link` only for links to other routes. From other routes (for example the `404` page), link to `/{locale}/#projects` (for example `/ja/#projects`).
- Smooth scrolling and its reduced-motion override come from `globals.css`. Do not add JavaScript scrolling (`scrollIntoView`, scroll libraries).
- The sticky-header offset comes from `scroll-padding-top: var(--header-height)` on `html`. Do not add per-section offsets.
- The current section is marked with `aria-current="location"` and styled through that attribute (green text + underline). No other active-state decoration.
- The header background is solid `bg-background` with a `border-border` bottom rule. No blur or translucency.
- At phone width, four links plus the language switch must fit at 375px. If more sections are added, move the links into a menu rather than shrinking the text.
- The URL updates to `/ja/#projects` (or the `/en/` equivalent), so recruiters can share a direct link to the projects.

#### Section ids

```tsx
// app/[locale]/page.tsx
import { SiteHeader } from "@/components/site-header";
import { Hero } from "@/components/sections/hero";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main id="top">
        <Hero />
        <section id="projects" aria-labelledby="projects-heading">
          <h2 id="projects-heading" className="text-section">Selected work</h2>
          {/* … */}
        </section>
        <section id="journey" aria-labelledby="journey-heading">{/* … */}</section>
        <section id="skills" aria-labelledby="skills-heading">{/* … */}</section>
        <section id="contact" aria-labelledby="contact-heading">{/* … */}</section>
      </main>
    </>
  );
}
```

#### Header offset and scrolling (already in `app/globals.css`)

```css
:root {
  --header-height: 3.5rem;
}

@layer base {
  html {
    scroll-padding-top: var(--header-height);
  }
}

@media (prefers-reduced-motion: no-preference) {
  html {
    scroll-behavior: smooth;
  }
}
```

#### Header with current-section highlighting

```tsx
// components/site-header.tsx
"use client";

import { useEffect, useState } from "react";

const SECTIONS = [
  { id: "projects", label: "Projects" },
  { id: "journey", label: "Journey" },
  { id: "skills", label: "Skills" },
  { id: "contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const targets = SECTIONS
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => el !== null);

    // A section counts as "current" when it crosses a thin band near the middle of the screen.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    targets.forEach((el) => observer.observe(el));

    // The last section is often too short to reach the middle band, so mark it at page bottom.
    const onScroll = () => {
      const atBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
      if (atBottom) setActive(SECTIONS[SECTIONS.length - 1].id);
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background">
      <nav
        aria-label="Sections"
        className="mx-auto flex h-(--header-height) max-w-page items-center gap-6 px-4"
      >
        <a href="#top" className="font-display font-semibold">
          Your Name
        </a>
        <ul className="ml-auto flex gap-5">
          {SECTIONS.map((s) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                aria-current={active === s.id ? "location" : undefined}
                className="text-small text-muted-foreground underline-offset-8 hover:text-foreground aria-[current=location]:text-primary aria-[current=location]:underline"
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
```

`SECTIONS` is the single list of navigable sections. When a section is added or renamed, update it here and give the section the matching `id`.

### Composition rules

- Design each section around its actual content; do not begin by selecting a card component.
- Use cards only when items are genuinely independent and comparable.
- Do not place every piece of content inside a bordered rectangle.
- Do not repeat the same "icon + title + description" structure across sections.
- Selected projects must read as editorial case studies rather than a uniform project-card grid.
- Vary project composition where appropriate: image-first, text-first, wide technical breakdown, or compact outcome summary.
- Decorative elements must communicate category, status, navigation, hierarchy, or interaction.
- Do not add visual elements merely to occupy empty space.
- Asymmetry must remain structured; it is not permission for arbitrary misalignment.

---

## 5. Imagery and Screenshots

Most project screenshots are bright UIs. Placed raw on a near-black page they glare and look unfinished.

- Always wrap screenshots in the `shot` utility: a 1px `--border` frame, a `--muted` plate with a small inset, and slightly reduced brightness.
- Use one consistent aspect ratio per context (for example 16:10 for desktop captures, 9:19.5 for phone captures). Crop; do not letterbox.
- Capture screenshots at 2x, export them yourself as WebP at the display size, and render them through `next/image` with explicit `width`, `height` and `sizes`. The static export sets `images: { unoptimized: true }`, so Next will not resize them for you.
- Show real screens with real data. No generic illustrations, stock photos, or device mockups with reflections.
- Every screenshot needs meaningful `alt` text describing what the screen shows.

---

## 6. Information Architecture

### 1. Introduction

Include:

- Name
- Role, for example: "Full-stack engineer — TypeScript / React / Node.js"
- One concrete sentence describing the value brought to engineering teams
- GitHub link
- Résumé link
- Contact method
- Language selector when multilingual content is available

Avoid generic statements such as "passionate developer who loves to code."

### 2. Selected projects

Place projects near the top of the page. Present three or four projects as concise case studies.

Each case study should communicate:

- The problem or context
- The user's actual role and responsibility
- The chosen technologies
- Why important technical choices were made
- A difficult decision, constraint, or bug
- The resulting behavior or outcome
- Live demonstration and source links, where available
- Real screenshots rather than generic illustrations

Never invent project metrics, business outcomes, responsibilities, technologies, or users.

### 3. Journey

Use a clean chronological timeline covering Korea, Australia, and Japan, including:

- Education
- Relevant training
- Professional work
- Meaningful transitions in technical direction

The international path should be presented as evidence of adaptability and communication ability, not as decorative biography.

### 4. Skills with evidence

- Group skills by what has actually been built with them.
- Connect each important technology to a project, responsibility, or outcome.
- Do not use percentage bars.
- Do not show an undifferentiated wall of technology logos.
- Avoid presenting superficial exposure and production experience as equivalent.

### 5. Contact

- Keep the section direct and easy to find.
- A form is optional, not required.
- Include at least one reliable contact method.
- Make the résumé easy to find from both the introduction and navigation.

---

## 7. shadcn/ui and Component Rules

- Use shadcn primitives such as Dialog, Select, Dropdown Menu, and Tabs when their behavior and accessibility are useful.
- Restyle primitives through tokens, `className` overrides, or direct edits under `components/ui/`.
- Treat shadcn components as owned source code rather than an untouchable external visual system.
- Default shadcn files contain `shadow-md`, `shadow-lg`, `rounded-xl`, and `bg-black/50`. When a primitive is added, restyle it immediately; the design check (Section 10) will flag these.
- Keep reusable variants in `cva`.
- Do not add another component library.
- Do not add icons to every card or label merely because an icon package is available.
- Use semantic HTML before introducing a component abstraction.

---

## 8. Motion and Interaction

- Motion must communicate entry, state change, navigation, or spatial relationship.
- Transitions: 150ms or less, on hover and state change only.
- Do not animate every section on scroll. No scroll-triggered entrance animations.
- Avoid typewriter headlines, cursor trails, particle backgrounds, parallax used only as decoration, and continuous ambient motion.
- Keep hover effects restrained and consistent with the sharp visual system (for example: underline appears, hard shadow shifts by 2px).
- Respect `prefers-reduced-motion` (a global override is already in `globals.css`; do not work around it).
- Provide visible keyboard focus states using the `--ring` token (2px outline, 2px offset; set globally).

---

## 9. Anti-Patterns: The "AI Look"

Do not use:

- Purple, blue, or indigo gradients
- Glassmorphism or glowing blur effects
- A centered hero with a subtitle, two buttons, and a three-card feature grid
- Uniform rounded cards with soft shadows
- Identical cards arranged in repetitive three-column grids
- Decorative emoji or Lucide icons on every item
- Typewriter headline animations
- Particle, gradient-blob, or cursor-effect backgrounds
- Scanlines, CRT or glitch effects
- Scroll-triggered fade-in animation on every section
- Generic startup copy such as "Streamline your workflow" or "Unlock the power of..."
- Generic portfolio copy such as "Passionate developer who loves to code"
- Skill percentage bars
- Projects without real explanations, screenshots, or links
- Placeholder testimonials, statistics, or project outcomes

Cards, icons, animation, and centered content are not prohibited universally. They require a content-driven reason and must not become the repeated default composition.

---

## 10. Enforcement

Prose rules drift over long agent sessions. The mechanical rules are checked by a script that the agent must run before reporting work as complete.

### `scripts/check-design.mjs`

```js
#!/usr/bin/env node
// Fails on hardcoded styling that bypasses the design tokens.
// Suppress a deliberate exception by adding `design-ok` in a comment on that line.
import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";

const files = execSync("git ls-files app components content src lib", { encoding: "utf8" })
  .split("\n")
  .filter((f) => /\.(tsx?|jsx?|mdx|css)$/.test(f))
  .filter((f) => !f.endsWith("app/globals.css"));

const rules = [
  [/#[0-9a-fA-F]{3,8}\b(?![-\w])/, "hardcoded hex color — use a token"],
  [/\b(rgba?|hsla?|oklch|oklab)\(/, "hardcoded color function — use a token"],
  [/\b(text|bg|border|fill|stroke|from|to|via)-\[(#|rgb|hsl|oklch)/, "arbitrary color value — use a token"],
  [/\b(bg|text|border|ring|from|to|via|fill|stroke)-(zinc|slate|gray|neutral|stone|indigo|violet|purple|blue|black|white)(-\d{2,3})?\b/, "palette color class — use semantic tokens"],
  [/\brounded-(lg|xl|2xl|3xl)\b/, "soft radius — use `rounded` or `rounded-sm`"],
  [/\bshadow-(xs|sm|md|lg|xl|2xl)\b/, "soft shadow — use `shadow-hard` or none"],
  [/\bbg-(gradient|linear|radial|conic)-/, "gradients are banned"],
  [/\bbackdrop-blur/, "backdrop blur is banned"],
  [/\btext-\[\d/, "arbitrary font size — use the type scale tokens"],
  [/font-\[?['"]?(inter|roboto)|fontFamily:\s*['"](Inter|Roboto)/i, "banned typeface"],
  [/@import\s+url\(.*fonts\.googleapis/, "load fonts with next/font, not @import"],
];

let failures = 0;
for (const file of files) {
  readFileSync(file, "utf8").split("\n").forEach((line, i) => {
    if (line.includes("design-ok")) return;
    for (const [re, msg] of rules) {
      if (re.test(line)) {
        console.log(`${file}:${i + 1}  ${msg}\n    ${line.trim()}`);
        failures++;
      }
    }
  });
}

if (failures) {
  console.log(`\n✗ ${failures} design violation(s).`);
  process.exit(1);
}
console.log("✓ design check passed");
```

Add to `package.json`:

```json
"scripts": { "check:design": "node scripts/check-design.mjs" }
```

Optionally run it in a pre-commit hook or CI. The first run on a fresh shadcn install will flag the default shadows and radii inside `components/ui/`; fixing those is intended.

---

## 11. Professional Quality Requirements

### Restraint

- Use the neutral foundation and primary accent consistently.
- Reserve orange for narrow semantic purposes.
- One theme (dark), fully polished.

### Content credibility

- Use specific engineering language supported by real experience.
- Explain decisions and trade-offs rather than listing frameworks.
- Make personal contribution clear when a project involved a team.
- Never invent facts to make a section appear more complete.

### Product polish

- Include a favicon.
- Include an Open Graph image and appropriate metadata.
- Use meaningful page titles and descriptions.
- Provide a custom `404` page.
- Ensure links are valid.
- Optimize images and loading behavior.
- Test phone, tablet, laptop, and wide-desktop layouts.
- Maintain visible focus states, semantic structure, contrast, and keyboard accessibility.
- Make the résumé PDF and contact information easy to locate.

---

## 12. Required Implementation Process

### Before writing code

1. Inspect the existing page structure, `app/globals.css`, Tailwind configuration, reusable components, assets, and available real content.
2. State the proposed palette usage, typography hierarchy (by token name), grid/layout idea, and responsive behavior in three to five lines.
3. Identify which existing components will be reused or restyled.
4. If a new token is needed, propose its name, value, and responsibility here.
5. Ask a question only when an ambiguity would materially change the design direction, information architecture, or content accuracy. For minor decisions, follow the existing tokens and patterns.

### During implementation

- Work from supplied content; do not generate placeholder marketing copy.
- Reuse existing accessible primitives when their semantics fit.
- Implement responsive behavior deliberately rather than simply stacking every desktop element.
- Keep components focused and reusable without abstracting one-time structures prematurely.
- Preserve accessibility, keyboard operation, contrast, and reduced-motion behavior.
- Do not rewrite unrelated application logic.

### After implementation

1. Run `npm run check:design` and fix every violation.
2. List all files changed.
3. List all design tokens added or modified.
4. Explain any intentional deviation from this specification.
5. Confirm checks at mobile, tablet, and desktop widths.
6. Confirm that realistic English and Japanese content does not overflow.
7. Confirm that focus states, keyboard navigation, contrast, and reduced-motion behavior were checked.

---

## 13. Acceptance Checklist

- [ ] On first load, the name, role, and projects register before the visual style.
- [ ] The page does not resemble a default shadcn dashboard or SaaS landing-page template.
- [ ] Real content determines each section's composition.
- [ ] Projects are presented as case studies rather than identical cards.
- [ ] Colors, radii, shadows, and fonts come from centralized tokens.
- [ ] `npm run check:design` passes.
- [ ] Green is the main interactive accent; text on green uses `--primary-foreground`.
- [ ] Orange (`--highlight`) is used sparingly and semantically; hover states use `--accent`, not orange.
- [ ] Only the static `grain` texture is used; no scanlines, CRT, or glitch effects.
- [ ] Screenshots are framed with `shot`, consistently cropped, and have alt text.
- [ ] Typography has a clear hierarchy and comfortable reading width.
- [ ] Spacing follows the 4px scale.
- [ ] Major elements align to a consistent grid.
- [ ] The arcade influence remains secondary to engineering credibility.
- [ ] No unsupported metrics, outcomes, responsibilities, or testimonials were invented.
- [ ] The experience works on phones, tablets, and desktops.
- [ ] English and Japanese text have been checked for wrapping and overflow.
- [ ] Keyboard navigation, focus states, contrast, and reduced motion have been checked.
- [ ] Project links, résumé links, and contact links work.
- [ ] Metadata, favicon, Open Graph image, and `404` page are present.
- [ ] Every nav link scrolls to its section, the heading is not hidden under the sticky header, and the current section is highlighted (including the last one at page bottom).

---

# IDE Agent Prompt

Because this file lives in the repository, the prompt only needs to point to it. Paste this together with the task:

```text
You are implementing or revising my software-engineering portfolio.

Follow docs/design.md as the design source of truth. It overrides your defaults.
app/globals.css holds every token; do not hardcode values.

Before writing code, give the 3–5 line design summary required in Section 12
and propose any new token there.
After changes, run `npm run check:design`, fix all violations, and report
using the Section 12 "After implementation" list.

Task:
<describe the page or feature here>

Content:
<paste real text, project details, and asset paths here>
```

If an agent cannot read files from the repository, paste this entire document instead of the short prompt. Do not maintain a separately edited long prompt.

## Suggested Usage

For the best results, provide the IDE agent with:

1. The short prompt above (or this whole document, if the agent cannot read the repo).
2. The exact feature or page to implement.
3. Real text and project details.
4. Existing screenshots and assets.
5. One or two visual references, accompanied by a sentence explaining what should be borrowed from each.

Do not ask the agent merely to "make it modern." Tell it what content must be communicated, what existing structure must remain, and what a successful result must demonstrate.
