# IDEATRIX — A Neural Journey Through an Ideathon

Event website for **IDEATRIX**, an ideathon organised by the Department of Artificial
Intelligence and Data Science and Matrix Club at Vignan’s Institute of Information
Technology, Visakhapatnam.

Teams of up to two pick a problem, shape a concept, and present it as a PowerPoint.
Registration is **₹100 per team**.

The site’s central concept is an **interactive journey through a neural-network
brain**: the opening screen shows the complete brain, and scrolling travels the
camera between nine destination nodes — each revealing its section of the event.

## Experience overview

- **Neural brain identity** — a seeded, code-generated SVG brain: silhouette with a
  longitudinal fissure, three neuron layers (background / supporting /
  destinations), curved pathways, sulci-style structure lines, and one highlighted
  route through all nine destinations. No 3D assets, no WebGL, no canvas text.
- **Scroll-driven camera** — an IntersectionObserver-driven journey state moves a
  smoothly interpolated SVG camera from node to node; the active route segment
  lights up in the destination’s accent with a travelling pulse.
- **Nine destinations** — hero overview, about, event details, journey, schedule,
  guidelines, certificates, FAQ, registration. Each has a fixed node position,
  accent colour, camera framing, and content panel.
- **Single navigation state** — header links, brain nodes, the desktop journey rail,
  and the mobile chip bar all navigate by scrolling, so the scene, progress bar,
  and panels can never disagree. Direct jumps work without scrolling the whole
  journey.
- **Deliberate mobile design** — simplified geometry, the node framed in the upper
  area, full-width panels in natural document flow (scroll is never trapped), and
  a thumb-friendly bottom chip bar instead of tiny node taps.
- **Multi-step registration** — team → leader → partner → review, with per-step
  validation, localStorage drafts, a review screen, and a success ticket with a
  copyable demo ID plus a downloadable slip.
- **Honest states everywhere** — unconfirmed facts (event year, venue, mid-day
  schedule) are labelled TBC/provisional; demo mode never claims payments or
  emails work.
- **Fallbacks** — `prefers-reduced-motion` freezes the camera, particles, and
  pulse while keeping everything readable; without JS the SSR HTML still reads
  as a complete page.

## Tech stack (and why)

| Choice | Reason |
|---|---|
| **Next.js 14 (App Router) + TypeScript** | SSR content, metadata, and an API route for the registration boundary. |
| **Procedural SVG + rAF camera** | Resolution-independent brain, accessible nodes, one interpolated `viewBox` attribute per frame — no Three.js cost or failure modes. |
| **Tailwind CSS 3** | Dark neural token system (void/abyss/panel, beam/mint accents). |
| **Framer Motion** | Panel entrances, hero reveal, mobile menu — gated on reduced motion. |
| **React Hook Form + Zod** | Registration state with one schema shared by client and server. |
| **Lucide React** | Consistent icon set. |
| **Fontsource** | Self-hosted Space Grotesk (display), Inter (body), IBM Plex Mono (labels). Zero external requests. |
| **Vitest** | Unit tests for validation, brain geometry, and camera math. |

No GSAP/ScrollTrigger: a centre-weighted IntersectionObserver plus an
exponentially interpolated camera achieves the scroll journey with less code
and no pinning/trapping risks.

## Getting started

Requires Node.js 18.17+ (tested on Node 22).

```bash
npm install
npm run dev      # http://localhost:3000
```

```bash
npm run build
npm start
npm run lint
npm run typecheck
npm test         # 24 tests: registration, brain geometry, camera framing
```

No environment variables are required. `.env.example` documents the optional
variables a future production backend would use.

## Architecture

```text
src/
├── app/                        layout (provider+scene+chrome), page, API route
├── data/
│   ├── event.ts                THE event facts — defined once, shown everywhere
│   └── journey.ts              destination defs: node position, accent, panel side
├── lib/
│   ├── brain.ts                seeded silhouette, neurons, links, route smoothing
│   ├── camera.ts               pure viewBox math (framePoint, overview, focus)
│   ├── validation.ts           Zod schema shared by form + API
│   ├── registration-id.ts      demo ID format (year-free by design)
│   └── registrations.ts        drafts, submit client, slip builder/download
├── components/
│   ├── journey/                JourneyProvider (single nav state), Chips, Rail
│   ├── neural/                 NeuralScene (SVG brain + camera + node states)
│   ├── layout/                 Header (progress + menu), Footer
│   ├── sections/               Hero + 8 destination sections
│   └── ui/                     JourneySection, Reveal, Stamp
tests/                           registration.test.ts, brain.test.ts
```

**Key invariants** (enforced by tests): geometry is deterministic per seed; every
destination sits inside the silhouette; the route visits all nine in order; every
camera frame keeps its node on screen at all seven target viewport sizes.

## Node states

| State | Visual |
|---|---|
| Inactive / upcoming | Dim blue-grey core, quiet links |
| Hover / keyboard focus | Accent core, thin ring, label pill (preview only — no camera move) |
| Selected | Accent core + bright centre, crisp ring, small halo, label, live route segment |
| Completed | Smaller dimmed accent core + faint ring |

Selection is never colour-only: rings, labels, size, and the progress indicator
all reinforce it.

## Demo vs. real

| Capability | Status |
|---|---|
| Brain, camera travel, tabs, FAQ search, timeline, navigation | Real — works fully client-side |
| Form validation (per-step + review) | Real — Zod, client and server |
| Draft save/restore, slip download | Real — localStorage + Blob |
| Registration submit | **Demo** — validated by `/api/registrations`, acknowledged with `IDX-XXXXXX` |
| ₹100 fee payment | **Not implemented** — payable as instructed; UI never claims to charge |
| Confirmation / certificate emails | **Not implemented** — no email is sent |
| Event year, venue, mid-day schedule | **Unconfirmed** — shown as TBC/provisional |

To go production: persist registrations (e.g. Postgres), add a payment link/QR
flow, and send confirmation + certificate emails — behind the existing
`POST /api/registrations` contract.

## License

See [LICENSE](./LICENSE).
