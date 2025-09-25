import { NextResponse } from 'next/server';
import { checkDatabaseHealth } from '@website-checker/database/src/health';

export async function GET() {
  try {
    const dbHealth = await checkDatabaseHealth();

    const response = {
      status: dbHealth.status === 'healthy' ? 'healthy' : 'unhealthy',
      database: dbHealth.status,
      latency: dbHealth.latency,
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(response, {
      status: dbHealth.status === 'healthy' ? 200 : 503,
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        database: 'unavailable',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 503 }
    );
  }
}
