# Project Overview

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

## Architecture

Three-tier architecture:

1. Customer-facing portal (Vercel) - signup pages and report dashboards
2. Admin panel (Vercel) - company scanning and customer management
3. Background workers (Railway) - website scanning jobs with BullMQ

## Monorepo Structure

Uses Turborepo + pnpm workspaces:

- `apps/web/` - Next.js 14 App Router (customer + admin portals)
- `apps/worker/` - Railway background worker (BullMQ + accessibility scanner)
- `packages/database/` - Prisma schema, migrations, client
- `packages/types/` - Shared TypeScript types
- `packages/config/` - Shared ESLint, TypeScript, Tailwind configs
