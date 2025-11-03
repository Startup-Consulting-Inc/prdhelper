/**
 * Shared Type Definitions
 * 
 * Common TypeScript interfaces and types used across frontend and backend.
 * Provides type safety for API responses and shared data structures.
 * 
 * Recent Changes:
 * - [2025-10-27] FEAT: Added shared type definitions for API responses
 */

// Shared types between frontend and backend

export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  message?: string;
}

export interface HealthResponse {
  status: 'ok' | 'error';
  timestamp: string;
}

// Email Verification Types
export interface VerifyEmailResponse {
  success: boolean;
  message: string;
  token?: string; // JWT token returned after successful verification
  user?: {
    id: string;
    email: string;
    name: string;
    emailVerified: boolean;
  };
}

export interface ResendVerificationResponse {
  success: boolean;
  message: string;
}

export interface SignUpResponse {
  success: boolean;
  message: string;
  email: string; // Return email for displaying in verification pending page
}
