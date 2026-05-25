# CloudForge AI - Quick Deployment Commands

Complete command reference for deploying CloudForge AI to GitHub and production.

---

## 🚀 Quick Start: GitHub Setup

### Step 1: Initialize Git and Create First Commit

```bash
# Navigate to project directory
cd /Volumes/SSD/apps/CloudForgeAI

# Initialize Git repository
git init

# Add all files to staging area
git add .

# Create initial commit with descriptive message
git commit -m "Initial commit: CloudForge AI v1.0.0

- AI-powered cloud architecture generator
- Google Gemini integration with model fallback
- React Flow interactive diagrams with auto-layout
- Supabase authentication (Email + Google OAuth)
- PostgreSQL database with Row Level Security
- Export to PNG, PDF, Terraform, and JSON
- Responsive UI with dark/light mode theme
- Complete history management
- Production-ready Next.js 15 application

Tech Stack:
- Next.js 15 (App Router, React 19)
- TypeScript 5.7
- Tailwind CSS 3.4
- React Flow 11
- Supabase Auth & Database
- Google Gemini API
- Zod validation
- Framer Motion"

# Rename branch to main
git branch -M main
```

### Step 2A: GitHub CLI Method (Recommended)

```bash
# Install GitHub CLI if not already installed
# macOS:
brew install gh

# Authenticate with GitHub (first time only)
gh auth login
# Choose: GitHub.com → HTTPS → Yes (authenticate) → Login with browser

# Create repository and push in one command
gh repo create cloudforge-ai \
  --public \
  --source=. \
  --remote=origin \
  --description="AI-powered cloud architecture design generator with interactive diagrams, Supabase auth, and multi-format exports" \
  --push

# Open repository in browser
gh repo view --web
```

### Step 2B: Manual GitHub Method

```bash
# 1. Create repository on GitHub manually:
#    - Go to https://github.com/new
#    - Repository name: cloudforge-ai
#    - Description: AI-powered cloud architecture design generator
#    - Public/Private: Your choice
#    - DO NOT initialize with README, .gitignore, or license
#    - Click "Create repository"

# 2. Add remote origin (replace 'yourusername' with your GitHub username)
git remote add origin https://github.com/yourusername/cloudforge-ai.git

# 3. Push to GitHub
git push -u origin main

# 4. Verify upload
# Visit: https://github.com/yourusername/cloudforge-ai
```

---

## 📦 Production Deployment Options

### Option 1: Vercel (Recommended - One-Click Deploy)

#### Via Vercel CLI

```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod

# Follow prompts and add environment variables when asked:
# - GEMINI_API_KEY
# - NEXT_PUBLIC_APP_URL (your production URL)
# - NEXT_PUBLIC_SUPABASE_URL
# - NEXT_PUBLIC_SUPABASE_ANON_KEY
```

#### Via Vercel Web Dashboard

1. Visit [vercel.com/new](https://vercel.com/new)
2. Click "Import Project"
3. Select your GitHub repository: `cloudforge-ai`
4. Configure:
   - Framework Preset: **Next.js** (auto-detected)
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `.next`
5. Add Environment Variables:
   ```
   GEMINI_API_KEY=AIzaSy...your_key
   NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
   NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...your_key
   ```
6. Click "Deploy"
7. Wait 2-3 minutes for deployment
8. Update Supabase redirect URLs with your Vercel URL

### Option 2: Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Initialize and deploy
netlify init

# Follow prompts:
# - Create & configure new site
# - Build command: npm run build
# - Publish directory: .next

# Add environment variables via dashboard:
# Settings → Build & deploy → Environment → Add variables

# Deploy to production
netlify deploy --prod
```

### Option 3: Railway

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Add environment variables
railway variables set GEMINI_API_KEY=your_key
railway variables set NEXT_PUBLIC_APP_URL=https://your-app.up.railway.app
railway variables set NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
railway variables set NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# Deploy
railway up
```

### Option 4: DigitalOcean App Platform

1. Go to [DigitalOcean App Platform](https://cloud.digitalocean.com/apps)
2. Click "Create App"
3. Connect your GitHub repository
4. Configure:
   - Build Command: `npm run build`
   - Run Command: `npm start`
5. Add environment variables in the dashboard
6. Click "Launch App"

### Option 5: AWS Amplify

1. Go to [AWS Amplify Console](https://console.aws.amazon.com/amplify/)
2. Click "New app" → "Host web app"
3. Connect your GitHub repository
4. Configure:
   - Build settings: Auto-detected for Next.js
5. Add environment variables in "Environment variables" section
6. Click "Save and deploy"

---

## 🔧 Post-Deployment Checklist

### Update Supabase Settings

```bash
# After deployment, update Supabase redirect URLs:
# 1. Go to Supabase Dashboard → Authentication → URL Configuration
# 2. Site URL: https://your-production-domain.com
# 3. Redirect URLs: Add these:
#    - https://your-production-domain.com/auth/callback
#    - https://your-production-domain.com/
```

### Update Google OAuth (if using)

```bash
# In Google Cloud Console:
# 1. APIs & Services → Credentials
# 2. Select your OAuth 2.0 Client ID
# 3. Add to Authorized redirect URIs:
#    - https://your-project-ref.supabase.co/auth/v1/callback
#    - https://your-production-domain.com/auth/callback
```

### Verify Deployment

```bash
# Check these URLs work:
# 1. Homepage: https://your-domain.com
# 2. Login: https://your-domain.com/login
# 3. Dashboard: https://your-domain.com/dashboard (after login)
# 4. API health: https://your-domain.com/api/generate-architecture (POST)
```

---

## 📊 GitHub Repository Setup

### Add Topics

```bash
# Via GitHub CLI
gh repo edit --add-topic "nextjs,typescript,ai,cloud-architecture,react,supabase,gemini,saas,react-flow,architecture-diagram"

# Or manually on GitHub:
# Repository page → Click gear icon next to "About" → Add topics
```

### Enable GitHub Features

```bash
# Enable Discussions
gh repo edit --enable-discussions

# Enable Issues
gh repo edit --enable-issues

# Enable Wiki (optional)
gh repo edit --enable-wiki

# Enable Projects (optional)
gh repo edit --enable-projects
```

### Create First Release

```bash
# Create version tag
git tag -a v1.0.0 -m "CloudForge AI v1.0.0 - Initial Release"

# Push tag to GitHub
git push origin v1.0.0

# Create GitHub Release
gh release create v1.0.0 \
  --title "CloudForge AI v1.0.0 🚀" \
  --notes "## 🎉 Initial Release

Features:
- ✨ AI-powered architecture generation with Google Gemini
- 🎨 Interactive React Flow diagrams
- 🔐 Supabase authentication (Email + Google OAuth)
- 💾 PostgreSQL database with Row Level Security
- 📤 Multi-format exports (PNG, PDF, Terraform, JSON)
- 🌓 Dark/light mode theme
- 📱 Fully responsive design
- 📚 Complete history management

Tech Stack:
- Next.js 15 (React 19)
- TypeScript 5.7
- Tailwind CSS 3.4
- React Flow 11
- Supabase
- Google Gemini API

## 🚀 Getting Started
See [SETUP.md](https://github.com/yourusername/cloudforge-ai/blob/main/SETUP.md) for detailed setup instructions.

## 📖 Documentation
- [README.md](https://github.com/yourusername/cloudforge-ai/blob/main/README.md) - Overview and quick start
- [CLAUDE.md](https://github.com/yourusername/cloudforge-ai/blob/main/CLAUDE.md) - Architecture documentation
- [CONTRIBUTING.md](https://github.com/yourusername/cloudforge-ai/blob/main/CONTRIBUTING.md) - Contribution guidelines"
```

---

## 🛡️ Security Best Practices

### Protect Environment Variables

```bash
# Verify .env files are not tracked
git status
# Should NOT show .env.local or .env

# If accidentally committed, remove from history:
git rm --cached .env.local
git commit -m "Remove .env.local from version control"
git push origin main
```

### Enable Branch Protection

```bash
# Via GitHub CLI
gh api repos/:owner/:repo/branches/main/protection \
  --method PUT \
  --field required_status_checks='null' \
  --field enforce_admins=true \
  --field required_pull_request_reviews='{"required_approving_review_count":1}' \
  --field restrictions='null'

# Or manually:
# Settings → Branches → Add rule → Branch name pattern: main
# ✅ Require pull request reviews before merging
# ✅ Require status checks to pass
```

### Add Dependabot

Create `.github/dependabot.yml`:

```yaml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
    open-pull-requests-limit: 10
```

Commit and push:

```bash
git add .github/dependabot.yml
git commit -m "Add Dependabot configuration"
git push origin main
```

---

## 📈 Monitoring and Analytics

### Add Vercel Analytics (if using Vercel)

```bash
# Install Vercel Analytics
npm install @vercel/analytics

# The analytics are automatically enabled in production
```

### Custom Domain Setup (Vercel)

```bash
# Via Vercel CLI
vercel domains add yourdomain.com

# Via Vercel Dashboard:
# Project Settings → Domains → Add → Enter domain → Add
# Follow DNS configuration instructions
```

---

## 🔄 Continuous Deployment

### Automatic Deployments

Most platforms auto-deploy on push to `main`:

```bash
# Make changes
git add .
git commit -m "feat: add new feature"
git push origin main

# Deployment starts automatically on:
# - Vercel
# - Netlify
# - Railway
# - AWS Amplify
# - DigitalOcean
```

### Manual Deployment Triggers

```bash
# Vercel
vercel --prod

# Netlify
netlify deploy --prod

# Railway
railway up
```

---

## 📝 Maintenance Commands

### Update Dependencies

```bash
# Check for updates
npm outdated

# Update all packages
npm update

# Update specific package
npm update package-name

# Update to latest (may have breaking changes)
npm install package-name@latest
```

### Security Audits

```bash
# Check for vulnerabilities
npm audit

# Fix vulnerabilities automatically
npm audit fix

# Force fix (may introduce breaking changes)
npm audit fix --force
```

### Build and Test Locally

```bash
# Development server
npm run dev

# Production build
npm run build

# Test production build locally
npm run build && npm start

# Lint code
npm run lint
```

---

## 🎯 Final Checklist

Before going live, ensure:

- [ ] All environment variables set correctly
- [ ] Supabase redirect URLs updated
- [ ] Google OAuth redirect URIs updated (if using)
- [ ] Custom domain configured (if applicable)
- [ ] Branch protection enabled
- [ ] Dependabot configured
- [ ] README.md has correct repository URLs
- [ ] GitHub topics added
- [ ] First release created
- [ ] Social preview image uploaded
- [ ] Tested signup/login flow
- [ ] Tested architecture generation
- [ ] Tested all export formats
- [ ] Mobile responsiveness verified
- [ ] Dark/light mode working
- [ ] Error handling verified

---

## 🆘 Troubleshooting

### Build Fails

```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

### Environment Variables Not Working

```bash
# Verify in Vercel/Netlify dashboard
# Redeploy after changing env vars
vercel --prod

# Check .env.local is not committed
git status
```

### Database Connection Issues

```bash
# Verify Supabase credentials
# Check project is not paused (free tier)
# Restart Supabase project if needed
```

---

## 🎉 You're Done!

Your CloudForge AI application is now:
- ✅ Version controlled with Git
- ✅ Hosted on GitHub
- ✅ Deployed to production
- ✅ Accessible to users worldwide

**Next Steps:**
- Share your project on social media
- Submit to Product Hunt
- Write a blog post about building it
- Accept contributions from the community
- Add more features and cloud providers

Happy deploying! 🚀
