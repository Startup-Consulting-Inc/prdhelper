/**
 * Google Cloud Storage Health Check
 *
 * Verifies access to GCS bucket
 */
import { storage } from '../storage.js';
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

  try {
    const bucketName = process.env.GCS_BUCKET_NAME || 'clearly-prd-attachments';
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
