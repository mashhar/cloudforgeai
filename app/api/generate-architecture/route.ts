import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { generateArchitectureInputSchema } from "@/lib/architecture-schema";
import {
  generateArchitectureWithGemini,
  GeminiError,
  GEMINI_MODELS
} from "@/lib/gemini";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const input = generateArchitectureInputSchema.parse(body);
    const requestedModel = body.model as string | undefined;

    // Try the specified model or fallback through the sequence
    const modelIndex = requestedModel
      ? GEMINI_MODELS.indexOf(requestedModel as typeof GEMINI_MODELS[number])
      : 0;

    let lastError: Error | null = null;

    for (let i = modelIndex; i < GEMINI_MODELS.length; i++) {
      const model = GEMINI_MODELS[i];

      try {
        const { architecture, modelUsed } = await generateArchitectureWithGemini(input, model);

        // Save to database if user is authenticated and Supabase is configured
        let savedId = null;

        try {
          const supabase = await createClient();
          const {
            data: { user }
          } = await supabase.auth.getUser();

          if (user) {
            const { data, error } = await supabase
              .from("architectures")
              .insert({
                user_id: user.id,
                prompt: input.prompt,
                cloud_provider: input.cloudProvider,
                scale: input.scale,
                architecture_json: architecture
              })
              .select("id")
              .single();

            if (!error && data) {
              savedId = data.id;
            }
          }
        } catch {
          // Supabase not configured, savedId will be null
        }

        return NextResponse.json({ architecture, savedId, modelUsed });
      } catch (error) {
        lastError = error as Error;

        // Check if it's a provider error that should trigger fallback
        if (error instanceof GeminiError) {
          const isProviderError = error.message.toLowerCase().includes("quota") ||
                                  error.message.toLowerCase().includes("rate limit") ||
                                  error.status === 429 ||
                                  error.status === 502 ||
                                  error.status === 503;

          if (isProviderError && i < GEMINI_MODELS.length - 1) {
            // Continue to next model
            continue;
          }
        }

        // If it's not a provider error or we're on the last model, throw
        throw error;
      }
    }

    // If we exhausted all models, throw the last error
    throw lastError ?? new Error("All models failed");

  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: "Invalid architecture request.",
          details: error.issues.map((issue) => issue.message)
        },
        { status: 400 }
      );
    }

    if (error instanceof GeminiError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status ?? 502 }
      );
    }

    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 502 }
      );
    }

    return NextResponse.json(
      { error: "Unable to generate architecture. All models failed. Please try again." },
      { status: 500 }
    );
  }
}
