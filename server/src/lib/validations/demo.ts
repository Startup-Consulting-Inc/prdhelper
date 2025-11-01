/**
 * Demo Request Validation Schemas
 *
 * Zod schemas for validating demo scheduling form inputs.
 */

import { z } from 'zod';

/**
 * Schema for scheduling a demo request
 */
export const scheduleDemoSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters')
    .trim(),
  email: z.string().email('Please enter a valid email address').trim().toLowerCase(),
  company: z
    .string()
    .max(200, 'Company name must be less than 200 characters')
    .trim()
    .optional()
    .or(z.literal('')),
  message: z
    .string()
    .max(1000, 'Message must be less than 1000 characters')
    .trim()
    .optional()
    .or(z.literal('')),
});

export type ScheduleDemoInput = z.infer<typeof scheduleDemoSchema>;
