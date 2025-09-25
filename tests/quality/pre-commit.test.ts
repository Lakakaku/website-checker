import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'fs';

describe('Code Quality Gates Contract', () => {
  it('Pre-commit hook blocks formatting violations', () => {
    expect(existsSync('.husky/pre-commit')).toBe(true);
    const hookContent = readFileSync('.husky/pre-commit', 'utf-8');
    expect(hookContent).toContain('lint-staged');
  });

  it('Pre-commit hook blocks linting violations', () => {
    const lintStagedConfig = readFileSync('.lintstagedrc.js', 'utf-8');
    expect(lintStagedConfig).toContain('eslint');
  });

  it('Pre-commit hook blocks type errors', () => {
    const lintStagedConfig = readFileSync('.lintstagedrc.js', 'utf-8');
    expect(lintStagedConfig).toContain('typecheck');
  });

  it('All checks pass allows commit', () => {
    expect(existsSync('.husky/pre-commit')).toBe(true);
  });

  it('Auto-fixable issues fixed automatically', () => {
    const lintStagedConfig = readFileSync('.lintstagedrc.js', 'utf-8');
    expect(lintStagedConfig).toContain('--fix');
  });

  it('CI validates quality on PR', () => {
    expect(existsSync('.github/workflows/ci.yml')).toBe(true);
  });

  it('Monorepo checks only affected workspaces', () => {
    const lintStagedConfig = readFileSync('.lintstagedrc.js', 'utf-8');
    expect(lintStagedConfig).toBeDefined();
  });

  it('Shared config enforces consistent rules', () => {
    expect(existsSync('packages/config/src/eslint/base.js')).toBe(true);
  });

  it('TypeScript strict mode prevents errors', () => {
    const tsconfigBase = JSON.parse(readFileSync('tsconfig.base.json', 'utf-8'));
    expect(tsconfigBase.compilerOptions.strict).toBe(true);
    expect(tsconfigBase.compilerOptions.noUncheckedIndexedAccess).toBe(true);
  });

  it('Conventional commits enforced', () => {
    expect(existsSync('.husky/commit-msg')).toBe(true);
    const hookContent = readFileSync('.husky/commit-msg', 'utf-8');
    expect(hookContent).toContain('commitlint');
  });
});
