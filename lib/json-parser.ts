import { architectureResponseSchema } from "@/lib/architecture-schema";
import type { ArchitectureResponse } from "@/types/architecture";
// dirty-json has no types; ignore the missing declaration error
// @ts-ignore: No declaration file for module 'dirty-json'
import parse from "dirty-json";

export function parseArchitectureJson(content: string): ArchitectureResponse {
  const candidates = [
    content,
    stripCodeFence(content),
    extractFirstJsonObject(content)
  ].filter(Boolean);

  for (const candidate of candidates) {
    try {
      const parsed = JSON.parse(candidate);
      const normalized = normalizeArchitecture(parsed);
      return architectureResponseSchema.parse(normalized);
    } catch {
      continue;
    }
  }

  // Fallback: try dirty-json for malformed JSON
  for (const candidate of candidates) {
    try {
      const parsed = parse(candidate);
      const normalized = normalizeArchitecture(parsed);
      return architectureResponseSchema.parse(normalized);
    } catch {
      continue;
    }
  }

  throw new Error("The AI returned malformed architecture JSON.");
}

function stripCodeFence(content: string) {
  return content
    .trim()
    .replace(/^```(?:json)?/i, "")
    .replace(/```$/i, "")
    .trim();
}

function extractFirstJsonObject(content: string) {
  const start = content.indexOf("{");
  const end = content.lastIndexOf("}");

  if (start === -1 || end === -1 || end <= start) {
    return "";
  }

  return content.slice(start, end + 1);
}

function normalizeArchitecture(value: unknown) {
  if (!isRecord(value)) {
    return value;
  }

  return {
    ...value,
    services: Array.isArray(value.services)
      ? value.services.map((service) => {
          if (!isRecord(service)) return service;

          return {
            ...service,
            id: String(service.id ?? "")
              .trim()
              .toLowerCase()
              .replace(/[^a-z0-9-_]+/g, "-")
              .replace(/^-+|-+$/g, ""),
            category: normalizeCategory(service.category)
          };
        })
      : value.services
  };
}

function normalizeCategory(category: unknown) {
  const value = String(category ?? "").toLowerCase();

  if (value.includes("storage")) return "storage";
  if (value.includes("data")) return "database";
  if (value.includes("network") || value.includes("edge")) return "networking";
  if (value.includes("security") || value.includes("identity")) return "security";
  return "compute";
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
