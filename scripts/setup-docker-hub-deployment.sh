#!/bin/bash
# Interactive Docker Hub Deployment Setup Script
# This script guides you through the entire setup process

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions
print_header() {
    echo -e "${BLUE}═══════════════════════════════════════════${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}═══════════════════════════════════════════${NC}"
    echo ""
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_step() {
    echo -e "${BLUE}📌 $1${NC}"
}

# Welcome
print_header "Docker Hub Deployment Setup"
echo "This script will guide you through setting up Docker Hub deployment."
echo ""
read -p "Continue? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    print_error "Setup cancelled"
    exit 1
fi

# Check prerequisites
print_header "Checking Prerequisites"

# Check git
if command -v git &> /dev/null; then
    print_success "Git is installed"
else
    print_error "Git not found. Please install Git first."
    exit 1
fi

# Check if in git repo
if git rev-parse --git-dir > /dev/null 2>&1; then
    print_success "This is a Git repository"
else
    print_error "Not a Git repository. Run this script from your project root."
    exit 1
fi

# Check GitHub CLI
if command -v gh &> /dev/null; then
    print_success "GitHub CLI is installed"
    GH_AVAILABLE=true
else
    print_warning "GitHub CLI not found. You'll need to add secrets manually."
    print_step "Install from: https://cli.github.com"
    GH_AVAILABLE=false
fi

echo ""

# Get repository info
print_header "Repository Information"

REPO_URL=$(git config --get remote.origin.url)
REPO_NAME=$(basename -s .git "$REPO_URL")

echo "Repository URL: $REPO_URL"
echo "Repository Name: $REPO_NAME"
echo ""

# Docker Hub Setup
print_header "Step 1: Docker Hub Account"
echo "You need to create a Docker Hub account and access token."
echo ""
echo "1. Go to: https://hub.docker.com/signup"
echo "2. Create an account (if you don't have one)"
echo "3. Go to: https://hub.docker.com/settings/security"
echo "4. Click 'New Access Token'"
echo "5. Name it: 'github-actions'"
echo "6. Keep 'Read, Write, Delete' selected"
echo "7. Copy the token (you won't see it again!)"
echo ""
read -p "Do you have your Docker Hub username ready? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    print_warning "Skipping Docker Hub setup. Come back when you have your credentials."
else
    read -p "Enter your Docker Hub username: " DOCKERHUB_USERNAME
    read -s -p "Enter your Docker Hub access token: " DOCKERHUB_TOKEN
    echo ""
    print_success "Docker Hub credentials captured"
fi

echo ""

# SSH Setup
print_header "Step 2: SSH Key Setup"
echo "You need SSH access to your server to deploy."
echo ""

SSH_KEY_PATH="$HOME/.ssh/deploy_key"

if [ -f "$SSH_KEY_PATH" ]; then
    print_warning "SSH key already exists at $SSH_KEY_PATH"
    read -p "Use existing key? (y/n) " -n 1 -r
    echo
    USE_EXISTING_KEY=$([[ $REPLY =~ ^[Yy]$ ]] && echo "yes" || echo "no")
else
    USE_EXISTING_KEY="no"
fi

if [ "$USE_EXISTING_KEY" != "yes" ]; then
    print_step "Generating new SSH key..."
    ssh-keygen -t ed25519 -f "$SSH_KEY_PATH" -N ""
    print_success "SSH key generated at $SSH_KEY_PATH"
fi

echo ""
echo "Your SSH public key:"
echo "────────────────────────────────────────"
cat "$SSH_KEY_PATH.pub"
echo "────────────────────────────────────────"
echo ""
print_step "Copy the above public key and add it to your server:"
echo "  1. SSH into your server"
echo "  2. Run: cat >> ~/.ssh/authorized_keys"
echo "  3. Paste the key above"
echo "  4. Press Ctrl+D"
echo ""
read -p "Have you added the public key to your server? (y/n) " -n 1 -r
echo

if [[ $REPLY =~ ^[Yy]$ ]]; then
    # Test SSH connection
    read -p "Enter server address (e.g., 192.168.1.100 or example.com): " SERVER_HOST
    read -p "Enter SSH username (e.g., ubuntu): " SERVER_USER
    
    print_step "Testing SSH connection..."
    if ssh -i "$SSH_KEY_PATH" -o ConnectTimeout=5 -o StrictHostKeyChecking=no "$SERVER_USER@$SERVER_HOST" "echo 'SSH connection successful'" > /dev/null 2>&1; then
        print_success "SSH connection works!"
    else
        print_warning "SSH connection failed. Check your credentials and try again."
    fi
fi

echo ""

# GitHub Secrets Setup
print_header "Step 3: Add GitHub Secrets"

if [ $GH_AVAILABLE = true ]; then
    echo "Using GitHub CLI to add secrets..."
    echo ""
    
    # Check if user is authenticated
    if ! gh auth status > /dev/null 2>&1; then
        print_step "You need to authenticate with GitHub"
        gh auth login
    fi
    
    if [ -n "$DOCKERHUB_USERNAME" ] && [ -n "$DOCKERHUB_TOKEN" ]; then
        print_step "Adding Docker Hub secrets..."
        gh secret set DOCKERHUB_USERNAME --body "$DOCKERHUB_USERNAME"
        gh secret set DOCKERHUB_TOKEN --body "$DOCKERHUB_TOKEN"
        print_success "Docker Hub secrets added"
    fi
    
    if [ -n "$SERVER_HOST" ] && [ -n "$SERVER_USER" ]; then
        print_step "Adding server deployment secrets..."
        gh secret set DEPLOY_HOST --body "$SERVER_HOST"
        gh secret set DEPLOY_USER --body "$SERVER_USER"
        
        read -p "Enter deployment path (e.g., /home/ubuntu/door-service): " DEPLOY_PATH
        gh secret set DEPLOY_PATH --body "$DEPLOY_PATH"
        
        DEPLOY_SSH_KEY=$(cat "$SSH_KEY_PATH")
        gh secret set DEPLOY_SSH_KEY --body "$DEPLOY_SSH_KEY"
        
        print_success "Server secrets added"
    fi
    
    echo ""
    print_step "Verifying secrets..."
    gh secret list
else
    print_step "Manually add these secrets to GitHub:"
    echo ""
    echo "Go to: Settings → Secrets and variables → Actions → New repository secret"
    echo ""
    if [ -n "$DOCKERHUB_USERNAME" ]; then
        echo "1. Name: DOCKERHUB_USERNAME"
        echo "   Value: $DOCKERHUB_USERNAME"
        echo ""
    fi
    if [ -n "$DOCKERHUB_TOKEN" ]; then
        echo "2. Name: DOCKERHUB_TOKEN"
        echo "   Value: (your access token)"
        echo ""
    fi
    if [ -n "$SERVER_HOST" ]; then
        echo "3. Name: DEPLOY_HOST"
        echo "   Value: $SERVER_HOST"
        echo ""
        echo "4. Name: DEPLOY_USER"
        echo "   Value: $SERVER_USER"
        echo ""
        echo "5. Name: DEPLOY_PATH"
        echo "   Value: (your app path)"
        echo ""
    fi
    
    echo "6. Name: DEPLOY_SSH_KEY"
    echo "   Value: (paste contents of $SSH_KEY_PATH)"
    echo ""
fi

echo ""

# Server Setup
print_header "Step 4: Server Setup"

if [ -n "$SERVER_HOST" ] && [ -n "$SERVER_USER" ]; then
    echo "Now we need to set up your server..."
    echo ""
    
    read -p "Would you like help setting up the server? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_step "SSH into your server to run these commands:"
        echo ""
        echo "─────────────────────────────────────────────"
        echo "# Update system"
        echo "sudo apt update && sudo apt upgrade -y"
        echo ""
        echo "# Install Docker"
        echo "curl -fsSL https://get.docker.com -o get-docker.sh"
        echo "sudo sh get-docker.sh"
        echo "sudo usermod -aG docker \$USER"
        echo ""
        echo "# Install Docker Compose"
        echo "sudo apt install -y docker-compose"
        echo ""
        echo "# Create app directory"
        echo "mkdir -p $DEPLOY_PATH"
        echo "cd $DEPLOY_PATH"
        echo ""
        echo "# Create docker-compose.yml (copy from your repo)"
        echo "# Create .env file with your secrets"
        echo "─────────────────────────────────────────────"
        echo ""
        echo "Once done, test: docker ps"
        echo ""
    fi
fi

echo ""

# Final Summary
print_header "Setup Complete! 🎉"
echo ""
echo "Next steps:"
echo ""
echo "1. ✅ Docker Hub account created"
echo "2. ✅ SSH key generated and added to server"
echo "3. ✅ GitHub secrets configured"
echo "4. ✅ Server set up with Docker"
echo ""
echo "Now you can deploy by pushing code:"
echo ""
echo "  git add ."
echo "  git commit -m 'Ready for deployment'"
echo "  git push origin main"
echo ""
echo "Watch your deployment:"
echo "  GitHub → Actions → Monitor workflow"
echo ""
echo "For detailed documentation, see:"
echo "  - DOCKER_HUB_GUIDE.md (complete guide)"
echo "  - QUICK_REFERENCE.md (quick commands)"
echo ""
print_success "Setup complete! Happy deploying! 🚀"
