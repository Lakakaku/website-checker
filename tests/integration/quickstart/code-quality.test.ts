import { describe, it, expect } from 'vitest';
import { existsSync, readFileSync } from 'fs';

describe('Quickstart Scenario 5: Code Quality', () => {
  it('ESLint configuration exists', () => {
    expect(existsSync('packages/config/src/eslint/base.js')).toBe(true);
    expect(existsSync('packages/config/src/eslint/nextjs.js')).toBe(true);
    expect(existsSync('packages/config/src/eslint/node.js')).toBe(true);
  });

  it('Prettier configuration exists', () => {
    expect(existsSync('packages/config/src/prettier.js')).toBe(true);
  });

  it('TypeScript configurations exist', () => {
    expect(existsSync('tsconfig.base.json')).toBe(true);
    expect(existsSync('apps/web/tsconfig.json')).toBe(true);
    expect(existsSync('apps/worker/tsconfig.json')).toBe(true);
  });

  it('Husky pre-commit hook exists and is executable', () => {
    expect(existsSync('.husky/pre-commit')).toBe(true);

    const preCommitContent = readFileSync('.husky/pre-commit', 'utf-8');
    expect(preCommitContent).toContain('lint-staged');
  });

  it('lint-staged configuration exists', () => {
    expect(existsSync('.lintstagedrc.js')).toBe(true);
  });

  it('commitlint configuration exists', () => {
    expect(existsSync('.commitlintrc.js')).toBe(true);
  });

  it('package.json has quality scripts', () => {
    const rootPackage = JSON.parse(readFileSync('package.json', 'utf-8'));

    expect(rootPackage.scripts).toHaveProperty('lint');
    expect(rootPackage.scripts).toHaveProperty('typecheck');
    expect(rootPackage.scripts).toHaveProperty('format');
  });
});
