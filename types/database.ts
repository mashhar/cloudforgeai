import type { ArchitectureResponse } from "./architecture";
import type { ReviewResponse, UploadedFile } from "@/lib/review-schema";

export interface Database {
  public: {
    Tables: {
      architectures: {
        Row: {
          id: string;
          user_id: string;
          prompt: string;
          cloud_provider: "AWS" | "Azure" | "GCP";
          scale: "Startup" | "Enterprise" | "Hyperscale";
          architecture_json: ArchitectureResponse;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          prompt: string;
          cloud_provider: "AWS" | "Azure" | "GCP";
          scale: "Startup" | "Enterprise" | "Hyperscale";
          architecture_json: ArchitectureResponse;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          prompt?: string;
          cloud_provider?: "AWS" | "Azure" | "GCP";
          scale?: "Startup" | "Enterprise" | "Hyperscale";
          architecture_json?: ArchitectureResponse;
          created_at?: string;
          updated_at?: string;
        };
      };
      reviews: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          focus_areas: string[];
          files: UploadedFile[];
          review_json: ReviewResponse;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          focus_areas?: string[];
          files: UploadedFile[];
          review_json: ReviewResponse;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          focus_areas?: string[];
          files?: UploadedFile[];
          review_json?: ReviewResponse;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}
