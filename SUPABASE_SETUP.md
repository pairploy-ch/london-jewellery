# Admin back-office setup (Supabase)

The admin area (`/admin`) lets you view every form submission and its photos.
It needs a Supabase project. Follow these steps once.

## 1. Create a Supabase project

Go to https://supabase.com → create a new project (free tier is fine).

## 2. Run the database schema

Dashboard → **SQL Editor** → New query → paste the contents of
[`supabase/schema.sql`](supabase/schema.sql) → **Run**.

This creates the `submissions` table, row-level security, and the private
`submission-photos` storage bucket.

## 3. Add the keys to `.env.local`

Dashboard → **Project Settings → API**, then fill in `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...        # "anon public" key
SUPABASE_SERVICE_ROLE_KEY=eyJ...            # "service_role" key — SERVER ONLY
```

> The service-role key bypasses all security — keep it server-side only.
> `.env.local` is git-ignored, so it is never committed.

## 4. Create your admin login

Dashboard → **Authentication → Users → Add user**.
Set an email + password and tick **Auto Confirm User**.

That account signs in at **`/admin/login`**.

## 5. Restart and use

Restart `npm run dev`. Then:

- Customers complete the flow at `/begin`; on submit, the record + photos are
  saved to Supabase.
- You sign in at `/admin/login` to see all submissions and open each one to
  view its photographs.

## Notes

- Photos currently upload through the `/api/submit` route. If submissions grow
  large, we can switch to direct-to-storage signed upload URLs.
- The confirmation email (Step 5) is not wired yet — that needs an email
  provider (e.g. Resend) and your email template.
