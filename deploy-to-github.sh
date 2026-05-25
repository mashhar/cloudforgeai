#!/bin/bash

# CloudForge AI - GitHub Deployment Script
# This script automates the process of deploying CloudForge AI to GitHub

set -e  # Exit on error

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Banner
echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                                                                ║"
echo "║           CloudForge AI - GitHub Deployment Script            ║"
echo "║                                                                ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo -e "${RED}❌ Git is not installed. Please install Git first.${NC}"
    echo "   Visit: https://git-scm.com/downloads"
    exit 1
fi

echo -e "${GREEN}✅ Git is installed${NC}"

# Check if gh CLI is installed
if ! command -v gh &> /dev/null; then
    echo -e "${YELLOW}⚠️  GitHub CLI (gh) is not installed.${NC}"
    echo ""
    echo "Would you like to:"
    echo "1) Install GitHub CLI (recommended)"
    echo "2) Continue with manual GitHub setup"
    read -p "Enter choice (1 or 2): " gh_choice

    if [ "$gh_choice" = "1" ]; then
        echo ""
        echo -e "${BLUE}Installing GitHub CLI...${NC}"

        # Detect OS and install
        if [[ "$OSTYPE" == "darwin"* ]]; then
            # macOS
            if command -v brew &> /dev/null; then
                brew install gh
            else
                echo -e "${RED}Homebrew not found. Please install from: https://brew.sh${NC}"
                exit 1
            fi
        elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
            # Linux
            echo "Please install GitHub CLI manually:"
            echo "https://github.com/cli/cli/blob/trunk/docs/install_linux.md"
            exit 1
        else
            echo -e "${RED}Unsupported OS. Please install GitHub CLI manually.${NC}"
            echo "Visit: https://cli.github.com/"
            exit 1
        fi
    else
        echo ""
        echo -e "${YELLOW}Continuing with manual setup...${NC}"
        echo "After running this script, follow the instructions in GITHUB_SETUP.md"
        echo ""
    fi
else
    echo -e "${GREEN}✅ GitHub CLI is installed${NC}"
fi

# Check if already a git repository
if [ -d .git ]; then
    echo -e "${YELLOW}⚠️  This is already a git repository.${NC}"
    read -p "Do you want to continue and potentially overwrite? (y/n): " overwrite
    if [ "$overwrite" != "y" ]; then
        echo "Aborted."
        exit 0
    fi
fi

echo ""
echo -e "${BLUE}Step 1: Initializing Git repository...${NC}"
git init
echo -e "${GREEN}✅ Git repository initialized${NC}"

echo ""
echo -e "${BLUE}Step 2: Adding files to Git...${NC}"
git add .
echo -e "${GREEN}✅ Files added${NC}"

echo ""
echo -e "${BLUE}Step 3: Creating initial commit...${NC}"
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

echo -e "${GREEN}✅ Initial commit created${NC}"

echo ""
echo -e "${BLUE}Step 4: Renaming branch to main...${NC}"
git branch -M main
echo -e "${GREEN}✅ Branch renamed to main${NC}"

# If GitHub CLI is available, use it
if command -v gh &> /dev/null; then
    echo ""
    echo -e "${BLUE}Step 5: Authenticating with GitHub...${NC}"

    # Check if already authenticated
    if gh auth status &> /dev/null; then
        echo -e "${GREEN}✅ Already authenticated with GitHub${NC}"
    else
        echo "Please authenticate with GitHub..."
        gh auth login
    fi

    echo ""
    echo -e "${BLUE}Step 6: Creating GitHub repository...${NC}"
    echo ""
    echo "Repository name: cloudforge-ai"
    echo "Description: AI-powered cloud architecture design generator"
    echo ""
    read -p "Make repository public? (y/n, default: y): " visibility
    visibility=${visibility:-y}

    if [ "$visibility" = "y" ]; then
        visibility_flag="--public"
    else
        visibility_flag="--private"
    fi

    gh repo create cloudforge-ai \
        $visibility_flag \
        --source=. \
        --remote=origin \
        --description="AI-powered cloud architecture design generator with interactive diagrams, Supabase auth, and multi-format exports" \
        --push

    echo ""
    echo -e "${GREEN}✅ Repository created and pushed to GitHub!${NC}"

    echo ""
    echo -e "${BLUE}Step 7: Opening repository in browser...${NC}"
    gh repo view --web

else
    # Manual instructions
    echo ""
    echo -e "${YELLOW}═══════════════════════════════════════════════════════════════${NC}"
    echo -e "${YELLOW}Manual GitHub Setup Required${NC}"
    echo -e "${YELLOW}═══════════════════════════════════════════════════════════════${NC}"
    echo ""
    echo "1. Go to: https://github.com/new"
    echo "2. Repository name: cloudforge-ai"
    echo "3. Description: AI-powered cloud architecture design generator"
    echo "4. Choose Public or Private"
    echo "5. DO NOT initialize with README, .gitignore, or license"
    echo "6. Click 'Create repository'"
    echo ""
    echo "7. After creating, run these commands:"
    echo ""
    echo -e "${BLUE}   git remote add origin https://github.com/YOUR-USERNAME/cloudforge-ai.git${NC}"
    echo -e "${BLUE}   git push -u origin main${NC}"
    echo ""
fi

echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                                                                ║"
echo "║                    🎉 Deployment Complete! 🎉                  ║"
echo "║                                                                ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""
echo -e "${GREEN}Next steps:${NC}"
echo ""
echo "1. Add screenshots to public/screenshots/"
echo "2. Update repository URLs in documentation (replace 'yourusername')"
echo "3. Deploy to production (see DEPLOYMENT_COMMANDS.md)"
echo "4. Configure Supabase redirect URLs"
echo "5. Add GitHub topics and enable features"
echo ""
echo -e "${BLUE}Documentation:${NC}"
echo "  - Quick Start: QUICK_START.md"
echo "  - Setup Guide: SETUP.md"
echo "  - Deployment: DEPLOYMENT_COMMANDS.md"
echo "  - Full Checklist: PROJECT_READY.txt"
echo ""
echo "Good luck with your launch! 🚀"
echo ""
