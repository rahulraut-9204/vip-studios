# VIP STUDIOS — Copilot Instructions

## Project
Premium cinematic creative-studio portfolio + lead-gen site with a lightweight admin CMS.
Stack: Vite + React + JavaScript + Tailwind + React Router + Supabase + Motion + Lucide.
Deploy target: Cloudflare Pages. Do NOT change the build output config.

## Design tokens (NON-NEGOTIABLE)
- bg:        #0A0A0A
- surface:   #141414
- border:    #2A2A2A
- accent:    #FFA000  (ONLY this accent — no gold/yellow/purple/blue/green)
- text:      #F5F5F5
- muted:     #A0A0A0
- radius:    12–16px  (never pill-shaped except tiny tags)
- font:      Inter (weights 400/500/600/700/800/900). Tight tracking on display sizes.
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
Editorial, cinematic, asymmetric. Big type, strong negative space, thin 1px borders,
dark surfaces, subtle orange glow accents, image-led sections. Think A24 / Vercel / Linear
level polish — not a SaaS dashboard, not a college project.