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

revoke all on function public.is_studio_admin() from public, anon;
grant execute on function public.is_studio_admin() to authenticated;

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique
    check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  title text not null check (char_length(title) between 1 and 120),
  category text not null
    check (category in ('Social', 'Video shoots', 'Editing')),
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
  status text not null default 'draft'
    check (status in ('draft', 'published', 'archived')),
  is_concept boolean not null default true,
  featured boolean not null default false,
  sort_order integer not null default 0 check (sort_order >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists projects_public_order_idx
  on public.projects (status, featured desc, sort_order, created_at desc);

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
  using (status = 'published' or (select public.is_studio_admin()));

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

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'vip-studios-projects',
  'vip-studios-projects',
  true,
  2097152,
  array['image/webp']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Project images are public" on storage.objects;

drop policy if exists "Studio admins upload project images" on storage.objects;
create policy "Studio admins upload project images"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'vip-studios-projects'
    and (storage.foldername(name))[1] = (select auth.uid()::text)
    and (select public.is_studio_admin())
  );

drop policy if exists "Studio admins delete project images" on storage.objects;
create policy "Studio admins delete project images"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'vip-studios-projects'
    and (select public.is_studio_admin())
  );
