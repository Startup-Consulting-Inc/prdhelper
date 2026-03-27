/**
 * Projects Router (Firestore)
 *
 * tRPC router for project operations:
 * - Get all projects
 * - Get project by ID
 * - Create project
 * - Update project
 * - Update project phase
 * - Archive project
 * - Delete project
 * - Get project stats
 */

import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { router, protectedProcedure } from '../lib/trpc/trpc.js';
import {
  createProjectSchema,
  updateProjectSchema,
  getProjectByIdSchema,
  updateProjectPhaseSchema,
  getAllProjectsSchema,
} from '../lib/validations/project.js';
import { admin } from '../lib/firebase.js';
import { logger } from '../lib/logger.js';

export const projectsRouter = router({
  /**
   * Get all user's projects with optional filters
   * Returns owned projects + projects shared with user
   */
  getAll: protectedProcedure
    .input(getAllProjectsSchema)
    .query(async ({ ctx, input }) => {
      const { status, mode, limit = 50, offset = 0 } = input;

      try {
        // Admins can see all projects
        if (ctx.user.role === 'ADMIN') {
          let query = ctx.db.collection('projects').orderBy('updatedAt', 'desc');

          // Apply filters
          if (status) query = query.where('status', '==', status);
          if (mode) query = query.where('mode', '==', mode);

          // Get total count with filters
          const countSnapshot = await query.get();
          const total = countSnapshot.size;

          // Apply pagination
          const snapshot = await query.limit(limit).offset(offset).get();

          // Fetch related data for each project
          const projects = await Promise.all(
            snapshot.docs.map(async (doc) => {
              const projectData = doc.data();

              // Get documents subcollection
              const documentsSnapshot = await doc.ref
                .collection('documents')
                .orderBy('createdAt', 'desc')
                .get();

              const documents = documentsSnapshot.docs.map((docDoc) => ({
                id: docDoc.id,
                type: docDoc.data().type,
                status: docDoc.data().status,
                createdAt: docDoc.data().createdAt?.toDate(),
              }));

              // Get user info
              const userDoc = await ctx.db.collection('users').doc(projectData.userId).get();
              const userData = userDoc.exists ? userDoc.data() : null;

              return {
                id: doc.id,
                ...projectData,
                createdAt: projectData.createdAt?.toDate(),
                updatedAt: projectData.updatedAt?.toDate(),
                documents,
                user: userData ? {
                  id: userDoc.id,
                  name: userData.name,
                  email: userData.email,
                } : null,
                isOwner: projectData.userId === ctx.user.id,
                userRole: projectData.userId === ctx.user.id ? 'OWNER' : null,
              };
            })
          );

          return {
            projects,
            total,
            hasMore: offset + projects.length < total,
          };
        }

        // Regular users: find owned projects + shared projects
        // First, get projects owned by user
        let ownedQuery = ctx.db.collection('projects').where('userId', '==', ctx.user.id);

        if (status) ownedQuery = ownedQuery.where('status', '==', status);
        if (mode) ownedQuery = ownedQuery.where('mode', '==', mode);

        const ownedSnapshot = await ownedQuery.orderBy('updatedAt', 'desc').get();

        // Find projects where user is a collaborator using collectionGroup query (O(1) instead of O(N))
        const sharedCollabs = await ctx.db
          .collectionGroup('collaborators')
          .where('userId', '==', ctx.user.id)
          .get();

        const sharedProjectRefs = sharedCollabs.docs
          .map((d) => d.ref.parent.parent)
          .filter(Boolean) as FirebaseFirestore.DocumentReference[];

        const sharedProjectDocs = await Promise.all(
          sharedProjectRefs.map((ref) => ref.get())
        );

        // Filter shared projects by status/mode and exclude non-existent
        const filteredSharedDocs = sharedProjectDocs.filter((doc) => {
          if (!doc.exists) return false;
          const data = doc.data();
          if (!data) return false;
          const matchesStatus = !status || data.status === status;
          const matchesMode = !mode || data.mode === mode;
          return matchesStatus && matchesMode;
        });

        // Combine owned and shared projects
        const allProjectDocs = [
          ...ownedSnapshot.docs,
          ...filteredSharedDocs,
        ];

        // Remove duplicates and sort by updatedAt
        const uniqueProjectDocs = Array.from(
          new Map(allProjectDocs.map((doc) => [doc.id, doc])).values()
        ).sort((a, b) => {
          const aTime = a.data()!.updatedAt?.toMillis() || 0;
          const bTime = b.data()!.updatedAt?.toMillis() || 0;
          return bTime - aTime;
        });

        const total = uniqueProjectDocs.length;

        // Apply pagination
        const paginatedDocs = uniqueProjectDocs.slice(offset, offset + limit);

        // Fetch related data for each project
        const projects = await Promise.all(
          paginatedDocs.map(async (doc) => {
            const projectData = doc.data()!;

            // Get documents subcollection
            const documentsSnapshot = await doc.ref
              .collection('documents')
              .orderBy('createdAt', 'desc')
              .get();

            const documents = documentsSnapshot.docs.map((docDoc) => ({
              id: docDoc.id,
              type: docDoc.data().type,
              status: docDoc.data().status,
              createdAt: docDoc.data().createdAt?.toDate(),
            }));

            // Get user info
            const userDoc = await ctx.db.collection('users').doc(projectData.userId).get();
            const userData = userDoc.exists ? userDoc.data() : null;

            // Check if user is collaborator
            const collaboratorSnapshot = await doc.ref
              .collection('collaborators')
              .where('userId', '==', ctx.user.id)
              .get();

            const isOwner = projectData.userId === ctx.user.id;
            const collaboratorRole = !collaboratorSnapshot.empty
              ? collaboratorSnapshot.docs[0].data().role
              : null;

            return {
              id: doc.id,
              ...projectData,
              createdAt: projectData.createdAt?.toDate(),
              updatedAt: projectData.updatedAt?.toDate(),
              documents,
              user: userData ? {
                id: userDoc.id,
                name: userData.name,
                email: userData.email,
              } : null,
              isOwner,
              userRole: isOwner ? 'OWNER' : collaboratorRole,
            };
          })
        );

        return {
          projects,
          total,
          hasMore: offset + projects.length < total,
        };
      } catch (error) {
        logger.error({ error, userId: ctx.user.id }, 'Failed to get projects');
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch projects',
        });
      }
    }),

  /**
   * Get project by ID with related data
   * Accessible by owner or collaborators
   */
  getById: protectedProcedure
    .input(getProjectByIdSchema)
    .query(async ({ ctx, input }) => {
      try {
        const projectDoc = await ctx.db.collection('projects').doc(input.id).get();

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

        const isOwner = projectData.userId === ctx.user.id;

        // Check if user is collaborator
        const collaboratorSnapshot = await projectDoc.ref
          .collection('collaborators')
          .where('userId', '==', ctx.user.id)
          .get();

        const isCollaborator = !collaboratorSnapshot.empty;
        const collaboratorRole = isCollaborator ? collaboratorSnapshot.docs[0].data().role : null;

        // Verify access (owner, collaborator, or admin)
        if (!isOwner && !isCollaborator && ctx.user.role !== 'ADMIN') {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'You do not have access to this project',
          });
        }

        // Get documents subcollection
        const documentsSnapshot = await projectDoc.ref
          .collection('documents')
          .orderBy('createdAt', 'desc')
          .get();

        const documents = documentsSnapshot.docs.map((docDoc) => ({
          id: docDoc.id,
          ...docDoc.data(),
          createdAt: docDoc.data().createdAt?.toDate(),
          updatedAt: docDoc.data().updatedAt?.toDate(),
        }));

        // Get conversations subcollection
        const conversationsSnapshot = await projectDoc.ref
          .collection('conversations')
          .orderBy('createdAt', 'desc')
          .get();

        const conversations = conversationsSnapshot.docs.map((convDoc) => ({
          id: convDoc.id,
          ...convDoc.data(),
          createdAt: convDoc.data().createdAt?.toDate(),
          updatedAt: convDoc.data().updatedAt?.toDate(),
        }));

        // Get user info
        const userDoc = await ctx.db.collection('users').doc(projectData.userId).get();
        const userData = userDoc.exists ? userDoc.data() : null;

        return {
          id: projectDoc.id,
          ...projectData,
          createdAt: projectData.createdAt?.toDate(),
          updatedAt: projectData.updatedAt?.toDate(),
          documents,
          conversations,
          user: userData ? {
            id: userDoc.id,
            name: userData.name,
            email: userData.email,
          } : null,
          isOwner,
          userRole: isOwner ? 'OWNER' : collaboratorRole,
        };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        logger.error({ error, projectId: input.id, userId: ctx.user.id }, 'Failed to get project');
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch project',
        });
      }
    }),

  /**
   * Create new project
   */
  create: protectedProcedure
    .input(createProjectSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        // Create project document
        const projectRef = ctx.db.collection('projects').doc();

        const projectData = {
          id: projectRef.id,
          userId: ctx.user.id,
          title: input.title,
          description: input.description,
          mode: input.mode,
          language: input.language || 'auto',
          status: 'ACTIVE',
          currentPhase: input.skipProblemDefinition ? 'BRD_QUESTIONS' : 'PROBLEM_DEFINITION_QUESTIONS',
          skipProblemDefinition: input.skipProblemDefinition ?? false,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        };

        await projectRef.set(projectData);

        // Create audit log
        await ctx.db.collection('auditLogs').add({
          userId: ctx.user.id,
          userName: ctx.user.name,
          action: 'PROJECT_CREATED',
          details: {
            projectId: projectRef.id,
            title: input.title,
            mode: input.mode,
          },
          ipAddress: ctx.req.ip || ctx.req.socket.remoteAddress || null,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        logger.info({ projectId: projectRef.id, userId: ctx.user.id }, 'Project created');

        return {
          ...projectData,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      } catch (error) {
        logger.error({ error, userId: ctx.user.id }, 'Failed to create project');
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create project',
        });
      }
    }),

  /**
   * Update project details
   * Accessible by owner or collaborators with EDITOR role
   */
  update: protectedProcedure
    .input(updateProjectSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...updateData } = input;

      try {
        // Verify access
        const projectRef = ctx.db.collection('projects').doc(id);
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

        const isOwner = projectData.userId === ctx.user.id;

        // Check if user is collaborator with EDITOR role
        const collaboratorSnapshot = await projectRef
          .collection('collaborators')
          .where('userId', '==', ctx.user.id)
          .get();

        const isEditor = !collaboratorSnapshot.empty &&
          collaboratorSnapshot.docs[0].data().role === 'EDITOR';

        // Only owner, editors, or admins can update
        if (!isOwner && !isEditor && ctx.user.role !== 'ADMIN') {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'You do not have permission to edit this project',
          });
        }

        // Update project
        await projectRef.update({
          ...updateData,
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        // Create audit log
        await ctx.db.collection('auditLogs').add({
          userId: ctx.user.id,
          userName: ctx.user.name,
          action: 'PROJECT_UPDATED',
          details: {
            projectId: id,
            updates: updateData,
            role: isOwner ? 'OWNER' : 'EDITOR',
          },
          ipAddress: ctx.req.ip || ctx.req.socket.remoteAddress || null,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        logger.info({ projectId: id, userId: ctx.user.id }, 'Project updated');

        // Fetch updated project
        const updatedDoc = await projectRef.get();
        const updatedData = updatedDoc.data();

        return {
          id: updatedDoc.id,
          ...updatedData,
          createdAt: updatedData?.createdAt?.toDate(),
          updatedAt: updatedData?.updatedAt?.toDate(),
        };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        logger.error({ error, projectId: id, userId: ctx.user.id }, 'Failed to update project');
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to update project',
        });
      }
    }),

  /**
   * Update project phase
   * Accessible by owner or collaborators with EDITOR role
   */
  updatePhase: protectedProcedure
    .input(updateProjectPhaseSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        // Verify access
        const projectRef = ctx.db.collection('projects').doc(input.id);
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

        const isOwner = projectData.userId === ctx.user.id;

        // Check if user is collaborator with EDITOR role
        const collaboratorSnapshot = await projectRef
          .collection('collaborators')
          .where('userId', '==', ctx.user.id)
          .get();

        const isEditor = !collaboratorSnapshot.empty &&
          collaboratorSnapshot.docs[0].data().role === 'EDITOR';

        // Only owner, editors, or admins can update phase
        if (!isOwner && !isEditor && ctx.user.role !== 'ADMIN') {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'You do not have permission to update this project',
          });
        }

        const oldPhase = projectData.currentPhase;

        // Update phase
        await projectRef.update({
          currentPhase: input.phase,
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        // Create audit log
        await ctx.db.collection('auditLogs').add({
          userId: ctx.user.id,
          userName: ctx.user.name,
          action: 'PROJECT_PHASE_UPDATED',
          details: {
            projectId: input.id,
            oldPhase,
            newPhase: input.phase,
            role: isOwner ? 'OWNER' : 'EDITOR',
          },
          ipAddress: ctx.req.ip || ctx.req.socket.remoteAddress || null,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        logger.info({ projectId: input.id, oldPhase, newPhase: input.phase, userId: ctx.user.id }, 'Project phase updated');

        // Fetch updated project
        const updatedDoc = await projectRef.get();
        const updatedData = updatedDoc.data();

        return {
          id: updatedDoc.id,
          ...updatedData,
          createdAt: updatedData?.createdAt?.toDate(),
          updatedAt: updatedData?.updatedAt?.toDate(),
        };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        logger.error({ error, projectId: input.id, userId: ctx.user.id }, 'Failed to update project phase');
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to update project phase',
        });
      }
    }),

  /**
   * Archive project
   * Only project owner can archive
   */
  /**
   * Duplicate project with conversation history (no documents)
   * Only project owner or VIEWER+ can duplicate
   */
  duplicate: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const sourceRef = ctx.db.collection('projects').doc(input.id);
        const sourceDoc = await sourceRef.get();

        if (!sourceDoc.exists) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Project not found',
          });
        }

        const sourceData = sourceDoc.data()!;

        // Verify access (owner, collaborator, or admin)
        const isOwner = sourceData.userId === ctx.user.id;
        const collaboratorSnapshot = await sourceRef
          .collection('collaborators')
          .where('userId', '==', ctx.user.id)
          .get();
        const isCollaborator = !collaboratorSnapshot.empty;

        if (!isOwner && !isCollaborator && ctx.user.role !== 'ADMIN') {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'You do not have access to duplicate this project',
          });
        }

        const newProjectRef = ctx.db.collection('projects').doc();

        const newProjectData = {
          id: newProjectRef.id,
          userId: ctx.user.id,
          title: `${sourceData.title || 'Untitled'} (Copy)`,
          description: sourceData.description || '',
          mode: sourceData.mode || 'UNIFIED',
          language: sourceData.language || 'auto',
          status: 'ACTIVE',
          currentPhase: sourceData.skipProblemDefinition ? 'BRD_QUESTIONS' : 'PROBLEM_DEFINITION_QUESTIONS',
          skipProblemDefinition: sourceData.skipProblemDefinition ?? false,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        };

        await newProjectRef.set(newProjectData);

        // Copy conversation history (BRD and PRD)
        const conversationsSnapshot = await sourceRef.collection('conversations').get();

        const batch = ctx.db.batch();

        for (const convDoc of conversationsSnapshot.docs) {
          const convData = convDoc.data();
          const docType = convDoc.id;

          if (docType !== 'BRD' && docType !== 'PRD') continue;

          const newConvRef = newProjectRef.collection('conversations').doc(docType);
          batch.set(newConvRef, {
            id: docType,
            projectId: newProjectRef.id,
            documentType: docType,
            messages: convData.messages || [],
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          });
        }

        await batch.commit();

        await ctx.db.collection('auditLogs').add({
          userId: ctx.user.id,
          userName: ctx.user.name,
          action: 'PROJECT_DUPLICATED',
          details: {
            sourceProjectId: input.id,
            newProjectId: newProjectRef.id,
            title: newProjectData.title,
          },
          ipAddress: ctx.req.ip || ctx.req.socket.remoteAddress || null,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        logger.info({
          sourceProjectId: input.id,
          newProjectId: newProjectRef.id,
          userId: ctx.user.id,
        }, 'Project duplicated');

        return {
          id: newProjectRef.id,
          title: newProjectData.title,
          description: newProjectData.description,
          mode: newProjectData.mode,
          language: newProjectData.language,
          status: newProjectData.status,
          currentPhase: newProjectData.currentPhase,
          userId: newProjectData.userId,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        logger.error({ error, projectId: input.id, userId: ctx.user.id }, 'Failed to duplicate project');
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to duplicate project',
        });
      }
    }),

  archive: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        // Verify ownership
        const projectRef = ctx.db.collection('projects').doc(input.id);
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

        // Only owner or admin can archive
        if (projectData.userId !== ctx.user.id && ctx.user.role !== 'ADMIN') {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'Only the project owner can archive this project',
          });
        }

        // Archive project
        await projectRef.update({
          status: 'ARCHIVED',
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        // Create audit log
        await ctx.db.collection('auditLogs').add({
          userId: ctx.user.id,
          userName: ctx.user.name,
          action: 'PROJECT_ARCHIVED',
          details: {
            projectId: input.id,
            title: projectData.title,
          },
          ipAddress: ctx.req.ip || ctx.req.socket.remoteAddress || null,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        logger.info({ projectId: input.id, userId: ctx.user.id }, 'Project archived');

        // Fetch updated project
        const updatedDoc = await projectRef.get();
        const updatedData = updatedDoc.data();

        return {
          id: updatedDoc.id,
          ...updatedData,
          createdAt: updatedData?.createdAt?.toDate(),
          updatedAt: updatedData?.updatedAt?.toDate(),
        };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        logger.error({ error, projectId: input.id, userId: ctx.user.id }, 'Failed to archive project');
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to archive project',
        });
      }
    }),

  /**
   * Delete project (cascade deletes documents and conversations)
   * Only project owner can delete
   */
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        // Verify ownership
        const projectRef = ctx.db.collection('projects').doc(input.id);
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

        // Only owner or admin can delete
        if (projectData.userId !== ctx.user.id && ctx.user.role !== 'ADMIN') {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'Only the project owner can delete this project',
          });
        }

        const batch = ctx.db.batch();

        // Delete documents subcollection
        const documentsSnapshot = await projectRef.collection('documents').get();
        documentsSnapshot.docs.forEach((doc) => {
          batch.delete(doc.ref);
        });

        // Delete conversations subcollection
        const conversationsSnapshot = await projectRef.collection('conversations').get();
        conversationsSnapshot.docs.forEach((doc) => {
          batch.delete(doc.ref);
        });

        // Delete collaborators subcollection
        const collaboratorsSnapshot = await projectRef.collection('collaborators').get();
        collaboratorsSnapshot.docs.forEach((doc) => {
          batch.delete(doc.ref);
        });

        // Delete invites subcollection
        const invitesSnapshot = await projectRef.collection('invites').get();
        invitesSnapshot.docs.forEach((doc) => {
          batch.delete(doc.ref);
        });

        // Delete project document
        batch.delete(projectRef);

        // Commit batch
        await batch.commit();

        // Create audit log (after deletion)
        await ctx.db.collection('auditLogs').add({
          userId: ctx.user.id,
          userName: ctx.user.name,
          action: 'PROJECT_DELETED',
          details: {
            projectId: input.id,
            title: projectData.title,
          },
          ipAddress: ctx.req.ip || ctx.req.socket.remoteAddress || null,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        logger.info({ projectId: input.id, userId: ctx.user.id }, 'Project deleted');

        return { success: true, message: 'Project deleted successfully' };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        logger.error({ error, projectId: input.id, userId: ctx.user.id }, 'Failed to delete project');
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to delete project',
        });
      }
    }),

  /**
   * Get user statistics
   */
  getStats: protectedProcedure.query(async ({ ctx }) => {
    try {
      const now = new Date();
      const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);

      // Get all projects owned by user
      const ownedProjectsSnapshot = await ctx.db
        .collection('projects')
        .where('userId', '==', ctx.user.id)
        .get();

      // Get all projects where user is collaborator using collectionGroup query (O(1) instead of O(N))
      const sharedCollabs = await ctx.db
        .collectionGroup('collaborators')
        .where('userId', '==', ctx.user.id)
        .get();

      const sharedProjectRefs = sharedCollabs.docs
        .map((d) => d.ref.parent.parent)
        .filter(Boolean) as FirebaseFirestore.DocumentReference[];

      const sharedProjectDocs = await Promise.all(
        sharedProjectRefs.map((ref) => ref.get())
      );

      // Combine owned and collaborated projects
      const allUserProjects = [
        ...ownedProjectsSnapshot.docs,
        ...sharedProjectDocs.filter((doc) => doc.exists),
      ];

      // Remove duplicates
      const uniqueProjects = Array.from(
        new Map(allUserProjects.map((doc) => [doc.id, doc])).values()
      );

      // Get documents for each project and calculate completion
      let totalDocuments = 0;
      let currentMonthDocuments = 0;
      let completedProjects = 0;

      for (const projectDoc of uniqueProjects) {
        const projectData = projectDoc.data()!;
        const documentsSnapshot = await projectDoc.ref.collection('documents').get();

        totalDocuments += documentsSnapshot.size;

        // Count current month documents
        documentsSnapshot.docs.forEach((docDoc) => {
          const docData = docDoc.data();
          const createdAt = docData.createdAt?.toDate();
          if (createdAt && createdAt >= currentMonthStart) {
            currentMonthDocuments++;
          }
        });

        // Check if project is complete
        const brdDoc = documentsSnapshot.docs.find((d) => d.data().type === 'BRD');
        const prdDoc = documentsSnapshot.docs.find((d) => d.data().type === 'PRD');

        if (projectData.mode === 'UNIFIED') {
          // Unified mode: complete when BRD + PRD approved and at least one TOOL_OUTPUT exists
          const toolOutputDoc = documentsSnapshot.docs.find((d) => d.data().type === 'TOOL_OUTPUT');
          if (
            brdDoc?.data().status === 'APPROVED' &&
            prdDoc?.data().status === 'APPROVED' &&
            toolOutputDoc
          ) {
            completedProjects++;
          }
        } else {
          const finalDocType = projectData.mode === 'PLAIN' ? 'PROMPT_BUILD' : 'TASKS';
          const finalDoc = documentsSnapshot.docs.find((d) => d.data().type === finalDocType);

          // Project is complete if all three required documents are approved
          if (
            brdDoc?.data().status === 'APPROVED' &&
            prdDoc?.data().status === 'APPROVED' &&
            finalDoc?.data().status === 'APPROVED'
          ) {
            completedProjects++;
          }
        }
      }

      const totalProjects = uniqueProjects.length;
      const completionRate =
        totalProjects > 0
          ? Math.round((completedProjects / totalProjects) * 100)
          : 0;

      return {
        totalProjects,
        completedProjects,
        totalDocuments,
        currentMonthDocuments,
        completionRate,
      };
    } catch (error) {
      logger.error({ error, userId: ctx.user.id }, 'Failed to get project stats');
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to fetch project statistics',
      });
    }
  }),
});
