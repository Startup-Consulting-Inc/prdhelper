/**
 * Google Cloud Storage Health Check
 *
 * Verifies access to GCS bucket
 */
import { storage } from '../storage.js';
import { GCS_BUCKET_NAME } from '../config.js';
import { logger } from '../logger.js';

export interface HealthCheckResult {
  status: 'ok' | 'degraded' | 'down';
  responseTime?: number;
  error?: string;
}

/**
 * Check GCS bucket accessibility
 */
export async function checkStorageHealth(): Promise<HealthCheckResult> {
  const startTime = Date.now();

  // Skip GCS check in development if credentials aren't available
  // This allows local development without GCS credentials
  if (process.env.NODE_ENV === 'development' && !process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    logger.info('Skipping GCS health check in development (no credentials configured)');
    return {
      status: 'ok',
      responseTime: Date.now() - startTime,
    };
  }

  try {
    const bucketName = GCS_BUCKET_NAME;
    const bucket = storage.bucket(bucketName);

    // Check if bucket exists and is accessible
    const [exists] = await bucket.exists();

    const responseTime = Date.now() - startTime;

    if (!exists) {
      logger.error({ bucketName }, 'GCS bucket does not exist');
      return {
        status: 'down',
        responseTime,
        error: 'Bucket does not exist',
      };
    }

    // Consider degraded if check takes >2s
    const status = responseTime > 2000 ? 'degraded' : 'ok';

    if (status === 'degraded') {
      logger.warn({ responseTime, bucketName }, 'GCS responding slowly');
    }

    return {
      status,
      responseTime,
    };
  } catch (error) {
    const responseTime = Date.now() - startTime;

    logger.error({ err: error, responseTime }, 'GCS health check failed');

    return {
      status: 'down',
      responseTime,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
