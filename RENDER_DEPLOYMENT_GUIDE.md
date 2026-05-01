# Render.com Deployment Guide

Complete guide to deploy your Door Service Backend to Render using GitHub Actions and Docker images.

---

## 📋 Render Deployment Methods

### **Method 1: Native Git Integration (EASIEST)** ⭐ Recommended

Render watches your GitHub repo and auto-deploys:
- ✅ No secrets needed
- ✅ Simplest setup
- ✅ Automatic deployments on push

**Time:** 10 minutes to set up, then automatic forever

### **Method 2: Docker Image Deployment (This Guide)**

Push Docker image to Docker Hub, Render pulls and deploys:
- ✅ Uses GitHub Actions workflow
- ✅ Custom build process
- ✅ More control over deployment

**Time:** 15-20 minutes to set up

---

## 🎯 Method 1: Native Git Integration Setup (QUICK!)

If you want the **fastest, simplest setup**, do this:

### Step 1: Connect GitHub to Render

1. Go to https://render.com
2. Sign up / Log in
3. Click **New +** → **Web Service**
4. Select **Build and deploy from a Git repository**
5. Click **Connect** next to your GitHub repo
6. Select the repo: `door-service-backend`

### Step 2: Configure Service

Fill in the form:

```
Name:                 door-service-backend
Runtime:              Node
Build Command:        npm install && npm run copy
Start Command:        node src/index.js
Environment:          production
Plan:                 Free
```

### Step 3: Add Environment Variables

In the Environment section, add:

```
NODE_ENV=production
DB_HOST=mongodb+srv://user:password@cluster.mongodb.net
DB_PORT=27017
DB_NAME=door-service
DB_USER=root
DB_PASSWORD=your_secure_password
JWT_SECRET=your_jwt_secret_min_32_chars
STRIPE_SECRET_KEY=your_stripe_key
STRIPE_PUBLISHABLE_KEY=your_stripe_key
```

### Step 4: Deploy!

Click **Create Web Service**

Render will:
- ✅ Watch your GitHub repo
- ✅ Auto-deploy on every push to main
- ✅ Manage SSL/HTTPS automatically
- ✅ Auto-restart if it crashes

**That's it! Native Git integration is done.** 🎉

Delete the Docker-based deploy.yml if you use this method.

---

## 🐳 Method 2: Docker Image Deployment Setup

For more control, deploy the Docker image we build.

### Step 1: Get Your Render API Key

1. Go to https://render.com/account
2. Click **API** in the sidebar
3. Click **Create API Key**
4. Copy your API key (save it!)

### Step 2: Create Web Service on Render

1. Go to https://dashboard.render.com
2. Click **New +** → **Web Service**
3. Choose **Docker** as the runtime
4. Connect Docker Hub (or use image URL)

**Option A: Docker Hub Image**
```
Image URL: docker.io/your-username/door-service-backend:latest
Port: 3000
```

**Option B: Docker Registry**
```
Registry: Docker Hub
Username: your-username
Access Token: (Docker Hub access token)
Image Name: door-service-backend
```

### Step 3: Configure Service

```
Name:                 door-service-backend
Runtime:              Docker
Plan:                 Free or Paid
Pull Policy:          Always (to get latest)
```

### Step 4: Add Environment Variables

In the Environment section:

```
NODE_ENV=production
DB_HOST=your_mongodb_connection_string
DB_PORT=27017
DB_NAME=door-service
DB_USER=root
DB_PASSWORD=your_secure_password
JWT_SECRET=your_jwt_secret_min_32_chars
STRIPE_SECRET_KEY=your_stripe_key
STRIPE_PUBLISHABLE_KEY=your_stripe_key
```

### Step 5: Get Your Service ID

After creating the service:
1. Go to your service dashboard
2. The URL will be: `https://dashboard.render.com/web/srv-xxxxx`
3. Copy the service ID: `srv-xxxxx`

### Step 6: Add GitHub Secrets

Go to **GitHub → Settings → Secrets and variables → Actions**

Add these secrets:

```
RENDER_API_KEY = your_api_key_from_step_1
RENDER_SERVICE_ID = srv-xxxxx (from step 5)
DOCKERHUB_USERNAME = your_docker_hub_username
DOCKERHUB_TOKEN = your_docker_hub_token
```

### Step 7: Deploy!

```bash
git add .
git commit -m "Add Render deployment"
git push origin main
```

GitHub Actions will:
1. Build Docker image
2. Push to Docker Hub
3. Trigger Render deployment
4. Render pulls the image
5. ✅ App is deployed!

---

## 🔄 How Docker Image Deployment Works

### Flow:

```
You: git push origin main
    ↓
GitHub Actions:
  1. Build Docker image
  2. Push to Docker Hub
  3. Call Render API with new image URL
    ↓
Render API:
  1. Receives deployment request
  2. Pulls new image from Docker Hub
  3. Restarts service with new image
    ↓
Your App:
  ✅ Running with latest code!
```

### Automatic Image Tags:

```
git push main      → docker.io/user/app:latest
git tag v1.0.0     → docker.io/user/app:v1.0.0
Any commit         → docker.io/user/app:main-abc1234
```

---

## 📊 Comparison: Git vs Docker Image

| Feature | Git Integration | Docker Image |
|---------|-----------------|--------------|
| Setup Time | 5 min | 15 min |
| Complexity | Simple | Medium |
| Control | Less | More |
| Docker Needed | Yes | Yes |
| Secrets | Environment vars | API key + Docker creds |
| Auto-deploy | Yes | Yes |
| Best For | Most users | Advanced users |

**Recommendation:** Use **Git Integration** unless you need custom build process.

---

## 🗄️ Database Setup for Render

### Option 1: MongoDB Atlas (Recommended)

**Best for:** Free tier, easy setup, managed service

1. Go to https://www.mongodb.com/cloud/atlas
2. Create account (free)
3. Create cluster (free M0 tier)
4. Get connection string: `mongodb+srv://user:password@cluster.mongodb.net/door-service`
5. Add to Render environment variables

### Option 2: Render PostgreSQL

**Note:** Your app uses MongoDB, so this won't work. Use MongoDB Atlas instead.

### Option 3: External MongoDB

Use any MongoDB hosting, get connection string, add to Render.

---

## 🔐 Securing Your Render Deployment

### 1. Use Strong Passwords

```
DB_PASSWORD=MySecurePassword123!@#
JWT_SECRET=VeryLongRandomKeyWith32OrMoreCharacters
STRIPE_SECRET_KEY=sk_live_your_actual_key
```

### 2. Rotate API Keys

Every 3-6 months:
1. Create new Render API key
2. Update GitHub secret
3. Delete old API key

### 3. Protect Secrets

- Never commit `.env` files
- Use GitHub secrets for all credentials
- Don't log sensitive data

### 4. Use HTTPS

Render automatically provides SSL/HTTPS ✓

---

## 📍 Finding Your Render Details

### Find Your Service ID:

1. Go to https://dashboard.render.com
2. Click your service
3. URL: `https://dashboard.render.com/web/srv-xxxx1234xxxx`
4. Service ID: `srv-xxxx1234xxxx`

### Find Your API Key:

1. Go to https://render.com/account
2. Click **API** in sidebar
3. Copy your API key

### Find Your App URL:

1. Go to service dashboard
2. Look at the top - your URL is displayed
3. Format: `https://door-service-backend.onrender.com`

---

## ✅ GitHub Secrets Checklist

Add these to GitHub → Settings → Secrets and variables → Actions:

```
For Docker Hub (Building images):
☐ DOCKERHUB_USERNAME       = your_docker_hub_username
☐ DOCKERHUB_TOKEN          = your_docker_hub_access_token

For Render (Deploying):
☐ RENDER_API_KEY           = your_render_api_key
☐ RENDER_SERVICE_ID        = srv-xxxxx

Optional (for Render Webhook method):
☐ RENDER_WEBHOOK_URL       = your_webhook_url
```

---

## 🚀 Deploy to Render

### Using Docker Image Method:

```bash
# 1. Make sure Dockerfile is ready
docker build .

# 2. Commit all changes
git add .
git commit -m "Ready for Render deployment"

# 3. Push to GitHub
git push origin main

# 4. Watch GitHub Actions
# GitHub → Actions → See your workflow run

# 5. Check Render
# Go to https://dashboard.render.com
# Your service will show "In Progress" then "Live"

# 6. Visit your app
# https://door-service-backend.onrender.com/health
```

---

## 🔍 Monitoring Your Render Deployment

### View Logs:

1. Go to Render dashboard
2. Click your service
3. Click **Logs** tab
4. See real-time logs

### Check Status:

```
Green dot = Running ✅
Yellow dot = Building 🟡
Red dot = Error ❌
```

### Test Your App:

```bash
curl https://your-app-name.onrender.com/health

# Should return:
# {"status":"ok","timestamp":"..."}
```

---

## ⚠️ Troubleshooting

### Deployment Failed

**Check:**
1. GitHub Actions logs
2. Render logs
3. Environment variables are set

### Image Pull Failed

**Check:**
1. Docker image exists on Docker Hub
2. `DOCKERHUB_USERNAME` is correct
3. `DOCKERHUB_TOKEN` is valid

### App Won't Start

**Check:**
1. Environment variables are correct
2. Database is accessible
3. Check Render logs for errors
4. Port is set to 3000

### Secrets Not Working

**Check:**
1. Secret names match exactly
2. Values don't have extra spaces
3. Try deleting and re-creating secret

---

## 🆘 Common Issues & Solutions

### Issue: Build hangs on "Pulling from Docker Hub"

**Solution:**
- Wait - it's pulling the image from Docker Hub
- Images can be large (200MB+)
- May take 2-5 minutes

### Issue: "Authentication failed for Docker Hub"

**Solution:**
- Check `DOCKERHUB_TOKEN` is valid
- Regenerate new token from Docker Hub
- Update GitHub secret

### Issue: "Service won't start after deployment"

**Solution:**
- Check environment variables in Render
- Check database connection string
- View Render logs
- Test locally: `npm install && npm start`

### Issue: Database connection timeout

**Solution:**
- Check MongoDB Atlas connection string
- Ensure IP whitelist allows Render IPs
- In MongoDB Atlas, add IP: 0.0.0.0/0 (allows all)

---

## 📚 Render Documentation

- [Render Web Services](https://render.com/docs/web-services)
- [Docker on Render](https://render.com/docs/docker)
- [Environment Variables](https://render.com/docs/environment-variables)
- [Render API](https://render.com/docs/api)

---

## 🎯 Summary

### Method 1: Native Git (Easiest)
1. Connect GitHub repo
2. Set environment variables
3. Click Deploy
4. Done! Auto-deploys on push

### Method 2: Docker Image
1. Build Docker image via GitHub Actions
2. Push to Docker Hub
3. Render pulls and deploys
4. Done! Auto-deploys on push

---

## 🚀 Next Steps

### Choose Your Method:

**For simplicity:** Use Native Git Integration
```
Skip deploy.yml, use Render's GitHub integration
Delete deploy.yml from your repo
```

**For more control:** Use Docker Image
```
Keep deploy.yml with Render API deployment
Add RENDER_API_KEY and RENDER_SERVICE_ID secrets
Every push triggers: Build → Push → Deploy
```

### Then:

1. Set up Render account
2. Create Web Service
3. Add environment variables
4. Get API key and Service ID
5. Add GitHub secrets
6. Push code
7. Watch deployment
8. Visit your app

**Done!** Your app is on Render! 🎉

---

## 💡 Pro Tips

1. **Use Render's free tier** - Good for testing
2. **Upgrade when needed** - Pay-as-you-go pricing
3. **Keep backups** - Export your MongoDB regularly
4. **Monitor logs** - Check logs regularly for errors
5. **Set up alerts** - Render can notify you on failures

---

**Happy deploying to Render!** 🚀
