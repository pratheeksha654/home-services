import { createClient } from "@supabase/supabase-js";

// ── Supabase client ───────────────────────────────────────────────────────────

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ── Legacy fetch helper (kept for backward compatibility) ─────────────────────

export type SupabaseResponse<T> = {
  data: T | null;
  error?: { message?: string } | null;
};

export async function fetchFromSupabase<T>(
  endpoint: string,
  init?: RequestInit
): Promise<T> {
  const response = await fetch(endpoint, {
    ...init,
    headers: {
      Accept: "application/json",
      ...(init?.headers || {}),
    },
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return response.json() as Promise<T>;
}
