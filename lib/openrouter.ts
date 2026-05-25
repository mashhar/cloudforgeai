import { parseArchitectureJson } from "@/lib/json-parser";
import type {
  ArchitectureResponse,
  GenerateArchitectureInput
} from "@/types/architecture";

const OPENROUTER_ENDPOINT = "https://opencode.ai/zen/v1/chat/completions";
const REQUEST_TIMEOUT_MS = 120000;
const MAX_RETRIES = 3;

// Model fallback sequence
export const MODEL_SEQUENCE = [
  "deepseek-v4-flash-free",
  "nemotron-3-super-free"
] as const;

// Export for display purposes
export const CURRENT_MODEL = MODEL_SEQUENCE[0];

interface OpenRouterMessage {
  role: "system" | "user";
  content: string;
}

interface OpenRouterResponse {
  choices?: Array<{
    message?: {
      content?: string;
      reasoning?: string;
    };
  }>;
  error?: {
    message?: string;
    code?: string | number;
  };
}

interface OpenRouterStreamChunk {
  choices?: Array<{
    delta?: {
      content?: string;
    };
    message?: {
      content?: string;
    };
  }>;
}

export class OpenRouterError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
    public readonly retryable = false
  ) {
    super(message);
    this.name = "OpenRouterError";
  }
}

export async function generateArchitectureWithOpenRouter(
  input: GenerateArchitectureInput,
  specificModel?: string
): Promise<{ architecture: ArchitectureResponse; modelUsed: string }> {
  const apiKey = sanitizeApiKey(
    process.env.OPENCODE_API_KEY ?? process.env.OPENROUTER_API_KEY
  );

  if (!apiKey) {
    throw new OpenRouterError(
      "OPENROUTER_API_KEY or OPENCODE_API_KEY is not configured. Add it to .env.local.",
      500,
      false
    );
  }

  const messages = createArchitectureMessages(input);
  const model = specificModel ?? MODEL_SEQUENCE[0];

  const architecture = await retryWithBackoff(async () => {
    const response = await fetchWithTimeout(
      OPENROUTER_ENDPOINT,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
          "X-Title": "CloudForge AI",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model,
          messages,
          temperature: 0.2,
          top_p: 0.9,
          max_tokens: 8000,
          stream: true
        })
      },
      REQUEST_TIMEOUT_MS
    );

    if (!response.ok) {
      const payload = (await safeJson(response)) as OpenRouterResponse;
      const retryable = response.status === 429 || response.status >= 500;
      const message =
        payload.error?.message ??
        `OpenRouter request failed with status ${response.status}.`;
      throw new OpenRouterError(message, response.status, retryable);
    }

    const content = await readCompletionContent(response);
    if (!content) {
      throw new OpenRouterError(
        "OpenRouter returned an empty response. The provider did not include assistant content.",
        502,
        true
      );
    }

    return parseArchitectureJson(content);
  });

  return { architecture, modelUsed: model };
}

async function readCompletionContent(response: Response) {
  const contentType = response.headers.get("content-type") ?? "";

  if (!contentType.includes("text/event-stream")) {
    const payload = (await safeJson(response)) as OpenRouterResponse;
    const message = payload.choices?.[0]?.message;
    // DeepSeek may put content in reasoning_content field
    return message?.content || message?.reasoning || "";
  }

  if (!response.body) {
    return "";
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let content = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith("data:")) continue;

      const data = trimmed.slice(5).trim();
      if (!data || data === "[DONE]") continue;

      try {
        const chunk = JSON.parse(data) as OpenRouterStreamChunk;
        const choice = chunk.choices?.[0];
        content +=
          choice?.delta?.content ??
          choice?.message?.content ??
          "";
      } catch {
        continue;
      }
    }
  }

  return content.trim();
}

function sanitizeApiKey(value: string | undefined) {
  return value?.trim().replace(/^["']|["']$/g, "");
}

function createArchitectureMessages(
  input: GenerateArchitectureInput
): OpenRouterMessage[] {
  return [
    {
      role: "system",
      content: `You are a senior enterprise cloud architect.
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
}`
    },
    {
      role: "user",
      content: `Prompt: ${input.prompt}
Cloud provider: ${input.cloudProvider}
Scale: ${input.scale}
Generate 7 to 12 services with clear infrastructure choices.
Include a React Flow compatible topology through services and connections.
Include concrete security best practices, cost estimate, deployment checklist, and Terraform starter template.`
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
      throw new OpenRouterError("OpenRouter request timed out.", 504, true);
    }

    throw new OpenRouterError("Unable to reach OpenRouter.", 502, true);
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
        error instanceof OpenRouterError ? error.retryable : attempt === 0;

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
