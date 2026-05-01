# Docker Hub: Build, Push & Deploy Guide

Complete step-by-step guide to build Docker images, upload to Docker Hub, and deploy to your server.

## 📋 Table of Contents
1. [Docker Hub Account Setup](#docker-hub-account-setup)
2. [GitHub Secrets Configuration](#github-secrets-configuration)
3. [Build & Push Workflow](#build--push-workflow)
4. [Deployment Options](#deployment-options)
5. [Server Setup](#server-setup)
6. [Manual Commands](#manual-commands)

---

## Docker Hub Account Setup

### Step 1: Create Docker Hub Account
1. Go to https://hub.docker.com/signup
2. Sign up with email, username, and password
3. Verify your email
4. Log in to Docker Hub

### Step 2: Create Access Token
1. Go to https://hub.docker.com/settings/security
2. Click **New Access Token**
3. Name it: `github-actions`
4. Permissions: Select **Read, Write, Delete**
5. Click **Generate**
6. **Copy the token** (you won't see it again!)

Keep this token safe - you'll need it for GitHub Secrets.

---

## GitHub Secrets Configuration

### Step 1: Add Docker Hub Credentials

Go to: **GitHub Repository → Settings → Secrets and variables → Actions**

Click **New repository secret** and add:

#### Secret 1: DOCKERHUB_USERNAME
```
Name: DOCKERHUB_USERNAME
Value: your-dockerhub-username
```

#### Secret 2: DOCKERHUB_TOKEN
```
Name: DOCKERHUB_TOKEN
Value: your-dockerhub-access-token-from-step-2
```

### Step 2: Add Server Deployment Secrets (If deploying to VPS)

#### Secret 3: DEPLOY_HOST
```
Name: DEPLOY_HOST
Value: your.server.ip.com  (or IP address like 192.168.1.100)
```

#### Secret 4: DEPLOY_USER
```
Name: DEPLOY_USER
Value: ubuntu  (or root, deploy, etc.)
```

#### Secret 5: DEPLOY_PATH
```
Name: DEPLOY_PATH
Value: /home/ubuntu/door-service  (path where app will run)
```

#### Secret 6: DEPLOY_SSH_KEY
```
Name: DEPLOY_SSH_KEY
Value: (paste your private SSH key here)
```

---

## Build & Push Workflow

### What Happens Automatically

When you push code to GitHub:

```
1. You: git push origin main
   ↓
2. GitHub detects push
   ↓
3. Actions workflow triggers automatically
   ↓
4. Docker image is built
   ↓
5. Image is uploaded to:
   - Docker Hub: docker.io/your-username/door-service-backend
   - GitHub Container Registry: ghcr.io/your-username/door-service-backend
   ↓
6. Deployment workflow starts
   ↓
7. Image is pulled and deployed to your server
```

### Docker Image Tags

Your images are automatically tagged:

```yaml
Push to main    → docker.io/username/door-service-backend:latest
Push to develop → docker.io/username/door-service-backend:develop
Tag v1.0.0      → docker.io/username/door-service-backend:v1.0.0
Any commit      → docker.io/username/door-service-backend:main-abc1234
```

### View Build Progress

1. Go to GitHub repository
2. Click **Actions** tab
3. Watch the workflows run in real-time
4. Click on the workflow for detailed logs

---

## Deployment Options

### Option 1: Deploy to VPS via SSH (RECOMMENDED)

**Best for**: Ubuntu/Debian servers, self-hosted, existing servers

#### Prerequisites:
- Linux server (Ubuntu, Debian, CentOS)
- SSH access
- Docker and Docker Compose installed on server

#### Setup Steps:

##### 1.1: Generate SSH Key
```bash
# On your local machine
ssh-keygen -t ed25519 -f ~/.ssh/deploy_key -N ""

# This creates two files:
# ~/.ssh/deploy_key (private key - keep secret)
# ~/.ssh/deploy_key.pub (public key - share)
```

##### 1.2: Add Public Key to Server
```bash
# Option A: Using ssh-copy-id (easiest)
ssh-copy-id -i ~/.ssh/deploy_key.pub user@your-server.com

# Option B: Manual copy
cat ~/.ssh/deploy_key.pub | ssh user@your-server.com "cat >> ~/.ssh/authorized_keys"
```

##### 1.3: Test SSH Connection
```bash
ssh -i ~/.ssh/deploy_key user@your-server.com

# Should connect without password
# Type: exit
```

##### 1.4: Add to GitHub Secrets
```bash
# Copy private key to clipboard
cat ~/.ssh/deploy_key

# Go to GitHub → Settings → Secrets and variables → Actions
# Create secret DEPLOY_SSH_KEY
# Paste the entire private key content
```

##### 1.5: Create App Directory on Server
```bash
# SSH into server
ssh user@your-server.com

# Create app directory
mkdir -p /home/ubuntu/door-service
cd /home/ubuntu/door-service

# Copy docker-compose file from your repo
# (or create one with the image)
cat > docker-compose.yml <<'EOF'
version: '3.8'
services:
  app:
    image: username/door-service-backend:latest
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
DB_PASSWORD=your_secure_password
JWT_SECRET=your_jwt_secret_key
STRIPE_SECRET_KEY=your_stripe_key
STRIPE_PUBLISHABLE_KEY=your_stripe_key
EOF

# Set proper permissions
chmod 600 .env
```

##### 1.6: Add GitHub Secrets
```bash
# In GitHub → Settings → Secrets and variables → Actions, add:

DEPLOY_HOST=your.server.com      # Your server IP or domain
DEPLOY_USER=ubuntu               # SSH username
DEPLOY_PATH=/home/ubuntu/door-service
DEPLOY_SSH_KEY=(paste private key from ~/.ssh/deploy_key)
```

##### 1.7: Push Code & Deploy
```bash
# Commit your changes
git add .
git commit -m "Add Docker Hub deployment"
git push origin main

# Go to GitHub Actions and watch deployment happen automatically!
```

---

### Option 2: Deploy to AWS ECS

**Best for**: Scalability, managed service, high traffic

#### Setup Steps:

1. **Create ECS Cluster**
   - Go to AWS Console → ECS → Create Cluster
   - Name: `door-service-cluster`
   - Infrastructure: EC2 or Fargate

2. **Create Task Definition**
   - Create task with Docker Hub image
   - Name: `door-service-backend`
   - Image: `your-username/door-service-backend:latest`
   - Port: 3000
   - Memory: 512 MB
   - CPU: 256

3. **Create Service**
   - Cluster: `door-service-cluster`
   - Service name: `door-service-backend`
   - Task: `door-service-backend`
   - Desired count: 1-3

4. **Create IAM User**
   ```bash
   # AWS Console → IAM → Users → Create user
   # Name: github-deployer
   # Permissions: ECS FullAccess
   # Create access keys
   ```

5. **Add GitHub Secrets**
   ```
   AWS_ACCESS_KEY_ID=your_access_key
   AWS_SECRET_ACCESS_KEY=your_secret_key
   AWS_REGION=us-east-1
   AWS_CLUSTER_NAME=door-service-cluster
   AWS_SERVICE_NAME=door-service-backend
   ```

---

### Option 3: Deploy to Azure Container Instances

**Best for**: Microsoft ecosystem, quick deployments

1. Create Azure service principal
2. Add AZURE_CREDENTIALS secret
3. Add AZURE_RESOURCE_GROUP secret
4. Workflow handles rest

---

### Option 4: Deploy to DigitalOcean

**Best for**: Simple, affordable VPS

1. Create DigitalOcean account
2. Create App Platform app
3. Add DIGITALOCEAN_TOKEN secret
4. Add DIGITALOCEAN_APP_ID secret

---

## Server Setup

### Install Docker on Ubuntu/Debian

```bash
# Update system
sudo apt update
sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add user to docker group (no need for sudo)
sudo usermod -aG docker $USER
newgrp docker

# Install Docker Compose
sudo apt install -y docker-compose

# Verify installation
docker --version
docker-compose --version
```

### Create Application Directory

```bash
# Create app directory
sudo mkdir -p /home/ubuntu/door-service
cd /home/ubuntu/door-service

# Create docker-compose.yml (see above)
# Create .env file with your secrets

# Set permissions
sudo chown $USER:$USER .
chmod 600 .env
```

### Start Application Manually

```bash
# Pull the latest image
docker pull username/door-service-backend:latest

# Start services
docker-compose up -d

# Check if running
docker ps

# View logs
docker logs door-service-backend

# Test endpoint
curl http://localhost:3000/health
```

### View Application Logs

```bash
# Real-time logs
docker logs -f door-service-backend

# Last 100 lines
docker logs --tail 100 door-service-backend

# With timestamps
docker logs -f --timestamps door-service-backend
```

---

## Manual Commands

### Build Image Locally

```bash
# Build image
docker build -t door-service-backend:latest .

# Tag for Docker Hub
docker tag door-service-backend:latest username/door-service-backend:latest

# Push to Docker Hub
docker push username/door-service-backend:latest
```

### Pull & Run Image from Docker Hub

```bash
# Pull image
docker pull username/door-service-backend:latest

# Run with docker-compose
docker-compose up -d

# Or run manually
docker run -d \
  --name door-service-backend \
  -p 3000:3000 \
  -e NODE_ENV=production \
  -e DB_HOST=mongo \
  -e JWT_SECRET=your_secret \
  username/door-service-backend:latest
```

### Stop & Remove Container

```bash
# Stop container
docker stop door-service-backend

# Remove container
docker rm door-service-backend

# Remove image
docker rmi username/door-service-backend:latest
```

### View Docker Hub Image

Go to: https://hub.docker.com/r/your-username/door-service-backend

---

## Complete Workflow Example

### Step 1: First Time Setup (One time only)

```bash
# 1. Create Docker Hub account
# 2. Create access token at https://hub.docker.com/settings/security
# 3. Add GitHub secrets (DOCKERHUB_USERNAME, DOCKERHUB_TOKEN)
# 4. Generate SSH key locally
# 5. Add to server
# 6. Create app directory on server with docker-compose.yml
```

### Step 2: Deploy (Every time you want to deploy)

```bash
# Option A: Automatic (recommended)
git add .
git commit -m "Update application"
git push origin main
# → GitHub Actions automatically builds and deploys

# Option B: Manual
docker build -t door-service-backend:latest .
docker tag door-service-backend:latest username/door-service-backend:latest
docker push username/door-service-backend:latest
# → Log into server and run docker-compose pull && docker-compose up -d
```

### Step 3: Monitor

```bash
# Check GitHub Actions
# https://github.com/your-username/door-service-backend/actions

# Check server
ssh user@server.com
docker ps
docker logs door-service-backend
curl http://localhost:3000/health
```

---

## Troubleshooting

### Build fails
```bash
# Check Dockerfile locally
docker build .

# View full logs in GitHub Actions
# Workflow → Failed step → View logs
```

### Push to Docker Hub fails
```bash
# Verify credentials
docker login

# Check DOCKERHUB_USERNAME and DOCKERHUB_TOKEN secrets
# Go to GitHub → Settings → Secrets → Check values
```

### Deployment fails
```bash
# Test SSH connection
ssh -i ~/.ssh/deploy_key user@server.com

# Check if Docker is running on server
systemctl status docker

# Check logs on server
docker logs door-service-backend
```

### Image doesn't update on server
```bash
# Force pull latest
docker pull --no-cache username/door-service-backend:latest

# Restart container
docker-compose down
docker-compose up -d
```

### Port already in use
```bash
# Find what's using port 3000
sudo lsof -i :3000

# Kill the process
sudo kill -9 <PID>

# Or use different port in docker-compose.yml
# Change: - "3000:3000" to "3001:3000"
```

---

## Security Best Practices

### 1. Don't commit secrets
```bash
# Add to .gitignore
echo ".env" >> .gitignore
```

### 2. Use strong passwords
```bash
# DB_PASSWORD should be at least 16 characters
DB_PASSWORD=MySecureP@ssw0rd123!
JWT_SECRET=JWTSecretWith32OrMoreCharacters!
```

### 3. Rotate tokens regularly
```bash
# Every 3-6 months:
# 1. Create new Docker Hub token
# 2. Update DOCKERHUB_TOKEN in GitHub
# 3. Delete old token from Docker Hub
```

### 4. Limit SSH key access
```bash
# Only allow from specific IP if possible
# Or rotate SSH keys periodically
```

### 5. Use HTTPS for your domain
```bash
# Install Let's Encrypt SSL
sudo apt install -y certbot python3-certbot-nginx
sudo certbot certonly -d your-domain.com
```

---

## Health Check Endpoint

Add this to your application to check if it's running:

```javascript
// In src/index.js
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV
  });
});
```

Then test:
```bash
curl http://your-server.com:3000/health
```

---

## Next Steps

1. ✅ Create Docker Hub account
2. ✅ Generate access token
3. ✅ Add GitHub secrets
4. ✅ Generate SSH key and add to server
5. ✅ Create app directory with docker-compose.yml
6. ✅ Commit and push code
7. ✅ Watch GitHub Actions
8. ✅ Check server deployment
9. ✅ Test your application

You're all set! 🚀
