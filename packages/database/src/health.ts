import { prisma } from './client';

export interface HealthCheckResult {
  status: 'healthy' | 'degraded' | 'unavailable';
  latency?: number;
  error?: string;
}

export async function checkDatabaseHealth(): Promise<HealthCheckResult> {
  const startTime = Date.now();

  try {
    await prisma.$queryRaw`SELECT 1`;
    const latency = Date.now() - startTime;

    return {
      status: latency < 500 ? 'healthy' : 'degraded',
      latency,
    };
  } catch (error) {
    return {
      status: 'unavailable',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
