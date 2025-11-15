/**
 * Collaborators Router
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

export const collaboratorsRouter = router({
  /**
   * Invite a collaborator to a project
   * Supports both email and userId invitation
   */
  invite: protectedProcedure
    .input(inviteCollaboratorSchema)
    .mutation(async ({ ctx, input }) => {
      const { projectId, email, userId, role } = input;

      // Verify project ownership
      const project = await ctx.prisma.project.findUnique({
        where: { id: projectId },
      });

      if (!project) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Project not found',
        });
      }

      if (project.userId !== ctx.user.id) {
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
        const user = await ctx.prisma.user.findUnique({
          where: { id: userId },
        });

        if (!user) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'User not found',
          });
        }

        if (user.id === ctx.user.id) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Cannot invite yourself',
          });
        }

        invitedUserId = user.id;
        invitedEmail = user.email;
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
        const existingUser = await ctx.prisma.user.findUnique({
          where: { email: invitedEmail },
        });

        if (existingUser) {
          invitedUserId = existingUser.id;
        }
      } else {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Either email or userId must be provided',
        });
      }

      // Check if user is already a collaborator
      if (invitedUserId) {
        const existingCollaborator = await ctx.prisma.projectCollaborator.findUnique({
          where: {
            projectId_userId: {
              projectId,
              userId: invitedUserId,
            },
          },
        });

        if (existingCollaborator) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'User is already a collaborator on this project',
          });
        }
      }

      // Check for existing pending invite
      const existingInvite = await ctx.prisma.projectInvite.findFirst({
        where: {
          projectId,
          invitedEmail,
          status: 'PENDING',
        },
      });

      if (existingInvite) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'An invitation has already been sent to this user',
        });
      }

      // Create invite (expires in 7 days)
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);

      const invite = await ctx.prisma.projectInvite.create({
        data: {
          projectId,
          invitedEmail,
          invitedUserId,
          inviterId: ctx.user.id,
          role,
          expiresAt,
        },
        include: {
          project: {
            select: {
              id: true,
              title: true,
            },
          },
          inviter: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      // TODO: Send email notification (if email service configured)
      // await sendInviteEmail(invitedEmail, invite);

      // Create audit log
      await ctx.prisma.auditLog.create({
        data: {
          userId: ctx.user.id,
          action: 'COLLABORATOR_INVITED',
          details: {
            projectId,
            invitedEmail,
            role,
          },
          ipAddress: ctx.req.ip || ctx.req.socket.remoteAddress || null,
        },
      });

      return invite;
    }),

  /**
   * Accept a collaboration invitation
   */
  accept: protectedProcedure
    .input(acceptInviteSchema)
    .mutation(async ({ ctx, input }) => {
      const invite = await ctx.prisma.projectInvite.findUnique({
        where: { token: input.token },
        include: {
          project: true,
        },
      });

      if (!invite) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Invitation not found',
        });
      }

      // Verify the invite is for the current user
      if (invite.invitedEmail !== ctx.user.email) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'This invitation is not for you',
        });
      }

      // Check if already accepted
      if (invite.status !== 'PENDING') {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `Invitation has already been ${invite.status.toLowerCase()}`,
        });
      }

      // Check if expired
      if (new Date() > invite.expiresAt) {
        await ctx.prisma.projectInvite.update({
          where: { id: invite.id },
          data: { status: 'EXPIRED' },
        });

        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Invitation has expired',
        });
      }

      // Create collaborator and update invite status in a transaction
      const [collaborator] = await ctx.prisma.$transaction([
        ctx.prisma.projectCollaborator.create({
          data: {
            projectId: invite.projectId,
            userId: ctx.user.id,
            role: invite.role,
            invitedBy: invite.inviterId,
            invitedAt: invite.createdAt,
          },
          include: {
            project: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        }),
        ctx.prisma.projectInvite.update({
          where: { id: invite.id },
          data: { status: 'ACCEPTED' },
        }),
      ]);

      // Create audit log
      await ctx.prisma.auditLog.create({
        data: {
          userId: ctx.user.id,
          action: 'COLLABORATOR_ACCEPTED',
          details: {
            projectId: invite.projectId,
            role: invite.role,
          },
          ipAddress: ctx.req.ip || ctx.req.socket.remoteAddress || null,
        },
      });

      return collaborator;
    }),

  /**
   * Reject a collaboration invitation
   */
  reject: protectedProcedure
    .input(rejectInviteSchema)
    .mutation(async ({ ctx, input }) => {
      const invite = await ctx.prisma.projectInvite.findUnique({
        where: { id: input.inviteId },
      });

      if (!invite) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Invitation not found',
        });
      }

      // Verify the invite is for the current user
      if (invite.invitedEmail !== ctx.user.email && invite.invitedUserId !== ctx.user.id) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'This invitation is not for you',
        });
      }

      // Check if already rejected
      if (invite.status !== 'PENDING') {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `Invitation has already been ${invite.status.toLowerCase()}`,
        });
      }

      // Update invite status
      await ctx.prisma.projectInvite.update({
        where: { id: input.inviteId },
        data: { status: 'REJECTED' },
      });

      // Create audit log
      await ctx.prisma.auditLog.create({
        data: {
          userId: ctx.user.id,
          action: 'COLLABORATOR_REJECTED',
          details: {
            projectId: invite.projectId,
          },
          ipAddress: ctx.req.ip || ctx.req.socket.remoteAddress || null,
        },
      });

      return { success: true, message: 'Invitation rejected' };
    }),

  /**
   * Remove a collaborator from a project
   */
  remove: protectedProcedure
    .input(removeCollaboratorSchema)
    .mutation(async ({ ctx, input }) => {
      const { projectId, collaboratorId } = input;

      // Verify project ownership
      const project = await ctx.prisma.project.findUnique({
        where: { id: projectId },
      });

      if (!project) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Project not found',
        });
      }

      if (project.userId !== ctx.user.id) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Only project owner can remove collaborators',
        });
      }

      // Find and delete collaborator
      const collaborator = await ctx.prisma.projectCollaborator.findUnique({
        where: { id: collaboratorId },
      });

      if (!collaborator) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Collaborator not found',
        });
      }

      if (collaborator.projectId !== projectId) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Collaborator does not belong to this project',
        });
      }

      await ctx.prisma.projectCollaborator.delete({
        where: { id: collaboratorId },
      });

      // Create audit log
      await ctx.prisma.auditLog.create({
        data: {
          userId: ctx.user.id,
          action: 'COLLABORATOR_REMOVED',
          details: {
            projectId,
            collaboratorId,
          },
          ipAddress: ctx.req.ip || ctx.req.socket.remoteAddress || null,
        },
      });

      return { success: true, message: 'Collaborator removed' };
    }),

  /**
   * Update a collaborator's role
   */
  updateRole: protectedProcedure
    .input(updateCollaboratorRoleSchema)
    .mutation(async ({ ctx, input }) => {
      const { projectId, collaboratorId, role } = input;

      // Verify project ownership
      const project = await ctx.prisma.project.findUnique({
        where: { id: projectId },
      });

      if (!project) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Project not found',
        });
      }

      if (project.userId !== ctx.user.id) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Only project owner can update collaborator roles',
        });
      }

      // Find and update collaborator
      const collaborator = await ctx.prisma.projectCollaborator.findUnique({
        where: { id: collaboratorId },
      });

      if (!collaborator) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Collaborator not found',
        });
      }

      if (collaborator.projectId !== projectId) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Collaborator does not belong to this project',
        });
      }

      const updatedCollaborator = await ctx.prisma.projectCollaborator.update({
        where: { id: collaboratorId },
        data: { role },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      // Create audit log
      await ctx.prisma.auditLog.create({
        data: {
          userId: ctx.user.id,
          action: 'COLLABORATOR_ROLE_UPDATED',
          details: {
            projectId,
            collaboratorId,
            oldRole: collaborator.role,
            newRole: role,
          },
          ipAddress: ctx.req.ip || ctx.req.socket.remoteAddress || null,
        },
      });

      return updatedCollaborator;
    }),

  /**
   * Get all collaborators for a project
   */
  getByProject: protectedProcedure
    .input(getProjectCollaboratorsSchema)
    .query(async ({ ctx, input }) => {
      const { projectId } = input;

      // Verify access to project (owner or collaborator)
      const project = await ctx.prisma.project.findUnique({
        where: { id: projectId },
        include: {
          collaborators: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  image: true,
                },
              },
              inviter: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
            orderBy: { acceptedAt: 'asc' },
          },
        },
      });

      if (!project) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Project not found',
        });
      }

      // Check if user is owner or collaborator
      const isOwner = project.userId === ctx.user.id;
      const isCollaborator = project.collaborators.some((c) => c.userId === ctx.user.id);

      if (!isOwner && !isCollaborator) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'You do not have access to this project',
        });
      }

      return project.collaborators;
    }),

  /**
   * Get pending invitations for the current user
   */
  getPendingInvites: protectedProcedure
    .input(getPendingInvitesSchema)
    .query(async ({ ctx, input }) => {
      const { limit = 20, offset = 0 } = input;

      const [invites, total] = await Promise.all([
        ctx.prisma.projectInvite.findMany({
          where: {
            invitedEmail: ctx.user.email,
            status: 'PENDING',
            expiresAt: {
              gt: new Date(), // Only non-expired invites
            },
          },
          include: {
            project: {
              select: {
                id: true,
                title: true,
                description: true,
                mode: true,
              },
            },
            inviter: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: limit,
          skip: offset,
        }),
        ctx.prisma.projectInvite.count({
          where: {
            invitedEmail: ctx.user.email,
            status: 'PENDING',
            expiresAt: {
              gt: new Date(),
            },
          },
        }),
      ]);

      return {
        invites,
        total,
        hasMore: offset + invites.length < total,
      };
    }),

  /**
   * Search users for collaboration (autocomplete)
   * Excludes current collaborators and project owner
   */
  searchUsers: protectedProcedure
    .input(searchUsersSchema)
    .query(async ({ ctx, input }) => {
      const { query, projectId, limit = 10 } = input;

      // Verify access to project
      const project = await ctx.prisma.project.findUnique({
        where: { id: projectId },
        include: {
          collaborators: {
            select: { userId: true },
          },
        },
      });

      if (!project) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Project not found',
        });
      }

      // Only owner can search for users to invite
      if (project.userId !== ctx.user.id) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Only project owner can invite collaborators',
        });
      }

      // Get list of user IDs to exclude (owner + current collaborators)
      const excludeUserIds = [
        project.userId,
        ...project.collaborators.map((c) => c.userId),
      ];

      // Search users by name or email
      const users = await ctx.prisma.user.findMany({
        where: {
          AND: [
            {
              id: {
                notIn: excludeUserIds,
              },
            },
            {
              OR: [
                {
                  name: {
                    contains: query,
                    mode: 'insensitive',
                  },
                },
                {
                  email: {
                    contains: query,
                    mode: 'insensitive',
                  },
                },
              ],
            },
          ],
        },
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
        take: limit,
      });

      return users;
    }),
});
