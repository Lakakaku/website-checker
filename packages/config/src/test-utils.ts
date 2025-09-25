import { beforeEach } from 'vitest';

export function mockEnvironment(env: Record<string, string>) {
  beforeEach(() => {
    Object.keys(env).forEach((key) => {
      process.env[key] = env[key];
    });
  });
}

export function cleanEnvironment() {
  beforeEach(() => {
    const keysToDelete = [
      'DATABASE_URL',
      'REDIS_URL',
      'STRIPE_API_KEY',
      'SENTRY_DSN',
      'NEXTAUTH_SECRET',
      'NEXTAUTH_URL',
      'NODE_ENV',
      'VERCEL_ENV',
    ];
    keysToDelete.forEach((key) => {
      delete process.env[key];
    });
  });
}
