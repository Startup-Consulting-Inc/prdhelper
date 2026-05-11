/**
 * AI Hook
 *
 * Custom hook for AI-powered operations with tRPC.
 */

import { trpc } from '../lib/trpc';
import type { Message, Conversation } from '@shared/types';

export type { Message, Conversation };

export interface ExplanationResponse {
  purpose: string;
  importance: string;
  tips: string[];
  recommendation?: string;
  examples?: string[];
  prosAndCons?: { option: string; pros: string[]; cons: string[] }[];
  answerAnalysis?: {
    option: string;
    explanation: string;
    pros: string[];
    cons: string[];
    recommendation: string;
  }[];
}

export function useWizard(projectId: string, documentType: 'PROBLEM_DEFINITION' | 'BRD' | 'PRD') {
  const utils = trpc.useUtils();

  // Mutation: Ask next question
  const askQuestion = trpc.ai.askQuestion.useMutation({
    onSuccess: () => {
      utils.conversations.getByProject.invalidate({ projectId, documentType });
    },
  });

  // Mutation: Generate document
  const generateDocument = trpc.ai.generateDocument.useMutation({
    onSuccess: () => {
      utils.documents.getByProjectId.invalidate({ projectId });
      utils.projects.getById.invalidate({ id: projectId });
    },
  });

  return {
    askQuestion: askQuestion.mutate,
    askQuestionAsync: askQuestion.mutateAsync,
    isAskingQuestion: askQuestion.isPending,
    questionError: askQuestion.error,
    generateDocument: generateDocument.mutate,
    generateDocumentAsync: generateDocument.mutateAsync,
    isGenerating: generateDocument.isPending,
    generateError: generateDocument.error,
  };
}

export function useConversation(projectId: string, documentType: 'PROBLEM_DEFINITION' | 'BRD' | 'PRD' | 'TASKS') {
  const utils = trpc.useUtils();

  // Query: Get conversation
  const conversationQuery = trpc.conversations.getByProject.useQuery({
    projectId,
    documentType,
  });

  // Mutation: Add message
  const addMessage = trpc.conversations.addMessage.useMutation({
    onSuccess: () => {
      utils.conversations.getByProject.invalidate({ projectId, documentType });
    },
  });

  // Mutation: Clear conversation
  const clearConversation = trpc.conversations.clear.useMutation({
    onSuccess: () => {
      utils.conversations.getByProject.invalidate({ projectId, documentType });
    },
  });

  // Extract data with proper types
  const conversation = conversationQuery.data as Conversation | undefined;
  const messages = (conversation?.messages || []) as Message[];

  return {
    conversation,
    messages,
    isLoading: conversationQuery.isLoading,
    error: conversationQuery.error,
    addMessage: addMessage.mutate,
    addMessageAsync: addMessage.mutateAsync,
    isAddingMessage: addMessage.isPending,
    clearConversation: clearConversation.mutate,
    clearConversationAsync: clearConversation.mutateAsync,
    isClearing: clearConversation.isPending,
  };
}

/**
 * Hook for getting AI-generated explanations for wizard questions
 */
export function useQuestionExplanation() {
  const explainMutation = trpc.ai.explainQuestion.useMutation();

  return {
    explain: explainMutation.mutate,
    explainAsync: explainMutation.mutateAsync,
    isExplaining: explainMutation.isPending,
    explanation: explainMutation.data,
    error: explainMutation.error,
    reset: explainMutation.reset,
  };
}

export interface ExampleAnswer {
  id: string;
  label: string;
  answer: string;
  rationale?: string;
}

export interface ExampleAnswersResponse {
  examples: ExampleAnswer[];
}

/**
 * Hook for getting AI-suggested example answers for the current wizard question.
 * Mirrors useQuestionExplanation; the procedure is rate-limited indirectly via
 * protected-procedure auth + a server-side LRU cache.
 */
export function useExampleAnswers() {
  const suggestMutation = trpc.ai.suggestExampleAnswers.useMutation();

  return {
    suggest: suggestMutation.mutate,
    suggestAsync: suggestMutation.mutateAsync,
    isSuggesting: suggestMutation.isPending,
    suggestions: suggestMutation.data as ExampleAnswersResponse | undefined,
    error: suggestMutation.error,
    reset: suggestMutation.reset,
  };
}

