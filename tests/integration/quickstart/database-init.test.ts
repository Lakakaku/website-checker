import { describe, it, expect } from 'vitest';
import { execSync } from 'child_process';
import { existsSync } from 'fs';
import { prisma } from '@website-checker/database/src/client';

describe('Quickstart Scenario 3: Database Initialization', () => {
  it('Prisma client is generated', () => {
    expect(existsSync('packages/database/node_modules/.prisma/client')).toBe(true);
  });

  it('Prisma schema exists', () => {
    expect(existsSync('packages/database/prisma/schema.prisma')).toBe(true);
  });

  it('can connect to database', async () => {
    await expect(prisma.$connect()).resolves.not.toThrow();
  });

  it('database migrations directory exists', () => {
    expect(existsSync('packages/database/prisma/migrations')).toBe(true);
  });
});
