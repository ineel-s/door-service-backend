# Complete Docker Hub & Server Deployment Setup

## 📚 What Has Been Created

Your repository now has a **complete, production-ready Docker CI/CD pipeline** that:
- ✅ Automatically builds Docker images when you push code
- ✅ Uploads images to Docker Hub (and GitHub Container Registry)
- ✅ Automatically deploys to your server via SSH
- ✅ Includes health checks and monitoring
- ✅ Supports multiple deployment platforms

### 📁 New Files Created

```
.github/workflows/
├── docker-build-and-push.yml      # Build & push to Docker Hub automatically
└── deploy.yml                      # Deploy to server automatically

scripts/
├── setup-docker-hub-deployment.sh  # Interactive setup guide
└── deployment-setup.sh             # General deployment helper

Documentation:
├── DOCKER_HUB_GUIDE.md            # Complete Docker Hub guide (read this!)
├── QUICK_REFERENCE.md             # Quick command reference
├── GITHUB_ACTIONS_QUICKSTART.md   # GitHub Actions overview
├── DEPLOYMENT_GUIDE.md            # All platform deployment options
└── COMPLETE_DOCKER_DEPLOYMENT_GUIDE.md (this file)
```

---

## 🚀 Quick Start (15 minutes)

### Step 1: Create Docker Hub Account (5 min)
```bash
# Go to: https://hub.docker.com/signup
# Create account
# Create access token at: https://hub.docker.com/settings/security
# Name it: github-actions
# Keep the token safe - you'll need it!
```

### Step 2: Run Interactive Setup Script (5 min)
```bash
# Make it executable
chmod +x scripts/setup-docker-hub-deployment.sh

# Run the setup script
./scripts/setup-docker-hub-deployment.sh

# Follow the prompts to:
# - Enter Docker Hub credentials
# - Generate SSH key
# - Test SSH connection to server
# - Add GitHub secrets automatically
# - Get server setup instructions
```

### Step 3: Push Code (2 min)
```bash
git add .
git commit -m "Add Docker Hub deployment pipeline"
git push origin main
```

### Step 4: Watch Deployment (3 min)
```
Go to: GitHub → Actions tab
Watch the workflow run in real-time
Once complete, your app is deployed! 🎉
```

---

## 📊 How the Complete Pipeline Works

### The Flow:

```
Step 1: You push code to GitHub
    ↓
Step 2: GitHub Actions triggers automatically
    ↓
Step 3: Docker image is built
    Built with:
    - Node.js 18 (Alpine)
    - Your source code
    - All npm dependencies
    ↓
Step 4: Image is pushed to registries
    - Docker Hub: docker.io/your-username/door-service-backend
    - GitHub Registry: ghcr.io/your-username/door-service-backend
    ↓
Step 5: Deployment workflow starts
    ↓
Step 6: SSH into your server
    ↓
Step 7: Pull latest Docker image
    ↓
Step 8: Stop old container
    ↓
Step 9: Start new container
    ↓
Step 10: ✅ Your app is running with latest code!
```

### Automatic Image Tagging:

```
What You Do              → Docker Hub Image Tag
─────────────────────────────────────────────────
git push origin main     → username/door-service-backend:latest
git push origin develop  → username/door-service-backend:develop
git tag v1.0.0 && push   → username/door-service-backend:v1.0.0
Any commit on main       → username/door-service-backend:main-abc1234
```

---

## 🔑 GitHub Secrets Reference

Add these secrets to GitHub: **Settings → Secrets and variables → Actions**

### Required Secrets (for Docker Hub):
```
DOCKERHUB_USERNAME    → Your Docker Hub username
DOCKERHUB_TOKEN       → Your Docker Hub access token
```

### Required Secrets (for Server Deployment):
```
DEPLOY_HOST          → Your server IP or domain
DEPLOY_USER          → SSH username (e.g., ubuntu)
DEPLOY_PATH          → App directory path (e.g., /home/ubuntu/door-service)
DEPLOY_SSH_KEY       → Your private SSH key
```

### Optional Secrets:
```
AWS_ACCESS_KEY_ID     → For AWS ECS deployment
AWS_SECRET_ACCESS_KEY → For AWS ECS deployment
AZURE_CREDENTIALS     → For Azure deployment
SLACK_WEBHOOK         → For Slack notifications
```

---

## 🖥️ Server Setup Guide

### Prerequisites:
- Ubuntu 20.04+ or Debian 10+ server
- SSH access
- Root or sudo access

### Step 1: Install Docker

```bash
# SSH into your server
ssh user@your-server.com

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add your user to docker group
sudo usermod -aG docker $USER
newgrp docker

# Verify installation
docker --version
```

### Step 2: Install Docker Compose

```bash
sudo apt install -y docker-compose

# Verify
docker-compose --version
```

### Step 3: Create Application Directory

```bash
# Create directory
mkdir -p /home/ubuntu/door-service
cd /home/ubuntu/door-service

# Create docker-compose.yml
cat > docker-compose.yml <<'EOF'
version: '3.8'
services:
  app:
    image: your-username/door-service-backend:latest
    container_name: door-service-backend
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DB_HOST=mongo
      - DB_PORT=27017
      - DB_NAME=door-service
      - DB_USER=${DB_USER}
      - DB_PASSWORD=${DB_PASSWORD}
      - JWT_SECRET=${JWT_SECRET}
      - STRIPE_SECRET_KEY=${STRIPE_SECRET_KEY}
      - STRIPE_PUBLISHABLE_KEY=${STRIPE_PUBLISHABLE_KEY}
    depends_on:
      - mongo
    networks:
      - door-network
    restart: unless-stopped

  mongo:
    image: mongo:6
    container_name: door-service-mongo
    environment:
      - MONGO_INITDB_ROOT_USERNAME=${DB_USER}
      - MONGO_INITDB_ROOT_PASSWORD=${DB_PASSWORD}
    volumes:
      - mongo_data:/data/db
    networks:
      - door-network
    restart: unless-stopped

volumes:
  mongo_data:

networks:
  door-network:
    driver: bridge
EOF

# Create .env file with your secrets
cat > .env <<EOF
NODE_ENV=production
DB_USER=root
DB_PASSWORD=your_secure_password_here
JWT_SECRET=your_jwt_secret_key_here_min_32_chars
STRIPE_SECRET_KEY=your_stripe_key_here
STRIPE_PUBLISHABLE_KEY=your_stripe_key_here
EOF

# Protect .env file
chmod 600 .env
```

### Step 4: Replace Username in docker-compose.yml

```bash
# Open docker-compose.yml and change:
# image: your-username/door-service-backend:latest
# to your actual Docker Hub username
nano docker-compose.yml
```

### Step 5: Test Manual Deployment

```bash
# Pull the image
docker pull your-username/door-service-backend:latest

# Start services
docker-compose up -d

# Check if running
docker ps

# View logs
docker logs door-service-backend

# Test endpoint
curl http://localhost:3000/health

# Should return: {"status":"ok","timestamp":"..."}
```

---

## 🔄 The Deployment Process

### Automatic (Recommended):

```bash
# 1. Make changes to your code
# 2. Commit and push
git add .
git commit -m "Your changes"
git push origin main

# 3. Watch in GitHub Actions (automatic!)
# No manual server commands needed!
```

### Manual (Backup method):

```bash
# If automatic deployment fails, deploy manually

# On your local machine:
docker build -t your-username/door-service-backend:latest .
docker push your-username/door-service-backend:latest

# On your server:
cd /home/ubuntu/door-service
docker-compose pull
docker-compose down
docker-compose up -d
```

---

## 🔍 Monitoring & Troubleshooting

### View Deployment Status:

```
GitHub → Actions tab
Watch the workflow run
Check logs for each step
```

### Check Server Status:

```bash
# SSH into server
ssh user@your-server.com

# See running containers
docker ps

# View application logs
docker logs door-service-backend

# View database logs
docker logs door-service-mongo

# Test API
curl http://localhost:3000/health

# Stop everything
docker-compose down

# Start everything
docker-compose up -d
```

### Common Issues:

| Issue | Solution |
|-------|----------|
| Build fails | Run `docker build .` locally to test |
| Push fails | Check `DOCKERHUB_TOKEN` in GitHub secrets |
| SSH fails | Test: `ssh -i ~/.ssh/deploy_key user@server.com` |
| Image doesn't update | Force pull: `docker pull --no-cache your-username/door-service-backend:latest` |
| Port in use | Change port in docker-compose.yml or kill process: `sudo lsof -i :3000` |
| App won't start | Check logs: `docker logs door-service-backend` |

---

## 📚 Documentation Files

### For Quick Setup:
- **QUICK_REFERENCE.md** - Commands and setup checklist

### For Step-by-Step Setup:
- **DOCKER_HUB_GUIDE.md** - Complete Docker Hub deployment guide
- Run: `./scripts/setup-docker-hub-deployment.sh` - Interactive setup

### For GitHub Actions:
- **GITHUB_ACTIONS_QUICKSTART.md** - GitHub Actions overview
- **DEPLOYMENT_GUIDE.md** - All platform options

---

## 🎯 Next Steps

### 1. Run the Interactive Setup (Easiest)
```bash
./scripts/setup-docker-hub-deployment.sh
```
This guides you through:
- Creating Docker Hub account
- Generating SSH keys
- Adding GitHub secrets
- Testing server connection
- Getting server setup instructions

### 2. Manual Setup (if needed)
Follow steps in **DOCKER_HUB_GUIDE.md**:
- Create Docker Hub account
- Generate access token
- Add GitHub secrets
- Generate SSH key
- Set up server

### 3. Deploy Your First Version
```bash
git add .
git commit -m "Add Docker Hub CI/CD"
git push origin main
```

### 4. Monitor & Verify
- GitHub → Actions → Watch workflow
- SSH into server → `docker ps`
- Test: `curl http://your-server:3000/health`

---

## 🔐 Security Best Practices

### 1. Protect Secrets
```bash
# Never commit .env file
echo ".env" >> .gitignore
```

### 2. Use Strong Passwords
```
DB_PASSWORD=SecureP@ssw0rd123!
JWT_SECRET=LongRandomKeyWith32OrMoreChars!
```

### 3. Rotate Tokens
Every 3-6 months:
- Create new Docker Hub token
- Update GitHub secret
- Delete old token

### 4. Secure SSH Keys
```bash
# Don't commit private keys
chmod 600 ~/.ssh/deploy_key

# Rotate SSH keys periodically
ssh-keygen -t ed25519 -f ~/.ssh/new_deploy_key
```

### 5. Use HTTPS
```bash
# Set up SSL certificate for your domain
sudo apt install certbot
sudo certbot certonly -d your-domain.com
```

---

## 📈 Advanced Usage

### Deploy to Multiple Environments

**Using branches:**
```bash
# Production (main branch)
git push origin main          # Deploys to production

# Staging (develop branch)
git push origin develop       # Deploys to staging

# Releases
git tag v1.0.0                # Creates v1.0.0 image
git push origin v1.0.0
```

### Manual Deployment Trigger

Go to **GitHub → Actions → Deploy to Production → Run workflow**

### Slack Notifications

Add `SLACK_WEBHOOK` secret with your Slack webhook URL:
1. Create Slack app: https://api.slack.com/apps
2. Enable Incoming Webhooks
3. Add to a channel
4. Copy webhook URL as `SLACK_WEBHOOK` secret

---

## 💡 Tips & Tricks

### Check Docker Hub Image
```
https://hub.docker.com/r/your-username/door-service-backend
```

### View Image Details
```bash
docker inspect your-username/door-service-backend:latest
```

### See Image Layers
```bash
docker history your-username/door-service-backend:latest
```

### Export Environment Variables
```bash
# View all environment variables in running container
docker exec door-service-backend env
```

### Backup Database
```bash
# On server
docker exec door-service-mongo mongodump --out /data/backups
```

---

## 🆘 Getting Help

### Issues & Troubleshooting:

1. **GitHub Actions Logs**
   - GitHub → Actions → Workflow → View logs

2. **Server Logs**
   ```bash
   docker logs door-service-backend
   docker logs door-service-mongo
   ```

3. **SSH Debugging**
   ```bash
   ssh -vvv user@server.com  # Verbose output
   ```

4. **Docker Debugging**
   ```bash
   docker ps -a              # All containers
   docker images             # All images
   docker events             # Real-time events
   ```

---

## 📞 Final Checklist

- [ ] Docker Hub account created
- [ ] Access token generated
- [ ] GitHub secrets added (DOCKERHUB_USERNAME, DOCKERHUB_TOKEN)
- [ ] SSH key generated
- [ ] SSH key added to server
- [ ] Server has Docker installed
- [ ] Server directory created with docker-compose.yml
- [ ] .env file created on server with secrets
- [ ] Code pushed to GitHub
- [ ] GitHub Actions workflow completed successfully
- [ ] Application running on server
- [ ] Health check endpoint responding
- [ ] Deployment documented

---

## 🎉 You're Ready!

Your complete Docker Hub → GitHub Actions → Server deployment pipeline is ready!

### What You Have:

✅ **Automated CI/CD Pipeline**
- Builds Docker image on every push
- Pushes to Docker Hub automatically
- Tags images with branch/version info

✅ **Automatic Deployment**
- Pulls latest image from Docker Hub
- Stops old container
- Starts new container with latest code
- All with one `git push`!

✅ **Complete Documentation**
- Quick reference guide
- Step-by-step setup
- Troubleshooting guide
- Interactive setup script

### How to Deploy:

```bash
# That's it! Just push code
git add .
git commit -m "Your changes"
git push origin main

# GitHub Actions handles the rest:
# 1. Builds Docker image
# 2. Pushes to Docker Hub
# 3. Deploys to your server
# 4. Application is live! 🚀
```

---

**Happy Deploying! 🚀**

For questions, refer to the documentation files or run the interactive setup script.

If something is unclear, check:
1. QUICK_REFERENCE.md
2. DOCKER_HUB_GUIDE.md
3. GitHub Actions logs
4. Server logs: `docker logs door-service-backend`
