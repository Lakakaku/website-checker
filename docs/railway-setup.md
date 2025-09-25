# Railway Setup Guide

## Quick Setup Steps

### 1. Connect GitHub Repository

1. Go to your Railway project: https://railway.com/project/96de9a23-49ab-423f-8c05-d1fe6e9e535e
2. Click **"+ New"** → **"GitHub Repo"**
3. Authorize Railway to access GitHub (if needed)
4. Select repository: **`Lakakaku/website-checker`**
5. Select branch: **`main`**

### 2. Configure Service Settings

After connecting, configure these settings in Railway:

#### Service Settings:

- **Service Name**: `worker`
- **Root Directory**: Leave as `/` (we handle paths in config)
- **Branch**: `main`

#### Build & Deploy (in Settings):

- **Build Command**:
  ```
  pnpm install --frozen-lockfile && pnpm --filter @website-checker/database prisma:generate && pnpm --filter @website-checker/worker build
  ```
- **Start Command**:
  ```
  pnpm --filter @website-checker/worker start
  ```

### 3. Add Environment Variables

In Railway service settings → Variables, add:

```bash
# Core
NODE_ENV=production
PORT=3001

# Database - Click "Add Reference" and select your Postgres service
DATABASE_URL=${{Postgres.DATABASE_URL}}

# Redis - Click "Add Reference" and select your Redis service
REDIS_URL=${{Redis.REDIS_PUBLIC_URL}}

# Same values as in Vercel:
NEXTAUTH_SECRET=<same-as-vercel>
NEXTAUTH_URL=<your-vercel-url>
STRIPE_API_KEY=<same-as-vercel>
SENTRY_DSN=<same-as-vercel>
```

### 4. Database Setup

Make sure you have these services in Railway:

1. **PostgreSQL Service**:
   - Click "+ New" → "Database" → "Add PostgreSQL"
   - It will auto-generate DATABASE_URL

2. **Redis Service**:
   - Click "+ New" → "Database" → "Add Redis"
   - It will auto-generate REDIS_URL

### 5. Important URLs to Copy

After setup, get these URLs from Railway:

**From PostgreSQL service → Connect tab:**

```
DATABASE_URL=postgresql://postgres:xxx@xxx.railway.app:5432/railway
```

**From Redis service → Connect tab:**

```
REDIS_URL=redis://default:xxx@xxx.railway.app:6379
```

### 6. Share Database with Vercel

Copy the DATABASE_URL and REDIS_URL to your Vercel project:

1. Go to: https://vercel.com/lakakas-projects-b9fec40c/website-checker-web/settings/environment-variables
2. Add the same DATABASE_URL and REDIS_URL from Railway
3. This ensures both services share the same database

### 7. Deploy

After configuration:

1. Railway will automatically deploy when you push to `main`
2. Check the deploy logs in Railway
3. The worker should start and connect to PostgreSQL and Redis

## Verification

Check that everything works:

1. **Railway Logs**: Should show "Worker started" and "Connected to Redis"
2. **Database**: Can verify connection in Railway PostgreSQL metrics
3. **Redis**: Can verify connection in Railway Redis metrics

## Troubleshooting

### "Cannot find pnpm"

Add to Railway settings:

```
NIXPACKS_NODE_VERSION=20
NIXPACKS_PNPM_VERSION=8
```

### "Prisma client not found"

Make sure build command includes:

```
pnpm --filter @website-checker/database prisma:generate
```

### "Connection refused"

- Check DATABASE_URL uses the public URL (not private)
- Check Redis uses REDIS_PUBLIC_URL (not private)

## Next Steps

1. Commit and push the Railway config files:

   ```bash
   git add railway.json apps/worker/railway.toml .env.railway docs/railway-setup.md
   git commit -m "chore: add Railway configuration"
   git push
   ```

2. Railway will auto-deploy on push

3. Monitor the deployment in Railway dashboard
