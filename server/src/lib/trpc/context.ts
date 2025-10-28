/**
 * tRPC Context
 * 
 * Creates the context object that is available in all tRPC procedures.
 * Includes database client and authenticated user information.
 */

import type { Request, Response } from 'express';
import type { User } from '@prisma/client';
import { prisma } from '../db.js';
import { extractTokenFromHeader, verifyToken } from '../auth.js';

/**
 * Context interface available in all tRPC procedures
 */
export interface Context {
  prisma: typeof prisma;
  user: User | null;
  req: Request;
  res: Response;
}

/**
 * Create context for each request
 * Extracts and verifies JWT token, fetches user from database
 */
export async function createContext({
  req,
  res,
}: {
  req: Request;
  res: Response;
}): Promise<Context> {
  // Extract token from Authorization header
  const token = extractTokenFromHeader(req.headers.authorization);

  let user: User | null = null;

  if (token) {
    try {
      const payload = verifyToken(token);
      
      if (payload) {
        // Fetch full user from database
        user = await prisma.user.findUnique({
          where: { id: payload.userId },
        });
      }
    } catch (error) {
      // Token verification failed, user remains null
      console.error('Token verification error:', error);
    }
  }

  return {
    prisma,
    user,
    req,
    res,
  };
}

export type AppContext = Awaited<ReturnType<typeof createContext>>;

