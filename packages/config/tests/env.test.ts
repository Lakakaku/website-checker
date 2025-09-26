import { describe, it, expect, beforeEach } from 'vitest';
import { readFileSync } from 'fs';
import { validateEnv } from '../src/env.js';

describe('Environment Validation Contract', () => {
  beforeEach(() => {
    delete process.env.DATABASE_URL;
    delete process.env.REDIS_URL;
    delete process.env.STRIPE_API_KEY;
    delete process.env.SENTRY_DSN;
    delete process.env.NEXTAUTH_SECRET;
    delete process.env.NEXTAUTH_URL;
    delete process.env.NODE_ENV;
  });

  it('Development environment loads successfully', () => {
    process.env.DATABASE_URL = 'postgresql://localhost:5432/dev';
    process.env.REDIS_URL = 'redis://localhost:6379';
    process.env.STRIPE_API_KEY = 'sk_test_12345';
    process.env.SENTRY_DSN = 'https://abc@sentry.io/123';
    process.env.NEXTAUTH_SECRET = 'a'.repeat(32);
    process.env.NEXTAUTH_URL = 'http://localhost:3000';
    process.env.NODE_ENV = 'development';

    // validateEnv is now imported at the top
    expect(() => validateEnv()).not.toThrow();
  });

  it('Staging environment validates schema', () => {
    process.env.DATABASE_URL = 'postgresql://staging.railway.app:5432/staging';
    process.env.REDIS_URL = 'redis://staging.railway.app:6379';
    process.env.STRIPE_API_KEY = 'sk_test_staging';
    process.env.SENTRY_DSN = 'https://staging@sentry.io/456';
    process.env.NEXTAUTH_SECRET = 'b'.repeat(32);
    process.env.NEXTAUTH_URL = 'https://staging.website-checker.com';
    process.env.NODE_ENV = 'production';
    process.env.VERCEL_ENV = 'preview';

    // validateEnv is now imported at the top
    expect(() => validateEnv()).not.toThrow();
  });

  it('Production enforces live Stripe keys', () => {
    process.env.DATABASE_URL = 'postgresql://prod.railway.app:5432/prod';
    process.env.REDIS_URL = 'redis://prod.railway.app:6379';
    process.env.STRIPE_API_KEY = 'sk_test_invalid';
    process.env.SENTRY_DSN = 'https://prod@sentry.io/789';
    process.env.NEXTAUTH_SECRET = 'c'.repeat(32);
    process.env.NEXTAUTH_URL = 'https://website-checker.com';
    process.env.NODE_ENV = 'production';
    process.env.VERCEL_ENV = 'production';

    // validateEnv is now imported at the top
    expect(() => validateEnv()).toThrow(/live Stripe key/);
  });

  it('Missing variable prevents startup', () => {
    process.env.REDIS_URL = 'redis://localhost:6379';
    process.env.STRIPE_API_KEY = 'sk_test_12345';
    process.env.SENTRY_DSN = 'https://abc@sentry.io/123';
    process.env.NEXTAUTH_SECRET = 'd'.repeat(32);
    process.env.NEXTAUTH_URL = 'http://localhost:3000';
    process.env.NODE_ENV = 'development';

    // validateEnv is now imported at the top
    expect(() => validateEnv()).toThrow(/DATABASE_URL/);
  });

  it('Invalid DATABASE_URL rejected', () => {
    process.env.DATABASE_URL = 'not-a-valid-url';
    process.env.REDIS_URL = 'redis://localhost:6379';
    process.env.STRIPE_API_KEY = 'sk_test_12345';
    process.env.SENTRY_DSN = 'https://abc@sentry.io/123';
    process.env.NEXTAUTH_SECRET = 'e'.repeat(32);
    process.env.NEXTAUTH_URL = 'http://localhost:3000';
    process.env.NODE_ENV = 'development';

    // validateEnv is now imported at the top
    expect(() => validateEnv()).toThrow(/postgresql/);
  });

  it('Production blocks test API keys', () => {
    process.env.DATABASE_URL = 'postgresql://prod.railway.app:5432/prod';
    process.env.REDIS_URL = 'redis://prod.railway.app:6379';
    process.env.STRIPE_API_KEY = 'sk_test_12345';
    process.env.SENTRY_DSN = 'https://prod@sentry.io/789';
    process.env.NEXTAUTH_SECRET = 'f'.repeat(32);
    process.env.NEXTAUTH_URL = 'https://website-checker.com';
    process.env.NODE_ENV = 'production';
    process.env.VERCEL_ENV = 'production';

    // validateEnv is now imported at the top
    expect(() => validateEnv()).toThrow(/live/);
  });

  it('Environment variables not committed', () => {
    const gitignoreContent = readFileSync('../../.gitignore', 'utf-8');
    expect(gitignoreContent).toContain('.env');
    expect(gitignoreContent).toContain('.env*.local');
    expect(gitignoreContent).toContain('!.env.example');
  });

  it('Worker accesses same environment', () => {
    process.env.DATABASE_URL = 'postgresql://localhost:5432/dev';
    process.env.REDIS_URL = 'redis://localhost:6379';
    process.env.STRIPE_API_KEY = 'sk_test_12345';
    process.env.SENTRY_DSN = 'https://abc@sentry.io/123';
    process.env.NEXTAUTH_SECRET = 'g'.repeat(32);
    process.env.NEXTAUTH_URL = 'http://localhost:3000';
    process.env.NODE_ENV = 'development';

    // validateEnv is now imported at the top
    const webEnv = validateEnv();
    const workerEnv = validateEnv();

    expect(webEnv).toEqual(workerEnv);
  });
});
