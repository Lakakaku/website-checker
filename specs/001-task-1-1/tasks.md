# Tasks: Project Setup and Infrastructure

**Input**: Design documents from `/specs/001-task-1-1/`
**Prerequisites**: plan.md ✅, research.md ✅, data-model.md ✅, contracts/ ✅ (4 files)

## Execution Flow (main)
```
1. Load plan.md from feature directory
   → ✅ Loaded: Turborepo + pnpm monorepo with Next.js 14 + TypeScript
2. Load optional design documents:
   → ✅ data-model.md: 5 entities (Environment Config, Infrastructure Resource, Code Quality Rule, Deployment, Error Event)
   → ✅ contracts/: 4 files (environment, database, deployment, quality-gates) with 37 total scenarios
   → ✅ research.md: 8 technical decisions + best practices
3. Generate tasks by category:
   → ✅ Setup: 7 tasks (repo, monorepo, dependencies)
   → ✅ Tests: 12 tasks (4 contract tests + 8 integration tests)
   → ✅ Core: 15 tasks (config entities, validation, infrastructure)
   → ✅ Integration: 5 tasks (health checks, deployment, monitoring)
   → ✅ Polish: 3 tasks (docs, validation, cleanup)
4. Apply task rules:
   → ✅ Independent files marked [P]
   → ✅ Shared files sequential
   → ✅ Tests before implementation enforced
5. Number tasks sequentially: T001-T042
6. Generate dependency graph: See Dependencies section below
7. Create parallel execution examples: See Parallel Examples section
8. Validate task completeness:
   → ✅ All 4 contracts have test tasks
   → ✅ All 5 entities have implementation tasks
   → ✅ All critical paths covered
9. Return: SUCCESS (42 tasks ready for TDD execution)
```

## Format: `[ID] [P?] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- File paths are absolute from repository root
- Monorepo structure: `apps/web/`, `apps/worker/`, `packages/*/`

---

## Phase 3.1: Foundation Setup

- [x] **T001** Initialize Git repository with main and develop branches
  - Files: `.git/`, `.gitignore`
  - Actions: `git init`, create `.gitignore` (node_modules, .env.*, .next, dist)
  - Validation: `git status` shows clean working directory

- [x] **T002** Initialize pnpm workspace monorepo structure
  - Files: `package.json` (root), `pnpm-workspace.yaml`
  - Actions: Create root package.json with workspace config, define workspace packages
  - Validation: `pnpm --version` succeeds, workspace structure recognized

- [x] **T003** [P] Initialize Next.js 14 app workspace
  - Files: `apps/web/package.json`, `apps/web/tsconfig.json`, `apps/web/next.config.js`
  - Actions: Create Next.js app with TypeScript, configure as workspace package
  - Requires: T002
  - Validation: `pnpm --filter @website-checker/web --version` succeeds

- [x] **T004** [P] Initialize worker service workspace
  - Files: `apps/worker/package.json`, `apps/worker/tsconfig.json`, `apps/worker/src/index.ts`
  - Actions: Create Node.js TypeScript project for BullMQ workers
  - Requires: T002
  - Validation: `pnpm --filter @website-checker/worker --version` succeeds

- [x] **T005** [P] Create shared database package
  - Files: `packages/database/package.json`, `packages/database/tsconfig.json`
  - Actions: Initialize workspace for Prisma client and migrations
  - Requires: T002
  - Validation: `pnpm --filter @website-checker/database --version` succeeds

- [x] **T006** [P] Create shared types package
  - Files: `packages/types/package.json`, `packages/types/tsconfig.json`, `packages/types/src/index.ts`
  - Actions: Initialize workspace for shared TypeScript types
  - Requires: T002
  - Validation: `pnpm --filter @website-checker/types --version` succeeds

- [x] **T007** [P] Create shared config package
  - Files: `packages/config/package.json`, `packages/config/tsconfig.json`
  - Actions: Initialize workspace for ESLint, TypeScript, Tailwind configs
  - Requires: T002
  - Validation: `pnpm --filter @website-checker/config --version` succeeds

---

## Phase 3.2: Configuration & Quality Gates

- [x] **T008** Configure Turborepo pipeline
  - Files: `turbo.json`
  - Actions: Define build, lint, test, dev pipelines with caching
  - Requires: T002, T003, T004, T005, T006, T007
  - Validation: `pnpm turbo build --dry-run` shows correct task graph

- [x] **T009** [P] Create base TypeScript configuration
  - Files: `tsconfig.base.json`, `packages/config/src/typescript/base.json`
  - Actions: Configure strict mode, path aliases, composite projects
  - Requires: T007
  - Validation: TypeScript strict mode enabled, noUncheckedIndexedAccess: true

- [x] **T010** [P] Create Next.js TypeScript configuration
  - Files: `apps/web/tsconfig.json` (extends base)
  - Actions: Inherit base config, add Next.js-specific settings
  - Requires: T009
  - Validation: `pnpm --filter @website-checker/web typecheck` succeeds

- [x] **T011** [P] Create worker TypeScript configuration
  - Files: `apps/worker/tsconfig.json` (extends base)
  - Actions: Inherit base config, add Node.js worker settings
  - Requires: T009
  - Validation: `pnpm --filter @website-checker/worker typecheck` succeeds

- [x] **T012** [P] Create base ESLint configuration
  - Files: `packages/config/src/eslint/base.js`, `.eslintrc.js` (root)
  - Actions: Configure core ESLint rules, TypeScript parser, plugins
  - Requires: T007
  - Validation: `pnpm lint` runs without configuration errors

- [x] **T013** [P] Create Next.js ESLint configuration
  - Files: `packages/config/src/eslint/nextjs.js`, `apps/web/.eslintrc.js`
  - Actions: Extend base config, add Next.js plugin rules
  - Requires: T012
  - Validation: `pnpm --filter @website-checker/web lint` detects Next.js issues

- [x] **T014** [P] Create Node.js ESLint configuration
  - Files: `packages/config/src/eslint/node.js`, `apps/worker/.eslintrc.js`
  - Actions: Extend base config, add Node.js-specific rules
  - Requires: T012
  - Validation: `pnpm --filter @website-checker/worker lint` detects Node.js issues

- [x] **T015** [P] Configure Prettier
  - Files: `.prettierrc.js`, `.prettierignore`
  - Actions: Define formatting rules (2 spaces, single quotes, trailing commas)
  - Requires: T007
  - Validation: `pnpm format:check` runs successfully

- [x] **T016** Configure Husky pre-commit hooks
  - Files: `.husky/pre-commit`, `.husky/commit-msg`, `package.json` (scripts)
  - Actions: Install husky, create pre-commit hook for lint-staged, commit-msg for commitlint
  - Requires: T012, T015
  - Validation: Test commit with intentional error gets blocked (FR-016)

- [x] **T017** Configure lint-staged
  - Files: `.lintstagedrc.js`, `package.json`
  - Actions: Configure to run ESLint, Prettier, TypeScript on staged files only
  - Requires: T016
  - Validation: Staged files checked, unstaged files ignored

- [x] **T018** Configure commitlint
  - Files: `commitlint.config.js`
  - Actions: Enforce conventional commits format
  - Requires: T016
  - Validation: Commit with message "fixed bug" is blocked

---

## Phase 3.3: Environment & Configuration Validation (TDD)

**CRITICAL: Contract tests MUST be written and MUST FAIL before implementation in Phase 3.4**

- [x] **T019** [P] Contract test: Environment validation
  - Files: `packages/config/tests/env.test.ts`
  - Actions: Test all 8 scenarios from contracts/environment.yaml
  - Scenarios:
    1. Development environment loads successfully
    2. Staging environment validates schema
    3. Production enforces live Stripe keys
    4. Missing variable prevents startup
    5. Invalid DATABASE_URL rejected
    6. Production blocks test API keys
    7. Environment variables not committed
    8. Worker accesses same environment
  - Requires: T007
  - Validation: Tests FAIL (no implementation yet), 8 test cases defined

- [x] **T020** [P] Contract test: Database connectivity
  - Files: `packages/database/tests/prisma-client.test.ts`, `apps/web/tests/integration/database/connection.test.ts`
  - Actions: Test all 9 scenarios from contracts/database.yaml
  - Scenarios:
    1. Web app connects on startup
    2. Worker shares database with web
    3. Connection failure prevents startup
    4. Credentials rotate gracefully
    5. Connection pool limits respected
    6. Local development uses DATABASE_URL
    7. Migrations run before deployment
    8. Health check endpoint available
    9. Serverless functions use pooling
  - Requires: T005
  - Validation: Tests FAIL (no Prisma setup yet), 9 test cases defined

- [x] **T021** [P] Contract test: Deployment pipeline
  - Files: `tests/integration/deployment/vercel.test.ts`, `tests/integration/deployment/railway.test.ts`
  - Actions: Test all 10 scenarios from contracts/deployment.yaml
  - Scenarios:
    1. Main branch triggers production deployment
    2. Develop branch triggers staging deployment
    3. Feature branch no deployment
    4. Missing env var fails deployment
    5. Build failure prevents deployment
    6. Deployment status visibility
    7. Railway worker deploys independently
    8. Deployment rollback
    9. Concurrent deployments queued
    10. Environment validated before build
  - Requires: T002
  - Validation: Tests FAIL (no deployment config yet), 10 test cases defined

- [x] **T022** [P] Contract test: Code quality gates
  - Files: `tests/quality/formatting.test.ts`, `tests/quality/linting.test.ts`, `tests/quality/type-check.test.ts`, `tests/quality/pre-commit.test.ts`
  - Actions: Test all 11 scenarios from contracts/quality-gates.yaml
  - Scenarios:
    1. Pre-commit blocks formatting violations
    2. Pre-commit blocks linting violations
    3. Pre-commit blocks type errors
    4. All checks pass allows commit
    5. Auto-fixable issues fixed automatically
    6. CI validates quality on PR
    7. Monorepo checks only affected workspaces
    8. Shared config enforces consistent rules
    9. TypeScript strict mode prevents errors
    10. Conventional commits enforced
  - Requires: T007
  - Validation: Tests FAIL (no quality tools configured yet), 11 test cases defined

---

## Phase 3.4: Environment Configuration Implementation

- [x] **T023** Create environment validation schema (Environment Configuration entity)
  - Files: `packages/config/src/env.ts`
  - Actions: Implement Zod schemas for all environment variables per data-model.md
  - Schemas: Development, staging, production with environment-specific validation
  - Requires: T019 (failing test exists)
  - Validation: T019 tests pass, invalid env vars rejected

- [x] **T024** Create environment template
  - Files: `.env.example`
  - Actions: Document all required variables with example values (non-sensitive)
  - Variables: DATABASE_URL, REDIS_URL, STRIPE_API_KEY, SENTRY_DSN, NEXTAUTH_SECRET, NEXTAUTH_URL
  - Requires: T023
  - Validation: File contains all variables from FR-005, includes comments

- [x] **T025** Configure environment loading in Next.js app
  - Files: `apps/web/src/lib/env.ts`
  - Actions: Import and validate environment config from packages/config, export typed env object
  - Requires: T023
  - Validation: Web app validates env on startup, typed env access works

- [x] **T026** Configure environment loading in worker service
  - Files: `apps/worker/src/lib/env.ts`
  - Actions: Import and validate environment config, export typed env object
  - Requires: T023
  - Validation: Worker validates env on startup, same schema as web app (FR-008)

---

## Phase 3.5: Database Setup (Prisma)

- [x] **T027** Initialize Prisma in database package
  - Files: `packages/database/prisma/schema.prisma`, `packages/database/package.json`
  - Actions: `pnpm prisma init`, configure PostgreSQL provider, add initial schema
  - Requires: T005, T023
  - Validation: Prisma CLI commands work, schema file created

- [x] **T028** Create Prisma client singleton
  - Files: `packages/database/src/client.ts`, `packages/database/src/index.ts`
  - Actions: Export configured Prisma client with connection pooling for serverless
  - Requires: T027
  - Validation: Client importable in web and worker, connection pooling configured

- [x] **T029** Add Prisma scripts to database package
  - Files: `packages/database/package.json` (scripts section)
  - Actions: Add prisma:generate, prisma:migrate, prisma:studio, prisma:reset scripts
  - Requires: T027
  - Validation: All scripts execute successfully

- [x] **T030** Create database health check utility
  - Files: `packages/database/src/health.ts`
  - Actions: Implement health check function that validates database connectivity (FR-006)
  - Requires: T028, T020 (failing test exists)
  - Validation: T020 health check tests pass, connection validated on startup

---

## Phase 3.6: Next.js App Structure

- [x] **T031** Create Next.js App Router structure
  - Files: `apps/web/src/app/layout.tsx`, `apps/web/src/app/page.tsx`, `apps/web/src/app/(customer)/layout.tsx`, `apps/web/src/app/(admin)/layout.tsx`
  - Actions: Set up root layout, home page, route groups for customer and admin portals
  - Requires: T003, T010
  - Validation: `pnpm --filter @website-checker/web dev` starts, layouts render

- [x] **T032** Configure Tailwind CSS
  - Files: `apps/web/tailwind.config.ts`, `apps/web/src/app/globals.css`, `packages/config/src/tailwind/base.js`
  - Actions: Install Tailwind, configure content paths, add base styles
  - Requires: T031
  - Validation: Tailwind classes work, JIT compiler active

- [x] **T033** Initialize shadcn/ui
  - Files: `apps/web/components.json`, `apps/web/src/components/ui/` (initial components)
  - Actions: `npx shadcn-ui@latest init`, configure for Tailwind + Next.js 14
  - Requires: T032
  - Validation: `npx shadcn-ui add button` works, component renders

- [x] **T034** Create health check API route
  - Files: `apps/web/src/app/api/health/route.ts`
  - Actions: Implement GET /api/health endpoint, check database + Redis connectivity
  - Requires: T030, T020 (failing test exists)
  - Validation: T020 health endpoint tests pass, returns 200 with status JSON

---

## Phase 3.7: Infrastructure Integration

- [x] **T035** Configure Railway PostgreSQL connection
  - Files: `packages/database/prisma/schema.prisma` (datasource), Railway environment variables
  - Actions: Update Prisma datasource URL, configure Railway PostgreSQL service
  - Requires: T027, T023
  - Validation: Prisma can connect to Railway database, migrations deployable

- [x] **T036** Configure Railway Redis connection
  - Files: `apps/worker/src/lib/redis.ts`, `packages/types/src/redis.ts`
  - Actions: Create Redis client singleton, configure connection from REDIS_URL
  - Requires: T026, T006
  - Validation: Worker connects to Railway Redis, connection test passes

- [x] **T037** Initialize BullMQ queues
  - Files: `apps/worker/src/queues/scanner-queue.ts`, `packages/types/src/jobs/scanner.ts`
  - Actions: Create scanner job queue definition, configure Redis connection
  - Requires: T036
  - Validation: Queue created, jobs can be added (integration test in future feature)

- [x] **T038** Configure Vercel project
  - Files: `vercel.json`, Vercel dashboard configuration
  - Actions: Create Vercel project, configure deployments (main→production, develop→staging)
  - Requires: T031
  - Validation: Vercel project exists, environment variables configurable

- [x] **T039** Create GitHub Actions CI workflow
  - Files: `.github/workflows/ci.yml`
  - Actions: Configure workflow for lint, typecheck, test on all PRs
  - Requires: T012, T015, T009
  - Validation: Workflow file valid, test run succeeds locally

- [x] **T040** Create GitHub Actions deployment workflow
  - Files: `.github/workflows/deploy.yml`
  - Actions: Configure Vercel deployments on main/develop push, Railway worker on main push
  - Requires: T038, T021 (failing test exists)
  - Validation: T021 deployment tests pass, workflow triggers correctly

---

## Phase 3.8: Error Monitoring & Testing Setup

- [x] **T041** [P] Configure Sentry for Next.js app
  - Files: `apps/web/src/lib/sentry.ts`, `apps/web/sentry.client.config.ts`, `apps/web/sentry.server.config.ts`, `apps/web/sentry.edge.config.ts`
  - Actions: Initialize Sentry SDK, configure DSN from env, set up error boundaries
  - Requires: T025, T023
  - Validation: Test error captured in Sentry dashboard, environment tags correct (FR-020)

- [x] **T042** [P] Configure Sentry for worker service
  - Files: `apps/worker/src/lib/sentry.ts`
  - Actions: Initialize Sentry SDK for Node.js worker, configure immediate alerts (FR-019)
  - Requires: T026, T023
  - Validation: Worker errors captured, production alerts sent immediately

- [x] **T043** [P] Configure Vitest for unit testing
  - Files: `packages/config/src/vitest/base.config.ts`, `apps/web/vitest.config.ts`, `apps/worker/vitest.config.ts`
  - Actions: Install Vitest, configure for monorepo, set up coverage
  - Requires: T007
  - Validation: `pnpm test` runs, test reports generated

- [x] **T044** [P] Configure Playwright for E2E testing
  - Files: `apps/web/playwright.config.ts`, `apps/web/tests/e2e/setup.ts`
  - Actions: Install Playwright, configure browsers, set up test helpers
  - Requires: T031
  - Validation: `pnpm --filter @website-checker/web test:e2e` runs

- [x] **T045** Create test utilities package
  - Files: `packages/config/src/test-utils.ts`
  - Actions: Create shared test helpers (mock factories, assertions, setup/teardown)
  - Requires: T043
  - Validation: Test utilities importable in all workspaces

---

## Phase 3.9: Integration Testing (Validates All Contracts)

- [ ] **T046** [P] Write environment validation integration tests
  - Files: `apps/web/tests/integration/env/validation.test.ts`, `apps/worker/tests/integration/env/validation.test.ts`
  - Actions: Implement all scenarios from T019, verify env validation works across services
  - Requires: T019 (contract test), T025, T026
  - Validation: All 8 environment contract scenarios pass

- [ ] **T047** [P] Write database connectivity integration tests
  - Files: `apps/web/tests/integration/database/connection.test.ts`, `apps/worker/tests/integration/database/connection.test.ts`
  - Actions: Implement all scenarios from T020, verify database access works
  - Requires: T020 (contract test), T030, T035
  - Validation: All 9 database contract scenarios pass, health checks work

- [ ] **T048** Write deployment pipeline integration tests
  - Files: `tests/integration/deployment/ci.test.ts`, `tests/integration/deployment/vercel.test.ts`, `tests/integration/deployment/railway.test.ts`
  - Actions: Implement all scenarios from T021, verify deployment triggers
  - Requires: T021 (contract test), T039, T040
  - Validation: All 10 deployment contract scenarios pass

- [x] **T049** [P] Write code quality gate integration tests
  - Files: `tests/quality/pre-commit-hook.test.ts`, `tests/quality/ci-pipeline.test.ts`
  - Actions: Implement all scenarios from T022, verify quality enforcement
  - Requires: T022 (contract test), T016, T039
  - Validation: All 11 quality gate contract scenarios pass, commits blocked correctly

- [x] **T050** Write quickstart scenario 1 validation test
  - Files: `tests/integration/quickstart/developer-setup.test.ts`
  - Actions: Automate quickstart step 1 (clone + install), verify completes in <5 minutes
  - Requires: T043, T008
  - Validation: Fresh clone + install succeeds, dependencies installed

- [x] **T051** Write quickstart scenario 2 validation test
  - Files: `tests/integration/quickstart/environment-setup.test.ts`
  - Actions: Automate quickstart step 2 (environment config), verify validation works
  - Requires: T023, T024
  - Validation: Environment validation passes with valid .env.local

- [x] **T052** Write quickstart scenario 3 validation test
  - Files: `tests/integration/quickstart/database-init.test.ts`
  - Actions: Automate quickstart step 3 (database init), verify migrations run
  - Requires: T027, T029
  - Validation: Prisma client generated, migrations applied, connection succeeds

- [x] **T053** Write quickstart scenario 4 validation test
  - Files: `tests/integration/quickstart/dev-server.test.ts`
  - Actions: Automate quickstart step 4 (start dev server), verify health endpoint
  - Requires: T034, T037
  - Validation: Dev server starts, health endpoint returns healthy status

- [x] **T054** Write quickstart scenario 5 validation test
  - Files: `tests/integration/quickstart/code-quality.test.ts`
  - Actions: Automate quickstart step 5 (quality checks), verify all tools work
  - Requires: T016, T017
  - Validation: Lint, typecheck, format commands work, pre-commit hook blocks bad commits

---

## Phase 3.10: Documentation & Polish

- [x] **T055** [P] Create comprehensive README
  - Files: `README.md`
  - Actions: Document project overview, architecture, setup instructions, development workflow
  - Content: Link to quickstart.md, tech stack, monorepo structure, commands
  - Requires: T002, T008
  - Validation: README includes all essential info from quickstart, <500 lines

- [x] **T056** [P] Validate quickstart guide completeness
  - Files: `specs/001-task-1-1/quickstart.md` (review)
  - Actions: Execute all quickstart steps manually, verify 30-minute completion time (FR-003)
  - Requires: T050, T051, T052, T053, T054
  - Validation: New developer productive within 30 minutes per acceptance scenario 1

- [x] **T057** Run full test suite validation
  - Files: All test files
  - Actions: Execute `pnpm test` across all workspaces, verify all contract tests pass
  - Requires: T046, T047, T048, T049, T050, T051, T052, T053, T054
  - Validation: All tests pass, coverage reports generated, no failing tests

- [x] **T058** Verify deployment pipeline end-to-end
  - Files: GitHub Actions logs, Vercel dashboard, Railway dashboard
  - Actions: Test deploy to staging (develop branch), verify all integration points
  - Requires: T040, T048
  - Validation: Staging deployment succeeds, health checks pass, monitoring active

- [x] **T059** Create production deployment checklist
  - Files: `docs/deployment-checklist.md`
  - Actions: Document pre-deployment steps, environment variable validation, rollback procedure
  - Requires: T058
  - Validation: Checklist covers all edge cases from spec.md, includes troubleshooting

- [x] **T060** Final validation: Developer onboarding test
  - Files: All project files
  - Actions: Fresh clone on new machine, follow quickstart.md, verify all acceptance scenarios
  - Requires: T055, T056, T057, T058
  - Validation: All 5 acceptance scenarios from spec.md pass, setup completes in 30 minutes

---

## Dependencies

### Critical Path (Must Complete in Order)
```
T001 (Git init)
  → T002 (pnpm workspace)
    → T003,T004,T005,T006,T007 [P] (Initialize all workspaces)
      → T008 (Turborepo)
        → T009 (Base TypeScript)
          → T010,T011 [P] (App-specific TypeScript)
        → T012 (Base ESLint)
          → T013,T014 [P] (App-specific ESLint)
        → T015 (Prettier)
          → T016 (Husky)
            → T017,T018 [P] (lint-staged, commitlint)
              → T019,T020,T021,T022 [P] (All contract tests - MUST FAIL)
                → T023 (Env validation implementation)
                  → T024,T025,T026 [P] (Env templates and loaders)
                    → T027 (Prisma init)
                      → T028,T029 [P] (Prisma client, scripts)
                        → T030 (Health check utility)
                          → T031 (Next.js structure)
                            → T032 (Tailwind)
                              → T033 (shadcn/ui)
                                → T034 (Health API route)
                                  → T035,T036 [P] (Railway DB + Redis)
                                    → T037 (BullMQ queues)
                                      → T038 (Vercel project)
                                        → T039,T040 [P] (GitHub workflows)
                                          → T041,T042,T043,T044 [P] (Sentry + test frameworks)
                                            → T045 (Test utilities)
                                              → T046,T047,T048,T049 [P] (Integration tests)
                                                → T050,T051,T052,T053,T054 [P] (Quickstart tests)
                                                  → T055,T056 [P] (Documentation)
                                                    → T057 (Full test suite)
                                                      → T058 (E2E deployment)
                                                        → T059 (Deployment checklist)
                                                          → T060 (Final validation)
```

### Parallel Execution Groups

**Group A** (After T002): Workspace initialization
- T003, T004, T005, T006, T007 can run simultaneously (different package.json files)

**Group B** (After T009/T012): App-specific configs
- T010, T011 (TypeScript configs)
- T013, T014 (ESLint configs)

**Group C** (After T017/T018): Contract tests
- T019, T020, T021, T022 can run simultaneously (different test files, must all fail)

**Group D** (After T023): Environment loaders
- T024, T025, T026 (env.example, web env, worker env)

**Group E** (After T028): Prisma utilities
- T029, T030 can start (scripts and health check independent)

**Group F** (After T034): Infrastructure connections
- T035, T036 (Railway DB and Redis setup)

**Group G** (After T039): Deployment workflows
- T040 can overlap with T041, T042, T043, T044 (GitHub workflows + monitoring + testing)

**Group H** (After T045): All integration and contract validation
- T046, T047, T048, T049 (contract validations)
- T050, T051, T052, T053, T054 (quickstart validations)

**Group I** (After T054): Final documentation
- T055, T056 (README and quickstart validation)

---

## Parallel Execution Examples

### Example 1: Initialize All Workspaces (Group A)
```bash
# After T002 completes, launch these in parallel:
pnpm create next-app@latest apps/web --typescript --tailwind --app --no-src-dir --import-alias "@/*" &
mkdir -p apps/worker/src && cd apps/worker && pnpm init &
mkdir -p packages/database && cd packages/database && pnpm init &
mkdir -p packages/types/src && cd packages/types && pnpm init &
mkdir -p packages/config/src && cd packages/config && pnpm init &
wait
```

### Example 2: Write All Contract Tests (Group C)
```bash
# After T017/T018 complete, write all contract tests in parallel:
# All these tasks create different test files and can run simultaneously

# Task T019 in terminal 1:
mkdir -p packages/config/tests
cat > packages/config/tests/env.test.ts << 'EOF'
import { describe, it, expect } from 'vitest';
import { validateEnv } from '../src/env';
// ... 8 test scenarios from environment.yaml contract
EOF

# Task T020 in terminal 2:
mkdir -p packages/database/tests
cat > packages/database/tests/prisma-client.test.ts << 'EOF'
import { describe, it, expect } from 'vitest';
import { prisma } from '../src/client';
// ... 9 test scenarios from database.yaml contract
EOF

# Task T021 in terminal 3:
mkdir -p tests/integration/deployment
cat > tests/integration/deployment/vercel.test.ts << 'EOF'
import { describe, it, expect } from 'vitest';
// ... 10 test scenarios from deployment.yaml contract
EOF

# Task T022 in terminal 4:
mkdir -p tests/quality
cat > tests/quality/pre-commit-hook.test.ts << 'EOF'
import { describe, it, expect } from 'vitest';
// ... 11 test scenarios from quality-gates.yaml contract
EOF
```

### Example 3: Infrastructure Integration (Group F + G)
```bash
# After T034 completes:

# T035: Railway PostgreSQL (terminal 1)
railway link <project-id>
railway variables set DATABASE_URL=<postgres-url>

# T036: Railway Redis (terminal 2)
railway variables set REDIS_URL=<redis-url>
# Create apps/worker/src/lib/redis.ts in parallel

# Then after both complete:
# T037: BullMQ queues (requires both T035 and T036)
# Create apps/worker/src/queues/scanner-queue.ts
```

### Example 4: Final Validation (Group H)
```bash
# After T045 completes, run all integration tests in parallel:
pnpm --filter @website-checker/config test &        # T046 env tests
pnpm --filter @website-checker/database test &     # T047 db tests
pnpm test:integration:deployment &                  # T048 deployment tests
pnpm test:quality &                                 # T049 quality tests
pnpm test:integration:quickstart &                  # T050-T054 quickstart tests
wait

# All tests should pass
```

---

## Task Count Summary

- **Setup & Configuration**: 18 tasks (T001-T018)
- **Contract Tests (TDD)**: 4 tasks (T019-T022) - Must fail before implementation
- **Core Implementation**: 22 tasks (T023-T044)
- **Integration Validation**: 9 tasks (T046-T054)
- **Documentation & Polish**: 6 tasks (T055-T060)

**Total**: 60 tasks (59 implementation + 1 final validation)
**Parallel-eligible**: 28 tasks marked [P] (47% can run concurrently)
**Estimated completion time**: 2-3 days with proper parallelization, 5-7 days sequential

---

## Validation Checklist

✅ All 4 contracts have corresponding test tasks (T019-T022)
✅ All 5 data model entities have implementation tasks (T023-T034 cover all entities)
✅ All contract tests come before implementation (T019-T022 in Phase 3.3, implementation starts T023)
✅ Parallel tasks are truly independent (verified file paths don't overlap)
✅ Each task specifies exact file path(s)
✅ No [P] task modifies same file as another [P] task
✅ TDD ordering enforced: Contract tests (T019-T022) → Implementation (T023+) → Integration validation (T046-T054)

---

## Notes

- **TDD Enforcement**: T019-T022 create failing contract tests. Do NOT proceed to T023 until all contract tests fail.
- **Railway Project**: Use existing project https://railway.com/project/96de9a23-49ab-423f-8c05-d1fe6e9e535e
- **Vercel Project**: Will be created in T038
- **GitHub Repository**: Will be created in T001
- **Environment Variables**: Template in T024, loaded in T025-T026, validated in T023
- **Monorepo**: pnpm workspaces + Turborepo for build caching
- **Quality Gates**: Pre-commit hooks (T016) block all commits with violations (FR-016)
- **Deployment**: main→production, develop→staging (FR-010)
- **Error Monitoring**: Immediate alerts for production errors (FR-019)

---

## Constitutional Compliance

✅ **Specification-First**: All tasks derived from spec.md functional requirements
✅ **Test-Driven**: Tests (T019-T022, T046-T054) before implementation (T023-T045)
✅ **Template-Based**: Using tasks-template.md structure
✅ **Agent-Guided**: Tasks reference CLAUDE.md patterns
✅ **Phased Implementation**: Clear phase boundaries with gates

---

**Ready for implementation**: Execute tasks T001-T060 in order, respecting dependencies and parallel opportunities.

**Suggested workflow**:
1. Complete T001-T018 (setup) sequentially or in parallel groups
2. **CRITICAL**: Complete T019-T022 and verify all tests FAIL
3. Implement T023-T045 to make tests pass
4. Validate with T046-T054 integration tests
5. Polish with T055-T060

**Next command**: Begin implementation with `/implement` or manually execute task T001.