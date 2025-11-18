/**
 * AI Router
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
} from '../lib/services/documentGenerator.js';
import { trackTokenUsage } from '../lib/services/tokenTracker.js';
import type { Message } from '../lib/validations/conversation.js';
import {
  explanationCache,
  hashExplanation,
  type ExplanationResponse,
} from '../lib/utils/cache.js';

export const aiRouter = router({
  /**
   * Ask next question in wizard based on conversation history
   */
  askQuestion: protectedProcedure
    .input(
      z.object({
        projectId: z.string().cuid(),
        documentType: z.enum(['BRD', 'PRD']),
        userAnswer: z.string().optional(),
      })
    )
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
          message: 'You do not have permission to access this project',
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

      // Add user answer if provided
      if (input.userAnswer) {
        const messages = conversation.messages as Message[];
        messages.push({
          role: 'user',
          content: input.userAnswer,
          timestamp: new Date().toISOString(),
        });

        conversation = await ctx.prisma.conversation.update({
          where: { id: conversation.id },
          data: { messages: messages as any },
        });
      }

      // Get system prompt
      const promptType =
        input.documentType === 'BRD'
          ? project.mode === 'PLAIN'
            ? 'BRD_PLAIN'
            : 'BRD_TECHNICAL'
          : project.mode === 'PLAIN'
          ? 'PRD_PLAIN'
          : 'PRD_TECHNICAL';

      const systemPrompt = await ctx.prisma.systemPrompt.findUnique({
        where: { type: promptType },
      });

      if (!systemPrompt || !systemPrompt.isActive) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'System prompt not found or inactive',
        });
      }

      // Build context for AI
      let contextInfo = `\n\n### Project Context\n\n**Project Title:** ${project.title}\n**Project Description:** ${project.description}`;

      if (input.documentType === 'PRD') {
        // Include approved BRD for PRD context
        const brdDoc = await ctx.prisma.document.findFirst({
          where: {
            projectId: input.projectId,
            type: 'BRD',
            status: 'APPROVED',
          },
        });
        if (brdDoc?.content) {
          contextInfo += `\n\n### Approved BRD\n\n${brdDoc.content}`;
        }
      }

      // Build AI messages
      const messages = conversation.messages as Message[];
      const aiMessages = [
        {
          role: 'system' as const,
          content: systemPrompt.prompt + contextInfo,
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
        maxTokens: 2000, // Increased to allow detailed technical explanations with examples
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
      const updatedMessages = [...messages, {
        role: 'assistant',
        content: question,
        timestamp: new Date().toISOString(),
      }];

      await ctx.prisma.conversation.update({
        where: { id: conversation.id },
        data: { messages: updatedMessages as any },
      });

      return {
        question,
        questionNumber: Math.floor(updatedMessages.length / 2) + 1,
        totalQuestions: 5, // AI will ask 3-5 questions
      };
    }),

  /**
   * Generate document from conversation
   */
  generateDocument: protectedProcedure
    .input(
      z.object({
        projectId: z.string().cuid(),
        documentType: z.enum(['BRD', 'PRD', 'PROMPT_BUILD', 'TASKS']),
      })
    )
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
          message: 'You do not have permission to generate documents for this project',
        });
      }

      // Get system prompt
      let promptType: 'BRD_PLAIN' | 'BRD_TECHNICAL' | 'PRD_PLAIN' | 'PRD_TECHNICAL' | 'PROMPT_BUILD' | 'TASKS';
      if (input.documentType === 'BRD') {
        promptType = project.mode === 'PLAIN' ? 'BRD_PLAIN' : 'BRD_TECHNICAL';
      } else if (input.documentType === 'PRD') {
        promptType = project.mode === 'PLAIN' ? 'PRD_PLAIN' : 'PRD_TECHNICAL';
      } else if (input.documentType === 'PROMPT_BUILD') {
        promptType = 'PROMPT_BUILD';
      } else {
        promptType = 'TASKS';
      }

      const systemPrompt = await ctx.prisma.systemPrompt.findUnique({
        where: { type: promptType },
      });

      if (!systemPrompt || !systemPrompt.isActive) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'System prompt not found or inactive',
        });
      }

      // Generate document based on type
      let content: string;
      let rawContent: string;
      let model: string;
      let tokensUsed: number | undefined;
      let inputTokens: number | undefined;
      let outputTokens: number | undefined;

      if (input.documentType === 'BRD') {
        // Get conversation
        const conversation = await ctx.prisma.conversation.findUnique({
          where: {
            projectId_documentType: {
              projectId: input.projectId,
              documentType: 'BRD',
            },
          },
        });

        if (!conversation) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'No conversation found for BRD generation',
          });
        }

        const result = await generateBRD(
          systemPrompt.prompt,
          conversation.messages as Message[]
        );
        content = result.content;
        rawContent = result.rawContent;
        model = result.model;
        tokensUsed = result.tokensUsed;
        inputTokens = result.inputTokens;
        outputTokens = result.outputTokens;
      } else if (input.documentType === 'PRD') {
        // Get BRD
        const brdDoc = await ctx.prisma.document.findFirst({
          where: {
            projectId: input.projectId,
            type: 'BRD',
            status: 'APPROVED',
          },
        });

        if (!brdDoc) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'BRD must be approved before generating PRD',
          });
        }

        // Get conversation
        const conversation = await ctx.prisma.conversation.findUnique({
          where: {
            projectId_documentType: {
              projectId: input.projectId,
              documentType: 'PRD',
            },
          },
        });

        if (!conversation) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'No conversation found for PRD generation',
          });
        }

        const result = await generatePRD(
          systemPrompt.prompt,
          conversation.messages as Message[],
          brdDoc.content
        );
        content = result.content;
        rawContent = result.rawContent;
        model = result.model;
        tokensUsed = result.tokensUsed;
        inputTokens = result.inputTokens;
        outputTokens = result.outputTokens;
      } else if (input.documentType === 'PROMPT_BUILD') {
        // PROMPT_BUILD (Plain mode only)
        if (project.mode !== 'PLAIN') {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Prompt Build is only available in Plain mode',
          });
        }

        // Get PRD
        const prdDoc = await ctx.prisma.document.findFirst({
          where: {
            projectId: input.projectId,
            type: 'PRD',
            status: 'APPROVED',
          },
        });

        if (!prdDoc) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'PRD must be approved before generating Prompt Build',
          });
        }

        // Get BRD (optional)
        const brdDoc = await ctx.prisma.document.findFirst({
          where: {
            projectId: input.projectId,
            type: 'BRD',
          },
        });

        const result = await generatePromptBuild(
          systemPrompt.prompt,
          prdDoc.content,
          brdDoc?.content
        );
        content = result.content;
        rawContent = result.rawContent;
        model = result.model;
        tokensUsed = result.tokensUsed;
        inputTokens = result.inputTokens;
        outputTokens = result.outputTokens;
      } else {
        // TASKS (Technical mode only)
        if (project.mode !== 'TECHNICAL') {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Tasks are only available in Technical mode',
          });
        }

        // Get PRD
        const prdDoc = await ctx.prisma.document.findFirst({
          where: {
            projectId: input.projectId,
            type: 'PRD',
            status: 'APPROVED',
          },
        });

        if (!prdDoc) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'PRD must be approved before generating tasks',
          });
        }

        // Get BRD (optional)
        const brdDoc = await ctx.prisma.document.findFirst({
          where: {
            projectId: input.projectId,
            type: 'BRD',
          },
        });

        const result = await generateTasks(
          systemPrompt.prompt,
          prdDoc.content,
          brdDoc?.content
        );
        content = result.content;
        rawContent = result.rawContent;
        model = result.model;
        tokensUsed = result.tokensUsed;
        inputTokens = result.inputTokens;
        outputTokens = result.outputTokens;

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

      // Create document
      const document = await ctx.prisma.document.create({
        data: {
          projectId: input.projectId,
          type: input.documentType,
          content,
          rawContent,
          status: 'DRAFT',
          version: 1,
        },
      });

      // Update project phase
      const phaseMap: Record<string, string> = {
        BRD: 'BRD_READY',
        PRD: 'PRD_READY',
        TASKS: 'TASKS_READY',
      };
      await ctx.prisma.project.update({
        where: { id: input.projectId },
        data: { currentPhase: phaseMap[input.documentType] as any },
      });

      // Create audit log
      await ctx.prisma.auditLog.create({
        data: {
          userId: ctx.user.id,
          action: 'DOCUMENT_GENERATED',
          details: {
            documentId: document.id,
            projectId: input.projectId,
            type: input.documentType,
          },
          ipAddress: ctx.req.ip || ctx.req.socket.remoteAddress || null,
        },
      });

      return document;
    }),

  /**
   * Regenerate document with optional feedback
   */
  regenerateDocument: protectedProcedure
    .input(
      z.object({
        documentId: z.string().cuid(),
        feedback: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Get existing document
      const existingDoc = await ctx.prisma.document.findUnique({
        where: { id: input.documentId },
        include: { project: true },
      });

      if (!existingDoc) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Document not found',
        });
      }

      if (existingDoc.project.userId !== ctx.user.id) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'You do not have permission to regenerate this document',
        });
      }

      // Get system prompt
      let promptType: 'BRD_PLAIN' | 'BRD_TECHNICAL' | 'PRD_PLAIN' | 'PRD_TECHNICAL' | 'PROMPT_BUILD' | 'TASKS';
      if (existingDoc.type === 'BRD') {
        promptType = existingDoc.project.mode === 'PLAIN' ? 'BRD_PLAIN' : 'BRD_TECHNICAL';
      } else if (existingDoc.type === 'PRD') {
        promptType = existingDoc.project.mode === 'PLAIN' ? 'PRD_PLAIN' : 'PRD_TECHNICAL';
      } else if (existingDoc.type === 'PROMPT_BUILD') {
        promptType = 'PROMPT_BUILD';
      } else {
        promptType = 'TASKS';
      }

      const systemPrompt = await ctx.prisma.systemPrompt.findUnique({
        where: { type: promptType },
      });

      if (!systemPrompt || !systemPrompt.isActive) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'System prompt not found or inactive',
        });
      }

      // Generate new document based on type
      let content: string;
      let rawContent: string;
      let model: string;
      let tokensUsed: number | undefined;
      let inputTokens: number | undefined;
      let outputTokens: number | undefined;

      if (existingDoc.type === 'BRD') {
        // Get conversation
        const conversation = await ctx.prisma.conversation.findUnique({
          where: {
            projectId_documentType: {
              projectId: existingDoc.projectId,
              documentType: 'BRD',
            },
          },
        });

        if (!conversation) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'No conversation found for BRD regeneration',
          });
        }

        const result = await generateBRD(
          systemPrompt.prompt + `\n\n**IMPORTANT: This is a regeneration request. Do NOT ask questions. Generate the complete BRD document directly based on the conversation history provided.` + (input.feedback ? `\n\nUser Feedback for improvement: ${input.feedback}` : ''),
          conversation.messages as Message[]
        );
        content = result.content;
        rawContent = result.rawContent;
        model = result.model;
        tokensUsed = result.tokensUsed;
        inputTokens = result.inputTokens;
        outputTokens = result.outputTokens;
      } else if (existingDoc.type === 'PRD') {
        // Get BRD
        const brdDoc = await ctx.prisma.document.findFirst({
          where: {
            projectId: existingDoc.projectId,
            type: 'BRD',
            status: 'APPROVED',
          },
        });

        if (!brdDoc) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'BRD must be approved before regenerating PRD',
          });
        }

        // Get conversation
        const conversation = await ctx.prisma.conversation.findUnique({
          where: {
            projectId_documentType: {
              projectId: existingDoc.projectId,
              documentType: 'PRD',
            },
          },
        });

        if (!conversation) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'No conversation found for PRD regeneration',
          });
        }

        const result = await generatePRD(
          systemPrompt.prompt + `\n\n**IMPORTANT: This is a regeneration request. Do NOT ask questions. Generate the complete PRD document directly based on the conversation history and approved BRD.` + (input.feedback ? `\n\nUser Feedback for improvement: ${input.feedback}` : ''),
          conversation.messages as Message[],
          brdDoc.content
        );
        content = result.content;
        rawContent = result.rawContent;
        model = result.model;
        tokensUsed = result.tokensUsed;
        inputTokens = result.inputTokens;
        outputTokens = result.outputTokens;
      } else if (existingDoc.type === 'PROMPT_BUILD') {
        // Get PRD
        const prdDoc = await ctx.prisma.document.findFirst({
          where: {
            projectId: existingDoc.projectId,
            type: 'PRD',
            status: 'APPROVED',
          },
        });

        if (!prdDoc) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'PRD must be approved before regenerating Prompt Build',
          });
        }

        // Get BRD (optional)
        const brdDoc = await ctx.prisma.document.findFirst({
          where: {
            projectId: existingDoc.projectId,
            type: 'BRD',
          },
        });

        const result = await generatePromptBuild(
          systemPrompt.prompt + `\n\n**IMPORTANT: This is a regeneration request. Do NOT ask questions. Generate the complete vibe coding prompt directly based on the approved PRD and BRD.` + (input.feedback ? `\n\nUser Feedback for improvement: ${input.feedback}` : ''),
          prdDoc.content,
          brdDoc?.content
        );
        content = result.content;
        rawContent = result.rawContent;
        model = result.model;
        tokensUsed = result.tokensUsed;
        inputTokens = result.inputTokens;
        outputTokens = result.outputTokens;
      } else {
        // TASKS
        // Get PRD
        const prdDoc = await ctx.prisma.document.findFirst({
          where: {
            projectId: existingDoc.projectId,
            type: 'PRD',
            status: 'APPROVED',
          },
        });

        if (!prdDoc) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'PRD must be approved before regenerating tasks',
          });
        }

        // Get BRD (optional)
        const brdDoc = await ctx.prisma.document.findFirst({
          where: {
            projectId: existingDoc.projectId,
            type: 'BRD',
          },
        });

        const result = await generateTasks(
          systemPrompt.prompt + `\n\n**IMPORTANT: This is a regeneration request. Do NOT ask questions. Generate the complete task list directly based on the approved PRD and BRD.` + (input.feedback ? `\n\nUser Feedback for improvement: ${input.feedback}` : ''),
          prdDoc.content,
          brdDoc?.content
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
          projectId: existingDoc.projectId,
          operation: `REGENERATE_${existingDoc.type}`,
          model,
          tokensUsed,
          inputTokens,
          outputTokens,
        });
      }

      // Save current version to history before updating
      await ctx.prisma.documentVersion.create({
        data: {
          documentId: existingDoc.id,
          version: existingDoc.version,
          content: existingDoc.content,
          rawContent: existingDoc.rawContent,
          status: existingDoc.status,
          approvedAt: existingDoc.approvedAt,
          createdBy: ctx.user.id,
        },
      });

      // Update document with new content and increment version
      const updatedDocument = await ctx.prisma.document.update({
        where: { id: input.documentId },
        data: {
          content,
          rawContent,
          version: existingDoc.version + 1,
          status: 'DRAFT',
          approvedAt: null,
        },
      });

      // Create audit log
      await ctx.prisma.auditLog.create({
        data: {
          userId: ctx.user.id,
          action: 'DOCUMENT_REGENERATED',
          details: {
            documentId: input.documentId,
            projectId: existingDoc.projectId,
            type: existingDoc.type,
            version: updatedDocument.version,
            feedback: input.feedback || null,
          },
          ipAddress: ctx.req.ip || ctx.req.socket.remoteAddress || null,
        },
      });

      return updatedDocument;
    }),

  /**
   * Explain a wizard question using AI
   * Provides context-aware guidance with tips, recommendations, and examples
   */
  explainQuestion: protectedProcedure
    .input(
      z.object({
        question: z.string().min(1).max(2000),
        projectMode: z.enum(['PLAIN', 'TECHNICAL']),
        documentType: z.enum(['BRD', 'PRD']),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Check cache first for fast response
      const cacheKey = hashExplanation(input.question, input.projectMode);
      const cached = explanationCache.get(cacheKey);

      if (cached) {
        return cached as ExplanationResponse;
      }

      // Get explanation prompt from database
      const systemPrompt = await ctx.prisma.systemPrompt.findFirst({
        where: {
          type: 'QUESTION_EXPLANATION',
          isActive: true,
        },
      });

      if (!systemPrompt) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Explanation prompt not configured',
        });
      }

      // Build AI messages with context
      const promptWithContext = systemPrompt.prompt
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
        maxTokens: 800, // Concise explanations
        modelOverride: process.env.OPENROUTER_EXPLANATION_MODEL,
      });

      // Parse JSON response
      let explanation: ExplanationResponse;
      try {
        const jsonMatch = response.content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          explanation = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('No JSON found in response');
        }
      } catch (error) {
        // Fallback to generic explanation if parsing fails
        console.error('Failed to parse explanation JSON:', error);
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
    }),
});
