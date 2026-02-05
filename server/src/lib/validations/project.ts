/**
 * Project Validation Schemas
 * 
 * Zod schemas for validating project-related inputs.
 */

import { z } from 'zod';

/**
 * Create project schema
 */
export const createProjectSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(200, 'Title must not exceed 200 characters'),
  description: z
    .string()
    .min(20, 'Description must be at least 20 characters')
    .max(2000, 'Description must not exceed 2000 characters'),
  mode: z.enum(['PLAIN', 'TECHNICAL'], {
    message: 'Invalid mode',
  }),
  language: z.enum(['en', 'ko', 'ja', 'zh', 'auto'], {
    message: 'Invalid language selection',
  }).default('auto'),
});

/**
 * Update project schema
 */
export const updateProjectSchema = z.object({
  id: z.string().min(1, 'Invalid project ID'),
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(200, 'Title must not exceed 200 characters')
    .optional(),
  description: z
    .string()
    .min(20, 'Description must be at least 20 characters')
    .max(2000, 'Description must not exceed 2000 characters')
    .optional(),
});

/**
 * Get project by ID schema
 */
export const getProjectByIdSchema = z.object({
  id: z.string().min(1, 'Invalid project ID'),
});

/**
 * Update project phase schema
 */
export const updateProjectPhaseSchema = z.object({
  id: z.string().min(1, 'Invalid project ID'),
  phase: z.enum([
    'BRD_QUESTIONS',
    'BRD_GENERATING',
    'BRD_READY',
    'BRD_APPROVED',
    'PRD_QUESTIONS',
    'PRD_GENERATING',
    'PRD_READY',
    'PRD_APPROVED',
    'TASKS_GENERATING',
    'TASKS_READY',
    'COMPLETED',
  ]),
});

/**
 * Get all projects schema (with filters)
 */
export const getAllProjectsSchema = z.object({
  status: z.enum(['ACTIVE', 'COMPLETED', 'ARCHIVED']).optional(),
  mode: z.enum(['PLAIN', 'TECHNICAL']).optional(),
  limit: z.number().min(1).max(100).default(50).optional(),
  offset: z.number().min(0).default(0).optional(),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
export type GetProjectByIdInput = z.infer<typeof getProjectByIdSchema>;
export type UpdateProjectPhaseInput = z.infer<typeof updateProjectPhaseSchema>;
export type GetAllProjectsInput = z.infer<typeof getAllProjectsSchema>;

