"use client";

import { useState, useEffect } from "react";
import { Search, Loader2 } from "lucide-react";
import { FileUpload } from "@/components/review/file-upload";
import { ReviewResults } from "@/components/review/review-results";
import { RecentReviewsTable } from "@/components/review/recent-reviews-table";
import { SiteNavClient } from "@/components/layout/site-nav-client";
import { useUser } from "@/hooks/use-user";
import type { UploadedFile, ReviewResponse } from "@/lib/review-schema";

const focusAreaOptions = [
  { value: "scalability", label: "Scalability" },
  { value: "security", label: "Security" },
  { value: "cost", label: "Cost Optimization" },
  { value: "reliability", label: "Reliability" },
  { value: "performance", label: "Performance" },
];

export default function ReviewPage() {
  const { user } = useUser();
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [focusAreas, setFocusAreas] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [review, setReview] = useState<ReviewResponse | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleFocusAreaToggle = (value: string) => {
    setFocusAreas((prev) =>
      prev.includes(value)
        ? prev.filter((v) => v !== value)
        : [...prev, value]
    );
  };

  const handleAnalyze = async () => {
    if (files.length === 0) {
      setError("Please upload at least one file");
      return;
    }

    setLoading(true);
    setError(null);
    setReview(null);

    try {
      const response = await fetch("/api/review-architecture", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          files,
          focusAreas: focusAreas.length > 0 ? focusAreas : undefined,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Analysis failed");
      }

      setReview(data.review);

      // Refresh the reviews table if review was saved
      if (data.savedId) {
        setRefreshKey(prev => prev + 1);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFiles([]);
    setFocusAreas([]);
    setReview(null);
    setError(null);
  };

  return (
    <>
      <SiteNavClient user={user} />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-950 dark:via-blue-950 dark:to-purple-950">
        <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Architecture Review
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Upload your architecture files for AI-powered analysis and
              recommendations
            </p>
          </div>

          {!review ? (
            <div className="space-y-8">
              {/* Upload Section */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  Upload Architecture Files
                </h2>
                <FileUpload files={files} onFilesChange={setFiles} />
              </div>

              {/* Focus Areas */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Focus Areas (Optional)
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Select specific areas to emphasize in the review
                </p>
                <div className="flex flex-wrap gap-3">
                  {focusAreaOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleFocusAreaToggle(option.value)}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        focusAreas.includes(option.value)
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Error Display */}
              {error && (
                <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg p-4">
                  <p className="text-red-800 dark:text-red-200">{error}</p>
                </div>
              )}

              {/* Analyze Button */}
              <div className="flex justify-center">
                <button
                  onClick={handleAnalyze}
                  disabled={loading || files.length === 0}
                  className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Analyzing Architecture...
                    </>
                  ) : (
                    <>
                      <Search className="h-5 w-5" />
                      Analyze Architecture
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Results */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                    Review Results
                  </h2>
                  <button
                    onClick={handleReset}
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  >
                    New Review
                  </button>
                </div>
                <ReviewResults review={review} />
              </div>
            </div>
          )}

          {/* Recent Reviews Table - Always show below */}
          {!review && (
            <div className="mt-8">
              <RecentReviewsTable key={refreshKey} userId={user?.id} />
            </div>
          )}
        </div>
      </div>
      </div>
    </>
  );
}
