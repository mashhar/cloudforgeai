# CloudForge AI

<div align="center">

![CloudForge AI Banner](https://img.shields.io/badge/CloudForge-AI-blue?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJMMiA3TDEyIDEyTDIyIDdMMTIgMloiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik0yIDEyTDEyIDE3TDIyIDEyIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiLz4KPHBhdGggZD0iTTIgMTdMMTIgMjJMMjIgMTciIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMiIvPgo8L3N2Zz4=)

**AI-Powered Cloud Architecture Design Generator**

Generate production-ready cloud architectures from natural language prompts with interactive diagrams, security recommendations, and deployment templates.

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react)](https://reactjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Auth-3ECF8E?style=flat&logo=supabase)](https://supabase.com/)
[![Google Gemini](https://img.shields.io/badge/Google-Gemini-4285F4?style=flat&logo=google)](https://ai.google.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

[Features](#-features) • [Demo](#-demo) • [Quick Start](#-quick-start) • [Documentation](#-documentation) • [Deployment](#-deployment)

</div>

---

## 🎯 Overview

CloudForge AI transforms natural language descriptions into comprehensive cloud architectures for AWS, Azure, and Google Cloud Platform. Built for architects, developers, and teams who need to rapidly prototype and visualize cloud infrastructure designs.

### Why CloudForge AI?

- **🤖 AI-Powered**: Leverages Google Gemini (gemini-3.5-flash with intelligent fallbacks) for intelligent architecture generation
- **🎨 Visual Design**: Interactive React Flow diagrams with automatic layout and relationship mapping
- **🔒 Secure by Default**: Built-in security recommendations and best practices
- **📊 Export Everything**: PNG diagrams, PDF reports, Terraform templates, and JSON schemas
- **🔐 Enterprise Ready**: Supabase authentication, PostgreSQL with Row Level Security, and multi-tenant isolation
- **🌓 Modern UX**: Dark/light mode, responsive design, and smooth animations

---

## ✨ Features

### Core Capabilities

- **🏗️ Architecture Generation**
  - Natural language to cloud architecture conversion
  - Support for AWS, Azure, and Google Cloud Platform
  - Scale options: Startup, Enterprise, Hyperscale
  - 4-18 services with intelligent relationships

- **📐 Interactive Diagrams**
  - React Flow-powered visualization
  - Automatic layer-based layout
  - Service categorization (compute, storage, database, networking, security)
  - Zoomable and pannable canvas

- **🔐 Authentication & Security**
  - Email/password and Google OAuth via Supabase
  - Row Level Security (RLS) on all database operations
  - Protected routes with automatic redirection
  - Session management with cookie-based auth

- **💾 Persistent Storage**
  - Save unlimited architectures to PostgreSQL
  - Full history management with search and filtering
  - Individual architecture detail pages
  - Fallback to localStorage for offline access

- **📤 Multi-Format Exports**
  - **PNG**: High-resolution diagrams (2x pixel ratio)
  - **PDF**: Formatted reports with all architecture details
  - **Terraform**: Infrastructure-as-code templates
  - **JSON**: Complete architecture schemas

- **🔍 Architecture Review** *(Coming Soon)*
  - Upload existing architectures for AI analysis
  - Security, scalability, and cost assessments
  - Modernization recommendations

### Technical Features

- **Robust JSON Parsing**: Multi-strategy parsing with normalization
- **Schema Validation**: Zod-powered runtime validation
- **Error Handling**: Graceful fallbacks and user-friendly messages
- **Model Fallbacks**: Automatic switching between Gemini models on quota/rate limits
- **Responsive Design**: Mobile-first with Tailwind CSS
- **Type Safety**: Full TypeScript coverage with strict mode

---

## 📸 Demo

### Dashboard
*Generate architectures from natural language prompts*

### Architecture Diagram
*Interactive React Flow diagrams with auto-layout*

### History View
*Manage all your saved architectures*

### Export Options
*Download as PNG, PDF, Terraform, or JSON*

> **Note**: Add screenshots to `/public/screenshots/` directory after setup

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and npm
- **Supabase Account** (free tier works)
- **Google Gemini API Key** ([Get one here](https://aistudio.google.com/app/apikey))

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/cloudforge-ai.git
cd cloudforge-ai
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up Supabase**

- Create a new project at [supabase.com](https://supabase.com)
- Run the schema from `supabase/schema.sql` in the SQL Editor
- Enable Email and Google OAuth providers (optional)
- Get your project URL and anon key

4. **Configure environment variables**

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```bash
# Google Gemini API
GEMINI_API_KEY=your_gemini_api_key_here

# Application URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

5. **Start the development server**

```bash
npm run dev
```

6. **Open the application**

Navigate to [http://localhost:3000](http://localhost:3000)

---

## 📚 Documentation

### Environment Variables

| Variable | Required | Description | Default |
|----------|----------|-------------|---------|
| `GEMINI_API_KEY` | Yes | Google Gemini API key for architecture generation | - |
| `NEXT_PUBLIC_APP_URL` | Yes | Your application URL | `http://localhost:3000` |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL | - |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anonymous key | - |

### Project Structure

```
cloudforge-ai/
├── app/                          # Next.js App Router
│   ├── api/                      # API routes
│   │   ├── generate-architecture/  # Architecture generation endpoint
│   │   └── review-architecture/    # Review endpoint (future)
│   ├── dashboard/                # Main generation interface
│   ├── architecture/[id]/        # Architecture detail pages
│   ├── history/                  # User's architecture history
│   ├── login/                    # Authentication page
│   └── review/                   # Architecture review (future)
├── components/                   # React components
│   ├── architecture/             # Diagram and visualization
│   ├── ui/                       # UI primitives (buttons, inputs, etc.)
│   └── review/                   # Review components (future)
├── lib/                          # Core utilities
│   ├── gemini.ts                 # Google Gemini integration
│   ├── architecture-schema.ts    # Zod validation schemas
│   ├── json-parser.ts            # JSON parsing and normalization
│   ├── export-utils.ts           # Export functionality
│   └── supabase/                 # Supabase client setup
├── supabase/                     # Database schemas and migrations
│   └── schema.sql                # PostgreSQL schema with RLS
└── types/                        # TypeScript type definitions
```

### Architecture Flow

1. **User Input** → Dashboard form with prompt, cloud provider, and scale
2. **API Request** → POST `/api/generate-architecture` with validated input
3. **AI Generation** → Google Gemini generates structured JSON architecture
4. **Parsing & Validation** → Multi-strategy parsing + Zod schema validation
5. **Normalization** → Service IDs and categories standardized
6. **Database Save** → Architecture stored in Supabase with RLS
7. **Visualization** → React Flow renders interactive diagram
8. **Export Options** → User downloads PNG, PDF, Terraform, or JSON

### Database Schema

```sql
-- Main architectures table
CREATE TABLE architectures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  prompt TEXT NOT NULL,
  cloud_provider TEXT NOT NULL,
  scale TEXT NOT NULL,
  architecture_json JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security policies
ALTER TABLE architectures ENABLE ROW LEVEL SECURITY;

-- Users can only see their own architectures
CREATE POLICY "Users can view own architectures"
  ON architectures FOR SELECT
  USING (auth.uid() = user_id);

-- Users can only insert their own architectures
CREATE POLICY "Users can insert own architectures"
  ON architectures FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can only delete their own architectures
CREATE POLICY "Users can delete own architectures"
  ON architectures FOR DELETE
  USING (auth.uid() = user_id);
```

### Gemini Model Fallback Strategy

CloudForge AI uses an intelligent model fallback sequence to handle quota limits and rate limiting:

1. **gemini-3.5-flash** (primary) - Best balance of speed and quality
2. **gemini-3.1-flash-lite** - Lighter, faster model
3. **gemini-2.5-flash** - Alternative flash model
4. **gemini-2.5-pro** - Highest quality fallback

Automatic retry logic with exponential backoff for transient errors (429, 5xx).

---

## 🛠️ Development

### Available Scripts

```bash
# Development
npm run dev          # Start dev server at http://localhost:3000
npm run build        # Production build
npm start            # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking (via build)
```

### Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript 5.7 (strict mode)
- **Styling**: Tailwind CSS 3.4
- **UI Components**: Custom shadcn/ui-style primitives
- **Diagrams**: React Flow 11
- **Validation**: Zod 3.24
- **Authentication**: Supabase Auth
- **Database**: Supabase PostgreSQL with RLS
- **AI**: Google Gemini API
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Exports**: html-to-image, jsPDF

### Adding New Features

1. **New API Route**: Add to `app/api/` with Zod validation
2. **New Page**: Add to `app/` with layout inheritance
3. **New Component**: Add to `components/` with TypeScript types
4. **New Schema**: Add to `lib/` with Zod validation
5. **Database Changes**: Update `supabase/schema.sql` and run migration

---

## 🚢 Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub**

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/cloudforge-ai.git
git push -u origin main
```

2. **Import to Vercel**

- Visit [vercel.com/new](https://vercel.com/new)
- Import your GitHub repository
- Configure environment variables:
  - `GEMINI_API_KEY`
  - `NEXT_PUBLIC_APP_URL` (your production URL)
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

3. **Deploy**

Click "Deploy" and wait for the build to complete.

4. **Update OAuth Redirects**

In Supabase Dashboard → Authentication → URL Configuration:
- Add your production URL to "Site URL"
- Add `https://your-domain.vercel.app/auth/callback` to "Redirect URLs"

In Google Cloud Console (if using Google OAuth):
- Add `https://your-domain.vercel.app/auth/callback` to authorized redirect URIs

### Deploy to Other Platforms

CloudForge AI can be deployed to any platform supporting Next.js:

- **Netlify**: Use `next build` and `next start`
- **AWS Amplify**: Connect GitHub repo and configure build settings
- **Railway**: One-click deploy with environment variables
- **DigitalOcean App Platform**: Build from GitHub with environment variables

Ensure all environment variables are set in your platform's configuration.

---

## 🔒 Security

### Authentication

- Supabase Auth with email/password and OAuth providers
- Cookie-based session management with automatic refresh
- Protected API routes with middleware validation

### Database Security

- Row Level Security (RLS) on all tables
- User isolation via `auth.uid()` policies
- Prepared statements prevent SQL injection

### API Security

- Input validation with Zod schemas
- Rate limiting via Gemini API
- Error messages don't leak sensitive information

### Best Practices

- Environment variables never committed to git
- Supabase anon key is safe for client-side use (RLS enforced)
- HTTPS enforced in production
- Regular dependency updates via Dependabot

---

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

### Code Style

- Follow existing TypeScript/React patterns
- Use Tailwind CSS for styling
- Add JSDoc comments for complex functions
- Update CLAUDE.md if adding new features

### Reporting Issues

Found a bug? Have a feature request? Please open an issue with:
- Clear description of the problem/feature
- Steps to reproduce (for bugs)
- Expected vs actual behavior
- Screenshots (if applicable)

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Google Gemini** for powerful AI generation
- **Supabase** for authentication and database
- **Vercel** for hosting and deployment
- **React Flow** for diagram visualization
- **shadcn/ui** for component inspiration
- All open-source contributors

---

## 📞 Support

- **Documentation**: Check [CLAUDE.md](CLAUDE.md) for detailed architecture docs
- **Issues**: [GitHub Issues](https://github.com/yourusername/cloudforge-ai/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/cloudforge-ai/discussions)

---

<div align="center">

**Built with ❤️ by the CloudForge AI Team**

[⭐ Star us on GitHub](https://github.com/yourusername/cloudforge-ai) | [🐦 Follow on Twitter](https://twitter.com/yourhandle)

</div>
