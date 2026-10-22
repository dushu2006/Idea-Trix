# IDEATRIX — Ideathon by AI & DS × Matrix Club, VIIT

Event website for **IDEATRIX**, an ideathon organised by the Department of Artificial
Intelligence and Data Science and Matrix Club at Vignan’s Institute of Information
Technology, Visakhapatnam.

Teams of up to two pick a problem, shape a concept, and present it as a PowerPoint.
Registration is **₹100 per team**.

> Rebuilt from a single-file HTML prototype into a production-structured Next.js
> application. See [Architecture](#architecture) and [Demo vs. real](#demo-vs-real)
> below.

## Features

- **Editorial event site** — 9 sections (hero, about, details, journey, schedule,
  guidelines, certificates, FAQ, registration) on one fast page with a scroll progress
  bar, active-section nav, and a full mobile menu.
- **Interactive journey tabs** — 4 ideathon stages with keyboard navigation (arrows /
  Home / End), animated panel transitions, and prev/next controls.
- **Searchable FAQ** — live filtering across questions, answers, and tags, with result
  counts, expand/collapse-all, and an honest empty state.
- **Multi-step registration** — 4 steps (team → leader → partner → review) with
  per-step validation, a review screen with per-row editing, and a success ticket.
- **Draft persistence** — in-progress registrations auto-save to `localStorage` and are
  restored after a refresh, with a discard option.
- **Server-validated submission** — the API route re-validates with the same Zod schema
  and returns a demo registration ID; the user can copy it or download a plain-text
  registration slip.
- **Honest provisional states** — unconfirmed facts (event year, venue, mid-day
  schedule) are labelled “to be confirmed” / “provisional” everywhere, never faked.
- **Accessible & responsive** — skip link, landmarks, labelled controls, focus-visible
  styles, `prefers-reduced-motion` support (freezes canvas + reveals), mobile-first
  layouts from 360px up.
- **Zero external requests** — fonts are bundled via Fontsource; no CDNs, no trackers.

## Tech stack (and why)

| Choice | Reason |
|---|---|
| **Next.js 14 (App Router) + TypeScript** | Structured routing, metadata/SEO, and API routes for the registration boundary — without a separate backend to deploy. |
| **Tailwind CSS 3** | Token-driven styling (paper/ink/ember palette, Fraunces + Hanken Grotesk) shared across all sections. |
| **Framer Motion** | Scroll reveals, tab/Form step transitions, mobile menu — all gated on `useReducedMotion`. |
| **React Hook Form + Zod** | Multi-step form state with one schema (`src/lib/validation.ts`) shared by client and server, so rules can’t drift. |
| **Lucide React** | Consistent icon set with accessible labels. |
| **Fontsource Variable** | Self-hosted display + body fonts (no Google Fonts round-trip, works offline). |
| **Vitest** | Focused unit tests for validation, IDs, formatting, and the slip builder. |

No database, auth, or payment provider: the event needs a small registration intake,
not accounts. The API route is a documented **integration boundary** — see below.

## Getting started

Requires Node.js 18.17+ (tested on Node 22).

```bash
npm install
npm run dev      # http://localhost:3000
```

Other commands:

```bash
npm run build    # production build
npm start        # serve the production build
npm run lint     # next lint
npm run typecheck
npm test         # vitest (validation + registration unit tests)
```

No environment variables are required. `.env.example` documents the optional
variables a future production backend would use.

## Architecture

```text
src/
├── app/
│   ├── layout.tsx            # metadata, fonts, header/footer chrome
│   ├── page.tsx              # section composition
│   ├── globals.css           # tokens, ledger/ticket/marquee utilities
│   ├── not-found.tsx
│   └── api/registrations/route.ts   # demo endpoint (validates, returns demo ID)
├── components/
│   ├── layout/               # Header (progress + active nav + mobile menu), Footer
│   ├── sections/             # Hero, Marquee, About, Details, Journey, Schedule,
│   │                         # Guidelines, Certificates, Faq, Register
│   ├── ui/                   # SectionShell, Reveal, Stamp
│   └── visual/               # IdeaField (hero canvas, reduced-motion aware)
├── data/event.ts             # THE event dataset — every fact lives here once
├── hooks/useActiveSection.ts # IntersectionObserver-based nav highlighting
└── lib/
    ├── validation.ts         # Zod schema shared by form + API
    ├── registration-id.ts    # demo ID format (year-free by design)
    ├── registrations.ts      # draft storage, submit client, slip builder/download
    └── utils.ts              # cn()
tests/registration.test.ts    # schema, IDs, formatting, slip
```

**Conventions:** server components by default; `'use client'` only where interactivity
needs it (header, canvas, tabs, FAQ, form). All displayed facts derive from
`src/data/event.ts` — update a detail there and the whole site follows.

## Demo vs. real

| Capability | Status |
|---|---|
| Content, navigation, tabs, FAQ search, timeline | Real — works fully client-side |
| Form validation (per-step + review) | Real — Zod, client and server |
| Draft save/restore | Real — `localStorage` |
| Registration submit | **Demo** — validated by `/api/registrations`, held in server memory, acknowledged with a demo ID (`IDX-XXXXXX`) |
| Payment of the ₹100 fee | **Not implemented** — payable as instructed by the organisers; the UI never claims to charge |
| Confirmation / certificate emails | **Not implemented** — no email is sent; the success screen and footer say so |
| Event year, venue, mid-day schedule | **Unconfirmed** — shown as TBC/provisional, per the organisers |

To go production: persist registrations (e.g. Postgres via Prisma/Drizzle), add a
payment link/QR flow for the ₹100 team fee, and send confirmation + certificate emails
— all behind the existing `POST /api/registrations` contract.

## Design notes

The visual identity is a **warm editorial ledger**: paper background, ink typography,
and a single ember-red accent. Display type is Fraunces, body is Hanken Grotesk.
Sections are numbered ledger entries (01–08) with offset lede columns; status is
communicated with small uppercase “stamps” (provisional, confirmed, TBA).

## License

See [LICENSE](./LICENSE).
