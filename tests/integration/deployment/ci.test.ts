import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'fs';

describe('Deployment Pipeline Integration', () => {
  it('CI workflow exists', () => {
    expect(existsSync('.github/workflows/ci.yml')).toBe(true);
  });

  it('Deploy workflow exists', () => {
    expect(existsSync('.github/workflows/deploy.yml')).toBe(true);
  });
});