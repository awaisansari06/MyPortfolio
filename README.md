<div align="center">

# MOHAMMAD AWAIS ANSARI
### Full-Stack Developer · AI Application Engineer

*Modern, editorial software engineering portfolio built with Next.js 15, React 19, TypeScript, Tailwind CSS, GSAP, and Google Gemini.*

[![Next.js](https://img.shields.io/badge/Next.js-15.4-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![GSAP](https://img.shields.io/badge/GSAP-3.15-88CE02?style=for-the-badge&logo=greensock&logoColor=white)](https://greensock.com/gsap/)
[![Google Gemini](https://img.shields.io/badge/Google_Gemini-3.5_Flash_Lite-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-black?style=for-the-badge)](LICENSE)

[Live Demo](https://awaisdev-v1.vercel.app/) · [Ask Awais AI](#-ask-awais-ai-assistant) · [Report Bug](https://github.com/awaisansari06/MyPortfolio/issues) · [LinkedIn](https://www.linkedin.com/in/mohammad-awais-ansari-0560bb428/)

</div>

---

## 🏛️ Executive Summary

This repository houses the personal software engineering portfolio of **Mohammad Awais Ansari**, a graduate Computer Science student at the University of Mumbai. 

Designed under the philosophy of **"Static Composition + Dynamic Behavior"**, the portfolio rejects noisy 3D gimmicks and neon aesthetics in favor of a restrained, high-contrast monochrome editorial layout, precise micro-animations powered by GSAP, and a ground-truth-grounded conversational AI assistant powered by **Google Gemini 3.5 Flash Lite**.

---

## ⚡ Key Highlights

### 1. 🤖 "Ask Awais AI" Portfolio Assistant
- **Engineered with Gemini 3.5 Flash Lite (`gemini-3.5-flash-lite`)**: An integrated, streaming chatbot embedded directly on the client with route handlers (`app/api/chat/route.ts`).
- **Strict Anti-Hallucination Grounding**: Operates under a specialized system prompt grounded strictly in verified academic, project, and technical facts.
- **Progressive Streaming & Thinking Indicator**: Monospace `Thinking ● ● ●` state before progressive text rendering with parsed markdown links and download triggers.
- **Discreet Floating UI**: Accessible from any section via the floating bottom-right launcher or mobile drawer.

### 2. 🎬 Editorial Motion & Scroll Choreography
- **GSAP 3 & ScrollTrigger Pipeline**: Orchestrated entrance sequence (~850ms) animating background grid, typography tokens (`MOHAMMAD` $\to$ `AWAIS` $\to$ `ANSARI`), and metadata columns that settle into a motionless composition.
- **Stable Container Hitboxes**: Screenshot hovers apply subtle internal scales (`scale-[1.015]`) inside `overflow-hidden` wrappers without cursor jitter or layout shift.
- **Accessibility First**: Respects `prefers-reduced-motion: reduce` across all GSAP contexts with automatic reverts on component unmount.
- **1px Scroll Progress Line**: Real-time reading progress indicator anchored to the bottom edge of the sticky navigation header.

### 3. 📊 Live GitHub Activity & GraphQL Contributions
- **Dynamic Heatmap**: Fetches authentic 52-week contribution graphs directly from the GitHub GraphQL API.
- **Bespoke Skeleton Loader**: Displays a genuine monochrome 52-column $\times$ 7-row block skeleton with gentle pulsing during asynchronous fetches, followed by a smooth crossfade.
- **Authoritative Pinned Order**: Automatically displays selected repositories matching GitHub pinned order (`MyPortfolio`, `CareerWise`, `devflow`, `smart-journey`).

### 4. 💼 Deep-Dive Project Case Studies & Specs
- **Selected Works**: Features **CareerWise** (AI Career Intelligence Platform), **DevFlow** (Agentic Web Application Generator), and **SmartJourney** (AI Route Planning System).
- **Interactive Specs Modal**: Comprehensive architectural breakdowns covering system problems, engineering approaches, runtime execution flows, and key metrics.

### 5. 🎨 Quiet Luxury Monochrome Design System
- High-contrast, tailored typography paired with curated monochrome color palettes (Off-white `#F7F6F3` / Pitch-black `#0A0A0A`).
- Fast theme switcher toggling between light and dark modes with persistent local storage.

---

## 🛠️ Tech Stack & Architecture

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Framework** | [Next.js 15 (App Router)](https://nextjs.org/) | Server-side rendering, streaming API routes, metadata optimization |
| **Language** | [TypeScript 5.9](https://www.typescriptlang.org/) | Strict type safety, interface contracts, compile-time verification |
| **UI Library** | [React 19](https://react.dev/) | Component architecture, server/client boundary management |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) | Modern utility-first CSS, responsive layouts, color tokens |
| **Animation** | [GSAP 3.15](https://greensock.com/gsap/) + [ScrollTrigger](https://greensock.com/scrolltrigger/) | Timeline choreography, scroll-driven reveals, reduced motion handling |
| **AI Integration** | [Google Gen AI SDK](https://www.npmjs.com/package/@google/genai) | Gemini 3.5 Flash Lite streaming route handler |
| **Icons** | [Lucide React](https://lucide.dev/) | Lightweight, modern icon set |
| **Data Source** | [GitHub GraphQL API](https://docs.github.com/en/graphql) | Real-time contribution heatmap and public repository metadata |

---

## 📂 Project Structure

```bash
MyPortfolio/
├── app/
│   ├── api/
│   │   ├── chat/route.ts            # Gemini 3.5 Flash Lite streaming handler
│   │   └── github/contributions/    # GitHub GraphQL API proxy
│   ├── favicon.ico
│   ├── globals.css                  # Tailwind v4 directives & font imports
│   ├── layout.tsx                   # Root HTML structure, fonts & metadata
│   └── page.tsx                     # Main single-page portfolio layout
├── components/
│   ├── ai/
│   │   └── AskAwaisChat.tsx         # Floating Gemini AI assistant dialog
│   ├── github/
│   │   ├── ContributionGrid.tsx     # 52-week SVG/CSS heatmap renderer
│   │   ├── GitHubContributions.tsx  # Dynamic fetch wrapper with skeleton loader
│   │   └── GitHubRepositories.tsx   # Pinned repositories card grid
│   ├── About.tsx                    # Academic credentials & certifications
│   ├── Contact.tsx                  # Direct mailer & contact channels
│   ├── EngineeringFoundation.tsx    # Architectural and engineering principles
│   ├── Hero.tsx                     # Editorial typography hero & CTA group
│   ├── Navbar.tsx                   # Sticky nav with 1px scroll progress & theme toggle
│   ├── ProjectModal.tsx             # Detailed case study dialog modal
│   ├── SelectedWork.tsx             # Featured production projects showcase
│   ├── TechStack.tsx                # Categorized technologies & tools
│   └── WhatIBuild.tsx               # Core engineering capability blocks
├── data/
│   └── portfolio.ts                 # Authoritative resume, project, and profile data
├── lib/
│   ├── ai/
│   │   └── systemPrompt.ts          # Grounded system prompt for Ask Awais AI
│   ├── github/
│   │   ├── client.ts                # GitHub GraphQL client
│   │   └── types.ts                 # TypeScript schemas for contribution graphs
│   └── motion.ts                    # GSAP registration & reduced-motion utilities
├── public/
│   ├── AwaisCV.pdf                  # Downloadable curriculum vitae
│   └── projects/                    # High-res project interface previews
├── .env.example                     # Sample environment variable template
├── next.config.ts                   # Next.js build and image optimization settings
├── package.json                     # Scripts & dependencies
├── tailwind.config.ts               # Custom typography, spacing & theme tokens
└── tsconfig.json                    # Strict TypeScript configuration
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your machine:
- **Node.js**: `v18.18.0` or later (Node 20+ recommended)
- **npm**, **pnpm**, or **yarn**

### 1. Clone the Repository

```bash
git clone https://github.com/awaisansari06/MyPortfolio.git
cd MyPortfolio
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Populate the keys:

```env
# Google Gemini API Key (Required for Ask Awais AI)
# Get a free key at https://aistudio.google.com/
GEMINI_API_KEY="your_google_gemini_api_key_here"

# GitHub Personal Access Token (Optional but recommended for live contributions)
# Generate a token with read:user scope at https://github.com/settings/tokens
GITHUB_TOKEN="your_github_personal_access_token_here"
```

> **Note**: If `GITHUB_TOKEN` is omitted, the application will automatically fall back to cached activity metrics without breaking the UI.

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the portfolio.

---

## 📜 Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the Next.js local development server with Hot Module Replacement |
| `npm run build` | Compiles the production build, optimizes bundles, and generates static pages |
| `npm run start` | Boots the Next.js production server |
| `npm run lint` | Runs ESLint 9 across all `.ts`, `.tsx`, and `.js` files |
| `npx tsc --noEmit` | Runs the TypeScript compiler to verify static type soundness |

---

## ♿ Accessibility & Performance Standards

- **Semantic HTML5**: Full usage of `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, and `<footer>`.
- **Keyboard Navigable**: Interactive elements provide explicit `focus-visible` styling and logical tab indexing.
- **Screen Reader Support**: Meaningful `aria-label`, `aria-modal`, and `role="dialog"` annotations throughout modals and interactive controls.
- **Prefers-Reduced-Motion**: Automatically disables GSAP timeline transforms when system-level reduced motion preferences are enabled.
- **Hitbox Stability**: Transform scales on project thumbnails execute strictly inside `overflow-hidden` wrappers to eliminate layout shift (CLS).

---

## 📬 Contact & Connect

**Mohammad Awais Ansari**  
*Full-Stack Developer & AI Applications Engineer*  
Virar, Maharashtra, India

- 🌐 **Portfolio**: [awaisansari06.github.io/MyPortfolio](https://awaisdev-v1.vercel.app/)
- 📧 **Email**: [muhammadavais14@gmail.com](mailto:muhammadavais14@gmail.com)
- 💼 **LinkedIn**: [linkedin.com/in/mohammad-awais-ansari-0560bb428](https://www.linkedin.com/in/mohammad-awais-ansari-0560bb428/)
- 🐙 **GitHub**: [@awaisansari06](https://github.com/awaisansari06)

---

## 📄 License

This project is licensed under the [MIT License](LICENSE) — you are free to use this code for personal reference and inspiration.

<div align="center">
  <sub>Designed & Developed with precision by Mohammad Awais Ansari · 2026</sub>
</div>
