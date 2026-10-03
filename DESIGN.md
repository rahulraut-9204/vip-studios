---
name: VIP StudioS
description: A connected content canvas for social strategy and video production.
colors:
  ink: "#080808"
  ink-raised: "#111110"
  ink-soft: "#1b1a18"
  white: "#f7f6f2"
  white-dim: "#d2d0c8"
  muted: "#a7a49a"
  gold: "#c9ad69"
  gold-bright: "#e4cd91"
  gold-deep: "#765f37"
  line: "rgba(247, 246, 242, 0.15)"
  line-gold: "rgba(201, 173, 105, 0.42)"
typography:
  display:
    fontFamily: "Manrope, Arial, sans-serif"
    fontSize: "clamp(3.8rem, 7vw, 6.7rem)"
    fontWeight: 800
    lineHeight: 0.94
    letterSpacing: "-0.075em"
  headline:
    fontFamily: "Manrope, Arial, sans-serif"
    fontSize: "clamp(2.8rem, 5.5vw, 5.3rem)"
    fontWeight: 800
    lineHeight: 0.99
    letterSpacing: "-0.075em"
  body:
    fontFamily: "Manrope, Arial, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: "Manrope, Arial, sans-serif"
    fontSize: "0.58rem"
    fontWeight: 800
    lineHeight: 1.5
    letterSpacing: "0.11em"
rounded:
  sharp: "2px"
  signal: "2px"
spacing:
  page-gutter: "clamp(1.25rem, 5.5vw, 6rem)"
  page-width: "1480px"
components:
  button-primary:
    backgroundColor: "{colors.gold}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.sharp}"
    padding: "0.8rem 1.1rem"
    height: "50px"
  button-primary-hover:
    backgroundColor: "{colors.gold-bright}"
  button-light:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.sharp}"
    padding: "0.8rem 1.1rem"
    height: "50px"
  project-image:
    backgroundColor: "{colors.ink-soft}"
    rounded: "{rounded.sharp}"
---

## Overview

**Creative North Star: "Connected content canvas."**

VIP StudioS turns social planning and video production into one coherent creative offer. The interface uses a modular composition of image, message, and service controls: a visitor can move between Social, Shoot, and Edit in the hero, then follow the same path down the page to services, disclosed concept work, and enquiry.

**The first-view rule:** the offer and project action are visible beside one decisive image. Three labeled controls expose the studio's social and production range. Do not bury the enquiry action in the footer or make illustrative concept images look commissioned.

## Colors

The dark media canvas lets imagery hold attention; porcelain sections provide a clear reading interval; brushed gold marks active states and actions rather than implying performance.

- **Ink** (`#080808`): media-led hero, process sections, navigation, and footer.
- **Raised Ink** (`#111110`) and **Soft Ink** (`#1b1a18`): controls and media frames.
- **Porcelain** (`#f7f6f2`): primary type and light action surfaces.
- **Dim White** (`#d2d0c8`) and **Muted** (`#a7a49a`): supporting copy and metadata on dark fields.
- **Gold** (`#c9ad69`): primary action, active selector, and short emphasis.
- **Bright Gold** (`#e4cd91`): hover and keyboard focus.
- **Deep Gold** (`#765f37`): accessible gold text on light surfaces.
- **Hairlines** (`rgba(247, 246, 242, 0.15)` and `rgba(201, 173, 105, 0.42)`): separation and selection.

Keep gold selective. Use ink, porcelain, and gold in alternating fields instead of turning full sections into gold panels.

## Typography

- **Display and page headlines:** Manrope 800, fluid sizing, negative tracking, and compact but readable line-height.
- **Body and controls:** Manrope 400–700, with comfortable paragraph measures and explicit control labels.
- **Metadata:** Manrope 700–800, small and tracked only when it carries useful context.

Avoid the former oversized all-caps display treatment. The hierarchy comes from weight, scale, and spacing rather than decorative typefaces.

## Layout

Use a centered 1480px frame and fluid page gutters. The desktop hero balances a left-aligned offer with a wide image stage and three compact image-led selectors. On mobile, stack the offer before the image; keep all service selectors visible and usable without horizontal scrolling.

Alternate media-dark sections with porcelain reading surfaces. Services remain open rows, the plan-to-publish sequence remains a meaningful numbered progression, and the concept gallery retains an asymmetrical image rhythm instead of a generic uniform tile grid.

## Elevation & Depth

Use tonal ink surfaces, real image contrast, thin rules, and one modest offset edge on the active hero media. Do not use glass, glow, or decorative blur. The hero image transition and selector state carry the authored motion; in-view reveals stay brief and content remains readable with reduced motion enabled.

## Shapes

Controls, fields, project frames, and dividers are square-edged with a restrained 2px radius where interaction benefits from it. The brand mark is a fine-line V/S monogram. Gold does not become a decorative border on every component.

## Components

### Navigation and actions

The sticky header is compact and quiet, with a clear route list and a visible enquiry action. Primary actions use gold with dark text; text links remain separate and clearly named. Preserve a visible 2px focus ring with offset.

### Hero media selector and concept work

The hero selectors are real buttons and expose Social, Shoot, and Edit with matching illustrative thumbnails. The active image, caption, and concept disclosure stay synchronized. All portfolio concept cards retain the “Concept work” label and are not presented as client results.

### Services and journey

Service rows pair category, actual service description, and a direct path to details. Plan, Shoot, Edit, and Publish are shown as an ordered service flow, not fabricated performance milestones.

### Enquiry fields

Keep labels outside square-edged, high-contrast fields. Email and WhatsApp destinations remain visibly unconfigured until verified values are supplied. The form opens a local email draft and must not imply that data was submitted to a server.

## Do's and Don'ts

### Do

- Make social strategy, planning, publishing, account management, shoots, and professional editing clear within seconds.
- Use the connected content canvas to link image selection, service detail, concept examples, and enquiry.
- Preserve reduced-motion behavior, visible keyboard focus, responsive controls, and clear concept disclosures.

### Don't

- Return to oversized kinetic typography, endless ticker motion, or the previous orbit/sticker decorations.
- Invent clients, testimonials, team details, metrics, audience growth, or guaranteed outcomes.
- Use gold as an unverified success signal or add interface-like controls that do not perform an action.
