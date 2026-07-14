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

-- 1b) Assessment report fields (added for the PDF report / send-to-client flow)
alter table public.submissions add column if not exists report jsonb;
alter table public.submissions add column if not exists report_sent_at timestamptz;

-- 1c) Metal type submitted with the piece (optional field on the assessment form)
alter table public.submissions add column if not exists metal text;

-- 1d) Sequential, human-friendly reference number (e.g. LJC989-000001) shown
-- to the client in the confirmation email, in the admin back office, and on
-- the PDF assessment report — so a payment can always be matched to an order.
create sequence if not exists public.submissions_reference_seq start 1;

alter table public.submissions add column if not exists reference_number text unique;

create or replace function public.set_submission_reference_number()
returns trigger as $$
begin
  if new.reference_number is null then
    new.reference_number := 'LJC989-' || lpad(nextval('public.submissions_reference_seq')::text, 6, '0');
  end if;
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_submission_reference_number on public.submissions;
create trigger set_submission_reference_number
  before insert on public.submissions
  for each row execute function public.set_submission_reference_number();

-- The submission row is now created as soon as payment succeeds (see
-- /api/checkout-status), keyed by payment_intent_id, and later updated with
-- photo_paths once photos are uploaded — this unique index makes that
-- lookup/insert race-safe (multiple NULLs remain allowed).
create unique index if not exists submissions_payment_intent_id_unique_idx
  on public.submissions (payment_intent_id)
  where payment_intent_id is not null;

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
