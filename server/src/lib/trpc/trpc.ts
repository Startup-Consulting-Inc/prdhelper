/**
 * tRPC Initialization
 * 
 * Defines base tRPC router and procedure helpers with authentication middleware.
 */

import { initTRPC, TRPCError } from '@trpc/server';
import type { AppContext } from './context.js';

/**
 * Initialize tRPC with context
 */
const t = initTRPC.context<AppContext>().create({
  errorFormatter({ shape }) {
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

/**
 * Export type definitions for client
 */
export type Router = typeof router;
export type Procedure = typeof publicProcedure;

