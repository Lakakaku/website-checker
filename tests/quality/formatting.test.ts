import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'fs';

describe('Formatting Quality Gates', () => {
  it('Prettier configuration exists', () => {
    expect(existsSync('.prettierrc.js')).toBe(true);
  });

  it('Prettier ignores correct files', () => {
    expect(existsSync('.prettierignore')).toBe(true);
    const ignoreContent = readFileSync('.prettierignore', 'utf-8');
    expect(ignoreContent).toContain('node_modules');
  });
});