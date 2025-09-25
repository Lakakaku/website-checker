import { describe, it, expect } from 'vitest';
import { execSync } from 'child_process';

describe('Quality Gates Integration', () => {
  it('lint command runs successfully', () => {
    expect(() => execSync('pnpm lint', { encoding: 'utf-8' })).not.toThrow();
  });

  it('typecheck command runs successfully', () => {
    expect(() => execSync('pnpm typecheck', { encoding: 'utf-8' })).not.toThrow();
  });

  it('format command runs successfully', () => {
    expect(() => execSync('pnpm format', { encoding: 'utf-8' })).not.toThrow();
  });

  it('pre-commit hook exists', () => {
    expect(() => execSync('test -f .husky/pre-commit', { encoding: 'utf-8' })).not.toThrow();
  });
});
