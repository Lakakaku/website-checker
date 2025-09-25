import { describe, it, expect } from 'vitest';
import { prisma } from '@website-checker/database/src/client';

describe('Database Connection Integration (Worker)', () => {
  it.skipIf(process.env.NODE_ENV === 'test')('connects to database', async () => {
    await expect(prisma.$connect()).resolves.not.toThrow();
  });
});
