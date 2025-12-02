/**
 * tRPC Client Setup
 *
 * Configures tRPC client for type-safe API calls to the backend.
 */

import { createTRPCReact } from '@trpc/react-query';
import { httpBatchLink } from '@trpc/client';
import type { AppRouter } from '../../../server/src/routers/index';
import { getIdToken } from './firebase';

/**
 * Create typed tRPC React hooks
 */
export const trpc = createTRPCReact<AppRouter>();

/**
 * Get Firebase ID token with automatic refresh
 * Always gets a fresh token from Firebase Auth to avoid expired token errors
 */
async function getAuthToken(): Promise<string | null> {
  if (typeof window === 'undefined') return null;

  try {
    // Get a fresh token from Firebase Auth (will refresh if expired)
    const token = await getIdToken(false);

    console.log('[tRPC] Getting auth token:', {
      hasToken: !!token,
      tokenLength: token?.length,
      tokenPreview: token ? token.substring(0, 20) + '...' : 'none',
    });

    return token;
  } catch (error) {
    console.error('[tRPC] Failed to get auth token:', error);
    return null;
  }
}

/**
 * tRPC client configuration
 */
export const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      // Use relative URL to leverage Vite proxy in development
      // In development: Vite proxy forwards /api to localhost:3000
      // In production: Backend serves frontend, so /api works directly
      url: '/api/trpc',

      // Include authentication token in headers (async to support token refresh)
      async headers() {
        const token = await getAuthToken();
        return {
          authorization: token ? `Bearer ${token}` : '',
        };
      },
    }),
  ],
});

