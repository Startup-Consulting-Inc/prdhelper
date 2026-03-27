/**
 * Lazy load with retry for failed dynamic imports.
 *
 * Handles "Failed to fetch dynamically imported module" errors that occur when:
 * - User has cached JS from a previous deploy that references old chunk filenames
 * - Transient network failures during chunk fetch
 *
 * Strategy: Retry up to 2 times, then force full page reload to get fresh assets.
 */

import { lazy, ComponentType } from 'react';

const MAX_RETRIES = 2;
const RETRY_DELAY_MS = 1000;

function loadWithRetry<T extends { default: ComponentType<unknown> }>(
  importFn: () => Promise<T>,
  retriesLeft = MAX_RETRIES
): Promise<T> {
  return importFn().catch((error) => {
    const isChunkLoadError =
      error?.message?.includes('Failed to fetch dynamically imported module') ||
      error?.message?.includes('Importing a module script failed') ||
      error?.name === 'ChunkLoadError';

    if (isChunkLoadError && retriesLeft > 0) {
      return new Promise<T>((resolve, reject) => {
        setTimeout(() => {
          loadWithRetry(importFn, retriesLeft - 1).then(resolve).catch(reject);
        }, RETRY_DELAY_MS);
      });
    }

    // Last retry failed or non-chunk error: force reload to get fresh assets
    if (isChunkLoadError && typeof window !== 'undefined') {
      window.location.reload();
      return new Promise(() => {}); // Never resolves; page is reloading
    }

    throw error;
  });
}

/**
 * Like React.lazy() but retries failed chunk loads and reloads on persistent failure.
 */
export function lazyWithRetry<T extends { default: ComponentType<unknown> }>(
  importFn: () => Promise<T>
) {
  return lazy(() => loadWithRetry(importFn));
}
