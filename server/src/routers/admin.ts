/**
 * Admin Router
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

export const adminRouter = router({
  /**
   * Get all system prompts
   */
  getSystemPrompts: adminProcedure.query(async ({ ctx }) => {
    const prompts = await ctx.prisma.systemPrompt.findMany({
      orderBy: { type: 'asc' },
    });
    return prompts;
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
      const { id, ...updateData } = input;

      // Get current prompt for version history
      const currentPrompt = await ctx.prisma.systemPrompt.findUnique({
        where: { id },
      });

      if (!currentPrompt) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Prompt not found' });
      }

      // Get latest version number
      const latestVersion = await ctx.prisma.promptVersion.findFirst({
        where: { promptId: id },
        orderBy: { version: 'desc' },
        select: { version: true },
      });

      // Create version history before updating
      await ctx.prisma.promptVersion.create({
        data: {
          promptId: id,
          prompt: currentPrompt.prompt,
          version: (latestVersion?.version || 0) + 1,
          createdBy: ctx.user.id,
        },
      });

      const updatedPrompt = await ctx.prisma.systemPrompt.update({
        where: { id },
        data: updateData,
      });

      // Create audit log
      await ctx.prisma.auditLog.create({
        data: {
          userId: ctx.user.id,
          action: 'SYSTEM_PROMPT_UPDATED',
          details: {
            promptId: id,
            type: updatedPrompt.type,
            changes: updateData,
          },
          ipAddress: ctx.req.ip || ctx.req.socket.remoteAddress || null,
        },
      });

      return updatedPrompt;
    }),

  /**
   * Delete system prompt
   */
  deleteSystemPrompt: adminProcedure
    .input(z.object({ id: z.string().min(1, 'Prompt ID is required') }))
    .mutation(async ({ ctx, input }) => {
      const prompt = await ctx.prisma.systemPrompt.findUnique({
        where: { id: input.id },
      });

      if (!prompt) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Prompt not found' });
      }

      await ctx.prisma.systemPrompt.delete({
        where: { id: input.id },
      });

      // Create audit log
      await ctx.prisma.auditLog.create({
        data: {
          userId: ctx.user.id,
          action: 'SYSTEM_PROMPT_DELETED',
          details: {
            promptId: input.id,
            type: prompt.type,
          },
          ipAddress: ctx.req.ip || ctx.req.socket.remoteAddress || null,
        },
      });

      return { success: true, message: 'Prompt deleted successfully' };
    }),

  /**
   * Get prompt version history
   */
  getPromptVersionHistory: adminProcedure
    .input(z.object({ promptId: z.string().min(1, 'Prompt ID is required') }))
    .query(async ({ ctx, input }) => {
      const versions = await ctx.prisma.promptVersion.findMany({
        where: { promptId: input.promptId },
        orderBy: { version: 'desc' },
        include: {
          creator: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      return versions;
    }),

  /**
   * Restore prompt version
   */
  restorePromptVersion: adminProcedure
    .input(z.object({ versionId: z.string().cuid() }))
    .mutation(async ({ ctx, input }) => {
      const version = await ctx.prisma.promptVersion.findUnique({
        where: { id: input.versionId },
        include: { systemPrompt: true },
      });

      if (!version) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Version not found' });
      }

      // Get latest version number
      const latestVersion = await ctx.prisma.promptVersion.findFirst({
        where: { promptId: version.promptId },
        orderBy: { version: 'desc' },
        select: { version: true },
      });

      // Create version history of current state before restoring
      await ctx.prisma.promptVersion.create({
        data: {
          promptId: version.promptId,
          prompt: version.systemPrompt.prompt,
          version: (latestVersion?.version || 0) + 1,
          createdBy: ctx.user.id,
        },
      });

      // Restore the version
      const updatedPrompt = await ctx.prisma.systemPrompt.update({
        where: { id: version.promptId },
        data: { prompt: version.prompt },
      });

      // Create audit log
      await ctx.prisma.auditLog.create({
        data: {
          userId: ctx.user.id,
          action: 'SYSTEM_PROMPT_RESTORED',
          details: {
            promptId: version.promptId,
            versionId: input.versionId,
            version: version.version,
          },
          ipAddress: ctx.req.ip || ctx.req.socket.remoteAddress || null,
        },
      });

      return updatedPrompt;
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
      const { limit = 50, offset = 0 } = input;

      const [users, total] = await Promise.all([
        ctx.prisma.user.findMany({
          take: limit,
          skip: offset,
          orderBy: { createdAt: 'desc' },
          include: {
            _count: {
              select: { projects: true },
            },
          },
        }),
        ctx.prisma.user.count(),
      ]);

      // Remove password from response
      const safeUsers = users.map(({ password, ...user }) => ({
        ...user,
        projectCount: user._count.projects,
      }));

      return {
        users: safeUsers,
        total,
        hasMore: offset + users.length < total,
      };
    }),

  /**
   * Update user role
   */
  updateUserRole: adminProcedure
    .input(
      z.object({
        userId: z.string().cuid(),
        role: z.enum(['USER', 'ADMIN']),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const updatedUser = await ctx.prisma.user.update({
        where: { id: input.userId },
        data: { role: input.role },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
        },
      });

      // Create audit log
      await ctx.prisma.auditLog.create({
        data: {
          userId: ctx.user.id,
          action: 'USER_ROLE_UPDATED',
          details: {
            targetUserId: input.userId,
            newRole: input.role,
          },
          ipAddress: ctx.req.ip || ctx.req.socket.remoteAddress || null,
        },
      });

      return updatedUser;
    }),

  /**
   * Delete user (admin only, with safeguards)
   */
  deleteUser: adminProcedure
    .input(z.object({ userId: z.string().cuid() }))
    .mutation(async ({ ctx, input }) => {
      // Prevent self-deletion
      if (input.userId === ctx.user.id) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Cannot delete your own account',
        });
      }

      // Delete user (cascade deletes projects, documents, etc.)
      await ctx.prisma.user.delete({
        where: { id: input.userId },
      });

      // Create audit log
      await ctx.prisma.auditLog.create({
        data: {
          userId: ctx.user.id,
          action: 'USER_DELETED_BY_ADMIN',
          details: {
            deletedUserId: input.userId,
          },
          ipAddress: ctx.req.ip || ctx.req.socket.remoteAddress || null,
        },
      });

      return { success: true, message: 'User deleted successfully' };
    }),

  /**
   * Get audit logs with filters
   */
  getAuditLogs: adminProcedure
    .input(
      z.object({
        userId: z.string().cuid().optional(),
        action: z.string().optional(),
        startDate: z.string().datetime().optional(),
        endDate: z.string().datetime().optional(),
        limit: z.number().min(1).max(100).default(50).optional(),
        offset: z.number().min(0).default(0).optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { userId, action, startDate, endDate, limit = 50, offset = 0 } = input;

      const where = {
        ...(userId && { userId }),
        ...(action && { action }),
        ...(startDate || endDate
          ? {
              createdAt: {
                ...(startDate && { gte: new Date(startDate) }),
                ...(endDate && { lte: new Date(endDate) }),
              },
            }
          : {}),
      };

      const [logs, total] = await Promise.all([
        ctx.prisma.auditLog.findMany({
          where,
          take: limit,
          skip: offset,
          orderBy: { createdAt: 'desc' },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        }),
        ctx.prisma.auditLog.count({ where }),
      ]);

      return {
        logs,
        total,
        hasMore: offset + logs.length < total,
      };
    }),

  /**
   * Get system statistics
   */
  getSystemStats: adminProcedure.query(async ({ ctx }) => {
    const [
      totalUsers,
      totalProjects,
      activeProjects,
      totalDocuments,
      approvedDocuments,
      totalTokenUsage,
      totalCost,
    ] = await Promise.all([
      ctx.prisma.user.count(),
      ctx.prisma.project.count(),
      ctx.prisma.project.count({ where: { status: 'ACTIVE' } }),
      ctx.prisma.document.count(),
      ctx.prisma.document.count({ where: { status: 'APPROVED' } }),
      ctx.prisma.tokenUsage.aggregate({ _sum: { tokensUsed: true } }),
      ctx.prisma.tokenUsage.aggregate({ _sum: { cost: true } }),
    ]);

    return {
      totalUsers,
      totalProjects,
      activeProjects,
      totalDocuments,
      approvedDocuments,
      approvalRate:
        totalDocuments > 0
          ? Math.round((approvedDocuments / totalDocuments) * 100)
          : 0,
      totalTokensUsed: totalTokenUsage._sum.tokensUsed || 0,
      totalCost: totalCost._sum.cost || 0,
    };
  }),

  /**
   * Get all projects with user info (admin view)
   */
  getAllProjects: adminProcedure
    .input(
      z.object({
        userId: z.string().cuid().optional(),
        status: z.enum(['ACTIVE', 'COMPLETED', 'ARCHIVED']).optional(),
        limit: z.number().min(1).max(100).default(50).optional(),
        offset: z.number().min(0).default(0).optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { userId, status, limit = 50, offset = 0 } = input;

      const where = {
        ...(userId && { userId }),
        ...(status && { status }),
      };

      const [projects, total] = await Promise.all([
        ctx.prisma.project.findMany({
          where,
          take: limit,
          skip: offset,
          orderBy: { createdAt: 'desc' },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            _count: {
              select: { documents: true },
            },
          },
        }),
        ctx.prisma.project.count({ where }),
      ]);

      return {
        projects,
        total,
        hasMore: offset + projects.length < total,
      };
    }),

  /**
   * Delete project (admin only)
   */
  deleteProject: adminProcedure
    .input(z.object({ projectId: z.string().cuid() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.project.delete({
        where: { id: input.projectId },
      });

      // Create audit log
      await ctx.prisma.auditLog.create({
        data: {
          userId: ctx.user.id,
          action: 'PROJECT_DELETED_BY_ADMIN',
          details: {
            projectId: input.projectId,
          },
          ipAddress: ctx.req.ip || ctx.req.socket.remoteAddress || null,
        },
      });

      return { success: true, message: 'Project deleted successfully' };
    }),

  /**
   * Get all documents with filters (admin view)
   */
  getAllDocuments: adminProcedure
    .input(
      z.object({
        projectId: z.string().cuid().optional(),
        userId: z.string().cuid().optional(),
        type: z.enum(['BRD', 'PRD', 'PROMPT_BUILD', 'TASKS']).optional(),
        status: z.enum(['DRAFT', 'APPROVED']).optional(),
        limit: z.number().min(1).max(100).default(50).optional(),
        offset: z.number().min(0).default(0).optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { projectId, userId, type, status, limit = 50, offset = 0 } = input;

      const where: any = {
        ...(projectId && { projectId }),
        ...(type && { type }),
        ...(status && { status }),
      };

      // If userId filter is provided, filter by project owner
      if (userId) {
        where.project = { userId };
      }

      const [documents, total] = await Promise.all([
        ctx.prisma.document.findMany({
          where,
          take: limit,
          skip: offset,
          orderBy: { createdAt: 'desc' },
          include: {
            project: {
              select: {
                id: true,
                title: true,
                user: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                  },
                },
              },
            },
          },
        }),
        ctx.prisma.document.count({ where }),
      ]);

      return {
        documents,
        total,
        hasMore: offset + documents.length < total,
      };
    }),

  /**
   * Delete document (admin only)
   */
  deleteDocument: adminProcedure
    .input(z.object({ documentId: z.string().cuid() }))
    .mutation(async ({ ctx, input }) => {
      // Get document info before deletion for audit log
      const document = await ctx.prisma.document.findUnique({
        where: { id: input.documentId },
        select: {
          id: true,
          type: true,
          projectId: true,
          version: true,
        },
      });

      if (!document) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Document not found',
        });
      }

      // Delete document
      await ctx.prisma.document.delete({
        where: { id: input.documentId },
      });

      // Create audit log
      await ctx.prisma.auditLog.create({
        data: {
          userId: ctx.user.id,
          action: 'DOCUMENT_DELETED_BY_ADMIN',
          details: {
            documentId: document.id,
            documentType: document.type,
            documentVersion: document.version,
            projectId: document.projectId,
          },
          ipAddress: ctx.req.ip || ctx.req.socket.remoteAddress || null,
        },
      });

      return { success: true, message: 'Document deleted successfully' };
    }),

  /**
   * Get token usage data with filters
   */
  getTokenUsage: adminProcedure
    .input(
      z.object({
        userId: z.string().cuid().optional(),
        projectId: z.string().cuid().optional(),
        operation: z.string().optional(),
        startDate: z.string().datetime().optional(),
        endDate: z.string().datetime().optional(),
        limit: z.number().min(1).max(100).default(50).optional(),
        offset: z.number().min(0).default(0).optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { userId, projectId, operation, startDate, endDate, limit = 50, offset = 0 } = input;

      const where = {
        ...(userId && { userId }),
        ...(projectId && { projectId }),
        ...(operation && { operation }),
        ...(startDate || endDate
          ? {
              createdAt: {
                ...(startDate && { gte: new Date(startDate) }),
                ...(endDate && { lte: new Date(endDate) }),
              },
            }
          : {}),
      };

      const [usage, total] = await Promise.all([
        ctx.prisma.tokenUsage.findMany({
          where,
          take: limit,
          skip: offset,
          orderBy: { createdAt: 'desc' },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            project: {
              select: {
                id: true,
                title: true,
              },
            },
          },
        }),
        ctx.prisma.tokenUsage.count({ where }),
      ]);

      return {
        usage,
        total,
        hasMore: offset + usage.length < total,
      };
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
      const { startDate, endDate } = input;

      const where = {
        ...(startDate || endDate
          ? {
              createdAt: {
                ...(startDate && { gte: new Date(startDate) }),
                ...(endDate && { lte: new Date(endDate) }),
              },
            }
          : {}),
      };

      // Aggregate stats
      const [totalStats, byOperation, byUser, byModel] = await Promise.all([
        ctx.prisma.tokenUsage.aggregate({
          where,
          _sum: { tokensUsed: true, cost: true },
          _count: true,
        }),
        ctx.prisma.tokenUsage.groupBy({
          by: ['operation'],
          where,
          _sum: { tokensUsed: true, cost: true },
          _count: true,
        }),
        ctx.prisma.tokenUsage.groupBy({
          by: ['userId'],
          where,
          _sum: { tokensUsed: true, cost: true },
          _count: true,
          orderBy: { _sum: { tokensUsed: 'desc' } },
          take: 10,
        }),
        ctx.prisma.tokenUsage.groupBy({
          by: ['model'],
          where,
          _sum: { tokensUsed: true, cost: true },
          _count: true,
        }),
      ]);

      // Get user details for top users
      const userIds = byUser.map((u) => u.userId);
      const users = await ctx.prisma.user.findMany({
        where: { id: { in: userIds } },
        select: { id: true, name: true, email: true },
      });

      const topUsers = byUser.map((u) => {
        const user = users.find((usr) => usr.id === u.userId);
        return {
          userId: u.userId,
          userName: user?.name || 'Unknown',
          userEmail: user?.email || '',
          tokensUsed: u._sum.tokensUsed || 0,
          cost: u._sum.cost || 0,
          requests: u._count,
        };
      });

      return {
        total: {
          tokensUsed: totalStats._sum.tokensUsed || 0,
          cost: totalStats._sum.cost || 0,
          requests: totalStats._count,
        },
        byOperation: byOperation.map((o) => ({
          operation: o.operation,
          tokensUsed: o._sum.tokensUsed || 0,
          cost: o._sum.cost || 0,
          requests: o._count,
        })),
        topUsers,
        byModel: byModel.map((m) => ({
          model: m.model,
          tokensUsed: m._sum.tokensUsed || 0,
          cost: m._sum.cost || 0,
          requests: m._count,
        })),
      };
    }),
});
