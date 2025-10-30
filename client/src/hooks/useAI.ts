/**
 * AI Hook
 *
 * Custom hook for AI-powered operations with tRPC.
 */

import { trpc } from '../lib/trpc';

// Type definitions
export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date | string;
}

export interface Conversation {
  id: string;
  projectId: string;
  documentType: 'BRD' | 'PRD' | 'TASKS';
  messages: Message[];
  createdAt: Date | string;
  updatedAt: Date | string;
}

export function useWizard(projectId: string, documentType: 'BRD' | 'PRD') {
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

export function useConversation(projectId: string, documentType: 'BRD' | 'PRD' | 'TASKS') {
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

