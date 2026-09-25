# Vercel Deployment Guide

How to deploy **this** portfolio (`dev_portfolio_next`) to Vercel.

This site is a **fully static export** (`output: "export"`). There is no Next.js server, no API routes, and no middleware. Vercel only needs to host the HTML/CSS/JS/PDF assets in `out/`.

---

## What you get after deploy

| URL | Behavior |
|---|---|
| `https://your-domain/` | Redirects to `/ja/` (`vercel.json`) |
| `https://your-domain/ja/` | Japanese single-page portfolio |
| `https://your-domain/en/` | English single-page portfolio |
| `https://your-domain/resume-ja.pdf` | 履歴書 download (`Content-Disposition: attachment`) |
| `https://your-domain/career-history-ja.pdf` | 職務経歴書 download |

---

## Prerequisites

1. A [Vercel](https://vercel.com) account
2. This repo pushed to GitHub / GitLab / Bitbucket (or deploy via Vercel CLI)
3. Node.js **20+** locally if you want to verify the build first

Optional local check before connecting Vercel:

```bash
npm ci
npm run check:design
npm run build
```

Confirm these exist after build:

- `out/ja/index.html`
- `out/en/index.html`
- `out/index.html` (written by `scripts/write-root-redirect.mjs`)
- `out/resume-ja.pdf`
- `out/career-history-ja.pdf`
- `out/screenshots/*.webp`

---

## Deploy via Vercel Dashboard (recommended)

### 1. Import the project

1. Open [vercel.com/new](https://vercel.com/new)
2. Import this Git repository
3. Framework Preset: **Next.js** (auto-detected is fine)

### 2. Build & Output settings

Use these values (they match this repo):

| Setting | Value | Why |
|---|---|---|
| **Build Command** | `npm run build` | Runs `next build` **and** writes `out/index.html` → `/ja/` |
| **Output Directory** | `out` | Static export destination (`next.config.ts` → `output: "export"`) |
| **Install Command** | `npm ci` (or leave default) | |
| **Node.js Version** | `20.x` or `22.x` | |

Important: do **not** use `next start`. This project has no Node server after build.

If the UI hides “Output Directory”, open **Build & Development Settings** → override Output Directory to `out`.

### 3. Environment variables

None required for the current site (no CMS, no form backend, no secrets).

### 4. Deploy

Click **Deploy**. After the first success, every push to the production branch redeploys automatically.

---

## Deploy via Vercel CLI

```bash
npm i -g vercel
vercel login
vercel          # preview
vercel --prod   # production
```

When prompted, set the output directory to `out` if asked. Prefer linking the Git repo so `vercel.json` redirects/headers apply the same way as dashboard deploys.

---

## Project files that matter on Vercel

### `next.config.ts`

```ts
output: "export"
trailingSlash: true
images: { unoptimized: true }
```

- Static HTML under `out/ja/`, `out/en/`
- Trailing slashes so hosts serve `…/ja/index.html` correctly
- Images are not optimized by a Next image server (static hosting only)

### `package.json` → `build`

```json
"build": "next build && node scripts/write-root-redirect.mjs"
```

The second step overwrites `out/index.html` with a meta-refresh + link to `/ja/`.  
That covers local `out/` previews and hosts that do not read `vercel.json` redirects.

### `vercel.json`

Already in the repo root:

1. **Redirect** `/` → `/ja/` (302)
2. **Headers** on both PDFs so browsers **download** instead of opening inline:
   - `/resume-ja.pdf`
   - `/career-history-ja.pdf`

Do not delete these when connecting the project.

### PDFs in `public/`

| File | Role |
|---|---|
| `public/resume-ja.pdf` | 履歴書 |
| `public/career-history-ja.pdf` | 職務経歴書 |

Anything in `public/` is copied into `out/` at build time. Replace the files there (same names) when you update documents, then redeploy.

---

## After the first deploy: set your real domain

### 1. Custom domain (optional)

Vercel → Project → **Settings** → **Domains** → add your domain and follow DNS instructions.

### 2. Fix Open Graph / social previews

`metadataBase` is still a placeholder:

- `app/layout.tsx`
- `app/[locale]/layout.tsx`

Change:

```ts
metadataBase: new URL("https://example.com"),
```

to your real production URL, for example:

```ts
metadataBase: new URL("https://your-domain.com"),
```

Commit and redeploy so OG images and absolute URLs resolve correctly.

---

## Smoke test checklist

After deploy, open the production URL and confirm:

- [ ] `https://…/` lands on `/ja/`
- [ ] `/ja/` and `/en/` both load; language switch toggles between them
- [ ] Nav anchors scroll to Projects / Journey / Skills / Contact
- [ ] Hero PDFs download (履歴書 + 職務経歴書), not only open in a new tab
- [ ] Screenshots appear under Selected work
- [ ] GitHub and `mailto:` links work
- [ ] Phone / address are **not** on the page (by design)

---

## Common issues

### Build succeeds but `/` is a 404

- Confirm **Output Directory** is `out`
- Confirm Build Command is `npm run build` (includes `write-root-redirect.mjs`)
- Confirm `vercel.json` redirect is present

### PDF opens in the browser instead of downloading

- On Vercel, headers in `vercel.json` should force attachment
- Hard-refresh or try a private window (PDF viewers cache aggressively)
- Local `next dev` may still open PDFs inline; production is what the headers fix

### Images missing or 404

- Screenshots must live under `public/screenshots/` as WebP
- Paths in `content/projects.ts` should start with `/screenshots/…`
- Rebuild after adding files

### “Feature not supported with static export”

You cannot add these without changing architecture:

- `app/api/*` route handlers
- `middleware.ts`
- Server Actions that need a server
- Next.js Image Optimization server (`images.unoptimized` must stay `true`)

Contact forms need a third-party service (Formspree, Basin, etc.), not an API route in this repo.

### Trailing-slash confusion

Links should use `/ja/` and `/en/` (with slash). The config sets `trailingSlash: true` on purpose.

---

## Suggested production workflow

1. Edit copy in `content/*.ts` or replace PDFs/screenshots in `public/`
2. Locally: `npm run check:design && npm run build`
3. Commit and push to the branch connected to Vercel
4. Verify the deployment URL against the smoke checklist

---

## Quick reference

```bash
# local
npm run dev          # http://localhost:3000/ja/
npm run build        # writes out/
npm run check:design

# vercel
vercel --prod
```

| Item | Value |
|---|---|
| Framework | Next.js (static export) |
| Build | `npm run build` |
| Output | `out` |
| Default locale | Japanese (`/ja/`) |
| Config on Vercel | `vercel.json` (redirect + PDF headers) |
| Docs source of truth (design) | `docs/portfolio-design-direction-and-ide-agent-prompt.md` |
| Implementation plan | `docs/portfolio-implementation-plan.md` |
