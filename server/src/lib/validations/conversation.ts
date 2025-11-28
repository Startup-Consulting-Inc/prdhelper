/**
 * Conversation Validation Schemas
 * 
 * Zod schemas for validating conversation-related inputs.
 */

import { z } from 'zod';
import { documentTypeSchema } from './document.js';

/**
 * Message role enum
 */
export const messageRoleSchema = z.enum(['user', 'assistant', 'system']);

/**
 * Message schema
 */
export const messageSchema = z.object({
  role: messageRoleSchema,
  content: z.string().min(1, 'Content is required'),
  timestamp: z.string().datetime(),
});

/**
 * Get conversation by project schema
 */
export const getConversationByProjectSchema = z.object({
  projectId: z.string().min(1, 'Invalid project ID'),
  documentType: documentTypeSchema,
});

/**
 * Add message schema
 */
export const addMessageSchema = z.object({
  projectId: z.string().min(1, 'Invalid project ID'),
  documentType: documentTypeSchema,
  role: messageRoleSchema,
  content: z
    .string()
    .min(1, 'Content is required')
    .max(5000, 'Content must not exceed 5000 characters'),
});

/**
 * Update message schema
 */
export const updateMessageSchema = z.object({
  conversationId: z.string().min(1, 'Invalid conversation ID'),
  messageIndex: z.number().int().min(0),
  content: z
    .string()
    .min(1, 'Content is required')
    .max(5000, 'Content must not exceed 5000 characters'),
});

/**
 * Clear conversation schema
 */
export const clearConversationSchema = z.object({
  projectId: z.string().min(1, 'Invalid project ID'),
  documentType: documentTypeSchema,
});

export type MessageRole = z.infer<typeof messageRoleSchema>;
export type Message = z.infer<typeof messageSchema>;
export type GetConversationByProjectInput = z.infer<
  typeof getConversationByProjectSchema
>;
export type AddMessageInput = z.infer<typeof addMessageSchema>;
export type UpdateMessageInput = z.infer<typeof updateMessageSchema>;
export type ClearConversationInput = z.infer<typeof clearConversationSchema>;

