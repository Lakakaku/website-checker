import { describe, it, expect, beforeAll } from 'vitest';
import { existsSync, readFileSync, writeFileSync, unlinkSync } from 'fs';
import { join } from 'path';
import { validateEnv } from '@website-checker/config/src/env.js';

describe('Quickstart Scenario 2: Environment Setup', () => {
  const testEnvPath = join(process.cwd(), '.env.test');

  beforeAll(() => {
    if (existsSync(testEnvPath)) {
      unlinkSync(testEnvPath);
    }
  });

  it('.env.example exists and contains all required variables', () => {
    expect(existsSync('.env.example')).toBe(true);

    const envExample = readFileSync('.env.example', 'utf-8');
    const requiredVars = [
      'DATABASE_URL',
      'REDIS_URL',
      'STRIPE_API_KEY',
      'NEXTAUTH_SECRET',
      'NEXTAUTH_URL',
      'SENTRY_DSN',
    ];

    requiredVars.forEach((varName) => {
      expect(envExample).toContain(varName);
    });
  });

  it('environment validation works with valid config', () => {
    const validEnv = `
DATABASE_URL=postgresql://user:pass@localhost:5432/db
REDIS_URL=redis://localhost:6379
STRIPE_API_KEY=sk_test_test123
NEXTAUTH_SECRET=test-secret-min-32-chars-long-12345
NEXTAUTH_URL=http://localhost:3000
SENTRY_DSN=https://test@sentry.io/123
NODE_ENV=development
`;

    writeFileSync(testEnvPath, validEnv);

    process.env.DATABASE_URL = 'postgresql://user:pass@localhost:5432/db';
    process.env.REDIS_URL = 'redis://localhost:6379';
    process.env.STRIPE_API_KEY = 'sk_test_test123';
    process.env.NEXTAUTH_SECRET = 'test-secret-min-32-chars-long-12345';
    process.env.NEXTAUTH_URL = 'http://localhost:3000';
    process.env.SENTRY_DSN = 'https://test@sentry.io/123';
    process.env.NODE_ENV = 'development';

    expect(() => validateEnv()).not.toThrow();

    unlinkSync(testEnvPath);
  });
});
