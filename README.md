# Mohammad Awais — Developer Portfolio

A personal portfolio built with Next.js, React, TypeScript, Tailwind CSS, and GSAP.
The design pairs editorial typography with a transparent portrait composition, photographic layers, and matching dark and light themes.

## Homepage

1. Introduction and portrait
2. Selected work: BuildStack (featured), CareerWise, and TripCraft
3. Expertise and technology stack
4. About, education, and expandable credentials
5. GitHub activity and contact

Project descriptions, case studies, education, and links come from `data/portfolio.ts`.
The detailed project dialog, résumé, theme preference, contribution graph, and streaming Ask Awais AI assistant are retained.

## Development

Use Node.js 20.9 or newer.

```sh
npm install
npm run dev
```

Open [localhost:3000](http://localhost:3000).

Copy `.env.example` to `.env` and fill in the required values locally.
Credentials remain on the server and must never be committed.
The GitHub calendar falls back to a profile link when its API is unavailable.
The contact form composes a message in the visitor’s email app; it does not claim to send email itself.

## Checks

Search metadata, crawl routes, and profile structured data use `https://buildbyawais.tech` as the canonical domain. See [search visibility setup](docs/search-visibility.md) for deployment and Search Console steps.

```sh
npm run build
npm run lint
npm test
```

Tests cover AI request validation and streaming recovery, contribution dates and keyboard navigation, contact clipboard errors, modal scroll locking, and project actions.

## Source layout

| Path | Purpose |
| --- | --- |
| `app/` | Page composition, theme styles, metadata, and API routes |
| `components/` | Homepage sections, detailed project dialog, and UI |
| `components/ai/` | Streaming portfolio assistant |
| `components/github/` | Contribution calendar and accessible cells |
| `data/portfolio.ts` | Existing portfolio facts and project records |
| `hooks/` | Editorial motion, dialog focus, and keyboard-aware chat sizing |
| `lib/` | Shared AI, GitHub, image, scroll, and animation utilities |
| `public/` | Portraits, logo, project screenshots, fonts, and résumé |
| `tests/` | Regression tests |
| `docs/portrait-assets.md` | Portrait sources and editing notes |

The homepage follows natural document scrolling, supports keyboard access, and respects reduced-motion preferences.
No custom cursor, optical-refraction engine, hidden legacy sections, or duplicate repository grid is shipped.

## Portrait assets

The hero uses a transparent WebP derivative for efficient delivery.
The original supplied photographs remain the identity references.
See [portrait asset notes](docs/portrait-assets.md) for provenance and editing details.

The stack uses a seamless CSS logo ribbon with a manual pause control, hover pause, a single accessible technology list, and a wrapped static layout for reduced-motion preferences. Project previews retain the original live links and detailed case studies.

