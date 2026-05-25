import Link from "next/link";
import {
  ArrowRight,
  Boxes,
  CheckCircle2,
  Code2,
  LockKeyhole,
  Network,
  Sparkles,
  WalletCards,
  FileSearch,
  Shield,
  UserCheck,
  Database
} from "lucide-react";
import { Footer } from "@/components/layout/footer";
import { SiteNav } from "@/components/layout/site-nav";
import { Button } from "@/components/ui/button";

// Note: Landing page uses server SiteNav since it's rendered from page.tsx

const features = [
  {
    icon: Network,
    title: "Interactive diagrams",
    description:
      "Generate topology JSON and inspect service relationships with pan, zoom, minimap, and cloud-style nodes."
  },
  {
    icon: Boxes,
    title: "Provider-aware services",
    description:
      "Switch between AWS, Azure, and GCP while keeping recommendations aligned to managed cloud primitives."
  },
  {
    icon: LockKeyhole,
    title: "Security posture",
    description:
      "Receive practical guidance for identity, network segmentation, encryption, audit logging, and workload isolation."
  },
  {
    icon: Code2,
    title: "Terraform starter",
    description:
      "Export a clean infrastructure baseline that engineering teams can evolve into production modules."
  },
  {
    icon: WalletCards,
    title: "Cost ranges",
    description:
      "Model expected monthly spend by architecture scale before committing to a deployment plan."
  },
  {
    icon: CheckCircle2,
    title: "Deployment checklist",
    description:
      "Move from concept to rollout with environment, observability, load testing, and release-readiness steps."
  }
];

export function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteNav />
      <main>
        <section className="relative overflow-hidden border-b border-border">
          <div className="absolute inset-0 grid-surface opacity-60" />
          <div className="absolute inset-x-0 top-0 h-80 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)/0.28),transparent_34%),radial-gradient(circle_at_76%_18%,hsl(var(--accent)/0.22),transparent_32%)]" />
          <div className="relative mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[0.92fr_1.08fr] lg:px-8">
            <div className="max-w-3xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-background/80 px-3 py-1 text-sm text-muted-foreground shadow-sm backdrop-blur">
                <Sparkles className="h-4 w-4 text-primary" />
                AI cloud architecture generator
              </div>
              <h1 className="text-4xl font-semibold tracking-normal text-foreground sm:text-6xl">
                CloudForge AI
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
                Turn natural language into scalable cloud system designs,
                interactive diagrams, security recommendations, Terraform
                starters, and deployment guidance.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg">
                  <Link href="/dashboard">
                    Generate Architecture <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <a href="#features">Explore features</a>
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="rounded-2xl border border-border bg-card/88 p-4 shadow-soft backdrop-blur">
                <div className="mb-4 flex items-center justify-between border-b border-border pb-3">
                  <div>
                    <p className="text-sm font-medium">Netflix-like AWS topology</p>
                    <p className="text-xs text-muted-foreground">5M users · Hyperscale</p>
                  </div>
                  <span className="rounded-full bg-accent/15 px-3 py-1 text-xs font-medium text-accent">
                    Generated
                  </span>
                </div>
                <div className="grid-surface relative min-h-[430px] overflow-hidden rounded-xl border border-border bg-background/70 p-5">
                  <PreviewNode className="left-[4%] top-[12%]" title="Route 53 + WAF" />
                  <PreviewNode className="left-[32%] top-[8%]" title="CloudFront" tone="accent" />
                  <PreviewNode className="left-[64%] top-[18%]" title="S3 Media" />
                  <PreviewNode className="left-[22%] top-[42%]" title="API Gateway" />
                  <PreviewNode className="left-[56%] top-[44%]" title="EKS Services" tone="accent" />
                  <PreviewNode className="left-[13%] top-[72%]" title="Cognito" />
                  <PreviewNode className="left-[48%] top-[74%]" title="Aurora Global" />
                  <PreviewNode className="left-[72%] top-[70%]" title="CloudWatch" />
                  <div className="absolute inset-0 bg-[linear-gradient(120deg,transparent,transparent_42%,hsl(var(--primary)/0.08)_50%,transparent_58%,transparent)]" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
              Production workflow
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-normal sm:text-4xl">
              From prompt to reference architecture in one flow.
            </h2>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl border border-border bg-card p-6 shadow-sm"
              >
                <feature.icon className="h-6 w-6 text-primary" />
                <h3 className="mt-5 text-lg font-semibold">{feature.title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section id="workflow" className="border-y border-border bg-secondary/35">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 py-20 sm:px-6 lg:grid-cols-3 lg:px-8">
            {["Describe", "Generate", "Deploy"].map((step, index) => (
              <div key={step}>
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-sm font-semibold text-primary-foreground">
                  {index + 1}
                </span>
                <h3 className="mt-5 text-xl font-semibold">{step}</h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {index === 0
                    ? "Enter a product idea, scale target, and cloud provider."
                    : index === 1
                      ? "Review diagrams, service selections, risk controls, and cost estimates."
                      : "Use the checklist and Terraform starter as an implementation baseline."}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section id="security" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
              Security & Privacy
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-normal sm:text-4xl">
              Built with security at the core.
            </h2>
            <p className="mt-4 text-sm leading-6 text-muted-foreground">
              Your architectures and data are protected with enterprise-grade security features,
              while our AI generates security-hardened designs with best practices built in.
            </p>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <UserCheck className="h-6 w-6 text-primary" />
              <h3 className="mt-5 text-lg font-semibold">Secure Authentication</h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                OAuth and email authentication with session management, HTTP-only cookies, and automatic refresh for protected routes.
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <Database className="h-6 w-6 text-primary" />
              <h3 className="mt-5 text-lg font-semibold">Data Isolation</h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                Row Level Security policies ensure complete data isolation—users can only access their own architectures and reviews.
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <Shield className="h-6 w-6 text-primary" />
              <h3 className="mt-5 text-lg font-semibold">Security Guidance</h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                AI-generated recommendations for identity management, encryption, network segmentation, audit logging, and workload isolation.
              </p>
            </div>
          </div>
        </section>

        <section id="review" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-border bg-card p-8 shadow-soft sm:p-10">
            <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-background/80 px-3 py-1 text-sm text-muted-foreground shadow-sm backdrop-blur">
                  <FileSearch className="h-4 w-4 text-primary" />
                  AI-powered analysis
                </div>
                <h2 className="text-3xl font-semibold tracking-normal">
                  Review Architecture
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
                  Upload existing architectures (JSON, Terraform, or diagrams)
                  and get AI-powered analysis with security findings, scalability
                  recommendations, and modernization roadmaps.
                </p>
              </div>
              <Button asChild size="lg" variant="outline">
                <Link href="/review">
                  Review Architecture <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function PreviewNode({
  title,
  tone = "primary",
  className
}: {
  title: string;
  tone?: "primary" | "accent";
  className?: string;
}) {
  return (
    <div
      className={`absolute z-10 min-w-28 rounded-xl border border-border bg-card px-3 py-2 text-xs font-medium shadow-sm ${className}`}
    >
      <span
        className={`mr-2 inline-flex h-2 w-2 rounded-full ${
          tone === "accent" ? "bg-accent" : "bg-primary"
        }`}
      />
      {title}
    </div>
  );
}
