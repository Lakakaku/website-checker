import { describe, it, expect } from 'vitest';
import { execSync } from 'child_process';
import { existsSync } from 'fs';

describe('Quickstart Scenario 1: Project Setup', () => {
  it('pnpm install succeeds', () => {
    expect(() => execSync('pnpm install --frozen-lockfile', { encoding: 'utf-8' })).not.toThrow();
  });

  it('node_modules directories exist', () => {
    expect(existsSync('node_modules')).toBe(true);
    expect(existsSync('apps/web/node_modules')).toBe(true);
    expect(existsSync('apps/worker/node_modules')).toBe(true);
  });

  it('workspace dependencies are linked', () => {
    const webPackageJson = require('../../../apps/web/package.json');
    expect(webPackageJson.dependencies['@website-checker/database']).toBe('workspace:*');
  });
});