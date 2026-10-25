---
name: VIP StudioS
description: A bright editorial contact sheet for video editing, production and content systems.
colors:
  background: "#FFFDF8"
  surface: "#FFFFFF"
  surface-raised: "#F4F1FF"
  border: "#EAE6E0"
  accent: "#FF6542"
  accent-secondary: "#7765F8"
  mint: "#B9F4D0"
  sunshine: "#FFD76A"
  deep: "#27213D"
  text: "#19162B"
  muted: "#6E6A7C"
typography:
  display:
    fontFamily: "Space Grotesk, Arial, sans-serif"
    fontWeight: 600
  body:
    fontFamily: "DM Sans, Arial, sans-serif"
    fontWeight: 400
rounded:
  control: "12px"
  card: "20px"
spacing:
  page-gutter: "clamp(1.25rem, 5vw, 5.5rem)"
  page-width: "1440px"
---

## Overview

VIP StudioS is a premium content, social-media and digital-growth partner. The public experience leads visitors through **SHOW → PROVE → TRUST → ENQUIRE** without inventing proof: show the work, explain the offer and process, distinguish concept studies, then make the next conversation easy.

The visual world is a **light studio contact sheet**: ivory paper-like space, ink typography, coral action marks, periwinkle wayfinding, and small mint/sunshine registration accents. Portfolio imagery is treated like a curated working board rather than a generic card grid.

## Tokens

- **Background:** `#FFFDF8`
- **Surface:** `#FFFFFF`
- **Raised surface:** `#F4F1FF`
- **Border:** `#EAE6E0`
- **Primary accent:** `#FF6542`
- **Secondary accent:** `#7765F8`
- **Supporting accents:** `#B9F4D0`, `#FFD76A`
- **Deep contrast:** `#27213D`
- **Text:** `#19162B`
- **Muted text:** `#6E6A7C`

Coral owns primary actions and conversion moments. Periwinkle marks navigation and editorial metadata. Mint and sunshine are sparse registration marks, not competing calls to action.

## Typography

`Space Grotesk` is the display face: compact, contemporary and expressive at large editorial sizes. `DM Sans` is the body and form face: neutral, readable and stable at small sizes. Display headings use tight tracking and fluid `clamp()` sizing; body copy stays within readable measures.

## Layout and responsive behavior

Use a centered `1440px` frame with fluid page gutters. Responsive thresholds remain limited to `480px`, `768px`, `1024px`, `1280px` and `1536px`. The homepage opens with a two-column statement plus a three-image contact sheet, then stacks the same story cleanly on mobile.

The header is a light sticky bar with a full-height mobile sheet. Cards use varied editorial spans, generous whitespace and stable media ratios. No interaction hides essential information behind hover.

## Motion

Motion is short and authored: the hero statement and contact sheet enter once, sections reveal as they enter the viewport, and portfolio imagery responds with a restrained scale. Use opacity and transforms; avoid scroll-jacking, perpetual decoration and layout-triggering animation. `prefers-reduced-motion` makes content immediate and disables decorative transitions.

## Components

- **Navigation:** semantic links, light sticky bar, visible active underline, keyboard-trapped mobile sheet and explicit project CTA.
- **Hero:** typographic proposition paired with a truthful contact sheet of available project imagery.
- **Portfolio:** image-led cards, asymmetric spans, concept disclosures and click-only media playback.
- **Services/process:** clear scope and collaboration language without guaranteed outcomes.
- **Enquiry:** labelled form, client-side validation, email-draft behavior and configured WhatsApp destination.
- **Admin:** existing Supabase authentication, project CRUD, publication states and protected operations remain intact.

## Content truth

Do not invent clients, testimonials, awards, team biographies, URLs, locations or outcomes. Static portfolio entries are illustrative concepts unless verified project data is supplied. The public site must not imply that stock imagery is commissioned work.

## Do

- Let the work and the first action arrive quickly.
- Use coral for action, periwinkle for orientation and neutral ink for reading.
- Preserve keyboard access, visible focus, alt text, reduced motion and contrast.
- Keep direct-video and YouTube playback thumbnail-first.

## Do not

- Reintroduce the previous dark/orange-only visual system.
- Use fake testimonials, unsupported metrics, client claims or guaranteed growth language.
- Turn every section into a rounded card or decorate empty space without purpose.
- Hide the enquiry path or claim that a mailto draft was submitted by the site.
