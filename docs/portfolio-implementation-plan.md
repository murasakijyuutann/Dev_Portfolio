# Portfolio Implementation Plan

Status: **implemented** (static `/ja` + `/en` single-page portfolio with anchor nav).  
Design source of truth: `docs/portfolio-design-direction-and-ide-agent-prompt.md` (tokens: `docs/globals.css` → `app/globals.css`).  
Visual reference: `docs/portfolio-theme-preview.html`.  
Personal facts: `docs/WooSunmyung様_履歴書 0428.pdf`, `docs/禹 善明 (ウ ソンミョン)_職務経歴書_0827.pdf`.

---

## Architecture confirmation

**One page per language**, with sticky header **anchor navigation** — not multi-page section routes.

| Route | What it is |
|---|---|
| `/ja/` | Default Japanese single page |
| `/en/` | English single page |
| `/` | Host redirect → `/ja/` (`vercel.json`) |

Page composition (`app/[locale]/page.tsx`):

```
SiteHeader (sticky)
└── main#top
    ├── Hero
    ├── section#projects
    ├── section#journey
    ├── section#skills
    └── section#contact
```

- Nav links are plain `<a href="#projects">` etc. Browser handles scroll.
- Sticky header offset via `scroll-padding-top: var(--header-height)` in `globals.css`.
- Current section highlighted with `aria-current="location"` (IntersectionObserver in `site-header.tsx`).
- Language switch is a **link** to `/en/` or `/ja/`, not a JS content toggle.
- No `app/api/`, no middleware, no server actions — static export only.

---

## Decisions (from owner)

### Featured projects (4, in this order)

1. **VocaloCart** — Next.js EC (Vocaloid merchandise)
2. **HR security audit / rebuild** — WAR decompile + findings
3. **Cafe kiosk** — SPACE CL, team lead
4. **Transport Payment System** — personal fullstack API/app

Suggested layouts (per design doc case-study components):

| Project | Layout | Reason |
|---|---|---|
| VocaloCart | `image-first` | Strong storefront screenshots |
| Cafe kiosk | `text-first` | Screenshots exist; text can lead |
| Transport Payment | `text-first` | Screenshots exist; text can lead |
| HR audit | `breakdown` | Security story fits technical breakdown; images optional |

### Links and demos

- **GitHub only** — none of the four are deployed yet; they demonstrate ability and self-motivation.
- **Japanese résumé PDF only** (`public/resume-ja.pdf`).
- **Remove** old portfolio URL (`self-introduction-jp.vercel.app`).

### Contact / privacy

- Public: **email** (`ronald.knife@gmail.com`) + **GitHub**.
- Do **not** publish: phone, street address, visa, birth date.
- Public identity: name, city (**Osaka**), role, links only.

### Hero / role

- Role line: `Full-stack engineer — TypeScript / React / Spring Boot · backend focus` (JA equivalent).
- Pitch: draft from 職務要約 (one concrete sentence each in JA and EN). No generic “passionate developer” copy.

### Journey

- Include **all** timeline entries: AU education → Acorn → freelance → SPACE CL → Infocia (audit + Android) → VocaloCart / current.

### Hosting

- **Vercel** (deploy later). Use `vercel.json` for `/` → `/ja/` redirect.

### Screenshots

- Convert selected captures under `public/{vocalocart,hr_rebuild,cafe,transport_payment}/` to **WebP, 16:10**, frame with `.shot`.

---

## Design summary (Section 12)

Dark-only, arcade-leaning case-study portfolio: warm near-black base, acid green for interaction, orange reserved for status. Typography via Space Grotesk / IBM Plex Sans / JetBrains Mono tokens. One page per locale (`/ja` default), 12-column asymmetric layout, Hero → four varied project compositions → Journey → Skills-with-evidence → Contact. No soft cards, gradients, or glass; screenshots always in `.shot`.

---

## Target file structure

```
app/
  [locale]/
    layout.tsx          # html lang, fonts, dark, grain
    page.tsx            # THE one page (anchored sections)
    not-found.tsx
  globals.css           # tokens (from docs/globals.css)
  icon.svg
  opengraph-image.png

components/
  site-header.tsx
  language-switch.tsx
  screenshot.tsx
  sections/{hero,projects,journey,skills,contact}.tsx
  case-study/{case-study-image-first,case-study-text-first,case-study-breakdown}.tsx
  ui/button.tsx

content/
  profile.ts
  projects.ts
  journey.ts
  skills.ts

lib/
  i18n.ts
  utils.ts

public/
  resume-ja.pdf
  screenshots/*.webp    # 16:10 crops
  _redirects            # optional; Vercel uses vercel.json

scripts/
  check-design.mjs

vercel.json             # "/" → "/ja/" 302/308
next.config.ts          # output: "export", trailingSlash, images.unoptimized
```

Rules:

- All recruiter-facing copy lives in `content/` as `{ ja, en }` pairs.
- Components receive content as props; no hardcoded marketing strings.
- Never invent metrics, outcomes, or responsibilities beyond the PDFs.

---

## Build order

1. **Foundation**
   - `next.config.ts`: `output: "export"`, `trailingSlash: true`, `images: { unoptimized: true }`
   - Replace default Geist/zinc app with `[locale]` layout, fonts, grain
   - Copy/adapt `docs/globals.css` → `app/globals.css`
   - `lib/i18n.ts`, `vercel.json`, `scripts/check-design.mjs` + `npm run check:design`
   - Minimal shadcn button, restyled to tokens

2. **Content**
   - Fill `profile`, `projects`, `journey`, `skills` from resumes
   - Pitch from 職務要約; backend-focused role line
   - Project case-study fields paraphrased from 職務経歴書 only
   - Copy Japanese résumé into `public/resume-ja.pdf`

3. **UI sections**
   - Header with anchor nav + active section
   - EN/JA language switch links
   - Four projects via the three case-study layouts
   - Journey timeline, skills-with-evidence, contact

4. **Screenshots**
   - Pick best frames per project; crop to 16:10; export WebP
   - Wire through `screenshot.tsx` with real `alt` text

5. **Polish**
   - Favicon, Open Graph image, metadata titles/descriptions
   - Custom 404 linking to `/{locale}/#projects`
   - Run `npm run check:design`; fix violations
   - Spot-check JA/EN wrapping and mobile (375px+)

---

## Content sources (usable facts)

| Field | Value |
|---|---|
| Name | 禹 善明 / Woo Sunmyung（ウ ソンミョン） |
| City | Osaka |
| GitHub | https://github.com/murasakijyuutann |
| Qiita | https://qiita.com/murasakijyuutann (optional secondary) |
| Email | ronald.knife@gmail.com |
| Languages | KO native · JA N1 · EN IELTS 7.5 / TOEIC 900 |
| Highlight proof | WAR audit: 28 vulns (+ DB issues); SPACE CL lead (5); VocaloCart Stripe/Prisma/NextAuth stack |

Repos **not** to invent: live demo URLs, deployment claims, business KPIs not in the PDFs.

---

## Explicit non-goals

- Phone number, street address, visa details, birth date on the site
- Live demo links for the four projects
- English résumé PDF (Japanese only)
- Old Vercel self-introduction URL
- Multi-page section routing
- Light theme / theme toggle
- Backend, API routes, contact form backend (form service only if added later)

---

## Acceptance (short)

- [ ] First impression: name, role, projects — before style
- [ ] Single `page.tsx` per locale; all nav is `#` anchors
- [ ] `/ja` and `/en` static; `/` redirects to `/ja/`
- [ ] Four real case studies; GitHub only; no invented outcomes
- [ ] Privacy: name / Osaka / role / email / GitHub only
- [ ] Screenshots WebP 16:10 in `.shot`
- [ ] `npm run check:design` passes
- [ ] JA + EN readable; keyboard focus and reduced-motion respected

---

## Next step

Implement in the build order above, starting with foundation + `content/` files, then the single anchored `page.tsx`.
