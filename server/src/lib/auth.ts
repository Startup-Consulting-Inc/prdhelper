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
import type { User } from '@prisma/client';
import { logger } from './logger.js';

// JWT Configuration - No fallback for security
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// Validate JWT_SECRET exists on module load
if (!JWT_SECRET) {
  logger.fatal('JWT_SECRET environment variable is not set');
  throw new Error('JWT_SECRET environment variable is required for security');
}

// Token payload interface
export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}

/**
 * Generate JWT token for authenticated user
 */
export function generateToken(user: User): string {
  const payload: TokenPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };

  return jwt.sign(payload, JWT_SECRET!, {
    expiresIn: JWT_EXPIRES_IN as string,
  } as jwt.SignOptions);
}

/**
 * Verify JWT token and return payload
 */
export function verifyToken(token: string): TokenPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET!) as TokenPayload;
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

