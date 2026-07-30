import { createClient } from "@supabase/supabase-js";

/* Browser-side Supabase client — anon key only, used to upload photos
   directly to Storage via signed upload URLs (bypasses our own serverless
   function, which has a hard ~4.5MB request body limit on Vercel). */
export function createBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return createClient(url, key);
}
