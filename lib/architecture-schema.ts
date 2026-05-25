import { z } from "zod";

export const cloudProviderSchema = z.enum(["AWS", "Azure", "GCP"]);
export const architectureScaleSchema = z.enum([
  "Startup",
  "Enterprise",
  "Hyperscale"
]);

export const cloudServiceSchema = z.object({
  id: z
    .string()
    .min(1)
    .regex(/^[a-zA-Z0-9-_]+$/, "Service ids must be React Flow compatible."),
  name: z.string().min(1),
  description: z.string().min(12),
  category: z.enum(["compute", "storage", "database", "networking", "security"])
});

export const architectureConnectionSchema = z.object({
  source: z.string().min(1),
  target: z.string().min(1)
});

export const architectureResponseSchema = z
  .object({
    title: z.string().min(4),
    summary: z.string().min(24),
    cloudProvider: cloudProviderSchema,
    scale: architectureScaleSchema,
    estimatedCost: z.string().min(1),
    services: z.array(cloudServiceSchema).min(4).max(18),
    connections: z.array(architectureConnectionSchema).min(3),
    securityRecommendations: z.array(z.string().min(8)).min(3).max(10),
    deploymentChecklist: z.array(z.string().min(8)).min(3).max(10),
    terraformTemplate: z.string().min(80)
  })
  .superRefine((architecture, context) => {
    const serviceIds = new Set(architecture.services.map((service) => service.id));

    architecture.connections.forEach((connection, index) => {
      if (!serviceIds.has(connection.source)) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["connections", index, "source"],
          message: `Unknown source service id: ${connection.source}`
        });
      }

      if (!serviceIds.has(connection.target)) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["connections", index, "target"],
          message: `Unknown target service id: ${connection.target}`
        });
      }
    });
  });

export const generateArchitectureInputSchema = z.object({
  prompt: z.string().trim().min(10).max(4000),
  cloudProvider: cloudProviderSchema.default("AWS"),
  scale: architectureScaleSchema.default("Enterprise")
});

export type ArchitectureResponseFromSchema = z.infer<
  typeof architectureResponseSchema
>;
