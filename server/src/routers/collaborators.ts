/**
 * Collaborators Router (Firestore)
 *
 * tRPC router for project collaboration operations:
 * - Invite collaborators
 * - Accept/reject invitations
 * - Manage collaborators (remove, update role)
 * - Get collaborators and pending invites
 * - Search users for collaboration
 */

import { TRPCError } from '@trpc/server';
import { router, protectedProcedure } from '../lib/trpc/trpc.js';
import {
  inviteCollaboratorSchema,
  acceptInviteSchema,
  rejectInviteSchema,
  removeCollaboratorSchema,
  updateCollaboratorRoleSchema,
  getProjectCollaboratorsSchema,
  getPendingInvitesSchema,
  searchUsersSchema,
} from '../lib/validations/collaborator.js';
import { admin } from '../lib/firebase.js';
import { logger } from '../lib/logger.js';
import { randomBytes } from 'crypto';

/**
 * Generate a unique token for invitations
 */
function generateInviteToken(): string {
  return randomBytes(32).toString('hex');
}

export const collaboratorsRouter = router({
  /**
   * Invite a collaborator to a project
   * Supports both email and userId invitation
   */
  invite: protectedProcedure
    .input(inviteCollaboratorSchema)
    .mutation(async ({ ctx, input }) => {
      const { projectId, email, userId, role } = input;

      try {
        // Verify project ownership
        const projectRef = ctx.db.collection('projects').doc(projectId);
        const projectDoc = await projectRef.get();

        if (!projectDoc.exists) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Project not found',
          });
        }

        const projectData = projectDoc.data();
        if (!projectData) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Project not found',
          });
        }

        if (projectData.userId !== ctx.user.id) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'Only project owner can invite collaborators',
          });
        }

        // Determine the user to invite
        let invitedUserId: string | null = null;
        let invitedEmail: string;

        if (userId) {
          // Invite by userId
          const userDoc = await ctx.db.collection('users').doc(userId).get();

          if (!userDoc.exists) {
            throw new TRPCError({
              code: 'NOT_FOUND',
              message: 'User not found',
            });
          }

          const userData = userDoc.data();
          if (!userData) {
            throw new TRPCError({
              code: 'NOT_FOUND',
              message: 'User not found',
            });
          }

          if (userDoc.id === ctx.user.id) {
            throw new TRPCError({
              code: 'BAD_REQUEST',
              message: 'Cannot invite yourself',
            });
          }

          invitedUserId = userDoc.id;
          invitedEmail = userData.email;
        } else if (email) {
          // Invite by email
          invitedEmail = email.toLowerCase();

          if (invitedEmail === ctx.user.email) {
            throw new TRPCError({
              code: 'BAD_REQUEST',
              message: 'Cannot invite yourself',
            });
          }

          // Check if user exists with this email
          const usersSnapshot = await ctx.db
            .collection('users')
            .where('email', '==', invitedEmail)
            .limit(1)
            .get();

          if (!usersSnapshot.empty) {
            invitedUserId = usersSnapshot.docs[0].id;
          }
        } else {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Either email or userId must be provided',
          });
        }

        // Check if user is already a collaborator (use userId as document ID)
        if (invitedUserId) {
          const collaboratorDoc = await projectRef
            .collection('collaborators')
            .doc(invitedUserId)
            .get();

          if (collaboratorDoc.exists) {
            throw new TRPCError({
              code: 'BAD_REQUEST',
              message: 'User is already a collaborator on this project',
            });
          }
        }

        // Check for existing pending invite
        const existingInvitesSnapshot = await projectRef
          .collection('invites')
          .where('invitedEmail', '==', invitedEmail)
          .where('status', '==', 'PENDING')
          .get();

        if (!existingInvitesSnapshot.empty) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'An invitation has already been sent to this user',
          });
        }

        // Create invite (expires in 7 days)
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);

        const token = generateInviteToken();
        const inviteRef = projectRef.collection('invites').doc();

        const inviteData = {
          id: inviteRef.id,
          token,
          projectId,
          invitedEmail,
          invitedUserId,
          inviterId: ctx.user.id,
          role,
          status: 'PENDING',
          expiresAt,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        };

        await inviteRef.set(inviteData);

        // TODO: Send email notification (if email service configured)
        // await sendInviteEmail(invitedEmail, invite);

        // Create audit log
        await ctx.db.collection('auditLogs').add({
          userId: ctx.user.id,
          userName: ctx.user.name,
          action: 'COLLABORATOR_INVITED',
          details: {
            projectId,
            invitedEmail,
            role,
          },
          ipAddress: ctx.req.ip || ctx.req.socket.remoteAddress || null,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        logger.info({ projectId, invitedEmail, userId: ctx.user.id }, 'Collaborator invited');

        // Fetch project and inviter data
        const inviterDoc = await ctx.db.collection('users').doc(ctx.user.id).get();
        const inviterData = inviterDoc.exists ? inviterDoc.data() : null;
        const inviteDocData = await inviteRef.get();
        const inviteDoc = inviteDocData.data();

        return {
          id: inviteRef.id,
          ...inviteDoc,
          createdAt: new Date(),
          updatedAt: new Date(),
          project: {
            id: projectId,
            title: projectData.title,
          },
          inviter: inviterData ? {
            id: ctx.user.id,
            name: inviterData.name,
            email: inviterData.email,
          } : null,
        };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        logger.error({ error, projectId, userId: ctx.user.id }, 'Failed to invite collaborator');
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to invite collaborator',
        });
      }
    }),

  /**
   * Accept a collaboration invitation
   */
  accept: protectedProcedure
    .input(acceptInviteSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        // Find invite by token across all projects
        const projectsSnapshot = await ctx.db.collection('projects').get();

        let inviteRef: FirebaseFirestore.DocumentReference | null = null;
        let inviteData: any = null;
        let projectRef: FirebaseFirestore.DocumentReference | null = null;
        let projectData: any = null;
        let projectDocId: string | null = null;

        for (const projectDoc of projectsSnapshot.docs) {
          const invitesSnapshot = await projectDoc.ref
            .collection('invites')
            .where('token', '==', input.token)
            .limit(1)
            .get();

          if (!invitesSnapshot.empty) {
            inviteRef = invitesSnapshot.docs[0].ref;
            inviteData = invitesSnapshot.docs[0].data();
            projectRef = projectDoc.ref;
            projectData = projectDoc.data();
            projectDocId = projectDoc.id;
            break;
          }
        }

        if (!inviteRef || !inviteData || !projectRef || !projectData || !projectDocId) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Invitation not found',
          });
        }

        // Verify the invite is for the current user
        if (inviteData.invitedEmail !== ctx.user.email) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'This invitation is not for you',
          });
        }

        // Check if already accepted
        if (inviteData.status !== 'PENDING') {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: `Invitation has already been ${inviteData.status.toLowerCase()}`,
          });
        }

        // Check if expired
        const expiresAt = inviteData.expiresAt?.toDate();
        if (expiresAt && new Date() > expiresAt) {
          await inviteRef.update({
            status: 'EXPIRED',
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          });

          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Invitation has expired',
          });
        }

        // Create collaborator (use userId as document ID for uniqueness)
        const collaboratorRef = projectRef.collection('collaborators').doc(ctx.user.id);

        const collaboratorData = {
          id: collaboratorRef.id,
          projectId: inviteData.projectId,
          userId: ctx.user.id,
          role: inviteData.role,
          invitedBy: inviteData.inviterId,
          invitedAt: inviteData.createdAt,
          acceptedAt: admin.firestore.FieldValue.serverTimestamp(),
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        };

        await collaboratorRef.set(collaboratorData);

        // Update invite status
        await inviteRef.update({
          status: 'ACCEPTED',
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        // Create audit log
        await ctx.db.collection('auditLogs').add({
          userId: ctx.user.id,
          userName: ctx.user.name,
          action: 'COLLABORATOR_ACCEPTED',
          details: {
            projectId: inviteData.projectId,
            role: inviteData.role,
          },
          ipAddress: ctx.req.ip || ctx.req.socket.remoteAddress || null,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        logger.info({ projectId: inviteData.projectId, userId: ctx.user.id }, 'Collaborator accepted invitation');

        // Fetch user data
        const userDoc = await ctx.db.collection('users').doc(ctx.user.id).get();
        const userData = userDoc.exists ? userDoc.data() : null;

        return {
          ...collaboratorData,
          acceptedAt: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
          project: {
            id: projectDocId,
            ...projectData,
            createdAt: projectData.createdAt?.toDate(),
            updatedAt: projectData.updatedAt?.toDate(),
          },
          user: userData ? {
            id: ctx.user.id,
            name: userData.name,
            email: userData.email,
          } : null,
        };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        logger.error({ error, token: input.token, userId: ctx.user.id }, 'Failed to accept invitation');
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to accept invitation',
        });
      }
    }),

  /**
   * Reject a collaboration invitation
   */
  reject: protectedProcedure
    .input(rejectInviteSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        // Find invite across all projects
        const projectsSnapshot = await ctx.db.collection('projects').get();

        let inviteRef: FirebaseFirestore.DocumentReference | null = null;
        let inviteData: any = null;

        for (const projectDoc of projectsSnapshot.docs) {
          const inviteDoc = await projectDoc.ref
            .collection('invites')
            .doc(input.inviteId)
            .get();

          if (inviteDoc.exists) {
            inviteRef = inviteDoc.ref;
            inviteData = inviteDoc.data();
            break;
          }
        }

        if (!inviteRef || !inviteData) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Invitation not found',
          });
        }

        // Verify the invite is for the current user
        if (inviteData.invitedEmail !== ctx.user.email && inviteData.invitedUserId !== ctx.user.id) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'This invitation is not for you',
          });
        }

        // Check if already rejected
        if (inviteData.status !== 'PENDING') {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: `Invitation has already been ${inviteData.status.toLowerCase()}`,
          });
        }

        // Update invite status
        await inviteRef.update({
          status: 'REJECTED',
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        // Create audit log
        await ctx.db.collection('auditLogs').add({
          userId: ctx.user.id,
          userName: ctx.user.name,
          action: 'COLLABORATOR_REJECTED',
          details: {
            projectId: inviteData.projectId,
          },
          ipAddress: ctx.req.ip || ctx.req.socket.remoteAddress || null,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        logger.info({ projectId: inviteData.projectId, userId: ctx.user.id }, 'Collaborator rejected invitation');

        return { success: true, message: 'Invitation rejected' };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        logger.error({ error, inviteId: input.inviteId, userId: ctx.user.id }, 'Failed to reject invitation');
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to reject invitation',
        });
      }
    }),

  /**
   * Remove a collaborator from a project
   */
  remove: protectedProcedure
    .input(removeCollaboratorSchema)
    .mutation(async ({ ctx, input }) => {
      const { projectId, collaboratorId } = input;

      try {
        // Verify project ownership
        const projectRef = ctx.db.collection('projects').doc(projectId);
        const projectDoc = await projectRef.get();

        if (!projectDoc.exists) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Project not found',
          });
        }

        const projectData = projectDoc.data();
        if (!projectData) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Project not found',
          });
        }

        if (projectData.userId !== ctx.user.id) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'Only project owner can remove collaborators',
          });
        }

        // Find and delete collaborator
        const collaboratorRef = projectRef.collection('collaborators').doc(collaboratorId);
        const collaboratorDoc = await collaboratorRef.get();

        if (!collaboratorDoc.exists) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Collaborator not found',
          });
        }

        const collaboratorData = collaboratorDoc.data();
        if (!collaboratorData || collaboratorData.projectId !== projectId) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Collaborator does not belong to this project',
          });
        }

        await collaboratorRef.delete();

        // Create audit log
        await ctx.db.collection('auditLogs').add({
          userId: ctx.user.id,
          userName: ctx.user.name,
          action: 'COLLABORATOR_REMOVED',
          details: {
            projectId,
            collaboratorId,
          },
          ipAddress: ctx.req.ip || ctx.req.socket.remoteAddress || null,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        logger.info({ projectId, collaboratorId, userId: ctx.user.id }, 'Collaborator removed');

        return { success: true, message: 'Collaborator removed' };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        logger.error({ error, projectId, collaboratorId, userId: ctx.user.id }, 'Failed to remove collaborator');
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to remove collaborator',
        });
      }
    }),

  /**
   * Update a collaborator's role
   */
  updateRole: protectedProcedure
    .input(updateCollaboratorRoleSchema)
    .mutation(async ({ ctx, input }) => {
      const { projectId, collaboratorId, role } = input;

      try {
        // Verify project ownership
        const projectRef = ctx.db.collection('projects').doc(projectId);
        const projectDoc = await projectRef.get();

        if (!projectDoc.exists) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Project not found',
          });
        }

        const projectData = projectDoc.data();
        if (!projectData) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Project not found',
          });
        }

        if (projectData.userId !== ctx.user.id) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'Only project owner can update collaborator roles',
          });
        }

        // Find and update collaborator
        const collaboratorRef = projectRef.collection('collaborators').doc(collaboratorId);
        const collaboratorDoc = await collaboratorRef.get();

        if (!collaboratorDoc.exists) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Collaborator not found',
          });
        }

        const collaboratorData = collaboratorDoc.data();
        if (!collaboratorData || collaboratorData.projectId !== projectId) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Collaborator does not belong to this project',
          });
        }

        const oldRole = collaboratorData.role;

        // Update role
        await collaboratorRef.update({
          role,
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        // Create audit log
        await ctx.db.collection('auditLogs').add({
          userId: ctx.user.id,
          userName: ctx.user.name,
          action: 'COLLABORATOR_ROLE_UPDATED',
          details: {
            projectId,
            collaboratorId,
            oldRole,
            newRole: role,
          },
          ipAddress: ctx.req.ip || ctx.req.socket.remoteAddress || null,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        logger.info({ projectId, collaboratorId, oldRole, newRole: role, userId: ctx.user.id }, 'Collaborator role updated');

        // Fetch updated collaborator and user data
        const updatedDoc = await collaboratorRef.get();
        const updatedData = updatedDoc.data();

        const userDoc = await ctx.db.collection('users').doc(collaboratorId).get();
        const userData = userDoc.exists ? userDoc.data() : null;

        return {
          id: updatedDoc.id,
          ...updatedData,
          createdAt: updatedData?.createdAt?.toDate(),
          updatedAt: updatedData?.updatedAt?.toDate(),
          acceptedAt: updatedData?.acceptedAt?.toDate(),
          user: userData ? {
            id: userDoc.id,
            name: userData.name,
            email: userData.email,
          } : null,
        };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        logger.error({ error, projectId, collaboratorId, userId: ctx.user.id }, 'Failed to update collaborator role');
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to update collaborator role',
        });
      }
    }),

  /**
   * Get all collaborators for a project
   */
  getByProject: protectedProcedure
    .input(getProjectCollaboratorsSchema)
    .query(async ({ ctx, input }) => {
      const { projectId } = input;

      try {
        // Verify access to project (owner or collaborator)
        const projectRef = ctx.db.collection('projects').doc(projectId);
        const projectDoc = await projectRef.get();

        if (!projectDoc.exists) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Project not found',
          });
        }

        const projectData = projectDoc.data();
        if (!projectData) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Project not found',
          });
        }

        // Check if user is owner or collaborator
        const isOwner = projectData.userId === ctx.user.id;

        // Get all collaborators
        const collaboratorsSnapshot = await projectRef
          .collection('collaborators')
          .orderBy('acceptedAt', 'asc')
          .get();

        const isCollaborator = collaboratorsSnapshot.docs.some(
          (doc) => doc.data().userId === ctx.user.id
        );

        if (!isOwner && !isCollaborator && ctx.user.role !== 'ADMIN') {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'You do not have access to this project',
          });
        }

        // Fetch user and inviter data for each collaborator
        const collaborators = await Promise.all(
          collaboratorsSnapshot.docs.map(async (doc) => {
            const collaboratorData = doc.data();

            const userDoc = await ctx.db.collection('users').doc(collaboratorData.userId).get();
            const userData = userDoc.exists ? userDoc.data() : null;

            const inviterDoc = collaboratorData.invitedBy
              ? await ctx.db.collection('users').doc(collaboratorData.invitedBy).get()
              : null;
            const inviterData = inviterDoc?.exists ? inviterDoc.data() : null;

            return {
              id: doc.id,
              ...collaboratorData,
              createdAt: collaboratorData.createdAt?.toDate(),
              updatedAt: collaboratorData.updatedAt?.toDate(),
              acceptedAt: collaboratorData.acceptedAt?.toDate(),
              invitedAt: collaboratorData.invitedAt?.toDate(),
              user: userData ? {
                id: userDoc.id,
                name: userData.name,
                email: userData.email,
                image: userData.image || null,
              } : null,
              inviter: inviterData && inviterDoc ? {
                id: inviterDoc.id,
                name: inviterData.name,
              } : null,
            };
          })
        );

        return collaborators;
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        logger.error({ error, projectId, userId: ctx.user.id }, 'Failed to get collaborators');
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch collaborators',
        });
      }
    }),

  /**
   * Get pending invitations for the current user
   */
  getPendingInvites: protectedProcedure
    .input(getPendingInvitesSchema)
    .query(async ({ ctx, input }) => {
      const { limit = 20, offset = 0 } = input;

      try {
        // Search for pending invites across all projects
        const projectsSnapshot = await ctx.db.collection('projects').get();
        const now = new Date();

        let allInvites: any[] = [];

        for (const projectDoc of projectsSnapshot.docs) {
          const invitesSnapshot = await projectDoc.ref
            .collection('invites')
            .where('invitedEmail', '==', ctx.user.email)
            .where('status', '==', 'PENDING')
            .get();

          for (const inviteDoc of invitesSnapshot.docs) {
            const inviteData = inviteDoc.data();
            const expiresAt = inviteData.expiresAt?.toDate();

            // Only include non-expired invites
            if (expiresAt && now <= expiresAt) {
              const projectData = projectDoc.data();
              const inviterDoc = await ctx.db.collection('users').doc(inviteData.inviterId).get();
              const inviterData = inviterDoc.exists ? inviterDoc.data() : null;

              allInvites.push({
                id: inviteDoc.id,
                ...inviteData,
                createdAt: inviteData.createdAt?.toDate(),
                updatedAt: inviteData.updatedAt?.toDate(),
                expiresAt,
                project: {
                  id: projectDoc.id,
                  title: projectData.title,
                  description: projectData.description,
                  mode: projectData.mode,
                },
                inviter: inviterData ? {
                  id: inviterDoc.id,
                  name: inviterData.name,
                  email: inviterData.email,
                } : null,
              });
            }
          }
        }

        // Sort by createdAt descending
        allInvites.sort((a, b) => {
          const aTime = a.createdAt?.getTime() || 0;
          const bTime = b.createdAt?.getTime() || 0;
          return bTime - aTime;
        });

        const total = allInvites.length;
        const invites = allInvites.slice(offset, offset + limit);

        return {
          invites,
          total,
          hasMore: offset + invites.length < total,
        };
      } catch (error) {
        logger.error({ error, userId: ctx.user.id }, 'Failed to get pending invites');
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch pending invites',
        });
      }
    }),

  /**
   * Search users for collaboration (autocomplete)
   * Excludes current collaborators and project owner
   */
  searchUsers: protectedProcedure
    .input(searchUsersSchema)
    .query(async ({ ctx, input }) => {
      const { query, projectId, limit = 10 } = input;

      try {
        // Verify access to project
        const projectRef = ctx.db.collection('projects').doc(projectId);
        const projectDoc = await projectRef.get();

        if (!projectDoc.exists) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Project not found',
          });
        }

        const projectData = projectDoc.data();
        if (!projectData) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Project not found',
          });
        }

        // Only owner can search for users to invite
        if (projectData.userId !== ctx.user.id) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'Only project owner can invite collaborators',
          });
        }

        // Get list of user IDs to exclude (owner + current collaborators)
        const collaboratorsSnapshot = await projectRef.collection('collaborators').get();
        const excludeUserIds = [
          projectData.userId,
          ...collaboratorsSnapshot.docs.map((doc) => doc.data().userId),
        ];

        // Search users by name or email
        // Note: Firestore doesn't support case-insensitive partial text search natively
        // For production, consider using Algolia or Elasticsearch
        // Here we'll do a simplified search with exact match or starts-with
        const lowerQuery = query.toLowerCase();

        const usersSnapshot = await ctx.db.collection('users').get();

        const matchingUsers = usersSnapshot.docs
          .filter((doc) => {
            const userData = doc.data();
            if (excludeUserIds.includes(doc.id)) {
              return false;
            }

            const nameMatch = userData.name?.toLowerCase().includes(lowerQuery);
            const emailMatch = userData.email?.toLowerCase().includes(lowerQuery);

            return nameMatch || emailMatch;
          })
          .slice(0, limit)
          .map((doc) => {
            const userData = doc.data();
            return {
              id: doc.id,
              name: userData.name,
              email: userData.email,
              image: userData.image || null,
            };
          });

        return matchingUsers;
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        logger.error({ error, projectId, query, userId: ctx.user.id }, 'Failed to search users');
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to search users',
        });
      }
    }),
});
