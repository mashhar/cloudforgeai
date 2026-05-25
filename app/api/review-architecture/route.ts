import { NextRequest, NextResponse } from "next/server";
import {
  reviewInputSchema,
  reviewResponseSchema,
  type ReviewResponse,
} from "@/lib/review-schema";
import { ZodError } from "zod";
import { createClient } from "@/lib/supabase/server";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models";

// Use the same model sequence as the main Gemini integration
const GEMINI_MODELS = [
  "gemini-3.5-flash",
  "gemini-3.1-flash-lite",
  "gemini-2.5-flash",
  "gemini-2.5-pro"
] as const;

export const maxDuration = 120;

async function analyzeArchitectureWithAI(
  files: Array<{
    type: string;
    name: string;
    content: string;
    mimeType?: string;
  }>,
  focusAreas?: string[],
  modelIndex = 0
): Promise<ReviewResponse> {
  if (!GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  // Try models in sequence if previous ones fail
  if (modelIndex >= GEMINI_MODELS.length) {
    throw new Error("All Gemini models failed");
  }

  const currentModel = GEMINI_MODELS[modelIndex];

  // Build context from uploaded files
  let architectureContext = "# Uploaded Architecture Files\n\n";

  for (const file of files) {
    architectureContext += `## ${file.name} (${file.type})\n`;

    if (file.type === "json") {
      try {
        const parsed = JSON.parse(file.content);
        architectureContext += `\`\`\`json\n${JSON.stringify(parsed, null, 2)}\n\`\`\`\n\n`;
      } catch {
        architectureContext += `\`\`\`\n${file.content}\n\`\`\`\n\n`;
      }
    } else if (file.type === "terraform") {
      architectureContext += `\`\`\`hcl\n${file.content}\n\`\`\`\n\n`;
    } else if (file.type === "screenshot" || file.type === "diagram") {
      architectureContext += `[Image file: ${file.name}]\n\n`;
    }
  }

  const focusAreasText = focusAreas?.length
    ? `Focus particularly on: ${focusAreas.join(", ")}`
    : "";

  const prompt = `You are an expert cloud architect reviewing a cloud infrastructure design. Analyze the provided architecture and provide a comprehensive review.

${architectureContext}

${focusAreasText}

Analyze this architecture for:
1. **Scalability issues**: bottlenecks, capacity limits, horizontal scaling challenges
2. **Single Points of Failure (SPOFs)**: components without redundancy or failover
3. **Security gaps**: exposed services, missing encryption, weak access controls, compliance issues
4. **Missing redundancy**: lack of high availability, backup strategies, disaster recovery
5. **Cost optimization opportunities**: over-provisioning, inefficient resource usage, better pricing models

Provide your analysis as a JSON object with this structure:
{
  "score": {
    "overall": <0-100>,
    "dimensions": {
      "scalability": <0-100>,
      "reliability": <0-100>,
      "security": <0-100>,
      "cost": <0-100>,
      "performance": <0-100>
    }
  },
  "issues": [
    {
      "category": "scalability|single_point_of_failure|security|redundancy|cost_optimization",
      "severity": "critical|high|medium|low",
      "title": "Brief issue title",
      "description": "Detailed description",
      "impact": "Business/technical impact",
      "recommendation": "How to fix"
    }
  ],
  "improvements": [
    {
      "title": "Improvement suggestion",
      "description": "Detailed improvement description",
      "category": "Category of improvement"
    }
  ],
  "modernization": [
    {
      "title": "Modernization recommendation",
      "description": "Why and how to modernize",
      "benefits": ["benefit1", "benefit2"],
      "effort": "low|medium|high",
      "priority": "low|medium|high|critical"
    }
  ],
  "summary": "Executive summary of the architecture review (2-3 sentences)"
}

Be thorough and specific. Identify real issues, not hypothetical ones. Return ONLY valid JSON.`;

  try {
    const response = await fetch(
      `${GEMINI_ENDPOINT}/${currentModel}:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 4000,
            responseMimeType: "application/json",
          },
        }),
        signal: AbortSignal.timeout(120000),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();

      // If model not found or rate limit, try next model
      if (response.status === 404 || response.status === 429) {
        console.warn(`Model ${currentModel} failed with status ${response.status}, trying next model...`);
        return analyzeArchitectureWithAI(files, focusAreas, modelIndex + 1);
      }

      throw new Error(
        `Gemini API error: ${response.status} ${response.statusText} - ${errorText}`
      );
    }

    const data = await response.json();
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!content) {
      throw new Error("No content in API response");
    }

    // Parse JSON from response
    let reviewData: unknown;
    try {
      // Try parsing raw content
      reviewData = JSON.parse(content);
    } catch {
      // Try extracting JSON from markdown code blocks
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (jsonMatch) {
        reviewData = JSON.parse(jsonMatch[1]);
      } else {
        // Try finding first { to last }
        const firstBrace = content.indexOf("{");
        const lastBrace = content.lastIndexOf("}");
        if (firstBrace !== -1 && lastBrace !== -1) {
          reviewData = JSON.parse(content.slice(firstBrace, lastBrace + 1));
        } else {
          throw new Error("Could not extract JSON from response");
        }
      }
    }

    // Validate against schema
    return reviewResponseSchema.parse(reviewData);
  } catch (error) {
    // If this is not the last model, try the next one
    if (modelIndex < GEMINI_MODELS.length - 1) {
      console.warn(`Model ${currentModel} failed, trying next model...`, error);
      return analyzeArchitectureWithAI(files, focusAreas, modelIndex + 1);
    }

    // Re-throw on last model
    throw error;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedInput = reviewInputSchema.parse(body);

    const review = await analyzeArchitectureWithAI(
      validatedInput.files,
      validatedInput.focusAreas
    );

    // Generate title from files or use default
    const title = validatedInput.files.length === 1
      ? validatedInput.files[0].name.replace(/\.(json|tf|hcl|png|jpg|jpeg)$/i, '')
      : `Architecture Review - ${validatedInput.files.length} files`;

    // Save to database if user is authenticated
    let savedId: string | undefined;
    try {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data, error } = await supabase
          .from("reviews")
          .insert({
            user_id: user.id,
            title,
            focus_areas: validatedInput.focusAreas || [],
            files: validatedInput.files,
            review_json: review,
          })
          .select()
          .single();

        if (error) {
          console.error("Failed to save review:", error);
        } else {
          savedId = data?.id;
        }
      }
    } catch (dbError) {
      console.error("Database error:", dbError);
      // Continue even if DB save fails
    }

    return NextResponse.json({
      success: true,
      review,
      savedId,
    });
  } catch (error) {
    console.error("Architecture review error:", error);

    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid input data",
          details: error.errors,
        },
        { status: 400 }
      );
    }

    if (error instanceof Error) {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "An unexpected error occurred",
      },
      { status: 500 }
    );
  }
}
