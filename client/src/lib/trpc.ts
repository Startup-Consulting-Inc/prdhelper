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
 * tRPC client configuration
 */
export const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: `${(import.meta as any).env?.VITE_API_URL || 'http://localhost:3000'}/api/trpc`,
      
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

