import { ArchitectureResult } from "@/components/architecture/architecture-result";
import { SiteNav } from "@/components/layout/site-nav";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function ArchitecturePage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let architecture = null;
  let prompt = "";

  try {
    const supabase = await createClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    // Try to fetch from database if user is logged in
    if (user) {
      const { data } = await supabase
        .from("architectures")
        .select("*")
        .eq("id", id)
        .single();

      if (data) {
        architecture = data.architecture_json;
        prompt = data.prompt;
      }
    }
  } catch {
    // Supabase not configured or error fetching, will fall back to localStorage
  }

  // If not found in database or user not logged in, component will check localStorage
  return <ArchitectureResult generationId={id} serverArchitecture={architecture} serverPrompt={prompt} />;
}
