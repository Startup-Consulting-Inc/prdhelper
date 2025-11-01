/**
 * tRPC Client Setup
 * 
 * Configures tRPC client for type-safe API calls to the backend.
 */

import { createTRPCReact } from '@trpc/react-query';
import { httpBatchLink } from '@trpc/client';
import type { AppRouter } from '../../../server/src/routers/index';

/**
 * Create typed tRPC React hooks
 */
export const trpc = createTRPCReact<AppRouter>();

/**
 * Get authentication token from localStorage
 */
function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('auth_token');
}

/**
 * Get API URL based on environment
 * - In development: Use relative URL to leverage Vite proxy (/api -> localhost:3000)
 * - In production: Use relative URL (backend serves frontend on same origin)
 */
function getApiUrl(): string {
  // Always use relative URL
  // In development: Vite proxy forwards /api to localhost:3000
  // In production: Backend serves frontend, so /api works directly
  return '';
}

/**
 * tRPC client configuration
 */
export const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      // Use relative URL to leverage Vite proxy in development
      url: '/api/trpc',

      // Include authentication token in headers
      headers() {
        const token = getAuthToken();
        return {
          authorization: token ? `Bearer ${token}` : '',
        };
      },
    }),
  ],
});

