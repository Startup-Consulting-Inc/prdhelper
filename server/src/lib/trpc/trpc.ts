/**
 * tRPC Initialization
 * 
 * Defines base tRPC router and procedure helpers with authentication middleware.
 */

import { initTRPC, TRPCError } from '@trpc/server';
import type { AppContext } from './context.js';
import { checkAndIncrement } from '../utils/aiRateLimit.js';
import { logger } from '../logger.js';

/**
 * Initialize tRPC with context
 */
const t = initTRPC.context<AppContext>().create({
  errorFormatter({ shape, error }) {
    // Log errors to console in development
    if (process.env.NODE_ENV !== 'production') {
      console.error('tRPC Error:', error);
    }
    return shape;
  },
});

/**
 * Base router builder
 */
export const router = t.router;

/**
 * Public procedure - accessible without authentication
 */
export const publicProcedure = t.procedure;

/**
 * Authentication middleware
 * Throws UNAUTHORIZED error if user is not authenticated
 */
const isAuthenticated = t.middleware(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'You must be logged in to access this resource',
    });
  }

  return next({
    ctx: {
      // Infer user as non-nullable in protected procedures
      ...ctx,
      user: ctx.user,
    },
  });
});

/**
 * Protected procedure - requires authentication
 * User is guaranteed to be non-null in the context
 */
export const protectedProcedure = t.procedure.use(isAuthenticated);

/**
 * Admin middleware
 * Throws FORBIDDEN error if user is not an admin
 */
const isAdmin = t.middleware(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'You must be logged in to access this resource',
    });
  }

  if (ctx.user.role !== 'ADMIN') {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'You must be an admin to access this resource',
    });
  }

  return next({
    ctx: {
      ...ctx,
      user: ctx.user,
    },
  });
});

/**
 * Admin procedure - requires admin role
 */
export const adminProcedure = t.procedure.use(isAdmin);

type AiOperation = 'ask' | 'generate' | 'regenerate';

export function createAiRateLimitMiddleware(
  operation: AiOperation,
  limitPerHour: number
) {
  return t.middleware(async ({ ctx, next }) => {
    if (!ctx.user) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'You must be logged in to access this resource',
      });
    }

    try {
      checkAndIncrement(ctx.user.id, operation, limitPerHour);
    } catch (err) {
      logger.warn(
        { userId: ctx.user.id, operation, type: 'ai_rate_limit' },
        'AI rate limit exceeded'
      );
      throw new TRPCError({
        code: 'TOO_MANY_REQUESTS',
        message: err instanceof Error ? err.message : 'Too many AI requests. Please wait.',
      });
    }

    return next({
      ctx: {
        ...ctx,
        user: ctx.user,
      },
    });
  });
}

/** askQuestion: 60 requests/hour per user */
export const aiAskProcedure = protectedProcedure.use(
  createAiRateLimitMiddleware('ask', 60)
);

/** generateDocument: 10 requests/hour per user */
export const aiGenerateProcedure = protectedProcedure.use(
  createAiRateLimitMiddleware('generate', 10)
);

/** regenerateDocument: 10 requests/hour per user */
export const aiRegenerateProcedure = protectedProcedure.use(
  createAiRateLimitMiddleware('regenerate', 10)
);

/**
 * Export type definitions for client
 */
export type Router = typeof router;
export type Procedure = typeof publicProcedure;

