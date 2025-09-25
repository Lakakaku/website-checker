# Code Style and Conventions

## TypeScript Configuration

- Strict mode enabled across all packages
- Path aliases: `@/components`, `@/lib`, `@/types`
- Shared TypeScript config via `tsconfig.base.json`

## Next.js 14 App Router Patterns

- Server components by default (no `'use client'` unless needed)
- Route groups for customer `(customer)/` and admin `(admin)/` portals
- API routes in `app/api/` for backend endpoints
- Loading/error states with `loading.tsx` and `error.tsx`

## Monorepo Best Practices

- Use workspace protocol for internal dependencies: `"@website-checker/database": "workspace:*"`
- Shared configs in `packages/config` (ESLint, TypeScript, Tailwind)
- Turborepo caching for faster builds/tests

## Database Patterns (Prisma)

- Shared Prisma client via `packages/database`
- Connection pooling for Vercel serverless functions
- Migrations in `packages/database/prisma/migrations/`

## Code Quality Standards

- ESLint + Prettier enforced via pre-commit hooks
- No warnings or errors allowed in committed code
- TypeScript strict mode required
- Test-driven development (TDD) approach
