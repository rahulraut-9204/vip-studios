-- ==============================================================================
-- VIP STUDIOS — CONSOLIDATED SUPABASE DATABASE SETUP
-- Run this entire script in Supabase Dashboard -> SQL Editor -> New query -> Run
-- ==============================================================================

-- 1. Studio Admins Table & Auth Helper
create table if not exists public.studio_admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.studio_admins enable row level security;
revoke all on public.studio_admins from anon, authenticated;

create or replace function public.is_studio_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.studio_admins
    where user_id = (select auth.uid())
  );
$$;

revoke all on function public.is_studio_admin() from public;
grant execute on function public.is_studio_admin() to anon, authenticated;

-- Auto-grant studio admin status to the studio owner email
create or replace function public.handle_new_admin_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if lower(coalesce(new.email, '')) = 'mr.rohit8530@gmail.com' then
    insert into public.studio_admins (user_id)
    values (new.id)
    on conflict (user_id) do nothing;
  end if;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created_admin on auth.users;
create trigger on_auth_user_created_admin
  after insert on auth.users
  for each row execute function public.handle_new_admin_user();

-- In case the user already exists in auth.users:
insert into public.studio_admins (user_id)
select id from auth.users where lower(email) = 'mr.rohit8530@gmail.com'
on conflict (user_id) do nothing;


-- 2. Projects Table with All Media, Video, and Taxonomy Columns
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique
    check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  title text not null check (char_length(title) between 1 and 120),
  category text not null check (
    category in (
      'Video Editing',
      'Reels & Short-form',
      'YouTube',
      'Social Media',
      'Corporate',
      'Other'
    )
  ),
  format text not null check (char_length(format) between 1 and 140),
  year_label text not null default 'Current'
    check (char_length(year_label) <= 32),
  image_url text not null check (image_url ~ '^https://'),
  image_alt text not null check (char_length(image_alt) between 1 and 300),
  image_position text not null default 'center'
    check (char_length(image_position) <= 80),
  accent text not null default 'gold'
    check (accent in ('gold', 'amber', 'silver', 'white')),
  summary text not null check (char_length(summary) between 1 and 3000),
  approach text not null check (char_length(approach) between 1 and 3000),
  platform text not null default 'image'
    check (platform in ('image', 'youtube', 'instagram', 'direct_video')),
  media_type text not null default 'image'
    check (media_type in ('image', 'video')),
  video_url text not null default ''
    check (char_length(video_url) <= 500),
  client_name text not null default ''
    check (char_length(client_name) <= 120),
  role text not null default ''
    check (char_length(role) <= 180),
  result text not null default ''
    check (char_length(result) <= 1000),
  status text not null default 'draft'
    check (status in ('draft', 'published', 'archived')),
  is_concept boolean not null default true,
  featured boolean not null default false,
  sort_order integer not null default 0 check (sort_order >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Index for public queries
create index if not exists projects_public_order_idx
  on public.projects (status, featured desc, sort_order, created_at desc);

-- Projects updated_at trigger
create or replace function public.set_project_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists projects_set_updated_at on public.projects;
create trigger projects_set_updated_at
  before update on public.projects
  for each row execute function public.set_project_updated_at();

alter table public.projects enable row level security;
grant select on public.projects to anon, authenticated;
grant insert, update, delete on public.projects to authenticated;

drop policy if exists "Published projects are public" on public.projects;
create policy "Published projects are public"
  on public.projects for select to anon, authenticated
  using (
    status = 'published'
    or (auth.role() = 'authenticated' and (select public.is_studio_admin()))
  );

drop policy if exists "Studio admins can insert projects" on public.projects;
create policy "Studio admins can insert projects"
  on public.projects for insert to authenticated
  with check ((select public.is_studio_admin()));

drop policy if exists "Studio admins can update projects" on public.projects;
create policy "Studio admins can update projects"
  on public.projects for update to authenticated
  using ((select public.is_studio_admin()))
  with check ((select public.is_studio_admin()));

drop policy if exists "Studio admins can delete projects" on public.projects;
create policy "Studio admins can delete projects"
  on public.projects for delete to authenticated
  using ((select public.is_studio_admin()));


-- 3. Storage Bucket for Project Thumbnails
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'vip-studios-projects',
  'vip-studios-projects',
  true,
  5242880,
  array['image/webp', 'image/jpeg', 'image/png']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Studio admins upload project images" on storage.objects;
create policy "Studio admins upload project images"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'vip-studios-projects'
    and (select public.is_studio_admin())
  );

drop policy if exists "Studio admins delete project images" on storage.objects;
create policy "Studio admins delete project images"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'vip-studios-projects'
    and (select public.is_studio_admin())
  );

drop policy if exists "Project images are public" on storage.objects;
create policy "Project images are public"
  on storage.objects for select to anon, authenticated
  using (bucket_id = 'vip-studios-projects');


-- 4. Public Enquiries Table & Policies
create table if not exists public.enquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 100),
  company text not null default '' check (char_length(company) <= 120),
  email text not null default '' check (char_length(email) <= 254),
  phone text not null default '' check (char_length(phone) <= 30),
  service text not null check (char_length(service) between 1 and 140),
  deadline text not null default '' check (char_length(deadline) <= 100),
  requirements text not null check (char_length(requirements) between 1 and 3000),
  source text not null default 'website' check (source in ('website', 'whatsapp', 'email')),
  status text not null default 'new' check (status in ('new', 'contacted', 'closed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (char_length(email) > 0 or char_length(phone) > 0)
);

create index if not exists enquiries_status_created_idx
  on public.enquiries (status, created_at desc);

create or replace function public.set_enquiry_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists enquiries_set_updated_at on public.enquiries;
create trigger enquiries_set_updated_at
  before update on public.enquiries
  for each row execute function public.set_enquiry_updated_at();

alter table public.enquiries enable row level security;
revoke all on public.enquiries from anon;
grant insert on public.enquiries to anon;
grant select, update on public.enquiries to authenticated;

drop policy if exists "Visitors can submit enquiries" on public.enquiries;
create policy "Visitors can submit enquiries"
  on public.enquiries for insert to anon, authenticated
  with check (
    status = 'new'
    and source = 'website'
  );

drop policy if exists "Studio admins can review enquiries" on public.enquiries;
create policy "Studio admins can review enquiries"
  on public.enquiries for select to authenticated
  using ((select public.is_studio_admin()));

drop policy if exists "Studio admins can update enquiries" on public.enquiries;
create policy "Studio admins can update enquiries"
  on public.enquiries for update to authenticated
  using ((select public.is_studio_admin()))
  with check ((select public.is_studio_admin()));


-- 5. Seed Initial Studio Work Cuts (Published by Default)
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
