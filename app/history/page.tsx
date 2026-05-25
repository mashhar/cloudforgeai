import { ArchitectureHistory } from "@/components/history/architecture-history";
import { SiteNav } from "@/components/layout/site-nav";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function HistoryPage() {
  let user = null;
  let architectures = [];
  let error = undefined;

  try {
    const supabase = await createClient();

    const {
      data: { user: authUser }
    } = await supabase.auth.getUser();
    user = authUser;

    if (!user) {
      redirect("/login?redirect=/history");
    }

    const { data, error: fetchError } = await supabase
      .from("architectures")
      .select("*")
      .order("created_at", { ascending: false });

    architectures = data ?? [];
    error = fetchError?.message;
  } catch (err) {
    error = "Supabase is not configured. Please set up authentication to use history.";
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteNav />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <ArchitectureHistory architectures={architectures} error={error} />
      </main>
    </div>
  );
}
