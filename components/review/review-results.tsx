"use client";

import {
  AlertTriangle,
  CheckCircle2,
  Info,
  TrendingUp,
  Shield,
  Zap,
  DollarSign,
  Activity,
  XCircle,
} from "lucide-react";
import type { ReviewResponse } from "@/lib/review-schema";

interface ReviewResultsProps {
  review: ReviewResponse;
}

export function ReviewResults({ review }: ReviewResultsProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 dark:text-green-400";
    if (score >= 60) return "text-yellow-600 dark:text-yellow-400";
    if (score >= 40) return "text-orange-600 dark:text-orange-400";
    return "text-red-600 dark:text-red-400";
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return "bg-green-100 dark:bg-green-900/30";
    if (score >= 60) return "bg-yellow-100 dark:bg-yellow-900/30";
    if (score >= 40) return "bg-orange-100 dark:bg-orange-900/30";
    return "bg-red-100 dark:bg-red-900/30";
  };

  const getSeverityBadge = (severity: string) => {
    const styles = {
      critical: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
      high: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
      medium:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
      low: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    };

    return (
      <span
        className={`px-2 py-1 text-xs font-semibold rounded-full ${
          styles[severity as keyof typeof styles]
        }`}
      >
        {severity.toUpperCase()}
      </span>
    );
  };

  const getEffortBadge = (effort: string) => {
    const styles = {
      low: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
      medium:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
      high: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
    };

    return (
      <span
        className={`px-2 py-1 text-xs font-semibold rounded-full ${
          styles[effort as keyof typeof styles]
        }`}
      >
        {effort.toUpperCase()} EFFORT
      </span>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const styles = {
      critical:
        "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
      high: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
      medium:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
      low: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300",
    };

    return (
      <span
        className={`px-2 py-1 text-xs font-semibold rounded-full ${
          styles[priority as keyof typeof styles]
        }`}
      >
        {priority.toUpperCase()} PRIORITY
      </span>
    );
  };

  const getDimensionIcon = (dimension: string) => {
    switch (dimension) {
      case "scalability":
        return <TrendingUp className="h-5 w-5" />;
      case "reliability":
        return <Activity className="h-5 w-5" />;
      case "security":
        return <Shield className="h-5 w-5" />;
      case "cost":
        return <DollarSign className="h-5 w-5" />;
      case "performance":
        return <Zap className="h-5 w-5" />;
      default:
        return <Info className="h-5 w-5" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "scalability":
        return <TrendingUp className="h-5 w-5" />;
      case "single_point_of_failure":
        return <XCircle className="h-5 w-5" />;
      case "security":
        return <Shield className="h-5 w-5" />;
      case "redundancy":
        return <Activity className="h-5 w-5" />;
      case "cost_optimization":
        return <DollarSign className="h-5 w-5" />;
      default:
        return <AlertTriangle className="h-5 w-5" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Summary */}
      <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <Info className="h-6 w-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
              Executive Summary
            </h3>
            <p className="text-blue-800 dark:text-blue-200">
              {review.summary}
            </p>
          </div>
        </div>
      </div>

      {/* Overall Score */}
      <div className="text-center">
        <div
          className={`inline-flex items-center justify-center w-32 h-32 rounded-full ${getScoreBgColor(
            review.score.overall
          )}`}
        >
          <div>
            <div
              className={`text-4xl font-bold ${getScoreColor(
                review.score.overall
              )}`}
            >
              {review.score.overall}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Overall Score
            </div>
          </div>
        </div>
      </div>

      {/* Dimension Scores */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Score Breakdown
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {Object.entries(review.score.dimensions).map(([key, value]) => (
            <div
              key={key}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="text-gray-600 dark:text-gray-400">
                  {getDimensionIcon(key)}
                </div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                  {key}
                </h4>
              </div>
              <div className={`text-2xl font-bold ${getScoreColor(value)}`}>
                {value}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Issues */}
      {review.issues.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            Identified Issues ({review.issues.length})
          </h3>
          <div className="space-y-4">
            {review.issues.map((issue, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="text-gray-600 dark:text-gray-400 mt-1">
                      {getCategoryIcon(issue.category)}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                        {issue.title}
                      </h4>
                    </div>
                  </div>
                  {getSeverityBadge(issue.severity)}
                </div>
                <div className="ml-8 space-y-3 text-sm">
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      Description:{" "}
                    </span>
                    <span className="text-gray-600 dark:text-gray-400">
                      {issue.description}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      Impact:{" "}
                    </span>
                    <span className="text-gray-600 dark:text-gray-400">
                      {issue.impact}
                    </span>
                  </div>
                  <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded p-3">
                    <span className="font-medium text-green-800 dark:text-green-200">
                      Recommendation:{" "}
                    </span>
                    <span className="text-green-700 dark:text-green-300">
                      {issue.recommendation}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Improvements */}
      {review.improvements.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            Improvement Suggestions ({review.improvements.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {review.improvements.map((improvement, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4"
              >
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  {improvement.title}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {improvement.description}
                </p>
                <span className="text-xs text-gray-500 dark:text-gray-500 italic">
                  {improvement.category}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modernization */}
      {review.modernization.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
            <Zap className="h-5 w-5 text-purple-500" />
            Modernization Recommendations ({review.modernization.length})
          </h3>
          <div className="space-y-4">
            {review.modernization.map((rec, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5"
              >
                <div className="flex items-start justify-between mb-3">
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 flex-1">
                    {rec.title}
                  </h4>
                  <div className="flex gap-2">
                    {getEffortBadge(rec.effort)}
                    {getPriorityBadge(rec.priority)}
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  {rec.description}
                </p>
                <div>
                  <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Benefits:
                  </h5>
                  <ul className="list-disc list-inside space-y-1">
                    {rec.benefits.map((benefit, i) => (
                      <li
                        key={i}
                        className="text-sm text-gray-600 dark:text-gray-400"
                      >
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
