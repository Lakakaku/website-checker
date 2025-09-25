# Claude Code Hooks Configuration Reference

This file contains recommended hooks configuration for the Website-Checker project.
Once the project is initialized with package.json, add these to your Claude Code settings.

## Recommended Hooks

### Post-Edit Hook (After file modifications)
Runs type checking and linting after editing TypeScript/React files.

```json
{
  "postEdit": {
    "command": "npm run type-check && npm run lint -- --fix",
    "filePatterns": ["**/*.ts", "**/*.tsx"],
    "description": "Type check and lint modified files"
  }
}
```

### Pre-Commit Hook (Before git commits)
Ensures code builds and passes tests before committing.

```json
{
  "preCommit": {
    "command": "npm run build && npm run test",
    "description": "Build and test before committing"
  }
}
```

### Post-Install Hook (After npm install)
Generates Prisma client after dependency installation.

```json
{
  "postInstall": {
    "command": "npx prisma generate",
    "description": "Generate Prisma client after installing dependencies"
  }
}
```

### Pre-Deploy Hook (Before deployment)
Comprehensive validation before deploying.

```json
{
  "preDeploy": {
    "command": "npm run lint && npm run type-check && npm run build && npm run test",
    "description": "Full validation before deployment"
  }
}
```

## Expected package.json Scripts

Once the project is set up, ensure these scripts exist:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit",
    "test": "jest",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev"
  }
}
```

## Applying Hooks to Claude Code Settings

Add these to your Claude Code settings file (typically `~/.config/claude-code/settings.json`):

```json
{
  "hooks": {
    "postEdit": "npm run type-check && npm run lint -- --fix",
    "preCommit": "npm run build && npm run test"
  }
}
```

## Notes

- Hooks should fail fast - if type-check fails, don't run lint
- Use `&&` for sequential execution, `||` for fallback behavior
- Keep hooks lightweight to avoid slowing down development
- Consider using `--max-warnings=0` with ESLint in CI/production hooks