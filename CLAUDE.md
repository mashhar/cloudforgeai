# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

CloudForge AI is an AI SaaS application that generates cloud architecture designs from natural language prompts. It uses Google Gemini API (`gemini-3.5-flash` model with fallback to `gemini-3.1-flash-lite`, `gemini-2.5-flash`, and `gemini-2.5-pro`) to generate structured architecture JSON, validates responses with Zod schemas, and renders interactive React Flow diagrams.

## Development Commands

```bash
npm install          # Install dependencies
npm run dev          # Start dev server at http://localhost:3000
npm run build        # Production build
npm start            # Start production server
npm run lint         # Run ESLint
```

## Environment Setup

Create `.env.local` with:
```
GEMINI_API_KEY=your_gemini_api_key_here
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Optional: Supabase for authentication and database
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Get your Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey).

## Architecture

### Authentication & Authorization (`lib/supabase/`)
Supabase handles authentication and database operations:
- **Client-side** (`client.ts`): Browser authentication, used in client components
- **Server-side** (`server.ts`): Server component authentication with cookie handling
- **Middleware** (`middleware.ts`): Route protection and session refresh

Protected routes:
- `/dashboard` - requires authentication
- `/architecture/*` - requires authentication
- `/history` - requires authentication
- `/review` - requires authentication

Middleware redirects unauthenticated users to `/login?redirect=<original-path>`.

### Database Schema (`supabase/schema.sql`)
Single `architectures` table with Row Level Security (RLS):
- Policies ensure users can only CRUD their own architectures
- Stores: prompt, cloud_provider, scale, architecture_json (JSONB), timestamps
- Indexed on user_id and created_at for fast queries
- Auto-updating `updated_at` via trigger

### API Flow
1. User submits prompt at `/dashboard` → `POST /api/generate-architecture`
2. Route validates input with `generateArchitectureInputSchema` (Zod)
3. `generateArchitectureWithGemini` calls Google Gemini API with model fallback sequence
4. Response is parsed through multiple strategies in `parseArchitectureJson`:
   - Raw content
   - Stripped code fences
   - Extracted first JSON object
5. Parsed JSON is normalized (service IDs sanitized, categories normalized) then validated against `architectureResponseSchema`
6. If user is authenticated, architecture is saved to Supabase `architectures` table
7. Client receives validated architecture, savedId (if authenticated), or structured error

### JSON Parsing & Normalization (`lib/json-parser.ts`)
The parser attempts multiple extraction strategies because LLM responses may include markdown fences or surrounding text. The `normalizeArchitecture` function:
- Converts service IDs to React Flow compatible format: lowercase, alphanumeric with hyphens/underscores
- Maps varied category strings to one of five allowed values: `compute`, `storage`, `database`, `networking`, `security`

### Schema Validation (`lib/architecture-schema.ts`)
The `architectureResponseSchema` includes a `superRefine` step that validates all connection source/target IDs reference actual service IDs. This prevents React Flow rendering errors.

### React Flow Layout (`components/architecture/architecture-diagram.tsx`)
The `createLayout` function implements a layer-based graph layout:
1. Calculates incoming edge count for each service
2. Assigns root nodes (zero incoming edges) to layer 0
3. BFS traversal assigns downstream nodes to incrementing layers
4. Groups services by layer and positions them vertically with 190px offsets
5. Horizontal spacing is 340px between layers

### Data Persistence
- **Authenticated users**: Architectures saved to Supabase PostgreSQL with RLS
- **Fallback**: localStorage still used for backwards compatibility and offline access
- **History page** (`/history`): Fetches from database, displays with delete functionality
- **Architecture detail page**: Tries database first (if authenticated), falls back to localStorage

### Export Features (`lib/export-utils.ts`)
The application supports four export formats:
1. **PNG Diagram** - Uses `html-to-image` to capture the React Flow diagram at 2x pixel ratio with theme-aware background color
2. **PDF Report** - Uses `jsPDF` to generate a formatted report including: title, summary, services, security recommendations, deployment checklist, and cost estimate. Auto-handles page breaks and text wrapping.
3. **Terraform (.tf)** - Exports the raw Terraform template string as a `.tf` file
4. **Architecture JSON** - Exports the complete validated architecture response as formatted JSON

All exports use sanitized filenames derived from the architecture title.

### Architecture Review Mode (`/review`)
The application includes an AI-powered architecture review feature that analyzes existing architectures:

**File Upload** (`components/review/file-upload.tsx`):
- Supports multiple file types: JSON, Terraform (.tf/.hcl), screenshots, and diagram images
- Drag-and-drop interface with file type detection
- Images are converted to base64 for transmission
- Text files (JSON/Terraform) are read as plain text

**Review API** (`app/api/review-architecture/route.ts`):
- Accepts uploaded files and optional focus areas (scalability, security, cost, reliability, performance)
- Builds contextual prompt from file contents
- Calls Google Gemini API for specialized architecture review
- Returns structured analysis with scoring, issues, improvements, and modernization recommendations

**Review Schema** (`lib/review-schema.ts`):
Defines the review data structure:
- **Architecture Score**: Overall score (0-100) plus dimension scores for scalability, reliability, security, cost, and performance
- **Issues**: Categorized findings with severity levels (critical/high/medium/low), descriptions, impact analysis, and remediation recommendations
- **Improvements**: General suggestions for architecture enhancement
- **Modernization Recommendations**: Specific modernization paths with effort estimates, priority levels, and benefit lists

**Review Results Display** (`components/review/review-results.tsx`):
- Executive summary with overall score visualization
- Score breakdown by dimension (scalability, reliability, security, cost, performance)
- Detailed issue cards with severity badges, category icons, and actionable recommendations
- Improvement suggestions grid
- Modernization roadmap with effort/priority indicators

**Review Page** (`app/review/page.tsx`):
- Clean upload interface with focus area selection
- Loading states with progress indication
- Results display with reset functionality
- Responsive design matching the main application theme

### Gemini Integration (`lib/gemini.ts`)
- Uses Google Gemini API with `responseMimeType: "application/json"` for structured output
- Implements retry logic with exponential backoff for retryable errors (429, 5xx)
- 120s timeout with abort controller
- Model fallback sequence: `gemini-3.5-flash` → `gemini-3.1-flash-lite` → `gemini-2.5-flash` → `gemini-2.5-pro`
- Handles quota limits and rate limiting with automatic model switching

## Key Constraints

- Service IDs must be stable React Flow node identifiers (validated with regex `/^[a-zA-Z0-9-_]+$/`)
- All connection source/target IDs must match existing service IDs (enforced by schema)
- Response must include 4-18 services and at least 3 connections
- Categories are strictly limited to: `compute`, `storage`, `database`, `networking`, `security`

## Tech Stack

- Next.js 15 App Router (React 19)
- TypeScript with strict mode
- Tailwind CSS + shadcn/ui-style primitives
- React Flow for interactive diagrams
- Zod for runtime validation
- Google Gemini API (gemini-3.5-flash with fallbacks to gemini-3.1-flash-lite, gemini-2.5-flash, and gemini-2.5-pro)
- Supabase for authentication and PostgreSQL database
- Framer Motion for animations
