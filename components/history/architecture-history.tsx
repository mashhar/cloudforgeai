"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Archive, Calendar, Cloud, Layers, Trash2, Search, Filter } from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/types/database";

type Architecture = Database["public"]["Tables"]["architectures"]["Row"];

interface ArchitectureHistoryProps {
  architectures: Architecture[];
  error?: string;
}

export function ArchitectureHistory({
  architectures: initialArchitectures,
  error
}: ArchitectureHistoryProps) {
  const [architectures, setArchitectures] = useState(initialArchitectures);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterProvider, setFilterProvider] = useState<string>("all");
  const [filterScale, setFilterScale] = useState<string>("all");

  const filteredArchitectures = useMemo(() => {
    return architectures.filter((arch) => {
      const matchesSearch =
        searchQuery === "" ||
        arch.architecture_json.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        arch.prompt.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesProvider =
        filterProvider === "all" || arch.cloud_provider === filterProvider;

      const matchesScale = filterScale === "all" || arch.scale === filterScale;

      return matchesSearch && matchesProvider && matchesScale;
    });
  }, [architectures, searchQuery, filterProvider, filterScale]);

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this architecture?")) {
      return;
    }

    setDeletingId(id);

    try {
      const supabase = createClient();
      const { error } = await supabase.from("architectures").delete().eq("id", id);

      if (error) throw error;

      setArchitectures((prev) => prev.filter((arch) => arch.id !== id));
      toast.success("Architecture deleted");
    } catch (error) {
      toast.error("Failed to delete architecture");
      console.error(error);
    } finally {
      setDeletingId(null);
    }
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error loading history</CardTitle>
          <CardDescription>{error}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (architectures.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Archive className="h-5 w-5" />
            Architecture History
          </CardTitle>
          <CardDescription>
            Your saved architecture designs will appear here
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Cloud className="h-12 w-12 text-muted-foreground/50" />
            <p className="mt-4 text-sm text-muted-foreground">
              No architectures yet. Create your first one!
            </p>
            <Button asChild className="mt-6">
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-normal">Architecture History</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          View and manage your saved architecture designs
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search architectures..."
            className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <div className="flex gap-2">
          <select
            value={filterProvider}
            onChange={(e) => setFilterProvider(e.target.value)}
            className="px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="all">All Providers</option>
            <option value="AWS">AWS</option>
            <option value="Azure">Azure</option>
            <option value="GCP">GCP</option>
          </select>

          <select
            value={filterScale}
            onChange={(e) => setFilterScale(e.target.value)}
            className="px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="all">All Scales</option>
            <option value="Startup">Startup</option>
            <option value="Enterprise">Enterprise</option>
            <option value="Hyperscale">Hyperscale</option>
          </select>
        </div>
      </div>

      {filteredArchitectures.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Filter className="h-12 w-12 mx-auto text-muted-foreground/50" />
            <p className="mt-4 text-sm text-muted-foreground">
              No architectures match your filters
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredArchitectures.map((architecture, index) => (
            <motion.div
              key={architecture.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
          <Card key={architecture.id} className="flex flex-col">
            <CardHeader>
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="line-clamp-2 text-base">
                  {architecture.architecture_json.title}
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(architecture.id)}
                  disabled={deletingId === architecture.id}
                  className="shrink-0"
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
              <CardDescription className="line-clamp-2">
                {architecture.prompt}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col justify-between gap-4">
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Cloud className="h-4 w-4" />
                  {architecture.cloud_provider}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Layers className="h-4 w-4" />
                  {architecture.scale}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  {formatDistanceToNow(new Date(architecture.created_at), {
                    addSuffix: true
                  })}
                </div>
              </div>
              <Button asChild className="w-full">
                <Link href={`/architecture/${architecture.id}`}>View Details</Link>
              </Button>
            </CardContent>
          </Card>
            </motion.div>
        ))}
      </div>
      )}
    </div>
  );
}
