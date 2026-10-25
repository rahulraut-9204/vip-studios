# VIP STUDIOS — ADMIN PORTAL & CREDENTIALS SETUP GUIDE

This document provides the exact, step-by-step instructions to configure authentication, database tables, and credentials for the VIP STUDIOS Content Desk (`/admin` and `/studio/admin`).

---

## Architecture Overview

VIP STUDIOS uses **Supabase** for secure authentication and content management:
- **Authentication**: Supabase Auth (Email + Password).
- **Authorization**: Row Level Security (RLS) checked via the `public.is_studio_admin()` database function.
- **Projects Table**: Stores project title, slug, category, format, media URL, image URL, publication status (`draft` / `published` / `archived`), and featured status.
- **Enquiries Table**: Stores incoming client project briefs submitted via `/contact`.
- **Storage Bucket**: `vip-studios-projects` stores compressed WebP project thumbnails.

---

## STEP 1: Set Up Your Supabase Project (If Not Already Created)

1. Go to [https://supabase.com](https://supabase.com) and sign in or create an account.
2. Click **New Project** and name it `vip-studios`.
3. Choose a secure database password and select a region closest to your primary audience.
4. Once your project is ready, navigate to **Project Settings** → **API**.
5. Copy two values:
   - **Project URL** (e.g. `https://xyzcompany.supabase.co`)
   - **Project API Anon Key** (the `anon` public key starting with `ey...`)

---

## STEP 2: Configure Environment Variables

### In Local Development (`.env.local`):
In your local root directory (`d:\Vip Studios\.env.local`), add:
```bash
VITE_PUBLIC_EMAIL=studio@vipstudios.pages.dev
VITE_WHATSAPP_NUMBER=919876543210
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```

### In Cloudflare Pages (Production):
1. Log in to your **Cloudflare Dashboard** → **Workers & Pages** → Select `vip-studios`.
2. Go to **Settings** → **Environment Variables**.
3. Under **Production**, add:
   - `VITE_PUBLIC_EMAIL`: Your studio email address.
   - `VITE_WHATSAPP_NUMBER`: Your WhatsApp phone number (digits only, e.g. `919876543210`).
   - `VITE_SUPABASE_URL`: Your Supabase Project URL.
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase Anon Key.
4. Click **Save and Deploy**.

---

## STEP 3: Run the Database Migrations

Open your **Supabase Dashboard** → **SQL Editor** → **New Query**, and run the SQL statements located in `supabase/migrations/`:

### 1. Run Project CMS Schema (`202610040001_project_cms.sql`):
```sql
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
```
*(Make sure to run the rest of `202610040001_project_cms.sql`, `202610050002_project_media_fields.sql`, `202610090001_category_taxonomy.sql`, and `202610240001_enquiries.sql`)*.

---

## STEP 4: Create and Authorize Your Admin Credentials

### A. Create the Admin User in Supabase Auth
1. In your **Supabase Dashboard**, click on **Authentication** in the left sidebar.
2. Go to **Users** and click **Add user** → **Create user**.
3. Enter:
   - **User Email**: (e.g. `admin@vipstudios.com`)
   - **Password**: (Choose a strong, private password)
   - Toggle **Auto-confirm User?** to **ON** (checked).
4. Click **Create User**.
5. Once created, look at the **User UID** column (it is a UUID like `c56a4180-65aa-42ec-a945-5fd21dec0538`). Copy this UID.

### B. Grant Admin Rights to the User UID
1. In your **Supabase Dashboard**, open the **SQL Editor**.
2. Run this single command (replace `<USER_UID>` with the UID copied from step 5):

```sql
insert into public.studio_admins (user_id)
values ('<USER_UID>');
```

*Example:*
```sql
insert into public.studio_admins (user_id)
values ('c56a4180-65aa-42ec-a945-5fd21dec0538');
```

---

## STEP 5: Create the Media Storage Bucket

To enable thumbnail uploads directly from the `/admin` editor:
1. In your **Supabase Dashboard**, navigate to **Storage**.
2. Click **New Bucket**.
3. Name the bucket: `vip-studios-projects`.
4. Toggle **Public bucket** to **ON** (checked).
5. Click **Save bucket**.

---

## STEP 6: Sign in to the Admin Portal

1. Open your browser and navigate to:
   - Local: `http://localhost:5173/admin`
   - Production: `https://vip-studios.pages.dev/admin`
2. Enter the Email and Password you created in **Step 4A**.
3. Click **Sign in**.
4. You will immediately access:
   - **Projects Manager**: Create, edit, toggle drafts, live-preview cuts, and publish.
   - **Enquiries Inbox**: Review incoming client briefs from `/contact` and update their status (`New`, `Contacted`, `Closed`).
