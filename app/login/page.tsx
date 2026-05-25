import { Suspense } from "react";
import { LoginForm } from "@/components/auth/login-form";
import { SiteNav } from "@/components/layout/site-nav";
import { Skeleton } from "@/components/ui/skeleton";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteNav />
      <main className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md items-center px-4 py-12">
        <Suspense fallback={<Skeleton className="h-96 w-full" />}>
          <LoginForm />
        </Suspense>
      </main>
    </div>
  );
}
