#!/bin/bash
# Quick deployment setup script
# This script helps set up your deployment environment

set -e

echo "🚀 Door Service Backend - Deployment Setup"
echo "=========================================="
echo ""

# Check if GitHub CLI is installed
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI is required. Install from: https://cli.github.com"
    exit 1
fi

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo "❌ Not a git repository. Run this script from your project root."
    exit 1
fi

echo "✅ Prerequisites check passed"
echo ""

# Get repository info
REPO_OWNER=$(gh repo view --json owner --jq .owner.login)
REPO_NAME=$(gh repo view --json name --jq .name)
REPO_URL="ghcr.io/${REPO_OWNER,,}/${REPO_NAME,,}"

echo "📦 Repository Information:"
echo "   Owner: $REPO_OWNER"
echo "   Name: $REPO_NAME"
echo "   Image URL: $REPO_URL"
echo ""

# Check if secrets exist
echo "🔐 Checking GitHub Secrets..."
SECRETS=$(gh secret list)

echo ""
echo "📝 Available deployment options:"
echo ""
echo "1️⃣  VPS/Self-hosted (SSH)"
echo "   Required secrets: DEPLOY_HOST, DEPLOY_USER, DEPLOY_SSH_KEY"
echo ""
echo "2️⃣  AWS ECS"
echo "   Required secrets: AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION"
echo ""
echo "3️⃣  Azure Container Instances"
echo "   Required secrets: AZURE_CREDENTIALS, AZURE_RESOURCE_GROUP"
echo ""
echo "4️⃣  DigitalOcean"
echo "   Required secrets: DIGITALOCEAN_TOKEN, DIGITALOCEAN_APP_ID"
echo ""

echo "For detailed setup instructions, see DEPLOYMENT_GUIDE.md"
echo ""
echo "✨ Next steps:"
echo "   1. Choose your deployment platform"
echo "   2. Add required secrets: gh secret set KEY_NAME"
echo "   3. Uncomment deployment steps in .github/workflows/deploy.yml"
echo "   4. Push code to trigger workflows: git push"
echo ""
