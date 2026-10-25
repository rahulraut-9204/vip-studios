# VIP STUDIOS — Copilot Instructions

## Project
Premium cinematic creative-studio portfolio + lead-gen site with a lightweight admin CMS.
Stack: Vite + React + JavaScript + Tailwind + React Router + Supabase + Motion + Lucide.
Deploy target: Cloudflare Pages. Do NOT change the build output config.

## Design tokens (NON-NEGOTIABLE)
- bg:        #FFFDF8
- surface:   #FFFFFF
- surface-2: #F4F1FF
- border:    #EAE6E0
- accent:    #FF6542
- accent-2:  #7765F8
- support:   #B9F4D0 / #FFD76A
- deep:      #27213D
- text:      #19162B
- muted:     #6E6A7C
- radius:    12–20px (pill shapes only for compact media controls)
- font:      Space Grotesk for display, DM Sans for body/UI.
- breakpoints: ONLY 480 / 768 / 1024 / 1280 / 1536px

## Rules
1. NEVER invent clients, testimonials, stats, years, awards, phone, email, or social URLs.
   If unknown, use `siteConfig` placeholders and leave visible content empty.
2. Never hardcode business info — everything comes from `src/config/site.js`.
3. YouTube: store URL, extract ID, render thumbnail + play button, mount iframe ONLY on click.
4. Instagram: link out only ("View on Instagram"). No API dependency in v1.
5. Respect `prefers-reduced-motion` on every animation.
6. Semantic HTML + keyboard focus + alt text on every image.
7. No new dependencies without asking first.
8. Do not rebuild files I didn't ask you to touch.
9. After each task: run `npm run build`, fix errors, then STOP and summarize.

## Anti-patterns (do NOT produce these)
- Centered hero with a gradient blob.
- 3 identical service cards.
- Uniform 3-column portfolio grids.
- Emoji as icons.
- Excessive glassmorphism / neon / cyberpunk.
- Fake "Lorem ipsum" or placeholder testimonials on the live site.
- Multiple YouTube iframes loaded on page load.

## Aesthetic direction
Light-first editorial contact sheet: ivory space, expressive display type, ink text,
coral actions, periwinkle wayfinding, small mint/sunshine registration marks, thin
rules, image-led asymmetric compositions and restrained motion. The result should feel
like a real creative studio archive — not a SaaS dashboard, not a college project.