# Quick Reference: Docker Hub Deployment

## 🚀 60-Second Setup

```bash
# 1. Docker Hub Setup (5 min)
# - Create account at https://hub.docker.com/signup
# - Create token at https://hub.docker.com/settings/security

# 2. Add GitHub Secrets (2 min)
# Settings → Secrets → Add:
#   DOCKERHUB_USERNAME = your_username
#   DOCKERHUB_TOKEN = token_from_step_1

# 3. Generate SSH Key (2 min)
ssh-keygen -t ed25519 -f ~/.ssh/deploy_key -N ""
cat ~/.ssh/deploy_key.pub | ssh user@server.com "cat >> ~/.ssh/authorized_keys"

# 4. Add More GitHub Secrets (2 min)
# Settings → Secrets → Add:
#   DEPLOY_HOST = your.server.com
#   DEPLOY_USER = ubuntu
#   DEPLOY_PATH = /home/ubuntu/door-service
#   DEPLOY_SSH_KEY = (paste contents of ~/.ssh/deploy_key)

# 5. Create Server Directory (2 min)
ssh user@server.com
mkdir -p /home/ubuntu/door-service
# Copy docker-compose.yml and create .env file

# 6. Deploy! (1 min)
git add .
git commit -m "Add Docker deployment"
git push origin main
```

## 📊 Workflow at a Glance

```
Your Code Push
    ↓
GitHub Actions Builds Docker Image
    ↓
Image Uploaded to Docker Hub
    ↓
SSH into Server & Pull Image
    ↓
Docker Compose Starts New Container
    ↓
✅ Your App is Live!
```

## 🔑 GitHub Secrets Checklist

```
☐ DOCKERHUB_USERNAME
☐ DOCKERHUB_TOKEN
☐ DEPLOY_HOST
☐ DEPLOY_USER
☐ DEPLOY_PATH
☐ DEPLOY_SSH_KEY
```

## 📍 Key File Locations

```
.github/workflows/
  ├── docker-build-and-push.yml  ← Build & push to Docker Hub
  └── deploy.yml                  ← Deploy to server via SSH

docker-compose.yml               ← Development config
.env.example                     ← Environment template
Dockerfile                       ← Docker image recipe
```

## 🐳 Docker Hub Commands

```bash
# Build locally
docker build -t username/door-service-backend:latest .

# Push to Docker Hub
docker push username/door-service-backend:latest

# Pull and run
docker pull username/door-service-backend:latest
docker run -d -p 3000:3000 username/door-service-backend:latest

# View your images
https://hub.docker.com/r/username/door-service-backend
```

## 🖥️ Server Commands

```bash
# SSH in
ssh -i ~/.ssh/deploy_key user@server.com

# Pull latest image
docker pull username/door-service-backend:latest

# Start app
docker-compose up -d

# View logs
docker logs door-service-backend

# Stop app
docker-compose down

# Check if running
docker ps
```

## 🔗 Image Tags Reference

| Push To | Docker Hub Image Tag |
|---------|---------------------|
| main branch | `username/door-service-backend:latest` |
| develop branch | `username/door-service-backend:develop` |
| Tag v1.0.0 | `username/door-service-backend:v1.0.0` |
| Any commit | `username/door-service-backend:main-abc1234` |

## ⚠️ Troubleshooting

| Issue | Solution |
|-------|----------|
| Build fails | Check `docker build .` locally |
| Push fails | Verify `DOCKERHUB_TOKEN` is valid |
| SSH fails | Verify SSH key works: `ssh -i ~/.ssh/deploy_key user@server.com` |
| App doesn't start | Check logs: `docker logs door-service-backend` |
| Port in use | Change port in docker-compose.yml or kill process on server |

## 📚 Full Guides

- **Detailed Setup**: See `DOCKER_HUB_GUIDE.md`
- **All Platforms**: See `DEPLOYMENT_GUIDE.md`
- **GitHub Actions**: See `GITHUB_ACTIONS_QUICKSTART.md`

## 🎯 Next Steps

1. Create Docker Hub account
2. Add GitHub Secrets
3. Setup SSH on server
4. Push code to trigger deployment
5. Monitor in GitHub Actions
6. Done! 🎉
