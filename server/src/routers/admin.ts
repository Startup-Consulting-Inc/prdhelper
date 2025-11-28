/**
 * Admin Router (Firestore)
 *
 * tRPC router for admin operations:
 * - System prompts management
 * - User management
 * - Audit logs
 * - System statistics
 */

import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { router, adminProcedure } from '../lib/trpc/trpc.js';
import { admin } from '../lib/firebase.js';
import { logger } from '../lib/logger.js';

export const adminRouter = router({
  /**
   * Get all system prompts
   */
  getSystemPrompts: adminProcedure.query(async ({ ctx }) => {
    try {
      const promptsSnapshot = await ctx.db
        .collection('systemPrompts')
        .orderBy('type', 'asc')
        .get();

      const prompts = promptsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
      }));

      return prompts;
    } catch (error) {
      logger.error({ error }, 'Failed to get system prompts');
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to fetch system prompts',
      });
    }
  }),

  /**
   * Update system prompt
   */
  updateSystemPrompt: adminProcedure
    .input(
      z.object({
        id: z.string().min(1, 'Prompt ID is required'),
        prompt: z.string().min(50, 'Prompt must be at least 50 characters'),
        isActive: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const { id, ...updateData } = input;

        // Get current prompt for version history
        const promptRef = ctx.db.collection('systemPrompts').doc(id);
        const promptDoc = await promptRef.get();

        if (!promptDoc.exists) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Prompt not found' });
        }

        const currentPrompt = promptDoc.data();

        // Get latest version number from versions subcollection
        const versionsSnapshot = await promptRef
          .collection('versions')
          .orderBy('version', 'desc')
          .limit(1)
          .get();

        const latestVersionNum = versionsSnapshot.empty
          ? 0
          : versionsSnapshot.docs[0].data().version;

        // Create version history before updating
        const versionRef = promptRef.collection('versions').doc();
        await versionRef.set({
          id: versionRef.id,
          promptId: id,
          prompt: currentPrompt?.prompt,
          version: latestVersionNum + 1,
          createdBy: ctx.user.id,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        // Update prompt
        await promptRef.update({
          ...updateData,
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        // Get updated prompt
        const updatedDoc = await promptRef.get();
        const updatedPrompt = { id: updatedDoc.id, ...(updatedDoc.data() || {}) } as {
          id: string;
          type?: string;
          createdAt?: admin.firestore.Timestamp;
          updatedAt?: admin.firestore.Timestamp;
          [key: string]: unknown;
        };

        // Create audit log
        await ctx.db.collection('auditLogs').add({
          userId: ctx.user.id,
          userName: ctx.user.name,
          action: 'SYSTEM_PROMPT_UPDATED',
          details: {
            promptId: id,
            type: updatedPrompt.type,
            changes: updateData,
          },
          ipAddress: ctx.req.ip || ctx.req.socket.remoteAddress || null,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        logger.info({ promptId: id, userId: ctx.user.id }, 'System prompt updated');

        return {
          ...updatedPrompt,
          createdAt: updatedPrompt.createdAt?.toDate(),
          updatedAt: updatedPrompt.updatedAt?.toDate(),
        };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        logger.error({ error, promptId: input.id }, 'Failed to update system prompt');
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to update system prompt',
        });
      }
    }),

  /**
   * Delete system prompt
   */
  deleteSystemPrompt: adminProcedure
    .input(z.object({ id: z.string().min(1, 'Prompt ID is required') }))
    .mutation(async ({ ctx, input }) => {
      try {
        const promptRef = ctx.db.collection('systemPrompts').doc(input.id);
        const promptDoc = await promptRef.get();

        if (!promptDoc.exists) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Prompt not found' });
        }

        const promptData = promptDoc.data();

        // Delete versions subcollection first
        const versionsSnapshot = await promptRef.collection('versions').get();
        const batch = ctx.db.batch();

        versionsSnapshot.docs.forEach((doc) => {
          batch.delete(doc.ref);
        });

        // Delete the prompt itself
        batch.delete(promptRef);

        await batch.commit();

        // Create audit log
        await ctx.db.collection('auditLogs').add({
          userId: ctx.user.id,
          userName: ctx.user.name,
          action: 'SYSTEM_PROMPT_DELETED',
          details: {
            promptId: input.id,
            type: promptData?.type,
          },
          ipAddress: ctx.req.ip || ctx.req.socket.remoteAddress || null,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        logger.info({ promptId: input.id, userId: ctx.user.id }, 'System prompt deleted');

        return { success: true, message: 'Prompt deleted successfully' };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        logger.error({ error, promptId: input.id }, 'Failed to delete system prompt');
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to delete system prompt',
        });
      }
    }),

  /**
   * Get prompt version history
   */
  getPromptVersionHistory: adminProcedure
    .input(z.object({ promptId: z.string().min(1, 'Prompt ID is required') }))
    .query(async ({ ctx, input }) => {
      try {
        const promptRef = ctx.db.collection('systemPrompts').doc(input.promptId);
        const versionsSnapshot = await promptRef
          .collection('versions')
          .orderBy('version', 'desc')
          .get();

        // Get unique creator IDs
        const creatorIds = [...new Set(versionsSnapshot.docs.map((doc) => doc.data().createdBy))];

        // Fetch creator data
        const creatorsData = await Promise.all(
          creatorIds.map(async (userId) => {
            const userDoc = await ctx.db.collection('users').doc(userId).get();
            return userDoc.exists
              ? {
                  id: userDoc.id,
                  name: userDoc.data()?.name,
                  email: userDoc.data()?.email,
                }
              : null;
          })
        );

        const creatorsMap = new Map(
          creatorsData.filter((c) => c !== null).map((c) => [c!.id, c])
        );

        // Map versions with creator data
        const versions = versionsSnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            creator: creatorsMap.get(data.createdBy) || null,
            createdAt: data.createdAt?.toDate(),
          };
        });

        return versions;
      } catch (error) {
        logger.error({ error, promptId: input.promptId }, 'Failed to get version history');
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch version history',
        });
      }
    }),

  /**
   * Restore prompt version
   */
  restorePromptVersion: adminProcedure
    .input(
      z.object({
        promptId: z.string(),
        versionId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const promptRef = ctx.db.collection('systemPrompts').doc(input.promptId);
        const promptDoc = await promptRef.get();

        if (!promptDoc.exists) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Prompt not found' });
        }

        // Get the specific version
        const versionDoc = await promptRef.collection('versions').doc(input.versionId).get();

        if (!versionDoc.exists) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Version not found' });
        }

        const versionData = versionDoc.data();
        const currentPromptData = promptDoc.data();

        // Get latest version number
        const latestVersionSnapshot = await promptRef
          .collection('versions')
          .orderBy('version', 'desc')
          .limit(1)
          .get();

        const latestVersionNum = latestVersionSnapshot.empty
          ? 0
          : latestVersionSnapshot.docs[0].data().version;

        // Create version history of current state before restoring
        const newVersionRef = promptRef.collection('versions').doc();
        await newVersionRef.set({
          id: newVersionRef.id,
          promptId: input.promptId,
          prompt: currentPromptData?.prompt,
          version: latestVersionNum + 1,
          createdBy: ctx.user.id,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        // Restore the version
        await promptRef.update({
          prompt: versionData?.prompt,
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        // Get updated prompt
        const updatedDoc = await promptRef.get();
        const updatedPrompt = { id: updatedDoc.id, ...(updatedDoc.data() || {}) } as {
          id: string;
          createdAt?: admin.firestore.Timestamp;
          updatedAt?: admin.firestore.Timestamp;
          [key: string]: unknown;
        };

        // Create audit log
        await ctx.db.collection('auditLogs').add({
          userId: ctx.user.id,
          userName: ctx.user.name,
          action: 'SYSTEM_PROMPT_RESTORED',
          details: {
            promptId: input.promptId,
            versionId: input.versionId,
            version: versionData?.version,
          },
          ipAddress: ctx.req.ip || ctx.req.socket.remoteAddress || null,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        logger.info({
          promptId: input.promptId,
          versionId: input.versionId,
          userId: ctx.user.id,
        }, 'System prompt version restored');

        return {
          ...updatedPrompt,
          createdAt: updatedPrompt.createdAt?.toDate(),
          updatedAt: updatedPrompt.updatedAt?.toDate(),
        };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        logger.error({ error, input }, 'Failed to restore prompt version');
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to restore prompt version',
        });
      }
    }),

  /**
   * Get all users with project statistics
   */
  getAllUsers: adminProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(50).optional(),
        offset: z.number().min(0).default(0).optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        const { limit = 50, offset = 0 } = input;

        // Get all users count
        const allUsersSnapshot = await ctx.db.collection('users').get();
        const total = allUsersSnapshot.size;

        // Get paginated users
        const usersSnapshot = await ctx.db
          .collection('users')
          .orderBy('createdAt', 'desc')
          .limit(limit)
          .offset(offset)
          .get();

        // Get project counts for each user
        const users = await Promise.all(
          usersSnapshot.docs.map(async (doc) => {
            const userData = doc.data();

            // Count projects for this user
            const projectsSnapshot = await ctx.db
              .collection('projects')
              .where('userId', '==', doc.id)
              .get();

            return {
              id: doc.id,
              name: userData.name,
              email: userData.email,
              emailVerified: userData.emailVerified,
              image: userData.image,
              role: userData.role,
              modePreference: userData.modePreference,
              bio: userData.bio,
              company: userData.company,
              jobTitle: userData.jobTitle,
              linkedInUrl: userData.linkedInUrl,
              websiteUrl: userData.websiteUrl,
              location: userData.location,
              githubUrl: userData.githubUrl,
              createdAt: userData.createdAt?.toDate(),
              updatedAt: userData.updatedAt?.toDate(),
              projectCount: projectsSnapshot.size,
            };
          })
        );

        return {
          users,
          total,
          hasMore: offset + users.length < total,
        };
      } catch (error) {
        logger.error({ error }, 'Failed to get all users');
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch users',
        });
      }
    }),

  /**
   * Update user role
   */
  updateUserRole: adminProcedure
    .input(
      z.object({
        userId: z.string(),
        role: z.enum(['USER', 'ADMIN']),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const userRef = ctx.db.collection('users').doc(input.userId);
        const userDoc = await userRef.get();

        if (!userDoc.exists) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'User not found',
          });
        }

        await userRef.update({
          role: input.role,
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        const updatedDoc = await userRef.get();
        const updatedData = updatedDoc.data();

        // Create audit log
        await ctx.db.collection('auditLogs').add({
          userId: ctx.user.id,
          userName: ctx.user.name,
          action: 'USER_ROLE_UPDATED',
          details: {
            targetUserId: input.userId,
            newRole: input.role,
          },
          ipAddress: ctx.req.ip || ctx.req.socket.remoteAddress || null,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        logger.info({ targetUserId: input.userId, newRole: input.role }, 'User role updated');

        return {
          id: updatedDoc.id,
          name: updatedData?.name,
          email: updatedData?.email,
          role: updatedData?.role,
          createdAt: updatedData?.createdAt?.toDate(),
        };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        logger.error({ error, userId: input.userId }, 'Failed to update user role');
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to update user role',
        });
      }
    }),

  /**
   * Delete user (admin only, with safeguards)
   */
  deleteUser: adminProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        // Prevent self-deletion
        if (input.userId === ctx.user.id) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Cannot delete your own account',
          });
        }

        const batch = ctx.db.batch();
        const userRef = ctx.db.collection('users').doc(input.userId);

        // Get all projects owned by this user
        const projectsSnapshot = await ctx.db
          .collection('projects')
          .where('userId', '==', input.userId)
          .get();

        // Delete each project and its subcollections
        for (const projectDoc of projectsSnapshot.docs) {
          // Delete documents subcollection
          const documentsSnapshot = await projectDoc.ref.collection('documents').get();
          for (const doc of documentsSnapshot.docs) {
            // Delete version history
            const versionsSnapshot = await doc.ref.collection('versions').get();
            versionsSnapshot.docs.forEach((v) => batch.delete(v.ref));
            batch.delete(doc.ref);
          }

          // Delete collaborators subcollection
          const collaboratorsSnapshot = await projectDoc.ref.collection('collaborators').get();
          collaboratorsSnapshot.docs.forEach((doc) => batch.delete(doc.ref));

          // Delete invites subcollection
          const invitesSnapshot = await projectDoc.ref.collection('invites').get();
          invitesSnapshot.docs.forEach((doc) => batch.delete(doc.ref));

          // Delete conversations subcollection
          const conversationsSnapshot = await projectDoc.ref.collection('conversations').get();
          conversationsSnapshot.docs.forEach((doc) => batch.delete(doc.ref));

          // Delete project
          batch.delete(projectDoc.ref);
        }

        // Delete user's sessions subcollection
        const sessionsSnapshot = await userRef.collection('sessions').get();
        sessionsSnapshot.docs.forEach((doc) => batch.delete(doc.ref));

        // Delete user's accounts subcollection
        const accountsSnapshot = await userRef.collection('accounts').get();
        accountsSnapshot.docs.forEach((doc) => batch.delete(doc.ref));

        // Delete user
        batch.delete(userRef);

        await batch.commit();

        // Delete from Firebase Auth
        try {
          await ctx.auth.deleteUser(input.userId);
        } catch (error) {
          logger.error({ error, userId: input.userId }, 'Failed to delete user from Firebase Auth');
          // Continue even if Auth deletion fails
        }

        // Create audit log
        await ctx.db.collection('auditLogs').add({
          userId: ctx.user.id,
          userName: ctx.user.name,
          action: 'USER_DELETED_BY_ADMIN',
          details: {
            deletedUserId: input.userId,
          },
          ipAddress: ctx.req.ip || ctx.req.socket.remoteAddress || null,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        logger.info({ deletedUserId: input.userId, adminId: ctx.user.id }, 'User deleted by admin');

        return { success: true, message: 'User deleted successfully' };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        logger.error({ error, userId: input.userId }, 'Failed to delete user');
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to delete user',
        });
      }
    }),

  /**
   * Get audit logs with filters
   */
  getAuditLogs: adminProcedure
    .input(
      z.object({
        userId: z.string().optional(),
        action: z.string().optional(),
        startDate: z.string().datetime().optional(),
        endDate: z.string().datetime().optional(),
        limit: z.number().min(1).max(100).default(50).optional(),
        offset: z.number().min(0).default(0).optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        const { userId, action, startDate, endDate, limit = 50, offset = 0 } = input;

        // Build query with filters
        let query = ctx.db.collection('auditLogs').orderBy('createdAt', 'desc');

        if (userId) {
          query = query.where('userId', '==', userId);
        }
        if (action) {
          query = query.where('action', '==', action);
        }
        if (startDate) {
          query = query.where('createdAt', '>=', new Date(startDate));
        }
        if (endDate) {
          query = query.where('createdAt', '<=', new Date(endDate));
        }

        // Get all matching logs for count and pagination
        const allLogsSnapshot = await query.get();
        const total = allLogsSnapshot.size;

        // Apply pagination in memory
        const paginatedDocs = allLogsSnapshot.docs.slice(offset, offset + limit);

        // Get unique user IDs
        const userIds = [...new Set(paginatedDocs.map((doc) => doc.data().userId))];

        // Fetch user data
        const usersData = await Promise.all(
          userIds.map(async (uid) => {
            const userDoc = await ctx.db.collection('users').doc(uid).get();
            return userDoc.exists
              ? {
                  id: userDoc.id,
                  name: userDoc.data()?.name,
                  email: userDoc.data()?.email,
                }
              : null;
          })
        );

        const usersMap = new Map(usersData.filter((u) => u !== null).map((u) => [u!.id, u]));

        // Map logs with user data
        const logs = paginatedDocs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            user: usersMap.get(data.userId) || null,
            createdAt: data.createdAt?.toDate(),
          };
        });

        return {
          logs,
          total,
          hasMore: offset + logs.length < total,
        };
      } catch (error) {
        logger.error({ error }, 'Failed to get audit logs');
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch audit logs',
        });
      }
    }),

  /**
   * Get system statistics
   */
  getSystemStats: adminProcedure.query(async ({ ctx }) => {
    try {
      const [usersSnap, projectsSnap, activeProjectsSnap, tokenUsageSnap] = await Promise.all([
        ctx.db.collection('users').get(),
        ctx.db.collection('projects').get(),
        ctx.db.collection('projects').where('status', '==', 'ACTIVE').get(),
        ctx.db.collection('tokenUsage').get(),
      ]);

      // Count documents across all projects (from subcollections)
      let totalDocuments = 0;
      let approvedDocuments = 0;

      for (const projectDoc of projectsSnap.docs) {
        const documentsSnap = await projectDoc.ref.collection('documents').get();
        totalDocuments += documentsSnap.size;

        const approvedDocs = documentsSnap.docs.filter(
          (doc) => doc.data().status === 'APPROVED'
        );
        approvedDocuments += approvedDocs.length;
      }

      // Calculate token usage totals
      let totalTokensUsed = 0;
      let totalCost = 0;

      tokenUsageSnap.docs.forEach((doc) => {
        const data = doc.data();
        totalTokensUsed += data.tokensUsed || 0;
        totalCost += data.cost || 0;
      });

      return {
        totalUsers: usersSnap.size,
        totalProjects: projectsSnap.size,
        activeProjects: activeProjectsSnap.size,
        totalDocuments,
        approvedDocuments,
        approvalRate:
          totalDocuments > 0 ? Math.round((approvedDocuments / totalDocuments) * 100) : 0,
        totalTokensUsed,
        totalCost,
      };
    } catch (error) {
      logger.error({ error }, 'Failed to get system stats');
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to fetch system statistics',
      });
    }
  }),

  /**
   * Get all projects with user info (admin view)
   */
  getAllProjects: adminProcedure
    .input(
      z.object({
        userId: z.string().optional(),
        status: z.enum(['ACTIVE', 'COMPLETED', 'ARCHIVED']).optional(),
        limit: z.number().min(1).max(100).default(50).optional(),
        offset: z.number().min(0).default(0).optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        const { userId, status, limit = 50, offset = 0 } = input;

        // Build query with filters
        let query = ctx.db.collection('projects').orderBy('createdAt', 'desc');

        if (userId) {
          query = query.where('userId', '==', userId);
        }
        if (status) {
          query = query.where('status', '==', status);
        }

        // Get all matching projects for count and pagination
        const allProjectsSnapshot = await query.get();
        const total = allProjectsSnapshot.size;

        // Apply pagination in memory
        const paginatedDocs = allProjectsSnapshot.docs.slice(offset, offset + limit);

        // Get user IDs
        const userIds = [...new Set(paginatedDocs.map((doc) => doc.data().userId))];

        // Fetch user data
        const usersData = await Promise.all(
          userIds.map(async (uid) => {
            const userDoc = await ctx.db.collection('users').doc(uid).get();
            return userDoc.exists
              ? {
                  id: userDoc.id,
                  name: userDoc.data()?.name,
                  email: userDoc.data()?.email,
                }
              : null;
          })
        );

        const usersMap = new Map(usersData.filter((u) => u !== null).map((u) => [u!.id, u]));

        // Get project data with document counts
        const projects = await Promise.all(
          paginatedDocs.map(async (doc) => {
            const data = doc.data();

            // Count documents in subcollection
            const documentsSnapshot = await doc.ref.collection('documents').get();

            return {
              id: doc.id,
              ...data,
              user: usersMap.get(data.userId) || null,
              _count: {
                documents: documentsSnapshot.size,
              },
              createdAt: data.createdAt?.toDate(),
              updatedAt: data.updatedAt?.toDate(),
            };
          })
        );

        return {
          projects,
          total,
          hasMore: offset + projects.length < total,
        };
      } catch (error) {
        logger.error({ error }, 'Failed to get all projects');
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch projects',
        });
      }
    }),

  /**
   * Delete project (admin only)
   */
  deleteProject: adminProcedure
    .input(z.object({ projectId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const projectRef = ctx.db.collection('projects').doc(input.projectId);
        const projectDoc = await projectRef.get();

        if (!projectDoc.exists) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Project not found',
          });
        }

        const batch = ctx.db.batch();

        // Delete all subcollections
        const [documentsSnap, collaboratorsSnap, invitesSnap, conversationsSnap] =
          await Promise.all([
            projectRef.collection('documents').get(),
            projectRef.collection('collaborators').get(),
            projectRef.collection('invites').get(),
            projectRef.collection('conversations').get(),
          ]);

        // Delete document versions
        for (const doc of documentsSnap.docs) {
          const versionsSnap = await doc.ref.collection('versions').get();
          versionsSnap.docs.forEach((v) => batch.delete(v.ref));
          batch.delete(doc.ref);
        }

        // Delete collaborators, invites, conversations
        collaboratorsSnap.docs.forEach((doc) => batch.delete(doc.ref));
        invitesSnap.docs.forEach((doc) => batch.delete(doc.ref));
        conversationsSnap.docs.forEach((doc) => batch.delete(doc.ref));

        // Delete project
        batch.delete(projectRef);

        await batch.commit();

        // Create audit log
        await ctx.db.collection('auditLogs').add({
          userId: ctx.user.id,
          userName: ctx.user.name,
          action: 'PROJECT_DELETED_BY_ADMIN',
          details: {
            projectId: input.projectId,
          },
          ipAddress: ctx.req.ip || ctx.req.socket.remoteAddress || null,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        logger.info({ projectId: input.projectId, adminId: ctx.user.id }, 'Project deleted by admin');

        return { success: true, message: 'Project deleted successfully' };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        logger.error({ error, projectId: input.projectId }, 'Failed to delete project');
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to delete project',
        });
      }
    }),

  /**
   * Get all documents with filters (admin view)
   */
  getAllDocuments: adminProcedure
    .input(
      z.object({
        projectId: z.string().optional(),
        userId: z.string().optional(),
        type: z.enum(['BRD', 'PRD', 'PROMPT_BUILD', 'TASKS']).optional(),
        status: z.enum(['DRAFT', 'APPROVED']).optional(),
        limit: z.number().min(1).max(100).default(50).optional(),
        offset: z.number().min(0).default(0).optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        const { projectId, userId, type, status, limit = 50, offset = 0 } = input;

        // Get projects (filtered by userId if provided)
        let projectsQuery: admin.firestore.Query<admin.firestore.DocumentData> = ctx.db.collection('projects');
        if (userId) {
          projectsQuery = projectsQuery.where('userId', '==', userId);
        }
        if (projectId) {
          projectsQuery = projectsQuery.where(admin.firestore.FieldPath.documentId(), '==', projectId);
        }

        const projectsSnapshot = await projectsQuery.get();

        // Collect all documents from project subcollections
        const allDocuments: any[] = [];

        for (const projectDoc of projectsSnapshot.docs) {
          const projectData = projectDoc.data();

          // Build documents query with filters
          let docsQuery = projectDoc.ref.collection('documents').orderBy('createdAt', 'desc');

          if (type) {
            docsQuery = docsQuery.where('type', '==', type);
          }
          if (status) {
            docsQuery = docsQuery.where('status', '==', status);
          }

          const documentsSnapshot = await docsQuery.get();

          // Get project owner data
          const ownerDoc = await ctx.db.collection('users').doc(projectData.userId).get();
          const ownerData = ownerDoc.exists
            ? {
                id: ownerDoc.id,
                name: ownerDoc.data()?.name,
                email: ownerDoc.data()?.email,
              }
            : null;

          // Add documents with project info
          documentsSnapshot.docs.forEach((doc) => {
            const docData = doc.data();
            allDocuments.push({
              id: doc.id,
              ...docData,
              project: {
                id: projectDoc.id,
                title: projectData.title,
                user: ownerData,
              },
              createdAt: docData.createdAt?.toDate(),
              updatedAt: docData.updatedAt?.toDate(),
            });
          });
        }

        // Sort all documents by createdAt desc
        allDocuments.sort((a, b) => {
          const aTime = a.createdAt?.getTime() || 0;
          const bTime = b.createdAt?.getTime() || 0;
          return bTime - aTime;
        });

        const total = allDocuments.length;
        const paginatedDocuments = allDocuments.slice(offset, offset + limit);

        return {
          documents: paginatedDocuments,
          total,
          hasMore: offset + paginatedDocuments.length < total,
        };
      } catch (error) {
        logger.error({ error }, 'Failed to get all documents');
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch documents',
        });
      }
    }),

  /**
   * Delete document (admin only)
   */
  deleteDocument: adminProcedure
    .input(
      z.object({
        projectId: z.string(),
        documentId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const projectRef = ctx.db.collection('projects').doc(input.projectId);
        const documentRef = projectRef.collection('documents').doc(input.documentId);
        const documentDoc = await documentRef.get();

        if (!documentDoc.exists) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Document not found',
          });
        }

        const documentData = documentDoc.data();
        const batch = ctx.db.batch();

        // Delete version history
        const versionsSnapshot = await documentRef.collection('versions').get();
        versionsSnapshot.docs.forEach((doc) => batch.delete(doc.ref));

        // Delete document
        batch.delete(documentRef);

        await batch.commit();

        // Create audit log
        await ctx.db.collection('auditLogs').add({
          userId: ctx.user.id,
          userName: ctx.user.name,
          action: 'DOCUMENT_DELETED_BY_ADMIN',
          details: {
            documentId: input.documentId,
            documentType: documentData?.type,
            documentVersion: documentData?.version,
            projectId: input.projectId,
          },
          ipAddress: ctx.req.ip || ctx.req.socket.remoteAddress || null,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        logger.info({
          documentId: input.documentId,
          projectId: input.projectId,
          adminId: ctx.user.id,
        }, 'Document deleted by admin');

        return { success: true, message: 'Document deleted successfully' };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        logger.error({ error, input }, 'Failed to delete document');
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to delete document',
        });
      }
    }),

  /**
   * Get token usage data with filters
   */
  getTokenUsage: adminProcedure
    .input(
      z.object({
        userId: z.string().optional(),
        projectId: z.string().optional(),
        operation: z.string().optional(),
        startDate: z.string().datetime().optional(),
        endDate: z.string().datetime().optional(),
        limit: z.number().min(1).max(100).default(50).optional(),
        offset: z.number().min(0).default(0).optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        const { userId, projectId, operation, startDate, endDate, limit = 50, offset = 0 } = input;

        // Build query with filters
        let query = ctx.db.collection('tokenUsage').orderBy('createdAt', 'desc');

        if (userId) {
          query = query.where('userId', '==', userId);
        }
        if (projectId) {
          query = query.where('projectId', '==', projectId);
        }
        if (operation) {
          query = query.where('operation', '==', operation);
        }
        if (startDate) {
          query = query.where('createdAt', '>=', new Date(startDate));
        }
        if (endDate) {
          query = query.where('createdAt', '<=', new Date(endDate));
        }

        // Get all matching records for count and pagination
        const allUsageSnapshot = await query.get();
        const total = allUsageSnapshot.size;

        // Apply pagination in memory
        const paginatedDocs = allUsageSnapshot.docs.slice(offset, offset + limit);

        // Get unique user and project IDs
        const userIds = [...new Set(paginatedDocs.map((doc) => doc.data().userId))];
        const projectIds = [
          ...new Set(paginatedDocs.map((doc) => doc.data().projectId).filter((id) => id)),
        ];

        // Fetch user and project data
        const [usersData, projectsData] = await Promise.all([
          Promise.all(
            userIds.map(async (uid) => {
              const userDoc = await ctx.db.collection('users').doc(uid).get();
              return userDoc.exists
                ? {
                    id: userDoc.id,
                    name: userDoc.data()?.name,
                    email: userDoc.data()?.email,
                  }
                : null;
            })
          ),
          Promise.all(
            projectIds.map(async (pid) => {
              const projectDoc = await ctx.db.collection('projects').doc(pid).get();
              return projectDoc.exists
                ? {
                    id: projectDoc.id,
                    title: projectDoc.data()?.title,
                  }
                : null;
            })
          ),
        ]);

        const usersMap = new Map(usersData.filter((u) => u !== null).map((u) => [u!.id, u]));
        const projectsMap = new Map(
          projectsData.filter((p) => p !== null).map((p) => [p!.id, p])
        );

        // Map usage with user and project data
        const usage = paginatedDocs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            user: usersMap.get(data.userId) || null,
            project: data.projectId ? projectsMap.get(data.projectId) || null : null,
            createdAt: data.createdAt?.toDate(),
          };
        });

        return {
          usage,
          total,
          hasMore: offset + usage.length < total,
        };
      } catch (error) {
        logger.error({ error }, 'Failed to get token usage');
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch token usage',
        });
      }
    }),

  /**
   * Get token usage statistics
   */
  getTokenStats: adminProcedure
    .input(
      z.object({
        startDate: z.string().datetime().optional(),
        endDate: z.string().datetime().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        const { startDate, endDate } = input;

        // Build query with date filters
        let query: admin.firestore.Query<admin.firestore.DocumentData> = ctx.db.collection('tokenUsage');

        if (startDate) {
          query = query.where('createdAt', '>=', new Date(startDate));
        }
        if (endDate) {
          query = query.where('createdAt', '<=', new Date(endDate));
        }

        const usageSnapshot = await query.get();

        // Manual aggregation
        let totalTokensUsed = 0;
        let totalCost = 0;
        let totalRequests = usageSnapshot.size;

        // Group by operation, user, and model
        const byOperationMap = new Map<string, { tokensUsed: number; cost: number; count: number }>();
        const byUserMap = new Map<string, { tokensUsed: number; cost: number; count: number }>();
        const byModelMap = new Map<string, { tokensUsed: number; cost: number; count: number }>();

        usageSnapshot.docs.forEach((doc) => {
          const data = doc.data();
          const tokensUsed = data.tokensUsed || 0;
          const cost = data.cost || 0;

          // Total stats
          totalTokensUsed += tokensUsed;
          totalCost += cost;

          // Group by operation
          if (data.operation) {
            const opStats = byOperationMap.get(data.operation) || { tokensUsed: 0, cost: 0, count: 0 };
            opStats.tokensUsed += tokensUsed;
            opStats.cost += cost;
            opStats.count += 1;
            byOperationMap.set(data.operation, opStats);
          }

          // Group by user
          if (data.userId) {
            const userStats = byUserMap.get(data.userId) || { tokensUsed: 0, cost: 0, count: 0 };
            userStats.tokensUsed += tokensUsed;
            userStats.cost += cost;
            userStats.count += 1;
            byUserMap.set(data.userId, userStats);
          }

          // Group by model
          if (data.model) {
            const modelStats = byModelMap.get(data.model) || { tokensUsed: 0, cost: 0, count: 0 };
            modelStats.tokensUsed += tokensUsed;
            modelStats.cost += cost;
            modelStats.count += 1;
            byModelMap.set(data.model, modelStats);
          }
        });

        // Convert maps to arrays
        const byOperation = Array.from(byOperationMap.entries()).map(([operation, stats]) => ({
          operation,
          tokensUsed: stats.tokensUsed,
          cost: stats.cost,
          requests: stats.count,
        }));

        const byUserArray = Array.from(byUserMap.entries())
          .map(([userId, stats]) => ({
            userId,
            tokensUsed: stats.tokensUsed,
            cost: stats.cost,
            requests: stats.count,
          }))
          .sort((a, b) => b.tokensUsed - a.tokensUsed)
          .slice(0, 10);

        // Fetch user details for top users
        const userDetails = await Promise.all(
          byUserArray.map(async (u) => {
            const userDoc = await ctx.db.collection('users').doc(u.userId).get();
            const userData = userDoc.data();
            return {
              userId: u.userId,
              userName: userData?.name || 'Unknown',
              userEmail: userData?.email || '',
              tokensUsed: u.tokensUsed,
              cost: u.cost,
              requests: u.requests,
            };
          })
        );

        const byModel = Array.from(byModelMap.entries()).map(([model, stats]) => ({
          model,
          tokensUsed: stats.tokensUsed,
          cost: stats.cost,
          requests: stats.count,
        }));

        return {
          total: {
            tokensUsed: totalTokensUsed,
            cost: totalCost,
            requests: totalRequests,
          },
          byOperation,
          topUsers: userDetails,
          byModel,
        };
      } catch (error) {
        logger.error({ error }, 'Failed to get token stats');
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch token statistics',
        });
      }
    }),
});
