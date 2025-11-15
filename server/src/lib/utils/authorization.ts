/**
 * Authorization Utilities
 *
 * Helper functions for resource access control with admin support.
 */

import { TRPCError } from '@trpc/server';
import type { User, PrismaClient } from '@prisma/client';

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
 * Checks if user is owner or collaborator and enforces minimum required role.
 *
 * @param projectId - The project ID to check access for
 * @param userId - The current user's ID
 * @param requiredRole - Minimum role required ('VIEWER', 'EDITOR', or 'OWNER')
 * @param prisma - Prisma client instance
 * @param currentUser - The current authenticated user
 * @returns Object with isOwner flag and user's role on the project
 * @throws TRPCError with FORBIDDEN code if access is denied or role insufficient
 */
export async function verifyProjectAccess(
  projectId: string,
  userId: string,
  requiredRole: 'VIEWER' | 'EDITOR' | 'OWNER',
  prisma: PrismaClient,
  currentUser: User
): Promise<{ isOwner: boolean; role: 'OWNER' | 'EDITOR' | 'VIEWER' | null }> {
  // Allow admins full access
  if (currentUser.role === 'ADMIN') {
    return { isOwner: true, role: 'OWNER' };
  }

  // Get project with collaborators
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      collaborators: {
        where: { userId },
      },
    },
  });

  if (!project) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: 'Project not found',
    });
  }

  // Check if user is the owner
  const isOwner = project.userId === userId;
  if (isOwner) {
    return { isOwner: true, role: 'OWNER' };
  }

  // Check if user is a collaborator
  const collaborator = project.collaborators[0];
  if (!collaborator) {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'You do not have permission to access this project',
    });
  }

  // Verify role hierarchy: OWNER > EDITOR > VIEWER
  const roleHierarchy = { OWNER: 3, EDITOR: 2, VIEWER: 1 };
  const userRoleLevel = roleHierarchy[collaborator.role];
  const requiredRoleLevel = roleHierarchy[requiredRole];

  if (userRoleLevel < requiredRoleLevel) {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: `This action requires ${requiredRole} role or higher`,
    });
  }

  return { isOwner: false, role: collaborator.role };
}
