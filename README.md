# Sunmyung Woo — Developer Portfolio

Personal portfolio for **禹 善明 (Sunmyung Woo)**, a full-stack engineer based in Osaka (TypeScript / React / Spring Boot, backend-leaning).

Bilingual static site: Japanese (`/ja/`, default) and English (`/en/`). One page per language with anchor navigation — not a multi-page app.

**Live:** [dev-portfolio-next-ochre.vercel.app](https://dev-portfolio-next-ochre.vercel.app)

---

## What’s on the page

| Section | Content |
|---|---|
| Hero | Name (JA ruby furigana / EN one-line), role, pitch, PDF downloads, GitHub & email |
| Projects | Four case studies: VocaloCart, HR security audit, cafe kiosk, Transport Payment |
| Journey | Education and career timeline (KR → AU → JP) |
| Skills | Stack grouped with links to where each skill was used |
| Contact | Email, résumé / 職務経歴書 downloads, GitHub |

Copy lives in `content/` (`profile.ts`, `projects.ts`, `journey.ts`, `skills.ts`) as `{ ja, en }` pairs. Components do not hardcode recruiter-facing text.

---

## Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS v4** design tokens in `app/globals.css`
- **Static export** (`output: "export"`) — no API routes, middleware, or server actions
- Hosted on **Vercel**

```
app/[locale]/page.tsx     → single page (Hero → Projects → Journey → Skills → Contact)
content/                   → all JA/EN copy
components/sections/       → section UI
components/case-study/     → image-first / text-first / breakdown layouts
public/                    → PDFs + WebP screenshots
```

---

## Local development

```bash
npm ci
npm run dev
```

Open **http://localhost:3000/ja/** (or `/en/`).  
Root `/` is handled on Vercel via `vercel.json`; locally prefer `/ja/` or `/en/`.

```bash
npm run build         # writes static site to out/ (+ root redirect HTML)
npm run check:design  # fails on hardcoded colors / banned “AI look” patterns
npm run lint
```

---

## Editing content

| Goal | Edit |
|---|---|
| Name, pitch, email, PDFs | `content/profile.ts` |
| Case studies | `content/projects.ts` |
| Timeline | `content/journey.ts` |
| Skills | `content/skills.ts` |
| UI chrome labels (nav, section titles) | `lib/i18n.ts` |
| Design tokens | `app/globals.css` |
| Replace 履歴書 / 職務経歴書 | `public/resume-ja.pdf`, `public/career-history-ja.pdf` |
| Screenshots | `public/screenshots/*.webp` (16:10) |

Design rules and visual system: `docs/portfolio-design-direction-and-ide-agent-prompt.md`.

---

## Deploy (Vercel)

Production is Vercel. Build command is `npm run build`; output is the static `out/` folder. Redirects and PDF download headers live in `vercel.json`.

Step-by-step: **[docs/vercel-deployment-guide.md](docs/vercel-deployment-guide.md)**.

After connecting a custom domain, update `metadataBase` in `app/layout.tsx` and `app/[locale]/layout.tsx` (still `https://example.com` until you set the real origin).

---

## Docs

| File | Purpose |
|---|---|
| [docs/portfolio-implementation-plan.md](docs/portfolio-implementation-plan.md) | Architecture decisions and acceptance checklist |
| [docs/portfolio-design-direction-and-ide-agent-prompt.md](docs/portfolio-design-direction-and-ide-agent-prompt.md) | Design system / agent rules |
| [docs/vercel-deployment-guide.md](docs/vercel-deployment-guide.md) | Production deploy on Vercel |
| [docs/aws-s3-cloudfront-cli-guide.md](docs/aws-s3-cloudfront-cli-guide.md) | Learning lab: same `out/` on S3 + CloudFront (not production) |
| [docs/portfolio-theme-preview.html](docs/portfolio-theme-preview.html) | Standalone visual specimen of the theme |

---

## Links

- GitHub: [murasakijyuutann](https://github.com/murasakijyuutann)
- Qiita: [murasakijyuutann](https://qiita.com/murasakijyuutann)
- Email: ronald.knife@gmail.com
