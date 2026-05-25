# GitHub Setup Guide for CloudForge AI

This guide provides step-by-step instructions to initialize Git, create a GitHub repository, and push CloudForge AI to GitHub.

## Prerequisites

- Git installed on your system
- GitHub account created
- GitHub CLI (`gh`) installed (optional but recommended)

## Option 1: Using GitHub CLI (Recommended)

The GitHub CLI (`gh`) makes repository creation simpler.

### Install GitHub CLI

**macOS:**
```bash
brew install gh
```

**Windows:**
```bash
winget install --id GitHub.cli
```

**Linux:**
```bash
# Debian/Ubuntu
sudo apt install gh

# Fedora/RHEL
sudo dnf install gh
```

### Setup Commands

```bash
# 1. Initialize Git repository
git init

# 2. Add all files to staging
git add .

# 3. Create initial commit
git commit -m "Initial commit: CloudForge AI - AI-powered cloud architecture generator

Features:
- Google Gemini integration for architecture generation
- React Flow interactive diagrams
- Supabase authentication and database
- Export to PNG, PDF, Terraform, and JSON
- Responsive UI with dark/light mode
- History management with RLS policies"

# 4. Rename branch to main (if needed)
git branch -M main

# 5. Authenticate with GitHub (first time only)
gh auth login
# Follow the prompts to authenticate

# 6. Create GitHub repository and push
gh repo create cloudforge-ai --public --source=. --remote=origin --push

# That's it! Your repository is now on GitHub
```

### Open Repository in Browser

```bash
gh repo view --web
```

## Option 2: Using GitHub Web Interface

If you don't want to use the GitHub CLI, follow these steps:

### 1. Initialize Local Git Repository

```bash
# Initialize Git
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: CloudForge AI - AI-powered cloud architecture generator"

# Rename branch to main
git branch -M main
```

### 2. Create GitHub Repository

1. Go to [github.com](https://github.com)
2. Click the "+" icon in the top right
3. Select "New repository"
4. Fill in the details:
   - **Repository name**: `cloudforge-ai`
   - **Description**: "AI-powered cloud architecture design generator with interactive diagrams"
   - **Visibility**: Public or Private (your choice)
   - **DO NOT** initialize with README, .gitignore, or license (we already have these)
5. Click "Create repository"

### 3. Connect Local Repository to GitHub

After creating the repository, GitHub will show you commands. Use these:

```bash
# Add GitHub as remote origin
git remote add origin https://github.com/yourusername/cloudforge-ai.git

# Push to GitHub
git push -u origin main
```

## Verify Upload

Visit your repository on GitHub:
```
https://github.com/yourusername/cloudforge-ai
```

You should see:
- ✅ README.md displayed on the homepage
- ✅ All project files and folders
- ✅ Badges and documentation
- ✅ LICENSE file
- ✅ CONTRIBUTING.md

## Next Steps

### Add Topics to Your Repository

Add relevant topics to help others discover your project:

1. Go to your repository on GitHub
2. Click the gear icon next to "About"
3. Add topics:
   - `nextjs`
   - `typescript`
   - `ai`
   - `cloud-architecture`
   - `react`
   - `supabase`
   - `gemini`
   - `architecture-diagram`
   - `saas`
   - `react-flow`
4. Add website URL (if deployed)
5. Save changes

### Update Repository Settings

**Branch Protection** (recommended for production):
1. Go to Settings → Branches
2. Add rule for `main` branch
3. Enable:
   - Require pull request reviews before merging
   - Require status checks to pass before merging
   - Include administrators

**GitHub Actions** (optional):
1. Add `.github/workflows/ci.yml` for automated testing
2. Add `.github/workflows/deploy.yml` for automated deployment

### Create GitHub Pages (optional)

If you want to host documentation:

1. Settings → Pages
2. Source: Deploy from branch
3. Branch: `main` / `docs` (if you create a docs folder)
4. Save

### Add Social Preview Image

1. Create a 1280x640px image showcasing your app
2. Settings → General
3. Social preview → Upload image
4. This image appears when sharing on social media

### Set Up GitHub Discussions

Enable community discussions:

1. Settings → General
2. Features → Discussions → Check the box
3. Set up categories:
   - General
   - Q&A
   - Ideas
   - Show and Tell

### Configure Issue Templates

Create `.github/ISSUE_TEMPLATE/` folder with templates:

**Bug Report** (`.github/ISSUE_TEMPLATE/bug_report.md`):
```markdown
---
name: Bug Report
about: Create a report to help us improve
title: '[BUG] '
labels: bug
assignees: ''
---

**Describe the bug**
A clear and concise description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected behavior**
A clear and concise description of what you expected to happen.

**Screenshots**
If applicable, add screenshots to help explain your problem.

**Environment:**
 - OS: [e.g. iOS]
 - Browser [e.g. chrome, safari]
 - Version [e.g. 22]

**Additional context**
Add any other context about the problem here.
```

**Feature Request** (`.github/ISSUE_TEMPLATE/feature_request.md`):
```markdown
---
name: Feature Request
about: Suggest an idea for this project
title: '[FEATURE] '
labels: enhancement
assignees: ''
---

**Is your feature request related to a problem? Please describe.**
A clear and concise description of what the problem is. Ex. I'm always frustrated when [...]

**Describe the solution you'd like**
A clear and concise description of what you want to happen.

**Describe alternatives you've considered**
A clear and concise description of any alternative solutions or features you've considered.

**Additional context**
Add any other context or screenshots about the feature request here.
```

## Update README with Correct URLs

After creating your repository, update these placeholder URLs in README.md:

1. Repository URL: Replace `yourusername` with your GitHub username
2. Issue tracker: Update issue links
3. Discussions: Update discussion links
4. Social links: Add your Twitter/social handles

Example search-and-replace:
```bash
# Replace placeholder username
sed -i '' 's/yourusername/your-actual-username/g' README.md
```

## Deploy to Vercel

Once on GitHub, deploy to Vercel:

```bash
# Install Vercel CLI (optional)
npm i -g vercel

# Deploy
vercel

# Or visit https://vercel.com/new and import your repository
```

## Promote Your Project

Share your project:

1. **Twitter/X**: Share with hashtags #CloudArchitecture #AI #NextJS #OpenSource
2. **Reddit**: Post to r/SideProject, r/webdev, r/opensource
3. **Hacker News**: Submit to Show HN
4. **Dev.to**: Write an article about building it
5. **Product Hunt**: Launch your product
6. **LinkedIn**: Share your achievement

## Maintenance

Keep your repository healthy:

### Regular Updates

```bash
# Update dependencies
npm update

# Check for outdated packages
npm outdated

# Audit security vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix
```

### Git Best Practices

```bash
# Create feature branches
git checkout -b feature/new-feature

# Make changes and commit
git add .
git commit -m "feat: add new feature"

# Push to GitHub
git push origin feature/new-feature

# Create pull request on GitHub
# Merge after review
```

### Version Tagging

When releasing versions:

```bash
# Create a tag
git tag -a v1.0.0 -m "Release version 1.0.0"

# Push tag to GitHub
git push origin v1.0.0

# Create a GitHub Release from the tag
gh release create v1.0.0 --title "v1.0.0" --notes "Initial release"
```

## Troubleshooting

### Authentication Issues

If you get authentication errors:

```bash
# Clear GitHub credentials
gh auth logout

# Re-authenticate
gh auth login
```

### Large File Issues

If you accidentally committed large files:

```bash
# Remove from Git history
git filter-branch --tree-filter 'rm -f path/to/large/file' HEAD

# Or use BFG Repo-Cleaner (recommended)
brew install bfg
bfg --delete-files large-file.zip
git reflog expire --expire=now --all
git gc --prune=now --aggressive
```

### Rejected Push

If push is rejected:

```bash
# Pull latest changes first
git pull origin main --rebase

# Resolve conflicts if any
git add .
git rebase --continue

# Push again
git push origin main
```

## Conclusion

Your CloudForge AI project is now on GitHub! 🎉

Next steps:
- Add badges to README
- Set up CI/CD
- Deploy to production
- Share with the community
- Accept contributions

Happy coding! 🚀
