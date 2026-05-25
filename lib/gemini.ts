import { parseArchitectureJson } from "@/lib/json-parser";
import type {
  ArchitectureResponse,
  GenerateArchitectureInput
} from "@/types/architecture";

const GEMINI_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models";
const REQUEST_TIMEOUT_MS = 120000;
const MAX_RETRIES = 3;

// Gemini model options
export const GEMINI_MODELS = [
  "gemini-3.5-flash",
  "gemini-3.1-flash-lite",
  "gemini-2.5-flash",
  "gemini-2.5-pro"
] as const;

export const CURRENT_GEMINI_MODEL = GEMINI_MODELS[0];

interface GeminiContent {
  parts: Array<{
    text?: string;
  }>;
  role: string;
}

interface GeminiResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
      }>;
    };
    finishReason?: string;
  }>;
  error?: {
    message?: string;
    code?: string | number;
    status?: string;
  };
}

export class GeminiError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
    public readonly retryable = false
  ) {
    super(message);
    this.name = "GeminiError";
  }
}

export async function generateArchitectureWithGemini(
  input: GenerateArchitectureInput,
  specificModel?: string
): Promise<{ architecture: ArchitectureResponse; modelUsed: string }> {
  const apiKey = sanitizeApiKey(process.env.GEMINI_API_KEY);

  if (!apiKey) {
    throw new GeminiError(
      "GEMINI_API_KEY is not configured. Add it to .env.local.",
      500,
      false
    );
  }

  const model = specificModel ?? CURRENT_GEMINI_MODEL;
  const endpoint = `${GEMINI_ENDPOINT}/${model}:generateContent?key=${apiKey}`;

  const architecture = await retryWithBackoff(async () => {
    const response = await fetchWithTimeout(
      endpoint,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: createGeminiMessages(input),
          generationConfig: {
            temperature: 0.2,
            topP: 0.9,
            maxOutputTokens: 8000,
            responseMimeType: "application/json"
          }
        })
      },
      REQUEST_TIMEOUT_MS
    );

    if (!response.ok) {
      const payload = (await safeJson(response)) as GeminiResponse;
      const retryable = response.status === 429 || response.status >= 500;
      const message =
        payload.error?.message ??
        `Gemini request failed with status ${response.status}.`;
      throw new GeminiError(message, response.status, retryable);
    }

    const payload = (await response.json()) as GeminiResponse;
    const content = payload.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!content) {
      throw new GeminiError(
        "Gemini returned an empty response. No content was generated.",
        502,
        true
      );
    }

    return parseArchitectureJson(content);
  });

  return { architecture, modelUsed: model };
}

function sanitizeApiKey(value: string | undefined) {
  return value?.trim().replace(/^["']|["']$/g, "");
}

function createGeminiMessages(
  input: GenerateArchitectureInput
): GeminiContent[] {
  const systemPrompt = `You are a senior enterprise cloud architect.
Generate scalable, production-grade cloud architectures for AWS, Azure, and GCP.
Optimize for reliability, security, operational clarity, and cost.

CRITICAL: You MUST return ONLY valid JSON. No markdown, no code fences (\`\`\`), no explanatory text, no preamble, no comments.
Your entire response must be parseable as JSON. Start with { and end with }.
If you include anything other than valid JSON, the response will fail.

All service ids must be stable React Flow node ids using lowercase letters, numbers, hyphens, or underscores.
Every connection source and target must match an existing service id.
Service category must be exactly one of: compute, storage, database, networking, security.
The Terraform template should be a starter template string, not an object.
The JSON object must exactly match this TypeScript shape:
{
  "title": "string",
  "summary": "string",
  "cloudProvider": "AWS | Azure | GCP",
  "scale": "Startup | Enterprise | Hyperscale",
  "estimatedCost": "string",
  "services": [
    {
      "id": "string",
      "name": "string",
      "description": "string",
      "category": "compute | storage | database | networking | security"
    }
  ],
  "connections": [
    {
      "source": "string",
      "target": "string"
    }
  ],
  "securityRecommendations": ["string"],
  "deploymentChecklist": ["string"],
  "terraformTemplate": "string"
}`;

  const userPrompt = `Prompt: ${input.prompt}
Cloud provider: ${input.cloudProvider}
Scale: ${input.scale}
Generate 7 to 12 services with clear infrastructure choices.
Include a React Flow compatible topology through services and connections.
Include concrete security best practices, cost estimate, deployment checklist, and Terraform starter template.`;

  return [
    {
      role: "user",
      parts: [{ text: systemPrompt + "\n\n" + userPrompt }]
    }
  ];
}

async function fetchWithTimeout(
  url: string,
  init: RequestInit,
  timeoutMs: number
) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, {
      ...init,
      signal: controller.signal,
      cache: "no-store"
    });
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new GeminiError("Gemini request timed out.", 504, true);
    }

    throw new GeminiError("Unable to reach Gemini API.", 502, true);
  } finally {
    clearTimeout(timeout);
  }
}

async function retryWithBackoff<T>(operation: () => Promise<T>): Promise<T> {
  let lastError: unknown;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt += 1) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      const retryable =
        error instanceof GeminiError ? error.retryable : attempt === 0;

      if (!retryable || attempt === MAX_RETRIES) {
        break;
      }

      await sleep(getBackoffDelay(attempt));
    }
  }

  throw lastError;
}

function getBackoffDelay(attempt: number) {
  const baseDelay = 700 * 2 ** attempt;
  const jitter = Math.floor(Math.random() * 250);
  return baseDelay + jitter;
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function safeJson(response: Response) {
  try {
    return await response.json();
  } catch {
    return {};
  }
}
