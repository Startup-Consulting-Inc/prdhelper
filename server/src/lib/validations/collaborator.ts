/**
 * Collaborator Validation Schemas
 *
 * Zod schemas for validating collaboration-related inputs.
 */

import { z } from 'zod';

/**
 * Invite collaborator schema
 * Supports both email and userId invitation
 */
export const inviteCollaboratorSchema = z.object({
  projectId: z.string().cuid('Invalid project ID'),
  // Either email or userId must be provided
  email: z.string().email('Invalid email address').optional(),
  userId: z.string().cuid('Invalid user ID').optional(),
  role: z.enum(['VIEWER', 'EDITOR'], {
    message: 'Role must be either VIEWER or EDITOR',
  }),
}).refine(
  (data) => data.email || data.userId,
  {
    message: 'Either email or userId must be provided',
    path: ['email'],
  }
);

/**
 * Accept invite schema
 */
export const acceptInviteSchema = z.object({
  token: z.string().min(1, 'Token is required'),
});

/**
 * Reject invite schema
 */
export const rejectInviteSchema = z.object({
  inviteId: z.string().cuid('Invalid invite ID'),
});

/**
 * Remove collaborator schema
 */
export const removeCollaboratorSchema = z.object({
  projectId: z.string().cuid('Invalid project ID'),
  collaboratorId: z.string().cuid('Invalid collaborator ID'),
});

/**
 * Update collaborator role schema
 */
export const updateCollaboratorRoleSchema = z.object({
  projectId: z.string().cuid('Invalid project ID'),
  collaboratorId: z.string().cuid('Invalid collaborator ID'),
  role: z.enum(['VIEWER', 'EDITOR'], {
    message: 'Role must be either VIEWER or EDITOR',
  }),
});

/**
 * Get project collaborators schema
 */
export const getProjectCollaboratorsSchema = z.object({
  projectId: z.string().cuid('Invalid project ID'),
});

/**
 * Get pending invites schema (for current user)
 */
export const getPendingInvitesSchema = z.object({
  limit: z.number().min(1).max(50).default(20).optional(),
  offset: z.number().min(0).default(0).optional(),
});

/**
 * Search users schema (for invite autocomplete)
 */
export const searchUsersSchema = z.object({
  query: z.string().min(1, 'Search query is required').max(100),
  projectId: z.string().cuid('Invalid project ID'),
  limit: z.number().min(1).max(20).default(10).optional(),
});

// Type exports
export type InviteCollaboratorInput = z.infer<typeof inviteCollaboratorSchema>;
export type AcceptInviteInput = z.infer<typeof acceptInviteSchema>;
export type RejectInviteInput = z.infer<typeof rejectInviteSchema>;
export type RemoveCollaboratorInput = z.infer<typeof removeCollaboratorSchema>;
export type UpdateCollaboratorRoleInput = z.infer<typeof updateCollaboratorRoleSchema>;
export type GetProjectCollaboratorsInput = z.infer<typeof getProjectCollaboratorsSchema>;
export type GetPendingInvitesInput = z.infer<typeof getPendingInvitesSchema>;
export type SearchUsersInput = z.infer<typeof searchUsersSchema>;
