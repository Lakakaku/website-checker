# Phase 0: Research & Technical Decisions

**Feature**: Project Setup and Infrastructure
**Date**: 2025-09-25
**Status**: Complete

## Overview

This document consolidates research findings and technical decisions for establishing the Website-Checker development infrastructure. All decisions align with the user-provided tech stack and constitutional principles.

## Key Technical Decisions

### 1. Monorepo Strategy

**Decision**: Turborepo + pnpm workspaces

**Rationale**:

- Turborepo provides intelligent caching and parallel execution for builds/tests
- pnpm workspaces offer efficient disk usage (30-50% smaller than npm/yarn)
- Native support for Next.js, TypeScript, and shared packages
- Vercel provides first-class Turborepo integration
- Constitutional alignment: Enables shared types/config packages reducing duplication

**Alternatives Considered**:

- **Nx**: More features but higher complexity, overkill for initial setup
- **Lerna**: Less active development, no built-in caching
- **Yarn Workspaces**: Slower than pnpm, no intelligent caching like Turborepo

**Implementation Notes**:

- Root `turbo.json` defines pipeline dependencies
- Shared `packages/config` for ESLint, TypeScript, Tailwind configs
- Shared `packages/types` for type definitions across apps
- Shared `packages/database` for Prisma client singleton

---

### 2. Database ORM

**Decision**: Prisma ORM

**Rationale**:

- Type-safe database access with generated TypeScript types
- Excellent Railway PostgreSQL integration
- Migration system aligned with TDD workflow (schema → migration → tests)
- Built-in connection pooling for Vercel serverless functions
- Strong Next.js 14 ecosystem support

**Alternatives Considered**:

- **Drizzle ORM**: Newer, less mature ecosystem, fewer Railway examples
- **TypeORM**: More verbose decorators, weaker TypeScript inference
- **Kysely**: SQL-first approach less suitable for rapid iteration

**Implementation Notes**:

- Prisma client as shared package (`packages/database`)
- Connection pooling via Prisma Data Proxy for Vercel Edge
- Separate migration files for Railway vs. Vercel databases if needed

---

### 3. Code Quality Enforcement

**Decision**: ESLint + Prettier + TypeScript strict + Husky + lint-staged

**Rationale**:

- ESLint with Next.js plugin catches React/Next.js specific issues
- Prettier ensures consistent formatting (constitutional requirement)
- TypeScript strict mode prevents common runtime errors
- Husky pre-commit hooks enforce quality gates (FR-013 to FR-016)
- lint-staged only checks changed files (faster commits)

**Alternatives Considered**:

- **Biome**: Faster but less Next.js-specific rules, newer ecosystem
- **Standard.js**: No configuration but less flexible for monorepo
- **Lefthook**: Similar to Husky but Go-based, less TypeScript tooling

**Implementation Notes**:

- Shared ESLint config in `packages/config/eslint`
- Pre-commit hook blocks commits with any violations (FR-016)
- Separate configs for Next.js app vs. Node.js worker
- TypeScript `strict: true` + `noUncheckedIndexedAccess: true`

---

### 4. Environment Variable Management

**Decision**: Zod-validated environment schemas + T3 Env pattern

**Rationale**:

- Runtime validation prevents deployment with missing env vars (FR-011)
- Type-safe access to environment variables throughout codebase
- Clear error messages for misconfiguration
- Separation of client vs. server environment variables (Next.js requirement)

**Alternatives Considered**:

- **dotenv-safe**: No runtime validation, JavaScript only
- **envalid**: Less TypeScript integration, no Next.js client/server split
- **joi**: More verbose schema syntax

**Implementation Notes**:

- Shared `packages/config/src/env.ts` with Zod schemas
- Separate schemas for each environment (local, staging, production)
- Next.js `NEXT_PUBLIC_` prefix for client-side variables
- `.env.example` template committed, `.env.local` gitignored (FR-005)

---

### 5. Testing Framework

**Decision**: Vitest (unit) + Playwright (E2E) + React Testing Library (components)

**Rationale**:

- Vitest 5x faster than Jest with native ESM and TypeScript support
- Playwright superior to Cypress for multi-browser testing
- React Testing Library aligns with Next.js best practices
- All frameworks support TDD workflow (constitutional requirement)

**Alternatives Considered**:

- **Jest**: Slower, requires more configuration for ESM/TypeScript
- **Cypress**: E2E only, slower than Playwright, no Webkit support
- **Testing Library**: No E2E capabilities

**Implementation Notes**:

- Vitest for unit tests with `in-source` testing option
- Playwright for E2E tests of customer/admin portals
- Supertest for API route contract tests
- Shared test utilities in `packages/config/src/test-utils`

---

### 6. Deployment Strategy

**Decision**: Vercel (frontend/API) + Railway (workers) with dual environments

**Rationale**:

- Vercel native Next.js 14 App Router support with edge runtime
- Railway for long-running worker processes (Vercel 10s timeout limitation)
- Git-based deployments align with constitutional phased implementation
- Separate staging (develop branch) and production (main branch) per FR-010

**Alternatives Considered**:

- **All Vercel**: Cannot run BullMQ workers (requires long-running processes)
- **All Railway**: More expensive for frontend, less Next.js optimization
- **AWS/GCP**: Higher complexity, slower iteration for initial setup

**Implementation Notes**:

- Vercel project with preview deployments disabled (main + develop only)
- Railway services: PostgreSQL, Redis, Worker (Node.js)
- Environment variables synced via Railway CLI and Vercel CLI
- GitHub Actions trigger Vercel deployments on branch push

---

### 7. Error Monitoring

**Decision**: Sentry with immediate alerting for production errors

**Rationale**:

- Native Next.js 14 integration with automatic source maps
- Immediate Slack/email alerts for any production error (FR-019)
- Environment separation (development, staging, production) per FR-020
- Session replay for debugging user-reported issues

**Alternatives Considered**:

- **LogRocket**: More expensive, focuses on session replay vs. error tracking
- **Rollbar**: Less Next.js ecosystem integration
- **BugSnag**: Weaker TypeScript support

**Implementation Notes**:

- Sentry DSN per environment in environment variables
- `beforeSend` hook to filter development errors from staging/prod
- Custom tags for customer portal vs. admin panel errors
- Error boundaries for React component error catching

---

### 8. Background Job Queue

**Decision**: BullMQ + Redis on Railway

**Rationale**:

- BullMQ modern successor to Bull with better TypeScript support
- Redis hosted on Railway in same project as PostgreSQL (low latency)
- Supports complex job patterns (delays, retries, priorities) for scanning
- Constitutional alignment: Separate concerns (web vs. workers)

**Alternatives Considered**:

- **Agenda**: MongoDB-based, adds complexity with second database
- **Bee-Queue**: Simpler but lacks advanced features needed for scanning
- **Graphile Worker**: PostgreSQL-based but higher DB load

**Implementation Notes**:

- Separate Railway service for worker process
- Job definitions in `apps/worker/src/jobs`
- Queue definitions in `apps/worker/src/queues`
- Shared job types in `packages/types/src/jobs`

---

## Deferred Decisions

These decisions are deferred to feature-specific planning:

1. **Email Service** (Resend vs. SendGrid): Will be decided during email notification feature implementation
2. **Analytics** (Mixpanel vs. PostHog): Will be decided during analytics feature implementation
3. **PDF Generation** (React-pdf vs. Puppeteer): Will be decided during report generation feature implementation
4. **Charts Library** (Recharts vs. Chart.js): Will be decided during dashboard feature implementation

Rationale: These libraries don't affect infrastructure setup and can be added incrementally without rearchitecture.

---

## Best Practices Applied

### Next.js 14 App Router

- Server components by default for better performance
- Client components only when needed (`'use client'` directive)
- Route groups for customer `(customer)/` and admin `(admin)/` portals
- API routes in `app/api/` for backend endpoints
- Metadata API for SEO optimization

### TypeScript Configuration

- Strict mode enabled across all packages
- Path aliases for cleaner imports (`@/components`, `@/lib`)
- Composite projects for faster builds in monorepo
- Project references between packages

### Security Best Practices

- Environment variables never committed to Git (`.env*` in `.gitignore`)
- Sentry filtering to prevent logging sensitive data
- Prisma connection strings via environment variables only
- NextAuth.js for authentication (setup in future feature)
- CORS configuration for API routes

### Performance Optimization

- Turborepo caching for faster CI/CD builds
- pnpm for reduced disk usage and faster installs
- Next.js automatic code splitting
- Prisma connection pooling for serverless
- Redis for session storage and caching

---

## Integration Points

### Railway → Vercel

- Shared PostgreSQL connection string via environment variables
- Redis connection string for session storage
- BullMQ job queue accessible from Next.js API routes

### GitHub → Vercel

- Automatic deployments on `main` (production) and `develop` (staging) push
- Environment variables configured in Vercel dashboard
- Build logs visible in Vercel deployments tab

### GitHub → Railway

- Automatic worker deployments on `main` branch push
- Environment variables configured in Railway dashboard
- Logs accessible via Railway CLI

---

## Constitutional Compliance

✅ **Specification-First**: All decisions traced to functional requirements
✅ **Test-Driven**: Testing frameworks selected support TDD workflow
✅ **Template-Based**: Following plan-template.md structure
✅ **Agent-Guided**: CLAUDE.md will be updated with these patterns
✅ **Phased Implementation**: Research complete before design phase

---

**Status**: All technical unknowns resolved. Ready for Phase 1 (Design & Contracts).
