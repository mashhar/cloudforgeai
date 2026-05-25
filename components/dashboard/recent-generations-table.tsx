"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Cloud, Layers, Calendar, Trash2, Eye, ChevronLeft, ChevronRight } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/types/database";

type Architecture = Database["public"]["Tables"]["architectures"]["Row"];

interface RecentGenerationsTableProps {
  userId?: string;
}

export function RecentGenerationsTable({ userId }: RecentGenerationsTableProps) {
  const [architectures, setArchitectures] = useState<Architecture[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    if (userId) {
      fetchArchitectures();
    } else {
      setLoading(false);
    }
  }, [userId]);

  async function fetchArchitectures() {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("architectures")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      setArchitectures(data || []);
    } catch (error) {
      console.error("Failed to fetch architectures:", error);
      toast.error("Failed to load architectures");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) {
      return;
    }

    setDeletingId(id);

    try {
      const supabase = createClient();
      const { error } = await supabase.from("architectures").delete().eq("id", id);

      if (error) throw error;

      setArchitectures((prev) => prev.filter((arch) => arch.id !== id));
      toast.success("Architecture deleted");

      // Adjust page if needed
      const totalPages = Math.ceil((architectures.length - 1) / itemsPerPage);
      if (currentPage > totalPages && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    } catch (error) {
      toast.error("Failed to delete architecture");
      console.error(error);
    } finally {
      setDeletingId(null);
    }
  }

  if (!userId) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Generations</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-8">
            Sign in to view your architecture history
          </p>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Generations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (architectures.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Generations</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-8">
            Your generated architectures will appear here
          </p>
        </CardContent>
      </Card>
    );
  }

  // Pagination
  const totalPages = Math.ceil(architectures.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentArchitectures = architectures.slice(startIndex, endIndex);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Generations</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Table */}
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr className="border-b">
                  <th className="text-left p-3 text-sm font-medium">Title</th>
                  <th className="text-left p-3 text-sm font-medium hidden md:table-cell">Provider</th>
                  <th className="text-left p-3 text-sm font-medium hidden lg:table-cell">Scale</th>
                  <th className="text-left p-3 text-sm font-medium hidden sm:table-cell">Created</th>
                  <th className="text-right p-3 text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentArchitectures.map((architecture) => (
                  <tr key={architecture.id} className="border-b last:border-0 hover:bg-muted/30">
                    <td className="p-3">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium line-clamp-1">
                          {architecture.architecture_json.title}
                        </span>
                        <span className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                          {architecture.prompt}
                        </span>
                      </div>
                    </td>
                    <td className="p-3 hidden md:table-cell">
                      <div className="flex items-center gap-2 text-sm">
                        <Cloud className="h-4 w-4 text-muted-foreground" />
                        {architecture.cloud_provider}
                      </div>
                    </td>
                    <td className="p-3 hidden lg:table-cell">
                      <div className="flex items-center gap-2 text-sm">
                        <Layers className="h-4 w-4 text-muted-foreground" />
                        {architecture.scale}
                      </div>
                    </td>
                    <td className="p-3 hidden sm:table-cell">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5" />
                        {formatDistanceToNow(new Date(architecture.created_at), {
                          addSuffix: true
                        })}
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          asChild
                          variant="ghost"
                          size="sm"
                          className="h-8"
                        >
                          <Link href={`/architecture/${architecture.id}`}>
                            <Eye className="h-4 w-4" />
                            <span className="ml-1 hidden xl:inline">View</span>
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(architecture.id, architecture.architecture_json.title)}
                          disabled={deletingId === architecture.id}
                          className="h-8 hover:bg-destructive/10 hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="ml-1 hidden xl:inline">Delete</span>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing {startIndex + 1} to {Math.min(endIndex, architectures.length)} of {architectures.length} architectures
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
