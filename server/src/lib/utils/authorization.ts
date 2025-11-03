/**
 * Authorization Utilities
 *
 * Helper functions for resource access control with admin support.
 */

import { TRPCError } from '@trpc/server';
import type { User } from '@prisma/client';

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
