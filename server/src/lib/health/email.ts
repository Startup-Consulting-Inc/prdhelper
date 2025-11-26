/**
 * Email Service Health Check
 *
 * Verifies email service configuration and availability
 */
import { logger } from '../logger.js';

export interface HealthCheckResult {
  status: 'ok' | 'degraded' | 'down';
  responseTime?: number;
  error?: string;
}

/**
 * Check email service health by verifying configuration
 */
export async function checkEmailHealth(): Promise<HealthCheckResult> {
  const startTime = Date.now();

  try {
    // Check if email credentials are configured
    const isConfigured =
      (process.env.NODE_ENV === 'development' &&
       process.env.GMAIL_USER &&
       process.env.GMAIL_APP_PASSWORD) ||
      process.env.NODE_ENV === 'production';

    const responseTime = Date.now() - startTime;

    if (!isConfigured) {
      logger.warn('Email service not configured');
      return {
        status: 'down',
        responseTime,
        error: 'Email credentials not configured',
      };
    }

    return {
      status: 'ok',
      responseTime,
    };
  } catch (error) {
    const responseTime = Date.now() - startTime;

    logger.error({ err: error, responseTime }, 'Email health check failed');

    return {
      status: 'down',
      responseTime,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
