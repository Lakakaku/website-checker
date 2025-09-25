# Quickstart Guide: Website-Checker Development Setup

**Feature**: Project Setup and Infrastructure
**Target Audience**: New developers joining the project
**Estimated Time**: 30 minutes (per FR-003)
**Last Updated**: 2025-09-25

## Prerequisites

Before starting, ensure you have:

- **Node.js 20 LTS** installed (`node --version` should show v20.x.x)
- **pnpm 8+** installed (`pnpm --version` should show 8.x.x or higher)
- **Git** installed and configured
- **Access credentials** for:
  - Railway project (PostgreSQL + Redis)
  - Vercel account (for deployments)
  - Sentry account (for error monitoring)

---

## Step 1: Clone Repository and Install Dependencies

```bash
# Clone the repository
git clone <repository-url> website-checker
cd website-checker

# Install dependencies (pnpm workspaces will install all packages)
pnpm install

# Verify installation
pnpm --version  # Should show 8.x.x+
node --version  # Should show v20.x.x
```

**Expected Result**:

- All dependencies installed across monorepo workspaces
- No installation errors
- `node_modules` created in root and each workspace

**Time**: ~3 minutes

---

## Step 2: Configure Environment Variables

```bash
# Copy environment template
cp .env.example .env.local

# Open .env.local in your editor and fill in the values:
# - DATABASE_URL: Get from Railway PostgreSQL service
# - REDIS_URL: Get from Railway Redis service
# - STRIPE_API_KEY: Use test key (sk_test_...) from Stripe dashboard
# - SENTRY_DSN: Get from Sentry project settings
# - NEXTAUTH_SECRET: Generate with: openssl rand -base64 32
# - NEXTAUTH_URL: Set to http://localhost:3000

# Example .env.local:
DATABASE_URL="postgresql://user:pass@region.railway.app:5432/dbname"
REDIS_URL="redis://default:pass@region.railway.app:6379"
STRIPE_API_KEY="sk_test_51ABC..."
SENTRY_DSN="https://abc123@o123.ingest.sentry.io/456"
NEXTAUTH_SECRET="your-32-char-secret-here"
NEXTAUTH_URL="http://localhost:3000"
NODE_ENV="development"
```

**Validation**:

```bash
# Test environment validation
pnpm --filter @website-checker/config test:env

# Expected output: "✓ Environment variables validated"
```

**Expected Result**:

- `.env.local` file created and filled with valid credentials
- Environment validation passes
- File is gitignored (verify with `git status`)

**Time**: ~5 minutes

---

## Step 3: Initialize Database

```bash
# Generate Prisma client
pnpm --filter @website-checker/database prisma:generate

# Run database migrations
pnpm --filter @website-checker/database prisma:migrate:deploy

# Verify database connection
pnpm --filter @website-checker/web test:db-connection
```

**Expected Result**:

- Prisma client generated in `node_modules/.prisma/client`
- Migrations applied to Railway PostgreSQL database
- Connection test passes with message: "✓ Database connected successfully"
- Tables created in database (verify in Railway dashboard)

**Time**: ~2 minutes

---

## Step 4: Start Development Servers

```bash
# Option 1: Start all services with Turborepo
pnpm dev

# Option 2: Start services individually
pnpm --filter @website-checker/web dev        # Next.js web app on :3000
pnpm --filter @website-checker/worker dev     # Worker service
```

**Expected Result**:

- Next.js dev server running on `http://localhost:3000`
- Worker service running and connected to Redis
- Terminal shows:
  ```
  ✓ Database connected
  ✓ Redis connected
  ✓ Ready on http://localhost:3000
  ```

**Validation**:

```bash
# In a new terminal, test health endpoint
curl http://localhost:3000/api/health

# Expected response:
# {
#   "status": "healthy",
#   "database": "healthy",
#   "redis": "healthy",
#   "timestamp": "2025-09-25T..."
# }
```

**Time**: ~2 minutes

---

## Step 5: Verify Code Quality Setup

```bash
# Run linting across all workspaces
pnpm lint

# Run type checking
pnpm typecheck

# Run formatting check
pnpm format:check

# Auto-fix formatting issues
pnpm format
```

**Expected Result**:

- Lint passes with no errors (0 problems)
- Type check passes with no errors
- Formatting check passes (or auto-fixed)
- All commands execute in <30 seconds

**Test Pre-commit Hook**:

```bash
# Create a test commit with intentional error
echo "const x = 'test'" > test-file.ts
git add test-file.ts
git commit -m "test: verify pre-commit hook"

# Expected: Commit blocked if quality issues detected
# If auto-fixable: Files fixed automatically and commit proceeds
# Clean up: git reset HEAD~1 && rm test-file.ts
```

**Time**: ~3 minutes

---

## Step 6: Run Test Suite

```bash
# Run all tests across monorepo
pnpm test

# Run tests for specific workspace
pnpm --filter @website-checker/web test
pnpm --filter @website-checker/worker test

# Run tests in watch mode
pnpm test:watch
```

**Expected Result**:

- All contract tests pass (environment, database, quality gates)
- Test coverage reports generated
- No failing tests
- Output shows test summary with pass/fail counts

**Time**: ~5 minutes

---

## Step 7: Verify Sentry Integration

```bash
# Trigger a test error to verify Sentry capture
pnpm --filter @website-checker/web test:sentry

# Expected:
# - Error captured in Sentry dashboard
# - Alert sent if production environment (not in development)
# - Error visible in Sentry project within 30 seconds
```

**Manual Verification**:

1. Open Sentry dashboard
2. Check for test error event
3. Verify environment tag is "development"
4. Verify context includes request details

**Time**: ~2 minutes

---

## Step 8: Test Deployment Pipeline (Optional)

⚠️ **Note**: Only perform if you have Vercel access and want to test deployment.

```bash
# Create a test branch
git checkout -b test/deployment-verification
git push origin test/deployment-verification

# Verify GitHub Actions CI runs
# - Go to GitHub repository > Actions tab
# - See workflow running for your branch
# - Verify all checks pass (lint, typecheck, test)

# Verify Vercel deployment does NOT trigger (feature branches disabled per FR-010)
# - Go to Vercel dashboard
# - Should NOT see deployment for your test branch
```

**Cleanup**:

```bash
git checkout main
git branch -D test/deployment-verification
git push origin --delete test/deployment-verification
```

**Time**: ~5 minutes (optional)

---

## Verification Checklist

Mark each item as you complete it:

### Environment Setup

- [ ] Node.js 20 LTS installed and verified
- [ ] pnpm 8+ installed and verified
- [ ] Dependencies installed without errors
- [ ] `.env.local` file created and configured
- [ ] Environment validation passes

### Database & Infrastructure

- [ ] Prisma client generated
- [ ] Database migrations applied
- [ ] Database connection test passes
- [ ] Redis connection test passes
- [ ] Health endpoint returns 200 OK

### Development Workflow

- [ ] Next.js dev server starts on :3000
- [ ] Worker service starts and connects to Redis
- [ ] Hot reload works (test by editing a file)
- [ ] Browser shows Next.js welcome page

### Code Quality

- [ ] ESLint runs without errors
- [ ] TypeScript type checking passes
- [ ] Prettier formatting check passes
- [ ] Pre-commit hook blocks bad commits
- [ ] All quality checks complete in <30 seconds

### Testing

- [ ] Test suite runs successfully
- [ ] All contract tests pass
- [ ] Test coverage reports generated
- [ ] Tests complete in <2 minutes

### Monitoring

- [ ] Sentry test error captured
- [ ] Error visible in Sentry dashboard
- [ ] Environment tag correct (development)

### Total Time: ~30 minutes

As required by FR-003: "System MUST document the setup process in a way that allows a new developer to become productive within one hour"

---

## Troubleshooting

### "Database connection failed"

**Cause**: Invalid `DATABASE_URL` or Railway database offline

**Solution**:

1. Verify `DATABASE_URL` in `.env.local` matches Railway dashboard
2. Check Railway database status in Railway dashboard
3. Test connection manually: `pnpm --filter @website-checker/database prisma studio`

---

### "Pre-commit hook not blocking commits"

**Cause**: Husky not installed properly

**Solution**:

```bash
pnpm husky install
git config core.hooksPath .husky
```

---

### "TypeScript errors in node_modules"

**Cause**: Stale Prisma client or missing types

**Solution**:

```bash
pnpm --filter @website-checker/database prisma:generate
pnpm install
```

---

### "Port 3000 already in use"

**Cause**: Another process using port 3000

**Solution**:

```bash
# Find and kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use a different port
PORT=3001 pnpm dev
```

---

### "Sentry error not captured"

**Cause**: Invalid `SENTRY_DSN` or development environment filtered

**Solution**:

1. Verify `SENTRY_DSN` in `.env.local`
2. Check Sentry project settings for DSN
3. Development errors may be filtered - check `beforeSend` hook

---

## Next Steps

After completing this quickstart:

1. **Read the CLAUDE.md file** for project conventions and patterns
2. **Review the architecture** in VISION.md and TASKS.md
3. **Pick a task** from the tasks.md file to work on
4. **Create a feature branch** following naming convention: `feature/task-number-description`
5. **Follow TDD workflow**: Write tests → See them fail → Implement → See them pass

---

## Additional Resources

- **Monorepo Commands**: See `package.json` scripts in root
- **Turborepo Pipeline**: See `turbo.json` for task dependencies
- **Prisma Schema**: See `packages/database/prisma/schema.prisma`
- **Environment Validation**: See `packages/config/src/env.ts`
- **Health Checks**: See `apps/web/src/app/api/health/route.ts`

---

**Acceptance Criteria** (from specification):

✅ FR-001: Reproducible development environment - All steps documented above
✅ FR-002: Configuration files specify dependencies - package.json files committed
✅ FR-003: Setup completes within one hour - 30 minutes total estimated time
✅ FR-006: Database connectivity validated on startup - Health check step included

**Constitutional Compliance**:

✅ **Specification-First**: Quickstart maps to acceptance scenarios
✅ **Test-Driven**: Test suite validation included
✅ **Template-Based**: Following quickstart template structure

---

_For issues or questions, create a GitHub issue or contact the team lead._
