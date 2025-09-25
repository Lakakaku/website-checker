import { describe, it, expect } from 'vitest';
import { existsSync } from 'fs';

describe('Linting Quality Gates', () => {
  it('ESLint base config exists', () => {
    expect(existsSync('packages/config/src/eslint/base.js')).toBe(true);
  });

  it('Next.js ESLint config exists', () => {
    expect(existsSync('packages/config/src/eslint/nextjs.js')).toBe(true);
  });

  it('Worker ESLint config exists', () => {
    expect(existsSync('packages/config/src/eslint/node.js')).toBe(true);
  });
});
