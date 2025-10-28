/**
 * Document Validation Schemas
 * 
 * Zod schemas for validating document-related inputs.
 */

import { z } from 'zod';

/**
 * Document type enum
 */
export const documentTypeSchema = z.enum(['BRD', 'PRD', 'TASKS']);

/**
 * Get document by ID schema
 */
export const getDocumentByIdSchema = z.object({
  id: z.string().cuid('Invalid document ID'),
});

/**
 * Get documents by project ID schema
 */
export const getDocumentsByProjectSchema = z.object({
  projectId: z.string().cuid('Invalid project ID'),
  type: documentTypeSchema.optional(),
});

/**
 * Create document schema
 */
export const createDocumentSchema = z.object({
  projectId: z.string().cuid('Invalid project ID'),
  type: documentTypeSchema,
  content: z.string().min(1, 'Content is required'),
  rawContent: z.string().min(1, 'Raw content is required'),
});

/**
 * Approve document schema
 */
export const approveDocumentSchema = z.object({
  id: z.string().cuid('Invalid document ID'),
});

/**
 * Regenerate document schema
 */
export const regenerateDocumentSchema = z.object({
  id: z.string().cuid('Invalid document ID'),
  additionalContext: z
    .string()
    .min(20, 'Additional context must be at least 20 characters')
    .max(1000, 'Additional context must not exceed 1000 characters'),
});

/**
 * Export document schema
 */
export const exportDocumentSchema = z.object({
  id: z.string().cuid('Invalid document ID'),
  format: z.enum(['md', 'pdf']),
});

export type DocumentType = z.infer<typeof documentTypeSchema>;
export type GetDocumentByIdInput = z.infer<typeof getDocumentByIdSchema>;
export type GetDocumentsByProjectInput = z.infer<
  typeof getDocumentsByProjectSchema
>;
export type CreateDocumentInput = z.infer<typeof createDocumentSchema>;
export type ApproveDocumentInput = z.infer<typeof approveDocumentSchema>;
export type RegenerateDocumentInput = z.infer<typeof regenerateDocumentSchema>;
export type ExportDocumentInput = z.infer<typeof exportDocumentSchema>;

