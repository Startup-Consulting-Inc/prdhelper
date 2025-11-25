/**
 * Database Health Check
 *
 * Verifies database connection and query performance
 */
import { prisma } from '../db.js';
import { logger } from '../logger.js';

export interface HealthCheckResult {
  status: 'ok' | 'degraded' | 'down';
  responseTime?: number;
  error?: string;
}

/**
 * Check database health by executing a simple query
 */
export async function checkDatabaseHealth(): Promise<HealthCheckResult> {
  const startTime = Date.now();

  try {
    // Simple query to verify connection
    await prisma.$queryRaw`SELECT 1`;

    const responseTime = Date.now() - startTime;

    // Consider degraded if query takes >1s
    const status = responseTime > 1000 ? 'degraded' : 'ok';

    if (status === 'degraded') {
      logger.warn({ responseTime }, 'Database responding slowly');
    }

    return {
      status,
      responseTime,
    };
  } catch (error) {
    const responseTime = Date.now() - startTime;

    logger.error({ err: error, responseTime }, 'Database health check failed');

    return {
      status: 'down',
      responseTime,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
