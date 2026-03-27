/**
 * Per-user AI rate limiting
 *
 * Limits expensive AI operations per user to prevent cost abuse.
 * Uses in-memory store - resets on server restart.
 * For multi-instance deployments, consider Redis or Firestore.
 */

const WINDOW_MS = 60 * 60 * 1000; // 1 hour

interface WindowEntry {
  count: number;
  windowStart: number;
}

const store = new Map<string, WindowEntry>();

/**
 * Check and increment rate limit for a user and operation.
 * @returns true if within limit, throws if exceeded
 */
export function checkAndIncrement(
  userId: string,
  operation: 'ask' | 'generate' | 'regenerate',
  limit: number
): void {
  const key = `ai:${operation}:${userId}`;
  const now = Date.now();
  const entry = store.get(key);

  let count: number;
  let windowStart: number;

  if (!entry || now - entry.windowStart >= WINDOW_MS) {
    // New window
    count = 1;
    windowStart = now;
    store.set(key, { count, windowStart });
  } else {
    entry.count += 1;
    count = entry.count;
    windowStart = entry.windowStart;
  }

  if (count > limit) {
    const resetIn = Math.ceil((windowStart + WINDOW_MS - now) / 1000);
    throw new Error(
      `Too many AI requests. Please try again in ${resetIn} seconds.`
    );
  }
}
