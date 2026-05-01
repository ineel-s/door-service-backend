# GitHub Actions Deployment Guide

This guide explains how to deploy your Door Service Backend application using GitHub Actions, Docker, and various cloud platforms.

## Overview

The GitHub Actions workflows automate the following process:

1. **Build**: Builds a Docker image from your code
2. **Push**: Pushes the image to GitHub Container Registry (GHCR)
3. **Deploy**: Deploys the containerized application to your chosen platform

## Project Structure

```
.github/
  workflows/
    docker-build-and-push.yml  # Build and push Docker image
    deploy.yml                  # Deploy to production
```

## Prerequisites

### 1. GitHub Repository
- Your code must be in a GitHub repository
- Ensure your repository has the Dockerfile and docker-compose files

### 2. GitHub Container Registry (GHCR)
- By default, GitHub provides free container registry access
- No additional setup needed - uses your GitHub account credentials
- Images are stored at: `ghcr.io/username/repository-name`

### 3. (Optional) Docker Hub
If you prefer Docker Hub instead of GHCR:
- Create a Docker Hub account at https://hub.docker.com
- Add secrets to your GitHub repository: `DOCKERHUB_USERNAME` and `DOCKERHUB_TOKEN`

## Step-by-Step Deployment Setup

### Step 1: Enable GitHub Actions
1. Go to your GitHub repository
2. Click **Settings** → **Actions** → **General**
3. Enable **Allow all actions and reusable workflows**
4. Save changes

### Step 2: Create GitHub Secrets (if deploying to remote server)

For deployment, you may need to add secrets to your GitHub repository:

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret** and add:

#### For SSH Deployment (VPS/Self-hosted):
```
DEPLOY_HOST       → Your server IP/domain
DEPLOY_USER       → SSH username
DEPLOY_SSH_KEY    → Your private SSH key
```

#### For AWS Deployment:
```
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
AWS_REGION
```

#### For Azure Deployment:
```
AZURE_CREDENTIALS → Azure service principal JSON
AZURE_RESOURCE_GROUP
```

#### For DigitalOcean:
```
DIGITALOCEAN_TOKEN
DIGITALOCEAN_APP_ID
```

#### For Slack Notifications:
```
SLACK_WEBHOOK     → Your Slack incoming webhook URL
```

### Step 3: Configure the Workflows

#### File: `.github/workflows/docker-build-and-push.yml`

This workflow automatically:
- Triggers on pushes to `main` or `develop` branches
- Triggers on version tags (e.g., `v1.0.0`)
- Builds your Docker image
- Pushes to GitHub Container Registry

**Current Configuration:**
- Registry: GitHub Container Registry (GHCR)
- Automatic tags: `latest`, branch name, semantic version, commit SHA

**To use Docker Hub instead:**
```yaml
REGISTRY: docker.io
```

#### File: `.github/workflows/deploy.yml`

This workflow handles deployment. **Choose your platform:**

### Step 4: Choose Your Deployment Platform

#### Option A: VPS/Self-hosted Server (SSH)

Uncomment this section in `deploy.yml`:

```yaml
- name: Deploy via SSH
  uses: appleboy/ssh-action@v1.0.0
  with:
    host: ${{ secrets.DEPLOY_HOST }}
    username: ${{ secrets.DEPLOY_USER }}
    key: ${{ secrets.DEPLOY_SSH_KEY }}
    script: |
      cd /path/to/app
      docker pull ${{ steps.image.outputs.image }}
      docker-compose down
      docker-compose up -d
```

**Setup instructions:**
1. SSH into your server
2. Install Docker and Docker Compose:
   ```bash
   curl -fsSL https://get.docker.com -o get-docker.sh
   sh get-docker.sh
   sudo usermod -aG docker $(whoami)
   ```
3. Create an SSH key pair:
   ```bash
   ssh-keygen -t ed25519 -f ~/.ssh/deploy_key
   ```
4. Add public key to server: `cat ~/.ssh/deploy_key.pub >> ~/.ssh/authorized_keys`
5. Add private key as `DEPLOY_SSH_KEY` secret in GitHub
6. Update the script with your actual app path

---

#### Option B: AWS ECS (Elastic Container Service)

Uncomment this section in `deploy.yml`:

```yaml
- name: Configure AWS credentials
  uses: aws-actions/configure-aws-credentials@v4
  with:
    aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
    aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
    aws-region: us-east-1

- name: Update ECS service
  run: |
    aws ecs update-service \
      --cluster your-cluster-name \
      --service your-service-name \
      --force-new-deployment
```

**Setup instructions:**
1. Create ECS cluster and service on AWS Console
2. Create IAM user with ECS permissions
3. Generate access keys for that user
4. Add AWS credentials as GitHub secrets
5. Update cluster name and service name

---

#### Option C: Azure Container Instances

Uncomment this section in `deploy.yml`:

```yaml
- name: Deploy to Azure
  uses: azure/container-instances-deploy-action@v1
  with:
    resource-group: ${{ secrets.AZURE_RESOURCE_GROUP }}
    name: door-service-backend
    image: ${{ steps.image.outputs.image }}
```

**Setup instructions:**
1. Create resource group on Azure Portal
2. Create service principal:
   ```bash
   az ad sp create-for-rbac --role contributor --scopes /subscriptions/{subscriptionId}
   ```
3. Add output as `AZURE_CREDENTIALS` secret
4. Update resource group name

---

#### Option D: DigitalOcean App Platform

Uncomment this section in `deploy.yml`:

```yaml
- name: Deploy to DigitalOcean
  env:
    DIGITALOCEAN_ACCESS_TOKEN: ${{ secrets.DIGITALOCEAN_TOKEN }}
  run: |
    doctl auth init -t $DIGITALOCEAN_ACCESS_TOKEN
    doctl apps update ${{ secrets.DIGITALOCEAN_APP_ID }} --image
```

---

### Step 5: Push Your Code

Once everything is configured:

```bash
# Commit and push to trigger the workflow
git add .
git commit -m "Add GitHub Actions deployment workflows"
git push origin main
```

### Step 6: Monitor Deployment

1. Go to your GitHub repository
2. Click **Actions** tab
3. Watch the workflow run in real-time
4. Check logs for any errors

---

## Workflow Triggers

### docker-build-and-push.yml triggers on:
- Push to `main` branch
- Push to `develop` branch
- Push of version tags (e.g., `v1.0.0`)
- Pull requests (builds but doesn't push)

### deploy.yml triggers on:
- Push to `main` branch (automatic)
- Manual trigger via **Actions** → **Deploy to Production** → **Run workflow**

---

## Environment Variables and Secrets

Your application needs these environment variables (configured in docker-compose.yml):

```yaml
NODE_ENV=production
DB_HOST=mongo
DB_PORT=27017
DB_NAME=door-service
DB_USER=root
DB_PASSWORD=your_secure_password
SERVER_PORT=3000
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_key
STRIPE_PUBLISHABLE_KEY=your_stripe_key
```

For production deployments, use a `.env` file or pass these as secrets to your deployment platform.

---

## Best Practices

### 1. Semantic Versioning
Tag releases with semantic versions:
```bash
git tag v1.0.0
git push origin v1.0.0
```
This automatically creates a Docker image with that version tag.

### 2. Environment Separation
Use branches for different environments:
- `main` → production
- `develop` → staging
- `feature/*` → testing

### 3. Secrets Management
Never commit sensitive data:
- Use GitHub Secrets for all credentials
- Don't include `.env` files in git
- Rotate tokens regularly

### 4. Image Cleanup
Monitor your container registry storage:
- Delete old images regularly
- Set retention policies in your registry settings

### 5. Health Checks
Add health check endpoints to your application:
```javascript
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});
```

---

## Docker Image Tags Explained

Your workflow automatically creates these tags:

| Tag | Created When | Example |
|-----|---|---|
| `latest` | Push to main | `ghcr.io/user/repo:latest` |
| `main` | Push to main branch | `ghcr.io/user/repo:main` |
| `develop` | Push to develop branch | `ghcr.io/user/repo:develop` |
| `v1.0.0` | Tag v1.0.0 pushed | `ghcr.io/user/repo:v1.0.0` |
| `main-abc1234` | Commit on main | `ghcr.io/user/repo:main-abc1234` |

---

## Troubleshooting

### Workflow fails to push to registry
- Check GitHub Token permissions (should be automatic with GITHUB_TOKEN)
- Verify Container Registry is enabled in repository settings

### Deployment fails
- Check SSH credentials and permissions
- Verify deployment host is accessible
- Check application logs on the deployed server

### Docker build fails
- Verify Dockerfile syntax: `docker build .`
- Check if all required files exist
- Review build logs in GitHub Actions

### Image too large
- Use multi-stage builds in Dockerfile
- Remove unnecessary files and dependencies
- Prune Docker build cache

---

## Monitoring and Rollback

### View workflow history:
1. Go to **Actions** tab
2. Click workflow name to see runs
3. Click specific run to see detailed logs

### Manual rollback:
```bash
# On your server
docker pull ghcr.io/user/repo:previous-tag
docker-compose down
docker-compose up -d
```

---

## Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [GitHub Container Registry](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry)

---

## Next Steps

1. Choose your deployment platform
2. Uncomment the relevant deployment step in `deploy.yml`
3. Add necessary secrets to GitHub
4. Push code to trigger the workflow
5. Monitor the deployment in GitHub Actions tab

For questions or issues, refer to the official documentation for your chosen platform.
