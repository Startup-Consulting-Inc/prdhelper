/**
 * Projects Router
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
import { verifyResourceAccess } from '../lib/utils/authorization.js';
import {
  createProjectSchema,
  updateProjectSchema,
  getProjectByIdSchema,
  updateProjectPhaseSchema,
  getAllProjectsSchema,
} from '../lib/validations/project.js';

export const projectsRouter = router({
  /**
   * Get all user's projects with optional filters
   */
  getAll: protectedProcedure
    .input(getAllProjectsSchema)
    .query(async ({ ctx, input }) => {
      const { status, mode, limit = 50, offset = 0 } = input;

      const where = {
        // Admins can see all projects, regular users only see their own
        ...(ctx.user.role !== 'ADMIN' && { userId: ctx.user.id }),
        ...(status && { status }),
        ...(mode && { mode }),
      };

      const [projects, total] = await Promise.all([
        ctx.prisma.project.findMany({
          where,
          take: limit,
          skip: offset,
          orderBy: { updatedAt: 'desc' },
          include: {
            documents: {
              select: {
                id: true,
                type: true,
                status: true,
                createdAt: true,
              },
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
   * Get project by ID with related data
   */
  getById: protectedProcedure
    .input(getProjectByIdSchema)
    .query(async ({ ctx, input }) => {
      const project = await ctx.prisma.project.findUnique({
        where: { id: input.id },
        include: {
          documents: {
            orderBy: { createdAt: 'desc' },
          },
          conversations: {
            orderBy: { createdAt: 'desc' },
          },
        },
      });

      if (!project) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Project not found',
        });
      }

      // Verify ownership
      verifyResourceAccess(project.userId, ctx.user, 'project');

      return project;
    }),

  /**
   * Create new project
   */
  create: protectedProcedure
    .input(createProjectSchema)
    .mutation(async ({ ctx, input }) => {
      const project = await ctx.prisma.project.create({
        data: {
          userId: ctx.user.id,
          title: input.title,
          description: input.description,
          mode: input.mode,
          status: 'ACTIVE',
          currentPhase: 'BRD_QUESTIONS',
        },
      });

      // Create audit log
      await ctx.prisma.auditLog.create({
        data: {
          userId: ctx.user.id,
          action: 'PROJECT_CREATED',
          details: {
            projectId: project.id,
            title: project.title,
            mode: project.mode,
          },
          ipAddress: ctx.req.ip || ctx.req.socket.remoteAddress || null,
        },
      });

      return project;
    }),

  /**
   * Update project details
   */
  update: protectedProcedure
    .input(updateProjectSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...updateData } = input;

      // Verify ownership
      const project = await ctx.prisma.project.findUnique({
        where: { id },
      });

      if (!project) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Project not found',
        });
      }

      verifyResourceAccess(project.userId, ctx.user, 'project');

      // Update project
      const updatedProject = await ctx.prisma.project.update({
        where: { id },
        data: updateData,
      });

      // Create audit log
      await ctx.prisma.auditLog.create({
        data: {
          userId: ctx.user.id,
          action: 'PROJECT_UPDATED',
          details: {
            projectId: id,
            updates: updateData,
          },
          ipAddress: ctx.req.ip || ctx.req.socket.remoteAddress || null,
        },
      });

      return updatedProject;
    }),

  /**
   * Update project phase
   */
  updatePhase: protectedProcedure
    .input(updateProjectPhaseSchema)
    .mutation(async ({ ctx, input }) => {
      // Verify ownership
      const project = await ctx.prisma.project.findUnique({
        where: { id: input.id },
      });

      if (!project) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Project not found',
        });
      }

      verifyResourceAccess(project.userId, ctx.user, 'project');

      // Update phase
      const updatedProject = await ctx.prisma.project.update({
        where: { id: input.id },
        data: { currentPhase: input.phase },
      });

      // Create audit log
      await ctx.prisma.auditLog.create({
        data: {
          userId: ctx.user.id,
          action: 'PROJECT_PHASE_UPDATED',
          details: {
            projectId: input.id,
            oldPhase: project.currentPhase,
            newPhase: input.phase,
          },
          ipAddress: ctx.req.ip || ctx.req.socket.remoteAddress || null,
        },
      });

      return updatedProject;
    }),

  /**
   * Archive project
   */
  archive: protectedProcedure
    .input(z.object({ id: z.string().cuid() }))
    .mutation(async ({ ctx, input }) => {
      // Verify ownership
      const project = await ctx.prisma.project.findUnique({
        where: { id: input.id },
      });

      if (!project) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Project not found',
        });
      }

      verifyResourceAccess(project.userId, ctx.user, 'project');

      // Archive project
      const archivedProject = await ctx.prisma.project.update({
        where: { id: input.id },
        data: { status: 'ARCHIVED' },
      });

      // Create audit log
      await ctx.prisma.auditLog.create({
        data: {
          userId: ctx.user.id,
          action: 'PROJECT_ARCHIVED',
          details: {
            projectId: input.id,
            title: project.title,
          },
          ipAddress: ctx.req.ip || ctx.req.socket.remoteAddress || null,
        },
      });

      return archivedProject;
    }),

  /**
   * Delete project (cascade deletes documents and conversations)
   */
  delete: protectedProcedure
    .input(z.object({ id: z.string().cuid() }))
    .mutation(async ({ ctx, input }) => {
      // Verify ownership
      const project = await ctx.prisma.project.findUnique({
        where: { id: input.id },
      });

      if (!project) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Project not found',
        });
      }

      verifyResourceAccess(project.userId, ctx.user, 'project');

      // Delete project (cascade deletes related data)
      await ctx.prisma.project.delete({
        where: { id: input.id },
      });

      // Create audit log
      await ctx.prisma.auditLog.create({
        data: {
          userId: ctx.user.id,
          action: 'PROJECT_DELETED',
          details: {
            projectId: input.id,
            title: project.title,
          },
          ipAddress: ctx.req.ip || ctx.req.socket.remoteAddress || null,
        },
      });

      return { success: true, message: 'Project deleted successfully' };
    }),

  /**
   * Get user statistics
   */
  getStats: protectedProcedure.query(async ({ ctx }) => {
    const now = new Date();
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    // Get all projects with their documents to calculate completion based on approved docs
    const [projects, totalDocuments, currentMonthDocuments] = await Promise.all([
      ctx.prisma.project.findMany({
        where: { userId: ctx.user.id },
        include: {
          documents: {
            select: {
              type: true,
              status: true,
            },
          },
        },
      }),
      ctx.prisma.document.count({
        where: { project: { userId: ctx.user.id } },
      }),
      ctx.prisma.document.count({
        where: {
          project: { userId: ctx.user.id },
          createdAt: { gte: currentMonthStart },
        },
      }),
    ]);

    // Calculate completion based on approved documents (same logic as progress calculation)
    const completedProjects = projects.filter((project) => {
      const brdDoc = project.documents.find((d) => d.type === 'BRD');
      const prdDoc = project.documents.find((d) => d.type === 'PRD');
      const finalDoc = project.documents.find((d) =>
        d.type === (project.mode === 'PLAIN' ? 'PROMPT_BUILD' : 'TASKS')
      );

      // Project is complete if all three required documents are approved
      return (
        brdDoc?.status === 'APPROVED' &&
        prdDoc?.status === 'APPROVED' &&
        finalDoc?.status === 'APPROVED'
      );
    }).length;

    const completionRate =
      projects.length > 0
        ? Math.round((completedProjects / projects.length) * 100)
        : 0;

    return {
      totalProjects: projects.length,
      completedProjects,
      totalDocuments,
      currentMonthDocuments,
      completionRate,
    };
  }),
});

