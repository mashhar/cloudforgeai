import { z } from "zod";

// Schema for uploaded file types
export const uploadedFileSchema = z.object({
  type: z.enum(["screenshot", "json", "terraform", "diagram"]),
  name: z.string(),
  content: z.string(), // base64 for images, raw text for json/terraform
  mimeType: z.string().optional(),
});

// Schema for architecture review analysis
export const architectureIssueSchema = z.object({
  category: z.enum([
    "scalability",
    "single_point_of_failure",
    "security",
    "redundancy",
    "cost_optimization",
  ]),
  severity: z.enum(["critical", "high", "medium", "low"]),
  title: z.string(),
  description: z.string(),
  impact: z.string(),
  recommendation: z.string(),
});

export const architectureScoreSchema = z.object({
  overall: z.number().min(0).max(100),
  dimensions: z.object({
    scalability: z.number().min(0).max(100),
    reliability: z.number().min(0).max(100),
    security: z.number().min(0).max(100),
    cost: z.number().min(0).max(100),
    performance: z.number().min(0).max(100),
  }),
});

export const modernizationRecommendationSchema = z.object({
  title: z.string(),
  description: z.string(),
  benefits: z.array(z.string()),
  effort: z.enum(["low", "medium", "high"]),
  priority: z.enum(["low", "medium", "high", "critical"]),
});

export const reviewResponseSchema = z.object({
  score: architectureScoreSchema,
  issues: z.array(architectureIssueSchema),
  improvements: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
      category: z.string(),
    })
  ),
  modernization: z.array(modernizationRecommendationSchema),
  summary: z.string(),
});

// Input schema for the review API endpoint
export const reviewInputSchema = z.object({
  files: z.array(uploadedFileSchema).min(1, "At least one file is required"),
  focusAreas: z
    .array(
      z.enum([
        "scalability",
        "security",
        "cost",
        "reliability",
        "performance",
      ])
    )
    .optional(),
});

// Types
export type UploadedFile = z.infer<typeof uploadedFileSchema>;
export type ArchitectureIssue = z.infer<typeof architectureIssueSchema>;
export type ArchitectureScore = z.infer<typeof architectureScoreSchema>;
export type ModernizationRecommendation = z.infer<
  typeof modernizationRecommendationSchema
>;
export type ReviewResponse = z.infer<typeof reviewResponseSchema>;
export type ReviewInput = z.infer<typeof reviewInputSchema>;
