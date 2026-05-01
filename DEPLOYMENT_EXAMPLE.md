# Real-World Example: Complete Deployment Walkthrough

This document shows exactly what happens when you deploy using this setup.

---

## 📖 Example Scenario

**Developer:** Neel  
**Docker Hub Username:** neel-docker  
**Server:** 192.168.1.100 (Ubuntu 20.04)  
**Server Path:** /home/ubuntu/door-service  

---

## Step 1: Developer Makes Code Changes

```bash
# Edit application code
nano src/index.js
# Make changes...

# Commit changes
git add src/index.js
git commit -m "Add new API endpoint for service management"

# Push to GitHub
git push origin main
```

---

## Step 2: GitHub Actions Automatically Triggers

**GitHub Repository → Actions Tab Shows:**

```
Build and Push Docker Image

🟢 Running...
├─ ✅ Checkout repository
├─ ✅ Set up Docker Buildx
├─ ✅ Log in to Docker Hub
│  │ Logging in as: neel-docker
│  │ ✓ Authentication successful
│
├─ ✅ Log in to GitHub Container Registry
├─ 🟢 Build and push Docker image
│  │ Building from Dockerfile...
│  │ → FROM node:18-alpine
│  │ → WORKDIR /app
│  │ → COPY package*.json ./
│  │ → RUN npm install
│  │ → COPY . .
│  │ → RUN npm run copy
│  │ → EXPOSE 3000
│  │ → CMD ["node", "src/index.js"]
│  │
│  │ Image built successfully
│  │ Pushing to Docker Hub...
│  │ Pushed: neel-docker/door-service-backend:main
│  │ Pushed: neel-docker/door-service-backend:latest
│  │ Pushed: neel-docker/door-service-backend:main-a1b2c3d4
│  │ ✓ Push complete
│
└─ ✅ Image Summary
   Docker Hub: docker.io/neel-docker/door-service-backend
   GHCR: ghcr.io/neel/door-service-backend
```

**Result:**
- Docker image built with latest code
- Pushed to Docker Hub with tags: `latest`, `main`, `main-a1b2c3d4`
- Ready for deployment

---

## Step 3: GitHub Actions Deploy Workflow Runs

**Automatic Deployment Begins:**

```
Deploy to Production

🟡 Running...
├─ ✅ Checkout repository
├─ ✅ Get Docker image tag
│  └─ Tag: main-a1b2c3d4
│  └─ Image: neel-docker/door-service-backend:main-a1b2c3d4
│
├─ 🟢 Deploy to Server via SSH
│  │ Host: 192.168.1.100
│  │ User: ubuntu
│  │ Working Directory: /home/ubuntu/door-service
│  │
│  │ 1. Pulling latest image...
│  │    $ docker pull neel-docker/door-service-backend:main-a1b2c3d4
│  │    main-a1b2c3d4: Pulling from neel-docker/door-service-backend
│  │    423ae2b273f4: Pull complete
│  │    3ce3d8b2c02c: Pull complete
│  │    5a56a6c7d72f: Pull complete
│  │    ✓ Image pulled successfully
│  │
│  │ 2. Stopping old container...
│  │    $ docker-compose down
│  │    Stopping door-service-backend ... done
│  │    Stopping door-service-mongo ... done
│  │    Removing door-service-backend ... done
│  │    Removing door-service-mongo ... done
│  │    ✓ Old containers stopped
│  │
│  │ 3. Starting new container...
│  │    $ docker-compose up -d
│  │    Creating door-service-mongo ... done
│  │    Creating door-service-backend ... done
│  │    ✓ New containers started
│  │
│  │ 4. Verifying deployment...
│  │    $ docker ps
│  │    CONTAINER ID  IMAGE                          STATUS
│  │    a1b2c3d4e5f6  neel-docker/door-service-...  Up 2 seconds
│  │    f6e5d4c3b2a1  mongo:6                        Up 3 seconds
│  │
│  │ 5. Checking health...
│  │    $ curl -s http://localhost:3000/health
│  │    {"status":"ok","timestamp":"2026-05-01T..."}
│  │    ✓ Application is healthy!
│
├─ ✅ Notify Slack - Success
│  │ Message sent to #deployments
│  │ ✅ Deployment Successful
│  │ Environment: production
│  │ Image: neel-docker/door-service-backend:main-a1b2c3d4
│
└─ ✅ Deployment Summary
   Image: neel-docker/door-service-backend:main-a1b2c3d4
   Environment: production
   Status: SUCCESS ✓
```

---

## Step 4: Deployment Complete

**Timeline:**
```
12:05 PM  → Developer pushes code to GitHub
12:06 PM  → GitHub Actions triggered
12:07 PM  → Docker image built (1 min)
12:08 PM  → Image pushed to Docker Hub (1 min)
12:09 PM  → Deploy workflow starts (auto)
12:10 PM  → Image pulled from Docker Hub (1 min)
12:11 PM  → Old container stopped, new started (1 min)
12:12 PM  → ✅ Deployment complete! Total: 7 minutes
```

**What actually happened on the server:**

```
Before Deployment:
├─ Container: door-service-backend:v1.0.0
│  └─ Code without new API endpoint
├─ Database: MongoDB running with data intact
└─ Public: Requests going to old version

After Deployment:
├─ Container: door-service-backend:main-a1b2c3d4
│  └─ Code WITH new API endpoint
├─ Database: MongoDB still running with same data
└─ Public: Requests now going to new version
```

---

## Step 5: Verify Deployment

**Developer verifies the deployment:**

```bash
# Option 1: Check GitHub Actions
# GitHub → Actions → View completed workflow ✅

# Option 2: Test the application
curl https://your-server.com/health
# Response: {"status":"ok","timestamp":"2026-05-01T..."}

# Option 3: SSH into server and check
ssh ubuntu@192.168.1.100

# Check running containers
docker ps
# CONTAINER ID  IMAGE                           STATUS
# a1b2c3d4e5f6  neel-docker/door-service-...   Up 5 minutes
# f6e5d4c3b2a1  mongo:6                         Up 5 minutes

# Check logs
docker logs door-service-backend
# [10:12:15] Server started on port 3000
# [10:12:16] Connected to MongoDB
# [10:12:17] Application ready

# Check database is still there
docker exec door-service-mongo mongosh --eval "db.users.countDocuments()"
# 42  ← Your data is intact!
```

---

## What If Developer Needs to Test First?

### Test Locally:

```bash
# Build locally to test
docker build -t neel-docker/door-service-backend:test .

# Run locally
docker-compose -f docker-compose.yml up -d

# Test new endpoint
curl http://localhost:3000/your-new-endpoint

# Verify it works
# If yes → push to GitHub (automatic deploy)
# If no → fix code → try again
```

---

## What If Deployment Fails?

### Automatic Rollback (Optional):

If you want automatic rollback on failure, you could add:

```bash
# In deploy.yml, add:
- name: Rollback on Failure
  if: failure()
  script: |
    docker pull neel-docker/door-service-backend:previous-tag
    docker-compose up -d
    curl http://localhost:3000/health  # Verify rollback
```

### Manual Rollback:

```bash
# SSH into server
ssh ubuntu@192.168.1.100

# Get previous image tag
docker images

# Rollback
docker pull neel-docker/door-service-backend:main-previous-commit-hash
cd /home/ubuntu/door-service
docker-compose down
docker-compose up -d

# Verify
docker logs door-service-backend
```

---

## What About Multiple Deployments?

### Scenario: 3 Deployments in One Day

```
09:00 AM - Bugfix pushed
          Build: 2 min
          Deploy: 1 min
          ✅ Live

02:00 PM - New feature pushed
          Build: 2 min
          Deploy: 1 min
          ✅ Live

05:00 PM - Minor improvement
          Build: 2 min
          Deploy: 1 min
          ✅ Live
```

Each deployment:
- Keeps your data (MongoDB data persists)
- Updates only the application code
- Takes ~3 minutes total
- No manual work

---

## Docker Hub Image History

After these 3 deployments, Docker Hub shows:

```
neel-docker/door-service-backend

Tags:
├─ latest            → main-5c6d7e8f  (current production)
├─ main              → main-5c6d7e8f  (current main branch)
├─ main-5c6d7e8f     → 5c6d7e8f commit (2 hours ago)
├─ main-2a3b4c5d     → 2a3b4c5d commit (5 hours ago)
├─ main-9z8y7x6w     → 9z8y7x6w commit (8 hours ago)
└─ ...

GitHub Container Registry also has same images:
├─ ghcr.io/neel/door-service-backend:latest
├─ ghcr.io/neel/door-service-backend:main
└─ ghcr.io/neel/door-service-backend:main-5c6d7e8f
```

---

## Real Server Files After Deployment

```
/home/ubuntu/door-service/
├─ docker-compose.yml          (pulled from repo)
├─ .env                         (secrets on server)
├─ docker-compose-prod.yml      (optional, for prod settings)
├─ docker-logs/
│  ├─ app.log                  (application logs)
│  └─ database.log             (database logs)
└─ backups/
   └─ mongo-backup-2026-05-01  (database backups)
```

---

## Using Version Tags

### Scenario: Release Version

```bash
# Create release
git tag v1.0.0
git push origin v1.0.0

# GitHub Actions automatically:
# 1. Builds image
# 2. Tags as: neel-docker/door-service-backend:v1.0.0
# 3. Uploads to Docker Hub
# 4. Deploys to server

# Now you can:
# - Reference specific version v1.0.0
# - Rollback to v1.0.0 anytime
# - Run multiple versions if needed
```

---

## Monitoring Long-Term

### Week 1:
```
commit a1b2c3d → image tagged: main-a1b2c3d → deployed
commit f6e5d4c → image tagged: main-f6e5d4c → deployed
commit 2x3y4z5 → image tagged: main-2x3y4z5 → deployed
```

### Docker Hub shows deployment history:
```
Images created per day:
  Mon: 3 deploys
  Tue: 2 deploys
  Wed: 1 deploy
  Thu: 4 deploys
  ...
```

### Monitoring commands:
```bash
# See all images created
docker images

# See deployment history
git log --oneline | head -20

# See what's currently running
docker ps

# See all container history
docker ps -a
```

---

## Security in Action

### Secrets are Never Exposed:

```
What happens:
1. Developer pushes code ✓
2. GitHub reads DOCKERHUB_TOKEN from secrets ✓
3. Uses token to authenticate ✓
4. Token not shown in logs ✓
5. Token not stored in image ✓
6. SSH key used only to connect ✓
7. SSH key never stored ✓

What stays secret:
✓ DB_PASSWORD - used only in container environment
✓ JWT_SECRET - only in application config
✓ STRIPE_SECRET_KEY - secure, not in logs
✓ DOCKERHUB_TOKEN - rotates regularly
✓ SSH_KEY - rotates periodically
```

---

## Summary: What Really Happens

1. **You push code** (5 seconds)
2. **GitHub builds image** (2-3 minutes)
   - Your code + dependencies in Docker image
3. **GitHub uploads image** (1-2 minutes)
   - Image pushed to Docker Hub
   - Also to GitHub Container Registry
4. **GitHub deploys to server** (1-2 minutes)
   - SSH into server
   - Pull latest image
   - Restart container
   - Data unchanged
5. **✅ Users see new version** (total 5-8 minutes)

**That's it!** No manual steps. Completely automatic. Repeatable every time.

---

## Key Takeaways

✅ **Fully Automated** - One `git push` does everything  
✅ **Zero Downtime** - Old container still running while new starts  
✅ **Data Safe** - Database data persists across deployments  
✅ **History Preserved** - Every deployment tagged and saved  
✅ **Easy Rollback** - Go back to any previous version  
✅ **Multiple Environments** - Can deploy to multiple servers  
✅ **Monitored** - Slack notifications on success/failure  
✅ **Scalable** - Deploy to AWS/Azure/DigitalOcean too  

---

This is a production-grade deployment system. You've got this! 🚀
