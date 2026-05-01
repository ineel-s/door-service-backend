# GitHub Actions Deployment - Quick Start Guide

## What Has Been Created

I've created a complete GitHub Actions CI/CD pipeline for your Door Service Backend application. Here's what was set up:

### 📁 New Files Created:

```
.github/
  workflows/
    ├── docker-build-and-push.yml    # Builds Docker image, pushes to GHCR
    └── deploy.yml                    # Deploys to your chosen platform
DEPLOYMENT_GUIDE.md                   # Comprehensive deployment guide
scripts/
  └── deployment-setup.sh             # Helper script for setup
docker-compose.prod.yml.example       # Production Docker Compose config
```

---

## 🚀 Complete Deployment Flow

### **Phase 1: Build (Automatic)**
When you push code to GitHub:
```
Your Code Push → GitHub Actions Triggered
                ↓
    Step 1: Check out your code
    Step 2: Set up Docker builder
    Step 3: Authenticate to GitHub Container Registry (GHCR)
    Step 4: Build Docker image with Node.js dependencies
    Step 5: Push image to ghcr.io/your-username/door-service-backend
    ↓
Docker Image Ready for Deployment
```

### **Phase 2: Deploy (Requires Configuration)**
After build succeeds:
```
Docker Image Ready
     ↓
Deploy Workflow Triggered (can be automatic or manual)
     ↓
Choose Platform → Configure Secrets → Run Deployment
```

---

## 📋 Setup Checklist

### **1. Enable GitHub Actions** ✓ (Auto-enabled by default)

### **2. Configure Deployment Platform**
Choose ONE platform and follow the setup:

#### **Option A: VPS/Linux Server (Easiest)**
✅ **Best for**: Personal projects, existing servers
- Generate SSH key: `ssh-keygen -t ed25519 -f ~/.ssh/deploy`
- Add to server: `cat ~/.ssh/deploy.pub >> ~/.ssh/authorized_keys`
- Add GitHub secrets:
  - `DEPLOY_HOST`: your.server.com
  - `DEPLOY_USER`: ubuntu (or your username)
  - `DEPLOY_SSH_KEY`: (paste contents of ~/.ssh/deploy)
- Server setup:
  ```bash
  # Install Docker
  curl -fsSL https://get.docker.com -o get-docker.sh
  sh get-docker.sh
  sudo usermod -aG docker $USER
  
  # Create app directory
  mkdir -p /home/ubuntu/door-service
  cd /home/ubuntu/door-service
  cp docker-compose.yml .
  ```
- Update `deploy.yml` line 63-70 with your server path

#### **Option B: AWS ECS**
✅ **Best for**: Scalability, high availability
- Create ECS cluster on AWS Console
- Create IAM user with ECS permissions
- Generate access keys
- Add GitHub secrets:
  - `AWS_ACCESS_KEY_ID`
  - `AWS_SECRET_ACCESS_KEY`
- Update `deploy.yml` line 78-88 with your cluster/service names

#### **Option C: Azure Container Instances**
✅ **Best for**: Microsoft ecosystem integration
- Create Azure resource group
- Create service principal: `az ad sp create-for-rbac --role contributor --scopes /subscriptions/{id}`
- Add GitHub secrets:
  - `AZURE_CREDENTIALS`
  - `AZURE_RESOURCE_GROUP`
- Uncomment lines 90-98 in `deploy.yml`

#### **Option D: DigitalOcean**
✅ **Best for**: Simplicity, affordable
- Create DigitalOcean App
- Generate API token
- Add GitHub secrets:
  - `DIGITALOCEAN_TOKEN`
  - `DIGITALOCEAN_APP_ID`
- Uncomment lines 100-108 in `deploy.yml`

### **3. Add GitHub Secrets**
Go to: **Settings → Secrets and variables → Actions → New repository secret**

For SSH deployment:
```bash
# Generate keys
ssh-keygen -t ed25519 -f ~/.ssh/deploy_key -N ""

# Copy private key (paste as DEPLOY_SSH_KEY)
cat ~/.ssh/deploy_key

# Add public key to server
cat ~/.ssh/deploy_key.pub | ssh user@host "cat >> ~/.ssh/authorized_keys"
```

### **4. Configure deploy.yml**
Edit `.github/workflows/deploy.yml`:
- Uncomment your chosen platform's deployment step
- Update configuration values (hosts, paths, cluster names, etc.)
- Save and commit

---

## 🎯 Step-by-Step: First Deployment

### Step 1: Choose Your Platform
Decide where to deploy (see options above)

### Step 2: Gather Required Information
```bash
# For SSH: your server details
ssh_host = your.server.ip.com
ssh_user = ubuntu
ssh_private_key = (from ~/.ssh/deploy_key)

# For AWS: cluster and service names
cluster_name = my-ecs-cluster
service_name = door-service
```

### Step 3: Add Secrets to GitHub
```bash
# Example for SSH
gh secret set DEPLOY_HOST --body "your.server.com"
gh secret set DEPLOY_USER --body "ubuntu"
gh secret set DEPLOY_SSH_KEY < ~/.ssh/deploy_key
```

### Step 4: Update Workflow File
Edit `.github/workflows/deploy.yml`:
```yaml
script: |
  cd /home/ubuntu/door-service  # Your actual path
  docker pull ${{ steps.image.outputs.image }}
  docker-compose down
  docker-compose up -d
```

### Step 5: Commit and Push
```bash
git add .github/workflows/ DEPLOYMENT_GUIDE.md scripts/
git commit -m "Add GitHub Actions CI/CD pipeline"
git push origin main
```

### Step 6: Monitor Build
1. Go to GitHub → **Actions** tab
2. Watch **Build and Push Docker Image** workflow
3. Check logs for any errors
4. After build succeeds, deployment workflow runs

### Step 7: Verify Deployment
```bash
# SSH into your server
ssh user@your-server.com

# Check if app is running
docker ps
docker logs door-service-backend

# Test application
curl http://localhost:3000/health
```

---

## 📊 Understanding the Workflows

### **docker-build-and-push.yml** (Always runs)

**Triggers:**
- Push to `main` branch
- Push to `develop` branch  
- Push of version tags (v1.0.0, etc.)
- Pull requests (builds but doesn't push)

**What it does:**
1. Checks out your code
2. Builds Docker image using your Dockerfile
3. Pushes to GitHub Container Registry at: `ghcr.io/your-username/door-service-backend:TAG`
4. Auto-generates tags:
   - `latest` (on main branch)
   - `main`, `develop` (branch name)
   - `v1.0.0` (semantic version)
   - `main-abc1234def` (commit SHA)

**Example output:**
```
Image URL: ghcr.io/neel/door-service-backend:latest
Image URL: ghcr.io/neel/door-service-backend:v1.0.0
```

### **deploy.yml** (Needs configuration)

**Triggers:**
- After successful build push to main
- Manual trigger: **Actions → Deploy to Production → Run workflow**

**What it does:**
1. Gets the Docker image URL from build
2. Connects to your deployment platform
3. Pulls the new Docker image
4. Restarts the application with new image
5. (Optional) Sends Slack notification

---

## 🔑 Key Docker Image Tags

Your application gets automatically tagged with:

| Scenario | Tag | Usage |
|----------|-----|-------|
| Push to main | `latest`, `main` | Production |
| Push to develop | `develop` | Staging |
| Release v1.0.0 | `v1.0.0` | Specific version |
| Any commit | `main-abc1234` | Debugging/rollback |

---

## 🛠️ Manual Deployment (Without GitHub Actions)

If you need to deploy manually:

```bash
# 1. Build image locally
docker build -t door-service-backend:latest .

# 2. Tag it
docker tag door-service-backend:latest ghcr.io/your-username/door-service-backend:latest

# 3. Push to registry
docker push ghcr.io/your-username/door-service-backend:latest

# 4. On your server
ssh user@server.com
cd /home/ubuntu/door-service
docker pull ghcr.io/your-username/door-service-backend:latest
docker-compose down
docker-compose up -d
```

---

## 🐛 Troubleshooting

### Build fails: "npm install error"
```bash
# Problem: Dependencies not installing
# Solution: Check package.json, ensure Node 18+ compatible

# Test locally:
npm install
npm run build
```

### Push fails: "No permissions to push to registry"
- Ensure GITHUB_TOKEN has `packages: write` permission (auto-configured)
- Check in Settings → Secrets that `GITHUB_TOKEN` is available

### Deployment fails: "Cannot connect to server"
```bash
# Test SSH connection
ssh -i ~/.ssh/deploy_key ubuntu@your-server.com

# Check if Docker is running
docker ps

# Check firewall
sudo ufw status
```

### Image doesn't update
```bash
# Force pull latest
docker pull --no-cache ghcr.io/your-username/door-service-backend:latest

# Check running image
docker inspect door-service-backend | grep Image
```

---

## 📈 Best Practices

### 1. **Use Semantic Versioning**
```bash
# Create version tags
git tag v1.0.0
git push origin v1.0.0

# Automatically creates: ghcr.io/user/app:v1.0.0
```

### 2. **Environment Variables**
```bash
# Add to server before deploying
cat > .env <<EOF
NODE_ENV=production
JWT_SECRET=your_secret_key_here
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
EOF
```

### 3. **Health Checks**
```javascript
// Add to src/index.js
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});
```

### 4. **Monitoring Deployments**
- Check **Actions** tab for workflow runs
- View logs for each step
- Use Slack notifications (add `SLACK_WEBHOOK` secret)

### 5. **Rollback Strategy**
```bash
# If deployment breaks, rollback to previous version
docker pull ghcr.io/user/app:main-previous-commit-hash
docker-compose down
docker-compose up -d
```

---

## 📞 Need Help?

1. **Check Deployment Guide**: See `DEPLOYMENT_GUIDE.md` for detailed setup
2. **View Workflow Logs**: GitHub Actions → Workflows → Click run → View logs
3. **Test Locally**: Run `docker build .` and `docker-compose up` locally first
4. **SSH Troubleshooting**:
   ```bash
   ssh -vvv user@server.com  # Verbose SSH debugging
   ```

---

## Next Commands to Run

```bash
# 1. Make the setup script executable
chmod +x scripts/deployment-setup.sh

# 2. Run setup helper
./scripts/deployment-setup.sh

# 3. Choose your platform and add secrets
gh secret set DEPLOY_HOST --body "your-server-ip"
gh secret set DEPLOY_USER --body "ubuntu"
gh secret set DEPLOY_SSH_KEY < ~/.ssh/deploy_key

# 4. Commit and push
git add .
git commit -m "Add GitHub Actions deployment"
git push origin main

# 5. Watch the magic happen
# Go to: https://github.com/your-username/door-service-backend/actions
```

---

## Summary

You now have a **complete production-ready CI/CD pipeline** that:
- ✅ Automatically builds Docker images on every push
- ✅ Pushes images to secure GitHub Container Registry
- ✅ Deploys to your chosen platform with one command
- ✅ Supports multiple environments (main = production, develop = staging)
- ✅ Includes health checks and monitoring
- ✅ Follows security best practices

Happy deploying! 🎉
