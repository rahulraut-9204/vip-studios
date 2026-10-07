# VIP StudioS

A React 19, Vite, JavaScript, and Tailwind CSS website for social strategy, video production and editing, illustrative portfolio concepts, and project enquiries. The identity is a premium black, porcelain and gold content studio, with a visible path from one idea to its possible formats.

## Run locally

```sh
npm install
npm run dev
```

Create a local `.env` from `.env.example` to configure `VITE_PUBLIC_EMAIL` and `VITE_WHATSAPP_NUMBER`. Contact links stay unavailable until real contact details are configured. Never commit `.env.local`.

## Current experience and boundaries

- Routes: home, services, individual service details, filterable work concepts, project concept details, about, and contact.
- The four portfolio projects use stock imagery and are disclosed as illustrative concept studies—not commissioned client work.
- The hero is an interactive visual concept, not a showreel. No approved studio footage, client work or testimonials have been supplied.
- The project brief validates in the browser and opens an email draft for the visitor to review and send. The site does not transmit or store submissions and has no server-side anti-spam service.
- Quote scope, production details, deliverables, review/revision terms and turnaround are confirmed per project; no public rates or outcome guarantees are shown.
- Pune and India-wide service language comes from the supplied brief. Do not add additional location pages without useful, verified local information.
- Analytics event hooks support an existing `gtag` or GTM `dataLayer`; no analytics vendor, pixel, tag manager, booking service or third-party tracking script is installed by default.
- `/studio/admin` is an allowlisted Supabase dashboard for project drafts, publication, image uploads, and archiving. If Supabase is not configured, the public site uses its bundled illustrative concepts.
- Supabase-backed services remain in `src/data/services.js`; the CMS currently manages project work only. The site does not store enquiry submissions.

## Optional Supabase project CMS

1. Create a Supabase project and run `supabase/migrations/202610040001_project_cms.sql` in its SQL editor.
2. Create the administrator account in Supabase Auth. Do not enable public sign-ups for the site.
3. Add that account to the admin allowlist from the SQL editor, replacing the email with the administrator's address:

   ```sql
   insert into public.studio_admins (user_id)
   select id from auth.users where email = 'admin@example.com'
   on conflict (user_id) do nothing;
   ```

4. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in local `.env.local` and the Cloudflare Pages build environment. The anon key is intentionally browser-visible; database RLS is the access boundary. Never put a service-role key in a `VITE_` variable or the client bundle.
5. Visit `/studio/admin` and sign in. Unpublished drafts and archived entries stay private; only published projects are returned to public pages. Images are resized and converted to WebP before being uploaded to the public project-media bucket. Public image access is by asset URL; anonymous Storage listing is not enabled.

The migrations create the admin allowlist, project schema, publication policies, storage policies, and optional media metadata. Add/remove administrator IDs only through the Supabase SQL editor. The existing static concept portfolio remains the local/offline fallback when Supabase credentials are absent. Project pages use a poster-first media flow: YouTube/direct video loads only after an explicit play action, while Instagram opens as an external link.

## Before expanding the public proof

- Replace concept images and descriptions only with approved work and cleared assets.
- Add client names, logos, case studies, testimonials, founder/studio photography, and results only after verification and permission.
- Confirm any service-specific production requirements, formats, handover, revision policy, and location availability before promising them.
- Configure and test public contact values in the Cloudflare Pages environment; keep the values out of source control.
- Do not present audience growth as guaranteed reach, views, followers or other specific outcomes.

Internal competitor research and its source/evidence limitations are in `docs/internal/competitive-ux-audit-2026-10.md`.
