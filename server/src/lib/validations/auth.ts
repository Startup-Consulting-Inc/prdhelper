/**
 * Authentication Validation Schemas
 * 
 * Zod schemas for validating authentication-related inputs.
 */

import { z } from 'zod';

/**
 * Email validation
 */
const emailSchema = z.string().email('Invalid email address');

/**
 * Password validation with complexity requirements
 */
const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(100, 'Password must not exceed 100 characters')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(
    /[!@#$%^&*(),.?":{}|<>]/,
    'Password must contain at least one special character'
  );

/**
 * Sign up schema
 */
export const signUpSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must not exceed 100 characters'),
  email: emailSchema,
  password: passwordSchema,
  modePreference: z.enum(['PLAIN', 'TECHNICAL'], {
    message: 'Invalid mode preference',
  }),
});

/**
 * Login schema
 */
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

/**
 * URL validation helper
 */
const urlSchema = z
  .string()
  .url('Invalid URL format')
  .optional()
  .or(z.literal(''));

/**
 * LinkedIn URL validation
 */
const linkedInUrlSchema = z
  .string()
  .url('Invalid LinkedIn URL')
  .refine(
    (url) => url === '' || url.includes('linkedin.com'),
    'Must be a valid LinkedIn URL'
  )
  .optional()
  .or(z.literal(''));

/**
 * GitHub URL validation
 */
const githubUrlSchema = z
  .string()
  .url('Invalid GitHub URL')
  .refine(
    (url) => url === '' || url.includes('github.com'),
    'Must be a valid GitHub URL'
  )
  .optional()
  .or(z.literal(''));

/**
 * Update profile schema
 */
export const updateProfileSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must not exceed 100 characters')
    .optional(),
  modePreference: z.enum(['PLAIN', 'TECHNICAL']).optional(),
  bio: z
    .string()
    .max(500, 'Bio must not exceed 500 characters')
    .optional()
    .or(z.literal('')),
  company: z
    .string()
    .max(100, 'Company name must not exceed 100 characters')
    .optional()
    .or(z.literal('')),
  jobTitle: z
    .string()
    .max(100, 'Job title must not exceed 100 characters')
    .optional()
    .or(z.literal('')),
  linkedInUrl: linkedInUrlSchema,
  websiteUrl: urlSchema,
  location: z
    .string()
    .min(2, 'Location must be at least 2 characters')
    .max(100, 'Location must not exceed 100 characters')
    .optional()
    .or(z.literal('')),
  githubUrl: githubUrlSchema,
});

/**
 * Change password schema
 */
export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: passwordSchema,
});

export type SignUpInput = z.infer<typeof signUpSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;

