alter table public.projects
  add column if not exists platform text not null default 'image',
  add column if not exists media_type text not null default 'image',
  add column if not exists video_url text not null default '',
  add column if not exists client_name text not null default '',
  add column if not exists role text not null default '',
  add column if not exists result text not null default '';

alter table public.projects
  drop constraint if exists projects_platform_check;

alter table public.projects
  add constraint projects_platform_check
  check (platform in ('image', 'youtube', 'instagram', 'direct_video'));

alter table public.projects
  drop constraint if exists projects_media_type_check;

alter table public.projects
  add constraint projects_media_type_check
  check (media_type in ('image', 'video'));

alter table public.projects
  drop constraint if exists projects_video_url_check;

alter table public.projects
  add constraint projects_video_url_check
  check (char_length(video_url) <= 500);

alter table public.projects
  drop constraint if exists projects_client_name_check;

alter table public.projects
  add constraint projects_client_name_check
  check (char_length(client_name) <= 120);

alter table public.projects
  drop constraint if exists projects_role_check;

alter table public.projects
  add constraint projects_role_check
  check (char_length(role) <= 180);

alter table public.projects
  drop constraint if exists projects_result_check;

alter table public.projects
  add constraint projects_result_check
  check (char_length(result) <= 1000);
