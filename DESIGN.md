---
name: VIP StudioS
description: Kinetic-cut creative for social strategy and video production.
colors:
  ink: "#090909"
  ink-raised: "#121212"
  ink-soft: "#1d1c1a"
  white: "#f8f7f2"
  white-dim: "#cbc9c0"
  muted: "#a3a095"
  gold: "#d9b85f"
  gold-bright: "#f2d77b"
  gold-deep: "#987b34"
  line: "rgba(248, 247, 242, 0.18)"
  line-gold: "rgba(217, 184, 95, 0.48)"
typography:
  display:
    fontFamily: "Archivo Black, Arial Black, sans-serif"
    fontSize: "clamp(5.2rem, 11.3vw, 10.5rem)"
    fontWeight: 400
    lineHeight: 0.81
    letterSpacing: "-0.095em"
  headline:
    fontFamily: "Archivo Black, Arial Black, sans-serif"
    fontSize: "clamp(3.2rem, 6.4vw, 6.8rem)"
    fontWeight: 400
    lineHeight: 0.86
    letterSpacing: "-0.09em"
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
  sharp: "0px"
  signal: "50%"
spacing:
  page-gutter: "clamp(1.25rem, 5.5vw, 6rem)"
  page-width: "1480px"
components:
  button-primary:
    backgroundColor: "{colors.gold}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.sharp}"
    padding: "0.85rem 1.25rem"
    height: "54px"
  button-primary-hover:
    backgroundColor: "{colors.gold-bright}"
  button-light:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.sharp}"
    padding: "0.85rem 1.25rem"
    height: "54px"
  project-image:
    backgroundColor: "{colors.ink-soft}"
    rounded: "{rounded.sharp}"
---

## Overview

**Creative North Star: "Kinetic-cut editorial."**

The site treats the headline as the set: huge compressed type establishes the message while an image frame cuts into its field. Warm white and black hold the composition; gold marks the active phrase, primary action, and moving-image accents. Social strategy and production are presented as one continuous content practice, not as separate service silos.

**The first-view rule:** make the offer and enquiry action legible immediately, then let visitors switch the hero image between social, shoot, and edit. Below it, varied typographic, image, and open-list sections carry the same plan-to-publish story. Every current portfolio and studio photograph is illustrative and identified as such.

## Colors

The stage is near-black; warm white carries high-priority reading. Gold is reserved for action, emphasis, and selected states. Raised ink planes and fine rules separate content without building a stack of cards.

- **Ink** (`#090909`): page ground and dark image overlays.
- **Raised Ink** (`#121212`) and **Soft Ink** (`#1d1c1a`): secondary planes and image backing.
- **Warm White** (`#f8f7f2`): primary type and light actions.
- **Dim White** (`#cbc9c0`) and **Muted** (`#a3a095`): supporting copy, metadata, and captions.
- **Gold** (`#d9b85f`): primary action and selected words.
- **Bright Gold** (`#f2d77b`): hover and keyboard focus.
- **Deep Gold** (`#987b34`): restrained tonal support.
- **Hairlines** (`rgba(248, 247, 242, 0.18)` and `rgba(217, 184, 95, 0.48)`): quiet boundaries and active stage edges.

Keep gold selective. Do not make whole sections gold or use it as an unverified performance signal.

## Typography

- **Display:** Archivo Black, used at its available regular face, with tight tracking and compressed line-height. The homepage statement may scale from `5.2rem` to `10.5rem`.
- **Page headlines:** Archivo Black, fluid from `3.2rem` to `6.8rem`, with compact line-height.
- **Reading and controls:** Manrope, 1rem body size and 1.55 line-height; keep paragraph measures comfortable.
- **Labels:** Manrope, compact, bold, uppercase, and tracked. Do not introduce a mono face as decoration.

Let display type supply the energy; supporting text remains easy to read and actions retain clear labels.

## Layout

Use a centered 1480px frame with `clamp(1.25rem, 5.5vw, 6rem)` page gutters. The desktop hero pairs an oversized typographic field with a large, offset image stage; on narrow screens, stack the offer and actions before the image, and move its concept disclosure to the top of the frame so it stays visible without deep scrolling. Do not preserve desktop overlap when it makes mobile type collide.

Service rows, the plan/shoot/edit/publish sequence, and the concept gallery vary density and rhythm rather than repeating a uniform card grid. At 1000px, 760px, and 480px, reduce gutters and progressively collapse multi-column compositions. Keep navigation, filters, and image selectors operable without horizontal scrolling.

## Elevation & Depth

Depth comes from tonal ink changes, a restrained radial wash, image overlays, and offset gold stage edges. Avoid generic card shadows. Motion includes a short hero reveal, image crossfades, one continuous process ticker, and staggered in-view content reveals. Respect `prefers-reduced-motion` in both CSS and Motion interactions; important content is visible without animation.

## Shapes

Buttons, fields, project frames, and dividers are square-edged. The floating gold hero marker may be circular as a deliberate signal shape. Use thin rules to frame image-led content, not to box every paragraph or service.

## Components

### Actions and navigation

Primary actions use a gold fill and ink text; light actions reverse the contrast. Both are at least 54px tall and lift briefly on hover. Links use short directional icons where they improve wayfinding. Keep a visible 2px gold keyboard-focus ring with a 4px offset. The sticky header uses quiet white navigation; on mobile, retain a clear menu button and expanded route list.

### Image stage and project cards

Crop local WebP imagery within square-edged frames. The hero caption, concept disclosure, selected image, and active Shoot / Edit / Social control stay synchronized. Project cards keep caption and category close to the image. Clearly disclose stock imagery as illustrative concept work, never as commissioned studio work.

### Service rows and journey

Service areas use open horizontal rows with a concise label, clear benefit, and direct route to service details. The content journey uses numbered steps only because Plan, Shoot, Edit, and Publish are a meaningful sequence.

### Enquiry fields

Keep labels outside dark, square-edged fields. Maintain high-contrast text, visible focus, and native input affordances. Do not imply an enquiry was sent when the configured email or WhatsApp destination is unavailable.

## Do's and Don'ts

### Do

- **Do** make strategy, publishing/account management, shoots, and professional editing recognizable in the first visit.
- **Do** pair one decisive image with large type, then vary the page's pace below the hero.
- **Do** use motion to reveal content and communicate image selection, with a reduced-motion path.
- **Do** keep illustrative concept imagery and all unverified studio details explicitly disclosed.

### Don't

- **Don't** revive the former score-console language, monospaced instrumentation, or a dated film-stock treatment.
- **Don't** invent client work, testimonials, team details, metrics, audience growth, or guaranteed outcomes.
- **Don't** use animation, overlap, or the gold palette to obscure the enquiry path or readable copy.
