"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  CheckCircle2,
  Clipboard,
  Download,
  LockKeyhole,
  Server,
  ShieldCheck,
  WalletCards
} from "lucide-react";
import { ArchitectureDiagram } from "@/components/architecture/architecture-diagram";
import { ExportMenu } from "@/components/architecture/export-menu";
import { SiteNavClient } from "@/components/layout/site-nav-client";
import { useUser } from "@/hooks/use-user";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  exportArchitectureAsJson,
  exportArchitectureAsPdf,
  exportDiagramAsPng,
  exportTerraformAsTf
} from "@/lib/export-utils";
import type { StoredGeneration } from "@/types/architecture";

export function ArchitectureResult({
  generationId,
  serverArchitecture,
  serverPrompt
}: {
  generationId: string;
  serverArchitecture?: any;
  serverPrompt?: string;
}) {
  const { user } = useUser();
  const [generation, setGeneration] = useState<StoredGeneration | null>(
    serverArchitecture
      ? {
          id: generationId,
          architecture: serverArchitecture,
          prompt: serverPrompt ?? "",
          timestamp: Date.now()
        }
      : null
  );
  const [loaded, setLoaded] = useState(!!serverArchitecture);
  const [copied, setCopied] = useState(false);
  const diagramRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Skip if we already have server data
    if (serverArchitecture) return;

    try {
      const items = JSON.parse(
        window.localStorage.getItem("cloudforge.generations") ?? "[]"
      ) as StoredGeneration[];
      setGeneration(items.find((item) => item.id === generationId) ?? null);
    } catch {
      setGeneration(null);
    } finally {
      setLoaded(true);
    }
  }, [generationId, serverArchitecture]);

  const architecture = generation?.architecture;
  const exportedJson = useMemo(
    () => (architecture ? JSON.stringify(architecture, null, 2) : ""),
    [architecture]
  );

  const fileName = useMemo(
    () => architecture?.title.toLowerCase().replaceAll(" ", "-") ?? "architecture",
    [architecture]
  );

  if (!loaded) {
    return (
      <div className="min-h-screen bg-background">
        <SiteNavClient user={user} />
        <main className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
          <Skeleton className="h-10 w-72" />
          <Skeleton className="h-[560px] w-full" />
        </main>
      </div>
    );
  }

  if (!architecture) {
    return (
      <div className="min-h-screen bg-background">
        <SiteNavClient user={user} />
        <main className="mx-auto flex min-h-[70vh] max-w-2xl items-center px-4 sm:px-6">
          <Card>
            <CardHeader>
              <CardTitle>Architecture not found</CardTitle>
              <CardDescription>
                This generation is stored in your browser. It may have been
                cleared or created in another browser session.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link href="/dashboard">Create a new architecture</Link>
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  function handleExportJson() {
    if (!architecture) return;
    try {
      exportArchitectureAsJson(architecture, fileName);
      toast.success("Architecture JSON exported.");
    } catch {
      toast.error("Unable to export JSON.");
    }
  }

  function handleExportPdf() {
    if (!architecture) return;
    try {
      exportArchitectureAsPdf(architecture, fileName);
      toast.success("Architecture PDF exported.");
    } catch {
      toast.error("Unable to export PDF.");
    }
  }

  function handleExportTerraform() {
    if (!architecture) return;
    try {
      exportTerraformAsTf(architecture, fileName);
      toast.success("Terraform template exported.");
    } catch {
      toast.error("Unable to export Terraform.");
    }
  }

  async function handleExportPng() {
    if (!diagramRef.current || !architecture) return;

    try {
      await exportDiagramAsPng(diagramRef.current, fileName);
      toast.success("Diagram PNG exported.");
    } catch {
      toast.error("Unable to export diagram image.");
    }
  }

  async function copyTerraform() {
    if (!architecture) return;
    await navigator.clipboard.writeText(architecture.terraformTemplate);
    setCopied(true);
    toast.success("Terraform copied.");
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteNavClient user={user} />
      <main className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Button asChild variant="ghost" size="sm" className="mb-4 -ml-3">
              <Link href="/dashboard">
                <ArrowLeft className="h-4 w-4" />
                Back to generator
              </Link>
            </Button>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                {architecture.cloudProvider}
              </span>
              <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
                {architecture.scale}
              </span>
            </div>
            <h1 className="mt-4 text-3xl font-semibold tracking-normal sm:text-4xl">
              {architecture.title}
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">
              {architecture.summary}
            </p>
          </div>
          <div className="flex gap-2">
            <ExportMenu
              architecture={architecture}
              onExportPng={handleExportPng}
              onExportPdf={handleExportPdf}
              onExportTerraform={handleExportTerraform}
              onExportJson={handleExportJson}
            />
            <Button variant="outline" onClick={copyTerraform}>
              <Clipboard className="h-4 w-4" />
              {copied ? "Copied" : "Copy Terraform"}
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Interactive architecture diagram</CardTitle>
            <CardDescription>
              Auto-laid out from generated service and connection JSON.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div ref={diagramRef}>
              <ArchitectureDiagram architecture={architecture} />
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
          <section className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Server className="h-5 w-5 text-primary" />
                  Cloud services
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2">
                {architecture.services.map((service) => (
                  <div
                    key={service.id}
                    className="rounded-2xl border border-border bg-background p-4"
                  >
                    <p className="text-sm font-semibold">{service.name}</p>
                    <p className="mt-1 text-xs font-medium text-primary">
                      {service.category}
                    </p>
                    <p className="mt-3 text-sm leading-6 text-muted-foreground">
                      {service.description}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="h-5 w-5 text-primary" />
                  Terraform starter template
                </CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="max-h-[520px] overflow-auto rounded-2xl border border-border bg-slate-950 p-5 text-sm leading-6 text-slate-100">
                  <code>{architecture.terraformTemplate}</code>
                </pre>
              </CardContent>
            </Card>
          </section>

          <aside className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <WalletCards className="h-5 w-5 text-primary" />
                  Cost estimate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-semibold">
                  {architecture.estimatedCost}
                </p>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  Directional estimate based on selected scale. Validate with
                  provider calculators before procurement.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LockKeyhole className="h-5 w-5 text-primary" />
                  Security recommendations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {architecture.securityRecommendations.map((item) => (
                  <ListItem key={item} icon={ShieldCheck} text={item} />
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Deployment checklist</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {architecture.deploymentChecklist.map((item) => (
                  <ListItem key={item} icon={CheckCircle2} text={item} />
                ))}
              </CardContent>
            </Card>
          </aside>
        </div>
      </main>
    </div>
  );
}

function ListItem({
  icon: Icon,
  text
}: {
  icon: typeof CheckCircle2;
  text: string;
}) {
  return (
    <div className="flex gap-3 rounded-xl border border-border bg-background p-3">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
      <p className="text-sm leading-6 text-muted-foreground">{text}</p>
    </div>
  );
}
