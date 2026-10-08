---
name: VIP StudioS
description: An editorial, cinematic content journey for strategy, production and digital growth.
colors:
  background: "#0A0A0A"
  surface: "#141414"
  surface-raised: "#1E1E1E"
  border: "#2A2A2A"
  accent: "#FFA000"
  text: "#F5F5F5"
  muted: "#A0A0A0"
  light-surface: "#F5F3ED"
typography:
  display:
    fontFamily: "Inter, Arial, sans-serif"
    fontWeight: 800
  body:
    fontFamily: "Inter, Arial, sans-serif"
    fontWeight: 400
rounded:
  control: "8px"
  card: "14px"
spacing:
  page-gutter: "clamp(1.25rem, 5.5vw, 6rem)"
  page-width: "1480px"
---

## Overview

VIP StudioS is a premium content, social-media and digital-growth partner. The site leads visitors through **SHOW → PROVE → TRUST → ENQUIRE**: show the work, explain the offer and process, establish truthful proof, then make the next conversation easy.

The visual world is editorial and cinematic: a near-black media canvas, high-contrast type, thin rules, asymmetric compositions, image-led project surfaces and one deliberate orange accent. The interface should feel authored, not like a generic agency template.

## Tokens

- **Background:** `#0A0A0A`
- **Surface:** `#141414`
- **Raised surface:** `#1E1E1E`
- **Border:** `#2A2A2A`
- **Accent:** `#FFA000`
- **Text:** `#F5F5F5`
- **Muted text:** `#A0A0A0`
- **Light surface:** `#F5F3ED`

The accent is reserved for actions, active states, key figures and brief emphasis. Do not introduce yellow, gold, purple, blue or green aliases.

## Typography

Inter is the single type family for display, body and controls. Display text uses tight tracking and fluid sizing; body copy stays readable with comfortable line length. Metadata is small and tracked only when it improves scanning.

## Layout and responsive behavior

Use a centered `1480px` frame with fluid page gutters. Responsive thresholds are limited to `480px`, `768px`, `1024px`, `1280px` and `1536px`. On smaller screens, stack editorial compositions, preserve strong media crops, keep controls comfortably tappable and prevent horizontal overflow.

The scroll-reactive header contracts into a compact island and expands on hover, focus or explicit pin. Reduced-motion users receive the same hierarchy without movement.

## Components

- **Navigation:** semantic links, visible focus, mobile menu with Escape and close-on-navigation behavior.
- **Hero:** one clear studio proposition, selectable illustrative media and direct project/enquiry actions.
- **Portfolio:** image-led cards and detail pages with explicit concept-work disclosures until approved commissioned work exists.
- **Services/process:** explain scope and collaboration without promising reach, virality, follower counts or other unsupported outcomes.
- **Enquiry:** labels remain outside fields; email and WhatsApp destinations come from `src/config/site.js` and build-time environment values.

## Content truth

Do not invent clients, testimonials, awards, team biographies, URLs or outcomes. Static portfolio items are illustrative concepts unless verified project data is supplied. The admin/CMS path may later provide published project data, but public fallbacks must remain truthful.

## Do

- Make the complete content offer clear quickly.
- Let the work lead visually while preserving context and disclosures.
- Keep keyboard access, visible focus, alt text, reduced motion and contrast intact.

## Do not

- Use decorative interface controls that do not perform an action.
- Reintroduce gold/yellow tokens, oversized kinetic noise or copied reference identities.
- Hide the enquiry path in the footer or imply that the client-side email draft is a server submission.
