/**
 * Contact Form Validation Schemas
 *
 * Zod schemas for validating contact/inquiry form inputs.
 * Supports multiple inquiry types: General, Question, Bug Report, Demo, Feature Request, Other
 */

import { z } from 'zod';

/**
 * Inquiry type enum matching Prisma schema
 */
export const InquiryTypeEnum = z.enum([
  'GENERAL',
  'QUESTION',
  'BUG_REPORT',
  'DEMO',
  'FEATURE_REQUEST',
  'OTHER',
]);

export type InquiryType = z.infer<typeof InquiryTypeEnum>;

/**
 * Attachment metadata schema
 */
export const attachmentSchema = z.object({
  url: z.string().url('Invalid attachment URL'),
  filename: z.string().min(1, 'Filename is required'),
  mimetype: z.string().min(1, 'MIME type is required'),
  size: z.number().int().positive('File size must be positive'),
});

export type AttachmentMetadata = z.infer<typeof attachmentSchema>;

/**
 * Schema for submitting a contact/inquiry request
 */
export const submitContactSchema = z.object({
  inquiryType: InquiryTypeEnum.default('GENERAL'),
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
  role: z
    .string()
    .max(100, 'Role must be less than 100 characters')
    .trim()
    .optional()
    .or(z.literal('')),
  teamSize: z
    .string()
    .max(50, 'Team size must be less than 50 characters')
    .trim()
    .optional()
    .or(z.literal('')),
  subject: z
    .string()
    .max(200, 'Subject must be less than 200 characters')
    .trim()
    .optional()
    .or(z.literal('')),
  message: z
    .string()
    .max(2000, 'Message must be less than 2000 characters')
    .trim()
    .optional()
    .or(z.literal('')),
  attachments: z
    .array(attachmentSchema)
    .max(5, 'Maximum 5 attachments allowed')
    .optional(),
});

export type SubmitContactInput = z.infer<typeof submitContactSchema>;

/**
 * Legacy schema for backward compatibility (demo requests)
 * Maps to DEMO inquiry type
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
  role: z
    .string()
    .max(100, 'Role must be less than 100 characters')
    .trim()
    .optional()
    .or(z.literal('')),
  teamSize: z
    .string()
    .max(50, 'Team size must be less than 50 characters')
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
