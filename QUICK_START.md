# ⚡ CloudForge AI - Quick Start Reference

Ultra-fast reference for common operations.

---

## 🚀 Deploy to GitHub (30 seconds)

```bash
git init
git add .
git commit -m "Initial commit: CloudForge AI v1.0.0"
git branch -M main
gh auth login  # First time only
gh repo create cloudforge-ai --public --source=. --remote=origin --push
gh repo view --web
```

---

## 🌐 Deploy to Vercel (2 minutes)

**Option 1: CLI**
```bash
npm i -g vercel
vercel login
vercel --prod
# Add env vars when prompted
```

**Option 2: Web**
1. Go to [vercel.com/new](https://vercel.com/new)
2. Import GitHub repo: `cloudforge-ai`
3. Add environment variables (see below)
4. Click Deploy

---

## 🔑 Environment Variables

Copy to your deployment platform:

```bash
GEMINI_API_KEY=your_gemini_api_key_here
NEXT_PUBLIC_APP_URL=https://your-domain.com
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...your_anon_key
```

**Get Keys:**
- Gemini: [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
- Supabase: [supabase.com](https://supabase.com) → New Project → Settings → API

---

## 💾 Supabase Setup (5 minutes)

```sql
-- 1. Create Supabase project at supabase.com
-- 2. Go to SQL Editor
-- 3. Run this (from supabase/schema.sql):

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

CREATE INDEX idx_architectures_user_id ON architectures(user_id);
CREATE INDEX idx_architectures_created_at ON architectures(created_at DESC);

ALTER TABLE architectures ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own architectures"
  ON architectures FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own architectures"
  ON architectures FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own architectures"
  ON architectures FOR DELETE
  USING (auth.uid() = user_id);
```

---

## 🏃 Local Development

```bash
# Install
npm install

# Copy environment file
cp .env.example .env.local
# Edit .env.local with your keys

# Run
npm run dev
# Open http://localhost:3000
```

---

## 📦 Production Commands

```bash
# Build
npm run build

# Test build locally
npm start

# Deploy
vercel --prod        # Vercel
netlify deploy --prod # Netlify
railway up           # Railway
```

---

## 🔧 Common Tasks

**Update Dependencies:**
```bash
npm update && npm audit fix
```

**New Feature Branch:**
```bash
git checkout -b feature/my-feature
# Make changes
git add .
git commit -m "feat: add my feature"
git push origin feature/my-feature
```

**Create Release:**
```bash
git tag -a v1.1.0 -m "Release v1.1.0"
git push origin v1.1.0
gh release create v1.1.0 --title "v1.1.0" --notes "Release notes here"
```

**Rollback Deployment (Vercel):**
```bash
vercel rollback
```

---

## 🐛 Troubleshooting

**Build fails:**
```bash
rm -rf .next node_modules
npm install
npm run build
```

**Environment variables not working:**
- Redeploy after changing env vars
- Check for typos in variable names
- Ensure no trailing spaces

**Supabase connection fails:**
- Verify project URL and anon key
- Check if project is paused (free tier)
- Restart project in Supabase dashboard

**Authentication not working:**
- Enable email provider in Supabase
- Check redirect URLs match your domain
- Clear browser cache and cookies

---

## 📚 Full Documentation

- **Setup Guide**: See [SETUP.md](SETUP.md)
- **GitHub Guide**: See [GITHUB_SETUP.md](GITHUB_SETUP.md)
- **Deployment**: See [DEPLOYMENT_COMMANDS.md](DEPLOYMENT_COMMANDS.md)
- **Architecture**: See [CLAUDE.md](CLAUDE.md)
- **Contributing**: See [CONTRIBUTING.md](CONTRIBUTING.md)

---

## 🆘 Get Help

- **Issues**: [github.com/yourusername/cloudforge-ai/issues](https://github.com/yourusername/cloudforge-ai/issues)
- **Docs**: Check full documentation files above
- **Community**: GitHub Discussions

---

**Built with ❤️ using Next.js 15, TypeScript, Supabase, and Google Gemini**
