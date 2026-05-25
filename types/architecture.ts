export type CloudProvider = "AWS" | "Azure" | "GCP";
export type ArchitectureScale = "Startup" | "Enterprise" | "Hyperscale";

export interface CloudService {
  id: string;
  name: string;
  description: string;
  category: "compute" | "storage" | "database" | "networking" | "security";
}

export interface ArchitectureConnection {
  source: string;
  target: string;
}

export interface ArchitectureResponse {
  title: string;
  summary: string;
  cloudProvider: CloudProvider;
  scale: ArchitectureScale;
  estimatedCost: string;
  services: CloudService[];
  connections: ArchitectureConnection[];
  securityRecommendations: string[];
  deploymentChecklist: string[];
  terraformTemplate: string;
}

export interface GenerateArchitectureInput {
  prompt: string;
  cloudProvider: CloudProvider;
  scale: ArchitectureScale;
}

export interface StoredGeneration {
  id: string;
  prompt: string;
  createdAt?: string;
  timestamp?: number;
  architecture: ArchitectureResponse;
}
