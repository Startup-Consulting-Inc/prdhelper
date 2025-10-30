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
 * - In production: Use relative URL (same origin as frontend)
 * - In development: Use VITE_API_URL env var for cross-origin requests
 */
function getApiUrl(): string {
  // Check if we're in a browser environment
  if (typeof window === 'undefined') {
    return 'http://localhost:3000';
  }

  // In production, backend serves frontend on same origin - use relative URL
  // In development with Vite, VITE_API_URL is set, or we're on different ports
  const viteApiUrl = (import.meta as any).env?.VITE_API_URL;

  if (viteApiUrl) {
    // Development with explicit API URL
    return viteApiUrl;
  }

  // Production: use current origin (backend serves frontend)
  // This works because in production, Express serves both frontend and API
  return window.location.origin;
}

/**
 * tRPC client configuration
 */
export const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: `${getApiUrl()}/api/trpc`,

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

