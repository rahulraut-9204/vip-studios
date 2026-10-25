-- Public project enquiries are write-only for anonymous visitors.
-- Studio admins can review and update status after signing in.
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
