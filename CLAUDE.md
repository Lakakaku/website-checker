# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Website-Checker is an AI-powered accessibility compliance platform helping Swedish companies comply with the European Accessibility Act (EAA) before the June 2025 deadline. The platform automatically scans websites for accessibility issues and provides detailed remediation guides.

## Tech Stack

- **Frontend**: Next.js 14 (App Router) with TypeScript, Tailwind CSS, shadcn/ui
- **Database**: Railway PostgreSQL
- **Authentication**: NextAuth.js (Auth.js)
- **Hosting**:
  - Frontend/API: Vercel
  - Database + Background Jobs: Railway
- **Payment**: Stripe
- **Queue System**: BullMQ with Redis (Railway)
- **Scanner**: Axe-core + Playwright

## Project Structure

- `TASKS.md` - Detailed development tasks and technical specifications
- `VISION.md` - Business requirements and sales process documentation

## Project Structure

This is a monorepo using Turborepo + pnpm workspaces:

```
website-checker/
├── apps/
│   ├── web/              # Next.js 14 App Router (customer + admin portals)
│   └── worker/           # Railway background worker (BullMQ + accessibility scanner)
├── packages/
│   ├── database/         # Prisma schema, migrations, client
│   ├── types/            # Shared TypeScript types
│   └── config/           # Shared ESLint, TypeScript, Tailwind configs
├── .github/workflows/    # CI/CD pipelines
├── .husky/               # Git hooks (pre-commit quality checks)
└── specs/                # Feature specifications and implementation plans
```

## Development Commands

```bash
# Install dependencies
pnpm install

# Development (all services)
pnpm dev

# Linting and formatting
pnpm lint                 # ESLint check
pnpm format               # Prettier auto-fix
pnpm typecheck            # TypeScript validation

# Testing
pnpm test                 # Run all tests
pnpm test:watch           # Watch mode

# Database
pnpm --filter @website-checker/database prisma:generate    # Generate Prisma client
pnpm --filter @website-checker/database prisma:migrate     # Create migration
pnpm --filter @website-checker/database prisma:studio      # Database GUI
```

## Architecture

The application follows a three-tier architecture:

1. **Customer-facing portal** (Vercel) - Signup pages and report dashboards
   - Next.js App Router with route groups: `(customer)/`
   - Server components by default for performance
   - Client components only when needed (`'use client'` directive)

2. **Admin panel** (Vercel) - Company scanning and customer management
   - Next.js App Router with route groups: `(admin)/`
   - Shared components with customer portal via `components/`
   - API routes in `app/api/` for backend endpoints

3. **Background workers** (Railway) - Website scanning jobs with BullMQ
   - Separate Node.js service for long-running processes
   - Axe-core + Playwright for accessibility scanning
   - Shared database access via Prisma client

All data is stored in Railway PostgreSQL, with Redis for job queuing.

## Development Workflow

### Feature Development
1. Specifications created via `/specify` command (stored in `specs/`)
2. Ambiguities resolved via `/clarify` command
3. Implementation plans via `/plan` command
4. Tasks generated via `/tasks` command
5. Follow TDD: Write tests → See fail → Implement → See pass

### Code Quality Enforcement
- **Pre-commit hooks** (Husky) block commits with any quality issues (FR-016)
- ESLint, Prettier, TypeScript strict mode all enforced
- No warnings or errors allowed in committed code
- Auto-fixable issues are fixed automatically

### Environment Management
- `.env.local` for local development (gitignored)
- `.env.example` template (committed)
- Vercel dashboard for staging/production environment variables
- Railway dashboard for worker service environment variables
- Required variables: `DATABASE_URL`, `REDIS_URL`, `STRIPE_API_KEY`, `SENTRY_DSN`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`

### Deployment Strategy
- **Main branch** → Vercel production deployment
- **Develop branch** → Vercel staging deployment
- **Feature branches** → CI checks only, no deployment
- Railway worker auto-deploys from main branch

## Key Patterns

### Monorepo Best Practices
- Use workspace protocol for internal dependencies: `"@website-checker/database": "workspace:*"`
- Shared configs in `packages/config` (ESLint, TypeScript, Tailwind)
- Turborepo caching for faster builds/tests
- Path aliases: `@/components`, `@/lib`, `@/types`

### Next.js 14 App Router Patterns
- Server components by default (no `'use client'` unless needed)
- Route groups for customer `(customer)/` and admin `(admin)/` portals
- API routes in `app/api/` for backend endpoints
- Metadata API for SEO optimization
- Loading/error states with `loading.tsx` and `error.tsx`

### Database Patterns (Prisma)
- Shared Prisma client via `packages/database`
- Connection pooling for Vercel serverless functions
- Migrations in `packages/database/prisma/migrations/`
- Generated types available across all workspaces

### Error Handling
- Sentry captures all unhandled errors
- Immediate alerts for production errors (FR-019)
- Environment separation (development, staging, production)
- Error boundaries for React component errors

## Recent Changes (Last 3 Features)

### 001-task-1-1: Project Setup and Infrastructure (2025-09-25)
- Initialized monorepo structure with Turborepo + pnpm workspaces
- Configured Next.js 14 App Router with TypeScript strict mode
- Set up Railway PostgreSQL + Redis for data and job queue
- Implemented Vercel deployment pipeline (main → production, develop → staging)
- Enforced code quality gates with ESLint, Prettier, Husky pre-commit hooks
- Integrated Sentry error monitoring with immediate production alerts
- Created shared packages for database (Prisma), types, and config
