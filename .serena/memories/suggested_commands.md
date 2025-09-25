# Suggested Development Commands

## Core Development Commands

- `pnpm install` - Install dependencies
- `pnpm dev` - Start development servers for all services
- `pnpm build` - Build all applications
- `pnpm lint` - ESLint check across all packages
- `pnpm format` - Auto-fix Prettier formatting
- `pnpm typecheck` - TypeScript validation
- `pnpm test` - Run all tests
- `pnpm test:watch` - Run tests in watch mode

## Database Commands

- `pnpm --filter @website-checker/database prisma:generate` - Generate Prisma client
- `pnpm --filter @website-checker/database prisma:migrate` - Create/run migrations
- `pnpm --filter @website-checker/database prisma:studio` - Open database GUI

## System Commands (Darwin/macOS)

- `ls` - List directory contents
- `cd` - Change directory
- `grep` - Search text patterns
- `find` - Find files/directories
- `git` - Git version control commands
- `pnpm` - Package manager (preferred over npm)

## Quality Control

- All commits must pass pre-commit hooks (Husky)
- ESLint, Prettier, TypeScript strict mode enforced
- No warnings or errors allowed in committed code
