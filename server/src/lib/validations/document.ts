/**
 * Document Validation Schemas
 * 
 * Zod schemas for validating document-related inputs.
 */

import { z } from 'zod';

/**
 * Document type enum
 */
export const documentTypeSchema = z.enum(['BRD', 'PRD', 'PROMPT_BUILD', 'TASKS', 'TOOL_OUTPUT']);

/**
 * Get document by ID schema
 */
export const getDocumentByIdSchema = z.object({
  id: z.string().min(1, 'Invalid document ID'),
});

/**
 * Get documents by project ID schema
 */
export const getDocumentsByProjectSchema = z.object({
  projectId: z.string().min(1, 'Invalid project ID'),
  type: documentTypeSchema.optional(),
});

/**
 * Create document schema
 */
export const createDocumentSchema = z.object({
  projectId: z.string().min(1, 'Invalid project ID'),
  type: documentTypeSchema,
  content: z.string().min(1, 'Content is required'),
  rawContent: z.string().optional(),
});

/**
 * Approve document schema
 */
export const approveDocumentSchema = z.object({
  id: z.string().min(1, 'Invalid document ID'),
});

/**
 * Regenerate document schema
 */
export const regenerateDocumentSchema = z.object({
  id: z.string().min(1, 'Invalid document ID'),
  additionalContext: z
    .string()
    .min(20, 'Additional context must be at least 20 characters')
    .max(1000, 'Additional context must not exceed 1000 characters'),
});

/**
 * Update document schema
 */
export const updateDocumentSchema = z.object({
  id: z.string().min(1, 'Invalid document ID'),
  content: z.string().min(1, 'Content is required'),
});

/**
 * Export document schema
 */
export const exportDocumentSchema = z.object({
  id: z.string().min(1, 'Invalid document ID'),
  format: z.enum(['md', 'pdf']),
});

export type DocumentType = z.infer<typeof documentTypeSchema>;
export type GetDocumentByIdInput = z.infer<typeof getDocumentByIdSchema>;
export type GetDocumentsByProjectInput = z.infer<
  typeof getDocumentsByProjectSchema
>;
export type CreateDocumentInput = z.infer<typeof createDocumentSchema>;
export type ApproveDocumentInput = z.infer<typeof approveDocumentSchema>;
export type UpdateDocumentInput = z.infer<typeof updateDocumentSchema>;
export type RegenerateDocumentInput = z.infer<typeof regenerateDocumentSchema>;
export type ExportDocumentInput = z.infer<typeof exportDocumentSchema>;

