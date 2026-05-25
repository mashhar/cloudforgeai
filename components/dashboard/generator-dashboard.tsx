"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  Loader2,
  Search,
  Sparkles,
  Wand2,
  FileText
} from "lucide-react";
import { motion } from "framer-motion";
import { SiteNavClient } from "@/components/layout/site-nav-client";
import { useUser } from "@/hooks/use-user";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { TemplatesGallery } from "@/components/templates/templates-gallery";
import { OnboardingTour } from "@/components/onboarding/onboarding-tour";
import { AIResponseLoader } from "@/components/ui/typing-animation";
import { RecentGenerationsTable } from "@/components/dashboard/recent-generations-table";
import type { ArchitectureTemplate } from "@/lib/templates";
import { GEMINI_MODELS } from "@/lib/gemini";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import type {
  ArchitectureResponse,
  ArchitectureScale,
  CloudProvider,
  StoredGeneration
} from "@/types/architecture";

const promptExample =
  "Create a scalable Netflix-like streaming architecture on AWS for 5 million users.";

const progressMessages = [
  "Structuring cloud requirements",
  "Consulting Gemini AI architect",
  "Validating generated topology JSON",
  "Preparing diagram and deployment plan"
];

export function GeneratorDashboard() {
  const router = useRouter();
  const { user } = useUser();
  const [prompt, setPrompt] = useState(promptExample);
  const [cloudProvider, setCloudProvider] = useState<CloudProvider>("AWS");
  const [scale, setScale] = useState<ArchitectureScale>("Enterprise");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progressStep, setProgressStep] = useState(0);
  const [templatesOpen, setTemplatesOpen] = useState(false);
  const [currentModel, setCurrentModel] = useState<string>(GEMINI_MODELS[0]);

  useEffect(() => {
    const handleOpenTemplates = () => setTemplatesOpen(true);
    window.addEventListener("open-templates", handleOpenTemplates);
    return () => window.removeEventListener("open-templates", handleOpenTemplates);
  }, []);

  const handleSelectTemplate = (template: ArchitectureTemplate) => {
    setPrompt(template.prompt);
    setCloudProvider(template.cloudProvider);
    setScale(template.scale);
    toast.success(`Template "${template.title}" loaded!`);
  };

  async function onGenerate() {
    setError(null);
    setIsGenerating(true);
    setProgressStep(0);

    const progressTimer = window.setInterval(() => {
      setProgressStep((current) =>
        Math.min(current + 1, progressMessages.length - 1)
      );
    }, 1800);

    let currentModelIndex = 0;
    setCurrentModel(GEMINI_MODELS[currentModelIndex]);

    try {
      // Try each model in sequence
      for (let i = 0; i < GEMINI_MODELS.length; i++) {
        currentModelIndex = i;
        const model = GEMINI_MODELS[i];
        setCurrentModel(model);

        try {
          const response = await fetch("/api/generate-architecture", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt, cloudProvider, scale, model })
          });

          const payload = (await response.json()) as {
            architecture?: ArchitectureResponse;
            savedId?: string;
            modelUsed?: string;
            error?: string;
          };

          if (!response.ok || !payload.architecture) {
            // Check if it's a provider error
            const errorMessage = payload.error ?? "Generation failed.";
            const isProviderError = errorMessage.toLowerCase().includes("provider returned error") ||
                                    errorMessage.toLowerCase().includes("provider error") ||
                                    response.status === 502 ||
                                    response.status === 503;

            if (isProviderError && i < GEMINI_MODELS.length - 1) {
              // Try next model
              toast.error(`${model} failed. Trying next model...`);
              continue;
            }

            // If it's not a provider error or we're on the last model, throw
            throw new Error(errorMessage);
          }

          // Success! Update the current model to the one that actually worked
          if (payload.modelUsed) {
            setCurrentModel(payload.modelUsed);
          }

          // Use savedId from database if available, otherwise generate UUID for localStorage
          const id = payload.savedId ?? crypto.randomUUID();

          // Still persist to localStorage for backwards compatibility
          const generation: StoredGeneration = {
            id,
            prompt,
            timestamp: Date.now(),
            architecture: payload.architecture
          };
          persistGeneration(generation);
          toast.success(`Architecture generated using ${payload.modelUsed ?? model}.`);
          router.push(`/architecture/${id}`);
          return; // Success, exit function
        } catch (caught) {
          // If this is the last model, throw the error
          if (i === GEMINI_MODELS.length - 1) {
            throw caught;
          }
          // Otherwise continue to next model
          const message = caught instanceof Error ? caught.message : "Unknown error";
          toast.error(`${model} failed. Trying next model...`);
        }
      }

      // If we get here, all models failed
      throw new Error("All models failed to generate architecture.");

    } catch (caught) {
      const message =
        caught instanceof Error
          ? caught.message
          : "Unable to generate architecture.";
      setError(message);
      toast.error(message);
    } finally {
      window.clearInterval(progressTimer);
      setIsGenerating(false);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteNavClient user={user} />
      <TemplatesGallery
        open={templatesOpen}
        onClose={() => setTemplatesOpen(false)}
        onSelectTemplate={handleSelectTemplate}
      />
      <OnboardingTour />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header Section with Review Card */}
        <section className="space-y-6 mb-6">
          <div className="grid lg:grid-cols-[1fr_340px] gap-6">
            {/* Left: Header Text */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center gap-2 text-sm font-medium text-primary">
                <Sparkles className="h-4 w-4" />
                Architecture generator
              </div>
              <h1 className="mt-3 text-3xl font-semibold tracking-normal sm:text-4xl gradient-text">
                Describe the system you want to build.
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
                CloudForge AI will create a reference architecture, service map,
                security guidance, Terraform starter, and deployment checklist.
              </p>
            </motion.div>

            {/* Right: Architecture Review Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="lg:mt-0"
            >
              <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 dark:border-blue-800 h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Search className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    Architecture Review
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-6 text-gray-700 dark:text-gray-300 mb-4">
                    Already have an architecture? Upload diagrams, JSON, or Terraform files for AI-powered analysis.
                  </p>
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/review">
                      Review Architecture
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>

        <section className="space-y-6">

          {/* Templates Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Button
              onClick={() => setTemplatesOpen(true)}
              variant="outline"
              className="w-full sm:w-auto glass-effect hover-lift"
            >
              <FileText className="h-4 w-4 mr-2" />
              Browse Templates
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Generation prompt</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="prompt">Architecture brief</Label>
                <Textarea
                  id="prompt"
                  value={prompt}
                  onChange={(event) => setPrompt(event.target.value)}
                  placeholder="Describe product, users, regions, compliance requirements, and traffic patterns."
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Cloud provider</Label>
                  <Select
                    value={cloudProvider}
                    onValueChange={(value) =>
                      setCloudProvider(value as CloudProvider)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select provider" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AWS">AWS</SelectItem>
                      <SelectItem value="Azure">Azure</SelectItem>
                      <SelectItem value="GCP">GCP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Architecture scale</Label>
                  <Select
                    value={scale}
                    onValueChange={(value) =>
                      setScale(value as ArchitectureScale)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select scale" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Startup">Startup</SelectItem>
                      <SelectItem value="Enterprise">Enterprise</SelectItem>
                      <SelectItem value="Hyperscale">Hyperscale</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {error ? (
                <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                  {error}
                </div>
              ) : null}

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs leading-5 text-muted-foreground">
                  Using model <code className="px-1.5 py-0.5 bg-muted rounded text-xs">{currentModel}</code> for generating.
                </p>
                <Button
                  onClick={onGenerate}
                  disabled={isGenerating || prompt.trim().length < 10}
                  size="lg"
                >
                  {isGenerating ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Wand2 className="h-4 w-4" />
                  )}
                  Generate
                </Button>
              </div>
            </CardContent>
          </Card>
          </motion.div>

          {isGenerating ? (
            <LoadingPreview
              message={progressMessages[progressStep]}
            />
          ) : null}

          {/* Recent Generations Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <RecentGenerationsTable userId={user?.id} />
          </motion.div>
        </section>
      </main>
    </div>
  );
}

function LoadingPreview({ message }: { message: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card className="glass-effect">
        <CardContent className="p-6">
          <div className="mb-5">
            <AIResponseLoader stage={message} />
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function persistGeneration(generation: StoredGeneration) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    const current = JSON.parse(window.localStorage.getItem("cloudforge.generations") ?? "[]");
    window.localStorage.setItem(
      "cloudforge.generations",
      JSON.stringify([generation, ...current].slice(0, 12))
    );
  } catch (error) {
    console.error("Failed to persist generation:", error);
  }
}
