/**
 * Conversations Router (Firestore)
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
import { admin } from '../lib/firebase.js';
import { logger } from '../lib/logger.js';

export const conversationsRouter = router({
  /**
   * Get conversation by project and document type
   */
  getByProject: protectedProcedure
    .input(getConversationByProjectSchema)
    .query(async ({ ctx, input }) => {
      try {
        // Verify project ownership/access
        const projectRef = ctx.db.collection('projects').doc(input.projectId);
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

        // Check if user owns the project or is a collaborator
        const isOwner = projectData.userId === ctx.user.id;

        if (!isOwner) {
          // Check if user is collaborator
          const collaboratorSnapshot = await projectRef
            .collection('collaborators')
            .where('userId', '==', ctx.user.id)
            .get();

          if (collaboratorSnapshot.empty && ctx.user.role !== 'ADMIN') {
            throw new TRPCError({
              code: 'FORBIDDEN',
              message: 'You do not have permission to access this conversation',
            });
          }
        }

        // Get or create conversation
        // Use documentType as document ID to ensure uniqueness per project/documentType
        const conversationRef = projectRef.collection('conversations').doc(input.documentType);
        const conversationDoc = await conversationRef.get();

        if (!conversationDoc.exists) {
          // Create new conversation
          const newConversationData = {
            id: conversationRef.id,
            projectId: input.projectId,
            documentType: input.documentType,
            messages: [],
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          };

          await conversationRef.set(newConversationData);

          return {
            ...newConversationData,
            id: conversationRef.id,
            createdAt: new Date(),
            updatedAt: new Date(),
          };
        }

        const conversationData = conversationDoc.data();

        return {
          id: conversationDoc.id,
          ...conversationData,
          createdAt: conversationData?.createdAt?.toDate(),
          updatedAt: conversationData?.updatedAt?.toDate(),
        };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        logger.error({ error, projectId: input.projectId, userId: ctx.user.id }, 'Failed to get conversation');
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch conversation',
        });
      }
    }),

  /**
   * Add message to conversation
   */
  addMessage: protectedProcedure
    .input(addMessageSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        // Verify project ownership/access
        const projectRef = ctx.db.collection('projects').doc(input.projectId);
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

        // Check if user owns the project or is a collaborator with EDITOR role
        const isOwner = projectData.userId === ctx.user.id;

        if (!isOwner) {
          // Check if user is collaborator with EDITOR role
          const collaboratorSnapshot = await projectRef
            .collection('collaborators')
            .where('userId', '==', ctx.user.id)
            .get();

          const isEditor = !collaboratorSnapshot.empty &&
            collaboratorSnapshot.docs[0].data().role === 'EDITOR';

          if (!isEditor && ctx.user.role !== 'ADMIN') {
            throw new TRPCError({
              code: 'FORBIDDEN',
              message: 'You do not have permission to add messages to this conversation',
            });
          }
        }

        // Get or create conversation
        const conversationRef = projectRef.collection('conversations').doc(input.documentType);
        const conversationDoc = await conversationRef.get();

        let conversationData: any;

        if (!conversationDoc.exists) {
          // Create new conversation
          conversationData = {
            id: conversationRef.id,
            projectId: input.projectId,
            documentType: input.documentType,
            messages: [],
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          };

          await conversationRef.set(conversationData);
        } else {
          conversationData = conversationDoc.data();
        }

        // Create new message
        const newMessage: Message = {
          role: input.role,
          content: input.content,
          timestamp: new Date().toISOString(),
        };

        // Append message
        const messages = conversationData.messages || [];
        const updatedMessages = [...messages, newMessage];

        // Update conversation
        await conversationRef.update({
          messages: updatedMessages,
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        // Fetch updated conversation
        const updatedDoc = await conversationRef.get();
        const updatedData = updatedDoc.data();

        logger.info({ projectId: input.projectId, documentType: input.documentType, userId: ctx.user.id }, 'Message added to conversation');

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
        logger.error({ error, projectId: input.projectId, userId: ctx.user.id }, 'Failed to add message');
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to add message',
        });
      }
    }),

  /**
   * Update message at specific index
   */
  updateMessage: protectedProcedure
    .input(updateMessageSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        // Find conversation across all projects
        const projectsSnapshot = await ctx.db.collection('projects').get();

        let conversationRef: FirebaseFirestore.DocumentReference | null = null;
        let conversationData: any = null;
        let projectData: any = null;
        let projectDocId: string | null = null;

        for (const projectDoc of projectsSnapshot.docs) {
          const convSnapshot = await projectDoc.ref
            .collection('conversations')
            .doc(input.conversationId)
            .get();

          if (convSnapshot.exists) {
            conversationRef = convSnapshot.ref;
            conversationData = convSnapshot.data();
            projectData = projectDoc.data();
            projectDocId = projectDoc.id;
            break;
          }
        }

        if (!conversationRef || !conversationData || !projectData || !projectDocId) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Conversation not found',
          });
        }

        // Verify ownership/access
        const isOwner = projectData.userId === ctx.user.id;

        if (!isOwner) {
          // Check if user is collaborator with EDITOR role
          const projectRef = ctx.db.collection('projects').doc(projectDocId);
          const collaboratorSnapshot = await projectRef
            .collection('collaborators')
            .where('userId', '==', ctx.user.id)
            .get();

          const isEditor = !collaboratorSnapshot.empty &&
            collaboratorSnapshot.docs[0].data().role === 'EDITOR';

          if (!isEditor && ctx.user.role !== 'ADMIN') {
            throw new TRPCError({
              code: 'FORBIDDEN',
              message: 'You do not have permission to update this conversation',
            });
          }
        }

        // Update message
        const messages = conversationData.messages || [];

        if (input.messageIndex < 0 || input.messageIndex >= messages.length) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Invalid message index',
          });
        }

        messages[input.messageIndex].content = input.content;
        messages[input.messageIndex].timestamp = new Date().toISOString();

        // Update conversation
        await conversationRef.update({
          messages,
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        // Fetch updated conversation
        const updatedDoc = await conversationRef.get();
        const updatedData = updatedDoc.data();

        logger.info({ conversationId: input.conversationId, messageIndex: input.messageIndex, userId: ctx.user.id }, 'Message updated in conversation');

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
        logger.error({ error, conversationId: input.conversationId, userId: ctx.user.id }, 'Failed to update message');
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to update message',
        });
      }
    }),

  /**
   * Clear conversation messages
   */
  clear: protectedProcedure
    .input(clearConversationSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        // Verify project ownership/access
        const projectRef = ctx.db.collection('projects').doc(input.projectId);
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

        // Check if user owns the project or is a collaborator with EDITOR role
        const isOwner = projectData.userId === ctx.user.id;

        if (!isOwner) {
          // Check if user is collaborator with EDITOR role
          const collaboratorSnapshot = await projectRef
            .collection('collaborators')
            .where('userId', '==', ctx.user.id)
            .get();

          const isEditor = !collaboratorSnapshot.empty &&
            collaboratorSnapshot.docs[0].data().role === 'EDITOR';

          if (!isEditor && ctx.user.role !== 'ADMIN') {
            throw new TRPCError({
              code: 'FORBIDDEN',
              message: 'You do not have permission to clear this conversation',
            });
          }
        }

        // Find conversation
        const conversationRef = projectRef.collection('conversations').doc(input.documentType);
        const conversationDoc = await conversationRef.get();

        if (!conversationDoc.exists) {
          return { success: true, message: 'No conversation to clear' };
        }

        // Clear messages
        await conversationRef.update({
          messages: [],
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        // Create audit log
        await ctx.db.collection('auditLogs').add({
          userId: ctx.user.id,
          userName: ctx.user.name,
          action: 'CONVERSATION_CLEARED',
          details: {
            projectId: input.projectId,
            documentType: input.documentType,
          },
          ipAddress: ctx.req.ip || ctx.req.socket.remoteAddress || null,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        logger.info({ projectId: input.projectId, documentType: input.documentType, userId: ctx.user.id }, 'Conversation cleared');

        return { success: true, message: 'Conversation cleared successfully' };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        logger.error({ error, projectId: input.projectId, userId: ctx.user.id }, 'Failed to clear conversation');
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to clear conversation',
        });
      }
    }),
});
