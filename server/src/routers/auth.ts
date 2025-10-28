/**
 * Authentication Router
 * 
 * tRPC router for authentication operations:
 * - Sign up
 * - Login
 * - Update profile
 * - Change password
 * - Delete account
 */

import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { router, publicProcedure, protectedProcedure } from '../lib/trpc/trpc.js';
import {
  signUpSchema,
  loginSchema,
  updateProfileSchema,
  changePasswordSchema,
} from '../lib/validations/auth.js';
import {
  generateToken,
  hashPassword,
  comparePassword,
} from '../lib/auth.js';

export const authRouter = router({
  /**
   * Sign up a new user
   */
  signUp: publicProcedure
    .input(signUpSchema)
    .mutation(async ({ ctx, input }) => {
      // Check if user already exists
      const existingUser = await ctx.prisma.user.findUnique({
        where: { email: input.email },
      });

      if (existingUser) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'Email already registered',
        });
      }

      // Hash password
      const hashedPassword = await hashPassword(input.password);

      // Create user
      const user = await ctx.prisma.user.create({
        data: {
          name: input.name,
          email: input.email,
          password: hashedPassword,
          modePreference: input.modePreference,
          emailVerified: new Date(), // Auto-verify for now
        },
      });

      // Generate JWT token
      const token = generateToken(user);

      // Create audit log
      await ctx.prisma.auditLog.create({
        data: {
          userId: user.id,
          action: 'USER_SIGNED_UP',
          details: {
            email: user.email,
            name: user.name,
            modePreference: user.modePreference,
          },
          ipAddress: ctx.req.ip || ctx.req.socket.remoteAddress || null,
        },
      });

      return {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          modePreference: user.modePreference,
          createdAt: user.createdAt,
        },
        token,
      };
    }),

  /**
   * Login user
   */
  login: publicProcedure
    .input(loginSchema)
    .mutation(async ({ ctx, input }) => {
      // Find user by email
      const user = await ctx.prisma.user.findUnique({
        where: { email: input.email },
      });

      if (!user || !user.password) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Invalid email or password',
        });
      }

      // Verify password
      const isValidPassword = await comparePassword(input.password, user.password);

      if (!isValidPassword) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Invalid email or password',
        });
      }

      // Generate JWT token
      const token = generateToken(user);

      // Create audit log
      await ctx.prisma.auditLog.create({
        data: {
          userId: user.id,
          action: 'USER_LOGGED_IN',
          details: {
            email: user.email,
          },
          ipAddress: ctx.req.ip || ctx.req.socket.remoteAddress || null,
        },
      });

      return {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          modePreference: user.modePreference,
          createdAt: user.createdAt,
        },
        token,
      };
    }),

  /**
   * Get current user profile
   */
  me: protectedProcedure.query(async ({ ctx }) => {
    return {
      id: ctx.user.id,
      name: ctx.user.name,
      email: ctx.user.email,
      role: ctx.user.role,
      modePreference: ctx.user.modePreference,
      createdAt: ctx.user.createdAt,
    };
  }),

  /**
   * Update user profile
   */
  updateProfile: protectedProcedure
    .input(updateProfileSchema)
    .mutation(async ({ ctx, input }) => {
      const updatedUser = await ctx.prisma.user.update({
        where: { id: ctx.user.id },
        data: {
          ...(input.name && { name: input.name }),
          ...(input.modePreference && { modePreference: input.modePreference }),
        },
      });

      // Create audit log
      await ctx.prisma.auditLog.create({
        data: {
          userId: ctx.user.id,
          action: 'USER_UPDATED_PROFILE',
          details: input,
          ipAddress: ctx.req.ip || ctx.req.socket.remoteAddress || null,
        },
      });

      return {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        modePreference: updatedUser.modePreference,
        createdAt: updatedUser.createdAt,
      };
    }),

  /**
   * Change password
   */
  changePassword: protectedProcedure
    .input(changePasswordSchema)
    .mutation(async ({ ctx, input }) => {
      // Verify current password
      if (!ctx.user.password) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Cannot change password for OAuth users',
        });
      }

      const isValidPassword = await comparePassword(
        input.currentPassword,
        ctx.user.password
      );

      if (!isValidPassword) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Current password is incorrect',
        });
      }

      // Hash new password
      const hashedPassword = await hashPassword(input.newPassword);

      // Update password
      await ctx.prisma.user.update({
        where: { id: ctx.user.id },
        data: { password: hashedPassword },
      });

      // Create audit log
      await ctx.prisma.auditLog.create({
        data: {
          userId: ctx.user.id,
          action: 'USER_CHANGED_PASSWORD',
          details: {
            email: ctx.user.email,
          },
          ipAddress: ctx.req.ip || ctx.req.socket.remoteAddress || null,
        },
      });

      return { success: true, message: 'Password changed successfully' };
    }),

  /**
   * Delete account (soft delete - archives projects)
   */
  deleteAccount: protectedProcedure.mutation(async ({ ctx }) => {
    // Archive all user projects
    await ctx.prisma.project.updateMany({
      where: { userId: ctx.user.id },
      data: { status: 'ARCHIVED' },
    });

    // Delete sessions
    await ctx.prisma.session.deleteMany({
      where: { userId: ctx.user.id },
    });

    // Mark user as deleted (soft delete)
    await ctx.prisma.user.update({
      where: { id: ctx.user.id },
      data: {
        email: `deleted_${ctx.user.id}@deleted.com`,
        name: 'Deleted User',
        password: null,
      },
    });

    // Create audit log
    await ctx.prisma.auditLog.create({
      data: {
        userId: ctx.user.id,
        action: 'USER_DELETED_ACCOUNT',
        details: {
          originalEmail: ctx.user.email,
        },
        ipAddress: ctx.req.ip || ctx.req.socket.remoteAddress || null,
      },
    });

    return { success: true, message: 'Account deleted successfully' };
  }),

  /**
   * Google OAuth Callback
   *
   * Handles Google OAuth callback and returns JWT token
   */
  googleCallback: publicProcedure
    .input(z.object({
      code: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      // This will be called from the frontend after Google redirects back
      // For now, we'll use Express routes to handle the actual OAuth flow
      // This endpoint is for future direct tRPC integration if needed
      throw new TRPCError({
        code: 'NOT_IMPLEMENTED',
        message: 'Use Express OAuth routes at /api/auth/google',
      });
    }),
});

