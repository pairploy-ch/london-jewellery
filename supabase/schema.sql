-- London Jewellery Consult — admin back-office schema
-- Run this in the Supabase SQL editor (Dashboard → SQL → New query).

-- 1) Submissions table -------------------------------------------------------
create table if not exists public.submissions (
  id                uuid primary key default gen_random_uuid(),
  created_at        timestamptz not null default now(),
  name              text not null,
  email             text not null,
  phone             text,
  country           text,
  address           text,
  brand             text,
  item_type         text,
  has_gemstones     boolean,
  payment_intent_id text,
  payment_status    text,
  amount            integer,
  currency          text,
  photo_paths       text[] not null default '{}',
  status            text not null default 'new'  -- new | in_review | complete
);

create index if not exists submissions_created_at_idx
  on public.submissions (created_at desc);

-- 2) Row Level Security ------------------------------------------------------
-- Public visitors never read/write directly. Inserts + uploads happen on the
-- server with the service-role key (which bypasses RLS). Signed-in admins may
-- read and update via the authenticated session.
alter table public.submissions enable row level security;

drop policy if exists "admins read submissions" on public.submissions;
create policy "admins read submissions"
  on public.submissions for select
  to authenticated
  using (true);

drop policy if exists "admins update submissions" on public.submissions;
create policy "admins update submissions"
  on public.submissions for update
  to authenticated
  using (true)
  with check (true);

-- 3) Private storage bucket for submitted photos -----------------------------
insert into storage.buckets (id, name, public)
values ('submission-photos', 'submission-photos', false)
on conflict (id) do nothing;

-- Signed-in admins may read objects in the bucket (service-role uploads bypass).
drop policy if exists "admins read submission photos" on storage.objects;
create policy "admins read submission photos"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'submission-photos');

-- 4) Create your admin user --------------------------------------------------
-- Dashboard → Authentication → Users → "Add user" (set email + password,
-- and tick "Auto Confirm User"). That account can then sign in at /admin/login.
