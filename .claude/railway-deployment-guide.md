# Railway Deployment Configuration

## Database Connection Strategy

### Local Development (Your Machine)
- **PostgreSQL**: `DATABASE_URL` = public endpoint (`trolley.proxy.rlwy.net:47608`)
- **Redis**: `REDIS_URL` = public endpoint (`interchange.proxy.rlwy.net:33477`)
- **Egress Fees**: Minimal - accepted during development
- **How to minimize fees**:
  - Only connect when actively developing database features
  - Use connection pooling (Prisma built-in)
  - Close connections when not in use
  - Avoid running long-lived processes locally that constantly poll databases

### Vercel Deployment (Next.js App)
- **PostgreSQL**: Use public endpoint (egress fees apply - unavoidable)
- **Redis**: Use public endpoint (egress fees apply - unavoidable)
- **Optimization**: Keep database queries efficient, use caching

### Railway Worker Deployment (BullMQ Background Jobs)
- **PostgreSQL**: Use `DATABASE_PRIVATE_URL` (private endpoint - NO fees)
- **Redis**: Use `REDIS_PRIVATE_URL` (private endpoint - NO fees)
- **Configuration**: Set environment variables in Railway dashboard to use private URLs

## Fee Minimization Checklist
- ✅ Use private endpoints for Railway-to-Railway communication (worker service)
- ✅ Implement database connection pooling
- ✅ Use Prisma's connection limit settings
- ✅ Cache frequently accessed data
- ✅ Batch database operations where possible
- ✅ Don't run unnecessary background processes locally
- ⚠️ Accept small egress fees for local dev and Vercel (unavoidable for external services)

## Environment Variables Setup

### .env.local (Local Development)
```
DATABASE_URL=postgresql://...@trolley.proxy.rlwy.net:47608/railway
REDIS_URL=redis://...@interchange.proxy.rlwy.net:33477
```

### Railway Worker Service (Production)
```
DATABASE_URL=postgresql://...@postgres.railway.internal:5432/railway
REDIS_URL=redis://...@redis.railway.internal:6379
```

### Vercel (Production)
```
DATABASE_URL=postgresql://...@trolley.proxy.rlwy.net:47608/railway
REDIS_URL=redis://...@interchange.proxy.rlwy.net:33477
```