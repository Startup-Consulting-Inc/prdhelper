/**
 * Authorization Utilities
 *
 * Helper functions for resource access control with admin support.
 */

import { TRPCError } from '@trpc/server';
import type { User } from '../trpc/context.js';

/**
 * Verify if a user has access to a resource.
 * Admins can access all resources, regular users can only access their own.
 *
 * @param resourceUserId - The user ID who owns the resource
 * @param currentUser - The current authenticated user
 * @param resourceName - Name of the resource type (for error messages)
 * @throws TRPCError with FORBIDDEN code if access is denied
 */
export function verifyResourceAccess(
  resourceUserId: string,
  currentUser: User,
  resourceName: string = 'resource'
): void {
  // Allow admins to access all resources
  if (currentUser.role === 'ADMIN') {
    return;
  }

  // Check ownership for regular users
  if (resourceUserId !== currentUser.id) {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: `You do not have permission to access this ${resourceName}`,
    });
  }
}

/**
 * Verify project access with collaborator support and return role information.
 * 
 * NOTE: This function is deprecated and not used. Each router implements its own
 * verifyProjectAccess function using Firestore. This is kept for reference only.
 * 
 * @deprecated Use the Firestore-based implementation in each router instead
 */
// export async function verifyProjectAccess(...) {
//   // Removed - uses Prisma which is no longer available
//   // See routers/documents.ts for Firestore-based implementation
// }
