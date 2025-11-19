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
import {
  sendVerificationEmail,
  sendVerificationReminderEmail,
} from '../lib/email.js';
import {
  generateVerificationToken,
  getTokenExpiration,
  isTokenExpired,
} from '../lib/tokens.js';

export const authRouter = router({
  /**
   * Sign up a new user
   * Email verification is required before login
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

      // Generate verification token
      const verificationToken = generateVerificationToken();
      const tokenExpiration = getTokenExpiration();

      // Create user without email verification
      const user = await ctx.prisma.user.create({
        data: {
          name: input.name,
          email: input.email,
          password: hashedPassword,
          modePreference: input.modePreference,
          emailVerified: null, // User must verify email before login
        },
      });

      // Store verification token
      await ctx.prisma.verificationToken.create({
        data: {
          identifier: user.email,
          token: verificationToken,
          expires: tokenExpiration,
        },
      });

      // Send verification email
      try {
        await sendVerificationEmail(user.email, user.name, verificationToken);
      } catch (error) {
        console.error('Failed to send verification email:', error);
        // Rollback user creation if email fails
        await ctx.prisma.user.delete({ where: { id: user.id } });
        await ctx.prisma.verificationToken.deleteMany({
          where: { identifier: user.email },
        });
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to send verification email. Please try again later.',
        });
      }

      // Create audit log
      await ctx.prisma.auditLog.create({
        data: {
          userId: user.id,
          action: 'USER_SIGNED_UP',
          details: {
            email: user.email,
            name: user.name,
            modePreference: user.modePreference,
            emailVerificationSent: true,
          },
          ipAddress: ctx.req.ip || ctx.req.socket.remoteAddress || null,
        },
      });

      // Do NOT return token - user must verify email first
      return {
        success: true,
        message: 'Account created! Please check your email to verify your account.',
        email: user.email,
      };
    }),

  /**
   * Login user
   * Requires email verification before allowing login
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

      // Check if email is verified
      if (!user.emailVerified) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Please verify your email address before logging in. Check your inbox for the verification link.',
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
   * Verify email address using token from email
   */
  verifyEmail: publicProcedure
    .input(z.object({ token: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Find verification token
      const verificationToken = await ctx.prisma.verificationToken.findUnique({
        where: { token: input.token },
      });

      if (!verificationToken) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Invalid or expired verification token',
        });
      }

      // Check if token is expired
      if (isTokenExpired(verificationToken.expires)) {
        // Delete expired token
        await ctx.prisma.verificationToken.delete({
          where: { token: input.token },
        });
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Verification token has expired. Please request a new one.',
        });
      }

      // Find user by email
      const user = await ctx.prisma.user.findUnique({
        where: { email: verificationToken.identifier },
      });

      if (!user) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'User not found',
        });
      }

      // Check if already verified
      if (user.emailVerified) {
        // Delete token and return success anyway
        await ctx.prisma.verificationToken.delete({
          where: { token: input.token },
        });
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Email is already verified. You can log in now.',
        });
      }

      // Update user email verification status
      const updatedUser = await ctx.prisma.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      });

      // Delete used verification token
      await ctx.prisma.verificationToken.delete({
        where: { token: input.token },
      });

      // Generate JWT token for automatic login
      const authToken = generateToken(updatedUser);

      // Create audit log
      await ctx.prisma.auditLog.create({
        data: {
          userId: updatedUser.id,
          action: 'USER_VERIFIED_EMAIL',
          details: {
            email: updatedUser.email,
          },
          ipAddress: ctx.req.ip || ctx.req.socket.remoteAddress || null,
        },
      });

      return {
        success: true,
        message: 'Email verified successfully! You can now log in.',
        token: authToken,
        user: {
          id: updatedUser.id,
          name: updatedUser.name,
          email: updatedUser.email,
          role: updatedUser.role,
          modePreference: updatedUser.modePreference,
          createdAt: updatedUser.createdAt,
        },
      };
    }),

  /**
   * Resend verification email
   */
  resendVerification: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .mutation(async ({ ctx, input }) => {
      // Find user
      const user = await ctx.prisma.user.findUnique({
        where: { email: input.email },
      });

      if (!user) {
        // Don't reveal that user doesn't exist for security
        return {
          success: true,
          message: 'If an account exists with this email, a verification link has been sent.',
        };
      }

      // Check if already verified
      if (user.emailVerified) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Email is already verified. You can log in now.',
        });
      }

      // Delete any existing tokens for this email
      await ctx.prisma.verificationToken.deleteMany({
        where: { identifier: user.email },
      });

      // Generate new verification token
      const verificationToken = generateVerificationToken();
      const tokenExpiration = getTokenExpiration();

      // Store new verification token
      await ctx.prisma.verificationToken.create({
        data: {
          identifier: user.email,
          token: verificationToken,
          expires: tokenExpiration,
        },
      });

      // Send verification reminder email
      try {
        await sendVerificationReminderEmail(user.email, user.name, verificationToken);
      } catch (error) {
        console.error('Failed to send verification reminder email:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to send verification email. Please try again later.',
        });
      }

      // Create audit log
      await ctx.prisma.auditLog.create({
        data: {
          userId: user.id,
          action: 'USER_RESENT_VERIFICATION',
          details: {
            email: user.email,
          },
          ipAddress: ctx.req.ip || ctx.req.socket.remoteAddress || null,
        },
      });

      return {
        success: true,
        message: 'Verification email has been resent. Please check your inbox.',
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
      image: ctx.user.image,
      bio: ctx.user.bio,
      company: ctx.user.company,
      jobTitle: ctx.user.jobTitle,
      linkedInUrl: ctx.user.linkedInUrl,
      websiteUrl: ctx.user.websiteUrl,
      location: ctx.user.location,
      githubUrl: ctx.user.githubUrl,
      createdAt: ctx.user.createdAt,
    };
  }),

  /**
   * Update user profile
   */
  updateProfile: protectedProcedure
    .input(updateProfileSchema)
    .mutation(async ({ ctx, input }) => {
      // Prepare update data - convert empty strings to null
      const updateData: any = {};
      if (input.name !== undefined) updateData.name = input.name;
      if (input.modePreference !== undefined) updateData.modePreference = input.modePreference;
      if (input.bio !== undefined) updateData.bio = input.bio === '' ? null : input.bio;
      if (input.company !== undefined) updateData.company = input.company === '' ? null : input.company;
      if (input.jobTitle !== undefined) updateData.jobTitle = input.jobTitle === '' ? null : input.jobTitle;
      if (input.linkedInUrl !== undefined) updateData.linkedInUrl = input.linkedInUrl === '' ? null : input.linkedInUrl;
      if (input.websiteUrl !== undefined) updateData.websiteUrl = input.websiteUrl === '' ? null : input.websiteUrl;
      if (input.location !== undefined) updateData.location = input.location === '' ? null : input.location;
      if (input.githubUrl !== undefined) updateData.githubUrl = input.githubUrl === '' ? null : input.githubUrl;

      const updatedUser = await ctx.prisma.user.update({
        where: { id: ctx.user.id },
        data: updateData,
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
        image: updatedUser.image,
        bio: updatedUser.bio,
        company: updatedUser.company,
        jobTitle: updatedUser.jobTitle,
        linkedInUrl: updatedUser.linkedInUrl,
        websiteUrl: updatedUser.websiteUrl,
        location: updatedUser.location,
        githubUrl: updatedUser.githubUrl,
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

