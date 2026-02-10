/**
 * AI Router (Firestore)
 *
 * tRPC router for AI-powered operations:
 * - Ask questions in wizard
 * - Generate documents (BRD, PRD, Tasks)
 * - Regenerate with additional context
 */

import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { router, protectedProcedure } from '../lib/trpc/trpc.js';
import { generateCompletion, type ChatMessage } from '../lib/services/ai.js';
import {
  generateBRD,
  generatePRD,
  generateTasks,
  generatePromptBuild,
  generateKickoffPrompt,
  generateToolOutput,
} from '../lib/services/documentGenerator.js';
import { trackTokenUsage } from '../lib/services/tokenTracker.js';
import type { Message } from '../lib/validations/conversation.js';
import {
  explanationCache,
  hashExplanation,
  type ExplanationResponse,
} from '../lib/utils/cache.js';
import { admin } from '../lib/firebase.js';
import { logger } from '../lib/logger.js';
import {
  detectLanguage,
  getLanguageInstruction,
  type SupportedLanguage,
} from '../lib/utils/languageDetector.js';

export const aiRouter = router({
  /**
   * Ask next question in wizard based on conversation history
   */
  askQuestion: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        documentType: z.enum(['BRD', 'PRD']),
        userAnswer: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        // Verify project ownership
        const projectRef = ctx.db.collection('projects').doc(input.projectId);
        const projectDoc = await projectRef.get();

        if (!projectDoc.exists) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Project not found',
          });
        }

        const project = projectDoc.data();

        if (project?.userId !== ctx.user.id) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'You do not have permission to access this project',
          });
        }

        // Get or create conversation using documentType as document ID
        const conversationRef = projectRef.collection('conversations').doc(input.documentType);
        const conversationDoc = await conversationRef.get();

        let messages: Message[] = [];

        if (!conversationDoc.exists) {
          // Create new conversation
          await conversationRef.set({
            id: conversationRef.id,
            projectId: input.projectId,
            documentType: input.documentType,
            messages: [],
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          });
        } else {
          messages = (conversationDoc.data()?.messages as Message[]) || [];
        }

        // Add user answer if provided
        if (input.userAnswer) {
          messages.push({
            role: 'user',
            content: input.userAnswer,
            timestamp: new Date().toISOString(),
          });

          await conversationRef.update({
            messages,
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          });
        }

        // Get system prompt
        // UNIFIED mode uses TECHNICAL prompts (most comprehensive)
        const isPlainMode = project?.mode === 'PLAIN';
        const promptType =
          input.documentType === 'BRD'
            ? isPlainMode ? 'BRD_PLAIN' : 'BRD_TECHNICAL'
            : isPlainMode ? 'PRD_PLAIN' : 'PRD_TECHNICAL';

        const systemPromptSnapshot = await ctx.db
          .collection('systemPrompts')
          .where('type', '==', promptType)
          .limit(1)
          .get();

        if (systemPromptSnapshot.empty) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'System prompt not found',
          });
        }

        const systemPromptData = systemPromptSnapshot.docs[0].data();

        if (!systemPromptData.isActive) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'System prompt is inactive',
          });
        }

        // Use stored language preference, fall back to auto-detection for 'auto' or missing
        const projectLanguage = project?.language as SupportedLanguage | 'auto' | undefined;
        const detectedLanguage: SupportedLanguage =
          projectLanguage && projectLanguage !== 'auto'
            ? projectLanguage
            : detectLanguage(`${project?.title || ''} ${project?.description || ''}`);
        const languageInstruction = getLanguageInstruction(detectedLanguage);

        // Build context for AI
        let contextInfo = `\n\n### Project Context\n\n**Project Title:** ${project?.title}\n**Project Description:** ${project?.description}`;

        // Add language requirement to ensure AI responds in the correct language
        contextInfo += `\n\n### Language Requirement\n\n${languageInstruction}`;

        if (input.documentType === 'PRD') {
          // Include approved BRD for PRD context
          const brdDocsSnapshot = await projectRef
            .collection('documents')
            .where('type', '==', 'BRD')
            .where('status', '==', 'APPROVED')
            .limit(1)
            .get();

          if (!brdDocsSnapshot.empty) {
            const brdDoc = brdDocsSnapshot.docs[0].data();
            if (brdDoc?.content) {
              contextInfo += `\n\n### Approved BRD\n\n${brdDoc.content}`;
            }
          }
        }

        // Build AI messages
        const aiMessages = [
          {
            role: 'system' as const,
            content: systemPromptData.prompt + contextInfo,
          },
          ...messages.map((msg) => ({
            role: msg.role as 'user' | 'assistant',
            content: msg.content,
          })),
          {
            role: 'user' as const,
            content:
              messages.length === 0
                ? `Start the wizard. Ask the first question to gather requirements for the ${input.documentType}. Reference the project title and description in your question.`
                : 'Based on the previous answer, ask the next relevant question.',
          },
        ];

        // Call AI
        const response = await generateCompletion(aiMessages, {
          temperature: 0.8,
          maxTokens: 2000,
        });

        const question = response.content;

        // Track token usage
        if (response.usage) {
          await trackTokenUsage({
            userId: ctx.user.id,
            projectId: input.projectId,
            operation: `ASK_QUESTION_${input.documentType}`,
            model: response.model,
            tokensUsed: response.usage.totalTokens,
            inputTokens: response.usage.promptTokens,
            outputTokens: response.usage.completionTokens,
          });
        }

        // Save assistant message
        const updatedMessages: Message[] = [
          ...messages,
          {
            role: 'assistant',
            content: question,
            timestamp: new Date().toISOString(),
          },
        ];

        await conversationRef.update({
          messages: updatedMessages,
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        logger.info({
          projectId: input.projectId,
          documentType: input.documentType,
          questionNumber: Math.floor(updatedMessages.length / 2) + 1,
        }, 'AI question asked');

        return {
          question,
          questionNumber: Math.floor(updatedMessages.length / 2) + 1,
          totalQuestions: 5,
        };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        logger.error({ error, input }, 'Failed to ask question');
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to generate question',
        });
      }
    }),

  /**
   * Generate document from conversation
   */
  generateDocument: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        documentType: z.enum(['BRD', 'PRD', 'PROMPT_BUILD', 'TASKS']),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        // Verify project ownership
        const projectRef = ctx.db.collection('projects').doc(input.projectId);
        const projectDoc = await projectRef.get();

        if (!projectDoc.exists) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Project not found',
          });
        }

        const project = projectDoc.data();

        if (project?.userId !== ctx.user.id) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'You do not have permission to generate documents for this project',
          });
        }

        // Get system prompt
        // UNIFIED mode uses TECHNICAL prompts (most comprehensive)
        const isPlain = project?.mode === 'PLAIN';
        let promptType: 'BRD_PLAIN' | 'BRD_TECHNICAL' | 'PRD_PLAIN' | 'PRD_TECHNICAL' | 'PROMPT_BUILD' | 'TASKS';
        if (input.documentType === 'BRD') {
          promptType = isPlain ? 'BRD_PLAIN' : 'BRD_TECHNICAL';
        } else if (input.documentType === 'PRD') {
          promptType = isPlain ? 'PRD_PLAIN' : 'PRD_TECHNICAL';
        } else if (input.documentType === 'PROMPT_BUILD') {
          promptType = 'PROMPT_BUILD';
        } else {
          promptType = 'TASKS';
        }

        const systemPromptSnapshot = await ctx.db
          .collection('systemPrompts')
          .where('type', '==', promptType)
          .limit(1)
          .get();

        if (systemPromptSnapshot.empty) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'System prompt not found',
          });
        }

        const systemPromptData = systemPromptSnapshot.docs[0].data();

        if (!systemPromptData.isActive) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'System prompt is inactive',
          });
        }

        // Use stored language preference, fall back to auto-detection for 'auto' or missing
        const projectLanguage = project?.language as SupportedLanguage | 'auto' | undefined;
        const detectedLanguage: SupportedLanguage =
          projectLanguage && projectLanguage !== 'auto'
            ? projectLanguage
            : detectLanguage(`${project?.title || ''} ${project?.description || ''}`);

        // Generate document based on type
        let content: string;
        let rawContent: string;
        let model: string;
        let tokensUsed: number | undefined;
        let inputTokens: number | undefined;
        let outputTokens: number | undefined;
        let truncated: boolean | undefined;
        let warning: string | undefined;

        if (input.documentType === 'BRD') {
          // Get conversation from subcollection
          const conversationDoc = await projectRef
            .collection('conversations')
            .doc('BRD')
            .get();

          if (!conversationDoc.exists) {
            throw new TRPCError({
              code: 'BAD_REQUEST',
              message: 'No conversation found for BRD generation',
            });
          }

          const conversationData = conversationDoc.data();

          const result = await generateBRD(
            systemPromptData.prompt,
            conversationData?.messages as Message[],
            detectedLanguage
          );
          content = result.content;
          rawContent = result.rawContent;
          model = result.model;
          tokensUsed = result.tokensUsed;
          inputTokens = result.inputTokens;
          outputTokens = result.outputTokens;
          truncated = result.truncated;
          warning = result.warning;
        } else if (input.documentType === 'PRD') {
          // Get approved BRD from subcollection
          const brdDocsSnapshot = await projectRef
            .collection('documents')
            .where('type', '==', 'BRD')
            .where('status', '==', 'APPROVED')
            .limit(1)
            .get();

          if (brdDocsSnapshot.empty) {
            throw new TRPCError({
              code: 'BAD_REQUEST',
              message: 'BRD must be approved before generating PRD',
            });
          }

          const brdDoc = brdDocsSnapshot.docs[0].data();

          // Get conversation from subcollection
          const conversationDoc = await projectRef
            .collection('conversations')
            .doc('PRD')
            .get();

          if (!conversationDoc.exists) {
            throw new TRPCError({
              code: 'BAD_REQUEST',
              message: 'No conversation found for PRD generation',
            });
          }

          const conversationData = conversationDoc.data();

          const result = await generatePRD(
            systemPromptData.prompt,
            conversationData?.messages as Message[],
            brdDoc.content,
            detectedLanguage
          );
          content = result.content;
          rawContent = result.rawContent;
          model = result.model;
          tokensUsed = result.tokensUsed;
          inputTokens = result.inputTokens;
          outputTokens = result.outputTokens;
          truncated = result.truncated;
          warning = result.warning;
        } else if (input.documentType === 'PROMPT_BUILD') {
          // PROMPT_BUILD (Plain mode only)
          if (project?.mode !== 'PLAIN') {
            throw new TRPCError({
              code: 'BAD_REQUEST',
              message: 'Prompt Build is only available in Plain mode',
            });
          }

          // Get approved PRD from subcollection
          const prdDocsSnapshot = await projectRef
            .collection('documents')
            .where('type', '==', 'PRD')
            .where('status', '==', 'APPROVED')
            .limit(1)
            .get();

          if (prdDocsSnapshot.empty) {
            throw new TRPCError({
              code: 'BAD_REQUEST',
              message: 'PRD must be approved before generating Prompt Build',
            });
          }

          const prdDoc = prdDocsSnapshot.docs[0].data();

          // Get BRD (optional) from subcollection
          const brdDocsSnapshot = await projectRef
            .collection('documents')
            .where('type', '==', 'BRD')
            .limit(1)
            .get();

          const brdDoc = brdDocsSnapshot.empty ? null : brdDocsSnapshot.docs[0].data();

          const result = await generatePromptBuild(
            systemPromptData.prompt,
            prdDoc.content,
            brdDoc?.content,
            detectedLanguage
          );
          content = result.content;
          rawContent = result.rawContent;
          model = result.model;
          tokensUsed = result.tokensUsed;
          inputTokens = result.inputTokens;
          outputTokens = result.outputTokens;
          truncated = result.truncated;
          warning = result.warning;
        } else {
          // TASKS (Technical mode only)
          if (project?.mode !== 'TECHNICAL') {
            throw new TRPCError({
              code: 'BAD_REQUEST',
              message: 'Tasks are only available in Technical mode',
            });
          }

          // Get approved PRD from subcollection
          const prdDocsSnapshot = await projectRef
            .collection('documents')
            .where('type', '==', 'PRD')
            .where('status', '==', 'APPROVED')
            .limit(1)
            .get();

          if (prdDocsSnapshot.empty) {
            throw new TRPCError({
              code: 'BAD_REQUEST',
              message: 'PRD must be approved before generating tasks',
            });
          }

          const prdDoc = prdDocsSnapshot.docs[0].data();

          // Get BRD (optional) from subcollection
          const brdDocsSnapshot = await projectRef
            .collection('documents')
            .where('type', '==', 'BRD')
            .limit(1)
            .get();

          const brdDoc = brdDocsSnapshot.empty ? null : brdDocsSnapshot.docs[0].data();

          const result = await generateTasks(
            systemPromptData.prompt,
            prdDoc.content,
            brdDoc?.content,
            detectedLanguage
          );
          content = result.content;
          rawContent = result.rawContent;
          model = result.model;
          tokensUsed = result.tokensUsed;
          inputTokens = result.inputTokens;
          outputTokens = result.outputTokens;
          truncated = result.truncated;
          warning = result.warning;

          // Note: Kickoff prompt generation removed to keep task output clean
          // Only the task list is included in the content
        }

        // Track token usage
        if (tokensUsed) {
          await trackTokenUsage({
            userId: ctx.user.id,
            projectId: input.projectId,
            operation: `GENERATE_${input.documentType}`,
            model,
            tokensUsed,
            inputTokens,
            outputTokens,
          });
        }

        // Log truncation warning
        if (truncated) {
          logger.warn({
            projectId: input.projectId,
            documentType: input.documentType,
            outputTokens,
            warning,
          }, 'Document generation was truncated');
        }

        // Create document in subcollection
        const documentRef = projectRef.collection('documents').doc();
        const documentData = {
          id: documentRef.id,
          projectId: input.projectId,
          type: input.documentType,
          content,
          rawContent,
          status: 'DRAFT',
          version: 1,
          truncated: truncated || false,
          warning: warning || null,
          approvedAt: null,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        };

        await documentRef.set(documentData);

        // Update project phase
        const phaseMap: Record<string, string> = {
          BRD: 'BRD_READY',
          PRD: 'PRD_READY',
          TASKS: 'TASKS_READY',
        };

        if (phaseMap[input.documentType]) {
          await projectRef.update({
            currentPhase: phaseMap[input.documentType],
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          });
        }

        // Create audit log
        await ctx.db.collection('auditLogs').add({
          userId: ctx.user.id,
          userName: ctx.user.name,
          action: 'DOCUMENT_GENERATED',
          details: {
            documentId: documentRef.id,
            projectId: input.projectId,
            type: input.documentType,
          },
          ipAddress: ctx.req.ip || ctx.req.socket.remoteAddress || null,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        logger.info({
          documentId: documentRef.id,
          projectId: input.projectId,
          type: input.documentType,
          userId: ctx.user.id,
        }, 'Document generated');

        // Get the created document with actual timestamps
        const createdDoc = await documentRef.get();
        const createdData = createdDoc.data();

        return {
          id: documentRef.id,
          ...createdData,
          createdAt: createdData?.createdAt?.toDate(),
          updatedAt: createdData?.updatedAt?.toDate(),
        };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        logger.error({ error, errorMessage, input }, 'Failed to generate document');
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `Failed to generate document: ${errorMessage}`,
        });
      }
    }),

  /**
   * Regenerate document with optional feedback
   */
  regenerateDocument: protectedProcedure
    .input(
      z.object({
        documentId: z.string(),
        feedback: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        // Find document across all projects (documents are in subcollections)
        const projectsSnapshot = await ctx.db.collection('projects').get();

        let documentRef: FirebaseFirestore.DocumentReference | null = null;
        let existingDocData: any = null;
        let projectRef: FirebaseFirestore.DocumentReference | null = null;
        let projectData: any = null;

        for (const projectDoc of projectsSnapshot.docs) {
          const docSnapshot = await projectDoc.ref
            .collection('documents')
            .doc(input.documentId)
            .get();

          if (docSnapshot.exists) {
            documentRef = docSnapshot.ref;
            existingDocData = docSnapshot.data();
            projectRef = projectDoc.ref;
            projectData = projectDoc.data();
            break;
          }
        }

        if (!documentRef || !existingDocData || !projectRef || !projectData) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Document not found',
          });
        }

        // Verify ownership
        if (projectData.userId !== ctx.user.id) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'You do not have permission to regenerate this document',
          });
        }

        // Get system prompt
        // UNIFIED mode uses TECHNICAL prompts (most comprehensive)
        const isPlainRegen = projectData.mode === 'PLAIN';
        let promptType: 'BRD_PLAIN' | 'BRD_TECHNICAL' | 'PRD_PLAIN' | 'PRD_TECHNICAL' | 'PROMPT_BUILD' | 'TASKS';
        if (existingDocData.type === 'BRD') {
          promptType = isPlainRegen ? 'BRD_PLAIN' : 'BRD_TECHNICAL';
        } else if (existingDocData.type === 'PRD') {
          promptType = isPlainRegen ? 'PRD_PLAIN' : 'PRD_TECHNICAL';
        } else if (existingDocData.type === 'PROMPT_BUILD') {
          promptType = 'PROMPT_BUILD';
        } else {
          promptType = 'TASKS';
        }

        const systemPromptSnapshot = await ctx.db
          .collection('systemPrompts')
          .where('type', '==', promptType)
          .limit(1)
          .get();

        if (systemPromptSnapshot.empty) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'System prompt not found',
          });
        }

        const systemPromptData = systemPromptSnapshot.docs[0].data();

        if (!systemPromptData.isActive) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'System prompt is inactive',
          });
        }

        // Use stored language preference, fall back to auto-detection for 'auto' or missing
        const projectLanguage = projectData?.language as SupportedLanguage | 'auto' | undefined;
        const detectedLanguage: SupportedLanguage =
          projectLanguage && projectLanguage !== 'auto'
            ? projectLanguage
            : detectLanguage(`${projectData?.title || ''} ${projectData?.description || ''}`);

        // Generate new document based on type
        let content: string;
        let rawContent: string;
        let model: string;
        let tokensUsed: number | undefined;
        let inputTokens: number | undefined;
        let outputTokens: number | undefined;

        if (existingDocData.type === 'BRD') {
          // Get conversation from subcollection
          const conversationDoc = await projectRef
            .collection('conversations')
            .doc('BRD')
            .get();

          if (!conversationDoc.exists) {
            throw new TRPCError({
              code: 'BAD_REQUEST',
              message: 'No conversation found for BRD regeneration',
            });
          }

          const conversationData = conversationDoc.data();

          const result = await generateBRD(
            systemPromptData.prompt + `\n\n**IMPORTANT: This is a regeneration request. Do NOT ask questions. Generate the complete BRD document directly based on the conversation history provided.` + (input.feedback ? `\n\nUser Feedback for improvement: ${input.feedback}` : ''),
            conversationData?.messages as Message[],
            detectedLanguage
          );
          content = result.content;
          rawContent = result.rawContent;
          model = result.model;
          tokensUsed = result.tokensUsed;
          inputTokens = result.inputTokens;
          outputTokens = result.outputTokens;
        } else if (existingDocData.type === 'PRD') {
          // Get approved BRD from subcollection
          const brdDocsSnapshot = await projectRef
            .collection('documents')
            .where('type', '==', 'BRD')
            .where('status', '==', 'APPROVED')
            .limit(1)
            .get();

          if (brdDocsSnapshot.empty) {
            throw new TRPCError({
              code: 'BAD_REQUEST',
              message: 'BRD must be approved before regenerating PRD',
            });
          }

          const brdDoc = brdDocsSnapshot.docs[0].data();

          // Get conversation from subcollection
          const conversationDoc = await projectRef
            .collection('conversations')
            .doc('PRD')
            .get();

          if (!conversationDoc.exists) {
            throw new TRPCError({
              code: 'BAD_REQUEST',
              message: 'No conversation found for PRD regeneration',
            });
          }

          const conversationData = conversationDoc.data();

          const result = await generatePRD(
            systemPromptData.prompt + `\n\n**IMPORTANT: This is a regeneration request. Do NOT ask questions. Generate the complete PRD document directly based on the conversation history and approved BRD.` + (input.feedback ? `\n\nUser Feedback for improvement: ${input.feedback}` : ''),
            conversationData?.messages as Message[],
            brdDoc.content,
            detectedLanguage
          );
          content = result.content;
          rawContent = result.rawContent;
          model = result.model;
          tokensUsed = result.tokensUsed;
          inputTokens = result.inputTokens;
          outputTokens = result.outputTokens;
        } else if (existingDocData.type === 'PROMPT_BUILD') {
          // Get approved PRD from subcollection
          const prdDocsSnapshot = await projectRef
            .collection('documents')
            .where('type', '==', 'PRD')
            .where('status', '==', 'APPROVED')
            .limit(1)
            .get();

          if (prdDocsSnapshot.empty) {
            throw new TRPCError({
              code: 'BAD_REQUEST',
              message: 'PRD must be approved before regenerating Prompt Build',
            });
          }

          const prdDoc = prdDocsSnapshot.docs[0].data();

          // Get BRD (optional) from subcollection
          const brdDocsSnapshot = await projectRef
            .collection('documents')
            .where('type', '==', 'BRD')
            .limit(1)
            .get();

          const brdDoc = brdDocsSnapshot.empty ? null : brdDocsSnapshot.docs[0].data();

          const result = await generatePromptBuild(
            systemPromptData.prompt + `\n\n**IMPORTANT: This is a regeneration request. Do NOT ask questions. Generate the complete vibe coding prompt directly based on the approved PRD and BRD.` + (input.feedback ? `\n\nUser Feedback for improvement: ${input.feedback}` : ''),
            prdDoc.content,
            brdDoc?.content,
            detectedLanguage
          );
          content = result.content;
          rawContent = result.rawContent;
          model = result.model;
          tokensUsed = result.tokensUsed;
          inputTokens = result.inputTokens;
          outputTokens = result.outputTokens;
        } else {
          // TASKS
          // Get approved PRD from subcollection
          const prdDocsSnapshot = await projectRef
            .collection('documents')
            .where('type', '==', 'PRD')
            .where('status', '==', 'APPROVED')
            .limit(1)
            .get();

          if (prdDocsSnapshot.empty) {
            throw new TRPCError({
              code: 'BAD_REQUEST',
              message: 'PRD must be approved before regenerating tasks',
            });
          }

          const prdDoc = prdDocsSnapshot.docs[0].data();

          // Get BRD (optional) from subcollection
          const brdDocsSnapshot = await projectRef
            .collection('documents')
            .where('type', '==', 'BRD')
            .limit(1)
            .get();

          const brdDoc = brdDocsSnapshot.empty ? null : brdDocsSnapshot.docs[0].data();

          const result = await generateTasks(
            systemPromptData.prompt + `\n\n**IMPORTANT: This is a regeneration request. Do NOT ask questions. Generate the complete task list directly based on the approved PRD and BRD.` + (input.feedback ? `\n\nUser Feedback for improvement: ${input.feedback}` : ''),
            prdDoc.content,
            brdDoc?.content,
            detectedLanguage
          );
          content = result.content;
          rawContent = result.rawContent;
          model = result.model;
          tokensUsed = result.tokensUsed;
          inputTokens = result.inputTokens;
          outputTokens = result.outputTokens;

          // Generate kickoff prompt
          const kickoffPrompt = generateKickoffPrompt(result.tasks, prdDoc.content.substring(0, 500));
          content += `\n\n---\n\n${kickoffPrompt}`;
        }

        // Track token usage
        if (tokensUsed) {
          await trackTokenUsage({
            userId: ctx.user.id,
            projectId: existingDocData.projectId,
            operation: `REGENERATE_${existingDocData.type}`,
            model,
            tokensUsed,
            inputTokens,
            outputTokens,
          });
        }

        // Save current version to history before updating
        const versionRef = documentRef.collection('versions').doc();
        await versionRef.set({
          id: versionRef.id,
          documentId: existingDocData.id,
          version: existingDocData.version,
          content: existingDocData.content,
          rawContent: existingDocData.rawContent,
          status: existingDocData.status,
          approvedAt: existingDocData.approvedAt,
          createdBy: ctx.user.id,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        // Update document with new content and increment version
        await documentRef.update({
          content,
          rawContent,
          version: existingDocData.version + 1,
          status: 'DRAFT',
          approvedAt: null,
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        // Create audit log
        await ctx.db.collection('auditLogs').add({
          userId: ctx.user.id,
          userName: ctx.user.name,
          action: 'DOCUMENT_REGENERATED',
          details: {
            documentId: input.documentId,
            projectId: existingDocData.projectId,
            type: existingDocData.type,
            version: existingDocData.version + 1,
            feedback: input.feedback || null,
          },
          ipAddress: ctx.req.ip || ctx.req.socket.remoteAddress || null,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        logger.info({
          documentId: input.documentId,
          projectId: existingDocData.projectId,
          type: existingDocData.type,
          version: existingDocData.version + 1,
          userId: ctx.user.id,
        }, 'Document regenerated');

        // Get updated document
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
        if (error instanceof TRPCError) throw error;
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        logger.error({ error, errorMessage, input }, 'Failed to regenerate document');
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `Failed to regenerate document: ${errorMessage}`,
        });
      }
    }),

  /**
   * Explain a wizard question using AI
   * Provides context-aware guidance with tips, recommendations, and examples
   */
  explainQuestion: protectedProcedure
    .input(
      z.object({
        question: z.string().min(1).max(2000),
        projectMode: z.enum(['PLAIN', 'TECHNICAL', 'UNIFIED']),
        documentType: z.enum(['BRD', 'PRD']),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        logger.info({ question: input.question }, 'Explaining question');

        // Check cache first for fast response
        const cacheKey = hashExplanation(input.question, input.projectMode);
        const cached = explanationCache.get(cacheKey);

        if (cached) {
          logger.info('Returning cached explanation');
          return cached as ExplanationResponse;
        }

        // Get explanation prompt from database
        const systemPromptSnapshot = await ctx.db
          .collection('systemPrompts')
          .where('type', '==', 'QUESTION_EXPLANATION')
          .where('isActive', '==', true)
          .limit(1)
          .get();

        if (systemPromptSnapshot.empty) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Explanation prompt not configured',
          });
        }

        const systemPromptData = systemPromptSnapshot.docs[0].data();

        // Build AI messages with context
        const promptWithContext = systemPromptData.prompt
          .replace('{projectMode}', input.projectMode)
          .replace('{documentType}', input.documentType)
          .replace('{question}', input.question);

        const messages: ChatMessage[] = [
          {
            role: 'system',
            content: promptWithContext,
          },
          {
            role: 'user',
            content: `Explain this question: "${input.question}"`,
          },
        ];

        // Call AI with cheaper/faster model for explanations
        const response = await generateCompletion(messages, {
          temperature: 0.5, // More deterministic for explanations
          maxTokens: 1500, // Increased for detailed analysis
          modelOverride: process.env.OPENROUTER_EXPLANATION_MODEL,
        });

        logger.info({ contentLength: response.content.length }, 'Raw explanation response received');

        // Parse JSON response
        let explanation: ExplanationResponse;
        try {
          const jsonMatch = response.content.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            explanation = JSON.parse(jsonMatch[0]);

            // Validate structure lightly (ensure answerAnalysis exists if expected)
            if (!explanation.answerAnalysis && !explanation.prosAndCons) {
              logger.warn('Explanation missing detailed analysis sections');
            }
          } else {
            throw new Error('No JSON found in response');
          }
        } catch (error) {
          // Fallback to generic explanation if parsing fails
          logger.error({ error, content: response.content }, 'Failed to parse explanation JSON');
          explanation = {
            purpose: 'Understanding project requirements',
            importance: 'This helps create accurate technical specifications',
            tips: [
              'Be as specific as possible in your answer',
              'Consider both current and future needs',
              'Think about your users\' perspective',
              'Ask yourself: what problem does this solve?',
            ],
          };
        }

        // Track token usage
        if (response.usage) {
          await trackTokenUsage({
            userId: ctx.user.id,
            operation: 'EXPLAIN_QUESTION',
            model: response.model,
            tokensUsed: response.usage.totalTokens,
            inputTokens: response.usage.promptTokens,
            outputTokens: response.usage.completionTokens,
          });
        }

        // Cache for 24 hours
        explanationCache.set(cacheKey, explanation);

        return explanation;
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        logger.error({ error, input }, 'Failed to explain question');
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to generate explanation',
        });
      }
    }),

  /**
   * Generate tool-specific output (for unified flow)
   * Requires approved PRD and BRD
   */
  generateToolOutput: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        toolType: z.enum([
          'VIBE_V0', 'VIBE_LOVEABLE', 'VIBE_BOLT', 'VIBE_REPLIT', 'VIBE_FIREBASE_STUDIO',
          'CLAUDE_CODE', 'CURSOR', 'OPENAI_CODEX', 'GOOGLE_ANTIGRAVITY',
        ]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        // Verify project ownership
        const projectRef = ctx.db.collection('projects').doc(input.projectId);
        const projectDoc = await projectRef.get();

        if (!projectDoc.exists) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Project not found',
          });
        }

        const project = projectDoc.data();

        if (project?.userId !== ctx.user.id) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'You do not have permission to generate tool output for this project',
          });
        }

        // Get approved PRD
        const prdDocsSnapshot = await projectRef
          .collection('documents')
          .where('type', '==', 'PRD')
          .where('status', '==', 'APPROVED')
          .limit(1)
          .get();

        if (prdDocsSnapshot.empty) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'PRD must be approved before generating tool output',
          });
        }

        const prdDoc = prdDocsSnapshot.docs[0].data();

        // Get approved BRD
        const brdDocsSnapshot = await projectRef
          .collection('documents')
          .where('type', '==', 'BRD')
          .where('status', '==', 'APPROVED')
          .limit(1)
          .get();

        if (brdDocsSnapshot.empty) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'BRD must be approved before generating tool output',
          });
        }

        const brdDoc = brdDocsSnapshot.docs[0].data();

        // Determine the system prompt type for the tool
        const isVibeCoding = input.toolType.startsWith('VIBE_');
        const promptType = isVibeCoding
          ? `TOOL_${input.toolType}`
          : `TOOL_${input.toolType}`;

        // Try to get tool-specific system prompt, fall back to generic
        let systemPromptContent: string;
        const systemPromptSnapshot = await ctx.db
          .collection('systemPrompts')
          .where('type', '==', promptType)
          .where('isActive', '==', true)
          .limit(1)
          .get();

        if (!systemPromptSnapshot.empty) {
          systemPromptContent = systemPromptSnapshot.docs[0].data().prompt;
        } else {
          // Fall back to generic tool output prompt
          const fallbackSnapshot = await ctx.db
            .collection('systemPrompts')
            .where('type', '==', isVibeCoding ? 'TOOL_VIBE_GENERIC' : 'TOOL_AI_GENERIC')
            .where('isActive', '==', true)
            .limit(1)
            .get();

          if (!fallbackSnapshot.empty) {
            systemPromptContent = fallbackSnapshot.docs[0].data().prompt;
          } else {
            // Last resort: use a minimal system prompt
            systemPromptContent = isVibeCoding
              ? `You are an expert at generating optimized prompts for AI-powered development tools. Generate a comprehensive, tool-specific prompt that can be copy-pasted into the target tool to build the complete application described in the PRD and BRD.`
              : `You are an expert at generating configuration files for AI coding tools. Generate the complete set of config files needed to set up the target tool for the project described in the PRD and BRD. Include all necessary rules, settings, and a comprehensive reference document.`;
          }
        }

        // Use stored language preference
        const projectLanguage = project?.language as SupportedLanguage | 'auto' | undefined;
        const detectedLanguage: SupportedLanguage =
          projectLanguage && projectLanguage !== 'auto'
            ? projectLanguage
            : detectLanguage(`${project?.title || ''} ${project?.description || ''}`);

        // Update phase to generating
        await projectRef.update({
          currentPhase: 'TOOL_OUTPUT_GENERATING',
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        // Generate tool output
        const result = await generateToolOutput(
          systemPromptContent,
          input.toolType,
          prdDoc.content,
          brdDoc.content,
          project?.title || '',
          detectedLanguage
        );

        // Track token usage
        if (result.tokensUsed) {
          await trackTokenUsage({
            userId: ctx.user.id,
            projectId: input.projectId,
            operation: `GENERATE_TOOL_OUTPUT_${input.toolType}`,
            model: result.model,
            tokensUsed: result.tokensUsed,
            inputTokens: result.inputTokens,
            outputTokens: result.outputTokens,
          });
        }

        // Create TOOL_OUTPUT document in subcollection
        const documentRef = projectRef.collection('documents').doc();
        const documentData = {
          id: documentRef.id,
          projectId: input.projectId,
          type: 'TOOL_OUTPUT',
          toolType: input.toolType,
          content: result.content,
          rawContent: result.rawContent,
          bundle: JSON.stringify({ ...result.bundle, prdContent: prdDoc.content }),
          status: 'APPROVED', // Tool outputs are immediately ready
          version: 1,
          approvedAt: admin.firestore.FieldValue.serverTimestamp(),
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        };

        await documentRef.set(documentData);

        // Update project phase
        await projectRef.update({
          currentPhase: 'TOOL_OUTPUT_READY',
          selectedTool: input.toolType,
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        // Create audit log
        await ctx.db.collection('auditLogs').add({
          userId: ctx.user.id,
          userName: ctx.user.name,
          action: 'TOOL_OUTPUT_GENERATED',
          details: {
            documentId: documentRef.id,
            projectId: input.projectId,
            toolType: input.toolType,
          },
          ipAddress: ctx.req.ip || ctx.req.socket.remoteAddress || null,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        logger.info({
          documentId: documentRef.id,
          projectId: input.projectId,
          toolType: input.toolType,
          userId: ctx.user.id,
        }, 'Tool output generated');

        // Get the created document with actual timestamps
        const createdDoc = await documentRef.get();
        const createdData = createdDoc.data();

        return {
          id: documentRef.id,
          ...createdData,
          bundle: result.bundle,
          createdAt: createdData?.createdAt?.toDate(),
          updatedAt: createdData?.updatedAt?.toDate(),
          approvedAt: createdData?.approvedAt?.toDate(),
        };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        logger.error({ error, input }, 'Failed to generate tool output');
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to generate tool output',
        });
      }
    }),
});
