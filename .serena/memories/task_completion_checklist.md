# Task Completion Checklist

When completing any development task, ensure you run these commands:

## Required Quality Checks

1. `pnpm lint` - ESLint validation (must pass)
2. `pnpm format` - Prettier formatting (must pass)
3. `pnpm typecheck` - TypeScript validation (must pass)
4. `pnpm test` - All tests must pass

## Pre-commit Enforcement

- Husky pre-commit hooks automatically run these checks
- Commits are blocked if any quality issues exist
- Auto-fixable issues are automatically resolved

## Deployment Considerations

- Main branch → Vercel production deployment
- Develop branch → Vercel staging deployment
- Railway worker auto-deploys from main branch
- Environment variables must be set in both Vercel and Railway dashboards

## Database Changes

If you modified the database schema:

1. `pnpm --filter @website-checker/database prisma:generate` - Generate new client
2. `pnpm --filter @website-checker/database prisma:migrate` - Create migration
3. Update production databases via Railway dashboard
