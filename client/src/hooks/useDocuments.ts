/**
 * Documents Hook
 * 
 * Custom hook for document operations with tRPC.
 */

import { trpc } from '../lib/trpc';

export function useDocuments(projectId: string, type?: 'BRD' | 'PRD' | 'PROMPT_BUILD' | 'TASKS') {
  const utils = trpc.useUtils();

  // Query: Get documents by project
  const {
    data: documents,
    isLoading,
    error,
  } = trpc.documents.getByProjectId.useQuery({
    projectId,
    ...(type && { type }),
  });

  // Mutation: Approve document
  const approveDocument = trpc.documents.approve.useMutation({
    onSuccess: () => {
      utils.documents.getByProjectId.invalidate({ projectId });
      utils.projects.getById.invalidate({ id: projectId });
    },
  });

  return {
    documents: documents || [],
    isLoading,
    error,
    approveDocument: approveDocument.mutate,
    approveDocumentAsync: approveDocument.mutateAsync,
    isApproving: approveDocument.isPending,
  };
}

export function useDocument(documentId: string, projectId?: string) {
  const { data: document, isLoading, error } = trpc.documents.getById.useQuery({
    id: documentId,
    ...(projectId && { projectId }),
  });

  return {
    document,
    isLoading,
    error,
  };
}

export function useExportDocument() {
  const exportDocument = trpc.documents.exportDocument.useQuery;

  return {
    exportDocument,
  };
}

