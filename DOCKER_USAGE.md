# Docker Setup Guide - Development & Production

This project supports both development and production environments using Docker Compose.

## 📁 Files Structure

- **docker-compose.yml** — Base configuration (shared by all environments)
- **docker-compose.dev.yml** — Development-specific overrides
- **docker-compose.prod.yml** — Production-specific overrides
- **.env.example** — Environment variables template
- **.env.development** — Local development environment file

## 🚀 Quick Start

### Development Environment

**1. Create your .env file (if not already done):**
```bash
cp .env.example .env.development
```

**2. Start the development stack:**
```bash
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build
```

**Or use the shortcut (auto-loads override files):**
```bash
docker-compose up --build
```

**3. Access your application:**
- App: http://localhost:3000
- MongoDB: mongodb://localhost:27017

**4. View logs:**
```bash
docker-compose logs -f app
docker-compose logs -f mongo
```

**5. Stop containers:**
```bash
docker-compose down
```

---

### Production Environment

**1. Set up production environment variables:**
```bash
cp .env.example .env.production
# Edit .env.production with your production values
```

**2. Start the production stack:**
```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

**3. Features in production:**
- ✅ Hot reload disabled
- ✅ Volume mounts removed (immutable containers)
- ✅ Resource limits enforced
- ✅ Health checks enabled
- ✅ Auto-restart on failure

**4. View logs:**
```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml logs -f app
```

**5. Stop production stack:**
```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml down
```

---

## 🔧 Configuration

### Environment Variables

All configurations are managed via `.env` files:

| Variable | Dev Default | Required | Notes |
|----------|------------|----------|-------|
| `NODE_ENV` | development | Yes | development or production |
| `DB_HOST` | mongo | Yes | Database hostname |
| `DB_PORT` | 27017 | Yes | Database port |
| `DB_USER` | root | Yes | Database username |
| `DB_PASSWORD` | password | Yes | Database password |
| `JWT_SECRET` | dev-key | Yes | ⚠️ Change in production |
| `STRIPE_SECRET_KEY` | - | No | Stripe API key |
| `STRIPE_PUBLISHABLE_KEY` | - | No | Stripe public key |

### Customizing Ports

Edit `.env` to change ports:
```env
APP_PORT=8000        # Change app port
MONGO_PORT=27018     # Change MongoDB port
```

---

## 📊 Services

### app (Node.js Express Backend)
- **Development**: Runs with nodemon (hot reload)
- **Production**: Runs with `node src/index.js`
- **Volumes**: Dev has source code mounted, prod doesn't
- **Resources**: Limited to 512MB in production

### mongo (MongoDB)
- **Image**: mongo:6 (latest stable)
- **Data**: Persisted in `mongo_data` volume
- **Auth**: Uses `DB_USER` and `DB_PASSWORD`
- **Health Check**: Automatic ping every 10s

---

## 🛠️ Useful Commands

| Command | Purpose |
|---------|---------|
| `docker-compose up --build` | Build & start (dev) |
| `docker-compose down` | Stop & remove containers |
| `docker-compose down -v` | Stop & remove with volumes |
| `docker-compose logs -f` | View logs in real-time |
| `docker-compose ps` | List running containers |
| `docker-compose exec app npm install` | Install packages in running container |
| `docker-compose rebuild` | Rebuild images |

---

## 🔐 Security Tips

### Development
- ✅ Default credentials are OK for local development
- ✅ Enable CORS for frontend testing

### Production
- 🔐 Change all default passwords
- 🔐 Use strong JWT_SECRET (min 32 characters)
- 🔐 Use MongoDB Atlas with authentication
- 🔐 Update STRIPE keys to production keys
- 🔐 Use HTTPS/TLS for all connections
- 🔐 Remove unused environment variables

---

## 🐛 Troubleshooting

### Port already in use
```bash
# Check what's using port 3000
lsof -i :3000

# Kill process or change port in .env
```

### Database connection failed
```bash
# Ensure MongoDB is running
docker-compose ps mongo

# Check MongoDB logs
docker-compose logs mongo

# Verify credentials in .env
```

### Container won't start
```bash
# View error logs
docker-compose logs app

# Rebuild the image
docker-compose up --build
```

### Rebuild everything from scratch
```bash
docker-compose down -v
docker system prune -a
docker-compose up --build
```

---

## 📝 Notes

- **Auto-Override**: If both `docker-compose.yml` and `docker-compose.override.yml` exist, docker-compose automatically merges them
- **Environment Variables**: Docker Compose reads from `.env` automatically
- **Network**: Both services communicate via `door-network` bridge network
- **Data Persistence**: MongoDB data survives container restarts (unless `-v` flag is used)

---

## 🚀 Next Steps

1. Copy `.env.example` → `.env.development`
2. Run development: `docker-compose up --build`
3. Test your app at http://localhost:3000
4. For production, create `.env.production` with secure values
5. Deploy with: `docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d`
