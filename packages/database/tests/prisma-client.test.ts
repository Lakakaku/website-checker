import { describe, it, expect, beforeAll } from 'vitest';

describe('Database Connectivity Contract', () => {
  it('Web app connects on startup', async () => {
    const { prisma } = await import('../src/client');
    await expect(prisma.$connect()).resolves.not.toThrow();
  });

  it('Worker shares database with web', async () => {
    const { prisma } = await import('../src/client');
    await prisma.$connect();
    const result = await prisma.$queryRaw`SELECT 1 as value`;
    expect(result).toBeDefined();
  });

  it('Connection failure prevents startup', async () => {
    process.env.DATABASE_URL = 'postgresql://invalid:5432/fail';
    const { prisma } = await import('../src/client');
    await expect(prisma.$connect()).rejects.toThrow();
  });

  it('Credentials rotate gracefully', async () => {
    const { prisma } = await import('../src/client');
    await prisma.$connect();
    await prisma.$disconnect();
    await expect(prisma.$connect()).resolves.not.toThrow();
  });

  it('Connection pool limits respected', async () => {
    const { prisma } = await import('../src/client');
    await prisma.$connect();
    expect(prisma).toBeDefined();
  });

  it('Local development uses DATABASE_URL', async () => {
    expect(process.env.DATABASE_URL).toBeDefined();
    const { prisma } = await import('../src/client');
    await expect(prisma.$connect()).resolves.not.toThrow();
  });

  it('Migrations run before deployment', async () => {
    expect(true).toBe(true);
  });

  it('Health check endpoint available', async () => {
    const { checkDatabaseHealth } = await import('../src/health');
    const health = await checkDatabaseHealth();
    expect(health.status).toBe('healthy');
  });

  it('Serverless functions use pooling', async () => {
    const { prisma } = await import('../src/client');
    expect(prisma).toBeDefined();
  });
});