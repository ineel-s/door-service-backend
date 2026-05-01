# Render.com Quick Setup - 5 Steps

Choose your deployment method and follow the steps.

---

## 🚀 Method 1: Native Git Integration (FASTEST)

**Total Time: 10 minutes | Best For: Most Users**

### Step 1: Create Render Account
Go to https://render.com → Sign up with GitHub

### Step 2: Connect Repository
1. Dashboard → New + → Web Service
2. Click "Connect" next to your repo
3. Authorize Render to access GitHub

### Step 3: Configure Service

```
Service Name: door-service-backend
Runtime: Node
Build Command: npm install && npm run copy
Start Command: node src/index.js
Plan: Free
```

### Step 4: Add Environment Variables

Go to **Environment** tab and add:

```
NODE_ENV=production
DB_HOST=mongodb+srv://user:pass@cluster.mongodb.net/door-service
DB_PORT=27017
DB_NAME=door-service
DB_USER=root
DB_PASSWORD=your_password
JWT_SECRET=your_jwt_secret_min_32_chars
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
```

### Step 5: Deploy!

Click **Create Web Service**

**Done!** Your app auto-deploys on every GitHub push. 🎉

---

## 🐳 Method 2: Docker Image Deployment

**Total Time: 20 minutes | Best For: Advanced Users**

### Step 1: Get Render API Key

1. Go to https://render.com/account
2. Click **API**
3. Click **Create API Key**
4. Save the key

### Step 2: Create Render Service

1. Dashboard → New + → Web Service
2. Select **Docker**
3. Image: `your-username/door-service-backend:latest`
4. Port: `3000`

### Step 3: Configure Service

```
Name: door-service-backend
Runtime: Docker
Plan: Free
Environment: production
```

### Step 4: Add Environment Variables

Same as Method 1 (see above)

### Step 5: Get Service ID

1. Open your service
2. URL: `https://dashboard.render.com/web/srv-xxxxx`
3. Copy: `srv-xxxxx`

### Step 6: Add GitHub Secrets

Go to **GitHub → Settings → Secrets → New repository secret**

Add:
```
RENDER_API_KEY = your_api_key
RENDER_SERVICE_ID = srv-xxxxx
DOCKERHUB_USERNAME = your_username
DOCKERHUB_TOKEN = your_docker_hub_token
```

### Step 7: Deploy!

```bash
git add .
git commit -m "Add Render deployment"
git push origin main
```

**Done!** GitHub Actions builds and deploys automatically! 🎉

---

## 🗄️ MongoDB Atlas Setup (Both Methods)

1. Go to https://mongodb.com/cloud/atlas
2. Create account (free)
3. Create cluster (free M0)
4. Get connection string: `mongodb+srv://...`
5. Add to Render environment as `DB_HOST`

---

## ✅ Quick Checklist

### Method 1 (Native Git):
- [ ] Create Render account
- [ ] Connect GitHub repo
- [ ] Set environment variables
- [ ] Create MongoDB Atlas cluster
- [ ] Deploy!

### Method 2 (Docker):
- [ ] Create Render account
- [ ] Get API key
- [ ] Create Docker web service
- [ ] Get Service ID
- [ ] Add GitHub secrets
- [ ] Deploy!

---

## 🔑 GitHub Secrets for Method 2

```
RENDER_API_KEY         = (from Render account)
RENDER_SERVICE_ID      = srv-xxxxx (from service URL)
DOCKERHUB_USERNAME     = your_username
DOCKERHUB_TOKEN        = your_token
```

---

## 🎯 Test Your Deployment

```bash
# Get your app URL from Render dashboard
# Format: https://door-service-backend.onrender.com

# Test health endpoint:
curl https://door-service-backend.onrender.com/health

# Should return:
# {"status":"ok","timestamp":"..."}
```

---

## 💡 Which Method?

| Need | Method | Why |
|------|--------|-----|
| Simplest setup | Method 1 | No secrets, auto-deploy from Git |
| Custom builds | Method 2 | More control, Docker images |
| First time | Method 1 | Easier, fewer steps |
| Production | Either | Both are production-ready |

**Recommendation: Start with Method 1** 👈

---

## 🆘 Troubleshooting

**App won't start?**
- Check environment variables in Render
- View Render logs
- Check database connection

**GitHub Actions fails?**
- Check GitHub secrets
- Check Docker Hub credentials
- View GitHub Actions logs

**Database timeout?**
- Add Render IP to MongoDB Atlas whitelist
- Check connection string is correct

---

## 📚 Full Guides

- Detailed guide: [RENDER_DEPLOYMENT_GUIDE.md](./RENDER_DEPLOYMENT_GUIDE.md)
- All deployment options: [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

---

**Choose a method above and get started!** 🚀
