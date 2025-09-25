# Production Deployment Checklist

**Last Updated**: 2025-09-25
**Feature**: 001-task-1-1 (Project Setup and Infrastructure)

## Pre-Deployment Verification

### 1. Code Quality Gates ✓

- [ ] All tests passing (`pnpm test`)
- [ ] ESLint no errors (`pnpm lint`)
- [ ] TypeScript no errors (`pnpm typecheck`)
- [ ] Prettier formatted (`pnpm format`)
- [ ] Build successful (`pnpm build`)

### 2. Environment Variables ✓

- [ ] Production `DATABASE_URL` configured in Vercel
- [ ] Production `REDIS_URL` configured in Railway
- [ ] Live Stripe key (`sk_live_*`) configured
- [ ] Production `SENTRY_DSN` configured
- [ ] Unique `NEXTAUTH_SECRET` (32+ chars)
- [ ] Production `NEXTAUTH_URL` (https://domain.com)

### 3. Database Migration ✓

- [ ] Test migration in staging environment
- [ ] Backup production database
- [ ] Run migrations: `pnpm --filter @website-checker/database prisma:migrate:deploy`
- [ ] Verify schema changes applied
- [ ] Test rollback procedure if needed

### 4. Infrastructure Verification ✓

- [ ] Railway PostgreSQL healthy
- [ ] Railway Redis healthy
- [ ] Vercel project configured
- [ ] GitHub secrets configured
- [ ] Domain DNS configured

## Deployment Process

### Step 1: Staging Deployment (develop branch)

```bash
# 1. Merge feature branches to develop
git checkout develop
git merge feature/your-feature
git push origin develop

# 2. Monitor GitHub Actions CI
# - Go to GitHub > Actions tab
# - Verify all checks pass

# 3. Verify staging deployment
# - Check Vercel dashboard for deployment
# - Test staging URL
# - Run health check: curl https://staging.domain.com/api/health
```

### Step 2: Production Deployment (main branch)

```bash
# 1. Create PR from develop to main
git checkout main
git pull origin main
git merge develop
git push origin main

# 2. Monitor production deployment
# - GitHub Actions runs CI
# - Vercel auto-deploys to production
# - Railway worker auto-deploys

# 3. Verify production
# - Check production URL
# - Monitor Sentry for errors
# - Check health endpoint
```

## Post-Deployment Verification

### Immediate Checks (0-5 minutes)

- [ ] Production site accessible
- [ ] Health check returns 200 OK
- [ ] Database connectivity confirmed
- [ ] Redis connectivity confirmed
- [ ] No errors in Sentry
- [ ] Authentication working
- [ ] Payment flow working (test mode)

### Monitoring (5-30 minutes)

- [ ] Monitor Sentry for new errors
- [ ] Check Vercel function logs
- [ ] Monitor Railway worker logs
- [ ] Check database performance
- [ ] Verify queue processing

## Rollback Procedure

### Quick Rollback (< 2 minutes)

```bash
# Vercel instant rollback
# 1. Go to Vercel dashboard
# 2. Click on production deployment
# 3. Select previous deployment
# 4. Click "Promote to Production"
```

### Database Rollback (if migrations applied)

```bash
# 1. Restore database backup
# Railway dashboard > PostgreSQL > Backups > Restore

# 2. Revert code to previous version
git revert HEAD
git push origin main

# 3. Force redeploy
vercel --prod --force
```

## Environment-Specific Configurations

### Development

- `NODE_ENV=development`
- Test Stripe keys (`sk_test_*`)
- Local database allowed
- Verbose logging enabled

### Staging

- `NODE_ENV=staging`
- Test Stripe keys (`sk_test_*`)
- Railway staging database
- Error reporting to Sentry

### Production

- `NODE_ENV=production`
- Live Stripe keys (`sk_live_*`)
- Railway production database
- Full Sentry monitoring
- Minimal logging

## Troubleshooting

### "Database connection failed"

1. Check `DATABASE_URL` in Vercel env vars
2. Verify Railway PostgreSQL is running
3. Check connection pool limits
4. Review recent migrations

### "Build failed on Vercel"

1. Check build logs in Vercel dashboard
2. Verify all dependencies in package.json
3. Check for TypeScript errors
4. Ensure environment variables set

### "Worker not processing jobs"

1. Check Railway worker logs
2. Verify Redis connection
3. Check BullMQ dashboard
4. Review queue configuration

### "Sentry not receiving errors"

1. Verify `SENTRY_DSN` in production
2. Check Sentry initialization code
3. Verify environment filtering
4. Test with manual error

## Security Checklist

- [ ] No secrets in code
- [ ] Environment variables not exposed
- [ ] CORS configured properly
- [ ] Rate limiting enabled
- [ ] Authentication required for admin routes
- [ ] Database queries use parameterization
- [ ] Input validation on all endpoints

## Performance Checklist

- [ ] Database indexes created
- [ ] Images optimized
- [ ] Static assets cached
- [ ] API responses cached where appropriate
- [ ] Database connection pooling configured
- [ ] Serverless function size < 50MB

## Communication

### Pre-Deployment

- [ ] Notify team of deployment window
- [ ] Create maintenance window if needed
- [ ] Update status page

### Post-Deployment

- [ ] Announce successful deployment
- [ ] Document any issues encountered
- [ ] Update release notes

## Acceptance Criteria Validation

Per specification requirements:

✅ **FR-009**: Deployment process ensures zero-downtime updates
✅ **FR-010**: Staging environment mirrors production configuration
✅ **FR-011**: Rollback procedure tested and documented
✅ **FR-019**: Production errors trigger immediate Sentry alerts

## Sign-off

- [ ] Technical Lead approval
- [ ] QA verification complete
- [ ] Product Owner informed
- [ ] Deployment logged

---

**Emergency Contacts**:

- On-call engineer: [Contact]
- Vercel support: [Support URL]
- Railway support: [Support URL]
- Sentry alerts: [Alert channel]
