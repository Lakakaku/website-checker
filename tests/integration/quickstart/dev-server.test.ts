import { describe, it, expect } from 'vitest';
import { existsSync } from 'fs';

describe('Quickstart Scenario 4: Dev Server', () => {
  it('health check API route exists', () => {
    expect(existsSync('apps/web/src/app/api/health/route.ts')).toBe(true);
  });

  it('Next.js app directory structure exists', () => {
    expect(existsSync('apps/web/src/app/layout.tsx')).toBe(true);
    expect(existsSync('apps/web/src/app/page.tsx')).toBe(true);
  });

  it('Tailwind CSS is configured', () => {
    expect(existsSync('apps/web/tailwind.config.ts')).toBe(true);
    expect(existsSync('apps/web/src/app/globals.css')).toBe(true);
  });

  it('worker service entry point exists', () => {
    expect(existsSync('apps/worker/src/index.ts')).toBe(true);
  });
});