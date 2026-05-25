import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

  if (!url || !key || url === "your_supabase_project_url") {
    throw new Error("Supabase is not configured. Please set up your environment variables.");
  }

  return createBrowserClient(url, key);
}
