/**
 * Authentication Utilities
 *
 * Provides JWT token generation, verification, and password hashing utilities.
 *
 * SECURITY: JWT_SECRET must be configured in environment variables.
 * The application will fail to start if this is not set.
 */

import jwt from 'jsonwebtoken';
import { hash, compare } from 'bcryptjs';
import type { User } from '../lib/trpc/context.js';
import { logger } from './logger.js';

// JWT Configuration - Optional since Firebase Auth is primary
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// Warn if JWT_SECRET is not set (Firebase Auth is now primary)
if (!JWT_SECRET) {
  logger.warn('JWT_SECRET environment variable is not set - legacy JWT authentication disabled');
}

// Token payload interface
export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}

/**
 * Generate JWT token for authenticated user
 * Note: Consider using Firebase Auth tokens instead
 */
export function generateToken(user: User): string {
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is required to generate tokens - use Firebase Auth instead');
  }
  
  const payload: TokenPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN as string,
  } as jwt.SignOptions);
}

/**
 * Verify JWT token and return payload
 * Note: Consider using Firebase Auth token verification instead
 */
export function verifyToken(token: string): TokenPayload | null {
  if (!JWT_SECRET) {
    logger.warn('JWT_SECRET not set - cannot verify legacy JWT tokens');
    return null;
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
    return decoded;
  } catch (error) {
    logger.warn({ err: error }, 'Token verification failed');
    return null;
  }
}

/**
 * Hash password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  return hash(password, 10);
}

/**
 * Compare password with hashed password
 */
export async function comparePassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return compare(password, hashedPassword);
}

/**
 * Extract token from Authorization header
 */
export function extractTokenFromHeader(authHeader?: string): string | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
}

