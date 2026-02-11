/**
 * Documents Router (Firestore)
 *
 * tRPC router for document operations:
 * - Get documents by project
 * - Get document by ID
 * - Create document
 * - Approve document
 * - Update document
 * - Export document
 * - Version history management
 */

import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { router, protectedProcedure } from '../lib/trpc/trpc.js';
import {
  getDocumentsByProjectSchema,
  getDocumentByIdSchema,
  createDocumentSchema,
  approveDocumentSchema,
  updateDocumentSchema,
  exportDocumentSchema,
} from '../lib/validations/document.js';
import { admin } from '../lib/firebase.js';
import { logger } from '../lib/logger.js';
import { saveDocumentContent, resolveDocumentContent, isGCSReference } from '../lib/storage.js';

/**
 * Verify project access for document operations
 * @param projectId - Project ID to verify access for
 * @param userId - User ID to check permissions for
 * @param requiredRole - Minimum role required ('VIEWER' or 'EDITOR')
 * @param db - Firestore database instance
 * @param userRole - User's global role (for admin bypass)
 */
async function verifyProjectAccess(
  projectId: string,
  userId: string,
  requiredRole: 'VIEWER' | 'EDITOR',
  db: FirebaseFirestore.Firestore,
  userRole?: 'USER' | 'ADMIN'
): Promise<void> {
  // Admins have access to all projects
  if (userRole === 'ADMIN') {
    return;
  }

  const projectDoc = await db.collection('projects').doc(projectId).get();

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

  // Owner has full access
  if (projectData.userId === userId) {
    return;
  }

  // Check collaborator access
  const collaboratorSnapshot = await projectDoc.ref
    .collection('collaborators')
    .where('userId', '==', userId)
    .get();

  if (collaboratorSnapshot.empty) {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'You do not have access to this project',
    });
  }

  const collaboratorRole = collaboratorSnapshot.docs[0].data().role;

  // If EDITOR is required, VIEWER is not sufficient
  if (requiredRole === 'EDITOR' && collaboratorRole === 'VIEWER') {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'You do not have permission to modify this project',
    });
  }
}

export const documentsRouter = router({
  /**
   * Get documents by project ID
   */
  getByProjectId: protectedProcedure
    .input(getDocumentsByProjectSchema)
    .query(async ({ ctx, input }) => {
      try {
        // Verify project access (owner or collaborator with VIEWER role or higher)
        await verifyProjectAccess(
          input.projectId,
          ctx.user.id,
          'VIEWER',
          ctx.db,
          ctx.user.role
        );

        // Get documents from subcollection
        const projectRef = ctx.db.collection('projects').doc(input.projectId);
        let query = projectRef.collection('documents').orderBy('createdAt', 'desc');

        // Apply type filter if provided
        if (input.type) {
          query = query.where('type', '==', input.type) as any;
        }

        const documentsSnapshot = await query.get();

        const documents = await Promise.all(
          documentsSnapshot.docs.map(async (doc) => {
            const data = doc.data();
            return {
              id: doc.id,
              ...data,
              content: data.content && isGCSReference(data.content)
                ? await resolveDocumentContent(data.content)
                : data.content,
              createdAt: data.createdAt?.toDate(),
              updatedAt: data.updatedAt?.toDate(),
              approvedAt: data.approvedAt?.toDate(),
            };
          })
        );

        return documents;
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        logger.error({ error, projectId: input.projectId, userId: ctx.user.id }, 'Failed to get documents by project');
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch documents',
        });
      }
    }),

  /**
   * Get document by ID
   */
  getById: protectedProcedure
    .input(getDocumentByIdSchema)
    .query(async ({ ctx, input }) => {
      try {
        // Find document using collectionGroup query (O(1) instead of scanning all projects)
        const docsSnapshot = await ctx.db
          .collectionGroup('documents')
          .where('id', '==', input.id)
          .limit(1)
          .get();

        if (docsSnapshot.empty) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Document not found',
          });
        }

        const docSnap = docsSnapshot.docs[0];
        const documentData = docSnap.data();
        const documentId: string = input.id;
        const projectDocId = docSnap.ref.parent.parent?.id;

        if (!projectDocId) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Document not found',
          });
        }

        const projectDoc = await ctx.db.collection('projects').doc(projectDocId).get();
        const projectData = projectDoc.data();

        if (!projectData) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Project not found',
          });
        }

        // Verify project access (owner or collaborator with VIEWER role or higher)
        await verifyProjectAccess(
          projectDocId,
          ctx.user.id,
          'VIEWER',
          ctx.db,
          ctx.user.role
        );

        // Resolve content from GCS if stored externally
        const resolvedContent = documentData.content && isGCSReference(documentData.content)
          ? await resolveDocumentContent(documentData.content)
          : documentData.content;

        return {
          id: documentId,
          ...documentData,
          content: resolvedContent,
          createdAt: documentData.createdAt?.toDate(),
          updatedAt: documentData.updatedAt?.toDate(),
          approvedAt: documentData.approvedAt?.toDate(),
          project: {
            id: projectDocId,
            ...projectData,
            createdAt: projectData.createdAt?.toDate(),
            updatedAt: projectData.updatedAt?.toDate(),
          },
        };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        logger.error({ error, documentId: input.id, userId: ctx.user.id }, 'Failed to get document');
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch document',
        });
      }
    }),

  /**
   * Create document
   */
  create: protectedProcedure
    .input(createDocumentSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        // Verify project access (owner or collaborator with EDITOR role or higher)
        await verifyProjectAccess(
          input.projectId,
          ctx.user.id,
          'EDITOR',
          ctx.db,
          ctx.user.role
        );

        // Create document in subcollection
        const projectRef = ctx.db.collection('projects').doc(input.projectId);
        const documentRef = projectRef.collection('documents').doc();
        const storedContent = await saveDocumentContent(input.projectId, documentRef.id, input.content);

        const documentData = {
          id: documentRef.id,
          projectId: input.projectId,
          type: input.type,
          content: storedContent,
          status: 'DRAFT',
          version: 1,
          approvedAt: null,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        };

        await documentRef.set(documentData);

        // Create audit log
        await ctx.db.collection('auditLogs').add({
          userId: ctx.user.id,
          userName: ctx.user.name,
          action: 'DOCUMENT_CREATED',
          details: {
            documentId: documentRef.id,
            projectId: input.projectId,
            type: input.type,
          },
          ipAddress: ctx.req.ip || ctx.req.socket.remoteAddress || null,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        logger.info({ documentId: documentRef.id, projectId: input.projectId, userId: ctx.user.id }, 'Document created');

        return {
          ...documentData,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        logger.error({ error, projectId: input.projectId, userId: ctx.user.id }, 'Failed to create document');
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create document',
        });
      }
    }),

  /**
   * Approve document and update project phase
   */
  approve: protectedProcedure
    .input(approveDocumentSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        // Direct lookup using projectId (O(1) instead of scanning all projects)
        const projectRef = ctx.db.collection('projects').doc(input.projectId);
        const projectDoc = await projectRef.get();

        if (!projectDoc.exists) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Project not found',
          });
        }

        const projectData = projectDoc.data();
        const documentRef = projectRef.collection('documents').doc(input.id);
        const docSnapshot = await documentRef.get();

        if (!docSnapshot.exists) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Document not found',
          });
        }

        const documentData = docSnapshot.data();

        // Verify project access (owner or collaborator with EDITOR role or higher)
        await verifyProjectAccess(
          input.projectId,
          ctx.user.id,
          'EDITOR',
          ctx.db,
          ctx.user.role
        );

        // Approve document
        await documentRef.update({
          status: 'APPROVED',
          approvedAt: admin.firestore.FieldValue.serverTimestamp(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        // Update project phase to next stage
        const phaseMap: Record<string, string> = {
          BRD: 'PRD_QUESTIONS',
          PRD: projectData.mode === 'TECHNICAL' ? 'TASKS_GENERATING' : 'COMPLETED',
          TASKS: 'COMPLETED',
        };

        const nextPhase = phaseMap[documentData.type];
        if (nextPhase) {
          await projectRef.update({
            currentPhase: nextPhase,
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          });
        }

        // Create audit log
        await ctx.db.collection('auditLogs').add({
          userId: ctx.user.id,
          userName: ctx.user.name,
          action: 'DOCUMENT_APPROVED',
          details: {
            documentId: input.id,
            projectId: documentData.projectId,
            type: documentData.type,
            nextPhase,
          },
          ipAddress: ctx.req.ip || ctx.req.socket.remoteAddress || null,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        logger.info({ documentId: input.id, projectId: documentData.projectId, userId: ctx.user.id }, 'Document approved');

        // Fetch updated document
        const updatedDoc = await documentRef.get();
        const updatedData = updatedDoc.data();

        return {
          id: updatedDoc.id,
          ...updatedData,
          createdAt: updatedData?.createdAt?.toDate(),
          updatedAt: updatedData?.updatedAt?.toDate(),
          approvedAt: updatedData?.approvedAt?.toDate(),
        };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        logger.error({ error, documentId: input.id, userId: ctx.user.id }, 'Failed to approve document');
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to approve document',
        });
      }
    }),

  /**
   * Update document content (manual edit)
   */
  update: protectedProcedure
    .input(updateDocumentSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        // Direct lookup using projectId (O(1) instead of scanning all projects)
        const projectRef = ctx.db.collection('projects').doc(input.projectId);
        const documentRef = projectRef.collection('documents').doc(input.id);
        const docSnapshot = await documentRef.get();

        if (!docSnapshot.exists) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Document not found',
          });
        }

        const documentData = docSnapshot.data();

        // Verify project access (owner or collaborator with EDITOR role or higher)
        await verifyProjectAccess(
          input.projectId,
          ctx.user.id,
          'EDITOR',
          ctx.db,
          ctx.user.role
        );

        // Save current version to history before updating
        await documentRef.collection('versions').add({
          version: documentData.version,
          content: documentData.content,
          status: documentData.status,
          approvedAt: documentData.approvedAt || null,
          createdBy: ctx.user.id,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        // Update document with incremented version and reset to DRAFT
        const storedContent = await saveDocumentContent(documentData.projectId, documentData.id, input.content);
        await documentRef.update({
          content: storedContent,
          version: documentData.version + 1,
          status: 'DRAFT',
          approvedAt: null,
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        // Create audit log
        await ctx.db.collection('auditLogs').add({
          userId: ctx.user.id,
          userName: ctx.user.name,
          action: 'DOCUMENT_UPDATED',
          details: {
            documentId: input.id,
            projectId: documentData.projectId,
            type: documentData.type,
            previousVersion: documentData.version,
            newVersion: documentData.version + 1,
          },
          ipAddress: ctx.req.ip || ctx.req.socket.remoteAddress || null,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        logger.info({ documentId: input.id, projectId: documentData.projectId, userId: ctx.user.id }, 'Document updated');

        // Fetch updated document
        const updatedDoc = await documentRef.get();
        const updatedData = updatedDoc.data();

        return {
          id: updatedDoc.id,
          ...updatedData,
          createdAt: updatedData?.createdAt?.toDate(),
          updatedAt: updatedData?.updatedAt?.toDate(),
          approvedAt: updatedData?.approvedAt?.toDate(),
        };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        logger.error({ error, documentId: input.id, userId: ctx.user.id }, 'Failed to update document');
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to update document',
        });
      }
    }),

  /**
   * Export document (returns formatted content)
   */
  exportDocument: protectedProcedure
    .input(exportDocumentSchema)
    .query(async ({ ctx, input }) => {
      try {
        // Direct lookup using projectId (O(1) instead of scanning all projects)
        const projectRef = ctx.db.collection('projects').doc(input.projectId);
        const projectDoc = await projectRef.get();

        if (!projectDoc.exists) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Project not found',
          });
        }

        const projectData = projectDoc.data();
        const docSnapshot = await projectRef.collection('documents').doc(input.id).get();

        if (!docSnapshot.exists) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Document not found',
          });
        }

        const documentData = docSnapshot.data();

        // Verify project access (owner or collaborator with VIEWER role or higher)
        await verifyProjectAccess(
          input.projectId,
          ctx.user.id,
          'VIEWER',
          ctx.db,
          ctx.user.role
        );

        // Format document with metadata
        const resolvedContent = documentData.content && isGCSReference(documentData.content)
          ? await resolveDocumentContent(documentData.content)
          : documentData.content;
        const createdAt = documentData.createdAt?.toDate() || new Date();
        const metadata = {
          title: `${documentData.type} - ${projectData.title}`,
          date: createdAt.toISOString().split('T')[0],
          version: documentData.version,
          status: documentData.status,
        };

        const formattedContent = `---
title: ${metadata.title}
date: ${metadata.date}
version: ${metadata.version}
status: ${metadata.status}
---

${resolvedContent}`;

        return {
          content: formattedContent,
          filename: `${documentData.type}_${projectData.title.replace(/\s+/g, '_')}_v${documentData.version}.${input.format}`,
          metadata,
        };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        logger.error({ error, documentId: input.id, userId: ctx.user.id }, 'Failed to export document');
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to export document',
        });
      }
    }),

  /**
   * Get version history for a document
   */
  getVersionHistory: protectedProcedure
    .input(z.object({ documentId: z.string(), projectId: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        // Direct lookup using projectId (O(1) instead of scanning all projects)
        const projectRef = ctx.db.collection('projects').doc(input.projectId);
        const documentRef = projectRef.collection('documents').doc(input.documentId);
        const docSnapshot = await documentRef.get();

        if (!docSnapshot.exists) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Document not found',
          });
        }

        const documentData = docSnapshot.data();

        // Verify project access (owner or collaborator with VIEWER role or higher)
        await verifyProjectAccess(
          input.projectId,
          ctx.user.id,
          'VIEWER',
          ctx.db,
          ctx.user.role
        );

        // Get all versions from subcollection
        const versionsSnapshot = await documentRef
          .collection('versions')
          .orderBy('version', 'desc')
          .get();

        // Fetch user data for each version
        const versions = await Promise.all(
          versionsSnapshot.docs.map(async (versionDoc) => {
            const versionData = versionDoc.data();
            const userDoc = await ctx.db.collection('users').doc(versionData.createdBy).get();
            const userData = userDoc.exists ? userDoc.data() : null;

            const resolvedVersionContent = versionData.content && isGCSReference(versionData.content)
              ? await resolveDocumentContent(versionData.content)
              : versionData.content;

            return {
              id: versionDoc.id,
              ...versionData,
              content: resolvedVersionContent,
              createdAt: versionData.createdAt?.toDate(),
              approvedAt: versionData.approvedAt?.toDate(),
              user: userData ? {
                id: userDoc.id,
                name: userData.name,
                email: userData.email,
              } : null,
            };
          })
        );

        return versions;
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        logger.error({ error, documentId: input.documentId, userId: ctx.user.id }, 'Failed to get version history');
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch version history',
        });
      }
    }),

  /**
   * Get specific version content
   */
  getVersion: protectedProcedure
    .input(z.object({ versionId: z.string(), documentId: z.string(), projectId: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        // Direct lookup using projectId (O(1) instead of scanning all projects)
        const projectDocId = input.projectId;
        const projectRef = ctx.db.collection('projects').doc(projectDocId);
        const projectDoc = await projectRef.get();

        if (!projectDoc.exists) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Project not found',
          });
        }

        const projectData = projectDoc.data();
        const documentRef = projectRef.collection('documents').doc(input.documentId);
        const docSnapshot = await documentRef.get();

        if (!docSnapshot.exists) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Document not found',
          });
        }

        const documentData = docSnapshot.data();

        // Get version
        const versionDoc = await documentRef.collection('versions').doc(input.versionId).get();

        if (!versionDoc.exists) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Version not found',
          });
        }

        // Verify project access (owner or collaborator with VIEWER role or higher)
        await verifyProjectAccess(
          projectDocId,
          ctx.user.id,
          'VIEWER',
          ctx.db,
          ctx.user.role
        );

        const versionData = versionDoc.data();
        if (!versionData) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Version not found',
          });
        }

        // Fetch user data
        const userDoc = await ctx.db.collection('users').doc(versionData.createdBy).get();
        const userData = userDoc.exists ? userDoc.data() : null;

        return {
          id: versionDoc.id,
          ...versionData,
          createdAt: versionData.createdAt?.toDate(),
          approvedAt: versionData.approvedAt?.toDate(),
          user: userData ? {
            id: userDoc.id,
            name: userData.name,
            email: userData.email,
          } : null,
          document: {
            id: documentData.id,
            ...documentData,
            createdAt: documentData.createdAt?.toDate(),
            updatedAt: documentData.updatedAt?.toDate(),
            project: {
              id: projectDocId,
              ...projectData,
              createdAt: projectData.createdAt?.toDate(),
              updatedAt: projectData.updatedAt?.toDate(),
            },
          },
        };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        logger.error({ error, versionId: input.versionId, userId: ctx.user.id }, 'Failed to get version');
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch version',
        });
      }
    }),

  /**
   * Restore a previous version
   */
  restoreVersion: protectedProcedure
    .input(z.object({ versionId: z.string(), documentId: z.string(), projectId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        // Direct lookup using projectId (O(1) instead of scanning all projects)
        const projectRef = ctx.db.collection('projects').doc(input.projectId);
        const documentRef = projectRef.collection('documents').doc(input.documentId);
        const docSnapshot = await documentRef.get();

        if (!docSnapshot.exists) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Document not found',
          });
        }

        const documentData = docSnapshot.data();

        // Get version
        const versionDoc = await documentRef.collection('versions').doc(input.versionId).get();

        if (!versionDoc.exists) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Version not found',
          });
        }

        const versionData = versionDoc.data();
        if (!versionData) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Version not found',
          });
        }

        // Verify project access (owner or collaborator with EDITOR role or higher)
        await verifyProjectAccess(
          documentData.projectId,
          ctx.user.id,
          'EDITOR',
          ctx.db,
          ctx.user.role
        );

        // Save current version to history before restoring
        await documentRef.collection('versions').add({
          version: documentData.version,
          content: documentData.content,
          status: documentData.status,
          approvedAt: documentData.approvedAt || null,
          createdBy: ctx.user.id,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        // Restore the old version as current with incremented version number
        await documentRef.update({
          content: versionData.content,
          version: documentData.version + 1,
          status: 'DRAFT',
          approvedAt: null,
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        // Create audit log
        await ctx.db.collection('auditLogs').add({
          userId: ctx.user.id,
          userName: ctx.user.name,
          action: 'DOCUMENT_VERSION_RESTORED',
          details: {
            documentId: input.documentId,
            projectId: documentData.projectId,
            restoredVersion: versionData.version,
            newVersion: documentData.version + 1,
          },
          ipAddress: ctx.req.ip || ctx.req.socket.remoteAddress || null,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        logger.info({ documentId: input.documentId, restoredVersion: versionData.version, userId: ctx.user.id }, 'Document version restored');

        // Fetch updated document
        const updatedDoc = await documentRef.get();
        const updatedData = updatedDoc.data();

        return {
          id: updatedDoc.id,
          ...updatedData,
          createdAt: updatedData?.createdAt?.toDate(),
          updatedAt: updatedData?.updatedAt?.toDate(),
          approvedAt: updatedData?.approvedAt?.toDate(),
        };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        logger.error({ error, versionId: input.versionId, userId: ctx.user.id }, 'Failed to restore version');
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to restore version',
        });
      }
    }),
});
