# Website-Checker

AI-powered accessibility compliance platform helping Swedish companies comply with the European Accessibility Act (EAA) before the June 2025 deadline.

## Overview

Website-Checker automatically scans websites for accessibility issues and provides detailed remediation guides, making EAA compliance simple and efficient for businesses.

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui
- **Database**: Railway PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js (Auth.js)
- **Queue System**: BullMQ with Redis (Railway)
- **Scanner**: Axe-core + Playwright
- **Deployment**:
  - Frontend/API: Vercel
  - Background Jobs: Railway
- **Payment**: Stripe
- **Monitoring**: Sentry

## Monorepo Structure

This project uses Turborepo + pnpm workspaces:

```
website-checker/
├── apps/
│   ├── web/              # Next.js 14 App Router (customer + admin portals)
│   └── worker/           # Railway background worker (BullMQ + scanner)
├── packages/
│   ├── database/         # Prisma schema, migrations, client
│   ├── types/            # Shared TypeScript types
│   └── config/           # Shared ESLint, TypeScript, Tailwind configs
├── .github/workflows/    # CI/CD pipelines
├── .husky/               # Git hooks (pre-commit quality checks)
└── specs/                # Feature specifications
```

## Quick Start

For detailed setup instructions, see [specs/001-task-1-1/quickstart.md](specs/001-task-1-1/quickstart.md).

### Prerequisites

- Node.js 20 LTS
- pnpm 8.x
- Railway account (for PostgreSQL + Redis)
- Vercel account (for deployment)

### Setup (30 minutes)

```bash
# 1. Install dependencies
pnpm install

# 2. Copy environment template
cp .env.example .env.local

# 3. Configure environment variables in .env.local
# - DATABASE_URL (Railway PostgreSQL)
# - REDIS_URL (Railway Redis)
# - STRIPE_API_KEY
# - NEXTAUTH_SECRET
# - NEXTAUTH_URL
# - SENTRY_DSN

# 4. Initialize database
pnpm --filter @website-checker/database prisma:generate
pnpm --filter @website-checker/database prisma:migrate

# 5. Start development servers
pnpm dev
```

## Development Commands

```bash
# Development
pnpm dev                  # Start all services (web + worker)
pnpm dev --filter web     # Start web app only
pnpm dev --filter worker  # Start worker only

# Code Quality
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

# Build
pnpm build                # Build all apps for production
```

## Architecture

### Three-Tier System

1. **Customer Portal** (Vercel)
   - Route group: `(customer)/`
   - Signup pages and report dashboards
   - Server components by default

2. **Admin Panel** (Vercel)
   - Route group: `(admin)/`
   - Company scanning and customer management
   - API routes in `app/api/`

3. **Background Workers** (Railway)
   - Separate Node.js service
   - Axe-core + Playwright scanning
   - BullMQ job processing

All services share Railway PostgreSQL and Redis.

## Code Quality Enforcement

Pre-commit hooks (Husky) block commits with any quality issues:

- ESLint errors/warnings
- Prettier formatting violations
- TypeScript type errors

Auto-fixable issues are corrected automatically. No warnings or errors allowed in committed code.

## Environment Management

- `.env.local` - Local development (gitignored)
- `.env.example` - Template (committed)
- Vercel dashboard - Staging/production env vars
- Railway dashboard - Worker service env vars

### Required Variables

```bash
DATABASE_URL=postgresql://...         # Railway PostgreSQL
REDIS_URL=redis://...                 # Railway Redis
STRIPE_API_KEY=sk_test_...            # Stripe (test/live)
NEXTAUTH_SECRET=...                   # 32+ char secret
NEXTAUTH_URL=http://localhost:3000    # App URL
SENTRY_DSN=https://...                # Sentry error tracking
NODE_ENV=development                  # Environment
```

## Deployment Strategy

- **Main branch** → Vercel production
- **Develop branch** → Vercel staging
- **Feature branches** → CI checks only
- **Railway worker** → Auto-deploy from main

## Monorepo Best Practices

- Workspace protocol for internal deps: `"@website-checker/database": "workspace:*"`
- Shared configs in `packages/config`
- Turborepo caching for faster builds
- Path aliases: `@/components`, `@/lib`, `@/types`

## Next.js 14 Patterns

- Server components by default
- Route groups: `(customer)/` and `(admin)/`
- API routes in `app/api/`
- Metadata API for SEO
- Loading/error states with `loading.tsx` and `error.tsx`

## Database Patterns

- Shared Prisma client via `packages/database`
- Connection pooling for serverless
- Migrations in `packages/database/prisma/migrations/`
- Generated types across all workspaces

## Error Handling

- Sentry captures all unhandled errors
- Immediate alerts for production errors
- Environment separation (dev, staging, prod)
- React error boundaries for component errors

## Contributing

1. Create feature branch from `develop`
2. Follow TDD: Write tests → Implement → Verify
3. Ensure all quality checks pass
4. Submit PR to `develop`

## Testing

- **Unit tests**: Vitest
- **E2E tests**: Playwright
- **Contract tests**: TDD approach with failing tests first

## Project Documentation

- `TASKS.md` - Development tasks and technical specs
- `VISION.md` - Business requirements and sales process
- `CLAUDE.md` - AI assistant guidance
- `specs/` - Feature specifications and plans

## License

Proprietary - All rights reserved

## Support

For issues or questions, contact the development team.
