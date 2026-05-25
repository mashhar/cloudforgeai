# CloudForge AI - Detailed Setup Guide

This guide walks you through setting up CloudForge AI from scratch, including Supabase configuration and Google Gemini API setup.

## Prerequisites

Before you begin, ensure you have:
- **Node.js 18+** and npm installed
- A **Supabase account** (free tier is sufficient)
- A **Google account** for Gemini API access

## Step 1: Clone and Install

```bash
# Clone the repository
git clone https://github.com/yourusername/cloudforge-ai.git
cd cloudforge-ai

# Install dependencies
npm install
```

## Step 2: Get Your Google Gemini API Key

1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated API key (starts with `AIza...`)

**Note**: Keep this key secure. Never commit it to version control.

## Step 3: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Choose an organization (or create one)
4. Fill in project details:
   - **Name**: cloudforge-ai (or your choice)
   - **Database Password**: Generate a strong password
   - **Region**: Choose closest to your users
5. Click "Create new project" and wait 2-3 minutes

## Step 4: Set Up Database Schema

1. In your Supabase project dashboard, click "SQL Editor" in the sidebar
2. Click "New Query"
3. Copy the contents of `supabase/schema.sql` from this repository
4. Paste into the SQL editor
5. Click "Run" to execute the schema

This creates:
- `architectures` table for storing generated architectures
- Row Level Security (RLS) policies for user isolation
- Indexes for fast queries
- Automatic `updated_at` trigger

## Step 5: Configure Authentication

### Enable Email Authentication

1. In Supabase dashboard, go to "Authentication" → "Providers"
2. **Email** should be enabled by default
3. Under "Email Templates", customize if desired (optional)

### Enable Google OAuth (Optional)

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable "Google+ API"
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Configure OAuth consent screen:
   - User Type: External
   - App name: CloudForge AI
   - Support email: Your email
6. Create OAuth Client ID:
   - Application type: Web application
   - Authorized redirect URIs: `https://your-project-ref.supabase.co/auth/v1/callback`
7. Copy Client ID and Client Secret
8. In Supabase dashboard, go to "Authentication" → "Providers" → "Google"
9. Enable Google and paste Client ID and Client Secret
10. Save

## Step 6: Get Supabase Credentials

1. In Supabase dashboard, click "Settings" → "API"
2. Find these values:
   - **Project URL**: `https://your-project-ref.supabase.co`
   - **Anon/Public Key**: Long string starting with `eyJ...`

**Note**: The anon key is safe for client-side use. Row Level Security protects your data.

## Step 7: Configure Environment Variables

1. Copy the example environment file:

```bash
cp .env.example .env.local
```

2. Edit `.env.local` with your values:

```bash
# Google Gemini API Key
GEMINI_API_KEY=AIzaSy_your_actual_key_here

# Application URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ_your_actual_anon_key_here
```

3. Save the file

**Important**: Never commit `.env.local` to version control!

## Step 8: Start the Development Server

```bash
npm run dev
```

The application will start at [http://localhost:3000](http://localhost:3000)

## Step 9: Test the Application

1. **Sign Up**: Go to [http://localhost:3000/login](http://localhost:3000/login)
   - Enter email and password
   - Check your email for confirmation link (if enabled)
   - Sign in

2. **Generate Architecture**:
   - Go to the Dashboard
   - Enter a prompt: "E-commerce platform with microservices"
   - Select cloud provider: AWS
   - Select scale: Enterprise
   - Click "Generate Architecture"
   - Wait 5-10 seconds for generation

3. **View Results**:
   - Interactive diagram should appear
   - Explore services and connections
   - Try export options (PNG, PDF, Terraform, JSON)

4. **Check History**:
   - Visit History page
   - See your saved architecture
   - Click to view details
   - Delete if needed

## Troubleshooting

### "Invalid API Key" Error

- Verify your Gemini API key is correct in `.env.local`
- Check if the key is active at [Google AI Studio](https://aistudio.google.com/app/apikey)
- Ensure no extra spaces in the environment variable

### "Failed to fetch" or CORS Errors

- Check Supabase URL is correct
- Verify anon key is correct
- Ensure project is not paused (free tier auto-pauses after inactivity)

### Database Connection Errors

- Verify Supabase credentials
- Check if schema was applied correctly (run `supabase/schema.sql` again)
- Ensure RLS policies are enabled

### Authentication Not Working

- Check if email provider is enabled in Supabase
- Verify redirect URLs are correct
- Clear browser cache and cookies
- Check browser console for specific errors

### Architecture Generation Fails

- Check Gemini API quota limits
- Try a simpler prompt first
- Check browser console for specific error messages
- Verify internet connection

### Build Errors

```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Try building again
npm run build
```

## Production Deployment

See [README.md - Deployment](README.md#-deployment) for detailed deployment instructions for Vercel and other platforms.

### Key Points for Production

1. **Update Environment Variables**:
   - Change `NEXT_PUBLIC_APP_URL` to your production domain
   - Keep same Gemini and Supabase keys (or use production keys)

2. **Update Supabase Redirect URLs**:
   - Add production domain to "Site URL"
   - Add `https://your-domain.com/auth/callback` to "Redirect URLs"

3. **Update Google OAuth** (if using):
   - Add production domain to authorized redirect URIs

4. **Enable Production Optimizations**:
   - Next.js automatically optimizes for production
   - Supabase RLS protects your data
   - Consider adding rate limiting for API routes

## Next Steps

- Read [CLAUDE.md](CLAUDE.md) for architecture details
- Check [CONTRIBUTING.md](CONTRIBUTING.md) if you want to contribute
- Explore the codebase and customize to your needs
- Add your own cloud service templates
- Customize the AI prompts for better results

## Getting Help

- **Issues**: [GitHub Issues](https://github.com/yourusername/cloudforge-ai/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/cloudforge-ai/discussions)
- **Documentation**: Check CLAUDE.md for technical details

Happy building! 🚀
