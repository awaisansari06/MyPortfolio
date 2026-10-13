# Portfolio responsive refinement

## Implementation

- Preserved the existing theme, content, project URLs, screenshots, assistant API, and component architecture.
- Hero uses fluid, solid MOHAMMAD / AWAIS typography, balanced CTAs, and three featured projects with six-second rotation. Rotation pauses on hover, keyboard focus, manual selection, hidden tabs, and reduced motion. Arrow keys and horizontal swipe handlers are supported.
- Desktop navigation starts at 1100px. Below that width, the accessible menu replaces full navigation and the AI launcher moves to the bottom-right.
- The compact launcher has a dedicated 64px rail plus the safe-area inset. This deliberately trades some viewport height for keeping the launcher continuously available without covering page content or carousel controls. The page uses an internal scrollport at this breakpoint; section navigation and ScrollTrigger follow that scrollport.
- The hero stacks below 900px; spacing and CTA sizing tighten below 600px, with an additional narrow-screen adjustment below 360px.
- Mobile AI uses a modal panel with focus management, Escape support, background scroll locking, safe-area spacing, and visualViewport sizing. Desktop retains the existing nonmodal assistant panel. The launcher hides while the assistant is open.
- Theme-aware glass is reserved for the launcher/navigation. Informational cards are flatter, muted text is stronger, and section entrance animations no longer start with invisible content.

## Files in this refinement

- `app/globals.css`, `app/page.tsx`
- `components/Hero.tsx`, `components/Navbar.tsx`, `components/CustomCursor.tsx`
- `components/ai/AskAwaisChat.tsx`, `components/ai/MobileAiLauncher.tsx`
- `hooks/useChatViewport.ts`, `hooks/useResponsiveScroll.ts`, `hooks/useDialogFocus.ts`
- Section spacing/motion: About, Contact, EngineeringFoundation, SelectedWork, TechStack, WhatIBuild, GitHubContributions
- `tests/chat.test.cjs`, `tests/hero-carousel.test.cjs`

Other pre-existing changes in the working tree were preserved.

## Browser verification

Validation commands: `npx tsc --noEmit --incremental false` and `npm run lint` passed. `npm test` passed all 23 tests. `git diff --check` passed.

The final isolated production build (`NEXT_DIST_DIR=.next-verify/build npm run build`) passed. The production preview on port 3105 was checked again at all 17 widths in both themes with the intended fonts loaded: no document overflow and no zero-opacity section headings or paragraphs. At 320px, all three featured cards measured the same height (366.64px); all descriptions fit and keyboard arrow navigation wrapped correctly. Screenshots are saved under `artifacts/responsive/`.

Real Chromium browser layout checks in dark and light themes at widths 320, 360, 375, 390, 430, 600, 768, 900, 1024, 1099, 1100, 1180, 1280, 1366, 1440, 1920, and 2560px. Checked document overflow, navigation fit, launcher availability, and separation between the scrolling page and launcher rail.

Verified mobile menu opening, Contact navigation, closing, Escape, and focus restoration. Verified the assistant opening, an actual successful streamed response, closing, Escape, focus restoration, and background scroll locking.

Assistant geometry was checked at 320x568, 844x390 (landscape), 390x420 (short viewport), and 1024x600. Panel and input stayed within the viewport. Automated regression tests cover carousel keyboard wrapping, horizontal swipes, vertical-swipe rejection, and accidental click suppression after swiping.

## Limits of verification

Viewport emulation is not physical-device testing. Real iOS/Android keyboards, browser chrome, touch gestures on hardware, browser zoom, and an operating-system reduced-motion toggle were not directly tested. Short-height viewport checks exercised constrained panel geometry; visualViewport handling and reduced-motion paths were inspected in source. No deployment was performed.
