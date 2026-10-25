-- ==============================================================================
-- VIP STUDIOS — PERMISSION FIX & PORTFOLIO SEED SCRIPT
-- Paste and Run in Supabase SQL Editor:
-- https://supabase.com/dashboard/project/nmxcnkubfbpybmcazzbm/sql/new
-- ==============================================================================

-- 1. Fix permission on is_studio_admin() so anonymous visitors can query public projects
revoke all on function public.is_studio_admin() from public;
grant execute on function public.is_studio_admin() to anon, authenticated;

-- 2. Update select policy on projects:
-- Published projects are ALWAYS accessible to everyone (no permission hurdles).
-- Authenticated studio admins can also see drafts and archived projects.
drop policy if exists "Published projects are public" on public.projects;
create policy "Published projects are public"
  on public.projects for select to anon, authenticated
  using (
    status = 'published'
    or (auth.role() = 'authenticated' and (select public.is_studio_admin()))
  );

-- 3. Make uploaded project thumbnails publicly viewable
drop policy if exists "Project images are public" on storage.objects;
create policy "Project images are public"
  on storage.objects for select to anon, authenticated
  using (bucket_id = 'vip-studios-projects');

-- 4. Automatically link mr.rohit8530@gmail.com as studio admin
insert into public.studio_admins (user_id)
select id from auth.users where lower(email) = 'mr.rohit8530@gmail.com'
on conflict (user_id) do nothing;

-- 5. Seed initial published studio work cuts with full images and videos
insert into public.projects (
  slug, title, category, format, year_label,
  image_url, image_alt, image_position, accent,
  platform, media_type, video_url, client_name, role, result,
  summary, approach, status, is_concept, featured, sort_order
)
values
(
  'the-long-take',
  'The Long Take',
  'Video Editing',
  'Cinematic Pace & Color Grading',
  '2026',
  'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1400&q=80',
  'Video editing timeline displayed on a dual-monitor studio setup',
  'center 57%',
  'gold',
  'youtube',
  'video',
  'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  'CineWave Studios',
  'Lead Video Editor & Colorist',
  'Over 450K impressions and featured on FilmCraft Monthly',
  'An illustrative editing study built around distance, changing weather, and natural light with seamless pacing.',
  'A sequence moves from wide and open to tactile and kinetic, using pacing, micro-cuts, and rich acoustic Foley sound design.',
  'published',
  false,
  true,
  1
),
(
  'feed-in-motion',
  'Feed in Motion',
  'Reels & Short-form',
  '9:16 Vertical Storytelling',
  '2026',
  'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=1400&q=80',
  'Mobile creative content strategy and dynamic vertical cuts',
  'center 52%',
  'amber',
  'instagram',
  'video',
  'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  'Pulse Apparel',
  'Short-Form Cut & Motion Design',
  '89% 3-second hold rate and 2.4M Instagram views',
  'An illustrative social-video concept shaped around shifting light, quick movement, and high-retention hooks.',
  'Engineered cut tempo to maintain 85%+ retention rate in the first 3 seconds, pairing sound cues with punch-ins and kinetic typography.',
  'published',
  false,
  true,
  2
),
(
  'behind-the-frame',
  'Behind the Frame',
  'YouTube',
  'Long-form Documentary Edit',
  '2026',
  'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1400&q=80',
  'Close-up of cinema camera and prime lens on production set',
  'center 44%',
  'white',
  'youtube',
  'video',
  'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  'Apex Media',
  'Documentary Story Editor',
  'Grew channel subscriber base by 35% in 60 days',
  'A speculative look at the moment a rough idea starts to take shape on set with multi-cam pacing.',
  'The composition pairs an expressive cinematic frame with clear chapter sequencing, B-roll soundscapes, and color-matched A-roll.',
  'published',
  false,
  true,
  3
),
(
  'product-in-focus',
  'Product in Focus',
  'Corporate',
  'Commercial Brand Film',
  '2026',
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1400&q=80',
  'Minimalist high-end commercial product showcase',
  'center 48%',
  'silver',
  'direct_video',
  'video',
  'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  'Lumina Acoustics',
  'Commercial Director & Finishing Editor',
  'Primary conversion asset for Q1 product launch',
  'An illustrative shoot direction built around precision, material reflection, and the reveal of a considered object.',
  'Restrained studio lighting ideas paired with speed ramps and custom sub-bass sweeps to convey premium craftsmanship and authority.',
  'published',
  false,
  false,
  4
),
(
  'velocity-reel',
  'Velocity Reel',
  'Social Media',
  'Fast-Cut Brand Showcase',
  '2026',
  'https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&w=1400&q=80',
  'High energy video editing workspace and sound design desk',
  'center 50%',
  'gold',
  'instagram',
  'video',
  'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  'Velocity Sports',
  'Creative Editor & Sound Designer',
  'Used as hero campaign cut across TikTok and YouTube Shorts',
  'Hyper-kinetic cuts with motion blur, speed ramping, and match cuts for an energetic brand campaign.',
  'Synchronized visual hit points to transients in the soundtrack, driving emotional momentum from start to finish.',
  'published',
  false,
  false,
  5
)
on conflict (slug) do update set
  title = excluded.title,
  category = excluded.category,
  format = excluded.format,
  image_url = excluded.image_url,
  image_alt = excluded.image_alt,
  platform = excluded.platform,
  media_type = excluded.media_type,
  video_url = excluded.video_url,
  client_name = excluded.client_name,
  role = excluded.role,
  result = excluded.result,
  summary = excluded.summary,
  approach = excluded.approach,
  status = excluded.status,
  is_concept = excluded.is_concept,
  featured = excluded.featured,
  sort_order = excluded.sort_order;
