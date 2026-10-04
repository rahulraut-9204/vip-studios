---
name: VIP StudioS
description: A cinematic moving frame for social strategy and video production.
colors:
  ink: "#0a0a0a"
  ink-raised: "#141414"
  ink-soft: "#1e1e1e"
  white: "#f5f5f5"
  white-dim: "#d0d0d0"
  muted: "#a0a0a0"
  orange: "#FFA000"
  orange-hover: "#FFB52E"
  orange-on-light: "#8A4B00"
  porcelain: "#f5f3ed"
  ink-on-light: "#141414"
  line: "#2a2a2a"
typography:
  display:
    fontFamily: "Syne, DM Sans, Arial, sans-serif"
    fontSize: "clamp(3.8rem, 7vw, 6.7rem)"
    fontWeight: 800
    lineHeight: 0.94
    letterSpacing: "-0.075em"
  headline:
    fontFamily: "Syne, DM Sans, Arial, sans-serif"
    fontSize: "clamp(2.8rem, 5.5vw, 5.3rem)"
    fontWeight: 800
    lineHeight: 0.99
    letterSpacing: "-0.075em"
  body:
    fontFamily: "DM Sans, Arial, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: "DM Sans, Arial, sans-serif"
    fontSize: "0.58rem"
    fontWeight: 800
    lineHeight: 1.5
    letterSpacing: "0.11em"
rounded:
  control: "8px"
  card: "14px"
  pill: "999px"
spacing:
  page-gutter: "clamp(1.25rem, 5.5vw, 6rem)"
  page-width: "1480px"
components:
  button-primary:
    backgroundColor: "{colors.orange}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.pill}"
    padding: "0.8rem 1.1rem"
    height: "50px"
  button-primary-hover:
    backgroundColor: "{colors.orange-hover}"
  button-light:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.pill}"
    padding: "0.8rem 1.1rem"
    height: "50px"
  project-image:
    backgroundColor: "{colors.ink-soft}"
    rounded: "{rounded.card}"
---

## Overview

**Creative North Star: "The moving frame."**

VIP StudioS pairs social media management, video shoots, and professional editing. A vivid orange action color, editorial imagery, confident typography, and a compact scroll-reactive header create a distinct identity grounded in the supplied logo. A visitor moves from the offer to its three confirmed services, disclosed concept work, and a straightforward enquiry.

**The first-view rule:** the offer and project action are visible beside one decisive image. Three labeled controls expose the studio's social and production range. Do not bury the enquiry action in the footer or make illustrative concept images look commissioned.

## Colors

The dark media canvas lets imagery hold attention; porcelain sections provide a clear reading interval; vivid orange marks active states and actions rather than implying performance.

- **Ink** (`#0a0a0a`): media-led hero, process sections, navigation, and footer.
- **Raised Ink** (`#141414`) and **Soft Ink** (`#1e1e1e`): controls and media frames.
- **Porcelain** (`#f5f3ed`): reading sections and light action surfaces.
- **Dim White** (`#d0d0d0`) and **Muted** (`#a0a0a0`): supporting copy and metadata on dark fields.
- **Orange** (`#FFA000`): primary action, active selector, and short emphasis on dark surfaces.
- **Orange hover** (`#FFB52E`): hover and keyboard focus on dark surfaces.
- **Orange on light** (`#8A4B00`): readable accent text on porcelain surfaces.
- **Ink on light** (`#141414`): copy, focus, and controls on porcelain sections.
- **Hairlines** (`#2a2a2a`): separation on dark surfaces; use a dark translucent rule on light fields.

Keep orange selective. Use ink and porcelain as the reading surfaces; reserve the full orange field for the final project invitation.

## Typography

- **Display and page headlines:** Syne 500–800, fluid sizing, restrained negative tracking, and compact but readable line-height.
- **Body and controls:** DM Sans 400–700, comfortable paragraph measures and explicit control labels.
- **Metadata:** DM Sans 600–700, small and tracked only when it carries useful context.

Avoid the former oversized all-caps display treatment. The hierarchy comes from weight, scale, and spacing rather than decorative typefaces.

## Layout

Use a centered 1480px frame and fluid page gutters. The desktop hero balances a left-aligned offer with a wide image stage and three compact image-led selectors. On mobile, stack the offer before the image; keep all service selectors visible and usable without horizontal scrolling.

Use a direct page sequence: clear offer, three confirmed services, disclosed concept work, project process, short FAQ, and enquiry. Alternate media-dark sections with porcelain reading surfaces; at narrow viewports, stack the service rows and process without horizontal scrolling.

## Elevation & Depth

Use tonal ink surfaces, real image contrast, thin rules, and one modest offset edge on the active hero media. The header contracts into a compact island after scrolling and expands on hover, keyboard focus, or explicit pin. Keep transitions brief and functional; honor reduced-motion preferences.

## Shapes

Controls use an 8px radius, cards use a 14px radius, and the navigation and primary actions use a pill shape. The brand is grounded in the supplied logo. Orange does not become a decorative border on every component.

## Components

### Navigation and actions

The sticky header contracts into a centered island on scroll and expands on hover/focus; an explicit control can keep it open. Its Home, Services, Work, About, and Contact links remain keyboard-accessible. The mobile menu uses a large touch target and closes on navigation or Escape. Primary actions use orange with dark text. Preserve a visible 2px focus ring with offset.

### Hero media selector and concept work

The hero selectors are real buttons and expose Social, Shoot, and Edit with matching illustrative thumbnails. The active image, caption, and concept disclosure stay synchronized. All portfolio concept cards retain the “Concept work” label and are not presented as client results.

### Services and journey

Service rows describe social media management, video shoots, and professional editing. The project steps name the brief, planning, creation, and delivery rather than implying performance milestones.

### Enquiry fields

Keep labels outside rounded, high-contrast fields. The enquiry form collects name, email, phone/WhatsApp, requested service, and project description, with optional brand and timeline. Email and WhatsApp values come from build-time environment variables. The form opens a local email draft and must not imply that data was submitted to a server. The persistent WhatsApp action is shown only when a valid destination is configured.

### Portfolio and proof

Portfolio entries remain explicitly labeled illustrative concept studies until approved client work is supplied. Project pages link to related concepts, but do not invent client names, dates, commissioned work, testimonials, or outcomes. No video preview is enabled without an approved studio video asset.

## Do's and Don'ts

### Do

- Make social strategy, planning, publishing, account management, shoots, and professional editing clear within seconds.
- Use the connected content canvas to link image selection, service detail, concept examples, and enquiry.
- Preserve reduced-motion behavior, visible keyboard focus, responsive controls, and clear concept disclosures.

### Don't

- Return to oversized kinetic typography, endless ticker motion, or decorative route markers that interrupt the content flow.
- Invent clients, testimonials, team details, metrics, audience growth, or guaranteed outcomes.
- Use orange as an unverified success signal or add interface-like controls that do not perform an action.
