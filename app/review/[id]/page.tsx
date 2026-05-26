"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, AlertCircle } from "lucide-react";
import { ReviewResults } from "@/components/review/review-results";
import { SiteNavClient } from "@/components/layout/site-nav-client";
import { useUser } from "@/hooks/use-user";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import type { Database } from "@/types/database";

type Review = Database["public"]["Tables"]["reviews"]["Row"];

export default function ReviewDetailPage() {
  const { user } = useUser();
  const params = useParams();
  const router = useRouter();
  const [review, setReview] = useState<Review | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (params.id) {
      fetchReview(params.id as string);
    }
  }, [params.id]);

  async function fetchReview(id: string) {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;

      if (!data) {
        setError("Review not found");
        return;
      }

      setReview(data);
    } catch (err) {
      console.error("Failed to fetch review:", err);
      setError("Failed to load review");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <>
        <SiteNavClient user={user} />
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-950 dark:via-blue-950 dark:to-purple-950">
          <div className="container mx-auto px-4 py-12">
            <div className="max-w-6xl mx-auto flex items-center justify-center min-h-[400px]">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          </div>
        </div>
      </>
    );
  }

  if (error || !review) {
    return (
      <>
        <SiteNavClient user={user} />
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-950 dark:via-blue-950 dark:to-purple-950">
          <div className="container mx-auto px-4 py-12">
            <div className="max-w-6xl mx-auto">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
                <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                  {error || "Review Not Found"}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  The review you&apos;re looking for doesn&apos;t exist or you don&apos;t have permission to view it.
                </p>
                <Button asChild>
                  <Link href="/review">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Reviews
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <SiteNavClient user={user} />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-950 dark:via-blue-950 dark:to-purple-950">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">
            {/* Back Button */}
            <Button
              variant="ghost"
              className="mb-6"
              onClick={() => router.push("/review")}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Reviews
            </Button>

            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {review.title}
              </h1>
              <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                <span>{review.files.length} file{review.files.length !== 1 ? 's' : ''} analyzed</span>
                {review.focus_areas.length > 0 && (
                  <>
                    <span>•</span>
                    <span>Focus: {review.focus_areas.join(", ")}</span>
                  </>
                )}
              </div>
            </div>

            {/* Results */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
              <ReviewResults review={review.review_json} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
