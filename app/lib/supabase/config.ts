/* shared Supabase configuration flags and constants */

export const PHOTO_BUCKET = "submission-photos";

/** anon/browser auth is usable (admin login + session) */
export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

/** server-side service-role access is usable (insert submissions, upload photos) */
export function isSupabaseAdminConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.SUPABASE_SERVICE_ROLE_KEY,
  );
}

export type ReportResult = "verified" | "unable" | "more_info";

export type ReportData = {
  referenceNumber: string;
  dateOfAssessment: string;
  brand: string;
  itemType: string;
  collection: string;
  material: string;
  serial: string;
  additionalDetails: string;
  result: ReportResult;
  notes: string;
};

export type Submission = {
  id: string;
  created_at: string;
  name: string;
  email: string;
  phone: string | null;
  country: string | null;
  address: string | null;
  brand: string | null;
  item_type: string | null;
  metal: string | null;
  has_gemstones: boolean | null;
  payment_intent_id: string | null;
  payment_status: string | null;
  amount: number | null;
  currency: string | null;
  photo_paths: string[];
  status: string;
  report: ReportData | null;
  report_sent_at: string | null;
};
