/**
 * Documents Router
 * 
 * tRPC router for document operations:
 * - Get documents by project
 * - Get document by ID
 * - Create document
 * - Approve document
 * - Export document
 */

import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { router, protectedProcedure } from '../lib/trpc/trpc.js';
import { verifyResourceAccess, verifyProjectAccess } from '../lib/utils/authorization.js';
import {
  getDocumentsByProjectSchema,
  getDocumentByIdSchema,
  createDocumentSchema,
  approveDocumentSchema,
  updateDocumentSchema,
  exportDocumentSchema,
} from '../lib/validations/document.js';

export const documentsRouter = router({
  /**
   * Get documents by project ID
   */
  getByProjectId: protectedProcedure
    .input(getDocumentsByProjectSchema)
    .query(async ({ ctx, input }) => {
      // Verify project access (owner or collaborator with VIEWER role or higher)
      await verifyProjectAccess(
        input.projectId,
        ctx.user.id,
        'VIEWER',
        ctx.prisma,
        ctx.user
      );

      // Get documents
      const documents = await ctx.prisma.document.findMany({
        where: {
          projectId: input.projectId,
          ...(input.type && { type: input.type }),
        },
        orderBy: { createdAt: 'desc' },
      });

      return documents;
    }),

  /**
   * Get document by ID
   */
  getById: protectedProcedure
    .input(getDocumentByIdSchema)
    .query(async ({ ctx, input }) => {
      const document = await ctx.prisma.document.findUnique({
        where: { id: input.id },
        include: { project: true },
      });

      if (!document) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Document not found',
        });
      }

      // Verify project access (owner or collaborator with VIEWER role or higher)
      await verifyProjectAccess(
        document.projectId,
        ctx.user.id,
        'VIEWER',
        ctx.prisma,
        ctx.user
      );

      return document;
    }),

  /**
   * Create document
   */
  create: protectedProcedure
    .input(createDocumentSchema)
    .mutation(async ({ ctx, input }) => {
      // Verify project access (owner or collaborator with EDITOR role or higher)
      await verifyProjectAccess(
        input.projectId,
        ctx.user.id,
        'EDITOR',
        ctx.prisma,
        ctx.user
      );

      // Create document
      const document = await ctx.prisma.document.create({
        data: {
          projectId: input.projectId,
          type: input.type,
          content: input.content,
          rawContent: input.rawContent,
          status: 'DRAFT',
          version: 1,
        },
      });

      // Create audit log
      await ctx.prisma.auditLog.create({
        data: {
          userId: ctx.user.id,
          action: 'DOCUMENT_CREATED',
          details: {
            documentId: document.id,
            projectId: input.projectId,
            type: input.type,
          },
          ipAddress: ctx.req.ip || ctx.req.socket.remoteAddress || null,
        },
      });

      return document;
    }),

  /**
   * Approve document and update project phase
   */
  approve: protectedProcedure
    .input(approveDocumentSchema)
    .mutation(async ({ ctx, input }) => {
      const document = await ctx.prisma.document.findUnique({
        where: { id: input.id },
        include: { project: true },
      });

      if (!document) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Document not found',
        });
      }

      // Verify project access (owner or collaborator with EDITOR role or higher)
      await verifyProjectAccess(
        document.projectId,
        ctx.user.id,
        'EDITOR',
        ctx.prisma,
        ctx.user
      );

      // Approve document
      const approvedDocument = await ctx.prisma.document.update({
        where: { id: input.id },
        data: {
          status: 'APPROVED',
          approvedAt: new Date(),
        },
      });

      // Update project phase to next stage
      const phaseMap: Record<string, string> = {
        BRD: 'PRD_QUESTIONS',
        PRD: document.project.mode === 'TECHNICAL' ? 'TASKS_GENERATING' : 'COMPLETED',
        TASKS: 'COMPLETED',
      };

      const nextPhase = phaseMap[document.type];
      if (nextPhase) {
        await ctx.prisma.project.update({
          where: { id: document.projectId },
          data: { currentPhase: nextPhase as any },
        });
      }

      // Create audit log
      await ctx.prisma.auditLog.create({
        data: {
          userId: ctx.user.id,
          action: 'DOCUMENT_APPROVED',
          details: {
            documentId: input.id,
            projectId: document.projectId,
            type: document.type,
            nextPhase,
          },
          ipAddress: ctx.req.ip || ctx.req.socket.remoteAddress || null,
        },
      });

      return approvedDocument;
    }),

  /**
   * Update document content (manual edit)
   */
  update: protectedProcedure
    .input(updateDocumentSchema)
    .mutation(async ({ ctx, input }) => {
      const document = await ctx.prisma.document.findUnique({
        where: { id: input.id },
        include: { project: true },
      });

      if (!document) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Document not found',
        });
      }

      // Verify project access (owner or collaborator with EDITOR role or higher)
      await verifyProjectAccess(
        document.projectId,
        ctx.user.id,
        'EDITOR',
        ctx.prisma,
        ctx.user
      );

      // Save current version to history before updating
      await ctx.prisma.documentVersion.create({
        data: {
          documentId: document.id,
          version: document.version,
          content: document.content,
          rawContent: document.rawContent,
          status: document.status,
          approvedAt: document.approvedAt,
          createdBy: ctx.user.id,
        },
      });

      // Update document with incremented version and reset to DRAFT
      const updatedDocument = await ctx.prisma.document.update({
        where: { id: input.id },
        data: {
          content: input.content,
          rawContent: input.content, // For manual edits, content and rawContent are the same
          version: document.version + 1,
          status: 'DRAFT',
          approvedAt: null,
        },
      });

      // Create audit log
      await ctx.prisma.auditLog.create({
        data: {
          userId: ctx.user.id,
          action: 'DOCUMENT_UPDATED',
          details: {
            documentId: input.id,
            projectId: document.projectId,
            type: document.type,
            previousVersion: document.version,
            newVersion: updatedDocument.version,
          },
          ipAddress: ctx.req.ip || ctx.req.socket.remoteAddress || null,
        },
      });

      return updatedDocument;
    }),

  /**
   * Export document (returns formatted content)
   */
  exportDocument: protectedProcedure
    .input(exportDocumentSchema)
    .query(async ({ ctx, input }) => {
      const document = await ctx.prisma.document.findUnique({
        where: { id: input.id },
        include: { project: true },
      });

      if (!document) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Document not found',
        });
      }

      // Verify project access (owner or collaborator with VIEWER role or higher)
      await verifyProjectAccess(
        document.projectId,
        ctx.user.id,
        'VIEWER',
        ctx.prisma,
        ctx.user
      );

      // Format document with metadata
      const metadata = {
        title: `${document.type} - ${document.project.title}`,
        date: document.createdAt.toISOString().split('T')[0],
        version: document.version,
        status: document.status,
      };

      const formattedContent = `---
title: ${metadata.title}
date: ${metadata.date}
version: ${metadata.version}
status: ${metadata.status}
---

${document.content}`;

      return {
        content: formattedContent,
        filename: `${document.type}_${document.project.title.replace(/\s+/g, '_')}_v${document.version}.${input.format}`,
        metadata,
      };
    }),

  /**
   * Get version history for a document
   */
  getVersionHistory: protectedProcedure
    .input(z.object({ documentId: z.string().cuid() }))
    .query(async ({ ctx, input }) => {
      const document = await ctx.prisma.document.findUnique({
        where: { id: input.documentId },
        include: { project: true },
      });

      if (!document) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Document not found',
        });
      }

      // Verify project access (owner or collaborator with VIEWER role or higher)
      await verifyProjectAccess(
        document.projectId,
        ctx.user.id,
        'VIEWER',
        ctx.prisma,
        ctx.user
      );

      // Get all versions
      const versions = await ctx.prisma.documentVersion.findMany({
        where: { documentId: input.documentId },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: { version: 'desc' },
      });

      return versions;
    }),

  /**
   * Get specific version content
   */
  getVersion: protectedProcedure
    .input(z.object({ versionId: z.string().cuid() }))
    .query(async ({ ctx, input }) => {
      const version = await ctx.prisma.documentVersion.findUnique({
        where: { id: input.versionId },
        include: {
          document: {
            include: { project: true },
          },
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      if (!version) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Version not found',
        });
      }

      // Verify project access (owner or collaborator with VIEWER role or higher)
      await verifyProjectAccess(
        version.document.projectId,
        ctx.user.id,
        'VIEWER',
        ctx.prisma,
        ctx.user
      );

      return version;
    }),

  /**
   * Restore a previous version
   */
  restoreVersion: protectedProcedure
    .input(z.object({ versionId: z.string().cuid() }))
    .mutation(async ({ ctx, input }) => {
      const version = await ctx.prisma.documentVersion.findUnique({
        where: { id: input.versionId },
        include: {
          document: {
            include: { project: true },
          },
        },
      });

      if (!version) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Version not found',
        });
      }

      // Verify project access (owner or collaborator with EDITOR role or higher)
      await verifyProjectAccess(
        version.document.projectId,
        ctx.user.id,
        'EDITOR',
        ctx.prisma,
        ctx.user
      );

      // Save current version to history before restoring
      await ctx.prisma.documentVersion.create({
        data: {
          documentId: version.documentId,
          version: version.document.version,
          content: version.document.content,
          rawContent: version.document.rawContent,
          status: version.document.status,
          approvedAt: version.document.approvedAt,
          createdBy: ctx.user.id,
        },
      });

      // Restore the old version as current with incremented version number
      const restoredDocument = await ctx.prisma.document.update({
        where: { id: version.documentId },
        data: {
          content: version.content,
          rawContent: version.rawContent,
          version: version.document.version + 1,
          status: 'DRAFT',
          approvedAt: null,
        },
      });

      // Create audit log
      await ctx.prisma.auditLog.create({
        data: {
          userId: ctx.user.id,
          action: 'DOCUMENT_VERSION_RESTORED',
          details: {
            documentId: version.documentId,
            projectId: version.document.projectId,
            restoredVersion: version.version,
            newVersion: restoredDocument.version,
          },
          ipAddress: ctx.req.ip || ctx.req.socket.remoteAddress || null,
        },
      });

      return restoredDocument;
    }),
});

