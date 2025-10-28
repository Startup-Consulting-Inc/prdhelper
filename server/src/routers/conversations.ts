/**
 * Conversations Router
 * 
 * tRPC router for conversation operations:
 * - Get conversation by project
 * - Add message to conversation
 * - Update message
 * - Clear conversation
 */

import { TRPCError } from '@trpc/server';
import { router, protectedProcedure } from '../lib/trpc/trpc.js';
import {
  getConversationByProjectSchema,
  addMessageSchema,
  updateMessageSchema,
  clearConversationSchema,
  type Message,
} from '../lib/validations/conversation.js';

export const conversationsRouter = router({
  /**
   * Get conversation by project and document type
   */
  getByProject: protectedProcedure
    .input(getConversationByProjectSchema)
    .query(async ({ ctx, input }) => {
      // Verify project ownership
      const project = await ctx.prisma.project.findUnique({
        where: { id: input.projectId },
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
          message: 'You do not have permission to access this conversation',
        });
      }

      // Get or create conversation
      let conversation = await ctx.prisma.conversation.findUnique({
        where: {
          projectId_documentType: {
            projectId: input.projectId,
            documentType: input.documentType,
          },
        },
      });

      if (!conversation) {
        conversation = await ctx.prisma.conversation.create({
          data: {
            projectId: input.projectId,
            documentType: input.documentType,
            messages: [],
          },
        });
      }

      return conversation;
    }),

  /**
   * Add message to conversation
   */
  addMessage: protectedProcedure
    .input(addMessageSchema)
    .mutation(async ({ ctx, input }) => {
      // Verify project ownership
      const project = await ctx.prisma.project.findUnique({
        where: { id: input.projectId },
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
          message: 'You do not have permission to add messages to this conversation',
        });
      }

      // Get or create conversation
      let conversation = await ctx.prisma.conversation.findUnique({
        where: {
          projectId_documentType: {
            projectId: input.projectId,
            documentType: input.documentType,
          },
        },
      });

      if (!conversation) {
        conversation = await ctx.prisma.conversation.create({
          data: {
            projectId: input.projectId,
            documentType: input.documentType,
            messages: [],
          },
        });
      }

      // Create new message
      const newMessage: Message = {
        role: input.role,
        content: input.content,
        timestamp: new Date().toISOString(),
      };

      // Append message
      const messages = conversation.messages as Message[];
      const updatedMessages = [...messages, newMessage];

      // Update conversation
      const updatedConversation = await ctx.prisma.conversation.update({
        where: { id: conversation.id },
        data: { messages: updatedMessages as any },
      });

      return updatedConversation;
    }),

  /**
   * Update message at specific index
   */
  updateMessage: protectedProcedure
    .input(updateMessageSchema)
    .mutation(async ({ ctx, input }) => {
      const conversation = await ctx.prisma.conversation.findUnique({
        where: { id: input.conversationId },
        include: { project: true },
      });

      if (!conversation) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Conversation not found',
        });
      }

      // Verify ownership
      if (conversation.project.userId !== ctx.user.id) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'You do not have permission to update this conversation',
        });
      }

      // Update message
      const messages = conversation.messages as Message[];
      
      if (input.messageIndex < 0 || input.messageIndex >= messages.length) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Invalid message index',
        });
      }

      messages[input.messageIndex].content = input.content;
      messages[input.messageIndex].timestamp = new Date().toISOString();

      // Update conversation
      const updatedConversation = await ctx.prisma.conversation.update({
        where: { id: input.conversationId },
        data: { messages: messages as any },
      });

      return updatedConversation;
    }),

  /**
   * Clear conversation messages
   */
  clear: protectedProcedure
    .input(clearConversationSchema)
    .mutation(async ({ ctx, input }) => {
      // Verify project ownership
      const project = await ctx.prisma.project.findUnique({
        where: { id: input.projectId },
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
          message: 'You do not have permission to clear this conversation',
        });
      }

      // Find conversation
      const conversation = await ctx.prisma.conversation.findUnique({
        where: {
          projectId_documentType: {
            projectId: input.projectId,
            documentType: input.documentType,
          },
        },
      });

      if (!conversation) {
        return { success: true, message: 'No conversation to clear' };
      }

      // Clear messages
      await ctx.prisma.conversation.update({
        where: { id: conversation.id },
        data: { messages: [] },
      });

      // Create audit log
      await ctx.prisma.auditLog.create({
        data: {
          userId: ctx.user.id,
          action: 'CONVERSATION_CLEARED',
          details: {
            projectId: input.projectId,
            documentType: input.documentType,
          },
          ipAddress: ctx.req.ip || ctx.req.socket.remoteAddress || null,
        },
      });

      return { success: true, message: 'Conversation cleared successfully' };
    }),
});

